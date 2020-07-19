const StarNotary = artifacts.require("StarNotary");

contract('StarNotary', (accounts) => {
    let owner = accounts[0];
    let otherOwner = accounts[1];
   
    it('has correct name', () => {
        StarNotary.deployed()
            .then(instance => instance.starName.call())
            .then(starName => assert.equal(starName, 'Awesome Udacity Star'));
    });

    it('can be claimed', () => {
        StarNotary.deployed()
            .then(instance => {
                instance.claimStar({ from: owner })
                return instance;
            })
            .then(instance => instance.starOwner.call())
            .then(starOwner => assert.equal(starOwner, owner));
    });

    it('can change owners', () => {
        let star;
        StarNotary.deployed()
            .then(instance => {
                star = instance;
            })
            .then(() => star.claimStar({ from: owner }))
            .then(() => star.starOwner.call())
            .then(starOwner => assert.equal(owner, starOwner))
            .then(() => star.claimStar({ from: otherOwner }))
            .then(() => star.starOwner.call())
            .then(starOwner => assert.equal(starOwner, otherOwner));
    });

    it('can change name', () => {
        let star;
        let starNameOld = "Awesome Udacity Star";
        let starNameNew = "Luangnious Star";

        StarNotary.deployed()
            .then(instance => {
                star = instance;
            })
            .then(() => star.starName.call())
            .then(starName => assert(starName, starNameOld))
            .then(() => star.changeName(starNameNew))
            .then(() => star.starName.call())
            .then(starName => assert.equal(starName, starNameNew));
    });

});