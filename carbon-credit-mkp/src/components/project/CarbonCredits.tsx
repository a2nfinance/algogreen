import { Button, Table, Tag } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppSelector } from "src/controller/hooks";
import { getProjectCredits } from "src/core/credit";

export const CarbonCredits = () => {
    const router = useRouter();
    const { id } = router.query;
    const { projectCredits } = useAppSelector(state => state.credit)
 
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

        },
        {
            title: "ALLOW AUCTION",
            dataIndex: "allow_auction",
            key: "allow_auction",
            render: (_, record) => (
                record.allow_auction ? <Tag color="green">yes</Tag> : <Tag color="red">no</Tag>
            )
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "proof_document",
            render: (_, record) => (
                <Tag color="green">verified</Tag>
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
            title: "ACTION",
            dataIndex: "action",
            key: "action",
            render: (_, record) => (
                <Button type="primary" onClick={() => router.push(`/credit/detail/${record._id}`)}>Buy now</Button>
            )
        }
    ];


    useEffect(() => {
        if (id) {
            getProjectCredits(id.toString());
        }

    }, [id])

    return (

        <Table
            pagination={{
                pageSize: 6,
                position: ["bottomCenter"]
            }}
            dataSource={projectCredits}
            columns={columns} />

    )
}