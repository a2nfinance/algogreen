import { Card, Col, Row, Statistic } from "antd"
import { useAppSelector } from "src/controller/hooks"
import { statisticCard } from "src/theme/layout"

export const LoanStatistic = () => {
    const {allLoans} = useAppSelector(state => state.loan);
    return (
        <Row gutter={6}>
            <Col span={6}>
                <Card style={statisticCard} >
                    <Statistic title="Total" value={allLoans.length} />
                </Card>

            </Col>
            <Col span={6}>
                <Card style={statisticCard} >
                    <Statistic title="Active" value={allLoans.filter(l => l.end_date >= new Date().getTime()).length} />
                </Card>
            </Col>
            <Col span={6}>  <Card style={statisticCard} >
                <Statistic title="Expire" value={allLoans.filter(l => l.end_date <= new Date().getTime()).length} />
            </Card>
            </Col>
            <Col span={6}>
                <Card style={statisticCard} >
                    <Statistic title="The interest rate is less than 3%" value={allLoans.filter(l => l.special_interest_rate <= 3).length} />
                </Card>
            </Col>
        </Row>
    )
}