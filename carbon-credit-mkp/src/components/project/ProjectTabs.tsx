import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import { CarbonCredits } from './CarbonCredits';

export const ProjectTabs = () => {

    const items: TabsProps['items'] = [
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