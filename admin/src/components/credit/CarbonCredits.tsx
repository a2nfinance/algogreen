import { useWallet } from "@txnlab/use-wallet";
import { Button, Space, Table, Tag } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { CreditItem, setCreditState } from "src/controller/credit/creditSlice";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { getAllCredits } from "src/core/credit";
import { deployMkp } from "src/core/marketplace";
import { useStatus } from "src/hooks/useStatus";

export const CarbonCredits = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { activeAccount, signTransactions, sendTransactions } = useWallet();
    const { deployMkpAction } = useAppSelector(state => state.process)
    const { id } = router.query;
    const { getCreditStatus } = useStatus();
    const { allCredits } = useAppSelector(state => state.credit);
    const handleApprove = (record: CreditItem) => {
        dispatch(setCreditState({ att: "credit", value: record }));
        deployMkp(activeAccount?.address, signTransactions, sendTransactions);
    }

    const handleReject = (record: CreditItem) => {
        dispatch(setCreditState({ att: "credit", value: record }));
        // Update here
    }
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Project',
            dataIndex: 'project_id',
            key: 'project_id',
            render: (_, record) => (
                <Button type="primary">View more</Button>
            )
        },
        {
            title: "Credits",
            dataIndex: "total_credits",
            key: "total_credits",
            // render: (_, record) => (
            //     new Date(record.created_at).toLocaleString()
            // )
        },
        {
            title: "Proof document",
            dataIndex: "proof_document",
            key: "proof_document",
            render: (_, record) => (
                <Button type="primary">Detail</Button>
            )
        },
        {
            title: "Created at",
            dataIndex: "created_at",
            key: "created_at",
            render: (_, record) => (
                record.created_at ? new Date(record.created_at).toLocaleString() : ""
            )
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, record) => (
                <Tag>{getCreditStatus(record.status)}</Tag>
            )
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_, record) => {
                let actions = <></>;
                if (record.status == 0) {
                    actions = <Space>
                        <Button>Auditing</Button>
                        <Button>Reject</Button>
                        <Button loading={deployMkpAction.processing} type="primary" onClick={() => handleApprove(record)}>Approve</Button>
                    </Space>
                } else if (record.status === 1) {
                    actions = <Space>
                        <Button>Reject</Button>
                        <Button loading={deployMkpAction.processing} type="primary" onClick={() => handleApprove(record)}>Approve</Button>
                    </Space>
                } else {
                    actions = <Space>
                        No applicable action
                    </Space>
                }
                return (
                    actions
                )
            }
        },
    ];


    useEffect(() => {
        getAllCredits();

    }, [])

    return (

        <Table
            pagination={{
                pageSize: 6,
                position: ["bottomCenter"]
            }}
            dataSource={allCredits}
            columns={columns} />

    )
}