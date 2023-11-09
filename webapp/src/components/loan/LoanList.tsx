
import { useState } from "react";
import { Button, Card, Form, Input, Modal, Space, Table, Tag } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { getAllLoans, getLoansList } from "src/core/loan";
import { LoanDetail } from "src/components/loan/LoanDetail";
import { setCurrentLoan } from "src/controller/loan/loanSlice";
import { NewProposal } from "src/components/loan/NewProposal";
import { getDAOByCreatorAndId, getDAODetailById } from "src/core/dao";

export const LoanList = () => {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { allLoans } = useAppSelector(state => state.loan);
    const [newLoanModalOpen, setNewLoanModalOpen] = useState(false);
    const [newProposalModalOpen, setNewProposalModalOpen] = useState(false);
    const showLoanModal = () => {
        setNewLoanModalOpen(true);
    };

    const handleLoanModalOk = () => {
        setNewLoanModalOpen(false);
    };

    const handleLoanModalCancel = () => {
        setNewLoanModalOpen(false);
    };



    const showProposalModal = () => {
        setNewProposalModalOpen(true);
    };

    const handleProposalModalOk = () => {
        setNewProposalModalOpen(false);
    };

    const handleProposalModalCancel = () => {
        setNewProposalModalOpen(false);
    };
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: "DAO",
            dataIndex: 'dao_id',
            key: 'dao_id',
            render: (_, record) => (
                <Button type="primary" onClick={() => router.push(`/dao/detail/${record.dao_id}`)}>view</Button>
            )
        },
        {
            title: "Maximum borrowing amount (ALGO)",
            dataIndex: "maximum_borrow_amount",
            key: "maximum_borrow_amount",
        },
        {
            title: "General interest rate (%)",
            dataIndex: "general_interest_rate",
            key: "general_interest_rate",
        },
        {
            title: "Special interest rate (%)",
            dataIndex: "special_interest_rate",
            key: "special_interest_rate",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, record) => (
                <Tag>{record.status === 1 ? "active" : "inactive"}</Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>

                    <Button type="primary" onClick={() => {
                        dispatch(setCurrentLoan(record))
                        showLoanModal()
                    }}>Detail</Button>
                    <Button type="primary" onClick={() => {
                        dispatch(setCurrentLoan(record));
                        getDAODetailById(record.dao_id);
                        showProposalModal()
                    }}>Apply</Button>

                </Space>

            )

        },
    ];


    useEffect(() => {

        getAllLoans()


    }, [])

    return (
        <>
            <Table
                pagination={{
                    pageSize: 20,
                    position: ["bottomCenter"]
                }}
                dataSource={allLoans}
                columns={columns} />
            <Modal width={600} open={newLoanModalOpen} onOk={handleLoanModalOk} onCancel={handleLoanModalCancel} footer={null}>
                <LoanDetail />
            </Modal>
            <Modal width={600} open={newProposalModalOpen} onCancel={handleProposalModalCancel} footer={null}>
                <NewProposal />
            </Modal>
        </>

    )
}