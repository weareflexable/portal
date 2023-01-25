import { Card, List, Avatar, Typography, Tag } from "antd";
import {Button} from 'antd'
import { NewOrg, Org } from "../../../types/OrganisationTypes";
import {PlusCircleOutlined} from '@ant-design/icons'
import { useEffect, useState } from "react";
import { useOrgContext } from "../../../context/OrgContext";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../../../context/AuthContext";



interface OrganizationListProps{
}


export default function OrganizationList({}:OrganizationListProps) {

    const [selectedOrg, setSelectedOrg] = useState('')
    const [isNavigatingToOrgs, setIsNavigatingToOrg] = useState(false)
    // const [isLoadingOrgs, setIsLoadingOrgs] = useState(true)
    // const [data, setData] = useState([])

    const {switchOrg} =  useOrgContext()
    const {push,asPath} =  useRouter()


    const {paseto} = useAuthContext()

    // useEffect(() => {
    //     async function fetchOrgs(){
    //         const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/org/user/get-org`,{
    //             headers:{
    //                 //@ts-ignore
    //                 "Authorization": JSON.parse(paseto) 
    //             }
    //         })
    //         // return data
    //         setIsLoadingOrgs(false)
    //         setData(data.payload)
    //     }
    //     fetchOrgs()

    // }, [paseto])

    const {data,isLoading:isLoadingOrgs} = useQuery({queryKey:['orgs'],queryFn: async()=>{
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/org/user/get-org`,{
            headers:{
                //@ts-ignore
                "Authorization": paseto 
            }
        })
        return data;
    },
    enabled: paseto !== ''
}) 


    const orgs: NewOrg[] = data && data.payload;
    const uniqueOrgs: NewOrg[] = orgs?.filter((item, i) => orgs.findIndex((org)=>item.id===org.id)===i); 


    const navigateToApp = (org:NewOrg)=>{
        // save selected org to local storage
        
        setSelectedOrg(org.id)
        setIsNavigatingToOrg(true)
        setTimeout(() => {
            setIsNavigatingToOrg(false)
            switchOrg(org)
            push(`${asPath}/services`)
        }, 3000);
    }

    return <Card style={{ width: '100%', marginTop: '1em' }}>
        {/* <Button disabled={isLoadingOrgs} type='link' style={{ marginBottom: '1em', display: 'flex', alignItems: 'center' }} icon={<PlusCircleOutlined />} onClick={onShowCreateOrgForm}>Register new organisation</Button> */}
        <List
            size="small"
            bordered={false}
            loading={isLoadingOrgs}
            dataSource={uniqueOrgs}
            renderItem={(item:NewOrg) => <List.Item
                actions={[<Button key={item.id} shape='round'  type='primary' loading={item.id === selectedOrg ? isNavigatingToOrgs : false} onClick={() => navigateToApp(item)}>{item.status ? `Go to organization` : 'Organization in review'}</Button>]}
                style={{ border: 'none', backgroundColor: '#f9f9f9', marginBottom: '.5em', padding: '1em', borderRadius: '4px' }}
                key={item.id}
            >
                <List.Item.Meta
                    avatar={<Avatar src={`https://nftstorage.link/ipfs/${item.logoImageHash}`} />}
                    title={<div style={{ display: 'flex' }}>
                        <Typography.Text style={{ marginRight: '1em' }}>{item.name}</Typography.Text>
                    </div>} />

            </List.Item>} />
    </Card>;
}