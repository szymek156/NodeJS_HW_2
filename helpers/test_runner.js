/*
 * No NPM? Fine, my own test runner
 */

const color = require("./console_colors");

class TestRunner {
    constructor(testFixtures = []) {
        this.failedTests  = [];
        this.testFixtures = testFixtures.map((FixtureClass) => {
            // testFixtures collection contains Class types of fixtures, create instances of them,
            // and opaque it up with proxy object. Proxy will intercept function calls with name
            // starting as test*. Proxy returns function where test* is wrapped by setUp and
            // tearDown functions.
            let proxy = new Proxy(new FixtureClass, {
                get: function(target, prop, receiver) {
                    // Wrap functions starting with test* to with setUp and tearDown methods, and
                    // bunker with try catches
                    if (typeof target[prop] === "function" && prop.startsWith("test")) {
                        // Moved those messagess to cleanup execution flow a little...
                        let executing = `${color.FgMagenta} [ Executing ] ${
                            target.constructor.name}.${prop} ...${color.Reset}`;

                        let pass = `${color.FgGreen} [ PASS ] ${target.constructor.name}.${prop} ${
                            color.Reset}`;

                        let fail = `${color.FgRed} [ FAIL ] ${target.constructor.name}.${prop},`;


                        return async function(...argArray) {
                            try {
                                console.log(executing);

                                target.setUp();
                                await target[prop].call(target, ...argArray);

                                console.log(pass);

                            } catch (err) {
                                let message = fail + ` reason: \n\t ${err} ${color.Reset}`;
                                console.log(message);
                                throw new Error(message);

                            } finally {
                                try {
                                    // No matter the result, clean up after yourself!
                                    target.tearDown();
                                } catch (err) {
                                    let message =
                                        fail + `.tearDown!!!, reason: \n\t ${err} ${color.Reset}`;
                                    console.log(message);
                                    throw new Error(message);
                                }
                            }
                        };
                    } else {
                        return target[prop];
                    }
                }
            });

            return proxy;
        });
    }

    // THIS ASTERISK HERE defines a generator
    * TestGenerator() {
        for (let i = 0; i < this.testFixtures.length; i++) {
            let fixture = this.testFixtures[i];

            // Collect properties of Class Type
            let classType = Object.getPrototypeOf(fixture);
            // Sort, because branch prediction, hmm actually should be randomized, whatever
            let properties = Object.getOwnPropertyNames(classType).sort();

            console.log(
                `${color.FgMagenta}[Executing] ${classType.constructor.name} ${color.Reset}`);

            for (let i = 0; i < properties.length; i++) {
                if (typeof classType[properties[i]] === "function" &&
                    properties[i].startsWith("test")) {
                    yield fixture[properties[i]];
                }
            }
        }
    }

    async runAll() {
        // :)
        process.stdout.write("\x07");

        let testIterator = this.TestGenerator();

        // Thanks to generator + await powers, tests are executing in serialized order,
        // one after another. Keep in mind tests itself has to be called synchronously:
        // setUp()
        // test1()
        // tearDown()
        //
        // setUp()
        // test2()
        // tearDown()
        // ...

        for (let test of testIterator) {
            // Proxy will intercept this call
            try {
                await test();
            } catch (err) {
                this.failedTests.push(err.message);
            }
        }

        console.log(` ${color.FgMagenta}[Summary] ${color.Reset}`);

        if (this.failedTests.length) {
            console.log(` ${color.FgRed} Failed tests: ${this.failedTests.length} ${color.Reset}`);
            console.log(` ${color.FgRed} ${this.failedTests} ${color.Reset}`);
        } else {
            console.log(` ${color.FgGreen}[ALL CLEAN!] ${color.Reset}`);
        }
    }
}

module.exports = TestRunner;