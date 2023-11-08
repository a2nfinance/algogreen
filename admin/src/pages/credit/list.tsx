import { useWallet } from "@txnlab/use-wallet";
import { Button, Card, Modal, Space, Table, Tag } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CreditItem, setCreditState } from "src/controller/credit/creditSlice";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { getPendingCredits, updateCredit } from "src/core/credit";
import { deployMkp } from "src/core/marketplace";



export default function AllCredits() {
    const {activeAccount, signTransactions, sendTransactions} = useWallet();
    const {deployMkpAction, changeStatusAction} = useAppSelector(state => state.process);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { allCredits } = useAppSelector(state => state.credit);
    const [approveModal, setApprovalModal] = useState(false);
    const [rejectModal, setRejectModal] = useState(false);
    const showModal = () => {
        setApprovalModal(true);
    };

    const handleModalOk = () => {
        setApprovalModal(false);
    };

    const handleModalCancel = () => {
        setApprovalModal(false);
    };


    const showRejectModal = () => {
        setRejectModal(true);
    };

    const handleRejectModalOk = () => {
        setRejectModal(false);
    };

    const handleRejectModalCancel = () => {
        setRejectModal(false);
    };

    const handleApprove = (record: CreditItem) => {
        dispatch(setCreditState({ att: "credit", value: record }));

        showModal();
    }
    const handleReject = (record: CreditItem) => {
        dispatch(setCreditState({ att: "credit", value: record }));
        showRejectModal();
    }
    const columns = [
        {
            title: 'TITLE',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: "ISSUED CREDITS",
            dataIndex: "total_credits",
            key: "total_credits",

        },
        {
            title: "PRICE (ALGO)",
            dataIndex: "origin_price",
            key: "origin_price",
            render: (_, record) => (
                <>N/A</>
            )
        },
        {
            title: "ALLOW AUCTION",
            dataIndex: "allow_auction",
            key: "allow_auction",
            render: (_, record) => (
                <>N/A</>
            )
        },
        {
            title: "DESCRIPTION",
            dataIndex: "description",
            key: "description",
            render: (_, record) => (
                <Button type="link">view</Button>
            )
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "proof_document",
            render: (_, record) => (
                <Tag color="default">pending</Tag>
            )
        },
        {
            title: "CREATED DATE",
            dataIndex: "created_at",
            key: "created_at",
            render: (_, record) => (
                record.created_at ? new Date(record.created_at).toLocaleString() : ""
            )
        },
        {
            title: "PROJECT",
            dataIndex: "project_id",
            key: "project_id",
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => router.push(`/project/detail/${record.project_id}`)}>view</Button>
                </Space>

            )
        },
        {
            title: "ACTION",
            dataIndex: "action",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button loading={deployMkpAction.processing || changeStatusAction.processing} type="primary" onClick={() => handleApprove(record)}>Approve</Button>
                    <Button  loading={deployMkpAction.processing || changeStatusAction.processing} onClick={() => handleReject(record)}>Reject</Button>
                </Space>
            )
        }
    ];


    useEffect(() => {

        getPendingCredits()
    }, [])
    return (
        <Card title="All Pending Credits" style={{ border: "none" }}
            headStyle={{ padding: 0, textTransform: "uppercase" }}
            bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}>
            <Table
                pagination={false}
                dataSource={allCredits}
                columns={columns} />
            <Modal title="Approve" open={approveModal} onCancel={handleModalCancel} footer={null} >
                <p>Do you want to approve this request?</p>
                <Button loading={deployMkpAction.processing} type="primary" size="large" onClick={() => deployMkp(activeAccount?.address, signTransactions, sendTransactions)}>Yes</Button>
            </Modal>
            <Modal title="Reject" open={rejectModal} onCancel={handleRejectModalCancel} footer={null} >
                <p>Do you want to reject this request?</p>
                <Button loading={changeStatusAction.processing}  type="primary" size="large" onClick={() => updateCredit(3)}>Yes</Button>
            </Modal>
        </Card >
    )
}