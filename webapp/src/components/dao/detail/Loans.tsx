
import { Button, Table, Tag } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppSelector } from "src/controller/hooks";
import { getLoansList } from "src/core/loan";

export const Loans = () => {

    const router = useRouter();
    const {id} = router.query;
    const {loans} = useAppSelector(state => state.daoDetail);

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
            dataIndex: "maximum_borrow_amount",
            key: "maximum_borrow_amount",
            // render: (_, record) => (
            //     new Date(record.created_at).toLocaleString()
            // )
        },
        {
            title: "General rate",
            dataIndex: "general_interest_rate",
            key: "general_interest_rate",
        },
        {
            title: "Special rate",
            dataIndex: "special_interest_rate",
            key: "special_interest_rate",
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


    useEffect(() => {
        if (id) {
            getLoansList(id.toString())
        }

    }, [id])

    return (

        <Table
            pagination={{
                pageSize: 20,
                position: ["bottomCenter"]
            }}
            dataSource={loans}
            columns={columns} />

    )
}