import algosdk, { ABIAddressType, ABIArrayDynamicType, ABIContract, ABIReferenceType, ABIStringType, ABIType } from "algosdk";
import { algoClient, waitRoundsToConfirm } from "./constant";
import * as abi from '../../artifacts/dao/contract.json';
import * as proposalAbi from '../../artifacts/proposal/contract.json';
import moment from "moment";
// @ts-ignore
const contract = new algosdk.ABIContract(abi);
const proposalContract = new algosdk.ABIContract(proposalAbi);
const appId = 468059037
const tokenId = 468060065;
const proposalId = 468067344;

export const checkAccountInfo = async (address: string) => {

    let accountInfo = await algoClient.accountInformation(address).do();
    console.log("Account Info:", accountInfo)

}

export const fundDAO = async(
    address: string, 
    amount: number,
    signTransactions: Function,
    sendTransactions: Function
    ) => {
    try {
        const appAddress = algosdk.getApplicationAddress(appId);
        const suggestedParams = await algoClient.getTransactionParams().do();
        const fundTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: address,
            to: appAddress,
            amount: amount,
            suggestedParams,
            note: (new ABIStringType()).encode("Fund DAO smart contracts")
        });

        const encodedFundTransaction = algosdk.encodeUnsignedTransaction(fundTxn)
        const signedTransactions = await signTransactions([encodedFundTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
        console.log('Successfully sent transaction. Transaction ID: ', txId)
    } catch(e) {
        console.log(e)
    }
}
export const deployDAO = async (
    address: string,
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {
        let request = await fetch(`/api/dao-contract`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        let response = await request.json()
        const suggestedParams = await algoClient.getTransactionParams().do();


        const createMethodSelector = algosdk.getMethodByName(contract.methods, 'create').getSelector();

        const appArgs = [
            createMethodSelector,
            (new ABIStringType()).encode("Test DAO"),
            algosdk.encodeUint64(20),
            algosdk.encodeUint64(50),
            algosdk.encodeUint64(1),
        ]

        const appCreateTxn = algosdk.makeApplicationCreateTxnFromObject({
            from: address,
            approvalProgram: new Uint8Array(Buffer.from(response.compiledApprovalProgram, "base64")),
            clearProgram: new Uint8Array(Buffer.from(response.compiledClearProgram, "base64")),
            numGlobalByteSlices: response.numGlobalByteSlices,
            numGlobalInts: response.numGlobalInts,
            numLocalByteSlices: response.numLocalByteSlices,
            numLocalInts: response.numLocalInts,
            suggestedParams,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            extraPages: 1,
            appArgs: appArgs
        });

        const encodedTransaction = algosdk.encodeUnsignedTransaction(appCreateTxn)
        const signedTransactions = await signTransactions([encodedTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm)
        const appCreateInfo = await algoClient.pendingTransactionInformation(txId).do();
        console.log('Successfully sent transaction. Transaction ID: ', id)
        console.log("Created app info:", appCreateInfo)
        console.log(`Created app with index: ${appCreateInfo["application-index"]}`);
    } catch (e) {
        console.log(e)
    }

}

export const bootstrapDAO = async (
    address: string,
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {
        const appAddress = algosdk.getApplicationAddress(appId);
        const suggestedParams = await algoClient.getTransactionParams().do();
        const fundTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: address,
            to: appAddress,
            amount: 200_000, // 0.2 ALGO,
            // Double the fee so newAccount doesn't need to pay a fee
            suggestedParams: { ...suggestedParams, fee: 2 * algosdk.ALGORAND_MIN_TX_FEE, flatFee: true },
            note: (new ABIStringType()).encode("Init smart contract balance for storage and transactions")
        });
        const bootstrapMethodSelector = algosdk.getMethodByName(contract.methods, 'bootstrap').getSelector();

        const bootstrapAddTxn = algosdk.makeApplicationCallTxnFromObject({
            from: address,
            suggestedParams: suggestedParams,
            appIndex: appId,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [
                bootstrapMethodSelector,
                (new ABIStringType()).encode("ABN"),
                algosdk.encodeUint64(100000)
            ],
        });

        let txnArray = [fundTxn, bootstrapAddTxn];
        let groupID = algosdk.computeGroupID(txnArray);
        for (let i = 0; i < 2; i++) txnArray[i].group = groupID;
        const encodedFundTransaction = algosdk.encodeUnsignedTransaction(fundTxn)
        const encodedBootstrapTransaction = algosdk.encodeUnsignedTransaction(bootstrapAddTxn)
        const signedTransactions = await signTransactions([encodedFundTransaction, encodedBootstrapTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
        const createdTokenId = await getTokenId(appId);
        console.log("Membership token id:", createdTokenId)
        console.log('Successfully sent transaction. Transaction ID: ', txId)
    } catch (e) {
        console.log(e)
    }
}

export const getTokenId = async (appId: number) => {
    const appInfo = await algoClient.getApplicationByID(appId).do()
    let globalState: { key: string, value: any }[] = appInfo.params["global-state"];
    let createdTokenId = "";
    globalState.forEach(state => {
        if (state.key === btoa("membership_token")) {
            createdTokenId = state.value.uint
        }
    })
    return createdTokenId;
}

export const getTxnInfo = async (txnId: string) => {
    const txnInfo = await algoClient.pendingTransactionInformation(txnId).do()
    console.log(txnInfo);
}

export const getAppIdFromInnerTxn = async (txnId: string) => {
    const txnInfo = await algoClient.pendingTransactionInformation(txnId).do();
    return txnInfo["inner-txns"][0]["application-index"];
}

export const optAccountIntoAsset = async (
    address: string,
    signTransactions: Function,
    sendTransactions: Function
) => {
    const suggestedParams = await algoClient.getTransactionParams().do();
    const optinTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: address,
        to: address,
        amount: 0,
        assetIndex: tokenId,
        suggestedParams: { ...suggestedParams, fee: algosdk.ALGORAND_MIN_TX_FEE, flatFee: true },
    })

    const encodedOptinTransaction = algosdk.encodeUnsignedTransaction(optinTxn);
    const signedTransactions = await signTransactions([encodedOptinTransaction])
    const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
    console.log('Successfully sent transaction. Transaction ID: ', txId)
}

