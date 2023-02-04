import React, { useRef, useState } from "react";
import {Form, Row, Col, Image, Input,Upload,Button,notification, Typography, Space, Select, Divider} from 'antd';
import {UploadOutlined, ArrowLeftOutlined} from '@ant-design/icons'
const {Title} = Typography
const {TextArea} = Input

import { useRouter } from 'next/router';
import {usePlacesWidget} from 'react-google-autocomplete'
import { asyncStore} from "../../../utils/nftStorage";
import { useOrgContext } from "../../../context/OrgContext";
import useServiceTypes from "../../../hooks/useServiceTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../../../context/AuthContext";
import {NewOrg, OrgPayload } from "../../../types/OrganisationTypes";


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

    const router = useRouter()
    const antInputRef = useRef();
    const [logoImage, setLogoImage] = useState(PLACEHOLDER_IMAGE)
    const [coverImage, setCoverImage] = useState(PLACEHOLDER_IMAGE)

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
            fields: ['address_components','geometry','formatted_address']
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
        const coverImageRes = await formData.coverImageHash

        setIsHashingAssets(true)
        // @ts-ignore
        const logoHash = await asyncStore(logoRes[0].originFileObj)
        // @ts-ignore
        const coverImageHash = await asyncStore(coverImageRes[0].originFileObj)
        setIsHashingAssets(false)


        const formObject: OrgPayload = {
            ...formData,
            ...fullAddress,
            logoImageHash: logoHash,
            coverImageHash: coverImageHash,
            // orgId:currentOrg.orgId,
        }
        // remove address field since because we have extracted

        // @ts-ignore
        delete formObject.address
        console.log(formObject)
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

        const extractCoverImage = async(e: any) => {
            // e.preventDefault()
            console.log('Upload event:', e);
            if (Array.isArray(e)) {
            return e;
            }

            console.log(e)
            const imageBlob = e.fileList[0].originFileObj
            console.log("blob",imageBlob)
            const src = await getBase64(imageBlob)
            setCoverImage(src)
       

        return e?.fileList;
      };


      const createDataHandler = async(newItem:any)=>{
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`, newItem,{
            headers:{
                "Authorization": paseto
            },
        })
        return data
    }

    const createData = useMutation(createDataHandler,{
       onSuccess:()=>{
        form.resetFields()
        console.log('record created')
        notification['success']({
            message: 'Successfully created new organization!'
        })
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


    return (
        <div style={{background:'#ffffff', minHeight:'100vh'}}>
            <div style={{marginBottom:'3rem', padding: '1rem', borderBottom:'1px solid #e5e5e5',}}>
                <Row>
                    <Col offset={1}> 
                         <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Button shape='round' style={{marginRight:'1rem'}} type='text' onClick={()=>router.back()} icon={<ArrowLeftOutlined/>}/>
                            <Title style={{margin:'0'}} level={3}>Create new organization</Title>
                        </div>
                    </Col>
                </Row>
            </div>
            <Row >
                <Col offset={2} span={9}>
                    
                    <Form
                    name="organizationForm"
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
                        <Input size="large" placeholder="Flexable org" />
                    </Form.Item>


                    <Form.Item
                        name="email"
                        label='Organization email'
                        rules={[{ required: true, message: 'Please input a valid email!' }]}
                    >
                        <Input size="large" placeholder="mujahid.bappai@flexable.com" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label='Contact number'
                        // rules={[{ required: true, message: 'Please input a valid email!' }]}
                    >
                        <Input size="large" placeholder="+23802323493" />
                    </Form.Item>

                    <Form.Item 
                        name="address"
                        label='Address'
                        // hasFeedback
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


                    {/* <Form.Item
                        name="zipCode"
                        style={{width:'100px'}}
                        label='Zip Code'
                        rules={[{ required: true, message: 'Please input a valid code!' }]}
                    >
                        <Input size="large" placeholder="374739" />
                    </Form.Item> */}


                    <Divider orientation='left'>Asset upload</Divider>
                    <Image alt='Organization logo' src={logoImage} style={{width:'150px',height:'150px', borderRadius:'50%', border:'1px solid #e5e5e5'}}/>
                    <Form.Item
                        name="logoImageHash"
                        valuePropName="logoImageHash"
                        getValueFromEvent={extractLogoImage}
                        rules={[{ required: true, message: 'Please upload an image' }]}
                    >
                        
                        <Upload name="logoImageHash" multiple={false} fileList={[]}  >
                                <Button size='small' type='link'>Upload logo image</Button>
                        </Upload>
                    </Form.Item>

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
                    </Form.Item>

                    {/* onCancelFormCreation */}
                    <Form.Item style={{ marginTop:'4rem', width:'100%'}}>
                        <Space >
                            <Button shape="round" onClick={()=>{}} type='ghost'>
                                Cancel
                            </Button>

                            <Button shape="round" type="primary" size="large" loading={isHashingAssets || isCreatingData}  htmlType="submit" >
                                Create organization
                            </Button>
                        </Space>
                        
                    </Form.Item>

                    </Form>
                </Col>
            </Row>
       </div>    
    )
}
