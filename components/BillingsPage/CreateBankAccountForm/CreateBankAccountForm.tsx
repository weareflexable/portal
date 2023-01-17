import React,{useState} from 'react'
import {Card,Form,Input, InputNumber,Button, Radio, notification} from 'antd'
import { BankAccount } from '../../../types/BankAccount'
import { useOrgContext } from '../../../context/OrgContext'



interface CreateBankAccountFormProps{
    onCreateBankAccount: (formData:BankAccount)=>void
    isCreatingData: boolean
}

export default function CreateBankAccountForm({ isCreatingData, onCreateBankAccount}:CreateBankAccountFormProps){

    const {currentOrg} = useOrgContext()

    const onFinish = (formData:BankAccount)=>{
        // call function to create store
        const formObject = {
            ...formData,
            orgId: currentOrg.orgId
        }
        onCreateBankAccount(formObject)
        // showStoreCreationNotification()
        // onCloseForm()
    }

    return(
             <Form
            name="billingsForm"
            initialValues={{ remember: true }}
            layout='vertical'
            onFinish={onFinish}
            >

            <Form.Item
                name="beneficiaryName"
                label='Beneficiary name'
                rules={[{ required: true, message: 'Please input name used on card' }]}
            >
                <Input placeholder="Bill Cage" />
            </Form.Item>

            <Form.Item
                name="accountNo"
                label='Beneficiary account number'
                rules={[{ required: true, message: 'Please input a valid account number' }]}
            >
                <Input type='number' placeholder="0127467382" />
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

            <Form.Item
                name="beneficiaryAddress"
                label='Beneficiary address'
                rules={[{ required: true, message: 'Please enter valid address' }]}
            >
                <Input placeholder="89, Highstreet Boston" />
            </Form.Item>

            <Form.Item
                name="bankName"
                label='Bank name'
                rules={[{ required: true, message: 'Please enter valid bank name' }]}
            >
                <Input placeholder="Silvergate crest bank" />
            </Form.Item>

            <Form.Item
                name="bankAddress"
                label='Bank address'
                rules={[{ required: true, message: 'Please enter valid address' }]}
            >
                <Input placeholder="89, Highstreet Boston" />
            </Form.Item>

            <Form.Item
                name="routingNumber"
                label='Routing number'
                rules={[{ required: true, message: 'Please input a valid routing number' }]}
            >
                <Input placeholder="433354564" />
            </Form.Item>

            <Form.Item
                name="swiftCode"
                label='Swift/BIC code'
                rules={[{ required: true, message: 'Please input a valid routing number!' }]}
            >
                <Input type='number' placeholder="37567489374" />
            </Form.Item>


            <Form.Item>
                <Button type="primary" loading={isCreatingData} htmlType="submit">
                { isCreatingData? 'Creating...' :'Add bank details'}
                </Button>
            </Form.Item>

                </Form> 
    )
}