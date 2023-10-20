import { Card, Col, Row, Statistic } from "antd"
import { statisticCard } from "src/theme/layout"

export const MyStatistic = () => {
    return (
        <Row gutter={6}>
            <Col span={6}>
                <Card style={statisticCard} >
                    <Statistic title="Total Credit" value={100} />
                </Card>

            </Col>
            <Col span={6}>
                <Card style={statisticCard} >
                    <Statistic title="Bought" value={0} />
                </Card>
            </Col>
            <Col span={6}>  <Card style={statisticCard} >
                <Statistic title="Sell" value={100} />
            </Card>
            </Col>
            <Col span={6}>
                <Card style={statisticCard} >
                    <Statistic title="Hold" value={0} />
                </Card>
            </Col>
        </Row>
    )
}