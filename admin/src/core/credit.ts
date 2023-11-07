import { setCreditState } from "src/controller/credit/creditSlice";
import { store } from "src/controller/store";



export const getProjectCredits = async (id: string) => {
    try {
        let req = await fetch(`/api/database/credit/getAllCredits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                project_id: id,
            })
        });
        let credits = await req.json();
        store.dispatch(setCreditState({ att: "allCredits", value: credits }));
    } catch (e) {
        console.log(e);
    }
}

export const getAllCredits = async () => {
    try {
        let req = await fetch(`/api/database/credit/getAllCredits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                
            })
        });
        let credits = await req.json();
        store.dispatch(setCreditState({ att: "allCredits", value: credits }));
    } catch (e) {
        console.log(e);
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
        store.dispatch(setCreditState({ att: "credit", value: credit }));
    } catch (e) {
        console.log(e);
    }
}