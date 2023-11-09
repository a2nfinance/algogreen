import { useEffect } from "react";
import { Button, Card, List } from "antd"
import { getFeaturedProjects } from "src/core/project";
import { useAppSelector } from "src/controller/hooks";
import { ProjectItem } from "../project/ProjectItem";
import { useRouter } from "next/router";

export const Projects = () => {
    const router = useRouter();
    const { featuredProjects } = useAppSelector(state => state.project);
    useEffect(() => {
        getFeaturedProjects();
    }, [])
    return (
        <Card title="New eco friendly projects" style={{ border: "none" }} headStyle={{ padding: 0, textTransform: "uppercase" }}
            bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}
            extra={
                <Button type="primary" onClick={() => router.push(`/project/list`)}>More</Button>
            }>
            <List
                grid={{
                    gutter: 12,
                    column: 3
                }}
                size="large"
                pagination={null}
                dataSource={featuredProjects}
                renderItem={(item, index) => (
                    <ProjectItem index={index} project={item} />
                )}

            />
        </Card>
    )
}