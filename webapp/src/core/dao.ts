import algosdk, { ABIAddressType, ABIArrayDynamicType, ABIContract, ABIReferenceType, ABIStringType, ABIType } from "algosdk";
import { algoClient, waitRoundsToConfirm } from "./constant";
import * as abi from '../../artifacts/dao/contract.json';
import * as proposalAbi from '../../artifacts/proposal/contract.json';
import moment from "moment";
import { store } from "src/controller/store";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import { MESSAGE_TYPE, openNotification } from "./common";
import { setDaoFormProps, updateDaoFormState } from "src/controller/dao/daoFormSlice";
import { FormInstance } from "antd";
import { setAppAccountInformation, setDaoDetailProps } from "src/controller/dao/daoDetailSlice";
import { getAccountInfo, getAppInfo } from "./util";
import { getDAOProposals, getOnchainProposal, getProjectProposals } from "./proposal";
import { setProposalState } from "src/controller/proposal/proposalSlice";
import { setDaoProps } from "src/controller/dao/daoSlice";
// @ts-ignore
const contract = new algosdk.ABIContract(abi);
// @ts-ignore
const proposalContract = new algosdk.ABIContract(proposalAbi);


export const checkAccountInfo = async (address: string) => {

    let accountInfo = await algoClient.accountInformation(address).do();
    console.log("Account Info:", accountInfo)

}

export const saveDAO = async (address: string, formValues: any) => {
    if (!address) {
        openNotification("Your wallet is not currently connected.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
        return;
    }
    let savedDAO: any = "";
    try {
        store.dispatch(updateProcessStatus({
            actionName: actionNames.createDaoAction,
            att: processKeys.processing,
            value: true
        }))

        let savedDAOReq = await fetch("/api/database/dao/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...formValues, creator: address })
        })
        savedDAO = await savedDAOReq.json();
        openNotification("Submit organization information", `Your information was saved successful!: `, MESSAGE_TYPE.SUCCESS, () => { })
    } catch (e) {
        console.log(e);
        openNotification("Submit organization information", e.message, MESSAGE_TYPE.ERROR, () => { })
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.createDaoAction,
        att: processKeys.processing,
        value: false
    }))
    return savedDAO;
}

export const getPublicDAOs =async () => {
    try {
        let getReq = await fetch("/api/database/dao/getAllDao", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: 3
            })
        })
        let daos = await getReq.json();
        store.dispatch(setDaoProps({att: "daos", value: daos}))
    } catch(e) {
        console.log(e);
    }
}


export const getOwnerDAOs = async (address: string) => {
    try {
        if (!address) {
            openNotification("Your wallet is not currently connected.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        let getReq = await fetch("/api/database/dao/getList", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                creator: address
            })
        })
        let daos = await getReq.json();
        store.dispatch(setDaoProps({att: "ownerDaos", value: daos}))
    } catch(e) {
        console.log(e);
    }
}
export const getDAOByCreatorAndId = async (creator: string, id: string, form?: FormInstance<any>) => {

    try {
        if (!(creator && id)) {
            console.log("No data")
            return;
        }
        let getReq = await fetch("/api/database/dao/getByCreatorAndId", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                _id: id,
                creator: creator
            })
        })
        let daoFromDB = await getReq.json();
        form ? form.setFieldsValue(daoFromDB) : {};
        store.dispatch(setDaoFormProps({ att: "generalForm", value: daoFromDB }));
        if ([2, 3].indexOf(daoFromDB.status) !== -1) {
            store.dispatch(setDaoFormProps({
                att: "votingSettingForm", value: {
                    dao_title: daoFromDB.dao_title,
                    quorum: daoFromDB.quorum,
                    passing_threshold: daoFromDB.passing_threshold,
                    submission_policy: daoFromDB.submission_policy
                }
            }))
        }
        if (daoFromDB.status === 3) {
            store.dispatch(setDaoFormProps({
                att: "tokenGovernanceForm", value: {
                    name: daoFromDB.token_name,
                    supply: daoFromDB.token_supply
                }
            }))
        }

    } catch (e) {
        console.error(e)
    }


}

