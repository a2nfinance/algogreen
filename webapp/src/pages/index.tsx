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
                            <Button type="primary" size="large">New project</Button>,
                            <Button type="primary" size="large">All projects</Button>,
                        ]}
                    >
                    </Card>

                </Col>
                <Col span={8}>
                    <Card title={"Step 02: Apply a loan"}
                        cover={
                            <img
                                height={200}
                                alt="example"
                                src="/intro/apply-loan.jpg"
                            />
                        }
                        actions={[
                            <Button type="primary" size="large">All DAOs</Button>,
                            <Button type="primary" size="large">All loans</Button>,
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
                            <Button type="primary" size="large">My projects</Button>,
                            <Button type="primary" size="large">Marketplace</Button>,
                        ]}
                    >

                    </Card>
                </Col>
            </Row>

            {/* <Space direction="vertical">
                <Text>
                    1. 92% of consumers say they’re more likely to trust brands that are environmentally or socially conscious. – Forbes
                </Text>
                <Text>
                    2. 88% of consumers will be more loyal to a company that supports social or environmental issues. – Forbes
                </Text>
                <Text>

                    3. 87% of consumers would buy a product with a social and environmental benefit if given the opportunity. – Forbes
                </Text>
                <Text>
                    4. Overall sales revenue can increase up to 20% due to corporate responsibility practices. – Harvard Business Review
                </Text>
                <Text>
                    5. 64% of millennials are willing to turn down a job if the company doesn’t have strong corporate responsibility. – Cone Communications
                </Text>
                <Text>
                    6. 66% of global consumers are willing to pay more for sustainable goods. – INC.
                </Text>
                <Text>
                    7. 38% of employees are more likely to be loyal to a company that prioritizes sustainability. – SHRM
                </Text>
                <Text>
                    8. Employees at eco-friendly companies are 16% more productive than average. – UCLA Newsroom
                </Text>
                <Text>
                    9. For every $1 saved on your utility bill from rooftop solar, your property value goes up $20. – National Renewable Energy Laboratory (NREL)
                </Text>
            </Space> */}

        </div>
    )
}