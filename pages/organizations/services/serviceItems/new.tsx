import React,{useState} from 'react';
import {Card,Form, Input,InputNumber, Image, DatePicker,Upload,Button,notification, Space, Alert, Typography, TimePicker, Select, Row, Col, Steps, Radio} from 'antd';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const {Text,Title} = Typography;
import {UploadOutlined,ArrowLeftOutlined,MinusCircleOutlined,PlusCircleOutlined} from '@ant-design/icons'


import { useRouter } from 'next/router';
import { Availability, AvailabilityPayload, ServiceItem, ServiceItemReqPaylod } from '../../../../types/Services';
import dayjs from 'dayjs'
import { useServicesContext } from '../../../../context/ServicesContext';
import useServiceItemTypes from '../../../../hooks/useServiceItemTypes';
import { asyncStore } from '../../../../utils/nftStorage';
import axios from 'axios';
import { useAuthContext } from '../../../../context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import useUrlPrefix from '../../../../hooks/useUrlPrefix';







interface ServiceFormProps{
}

export default function ServiceItemForm(){

    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0);
    // State to hold the id of the service item that will get created in the
    // first form.
    const [createdItemId, setCreatedItemId] = useState('')
    
          const next = (data:any) => {
            const serviceItemId = data[0].id // extract id of newly created service item
            setCreatedItemId(serviceItemId)
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
            content: <AvailabilityForm serviceItemId={createdItemId} />,
            },
        ];


      const items = steps.map((item) => ({ key: item.title, title: item.title }));


    return (
        <div style={{background:'#ffffff', height:'100%', minHeight:'100vh'}}>
           <div style={{marginBottom:'3rem', padding: '1rem', borderBottom:'1px solid #e5e5e5',}}>
                <Row>
                    <Col offset={1}> 
                         <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Button  type='link' onClick={()=>router.back()} icon={<ArrowLeftOutlined/>}/>
                            <Title style={{margin:'0'}} level={3}>Create new service-item</Title>
                        </div>
                    </Col>
                </Row>
            </div>
           <Row > 
                <Col offset={5} span={10}>
                <Steps current={currentStep} items={items} />
                    {/* <BasicForm nextStep={next}/> */}
                    {steps[currentStep].content}
                </Col>
           </Row>
        </div>
         )

}

interface BasicInfoProps{
    nextStep: (data:any)=>void
}

