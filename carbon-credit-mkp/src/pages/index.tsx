import { EditOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Row, Space } from "antd";
import { useEffect } from "react";

import { Typography } from 'antd';
import { useRouter } from "next/router";
import { FeaturedProjects } from "src/components/project/FeaturedProjects";
import { List } from "src/components/credit/List";
// import { FeatureImageSlides } from "src/components/home/FeatureImageSlides";

const { Title, Text } = Typography;
const { Meta } = Card;

export default function Index() {
    const router = useRouter();

    return (
        <div style={{ maxWidth: 1440, margin: "auto", padding: 10 }}>
            {/* <div style={{ textAlign: "center", maxWidth: 600, margin: "auto" }}>
                <Text style={{ color: "blue" }} strong>OUR BEST FEATURES &#128293;</Text >
                <Title level={2} style={{ fontWeight: 700 }}>Your Multipurpose DAO Solution on the NEO Blockchain for Payments and Governance.</Title>
            </div>
            <br /> */}
            <Row gutter={16}>

                {/* <Col span={8}>
                    <Card
                        cover={
                            <FeatureImageSlides key={"dao-slides"} imageUrls={["/DAO.png", "/PROPOSAL.png"]} />
                        }
                        actions={[
                            <Button size="large" type="primary" onClick={() => router.push("/dao/list")}>VIEW MORE</Button>,
                            <Button size="large" onClick={() => router.push("/dao/new")}>NEW DAO</Button>
                        ]}
                    >
                        <Meta
                            style={{ minHeight: 140 }}
                            title={<Text strong style={{ fontSize: 18 }}>Multisig DAO</Text>}
                            description="A small organization with a few committed members who are likely to remain. This organization can conduct payment or governance-based voting with members' weights taken into account."
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <FeatureImageSlides key={"stream-slides"} imageUrls={["/TOKEN_BASED_DAO.png", "/VOTING.png"]} />
                        }
                        actions={[
                            <Button size="large" type="primary" onClick={() => router.push("/my-account/crypto-streaming/outgoing")}>VIEW MORE</Button>,
                            <Button size="large" onClick={() => router.push("/dao/new")}>NEW DAO</Button>
                        ]}
                    >
                        <Meta
                            style={{ minHeight: 140 }}
                            title={<Text strong style={{ fontSize: 18 }}>Token-based DAO</Text>}
                            description="A fluid organization with a large number of members, which has its own governance token. This organization can conduct payment or governance-based voting with members' token holdings taken into account."
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <FeatureImageSlides key={"channel-slides"} imageUrls={["/MY_PROPOSALS.png", "/BATCH_PAYMENTS.png"]} />
                        }
                        actions={[
                            <Button size="large" type="primary" onClick={() => router.push("/my-account")}>VIEW MORE</Button>,
                            <Button size="large" onClick={() => router.push("/my-account/batch-payment")}>BATCH PAYMENTS</Button>
                        ]}
                    >
                        <Meta
                            style={{ minHeight: 140 }}
                            title={<Text strong style={{ fontSize: 18 }}>Account Management</Text>}
                            description="Account Management allows users to manage their DAO and proposals. This feature also supports some experimental payment solutions, such as crypto streaming or batch payments."
                        />
                    </Card>
                </Col> */}
            </Row>

            {/* <FeaturedProjects /> */}
            <List />

        </div>
    )
}