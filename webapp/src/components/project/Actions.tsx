import { Editor } from '@tinymce/tinymce-react';
import { useState, useRef } from "react";
import { useWallet } from "@txnlab/use-wallet";
import { Alert, Button, Card, Divider, Form, Input, Modal, Space } from "antd"
import { useRouter } from "next/router";
import { useAppSelector } from "src/controller/hooks";
import { newCredit } from 'src/core/credit';


export const Actions = () => {
    const router = useRouter();
    const { activeAccount } = useWallet();
    const { project } = useAppSelector(state => state.project);
    const { createCreditAction } = useAppSelector(state => state.process);
    const [newCreditsModalOpen, setNewCreditsModalOpen] = useState(false);
    const [form] = Form.useForm()
    const showModal = () => {
        setNewCreditsModalOpen(true);
    };

    const handleModalOk = () => {
        setNewCreditsModalOpen(false);
    };

    const handleModalCancel = () => {
        setNewCreditsModalOpen(false);
    };
    const editorRef = useRef(null);
    const onFinish = (values: any) => {
        newCredit(activeAccount?.address, values);
    };
    return (
        <>
            <Divider />
            {(project.creator === activeAccount?.address) && <Space>
                <Button type="primary" size="large" onClick={() => router.push("/loan/list")}>Borrow ALGO from DAOs</Button>
                <Button disabled={!project.is_eco_project} type="primary" size="large" onClick={() => showModal()}>Submit carbon offset credits</Button>
            </Space>
            }
            <Divider />
            <Modal width={600} open={newCreditsModalOpen} onCancel={handleModalCancel} footer={null} >
                <Card title="Submit carbon offset credits">
                    <Form form={form} onFinish={onFinish} layout="vertical">
                        <Alert type="info" message="Your carbon offset credits need ALGOGREE approval before you sell them on the marketplace" showIcon />
                        <br />
                        <Form.Item name={"title"} label="Title" rules={[{ required: true, message: 'Missing title' }]}>
                            <Input size='large' />
                        </Form.Item>
                        <Form.Item name={"total_credits"}
                            label="Total credits"
                            rules={[
                                { required: true, message: 'Missing total credits' },
                                {
                                    type: 'integer',
                                    min: 1,
                                    transform(value) {
                                        return Number(value)
                                    },
                                }
                            ]}
                            extra="The total credits (kilograms of carbon offset) must be an integer; therefore, float numbers cannot be used."
                        >
                            <Input size='large' type="number" />
                        </Form.Item>
                        <Form.Item name={"proof_document"} label="Proof document" rules={[{ required: true, message: 'Missing proof document', type: "url" }]}>
                            <Input size='large' />
                        </Form.Item>
                        <Divider />
                        <Form.Item name={"description"} label={"Requirement description"} rules={[{ required: true, message: 'Missing description' }]} noStyle>
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
                        <Button loading={createCreditAction.processing} htmlType='submit' type='primary' size='large'>Submit</Button>
                    </Form>
                </Card>
            </Modal>
        </>
    )
}