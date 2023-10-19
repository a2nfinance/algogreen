
import { Button, Table, Tag } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppSelector } from "src/controller/hooks";

export const DAOLoans = () => {

    const router = useRouter();
    // const { proposals, daoFromDB } = useAppSelector(state => state.daoDetail);
    const creditList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(m => ({
        id: m,
        title: `Title ${m}`,
        created_at: `${m}`,
        status: `status ${m}`,
        dao_id: `DAO ${m}`,
        general_rate: `Rate ${m}`,
        special_rate: `SR ${m}`,
        start_date: `std ${m}`,
        end_date: `ed ${m}`,
        amount: 10
    }));

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            // render: (_, record) => (
            //     <Tag color={colorMap(record.executed ? 2 : record.status)}>{statusMap(record.executed ? 2 : record.status)}</Tag>
            // )
        },
        {
            title: "Limited amount (ALG)",
            dataIndex: "amount",
            key: "amount",
            // render: (_, record) => (
            //     new Date(record.created_at).toLocaleString()
            // )
        },
        {
            title: "General rate",
            dataIndex: "general_rate",
            key: "general_rate",
        },
        {
            title: "Special rate",
            dataIndex: "special_rate",
            key: "special_rate",
        },
        {
            title: "Created at",
            dataIndex: "created_at",
            key: "created_at",
            // render: (_, record) => (
            //     new Date(record.created_at).toLocaleString()
            // )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="primary" onClick={() => {
                    //dispatch(setDaoDetailProps({att: "currentProposal", value: record}))
                    // showDrawerDetail()
                    router.push(`/loan/detail/${record.id}`)

                }}>Detail</Button>
            )

        },
    ];


    // useEffect(() => {
    //     if (daoFromDB.dao_address) {
    //         getDaoProposals(daoFromDB.dao_address);
    //     }

    // }, [daoFromDB.dao_address])

    return (

        <Table
            pagination={{
                pageSize: 6,
                position: ["bottomCenter"]
            }}
            dataSource={creditList}
            columns={columns} />

    )
}