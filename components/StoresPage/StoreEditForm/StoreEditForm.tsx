import React,{useState} from 'react';
import {Card,Form, Input,InputNumber,Upload,Button,notification, Space, Alert, Typography} from 'antd';
const { TextArea } = Input;
const {Text} = Typography;
import {UploadOutlined} from '@ant-design/icons'

import {v4 as uuidv4} from 'uuid'

import { useRouter } from 'next/router';
import {Store} from '../StoreView/StoreView'

interface StoreEditFormProps{
    initValues: Store | undefined
    onEditStore: (store:Store)=>void
    onCancelFormCreation: ()=>void
}
export default function StoreEditForm({initValues, onEditStore, onCancelFormCreation}:StoreEditFormProps){


    const router = useRouter()


    const prevValues = initValues

    const onFinish = (formData:Store)=>{
        // call function to create store
        const formObject = {
            ...prevValues,
            ...formData,
        }
        onEditStore(formObject)
        showStoreCreationNotification()
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
          message: 'Store has been succesfully',
        });
      };
      

    return (
            <Form
            name="storeForm"
            initialValues={initValues}
            layout='vertical'
            onFinish={onFinish}
            >
            <Form.Item
                name="name"
                label="Store name"
                rules={[{ required: true, message: 'Please input a valid store name' }]}
             >
                <Input placeholder="Bill Cage coffee" />
            </Form.Item>

            <Form.Item
                name="address"
                label='Address'
                rules={[{ required: true, message: 'Please input a valid address!' }]}
            >
                <Input placeholder="Wiscontin, United states" />
            </Form.Item>

            <Form.Item
                name="type"
                label='Business type'
                rules={[{ required: true, message: 'Please input a valid address!' }]}
            >
                <Input placeholder="eg Gym, Bar, Restaurant" />
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

            <Form.Item
                name="storeCoverImage"
                label="Store cover image"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Upload file upto 2MB"
            >
                <Upload name="logo" action="" listType="picture">
                <Button icon={<UploadOutlined />}>Upload store cover image</Button>
                </Upload>
            </Form.Item>


            <Form.Item>
                <Space>
                    <Button onClick={onCancelFormCreation} type='ghost'>
                        Cancel
                    </Button>

                    <Button type="primary"  htmlType="submit" >
                    Edit store
                    </Button>
                </Space>
                
            </Form.Item>

            </Form>
    )
}
