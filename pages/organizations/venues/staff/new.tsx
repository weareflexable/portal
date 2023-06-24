import { Row, Col, Button, Form, Input, Space, Typography, notification, FormInstance } from "antd";
const {Title, Text} = Typography
import router, { useRouter } from "next/router";
import { useServicesContext } from "../../../../context/ServicesContext";
import { Staff } from "../../../../types/Staff";
import {ArrowLeftOutlined} from '@ant-design/icons'
import { useState, useEffect } from "react";


export default function NewStaffForm(){

    const {currentService} = useServicesContext()

    const onFinish = (formData:Staff)=>{
        // call function to create store

        const payload={
            orgServiceId: currentService.id,
            // staffEmailId: formData.emailId
        }
        // console.log(payload)

        // showStoreCreationNotification()
    }

    const showStoreCreationNotification = () => {
        notification['success']({
          message: 'Staff created succesfully',
        });
      };

    return(
        <div style={{background:'#ffffff', height:'100%', minHeight:'100vh'}}>
            <div style={{marginBottom:'3rem', padding: '1rem', borderBottom:'1px solid #e5e5e5',}}>
                <Row>
                    <Col offset={1}> 
                        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Button shape='round' style={{marginRight:'1rem'}} type='text' onClick={()=>router.back()} icon={<ArrowLeftOutlined rev={undefined}/>}/>
                            <Title style={{margin:'0'}} level={3}>Add staff to service</Title>
                        </div>
                    </Col>
                </Row>
            </div>
            
            <Row>
                <Col offset={5} span={10}>
                <Form
            name="staffForm"
            initialValues={{ remember: true }}
            layout='vertical'
            onFinish={onFinish}
            >
            <Form.Item
                name="emailId"
                label="Email"
                hasFeedback
                rules={[{type:'email', message: 'Please provide a valid email address'},{ required: true, message: 'Please input a valid email' }]}
             >
                <Input placeholder="eg. billcage@yahoo.com" />
            </Form.Item>

            {/* <Form.Item
                name="role"
                label="Assign role"
                rules={[{ required: true, message: 'Please select a valid role' }]}
             >
                <Radio.Group>
                    <Space direction="vertical">
                        <Radio value={'manager'}>Manager</Radio>
                        <Radio value={'employee'}>Employee</Radio>
                    </Space>
                </Radio.Group>

            </Form.Item> */}

            <Form.Item>
                <Space>
                    <Button shape='round' size='small' onClick={()=>router.back()} type='ghost'>
                        Cancel
                    </Button>

                    <Button loading={false} shape='round' size='small' type="primary"  htmlType="submit" >
                        Add
                    </Button>
                </Space>
                
            </Form.Item>

            </Form>
                </Col>
            </Row>
            

        </div>
    )
}


interface SubmitButtonProps{
    isLoading: boolean,
    form: FormInstance
  }
  
  
  const SubmitButton = ({ form, isLoading }:SubmitButtonProps) => {
    const [submittable, setSubmittable] = useState(false);
  
    // Watch all values
    const values = Form.useWatch([], form);
  
  
    useEffect(() => {
        
  
      form.validateFields({validateOnly:true}).then(
        (res) => {
            console.log('issubmittable',res)
          setSubmittable(true);
        },
        () => {
            console.log('isNot')
          setSubmittable(false);
        },
      );
    }, [values]);
  
    return (
        <Button shape="round" type="primary" disabled={!submittable} size="large" loading={isLoading}  htmlType="submit" >
        Add Staff
     </Button>
    );
  };