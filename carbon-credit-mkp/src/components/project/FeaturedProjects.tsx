import { Col, Row, List } from "antd";
import { useEffect } from "react";
import { useAppSelector } from "src/controller/hooks";
// import { getDaos } from "src/core";
import { Item } from "./Item";

export const FeaturedProjects = () => {
    // const { featuredProjects } = useAppSelector(state => state.project)
    const featuredProjects = [1,2,3].map( m=> {
        return {
            title: `${m} title`,
            description: `${m} description`
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
            // pagination={{
            //     onChange: (page) => {
            //         console.log(page);
            //     },
            //     pageSize: 3,
            //     align: "center",
            // }}
            dataSource={featuredProjects}
            renderItem={(item, index) => (
                <Item index={index} project={item} />
            )}
        />

    )
}

