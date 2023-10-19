import { Button, Card, Descriptions, Space } from 'antd';
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
    <Card key={`dao-${index}`} title={project.title}
      extra={
        <Button type='primary' onClick={() => router.push(`/project/detail/${project.id}`)}>View Detail</Button>
      }
      style={{ margin: 5, backgroundColor: "#f5f5f5" }}
      headStyle={headStyle}>

      <Descriptions layout={"vertical"} column={2}>

        {/* <Descriptions.Item label={"Type"}>{daoTypeMap[dao.dao_type]}</Descriptions.Item> */}
        {/* <Descriptions.Item label={"Open"}>{dao.submission_policy === 1 ? "No (Invited members only)" : "Yes (Open to all)" }</Descriptions.Item> */}
        <Descriptions.Item label={"Description"}>{project.description}</Descriptions.Item>
        <Descriptions.Item label={"Status"}>{project.status}</Descriptions.Item>
        {/* <Descriptions.Item label={"Address"}>
          <Space wrap>
            <Button icon={<LinkOutlined />} onClick={() => window.open(getObjectExplorerURL(dao.dao_address), "_blank")}>{getShortAddress(dao.dao_address)}</Button>
            <Button icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(dao.dao_address)}></Button>
          </Space>
        </Descriptions.Item> */}
       
      </Descriptions>
    </Card>
  );
}