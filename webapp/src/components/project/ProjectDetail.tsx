import { Button, Descriptions, Divider, Space } from "antd"

export const ProjectDetail = () => {
    const project = {
        id: 1,
        type: "",
        genre: "",
        title: "",
        description: "",
        owner: "",
        documents: [
            { title: "", link: "" },
            { title: "", link: "" },
            { title: "", link: "" }
        ],
        social_networks: {
            twitter: "",
            telegram: "",
            discord: ""
        },
        status: 1
    }
    return (
        <>
            <Descriptions title="General" layout="vertical">
                <Descriptions.Item label="Title">{project.title}</Descriptions.Item>

                <Descriptions.Item label="Genre">{project.genre}</Descriptions.Item>
                <Descriptions.Item label="Owner">{project.owner}</Descriptions.Item>
                <Descriptions.Item label="Type">{project.type}</Descriptions.Item>
                <Descriptions.Item label="Status">{project.status}</Descriptions.Item>
                <Descriptions.Item label="Social Networks">{project.description}</Descriptions.Item>
            </Descriptions>
            <Descriptions title={"Details"} layout="vertical" column={2}>
                <Descriptions.Item label="Short description">{project.description}</Descriptions.Item>
                <Descriptions.Item label="Documents">{project.description}</Descriptions.Item>

            </Descriptions>

            <Divider />
            <Space>
                <Button type="primary" size="large">Submit carbon credits approval</Button>
                <Button type="primary" size="large">Apply to a loan</Button>
            </Space>
            <Divider />

        </>
    )
}