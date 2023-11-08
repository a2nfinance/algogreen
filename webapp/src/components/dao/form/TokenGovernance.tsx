import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useWallet } from '@txnlab/use-wallet';
import { Alert, AutoComplete, Button, Card, Col, Divider, Form, Input, Radio, Row, Space } from 'antd';
import { useEffect } from 'react';
import { AiOutlineWallet } from 'react-icons/ai';
import { GoSponsorTiers } from 'react-icons/go';
import { TbWeight } from "react-icons/tb";
import { setDaoFormProps, updateDaoFormState } from 'src/controller/dao/daoFormSlice';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { bootstrapDAO } from 'src/core/dao';
import { headStyle } from 'src/theme/layout';

export const TokenGovernance = () => {
    const dispatch = useAppDispatch();
    const { generalForm, tokenGovernanceForm } = useAppSelector(state => state.daoForm);
    const { activeAccount, signTransactions, sendTransactions } = useWallet();
    const { initializeDaoAction } = useAppSelector(state => state.process);
    const [form] = Form.useForm();
    const onFinish = (values: any) => {
        dispatch(setDaoFormProps({ att: "tokenGovernanceForm", value: values }))
        if (generalForm.status === 2) {
            bootstrapDAO(activeAccount?.address, signTransactions, sendTransactions);
        } else {
            dispatch(updateDaoFormState(3));
        }


    };

    return (
        <Form
            name='token_governance_form'
            initialValues={tokenGovernanceForm}
            onFinish={onFinish}
            layout='vertical'>
            <Card title="Governance" headStyle={headStyle} extra={
                <Space wrap>
                    <Button type="primary" htmlType='button' onClick={() => dispatch(updateDaoFormState(1))} size='large'>Back</Button>
                    <Button type="primary" htmlType='submit' size='large' loading={initializeDaoAction.processing}>{generalForm.status === 2 ? "New DAO token" : "Next"}</Button>
                </Space>
            }>
                <Card title="Token Definition">
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item name="name" label="Name" rules={[
                                { pattern: new RegExp(/^[a-zA-Z0-9]*$/), message: "No Space or Special Characters Allowed" },
                                { required: true, message: 'Missing token name' }
                            ]}>
                                <Input size="large" maxLength={8} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="supply" label="Supply" rules={[{ required: true, message: 'Missing token supply' }]}>
                                <Input size="large" type="number" addonAfter="$TOKEN" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
                <Divider />
                <p><strong>Token-based DAO:</strong> A fluid organization with a large number of members, which has its own governance token. This organization can conduct payment or governance-based voting with members' token holdings taken into account.</p>
            </Card>


        </Form>
    )
}
