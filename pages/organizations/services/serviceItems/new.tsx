import React,{useState} from 'react';
import {Card,Form, Input,InputNumber, DatePicker,Upload,Button,notification, Space, Alert, Typography, TimePicker, Select, Row, Col, Steps, Radio} from 'antd';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const {Text,Title} = Typography;
import {UploadOutlined,ArrowLeftOutlined,MinusCircleOutlined,PlusOutlined} from '@ant-design/icons'

import {v4 as uuidv4} from 'uuid'

import { useRouter } from 'next/router';
import { Availability, ServiceItem, ServiceItemReqPaylod } from '../../../../types/Services';
import dayjs from 'dayjs'
import { useServicesContext } from '../../../../context/ServicesContext';
import useServiceTypes from '../../../../hooks/useServiceTypes';
import useServiceItemTypes from '../../../../hooks/useServiceItemTypes';
import { asyncStore } from '../../../../utils/nftStorage';
import axios from 'axios';
import { useAuthContext } from '../../../../context/AuthContext';
import { useMutation } from '@tanstack/react-query';







interface ServiceFormProps{
    onTriggerFormAction: (formData:ServiceItemReqPaylod)=>void
    onCloseForm: ()=>void,
    isCreatingServiceItem:boolean
}

export default function ServiceItemForm({ onTriggerFormAction,isCreatingServiceItem, onCloseForm}:ServiceFormProps){

    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0);
    
          const next = () => {
            setCurrentStep(currentStep + 1);
          };
        
          const prev = () => {
            setCurrentStep(currentStep - 1);
          };

    const steps = [
        {
          title: 'Basic Info',
          content: <BasicForm nextStep={next}/>,
        },
        {
          title: 'Customize',
          content: <AvailabilityForm/>,
        },
      ];


      const items = steps.map((item) => ({ key: item.title, title: item.title }));

    


    return (
        <div style={{background:'#ffffff', height:'100%', minHeight:'100vh'}}>
           <div style={{marginBottom:'3rem', padding: '1rem', borderBottom:'1px solid #e5e5e5',}}>
                <Row>
                    <Col offset={1}> 
                         <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Button shape='round' style={{marginRight:'1rem'}} type='text' onClick={()=>router.back()} icon={<ArrowLeftOutlined/>}/>
                            <Title style={{margin:'0'}} level={3}>Create new service-item</Title>
                        </div>
                    </Col>
                </Row>
            </div>
           <Row > 
                <Col offset={5} span={10}>
                {/* <Steps current={currentStep} items={items} /> */}
                    <BasicForm nextStep={next}/>
                    {/* {steps[currentStep].content} */}
                </Col>
           </Row>
        </div>
         )

}

interface BasicInfoProps{
    nextStep: ()=>void
}

