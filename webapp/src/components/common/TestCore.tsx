import { useWallet } from "@txnlab/use-wallet"
import { Button, Col, Row, Space } from "antd"
import { addMembers, bootstrapDAO, checkAccountInfo, createProposal, deployDAO, executeProposal, fundDAO, getTxnInfo, optAccountIntoApp, optAccountIntoAsset, repayProposal, vote } from "src/core/dao"
import { acceptAuction, bootstrapMkp, createAuction, deployMkp, doBuyWithAuction } from "src/core/marketplace"

export const TestCore = () => {
    const { activeAddress, signTransactions, sendTransactions } = useWallet()
    return (
        <Row>
            <Col span={6}>
                <Space direction="vertical">
                    <Button onClick={() => checkAccountInfo(activeAddress)}>Check Info</Button>
                    <Button onClick={() => deployDAO(activeAddress, signTransactions, sendTransactions)}>Deploy DAO</Button>
                    <Button onClick={() => bootstrapDAO(activeAddress, signTransactions, sendTransactions)}>Initialized DAO</Button>
                    <Button onClick={() => fundDAO(activeAddress, 500_000, signTransactions, sendTransactions)}>Fund This DAO</Button>
                    <Button onClick={() => optAccountIntoAsset(activeAddress, signTransactions, sendTransactions)}>Opt-in custom asset</Button>
                    <Button onClick={() => addMembers(
                        activeAddress,
                        [
                            "6H5JAUPTWDRYLQRAVJKEEEJZDESR3OBPMBL34CT5BE3LCGB25ITY5UW6CY",
                            "LC2K22UTBOKMQTZJMHNDL2CSWIJCKVRFLWR262CWFMU25ESY4IOLSLFTUI"
                        ],
                        signTransactions,
                        sendTransactions
                    )}>Add Memeber</Button>
                    <Button onClick={() => createProposal(activeAddress, signTransactions, sendTransactions)}>Create proposal</Button>
                    <Button onClick={() => getTxnInfo("3KG42DEUKOJ7HSLHBLBF7YORTM6APE2CWBSCVPLCDMFR7KMHX2XQ")}>Get TXN info</Button>
                    <Button onClick={() => optAccountIntoApp(activeAddress, signTransactions, sendTransactions)}>Opt-in proposal app</Button>
                    <Button onClick={() => vote(activeAddress, 1, signTransactions, sendTransactions)}>Vote proposal</Button>
                    <Button onClick={() => executeProposal(activeAddress, "LC2K22UTBOKMQTZJMHNDL2CSWIJCKVRFLWR262CWFMU25ESY4IOLSLFTUI", signTransactions, sendTransactions)}>Execute proposal</Button>
                    <Button onClick={() => repayProposal(activeAddress, signTransactions, sendTransactions)}>Repay proposal</Button>
                </Space>
            </Col>
            <Col span={6}>
                <Space direction="vertical">
                    <Button onClick={() => deployMkp(activeAddress, "LC2K22UTBOKMQTZJMHNDL2CSWIJCKVRFLWR262CWFMU25ESY4IOLSLFTUI", 100, signTransactions, sendTransactions)}>Deploy DAO</Button>
                    <Button onClick={() => bootstrapMkp(
                        activeAddress,
                        1,
                        1000_000_000,
                        "NFT",
                        "Google.com",
                        signTransactions,
                        sendTransactions
                    )}>Bootstrap MKP</Button>
                    <Button onClick={() => createAuction(activeAddress, 1, 500_000, signTransactions, sendTransactions)}>Create auction</Button>
                    <Button onClick={() => acceptAuction(activeAddress, signTransactions, sendTransactions)}>Accept auction</Button>
                    <Button onClick={() => doBuyWithAuction(activeAddress, signTransactions, sendTransactions)}>Do buy with auction</Button>
                </Space>
            </Col>
        </Row>

    )
}