import { useWallet } from "@txnlab/use-wallet";
import { Alert, Button, Card, Col, Divider, Form, Input, Radio, Row } from "antd"
import { setCreditState } from "src/controller/credit/creditSlice";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { bootstrapMkp } from "src/core/marketplace";

export const SellingCreditForm = () => {
    const {activeAccount, signTransactions, sendTransactions} = useWallet();
    const [form] = Form.useForm();
    const { sellCreditsAction } = useAppSelector(state => state.process);
    const onFinish = (values: any) => {
        // newCredit(activeAccount?.address, values);
        bootstrapMkp(activeAccount?.address,values, signTransactions, sendTransactions)
    };
    return (
        <Card title="Sell credits on Algogreen Marketplace">
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Alert type="info" message="Your carbon offset credits will be tokenized as an ASA onchain, everyone can buy them." showIcon />
                <br />
                <Form.Item name={"origin_price"} label="Price" rules={[{ required: true, message: 'Missing price' }]}>
                    <Input size='large' type="number" addonAfter={"ALGO"} />
                </Form.Item>

                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item name={"asset_name"} label="Asset name" rules={[{ required: true, message: 'Missing asset name' }]}>
                            <Input size='large' maxLength={8} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name={"asset_url"} label="Asset URL" rules={[{ required: true, message: 'Missing asset url', type: "url" }]}>
                            <Input size='large' />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="allow_auction" label={"Allow auction"}
                    rules={[{ required: true, message: '' }]}
                    initialValue={1}
                >
                    <Radio.Group>
                        <Radio value={1}>Yes</Radio>
                        <Radio value={0}>No</Radio>
                    </Radio.Group>
                </Form.Item>

                <Divider />
                <Button loading={sellCreditsAction.processing} htmlType='submit' type='primary' size='large'>Submit</Button>
            </Form>
        </Card>
    )
}