import { Col, Descriptions, Row } from "antd";
import { Detail } from "src/components/dao/Detail";
import { LoanDetail } from "src/components/loan/LoanDetail";

export default function ID() {
    return (
        <Row gutter={16}>
            <Col span={6}>
                <Detail />
            </Col>
            <Col span={18}>
                <LoanDetail />
            </Col>
        </Row>
    )
}