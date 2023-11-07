import { FormInstance } from "antd";
import { store } from "src/controller/store";
import { MESSAGE_TYPE, openNotification } from "./common";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import { setProjectState } from "src/controller/project/projectSlice";


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

export const getFeaturedProjects = async () => {
    try {
        let req = await fetch(`/api/database/project/getFeaturedProjects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 4,
            })
        });
        let projects = await req.json();
        store.dispatch(setProjectState({ att: "featuredProjects", value: projects }));
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