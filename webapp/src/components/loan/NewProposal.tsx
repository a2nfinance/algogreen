import { useEffect, useRef } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { Alert, Button, Card, Col, DatePicker, Divider, Form, Input, Radio, Row, Select } from "antd";
import { useAppSelector } from "src/controller/hooks";
import { createProposal } from "src/core/dao";
import { useWallet } from "@txnlab/use-wallet";
import { getMyApprovedProjects } from "src/core/project";

const { RangePicker } = DatePicker;
export const NewProposal = () => {
    const {activeAccount, sendTransactions, signTransactions} = useWallet();
    const {createProposalAction} = useAppSelector(state => state.process);
    const { loanDetail } = useAppSelector(state => state.loan);
    const { myApprovedProjects } = useAppSelector(state => state.project);
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const onFinish = (values: any) => {
        createProposal(activeAccount?.address, values, signTransactions, sendTransactions)
    };
    useEffect(() => {
        if (activeAccount?.address) {
            getMyApprovedProjects(activeAccount?.address);
        }
    }, [activeAccount?.address])
    return (
        <Card title={`Apply for: ${loanDetail.title}`}>
            <Form
                name='new_loan_form'
                form={form}
                onFinish={onFinish}
                layout='vertical'>
                <Alert type="info" message="To apply for a loan program, you must create a proposal and await the voting process by DAO members." showIcon />
                <br />
                <Form.Item name={"title"} label="Title" rules={[{ required: true, message: 'Missing title' }]}>
                    <Input size='large' />
                </Form.Item>
                <Form.Item name={"date"} label="Voting start date & end date" rules={[{ required: true, message: 'Missing start date and end date' }]}>
                    <RangePicker size='large' showTime style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="project_id" label={"Select your project"}
                    rules={[{ required: true, message: 'Missing project' }]}>
                    <Select size="large" options={myApprovedProjects.map(m => ({label: m.project_name, value: m._id}))} />
                </Form.Item>
                <Form.Item name={"borrow_amount"} label="Borrow amount" rules={[{ required: true, message: 'Missing borrow amount' }]}>
                            <Input size='large' type="number" addonAfter={"ALGO"} />
                        </Form.Item>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item name="allow_early_execution" label={"Allow early execution"}
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
                    <Form.Item name="is_eco_project" label={"Apply for the special interest rate"}
                            rules={[{ required: true, message: '' }]}
                            initialValue={1}
                        >
                            <Radio.Group>
                                <Radio value={1}>Yes</Radio>
                                <Radio value={0}>No</Radio>
                            </Radio.Group>
                        </Form.Item>
                       
                    </Col>
                </Row>
                <Divider />
                {
                    loanDetail.require_collateral && <>
                    <Alert type="info" message={"This loan requires collateral, so you must provide your genuine asset information for approval."}/>
                    <br/>
                    </>
                }
                <Form.Item name={"description"} label={"Description"} rules={[{ required: true, message: 'Missing description' }]} noStyle>
                    <Input size='large' type='hidden' />
                </Form.Item>

                <Editor
                    apiKey='1n11uzr2bd1kkoxh5dtycsp075phj3ivlopf4veknfhgxfyo'
                    onChange={() => form.setFieldValue("description", editorRef.current.getContent())}
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={`<p>Description</p>`}
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
                <Button type="primary" htmlType='submit' size='large' loading={createProposalAction.processing}>Submit</Button>
            </Form>
        </Card>


    )
}