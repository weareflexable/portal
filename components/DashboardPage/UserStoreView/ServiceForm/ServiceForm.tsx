import React,{useState} from 'react';
import {Card,Form, Input,InputNumber, DatePicker,Upload,Button,notification, Space, Alert, Typography} from 'antd';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const {Text} = Typography;
import {UploadOutlined} from '@ant-design/icons'

import { useRouter } from 'next/router';


interface ServiceFormProps{
    onLaunchStore: (formData:any)=>void
    onCancelFormCreation: ()=>void
}
export default function ServiceForm({onLaunchStore, onCancelFormCreation}:ServiceFormProps){


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
        <Card title='Add new service'>
            <Form
            name="storeForm"
            initialValues={{ remember: true }}
            layout='vertical'
            onFinish={onFinish}
            >
            <Form.Item
                name="serviceName"
                label="Service name"
                rules={[{ required: true, message: 'Please input a valid service name' }]}
             >
                <Input placeholder="Bill Cage Line Skip" />
            </Form.Item>

            <Form.Item
                name="price"
                label='Price'
                rules={[{ required: true, message: 'Please input a valid phone!' }]}
            >
                <InputNumber prefix={'USD'} placeholder="54" />
            </Form.Item>


            <Form.Item name='description'  label="Service description">
                <TextArea maxLength={150}  placeholder='Best coffee shop in the entire world with the most beautiful scenary' rows={3} />
            </Form.Item>

            <Form.Item name='serviceDuration' label="Service duration">
                <RangePicker />
            </Form.Item>


            <Form.Item>
                <Space>
                    <Button onClick={onCancelFormCreation} type='ghost'>
                        Cancel
                    </Button>

                    <Button type="primary"  htmlType="submit" >
                      Create service
                    </Button>
                </Space>
                
            </Form.Item>

            </Form>
        </Card>
    )
}
