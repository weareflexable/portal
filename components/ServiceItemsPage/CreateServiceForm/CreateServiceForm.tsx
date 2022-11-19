import React,{useState} from 'react';
import {Card,Form, Input,InputNumber, DatePicker,Upload,Button,notification, Space, Alert, Typography, TimePicker} from 'antd';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const {Text} = Typography;

import {v4 as uuidv4} from 'uuid'

import { useRouter } from 'next/router';
import { ServiceItem, ServiceItemReqPaylod } from '../../../types/Services';
import moment from 'moment';
import { useServicesContext } from '../../../context/ServicesContext';






interface ServiceFormProps{
    onTriggerFormAction: (formData:ServiceItemReqPaylod)=>void
    onCloseForm: ()=>void,
    isCreatingServiceItem:boolean
}

export default function ServiceItemForm({ onTriggerFormAction,isCreatingServiceItem, onCloseForm}:ServiceFormProps){


    // TODO: set field for editing

    const router = useRouter()
    const [form] = Form.useForm()
    const {currentService} = useServicesContext()

    const onFinish = (formData:ServiceItem)=>{
        // call function to create stor
        // only generate key if it's a new service
            const formObject: ServiceItemReqPaylod = {
                name: formData.name,
                price: formData.price,
                ticketMaxPerDay: formData.ticketsPerDay,
                description:formData.description,
                orgServiceId: currentService.id,
                startDate: moment(formData.startDate).format('YYYY-MMM-DD'),
                endDate: moment(formData.endDate).format('YYYY-MMM-DD'),
                startTime: moment(formData.startTime).format('HH:mm:ss'),
                rangeTime: `${formData.rangeTime}:0:0`,
                serviceItemId: uuidv4()
            }
            // console.log(formObject)
            onTriggerFormAction(formObject) 
            // showStoreCreationNotification()

    }


    const showStoreCreationNotification = () => {
        notification['success']({
          message: 'Service created succesfully',
        });
      };
      


    return (
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

            <Form.Item
                name="ticketsPerDay"
                label='Tickets per day'
                rules={[{ required: true, message: 'Please input a valid number!' }]}
            >
                <InputNumber width={'30%'}   placeholder="20" />
            </Form.Item>

            <Form.Item name='description'  label="Service description">
                <TextArea maxLength={150} showCount  placeholder='Best coffee shop in the entire world with the most beautiful scenary' rows={3} />
            </Form.Item>

           
            <div style={{display:'flex', alignItems:'center'}}>

                <Form.Item
                    rules={[{ required: true, message: 'Please select a date!' }]}
                    name='startDate' 
                    label="Start date">
                    <DatePicker />
                </Form.Item>

                <Form.Item name='endDate' style={{marginLeft:'2em'}} label="End date">
                    <DatePicker />
                </Form.Item>

            </div>

            <div style={{display:'flex', marginBottom:'1em', alignItems:'center'}}>

                <Form.Item 
                rules={[{ required: true, message: 'Please select a date!' }]}
                name='startTime'   
                label="Start time">
                    <TimePicker  format="h:mm:ss"  />
                </Form.Item>

                <Form.Item 
                    rules={[{ required: true, message: 'Please specify a date range!' }]}
                    name='rangeTime' 
                    style={{marginLeft:'2em'}}  label="Duration time">
                    <InputNumber />
                </Form.Item>

            </div>


            <Form.Item>
                <Space>
                    <Button shape='round' onClick={onCloseForm} type='ghost'>
                        Cancel
                    </Button>

                    <Button shape='round' loading={isCreatingServiceItem} type="primary"  htmlType="submit" >
                     Create service 
                    </Button>
                </Space>
                
            </Form.Item>

            </Form>
    )
}
