import { Divider, Space } from "antd";
import { DAOCreationProgress } from "src/components/dao/DAOCreationProgress";
import { General, ReviewAndApprove, VotingConfiguration } from "src/components/dao/form";
import { TokenGovernance } from "src/components/dao/form/TokenGovernance";
import { useAppSelector } from "src/controller/hooks";

export default function New() {
    const { currentStep } = useAppSelector(state => state.daoForm);
    
    return (
        <div style={{ maxWidth: 768, margin: "auto" }}>
            <DAOCreationProgress />
            <Divider />
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                {currentStep === 0 && <General isNewForm={false} />}
                {currentStep === 1 && <VotingConfiguration />}
                {currentStep === 2 && <TokenGovernance />}
                {currentStep === 3 && <ReviewAndApprove />}
            </Space>

        </div>

    )
}