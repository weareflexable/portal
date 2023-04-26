

import React,{useState} from 'react'
import {Card,Form,Input, InputNumber,Button, Typography, Radio, notification, Row, Col, Segmented, Checkbox, Select, Space} from 'antd'
import { Bank } from '../../../components/BillingsPage/Types/Banks.types'
import { useOrgContext } from '../../../context/OrgContext'
import {ArrowLeftOutlined} from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import router, { useRouter } from 'next/router'
import axios from 'axios'
import { useAuthContext } from '../../../context/AuthContext'
import useUrlPrefix from '../../../hooks/useUrlPrefix'
const countryList = require('country-list')

const {Title} = Typography;
const {Option} = Select

const list = countryList.getNames()
const america = countryList.getName('US')
const sortedList = list.sort()
const prioritizedList = [america, ...sortedList]


interface CreateBankAccountFormProps{
    onCreateBankAccount: (formData:Bank)=>void
    isCreatingData: boolean
}

export default function CreateBankAccountForm(){

    const {currentOrg} = useOrgContext()
    const {paseto} = useAuthContext()
    const router  = useRouter()

    const urlPrefix = useUrlPrefix()

    const queryClient = useQueryClient()

    const onFinish = (formData:Bank)=>{
        // call function to create store
        const formObject = {
            ...formData,
            //@ts-ignore
            orgId: currentOrg.orgId
        }
        console.log(formObject)
        createData.mutate(formObject)
        // onCreateBankAccount(formObject)
    }

    const [form] = Form.useForm()


    const createDataHandler = async(newItem:any)=>{
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank`, newItem,{
            headers:{
                "Authorization": paseto
            },
        })
        return data
    }

    const createData = useMutation(createDataHandler,{
       onSuccess:()=>{
        notification['success']({
            message: 'Successfully created new bank account!'
        })
            router.back()
       },
       onSettled:()=>{
        queryClient.invalidateQueries(['all-banks'])
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
                            <Button shape='round' style={{marginRight:'.2rem'}} type='link' onClick={()=>router.back()} icon={<ArrowLeftOutlined/>}/>
                            <Title style={{margin:'0'}} level={3}>Add Bank Details</Title>
                        </div>
                    </Col>
                </Row>
            </div>
            
            <Row>
                <Col offset={2} span={13}> 
                <Form
                    name="billingsForm"
                    initialValues={{ remember: true }}
                    layout='vertical'
                    onFinish={onFinish}
                    form={form}
                >
                <div style={{marginBottom:'2rem'}}>
                <Title level={3}>Beneficiary Details</Title>
                </div>

                <div style={{border:'1px solid #e2e2e2', borderRadius:'4px', padding:'1rem'}}>    
                    <Form.Item
                        name="beneficiaryName"
                        label='Name'
                        rules={[{ required: true, message: 'Please input name used on card' }]}
                    >
                        <Input allowClear size='large' placeholder="Bill Cage" />
                    </Form.Item>
                    <Form.Item
                        name="beneficiaryStreet"
                        label='Address Line'
                        style={{marginBottom:'0'}}
                        rules={[{ required: true, message: 'Please enter valid address' }]}
                    >
                        <Input allowClear size='large' placeholder="89, Highstreet" />
                    </Form.Item>


                    <Row style={{marginTop:'1.5rem',marginBottom:'0'}} >
                        <Col style={{height:'100%'}} span={11}>
                            <Form.Item
                                name="beneficiaryCountry"
                                style={{width:'100%'}}
                                label='Country'
                                rules={[{ required: true, message: 'Please select your country !' }]}
                            >
                                <Select
                                placeholder="Country"
                                allowClear
                                size='large'
                                style={{width:'100%'}}
                                >
                                    {prioritizedList.map((country:any)=>(
                                        <Option key={country} value={country}>{country}</Option>
                                    ))}
                                </Select>
                            </Form.Item> 
                        </Col>
                        <Col style={{height:'100%'}} offset={1} span={12}>
                            <Form.Item
                                name="beneficiaryState"
                                label='State'
                                style={{width:'100%'}}
                                rules={[{ required: true, message: 'Please provide a state' }]}
                            >
                                <Input style={{width:'100%'}} size='large' placeholder="State" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{}} >
                        <Col span={11}>
                            <Form.Item
                                name="beneficiaryCity"
                                label='City'
                                style={{marginBottom:'0'}}
                                rules={[{ required: true, message: 'Please select a city' }]}
                            >
                                <Input allowClear size='large' placeholder="City" />
                            </Form.Item>
                        </Col>
                        <Col offset={1} span={12}>
                            <Form.Item
                                name="beneficiaryPostalCode"
                                label='Postal Code'
                                style={{marginBottom:'0'}}
                                rules={[{ required: true, message: 'Please enter valid postcode' }]}
                            >
                                <Input allowClear size='large' placeholder="Postal Code" />
                            </Form.Item>
                        </Col>
                    </Row>


                   
        
                </div>


                <div style={{marginBottom:'2rem', marginTop:'3rem'}}>
                <Title level={3}>Account Details</Title>
                </div>

                <div style={{border:'1px solid #e2e2e2', borderRadius:'4px', padding:'1rem'}}> 

                    <Form.Item 
                        label="Account Type" 
                        name="accountType"
                        rules={[{ required: true, message: 'Please select an accountType' }]}
                        >
                        <Radio.Group size='large'>
                            <Radio.Button value="savings">Savings</Radio.Button>
                            <Radio.Button value="checking">Checking</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="accountNo"
                        label='Account Number'
                        rules={[{ required: true, message: 'Please input a valid account number' }]}
                    >
                        <Input allowClear size='large' placeholder="0127467382" />
                    </Form.Item>

            
                </div>



                <div style={{marginBottom:'2rem', marginTop:'3rem'}}>
                <Title level={3}>Bank details</Title>
                </div>


                <div style={{border:'1px solid #e2e2e2', borderRadius:'4px', padding:'1rem'}}>  

                <Form.Item
                    name="bankName"
                    label='Name'
                    rules={[{ required: true, message: 'Please enter valid bank name' }]}
                >
                    <Input allowClear size='large' placeholder="Silvergate crest bank" />
                </Form.Item>


                <Form.Item
                    name="bankAddress"
                    label='Address'
                    rules={[{ required: true, message: 'Please enter valid address' }]}
                >
                    <Input allowClear size='large' placeholder="89, Highstreet Boston" />
                </Form.Item>
{/* 
                <Form.Item
                    name="swiftCode"
                    label='Swift/BIC code'
                    rules={[{ required: true, message: 'Please input a valid routing number!' }]}
                >
                    <Input size='large' placeholder="AAAA-BB-CC-123" />
                
                </Form.Item> */}

                <Form.Item
                    name="routingNumber"
                    label='Routing Number'
                    rules={[{ required: true, message: 'Please input a valid routing number' }]}
                >
                    <Input allowClear size='large' placeholder="623852453 1234567 001" />
                </Form.Item>

                </div>

                    {/* <Form.Item
                        name="currency"
                        label="Currency"
                        style={{marginBottom:'0'}} 
                        rules={[{ required: true, message: 'Please select your currency' }]}
                    >
                        <Checkbox>
                            I have read the terms and conditions and I am fully aware to the consequences of my actions
                        </Checkbox>
                    </Form.Item> */}

                <Form.Item style={{marginTop:'3rem'}}>
                    <Space>
                        <Button onClick={()=>router.back()}>Cancel</Button>
                        <Button type="primary" size='large' shape='round' loading={isCreatingData} htmlType="submit">
                        { isCreatingData? 'Submiting...' :'Add Bank'}
                        </Button>
                    </Space>
                </Form.Item>
                

            </Form> 
                </Col>
            </Row>
            

        </div>
    )
}