import { Button, Col, Divider, Drawer, Input, Popover, Row, Select, Space, Statistic } from 'antd';
import { useCallback, useState } from 'react';
import { NewTask } from 'src/components/Task/NewTask';
import { NewPayout } from 'src/components/proposal/NewPayout';
import { useAppSelector } from 'src/controller/hooks';
import { fundDao } from 'src/core';

export const DaoStatistic = () => {
  const { daoOnchain, daoFromDB } = useAppSelector(state => state.daoDetail);
  const { addFund } = useAppSelector(state => state.process);

  const [fundAmount, setFundAmount] = useState("");
  const [token, setToken] = useState("");


  const [openFundPopup, setOpenFundPopup] = useState(false);

  const handleOpenFundPopupChange = (newOpen: boolean) => {
    setOpenFundPopup(newOpen);
  };


  const [open, setOpen] = useState(false);
  const [openTask, setOpenTask] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const showTaskDrawer = () => {
    setOpenTask(true);
  }
  const onCloseTask = () => {
    setOpenTask(false);
  };
  const fund = useCallback(() => {
    fundDao(token, parseFloat(fundAmount));
  }, [token, fundAmount])

  return (
    <Row gutter={8}>
      <Col span={3}>
        <Statistic title="Members" value={daoOnchain.count_member} />
      </Col>
      <Col span={3}>
        <Statistic title="Proposals" value={daoOnchain.count_proposal} />
      </Col>
      <Col span={3}>
        <Statistic title="Treasury (NEO)" value={daoOnchain.balance} />
      </Col>
      <Col span={3}>
        <Statistic title="Status" value={daoFromDB.status == 1 ? "Active" : "Inactive"} />
      </Col>
      <Col span={12}>
        <p>Actions</p>
        <Space direction="horizontal">

          <Button type="primary" onClick={() => showDrawer()} ghost>
            New Proposal
          </Button>
          <Button type="primary" onClick={() => showTaskDrawer()} ghost>
            New Task
          </Button>
          <Popover
            content={
              <Space direction='vertical' >
                <Select style={{ width: "100%" }} onChange={(v) => setToken(v)} value={token} size="large" options={daoOnchain.whitelistedTokens.map(t => {
                  return { label: `${t.symbol.toUpperCase()} Token`, value: t.hash }
                })} />
                <Input name='amount' size='large' type='number' value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} />
                <Divider />
                <Button type='primary' onClick={() => fund()} loading={addFund.processing}>Send</Button>
              </Space>
            }
            title="Token & Amount"
            trigger="click"
            open={openFundPopup}
            onOpenChange={handleOpenFundPopupChange}
          >
            <Button type="primary">Send Fund</Button>
          </Popover>
        </Space>

      </Col>
      <Drawer title="New Proposal" size="large" placement="right" onClose={onClose} open={open}>
        <NewPayout />
      </Drawer>

      <Drawer title="New Task" size="large" placement="right" onClose={onCloseTask} open={openTask}>
        <NewTask  />
      </Drawer>
    </Row>
  )
}