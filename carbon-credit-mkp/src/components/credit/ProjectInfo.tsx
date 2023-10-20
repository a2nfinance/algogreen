import { CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Space } from 'antd';
// import { DetailItemSekeleton } from 'src/components/common/DetailItemSkeleton';
// import { DAO } from 'src/controller/dao/daoSlice';
import { useAppSelector } from 'src/controller/hooks';
// import { daoTypeMap } from 'src/core/constant';
// import { useAddress } from 'src/hooks/useAddress';
import { headStyle } from 'src/theme/layout';


export const ProjectInfo = () => {
//   const { getShortAddress, getObjectExplorerURL } = useAddress();
//   const { daoFromDB } = useAppSelector(state => state.daoDetail)

const projectFromDB = {
    title: "Test project",
    project_type: "Eco",
    description: "Eco project",
    owner: "AAAAAAA",
    twitter: "https://google.com",
    github: "https://google.com",
    discord: "https://google.com",
    created_at: new Date()
}

  return (
    <Card title={projectFromDB.title} style={{ backgroundColor: "#f5f5f5" }} headStyle={headStyle}>

      <Descriptions layout={"vertical"} column={1}>
        <Descriptions.Item label={"Type"}>{projectFromDB.project_type}</Descriptions.Item>
        <Descriptions.Item label={"Description"}>{projectFromDB.description}</Descriptions.Item>
        {/* <Descriptions.Item label={"Treasury"}>
          <Space wrap>
            <Button icon={<LinkOutlined />} onClick={() => window.open(getObjectExplorerURL(daoFromDB.treasury_address), "_blank")}>{getShortAddress(daoFromDB.treasury_address)}</Button>
            <Button icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(daoFromDB.treasury_address)}></Button>
          </Space>
        </Descriptions.Item> */}
        {/* <Descriptions.Item label={"Quorum (%)"}>{daoFromDB.quorum}</Descriptions.Item>
        <Descriptions.Item label={"Passing threshold (%)"}>{daoFromDB.passing_threshold}</Descriptions.Item> */}
        <Descriptions.Item label={"Created date"}>{new Date(projectFromDB.created_at).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label={"KYC"}>
          {(projectFromDB.twitter || projectFromDB.github || projectFromDB.discord) ? <Space wrap direction='horizontal'>
            {projectFromDB.twitter && <a key={`social-link-twitter`} target='_blank' href={projectFromDB.twitter}>Twitter</a>}
            {projectFromDB.github && <a key={`social-link-github`} target='_blank' href={projectFromDB.github}>Github</a>}
            {projectFromDB.discord && <a key={`social-link-discord`} target='_blank' href={projectFromDB.discord}>Discord</a>}
          </Space> : <>No</>}
        </Descriptions.Item>
      </Descriptions>
      {/* <Space wrap>
        {
          dao.open && <Button type='primary' loading={join.processing} onClick={() => joinDao(wallet, dao.id)} ghost>Join</Button>
        }
      </Space> */}
    </Card>
  );
}