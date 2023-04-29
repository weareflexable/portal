import React, { useRef, useState } from "react";
import {Form, Row, Col, Image, Tooltip, Input,Upload,Button,notification, Typography, Space, Select, Radio, Divider, TimePicker, InputRef} from 'antd';
import {UploadOutlined,MinusOutlined, QuestionCircleOutlined, ArrowLeftOutlined, InfoCircleOutlined,  InboxOutlined} from '@ant-design/icons'
const {Title,Text} = Typography
const {TextArea} = Input
import dayjs from 'dayjs'
var utc = require('dayjs/plugin/utc')


import { useRouter } from 'next/router';
import {usePlacesWidget} from 'react-google-autocomplete'
import { asyncStore} from "../../../../utils/nftStorage";
import { Service, ServicePayload } from "../../../../types/Services";
import { useOrgContext } from "../../../../context/OrgContext";
import useServiceTypes from "../../../../hooks/useServiceTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../../../../context/AuthContext";
import loadConfig from "next/dist/server/config";
import useUrlPrefix from "../../../../hooks/useUrlPrefix";
import { CommunityVenueReq } from "../../../../types/CommunityVenue.types";
import useCommunity from "../../../../hooks/useCommunity";

const getBase64 = (file: any): Promise<string> => 
new Promise((resolve, reject) => {
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = () => resolve(reader.result as string);
reader.onerror = (error) => reject(error);
});

const PLACEHOLDER_IMAGE = '/placeholder.png'

