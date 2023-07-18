import React, { useRef, useState, useEffect } from "react";
import {Form, Row, Col, Image, Tooltip, Input, Upload, Button, notification, Typography, Space, Select, Radio, Divider, TimePicker, InputRef, FormInstance, DatePicker} from 'antd';
import {UploadOutlined,MinusOutlined, QuestionCircleOutlined, ArrowLeftOutlined, InfoCircleOutlined,  InboxOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'

const {Title,Text} = Typography
const {TextArea} = Input

var utc = require('dayjs/plugin/utc')


import { useRouter } from 'next/router';
import {usePlacesWidget} from 'react-google-autocomplete'
import { asyncStore} from "../../../utils/nftStorage";
// import { Event } from "../../../types/Events";
import { useOrgContext } from "../../../context/OrgContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../../../context/AuthContext";
import loadConfig from "next/dist/server/config";
import useUrlPrefix from "../../../hooks/useUrlPrefix";

const getBase64 = (file: any): Promise<string> => 
new Promise((resolve, reject) => {
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = () => resolve(reader.result as string);
reader.onerror = (error) => reject(error);
});

const PLACEHOLDER_IMAGE = '/placeholder.png'

export default function NewEvent(){

    const queryClient = useQueryClient()

    const {paseto} = useAuthContext()
    const {currentOrg} = useOrgContext()

    const [form]=Form.useForm()
    const [fullAddress, setFullAddress] = useState({
        latitude:0,
        longitude:0,
        street:'',
        placeId: '',
        fullAddress:'',
        state: '',
        country:'',
        city:''
    })

    const [isHashingAssets, setIsHashingAssets] = useState(false)
    const [logoImage, setLogoImage] = useState(PLACEHOLDER_IMAGE)

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
                street:'',
                placeId:'',
                fullAddress:'',
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
            fields: ['address_components','geometry','formatted_address','place_id']
        },
        onPlaceSelected: (place) => {
            // console.log(antInputRef.current.input)
            console.log(place)
            form.setFieldValue('address',place?.formatted_address)
            
            const fullAddress = extractFullAddress(place)
            // add street address
            const addressWithStreet={
                ...fullAddress,
                fullAddress: place?.formatted_address,
                placeId: place?.place_id
            }
            setFullAddress(addressWithStreet)

            //@ts-ignore
          antInputRef.current.input.value = place?.formatted_address

        },
      });
    

    const onFinish = async(formData:any)=>{

        const logoRes = await formData.coverImageHash
        setIsHashingAssets(true)
        //@ts-ignore
        const imageHash = await asyncStore(logoRes[0].originFileObj)
        //@ts-ignore
        // const coverImageHash = await asyncStore(formData.coverImageHash[0].originFileObj)
        setIsHashingAssets(false)


        // format phoneNumber
        const contact = formData.contact
        const formatedContact = `${contact.countryCode}${contact.areaCode}${contact.centralOfficeCode}${contact.tailNumber}`

        const validity = formData.validity


        const formObject: any = {
            coverImageHash: imageHash,
            artworkHash: imageHash,
            timezone: validity.timezone,
            startTime: dayjs(validity.startTime).format(),
            name: formData.name,
            description: formData.description,
            price: Number(formData.price)*100,
            locationName: formData.locationName,
            totalTickets: Number(formData.totalTickets),
            duration: Number(formData.duration)*60,
            address: {
                country: fullAddress.country,
                state: fullAddress.state,
                city: fullAddress.city,
                street: fullAddress.street,
                fullAddress: fullAddress.fullAddress,
                latitude: String(fullAddress.latitude),
                longitude: String(fullAddress.longitude),
                placeId: fullAddress.placeId
            },
            contactNumber: formatedContact,
            //@ts-ignore
            orgId:currentOrg.orgId,
            //@ts-ignore
        }
        //@ts-ignore
        delete formObject.validityPeriod
        // @ts-ignore
        delete formObject.contact

        // console.log(formObject)

        createData.mutate(formObject)
    }

    const urlPrefix = useUrlPrefix()

    const extractLogoImage = async(e: any) => {
        // e.preventDefault()
        if (Array.isArray(e)) {
        return e;
        }

        console.log(e)
        const imageBlob = e.fileList[0].originFileObj
        console.log("blob",imageBlob)
        const src = await getBase64(imageBlob)
        setLogoImage(src)
   
    return e?.fileList;
  };

      const createDataHandler = async(newItem:any)=>{
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/events`, newItem,{
            headers:{
                "Authorization": paseto
            },
        })
        return data
    }

    const createData = useMutation(createDataHandler,{
       onSuccess:(data)=>{
            if(data.status > 201){
                notification['error']({
                    message: 'Error creating events',
                  });
                // leave modal open
            }else{
                notification['success']({
                    message: 'Success creating record',
                  });
                  router.back() 
            }
       },
        onError:()=>{
            notification['error']({
                message: 'Encountered an error while creating record',
              });
            // leave modal open
        },
        onSettled:()=>{
            queryClient.invalidateQueries(['all-events'])
       },
    })

    const {isError, isLoading:isCreatingData, isSuccess:isDataCreated, data:createdData} = createData
    

    return (
        <div style={{background:'#ffffff', minHeight:'100vh'}}>
            <div style={{marginBottom:'3rem', padding: '1rem', borderBottom:'1px solid #e5e5e5',}}>
                <Row>
                    <Col offset={1}> 
                         <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}> 
                            {/* @ts-ignore */}
                            <Button shape='round' style={{marginRight:'.3rem'}} type='link' onClick={()=>router.back()} icon={<ArrowLeftOutlined />} />
                            <Title style={{margin:'0'}} level={3}>New Event</Title>
                        </div>
                    </Col>
                </Row>
            </div>
            <Row >
                <Col offset={3} span={13}>
                    
                    <Form
                    name="eventsForm"
                    // initialValues={{ remember: true }}
                    layout='vertical'
                    onFinish={onFinish}
                    form={form}
                    >

           

                 {/* Event info */}
                <div style={{marginBottom:'2rem'}}>
                    <Title level={3}>{`Event info`}</Title>
                    <Text>All changes here will be reflected in the marketplace</Text>
                </div>
                <div style={{border:'1px solid #e2e2e2', borderRadius:'4px', padding:'1rem'}}> 
                    <Form.Item
                        name="name"
                        label="Title" 
                        
                        hasFeedback
                        // extra="The name you provide here will be used as display on marketplace listing"
                        rules={[
                            { required: true, message: 'This field is required' },
                            // { pattern:/^[A-Za-z ]+$/, message: 'Please provide only string values' },
                            { max: 100, message: 'Sorry, your event name cant be more than 100 characters' },
                            ]}
                    >
                        <Input 
                        type="string"
                        allowClear size="large" placeholder="Eg. How to start a business in Syracuse" />
                    </Form.Item>

                    {/* promotion */}
                    <Form.Item hasFeedback name={'description'} rules={[{ required: true, message: 'Please write a description for your venue' }]}  label="Description">
                        <TextArea allowClear maxLength={500} size='large' showCount  placeholder='One flight of our award winning wines' rows={2} />
                    </Form.Item>

                    <Form.Item
                        name={'price'} 
                        hasFeedback
                        // extra="Market Value of the promotion is required so that the Community DAT can be properly priced on the Marketplace"
                        label='Price'
                        style={{width:'100%'}}
                        rules={[{ required: true, message: 'Please input a valid price!' },{ pattern: /^\d+$/, message: 'Area code must be a number' },{min:1, message: 'Price cannot be any lower than $1'}]}
                        >
                        <Input size='large' style={{width:'50%'}}  prefix="$" suffix='Per DAT' placeholder="0" /> 
                    </Form.Item> 

                    <Form.Item
                        hasFeedback
                        name={'totalTickets'} 
                        // extra="Market Value of the promotion is required so that the Community DAT can be properly priced on the Marketplace"
                        label='Available DATs'
                        style={{width:'100%'}}
                        rules={[{ required: true, message: 'This field is required' },{ pattern: /^\d+$/, message: 'Must be a number' }]}
                        >
                        <Input size='large' style={{width:'50%'}}  placeholder="0" /> 
                    </Form.Item> 
                    </div>

                    <div style={{margin:'3rem 0'}}>
                        <Title level={3}>{`Location info`}</Title>
                        {/* <Text>All changes here will be reflected in the marketplace</Text> */}
                    </div>
                    <div style={{border:'1px solid #e2e2e2', borderRadius:'4px', padding:'1rem'}}> 

                        <Form.Item
                            name="locationName"
                            label="Venue Name" 
                            
                            hasFeedback
                            // extra="The name you provide here will be used as display on marketplace listing"
                            rules={[
                                { required: true, message: 'This field is required' },
                                // { pattern:/^[A-Za-z ]+$/, message: 'Please provide only string values' },
                                { max: 100, message: 'Sorry, your event name cant be more than 100 characters' },
                        
                                ]}
                        >
                            <Input 
                            type="string"
                            allowClear size="large" placeholder="Eg. Benjamins On Franklin" />
                        </Form.Item>

                        <Form.Item  
                            name="address"
                            label='Address'
                            hasFeedback
                            // @ts-ignore
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
                            rules={[
                                { required: true, message: 'Please provide values in all field' },
                                // { pattern: /^\d+$/, message: 'All values must be a number' },
                            ]}
                        >
                            <Space.Compact block>

                                <Form.Item  initialValue={'+1'} name={['contact','countryCode']} noStyle>
                                    <Input allowClear style={{width:'10%'}} disabled size="large"/>
                                </Form.Item>

                                <Form.Item  rules={[ { pattern: /^\d+$/, message: 'Area code must be a number' },]} name={['contact','areaCode']} noStyle>
                                    <Input allowClear ref={areaCodeRef} maxLength={3} onChange={handleAreaCodeRef} style={{width:'20%'}} size="large" placeholder="235" />
                                </Form.Item>

                                <Form.Item rules={[ { pattern: /^\d+$/, message: 'Central Office Code must be a number' },]} name={['contact','centralOfficeCode']} noStyle>
                                    <Input  allowClear ref={centralOfficeCodeRef} onChange={handleCentralOfficeCode} maxLength={3} style={{width:'20%'}} size="large" placeholder="380" />
                                </Form.Item>

                                <div style={{height:'40px',margin:'0 .3rem 0 .3rem', display:'inline-flex', alignItems:'center',  verticalAlign:'center'}}>
                                {/* <MinusOutlined style={{ color: "#e7e7e7" }} /> */}
                                </div>

                                <Form.Item  rules={[ { pattern: /^\d+$/, message: 'Tail Number must be a number' },]} name={['contact','tailNumber']} noStyle>
                                    <Input ref={tailNoRef} maxLength={4} style={{width:'20%'}} size="large" placeholder="3480" />
                                </Form.Item>

                            </Space.Compact>
                        </Form.Item>


                        <Form.Item
                            label="Select Date and Time"
                            hasFeedback
                            required
                            style={{marginBottom:'0',marginTop:'2rem', width:'70%'}}
                            // extra={`Enter a timeframe you want your DAT to be redeemable by customers. This may vary based on your industry and service you provide. Eg: a "Saturday Night Line Skip" at a bar might be valid from 7pm on Saturday night until 4am Sunday morning, to allow the late night partygoers a chance to redeem their tickets. A restaurant DAT for a "Last Minute Saturday Reservation" might only need to have validity period of 12 noon - 12 midnight`} 
                            rules={[{required: true, message: 'This field is required' }]}
                        >
                            <Space.Compact size="large"  block>
                                <Form.Item   rules={[{required:true, message:'This field is required'}]}  name={['validity','startTime']} >
                                    <DatePicker  style={{ width: 300 }}  showTime placeholder="Select Date and Time"  format={'MMM DD, YYYY, H A'}  size="large" />
                                </Form.Item>

                                {/* <Form.Item   rules={[{required:true, message:'This field is required'}]}  name={['validity','time']} >
                                    <TimePicker   placeholder="Time" format={'H A'}   size="large" />
                                </Form.Item> */}

                                <Form.Item  rules={[{required:true, message:'This field is required'}]}  name={['validity','timezone']} >
                                    <Select
                                        // defaultValue="America/New_York"
                                        style={{ width: 150 }}
                                        // onChange={handleChange}
                                        placeholder='Timezone'
                                        options={[
                                            { value: 'EST', label: 'EST' },
                                            { value: 'EDT', label: 'EDT' },
                                            { value: 'CST', label: 'CST' },
                                            { value: 'CDT', label: 'CDT' },
                                            { value: 'MST', label: 'MST' },
                                            { value: 'PST', label: 'PST' },
                                            { value: 'PDT', label: 'PDT' },
                                            { value: 'AKST', label: 'AKST' },
                                            { value: 'HST', label: 'HST' },
                                            { value: 'AST', label: 'AST' },
                                        ]}
                                    />
                                </Form.Item>
                            </Space.Compact> 


                        </Form.Item>  

                        <Form.Item

                            name={'duration'} 
                            // extra="Market Value of the promotion is required so that the Community DAT can be properly priced on the Marketplace"
                            label='Duration'
                            style={{width:'100%'}}
                            rules={[{ required: true, message: 'This field is required' }]}
                            >
                            <Input size='large' suffix='Hour(s)' style={{width:'30%'}}  placeholder="2" /> 

                        </Form.Item> 

                     </div>
                     

                

                    <div style={{marginBottom:'2rem', marginTop:'3rem'}}>
                        <Title level={3}>Cover Image Upload</Title>
                        <Text >Your cover image and artwork will be visible on marketplace</Text>
                        {/* <Tooltip trigger={['click']} placement='right' title={<LogoTip/>}>
                            <Button type="link">Show me <QuestionCircleOutlined rev={undefined} /></Button>
                        </Tooltip> */}
                    </div>

                    {/* <div style={{border:'1px solid #e2e2e2', borderRadius:'4px', padding:'1rem'}}>  */}

                        <Image alt='Cover image for events' src={logoImage} style={{width:'150px',height:'150px', borderRadius:'50%', border:'1px solid #e5e5e5'}}/>
                        <Form.Item
                            name="coverImageHash"
                            valuePropName="coverImageHash"
                            getValueFromEvent={extractLogoImage}
                            extra={'Please upload a PNG or JPEG that is 1024px x 1024px'}
                            rules={[{ required: true, message: 'Please upload an image' }]}
                        >
                            
                            <Upload name="coverImageHash" multiple={false} fileList={[]}  >
                                    <Button size='small' type='link'>Upload cover image</Button>
                            </Upload>
                        </Form.Item>

                       

                    {/* onCancelFormCreation */}
                    <Form.Item style={{marginTop:'4rem'}}>
                        <Space>
                            <Button shape="round" onClick={()=>router.back()} type='ghost'>
                                Cancel
                            </Button>

                           <SubmitButton
                            form={form}
                            isHashingAssets={isHashingAssets}
                            isCreatingData = {isCreatingData}
                           />
                        </Space>     
                    </Form.Item>

                    </Form>
                </Col>
            </Row>
       </div>    
    )
}



function LogoTip(){
    return(
        <div>
            <Image style={{objectFit:'cover'}} src={'/explainers/service-explainer.png'} alt='Event explainer as displayed on marketplace'/>
            <Text style={{color:'white'}}>It is very important that you provide the requested the image size else, it will look distorted on marketplace.</Text>
        </div>
    ) 
}

interface SubmitButtonProps{
    isHashingAssets: boolean,
    isCreatingData: boolean,
    form: FormInstance
}

const SubmitButton = ({ form, isCreatingData, isHashingAssets }:SubmitButtonProps) => {
    const [submittable, setSubmittable] = useState(false);
  
    // Watch all values
    const values = Form.useWatch([], form);

  
    useEffect(() => {
        
      form.validateFields({validateOnly:true}).then(
        (res) => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        },
      );
    }, [values]);
  
    return (
        <Button shape="round" type="primary" disabled={!submittable} size="large" loading={isHashingAssets || isCreatingData}  htmlType="submit" >
        Launch Event
     </Button>
    );
  };
  