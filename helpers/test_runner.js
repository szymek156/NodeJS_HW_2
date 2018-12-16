/*
 * No NPM? Fine, my own test runner
 */

//                  Version 2, December 2004
//
//        Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
//
//  Everyone is permitted to copy and distribute verbatim or modified
//  copies of this license document, and changing it is allowed as long
//  as the name is changed.
//
//           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
//  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
//
//  0. You just DO WHAT THE FUCK YOU WANT TO.
//
// Author: https://github.com/szymek156


const color  = require("./console_colors");
const config = require("../config");

class TestRunner {
    constructor(testSuites = []) {
        this.failedTests = [];
        this.testSuites  = testSuites.map((SuiteClass) => {
            // testSuites collection contains Class types of Suites, create instances of them,
            // and opaque it up with proxy object. Proxy will intercept function calls with name
            // starting as test*. Proxy returns function where test* is wrapped by setUp and
            // tearDown functions.
            let proxy = new Proxy(new SuiteClass, {
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

                                await target.setUp();
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
        for (let i = 0; i < this.testSuites.length; i++) {
            let suite = this.testSuites[i];

            // Collect properties of Class Type
            let classType = Object.getPrototypeOf(suite);
            // Sort, because branch prediction, hmm actually should be randomized, whatever
            let properties = Object.getOwnPropertyNames(classType).sort();

            console.log(`${color.FgMagenta} [ Executing Test Suite ] ${
                classType.constructor.name} ${color.Reset}`);

            for (let i = 0; i < properties.length; i++) {
                if (typeof classType[properties[i]] === "function" &&
                    properties[i].startsWith("test")) {
                    yield suite[properties[i]];
                }
            }
        }
    }

    async runAll(exitProcessAtEnd) {
        if (!config.developmentEnv) {
            console.log(
                ` ${color.FgRed} Test runner can execute only in development build ${color.Reset}`);
            return;
        }

        let testIterator = this.TestGenerator();

        // Thanks to generator + await powers, tests are executing in serialized order,
        // one after another. Keep in mind tests itself has to be written in synchronous
        // manner:
        // setUp()
        // test1()
        // tearDown()
        //
        // setUp()
        // test2()
        // tearDown()
        // ...

        let totalTest = 0;
        for (let test of testIterator) {
            totalTest++;
            // Proxy will intercept this call
            try {
                await test();
            } catch (err) {
                this.failedTests.push(err.message);
            }
        }

        console.log(` ${color.FgMagenta}[ Summary ] ${color.Reset}`);
        console.log(` ${color.FgMagenta}[ Run Tests: ${totalTest} ] ${color.Reset}`);

        if (this.failedTests.length) {
            console.log(` ${color.FgRed} Failed tests: ${this.failedTests.length} ${color.Reset}`);
            console.log(` ${color.FgRed} ${this.failedTests} ${color.Reset}`);
        } else {
            console.log(` ${color.FgGreen}[ === ALL CLEAN! === ] ${color.Reset}`);
            // :)
            process.stdout.write("\x07");
        }

        if (exitProcessAtEnd) {
            console.log(` ${color.FgMagenta}[ Process Exits ] ${color.Reset}`);
            process.exit(0);
        }
    }
}

module.exports = TestRunner;