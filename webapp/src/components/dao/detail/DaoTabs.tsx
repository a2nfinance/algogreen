import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import { Members } from './Members';
import { Proposals } from './Proposals';
import { TreasuryInfo } from './TreasuryInfo';
import { DAOLoans } from 'src/components/dao/detail/DAOLoans';

export const DaoTabs = () => {

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `Proposals`,
            children:  <Proposals />,
        },
        {
            key: '3',
            label: `Treasury Details`,
            children: <TreasuryInfo />,
        },
        {
            key: '4',
            label: `Members`,
            children: <Members />,
        },
        {
            key: '5',
            label: `Loans`,
            children: <DAOLoans />
        }
    ];

    return (
        <Tabs defaultActiveKey="1" items={items} onChange={() => { }} />
    )
}