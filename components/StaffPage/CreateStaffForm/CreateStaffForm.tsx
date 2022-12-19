import React,{useState} from 'react';
import {Form, Input,Radio,Button,notification, Space, Typography} from 'antd';


import { useRouter } from 'next/router';
import { Staff, StaffReqPayload } from '../../../types/Staff';
import { useServicesContext } from '../../../context/ServicesContext';


interface StoreFormProps{
    onCreateStaff: (formData:StaffReqPayload)=>void
    onCloseForm: ()=>void,
    isCreatingStaff: boolean
}
export default function CreateStaffForm({onCreateStaff, isCreatingStaff, onCloseForm}:StoreFormProps){


    const {currentService} = useServicesContext()

    const onFinish = (formData:Staff)=>{
        // call function to create store

        const payload={
            orgServiceId: currentService.id,
            staffEmailId: formData.emailId
        }
        // console.log(payload)

        onCreateStaff(payload)
        // showStoreCreationNotification()
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
                name="emailId"
                label="Email"
                rules={[{ required: true, message: 'Please input a valid email' }]}
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
                    <Button shape='round' size='small' onClick={onCloseForm} type='ghost'>
                        Cancel
                    </Button>

                    <Button loading={isCreatingStaff} shape='round' size='small' type="primary"  htmlType="submit" >
                        Add
                    </Button>
                </Space>
                
            </Form.Item>

            </Form>
    )
}
