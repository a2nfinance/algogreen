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
            label: `Proposal`,
            children:  <ProposalList />,
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