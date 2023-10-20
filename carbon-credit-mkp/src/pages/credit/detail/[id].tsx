import { Col, Row } from "antd";
import { useRouter } from "next/router";
import { Detail } from "src/components/credit/Detail";
import { ProjectInfo } from "src/components/credit/ProjectInfo";

export default function Id() {
    const { id } = useRouter().query;
    return (
        <Row gutter={16}>
            <Col span={6}>
                <ProjectInfo />
            </Col>
            <Col span={18}>
                <Detail />
            </Col>
        </Row>
    )
}