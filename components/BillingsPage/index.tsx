
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const {Text,Title} = Typography
const {Option} = Select
import React, { ReactNode, useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Modal, notification, Select, Popconfirm, Spin} from 'antd'
import axios from 'axios';

import { useAuthContext } from '../../context/AuthContext';
import { Bank } from "./Types/Banks.types";
import useUrlPrefix from '../../hooks/useUrlPrefix'
import { useOrgContext } from "../../context/OrgContext";
import { useRouter } from "next/router";



export default function BillingsView(){

    const {paseto} = useAuthContext()
    const {currentOrg} = useOrgContext()

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const router = useRouter()

    const queryClient = useQueryClient()

    const urlPrefix = useUrlPrefix()


    async function fetchBankAccount(){
        const res = await axios({
            method:'get',
            //@ts-ignore
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank/stripe?orgId=${currentOrg.orgId}`,
            headers:{
                "Authorization": paseto
            }
        })
        return res.data.data;
    }

    const bankAccountQuery = useQuery({
      queryKey: ['bank','details','admin',currentOrg.id],
      queryFn: fetchBankAccount,
      enabled: paseto !== undefined,
    })

    const deleteActionMutation = useMutation({
      mutationFn: async(payload:{orgId:string | undefined})=>{
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/orgs/bank-account`,{data:payload,
            headers:{
              'Authorization': paseto
            }
        }
        )
        return res.data
      },
      onSuccess:(data:any)=>{
        queryClient.invalidateQueries(['bank','details','admin',currentOrg.id])
      },
      onError:(error:any)=>{
        console.log('Error generating account links')
      }
    })
    const editAccountMutation = useMutation({
      mutationFn: async(payload:{orgId:string | undefined})=>{
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/orgs/account-link`,payload,{
          headers:{
            'Authorization': paseto
          }
        })
        return res.data
      },
      onSuccess:(data:any)=>{
        const stripeOnboardUrl = data.data
        window.location.href = stripeOnboardUrl
      },
      onError:(error:any)=>{
        console.log('Error generating account links')
      }
    })

    const accountLinkMutation = useMutation({
      mutationFn: async(payload:{orgId:string | undefined})=>{
        const res = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/orgs/account-link`,payload,{
          headers:{
            'Authorization': paseto
          }
        })
        return res.data
      },
      onSuccess:(data:any)=>{
        const stripeOnboardUrl = data.data
        window.location.href = stripeOnboardUrl
      },
      onError:(error:any)=>{
        console.log('Error generating account links')
      }
    })

    function editAccountInfo(){
      editAccountMutation.mutate({orgId: currentOrg.orgId})
    }

    function toggleDeleteModal(){
      setIsDeleteModalOpen(!isDeleteModalOpen)
    }

    function deleteUserAccount(){
      deleteActionMutation.mutate({orgId: currentOrg.orgId})
    }

    function connectToStripeOnboarding(){
      accountLinkMutation.mutate({orgId: currentOrg.orgId})
    }



        return (
            <main>
              <header style={{display:'flex', flexDirection:'column', marginTop:'1rem', marginBottom:'3rem', width:'100%', }}>
                 <Title style={{ margin:'0'}} level={2}>Payout</Title>
                 <Text>Manage your organizations billing information</Text> 
             </header>
             { bankAccountQuery.isLoading || bankAccountQuery.isRefetching
             ? <Spin/>
             : bankAccountQuery.data.account === null
             ? <EmptyState>
                <Button disabled={accountLinkMutation.isLoading} onClick={connectToStripeOnboarding} type='primary'>Create Account</Button>
              </EmptyState>
              :
              <>
                {/* statistics */}
              <article style={{display:'flex', maxWidth:'800px', border:'1px solid #d8d8d8', padding:'1rem 1.5rem', justifyContent:'space-around'}}>
                  <div style={{display:'flex', flex:'1', flexDirection:'column'}}>
                    <Text type="secondary">Event Sales</Text>
                    <Text  style={{fontSize:'1.7rem'}}>$38</Text> 
                  </div>
                  <div style={{display:'flex', flex:'1', flexDirection:'column'}}>
                    <Text type="secondary">Community Sales</Text>
                    <Text  style={{fontSize:'1.7rem'}}>$68</Text> 
                  </div>
                  <div style={{display:'flex', flex:'1', flexDirection:'column'}}>
                    <Text type="secondary">Service Sales</Text>
                    <Text  style={{fontSize:'1.7rem'}}>$168</Text> 
                  </div>
                  <div style={{display:'flex', flex:'1', flexDirection:'column'}}>
                    <Text type="secondary">Total Sales</Text>
                    <Text  style={{fontSize:'1.7rem'}}>$1,368</Text> 
                  </div>
              </article>

              {/* account details */}
              <section style={{background:'#f1f1f1', maxWidth:'800px', marginTop:'2rem', padding: '30px 24px', borderRadius:'8px'}}>
                <div style={{display:'flex', marginBottom:'2rem', justifyContent:'space-between'}}>
                  <div>
                    <Title style={{marginBottom:'0'}} level={5}>{bankAccountQuery?.data?.account_holder_name !==''? bankAccountQuery?.data?.account_holder_name: '-- -- --'}</Title>
                    <Text >{bankAccountQuery?.data?.bank_name}</Text>  
                  </div>
                  <div>
                    <Text >{`${bankAccountQuery?.data?.country} • ${bankAccountQuery?.data?.currency}`}</Text>  
                  </div>
                </div>

                <div style={{display:'flex', marginBottom:'2rem',  justifyContent:'space-between'}}>
                  <div style={{display:'flex', flexDirection:'column'}}>
                    <Text strong>{`**** **** **** ${bankAccountQuery?.data?.last4}`}</Text>  
                    <Text type="secondary">Account No</Text>  
                  </div>
                  <div style={{display:'flex', flexDirection:'column'}}>
                    <Text strong>{bankAccountQuery?.data?.routing_number}</Text>  
                    <Text type="secondary">Routing No</Text>  
                  </div>
                  <div style={{display:'flex', flexDirection:'column'}}>
                    <Text strong>Checking</Text>  
                    <Text type="secondary">Account Type</Text>  
                  </div>
                </div>

                <div style={{display:'flex', justifyContent:'flex-end'}}>
                  <Button loading={editAccountMutation.isLoading} onClick={editAccountInfo} type="link">Edit Card information</Button>
                  <Button danger onClick={toggleDeleteModal} type="link">Delete Account</Button>
                  <DeleteAccountModal
                    onDeleteAccount={deleteUserAccount}
                    isDeletingAccount={deleteActionMutation.isLoading}
                    account={bankAccountQuery?.data}
                    isOpen={isDeleteModalOpen}
                    onCloseModal={toggleDeleteModal}
                  />
                </div>
             </section>
           

              </>
             }
              
            </main>
    )



}




