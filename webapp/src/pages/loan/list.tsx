import { LoanList } from "src/components/loan/LoanList";
import { LoanStatistic } from "src/components/loan/LoanStatistic";

export default function List() {
    return (
        <>
            <LoanStatistic />
            <br/>
            <LoanList />
        </>
    )
}