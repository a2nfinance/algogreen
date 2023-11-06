import { CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Divider, Space, Tag } from 'antd';
import { DAO } from 'src/controller/dao/daoSlice';
import { useAppSelector } from 'src/controller/hooks';
import { TESTNET_EXPLORER, daoTypeMap } from 'src/core/constant';
import { useAddress } from 'src/hooks/useAddress';
import { headStyle } from 'src/theme/layout';


export const DetailItem = () => {
  const { daoFromDB } = useAppSelector(state => state.daoDetail)

  return (
    <Card title={daoFromDB.organization_name} headStyle={headStyle} style={{ backgroundColor: "#f5f5f5" }}>
      <Descriptions title={"Organization"} layout={"vertical"} column={2}>
        <Descriptions.Item label={"Owner"}>{daoFromDB.owner}</Descriptions.Item>

        <Descriptions.Item label={"City"}>{daoFromDB.city ? daoFromDB.city : "N/A"}</Descriptions.Item>
        <Descriptions.Item label={"State"}>{daoFromDB.state ? daoFromDB.state : "N/A"}</Descriptions.Item>
        <Descriptions.Item label={"Zipcode"}>{daoFromDB.zipcode ? daoFromDB.zipcode : "N/A"}</Descriptions.Item>
        <Descriptions.Item label={"Country"}>{daoFromDB.country ? daoFromDB.country : "N/A"}</Descriptions.Item>
        <Descriptions.Item label={"Email"}>{daoFromDB.email}</Descriptions.Item>
        <Descriptions.Item label={"Phone number"}>{daoFromDB.phone_number}</Descriptions.Item>
        <Descriptions.Item label={"Status"}><Tag color="green">Verified</Tag></Descriptions.Item>
      </Descriptions>
      <Divider />
      <Descriptions layout={"vertical"} column={1}>
        <Descriptions.Item label={"Address"}>{daoFromDB.address}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <Descriptions layout={"vertical"} column={1}>
        <Descriptions.Item label="Description">{daoFromDB.description}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <Descriptions title="Social networks" column={2}>
        <Descriptions.Item label={"Website"}>{daoFromDB.website ? <a href={daoFromDB.website} target='_blank'><LinkOutlined /></a> : "N/A"}</Descriptions.Item>
        <Descriptions.Item label={"Twitter"}>{daoFromDB.twitter ? <a href={daoFromDB.twitter} target='_blank'><LinkOutlined /></a> : "N/A"}</Descriptions.Item>
        <Descriptions.Item label={"Telegram"}>{daoFromDB.telegram ? <a href={daoFromDB.telegram} target='_blank'><LinkOutlined /></a> : "N/A"}</Descriptions.Item>
        <Descriptions.Item label={"Facebook"}>{daoFromDB.facebook ? <a href={daoFromDB.facebook} target='_blank'><LinkOutlined /></a> : "N/A"}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <Descriptions layout='vertical' title={"DAO"} column={2}>
        <Descriptions.Item label={"Title"}>{daoFromDB.dao_title}</Descriptions.Item>
        <Descriptions.Item label={"Quorum"}>{daoFromDB.quorum} %</Descriptions.Item>
        <Descriptions.Item label={"Passing threshold"}>{daoFromDB.passing_threshold} %</Descriptions.Item>
        <Descriptions.Item label={"Submission policy"}>{daoFromDB.submission_policy ? "Everyone" : "Only Members"}</Descriptions.Item>
        <Descriptions.Item label={"DAO token name"}>{daoFromDB.token_name}</Descriptions.Item>
        <Descriptions.Item label={"DAO token supply"}>{daoFromDB.token_supply}</Descriptions.Item>
        <Descriptions.Item label={"DAO ID"}><a href={`${TESTNET_EXPLORER}/${daoFromDB.dao_app_id}`} target="_blank">{daoFromDB.dao_app_id}</a></Descriptions.Item>
        <Descriptions.Item label={"Token ID"}><a href={`${TESTNET_EXPLORER}/${daoFromDB.dao_app_id}`} target="_blank">{daoFromDB.token_id}</a></Descriptions.Item>
      </Descriptions>
    </Card>
  );
}