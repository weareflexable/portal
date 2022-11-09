import { Form, Input, Upload, Button, Divider } from "antd";
import {UploadOutlined} from '@ant-design/icons'
import {OrganistationReq} from '../../../types/OrganisationTypes'

interface RegisterNewOrgProps{
    onRegisterNewOrg: (org:OrganistationReq)=>void
}
export default function RegisterOrgForm({onRegisterNewOrg}:RegisterNewOrgProps){


    const hashAsset = async()=>{
        // hash image and sent back has to caller as promise
    }

    const onFinish= (formData:OrganistationReq)=>{
        
        onRegisterNewOrg(formData)
        // router.push('/dashboard')
    }

    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        } 
        return e?.fileList;
      };

    const showRequestNotification = ()=>{

    }

    return(
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
                name="address"
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

            <Form.Item
                name="imageHash"
                label="Logo"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Upload file upto 2MB"
            >
                <Upload name="logo" action="" listType="picture">
                <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
            </Form.Item>

            <Divider orientation="left"></Divider>

            <Form.Item>
                <Button type="primary" htmlType="submit" >
                     Register organisation
                </Button>
            </Form.Item>

                </Form>
    )
}