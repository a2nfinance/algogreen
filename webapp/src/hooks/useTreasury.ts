export const useTreasury = () => {
    const getFundStatistic = (contributorFunds: {address: string, amount: number}[], members: string[]) => {
        let totalFunds = 0;
        let memberFunds = 0;
        let notMemberFunds = 0;
        contributorFunds.forEach(({address, amount}) => {
            totalFunds += amount;
            if (members.indexOf(address) !== -1) {
                memberFunds += amount;
            } else {
                notMemberFunds += amount;
            }
        })

        return {
            totalFunds, memberFunds, notMemberFunds
        }
    };

   
    const getTotalFundsInNEO = (treasury: any[]) => {
        let total = 0;
        treasury.forEach(({token_symbol, amount}) => {
            if (token_symbol === "NEO") {
                total += amount;
            }
        })
        return total;
    }

    return { getFundStatistic, getTotalFundsInNEO };
};