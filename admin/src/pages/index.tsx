import { Button, Card, Divider, Space, Steps } from "antd";

import { Typography } from 'antd';
import { useRouter } from "next/router";


const { Title, Text } = Typography;
const { Meta } = Card;

export default function Index() {
    const router = useRouter();

    return (
        <div style={{ maxWidth: 600, margin: "auto", padding: 10 }}>

            <Title level={3} >Look deep into nature, and then you will understand everything better.</Title>
            <Text italic>-Albert Einstein, Physicist</Text>
            <Divider />
            <Space>
                <Button size="large">Pending DAOs</Button>
                <Button size="large">Pending Projects</Button>
                <Button size="large">Pending Carbon Credits</Button>
            </Space>
            <Divider />
            <Steps
                size="default"
                current={3}
                items={[
                    {
                        title: "Verify KYC",
                    },
                    {
                        title: "Validate documents",
                    },
                    {
                        title: "Dive into description",
                    },
                ]}
            />
        </div>
    )
}