import { Button, Card, Col, Image, Row } from "antd";

import { Typography } from 'antd';
import { useRouter } from "next/router";

const { Title, Text } = Typography;
const { Meta } = Card;

export default function Index() {
    const router = useRouter();

    return (
        <div style={{ maxWidth: 1000, margin: "auto", padding: 10 }}>
            <div style={{ margin: "auto", width: 800, marginBottom: 10 }}>
                <Image src="/intro/green-project.png" preview={false} />
            </div>
            <Row gutter={8}>
                <Col span={8}>
                    <Card
                        title={"Step 01: Create your project"}
                        cover={
                            <img
                                height={200}
                                alt="example"
                                src="/intro/green-project.jpg"
                            />
                        }
                        actions={[
                            <Button type="primary" size="large" onClick={() => router.push("/project/new")}>New project</Button>,
                            <Button type="primary" size="large" onClick={() => router.push("/project/list")}>All projects</Button>,
                        ]}
                    >
                    </Card>

                </Col>
                <Col span={8}>
                    <Card title={"Step 02: Apply for a loan"}
                        cover={
                            <img
                                height={200}
                                alt="example"
                                src="/intro/apply-loan.jpg"
                            />
                        }
                        actions={[
                            <Button type="primary" size="large" onClick={() => router.push("/dao/list")}>All DAOs</Button>,
                            <Button type="primary" size="large" onClick={() => router.push("/loan/list")}>All loans</Button>,
                        ]}
                    >


                    </Card>
                </Col>
                <Col span={8}>
                    <Card title={"Step 03: Sell carbon credits"}
                        cover={
                            <img
                                height={200}
                                alt="example"
                                src="/intro/carbon-credit.jpg"
                            />
                        }
                        actions={[
                            <Button type="primary" size="large" onClick={() => router.push("/my-account/my-projects")}>My projects</Button>,
                            <Button type="primary" size="large" onClick={() => window.open("https://marketplace-algogreen.a2n.finance", "_blank")}>Marketplace</Button>,
                        ]}
                    >

                    </Card>
                </Col>
            </Row>

        </div>
    )
}