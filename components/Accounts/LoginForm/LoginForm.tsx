import * as React from 'react';
import {Card,Form,Input,Button} from 'antd'
import { useRouter } from 'next/router';


interface LoginFormProps{
    toRegisterOrg: ()=>void
}
export default function LoginForm({toRegisterOrg}:LoginFormProps){

    const router = useRouter()

    const onFinish = (formData:FormData)=>{
        console.log(formData)
        router.push('/dashboard')
    }

    return(
    <Card id="loginForm" style={{width:'400px'}} title='Login to Organisation'>
             <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            layout='vertical'
            onFinish={onFinish}
            >

            <Form.Item
                name="email"
                label='Email'
                rules={[{ required: true, message: 'Please input a valid email address' }]}
            >
                <Input placeholder="billcage@gmail.com" />
            </Form.Item>

            <Form.Item
                name="orgName"
                label="Organisation name"
                rules={[{ required: true, message: 'Please input your Username!' }]}
             >
                <Input placeholder="Microsoft Chambers" />
            </Form.Item>

            <Form.Item
                name="orgId"
                label='Organisation ID'
                rules={[{ required: true, message: 'Please input a valid address!' }]}
            >
                <Input placeholder="Wiscontin, United states" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" >
                    Login to Organisation
                </Button>
                Or <Button onClick={toRegisterOrg} type='link' href='#registerOrganisation'>Register Organistation</Button>
            </Form.Item>

        </Form>

     </Card>
    )
}