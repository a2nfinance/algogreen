import { Card, List } from "antd";
import { useEffect } from "react";
import { useAppSelector } from "src/controller/hooks";
import { getPendingDAOs } from "src/core/dao";
import { Item } from "./Item";

export const DAOList = () => {
    const { daos } = useAppSelector(state => state.dao)
    useEffect(() => {
        getPendingDAOs()
    }, [])
    return (
        <Card title="All pending DAOs" style={{ border: "none" }} headStyle={{ padding: 0, textTransform: "uppercase" }}
            bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}>
            <List
                grid={{
                    gutter: 12,
                    column: 3
                }}
                size="large"
                pagination={false}
                dataSource={daos}
                renderItem={(item, index) => (
                    <Item index={index} daoFromDB={item} />
                )}
            />
        </Card>

    )
}

