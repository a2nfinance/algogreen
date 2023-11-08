import { FormInstance } from "antd";
import { setProjectState } from "src/controller/project/projectSlice";
import { store } from "src/controller/store";
import { MESSAGE_TYPE, openNotification } from "./common";


export const updateProject = async (address: string, formValues: FormInstance<any>) => {

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


export const getApprovedProjects = async () => {
    try {
        let req = await fetch(`/api/database/project/getApprovedProjects`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        let projects = await req.json();
        store.dispatch(setProjectState({ att: "allProjects", value: projects }));
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