import React, { useRef, useEffect, useState } from "react";
import {Form, Row, Col, Image, Input,Upload,Button,notification, Typography, Space, Select, Divider, InputRef, FormInstance} from 'antd';
import {UploadOutlined, MinusOutlined, ArrowLeftOutlined} from '@ant-design/icons'
const {Title,Text} = Typography
const {TextArea} = Input

import { useRouter } from 'next/router';
import {usePlacesWidget} from 'react-google-autocomplete'
import { uploadToPinata} from "../../../utils/nftStorage";
import { useOrgContext } from "../../../context/OrgContext";
import useServiceTypes from "../../../hooks/useServiceTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../../../context/AuthContext";
import {NewOrg, OrgPayload } from "../../../types/OrganisationTypes";
import useUrlPrefix from "../../../hooks/useUrlPrefix";


const getBase64 = (file: any): Promise<string> => 
new Promise((resolve, reject) => {
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = () => resolve(reader.result as string);
reader.onerror = (error) => reject(error);
});

const PLACEHOLDER_IMAGE = '/placeholder.png'

export default function NewOrgForm(){


    const menuItems = useServiceTypes()
    const {paseto} = useAuthContext()
    const {currentOrg} = useOrgContext()
    const [form]=Form.useForm()
    const [fullAddress, setFullAddress] = useState({
        country:'',
        city:''
    })
    const [isHashingAssets, setIsHashingAssets] = useState(false)
    let queryClient = useQueryClient()

    const router = useRouter()
    const antInputRef = useRef();
    const [logoImage, setLogoImage] = useState(PLACEHOLDER_IMAGE)
    const [coverImage, setCoverImage] = useState(PLACEHOLDER_IMAGE)

    const urlPrefix = useUrlPrefix()

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
                // state:'',
                country:'',
                city:'',
                zipCode:'',
            };
            addressComponents.forEach((address:any)=>{
                const type = address.types[0]
                if(type==='country') addressObj.country = address.long_name
                // if(type === 'locality') addressObj.state = address.short_name
                if(type === 'administrative_area_level_1') addressObj.city = address.short_name
                if(type === 'postal_code') addressObj.zipCode = address.short_name
            })

            return addressObj
    }

      const { ref: antRef } = usePlacesWidget({
        apiKey: `${process.env.NEXT_PUBLIC_MAPS_AUTOCOMPLETE_API}`,
        options:{
            componentRestrictions:{country:'us'},
            types: ['address'],
            fields: ['address_components','formatted_address']
        },
        onPlaceSelected: (place) => {
            // console.log(antInputRef.current.input)
            form.setFieldValue('address',place?.formatted_address)
            
            const fullAddress = extractFullAddress(place)
            const addressWithStreet={
                ...fullAddress,
                street: place?.formatted_address
            }

            setFullAddress(addressWithStreet)

            //@ts-ignore
          antInputRef.current.input.value = place?.formatted_address

        },
      });
    

    const onFinish = async(formData:NewOrg)=>{

        const logoRes = await formData.logoImageHash

        setIsHashingAssets(true)
        // @ts-ignore
        const logoHash = await uploadToPinata(logoRes[0].originFileObj)
        setIsHashingAssets(false)

         // format phoneNumber
         const contact = formData.contact
         const formatedContact = `${contact.countryCode}${contact.areaCode}${contact.centralOfficeCode}${contact.tailNumber}`


        const formObject: OrgPayload = {
            ...formData,
            ...fullAddress,
            logoImageHash: logoHash as string,
            coverImageHash: '',
            contactNumber: formatedContact,
            // orgId:currentOrg.orgId,
        }
        // remove address field since because we have extracted

        // @ts-ignore
        delete formObject.address

        // @ts-ignore
        delete formObject.contact

        createData.mutate(formObject)
    }

        const extractLogoImage = async(e: any) => {
            // e.preventDefault()
            console.log('Upload event:', e);
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
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org`, newItem,{
            headers:{
                "Authorization": paseto
            },
        })
        return data
    }

    const changeOrgStatusHandler = async(newItem:any)=>{
        const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org`, newItem,{
            headers:{
                "Authorization": paseto
            },
        })
        return data
    }

    const orgStatusMutation = useMutation(changeOrgStatusHandler,{
        onSuccess:()=>{
            queryClient.invalidateQueries(['organizations'])
            router.back()
        },
        onError:()=>{
            notification['error']({
                message: 'Encountered an error while changing organization status for manager or superadmin',
              });
        }
    })

    const createData = useMutation(createDataHandler,{
       onSuccess:(data)=>{
        const orgId = data.data[0].orgId
        notification['success']({
            message: 'Successfully created new organization!'
        })
          // change status
          const orgStatusPayload = {
            // key:'status',
            status: '1', // 0 means de-activated in db
            id: orgId 
          }
          orgStatusMutation.mutate(orgStatusPayload)
       },
       onSettled:()=>{
            queryClient.invalidateQueries(['all-orgs'])
       },
        onError:()=>{
            notification['error']({
                message: 'Encountered an error while creating organization',
              });
            // leave modal open
        } 
    })

    const {isError, isLoading:isCreatingData, isSuccess:isDataCreated, data:createdData} = createData


    return (
        <div style={{background:'#ffffff', minHeight:'100vh'}}>
            <div style={{marginBottom:'1rem', padding: '1rem', borderBottom:'1px solid #e5e5e5',}}>
                <Row>
                    <Col offset={1}> 
                         <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Button shape='round' style={{marginRight:'.2rem'}} type='link' onClick={()=>router.back()} icon={<ArrowLeftOutlined rev={undefined}/>}/>
                            <Title style={{margin:'0'}} level={3}>New Organization</Title>
                        </div>
                    </Col>
                </Row>
            </div>
            <Row >
                <Col offset={2} span={11}>
                    
                    <Form
                    name="organizationForm"
                    initialValues={{ remember: true }}
                    layout='vertical'
                    onFinish={onFinish}
                    form={form}
                    >
                    
                      {/* Organization info */}
                      <div style={{marginBottom:'2rem', marginTop:'3rem'}}>
                        <Title level={3}>Organization Info</Title>
                        {/* <Text>All changes here will be reflected in the marketplace</Text> */}
                    </div>
                    <div style={{border:'1px solid #e2e2e2', borderRadius:'4px', padding:'1rem'}}> 



                    <Form.Item
                        name="name"
                        label="Name"
                        hasFeedback
                        rules={[{ required: true, message: 'Please input a valid name' }]}
                    >
                        <Input size="large" placeholder="Flexable org" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label='Email'
                        hasFeedback
                        rules={[{ required: true, message: 'This field is required!' }, { type: 'email', message: 'Please input a valid email!' }]}
                    >
                        <Input size="large" type="email" placeholder="mujahid.bappai@flexable.com" />
                    </Form.Item>

                    <Form.Item
                        // name="contactNumber"
                        label="Contact Number"
                        required
                        rules={[{ required: true, message: 'Please input a valid phone number' }]}
                    >
                        <Space.Compact block>
                            <Form.Item initialValue={'+1'} name={['contact','countryCode']} noStyle>
                                <Input style={{width:'10%'}} disabled size="large"/>
                            </Form.Item>
                            <Form.Item rules={[ { pattern: /^\d+$/, message: 'Area code must be a number' },]}  name={['contact','areaCode']} noStyle>
                                <Input  ref={areaCodeRef} maxLength={3} onChange={handleAreaCodeRef} style={{width:'20%'}} size="large" placeholder="235" />
                            </Form.Item>
                            <Form.Item rules={[ { pattern: /^\d+$/, message: 'Central code must be a number' },]} name={['contact','centralOfficeCode']} noStyle>
                                <Input ref={centralOfficeCodeRef} onChange={handleCentralOfficeCode} maxLength={3} style={{width:'20%'}} size="large" placeholder="380" />
                            </Form.Item>
                            <div style={{height:'40px',margin:'0 .3rem 0 .3rem', display:'inline-flex', alignItems:'center',  verticalAlign:'center'}}>
                            <MinusOutlined style={{ color: "#e7e7e7" }} rev={undefined} />
                            </div>
                            <Form.Item rules={[ { pattern: /^\d+$/, message: 'Tail number must be a number' },]} name={['contact','tailNumber']} noStyle>
                                <Input ref={tailNoRef} maxLength={4} style={{width:'20%'}} size="large" placeholder="3480" />
                            </Form.Item>
                        </Space.Compact>
                    </Form.Item>

                    <Form.Item 
                        name="address"
                        label='Address'
                        hasFeedback
                        rules={[{ required: true, message: 'Please input a valid address!' }]}
                    >
                        {/* <TextArea rows={3} placeholder='Apt. 235 30B NorthPointsettia Street, Syracuse'/> */}
                        <Input size="large" ref={(c) => {
                            // @ts-ignore
                            antInputRef.current = c;
                            // @ts-ignore
                            if (c) antRef.current = c.input;
                            }} 
                            placeholder="Syracuse, United states" 
                            />
                    </Form.Item>

                    </div>


                      {/* Assets */}
                      <div style={{marginBottom:'2rem', marginTop:'3rem'}}>
                        <Title level={3}>Image Upload</Title>
                        {/* <Text>All changes here will be reflected in the marketplace</Text> */}
                    </div>
                    {/* <div style={{border:'1px solid #e2e2e2', borderRadius:'4px', padding:'1rem'}}>   */}
                        <Image alt='Organization logo' src={logoImage} style={{width:'150px',height:'150px', borderRadius:'50%', border:'1px solid #e5e5e5'}}/>
                        <Form.Item
                            name="logoImageHash"
                            valuePropName="logoImageHash"
                            getValueFromEvent={extractLogoImage}
                            extra={'Please upload a PNG or JPEG that is 1024px x 1024px'}
                            rules={[{ required: true, message: 'Please upload an image' }]}
                        >
                            
                            <Upload name="logoImageHash" multiple={false} fileList={[]}  >
                                    <Button size='small' type='link'>Upload logo image</Button>
                            </Upload>
                        </Form.Item>
{/* 
                    <Image alt='Organization cover image' src={coverImage} style={{width:'350px',height:'150px', objectFit:'cover', borderRadius:'4px', border:'2px dashed #dddddd'}}/>
                    <Form.Item
                        name="coverImageHash"
                        // label="Cover image"
                        valuePropName="coverImageHash"
                        getValueFromEvent={extractCoverImage}
                        rules={[{ required: true, message: 'Please upload an image' }]}
                    >
                        <Upload name="coverImageHash" multiple={false} fileList={[]} >
                            <Button size='small' type='link'>Upload cover image</Button>
                        </Upload>
                    </Form.Item> */}
                    {/* </div> */}

                    {/* onCancelFormCreation */}
                    <Form.Item style={{ marginTop:'4rem', width:'100%'}}>
                        <Space >
                            <Button shape="round" onClick={()=>{}} type='ghost'>
                                Cancel
                            </Button> 

                            <SubmitButton
                                isCreatingData={isCreatingData}
                                isHashingAssets={isHashingAssets}
                                form={form}
                            />
                        </Space>
                        
                    </Form.Item>

                    </Form>
                </Col>
            </Row>
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

    const router = useRouter() 
  
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
        Create Organization
     </Button>
    );
  };