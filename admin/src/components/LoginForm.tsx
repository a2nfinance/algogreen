import { Alert, Button, Card, Form, Input } from "antd";
import { signIn } from 'next-auth/react';

export const LoginForm = () => {
    const onFinish = (values: any) => {
        signIn("credentials", {
            redirect: false,
            username: values.username,
            password: values.password
        })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div style={{ maxWidth: 400, margin: "auto" }}>
            <Card title="Login Form">
                <Form
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input size="large" placeholder="admin" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password size="large" placeholder="algogreen" />
                    </Form.Item>
                    <Alert type="info" message={"Using this credential for username & password: admin, algogreen"} />
                    <br/>
                    <Form.Item>
                        <Button type="primary" size="large" htmlType="submit" style={{width: "100%"}}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

        </div>
    )
}