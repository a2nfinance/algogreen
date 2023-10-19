
import { CopyOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { useEffect } from "react";
import { useAppSelector } from "src/controller/hooks";
// import { getMembers } from "src/core";
import { useAddress } from "src/hooks/useAddress";

export const Members = () => {
    const { daoFromDB, members } = useAppSelector(state => state.daoDetail);
    const { getShortAddress } = useAddress();
    // useEffect(() => {
    //     if (daoFromDB.dao_address) {
    //         getMembers(0)
    //     }

    // }, [daoFromDB.dao_address])

    const columns = [
        {
            title: 'Address',
            key: 'wallet_address',
            dataIndex: "wallet_address",
            render: (_, record) => (

                <Button type="primary" icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(record.wallet_address)}>
                    {getShortAddress(record.wallet_address)}
                </Button>

            )
        },
        {
            title: 'Initial weight',
            key: 'weight',
            dataIndex: "weight",
        },
        {
            title: 'Created date',
            key: 'created_at',
            render: (_, record) => (

                <>{new Date(record.createdAt).toLocaleString()}</>

            )

        },
    ];

    return (

        <Table
            pagination={{
                pageSize: 6
            }}
            dataSource={
                members
            } columns={columns} />

    )
}