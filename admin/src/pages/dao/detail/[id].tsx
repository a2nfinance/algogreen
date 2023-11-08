import {useEffect} from "react";
import { Col, Row } from "antd";
import { useRouter } from "next/router";

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
        
                <DetailItem />
        
        </Row>
    )
}