import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button, Col, Form, Typography, Image, Input, Row, Space, Upload } from "antd"
const {TextArea} = Input
const {Text} = Typography
import axios from "axios"
import { useState } from "react"
import { useAuthContext } from "../../../context/AuthContext"
import useUrlPrefix from "../../../hooks/useUrlPrefix"
import { ServiceItem } from "../../../types/Services"
import { asyncStore } from "../../../utils/nftStorage"

interface EditableProp{
    selectedRecord: ServiceItem
  } 
  
  export function EditableName({selectedRecord}:EditableProp){
  
    const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    const queryClient = useQueryClient()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
   const urlPrefix = useUrlPrefix()
  
    const recordMutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const recordMutation = useMutation({
      mutationKey:['name'],
      mutationFn: recordMutationHandler,
      onSuccess:()=>{
        toggleEdit()
      }
    })
  
    function onFinish(updatedItem:any){
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
      recordMutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = recordMutation ;
  
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
                <Input  disabled={isEditing} placeholder="Flexable serviceItem" />
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
        <Text type="secondary" style={{ marginRight: '2rem',}}>Title</Text>
      {isEditMode?editable:readOnly}
      </div>
    )
  }
  export function EditablePrice({selectedRecord}:EditableProp){
  
    const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
  //  const transformedRecord = {
  //   ...selectedRecord,
  //   price: Number(selectedRecord.price)/100
  //  }
   const urlPrefix = useUrlPrefix()
  
    const recordMutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const recordMutation = useMutation({
      mutationKey:['price'],
      mutationFn: recordMutationHandler,
      onSuccess:()=>{
        toggleEdit()
      }
    })
  
    function onFinish(updatedItem:any){
      const payload = {
        key:'price',
        value: updatedItem.price*100,
        id: selectedRecord.id
      }
      const updatedRecord = {
        ...selectedRecord,
        price: updatedItem.price
      }
      setState(updatedRecord)
      recordMutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = recordMutation ;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>${state.price/100}</Text> 
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editablePrice"
       initialValues={selectedRecord}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
            <Form.Item
                name="price"
                rules={[{ required: true, message: 'Please input a valid price' }]}
            >
                <Input  prefix="$" disabled={isEditing} />
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
        <Text type="secondary" style={{ marginRight: '2rem',}}>Price</Text>
      {isEditMode?editable:readOnly}
      </div>
    )
  }
  export function EditableTicketsPerDay({selectedRecord}:EditableProp){
  
    const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const urlPrefix = useUrlPrefix()
   
  
    const recordMutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const recordMutation = useMutation({
      mutationKey:['ticketsPerDay'],
      mutationFn: recordMutationHandler,
      onSuccess:()=>{
        toggleEdit()
      }
    })
  
    function onFinish(updatedItem:any){
      const payload = {
        key:'tickets_per_day',
        value: updatedItem.ticketsPerDay,
        id: selectedRecord.id
      }
      const updatedRecord = {
        ...selectedRecord,
        ticketsPerDay: updatedItem.ticketsPerDay
      }
      setState(updatedRecord)
      recordMutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = recordMutation ;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{state.ticketsPerDay}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editableTicketsPerDay"
       initialValues={selectedRecord}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
            <Form.Item
                name="ticketsPerDay"
                rules={[{ required: true, message: 'Please specify max number of tickets available for selected date' }]}
            >
                <Input  disabled={isEditing} />
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
      <div style={{width:'100%', display:'flex',  marginTop:'1rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Tickets Per Day</Text>
      {isEditMode?editable:readOnly}
      </div>
    )
  }
  
  export function EditableDescription({selectedRecord}:EditableProp){
  
    const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const [form]  = Form.useForm()

    const urlPrefix = useUrlPrefix()
  
    const recordMutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
  
    const recordMutation = useMutation({
      mutationKey:['description'],
      mutationFn: recordMutationHandler,
      onSuccess:()=>{
        toggleEdit()
      }
    })
  
    function onFinish(updatedItem:any){
      const payload = {
        key:'description',
        value: updatedItem.description,
        id: selectedRecord.id
      }
      const updatedRecord = {
        ...selectedRecord,
        description: updatedItem.description
      }
      setState(updatedRecord)
      recordMutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = recordMutation 
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{state.description}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editableDescription"
       initialValues={selectedRecord}
       onFinish={onFinish}
       form={form}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
          <Form.Item 
              name="description"
              rules={[{ required: true, message: 'Please input a description for service item!' }]}
          >
              <TextArea rows={3} placeholder='Description...'/>
  
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
        <Text type="secondary" style={{ marginRight: '2rem',}}>Description</Text>
      {isEditMode?editable:readOnly}
      </div>
    )
  }
  
  export function EditableCoverImage({selectedRecord}:EditableProp){
  
    const [isEditMode, setIsEditMode] = useState(false) 
    const [isHashingImage, setIsHashingImage] = useState(false)
    const [updatedCoverImageHash, setUpdatedCoverImageHash] = useState(selectedRecord.logoImageHash)
  
    const {paseto} = useAuthContext()

    const urlPrefix = useUrlPrefix()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const readOnly = (
        <div style={{width:'100%', marginTop:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <Image style={{width:'500px', height:'200px', objectFit:'cover', border:'1px solid #f2f2f2'}} alt='cover image for serviceItem' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${updatedCoverImageHash}`}/>
          <Button type="link" onClick={toggleEdit}>Edit</Button>
        </div>
    )
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items`,updatedItem,{
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
  
    async function onFinish(field:ServiceItem){
  
      // hash it first
      const coverImageRes = await field.logoImageHash
  
      setIsHashingImage(true)
      //@ts-ignore
      const coverImageHash = await asyncStore(coverImageRes[0].originFileObj)
      setIsHashingImage(false)
  
  
      const payload = {
        key:'logo_image_hash',
        value: coverImageHash,
        id: selectedRecord.id
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
                name="logoImageHash"
                valuePropName="logoImageHash"
                getValueFromEvent={extractCoverImage}
                rules={[{ required: true, message: 'Please upload card image for service item' }]}
            >
                
                <Upload name="logoImageHash" listType="picture" multiple={false}>
                     <Button size='small' disabled={isHashingImage} type='link'>Upload image</Button>
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
  