
import { Button, Table, Tag } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppSelector } from "src/controller/hooks";
// import { getDaoProposals } from "src/core";

export const Proposals = () => {

    const router = useRouter();
    const { proposals, daoFromDB } = useAppSelector(state => state.daoDetail);

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

    const paymentTypeMap = (pt: number) => {
        let ptype = "Instant payout"
        if (!pt) return ptype;
        switch (parseInt(pt.toString())) {
            case 1:
                ptype = "Payout"
                break;
            case 2:
                ptype = "Add member";
                break;
            case 3:
                ptype = "Remove member";
                break
            case 4:
                ptype = "Add funder";
                break
            case 5:
                ptype = "Remove funder";
                break
            case 6:
                ptype = "Add whitelisted token";
                break
            case 7:
                ptype = "Remove whitelisted token";
                break
            case 8:
                ptype = "Pause DAO";
                break
            case 9:
                ptype = "Custom";
                break
            default:
                break;
        }

        return ptype;

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
            title: 'Type',
            key: 'proposal_type',
            render: (_, record) => (
                <Tag color={colorMap(record.proposalType)}>{paymentTypeMap(record.proposal_type)}</Tag>
            )
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, record) => (
                <Tag color={colorMap(record.executed ? 2 : record.status)}>{statusMap(record.executed ? 2 : record.status)}</Tag>
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
                    //dispatch(setDaoDetailProps({att: "currentProposal", value: record}))
                    // showDrawerDetail()
                    router.push(`/proposal/${daoFromDB._id}/${record._id}`)

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
                pageSize: 20,
                position: ["bottomCenter"]
            }}
            dataSource={proposals}
            columns={columns} />

    )
}