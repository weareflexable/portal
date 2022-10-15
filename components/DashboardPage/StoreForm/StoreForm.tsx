import React,{useState} from 'react';
import {Card,Form, Input,InputNumber,Upload,Button,notification, Space, Alert, Typography} from 'antd';
const { TextArea } = Input;
const {Text} = Typography;
import {UploadOutlined} from '@ant-design/icons'

import { useRouter } from 'next/router';


interface StoreFormProps{
    onLaunchStore: (formData:any)=>void
    onCancelFormCreation: ()=>void
}
export default function StoreForm({onLaunchStore, onCancelFormCreation}:StoreFormProps){


    const router = useRouter()

    const [submitted,setSubmitted] = useState(false)

    const onFinish = (formData:FormData)=>{
        // call function to create store
        onLaunchStore(formData)
        showStoreCreationNotification()
        router.push('/dashboard#store')
        // router.push('/')
    }

    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        return e?.fileList;
      };

    const showStoreCreationNotification = () => {
        notification['success']({
          message: 'Store created succesfully',
          description:
            'The next step is to create services inside store for user to be able to interact with.',
        });
      };
      

      if (typeof window === undefined){
        return <></>
    }

    return (
        <Card title='Launch new store'>
            <Form
            name="storeForm"
            initialValues={{ remember: true }}
            layout='vertical'
            onFinish={onFinish}
            >
            <Form.Item
                name="storeName"
                label="Store name"
                rules={[{ required: true, message: 'Please input a valid store name' }]}
             >
                <Input placeholder="Bill Cage coffee" />
            </Form.Item>

            <Form.Item
                name="location"
                label='Location'
                rules={[{ required: true, message: 'Please input a valid address!' }]}
            >
                <Input placeholder="Wiscontin, United states" />
            </Form.Item>

            <Form.Item
                name="ticketsPerDay"
                label='Tickets per day'
                rules={[{ required: true, message: 'Please input a valid phone!' }]}
            >
                <InputNumber placeholder="543" />
            </Form.Item>

            <Form.Item
                name="noOfServices"
                label='Number of services'
                rules={[{ required: true, message: 'Please input a valid number!' }]}
            >
                <InputNumber placeholder="12" />
            </Form.Item>

            <Form.Item name='description' label="Store description">
                <TextArea maxLength={150} rows={3} />
            </Form.Item>


            <Form.Item
                name="storeLogo"
                label="Store Logo"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Upload file upto 2MB"
            >
                <Upload name="logo" action="" listType="picture">
                <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
            </Form.Item>


            <Form.Item>
                <Space>
                    <Button onClick={onCancelFormCreation} type='ghost'>
                        Cancel
                    </Button>

                    <Button type="primary"  htmlType="submit" >
                    Launch store
                    </Button>
                </Space>
                
            </Form.Item>

            </Form>
        </Card>
    )
}
