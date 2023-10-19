import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import { ProposalList } from './ProposalList';
import { RecievedLoan } from './RecievedLoan';
import { CarbonCredits } from './CarbonCredits';
// import { Members } from './Members';
// import { Proposals } from './Proposals';
// import { TreasuryInfo } from './TreasuryInfo';
// import { OpenTasks } from './OpenTasks';

export const ProjectTabs = () => {

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `Loan proposal`,
            children:  <ProposalList />,
        },
        {
            key: '3',
            label: `Loan contracts`,
            children: <RecievedLoan />
        },
        {
            key: '4',
            label: `Carbon credits`,
            children:<CarbonCredits />
        }
    ];

    return (
        <Tabs defaultActiveKey="1" items={items} onChange={() => { }} />
    )
}