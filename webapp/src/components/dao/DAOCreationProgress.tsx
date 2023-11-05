import { Card, Steps } from 'antd';
import { useAppSelector } from '../../controller/hooks';

export const DAOCreationProgress = () => {
    const { currentStep } = useAppSelector(state => state.daoForm)
    return (
        <Card style={{ backgroundColor: "#f5f5f5" }}>
            <Steps
                current={currentStep}
                items={[
                    {
                        title: 'KYC',
                    },
                    {
                        title: 'DAO settings',
                        //description: "A smart contract is deployed onchain"
                    },
                    {
                        title: 'Token settings',
                    },
                    {
                        title: 'Summary',
                        //description: "DAO is initialized with settings"
                    },
                ]}
            />
        </Card>

    )
}