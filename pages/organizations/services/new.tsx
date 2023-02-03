import React, { useRef, useState } from "react";
import {Form, Row, Col, Input,Upload,Button,notification, Typography, Space, Select} from 'antd';
import {UploadOutlined, ArrowLeftOutlined} from '@ant-design/icons'
const {Title} = Typography
const {TextArea} = Input

import { useRouter } from 'next/router';
import {usePlacesWidget} from 'react-google-autocomplete'
import { asyncStore} from "../../../utils/nftStorage";
import { Service, ServicePayload } from "../../../types/Services";
import { useOrgContext } from "../../../context/OrgContext";
import useServiceTypes from "../../../hooks/useServiceTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { url } from "inspector";
import { useAuthContext } from "../../../context/AuthContext";


export default function NewService(){

    const queryClient = useQueryClient()

    const menuItems = useServiceTypes()
    const {paseto} = useAuthContext()
    const {currentOrg} = useOrgContext()
    const [form]=Form.useForm()
    const [fullAddress, setFullAddress] = useState({
        latitude:0,
        longitude:0,
        state: '',
        street: '',
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
        apiKey: 'AIzaSyAxBDdnJsmCX-zQa-cO9iy-v5pn53vXEFA', // move this key to env
        options:{
            componentRestrictions:{country:'us'},
            types: ['address'],
            fields: ['address_components','geometry','formatted_address','name']
        },
        onPlaceSelected: (place) => {
            console.log(place)
            // console.log(antInputRef.current.input)
            form.setFieldValue('address',place?.formatted_address)
            
            const fullAddress = extractFullAddress(place)
            // add street address
            const addressWithStreet={
                ...fullAddress,
                street: place?.formatted_address
            }
            console.log(addressWithStreet)
            setFullAddress(addressWithStreet)

            //@ts-ignore
          antInputRef.current.input.value = place?.formatted_address

        },
      });
    

    const onFinish = async(formData:Service)=>{

        setIsHashingAssets(true)
        //@ts-ignore
        const imageHash = await asyncStore(formData.imageHash[0].originFileObj)
        //@ts-ignore
        const coverImageHash = await asyncStore(formData.coverImageHash[0].originFileObj)
        setIsHashingAssets(false)


        const formObject: ServicePayload = {
            ...formData,
            ...fullAddress,
            logoImageHash: imageHash,
            coverImageHash: coverImageHash,
            orgId:currentOrg.id,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // get user timezone
        }

        // @ts-ignore
        delete formObject.address
        createData.mutate(formObject)
    }

    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        } 
        return e?.fileList;
      };

      const createDataHandler = async(newItem:any)=>{
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/services`, newItem,{
            headers:{
                "Authorization": paseto
            },
        })
        return data
    }

    const createData = useMutation(createDataHandler,{
       onSuccess:()=>{
        notification['success']({
            message: 'Success creating record',
          });
          router.back()
       },
        onError:()=>{
            notification['error']({
                message: 'Encountered an error while creating record',
              });
            // leave modal open
        } 
    })

    const {isError, isLoading:isCreatingData, isSuccess:isDataCreated, data:createdData} = createData
    
    if(isDataCreated){
        notification['success']({
            message: 'Created record succesfully!',
          });
          // navigate back to services page
          router.replace('/organisation')
    }

    return (
        <div style={{background:'#ffffff', minHeight:'100vh'}}>
            <div style={{marginBottom:'3rem', padding: '1rem', borderBottom:'1px solid #e5e5e5',}}>
                <Row>
                    <Col offset={1}> 
                         <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Button shape='round' style={{marginRight:'1rem'}} type='text' onClick={()=>router.back()} icon={<ArrowLeftOutlined/>}/>
                            <Title style={{margin:'0'}} level={3}>Create new service</Title>
                        </div>
                    </Col>
                </Row>
            </div>
            <Row >
                <Col offset={3} span={8}>
                    
                    <Form
                    name="storeForm"
                    initialValues={{ remember: true }}
                    layout='vertical'
                    onFinish={onFinish}
                    form={form}
                    >
                    <Form.Item
                        name="name"
                        label="Service name"
                        rules={[{ required: true, message: 'Please input a valid service name' }]}
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
                            placeholder="Syracuse, United states" 
                            />
                            {/* <TextArea rows={3} placeholder='Apt. 235 30B NorthPointsettia Street, Syracuse'/> */}
                    </Form.Item>


                    <Form.Item
                        name="serviceId"
                        label='Service type'
                        initialValue={'Bar'}
                        rules={[{ required: true, message: 'Please input a valid address!' }]}
                    >
                        <Select
                            style={{ width: 120 }}
                            options={menuItems}
                            />
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
                        valuePropName="imageHash"
                        getValueFromEvent={normFile}
                        extra="Upload file upto 2MB"
                        rules={[{ required: true, message: 'Please upload an image' }]}
                    >
                        <Upload name="imageHash" action="" listType="picture">
                        <Button icon={<UploadOutlined />}>Upload service logo</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="coverImageHash"
                        label="Cover image"
                        valuePropName="coverImageHash"
                        getValueFromEvent={normFile}
                        extra="Upload file upto 2MB"
                        rules={[{ required: true, message: 'Please upload an image' }]}
                    >
                        <Upload name="coverImageHash" action="" listType="picture">
                        <Button icon={<UploadOutlined />}>Upload service cover image</Button>
                        </Upload>
                    </Form.Item>

                    {/* onCancelFormCreation */}
                    <Form.Item style={{marginTop:'4rem'}}>
                        <Space>
                            <Button shape="round" onClick={()=>{}} type='ghost'>
                                Cancel
                            </Button>

                            <Button shape="round" type="primary" size="large" loading={isHashingAssets || isCreatingData}  htmlType="submit" >
                                Launch service
                            </Button>
                        </Space>
                        
                    </Form.Item>

                    </Form>
                </Col>
            </Row>
       </div>    
    )
}
