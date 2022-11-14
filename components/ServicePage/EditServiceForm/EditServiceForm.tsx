import React,{useState} from 'react';
import {Card,Form, Input,InputNumber, DatePicker,Upload,Button,notification, Space, Alert, Typography} from 'antd';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const {Text} = Typography;

import {v4 as uuidv4} from 'uuid'

import { useRouter } from 'next/router';
import { ServiceItem } from '../../../types/Services';


interface ServiceItemFormProps{
    initValues: ServiceItem | undefined
    onTriggerFormAction: (formData:ServiceItem)=>void
    onCancelFormCreation: ()=>void
}
export default function EditForm({initValues, onTriggerFormAction, onCancelFormCreation}:ServiceItemFormProps){


    // TODO: set field for editing

    const router = useRouter()
    const [form] = Form.useForm()

    const prevValues = initValues

    const onFinish = (formData:ServiceItem)=>{
        console.log('prevValues',prevValues)
        console.log(formData)

        const formObject = {
            ...prevValues,
            ...formData
        }
        onTriggerFormAction(formObject)
        showStoreCreationNotification()
    }

    // if(initValues){
    //     form.setFieldsValue({
    //         name: initValues.name,
    //         description: initValues.description,
    //         price: initValues.price,
    //         serviceDuration: initValues.serviceDuration
    //     })
    // }

    const showStoreCreationNotification = () => {
        notification['success']({
          message: 'ServiceItem updated succesfully',
        });
      };
      


    return (
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


            <Form.Item
                name="ticketsPerDay"
                label='Tickets per day'
                rules={[{ required: true, message: 'Please input a valid number!' }]}
            >
                <InputNumber width={'30%'}   placeholder="20" />
            </Form.Item>


            <Form.Item name='description'  label="ServiceItem description">
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
                     Apply changes
                    </Button>
                </Space>
                
            </Form.Item>

            </Form>
    )
}
