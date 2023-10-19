import { CopyOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Row, Statistic, Table } from "antd";
import { useEffect } from "react";
import { useAppSelector } from "src/controller/hooks";
// import { getFundsByDAO } from "src/core";
import { useAddress } from "src/hooks/useAddress";
import { useTreasury } from "src/hooks/useTreasury";

export const TreasuryInfo = () => {

  const { daoFromDB, daoOnchain, treasury } = useAppSelector(state => state.daoDetail);
  const { account } = useAppSelector(state => state.account);
  const { getShortAddress } = useAddress();
  const {getTotalFundsInNEO} = useTreasury();

  const columns = [
    {
      title: 'Funder',
      dataIndex: 'address',
      key: 'address',
      render: (index, record) => (
        <Button key={`address-${index}`} type="primary" icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(record.funder)}>{getShortAddress(record.funder)}</Button>
      )
    },
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
      render: (index, record) => (
        <Button key={`address-${index}`}  type="primary" icon={<CopyOutlined />} onClick={() => navigator.clipboard.writeText(record.token_hash)}>{getShortAddress(record.token_hash)}</Button>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (index, record) => (
        <>{record.amount} {record.token_symbol}</>
      )
    },
    {
      title: 'Created Date',
      dataIndex: 'created_at',
      key: 'created_at',
    },
  ];

  // useEffect(() => {
  //   if (daoFromDB.dao_address) {
  //     getFundsByDAO();
  //   }
  // }, [daoFromDB.dao_address])
  return (
    <>
      <Card title="Funding History" size="default">
        <Row gutter={6}>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Number of Funding"
                value={treasury.length}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Total Funding (NEO)"
                value={getTotalFundsInNEO(treasury)}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Funders"
                value={daoOnchain.funders.length}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="Whitelisted Tokens "
                value={daoOnchain.whitelistedTokens.length}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        </Row>
        <Divider />
        <Table
          pagination={{
            pageSize: 6
          }}
          dataSource={
            treasury.map(({ funder, token_hash, token_symbol, amount, created_at }, i) => {
              return {
                key: `c-${i}`,
                funder: funder,
                token_hash: token_hash,
                token_symbol: token_symbol,
                amount: amount,
                created_at: new Date(created_at).toLocaleString()
              }
            })

          } columns={columns} />

      </Card>
    </>
  )
}