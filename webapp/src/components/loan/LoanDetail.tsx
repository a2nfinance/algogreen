import { Button, Card, Descriptions, Divider } from "antd"

export const LoanDetail = () => {
    const m = 1;
    const detail = {
        id: m,
        title: `Title ${m}`,
        description: `Description`,
        created_at: `${m}`,
        status: `status ${m}`,
        dao_id: `DAO ${m}`,
        general_rate: `Rate ${m}`,
        special_rate: `SR ${m}`,
        start_date: `std ${m}`,
        end_date: `ed ${m}`,
        requirement: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        limited_amount: 10,
        required_collateral: true,
    }
    return (
        <Card title={detail.title}>
            <Descriptions column={3} title="General info" layout="vertical">
                <Descriptions.Item label={"Decription"}>{detail.description}</Descriptions.Item>
                <Descriptions.Item label={"Create at"}>{detail.created_at}</Descriptions.Item>
                <Descriptions.Item label={"Status"}>{detail.status}</Descriptions.Item>
                <Descriptions.Item label={"General rate"}>{detail.general_rate}</Descriptions.Item>
                <Descriptions.Item label={"Special rate"}>{detail.special_rate}</Descriptions.Item>
                <Descriptions.Item label={"Start date"}>{detail.start_date}</Descriptions.Item>
                <Descriptions.Item label={"End date"}>{detail.end_date}</Descriptions.Item>
                <Descriptions.Item label={"Limited amount"}>{detail.limited_amount}</Descriptions.Item>
                <Descriptions.Item label={"Required Colleteral"}>{detail.required_collateral ? "Yes" : "No"}</Descriptions.Item>
            </Descriptions>

            <Descriptions column={3} title="Requirement" layout="vertical">
                <Descriptions.Item>{detail.requirement}</Descriptions.Item>
            </Descriptions>
            
            <Divider />
            <Button type="primary" size="large">Apply</Button>
        </Card>
    )
}