export const addMembers = async (
    address: string,
    members: string[],
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {
        const suggestedParams = await algoClient.getTransactionParams().do();
        const appAddress = algosdk.getApplicationAddress(appId);
        const fundTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: address,
            to: appAddress,
            amount: 2000 * members.length, // 0.2 ALGO,
            suggestedParams,
            note: (new ABIStringType()).encode("Increase contract balance to qualify minimum balance"),
        });

        const addMembersMethodSelector = algosdk.getMethodByName(contract.methods, 'add_members').getSelector();

        const addMemebersAddTxn = algosdk.makeApplicationCallTxnFromObject({
            from: address,
            suggestedParams: suggestedParams,
            appIndex: appId,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [
                addMembersMethodSelector,
                (new ABIArrayDynamicType(new ABIAddressType())).encode(members)
            ],
            accounts: members,
            foreignAssets: [tokenId]
        });

        let txnArray = [fundTxn, addMemebersAddTxn];
        let groupID = algosdk.computeGroupID(txnArray);
        for (let i = 0; i < 2; i++) txnArray[i].group = groupID;

        const encodedFundTransaction = algosdk.encodeUnsignedTransaction(fundTxn)
        const encodedAddMembersTransaction = algosdk.encodeUnsignedTransaction(addMemebersAddTxn)
        const signedTransactions = await signTransactions([encodedFundTransaction, encodedAddMembersTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
        console.log('Successfully sent transaction. Transaction ID: ', txId)
    } catch (e) {
        console.log(e)
    }

}

export const createProposal = async (
    address: string,
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {
        const minimumFund = 100000 +
            + (25000 + 3500) * 15
            + (25000 + 25000) * 3
        const suggestedParams = await algoClient.getTransactionParams().do();
        const appAddress = algosdk.getApplicationAddress(appId);
        const fundTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: address,
            to: appAddress,
            amount: minimumFund,
            suggestedParams,
            note: (new ABIStringType()).encode("Increase contract balance to qualify minimum balance"),
        });

        const createProposalMethodSelector = algosdk.getMethodByName(contract.methods, 'create_proposal').getSelector();
        const now = moment().unix();
        const creteProposalAddTxn = algosdk.makeApplicationCallTxnFromObject({
            from: address,
            suggestedParams: suggestedParams,
            appIndex: appId,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [
                createProposalMethodSelector,
                (new ABIStringType()).encode("New proposal"),
                algosdk.encodeUint64(now),
                algosdk.encodeUint64(now + 100000),
                algosdk.encodeUint64(1),
                algosdk.encodeUint64(1),
                algosdk.encodeUint64(500_000),
                algosdk.encodeUint64(900),
                algosdk.encodeUint64(12),
            ],
        });

        let txnArray = [fundTxn, creteProposalAddTxn];
        let groupID = algosdk.computeGroupID(txnArray);
        for (let i = 0; i < 2; i++) txnArray[i].group = groupID;

        const encodedFundTransaction = algosdk.encodeUnsignedTransaction(fundTxn)
        const encodedCreateProposalTransaction = algosdk.encodeUnsignedTransaction(creteProposalAddTxn)
        const signedTransactions = await signTransactions([encodedFundTransaction, encodedCreateProposalTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
        const proposalAppId = await getAppIdFromInnerTxn(txId);
        console.log("Created Proposal App ID:", proposalAppId);
        console.log('Successfully sent transaction. Transaction ID: ', txId)
    } catch (e) {
        console.log(e)
    }
}

