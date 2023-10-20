import {
    AppstoreAddOutlined,
    AppstoreOutlined,
    BarChartOutlined,
    GithubOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';

import { AiOutlineDashboard } from "react-icons/ai";
import { FaSuperscript, FaRegAddressBook } from "react-icons/fa";
import { GrDocumentTime, GrGroup } from "react-icons/gr";
import { LiaDiscord } from "react-icons/lia";
import { MdOutlineWaterDrop } from "react-icons/md";


import { Button, Form, Image, Layout, Menu, Space, theme } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from "react";
// import AutoSearch from './common/AutoSearch';
// import { ConnectButton } from './common/ConnectButton';
const { Header, Sider, Content, Footer } = Layout;

interface Props {
    children: React.ReactNode | React.ReactNode[];
}

export const LayoutProvider = (props: Props) => {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={250} onCollapse={() => setCollapsed(!collapsed)} collapsed={collapsed} style={{ background: colorBgContainer }}>
                <div style={{ height: 50, margin: 16 }}>
                    {
                        !collapsed ? <Image src={"/logo.png"} alt="dpay" preview={false} width={150} /> : <Image src={"/ICON.png"} alt="dpay" preview={false} width={50} height={50} />
                    }
                </div>

                <Menu
                    style={{ fontWeight: 600 }}
                    inlineIndent={10}
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <HomeOutlined />,
                            label: "Home",
                            onClick: () => router.push("/")
                        },
                        {
                            key: '3',
                            icon: <BarChartOutlined />,
                            label: "Statistics",
                            onClick: () => router.push("/statistic")
                        },
                        { type: 'divider' },
                        {
                            key: '4',
                            type: "group",
                            label: !collapsed ? 'My Account' : '',
                            children: [
                                {
                                    key: '5',
                                    label: "Dashboard",
                                    icon: <AiOutlineDashboard />,
                                    onClick: () => router.push("/my-account")
                                },
                                {
                                    key: '5.1',
                                    label: "My Credits",
                                    icon: <GrDocumentTime />,
                                    onClick: () => router.push("/my-account/my-credits")
                                },
                                // {
                                //     key: '5.2',
                                //     label: "Address Book",
                                //     icon: <FaRegAddressBook />,
                                //     onClick: () => router.push("/my-account/address-book")
                                // },
                                // {
                                //     key: '7',
                                //     label: "Crypto Streaming",
                                //     icon: <MdOutlineWaterDrop />,
                                //     children: [
                                //         {
                                //             key: '7_1',
                                //             label: "New Stream",
                                //             onClick: () => router.push("/my-account/crypto-streaming/new")
                                //         },
                                //         {
                                //             key: '7_2',
                                //             label: "Outgoing",
                                //             onClick: () => router.push("/my-account/crypto-streaming/outgoing")
                                //         },
                                //         {
                                //             key: '7_3',
                                //             label: "Incoming",
                                //             onClick: () => router.push("/my-account/crypto-streaming/incoming")
                                //         },
                                //     ]

                                // },
                                // {
                                //     key: '6',
                                //     label: "Batch Payment",
                                //     icon: <GrGroup />,
                                //     onClick: () => router.push("/my-account/batch-payment")
                                // },
                            ]
                        }
                    ]}
                />
            </Sider>
            <Layout>

                <Header //@ts-ignore
                    style={{ padding: 0, backgroundColor: colorBgContainer }}>
                    <Space align="center" style={{ display: "flex", justifyContent: "space-between" }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <Form layout="inline">

                            <Form.Item >
                                {/* <AutoSearch /> */}
                            </Form.Item>
                            <Form.Item>
                                {/* <ConnectButton /> */}
                            </Form.Item>
                        </Form>
                    </Space>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px 0 16px',
                        padding: 16,
                        boxSizing: "border-box",
                        background: colorBgContainer
                    }}
                >
                    {props.children}
                </Content>
                <Footer style={{ textAlign: 'center', maxHeight: 50 }}>Algogreen - Carbon Credit Marketplace ©2023 Created by A2N Finance</Footer>
            </Layout>

        </Layout>
    )

}
