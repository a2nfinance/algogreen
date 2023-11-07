import { FormInstance } from "antd";
import { store } from "src/controller/store";
import { MESSAGE_TYPE, openNotification } from "./common";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import { setProjectState } from "src/controller/project/projectSlice";
import { setCreditState } from "src/controller/credit/creditSlice";

export const newCredit = async (address: string, formValues: FormInstance<any>) => {
    try {
        if (!address) {
            openNotification("Your wallet is not currently connected.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        const {project} = store.getState().project;
        if (address !== project.creator) {
            openNotification("You are not project owner.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        store.dispatch(updateProcessStatus({
            actionName: actionNames.createCreditAction,
            att: processKeys.processing,
            value: true
        }))
      
        // save here
        await fetch(`/api/database/credit/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...formValues,
                creator: address,
                project_id: project._id
            })
        });
        // Noti here
        openNotification("New credit.", `Create new credit successful!`, MESSAGE_TYPE.SUCCESS, () => { });
        // Reload my project
        getProjectCredits(project._id);
    } catch (e) {
        console.log(e);
        openNotification("New credit.", e.message, MESSAGE_TYPE.ERROR, () => { });
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.createCreditAction,
        att: processKeys.processing,
        value: false
    }))
}

export const getProjectCredits = async (id: string) => {
    try {
        let req = await fetch(`/api/database/credit/getByProject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                project_id: id,
            })
        });
        let credits = await req.json();
        store.dispatch(setCreditState({ att: "projectCredits", value: credits }));
    } catch (e) {
        console.log(e);
        openNotification("Get my projects.", e.message, MESSAGE_TYPE.ERROR, () => { });
    }
}

export const getMyCredits = async (address: string) => {
    try {
        if (!address) {
            openNotification("Your wallet is not currently connected.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        let req = await fetch(`/api/database/credit/getListByCreator`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                creator: address,
            })
        });
        let credits = await req.json();
        store.dispatch(setCreditState({ att: "myCredits", value: credits }));
    } catch (e) {
        console.log(e);
        openNotification("Get my projects.", e.message, MESSAGE_TYPE.ERROR, () => { });
    }
}

export const getMyApprovedCredits = async (address: string) => {
    try {
        if (!address) {
            return;
        }
        let req = await fetch(`/api/database/credit/getMyApprovedCredits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                creator: address,
            })
        });
        let credits = await req.json();
        store.dispatch(setCreditState({ att: "myApprovedCredits", value: credits }));
    } catch (e) {
        console.log(e);
        openNotification("Get my projects.", e.message, MESSAGE_TYPE.ERROR, () => { });
    }
}

export const getApprovedCredits = async () => {

}

export const getCreditById = async (id: string) => {
    try {
        let req = await fetch(`/api/database/credit/getById`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: id,
            })
        });
        let credit = await req.json();
        store.dispatch(setProjectState({ att: "credit", value: credit }));
    } catch (e) {
        console.log(e);
        openNotification("Get my projects.", e.message, MESSAGE_TYPE.ERROR, () => { });
    }
}