export const optAccountIntoApp = async (
    address: string,
    signTransactions: Function,
    sendTransactions: Function
) => {
    const suggestedParams = await algoClient.getTransactionParams().do();
    const optinProposalMethodSelector = algosdk.getMethodByName(proposalContract.methods, 'opt_in').getSelector();
    const optinTxn = algosdk.makeApplicationOptInTxnFromObject(
        { 
            from: address,
            suggestedParams,
            appIndex: proposalId,
            appArgs:[optinProposalMethodSelector]
        }
    )

    const encodedOptinTransaction = algosdk.encodeUnsignedTransaction(optinTxn);
    const signedTransactions = await signTransactions([encodedOptinTransaction])
    const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
    console.log('Successfully sent transaction. Transaction ID: ', txId)
}


export const vote = async (
    address: string,
    agree: number,
    signTransactions: Function,
    sendTransactions: Function
) => {
    // If use local state to check a member voted or not yet, need to a opt-in transaction
    const suggestedParams = await algoClient.getTransactionParams().do();
    const voteMethodSelector = algosdk.getMethodByName(contract.methods, 'vote').getSelector();
    const voteTxn = algosdk.makeApplicationCallTxnFromObject({
        from: address,
        suggestedParams: suggestedParams,
        appIndex: appId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
            voteMethodSelector,
            algosdk.encodeUint64(proposalId),
            algosdk.encodeUint64(agree)
        ],
        foreignApps: [proposalId],
        foreignAssets: [tokenId]
    });

    const encodedVoteTransaction = algosdk.encodeUnsignedTransaction(voteTxn)
    const signedTransactions = await signTransactions([encodedVoteTransaction])
    const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
    console.log('Successfully sent transaction. Transaction ID: ', txId)
}

export const executeProposal = async (
    address: string,
    proposalAddress: string,
    signTransactions: Function,
    sendTransactions: Function
) => {
    // If use local state to check a member voted or not yet, need to a opt-in transaction
    const suggestedParams = await algoClient.getTransactionParams().do();
    const executeProposalMethodSelector = algosdk.getMethodByName(contract.methods, 'execute_proposal').getSelector();
    const executeProposalTxn = algosdk.makeApplicationCallTxnFromObject({
        from: address,
        suggestedParams: suggestedParams,
        appIndex: appId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
            executeProposalMethodSelector,
            algosdk.encodeUint64(proposalId),
            algosdk.encodeUint64(500_000),
            (new ABIAddressType()).encode(proposalAddress)
        ],
        foreignApps: [proposalId],
        accounts:[address]
    });

    const encodedExecuteTransaction = algosdk.encodeUnsignedTransaction(executeProposalTxn)
    const signedTransactions = await signTransactions([encodedExecuteTransaction])
    const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
    console.log('Successfully sent transaction. Transaction ID: ', txId)
}

export const repayProposal = async (
    address: string,
    signTransactions: Function,
    sendTransactions: Function
) => {
    const appAddress = algosdk.getApplicationAddress(appId);
    const suggestedParams = await algoClient.getTransactionParams().do();

    const repayTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: address,
        to: appAddress,
        amount: parseInt(`${500_000 * 1.09}`),
        suggestedParams,
        note: (new ABIStringType()).encode("Repay Transaction"),
    });

    const repayProposalMethodSelector = algosdk.getMethodByName(contract.methods, 'repay_proposal').getSelector();
    const repayProposalTxn = algosdk.makeApplicationCallTxnFromObject({
        from: address,
        suggestedParams: suggestedParams,
        appIndex: appId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
            repayProposalMethodSelector,
            algosdk.encodeUint64(proposalId),
        ],
        foreignApps: [proposalId]
    });
    let txnArray = [repayTxn, repayProposalTxn];
    let groupID = algosdk.computeGroupID(txnArray);
    for (let i = 0; i < 2; i++) txnArray[i].group = groupID;

    const encodedExecuteTransaction = algosdk.encodeUnsignedTransaction(repayProposalTxn)
    const signedTransactions = await signTransactions([encodedExecuteTransaction])
    const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
    console.log('Successfully sent transaction. Transaction ID: ', txId)
}