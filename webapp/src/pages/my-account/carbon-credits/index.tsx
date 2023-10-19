import { CreditList } from "src/components/carbon-credits/CreditList";
import { CreditStatistic } from "src/components/carbon-credits/CreditStatistic";

export default function Index() {
    return (
        <>
            <CreditStatistic />
            <br />
            <CreditList />
        </>
    )
}