function BasicForm({nextStep}:BasicInfoProps){

     // TODO: set field for editing
     //@ts-ignore
     const menuItems = useServiceItemTypes()
     console.log(menuItems)

     const [isHashingImage, setIsHashingImage] = useState(false)
     const {currentService} = useServicesContext()
     const {paseto} = useAuthContext()
     const router = useRouter()

     const urlPrefix = useUrlPrefix()
    
   

     const onFinish = async (formData:ServiceItem)=>{

        // availability should return empty array whenever user decides not to add custom dates
        // const transformedAvailability = formData.availability?convertDates(formData.availability):[]


        setIsHashingImage(true)
        //@ts-ignore
        const imageHash = await asyncStore(formData.logoImageHash[0].originFileObj) 
        setIsHashingImage(false)

        // // only generate key if it's a new service
            const formObject: ServiceItemReqPaylod = {
                name: formData.name,
                price: Number(formData.price) * 100,
                ticketsPerDay: String(formData.ticketsPerDay),
                description:formData.description,
                orgServiceId: currentService.id,
                serviceItemTypeId: formData.serviceItemTypeId, // TODO: Get this value from context,
                logoImageHash: imageHash
            }

            createData.mutate(formObject)


    }
    const [form] = Form.useForm()


    const createDataHandler = async(newItem:ServiceItemReqPaylod)=>{

        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items`, newItem,{
            headers:{
                "Authorization": paseto
            },
        })
        return data
    }

    const createData = useMutation(createDataHandler,{
       onSuccess:(data)=>{
        // form.resetFields()
        notification['success']({
            message: 'Successfully created new service item!'
        })
            console.log(data)
            nextStep(data.data)
            
       },
        onError:(err)=>{
            console.log(err)
            notification['error']({
                message: 'Encountered an error while creating service itme',
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
            name="serviceItemTypeId"
            label='Service item type'
            rules={[{ required: true, message: 'Please select a service-item type!' }]}
            >
            <Radio.Group size='large'>
                {menuItems.map((item:any)=><Radio.Button value={item.value} key={item.value}>{item.label}</Radio.Button>)}
            </Radio.Group>
        </Form.Item> 

        <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input a valid service name' }]}
         >
            <Input allowClear size='large' placeholder="Bill Cage Line Skip" />
        </Form.Item>

        <Form.Item name='description'  label="Description">
            <TextArea allowClear maxLength={150} size='large' showCount  placeholder='Tell us more about this service' rows={2} />
        </Form.Item>

        <Form.Item
            name="price"
            label='Price'
            style={{width:'100%'}}
            rules={[{ required: true, message: 'Please input a valid price!' }]}
        >
            <div style={{display:'flex', alignItems:'center'}}>
            <Input style={{width:'400px'}} size='large' suffix='Per ticket'  prefix="$"  placeholder="0.00" /> 
            </div>
        </Form.Item> 

        <Form.Item
            name="ticketsPerDay"
            label='Tickets per day'
            
            rules={[{ required: true, message: 'Please input a valid number!' }]}
            >
            <div style={{display:'flex', alignItems:'center'}}>
                <Input style={{width:'400px'}} suffix='Tickets per day'  size='large' placeholder="250" />
            </div>
        </Form.Item>



        
        <Form.Item
            name="logoImageHash"
            label="Cover image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="This cover image will be used for listing on marketplace and Digital access token NFT"
            rules={[{ required: true, message: 'Please upload an image' }]}
        >
            <Upload name="logo" action="" listType="picture">
            <Button icon={<UploadOutlined />}>Upload service item cover image</Button>
            </Upload>
        </Form.Item> 


        <Form.Item style={{marginTop:'4rem'}}>
            <Space>
                <Button onClick={()=>router.back()}  type='ghost'>
                    Cancel
                </Button>

                <Button shape='round' size='large' loading={isHashingImage||isCreatingData} type="primary"  htmlType="submit" >
                    Create service item
                </Button>

            </Space>
            
        </Form.Item>

        </Form>
    )
}



interface AvailabilityProp{
    serviceItemId: string,
}
function AvailabilityForm({serviceItemId}:AvailabilityProp){

    const [form] = Form.useForm()
    const router = useRouter()

    const urlPrefix = useUrlPrefix()

    const {paseto} = useAuthContext()
    
    // This functions takes in custom availability array and
   // changes the format of the date field of every item in the array.
   function convertDates(customDates:Availability){ // TODO: rename this function and it's parameters
    console.log(customDates)
     const res = customDates.map(date=>{ 
          const updatedDate = {
              ...date,
              date: dayjs(date.date).format('MMM DD, YYYY'),
              ticketsPerDay: Number(date.ticketsPerDay),
              price: date.price*100
          }
          return updatedDate
      })

      return res;
   }

    async function onFinish(formData:any){
        console.log('form data',formData.availability)
        const transformedDates = convertDates(formData.availability)
        const reqPayload = {
            serviceItemId: serviceItemId,
            availability: transformedDates
        }

        createData.mutate(reqPayload)
    }


    const createDataHandler = async(newItem:AvailabilityPayload)=>{ 
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items/availability`, newItem,{
            headers:{
                "Authorization": paseto
            },
        })
        return data
    }

    const createData = useMutation(createDataHandler,{
       onSuccess:(data)=>{
        form.resetFields()
        notification['success']({
            message: 'Successfully created custom availabilties!'
        })
            console.log(data)
            router.back()
            // nextStep(data.data)
            
       },
        onError:(err)=>{
            console.log(err)
            notification['error']({
                message: 'Encountered an error while creating custom custom dates',
              });
            // leave modal open
        } 
    })

    const {isError, isLoading:isCreatingData, isSuccess:isDataCreated, data:createdData} = createData




    return(
        <>
        <div style={{width:'100%', marginTop:'3rem', display:'flex',flexDirection:'column'}}>
            <Title style={{marginBottom:'.2rem'}} level={3}>Create custom availability</Title>
            <Text>You can add multiple custom dates on which this service will be available to be purchased on the marketplace</Text>
        </div> 
        <Form
            name="serviceItemAvailability"
            initialValues={{ remember: false }}
            layout='vertical'
            form={form}
            style={{marginTop:'2rem'}}
            onFinish={onFinish}
            >

            <Form.List name="availability">
                {(fields, { add, remove }) => (
                    <>
                    {fields.map(({ key, name, ...restField }) => (
                        <div style={{padding:'1rem', marginBottom:'1rem', borderRadius:'4px', border:'1px solid #e1e1e1'}} key={key}>

                            {/* label */}
                            <Form.Item
                                    {...restField}
                                    requiredMark='optional'
                                    // label='Label'
                                    // rules={[{ required: true, message: 'Please provide a valid label for the date' }]}
                                    name={[name, 'name']}
                                    style={{width:'100%'}}
                                >
                                <Input size='large' placeholder='Label(optional): Christmas eve' />
                            </Form.Item>

                            {/* price and tickets per day */}
                            <Row>
                                <Col span={11} style={{height:'100%'}}>
                                    <Form.Item
                                        name={[name, 'price']}
                                        // label='Price'
                                        {...restField}
                                        style={{width:'100%'}}
                                        rules={[{ required: true, message: 'Please input a valid price!' }]}
                                    >
                                        <Input size='large' style={{width:'100%'}} suffix='Per ticket' prefix="$" placeholder="0.00" /> 
                                    </Form.Item> 
                                </Col>
                                <Col offset={1} span={12}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'ticketsPerDay']}
                                        // label='Tickets per day'
                                        style={{width:'100%'}}
                                        rules={[{ required: true, message: 'Please input a valid number!' }]}
                                        >
                                        <Input size='large' suffix='Tickets Per day' style={{width:'100%'}} placeholder="20" />
                                    </Form.Item>
                                </Col>
                            </Row>
            
                                {/* date */}
                            <Row>
                                <Col span={11}>
                                    <Form.Item
                                        {...restField}
                                        rules={[{ required: true, message: 'Please select a date!' }]}
                                        name={[name, 'date']}
                                        // label="Date"
                                        style={{width:'100%'}}
                                    >
                                        <DatePicker size='large' style={{width:'100%'}} />
                                    </Form.Item>
                                </Col>
                            </Row>
            
                            
                            {/* controls */}
                            <Col span={4}>
                                <Form.Item style={{marginBottom:'0', width:'100%'}}>
                                    <Space >
                                        <Button shape="round" icon={<MinusCircleOutlined  />} size='small'  onClick={() => remove(name)} type='text'>Remove availability</Button>
                                    </Space>           
                                </Form.Item>
                            </Col>
                         </div>
                    ))}

                    <Form.Item>
                        <Button icon={<PlusCircleOutlined />} size='large' shape='round' onClick={() => add()}>
                             Add custom availability
                        </Button>
                    </Form.Item>
                    </>
                )}
            </Form.List>


            <Form.Item style={{marginTop:'4rem'}}>
                <Space>
                    <Button shape='round' onClick={()=>router.back()} type='ghost'>
                        Skip for now
                    </Button>

                    <Button shape='round' size='large' loading={isCreatingData} type='primary' htmlType="submit" >
                         Create availabilities
                    </Button>
                </Space>
                
            </Form.Item>

            </Form>
        </>
    )
}




const lineSkipImages = [
    '/placeholder.png',
    '/placeholder.png',
    '/placeholder.png',
]