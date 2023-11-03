import algosdk, { ABIStringType } from "algosdk";
import { algoClient } from "./constant";
import * as abi from '../../artifacts/marketplace/contract.json';
// @ts-ignore
const contract = new algosdk.ABIContract(abi);


export const deployContract = async (
    address: string,
    totalCredits: number,
    signTransactions: Function,
    sendTransactions: Function
) => {

}

export const bootstrapContract = async (
    address: string,
    allow_or_not: number,
    origin_price: number,
    asset_name: string,
    asset_url: string,
    appId: number,
    signTransactions: Function,
    sendTransactions: Function
) => {

}

export const creatAuction = async (
    address: string,
    quantity: number,
    price: number,
    appId: number,
    signTransactions: Function,
    sendTransactions: Function
) => {

}

export const acceptAuction =async (
    address: string,
    appId: number,
    auctionIndex: number,
    signTransactions: Function,
    sendTransactions: Function
) => {
    
}

export const doBuyWithAuction =async (
    address: string,
    appId: number,
    auctionIndex: number,
    signTransactions: Function,
    sendTransactions: Function
) => {
    
}

export const doBuyWithoutAuction =async (
    address: string,
    appId: number,
    auctionIndex: number,
    signTransactions: Function,
    sendTransactions: Function
) => {
    
}