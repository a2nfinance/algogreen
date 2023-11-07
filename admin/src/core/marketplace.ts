import algosdk, { ABIAddressType, ABIStringType } from "algosdk";
import { algoClient, waitRoundsToConfirm } from "./constant";
import * as abi from '../../artifacts/marketplace/contract.json';
import { MESSAGE_TYPE, openNotification } from "./common";
import { store } from "src/controller/store";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import { getAllCredits } from "src/core/credit";
// @ts-ignore
const contract = new algosdk.ABIContract(abi);

export const deployMkp = async (
    address: string,
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {

        if (!address) {
            openNotification("Your wallet is not currently connected.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        store.dispatch(updateProcessStatus({
            actionName: actionNames.deployMkpAction,
            att: processKeys.processing,
            value: true
        }))

        const { credit } = store.getState().credit;
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
            (new ABIAddressType()).encode(credit.creator),
            algosdk.encodeUint64(credit.total_credits)
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

        // Update database here
        await fetch(`/api/database/credit/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: credit._id,
                app_id: appCreateInfo["application-index"],
                status: 2
            })
        });
        // 
        getAllCredits();
        // Noti
        openNotification("Approve credits", `Approve credits successful!`, MESSAGE_TYPE.SUCCESS, () => { })
    } catch (e) {
        console.log(e);
        openNotification("Approve credits", e.message, MESSAGE_TYPE.ERROR, () => { })
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.deployMkpAction,
        att: processKeys.processing,
        value: false
    }))
}