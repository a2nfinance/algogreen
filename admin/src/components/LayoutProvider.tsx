import {
    AppstoreOutlined,
    BarChartOutlined,
    HomeOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';

import { GoProjectRoadmap } from "react-icons/go";
import { SiCoinmarketcap } from "react-icons/si";

import { Button, Form, Image, Layout, Menu, Space, theme } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from "react";
import { LoginForm } from './LoginForm';
import { ConnectButton } from './common/ConnectButton';

const { Header, Sider, Content, Footer } = Layout;

interface Props {
    children: React.ReactNode | React.ReactNode[];
}

export const LayoutProvider = (props: Props) => {
    const { data: session } = useSession()
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
                            key: '2',
                            icon: <AppstoreOutlined />,
                            label: "DAOs",
                            onClick: () => router.push("/dao/list")
                        },
                        {
                            key: '3',
                            icon: <GoProjectRoadmap />,
                            label: "Projects",
                            onClick: () => router.push("/project/list")
                        },
                        {
                            key: '3.1',
                            icon: <BarChartOutlined />,
                            label: "Credits",
                            onClick: () => router.push("/credit/list")
                        },
                        { type: "divider" },
                        {
                            key: "9",
                            type: "group",
                            label: !collapsed ? 'Algogreen v0.0.1' : "",
                            children: [

                                {
                                    key: '13',
                                    icon: <SiCoinmarketcap />,
                                    label: 'Marketplace',
                                    onClick: () => window.open("https://marketplace-algogreen.a2n.finance", "_blank")
                                },
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
                                {
                                    session && <Space>
                                    <Button size='large' type='primary'>Welcome {session.user.name}!</Button>
                                    <ConnectButton />
                                    <Button size='large' onClick={() => signOut()} icon={<LogoutOutlined />}/>
                                </Space>
                                }
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
                    {
                        session ? props.children : <LoginForm/>
                    }
                    
                </Content>
                <Footer style={{ textAlign: 'center', maxHeight: 50 }}>Algogreen - Admin Control Panel ©2023 Created by A2N Finance</Footer>
            </Layout>

        </Layout>
    )

}
