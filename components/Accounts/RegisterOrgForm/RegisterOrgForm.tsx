import * as React from 'react';
import {Card,Form,Input,Button} from 'antd';
import { useRouter } from 'next/router';
import { OrgFormData } from '../../../types/OrganisationTypes';


interface RegisterOrgFormProps{
    onRegisterNewOrg : (formData: OrgFormData)=>void,
    isRegisteringOrg: boolean
}
export default function RegisterOrgForm({onRegisterNewOrg,isRegisteringOrg}:RegisterOrgFormProps){


    const router = useRouter()

    const onFinish= (formData:OrgFormData)=>{
        console.log(formData)
        onRegisterNewOrg(formData)
    }

    return(
        <Card id="registerOrganisation" className='w-8/12' title='Register an organisation'>
            <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            layout='vertical'
            onFinish={onFinish}
            >
            <Form.Item
                name="orgName"
                label="Organisation name"
                rules={[{ required: true, message: 'Please input your Username!' }]}
             >
                <Input placeholder="Microsoft Chambers" />
            </Form.Item>

            <Form.Item
                name="orgAddress"
                label='Organisation address'
                rules={[{ required: true, message: 'Please input a valid address!' }]}
            >
                <Input placeholder="Wiscontin, United states" />
            </Form.Item>

            <Form.Item
                name="orgPhone"
                label='Organisation phone'
                rules={[{ required: true, message: 'Please input a valid phone!' }]}
            >
                <Input placeholder="08023234763" />
            </Form.Item>

            <Form.Item
                name="managerEmail"
                label='Manager email'
                rules={[{ required: true, message: 'Please input a valid email!' }]}
            >
                <Input type='email' placeholder="example@yahoo.com" />
            </Form.Item>

            <Form.Item
                name="managerName"
                label='Manager name'
                rules={[{ required: true, message: 'Please input a valid name!' }]}
            >
                <Input placeholder="Bill Cage" />
            </Form.Item>

            <Form.Item
                name="managerPhone"
                label='Manager phone'
                rules={[{ required: true, message: 'Please input a valid number!' }]}
            >
                <Input placeholder="080235435432" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Register organisation
                </Button>
            </Form.Item>

                </Form>
        </Card>
    )
}