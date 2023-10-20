
import { Button, Table, Tag } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppSelector } from "src/controller/hooks";

export const MyList = () => {

    const router = useRouter();
    // const { proposals, daoFromDB } = useAppSelector(state => state.daoDetail);
    const creditList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(m => ({
        id: m,
        title: `Title ${m}`,
        created_at: `${m}`,
        status: `status ${m}`,
        type: `Type: ${m}`,
        reduce_emission: `${m} KG`,
        project: `${m} project`,
        auction: `${m} auction`
    }));

    const statusMap = (status: number) => {
        let st = "Not verified"
        if (!status) return st;
        switch (parseInt(status.toString())) {
            case 1:
                st = "Not verified"
                break;
            case 2:
                st = "Verified";
                break;
            case 3:
                st = "Selling";
                break
            case 3:
                st = "Completed";
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
            title: 'Type',
            key: 'proposal_type',
            dataIndex: "type"
            // render: (_, record) => (
            //     <Tag color={colorMap(record.proposalType)}>{paymentTypeMap(record.proposal_type)}</Tag>
            // )
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
            title: "Reduce Emission",
            dataIndex: "reduce_emission",
            key: "reduce_emission",
            // render: (_, record) => (
            //     new Date(record.created_at).toLocaleString()
            // )
        },
        {
            title: "Project",
            dataIndex: "project",
            key: "project",
            // render: (_, record) => (
            //     new Date(record.created_at).toLocaleString()
            // )
        },
        {
            title: "Auction",
            dataIndex: "auction",
            key: "auction",
            // render: (_, record) => (
            //     new Date(record.created_at).toLocaleString()
            // )
        },
        {
            title: "Created At",
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
                    router.push(`/credit/detail/${record.id}`)

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