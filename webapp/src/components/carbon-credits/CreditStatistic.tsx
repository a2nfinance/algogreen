import { Card, Col, Row, Statistic } from "antd"
import { statisticCard } from "src/theme/layout"

export const CreditStatistic = () => {
    return (
        <Row gutter={6}>
            <Col span={6}>
                <Card style={statisticCard} >
                    <Statistic title="Total" value={100} />
                </Card>

            </Col>
            <Col span={6}>
                <Card style={statisticCard} >
                    <Statistic title="Pending" value={0} />
                </Card>
            </Col>
            <Col span={6}>
                <Card style={statisticCard} >
                    <Statistic title="Approved" value={100} />
                </Card>
            </Col>
            <Col span={6}>
                <Card style={statisticCard} >
                    <Statistic title="Rejected" value={0} />
                </Card>
            </Col>
        </Row>
    )
}