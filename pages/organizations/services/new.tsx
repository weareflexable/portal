import React, { useRef, useState } from "react";
import {Form, Row, Col, Tooltip, Input,Upload,Button,notification, Typography, Space, Select, Radio, Divider, TimePicker} from 'antd';
import {UploadOutlined, ArrowLeftOutlined, InfoCircleOutlined,  InboxOutlined} from '@ant-design/icons'
const {Title,Text} = Typography
const {TextArea} = Input

import { useRouter } from 'next/router';
import {usePlacesWidget} from 'react-google-autocomplete'
import { asyncStore} from "../../../utils/nftStorage";
import { Service, ServicePayload } from "../../../types/Services";
import { useOrgContext } from "../../../context/OrgContext";
import useServiceTypes from "../../../hooks/useServiceTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../../../context/AuthContext";


export default function NewService(){

    const queryClient = useQueryClient()

    const menuItems = useServiceTypes()
    console.log(menuItems)
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
        apiKey: `${process.env.NEXT_PUBLIC_MAPS_AUTOCOMPLETE_API}`, // move this key to env
        options:{
            componentRestrictions:{country:'us'},
            types: ['address'],
            fields: ['address_components','geometry','formatted_address']
        },
        onPlaceSelected: (place) => {
            // console.log(antInputRef.current.input)
            console.log(place)
            form.setFieldValue('address',place?.formatted_address)
            
            const fullAddress = extractFullAddress(place)
            // add street address
            const addressWithStreet={
                ...fullAddress,
                street: place?.formatted_address
            }
            setFullAddress(addressWithStreet)

            //@ts-ignore
          antInputRef.current.input.value = place?.formatted_address

        },
      });
    

    const onFinish = async(formData:Service)=>{

        // setIsHashingAssets(true)
        // //@ts-ignore
        // const imageHash = await asyncStore(formData.logoImageHash[0].originFileObj)
        // //@ts-ignore
        // const coverImageHash = await asyncStore(formData.coverImageHash[0].originFileObj)
        // setIsHashingAssets(false)


        // const formObject: ServicePayload = {
        //     ...formData,
        //     ...fullAddress,
        //     logoImageHash: imageHash,
        //     coverImageHash: coverImageHash,
        //     latitude:String(fullAddress.latitude),
        //     longitude:String(fullAddress.longitude),
        //     //@ts-ignore
        //     orgId:currentOrg.orgId,
        //     timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // get user timezone
        // }

        console.log(formData)

        // @ts-ignore
        // delete formObject.address
        // createData.mutate(formObject)
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
          router.replace('/organizations/services')
       },
        onError:()=>{
            notification['error']({
                message: 'Encountered an error while creating record',
              });
            // leave modal open
        } 
    })

    const {isError, isLoading:isCreatingData, isSuccess:isDataCreated, data:createdData} = createData
    

    return (
        <div style={{background:'#ffffff', minHeight:'100vh'}}>
            <div style={{marginBottom:'3rem', padding: '1rem', borderBottom:'1px solid #e5e5e5',}}>
                <Row>
                    <Col offset={1}> 
                         <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Button shape='round' style={{marginRight:'.3rem'}} type='link' onClick={()=>router.back()} icon={<ArrowLeftOutlined/>}/>
                            <Title style={{margin:'0'}} level={3}>Create new service</Title>
                        </div>
                    </Col>
                </Row>
            </div>
            <Row >
                <Col offset={3} span={11}>
                    
                    <Form
                    name="serviceForm"
                    initialValues={{ remember: true }}
                    layout='vertical'
                    onFinish={onFinish}
                    form={form}
                    >

                {/* Service type */}
                <div style={{marginBottom:'0'}}>
                    <Title level={3}>{`Select a service type`}</Title>
                    {/* <Text>All changes here will be reflected in the marketplace</Text> */}
                </div>
                <div style={{border:'1px solid #e2e2e2', borderRadius:'4px', padding:'1rem'}}> 
                    <Form.Item
                        name="serviceTypeId"
                        label="Service type"
                        tooltip = 'Service type will be used to categorize the type of your service'
                        // extra='Service type will be used to categorize the type of your service'
                        // initialValue={'Bar'}
                        style={{marginBottom:'0'}}
                        // rules={[{ required: true, message: 'Please select a service type!' }]}
                        >
                        <Radio.Group size='large'> 
                                {menuItems? menuItems.map((menu:any)=>(
                                    <Radio.Button key={menu.id} value={menu.value}>{menu.label}</Radio.Button>
                                )):<Text>Loading service types ...</Text> }
                        </Radio.Group>
                    </Form.Item>

                </div>

                 {/* Service info */}
                <div style={{marginBottom:'2rem', marginTop:'3rem'}}>
                    <Title level={3}>Service info</Title>
                    <Text>All changes here will be reflected in the marketplace</Text>
                </div>
                <div style={{border:'1px solid #e2e2e2', borderRadius:'4px', padding:'1rem'}}> 
                    <Form.Item
                        name="name"
                        label="Name"
                        // extra="The name you provide here will be used as display on marketplace listing"
                        rules={[{ required: true, message: 'Please input a valid service name' }]}
                    >
                        <Input size="large" placeholder="Bill Cage coffee" />
                    </Form.Item>

                    <Form.Item  
                        name="address"
                        label='Address'
                        extra={<Text type="secondary"><InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} /> Please refresh the page if the date you selected is not being displayed in the field </Text> }
                        rules={[{ required: true, message: 'Please input a valid address!' }]}
                    >
                        <Input 
                            // suffix={
                            //     <Tooltip title="Please refresh the page if the date you selected is not being displayed in the field">
                            //       <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            //     </Tooltip>
                            //   }
                            size="large" 
                            ref={(c) => {
                            // @ts-ignore
                            antInputRef.current = c;
                            // @ts-ignore
                            if (c) antRef.current = c.input;
                            }} 
                            placeholder="Syracuse, United states" 
                            />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Contact phone"
                        rules={[{ required: true, message: 'Please input a valid phone number' }]}
                    >
                        <Input size="large" placeholder="+1348574934" />
                    </Form.Item>

                    <Form.Item
                        name="currency"
                        label='Currency'
                        rules={[{ required: true, message: 'Please input a valid code!' }]}
                    >
                        <Input size="large" placeholder="USD" />
                    </Form.Item>

                    <Form.Item
                        label="Start and end time"
                        name='validityPeriod'
                        style={{marginBottom:'0'}}
                        tooltip={'Tickets validity will be calculated using the provided interval'}
                        rules={[{ type: 'object' as const, required: true, message: 'Please select a time period' }]}
                    >
                        <TimePicker.RangePicker use12Hours format="h:mm a" size="large" />
                        <Text style={{marginLeft:'1rem'}}>9 hrs interval for all tickets</Text> 
                    </Form.Item>
                </div>

                

                    <div style={{marginBottom:'2rem', marginTop:'3rem'}}>
                        <Title level={3}>Asset upload</Title>
                        <Text >Please upload correct files according to proposed formats</Text>
                    </div>

                    <div style={{border:'1px solid #e2e2e2', borderRadius:'4px', padding:'1rem'}}> 

                        <Form.Item
                            name="logoImageHash"
                            label="Logo"
                            valuePropName="logoImageHash"
                            getValueFromEvent={normFile}
                            rules={[{ required: true, message: 'Please upload an image' }]}
                        >
                            <Upload.Dragger style={{display:'flex',alignItems:'center'}} name="logoImageHash" action="">
                                .
                                {/* <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p> */}
                                <p style={{margin:'0'}} className="ant-upload-text">Click or drag file to this area to upload logo image</p>
                                {/* <p style={{marginTop:'0'}} className="ant-upload-hint">Only upload single file</p> */}
                            </Upload.Dragger>
                        </Form.Item>

                        <Form.Item
                            name="coverImageHash"
                            label="Cover image"
                            valuePropName="coverImageHash"
                            getValueFromEvent={normFile}
                            // hidden
                            style={{marginBottom:'0'}}
                            rules={[{ required: true, message: 'Please upload an image' }]}
                        >
                            <Upload.Dragger  name="coverImageHash" action="">
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p style={{marginBottom:'0'}} className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p style={{marginTop:'0'}} className="ant-upload-hint">Support for a single or bulk upload.</p>
                            </Upload.Dragger>
                        </Form.Item>

                    </div>

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
