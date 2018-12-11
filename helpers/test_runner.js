/*
 * No NPM? Fine, my own test runner
 */

const color = require("./console_colors");

// TODO: Serialize execution !!!

class TestRunner {
    constructor(testFixtures = []) {
        this.failedTests  = [];
        this.testFixtures = testFixtures.map((FixtureClass) => {
            // testFixtures collection contains Class types of fixtures, create instances of them,
            // and opaque it up with proxy object. Proxy will intercept function calls with name
            // starting as test*. Proxy returns function where test* is wrapped by setUp and
            // tearDown functions.
            let proxy = new Proxy(new FixtureClass, {
                get : function(target, prop, receiver) {
                    // Wrap functions starting with test* to with setUp and tearDown methods, and
                    // bunker with try catches
                    if (typeof target[prop] === "function" && prop.startsWith("test")) {
                        return async function(...argArray) {
                            try {
                                console.log(`${color.FgMagenta} [ Executing ] ${
                                    target.constructor.name}.${prop} ...${color.Reset}`);

                                target.setUp();
                                await target[prop].call(target, ...argArray);

                                console.log(`${color.FgGreen} [ PASS ] ${target.constructor.name}.${
                                    prop} ${color.Reset}`);

                            } catch (err) {
                                let message = `${color.FgRed} [ FAIL ] ${target.constructor.name}.${
                                    prop}, reason: \n\t ${err} ${color.Reset}`
                                console.log(message);

                                // throw new Error(message);

                            } finally {
                                try {
                                    target.tearDown();
                                } catch (err) {
                                    console.log(`${color.FgRed} [ FAIL ] ${
                                        target.constructor.name}.tearDown !!!, reason: \n\t ${
                                        err} ${color.Reset}`);
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

    runAll() {
        this.testFixtures.forEach((fixture) => {
            // Collect properties of Class Type
            let classType = Object.getPrototypeOf(fixture);
            // Sort, because branch prediction, hmm actually should be randomized, whatever
            let props = Object.getOwnPropertyNames(classType).sort();

            console.log(
                `${color.FgMagenta} [ Executing ] ${classType.constructor.name} ${color.Reset}`);

            for (let i = 0; i < props.length; i++) {
                if (typeof classType[props[i]] === "function" && props[i].startsWith("test")) {
                    // Proxy will intercept this call
                    try {
                        fixture[props[i]]();
                    } catch (err) {
                        this.failedTests.push(err.message);
                    }
                }
            }
        });

        // console.log(`${color.FgMagenta} [ Summary ] ${color.Reset}`);

        // if (this.failedTests.length) {
        //     console.log(`${color.FgRed} Failed tests: ${this.failedTests.length}
        //     ${color.Reset}`);

        //     console.log(`${color.FgRed} ${this.failedTests} ${color.Reset}`);
        // } else {
        //     console.log(`${color.FgGreen} [ ALL CLEAN! ] ${color.Reset}`);
        // }
    }
}

module.exports = TestRunner;