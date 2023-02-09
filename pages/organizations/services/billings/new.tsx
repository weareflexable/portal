

import React,{useState} from 'react'
import {Card,Form,Input, InputNumber,Button, Typography, Radio, notification, Row, Col} from 'antd'
import { Bank } from '../../../../components/BillingsPage/Types/Banks.types'
import { useOrgContext } from '../../../../context/OrgContext'
import {ArrowLeftOutlined} from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import router, { useRouter } from 'next/router'
import axios from 'axios'
import { useAuthContext } from '../../../../context/AuthContext'

const {Title} = Typography;



interface CreateBankAccountFormProps{
    onCreateBankAccount: (formData:Bank)=>void
    isCreatingData: boolean
}

export default function CreateBankAccountForm(){

    const {currentOrg} = useOrgContext()
    const {paseto} = useAuthContext()
    const router  = useRouter()

    const onFinish = (formData:Bank)=>{
        // call function to create store
        const formObject = {
            ...formData,
            //@ts-ignore
            orgId: currentOrg.orgId
        }
        createData.mutate(formObject)
        // onCreateBankAccount(formObject)
    }

    const [form] = Form.useForm()


    const createDataHandler = async(newItem:any)=>{
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org-bank`, newItem,{
            headers:{
                "Authorization": paseto
            },
        })
        return data
    }

    const createData = useMutation(createDataHandler,{
       onSuccess:()=>{
        form.resetFields()
        console.log('record created')
        notification['success']({
            message: 'Successfully created new bank account!'
        })
        setInterval(()=>{
            router.back()
        },2000)
       },
        onError:()=>{
            notification['error']({
                message: 'Encountered an error while creating record',
              });
            // leave modal open
        } 
    })

    const {isError, isLoading:isCreatingData, isSuccess:isDataCreated, data:createdData} = createData

    return(
        <div style={{background:'#ffffff', height:'100%', minHeight:'100vh'}}>
            <div style={{marginBottom:'3rem', padding: '1rem', borderBottom:'1px solid #e5e5e5',}}>
                <Row>
                    <Col offset={1}> 
                        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Button shape='round' style={{marginRight:'1rem'}} type='text' onClick={()=>router.back()} icon={<ArrowLeftOutlined/>}/>
                            <Title style={{margin:'0'}} level={3}>Create new bank account</Title>
                        </div>
                    </Col>
                </Row>
            </div>
            
            <Row>
                <Col offset={5} span={10}>
                <Form
                    name="billingsForm"
                    initialValues={{ remember: true }}
                    layout='vertical'
                    onFinish={onFinish}
                    form={form}
                >
                <div style={{marginBottom:'2rem'}}>
                <Title level={3}>Beneficiary info</Title>
                </div>

                <Form.Item
                    name="beneficiaryName"
                    label='Name'
                    rules={[{ required: true, message: 'Please input name used on card' }]}
                >
                    <Input size='large' placeholder="Bill Cage" />
                </Form.Item>

                <Form.Item
                    name="beneficiaryAddress"
                    label='Address'
                    rules={[{ required: true, message: 'Please enter valid address' }]}
                >
                    <Input size='large' placeholder="89, Highstreet Boston" />
                </Form.Item>


                <Form.Item
                    name="currency"
                    label="Currency"
                    rules={[{ required: true, message: 'Please select your currency' }]}
                >
                    <Input placeholder="USD" />
                </Form.Item>

                <Form.Item 
                    label="Account type" 
                    name="accountType"
                    rules={[{ required: true, message: 'Please select an accountType' }]}
                    >
                    <Radio.Group>
                        <Radio.Button value="savings">Savings</Radio.Button>
                        <Radio.Button value="current">Current</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <div style={{marginBottom:'2rem', marginTop:'3rem'}}>
                <Title level={3}>Bank info</Title>
                </div>

                <Form.Item
                    name="bankName"
                    label='Name'
                    rules={[{ required: true, message: 'Please enter valid bank name' }]}
                >
                    <Input size='large' placeholder="Silvergate crest bank" />
                </Form.Item>

                <Form.Item
                    name="accountNo"
                    label='Account number'
                    rules={[{ required: true, message: 'Please input a valid account number' }]}
                >
                    <Input allowClear size='large' placeholder="0127467382" />
                </Form.Item>

                <Form.Item
                    name="bankAddress"
                    label='Address'
                    rules={[{ required: true, message: 'Please enter valid address' }]}
                >
                    <Input size='large' placeholder="89, Highstreet Boston" />
                </Form.Item>

                <Form.Item
                    name="routingNumber"
                    label='Routing number'
                    rules={[{ required: true, message: 'Please input a valid routing number' }]}
                >
                    <Input size='large' placeholder="433354564" />
                </Form.Item>

                <Form.Item
                    name="swiftCode"
                    label='Swift/BIC code'
                    rules={[{ required: true, message: 'Please input a valid routing number!' }]}
                >
                    <Input size='large' type='number' placeholder="37567489374" />
                </Form.Item>


                <Form.Item style={{marginTop:'3rem'}}>
                    <Button type="primary" size='large' shape='round' loading={isCreatingData} htmlType="submit">
                    { isCreatingData? 'Creating...' :'Add bank details'}
                    </Button>
                </Form.Item>

            </Form> 
                </Col>
            </Row>
            

        </div>
    )
}