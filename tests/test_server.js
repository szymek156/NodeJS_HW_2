

class TestServer {
    constructor() {
        this.counter = 0;
    }

    setUp() {
        console.log("setUp", this.counter++);
    }

    tearDown() {
        console.log("tearDown");
    }


    testServerIsUpAndRunning(arg) {
        console.log("testserverIsUpAndRunning", this, arg);
    }

    testServerIsUpAndRunning2(arg) {
        console.log("testserverIsUpAndRunning2", this, arg);
    }

    runAll() {
        let props = Object.getOwnPropertyNames(TestServer.prototype).sort();

        for (let i = 0; i < props.length; i++) {
            if (props[i].startsWith("test")) {
                this[props[i]]();

                // TestServer.prototype[props[i]].call(this, 997);
            }
        }
    }
}

let proxy = new Proxy(new TestServer, {
    get: function(target, prop, receiver) {
        // console.log("intercepted function get ", target, prop);

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

module.exports = proxy;
