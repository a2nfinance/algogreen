import { Col, Divider, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Detail } from "src/components/credit/Detail";
import { ProjectInfo } from "src/components/credit/ProjectInfo";
import { getCreditById } from "src/core/credit";

export default function Id() {
    const { id } = useRouter().query;
    useEffect(() => {
        if (id) {
            getCreditById(id.toString());
        }
    }, [id])
    return (
        <>
            <Detail />
            <Divider/>
            <ProjectInfo />
        </>
    )
}