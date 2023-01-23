import React, { useRef, useState } from "react";
import {Form, Row, Col, Image, Input,Upload,Button,notification, Typography, Space, Select, Divider} from 'antd';
import {UploadOutlined, ArrowLeftOutlined} from '@ant-design/icons'
const {Title} = Typography
const {TextArea} = Input

import { useRouter } from 'next/router';
import {usePlacesWidget} from 'react-google-autocomplete'
import { asyncStore} from "../../../../utils/nftStorage";
import { Service, ServicePayload } from "../../../../types/Services";
import { useOrgContext } from "../../../../context/OrgContext";
import useServiceTypes from "../../../../hooks/useServiceTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { url } from "inspector";
import { useAuthContext } from "../../../../context/AuthContext";
import { NewOrg } from "../../../../types/OrganisationTypes";


const getBase64 = (file: any): Promise<string> => 
new Promise((resolve, reject) => {
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = () => resolve(reader.result as string);
reader.onerror = (error) => reject(error);
});

const PLACEHOLDER_IMAGE = '/placeholder-image.png'

interface Props{
    onToggleEdit: ()=>void,
    selectedOrg: NewOrg
}

export default function EditOrganizationForm({onToggleEdit,selectedOrg}:Props){

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
    const [logoImage, setLogoImage] = useState(PLACEHOLDER_IMAGE)
    const [coverImage, setCoverImage] = useState(PLACEHOLDER_IMAGE)

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

        setIsHashingAssets(true)
        const logoHash = await asyncStore(formData.logoImageHash[0].originFileObj)
        const coverImageHash = await asyncStore(formData.coverImageHash[0].originFileObj)
        setIsHashingAssets(false)


        const formObject: ServicePayload = {
            ...formData,
            ...fullAddress,
            logoImageHash: logoHash,
            coverImageHash: coverImageHash,
            orgId:currentOrg.orgId,
            timeZone: 'UTC',
        }
        // remove address field since because we have extracted
        // @ts-ignore
        delete formObject.address
        createDataHandler(formObject)
        onToggleEdit()
    }

        const extractLogoImage = async(e: any) => {
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
        const {data} = await axios.put(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/orgs`, newItem,{
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
    

    return (
                    
                    <Form
                    name="editOrganizationForm"
                    initialValues={selectedOrg}
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
                        name="address"
                        label='Address'
                        rules={[{ required: true, message: 'Please input a valid address!' }]}
                    >
                        <TextArea rows={3} placeholder='Apt. 235 30B NorthPointsettia Street, Syracuse'/>
                        {/* <Input ref={(c) => {
                            // @ts-ignore
                            antInputRef.current = c;
                            // @ts-ignore
                            if (c) antRef.current = c.input;
                            }} 
                            placeholder="Syracuse, United states" 
                            /> */}
                    </Form.Item>


                    <Form.Item
                        name="zipCode"
                        style={{width:'100px'}}
                        label='Zip Code'
                        rules={[{ required: true, message: 'Please input a valid code!' }]}
                    >
                        <Input size="large" placeholder="374739" />
                    </Form.Item>


                    <Divider orientation='left'>Asset upload</Divider>
                    <Image alt='Organization logo' src={logoImage} style={{width:'150px',height:'150px', borderRadius:'50%', border:'1px solid #e5e5e5'}}/>
                    <Form.Item
                        name="logoImageHash"
                        // label="Logo"
                        valuePropName="logoImageHash"
                        getValueFromEvent={extractLogoImage}
                    >
                        
                        <Upload name="logoImageHash" multiple={false} fileList={[]} >
                                <Button size='small' type='link'>Upload logo image</Button>
                        </Upload>
                    </Form.Item>

                    <Image alt='Organization cover image' src={coverImage} style={{width:'580px',height:'150px', objectFit:'cover', borderRadius:'4px', border:'2px dashed #dddddd'}}/>
                    <Form.Item
                        name="coverImage"
                        // label="Cover image"
                        valuePropName="coverImage"
                        getValueFromEvent={extractCoverImage}
                    >
                        <Upload name="coverImage" multiple={false} fileList={[]} >
                            <Button size='small' type='link'>Upload cover image</Button>
                        </Upload>
                    </Form.Item>

                    {/* onCancelFormCreation */}
                    <Form.Item style={{ marginTop:'4rem', width:'100%'}}>
                        <Space >
                            <Button shape="round" onClick={()=>onToggleEdit()} type='ghost'>
                                Cancel
                            </Button>

                            <Button shape="round" type="primary" size="large" loading={isHashingAssets || isCreatingData}  htmlType="submit" >
                                Apply changes
                            </Button>
                        </Space>
                        
                    </Form.Item>

                    </Form>

    )
}
