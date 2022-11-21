import { Form, Input, Upload, Button, Divider } from "antd";
import {UploadOutlined} from '@ant-design/icons'
import {OrgFormData} from '../../../types/OrganisationTypes'
import { usePlacesWidget } from "react-google-autocomplete";
import { useRef } from "react";

interface RegisterNewOrgProps{
    onRegisterNewOrg: (org:OrgFormData)=>void
    isRegisteringOrg: boolean
}
export default function RegisterOrgForm({onRegisterNewOrg,isRegisteringOrg}:RegisterNewOrgProps){

    const [form]=Form.useForm()
    const antInputRef = useRef();

    const onFinish= (formData:OrgFormData)=>{
        const payload={
                name:formData.name,
                emailId: formData.emailId,
                address: formData.address,
                phoneNumber: formData.phoneNumber,
                imageFile: formData.imageFile[0].originFileObj
        }
        onRegisterNewOrg(payload)
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

    
    const { ref: antRef } = usePlacesWidget({
        apiKey: 'AIzaSyB7ZUkMcIXpOKYU4r4iBMM9BFjCL5OpeeE', // move this key to env
        onPlaceSelected: (place) => {
            // console.log(antInputRef.current.input)
            form.setFieldValue('address',place?.formatted_address)

            //@ts-ignore
          antInputRef.current.input.value = place?.formatted_address

        },
      });

    return(
        <Form
            name="organisationForm"
            initialValues={{ remember: false }}
            layout='vertical'
            onFinish={onFinish}
            form={form}
            >
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter a valid organisation name' }]}
             >
                <Input placeholder="eg. Avery labs" />
            </Form.Item>

            <Form.Item
                name="address"
                label='Address'
                rules={[{ required: true, message: 'Please enter a valid address' }]}
            >
                <Input ref={(c) => {
                    // @ts-ignore
                    antInputRef.current = c;
                    // @ts-ignore
                    if (c) antRef.current = c.input;
                    }} 
                    placeholder="Wiscontin, United states" 
                    /> 
            </Form.Item>

            <Form.Item
                name="emailId"
                label='Email'
                rules={[{ required: true, message: 'Please input a valid email!' }]}
            >
                <Input type='email' placeholder="billcage@lazarus.com" />
            </Form.Item>

            <Form.Item
                name="phoneNumber"
                label='Manager phone number'
                rules={[{ required: true, message: 'Please input a valid phone!' }]}
            >
                <Input placeholder="08023234763" />
            </Form.Item>

            <Form.Item
                name="imageFile"
                label="Logo"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Upload file upto 2MB"
            >
                <Upload name="logo" action="" listType="picture">
                <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
            </Form.Item>


            <Form.Item>
                <Button size='middle' shape="round" style={{display:'flex', alignItems:'center'}} loading={isRegisteringOrg} type="primary" htmlType="submit" >
                     Register organisation
                </Button>
            </Form.Item>

         </Form>
    )
} 