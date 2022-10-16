import React from 'react'
import {Typography,Tag} from 'antd'
const {Text} = Typography

interface CurrentUserProps{
    user: {email:string, role:string}
}
export default function CurrentUser({user={email:'mbappai@yahoo.com',role:'admin'}}:CurrentUserProps){
    return(
        <div style={{display:'flex', width:'200px', flexDirection:'column', marginLeft:'1rem'}}>
            <Text>{user.email}</Text>
            <Tag style={{width:'60px'}} color={user.role === 'admin'?'green':'blue'}>{user.role}</Tag>
        </div>
    )
}