interface DeleteProp{
  account: any
  isOpen: boolean
  onCloseModal: ()=>void
  onDeleteAccount: ()=>void
  isDeletingAccount: boolean
}

function DeleteAccountModal({account, isOpen, isDeletingAccount, onDeleteAccount, onCloseModal}:DeleteProp){

  function onFinish(){
    // call mutate function to delete record
    onDeleteAccount()
  }

  const [form] = Form.useForm()

  return(
    <Modal title="Are you absolutely sure?" footer={null} open={isOpen} onOk={()=>{}} onCancel={onCloseModal}>
      {/* <Alert style={{marginBottom:'.5rem'}} showIcon message="Bad things will happen if you don't read this!" type="warning" /> */}
      <Text >
        {`Deleting this account will not enable you to receive payments on all services, communities and events listed on the marketplace. All services, communities and events created without an account will be saved as draft by default 
        `}
      </Text>

      <Form 
      form={form} 
      style={{marginTop:'1rem'}}
      name="deleteEventForm" 
      layout='vertical'
      onFinish={onFinish}>
      <Form.Item
        name="name"
        style={{marginBottom:'.6rem'}}
        label={`Please type "${account.bank_name}" to confirm`}
        rules={[{ required: true, message: 'This field is required!' }]}
      >
        <Input size="large" disabled={isDeletingAccount} />
      </Form.Item>

      <Form.Item
        style={{marginBottom:'0'}}
        shouldUpdate
       >
          {() => (
          <Button
            style={{width:'100%'}}
            size='large'
            danger
            loading={isDeletingAccount}
            htmlType="submit"
            disabled={
              // !form.isFieldTouched('name') &&
              form.getFieldValue('name') !== account.bank_name
              // !!form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
           I understand the consequences, delete permanently
          </Button>
        )}
      </Form.Item>

    </Form>

  </Modal>
  )
}





interface EmptyStateProps{
  children: ReactNode
}

function EmptyState({children}:EmptyStateProps){

  return(
    <div style={{border: '1px solid #d6d6d6', marginTop:'2rem', borderRadius:'4px', height:'50vh', display:'flex', justifyContent:'center', alignItems:'center', padding: '2rem'}}>
      <div style={{maxWidth:'350px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <Title level={4}>Create New Account</Title> 
        <Text style={{textAlign:'center'}}>Add an account to get started receiving payouts from your tickets purchases on the marketplace</Text>
        <div style={{marginTop:'1rem', display:'flex',justifyContent:'center'}}>
            {children}
        </div>
      </div>
    </div>
  )
}
