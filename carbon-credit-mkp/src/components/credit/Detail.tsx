import { Button, Col, Descriptions, Row, Space, Table } from "antd"

export const Detail = () => {
    const item = {
        title: "Demo Credit",
        information: "Demo credit",
        original_price: 7,
        allow_auction: true,
        document_list: [{
            title: "Document 1",
            url: "https://google.com"
        },
        {
            title: "Document 2",
            url: "https://google.com"
        }],
        auctions: [
            {
                from: "ABBABDDVCVC",
                price: 10
            },
            {
                from: "ABBABDDVCVC",
                price: 11
            },
            {
                from: "ABBABDDVCVC",
                price: 12
            },
            {
                from: "ABBABDDVCVC",
                price: 13
            },
        ]
    }
    return (
        <Row gutter={12}>
            <Col span={12}>
                <Descriptions column={1} layout="vertical">
                    <Descriptions.Item label="Video">
                        Youtube video
                    </Descriptions.Item>

                    <Descriptions.Item label="Document">
                        <Table pagination={false}  style={{width: "100%"}} dataSource={item.document_list} columns={[
                            {
                                title: "Title",
                                key: "title",
                                dataIndex: "title",
                            },
                            {
                                title: "URL",
                                key: "url",
                                dataIndex: "url",
                            }
                        ]} />
                    </Descriptions.Item>

                </Descriptions>

                <Space>
                    <Button type="primary">Add auction</Button>
                    <Button type="primary">Purchase</Button>
                </Space>

            </Col>
            <Col span={12}>
                <Descriptions column={1} layout="vertical">
                    <Descriptions.Item label="Title">
                        {item.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="Information">
                        {item.information}
                    </Descriptions.Item>
                    <Descriptions.Item label="Original Price">
                        {item.original_price} ALG
                    </Descriptions.Item>


                    <Descriptions.Item label={"Auctions"}>
                        <Table pagination={false}  style={{width: "100%"}} dataSource={item.auctions} columns={[
                            {
                                title: "From",
                                key: "from",
                                dataIndex: "from",
                            },
                            {
                                title: "Price",
                                key: "price",
                                dataIndex: "price",
                            },
                            {
                                title: "Actions",
                                key: "action",
                                render: (_, record) => (
                                    <Button type="primary" onClick={() => {
                                        //dispatch(setDaoDetailProps({att: "currentProposal", value: record}))
                                        // showDrawerDetail()


                                    }}>Accept</Button>
                                )
                            }
                        ]} />
                    </Descriptions.Item>
                </Descriptions>
            </Col>

        </Row>
    )
}