function BasicForm({nextStep}:BasicInfoProps){

     // TODO: set field for editing
     const menuItems = useServiceItemTypes()
     console.log(menuItems)

     const [isHashingImage, setIsHashingImage] = useState(false)
     const {currentService} = useServicesContext()
     const {paseto} = useAuthContext()
     const router = useRouter()
    
     // This functions takes in custom availability array and
     // changes the format of the date field of every item in the array.
     function convertDates(customDates:Availability){
       const res = customDates.map(date=>{
            const updatedDate = {
                ...date,
                date: dayjs(date.date).format('MMM DD, YYYY')
            }
            return updatedDate
        })

        return res;
     }
     const onFinish = async (formData:ServiceItem)=>{

        // availability should return empty array whenever user decides not to add custom dates
        const transformedAvailability = formData.availability?convertDates(formData.availability):[]


        setIsHashingImage(true)
        //@ts-ignore
        const imageHash = await asyncStore(formData.logoImageHash[0].originFileObj) 
        setIsHashingImage(false)

        // // only generate key if it's a new service
            const formObject: ServiceItemReqPaylod = {
                name: formData.name,
                price: String(Number(formData.price) * 100),
                ticketsPerDay: String(formData.ticketsPerDay),
                description:formData.description,
                orgServiceId: currentService.id,
                // serviceItemTypeId: formData.serviceItemTypeId,// TODO: replace with form value,
                serviceItemTypeId: "1",// TODO: replace with form value,
                availability: transformedAvailability,
                logoImageHash: imageHash
            }
            console.log(formObject)

            createData.mutate(formObject)


    }
    const [form] = Form.useForm()


    const createDataHandler = async(newItem:ServiceItemReqPaylod)=>{
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/service-items`, newItem,{
            headers:{
                "Authorization": paseto
            },
        })
        return data
    }

    const createData = useMutation(createDataHandler,{
       onSuccess:()=>{
        form.resetFields()
        notification['success']({
            message: 'Successfully created new service item!'
        })
        // setInterval(()=>{
            router.replace('/organizations/services/serviceItems')
        // },2000)
       },
        onError:()=>{
            notification['error']({
                message: 'Encountered an error while creating record',
              });
            // leave modal open
        } 
    })

    const {isError, isLoading:isCreatingData, isSuccess:isDataCreated, data:createdData} = createData


    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        } 
        return e?.fileList;
      };

    return(
        <Form
        name="serviceItemForm"
        initialValues={{ remember: false }}
        layout='vertical'
        form={form}
        style={{marginTop:'2rem'}}
        onFinish={onFinish}
        >
        <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input a valid service name' }]}
         >
            <Input placeholder="Bill Cage Line Skip" />
        </Form.Item>

        <Form.Item name='description'  label="Description">
            <TextArea maxLength={150} showCount  placeholder='Best coffee shop in the entire world with the most beautiful scenary' rows={3} />
        </Form.Item>

        <Form.Item
            name="price"
            label='Price'
            style={{width:'100%'}}
            rules={[{ required: true, message: 'Please input a valid price!' }]}
        >
            <InputNumber   prefix="$"  placeholder="0.00" /> 
        </Form.Item> 

        <Form.Item
            name="ticketsPerDay"
            label='Tickets per day'
            style={{width:'100%'}}
            rules={[{ required: true, message: 'Please input a valid number!' }]}
            >
            <InputNumber placeholder="20" />
        </Form.Item>

        {/* <Form.Item
            name="imageHash"
            label="Logo"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload file upto 2MB"
            rules={[{ required: true, message: 'Please upload an image' }]}
        >
            <Upload name="logo" action="" listType="picture">
            <Button icon={<UploadOutlined />}>Upload service logo</Button>
            </Upload>
        </Form.Item> */}


         {/* <Form.Item
            name="serviceItemTypeId"
            label='Service type'
            rules={[{ required: true, message: 'Please select a service-item type!' }]}
            >
            <Radio.Group>
                {menuItems.map((item:any)=><Radio.Button value={item.value} key={item.value}>{item.label}</Radio.Button>)}
            </Radio.Group>
        </Form.Item>  */}
        
        <Form.Item
            name="logoImageHash"
            label="Cover image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload file upto 2MB"
            rules={[{ required: true, message: 'Please upload an image' }]}
        >
            <Upload name="logo" action="" listType="picture">
            <Button icon={<UploadOutlined />}>Upload service item cover image</Button>
            </Upload>
        </Form.Item> 


        <Form.List name="availability">
                {(fields, { add, remove }) => (
                    <>
                    {fields.map(({ key, name, ...restField }) => (
                        <Space key={key} style={{ display: 'flex', marginBottom: 8, alignItems:'center' }} >
                        <Form.Item
                            name={[name, 'price']}
                            label='Price'
                            {...restField}
                            style={{width:'100%'}}
                            rules={[{ required: true, message: 'Please input a valid price!' }]}
                        >
                            <InputNumber prefix="$"  placeholder="0.00" /> 
                        </Form.Item> 

                        <Form.Item
                            {...restField}
                            name={[name, 'ticketsPerDay']}
                            label='Tickets per day'
                            style={{width:'100%'}}
                            rules={[{ required: true, message: 'Please input a valid number!' }]}
                            >
                            <InputNumber placeholder="20" />
                        </Form.Item>

                            <Form.Item
                                {...restField}
                                rules={[{ required: true, message: 'Please select a date!' }]}
                                name={[name, 'date']}
                                label="Date"
                                style={{width:'100%'}}
                                >
                                <DatePicker format={['MMM DD, YYYY']} />
                            </Form.Item>
                            <div style={{marginLeft:'.5rem'}}>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </div>
                        </Space>
                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()}  block icon={<PlusOutlined />}>
                        Add custom availability
                        </Button>
                    </Form.Item>
                    </>
                )}
            </Form.List>


      


        <Form.Item style={{marginTop:'4rem'}}>
            <Space>
                <Button shape='round'  type='ghost'>
                    Cancel
                </Button>

                <Button shape='round' loading={isHashingImage||isCreatingData} type="primary"  htmlType="submit" >
                 Create service item
                </Button>

            </Space>
            
        </Form.Item>

        </Form>
    )
}



function AvailabilityForm(){

    const [form] = Form.useForm()

    async function onFinish(e:any){
        console.log(e)
    }

    return(
        <Form
            name="serviceItemAvailability"
            initialValues={{ remember: false }}
            layout='vertical'
            form={form}
            style={{marginTop:'2rem'}}
            onFinish={onFinish}
            >


            <Form.List name="availabilty">
                {(fields, { add, remove }) => (
                    <>
                    {fields.map(({ key, name, ...restField }) => (
                        <Space key={key} style={{ display: 'flex', marginBottom: 8, alignItems:'center' }} >
                        <Form.Item
                            name="price"
                            label='Price'
                            style={{width:'100%'}}
                            rules={[{ required: true, message: 'Please input a valid price!' }]}
                        >
                            <InputNumber   prefix="$"  placeholder="0.00" /> 
                        </Form.Item> 

                        <Form.Item
                            name="ticketsPerDay"
                            label='Tickets per day'
                            style={{width:'100%'}}
                            rules={[{ required: true, message: 'Please input a valid number!' }]}
                            >
                            <InputNumber    placeholder="20" />
                        </Form.Item>

                            <Form.Item
                                rules={[{ required: true, message: 'Please select a date!' }]}
                                name='date' 
                                label="Date"
                                style={{width:'100%'}}
                                >

                                <DatePicker />
                            </Form.Item>
                            <div style={{marginLeft:'.5rem'}}>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </div>
                        </Space>
                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add custom availability
                        </Button>
                    </Form.Item>
                    </>
                )}
            </Form.List>


            <Form.Item style={{marginTop:'2rem'}}>
                <Space>
                    <Button shape='round'  type='ghost'>
                        Skip for now
                    </Button>

                    <Button shape='round'    htmlType="submit" >
                         Confirm
                    </Button>
                </Space>
                
            </Form.Item>

            </Form>
    )
}