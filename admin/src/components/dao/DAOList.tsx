import { List } from "antd";
import { useEffect } from "react";
import { useAppSelector } from "src/controller/hooks";
import { getPendingDAOs } from "src/core/dao";
import { Item } from "./Item";

export const DAOList = () => {
    const {daos} = useAppSelector(state => state.dao)
    useEffect(() => {
        getPendingDAOs()
    }, [])
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
            dataSource={daos}
            renderItem={(item, index) => (
                <Item index={index} daoFromDB={item} />
            )}
        />

    )
}

