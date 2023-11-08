import { Col, Row, List } from "antd";
import { useEffect } from "react";
import { useAppSelector } from "src/controller/hooks";
// import { getDaos } from "src/core";
import { Item } from "./Item";
import { getApprovedProjects } from "src/core/project";

export const ProjectList = () => {
    const { allApprovedProjects } = useAppSelector(state => state.project)
    useEffect(() => {
        getApprovedProjects();
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
            dataSource={allApprovedProjects}
            renderItem={(item, index) => (
                <Item index={index} project={item} />
            )}
        />

    )
}

