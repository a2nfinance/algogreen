import { useWallet } from '@txnlab/use-wallet';
import { Button, Col, Divider, Drawer, Input, Modal, Popover, Row, Select, Space, Statistic } from 'antd';
import { useCallback, useState } from 'react';
import { useAppSelector } from 'src/controller/hooks';
import { fundDAO, optAccountIntoAsset } from 'src/core/dao';
import { NewMembersForm } from './NewMembersForm';
import { LoanForm } from './LoanForm';


export const DaoStatistic = () => {
  const { daoFromDB, appAccountInformation } = useAppSelector(state => state.daoDetail);
  const { activeAccount, signTransactions, sendTransactions } = useWallet();
  const { addFundAction, optInAssetAction, addMemberAction } = useAppSelector(state => state.process);

  const [fundAmount, setFundAmount] = useState("");
  const [newMembersModalOpen, seNewMembersModalOpen] = useState(false);
  const [newLoanModalOpen, setNewLoanModalOpen] = useState(false);



  const showNewMemberModal = () => {
    seNewMembersModalOpen(true);
  };

  const handleNewMembersModalOk = () => {
    seNewMembersModalOpen(false);
  };

  const handleNewMembersModalCancel = () => {
    seNewMembersModalOpen(false);
  };

  const showLoanModal = () => {
    setNewLoanModalOpen(true);
  };

  const handleLoanModalOk = () => {
    setNewLoanModalOpen(false);
  };

  const handleLoanModalCancel = () => {
    setNewLoanModalOpen(false);
  };


  const [openFundPopup, setOpenFundPopup] = useState(false);

  const handleOpenFundPopupChange = (newOpen: boolean) => {
    setOpenFundPopup(newOpen);
  };

  const fund = useCallback(() => {
    fundDAO(activeAccount?.address, parseFloat(fundAmount), signTransactions, sendTransactions);
  }, [fundAmount])

  const handleOptIn = () => {
    optAccountIntoAsset(activeAccount?.address, signTransactions, sendTransactions);
  }

  return (
    <Row gutter={8}>
      <Col span={4}>
        <Statistic title="Balance" value={appAccountInformation.amount / 10 ** 6} />
      </Col>
      <Col span={4}>
        <Statistic title="Min balance" value={appAccountInformation["min-balance"] / 10 ** 6} />
      </Col>
      <Col span={15}>
        <p>Actions</p>
        <Space direction="horizontal">
          {
            activeAccount?.address === daoFromDB.creator && <Button type="primary" loading={addMemberAction.processing} onClick={() => showNewMemberModal()} ghost>
              Add members
            </Button>
          }
          {
            activeAccount?.address === daoFromDB.creator && <Button type="primary" onClick={() => showLoanModal()} ghost>
              New loan program
            </Button>
          }
          <Button type="primary" loading={optInAssetAction.processing} onClick={() => handleOptIn()} ghost>
            Opt-in
          </Button>

          <Popover
            content={
              <Space direction='vertical' >
                <Input name='amount' size='large' addonAfter={"ALGO"} type='number' value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} />
                <Divider />
                <Button type='primary' onClick={() => fund()} loading={addFundAction.processing}>Send</Button>
              </Space>
            }
            title="Token"
            trigger="click"
            open={openFundPopup}
            onOpenChange={handleOpenFundPopupChange}
          >
            <Button type="primary" loading={addFundAction.processing}>Fund</Button>
          </Popover>
        </Space>

      </Col>
      <Modal title="New members" open={newMembersModalOpen} onOk={handleNewMembersModalOk} onCancel={handleNewMembersModalCancel} footer={null}>
            <NewMembersForm />
      </Modal>
      <Modal width={600} title="New loan program" open={newLoanModalOpen} onOk={handleLoanModalOk} onCancel={handleLoanModalCancel} footer={null}>
            <LoanForm />
      </Modal>
    </Row>
  )
}