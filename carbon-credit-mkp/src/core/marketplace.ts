import algosdk, { ABIAddressType, ABIStringType } from "algosdk";
import { algoClient, waitRoundsToConfirm } from "./constant";
import * as abi from '../../artifacts/marketplace/contract.json';
import { FormInstance } from "antd";
import { MESSAGE_TYPE, openNotification } from "./common";
import { store } from "src/controller/store";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import { getProjectCredits } from "./credit";
// @ts-ignore
const contract = new algosdk.ABIContract(abi);
const minnimum_balance = 381000;


export const bootstrapMkp = async (
    address: string,
    formValues: FormInstance<any>,
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {
        if (!address) {
            openNotification("Your wallet is not currently connected.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        store.dispatch(updateProcessStatus({
            actionName: actionNames.sellCreditsAction,
            att: processKeys.processing,
            value: true
        }))

        const {credit} = store.getState().credit;
        const {project} = store.getState().project;
        
        if (credit.creator !== address) {
            openNotification("You're not credits owner.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        const appAddress = algosdk.getApplicationAddress(credit.app_id);
        const suggestedParams = await algoClient.getTransactionParams().do();
        const fundTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: address,
            to: appAddress,
            amount: minnimum_balance,
            suggestedParams: { ...suggestedParams, fee: algosdk.ALGORAND_MIN_TX_FEE, flatFee: true },
            note: (new ABIStringType()).encode("Init smart contract balance for storage and transactions")
        });
        const bootstrapMethodSelector = algosdk.getMethodByName(contract.methods, 'bootstrap').getSelector();

        const bootstrapAddTxn = algosdk.makeApplicationCallTxnFromObject({
            from: address,
            suggestedParams: suggestedParams,
            appIndex: credit.app_id,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [
                bootstrapMethodSelector,
                algosdk.encodeUint64(parseInt(formValues["allow_auction"])),
                algosdk.encodeUint64(10),
                algosdk.encodeUint64(Math.floor(parseFloat(formValues["origin_price"]) * 10**6)),
                (new ABIStringType()).encode(formValues["asset_name"]),
                (new ABIStringType()).encode(formValues["asset_url"]),
            ],
        });

        let txnArray = [fundTxn, bootstrapAddTxn];
        let groupID = algosdk.computeGroupID(txnArray);
        for (let i = 0; i < 2; i++) txnArray[i].group = groupID;
        const encodedFundTransaction = algosdk.encodeUnsignedTransaction(fundTxn)
        const encodedBootstrapTransaction = algosdk.encodeUnsignedTransaction(bootstrapAddTxn)
        const signedTransactions = await signTransactions([encodedFundTransaction, encodedBootstrapTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
        const createdTokenId = await getTokenId(credit.app_id);
        console.log("NFT token id:", createdTokenId)
        console.log('Successfully sent transaction. Transaction ID: ', txId);
        // Update database here
        await fetch(`/api/database/credit/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...formValues,
                _id: credit._id,
                asset_id: createdTokenId,
                max_auction_number: 10,
                status: 4
            })
        });
        // 
        getProjectCredits(project._id);
        //
        openNotification("Sell credits", `Sell credits successful!`, MESSAGE_TYPE.SUCCESS, () => { })
    } catch (e) {
        console.log(e);
        openNotification("Sell credits", e.message, MESSAGE_TYPE.SUCCESS, () => { })
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.sellCreditsAction,
        att: processKeys.processing,
        value: false
    }))
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