import { Button, Card, List, } from "antd";
import { useEffect } from "react";
import { ProjectItem } from "src/components/project/ProjectItem";
import { useAppSelector } from "src/controller/hooks";
import { getApprovedProjects } from "src/core/project";

export default function AllProjects() {
    const { allProjects } = useAppSelector(state => state.project);
    useEffect(() => {
        getApprovedProjects();
    }, [])
    return (
        <Card title="All eco friendly Projects" style={{ border: "none" }} headStyle={{ padding: 0, textTransform: "uppercase" }}
            bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}>
            <List
                grid={{
                    gutter: 12,
                    column: 3
                }}
                size="large"
                pagination={null}
                dataSource={allProjects}
                renderItem={(item, index) => (
                    <ProjectItem index={index} project={item} />
                )}

            />
        </Card>
    )
}