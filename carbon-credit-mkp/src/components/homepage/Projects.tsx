import {useEffect} from "react";
import { Button, Card } from "antd"
import { getFeaturedProjects } from "src/core/project";

export const Projects = () => {
    useEffect(() => {
        getFeaturedProjects();
    }, [])
    return (
        <Card title="Projects" style={{border: "none"}} headStyle={{padding: 0, textTransform: "uppercase"}} extra={
            <Button> More</Button>
        }>
                
        </Card>
    )
}