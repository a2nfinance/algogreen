
import { CopyOutlined } from "@ant-design/icons";
import { Button, Drawer, Modal, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { NewPayoutFromTask } from "src/components/proposal/NewPayoutFromTask";
import { useAppSelector } from "src/controller/hooks";
import { getOpenTasks } from "src/core";
import { neoToken } from "src/core/constant";
import { useAddress } from "src/hooks/useAddress";

export const OpenTasks = () => {
    const { daoFromDB, openTasks } = useAppSelector(state => state.daoDetail);
    const { account } = useAppSelector(state => state.account);
    const { getShortAddress } = useAddress();
    const [initialValues, setInitialValues] = useState({

        title: ``,
        content: ``,
        proposal_type: 1,
        token: neoToken,
        allow_early_execution: 1,
        recipients: [

        ],
        task_id: ''
    });

    const [currentDescription, setCurrentDescription] = useState("");
    const [openDescriptionModal, setOpenDescriptionModal] = useState(false);

    const [open, setOpen] = useState(false);

    const onClose = () => {
        setOpen(false);
    };

    const handleCloseModal = () => {
        console.log("hello")
        setOpenDescriptionModal(false)
    }


    useEffect(() => {
        if (daoFromDB.dao_address) {
            getOpenTasks()
        }

    }, [daoFromDB.dao_address])

    const handleRequestReward = useCallback((record) => {

        setInitialValues({
            ...initialValues,
            title: `Request reward task: #${record.title}`,
            content: `I completed this task and want to recieve the reward`,
            recipients: [
                { address: account, amount: record.reward }
            ],
            task_id: record._id

        })

        setOpen(true);
    }, [account, open, initialValues])

    const handleDescriptionDetails = useCallback((record) => {
        setCurrentDescription(record.description)
        setOpenDescriptionModal(true);
    }, [openDescriptionModal])
    const columns = [
        {
            title: 'Created by',
            key: 'owner',
            dataIndex: "owner",
            render: (_, record) => (

                <Button type="primary" icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(record.owner)}>
                    {getShortAddress(record.owner)}
                </Button>

            )
        },
        {
            title: 'Title',
            key: 'title',
            dataIndex: "title"
        },
        {
            title: 'Reward (NEO)',
            key: 'reward',
            dataIndex: "reward"
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: "status"
        },
        {
            title: 'Description',
            key: 'description',
            dataIndex: "description",
            render: (_, record) => (

                <Button onClick={() => handleDescriptionDetails(record)}>Details</Button>

            )
        },
        {
            title: 'Created date',
            key: 'created_at',
            render: (_, record) => (

                <>{new Date(record.created_at).toLocaleString()}</>

            )

        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (

                <Button type="primary" disabled={!account} onClick={() => handleRequestReward(record)}>Request rewards</Button>

            )

        },
    ];

    return (
        <>
            <Table
                pagination={{
                    pageSize: 6
                }}
                dataSource={
                    openTasks
                } columns={columns} />
            <Drawer title="New Proposal" size="large" placement="right" onClose={onClose} open={open}>
                <NewPayoutFromTask initialValues={initialValues} />
            </Drawer>
            <Modal title="Description" open={openDescriptionModal} onCancel={handleCloseModal} onOk={handleCloseModal} footer={[]}>

                <div
                    dangerouslySetInnerHTML={{ __html: currentDescription }}
                />
            </Modal>
        </>

    )
}