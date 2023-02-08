import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Form, Row, Col, Input, InputNumber, Space, DatePicker, Typography, Skeleton } from "antd"
const {Text, Title} = Typography
import axios from "axios"
import { useState } from "react"
import { useAuthContext } from "../../../context/AuthContext"
import {PlusCircleOutlined, DeleteOutlined,EditOutlined} from "@ant-design/icons"
import { Availability, CustomDate, ServiceItem } from "../../../types/Services"
import dayjs from 'dayjs'
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

interface Props{
    selectedServiceItem: ServiceItem
}
export default function AvailabilitySection({selectedServiceItem}:Props){
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
     console.log(data)
     const availabilityData = data && data[0].availability;

     const isAvailabilityEmpty = data && data[0].availability.length == 0

     console.log(availabilityData)


    return(
        <div>
            {isLoading 
            ? <Skeleton active />
            : isAvailabilityEmpty? null
            : availabilityData.map((availability:CustomDate)=>(
                 <EditableAvailability selectedServiceItem={selectedServiceItem} key={availability.name}  availability={availability}/>
            ))}
            <NewAvailability selectedServiceItem={selectedServiceItem} availabilities={availabilityData}/>
        </div>
    )
}


interface EditAvailabilityProp{
    availability: CustomDate,
    selectedServiceItem: ServiceItem
}

