const MetaCoin = artifacts.require('MetaCoin');

contract('MetaCoin', accounts => {

    it('chaining - should put 10000 MetaCoin in the first account', () => {
        MetaCoin.deployed()
            .then(instance => instance.getBalance.call(accounts[0]))
            .then(balance => {
                assert.equal(
                    balance.valueOf(),
                    10000,
                    '10000 was not in the first account'
                );
            });
        });

    it('chaining - should call a function that dependes on a linked library', () => {
        let meta;
        let metaCoinBalance;
        let metaCoinEthBalance;

        return MetaCoin.deployed()
            .then(instance => {
                meta = instance;
                return meta.getBalance.call(accounts[0]);
            })
            .then(outCoinBalance => {
                metaCoinBalance = outCoinBalance.toNumber();
                return meta.getBalanceInEth.call(accounts[0]);
            })
            .then(outCoinBalanceEth => {
                metaCoinEthBalance = outCoinBalanceEth.toNumber();
            })
            .then(() => {
                assert.equal(
                    metaCoinEthBalance,
                    2 * metaCoinBalance,
                    "Library function returned unexpected function, linkage may be broken"
                );
            });
    });

    it('chaining - should send coin correctly', () => {
        let meta;

        // Initial balances
        const accountOne = accounts[0];
        const accountTwo = accounts[1];

        let accountOneStartingBalance, accountOneEndingBalance;
        let accountTwoStartingBalance, accountTwoEndingBalance;

        const amount = 10;

        return MetaCoin.deployed()
            .then(instance => {
                meta = instance;
                return meta.getBalance.call(accountOne);
            })
            .then(balance => {
                accountOneStartingBalance = balance.toNumber();
                return meta.getBalance.call(accountTwo);
            })
            .then(balance => {
                accountTwoStartingBalance = balance.toNumber();
                return meta.sendCoin(accountTwo, amount, { from: accountOne });
            })
            .then(() => meta.getBalance.call(accountOne))
            .then(balance => {
                accountOneEndingBalance = balance.toNumber();
                return meta.getBalance.call(accountTwo);
            })
            .then(balance => {
                accountTwoEndingBalance = balance.toNumber();

                assert.equal(
                    accountOneEndingBalance,
                    accountOneStartingBalance - amount,
                    'Amount was not correctly taken from the sender'
                );

                assert.equal(
                    accountTwoEndingBalance,
                    accountTwoStartingBalance + amount,
                    'Amount was not correctly sent to the receiver'
                );
            });
    });

});