import algosdk from "algosdk";
import { algoClient } from "./constant";

export const getAccountInfo =  async(appId: number) => {
    const appAddress = algosdk.getApplicationAddress(appId);
    let accountInfo = await algoClient.accountInformation(appAddress).do();
    console.log(accountInfo);
    return accountInfo;
}