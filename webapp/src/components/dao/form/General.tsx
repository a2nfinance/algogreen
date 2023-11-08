import { Button, Card, Col, Form, Input, Radio, Row } from 'antd';
import { setDaoFormProps, updateDaoFormState } from 'src/controller/dao/daoFormSlice';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { headStyle } from 'src/theme/layout';
import { KYC } from './Kyc';
import { useRouter } from 'next/router';
import { useWallet } from '@txnlab/use-wallet';
import { getDAOByCreatorAndId, saveDAO } from 'src/core/dao';
import { useEffect } from "react";

export const General = ({ isNewForm }: { isNewForm: boolean }) => {
    const router = useRouter();
    const { id } = router.query
    const { generalForm } = useAppSelector(state => state.daoForm)
    const dispatch = useAppDispatch();
    const { activeAccount } = useWallet();
    const [form] = Form.useForm();
    const onFinish = (values: any) => {
        // saveDAO(values).then(data => data !== false ? router.push(`/dao/edit/${data._id}`) : {});
        if (isNewForm) {
            saveDAO(activeAccount?.address, values).then(data => data ?
                router.push(`/dao/edit/${data._id}`) :
                {})
        } else if (!isNewForm && generalForm.status === 0) {

        } else {
            // dispatch(setDaoFormProps({ att: "generalForm", value: values }))
            dispatch(updateDaoFormState(1));
        }
    };

    useEffect(() => {
        if (id && activeAccount?.address) {
            getDAOByCreatorAndId(activeAccount?.address, id.toString(), form)
        }

    }, [id, activeAccount?.address])
    return (
        <Form
            form={form}
            name='general_form'
            initialValues={generalForm}
            onFinish={onFinish}
            layout='vertical'>
            <Card title="Organization registration form" headStyle={headStyle} extra={
                <Button type="primary" htmlType='submit' size='large'>{isNewForm ? "Submit" : (!generalForm.status ? "Waiting for approval" : "Next")}</Button>
            }>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item name="organization_name" label="Organization name" rules={[{ required: true, message: 'Missing company name' }]}>
                            <Input size='large' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="owner" label="Owner" rules={[{ required: true, message: 'Missing owner' }]}>
                            <Input size='large' />
                        </Form.Item>
                    </Col>
                </Row>


                <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Missing address' }]}>
                    <Input size='large' />
                </Form.Item>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item name="city">
                            <Input size='large' placeholder='City' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="state">
                            <Input size='large' placeholder='State' />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item name="zipcode">
                            <Input size='large' placeholder='Zip Code' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="country" >
                            <Input size='large' placeholder='Country' />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Missing email' }]}>
                            <Input size='large' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="phone_number" label="Phone number" rules={[{ required: true, message: 'Missing phone number' }]}>
                            <Input size='large' />
                        </Form.Item>
                    </Col>
                </Row>
                {/* <Form.Item name="contract_name" label="Contract Name"
                    extra={"The contract name must not include spaces or special characters."}
                    rules={[
                        { pattern: new RegExp(/^[a-zA-Z0-9]*$/), message: "No Space or Special Characters Allowed" },
                        { required: true, message: 'Missing contract name' }
                    ]}>
                    <Input size='large' />
                </Form.Item> */}
                <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Missing description' }]}>
                    <Input.TextArea size='large' />
                </Form.Item>

            </Card>
            <br />
            <KYC />
        </Form>
    )
}
