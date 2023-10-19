import { Button, Table } from "antd";
import { useRouter } from "next/router";

export const RecievedLoan = () => {
    const router = useRouter();
    const creditList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(m => ({
        contract_id: m,
        proposal_id: m,
        loan_id: m,
        available_amount: `balance ${m}`,
        created_at: `${m}`,
        rate: `rate ${m}`,
        request_amount: `rq`,
        next_pay_date: `rq`
    }));

    const columns = [
        {
            title: 'Contract',
            dataIndex: 'contract_id',
            key: 'contract_id',
        },
        {
            title: 'Proposal',
            dataIndex: 'proposal_id',
            key: 'proposal_id',
            render: (_, record) => (
                <>Detail</>
            )
        },
        {
            title: "Loan",
            dataIndex: "loan_id",
            key: "loan_id",
            // render: (_, record) => (
            //     new Date(record.created_at).toLocaleString()
            // )
        },
        {
            title: "Available amount",
            dataIndex: "available_amount",
            key: "available_amount",
            // render: (_, record) => (
            //     new Date(record.created_at).toLocaleString()
            // )
        },
        {
            title: "Requested amount",
            dataIndex: "request_amount",
            key: "request_amount",
            // render: (_, record) => (
            //     new Date(record.created_at).toLocaleString()
            // )
        },
        {
            title: "Borrow rate",
            dataIndex: "rate",
            key: "rate",
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
            title: "Next pay date",
            dataIndex: "next_pay_date",
            key: "next_pay_date",
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
                    // router.push(`/loan/detail/${record.id}`)

                }}>withdraw</Button>
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