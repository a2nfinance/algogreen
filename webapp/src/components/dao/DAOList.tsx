import { Col, Row, List } from "antd";
import { useEffect } from "react";
import { useAppSelector } from "src/controller/hooks";
// import { getDaos } from "src/core";
import { Item } from "./Item";

export const DAOList = () => {
    // const { featuredProjects } = useAppSelector(state => state.project)
    const featuredDAOs = [1,2,3,4,5,6,7,8,9,10].map( m=> {
        return {
            id: m,
            title: `${m} title`,
            description: `${m} description`,
            status: 0
        }
    })
    useEffect(() => {
        // getDaos()
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
            dataSource={featuredDAOs}
            renderItem={(item, index) => (
                <Item index={index} dao={item} />
            )}
        />

    )
}

