import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useWallet } from '@txnlab/use-wallet';
import { Alert, Button, Col, Divider, Form, Input, Row } from 'antd';
import { AiOutlineWallet } from 'react-icons/ai';
import { useAppSelector } from 'src/controller/hooks';
import { addMembers } from 'src/core/dao';

export const NewMembersForm = () => {
    const { activeAccount, signTransactions, sendTransactions } = useWallet();
    const { addMemberAction } = useAppSelector(state => state.process)
    const onFinish = (values: any) => {
        addMembers(activeAccount?.address, values["members"], signTransactions, sendTransactions);
    };

    return (
        <Form
            name='new_members_form'
            onFinish={onFinish}
            layout='vertical'>
            <Alert type='info' message="All members must opt their accounts into DAO assets to ensure the success of this action." showIcon />
            <Divider />
            <Form.List name={"members"}>
                {(memberFields, { add: addMember, remove: removeMember }) => (
                    <>
                        {memberFields.map(({ key, name, ...restField }, index) => (
                            <Row key={key} style={{ display: 'flex', marginBottom: 8 }} gutter={8}>
                                <Col span={22}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'address']}
                                        rules={[{ required: true, message: 'Missing address' }]}
                                    >

                                        <Input key={`input-auto-${key}`} addonBefore={<AiOutlineWallet />} size="large" placeholder="Member address" />

                                    </Form.Item>
                                </Col>
                                <Col span={2}>
                                    <MinusCircleOutlined onClick={() => removeMember(name)} />
                                </Col>


                            </Row>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => addMember()} icon={<PlusOutlined />}>
                                Add member
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Button type="primary" htmlType='submit' size='large' loading={addMemberAction.processing}>Submit</Button>
        </Form>
    )
}
