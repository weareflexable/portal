import React,{useState} from 'react';
import {Card,Form, Input,InputNumber, DatePicker,Upload,Button,notification, Space, Alert, Typography, TimePicker, Select} from 'antd';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const {Text} = Typography;
import {UploadOutlined} from '@ant-design/icons'

import {v4 as uuidv4} from 'uuid'

import { useRouter } from 'next/router';
import { ServiceItem, ServiceItemReqPaylod } from '../../../../types/Services';
import dayjs from 'dayjs'
import { useServicesContext } from '../../../../context/ServicesContext';
import useServiceTypes from '../../../../hooks/useServiceTypes';
import useServiceItemTypes from '../../../../hooks/useServiceItemTypes';
import { asyncStore } from '../../../../utils/nftStorage';






interface ServiceFormProps{
    onTriggerFormAction: (formData:ServiceItemReqPaylod)=>void
    onCloseForm: ()=>void,
    isCreatingServiceItem:boolean
}

export default function ServiceItemForm({ onTriggerFormAction,isCreatingServiceItem, onCloseForm}:ServiceFormProps){


    // TODO: set field for editing
    const menuItems = useServiceItemTypes()
    console.log(menuItems)

    const router = useRouter()
    const [form] = Form.useForm()
    const {currentService} = useServicesContext()

    const [isHashingAssets, setIsHashingAssets] = useState(false)

    const onFinish = async (formData:ServiceItem)=>{

        setIsHashingAssets(true)
        const imageHash = await asyncStore(formData.logoImageHash[0].originFileObj) 
        setIsHashingAssets(false)
        // call function to create stor
        // only generate key if it's a new service
            const formObject: ServiceItemReqPaylod = {
                name: formData.name,
                price: formData.price * 100,
                ticketsPerDay: formData.ticketsPerDay,
                description:formData.description,
                orgServiceId: currentService.id,
                startDate: dayjs(formData.startDate).format('YYYY-MMM-DD'), // convert to dayjs
                endDate: dayjs(formData.endDate).format('YYYY-MMM-DD'),
                startTime: dayjs(formData.startTime).format('HH:mm:ss'), // convert time to seconds
                rangeTime: `${formData.rangeTime}:0:0`, // convert time to seconds
                serviceItemId: '2',// TODO: replace with form value,
                logoImageHash: imageHash
            }
            console.log(formObject)
            onTriggerFormAction(formObject) 

    }

    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        } 
        return e?.fileList;
      };


      


    return (
            <Form
            name="serviceItemForm"
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

            <Form.Item name='description'  label="Description">
                <TextArea maxLength={150} showCount  placeholder='Best coffee shop in the entire world with the most beautiful scenary' rows={3} />
            </Form.Item>


            <Form.Item
                name="serviceType"
                label='Service type'
                rules={[{ required: true, message: 'Please input a valid address!' }]}
            >
                <Select
                    placeholder={'Line skip'}
                    style={{ width: 120 }}
                    options={menuItems}
                    />
            </Form.Item>

            <Form.Item
                name="logoImageHash"
                label="Cover image"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Upload file upto 2MB"
                rules={[{ required: true, message: 'Please upload an image' }]}
            >
                <Upload name="logo" action="" listType="picture">
                <Button icon={<UploadOutlined />}>Upload service item cover image</Button>
                </Upload>
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

                    <Button shape='round' loading={isCreatingServiceItem || isHashingAssets} type="primary"  htmlType="submit" >
                     Create service item
                    </Button>
                </Space>
                
            </Form.Item>

            </Form>
    )
}
