import { CopyOutlined, DisconnectOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Modal } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { setAccountProps } from "src/controller/account/accountSlice";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { useAddress } from "src/hooks/useAddress";
import { ConnectMenu } from "./ConnectMenu";
import { useWallet } from "@txnlab/use-wallet";
export const ConnectButton = () => {
  const { providers, activeAccount } = useWallet()
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

  // useEffect(() => {
  //   setTimeout(() => {
  //     checkConnection();
  //     setLoaded(true);
  //   }, 500)
  // }, [connected])

  async function checkConnection() {
    // if (wcSdk.isConnected()) {
    //   let account = wcSdk.getAccountAddress();
    //   dispatch(setAccountProps({ att: "account", value: account }))
    //   setConnected(true);
    // }
  }



  const connect = async () => {
    // if (window.NEOLineN3) {
    try {
      // let account = await window.NEOLineN3.N3.getAccount();
      // dispatch(setAccountProps({ att: "account", value: "account.address" }))
      // setConnected(true);
    } catch (e) {
      console.log("Please accept connect")
    }

    // } else {
    //   console.log("Please install NEO wallet")
    // }
  }

  const disconnect = async () => {
    // if (window.NEOLineN3 && account) {
    try {

    } catch (e) {
      console.log("Please accept connect")
    }

    // } else {
    //   console.log("Please install NEO wallet")
    // }
  }

  const items: MenuProps['items'] = [
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
      onClick: () => { }
    }
  ];
  return (
    <>
      {activeAccount ? <Dropdown menu={{ items }} placement="bottomLeft" arrow>
        <Button onClick={() => { }} icon={<Image alt="ae" width={30} height={30} src={"/neo-icon.png"} style={{ paddingRight: "5px" }} />} type="primary" size="large">{getShortAddress(activeAccount?.address)}</Button>
      </Dropdown> : <Button type="primary" size="large" onClick={() => showModal()}>Connect Wallet</Button>}
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <ConnectMenu />
      </Modal>
    </>
  )
}