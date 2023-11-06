import { useState } from "react";
import { Button, Card, DatePicker, Descriptions, Divider, Form, Input, Modal } from "antd"
import { useAppSelector } from "src/controller/hooks"
const { RangePicker } = DatePicker;
export const LoanDetail = () => {
    const { loanDetail } = useAppSelector(state => state.loan);
    
    return (
        <Card title={loanDetail.title}>
            <Descriptions column={2} title="General info" layout="vertical">
                <Descriptions.Item label={"Create at"}>{new Date(loanDetail.created_at).toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label={"Status"}>{loanDetail.status ? "Active" : "Inactive"}</Descriptions.Item>
                <Descriptions.Item label={"General interest rate"}>{loanDetail.general_interest_rate} %</Descriptions.Item>
                <Descriptions.Item label={"Special interest rate"}>{loanDetail.special_interest_rate} %</Descriptions.Item>
                <Descriptions.Item label={"Start date"}>{new Date(loanDetail.start_date).toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label={"End date"}>{new Date(loanDetail.end_date).toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label={"Maximum borrow amount"}>{loanDetail.maximum_borrow_amount}</Descriptions.Item>
                <Descriptions.Item label={"Term"}>{loanDetail.term} months</Descriptions.Item>
                <Descriptions.Item label={"Required colleteral"}>{loanDetail.require_collateral ? "Yes" : "No"}</Descriptions.Item>
                <Descriptions.Item label={"Allow early repay"}>{loanDetail.allow_early_repay ? "Yes" : "No"}</Descriptions.Item>

            </Descriptions>
            <Divider />
            <Descriptions column={3} title="Requirement description" layout="vertical">
                <Descriptions.Item>
                    <div
                        dangerouslySetInnerHTML={{ __html: loanDetail.description }}
                    />
                </Descriptions.Item>
            </Descriptions>
            
        </Card>
    )
}