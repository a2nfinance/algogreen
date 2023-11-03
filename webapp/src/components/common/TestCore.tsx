import { useWallet } from "@txnlab/use-wallet"
import { Button, Space } from "antd"
import { addMembers, bootstrapDAO, checkAccountInfo, createProposal, deployDAO, getTxnInfo, optAccountIntoAsset } from "src/core/dao"

export const TestCore = () => {
    const { activeAddress, signTransactions, sendTransactions } = useWallet()
    return (
        <Space direction="vertical">
            <Button onClick={() => checkAccountInfo(activeAddress)}>Check Info</Button>
            <Button onClick={() => deployDAO(activeAddress, signTransactions, sendTransactions)}>Deploy DAO</Button>
            <Button onClick={() => bootstrapDAO(activeAddress, signTransactions, sendTransactions)}>Initialized DAO</Button>
            <Button onClick={() => optAccountIntoAsset(activeAddress, signTransactions, sendTransactions)}>Opt-in custom asset</Button>
            <Button onClick={() => addMembers(
                activeAddress,
                [
                    "6H5JAUPTWDRYLQRAVJKEEEJZDESR3OBPMBL34CT5BE3LCGB25ITY5UW6CY",
                    //"LC2K22UTBOKMQTZJMHNDL2CSWIJCKVRFLWR262CWFMU25ESY4IOLSLFTUI"
                ],
                signTransactions,
                sendTransactions
            )}>Add Memeber</Button>
            <Button onClick={() => createProposal(activeAddress, signTransactions, sendTransactions)}>Create proposal</Button>
            <Button onClick={() => getTxnInfo("4R6K27574LPS4TFPUBVCVZTN33DPREXJACTD4GS5KQ7BHFWR2VWQ")}>Get TXN info</Button>
        </Space>
    )
}