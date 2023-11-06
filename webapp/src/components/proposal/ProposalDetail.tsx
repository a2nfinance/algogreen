import { LinkOutlined } from "@ant-design/icons";
import { useWallet } from "@txnlab/use-wallet";
import { Button, Card, Descriptions, Divider, Space } from "antd";
import { useRouter } from "next/router";
import { useAppSelector } from "src/controller/hooks";
import { executeProposal, repayProposal, vote } from "src/core/dao";
import { useProposal } from "src/hooks/useProposal";

export const ProposalDetail = () => {
    const { activeAccount, signTransactions, sendTransactions } = useWallet();
    const { voteAction, executeProposalAction, repayAction } = useAppSelector(state => state.process);
    const { checkPass } = useProposal();
    const router = useRouter();
    const { proposal, onchainProposal } = useAppSelector(state => state.proposal);
    const { daoFromDB, onchainDAO } = useAppSelector(state => state.daoDetail);
    return (
        <Card title={proposal.title}>

            {!proposal.executed && <Space>
                <Button loading={voteAction.processing} type="primary" size="large" onClick={() => vote(activeAccount?.address, 1, signTransactions, sendTransactions)}>Agree ({onchainProposal.filter(p => p.key === "agree_counter")[0].value})</Button>
                <Button loading={voteAction.processing} size="large" onClick={() => vote(activeAccount?.address, 0, signTransactions, sendTransactions)}>Disagree ({onchainProposal.filter(p => p.key === "disagree_counter")[0].value})</Button>
                {
                    checkPass(daoFromDB, onchainDAO, onchainProposal) && <Button loading={executeProposalAction.processing} type="primary" onClick={() => executeProposal(activeAccount?.address, signTransactions, sendTransactions)} size="large">Execute & send ALGO to borrower</Button>
                }
            </Space>}
            {
                (proposal.executed && !proposal.is_repaid && activeAccount?.address === proposal.creator) && <Button
                    loading={repayAction.processing}
                    type="primary"
                    onClick={() => repayProposal(activeAccount?.address, signTransactions, sendTransactions)} size="large">
                    Repay - token amount is {proposal.borrow_amount * (1+proposal.interest_rate/100)} ALGO
                </Button>
            }
            <Divider />
            <Descriptions column={2} title="General info" layout="vertical">
                <Descriptions.Item label={"Borrow amount (ALGO)"}>{proposal.borrow_amount}</Descriptions.Item>
                <Descriptions.Item label={"Interest rate"}>{proposal.interest_rate} %</Descriptions.Item>
                <Descriptions.Item label={"Allow early repay"}>{proposal.allow_early_repay ? "Yes" : "No"}</Descriptions.Item>
                <Descriptions.Item label={"Project"}><a onClick={() => router.push(`/project/${proposal.project_id}`)}><LinkOutlined /></a></Descriptions.Item>
                <Descriptions.Item label={"DAO"}><a onClick={() => router.push(`/dao/detail/${proposal.dao_id}`)}><LinkOutlined /></a></Descriptions.Item>
                <Descriptions.Item label={"Loan"}><a onClick={() => router.push(`/loan/detail/${proposal.loan_id}`)}><LinkOutlined /></a></Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions column={2} title="Voting settings" layout="vertical">
                <Descriptions.Item label={"Start date"}>{new Date(proposal.start_time).toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label={"End date"}>{new Date(proposal.end_time).toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label={"Allow early execution"}>{proposal.allow_early_execution ? "Yes" : "No"}</Descriptions.Item>
                <Descriptions.Item label={"Executed"}>{proposal.executed ? "Yes" : "No"}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions column={3} title="Description" layout="vertical">
                <Descriptions.Item>
                    <div
                        dangerouslySetInnerHTML={{ __html: proposal.description }}
                    />
                </Descriptions.Item>
            </Descriptions>

        </Card>
    )
}