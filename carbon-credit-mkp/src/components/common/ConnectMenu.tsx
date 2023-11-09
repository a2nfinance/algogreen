import { DisconnectOutlined } from '@ant-design/icons';
import { useWallet } from '@txnlab/use-wallet'
import { Button, Card, Col, Image, Row } from 'antd';
import { GrConnect, GrConnectivity } from "react-icons/gr";
const { Meta } = Card;
export const ConnectMenu = () => {
    const { providers, activeAccount } = useWallet()
    return (
        <Row gutter={8}>
            {providers?.map((provider) => (
                <Col key={provider.metadata.id} span={8}>
                    <Card
                        onClick={provider.connect}
                        style={{cursor: "pointer"}}
                        bodyStyle={{padding: 10}}
                        cover={
                            <Image
                                preview={false}
                                alt={`${provider.metadata.name} icon`}
                                height={140}
                                src={provider.metadata.icon}
                            />
                        }

                        actions={[
                            <Button title='Connect' icon={<GrConnect />} type="primary" onClick={provider.connect} disabled={provider.isConnected} />,
                            <Button title='Disconnect' icon={<DisconnectOutlined />} type="primary" onClick={provider.disconnect} disabled={!provider.isConnected} />,
                            // <Button title="Set active" type="primary"
                            //     icon={<GrConnectivity />}
                            //     onClick={provider.setActiveProvider}
                            //     disabled={!provider.isConnected || provider.isActive}
                            // />,
                        ]}
                    >
                        <Meta style={{textAlign: "center"}} title={provider.metadata.name.toUpperCase()} />
                    </Card>


                </Col>
            ))}
        </Row>
    )
}