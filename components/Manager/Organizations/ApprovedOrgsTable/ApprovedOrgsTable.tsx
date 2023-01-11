import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, List, Button, Avatar, Typography, Tag } from "antd";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";
import { useState } from "react";


export default function ApprovedOrgs(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()

    const [selectedOrg, setSelelectedOrg] = useState(null)

    async function fetchApprovedOrgs(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/orgs?key=status&value=1&pageNumber=0&pageSize=10`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }

    async function deActivateOrg(orgId: string){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,
            data:{
                key:'status',
                value: '0', // 0 means de-activated in db
                org_id: orgId
            },
            headers:{
                "Authorization": paseto
            }
        })
        return res; 
    }

    
    const deActivateOrgMutation = useMutation(['deActivateOrgMutation'],{
        mutationFn: deActivateOrg,
        onSuccess:(data:any)=>{
            queryClient.invalidateQueries({queryKey:['approvedOrgs']})
        },
        onError:()=>{
            console.log('Error changing status')
        }
    })



    function deActivateOrgHandler(org:any){
        setSelelectedOrg(org.org_id)
        deActivateOrgMutation.mutate(org.org_id)
    }

    const orgQuery = useQuery({queryKey:['approvedOrgs'], queryFn:fetchApprovedOrgs, enabled:paseto !== ''})
    const approvedOrgs = orgQuery.data && orgQuery.data.data



        return (

            <Card style={{ width: '100%', marginTop: '1em' }}>
             <List
                size="small"
                bordered={false}
                loading={orgQuery.isLoading}
                dataSource={approvedOrgs}
                renderItem={(item:any )=> <List.Item
                    actions={[<Button key={item.id} shape='round' loading={selectedOrg === item.orgId && deActivateOrgMutation.isLoading} onClick={()=>deActivateOrgHandler(item)} type='primary' >De-activate</Button>]}
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