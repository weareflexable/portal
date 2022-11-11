import React,{useState} from 'react';
import {Form, Input,Radio,Button,notification, Space, Typography} from 'antd';


import { useRouter } from 'next/router';


interface StoreFormProps{
    onCreateStaff: (formData:any)=>void
    onCloseForm: ()=>void
}
export default function CreateStaffForm({onCreateStaff, onCloseForm}:StoreFormProps){



    const onFinish = (formData:FormData)=>{
        // call function to create store
        onCreateStaff(formData)
        showStoreCreationNotification()
    }

    const showStoreCreationNotification = () => {
        notification['success']({
          message: 'Staff created succesfully',
        });
      };
      

    return (
            <Form
            name="staffForm"
            initialValues={{ remember: true }}
            layout='vertical'
            onFinish={onFinish}
            >
            <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Please input a valid email' }]}
             >
                <Input placeholder="eg. billcage@yahoo.com" />
            </Form.Item>

            <Form.Item
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

            </Form.Item>

            <Form.Item>
                <Space>
                    <Button onClick={onCloseForm} type='ghost'>
                        Cancel
                    </Button>

                    <Button type="primary"  htmlType="submit" >
                        Add
                    </Button>
                </Space>
                
            </Form.Item>

            </Form>
    )
}
