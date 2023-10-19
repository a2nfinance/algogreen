import { Button, Table } from "antd";
import { useRouter } from "next/router";

export const ProposalList = () => {
    const router = useRouter();
    const creditList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(m => ({
        id: m,
        title: `Title ${m}`,
        description: `Description ${m}`,
        dao_id: `DAO ${m}`,
        loan_id: `loan ${m}`,
        amount: 10,
        created_at: `${m}`,
        status: `status ${m}`,
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
                <>Detail</>
            )
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            // render: (_, record) => (
            //     new Date(record.created_at).toLocaleString()
            // )
        },
        {
            title: "DAO",
            dataIndex: "dao_id",
            key: "dao_id",
            // render: (_, record) => (
            //     new Date(record.created_at).toLocaleString()
            // )
        },
        {
            title: "Apply to",
            dataIndex: "loan_id",
            key: "loan_id",
            // render: (_, record) => (
            //     new Date(record.created_at).toLocaleString()
            // )
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