import React,{useState} from 'react';
import {Card,Form, Input,InputNumber, DatePicker,Upload,Button,notification, Space, Alert, Typography, TimePicker, Select, Row, Col, Steps, Radio} from 'antd';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const {Text,Title} = Typography;
import {UploadOutlined,ArrowLeftOutlined} from '@ant-design/icons'

import {v4 as uuidv4} from 'uuid'

import { useRouter } from 'next/router';
import { ServiceItem, ServiceItemReqPaylod } from '../../../../types/Services';
import dayjs from 'dayjs'
import { useServicesContext } from '../../../../context/ServicesContext';
import useServiceTypes from '../../../../hooks/useServiceTypes';
import useServiceItemTypes from '../../../../hooks/useServiceItemTypes';
import { asyncStore } from '../../../../utils/nftStorage';







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
          title: 'Item Availabilty',
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
                <Steps current={currentStep} items={items} />
                    {/* {currentStep === 0?<BasicForm nextStep={next}/>:<AvailabilityForm/>} */}
                    {steps[currentStep].content}
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
    //  const menuItems = useServiceItemTypes()
    
     const onFinish = async (formData:ServiceItem)=>{

        // setIsHashingAssets(true)
        // const imageHash = await asyncStore(formData.logoImageHash[0].originFileObj) 
        // setIsHashingAssets(false)
        // // call function to create stor
        // // only generate key if it's a new service
        //     const formObject: ServiceItemReqPaylod = {
        //         name: formData.name,
        //         price: formData.price * 100,
        //         // ticketsPerDay: formData.ticketsPerDay,
        //         // description:formData.description,
        //         // orgServiceId: currentService.id,
        //         // startDate: dayjs(formData.startDate).format('YYYY-MMM-DD'), // convert to dayjs
        //         // endDate: dayjs(formData.endDate).format('YYYY-MMM-DD'),
        //         // startTime: dayjs(formData.startTime).format('HH:mm:ss'), // convert time to seconds
        //         // rangeTime: `${formData.rangeTime}:0:0`, // convert time to seconds
        //         serviceItemId: '2',// TODO: replace with form value,
        //         logoImageHash: imageHash
        //     }
        //     console.log(formObject)

        nextStep()


    }
    const [form] = Form.useForm()


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


        {/* <Form.Item
            name="serviceType"
            label='Service type'
            rules={[{ required: true, message: 'Please input a valid address!' }]}
        >
            <Radio.Group>
                {menuItems.map((item:any)=><Radio.Button value={item.value} key={item.value}>{item.label}</Radio.Button>)}
            </Radio.Group>
        </Form.Item> */}
{/* 
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
        </Form.Item> */}

      


        <Form.Item style={{marginTop:'4rem'}}>
            <Space>
                <Button shape='round'  type='ghost'>
                    Cancel
                </Button>

                <Button shape='round'  type="primary"  htmlType="submit" >
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

            <Form.Item
                name="price"
                label='Price'
                rules={[{ required: true, message: 'Please input a valid price!' }]}
            >
                <InputNumber width={'30%'} prefix="$"  placeholder="0.00" />
            </Form.Item>

            <Form.Item
                name="ticketsPerDay"
                label='Tickets per day'
                rules={[{ required: true, message: 'Please input a valid number!' }]}
            >
                <InputNumber width={'30%'}   placeholder="20" />
            </Form.Item>

           
                <div style={{display:'flex', alignItems:'center'}}>

                    <Form.Item
                        rules={[{ required: true, message: 'Please select a date!' }]}
                        name='startDate' 
                        label="Start date">
                        <DatePicker />
                    </Form.Item>

                </div>
            <div style={{display:'flex', marginBottom:'1em', alignItems:'center'}}>

            </div>


            <Form.Item style={{marginTop:'2rem'}}>
                <Space>
                    <Button shape='round'  type='ghost'>
                        Cancel
                    </Button>

                    <Button shape='round'  type="primary"  htmlType="submit" >
                         Add availability
                    </Button>
                </Space>
                
            </Form.Item>

            </Form>
    )
}