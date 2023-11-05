import { Editor } from '@tinymce/tinymce-react';
import { useWallet } from '@txnlab/use-wallet';
import { Button, Col, DatePicker, Divider, Form, Input, Radio, Row } from 'antd';
import { useRef } from "react";
import { useAppSelector } from 'src/controller/hooks';
import { addMembers } from 'src/core/dao';
import { createNewLoanProgram } from 'src/core/loan';
const { RangePicker } = DatePicker;

export const LoanForm = () => {
    const { activeAccount, signTransactions, sendTransactions } = useWallet();
    const { createLoanAction } = useAppSelector(state => state.process);
    const editorRef = useRef(null);
    const [form] = Form.useForm();
    const onFinish = (values: any) => {
       console.log(values);
       createNewLoanProgram(activeAccount?.address, values);
    };

    return (
        <Form
            name='new_loan_form'
            form={form}
            onFinish={onFinish}
            layout='vertical'>
            <Form.Item name={"title"} label="Title" rules={[{ required: true, message: 'Missing title' }]}>
                <Input size='large' />
            </Form.Item>
            <Form.Item name={"date"} label="Start date / End date" rules={[{ required: true, message: 'Missing start date and end date' }]}>
                <RangePicker size='large' showTime style={{width: "100%"}} />
            </Form.Item>
            <Divider />
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item name={"maximum_borrow_amount"} label="Maximum borrow amount" rules={[{ required: true, message: 'Missing maximum borrow amount' }]}>
                        <Input size='large' type='number' addonAfter={"ALGO"} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name={"term"} label="Term" rules={[{ required: true, message: 'Missing address' }]}>
                        <Input size='large' type='number' addonAfter={"Months"} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item name={"general_interest_rate"} label="General interest rate" rules={[{ required: true, message: 'Missing address' }]}>
                        <Input size='large' type='number' suffix="%" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name={"special_interest_rate"} label="Eco-projects interest rate" rules={[{ required: true, message: 'Missing special interest rate' }]}>
                        <Input size='large' type='number' suffix="%" />
                    </Form.Item>
                </Col>
            </Row>
            <Divider />
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item name="require_collateral" label={"Require collateral"}
                        rules={[{ required: true, message: '' }]}
                        initialValue={1}
                    >
                        <Radio.Group>
                            <Radio value={1}>Yes</Radio>
                            <Radio value={0}>No</Radio>
                        </Radio.Group>
                    </Form.Item>

                </Col>
                <Col span={12}>
                    <Form.Item name="allow_early_repay" label={"Allow early repay"}
                        rules={[{ required: true, message: '' }]}
                        initialValue={1}>
                        <Radio.Group>
                            <Radio value={1}>Yes</Radio>
                            <Radio value={0}>No</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>


            <Divider />
            <Form.Item name={"description"} label={"Description"} rules={[{ required: true, message: 'Missing description' }]} noStyle>
                <Input size='large' type='hidden' />
            </Form.Item>

            <Editor
                apiKey='1n11uzr2bd1kkoxh5dtycsp075phj3ivlopf4veknfhgxfyo'
                onChange={() => form.setFieldValue("description", editorRef.current.getContent())}
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={`<p>Details description</p>`}
                init={{
                    height: 350,
                    menubar: false,
                    // plugins: [
                    //     'advlist autolink lists link image charmap print preview anchor',
                    //     'searchreplace visualblocks code fullscreen',
                    //     'media table paste code help wordcount'
                    // ],
                    toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
            <Divider />
            <Button type="primary" htmlType='submit' size='large' loading={createLoanAction.processing}>Submit</Button>
        </Form>
    )
}