export default function NewCommunityVenue(){

    const queryClient = useQueryClient()


    const {paseto} = useAuthContext()
    const {currentOrg} = useOrgContext()
    const {currentCommunity} = useCommunity()

    const [form]=Form.useForm()
    const [fullAddress, setFullAddress] = useState({
        latitude:0,
        longitude:0,
        placeId: '',
        street: '',
        fullAddress: '',
        state: '',
        country:'',
        city:''
    })


    const router = useRouter() 

    const antInputRef = useRef();
    const areaCodeRef = useRef<InputRef>(null)
    const centralOfficeCodeRef = useRef<InputRef>(null)
    const tailNoRef = useRef<InputRef>(null)

    function handleAreaCodeRef(e:any){
        if(e.target.value.length >= 3){ 
            centralOfficeCodeRef.current!.focus()
        }
    }
    function handleCentralOfficeCode(e:any){
        if(e.target.value.length >= 3){ 
            tailNoRef.current!.focus()
        }
    }

    const extractFullAddress = (place:any)=>{
        const addressComponents = place.address_components 
            let addressObj = {
                state:'',
                country:'',
                city:'',
                street: '',
                latitude:place.geometry.location.lat(),
                longitude:place.geometry.location.lng()
            };
            addressComponents.forEach((address:any)=>{
                const type = address.types[0]
                if(type==='country') addressObj.country = address.long_name
                if(type==='route') addressObj.street = address.long_name
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
            fields: ['address_components','geometry','formatted_address', 'place_id']
        },
        onPlaceSelected: (place) => {
            // console.log(antInputRef.current.input)
            console.log(place)
            form.setFieldValue('address',place?.formatted_address)
            
            const fullAddress = extractFullAddress(place)
            // add street address
            const addressWithStreet={
                ...fullAddress,
                placeId: place?.place_id,
                fullAddress: place?.formatted_address
            }
            console.log(addressWithStreet)
            setFullAddress(addressWithStreet)

            //@ts-ignore
          antInputRef.current.input.value = place?.formatted_address

        },
      });
    

    const onFinish = async(formData:any)=>{

        // format phoneNumber
        const contact = formData.contact
        const formatedContact = `${contact.countryCode}${contact.areaCode}${contact.centralOfficeCode}${contact.tailNumber}`


        const formObject: CommunityVenueReq = {
            communityId: currentCommunity.id,
            venues: [{
                id: '',
                address: {
                    ...fullAddress,
                    latitude:String(fullAddress.latitude),
                    longitude:String(fullAddress.longitude),
                },
                promotion: formData.promotion,
                name: formData.name,
                contactNumber: formatedContact,
            }]
        }

        // @ts-ignore
        delete formObject.address

        console.log(formObject)

        createData.mutate(formObject)
    }

    const urlPrefix = useUrlPrefix()

  
      const createDataHandler = async(newItem:any)=>{
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community-venues`, newItem,{
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
        },
        onSettled:()=>{
            queryClient.invalidateQueries(['all-services'])
       },
    })

    const {isError, isLoading:isCreatingData, isSuccess:isDataCreated, data:createdData} = createData
    

    return (
        <div style={{background:'#ffffff', minHeight:'100vh'}}>
            <div style={{marginBottom:'1rem', padding: '1rem', borderBottom:'1px solid #e5e5e5',}}>
                <Row>
                    <Col offset={1}> 
                         <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Button shape='round' style={{marginRight:'.3rem'}} type='link' onClick={()=>router.back()} icon={<ArrowLeftOutlined/>}/>
                            <Title style={{margin:'0'}} level={3}>New Venue</Title>
                        </div>
                    </Col>
                </Row>
            </div>
            <Row >
                <Col offset={2} span={13}>
                    
                    <Form
                    name="liteVenueForm"
                    // initialValues={{ remember: true }}
                    layout='vertical'
                    onFinish={onFinish}
                    form={form}
                    >

        
                 {/* Service info */}
                <div style={{marginBottom:'2rem'}}>
                   {/* <Title></Title> */}
                    {/* <Text>All changes here will be reflected in the marketplace</Text> */}
                </div>
                <div style={{ borderRadius:'4px', padding:'1rem'}}> 
                    <Form.Item
                        name="name"
                        label="Name" 
                        
                        // extra="The name you provide here will be used as display on marketplace listing"
                        rules={[{ required: true, message: 'Please input a valid service name' }]}
                    >
                        <Input allowClear size="large" placeholder="Bill Cage coffee" />
                    </Form.Item>


                    <Form.Item name='promotion' rules={[{ required: true, message: 'Please write a description for your service' }]}  label="Promotion">
                        <TextArea allowClear maxLength={500} size='large' showCount  placeholder='Tell us more about this service' rows={2} />
                    </Form.Item>

                    <Form.Item  
                        name="address"
                        label='Address'
                        extra={<Text type="secondary"><InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} /> Please refresh the page if the address you selected is not being displayed in the field </Text> }
                        rules={[{ required: true, message: 'Please input a valid address!' }]}
                    >
                        <Input 
                            // suffix={
                            //     <Tooltip title="Please refresh the page if the date you selected is not being displayed in the field">
                            //       <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            //     </Tooltip>
                            //   }
                            size="large" 
                            allowClear
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
                        // name="contactNumber"
                        label="Contact Number"
                        required
                        style={{marginBottom:'0'}}
                        rules={[{ required: true, message: 'Please input a valid phone number' }]}
                    >
                        <Input.Group compact>
                            <Form.Item initialValue={'+1'} name={['contact','countryCode']} noStyle>
                                <Input allowClear style={{width:'10%'}} disabled size="large"/>
                            </Form.Item>
                            <Form.Item name={['contact','areaCode']} noStyle>
                                <Input allowClear ref={areaCodeRef} maxLength={3} onChange={handleAreaCodeRef} style={{width:'20%'}} size="large" placeholder="235" />
                            </Form.Item>
                            <Form.Item name={['contact','centralOfficeCode']} noStyle>
                                <Input allowClear ref={centralOfficeCodeRef} onChange={handleCentralOfficeCode} maxLength={3} style={{width:'20%'}} size="large" placeholder="380" />
                            </Form.Item>
                            <div style={{height:'40px',margin:'0 .3rem 0 .3rem', display:'inline-flex', alignItems:'center',  verticalAlign:'center'}}>
                            <MinusOutlined style={{color:"#e7e7e7"}} />
                            </div>
                            <Form.Item name={['contact','tailNumber']} noStyle>
                                <Input ref={tailNoRef} maxLength={4} style={{width:'20%'}} size="large" placeholder="3480" />
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>

                    
                </div>



                    {/* onCancelFormCreation */}
                    <Form.Item style={{marginTop:'4rem'}}>
                        <Space>
                            <Button shape="round" onClick={()=>{router.back()}} type='ghost'>
                                Cancel
                            </Button>

                            <Button shape="round" type="primary" size="large" loading={isCreatingData}  htmlType="submit" >
                               Add Venue
                            </Button>
                        </Space>     
                    </Form.Item>

                    </Form>
                </Col>
            </Row>
       </div>    
    )
}

