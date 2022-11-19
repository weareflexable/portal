import React, { createRef, FC, RefObject, useRef, useState } from "react";
import {Card,Form, Input,InputNumber,Upload,Button,notification, Space, Alert, Typography} from 'antd';
const { TextArea } = Input;
const {Text} = Typography;
import {UploadOutlined} from '@ant-design/icons'

import {v4 as uuidv4} from 'uuid'

import { useRouter } from 'next/router';
import {usePlacesWidget} from 'react-google-autocomplete'
import { asyncStore, nftStorageClient } from "../../../utils/nftStorage";
import { Service, ServicePayload } from "../../../types/Services";
import { useOrgContext } from "../../../context/OrgContext";
import moment from "moment-timezone";

interface StoreFormProps{
    onLaunchStore: (formData:any)=>void
    onCancelFormCreation: ()=>void
}
export default function StoreForm({onLaunchStore, onCancelFormCreation}:StoreFormProps){

    const {currentOrg} = useOrgContext()
    const [form]=Form.useForm()
    const [fullAddress, setFullAddress] = useState({
        latitude:0,
        longitude:0,
        state: '',
        country:'',
        city:''
    })

    const router = useRouter()
    const antInputRef = useRef();

    const extractFullAddress = (place:any)=>{
        const addressComponents = place.address_components 
            let addressObj = {
                state:'',
                country:'',
                city:'',
                latitude:place.geometry.location.lat(),
                longitude:place.geometry.location.lng()
            };
            addressComponents.forEach((address:any)=>{
                const type = address.types[0]
                if(type==='country') addressObj.country = address.long_name
                if(type === 'locality') addressObj.state = address.short_name
                if(type === 'administrative_area_level_1') addressObj.city = address.short_name
            })

            return addressObj
    }

      const { ref: antRef } = usePlacesWidget({
        apiKey: 'AIzaSyB7ZUkMcIXpOKYU4r4iBMM9BFjCL5OpeeE', // move this key to env
        onPlaceSelected: (place) => {
            // console.log(antInputRef.current.input)
            form.setFieldValue('address',place?.formatted_address)
            
            const fullAddress = extractFullAddress(place)
            setFullAddress(fullAddress)

            //@ts-ignore
          antInputRef.current.input.value = place?.formatted_address

        },
      });
    

    const onFinish = async(formData:Service)=>{

        console.log(formData)
        const imageHash = await asyncStore(formData.imageHash[0].originFileObj)
        const coverImageHash = await asyncStore(formData.coverImage[0].originFileObj)


        const formObject: ServicePayload = {
            ...formData,
            ...fullAddress,
            imageHash: imageHash,
            coverImageHash: coverImageHash,
            serviceId: uuidv4(),
            orgId:currentOrg.id,
            timeZone: moment.tz.guess(),
        }
        // remove address field since because we have extracted
        //@ts-ignore
        delete formObject.address
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
                name="serviceType"
                label='Business type'
                rules={[{ required: true, message: 'Please input a valid address!' }]}
            >
                <Input placeholder="eg Gym, Bar, Restaurant" />
            </Form.Item>

            <Form.Item
                name="currencyCode"
                label='Currency'
                rules={[{ required: true, message: 'Please input a valid code!' }]}
            >
                <Input placeholder="USD" />
            </Form.Item>



            <Form.Item
                name="imageHash"
                label="Logo"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Upload file upto 2MB"
                rules={[{ required: true, message: 'Please upload an image' }]}
            >
                <Upload name="logo" action="" listType="picture">
                <Button icon={<UploadOutlined />}>Upload service logo</Button>
                </Upload>
            </Form.Item>

            <Form.Item
                name="coverImageHash"
                label="Cover image"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Upload file upto 2MB"
                rules={[{ required: true, message: 'Please upload an image' }]}
            >
                <Upload name="logo" action="" listType="picture">
                <Button icon={<UploadOutlined />}>Upload service cover image</Button>
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
