
import { Button, Card, Descriptions, Divider, Form, Tag } from "antd";
import { useRouter } from "next/router";
import { updateDaoFormState } from "src/controller/dao/daoFormSlice";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { TESTNET_EXPLORER } from "src/core/constant";
import { useAddress } from "src/hooks/useAddress";
import { headStyle } from "src/theme/layout";

export const ReviewAndApprove = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { generalForm, votingSettingForm, tokenGovernanceForm, currentStep } = useAppSelector(state => state.daoForm);

    return (
        <Card title="Summary" headStyle={headStyle} extra={
            <Button type="primary" htmlType='button' onClick={() => dispatch(updateDaoFormState(2))} size='large'>Back</Button>
        }>
            <Descriptions title={"Organization"} layout={"vertical"} column={3}>
                <Descriptions.Item label={"Title"}>{generalForm.organization_name}</Descriptions.Item>
                <Descriptions.Item label={"Owner"}>{generalForm.owner}</Descriptions.Item>
                <Descriptions.Item label={"Address"}>{generalForm.address}</Descriptions.Item>
                <Descriptions.Item label={"City"}>{generalForm.city ? generalForm.city : "N/A"}</Descriptions.Item>
                <Descriptions.Item label={"State"}>{generalForm.state ? generalForm.state : "N/A"}</Descriptions.Item>
                <Descriptions.Item label={"Zipcode"}>{generalForm.zipcode ? generalForm.zipcode : "N/A"}</Descriptions.Item>
                <Descriptions.Item label={"Country"}>{generalForm.country ? generalForm.country : "N/A"}</Descriptions.Item>
                <Descriptions.Item label={"Email"}>{generalForm.email}</Descriptions.Item>
                <Descriptions.Item label={"Phone number"}>{generalForm.phone_number}</Descriptions.Item>
                <Descriptions.Item label={"Status"}><Tag color="green">Verified</Tag></Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions layout={"vertical"} column={1}>
                <Descriptions.Item label="Description">{generalForm.description}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions title="Social networks" layout={"vertical"} column={2}>
                <Descriptions.Item label={"Website"}>{generalForm.website}</Descriptions.Item>
                <Descriptions.Item label={"Twitter"}>{generalForm.twitter}</Descriptions.Item>
                <Descriptions.Item label={"Telegram"}>{generalForm.telegram}</Descriptions.Item>
                <Descriptions.Item label={"Facebook"}>{generalForm.facebook}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions title={"DAO"}>
                <Descriptions.Item label={"Title"}>{votingSettingForm.dao_title}</Descriptions.Item>
                <Descriptions.Item label={"Quorum"}>{votingSettingForm.quorum} %</Descriptions.Item>
                <Descriptions.Item label={"Passing threshold"}>{votingSettingForm.passing_threshold} %</Descriptions.Item>
                <Descriptions.Item label={"Proposal submission policy"}>{votingSettingForm.submission_policy}</Descriptions.Item>
                <Descriptions.Item label={"DAO token name"}>{tokenGovernanceForm.name}</Descriptions.Item>
                <Descriptions.Item label={"DAO token supply"}>{tokenGovernanceForm.supply}</Descriptions.Item>
                <Descriptions.Item label={"DAO ID"}><a href={`${TESTNET_EXPLORER}/${generalForm.dao_app_id}`} target="_blank">{generalForm.dao_app_id}</a></Descriptions.Item>
                <Descriptions.Item label={"Token ID"}><a href={`${TESTNET_EXPLORER}/${generalForm.dao_app_id}`} target="_blank">{generalForm.token_id}</a></Descriptions.Item>
            </Descriptions>

            <Divider />

            <Button type="primary" onClick={() => router.push(`/dao/detail/${generalForm._id}`)}>View onchain DAO details</Button>
        </Card>
    )
}
