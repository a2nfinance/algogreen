import algosdk, { ABIAddressType, ABIByteType, ABIStringType } from "algosdk";
import { algoClient, waitRoundsToConfirm } from "./constant";
import * as abi from '../../artifacts/marketplace/contract.json';
import { FormInstance } from "antd";
import { MESSAGE_TYPE, openNotification } from "./common";
import { store } from "src/controller/store";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import { getProjectCredits } from "./credit";
import { setCreditState } from "src/controller/credit/creditSlice";
// @ts-ignore
const contract = new algosdk.ABIContract(abi);
const minnimum_balance = 381000;

export const createAuction = async (
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



        const { credit } = store.getState().credit;
        if (credit.creator === address) {
            openNotification("You are credits creator.", `You can not create an auction`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        store.dispatch(updateProcessStatus({
            actionName: actionNames.newAuctionAction,
            att: processKeys.processing,
            value: true
        }))

        const boxInfo = await algoClient.getApplicationBoxes(credit.app_id).max(10).do();
        const auctionIndex = boxInfo.boxes.length;
        const suggestedParams = await algoClient.getTransactionParams().do();

        const createAuctionMethodSelector = algosdk.getMethodByName(contract.methods, 'create_auction').getSelector();
        const createAuctionTxn = algosdk.makeApplicationCallTxnFromObject({
            from: address,
            suggestedParams: suggestedParams,
            appIndex: credit.app_id,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [
                createAuctionMethodSelector,
                algosdk.encodeUint64(parseInt(formValues["quantity"])),
                algosdk.encodeUint64(Math.floor(parseFloat(formValues["price"]) * 10 ** 6))
            ],
            boxes: [{ appIndex: credit.app_id, name: algosdk.encodeUint64(auctionIndex) }]
        });

        const encodedAuctionTransaction = algosdk.encodeUnsignedTransaction(createAuctionTxn)
        const signedTransactions = await signTransactions([encodedAuctionTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
        console.log('Successfully sent transaction. Transaction ID: ', txId);
        // Save DB here
        await fetch("/api/database/auction/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...formValues,
                buyer: address,
                credit_app_id: credit.app_id,
                auction_index: auctionIndex
            })
        })
        // Noti
        openNotification("Create auction", `Create auction successful!`, MESSAGE_TYPE.SUCCESS, () => { })
    } catch (e) {
        console.log(e);
        openNotification("Create auction", e.message, MESSAGE_TYPE.ERROR, () => { })
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.newAuctionAction,
        att: processKeys.processing,
        value: false
    }))
}

export const getAuctions = async () => {
    try {
        const { credit } = store.getState().credit;
        let req = await fetch("/api/database/auction/getByCredit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({

                credit_app_id: credit.app_id,

            })
        });
        let auctions = await req.json();
        store.dispatch(setCreditState({ att: "creditAuctions", value: auctions }))
    } catch (e) {
        console.log(e)
    }
}
export const acceptAuction = async (
    address: string,
    auction_index: number,
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {
        if (!address) {
            openNotification("Your wallet is not currently connected.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        const { credit } = store.getState().credit;
        if (credit.creator !== address) {
            openNotification("You are not credits creator.", `You can not create an auction`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        store.dispatch(updateProcessStatus({
            actionName: actionNames.acceptAuctionAction,
            att: processKeys.processing,
            value: true
        }))

        const suggestedParams = await algoClient.getTransactionParams().do();
        const acceptAuctionMethodSelector = algosdk.getMethodByName(contract.methods, 'accept_auction').getSelector();
        const acceptAuctionTxn = algosdk.makeApplicationCallTxnFromObject({
            from: address,
            suggestedParams: suggestedParams,
            appIndex: credit.app_id,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [
                acceptAuctionMethodSelector,
                algosdk.encodeUint64(auction_index),
            ],
            boxes: [{ appIndex: credit.app_id, name: algosdk.encodeUint64(auction_index) }]
        });

        const encodedAuctionTransaction = algosdk.encodeUnsignedTransaction(acceptAuctionTxn)
        const signedTransactions = await signTransactions([encodedAuctionTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
        console.log('Successfully sent transaction. Transaction ID: ', txId);
        // Save DB here
        await fetch("/api/database/auction/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                credit_app_id: credit.app_id,
                auction_index: auction_index,
                status: 1
            })
        })

        getAuctions();
        // Noti
        openNotification("Accept auction", `Accept auction successful!`, MESSAGE_TYPE.SUCCESS, () => { })
    } catch (e) {
        console.log(e);
        openNotification("Accept auction", `Accept auction fail!`, MESSAGE_TYPE.ERROR, () => { })
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.acceptAuctionAction,
        att: processKeys.processing,
        value: false
    }))
}

export const doBuyWithAuction = async (
    address: string,
    auction_index: number,
    price: number,
    buyer: string,
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {
        if (!address) {
            openNotification("Your wallet is not currently connected.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        const { credit } = store.getState().credit;
        if (buyer !== address) {
            openNotification("You are not auctioneer.", `You can not buy credits with this auction!`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        store.dispatch(updateProcessStatus({
            actionName: actionNames.buyCreditAction,
            att: processKeys.processing,
            value: true
        }))

        const appAddress = algosdk.getApplicationAddress(credit.app_id);
        const suggestedParams = await algoClient.getTransactionParams().do();

        const optinTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: address,
            to: address,
            amount: 0,
            assetIndex: credit.asset_id,
            suggestedParams
        })

        const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: address,
            to: appAddress,
            amount: Math.floor(price * 10**6),
            suggestedParams: { ...suggestedParams, fee: algosdk.ALGORAND_MIN_TX_FEE, flatFee: true },
            note: (new ABIStringType()).encode("Auction Payment")
        });
        const doBuyMethodSelector = algosdk.getMethodByName(contract.methods, 'do_buy_with_auction').getSelector();

        const doBuyAddTxn = algosdk.makeApplicationCallTxnFromObject({
            from: address,
            suggestedParams: suggestedParams,
            appIndex: credit.app_id,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [
                doBuyMethodSelector,
                algosdk.encodeUint64(auction_index),
            ],
            foreignAssets: [credit.asset_id],
            accounts: [credit.creator],
            boxes: [{ appIndex: credit.app_id, name: algosdk.encodeUint64(auction_index) }]
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
        // Update database
        // Save DB here
        await fetch("/api/database/auction/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                credit_app_id: credit.app_id,
                auction_index: auction_index,
                status: 2
            })
        })
        // Noti
        getAuctions();
        openNotification("Buy credits", `Buy credits successful!`, MESSAGE_TYPE.SUCCESS, () => { })
    } catch (e) {
        console.log(e);
        openNotification("Buy credits", `Buy credits fail!`, MESSAGE_TYPE.ERROR, () => { })
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.buyCreditAction,
        att: processKeys.processing,
        value: true
    }))
}

export const doBuyWithoutAuction = async (
    address: string,
    appId: number,
    auctionIndex: number,
    signTransactions: Function,
    sendTransactions: Function
) => {

}