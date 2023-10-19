import { Col, Row } from "antd";
import { DaoStatistic } from "src/components/dao/detail/DaoStatistic";
import { DaoTabs } from "src/components/dao/detail/DaoTabs";
import { DetailItem } from "src/components/dao/detail/DetailItem";

export default function ID() {
    return (
        <Row gutter={16}>
            <Col span={6}>
                <DetailItem />
            </Col>
            <Col span={18}>
                <DaoStatistic />
                <DaoTabs />
            </Col>
        </Row>
    )
}