import React from 'react'
import {Card,List,Typography,Button} from 'antd'
const {Title} = Typography

interface StoreListProps{
    stores: Array<any>,
    onRegisterNewStore: ()=>void
}
export default function StoreList({stores, onRegisterNewStore}:StoreListProps){
    console.log(stores)

    const titleNode = (
        <div style={{display:'flex',justifyContent:'space-between'}} >
            <Title level={5}>Stores</Title>
            <Button onClick={onRegisterNewStore}>Launch new store</Button>
        </div>
    )

    return(
        <Card title={titleNode}>
            <List
            itemLayout="horizontal"
            dataSource={stores}
            renderItem={item => (
            <List.Item>
                <List.Item.Meta
                // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={<a href="https://ant.design">{item.storeName}</a>}
                description={item.description}
                />
            </List.Item>
             )}
             />           
        </Card>
    )
}