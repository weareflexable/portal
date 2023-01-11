import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, List, Button, Avatar, Typography, Tag } from "antd";
import axios from "axios";
import {PlusCircleOutlined} from '@ant-design/icons'
import { useAuthContext } from "../../../../context/AuthContext";
import { useState } from "react";


export default function ApprovedOrgs(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()

    const [selectedOrg, setSelelectedOrg] = useState(null)

    async function fetchDeActivatedOrgs(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/orgs?key=status&value=0&pageNumber=0&pageSize=10`,
            headers:{
                "Authorization": paseto
            }
        })
        return res.data;
    }


    async function reActivateOrg(orgId:string){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,
            data:{
                key:'status',
                value: '1',
                org_id: orgId
            },
            headers:{
                "Authorization": paseto
            }
        })
        return res; 
    }

    const reActivateOrgMutation = useMutation(['acceptOrgMutation'],{
        mutationFn: reActivateOrg,
        onSuccess:(data:any)=>{
            console.log('successfully mutate data', data)
            queryClient.invalidateQueries({queryKey:['rejectedOrgs']})
        },
        onError:()=>{
            console.log('Error changing status')
        }
    })

    
    function reActivateOrgHandler(org:any){
        setSelelectedOrg(org.org_id)
        reActivateOrgMutation.mutate(org.org_id)
    }

    const orgQuery = useQuery({queryKey:['deActivatedOrgs'], queryFn:fetchDeActivatedOrgs, enabled:paseto !== ''})
    const approvedOrgs = orgQuery.data && orgQuery.data.data



        return (

            <Card style={{ width: '100%', marginTop: '1em' }}>
             <List
                size="small"
                bordered={false}
                loading={orgQuery.isLoading}
                dataSource={approvedOrgs}
                renderItem={(item:any )=> <List.Item
                    actions={[<Button key={item.id} shape='round' loading={selectedOrg === item.org_id && reActivateOrgMutation.isLoading} onClick={()=>reActivateOrgHandler(item)} type='primary' >Re-activate</Button>]}
                    style={{ border: 'none', backgroundColor: '#f9f9f9', marginBottom: '.5em', padding: '1em', borderRadius: '4px' }}
                    key={item.id}
                >
                    <List.Item.Meta
                        avatar={<Avatar src={`https://nftstorage.link/ipfs/${item.imageHash}`} />}
                        title={<div style={{ display: 'flex' }}>
                            <Typography.Text style={{ marginRight: '1em' }}>{item.name}</Typography.Text>
                            {/* <Tag>{item.role === 'STAFF' ? 'Employee' : item.role}</Tag> */}
                        </div>} />

                </List.Item>} />
            </Card>
    )
}