import { CopyOutlined, DisconnectOutlined, WalletOutlined } from "@ant-design/icons";
import { useWallet } from "@txnlab/use-wallet";
import { Button, Dropdown, MenuProps, Modal, Space, Typography } from "antd";
import { useState } from "react";
import { CiSettings } from "react-icons/ci";
import { useAppDispatch } from "src/controller/hooks";
import { useAddress } from "src/hooks/useAddress";
import { ConnectMenu } from "./ConnectMenu";
const { Text, Link } = Typography;
export const ConnectButton = () => {
  const { providers, activeAccount, connectedActiveAccounts } = useWallet()
  const { getShortAddress } = useAddress();
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const disconnect = () => {
    try {
      providers.forEach(provider => {
        if (provider.isConnected) {
          provider.disconnect()
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  const changeActiveAccount = (acc: string) => {
    providers.forEach(provider => {
      if (provider.isConnected) {
        provider.setActiveAccount(acc)
      }
    })
  }

  const items: MenuProps['items'] = connectedActiveAccounts.map(acc =>
  ({
    key: acc.name,
    label: getShortAddress(acc.address),
    onClick: () => changeActiveAccount(acc.address)
  })
  )

  const actionItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer">
          Copy address
        </a>
      ),
      icon: <CopyOutlined />,
      onClick: () => navigator.clipboard.writeText(activeAccount?.address)
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer">
          Disconnect
        </a>
      ),
      icon: <DisconnectOutlined />,
      onClick: () => disconnect()
    }
  ];

  return (
    <>
      {activeAccount ? <Space wrap>
        <Dropdown menu={{ items }} placement="bottomLeft" arrow>
          <Button
            type="primary" icon={<WalletOutlined />} size="large">{getShortAddress(activeAccount?.address)}</Button>
        </Dropdown>

        <Dropdown menu={{ items: actionItems }} placement="bottomLeft" arrow>
          <Button onClick={() => { }}
            type="dashed" size="large" shape="circle"><CiSettings /></Button>
        </Dropdown>
      </Space>
        : <Button type="primary" size="large" onClick={() => showModal()}>Connect Wallet</Button>}
      <Modal width={480} title={<h3 style={{textAlign: "center"}}>Connect your wallet</h3>} open={isModalOpen && !activeAccount?.address} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <ConnectMenu />
      </Modal>
    </>
  )
}