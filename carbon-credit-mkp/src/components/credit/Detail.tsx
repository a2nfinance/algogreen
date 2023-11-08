import { useWallet } from "@txnlab/use-wallet"
import { Alert, Button, Card, Descriptions, Divider, Form, Input, Modal, Space, Table } from "antd"
import { useRouter } from "next/router"
import { useState } from "react"
import { useAppSelector } from "src/controller/hooks"
import { TESTNET_EXPLORER, TESTNET_EXPLORER_ADDRESS } from "src/core/constant"
import { acceptAuction, createAuction, doBuyWithAuction, getAuctions } from "src/core/marketplace"
import { useAddress } from "src/hooks/useAddress"

export const Detail = () => {
    const { activeAccount, signTransactions, sendTransactions } = useWallet();
    const { newAuctionAction, acceptAuctionAction, buyCreditAction } = useAppSelector(state => state.process)
    const router = useRouter();
    const { getShortAddress } = useAddress();
    const { credit, creditAuctions, creditAppInfo } = useAppSelector(state => state.credit)
    const [newAuctionModal, setNewAuctionModalOpen] = useState(false);
    const [auctionsModal, setAuctionModal] = useState(false);
    const [form] = Form.useForm();
    const showModal = () => {
        setNewAuctionModalOpen(true);
    };

    const handleModalOk = () => {
        setNewAuctionModalOpen(false);
    };

    const handleModalCancel = () => {
        setNewAuctionModalOpen(false);
    };

    const showAuctionModal = () => {
        getAuctions();
        setAuctionModal(true);
    };
    const handleAuctionModalCancel = () => {
        setAuctionModal(false);
    };
    const onFinish = (values: any) => {
        createAuction(activeAccount?.address, values, signTransactions, sendTransactions);
    };

    return (
        <>
            <Descriptions column={3}>
                <Descriptions.Item label="Title">
                    {credit.title}
                </Descriptions.Item>

                <Descriptions.Item label="Price">
                    {credit.origin_price} ALGO
                </Descriptions.Item>
                <Descriptions.Item label="Total issued credits">
                    {credit.total_credits}
                </Descriptions.Item>
                <Descriptions.Item label="Allow auction">
                    {credit.allow_auction ? "yes" : "no"}
                </Descriptions.Item>
                <Descriptions.Item label="Contract ID">
                    <a href={`${TESTNET_EXPLORER}/${credit.app_id}`}>{credit.app_id}</a>
                </Descriptions.Item>
                <Descriptions.Item label="Project">
                    <a onClick={() => router.push(`/project/detail/${credit.project_id}`)} type="link">detail</a>
                </Descriptions.Item>
                <Descriptions.Item label="Creator">
                    <a href={`${TESTNET_EXPLORER_ADDRESS}/${credit.creator}`} target="_blank">{credit.creator !== activeAccount?.address ? getShortAddress(credit.creator) : "me"}</a>
                </Descriptions.Item>
                <Descriptions.Item label="Document">
                    <a href={`${credit.proof_document}`} target="_blank">view</a>
                </Descriptions.Item>
                <Descriptions.Item label="Available credits">
                    {creditAppInfo ? creditAppInfo["assets"][0].amount : "N/A"}
                </Descriptions.Item>
            </Descriptions>
            <Divider />
            {credit.allow_auction ?
                <Space>

                    <Button size="large" type="primary" disabled={!activeAccount?.address || activeAccount?.address === credit.creator} onClick={() => showModal()}>New Auction</Button>
                    <Button size="large" onClick={() => showAuctionModal()} >Show auctions</Button>
                </Space>

                : <Button>Buy</Button>
            }
            <Divider />
            <Descriptions layout="vertical">
                <Descriptions.Item label="Description">
                    {credit.description}
                </Descriptions.Item>
            </Descriptions>

            <Modal width={600} open={newAuctionModal} onCancel={handleModalCancel} footer={null} >
                <Card title="New auction">
                    <Form form={form} onFinish={onFinish} layout="vertical">
                        <Alert type="info" message="After you create an auction, please wait for actions of credits owner!" showIcon />
                        <br />
                        <Form.Item name={"quantity"} label="Quantity" rules={[{ required: true, message: 'Missing quantity' }]}>
                            <Input size='large' type="number" max={creditAppInfo ? creditAppInfo["assets"][0].amount : credit.total_credits} addonAfter={"credits"} />
                        </Form.Item>
                        <Form.Item name={"price"} label="Price" rules={[{ required: true, message: 'Missing price' }]}>
                            <Input size='large' type="number" addonAfter={"ALGO"} />
                        </Form.Item>

                        <Divider />
                        <Button loading={newAuctionAction.processing} htmlType='submit' type='primary' size='large'>Submit</Button>
                    </Form>
                </Card>
            </Modal>
            <Modal width={600} title="Auctions" open={auctionsModal} onCancel={handleAuctionModalCancel} footer={null} >
                <Alert type="info" message={"Only credits owner can accept an auction and only auctioneers can buy if their auctions are accepted!"} />
                <br />
                <Table
                    pagination={false}
                    columns={[
                        {
                            title: "Buyer",
                            key: "buyer",
                            dataIndex: "buyer",
                            render: (_, record) => (
                                <a href={`${TESTNET_EXPLORER_ADDRESS}/${record.buyer}`} target="_blank">{record.buyer === activeAccount?.address ? "My auction" : getShortAddress(record.buyer)}</a>
                            )
                        },
                        {
                            title: "Quantity",
                            key: "quantity",
                            dataIndex: "quantity"
                        },
                        {
                            title: "Price",
                            key: "price",
                            dataIndex: "price"
                        },
                        {
                            title: "Action",
                            key: "action",
                            dataIndex: "action",
                            render: (_, record) => (
                                <Space>
                                    {record.status === 1 && activeAccount?.address !== credit.creator && <Button
                                        disabled={activeAccount?.address !== record.buyer}
                                        onClick={() => doBuyWithAuction(activeAccount?.address, record.auction_index, record.buyer, signTransactions, sendTransactions)}
                                        loading={buyCreditAction.processing}
                                        type="primary">
                                        buy now
                                    </Button>
                                    }
                                    {record.status === 1 && activeAccount?.address === credit.creator && <Button disabled>accepted</Button>}
                                    {(record.status === 0 && activeAccount?.address === credit.creator) && <Button loading={acceptAuctionAction.processing} type="primary" onClick={() => acceptAuction(activeAccount?.address, record.auction_index, signTransactions, sendTransactions)}>accept</Button>}
                                    {(record.status === 0 && activeAccount?.address !== credit.creator) && <Button disabled>pending</Button>}
                                    {record.status === 2 && <Button disabled>completed</Button>}
                                </Space>
                            )
                        }
                    ]}
                    dataSource={creditAuctions}
                />
            </Modal>
        </>
    )
}