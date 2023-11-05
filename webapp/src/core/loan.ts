import { FormInstance } from "antd";
import { MESSAGE_TYPE, openNotification } from "./common";
import { store } from "src/controller/store";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import { setLoans } from "src/controller/dao/daoDetailSlice";


export const getLoansList =async (dao_id: string) => {
    try {
        let loanListReq = await fetch(`/api/database/loan/getList`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dao_id: dao_id
            })
        });

        const loans = await loanListReq.json();
        console.log("Loans:", loans)
        store.dispatch(setLoans(loans))
    } catch(e) {
        console.log(e)
    }
}

export const createNewLoanProgram =async (address: string, formValues: FormInstance<any>) => {
    try {
        if (!address) {
            openNotification("Your wallet is not currently connected.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        const {daoFromDB} = store.getState().daoDetail;

        if (daoFromDB.creator !== address) {
            openNotification("You're not this DAO owner.", `To utilize ALGOGREEN features, please connect your correct wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }

        store.dispatch(updateProcessStatus({
            actionName: actionNames.createLoanAction,
            att: processKeys.processing,
            value: true
        }))

        // save here
        await fetch(`/api/database/loan/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...formValues,
                dao_id: daoFromDB._id,
                start_date: new Date(formValues["date"][0]).getTime(),
                end_date: new Date(formValues["date"][1]).getTime()
            })
        });
        // Noti here
        openNotification("New loan program.", `Create new loan program successful!`, MESSAGE_TYPE.SUCCESS, () => { });
        // Get list loan here
        getLoansList(daoFromDB._id);
    } catch(e) {
        console.log(e);
        openNotification("New loan program.", e.message, MESSAGE_TYPE.ERROR, () => { });
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.createLoanAction,
        att: processKeys.processing,
        value: false
    }))

}