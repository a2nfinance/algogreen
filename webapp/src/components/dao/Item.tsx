import { Button, Card, Descriptions, Divider, Space, Tag } from 'antd';
import { useRouter } from 'next/router';
import { useAppDispatch } from 'src/controller/hooks';
import { headStyle } from 'src/theme/layout';

export const Item = ({ index, daoFromDB }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  return (
    <Card key={`dao-${index}`} title={daoFromDB.organization_name}  headStyle={headStyle} style={{ margin: 5, backgroundColor: "#f5f5f5" }} extra={
      <Space>
            {daoFromDB.status === 3 ? <Button type='primary' onClick={() => router.push(`/dao/detail/${daoFromDB._id}`)}>View details</Button> 
            : <Button type='primary' onClick={() => router.push(`/dao/edit/${daoFromDB._id}`)}>Edit</Button>
            }
      </Space>
     
    }>
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
    </Card>
  );
}