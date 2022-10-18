import React,{useState} from 'react'
import {Card,Form,Input, InputNumber,Button} from 'antd'

export default function BillingsForm(){

    const [bankDetails, setBankDetails] =  useState({})

    const onFinish = (formData:FormData)=>{
        console.log(formData)
    }

    return(
        <Card>
             <Form
            name="billingsForm"
            initialValues={{ remember: true }}
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
                name="accountNo"
                label='Beneficiary account number'
                rules={[{ required: true, message: 'Please input a valid account number' }]}
            >
                <Input placeholder="Wiscontin, United states" />
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
                name="routingNo"
                label='Routing number'
                rules={[{ required: true, message: 'Please input a valid routing number' }]}
            >
                <Input placeholder="433354564" />
            </Form.Item>

            <Form.Item
                name="swiftCode"
                label='Swift/Bic code'
                rules={[{ required: true, message: 'Please input a valid email!' }]}
            >
                <Input type='email' placeholder="example@yahoo.com" />
            </Form.Item>


            <Form.Item>
                <Button type="primary" htmlType="submit">
                Add bank details
                </Button>
            </Form.Item>

                </Form>
        </Card>        
    )
}