import React,{useState} from 'react';
import {Card,Form, Input,InputNumber, DatePicker,Upload,Button,notification, Space, Alert, Typography, TimePicker} from 'antd';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const {Text} = Typography;

import {v4 as uuidv4} from 'uuid'

import { useRouter } from 'next/router';
import { ServiceItem } from '../../../types/Services';
import moment from 'moment';
import { useOrgContext } from '../../../context/OrgContext';
import { useServicesContext } from '../../../context/ServicesContext';


interface ServiceItemFormProps{
    initValues: ServiceItem | undefined
    onTriggerFormAction: (formData:any)=>void
    onCancelFormCreation: ()=>void,
    isPatchingServiceItem: boolean
}
export default function EditForm({initValues, onTriggerFormAction, isPatchingServiceItem, onCancelFormCreation}:ServiceItemFormProps){


    // TODO: set field for editing

    const router = useRouter()
    const [form] = Form.useForm()
    const {currentService} = useServicesContext()

    const prevValues = initValues

    const onFinish = (formData:ServiceItem)=>{

        const formObject = {
            id: prevValues?.id,
            description:formData.description,
            orgServiceItemId: currentService.id,
            imageHash: '',
            name: formData.name,
            price: formData.price * 100,
            ticketMaxPerDay: formData.ticketsMaxPerDay
        }
        console.log(formObject)

        // onTriggerFormAction(formObject)
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
                name="ticketsMaxPerDay"
                label='Tickets per day'
                rules={[{ required: true, message: 'Please input a valid number!' }]}
            >
                <InputNumber width={'30%'}   placeholder="20" />
            </Form.Item>


            <Form.Item name='description'  label="ServiceItem description">
                <TextArea maxLength={150} showCount  placeholder='Best coffee shop in the entire world with the most beautiful scenary' rows={3} />
            </Form.Item>

            <div style={{display:'flex', alignItems:'center'}}>
{/* 
                 <Form.Item name='startDate'  label="Start date">
                    <DatePicker format={"YYYY-MM-DD"}  defaultValue={moment(initValues?.startDate)} />
                </Form.Item>

                <Form.Item name='endDate' style={{marginLeft:'2em'}} label="End date">
                    <DatePicker format={"YYYY-MM-DD"} defaultValue={moment(initValues?.endDate)} />
                </Form.Item>  */}

            </div>

            {/* <div style={{display:'flex', marginBottom:'1em', alignItems:'center'}}>

                <Form.Item name='startTime'   label="Start time">
                    <TimePicker  format="h:mm:ss"  />
                </Form.Item>

                <Form.Item name='rangeTime' style={{marginLeft:'2em'}}  label="Duration">
                    <InputNumber />
                </Form.Item>

            </div> */}


            <Form.Item>
                <Space>
                    <Button shape='round' onClick={onCancelFormCreation} type='ghost'>
                        Cancel
                    </Button>

                    <Button loading={isPatchingServiceItem} shape='round' type="primary"  htmlType="submit" >
                     Apply changes
                    </Button>
                </Space>
                
            </Form.Item>

            </Form>
    )
}
