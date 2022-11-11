import React,{useState} from 'react';
import {Form, Input,Radio,Button,notification, Space, Typography} from 'antd';
import { Staff } from '../../../types/Staff';


interface StaffEditFormProps{
    initValues: Staff | undefined
    onChangeStaffRole: (staff:Staff)=>void
    onCloseForm: ()=>void
}
export default function StaffEditForm({initValues, onChangeStaffRole, onCloseForm}:StaffEditFormProps){


    const prevValues = initValues;

    const onFinish = (formData:Staff)=>{
        // call function to create store
        const formObject = {
            ...prevValues,
            ...formData
        }
        onChangeStaffRole(formObject)
        showStoreCreationNotification()
    }

    const showStoreCreationNotification = () => {
        notification['success']({
          message: 'Role updated succesfully',
        });
      };
      

    return (
            <Form
            name="staffForm"
            initialValues={initValues}
            layout='vertical'
            onFinish={onFinish}
            >
            <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Please input a valid email' }]}
             >
                <Input disabled placeholder="eg. billcage@yahoo.com" />
            </Form.Item>

            <Form.Item
                name="role"
                label="Assign role"
                rules={[{ required: true, message: 'Please select a valid role' }]}
             >
                <Radio.Group>
                    <Space direction="vertical">
                        <Radio value={'admin'}>Admin</Radio>
                        <Radio value={'manager'}>Manager</Radio>
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
