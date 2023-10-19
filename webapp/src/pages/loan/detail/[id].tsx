import { Col, Descriptions, Row } from "antd";
import { DetailItem } from "src/components/dao/detail/DetailItem";
import { LoanDetail } from "src/components/loan/LoanDetail";

export default function ID() {
    return (
        <Row gutter={16}>
            <Col span={6}>
                <DetailItem />
            </Col>
            <Col span={18}>
                <LoanDetail />
            </Col>
        </Row>
    )
}