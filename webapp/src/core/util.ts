import algosdk from "algosdk";
import { algoClient } from "./constant";

export const getAccountInfo = async (appId: number) => {
    const appAddress = algosdk.getApplicationAddress(appId);
    let accountInfo = await algoClient.accountInformation(appAddress).do();
    return accountInfo;
}
export const getAppInfo = async (appId: number) => {
    const appInfo = await algoClient.getApplicationByID(appId).do()
    let globalState: { key: string, value: any }[] = appInfo.params["global-state"];
    let state = globalState.map(s => {

        let key = atob(s.key);
        let v = s.value.type === 1 ? s.value.bytes : s.value.uint;
        return {
            key: key,
            type: s.value.type,
            value: v
        }
    })
    return state;
}