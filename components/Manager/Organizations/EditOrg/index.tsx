import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button, Form, Row, Col, Image, Input,  Space, Upload, Typography } from "antd"
import axios from "axios"
const {Text} = Typography;
import { useRef, useState } from "react"
import { usePlacesWidget } from "react-google-autocomplete"
import { useAuthContext } from "../../../../context/AuthContext"
import { NewOrg } from "../../../../types/OrganisationTypes"
import { asyncStore } from "../../../../utils/nftStorage"

interface EditableProp{
    selectedOrg: NewOrg
  }

  export function EditableName({selectedOrg}:EditableProp){
  
    const [state, setState] = useState(selectedOrg)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    const queryClient = useQueryClient()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
   
  
    const nameMutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const nameMutation = useMutation({
      mutationKey:['name'],
      mutationFn: nameMutationHandler,
      onSuccess:()=>{
        toggleEdit()
      }
    })
  
    function onFinish(updatedItem:any){
      const payload = {
        key:'name',
        value: updatedItem.name,
        //@ts-ignore
        orgId: selectedOrg.orgId
      }
      const updatedOrg = {
        ...selectedOrg,
        name: updatedItem.name
      }
      setState(updatedOrg)
      nameMutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = nameMutation ;
  
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
       initialValues={selectedOrg}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
            <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please input a valid service name' }]}
            >
                <Input  disabled={isEditing} placeholder="Flexable org" />
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
  export function EditableAddress({selectedOrg}:EditableProp){
  
    const [state, setState] = useState(selectedOrg)
  
    const [isEditMode, setIsEditMode] = useState(false)
    const antInputRef = useRef();
    const [fullAddress, setFullAddress] = useState({
      latitude:0,
      longitude:0,
      state: '',
      country:'',
      city:''
  })
  
    const {paseto} = useAuthContext()
  
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const [form]  = Form.useForm()
  
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
      // apiKey: `AIzaSyB7ZUkMcIXpOKYU4r4iBMM9BFjCL5OpeeE`, // move this key to env
      onPlaceSelected: (place) => {
          // console.log(antInputRef.current.input)
          form.setFieldValue('address',place?.formatted_address)
          
          const fullAddress = extractFullAddress(place)
          setFullAddress(fullAddress)
  
          //@ts-ignore
        antInputRef.current.input.value = place?.formatted_address
  
      },
    });
  
  
    const nameMutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const nameMutation = useMutation({
      mutationKey:['address'],
      mutationFn: nameMutationHandler,
      onSuccess:()=>{
        toggleEdit()
      }
    })
  
    function onFinish(updatedItem:any){
      const payload = {
        key:'country',
        value: updatedItem.country,
        orgId: selectedOrg.id
      }
      const updatedOrg = {
        ...selectedOrg,
        name: updatedItem.country
      }
      setState(updatedOrg)
      nameMutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = nameMutation 
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{`${state.street}, ${state.country}, ${state.city}`}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editableAddress"
       initialValues={selectedOrg}
       onFinish={onFinish}
       form={form}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
          <Form.Item 
              name="address"
              rules={[{ required: true, message: 'Please input a valid address!' }]}
          >
              {/* <TextArea rows={3} placeholder='Apt. 235 30B NorthPointsettia Street, Syracuse'/> */}
              <Input ref={(c) => {
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
    return(
      <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Address</Text>
      {isEditMode?editable:readOnly}
      </div>
    )
  }
  export function EditablePhone({selectedOrg}:EditableProp){
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    const queryClient = useQueryClient()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const readOnly = (
        <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <Text>{selectedOrg.phone}</Text>
          <Button type="link" onClick={toggleEdit}>Edit</Button>
        </div>
    )
  
    const nameMutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const nameMutation = useMutation({
      mutationKey:['phone'],
      mutationFn: nameMutationHandler,
      onSuccess:()=>{
        toggleEdit()
        queryClient.invalidateQueries(['organizations'])
      }
    })
  
    function onFinish(field:any){
      const payload = {
        key:'phone',
        value: field.phone,
        orgId: selectedOrg.id
      }
      console.log(payload)
      nameMutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = nameMutation 
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editablePhone"
       initialValues={selectedOrg}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16}>
            <Form.Item
                name="phone"
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
        <Text type="secondary" style={{ marginRight: '2rem',}}>Phone</Text>
        {isEditMode?editable:readOnly}
      </div>
    )
  }
  export function EditableZipCode({selectedOrg}:EditableProp){
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const queryClient = useQueryClient()
  
    const {paseto} = useAuthContext()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const readOnly = (
        <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <Text>{selectedOrg.zipCode}</Text>
          <Button type="link" onClick={toggleEdit}>Edit</Button>
        </div>
    )
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationKey:['zipCode'],
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
        queryClient.invalidateQueries(['organizations'])
      }
    })
  
    function onFinish(field:any){
      const payload = {
        key:'zip_code',
        value: field.zipCode,
        orgId: selectedOrg.id
      }
      mutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = mutation
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editableZipCode"
       initialValues={selectedOrg}
       onFinish={onFinish}
       >
        <Row>
          <Col span={10}>
            <Form.Item
                name="zipCode"
                rules={[{ required: true, message: 'Please input a valid zip code' }]}
            >
                <Input disabled={isEditing} placeholder="937462" />
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
        <Text type="secondary" style={{ marginRight: '2rem',}}>Zip Code</Text>
        {isEditMode?editable:readOnly}
      </div>
    )
  }
  export function EditableLogoImage({selectedOrg}:EditableProp){
  
    const [isEditMode, setIsEditMode] = useState(false)
    const [isHashingImage, setIsHashingImage] = useState(false)
    const [updatedLogoImageHash, setUpdatedLogoImageHash] = useState(selectedOrg.logoImageHash)
  
    const queryClient = useQueryClient()
  
    const {paseto} = useAuthContext()
  
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
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,updatedItem,{
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
      const logoRes = await field.logoImage
  
      setIsHashingImage(true)
      const logoHash = await asyncStore(logoRes[0].originFileObj)
      setIsHashingImage(false)
  
      console.log(logoHash)
  
      const payload = {
        key:'logo_image_hash',
        value: logoHash,
        //@ts-ignore
        orgId: selectedOrg.orgId
      }
      setUpdatedLogoImageHash(logoHash)
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
       initialValues={selectedOrg}
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
                
                <Upload name="logoImageHash" listType="picture" multiple={false}>
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
  export function EditableCoverImage({selectedOrg}:EditableProp){
  
    const [isEditMode, setIsEditMode] = useState(false)
    const [isHashingImage, setIsHashingImage] = useState(false)
    const [updatedCoverImageHash, setUpdatedCoverImageHash] = useState(selectedOrg.logoImageHash)
  
    const queryClient = useQueryClient()
  
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
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,updatedItem,{
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
        orgId: selectedOrg.id
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
       initialValues={selectedOrg}
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
  