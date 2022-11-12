import React from 'react'
import {Typography,Avatar,Space,Menu,Button, Tag} from 'antd'
import {DownOutlined,LogoutOutlined} from '@ant-design/icons'
import { useAuthContext } from '../../../context/AuthContext'
import { useOrgContext } from '../../../context/OrgContext'
const {Text} = Typography

interface CurrentUserProps{
    user: {email:string, role:string}
}
export default function CurrentUser({user={email:'mbappai@yahoo.com',role:'admin'}}:CurrentUserProps){

    const {setIsAuthenticated} = useAuthContext()
    const {orgUserRole} = useOrgContext()

    return(

      <div
      onClick={()=>console.log('show modal to switch')} 
      style={
         {
          display:'flex', 
          marginLeft:'1em',
         cursor:'pointer', 
         background:'#f4f4f4' , 
         borderRadius:'50px', 
         padding:'.5em', 
         justifyContent:'center', 
         alignItems:'center',
         }}>
       <Avatar src={''}/>
       <div style={{display:'flex', flexDirection:'column'}}>
       <Text ellipsis style={{marginBottom:'.1em', width:'150px', marginRight:'.5em', marginLeft:'1em'}}>mujahidbappai@gmail.com</Text>
       <Tag color='magenta'>{orgUserRole}</Tag>
       </div>
     </div>
    )
}
