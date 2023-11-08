import { LinkOutlined } from "@ant-design/icons";
import { Button, Descriptions, Divider, Modal, Space, Tag } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { ProjectItem, setProjectState } from "src/controller/project/projectSlice";
import { getProjectById, updateProject } from "src/core/project";

export const ProjectDetail = () => {
    const dispatch = useAppDispatch();
    const { id } = useRouter().query;
    const { project } = useAppSelector(state => state.project);

    const [approveModal, setApprovalModal] = useState(false);
    const [rejectModal, setRejectModal] = useState(false);
    const showModal = () => {
        setApprovalModal(true);
    };

    const handleModalOk = () => {
        setApprovalModal(false);
    };

    const handleModalCancel = () => {
        setApprovalModal(false);
    };


    const showRejectModal = () => {
        setRejectModal(true);
    };

    const handleRejectModalOk = () => {
        setRejectModal(false);
    };

    const handleRejectModalCancel = () => {
        setRejectModal(false);
    };

    const handleApprove = () => {
        showModal();
    }
    const handleReject = () => {
        showRejectModal();
    }
    useEffect(() => {
        if (id) {
            getProjectById(id.toString());
        }
    }, [id])
    return (
        <>
            <Descriptions column={3}>
                <Descriptions.Item>{project.project_name}</Descriptions.Item>
                <Descriptions.Item>
                <Space>
                    <Button type="primary" onClick={() => handleApprove()}>Approve</Button>
                    <Button onClick={() => handleReject()}>Reject</Button>
                </Space>
                </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions layout={"vertical"} column={3}>
                <Descriptions.Item label={"Project leader"}>{project.project_leader}</Descriptions.Item>
                <Descriptions.Item label={"Location"}>{project.project_location}</Descriptions.Item>
                <Descriptions.Item label={"Start date"}>{project.start_date ? new Date(project.start_date).toLocaleString() : ""}</Descriptions.Item>
                <Descriptions.Item label={"End date"}>{project.end_date ? new Date(project.end_date).toLocaleString() : ""}</Descriptions.Item>
                <Descriptions.Item label={"Carbon offset project"}>{project.is_eco_project ? "Yes" : "No"}</Descriptions.Item>
                <Descriptions.Item label={"Status"}>
                    {
                        (project.status === 0) && <Tag color='default'>not verified</Tag>
                    }
                    {
                        (project.status === 1) && <Tag color='green'>verified</Tag>
                    }
                    {
                        (project.status === 2) && <Tag color='red'>rejected</Tag>
                    }
                </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions column={3}>
                <Descriptions.Item label={"Document"}>{project.detail_document ? <a href={project.detail_document} target='_blank'><LinkOutlined /></a> : "N/A"}</Descriptions.Item>
                <Descriptions.Item label={"Video"}>{project.video ? <a href={project.video} target='_blank'><LinkOutlined /></a> : "N/A"}</Descriptions.Item>
                <Descriptions.Item label={"Twitter"}>{project.twitter ? <a href={project.twitter} target='_blank'><LinkOutlined /></a> : "N/A"}</Descriptions.Item>
                <Descriptions.Item label={"Telegram"}>{project.telegram ? <a href={project.telegram} target='_blank'><LinkOutlined /></a> : "N/A"}</Descriptions.Item>
                <Descriptions.Item label={"Github"}>{project.github ? <a href={project.github} target='_blank'><LinkOutlined /></a> : "N/A"}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions layout='vertical'>
                <Descriptions.Item label={"Short description"}>{project.short_description}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions layout='vertical'>
                <Descriptions.Item label={"Description"}>
                    <div
                        dangerouslySetInnerHTML={{ __html: project.description }}
                    />
                </Descriptions.Item>
            </Descriptions>
            <Modal title="Approve" open={approveModal} onCancel={handleModalCancel} footer={null} >
                <p>Do you want to approve this project?</p>
                <Button type="primary" size="large" onClick={() => updateProject(1)}>Yes</Button>
            </Modal>
            <Modal title="Reject" open={rejectModal} onCancel={handleRejectModalCancel} footer={null} >
                <p>Do you want to reject this project?</p>
                <Button  type="primary" size="large" onClick={() => updateProject(2)}>Yes</Button>
            </Modal>
        </>
    )
}