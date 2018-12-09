

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
}

module.exports = TestServer;
