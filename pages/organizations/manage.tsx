import { Content } from 'antd/lib/layout/layout'
import { Typography, Row, Button, Col, Avatar, List, Tag, Form, Input, Modal, Radio, Space, notification, FormInstance } from 'antd'
const {Title,Text} = Typography
import {ArrowLeftOutlined} from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import {PlusCircleOutlined} from '@ant-design/icons'

import { useRouter } from 'next/router'
import BillingsLayout from '../../components/Layout/BillingsLayout'
import BillingsView from '../../components/BillingsPage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import useUrlPrefix from '../../hooks/useUrlPrefix'
import { useOrgContext } from '../../context/OrgContext'
import { useAuthContext } from '../../context/AuthContext'
import useEvent from '../../hooks/useEvents'


const data = [
    {
      title: 'Mujahid',
      email: 'mujahid.bappai@yahoo.com',
      role: 'Owner'
    },
    {
      title: 'Peter Richards',
      email: 'peterrichards@gmail.com',
      role: 'Co-admin'
    },
    {
      title: 'Omololu Seum',
      email: 'omololu@gmail.com',
      role: 'Co-admin'
    },
    {
      title: 'Segun Adebayo',
      email: 'segunadebayo@yahoo.com',
      role: 'Co-admin'
    },
  ];

export default function Manage(){

    const router = useRouter()

    const prefix = useUrlPrefix()

    const {paseto} = useAuthContext()

    const {currentOrg} = useOrgContext()

    const queryClient = useQueryClient()

    const [isOpen, setIsOpen] = useState(false)

    const coAdminQuery = useQuery({
        queryKey: ['co-Admins',currentOrg.orgId],
        queryFn: async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${prefix}/co-admin?pageSize=20&pageNumber=1&orgId=${currentOrg.orgId}`,{
                headers:{
                    'Authorization': paseto
                }
            });
            return res.data.data
        },
    })


    const coAdminMutation = useMutation({
        mutationFn:async(payload:any)=>{
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${prefix}/co-admin`,{
                
                headers:{
                    'Authorization': paseto
                },
                data: payload
            })
            
            return res
        },
        onSuccess:()=>{
            notification['success']({
                message: 'Succesfully deleted co-admin',
                style:{
                  width:500
                },
                duration: 4
              });
            queryClient.invalidateQueries(['co-Admins'])  
        },

        onError:()=>{
            notification['error']({
                message: 'Error deleting co-admin',
                style:{
                  width:500
                },
                duration: 4000
              });
        }
    })

    function deleteCoAdmin(userId:string){
        const payload = {
            id: userId
        }
        coAdminMutation.mutate(payload)
    }
    
    return(
    <div style={{background:'#f6f6f6', height:'100%', minHeight:'60vh'}}>
        <div style={{width:'60%'}}>
            <Title level={2}>Manage Access</Title>
            <Text>Any user that gets added here will assume the same role as you to continue to be a co-admin in your organization; meaning they also get permision to create, read, edit and delete all assets in your organization </Text>
        </div>
        
        <Button shape='round' type='primary' onClick={()=>setIsOpen(true)} icon={<PlusCircleOutlined rev={undefined}/>} style={{marginTop:'3rem'}}>Add new co-admin</Button>

        <div style={{display:'flex', width:'50%', marginTop:'3rem', flexDirection: 'column'}}>

        <Button shape='round' size='small' style={{marginBottom: '1.5rem' , justifySelf:'flex-end', width:'fit-content'}} onClick={()=>coAdminQuery.refetch()}>Refresh</Button>

        <List
            itemLayout="horizontal"
            dataSource={coAdminQuery?.data || []}
            loading={coAdminQuery.isLoading || coAdminQuery.isRefetching}
            renderItem={(item:any, index) => (
            <List.Item
               actions={[<Button shape='round'  onClick={()=>deleteCoAdmin(item.id)} danger key="list-loadmore-more">Delete</Button>]}
            >
                <List.Item.Meta
                // avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                title={item.title}
                description={
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text>{item.email}</Text>
                        <Tag style={{width: 'fit-content', marginTop:'.3rem'}}>{item.role===4?'Co-admin':'Owner'}</Tag> 
                    </div>
                }
                />
            </List.Item>
    )}
    />
    </div>

     <CoAdminForm open={isOpen} onCancel={()=>setIsOpen(false)} />
    </div>
    )
}

Manage.PageLayout = BillingsLayout

interface ICoAdmin{
    open: boolean,
    onCancel: ()=>void
}
const CoAdminForm: React.FC<ICoAdmin> = ({
    open,
    onCancel,
  }) => {

    const [form] = Form.useForm();
  
    const {paseto} = useAuthContext()
   const {currentOrg} = useOrgContext()
  
    const urlPrefix = useUrlPrefix()
  
    const createDataHandler = async(newItem:any)=>{
      const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/co-admin`, newItem,{
          headers:{
              "Authorization": paseto
          },
      })
      if(data.status > 200){
        throw new Error(data.message)
      }
      return data
  }
  
  const queryClient = useQueryClient()
  
  const createData = useMutation(createDataHandler,{
     onSuccess:(data)=>{
      notification['success']({
          message: 'Succesfully added a new user as co-admin',
          style:{
            width:500
          },
          duration: 4
        });
        onCancel()
     },

      onError:(data:any)=>{
          notification['error']({
              message:data.message ,
            });
          // leave modal open
      },
      onSettled:()=>{
        queryClient.invalidateQueries(['co-Admins'])
      }
  })
  
  const staffMutation = createData
  
  function handleSubmit(formData:any){
    // console.log(formData)
    const payload = {
      email: formData.email,
      role: 4,
      orgId: currentOrg.orgId
    }
    // console.log(payload)
    createData.mutate(payload)
  }
  
    return (
      <Modal
        open={open}
        title="Add user as co-admin"
        onCancel={onCancel}
        footer={null}
  
      >
        <Form
          form={form}
          layout="vertical"
          name="coAdminForm"
          onFinish={handleSubmit}
          initialValues={{modifier:'public'}}
        >
          <Form.Item
            name="email"
            label="Email"
            hasFeedback
            style={{marginTop:'1rem'}}
            rules={[{type:'email', message:'Please provide a valid email'},{ required: true, message: 'Please provide a valid email' }]}
          >
            <Input allowClear size="large" />
          </Form.Item>
  
          <Form.Item style={{marginTop:'3rem',marginBottom:'0'}}>
              <Space>
                  <Button shape="round" onClick={()=>onCancel()} type='ghost'>
                      Cancel
                  </Button>
  
                  <SubmitButton
                    form={form}
                    isLoading={staffMutation.isLoading}
                  />
              </Space>     
          </Form.Item>
        </Form>
      </Modal>
    );
  };


  interface SubmitButtonProps{
    isLoading: boolean,
    form: FormInstance
  }
  

  const SubmitButton = ({ form, isLoading }:SubmitButtonProps) => {
    const [submittable, setSubmittable] = useState(false);
  
    // Watch all values
    const values = Form.useWatch([], form);
  
  
    useEffect(() => {
        
  
      form.validateFields({validateOnly:true}).then(
        (res) => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        },
      );
    }, [values]);
  
    return (
     <Button shape="round" type="primary" disabled={!submittable} size="large" loading={isLoading}  htmlType="submit" >
        Add Co-admin
     </Button>
    );
  };
  