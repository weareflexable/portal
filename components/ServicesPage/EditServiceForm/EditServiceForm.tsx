import { useQueryClient, useMutation } from "@tanstack/react-query"
import { Button, Form, Row, Col, Input, Space, Upload, Image, Typography } from "antd"
const {Text} = Typography
import axios from "axios"

import { useState, useRef } from "react"
import { usePlacesWidget } from "react-google-autocomplete"
import { useAuthContext } from "../../../context/AuthContext"
import useUrlPrefix from "../../../hooks/useUrlPrefix"
import { asyncStore } from "../../../utils/nftStorage"
import { Service } from "../Services.types"

interface EditableProp{
    selectedRecord: Service
  }
  export function EditableName({selectedRecord}:EditableProp){
  
    const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)

    const urlPrefix = useUrlPrefix()
  
    const {paseto} = useAuthContext()
  
    const queryClient = useQueryClient()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
   
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/services`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationKey:['serviceName'],
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      }
    })
  
    function onFinish(updatedItem:Service){
      const payload = {
        key:'name',
        value: updatedItem.name,
        id: selectedRecord.id
      }
      const updatedRecord = {
        ...selectedRecord,
        name: updatedItem.name
      }
      setState(updatedRecord)
      mutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = mutation;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{state.name}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editableName"
       initialValues={selectedRecord}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
            <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please input a valid service name' }]}
            >
                <Input  disabled={isEditing} placeholder="Benjamins On Franklin Bar" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item style={{ width:'100%'}}>
                <Space >
                    <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                        Cancel
                    </Button>
                    <Button shape="round" loading={isEditing} type="link" size="small"  htmlType="submit" >
                        Apply changes
                    </Button>
                </Space>
                          
            </Form.Item>
          </Col>
        </Row>
             
      </Form>
    )
    return(
      <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Name</Text>
      {isEditMode?editable:readOnly}
      </div>
    )
  }
  export function EditableAddress({selectedRecord}:EditableProp){
  
    const [state, setState] = useState(selectedRecord.street)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }

  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{state}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    return(
      <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Address</Text>
        {isEditMode
        ?<AddressField currentFieldValue={state} updateState={setState} toggleEdit={toggleEdit} selectedRecord={selectedRecord}/>
        :readOnly
        }
      </div>
    )
  }

  interface AddressFieldProp{
    selectedRecord: Service
    toggleEdit: ()=>void,
    updateState: (value:any)=>void
    currentFieldValue: string
  }
  function AddressField({selectedRecord, currentFieldValue, toggleEdit,updateState}:AddressFieldProp){
  
    // const [isEditMode, setIsEditMode] = useState(false)
    const antInputRef = useRef();
    const [fullAddress, setFullAddress] = useState({
      latitude:0,
      longitude:0,
      state: '',
      country:'',
      city:'',
      street:'',
      postalCode: ''
  })

  const queryClient = useQueryClient()

  const urlPrefix = useUrlPrefix()
  
   const {paseto} = useAuthContext()

  
    const [form]  = Form.useForm()
  
    const extractFullAddress = (place:any)=>{
      const addressComponents = place.address_components 
          let addressObj = {
              state:'',
              country:'',
              city:'',
              postalCode: '',
              latitude:place.geometry.location.lat(),
              longitude:place.geometry.location.lng()
          };
          addressComponents.forEach((address:any)=>{
              const type = address.types[0]
              if(type==='country') addressObj.country = address.long_name
              if(type === 'locality') addressObj.state = address.short_name
              if(type === 'postal_code') addressObj.postalCode = address.short_name
              if(type === 'administrative_area_level_1') addressObj.city = address.short_name
          })
  
          return addressObj
  }

  const { ref: antRef } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_MAPS_AUTOCOMPLETE_API,  // move this key to env
    options:{
        componentRestrictions:{country:'us'},
        types: ['address'],
        fields: ['address_components','geometry','formatted_address','name']
    },
    onPlaceSelected: (place) => {
        // console.log(antInputRef.current.input)
        form.setFieldValue('street',place?.formatted_address)

        console.log(place)  
        
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

  const mutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/services`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }

  const mutation = useMutation({
    mutationKey:['address'],
    mutationFn: mutationHandler,
    onSuccess:()=>{
      toggleEdit()
    },
    onSettled:(data)=>{
      updateState(data.data[0].street)
      queryClient.invalidateQueries(['services'])
    }
  })

  function onFinish(updatedItem:any){
  
    

    const payload = { 
      //@ts-ignore
      id: selectedRecord.id,
      // name: selectedRecord.name,
      address: 'yes',
      street:fullAddress.street,
      city: fullAddress.city,
      country: fullAddress.country,
      state: fullAddress.state,
      zipCode: fullAddress.postalCode
    }
    // setState(updatedRecord)
    mutation.mutate(payload)
  }

  const {isLoading:isEditing} = mutation 

  
    return(
      <Form
       style={{ marginTop:'.5rem' }}
       name="editableAddress"
       initialValues={{street:currentFieldValue}}
       onFinish={onFinish}
       form={form}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
          <Form.Item 
              name="street"
              rules={[{ required: true, message: 'Please input a valid address!' }]}
          >
             <Input allowClear  ref={(c) => {
                  // @ts-ignore
                  antInputRef.current = c;
              
                  // @ts-ignore
                  if (c) antRef.current = c.input;
                  }} 
                  placeholder="Syracuse, United states" 
              />
          </Form.Item>
  
          </Col>
          <Col span={4}>
            <Form.Item style={{ width:'100%'}}>
                <Space >
                    <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                        Cancel
                    </Button>
                    <Button shape="round" loading={isEditing} type="link" size="small"  htmlType="submit" >
                        Apply changes
                    </Button>
                </Space>
                          
            </Form.Item>
          </Col>
        </Row>
             
      </Form>
    )
  }

  export function EditablePhone({selectedRecord}:EditableProp){
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    const queryClient = useQueryClient()

    const urlPrefix = useUrlPrefix()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const readOnly = (
        <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <Text>{selectedRecord.contactNumber}</Text>
          <Button type="link" onClick={toggleEdit}>Edit</Button>
        </div>
    )
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/services`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationKey:['contactNumber'],
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:()=>{
        queryClient.invalidateQueries(['services'])
      }
    })
  
    function onFinish(field:any){
      const payload = {
        key:'contact_number',
        value: field.contactNumber,
        id: selectedRecord.id
      }
      console.log(payload)
      mutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = mutation 
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editableContactNumber"
       initialValues={selectedRecord}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16}>
            <Form.Item
                name="contactNumber"
                rules={[{ required: true, message: 'Please input a valid phone number' }]}
            >
                <Input disabled={isEditing} placeholder="09023234857" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item style={{ width:'100%'}}>
                <Space >
                    <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                        Cancel
                    </Button>
                    <Button shape="round" loading={isEditing} type="link" size="small"  htmlType="submit" >
                        Apply changes
                    </Button>
                </Space>
                          
            </Form.Item>
          </Col>
        </Row>
             
      </Form>
    )
    return(
      <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Contact number</Text>
        {isEditMode?editable:readOnly}
      </div>
    )
  }
  
  export function EditableCurrency({selectedRecord}:EditableProp){
  
    const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const urlPrefix = useUrlPrefix()
   
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/services`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationKey:['currency'],
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      }
    })
  
    function onFinish(updatedItem:Service){
      const payload = {
        key:'currency',
        value: updatedItem.currency,
        id: selectedRecord.id
      }
      const updatedRecord = {
        ...selectedRecord,
        currency: updatedItem.currency
      }
      setState(updatedRecord)
      mutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = mutation ;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{state.currency}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editableCurrency"
       initialValues={selectedRecord}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
            <Form.Item
                name="currency"
                rules={[{ required: true, message: 'Please input a valid accountNo' }]}
            >
                <Input  disabled={isEditing} placeholder="USD" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item style={{ width:'100%'}}>
                <Space >
                    <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                        Cancel
                    </Button>
                    <Button shape="round" loading={isEditing} type="link" size="small"  htmlType="submit" >
                        Apply changes
                    </Button>
                </Space>
                          
            </Form.Item>
          </Col>
        </Row>
             
      </Form>
    )
    return(
      <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Currency</Text>
      {isEditMode?editable:readOnly}
      </div>
    )
  }
  
  export function EditableLogoImage({selectedRecord}:EditableProp){
  
    const [isEditMode, setIsEditMode] = useState(false)
    const [isHashingImage, setIsHashingImage] = useState(false)
    const [updatedLogoImageHash, setUpdatedLogoImageHash] = useState(selectedRecord.logoImageHash)
  

    const urlPrefix = useUrlPrefix()
  
    const {paseto} = useAuthContext()

    const queryClient = useQueryClient()


    const dummyRequest = ({ onSuccess}:{onSuccess:any}) => {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    };
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const readOnly = (
        <div style={{width:'100%', marginTop:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <Image style={{width:'170px', height:'170px', border:'1px solid #f2f2f2', borderRadius:'50%'}} alt='Logo image for organization' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${updatedLogoImageHash}`}/>
          <Button type="link" onClick={toggleEdit}>Edit</Button>
        </div>
    )
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/services`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationKey:['logoImage'],
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:(data)=>{
        setUpdatedLogoImageHash(data.data[0].logoImageHash)
        queryClient.invalidateQueries(['services'])
      }
    })
  
    async function onFinish(field:any){
  
      // hash it first
      const logoRes = await field.logoImage
  
      setIsHashingImage(true)
      const logoHash = await asyncStore(logoRes[0].originFileObj)
      setIsHashingImage(false)
  
      console.log(logoHash)
  
      const payload = {
        key:'logo_image_hash',
        value: logoHash,
        id: selectedRecord.id
      }
      mutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = mutation
  
    const extractLogoImage = async(e: any) => {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
      return e;
      }
  
     return e?.fileList;
  };
  
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="EditablelogoImage"
       initialValues={selectedRecord}
       onFinish={onFinish}
       >
  
        <Row>
          <Col span={10}>
            <Form.Item
                name="logoImage"
                valuePropName="logoImage"
                getValueFromEvent={extractLogoImage}
                rules={[{ required: true, message: 'Please input a valid zip code' }]}
            >
                
                <Upload beforeUpload={()=>false} name="logoImageHash" listType="picture" multiple={false}>
                     <Button size='small' disabled={isHashingImage} type='link'>Upload logo image</Button>
                </Upload>
            </Form.Item> 
          </Col>
          <Col span={4}>
            <Form.Item style={{ width:'100%'}}>
                <Space >
                    <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                        Cancel
                    </Button>
                    <Button shape="round" loading={isEditing||isHashingImage} type="link" size="small"  htmlType="submit" >
                        Apply changes
                    </Button>
                </Space>
                          
            </Form.Item>
          </Col>
        </Row>
             
      </Form>
    )
  
    return(
      <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Logo</Text>
        {isEditMode?editable:readOnly}
      </div>
    )
  }
  export function EditableCoverImage({selectedRecord}:EditableProp){
  
    const [isEditMode, setIsEditMode] = useState(false)
    const [isHashingImage, setIsHashingImage] = useState(false)
    const [updatedCoverImageHash, setUpdatedCoverImageHash] = useState(selectedRecord.logoImageHash)
  
    const queryClient = useQueryClient()

    const urlPrefix = useUrlPrefix()
  
    const {paseto} = useAuthContext()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const readOnly = (
        <div style={{width:'100%', marginTop:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <Image style={{width:'500px', height:'200px', objectFit:'cover', border:'1px solid #f2f2f2'}} alt='cover image for organization' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${updatedCoverImageHash}`}/>
          <Button type="link" onClick={toggleEdit}>Edit</Button>
        </div>
    )
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/services`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationKey:['logoImage'],
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      }
    })
  
    async function onFinish(field:any){
  
      // hash it first
      const coverImageRes = await field.coverImage
  
      setIsHashingImage(true)
      const coverImageHash = await asyncStore(coverImageRes[0].originFileObj)
      setIsHashingImage(false)
  
      console.log(coverImageHash)
  
      const payload = {
        key:'cover_image_hash',
        value: coverImageHash,
        orgId: selectedRecord.id
      }
      setUpdatedCoverImageHash(coverImageHash)
      mutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = mutation
  
    const extractCoverImage = async(e: any) => {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
      return e;
      }
  
     return e?.fileList;
  };
  
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editableCoverImage"
       initialValues={selectedRecord}
       onFinish={onFinish}
       >
        <Row>
          <Col span={10}>
            <Form.Item
                name="coverImage"
                valuePropName="coverImage"
                getValueFromEvent={extractCoverImage}
                rules={[{ required: true, message: 'Please input a valid zip code' }]}
            >
                
                <Upload name="coverImageHash" listType="picture" multiple={false}>
                     <Button size='small' disabled={isHashingImage} type='link'>Upload cover image</Button>
                </Upload>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item style={{ width:'100%'}}>
                <Space >
                    <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                        Cancel
                    </Button>
                    <Button shape="round" loading={isEditing||isHashingImage} type="link" size="small"  htmlType="submit" >
                        Apply changes
                    </Button>
                </Space>
                          
            </Form.Item>
          </Col>
        </Row>
             
      </Form>
    )
    return(
      <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Cover Image</Text>
        {isEditMode?editable:readOnly}
      </div>
    )
  }
  