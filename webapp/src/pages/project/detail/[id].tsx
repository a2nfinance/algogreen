import { Button, Divider, Space } from "antd";
import { ProjectDetail } from "src/components/project/ProjectDetail";
import { ProjectTabs } from "src/components/project/ProjectTabs";

export default function ID() {
    return (
        <>
            <ProjectDetail />
            <Divider/>
            <Space>
                <Button type="primary" size="large">Borrow ALGO from DAOS</Button>
                <Button type="primary" size="large">Submit carbon offset credits</Button>
            </Space>
            <Divider/>
            <ProjectTabs />
        </>
    )
}