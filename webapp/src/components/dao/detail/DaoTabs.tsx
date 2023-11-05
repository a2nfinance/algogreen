import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import { Loans } from 'src/components/dao/detail/Loans';
import { useAppSelector } from 'src/controller/hooks';
import { Proposals } from './Proposals';

export const DaoTabs = () => {
    const {appAccountInformation} = useAppSelector(state => state.daoDetail);
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `Proposals (${appAccountInformation["total-created-apps"]})`,
            children:  <Proposals />,
        },
        // {
        //     key: '3',
        //     label: `Treasury Details`,
        //     children: <TreasuryInfo />,
        // },
        // {
        //     key: '4',
        //     label: `Members`,
        //     children: <Members />,
        // },
        {
            key: '5',
            label: `Loans`,
            children: <Loans />
        }
    ];

    return (
        <Tabs defaultActiveKey="1" items={items} onChange={() => { }} />
    )
}