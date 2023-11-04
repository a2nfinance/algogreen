import algosdk, { ABIAddressType, ABIStringType } from "algosdk";
import { algoClient, waitRoundsToConfirm } from "./constant";
import * as abi from '../../artifacts/marketplace/contract.json';
// @ts-ignore
const contract = new algosdk.ABIContract(abi);

const appId = 468091592;
const minnimum_balance = 381000;
const tokenId = 468094841;
const auctionIndex = 1;
const currentAuctionId = 0;
const seller = "LC2K22UTBOKMQTZJMHNDL2CSWIJCKVRFLWR262CWFMU25ESY4IOLSLFTUI";
export const deployMkp = async (
    address: string,
    seller: string,
    totalCredits: number,
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {
        let request = await fetch(`/api/marketplace-contract`, {
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
            (new ABIAddressType()).encode(seller),
            algosdk.encodeUint64(totalCredits)
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

export const bootstrapMkp = async (
    address: string,
    allow_or_not: number,
    origin_price: number,
    asset_name: string,
    asset_url: string,
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {
        const appAddress = algosdk.getApplicationAddress(appId);
        const suggestedParams = await algoClient.getTransactionParams().do();
        const fundTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: address,
            to: appAddress,
            amount: minnimum_balance,
            // Double the fee so newAccount doesn't need to pay a fee
            suggestedParams: { ...suggestedParams, fee: algosdk.ALGORAND_MIN_TX_FEE, flatFee: true },
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
                algosdk.encodeUint64(allow_or_not),
                algosdk.encodeUint64(10),
                algosdk.encodeUint64(origin_price),
                (new ABIStringType()).encode(asset_name),
                (new ABIStringType()).encode(asset_url),
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
        console.log("NFT token id:", createdTokenId)
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
        if (state.key === btoa("asset_id")) {
            createdTokenId = state.value.uint
        }
    })
    return createdTokenId;
}


export const createAuction = async (
    address: string,
    quantity: number,
    price: number,
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {
        const suggestedParams = await algoClient.getTransactionParams().do();

        const createAuctionMethodSelector = algosdk.getMethodByName(contract.methods, 'create_auction').getSelector();
        const createAuctionTxn = algosdk.makeApplicationCallTxnFromObject({
            from: address,
            suggestedParams: suggestedParams,
            appIndex: appId,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [
                createAuctionMethodSelector,
                algosdk.encodeUint64(quantity),
                algosdk.encodeUint64(price)
            ],
            boxes: [{ appIndex: appId, name: algosdk.encodeUint64(auctionIndex) }]
        });

        const encodedAuctionTransaction = algosdk.encodeUnsignedTransaction(createAuctionTxn)
        const signedTransactions = await signTransactions([encodedAuctionTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
        console.log('Successfully sent transaction. Transaction ID: ', txId)
    } catch (e) {
        console.log(e)
    }

}

export const acceptAuction = async (
    address: string,
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {
        const suggestedParams = await algoClient.getTransactionParams().do();
        const acceptAuctionMethodSelector = algosdk.getMethodByName(contract.methods, 'accept_auction').getSelector();
        const acceptAuctionTxn = algosdk.makeApplicationCallTxnFromObject({
            from: address,
            suggestedParams: suggestedParams,
            appIndex: appId,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [
                acceptAuctionMethodSelector,
                algosdk.encodeUint64(currentAuctionId),
            ],
            boxes: [{ appIndex: appId, name: algosdk.encodeUint64(currentAuctionId) }]
        });

        const encodedAuctionTransaction = algosdk.encodeUnsignedTransaction(acceptAuctionTxn)
        const signedTransactions = await signTransactions([encodedAuctionTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
        console.log('Successfully sent transaction. Transaction ID: ', txId)
    } catch (e) {
        console.log(e)
    }

}

export const doBuyWithAuction = async (
    address: string,
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {
        const appAddress = algosdk.getApplicationAddress(appId);
        const suggestedParams = await algoClient.getTransactionParams().do();

        const optinTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: address,
            to: address,
            amount: 0,
            assetIndex: tokenId,
            suggestedParams
        })

        const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: address,
            to: appAddress,
            amount: 500_000,
            suggestedParams: { ...suggestedParams, fee: algosdk.ALGORAND_MIN_TX_FEE, flatFee: true },
            note: (new ABIStringType()).encode("Auction Payment")
        });
        const doBuyMethodSelector = algosdk.getMethodByName(contract.methods, 'do_buy_with_auction').getSelector();

        const doBuyAddTxn = algosdk.makeApplicationCallTxnFromObject({
            from: address,
            suggestedParams: suggestedParams,
            appIndex: appId,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [
                doBuyMethodSelector,
                algosdk.encodeUint64(currentAuctionId),
            ],
            foreignAssets: [tokenId],
            accounts: [seller],
            boxes: [{ appIndex: appId, name: algosdk.encodeUint64(currentAuctionId) }]
        });

        let txnArray = [optinTxn, paymentTxn, doBuyAddTxn];
        let groupID = algosdk.computeGroupID(txnArray);
        for (let i = 0; i < 3; i++) txnArray[i].group = groupID;
        const encodedOptInTransaction = algosdk.encodeUnsignedTransaction(optinTxn);
        const encodedPaymentTransaction = algosdk.encodeUnsignedTransaction(paymentTxn);
        const encodedDoBuyTransaction = algosdk.encodeUnsignedTransaction(doBuyAddTxn);
        const signedTransactions = await signTransactions([encodedOptInTransaction, encodedPaymentTransaction, encodedDoBuyTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
        console.log('Successfully sent transaction. Transaction ID: ', txId)
    } catch (e) {
        console.log(e)
    }

}

export const doBuyWithoutAuction = async (
    address: string,
    appId: number,
    auctionIndex: number,
    signTransactions: Function,
    sendTransactions: Function
) => {
    
}