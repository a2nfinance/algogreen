import { Button, Card, Descriptions, Divider, Space, Tag } from 'antd';
// import { joinDao } from 'src/core';
import { CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
// import { daoTypeMap } from 'src/core/constant';
// import { useAddress } from 'src/hooks/useAddress';
import { headStyle } from 'src/theme/layout';

export const Item = ({ index, project }) => {
  const router = useRouter();
  //   const { getShortAddress, getObjectExplorerURL, editDaoLinkWithStatus } = useAddress();

  return (
    <Card key={`project-${index}`} title={project.project_name}
      extra={
        <Button type='primary' onClick={() => router.push(`/project/detail/${project._id}`)}>View Detail</Button>
      }
      style={{ margin: 5, backgroundColor: "#f5f5f5" }}
      headStyle={headStyle}>

      <Descriptions layout={"vertical"} column={2}>
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
      <Descriptions layout='vertical'>
        <Descriptions.Item label={"Short description"}>{project.short_description}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
}