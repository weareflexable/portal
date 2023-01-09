import { useQuery } from "@tanstack/react-query";
import { Card, List, Button, Avatar, Typography, Tag } from "antd";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";


export default function ApprovedOrgs(){

    const {paseto} = useAuthContext()

    async function fetchApprovedOrgs(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/orgs`,
            data:{
                key:'status',
                value: '2',
                page_number: 0,
                page_size: 3
            },
            headers:{
                "Authorization": paseto
            }
        })
        return res.data;
    }

    const orgQuery = useQuery({queryKey:['approvedOrgs'], queryFn:fetchApprovedOrgs, enabled:paseto !== ''})

    console.log(orgQuery.data)

        return (
            <div>
                Approved orgs here
            </div>
            // // <Card style={{ width: '100%', marginTop: '1em' }}>
            // {/* <Button disabled={isLoadingOrgs} type='link' style={{ marginBottom: '1em', display: 'flex', alignItems: 'center' }} icon={<PlusCircleOutlined />} onClick={onShowCreateOrgForm}>Register new organisation</Button> */}
            // {/* <List
            //     size="small"
            //     bordered={false}
            //     // loading={isLoadingOrgs}
            //     dataSource={uniqueOrgs}
            //     renderItem={item => <List.Item
            //         actions={[<Button key={item.id} shape='round' disabled={!item.approved} type='primary' loading={item.id === selectedOrg ? isNavigatingToOrgs : false} onClick={() => navigateToApp(item)}>{item.approved ? `Go to organization` : 'Organization in review'}</Button>]}
            //         style={{ border: 'none', backgroundColor: '#f9f9f9', marginBottom: '.5em', padding: '1em', borderRadius: '4px' }}
            //         key={item.id}
            //     >
            //         <List.Item.Meta
            //             avatar={<Avatar src={`https://nftstorage.link/ipfs/${item.imageHash}`} />}
            //             title={<div style={{ display: 'flex' }}>
            //                 <Typography.Text style={{ marginRight: '1em' }}>{item.name}</Typography.Text>
            //                 <Tag>{item.role === 'STAFF' ? 'Employee' : item.role}</Tag>
            //             </div>} />

            //     </List.Item>} />
            // </Card> */}
    )
}