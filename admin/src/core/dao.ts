import { setDaoDetailProps } from "src/controller/dao/daoDetailSlice";
import { setDaoProps } from "src/controller/dao/daoSlice";
import { store } from "src/controller/store";
import { MESSAGE_TYPE, openNotification } from "./common";



export const getPendingDAOs =async () => {
    try {
        let getReq = await fetch("/api/database/dao/getAllDao", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: 0
            })
        })
        let daos = await getReq.json();
        store.dispatch(setDaoProps({att: "daos", value: daos}))
    } catch(e) {
        console.log(e);
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
        store.dispatch(setDaoDetailProps(daoFromDB));
    } catch (e) {
        console.error(e)
    }


}

export const updateDao = async (status: number) => {
    try {
        const { daoFromDB } = store.getState().daoDetail;
        let req = await fetch(`/api/database/dao/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: daoFromDB._id,
                status: status
            })
        });
        let cc = await req.json();
        getDAODetailById(daoFromDB._id);
        openNotification("Update DAO", "Update DAO successful", MESSAGE_TYPE.SUCCESS, () => { });
    } catch (e) {
        console.log(e);
        openNotification("Update DAO", e.message, MESSAGE_TYPE.ERROR, () => { });
    }
}