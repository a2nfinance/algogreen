import { Card } from "antd";

import { Typography } from 'antd';
import { useRouter } from "next/router";
import { Credits } from "src/components/homepage/Credits";
import { Projects } from "src/components/homepage/Projects";
import { Slider } from "src/components/homepage/Slider";
// import { FeatureImageSlides } from "src/components/home/FeatureImageSlides";

const { Title, Text } = Typography;
const { Meta } = Card;

export default function Index() {
    const router = useRouter();

    return (
        <div style={{ maxWidth: 1200, margin: "auto", padding: 10 }}>
            <Slider />
            <Projects/>
            <Credits/>
        </div>
    )
}