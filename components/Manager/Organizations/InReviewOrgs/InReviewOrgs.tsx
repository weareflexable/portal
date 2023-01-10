import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, List, Button, Avatar, Typography, Tag } from "antd";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";
import { useState } from "react";


export default function InReviewOrgs(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()

    const [selectedOrg, setSelelectedOrg] = useState(null)

    async function fetchInReviewOrgs(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/orgs?key=status&value=2&page_number=0&page_size=10`,
            headers:{
                "Authorization": paseto
            }
        })
        return res.data;
    }

    async function acceptOrg(orgId: string){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,
            data:{
                key:'status',
                value: '2',
                org_id: orgId
            },
            headers:{
                "Authorization": paseto
            }
        })
        return res; 
    }

    async function rejectOrg(orgId:string){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,
            data:{
                key:'status',
                value: '4',
                org_id: orgId
            },
            headers:{
                "Authorization": paseto
            }
        })
        return res; 
    }

    const acceptOrgMutation = useMutation(['acceptOrgMutation'],{
        mutationFn: acceptOrg,
        onSuccess:(data:any)=>{
            console.log('successfully mutate data', data)
            queryClient.invalidateQueries({queryKey:['inReviewOrgs']})
        },
        onError:()=>{
            console.log('Error changing status')
        }
    })

    const rejectOrgMutation = useMutation(['rejectOrgMutation'],{
        mutationFn: rejectOrg,
        onSuccess:(data:any)=>{
            console.log('successfully mutate data', data)
            queryClient.invalidateQueries({queryKey:['inReviewOrgs']})
        },
        onError:()=>{
            console.log('Error changing status')
        }
    })

    function rejectOrgHandler(org:any){
        setSelelectedOrg(org.org_id)
        rejectOrgMutation.mutate(org.org_id)

    }
    function acceptOrgHandler(org:any){
        setSelelectedOrg(org.org_id)
        acceptOrgMutation.mutate(org.org_id)
    }

    const orgQuery = useQuery({queryKey:['inReviewOrgs'], queryFn:fetchInReviewOrgs, enabled:paseto !== ''})
    const InReviewOrgs = orgQuery.data && orgQuery.data.data



        return (

            <Card style={{ width: '100%', marginTop: '1em' }}>
             <List
                size="small"
                bordered={false}
                loading={orgQuery.isLoading}
                dataSource={InReviewOrgs}
                renderItem={(item:any )=> <List.Item
                    actions={[<Button key={item.id} shape='round' loading={selectedOrg === item.org_id && rejectOrgMutation.isLoading}  onClick={()=>rejectOrgHandler(item)} danger type="text" >Reject Request</Button>,<Button key={item.id} shape='round' loading={selectedOrg === item.org_id && acceptOrgMutation.isLoading} onClick={()=>acceptOrgHandler(item)} type='primary' >Accept Request</Button>]}
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