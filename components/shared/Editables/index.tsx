import { useQueryClient, useMutation } from "@tanstack/react-query"
import { Button, Form, Row, Col, Input, Space, Typography, Select, Radio } from "antd"
const {Text} = Typography
const {Option} = Select
import axios from "axios"
import { Service } from "nft.storage"
import { useRef, useState } from "react"
import { usePlacesWidget } from "react-google-autocomplete"
import { useAuthContext } from "../../../context/AuthContext"
import useUrlPrefix from "../../../hooks/useUrlPrefix"
const countryList = require('country-list')



interface EditableProps{
    id: string,
    currentFieldValue: string | undefined | number,
    fieldKey: string,
    fieldName: string
    title: string,
    options?:{queryKey:string,mutationUrl:string}
  }
  export function EditableText({id, options, title, fieldName, currentFieldValue, fieldKey}:EditableProps){
  
    // console.log(currentFieldValue)
    
    const [state, setState] = useState(currentFieldValue)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const urlPrefix = useUrlPrefix()
  
    const {paseto} = useAuthContext()
  
    const queryClient = useQueryClient()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
   
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/${options?.mutationUrl}`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:(data)=>{
        console.log(data)
        // update state here
        setState(data.data[0][fieldName])
        queryClient.invalidateQueries([options?.queryKey])
      }
    })
  
    function onFinish(formData:any){
      const payload = {
        // key:fieldKey, // pass in key
        fieldKey: formData[fieldName], // pass in value
        id: id, // pass in id,
      }
  
      mutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = mutation;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text style={{textTransform:'capitalize'}}>{state}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button> 
      </div>
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="beneficiaryName"
       initialValues={{[fieldName]:state}}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
            <Form.Item
                name={fieldName}
                rules={[{ required: true, message: 'Please input a valid service name' }]}
            >
                <Input allowClear  disabled={isEditing} />
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
        <Text type="secondary" style={{ marginRight: '2rem',}}>{title}</Text>
      {isEditMode?editable:readOnly}
      </div>
    )
  }
  
  export function EditableCountry({id, options, fieldName, currentFieldValue, fieldKey, title}:EditableProps){
  
    const [state, setState] = useState(currentFieldValue)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    const list = countryList.getNames()
    // console.log(countryList.getData())
    const america = countryList.getName('US')
    const sortedList = list.sort()
    const prioritizedList = [america, ...sortedList]
    
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const urlPrefix = useUrlPrefix()
  
   const queryClient = useQueryClient()
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:(data)=>{
        setState(data.data[0][fieldName])
        queryClient.invalidateQueries({queryKey:[options?.queryKey]})
      }
    })
  
    function onFinish(formData:any){
      const payload = {
        // key:fieldKey,
        fieldKey: formData[fieldName],
        id: id
      }
      mutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = mutation ;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text style={{textTransform:'capitalize'}}>{state}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name={fieldKey}
       initialValues={{[fieldName]:currentFieldValue}}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
          <Form.Item
            name={fieldName}
            rules={[{ required: true, message: 'Please select your country !' }]}
          >
                <Select
                placeholder="United states of America"
                // defaultValue={'USA'}
                allowClear
                >
                    {prioritizedList.map((country:any)=>(
                        <Option key={country} value={country}>{country}</Option>
                    ))}
                </Select>
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
        <Text type="secondary" style={{ marginRight: '2rem',}}>{title}</Text>
        {isEditMode?editable:readOnly}
      </div>
    )
  }
  export function EditableRadio({id, options, fieldName, currentFieldValue, fieldKey, title}:EditableProps){
  
    const [state, setState] = useState(currentFieldValue)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    const urlPrefix = useUrlPrefix()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
   const queryClient = useQueryClient()
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:(data)=>{
        setState(data.data[0][fieldName])
        queryClient.invalidateQueries({queryKey:[options?.queryKey]})
      }
    })
  
    function onFinish(formData:any){
      const payload = {
        // key:fieldKey,
        fieldKey: formData[fieldName],
        id: id
      }
      mutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = mutation ;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text style={{textTransform:'capitalize'}}>{state}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       initialValues={{[fieldName]:currentFieldValue}}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
            <Form.Item 
                // label={title} 
                name={fieldName}
                rules={[{ required: true, message: 'Please select an accountType' }]}
                >
                <Radio.Group size='large'>
                    <Radio.Button value="savings">Savings</Radio.Button>
                    <Radio.Button value="checking">Checking</Radio.Button>
                </Radio.Group>
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
        <Text type="secondary" style={{ marginRight: '2rem',}}>{title}</Text>
        {isEditMode?editable:readOnly}
      </div>
    )
  }
