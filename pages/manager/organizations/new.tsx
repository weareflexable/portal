import React, { useRef, useState } from "react";
import {Form, Row, Col, Input,Upload,Button,notification, Typography, Space, Select} from 'antd';
import {UploadOutlined} from '@ant-design/icons'
const {Title} = Typography

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


export default function NewOrg(){

    const queryClient = useQueryClient()

    const menuItems = useServiceTypes()
    const {paseto} = useAuthContext()
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

        setIsHashingAssets(true)
        const imageHash = await asyncStore(formData.imageHash[0].originFileObj)
        const coverImageHash = await asyncStore(formData.coverImageHash[0].originFileObj)
        setIsHashingAssets(false)


        const formObject: ServicePayload = {
            ...formData,
            ...fullAddress,
            imageHash: imageHash,
            coverImageHash: coverImageHash,
            orgId:currentOrg.id,
            timeZone: 'UTC',
        }
        // remove address field since because we have extracted
        // @ts-ignore
        delete formObject.address
        createDataHandler(formObject)
    }

    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        } 
        return e?.fileList;
      };

      const createDataHandler = async(newItem:any)=>{
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/services/orgadmin/org-service`, newItem,{
            headers:{
                "Authorization": paseto
            },
        })
        return data
    }

    const createData = useMutation(createDataHandler,{
       
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
          router.replace('/manager/organizations/')
    }

    return (
        <div style={{background:'#ffffff', minHeight:'100vh'}}>
            <div style={{marginBottom:'3rem', padding: '1rem', borderBottom:'1px solid #e5e5e5',}}>
                <Row>
                    <Col offset={3}> 
                        <Title style={{marginTop:'0'}} level={3}>Create new organization</Title>
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
                        label="Organization name"
                        rules={[{ required: true, message: 'Please input a valid service name' }]}
                    >
                        <Input placeholder="Flexable org" />
                    </Form.Item>


                    <Form.Item
                        name="organizationEmail"
                        label='Organization email'
                        rules={[{ required: true, message: 'Please input a valid email!' }]}
                    >
                        <Input placeholder="mujahid.bappai@flexable.com" />
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
                    </Form.Item>


                    <Form.Item
                        name="zipCode"
                        label='Zip Code'
                        rules={[{ required: true, message: 'Please input a valid code!' }]}
                    >
                        <Input placeholder="374739" />
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
                        <Button icon={<UploadOutlined />}>Upload organization logo</Button>
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
                        <Button icon={<UploadOutlined />}>Upload organization cover image</Button>
                        </Upload>
                    </Form.Item>

                    {/* onCancelFormCreation */}
                    <Form.Item style={{marginTop:'4rem'}}>
                        <Space>
                            <Button shape="round" onClick={()=>{}} type='ghost'>
                                Cancel
                            </Button>

                            <Button shape="round" type="primary" size="large" loading={isHashingAssets || isCreatingData}  htmlType="submit" >
                                Create new organization
                            </Button>
                        </Space>
                        
                    </Form.Item>

                    </Form>
                </Col>
            </Row>
       </div>    
    )
}
