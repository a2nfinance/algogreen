
import { Button, Modal, Table, Tag } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ProposalDetail } from "src/components/proposal/ProposalDetail";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { setProposalState } from "src/controller/proposal/proposalSlice";
import { getDAOProposals, getOnchainProposal } from "src/core/proposal";

export const Proposals = () => {
    const { daoProposals } = useAppSelector(state => state.proposal);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { id } = router.query;
    const [newProposalModalOpen, setNewProposalModalOpen] = useState(false);
    const showProposalModal = () => {
        setNewProposalModalOpen(true);
    };

    const handleProposalModalOk = () => {
        setNewProposalModalOpen(false);
    };

    const handleProposalModalCancel = () => {
        setNewProposalModalOpen(false);
    };

    const colorMap = (pt: number) => {
        let color = "blue";
        if (!pt) return color;
        switch (parseInt(pt.toString())) {
            case 1:
                color = "blue"
                break;
            case 2:
                color = "geekblue";
                break;
            case 3:
                color = "purple";
                break
            default:
                break;
        }
        return color;
    }

    const statusMap = (status: number) => {
        let st = "active"
        if (!status) return st;
        switch (parseInt(status.toString())) {
            case 1:
                st = "active"
                break;
            case 2:
                st = "completed";
                break;
            case 3:
                st = "completed";
                break
            default:
                break;
        }

        return st;

    }

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: "Executed",
            dataIndex: "executed",
            key: "executed",
            render: (_, record) => (
                <Tag color={colorMap(record.executed)}>{record.executed ? "Yes" : "Not yet"}</Tag>
            )
        },
        {
            title: "Repaid",
            dataIndex: "is_repaid",
            key: "is_repaid",
            render: (_, record) => (
                <Tag color={colorMap(record.is_repaid)}>{record.is_repaid ? "Yes" : "Not yet"}</Tag>
            )
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            key: "created_at",
            render: (_, record) => (
                new Date(record.created_at).toLocaleString()
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="primary" onClick={() => {
                    console.log(record);
                    dispatch(setProposalState({att: "proposal", value: record}));
                    getOnchainProposal(record.proposal_app_id);
                    showProposalModal();
                }}>Detail</Button>
            )

        },
    ];


    useEffect(() => {
        if (id) {
            getDAOProposals(id.toString());
        }

    }, [id])

    return (
        <>
            <Table
                pagination={{
                    pageSize: 20,
                    position: ["bottomCenter"]
                }}
                dataSource={daoProposals}
                columns={columns} />
                <Modal width={600} open={newProposalModalOpen} onCancel={handleProposalModalCancel} footer={null} >
                    <ProposalDetail />
                </Modal>
        </>

    )
}