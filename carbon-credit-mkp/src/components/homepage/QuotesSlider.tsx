import { Carousel, Typography } from "antd"

export const QuotesSlider = () => {
    return (
        <Carousel autoplay effect="fade">
            <div >
                <Typography.Title style={{height: 30}} level={5} italic>
                    92% of consumers say they’re more likely to trust brands that are environmentally or socially conscious. <a href="https://www.forbes.com/sites/forbesnycouncil/2018/11/21/do-customers-really-care-about-your-environmental-impact/?sh=7c5eed22240d" target="_blank"> - Forbes</a>
                </Typography.Title>
            </div>
            <div>
                <Typography.Title  style={{height: 30}} level={5} italic>
                88% of consumers will be more loyal to a company that supports social or environmental issues. 
                <a target="_blank" href="https://www.forbes.com/sites/forbesnycouncil/2018/11/21/do-customers-really-care-about-your-environmental-impact/?sh=7c5eed22240d"> - Forbes</a>
            </Typography.Title>
            </div>
            <div>
                <Typography.Title  style={{height: 30}} level={5} italic>

                87% of consumers would buy a product with a social and environmental benefit if given the opportunity.
                <a href="http://www.forbes.com/sites/forbesnycouncil/2018/11/21/do-customers-really-care-about-your-environmental-impact/?sh=7c5eed22240d" target="_blank"> - Forbes</a>
                </Typography.Title>
            </div>
            <div>
                <Typography.Title  style={{height: 30}} level={5} italic>
                Overall sales revenue can increase up to 20% due to corporate responsibility practices.
                <a target="_blank" href="http://www.scholar.harvard.edu/hiscox/publications/buying-green-field-experimental-tests-consumer-support-environmentalism"> - Harvard Business Review </a>
                    </Typography.Title>
            </div>
            <div>
                <Typography.Title  style={{height: 30}} level={5} italic>
                64% of millennials are willing to turn down a job if the company doesn’t have strong corporate responsibility.
                <a target="_blank" href="http://www.conecomm.com/research-blog/2016-millennial-employee-engagement-study"> - Cone Communications </a>
                    </Typography.Title>
            </div>
            <div>
                <Typography.Title  style={{height: 30}} level={5} italic>
                66% of global consumers are willing to pay more for sustainable goods.
                <a target="_blank" href="http://www.inc.com/melanie-curtin/73-percent-of-millennials-are-willing-to-spend-more-money-on-this-1-type-of-product.html"> - INC </a>
                    </Typography.Title>
            </div>
            <div>
                <Typography.Title  style={{height: 30}} level={5} italic>
                38% of employees are more likely to be loyal to a company that prioritizes sustainability.
                <a target="_blank" href="http://www.shrm.org/about-shrm/press-room/press-releases/pages/sustainabilityreport.aspx"> - SHRM </a>
                    </Typography.Title>
            </div>
            <div>
                <Typography.Title  style={{height: 30}} level={5} italic>
                Employees at eco-friendly companies are 16% more productive than average.
                <a target="_blank" href="https://www.cnbc.com/2016/04/18/run-a-green-business-make-money.html"> - UCLA Newsroom </a>
                    </Typography.Title>
            </div>
            <div>
                <Typography.Title  style={{height: 30}} level={5} italic>
                Businesses that enroll in Community Solar can save around 10% on their monthly electric bills
                <a target="_blank" href="https://solstice.us/solstice-blog/solar-for-businesses-and-organizations/#:~:text=Solar%20for%20Businesses%3A%20How%20Community%20Solar%20Can%20Benefit%20Your%20Organization,-We%20see%20it&text=It%20spreads%20when%20community%20members,well%2Dbeing%20of%20the%20community."> - Community Solar </a>
                    </Typography.Title>
            </div>
        </Carousel>
    )
}