export const getDAODetailById = async (id: string) => {

    try {
        let getReq = await fetch("/api/database/dao/getById", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                _id: id
            })
        })
        let daoFromDB = await getReq.json();
        let appAccountInformation = await getAccountInfo(daoFromDB.dao_app_id);
        let state = await getAppInfo(daoFromDB.dao_app_id);
        store.dispatch(setDaoDetailProps({ daoFromDB: daoFromDB, appAccountInformation: appAccountInformation, onchainDAO: state }));
    } catch (e) {
        console.error(e)
    }


}

export const fundDAO = async (
    address: string,
    amount: number,
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {
        if (!address) {
            openNotification("Your wallet is not currently connected.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        store.dispatch(updateProcessStatus({
            actionName: actionNames.addFundAction,
            att: processKeys.processing,
            value: true
        }))
        const { daoFromDB } = store.getState().daoDetail;
        const appAddress = algosdk.getApplicationAddress(daoFromDB.dao_app_id);
        const suggestedParams = await algoClient.getTransactionParams().do();
        const fundTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: address,
            to: appAddress,
            amount: Math.floor(amount * 10 ** 6),
            suggestedParams,
            note: (new ABIStringType()).encode("Fund DAO smart contracts")
        });

        const encodedFundTransaction = algosdk.encodeUnsignedTransaction(fundTxn)
        const signedTransactions = await signTransactions([encodedFundTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
        console.log('Successfully sent transaction. Transaction ID: ', txId)


        // Reload app account info
        let appAccountInformation = await getAccountInfo(daoFromDB.dao_app_id);
        store.dispatch(setAppAccountInformation(appAccountInformation));
        openNotification("Fund DAO", `Fund ALGO asset successful!`, MESSAGE_TYPE.SUCCESS, () => { })


    } catch (e) {
        console.log(e);
        openNotification("Fund DAO", `Fund ALGO asset fail!`, MESSAGE_TYPE.SUCCESS, () => { })
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.addFundAction,
        att: processKeys.processing,
        value: false
    }))
}
export const deployDAO = async (
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
            actionName: actionNames.deployDaoAction,
            att: processKeys.processing,
            value: true
        }))
        const { votingSettingForm, generalForm } = store.getState().daoForm;

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
            (new ABIStringType()).encode(votingSettingForm.dao_title),
            algosdk.encodeUint64(votingSettingForm.quorum * 100),
            algosdk.encodeUint64(votingSettingForm.passing_threshold * 100),
            algosdk.encodeUint64(votingSettingForm.submission_policy),
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
        // Update database here

        await fetch(`/api/database/dao/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...votingSettingForm,
                _id: generalForm._id,
                creator: generalForm.creator,
                dao_app_id: appCreateInfo["application-index"],
                status: 2
            })
        });

        // Notification here
        openNotification("Deploy DAO", `Deploy DAO successful!: `, MESSAGE_TYPE.SUCCESS, () => { })
        // Get dao info again
        await getDAOByCreatorAndId(generalForm.creator, generalForm._id);
    } catch (e) {
        console.log(e);
        openNotification("Deploy DAO error", e.message, MESSAGE_TYPE.ERROR, () => { });
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.deployDaoAction,
        att: processKeys.processing,
        value: false
    }))
}

export const bootstrapDAO = async (
    address: string,
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {

        if (!address) {
            openNotification("Your wallet is not currently connected.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        const { generalForm, tokenGovernanceForm } = store.getState().daoForm;
        if (address !== generalForm.creator) {
            openNotification("Your address is not match to DAO creator address.", `Please connect your correct wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        store.dispatch(updateProcessStatus({
            actionName: actionNames.initializeDaoAction,
            att: processKeys.processing,
            value: true
        }))

        const appAddress = algosdk.getApplicationAddress(generalForm.dao_app_id);
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
            appIndex: generalForm.dao_app_id,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [
                bootstrapMethodSelector,
                (new ABIStringType()).encode(tokenGovernanceForm.name),
                algosdk.encodeUint64(tokenGovernanceForm.supply)
            ],
        });

        let txnArray = [fundTxn, bootstrapAddTxn];
        let groupID = algosdk.computeGroupID(txnArray);
        for (let i = 0; i < 2; i++) txnArray[i].group = groupID;
        const encodedFundTransaction = algosdk.encodeUnsignedTransaction(fundTxn)
        const encodedBootstrapTransaction = algosdk.encodeUnsignedTransaction(bootstrapAddTxn)
        const signedTransactions = await signTransactions([encodedFundTransaction, encodedBootstrapTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
        const createdTokenId = await getTokenId(generalForm.dao_app_id);
        console.log("Membership token id:", createdTokenId)
        console.log('Successfully sent transaction. Transaction ID: ', txId);
        // Update database here
        await fetch(`/api/database/dao/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: generalForm._id,
                creator: generalForm.creator,
                token_id: createdTokenId,
                token_name: tokenGovernanceForm.name,
                token_supply: tokenGovernanceForm.supply,
                status: 3
            })
        });
        // Update
        openNotification("Create DAO token", `Create DAO token successful!: `, MESSAGE_TYPE.SUCCESS, () => { });
        await getDAOByCreatorAndId(generalForm.creator, generalForm._id);
    } catch (e) {
        console.log(e);
        openNotification("Create DAO token", e.message, MESSAGE_TYPE.ERROR, () => { });
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.initializeDaoAction,
        att: processKeys.processing,
        value: false
    }))
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
    try {
        if (!address) {
            openNotification("Your wallet is not currently connected.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        store.dispatch(updateProcessStatus({
            actionName: actionNames.optInAssetAction,
            att: processKeys.processing,
            value: true
        }))
        const { daoFromDB } = store.getState().daoDetail;
        const suggestedParams = await algoClient.getTransactionParams().do();
        const optinTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: address,
            to: address,
            amount: 0,
            assetIndex: daoFromDB.token_id,
            suggestedParams: { ...suggestedParams, fee: algosdk.ALGORAND_MIN_TX_FEE, flatFee: true },
        })

        const encodedOptinTransaction = algosdk.encodeUnsignedTransaction(optinTxn);
        const signedTransactions = await signTransactions([encodedOptinTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
        console.log('Successfully sent transaction. Transaction ID: ', txId)
        openNotification("Opt-in", `Opt your account into the DAO asset successful!`, MESSAGE_TYPE.SUCCESS, () => { });
    } catch (e) {
        console.log(e);
        openNotification("Opt-in", e.message, MESSAGE_TYPE.ERROR, () => { });
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.optInAssetAction,
        att: processKeys.processing,
        value: false
    }))
}

export const addMembers = async (
    address: string,
    formValues: any[],
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {
        if (!address) {
            openNotification("Your wallet is not currently connected.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        if (!formValues.length) {
            return;
        }

        const members = formValues.map(v => v.address);

        store.dispatch(updateProcessStatus({
            actionName: actionNames.addMemberAction,
            att: processKeys.processing,
            value: true
        }))

        const { daoFromDB } = store.getState().daoDetail;

        const suggestedParams = await algoClient.getTransactionParams().do();
        const appAddress = algosdk.getApplicationAddress(daoFromDB.dao_app_id);
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
            appIndex: daoFromDB.dao_app_id,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [
                addMembersMethodSelector,
                (new ABIArrayDynamicType(new ABIAddressType())).encode(members)
            ],
            accounts: members,
            foreignAssets: [daoFromDB.token_id]
        });

        let txnArray = [fundTxn, addMemebersAddTxn];
        let groupID = algosdk.computeGroupID(txnArray);
        for (let i = 0; i < 2; i++) txnArray[i].group = groupID;

        const encodedFundTransaction = algosdk.encodeUnsignedTransaction(fundTxn)
        const encodedAddMembersTransaction = algosdk.encodeUnsignedTransaction(addMemebersAddTxn)
        const signedTransactions = await signTransactions([encodedFundTransaction, encodedAddMembersTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
        console.log('Successfully sent transaction. Transaction ID: ', txId);
        openNotification("Add members", `Add members successful!`, MESSAGE_TYPE.SUCCESS, () => { })
    } catch (e) {
        console.log(e);
        openNotification("Add members", e.message, MESSAGE_TYPE.ERROR, () => { })
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.addMemberAction,
        att: processKeys.processing,
        value: false
    }))

}

export const createProposal = async (
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
            actionName: actionNames.createProposalAction,
            att: processKeys.processing,
            value: true
        }))

        const { daoFromDB } = store.getState().daoDetail;
        const { loanDetail } = store.getState().loan;
        const minimumFund = 100000 +
            + (25000 + 3500) * 15
            + (25000 + 25000) * 3
        const suggestedParams = await algoClient.getTransactionParams().do();
        const appAddress = algosdk.getApplicationAddress(daoFromDB.dao_app_id);
        const fundTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: address,
            to: appAddress,
            amount: minimumFund,
            suggestedParams,
            note: (new ABIStringType()).encode("Increase contract balance to qualify minimum balance"),
        });

        const createProposalMethodSelector = algosdk.getMethodByName(contract.methods, 'create_proposal').getSelector();
        let startTime = new Date(formValues["date"][0]).getTime();
        let unixStartTime = Math.floor(startTime / 1000);
        let endTime = new Date(formValues["date"][1]).getTime();
        let unixEndTime = Math.floor(endTime / 1000);
        let interestRate = parseInt(formValues["is_eco_project"]) === 1 ? loanDetail.special_interest_rate : loanDetail.general_interest_rate;
        const creteProposalAddTxn = algosdk.makeApplicationCallTxnFromObject({
            from: address,
            suggestedParams: suggestedParams,
            appIndex: daoFromDB.dao_app_id,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [
                createProposalMethodSelector,
                (new ABIStringType()).encode(formValues["title"]),
                algosdk.encodeUint64(unixStartTime),
                algosdk.encodeUint64(unixEndTime),
                algosdk.encodeUint64(parseInt(formValues["allow_early_execution"])),
                algosdk.encodeUint64(loanDetail.allow_early_repay),
                algosdk.encodeUint64(Math.floor(parseFloat(formValues["borrow_amount"]) * 10 ** 6)),
                algosdk.encodeUint64(interestRate * 100),
                algosdk.encodeUint64(loanDetail.term),
            ],
        });

        let txnArray = [fundTxn, creteProposalAddTxn];
        let groupID = algosdk.computeGroupID(txnArray);
        for (let i = 0; i < 2; i++) txnArray[i].group = groupID;

        const encodedFundTransaction = algosdk.encodeUnsignedTransaction(fundTxn)
        const encodedCreateProposalTransaction = algosdk.encodeUnsignedTransaction(creteProposalAddTxn)
        const signedTransactions = await signTransactions([encodedFundTransaction, encodedCreateProposalTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
        const daoAppAccountInfo = await getAccountInfo(daoFromDB.dao_app_id);
        const proposalAppId = daoAppAccountInfo["created-apps"][daoAppAccountInfo["total-created-apps"] - 1]["id"];
        console.log("Created Proposal App ID:", proposalAppId);
        console.log('Successfully sent transaction. Transaction ID: ', txId);

        //Save database here
        await fetch("/api/database/proposal/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...formValues,
                start_time: startTime,
                end_time: endTime,
                dao_id: daoFromDB._id,
                loan_id: loanDetail._id,
                creator: address,
                proposal_app_id: proposalAppId,
                allow_early_repay: loanDetail.allow_early_repay,
                interest_rate: interestRate,
                term: loanDetail.term
            })
        })
        // refresh dao proposal
        getDAOProposals(daoFromDB._id);
        // Noti
        openNotification("Create proposal", `Create proposal successful!`, MESSAGE_TYPE.SUCCESS, () => { })
    } catch (e) {
        console.log(e);
        openNotification("Create proposal", e.message, MESSAGE_TYPE.ERROR, () => { })
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.createProposalAction,
        att: processKeys.processing,
        value: false
    }))
}

// export const optAccountIntoApp = async (
//     address: string,
//     signTransactions: Function,
//     sendTransactions: Function
// ) => {
//     const suggestedParams = await algoClient.getTransactionParams().do();
//     const optinProposalMethodSelector = algosdk.getMethodByName(proposalContract.methods, 'opt_in').getSelector();
//     const optinTxn = algosdk.makeApplicationOptInTxnFromObject(
//         {
//             from: address,
//             suggestedParams,
//             appIndex: proposalId,
//             appArgs: [optinProposalMethodSelector]
//         }
//     )

//     const encodedOptinTransaction = algosdk.encodeUnsignedTransaction(optinTxn);
//     const signedTransactions = await signTransactions([encodedOptinTransaction])
//     const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
//     console.log('Successfully sent transaction. Transaction ID: ', txId)
// }


export const vote = async (
    address: string,
    agree: number,
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {
        if (!address) {
            openNotification("Your wallet is not currently connected.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        store.dispatch(updateProcessStatus({
            actionName: actionNames.voteAction,
            att: processKeys.processing,
            value: true
        }))
        // If use local state to check a member voted or not yet, need to a opt-in transaction
        // Validate here
        const { daoFromDB } = store.getState().daoDetail;
        const { proposal } = store.getState().proposal;

        const suggestedParams = await algoClient.getTransactionParams().do();

        const optinProposalMethodSelector = algosdk.getMethodByName(proposalContract.methods, 'opt_in').getSelector();
        const optinTxn = algosdk.makeApplicationOptInTxnFromObject(
            {
                from: address,
                suggestedParams,
                appIndex: proposal.proposal_app_id,
                appArgs: [optinProposalMethodSelector]
            }
        )

        const voteMethodSelector = algosdk.getMethodByName(contract.methods, 'vote').getSelector();
        const voteTxn = algosdk.makeApplicationCallTxnFromObject({
            from: address,
            suggestedParams: suggestedParams,
            appIndex: daoFromDB.dao_app_id,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [
                voteMethodSelector,
                algosdk.encodeUint64(proposal.proposal_app_id),
                algosdk.encodeUint64(agree)
            ],
            foreignApps: [proposal.proposal_app_id],
            foreignAssets: [daoFromDB.token_id]
        });
        let txnArray = [optinTxn, voteTxn];
        let groupID = algosdk.computeGroupID(txnArray);
        for (let i = 0; i < 2; i++) txnArray[i].group = groupID;
        const encodedOptinTransaction = algosdk.encodeUnsignedTransaction(optinTxn);
        const encodedVoteTransaction = algosdk.encodeUnsignedTransaction(voteTxn);
        const signedTransactions = await signTransactions([encodedOptinTransaction, encodedVoteTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
        console.log('Successfully sent transaction. Transaction ID: ', txId)
        openNotification("Vote proposal", `Vote proposal successful!`, MESSAGE_TYPE.SUCCESS, () => { })
        getOnchainProposal(proposal.proposal_app_id);
    } catch (e) {
        console.log(e);
        openNotification("Vote proposal", e.message, MESSAGE_TYPE.ERROR, () => { })
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.voteAction,
        att: processKeys.processing,
        value: false
    }))
}

export const executeProposal = async (
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
            actionName: actionNames.executeProposalAction,
            att: processKeys.processing,
            value: true
        }))
        const { proposal } = store.getState().proposal;
        const { daoFromDB } = store.getState().daoDetail;
        // If use local state to check a member voted or not yet, need to a opt-in transaction
        const suggestedParams = await algoClient.getTransactionParams().do();
        const executeProposalMethodSelector = algosdk.getMethodByName(contract.methods, 'execute_proposal').getSelector();
        const executeProposalTxn = algosdk.makeApplicationCallTxnFromObject({
            from: address,
            suggestedParams: suggestedParams,
            appIndex: daoFromDB.dao_app_id,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [
                executeProposalMethodSelector,
                algosdk.encodeUint64(proposal.proposal_app_id),
                algosdk.encodeUint64(proposal.borrow_amount * 10 ** 6),
                (new ABIAddressType()).encode(proposal.creator)
            ],
            foreignApps: [proposal.proposal_app_id],
            accounts: [proposal.creator]
        });

        const encodedExecuteTransaction = algosdk.encodeUnsignedTransaction(executeProposalTxn);
        const signedTransactions = await signTransactions([encodedExecuteTransaction]);
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);

        console.log('Successfully sent transaction. Transaction ID: ', txId);
        // Update database
        await fetch("/api/database/proposal/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                _id: proposal._id,
                executed: 1
            })
        })
        // dispatch proposal detail
        store.dispatch(setProposalState({ att: "proposal", value: { ...proposal, executed: 1 } }))
        getDAOProposals(daoFromDB._id);
        openNotification("Execute proposal", `Execute proposal successful!`, MESSAGE_TYPE.SUCCESS, () => { });
    } catch (e) {
        console.log(e);
        openNotification("Execute proposal", e.message, MESSAGE_TYPE.ERROR, () => { })
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.executeProposalAction,
        att: processKeys.processing,
        value: false
    }))
}

export const repayProposal = async (
    address: string,
    signTransactions: Function,
    sendTransactions: Function
) => {
    try {
        if (!address) {
            openNotification("Your wallet is not currently connected.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        const { proposal } = store.getState().proposal;
        const { daoFromDB } = store.getState().daoDetail;
        if (address !== proposal.creator) {
            openNotification("Your are not borrower.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        store.dispatch(updateProcessStatus({
            actionName: actionNames.repayAction,
            att: processKeys.processing,
            value: true
        }))
        const appAddress = algosdk.getApplicationAddress(daoFromDB.dao_app_id);
        const suggestedParams = await algoClient.getTransactionParams().do();

        const repayTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: address,
            to: appAddress,
            amount: parseInt(`${proposal.borrow_amount * 10 ** 6 * (1 + proposal.interest_rate / 100)}`),
            suggestedParams,
            note: (new ABIStringType()).encode("Repay Transaction"),
        });

        const repayProposalMethodSelector = algosdk.getMethodByName(contract.methods, 'repay_proposal').getSelector();
        const repayProposalTxn = algosdk.makeApplicationCallTxnFromObject({
            from: address,
            suggestedParams: suggestedParams,
            appIndex: daoFromDB.dao_app_id,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs: [
                repayProposalMethodSelector,
                algosdk.encodeUint64(proposal.proposal_app_id),
            ],
            foreignApps: [proposal.proposal_app_id]
        });
        let txnArray = [repayTxn, repayProposalTxn];
        let groupID = algosdk.computeGroupID(txnArray);
        for (let i = 0; i < 2; i++) txnArray[i].group = groupID;
        const encodedRepayTransaction = algosdk.encodeUnsignedTransaction(repayTxn)
        const encodedRepayProposalTransaction = algosdk.encodeUnsignedTransaction(repayProposalTxn)
        const signedTransactions = await signTransactions([encodedRepayTransaction, encodedRepayProposalTransaction])
        const { id, txId, txn } = await sendTransactions(signedTransactions, waitRoundsToConfirm);
        console.log('Successfully sent transaction. Transaction ID: ', txId);

        // Update database
        await fetch("/api/database/proposal/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                _id: proposal._id,
                is_repaid: 1
            })
        })
        // dispatch proposal detail
        store.dispatch(setProposalState({ att: "proposal", value: { ...proposal, is_repaid: 1 } }));
        getDAOProposals(daoFromDB._id);
        getProjectProposals(daoFromDB._id);
        openNotification("Repay proposal", `Repay proposal successful!`, MESSAGE_TYPE.SUCCESS, () => { });
    } catch (e) {
        console.log(e);
        openNotification("Repay proposal", e.message, MESSAGE_TYPE.ERROR, () => { })
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.repayAction,
        att: processKeys.processing,
        value: false
    }))
}