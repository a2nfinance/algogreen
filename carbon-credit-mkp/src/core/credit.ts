import { FormInstance } from "antd";
import { store } from "src/controller/store";
import { MESSAGE_TYPE, openNotification } from "./common";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import { setProjectState } from "src/controller/project/projectSlice";
import { setCreditAndProject, setCreditState } from "src/controller/credit/creditSlice";
import { algoClient } from "./constant";
import { getAccountInfo } from "./util";


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

export const getApprovedCredits = async () => {
    try {
        let req = await fetch(`/api/database/credit/getApprovedCredits`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let credits = await req.json();
        store.dispatch(setCreditState({ att: "allCredits", value: credits }));
    } catch (e) {
        console.log(e);
        openNotification("Get my projects.", e.message, MESSAGE_TYPE.ERROR, () => { });
    }
}

export const getFeaturedCredits = async () => {
    try {
        let req = await fetch(`/api/database/credit/getFeaturedCredits`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let credits = await req.json();
        store.dispatch(setCreditState({ att: "featuredCredits", value: credits }));
    } catch (e) {
        console.log(e);
        openNotification("Get my projects.", e.message, MESSAGE_TYPE.ERROR, () => { });
    }
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
        let data = await req.json();
        let creditAppInfo = await getAccountInfo(data.credit.app_id);
        store.dispatch(setCreditAndProject({...data, creditAppInfo: creditAppInfo}));
    } catch (e) {
        console.log(e);
        openNotification("Get my projects.", e.message, MESSAGE_TYPE.ERROR, () => { });
    }
}