import { Card, Col, Row, Statistic } from "antd"
import { statisticCard } from "src/theme/layout"

export const LoanStatistic = () => {
    return (
        <Row gutter={6}>
            <Col span={6}>
                <Card style={statisticCard} >
                    <Statistic title="Total" value={100} />
                </Card>

            </Col>
            <Col span={6}>
                <Card style={statisticCard} >
                    <Statistic title="Active" value={0} />
                </Card>
            </Col>
            <Col span={6}>  <Card style={statisticCard} >
                <Statistic title="Expire" value={100} />
            </Card>
            </Col>
            <Col span={6}>
                <Card style={statisticCard} >
                    <Statistic title="Requests" value={0} />
                </Card>
            </Col>
        </Row>
    )
}