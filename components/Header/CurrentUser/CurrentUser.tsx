import React from 'react'
import {Typography,Tag,Dropdown,Space,Menu,Button} from 'antd'
import {DownOutlined,LogoutOutlined} from '@ant-design/icons'
import { useAuthContext } from '../../../context/AuthContext'
const {Text} = Typography

interface CurrentUserProps{
    user: {email:string, role:string}
}
export default function CurrentUser({user={email:'mbappai@yahoo.com',role:'admin'}}:CurrentUserProps){

    const {setIsAuthenticated} = useAuthContext()


    const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <Button onClick={()=>setIsAuthenticated(false)} icon={<LogoutOutlined />} type='link' >
              Logout
            </Button>
          ),
        },
      ]}
    />
    );

    return(

        <Dropdown  trigger={['click']} overlay={menu}>
            <Space style={{cursor:'pointer'}}>
                <div style={{display:'flex',flexDirection:'column'}}>
                    <Text ellipsis>{user.email}</Text>
                    <Tag>{user.role}</Tag>
                </div>
                <DownOutlined />
            </Space>
        </Dropdown>
        // <div style={{display:'flex', width:'200px', flexDirection:'column', marginLeft:'1rem'}}>
        //     <Text>{user.email}</Text>
        //     <Tag style={{width:'60px'}} color={user.role === 'admin'?'green':'blue'}>{user.role}</Tag>
        // </div>
    )
}
