import { useWallet } from '@txnlab/use-wallet';
import { Button, Card, Form, Input, Radio, Space } from 'antd';
import { setDaoFormProps, updateDaoFormState } from 'src/controller/dao/daoFormSlice';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { deployDAO } from 'src/core/dao';
import { headStyle } from "src/theme/layout";

export const VotingConfiguration = () => {
    const { activeAccount, sendTransactions, signTransactions } = useWallet()
    const dispatch = useAppDispatch();
    const { generalForm, votingSettingForm } = useAppSelector(state => state.daoForm);
    const { deployDaoAction } = useAppSelector(state => state.process);
    const onFinish = (values: any) => {
        dispatch(setDaoFormProps({ att: "votingSettingForm", value: values }))
        if (generalForm.status === 1) {
            deployDAO(activeAccount?.address, signTransactions, sendTransactions)
        } else (
            dispatch(updateDaoFormState(2))
        )

    };
    return (
        <Form
            name='voting_setting_form'
            initialValues={votingSettingForm}
            onFinish={onFinish}
            layout='vertical'>
            <Card title="DAO configuration" headStyle={headStyle} extra={
                <Space wrap>
                    <Button type="primary" htmlType='button' onClick={() => dispatch(updateDaoFormState(0))} size='large'>Back</Button>
                    <Button type="primary" htmlType='submit' size='large' loading={deployDaoAction.processing}>{generalForm.status === 1 ? "Deploy DAO" : "Next"}</Button>
                </Space>
            }>
                <Form.Item name="dao_title" label="Title" rules={[{ required: true, message: 'Missing title' }]}>
                    <Input size='large' />
                </Form.Item>
                <Form.Item name="passing_threshold" label="Passing threshold" rules={[{ required: true, message: 'Missing threshold' }]}
                    extra={"The proportion of those who voted on a proposal who must vote 'Aggree' for it to pass."}
                >
                    <Input type='number' size='large' suffix="%" />
                </Form.Item>
                <Form.Item name="quorum" label="Quorum" rules={[{ required: true, message: 'Missing quorum' }]}
                    extra={"The minimum percentage of voting power that must vote on a proposal for it to be considered. For example, in the US House of Representatives, 218 members must be present for a vote. If you have a DAO with many inactive members, setting this value too high may make it difficult to pass proposals."}
                >
                    <Input type='number' size='large' suffix="%" />
                </Form.Item>
                <Form.Item name="submission_policy" label={"Proposal submission policy"}
                    extra={"Who is allowed to submit proposals to the DAO?"}
                >
                    <Radio.Group>
                        <Radio value={1}>Anyone</Radio>
                        <Radio value={0}>Only Members</Radio>
                    </Radio.Group>
                </Form.Item>
                
            </Card>
        </Form>
    )
}
