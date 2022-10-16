import React from 'react'
import {Card,List,Typography,Button,Avatar} from 'antd'
import { useRouter } from 'next/router'

const {Title,Text} = Typography

interface StoreListProps{
    stores: Array<any>,
    onRegisterNewStore: ()=>void
}
export default function StoreList({stores, onRegisterNewStore}:StoreListProps){

    const router = useRouter()

    const titleNode = (
        <div style={{display:'flex',justifyContent:'space-between'}} >
            <Title level={5}>Stores</Title>
            <Button onClick={onRegisterNewStore}>Launch new store</Button>
        </div>
    )

    const navigateToStorePage = (index:string)=>{
        router.push(`/stores/${index}`)
    }

    return(
        <Card title={titleNode}>
            <List
            itemLayout="horizontal"
            dataSource={stores}
            renderItem={(item, index) => (
            <List.Item>
                <List.Item.Meta
                // avatar={<Avatar src={window.URL.createObjectURL(item.storeLogo[0])} />}
                title={<Text style={{cursor:'pointer'}} onClick={()=>navigateToStorePage(String(index))} >{item.storeName}</Text>}
                description={item.location}
                />
            </List.Item>
             )}
             />           
        </Card>
    )
}