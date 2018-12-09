/*
 * No NPM? Fine, my own test runner
 */

class TestRunner {
    constructor(testFixtures = []) {
        this.testFixtures = testFixtures.map((FixtureClass) => {
            // testFixtures collection contains Class types of fixtures, create instances of them,
            // and opaque it up with proxy object. Proxy will intercept function calls with name
            // starting as test*. Proxy returns function where test* is wrapped by setUp and
            // tearDown functions.
            let proxy = new Proxy(new FixtureClass, {
                get: function(target, prop, receiver) {
                    // Wrap functions starting with test* to with setUp and tearDown methods
                    if (typeof target[prop] === "function" && prop.startsWith("test")) {
                        return function(...argArray) {
                            target.setUp();
                            target[prop].call(target, ...argArray);
                            target.tearDown();
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
            let classType = Object.getPrototypeOf(fixture);
            let props     = Object.getOwnPropertyNames(classType).sort();

            for (let i = 0; i < props.length; i++) {
                if (typeof classType[props[i]] === "function" && props[i].startsWith("test")) {
                    fixture[props[i]]();
                }
            }
        });
    }
}

module.exports = TestRunner;