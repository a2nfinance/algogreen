import { Divider } from "antd";
import { MyList } from "src/components/credit/MyList";
import { MyStatistic } from "src/components/credit/MyStatistic";

export default function MyCredits() {
    return (
        <>
            <MyStatistic />
            <br />
            <MyList />
        </>
    )
}