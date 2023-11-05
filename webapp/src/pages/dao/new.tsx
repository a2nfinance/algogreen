import { Col, Divider, Form, Row, Space } from "antd";
import { DAOCreationProgress } from "src/components/dao/DAOCreationProgress";
import { General, ReviewAndApprove, VotingConfiguration } from "src/components/dao/form";
import { setDaoFormProps } from "src/controller/dao/daoFormSlice";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { useCallback } from "react";
import { TokenGovernance } from "src/components/dao/form/TokenGovernance";

export default function New() {
    const { generalForm } = useAppSelector(state => state.daoForm);
    return (
        <div style={{ maxWidth: 768, margin: "auto" }}>
            <DAOCreationProgress />
            <Divider />


            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                {generalForm.status === 0 && <General isNewForm={true} />}
                {generalForm.status === 1 && <VotingConfiguration />}
                {generalForm.status === 2 && <TokenGovernance />}
                {generalForm.status === 3 && <ReviewAndApprove />}
            </Space>

        </div>

    )
}