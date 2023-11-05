import {useEffect} from "react";
import { Col, Row } from "antd";
import { useRouter } from "next/router";
import { DaoStatistic } from "src/components/dao/detail/DaoStatistic";
import { DaoTabs } from "src/components/dao/detail/DaoTabs";
import { DetailItem } from "src/components/dao/detail/DetailItem";
import { getDAODetailById } from "src/core/dao";

export default function ID() {
    const {id} = useRouter().query;
    useEffect(() => {
        if (id) {
            getDAODetailById(id.toString());
        }
    }, [id])
    return (
        <Row gutter={16}>
            <Col span={8}>
                <DetailItem />
            </Col>
            <Col span={16}>
                <DaoStatistic />
                <DaoTabs />
            </Col>
        </Row>
    )
}