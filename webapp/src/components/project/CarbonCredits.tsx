import { Badge, Button, Table, Tag } from "antd";
import { useRouter } from "next/router";
import { useStatus } from "src/hooks/useStatus";

export const CarbonCredits = () => {
    const router = useRouter();
    const {getCreditStatus} = useStatus();
    const creditList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(m => ({
        id: m,
        title: m,
        description: m,
        amount: m,
        documents: [
            {title: "", link: ""}
        ],
        project_id: m,
        status: 1,
        created_at: m
    }));

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (_, record) => (
                <Button>Detail</Button>
            )
        },
        {
            title: "Amount (kilogram)",
            dataIndex: "amount",
            key: "amount",
            // render: (_, record) => (
            //     new Date(record.created_at).toLocaleString()
            // )
        },
        {
            title: "Proof documents",
            dataIndex: "documents",
            key: "documents",
            render: (_, record) => (
               <Button>Detail</Button>
            )
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
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, record) => (
                <Tag>{getCreditStatus(record.status)}</Tag>
            )
        }
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