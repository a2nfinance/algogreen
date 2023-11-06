import { Alert, Button, Card, Col, DatePicker, Divider, Form, Input, Radio, Row } from "antd";
import { useRef } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { headStyle } from "src/theme/layout";
import { useWallet } from "@txnlab/use-wallet";
import { newProject } from "src/core/project";
import { useRouter } from "next/router";
import { useAppSelector } from "src/controller/hooks";

const { RangePicker } = DatePicker;
export default function New() {
    const router = useRouter();
    const { activeAccount } = useWallet();
    const { createNewProjectAction } = useAppSelector(state => state.process);
    const editorRef = useRef(null);
    const [form] = Form.useForm();
    const onFinish = (values: any) => {
        newProject(activeAccount?.address, values).then(data => data ? router.push("/my-account/my-projects") : false);
    };
    return (
        <div style={{ maxWidth: 600, margin: "auto" }}>

            <Card title="New Project" headStyle={headStyle} style={{ backgroundColor: "#f5f5f5" }}>
                <Alert type="info" showIcon message={"A new project need verification and approval of Algogreen."} />
                <br />
                <Form name="new_project_form" form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item name={"project_name"} label="Project name" rules={[{ required: true, message: 'Missing project name' }]}>
                        <Input size='large' />
                    </Form.Item>
                    <Row gutter={12}>
                        <Col span={12}>

                            <Form.Item name={"project_leader"} rules={[{ required: true, message: 'Missing project leader' }]}>
                                <Input size='large' placeholder="Project leader" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={"contact_email"} rules={[{ required: true, message: 'Missing project location' }]}>
                                <Input size='large' placeholder="Contact email" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name={"short_description"} label="Short description" rules={[{ required: true, message: 'Missing short description' }]}>
                        <Input.TextArea size='large' />
                    </Form.Item>
                    <Divider />
                    <Form.Item name="is_eco_project" label={"Is a carbon offset project"}
                        rules={[{ required: true, message: '' }]}
                        initialValue={1}
                    >
                        <Radio.Group>
                            <Radio value={1}>Yes</Radio>
                            <Radio value={0}>No</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Divider />
                    <Form.Item name={"project_location"} label="Project location" rules={[{ required: true, message: 'Missing project location' }]}>
                        <Input size='large' />
                    </Form.Item>
                    <Form.Item name={"date"} label="Start date - End date" rules={[{ required: true, message: 'Missing start date & end date' }]}>
                        <RangePicker size='large' style={{ width: "100%" }} />
                    </Form.Item>
                    <Divider />
                    <Form.Item name={"description"} label={"Description"} rules={[{ required: true, message: 'Missing description' }]} noStyle>
                        <Input size='large' type='hidden' />
                    </Form.Item>
                    <Alert type="info" showIcon message={"Project description should including your project purpose, project scope, business information, and team member profiles."} />
                    <br />
                    <Editor
                        apiKey='1n11uzr2bd1kkoxh5dtycsp075phj3ivlopf4veknfhgxfyo'
                        onChange={() => form.setFieldValue("description", editorRef.current.getContent())}
                        onInit={(evt, editor) => editorRef.current = editor}
                        initialValue={`<p>Project description</p>`}
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


                    <Form.Item name={"detail_document"} label={"Detail document"} rules={[{ required: true, message: "Missing detail document link", type: "url" }]}>
                        <Input size='large' />
                    </Form.Item>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item name={"video"} rules={[{ required: false, type: "url" }]}>
                                <Input size='large' placeholder="Introduction video" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={"twitter"} rules={[{ required: false, type: "url" }]}>
                                <Input size='large' placeholder="Twitter" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={"telegram"} rules={[{ required: false }]}>
                                <Input size='large' placeholder="Telegram" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={"github"} rules={[{ required: false, type: "url" }]}>
                                <Input size='large' placeholder="Github" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button size="large" type="primary" loading={createNewProjectAction.processing} htmlType="submit">Submit</Button>
                </Form>
            </Card>
        </div>
    )
}