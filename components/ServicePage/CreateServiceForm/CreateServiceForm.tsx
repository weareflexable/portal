import React,{useState} from 'react';
import {Card,Form, Input,InputNumber, DatePicker,Upload,Button,notification, Space, Alert, Typography} from 'antd';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const {Text} = Typography;

import {v4 as uuidv4} from 'uuid'

import { useRouter } from 'next/router';
import { ServiceItem } from '../../../types/Services';






interface ServiceFormProps{
    onTriggerFormAction: (formData:ServiceItem)=>void
    onCancelFormCreation: ()=>void
}
export default function ServiceForm({ onTriggerFormAction, onCancelFormCreation}:ServiceFormProps){


    // TODO: set field for editing

    const router = useRouter()
    const [form] = Form.useForm()

    const onFinish = (formData:ServiceItem)=>{
        // call function to create stor
        // only generate key if it's a new service
            const formObject= {
                ...formData,
                key: uuidv4()
            }
            onTriggerFormAction(formObject)
            showStoreCreationNotification()

    }


    const showStoreCreationNotification = () => {
        notification['success']({
          message: 'Service created succesfully',
        });
      };
      


    return (
        <Card title='Add new service'>
            <Form
            name="serviceForm"
            initialValues={{ remember: false }}
            layout='vertical'
            form={form}
            onFinish={onFinish}
            >
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input a valid service name' }]}
             >
                <Input placeholder="Bill Cage Line Skip" />
            </Form.Item>

            <Form.Item
                name="price"
                label='Price'
                rules={[{ required: true, message: 'Please input a valid price!' }]}
            >
                <InputNumber width={'30%'} prefix="$"  placeholder="0.00" />
            </Form.Item>

            <Form.Item name='description'  label="Service description">
                <TextArea maxLength={150} showCount  placeholder='Best coffee shop in the entire world with the most beautiful scenary' rows={3} />
            </Form.Item>

            <Form.Item name='startDate' label="Start date">
                <DatePicker />
            </Form.Item>

            <Form.Item name='endDate' label="End date">
                <DatePicker />
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
