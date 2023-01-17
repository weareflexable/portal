import React,{useState} from 'react'
import {Card,Form,Input, InputNumber,Button, Radio} from 'antd'
import { BankAccount } from '../../../types/BankAccount'


interface EditBankAccountFormProps{
    initValues: BankAccount | undefined
    onEditBankAccount: (store:BankAccount)=>void
    onCloseEditForm: ()=>void,
    isPatchingData: boolean
}

export default function EditBankAccountForm({initValues,onEditBankAccount, isPatchingData, onCloseEditForm}:EditBankAccountFormProps){


    const prevValues = initValues;

    const onFinish = (formData:BankAccount)=>{
        // call function to create store
        const formObject = {
            ...prevValues,
            ...formData
        }
        onEditBankAccount(formObject)
        // onCloseEditForm()

    }

    

    return(
             <Form
            name="editBankAccountForm"
            initialValues={initValues}
            layout='vertical'
            onFinish={onFinish}
            >
            <Form.Item
                name="currency"
                label="Beneficiary account currency"
                rules={[{ required: true, message: 'Please select your currency' }]}
             >
                <Input placeholder="USD" />
            </Form.Item>

            <Form.Item
                name="beneficiaryName"
                label='Beneficiary name'
                rules={[{ required: true, message: 'Please input name used on card' }]}
            >
                <Input placeholder="Bill Cage" />
            </Form.Item>

            <Form.Item
                name="beneficiaryAddress"
                label='Beneficiary address'
                rules={[{ required: true, message: 'Please enter valid address' }]}
            >
                <Input placeholder="89, Highstreet Boston" />
            </Form.Item>


            <Form.Item
                name="accountNo"
                label='Beneficiary account number'
                rules={[{ required: true, message: 'Please input a valid account number' }]}
            >
                <Input type='number' placeholder="0127467382" />
            </Form.Item>

            <Form.Item 
                label="Account type" 
                name="accountType"
                rules={[{ required: true, message: 'Please select an accountType' }]}
                >
                <Radio.Group defaultValue='savings'>
                    <Radio.Button value="savings">Savings</Radio.Button>
                    <Radio.Button value="current">Current</Radio.Button>
                </Radio.Group>
            </Form.Item>


            <Form.Item
                name="bankName"
                label='Bank name'
                rules={[{ required: true, message: 'Please enter valid bank name' }]}
            >
                <Input placeholder="Silvergate crest bank" />
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
                label='Swift/Bic code'
                rules={[{ required: true, message: 'Please input a valid routing number!' }]}
            >
                <Input type='number' placeholder="37567489374" />
            </Form.Item>


            <Form.Item>
                <Button type="primary" loading={isPatchingData} htmlType="submit">
                 {isPatchingData? `Updating...`:`Apply changes`}
                </Button>
            </Form.Item>

                </Form> 
    )
}