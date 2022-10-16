import React,{useState} from 'react';
import {Card,Form, Input,InputNumber, DatePicker,Upload,Button,notification, Space, Alert, Typography} from 'antd';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const {Text} = Typography;

import {v4 as uuidv4} from 'uuid'

import { useRouter } from 'next/router';
import {Service} from '../UserStoreView/UserStoreView'

interface ServiceFormProps{
    initValues: Service | undefined
    onTriggerFormAction: (formData:Service)=>void
    onCancelFormCreation: ()=>void
}
export default function EditForm({initValues, onTriggerFormAction, onCancelFormCreation}:ServiceFormProps){


    // TODO: set field for editing

    const router = useRouter()
    const [form] = Form.useForm()

    const onFinish = (formData:Service)=>{

        onTriggerFormAction(formData)
        showStoreCreationNotification()

    }

    if(initValues){
        form.setFieldsValue({
            name: initValues.name,
            description: initValues.description,
            price: initValues.price,
            serviceDuration: initValues.serviceDuration
        })
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
            initialValues={initValues}
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

            <Form.Item name='serviceDuration' label="Service duration">
                <RangePicker />
            </Form.Item>


            <Form.Item>
                <Space>
                    <Button onClick={onCancelFormCreation} type='ghost'>
                        Cancel
                    </Button>

                    <Button type="primary"  htmlType="submit" >
                     Apply changes
                    </Button>
                </Space>
                
            </Form.Item>

            </Form>
        </Card>
    )
}
