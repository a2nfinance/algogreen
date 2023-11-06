import { setProposalState } from "src/controller/proposal/proposalSlice";
import { store } from "src/controller/store";
import { algoClient } from "./constant";
import algosdk from "algosdk";
import { getAppInfo } from "./util";

export const getDAOProposals = async (id: string) => {
    try {
        let req = await fetch(`/api/database/proposal/getList`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dao_id: id
            })
        });

        const proposals = await req.json();
        store.dispatch(setProposalState({att: "daoProposals", value: proposals}))
    } catch(e) {
        console.log(e)
    }
}

export const getMyProposals =  async (address: string) => {
    try {
        let req = await fetch(`/api/database/proposal/getListByCreator`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                creator: address
            })
        });

        const proposals = await req.json();
        console.log("Loans:", proposals)
        store.dispatch(setProposalState({att: "daoProposals", value: proposals}))
    } catch(e) {
        console.log(e)
    }
}

export const getOnchainProposal = async (appId: number) => {
    try {
        let state = await getAppInfo(appId);
        store.dispatch(setProposalState({att: "onchainProposal", value: state}))
    } catch(e) {
        console.log(e)
    }
}