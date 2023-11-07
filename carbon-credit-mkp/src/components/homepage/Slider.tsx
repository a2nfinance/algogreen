import { Carousel, Col, Image, Row } from "antd"

export const Slider = () => {
    return (
        <Row gutter={12}>
            <Col span={24}>
                <Carousel autoplay>
                    <div>
                        <Image src="/banner/carbon-offset.jpg" />
                    </div>
                </Carousel>
            </Col>
        </Row>

    )
}