import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button, Col, Form, Typography, Image as AntImage, Input, Row, Space, Upload } from "antd"
const {TextArea} = Input
const {Text} = Typography
import axios from "axios"
import { useState } from "react"
import { useAuthContext } from "../../../context/AuthContext"
import useUrlPrefix from "../../../hooks/useUrlPrefix"
import { ServiceItem } from "../../../types/Services"
import {SelectOutlined} from "@ant-design/icons"
import { ArtworkPicker } from "../Artwork"
import Image from 'next/image'

const {Title} = Typography

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
      console.log(updatedItem)
      const payload = {
        name: updatedItem.name,
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
  
    const [state, setState] = useState(selectedRecord.price)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()

    const queryClient = useQueryClient()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
   const transformedRecord = {
    ...selectedRecord,
    price: Number(selectedRecord.price)/100
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
      mutationKey:['price'],
      mutationFn: recordMutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:(data)=>{
        setState(data.data[0].price)
        queryClient.invalidateQueries(['service-items'])
      }
    })
  
    function onFinish(updatedItem:any){
      const payload = {
        // key:'price',
        price: Number(updatedItem.price*100),
        id: selectedRecord.id
      }
      recordMutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = recordMutation ;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>${state/100}</Text> 
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editablePrice"
       initialValues={{price: state/100}}
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
        // key:'tickets_per_day',
        ticketsPerDay: Number(updatedItem.ticketsPerDay),
        id: selectedRecord.id
      }
      console.log(payload)

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
        // key:'description',
        description: updatedItem.description,
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
    const [updatedCoverImageHash, setUpdatedCoverImageHash] = useState(selectedRecord.logoImageHash)
    const [artwork, setArtwork] = useState(selectedRecord.logoImageHash)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const {paseto} = useAuthContext()

    const serviceItemTypeName = selectedRecord?.serviceItemType?.name
    const urlPrefix = useUrlPrefix()

    const queryClient = useQueryClient()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
    
    function toggleDrawer(){
      setIsDrawerOpen(!isDrawerOpen)
    }

    function handleSelectImage(imageHash:string){
      setArtwork(imageHash)
    }
   
  
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
      mutationKey:['logo_image'],
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:(data)=>{
        setUpdatedCoverImageHash(data.data[0].logoImageHash)
        queryClient.invalidateQueries(['serviceItems'])
      }
    })

  
    async function onFinish(){
    
  
      const payload = {
        // key:'logo_image_hash',
        logoImageHash: artwork,
        id: selectedRecord.id
      }
      // setUpdatedCoverImageHash(coverImageHash)
      mutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = mutation
  
  
    const editable = ( 
      <div
       style={{ marginTop:'.5rem' }}
       >
        <Row>
          <Col span={10}>
           <Image alt='Artwork preview' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${artwork}`} height='300px' width='300px'/>
           <Button shape='round' icon={<SelectOutlined rev={undefined} />} style={{ marginTop:'.5rem'}} onClick={toggleDrawer}>Select a different artwork</Button>
            <ArtworkPicker
              currentServiceItemType={serviceItemTypeName}
              isOpen ={isDrawerOpen}
              onToggleDrawer = {toggleDrawer}
              onSelectImage = {handleSelectImage}
              currentSelectedArtwork = {artwork}
            />
          </Col>
          <Col span={4}>

                <Space >
                    <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                        Cancel
                    </Button>
                    <Button shape="round" loading={isEditing} disabled={artwork === ''} onClick={onFinish}  type="link" size="small"  htmlType="submit" >
                        Apply changes
                    </Button>
                </Space>
                          
          </Col>
        </Row>
             
      </div>
    )

    const readOnly = (
      <div style={{width:'100%', marginTop:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <AntImage style={{width:'300px', height:'300px', objectFit:'cover', border:'1px solid #f2f2f2'}} alt='cover image for serviceItem' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${updatedCoverImageHash}`}/>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
    )

    return(
      <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Artwork</Text>
        {isEditMode?editable:readOnly}
      </div>
    )
  }

  export function EditableCharge({selectedRecord}:EditableProp){
  
  const [state, setState] = useState(selectedRecord.platformFee)

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
    mutationKey:['platformFee'],
    mutationFn: recordMutationHandler,
    onSuccess:()=>{
      toggleEdit()
    },
    onSettled:(data)=>{
      setState(data.data.platformFee)
      queryClient.invalidateQueries(['service-items'])
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      platformFee: String(updatedItem.platformFee),
      id: selectedRecord.id
    }
    recordMutation.mutate(payload)
  }

  const {isLoading:isEditing} = recordMutation ;

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{state}%</Text> 
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableCharge"
     initialValues={{platformFee: selectedRecord?.platformFee}}
     onFinish={onFinish}
     >
      <Row>
        <Col span={10} style={{height:'100%'}}>
          <Form.Item
              name="platformFee"
              rules={[{ required: true, message: 'Please input a valid platform fee' }]}
          >
              <Input suffix='%'  disabled={isEditing} />
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
      <Title level={2} style={{ marginBottom:'.2rem', marginRight: '2rem',}}>Platform fee</Title>
      <Text style={{width:'75%', marginBottom:'2rem'}} type="secondary">This is the amount to charge for any ticket purchase on the marketplace</Text>  
        <div style={{ background:'#f5f5f5', padding:'1rem', width:'70%', borderRadius:'1rem'}}>
          {isEditMode?editable:readOnly} 
        </div>
    </div>
  )
}
  