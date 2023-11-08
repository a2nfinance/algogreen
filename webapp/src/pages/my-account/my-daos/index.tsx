import { useWallet } from "@txnlab/use-wallet";
import { List } from "antd";
import { useEffect } from "react";
import { Item } from "src/components/dao/Item";
import { useAppSelector } from "src/controller/hooks";
import { getOwnerDAOs } from "src/core/dao";


export default function Index() {
    const { activeAccount } = useWallet();
    const { ownerDaos } = useAppSelector(state => state.dao)
    useEffect(() => {
        if (activeAccount?.address) {
            getOwnerDAOs(activeAccount?.address);
        }

    }, [activeAccount?.address])
    return (
        <List
            grid={{
                gutter: 12,
                column: 3
            }}
            size="large"
            pagination={{
                onChange: (page) => {
                    console.log(page);
                },
                pageSize: 9,
                align: "center",
            }}
            dataSource={ownerDaos}
            renderItem={(item, index) => (
                <Item index={index} daoFromDB={item} />
            )}
        />

    )
}

