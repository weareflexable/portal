import React,{useState} from 'react'
import {Card,Form,Input, InputNumber,Button, notification} from 'antd'
import { BankAccount } from '../../../types/BankAccount'


interface EditBankAccountFormProps{
    initValues: BankAccount | undefined
    onEditBankAccount: (store:BankAccount)=>void
    onCloseEditForm: ()=>void
}

export default function EditBankAccountForm({initValues,onEditBankAccount, onCloseEditForm}:EditBankAccountFormProps){


    const prevValues = initValues;
    console.log(initValues)

    const onFinish = (formData:BankAccount)=>{
        // call function to create store
        const formObject = {
            ...prevValues,
            ...formData
        }
        onEditBankAccount(formObject)
        showStoreCreationNotification()
        onCloseEditForm()

    }

    const showStoreCreationNotification = () => {
        notification['success']({
          message: 'Bank account updated succesfully',
        });
      };

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
                name="accountName"
                label='Beneficiary name'
                rules={[{ required: true, message: 'Please input name used on card' }]}
            >
                <Input placeholder="Bill Cage" />
            </Form.Item>

            <Form.Item
                name="accountNumber"
                label='Beneficiary account number'
                rules={[{ required: true, message: 'Please input a valid account number' }]}
            >
                <Input type='number' placeholder="0127467382" />
            </Form.Item>

            <Form.Item
                name="address"
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
                <Button type="primary" htmlType="submit">
                Add bank details
                </Button>
            </Form.Item>

                </Form> 
    )
}