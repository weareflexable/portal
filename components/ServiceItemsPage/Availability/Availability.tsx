import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Form, Row, Col, Input, InputNumber, Space, DatePicker, Typography, Skeleton } from "antd"
const {Text, Title} = Typography
import axios from "axios"
import { useState } from "react"
import { useAuthContext } from "../../../context/AuthContext"
import {PlusCircleOutlined, DeleteOutlined} from "@ant-design/icons"
import { CustomDate, ServiceItem } from "../../../types/Services"
import dayjs from 'dayjs'

interface Props{
    selectedServiceItem: ServiceItem
}
export default function Availability({selectedServiceItem}:Props){
    const {paseto} = useAuthContext()

  
    async function fetchItemAvailability(){
      const res = await axios.get(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/service-items/availability?key=service_item_id&value=${selectedServiceItem.id}&pageNumber=0&pageSize=10`,{
       headers:{
         "Authorization":paseto
       }
     })
     return res.data.data
     }
     
     const {data, isLoading} = useQuery({queryKey:['availability',selectedServiceItem.id], queryFn:fetchItemAvailability})
     
     const availabilityData = data && data

    return(
        <div>
            {isLoading 
            ? <Skeleton active />
            : availabilityData.map((availability:CustomDate)=>(
                 <EditAvailability key={availability.name}  availability={availability}/>
            ))}
            <NewAvailability selectedServiceItem={selectedServiceItem} availabilities={availabilityData}/>
        </div>
    )
}


interface EditAvailabilityProp{
    availability: CustomDate
}

export function EditAvailability({availability}:EditAvailabilityProp){
  
    // const [state, setState] = useState()
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    const queryClient = useQueryClient()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
   
  
    const recordMutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/service-items`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const recordMutation = useMutation({
      mutationKey:['availability'],
      mutationFn: recordMutationHandler,
      onSuccess:()=>{
        toggleEdit()
      }
    })
  
    function onFinish(updatedItem:any){
    //   const payload = {
    //     key:'availability',
    //     value: updatedItem.name,
    //     id: selectedRecord.id
    //   }
    //   const updatedRecord = {
    //     ...selectedRecord,
    //     name: updatedItem.name
    //   }
    //   setState(updatedRecord)
    //   recordMutation.mutate(payload)
      // We might need optimistic updates here
    }
  
    const {isLoading:isEditing} = recordMutation ;
  
    const readOnly = (
        <div  style={{width:'100%', padding:'1rem', borderRadius:'4px', background:'#f6f6f6',  display:'flex', flexDirection:'column'}}>
        <Row>
            <Col span={14}>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <div style={{width:"100%", display:'flex', marginBottom:'.2rem',alignItems:'baseline', marginTop:'.2rem'}}>
                        <Title level={5}>{availability.name}</Title>
                        <Text style={{marginLeft:'.3rem'}} type="secondary">{dayjs(availability.date).format('MMM DD, YYYY')}</Text>
                    </div>
                    <div style={{width:"100%", display:'flex', marginBottom:'.2rem', marginTop:'.2rem'}}>
                    <Text>{availability.ticketsPerDay}</Text>
                    <Text style={{marginLeft:'.3rem'}} type="secondary">Tickets per day</Text>
                    </div>
                </div>
            </Col>
            <Col span={9}>
                <div style={{width:"100%", display:'flex', marginBottom:'.2rem', marginTop:'.2rem'}}>
                    <Text>${availability.price} </Text>
                    {/* <Text style={{marginLeft:'.3rem'}} type="secondary">Per ticket</Text> */}
                </div>
            </Col>
            <Col span={1}>
                <Button type="text" icon={<DeleteOutlined/>}/>
            </Col>
        </Row>
      </div>  
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       layout='vertical'
       name="editableName"
       initialValues={availability}
       onFinish={onFinish}
       >
        <Form.Item
            rules={[{ required: true, message: 'Please provide a label' }]}
            name={'name'}
            label="Label"
            style={{width:'100%'}}
        >
            <Input placeholder='label: Thanks giving' />
        </Form.Item>
        <Row>
          <Col span={11} style={{height:'100%'}}>
            <Form.Item
                name={'price'}
                label='Price'
                style={{width:'100%'}}
                rules={[{ required: true, message: 'Please input a valid price!' }]}
            >
                <InputNumber style={{width:'100%'}} prefix="$" placeholder="0.00" /> 
            </Form.Item> 
          </Col>
        <Col offset={1} span={11}>
            <Form.Item
                name={'ticketsPerDay'}
                label='Tickets per day'
                style={{width:'100%'}}
                rules={[{ required: true, message: 'Please input a valid number!' }]}
                >
                <InputNumber style={{width:'100%'}} placeholder="20" />
            </Form.Item>
        </Col>
        </Row>

        <Row>
            <Col span={11}>
        <Form.Item
            rules={[{ required: true, message: 'Please select a date!' }]}
            name={'date'}
            label="Date"
            style={{width:'100%'}}
        >
            <DatePicker style={{width:'100%'}} />
        </Form.Item>
            </Col>
        </Row>

        
          {/* </Col> */}
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
        {/* </Row> */}
             
      </Form>
    )
    return(
      <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
      {isEditMode?editable:readOnly}
      </div>
    )
  }

interface NewAvailabilityProps{
availabilities: CustomDate[] // TODO: Find a better name to distinguish between availability array and it's items
selectedServiceItem: ServiceItem
}
export function NewAvailability({availabilities, selectedServiceItem}:NewAvailabilityProps){
  
    // const [state, setState] = useState(
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    const queryClient = useQueryClient()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
   
  
    const recordMutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.put(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/service-items/availability`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const recordMutation = useMutation({
      mutationKey:['availability'],
      mutationFn: recordMutationHandler,
      onSuccess:()=>{
        toggleEdit()
      }
    })
  
    function onFinish(updatedItem:CustomDate){
        // Object coming from table has to be pre-formatted to conform with the structure and type
        // of the request payload.
        const transformedItem = {
            date: dayjs(updatedItem.date).format('MMM DD, YYYY'),
            name: updatedItem.name,
            price: String(updatedItem.price),
            ticketsPerDay: String(updatedItem.ticketsPerDay)
        }
        
        // Combine previous availabilities with new (transformedItem) into a single array and pass
        // in req body
        const availabilityPayload = [
            ...availabilities,
            transformedItem
        ]
        const payload = {
            serviceItemId: selectedServiceItem.id,
            availability: availabilityPayload
        }
        console.log(payload)
      
    //   const updatedRecord = {
    //     ...selectedRecord,
    //     name: updatedItem.name
    //   }
    //   setState(updatedRecord)
    //   recordMutation.mutate(payload)
      // We might need optimistic updates here
    }
  
    const {isLoading:isEditing} = recordMutation ;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', marginTop:'1rem', alignItems:'center'}}>
        <Button icon={<PlusCircleOutlined />} style={{display:'flex',alignItems:'center'}} type="link" onClick={toggleEdit}>Add custom availability</Button>
      </div>
  )
  
    const editable = (
        <div style={{marginTop:'2rem'}}>
            <Title style={{marginBottom:'1rem'}} level={5}> New availability</Title>
            <Form
            style={{ marginTop:'.5rem' }}
            layout='vertical'
            name="editableName"
            //    initialValues={selectedRecord}
            onFinish={onFinish}
            >
                <Form.Item
                    rules={[{ required: true, message: 'Please provide a label' }]}
                    name={'name'}
                    label="Label"
                    style={{width:'100%'}}
                >
                    <Input placeholder='label: Thanks giving' />
                </Form.Item>
                <Row>
                <Col span={11} style={{height:'100%'}}>
                    <Form.Item
                        name={'price'}
                        label='Price'
                        style={{width:'100%'}}
                        rules={[{ required: true, message: 'Please input a valid price!' }]}
                    >
                        <InputNumber style={{width:'100%'}} prefix="$" placeholder="0.00" /> 
                    </Form.Item> 
                </Col>
                <Col offset={1} span={11}>
                    <Form.Item
                        name={'ticketsPerDay'}
                        label='Tickets per day'
                        style={{width:'100%'}}
                        rules={[{ required: true, message: 'Please input a valid number!' }]}
                        >
                        <InputNumber style={{width:'100%'}} placeholder="20" />
                    </Form.Item>
                </Col>
                </Row>

                <Row>
                    <Col span={11}>
                <Form.Item
                    rules={[{ required: true, message: 'Please select a date!' }]}
                    name={'date'}
                    label="Date"
                    style={{width:'100%'}}
                >
                    <DatePicker style={{width:'100%'}} />
                </Form.Item>
                    </Col>
                </Row>

                
                {/* </Col> */}
                <Col span={4}>
                    <Form.Item style={{ width:'100%'}}>
                        <Space >
                            <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                                Cancel
                            </Button>
                            <Button shape="round" loading={isEditing} type="link" size="small"  htmlType="submit" >
                                Create availability
                            </Button>
                        </Space>           
                    </Form.Item>
                </Col>
                {/* </Row> */}
                    
            </Form>
        </div>
    )
    return(
      <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
      {isEditMode?editable:readOnly}
      </div>
    )
  }

