const Register = artifacts.require("Register");
var contractInstance;

contract("Register", async function(accounts){
    before(async () => {
        contractInstance = await Register.deployed();
    })
    describe("success states", async () => {

        for (let i = 0; i < 7; i++) {
            it("Should add a user ", async () => {
                let add0 = "0x54E84FC343923c3E1e6700cBF7beD3749e711125"
                //let count0 = await contractInstance.getCountOfUsers.call();
                //console.log("count0 = " + count0)
                await contractInstance.addUser(add0, {from:accounts[0]});
                //let count1 = await contractInstance.getCountOfUsers.call();
                //console.log("count1 = " + count1)
                //assert.equal(count1.valueOf(), 1);

            });
        }


        it("Should get users", async () => {
            let users = await contractInstance.getUsers.call();
            for (var i = 0; i < users.length; i++) {
                console.log("i = " + i);
                console.log(users[i]);
            }
        });

        it("Should be a user", async () => {
            let add0 = "0x54E84FC343923c3E1e6700cBF7beD3749e711125";
            let flag0 = await contractInstance.isUser.call(add0);
            assert.equal(flag0, true);
            let add1 = "0x98dD2d64ce1DbA5197Ffb7AeC54512C080AcA386";
            let flag1 = await contractInstance.isUser.call(add1);
            assert.equal(flag1, false);
        });
    })
})
