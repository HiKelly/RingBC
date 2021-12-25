const Register = artifacts.require("Register");
const Task = artifacts.require("Task");
const crypto = require('crypto');
const NodeRSA = require('node-rsa');

let key = new NodeRSA({b:1024});
var publicDer = key.exportKey('public');
var privateDer = key.exportKey('private');
var encrypted = key.encrypt("This is a secret");
var decrypted = key.decrypt(encrypted);
console.log("encrypted = " + encrypted.toString('base64'));
console.log("decrypted = " + decrypted.toString());
let registerInstance;
let taskInstance;

contract("Task", async function(accounts){
    before(async () => {
        registerInstance = await Register.deployed();
        taskInstance = await Task.deployed();
    })
    describe("success states", async () => {

        it("Should add a user ", async () => {
            let count0 = await registerInstance.getCountOfUsers.call();
            console.log("count0 = " + count0)
            await registerInstance.addUser(accounts[1], {from:accounts[0]});
            let count1 = await registerInstance.getCountOfUsers.call();
            console.log("count1 = " + count1)
            assert.equal(count1.valueOf(), 1);

        });

        it("Should add a task ", async () => {
            let b = await taskInstance.addQuestion("test", "This is a test", {from:accounts[0], value:1e19});
            console.log(b);
            let title = await taskInstance.getTitle.call();
            console.log("title = " + title);
            assert.equal(title, "test");
        })

        it("If add a user ", async () => {
            let users = await registerInstance.getUsers.call();
            for (let i in users) {
                console.log(i + ":" + users[i]);
            }
        })

        it("If a worker ", async () => {
            let flag = await registerInstance.isUser.call(accounts[1]);
            console.log("flag = " + flag);
            assert.equal(flag, true);
        })

        it("Should submit an answer ", async () => {
            let flag = await registerInstance.isUser.call(accounts[1]);
            if (flag) {
                let flag2 = await taskInstance.ifAnswered.call(accounts[1]);
                if (flag2) {
                    var msg = "/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme";
                    var encrypted = key.encrypt(msg, 'base64');
                    console.log("message length = ", msg.length);
                    console.log("length = ", encrypted.length);
                    let a = await taskInstance.answerQuestion(encrypted, {from:accounts[1]});
                    //console.log("Submit answer success");
                    console.log(a);
                } else {
                    console.log("The worker has submitted twice")
                }
            } else {
                console.log("This worker is not a user");
            }


            let count = await taskInstance.collectAnswers.call();
            /*for (let i in count) {
                console.log(count[i]);
            }*/
            assert.equal(count.length, 1);
        })

        it("Should not submit an answer ", async () => {

            let flag = await registerInstance.isUser.call(accounts[2]);
            if (flag) {
                let flag2 = await taskInstance.ifAnswered.call(accounts[2]);
                if (flag2) {
                    await taskInstance.answerQuestion("This is an answer", {from:accounts[2]});
                    console.log("Submit answer success");
                } else {
                    console.log("The worker has submitted twice")
                }
            } else {
                console.log("This worker is not a user");
            }
            let count = await taskInstance.collectAnswers.call();
            for (let i in count) {
                console.log(count[i]);
            }
            assert.equal(count.length, 1);
        })

        it("Should not submit an answer twice ", async () => {
            let flag = await registerInstance.isUser.call(accounts[1]);
            if (flag) {
                let flag2 = await taskInstance.ifAnswered.call(accounts[1]);
                if (flag2) {
                    await taskInstance.answerQuestion("This is an answer", {from:accounts[1]});
                    console.log("Submit answer success");
                } else {
                    console.log("The worker has submitted twice")
                }
            } else {
                console.log("This worker is not a user");
            }
            let count = await taskInstance.collectAnswers.call();
            for (let i in count) {
                console.log(count[i]);
            }
            assert.equal(count.length, 1);
        })

    })
})
