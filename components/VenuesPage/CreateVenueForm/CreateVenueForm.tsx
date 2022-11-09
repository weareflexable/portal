import React, { createRef, FC, RefObject, useRef, useState } from "react";
import {Card,Form, Input,InputNumber,Upload,Button,notification, Space, Alert, Typography} from 'antd';
const { TextArea } = Input;
const {Text} = Typography;
import {UploadOutlined} from '@ant-design/icons'

import {v4 as uuidv4} from 'uuid'

import { useRouter } from 'next/router';
import {usePlacesWidget} from 'react-google-autocomplete'

interface StoreFormProps{
    onLaunchStore: (formData:any)=>void
    onCancelFormCreation: ()=>void
}
export default function StoreForm({onLaunchStore, onCancelFormCreation}:StoreFormProps){

    const [form]=Form.useForm()

    const router = useRouter()
    const antInputRef = useRef();

      const { ref: antRef } = usePlacesWidget({
        apiKey: 'AIzaSyB7ZUkMcIXpOKYU4r4iBMM9BFjCL5OpeeE', // move this key to env
        onPlaceSelected: (place) => {
            // console.log(antInputRef.current.input) 
            console.log(place.geometry.location.lat())
            //   antInputRef.current.setValue(place?.formatted_address);
            //@ts-ignore
        //   antInputRef.current.input.value = place?.formatted_address
          form.setFieldValue('address',place?.formatted_address)
          console.log(place)
        },
      });
    


    const onFinish = (formData:FormData)=>{
        // call function to create store
        const formObject = {
            ...formData,
            key:uuidv4()
        }
        console.log(formObject)
        onLaunchStore(formObject)
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
          message: 'Store created succesfully',
          description:
            'The next step is to create services inside store for user to be able to interact with.',
        });
      };
      

    return (
            <Form
            name="storeForm"
            initialValues={{ remember: true }}
            layout='vertical'
            onFinish={onFinish}
            form={form}
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
                    Launch store
                    </Button>
                </Space>
                
            </Form.Item>

            </Form>
    )
}
