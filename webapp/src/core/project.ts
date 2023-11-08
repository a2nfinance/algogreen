import { FormInstance } from "antd";
import { store } from "src/controller/store";
import { MESSAGE_TYPE, openNotification } from "./common";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import { setProjectState } from "src/controller/project/projectSlice";

export const newProject = async (address: string, formValues: FormInstance<any>) => {
    let flag = false;
    try {
        if (!address) {
            openNotification("Your wallet is not currently connected.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return flag;
        }
        store.dispatch(updateProcessStatus({
            actionName: actionNames.createNewProjectAction,
            att: processKeys.processing,
            value: true
        }))

        // save here
        await fetch(`/api/database/project/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...formValues,
                creator: address,
                start_date: new Date(formValues["date"][0]).getTime(),
                end_date: new Date(formValues["date"][1]).getTime()
            })
        });
        // Noti here
        openNotification("New project.", `Create new project successful!`, MESSAGE_TYPE.SUCCESS, () => { });
        // Reload my project
        getMyProjects(address);
        flag = true;
    } catch (e) {
        console.log(e);
        openNotification("New project.", e.message, MESSAGE_TYPE.ERROR, () => { });
        flag = false;
    }
    store.dispatch(updateProcessStatus({
        actionName: actionNames.createNewProjectAction,
        att: processKeys.processing,
        value: false
    }))
    return flag;
}

export const updateProject = async (address: string, formValues: FormInstance<any>) => {

}

export const getMyProjects = async (address: string) => {
    try {
        if (!address) {
            openNotification("Your wallet is not currently connected.", `To utilize ALGOGREEN features, please connect your wallet.`, MESSAGE_TYPE.INFO, () => { });
            return;
        }
        let req = await fetch(`/api/database/project/getListByCreator`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

                creator: address,
            })
        });
        let projects = await req.json();
        store.dispatch(setProjectState({ att: "myProjects", value: projects }));
    } catch (e) {
        console.log(e);
        openNotification("Get my projects.", e.message, MESSAGE_TYPE.ERROR, () => { });
    }
}

export const getMyApprovedProjects = async (address: string) => {
    try {
        if (!address) {
            return;
        }
        let req = await fetch(`/api/database/project/getMyApprovedProjects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                creator: address,
            })
        });
        let projects = await req.json();
        store.dispatch(setProjectState({ att: "myApprovedProjects", value: projects }));
    } catch (e) {
        console.log(e);
        openNotification("Get my projects.", e.message, MESSAGE_TYPE.ERROR, () => { });
    }
}

export const getApprovedProjects = async () => {
    try {

        let req = await fetch(`/api/database/project/getApprovedProjects`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let projects = await req.json();
        store.dispatch(setProjectState({ att: "allApprovedProjects", value: projects }));
    } catch (e) {
        console.log(e);
        openNotification("Get my projects.", e.message, MESSAGE_TYPE.ERROR, () => { });
    }
}

export const getProjectById = async (id: string) => {
    try {
        let req = await fetch(`/api/database/project/getById`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

                _id: id,
            })
        });
        let project = await req.json();
        store.dispatch(setProjectState({ att: "project", value: project }));
    } catch (e) {
        console.log(e);
        openNotification("Get my projects.", e.message, MESSAGE_TYPE.ERROR, () => { });
    }
}