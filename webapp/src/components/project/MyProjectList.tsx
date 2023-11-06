import { List } from "antd";
import { useEffect } from "react";
import { useAppSelector } from "src/controller/hooks";
import { useWallet } from "@txnlab/use-wallet";
import { getMyProjects } from "src/core/project";
import { Item } from "./Item";

export const MyProjectList = () => {
    const {activeAccount} = useWallet();
    const {myProjects} = useAppSelector(state => state.project)
    useEffect(() => {
        if(activeAccount?.address) {
            getMyProjects(activeAccount?.address);
        }
       
    }, [activeAccount?.address])
    return (
        <List
            grid={{
                gutter: 12,
                column: 3
            }}
            size="large"
            pagination={{
                onChange: (page) => {
                    console.log(page);
                },
                pageSize: 9,
                align: "center",
            }}
            dataSource={myProjects}
            renderItem={(item, index) => (
                <Item index={index} project={item} />
            )}
        />

    )
}

