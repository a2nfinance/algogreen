import algosdk from "algosdk"

export const daoTypeMap = {
    1: "Membership DAO (Multisig)",
    2: "Token-based DAO",
    3: "Non-Fungible Token (NFT)-based DAO"
}

export const votingConfigs= (percentage: number) => {
    if (percentage == 100) {
        return "All-member vote required for proposal execution."
    } else {
        return `Above ${percentage} %`
    }

}

export const governanceConfigs = (open: boolean) => {
    if (open) {
        return "Open to all"
    } else {
        return "Invited members only"
    }
}
export const TESTNET_EXPLORER = 'https://testnet.algoexplorer.io/application';
export const DEFAULT_NETWORK = 'testnet'
 
export const DEFAULT_NODE_BASEURL = 'https://testnet-api.algonode.network'

export const DEFAULT_NODE_TOKEN = ''

export const DEFAULT_NODE_PORT = ''

export const algoClient = new algosdk.Algodv2(DEFAULT_NODE_TOKEN, DEFAULT_NODE_BASEURL, DEFAULT_NODE_PORT)

export const waitRoundsToConfirm = 4
// Test account 1: 6H5JAUPTWDRYLQRAVJKEEEJZDESR3OBPMBL34CT5BE3LCGB25ITY5UW6CY
// Test account 2: LC2K22UTBOKMQTZJMHNDL2CSWIJCKVRFLWR262CWFMU25ESY4IOLSLFTUI


// DAO status: 0 - draft and wait for approval, 1 - approved, 2 - bootstraped DAO