import * as React from 'react';
import {Card,Form,Input,Button,InputNumber,Divider} from 'antd';
import { useRouter } from 'next/router';


interface OrganisationViewProps{
}
export default function OrganisationView({}:OrganisationViewProps){


    const router = useRouter()

    const onFinish= (formData:FormData)=>{
        console.log(formData)
        router.push('/dashboard')
    }

    const showRequestNotification = ()=>{

    }

    return(
        <Card className='w-8/12' title='Register an organisation'>
            <Form
            name="organisationForm"
            initialValues={{ remember: false }}
            layout='vertical'
            onFinish={onFinish}
            >
            <Form.Item
                name="name"
                label="Organisation name"
                rules={[{ required: true, message: 'Please enter a valid organisation name' }]}
             >
                <Input placeholder="eg. Avery labs" />
            </Form.Item>

            <Form.Item
                name="Address"
                label='Organisation address'
                rules={[{ required: true, message: 'Please enter a valid address' }]}
            >
                <Input placeholder="No 6, West bridge miller" />
            </Form.Item>

            <Form.Item
                name="email"
                label='Organisation email'
                rules={[{ required: true, message: 'Please input a valid email!' }]}
            >
                <Input type='email' placeholder="billcage@yahoo.com" />
            </Form.Item>

            <Form.Item
                name="phone"
                label='Organisation phone'
                rules={[{ required: true, message: 'Please input a valid phone!' }]}
            >
                <Input placeholder="08023234763" />
            </Form.Item>

            <Divider orientation="left"></Divider>

            <Form.Item>
                <Button type="primary" htmlType="submit" >
                Request for organisation account
                </Button>
            </Form.Item>

                </Form>
        </Card>
    )
}