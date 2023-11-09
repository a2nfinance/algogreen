import { useEffect, useState } from "react";
import { Badge, Button, Modal, Table, Tag } from "antd";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { useStatus } from "src/hooks/useStatus";
import { getProjectCredits } from "src/core/credit";
import { SellingCreditForm } from "./SellingCreditForm";
import { setCreditState } from "src/controller/credit/creditSlice";

export const CarbonCredits = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { id } = router.query;
    const { getCreditStatus } = useStatus();
    const { projectCredits } = useAppSelector(state => state.credit)
    const [newCreditsModalOpen, setNewCreditsModalOpen] = useState(false);
    const showModal = (record: any) => {
        dispatch(setCreditState({ att: "credit", value: record }))
        setNewCreditsModalOpen(true);
    };

    const handleModalOk = () => {
        setNewCreditsModalOpen(false);
    };

    const handleModalCancel = () => {
        setNewCreditsModalOpen(false);
    };
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: "Credits (carbon offset kilograms)",
            dataIndex: "total_credits",
            key: "total_credits",
            // render: (_, record) => (
            //     new Date(record.created_at).toLocaleString()
            // )
        },
        {
            title: "Detailed ocument",
            dataIndex: "proof_document",
            key: "proof_document",
            render: (_, record) => (
                <a href={record.proof_document} target={'_blank'}>Detail</a>
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
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_, record) => (
                <Button disabled={record.status !== 2} type="primary" onClick={() => showModal(record)}>Sell credits</Button>
            )
        }
    ];


    useEffect(() => {
        if (id) {
            getProjectCredits(id.toString());
        }

    }, [id])

    return (
        <>
            <Table
                pagination={{
                    pageSize: 6,
                    position: ["bottomCenter"]
                }}
                dataSource={projectCredits}
                columns={columns} />
            <Modal width={600} open={newCreditsModalOpen} onCancel={handleModalCancel} footer={null} >
                <SellingCreditForm />
            </Modal>
        </>
    )
}