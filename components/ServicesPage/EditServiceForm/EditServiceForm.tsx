import React,{useRef, useState} from 'react';
import {Card,Form, Input,InputNumber,Upload,Button,notification, Space, Alert, Typography, Select} from 'antd';
const { TextArea } = Input;
const {Text} = Typography;
import {UploadOutlined} from '@ant-design/icons'

import {v4 as uuidv4} from 'uuid'

import { useRouter } from 'next/router';
import { Service, ServicePayload } from '../../../types/Services';
import { asyncStore, nftStorageClient } from '../../../utils/nftStorage';
import { useOrgContext } from '../../../context/OrgContext';
import useServiceTypes from '../../../hooks/useServiceTypes';
import { usePlacesWidget } from 'react-google-autocomplete';


interface ServiceEditFormProps{
    initValues: Service | undefined
    onEditService: (service:ServicePayload)=>void
    onCloseEditForm: ()=>void,
    isPatchingData: boolean
}
export default function ServiceEditForm({initValues, onEditService, isPatchingData, onCloseEditForm}:ServiceEditFormProps){

    const prevValues = initValues
    console.log(prevValues)

    const menuItems = useServiceTypes()

    const {currentOrg} = useOrgContext()
    const [form]=Form.useForm()
    const [fullAddress, setFullAddress] = useState({
        latitude:0,
        longitude:0,
        state: '',
        country:'',
        city:''
    })
    const [isHashingAssets, setIsHashingAssets] = useState(false)

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
        apiKey: process.env.NEXT_PUBLIC_MAPS_AUTOCOMPLETE_API, // move this key to env
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

        // setIsHashingAssets(true)
        // const imageHash = await asyncStore(formData.logoImageHash[0].originFileObj)
        // const coverImageHash = await asyncStore(formData.coverImageHash[0].originFileObj)
        // setIsHashingAssets(false)


        const formObject: ServicePayload = {
            ...prevValues,
            ...formData,
            ...fullAddress,
            id: prevValues?.id,
            logoImageHash: prevValues?.logoImageHash,
            coverImageHash: prevValues?.coverImageHash,
            orgId:currentOrg.orgId,
            timeZone: 'UTC',
        }
        // remove address field because we have extracted it
        // @ts-ignore
        delete formObject.address
        // console.log(formObject) 
        onEditService(formObject)
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
            name="editServiceForm"
            initialValues={prevValues}
            layout='vertical'
            onFinish={onFinish}
            form={form}
            >
            <Form.Item
                name="name"
                label="Service name"
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
                name="serviceTypeId"
                label='Service type'
                rules={[{ required: true, message: 'Please input a valid address!' }]}
            >
                <Select
                    defaultValue="Bar"
                    style={{ width: 120 }}
                    options={menuItems}
                    />
            </Form.Item>

            <Form.Item
                name="currency"
                label='Currency'
                rules={[{ required: true, message: 'Please input a valid code!' }]}
            >
                <Input placeholder="USD" />
            </Form.Item>



            {/* <Form.Item
                name="logoImageHash"
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
            </Form.Item> */}


            <Form.Item>
                <Space>
                    <Button shape="round" onClick={onCloseEditForm} type='ghost'>
                        Cancel
                    </Button>

                    <Button shape="round" type="primary" loading={isHashingAssets || isPatchingData}  htmlType="submit" >
                    Edit service
                    </Button>
                </Space>
                
            </Form.Item>

            </Form>
    )
}
