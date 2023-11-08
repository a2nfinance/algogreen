import { LinkOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Divider, Modal, Space, Tag } from 'antd';
import { useState } from 'react';
import { useAppSelector } from 'src/controller/hooks';
import { updateDao } from 'src/core/dao';
import { headStyle } from 'src/theme/layout';


export const DetailItem = () => {
  const { daoFromDB } = useAppSelector(state => state.daoDetail)
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
  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <Card title={daoFromDB.organization_name} headStyle={headStyle} style={{ backgroundColor: "#f5f5f5" }}
        extra={
          <Space>
            <Button disabled={daoFromDB.status !== 0} type="primary" onClick={() => handleApprove()}>Approve</Button>
            <Button disabled={daoFromDB.status !== 0} onClick={() => handleReject()}>Reject</Button>
          </Space>
        }
      >
        <Descriptions title={"Organization"} layout={"vertical"} column={3}>
          <Descriptions.Item label={"Owner"}>{daoFromDB.owner}</Descriptions.Item>

          <Descriptions.Item label={"City"}>{daoFromDB.city ? daoFromDB.city : "N/A"}</Descriptions.Item>
          <Descriptions.Item label={"State"}>{daoFromDB.state ? daoFromDB.state : "N/A"}</Descriptions.Item>
          <Descriptions.Item label={"Zipcode"}>{daoFromDB.zipcode ? daoFromDB.zipcode : "N/A"}</Descriptions.Item>
          <Descriptions.Item label={"Country"}>{daoFromDB.country ? daoFromDB.country : "N/A"}</Descriptions.Item>
          <Descriptions.Item label={"Email"}>{daoFromDB.email}</Descriptions.Item>
          <Descriptions.Item label={"Phone number"}>{daoFromDB.phone_number}</Descriptions.Item>
          <Descriptions.Item label={"Status"}><Tag color="blue">Pending</Tag></Descriptions.Item>
          <Descriptions.Item label={"Address"}>{daoFromDB.address}</Descriptions.Item>
        </Descriptions>
        <Divider />
        <Descriptions layout={"vertical"} column={1}>
          <Descriptions.Item label="Description">{daoFromDB.description}</Descriptions.Item>
        </Descriptions>
        <Divider />
        <Descriptions title="Social networks" column={3}>
          <Descriptions.Item label={"Website"}>{daoFromDB.website ? <a href={daoFromDB.website} target='_blank'><LinkOutlined /></a> : "N/A"}</Descriptions.Item>
          <Descriptions.Item label={"Twitter"}>{daoFromDB.twitter ? <a href={daoFromDB.twitter} target='_blank'><LinkOutlined /></a> : "N/A"}</Descriptions.Item>
          <Descriptions.Item label={"Telegram"}>{daoFromDB.telegram ? <a href={daoFromDB.telegram} target='_blank'><LinkOutlined /></a> : "N/A"}</Descriptions.Item>
          <Descriptions.Item label={"Facebook"}>{daoFromDB.facebook ? <a href={daoFromDB.facebook} target='_blank'><LinkOutlined /></a> : "N/A"}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Modal title="Approve" open={approveModal} onCancel={handleModalCancel} footer={null} >
        <p>Do you want to approve this DAO?</p>
        <Button type="primary" size="large" onClick={() => updateDao(1)}>Yes</Button>
      </Modal>
      <Modal title="Reject" open={rejectModal} onCancel={handleRejectModalCancel} footer={null} >
        <p>Do you want to reject this DAO?</p>
        <Button type="primary" size="large" onClick={() => updateDao(2)}>Yes</Button>
      </Modal>
    </div>
  );
}