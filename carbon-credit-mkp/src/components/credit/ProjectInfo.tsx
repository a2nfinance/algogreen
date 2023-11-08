import { LinkOutlined } from '@ant-design/icons';
import { Card, Descriptions, Divider, Tag } from 'antd';
import { useAppSelector } from 'src/controller/hooks';

import { headStyle } from 'src/theme/layout';


export const ProjectInfo = () => {
  const { project } = useAppSelector(state => state.credit);

  return (
    <Card title={`Project: ${project.project_name}`} style={{ backgroundColor: "#f5f5f5" }} headStyle={headStyle}>

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
    </Card>
  );
}