export function EditableAvailability({availability, selectedServiceItem}:EditAvailabilityProp){
  
    // const [state, setState] = useState()
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    const queryClient = useQueryClient()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
   
  
    const editMutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/service-items`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const editMutation = useMutation({
      mutationKey:['availability',selectedServiceItem.id],
      mutationFn: editMutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['availability',selectedServiceItem.id]})
      }
    })

    const deleteMutationHandler = async(item:any)=>{
      const {data} = await axios({
        method:'delete',
        url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/service-items/availability`,
        data:{id:item.id},
        headers:{
            //@ts-ignore
            "Authorization": paseto    
      }
    })
        return data;
    }
    const deleteMutation = useMutation({
      mutationKey:['availability',selectedServiceItem.id],
      mutationFn: deleteMutationHandler,
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['availability',selectedServiceItem.id]})
      }
    })

    function deleteAvailability(item:CustomDate){
        deleteMutation.mutate(item)
    }
  
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
    //   editMutation.mutate(payload)
      // We might need optimistic updates here
    }
  
    const {isLoading:isEditing} = editMutation ;
  
    const readOnly = (
        <div  style={{width:'100%', padding:'1rem', borderRadius:'4px', marginBottom:'.5rem', background:'#f6f6f6',  display:'flex', flexDirection:'column'}}>
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
                <Button type="text" onClick={toggleEdit} icon={<EditOutlined />}/>
                <Button type="text" danger onClick={()=>deleteAvailability(availability)} icon={<DeleteOutlined/>}/>
            </Col>
        </Row>
      </div>  
    )

    // Date field was particularly transforemd in order to be accepted by date picker
    // as it only accepts dayjs formats.
    const transformedAvailability={
      ...availability,
      date: dayjs(availability.date)
    }
  
    const editable = (
      <div style={{padding:'1rem', marginBottom:'1rem', marginTop:'1rem', border:'1px solid #e1e1e1', borderRadius:'4px'}} >
          <Title style={{marginBottom:'1rem'}} level={5}> Edit availability</Title>
          <Form
          style={{ marginTop:'.5rem' }}
          layout='vertical'
          name="editableName"
          initialValues={transformedAvailability}
          onFinish={onFinish}
          >
              <Form.Item
                  rules={[{ required: true, message: 'Please provide a label' }]}
                  name={'name'}
                  // label="Label"
                  style={{width:'100%'}}
              >
                  <Input placeholder='Label(optional): Thanks giving' />
              </Form.Item>
              <Row>
              <Col span={11} style={{height:'100%'}}>
                  <Form.Item
                      name={'price'}
                      // label='Price'
                      style={{width:'100%'}}
                      rules={[{ required: true, message: 'Please input a valid price!' }]}
                  >
                      <Input style={{width:'100%'}} suffix='Per ticket' prefix="$" placeholder="0.00" /> 
                  </Form.Item> 
              </Col>
              <Col offset={1} span={12}>
                  <Form.Item
                      name={'ticketsPerDay'}
                      // label='Tickets per day'
                      style={{width:'100%'}}
                      rules={[{ required: true, message: 'Please input a valid number!' }]}
                      >
                      <Input style={{width:'100%'}} suffix='Tickets per day' placeholder="20" />
                  </Form.Item>
              </Col>
              </Row>

              <Row>
                  <Col span={11}>
              <Form.Item
                  rules={[{ required: true, message: 'Please select a date!' }]}
                  name={'date'}
                  // label="Date"
                  style={{width:'100%'}}
              >
                  <DatePicker format={'MMM DD, YYYY'} style={{width:'100%'}} />
              </Form.Item>
                  </Col>
              </Row>

              
              {/* </Col> */}
              <Col span={4}>
                  <Form.Item style={{ marginBottom:'0', width:'100%'}}>
                      <Space >
                          <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                              Cancel
                          </Button>
                          <Button shape="round" loading={isEditing} type="primary"  htmlType="submit" >
                              Apply changes
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
  
    const createMutaionHandler = async(updatedItem:any)=>{
      const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/service-items/availability`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const createMutation = useMutation({
      mutationKey:['availability',selectedServiceItem.id],
      mutationFn: createMutaionHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['availability',selectedServiceItem.id]})
        // queryClient.refetchQueries({queryKey:['availabililty',selectedServiceItem.id]})
      }
    })
  
    function onFinish(updatedItem:CustomDate){
        // Object coming from table has to be pre-formatted to conform with the structure and type
        // of the request payload.
        const transformedItem = {
            //@ts-ignore
            date: dayjs.utc(updatedItem.date).format(), // provide it in utc
            name: updatedItem.name,
            price: String(updatedItem.price),
            ticketsPerDay: String(updatedItem.ticketsPerDay)
        }
        
        // Combine previous availabilities with new (transformedItem) into a single array and pass
        // in req body
        const payload = {
            serviceItemId: selectedServiceItem.id,
            availability: [transformedItem]
        }
        console.log(payload)
      
    //   const updatedRecord = {
    //     ...selectedRecord,
    //     name: updatedItem.name
    //   }
    //   setState(updatedRecord)
      createMutation.mutate(payload)
      // We might need optimistic updates here
    }
  
    const {isLoading:isEditing} = createMutation ;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', marginTop:'1rem', alignItems:'center'}}>
        <Button icon={<PlusCircleOutlined />} style={{display:'flex',alignItems:'center'}} type="link" onClick={toggleEdit}>Add custom availability</Button>
      </div>
  )
  
    const editable = (
        <div style={{padding:'1rem', marginBottom:'1rem', marginTop:'1rem', border:'1px solid #e1e1e1', borderRadius:'4px'}} >
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
                    // label="Label"
                    style={{width:'100%'}}
                >
                    <Input placeholder='Label(optional): Thanks giving' />
                </Form.Item>
                <Row>
                <Col span={11} style={{height:'100%'}}>
                    <Form.Item
                        name={'price'}
                        // label='Price'
                        style={{width:'100%'}}
                        rules={[{ required: true, message: 'Please input a valid price!' }]}
                    >
                        <Input style={{width:'100%'}} suffix='Per ticket' prefix="$" placeholder="0.00" /> 
                    </Form.Item> 
                </Col>
                <Col offset={1} span={12}>
                    <Form.Item
                        name={'ticketsPerDay'}
                        // label='Tickets per day'
                        style={{width:'100%'}}
                        rules={[{ required: true, message: 'Please input a valid number!' }]}
                        >
                        <Input style={{width:'100%'}} suffix='Tickets per day' placeholder="20" />
                    </Form.Item>
                </Col>
                </Row>

                <Row>
                    <Col span={11}>
                <Form.Item
                    rules={[{ required: true, message: 'Please select a date!' }]}
                    name={'date'}
                    // label="Date"
                    style={{width:'100%'}}
                >
                    <DatePicker style={{width:'100%'}} />
                </Form.Item>
                    </Col>
                </Row>

                
                {/* </Col> */}
                <Col span={4}>
                    <Form.Item style={{ marginBottom:'0', width:'100%'}}>
                        <Space >
                            <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                                Cancel
                            </Button>
                            <Button shape="round" loading={isEditing} type="primary"  htmlType="submit" >
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

