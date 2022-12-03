import React from 'react'
import {Typography,Avatar,Space,Menu,Button, Dropdown,Tag, Divider} from 'antd'
import {DownOutlined,LogoutOutlined} from '@ant-design/icons'
import { useAuthContext } from '../../../context/AuthContext'
import { useOrgContext } from '../../../context/OrgContext'
const {Text,Title} = Typography
import type { MenuProps } from 'antd';
import { useServicesContext } from '../../../context/ServicesContext'
import { useRouter } from 'next/router'

interface CurrentUserProps{
    user?: {email:string, role:string}
    openOrgSwitcher: ()=>void
}


export default function CurrentUser({user={email:'mbappai@yahoo.com',role:'admin'}, openOrgSwitcher}:CurrentUserProps){

    const {setIsAuthenticated,logout} = useAuthContext()
    const {currentService} = useServicesContext()
    const router = useRouter()
    const {orgUserRole} = useOrgContext()

   const navigateBackToServices=()=>{
      router.replace(`/organisation/${currentService.id}`)
   }
   const navigateBackToOrgs=()=>{
      router.replace(`/`)
   }

  


const menu = (
  <Menu>
    <Menu.Item key={'servicesPage'}><Button onClick={navigateBackToServices} type='link' >Back to services</Button></Menu.Item>
    <Menu.Item key={'servicesPage'}><Button onClick={navigateBackToOrgs} type='link' >Back to organizations</Button></Menu.Item>
    <Menu.Item key={'switchOrganisation'}><Button onClick={openOrgSwitcher} type='link' >Switch organization</Button></Menu.Item>
    <Menu.Item key={'logout'}><Button onClick={logout} danger type='link'>Logout</Button></Menu.Item>
  </Menu>
);


    return(
      <Dropdown trigger={['click']} overlay={menu} >
      <div
        onClick={()=>console.log('show modal to switch')} 
          style={
            {
              display:'flex', 
              marginLeft:'1.4em',
            cursor:'pointer', 
            //  background:'#f4f4f4' , 
            borderRadius:'50px', 
            //  padding:'.5em', 
            justifyContent:'center', 
            alignItems:'center',
          }}>
          <Avatar src={''}/>
          <div style={{display:'flex', flexDirection:'column'}}>
            {/* <Title ellipsis level={5} style={{marginBottom:'.001em', width:'150px', marginRight:'.5em', marginLeft:'.3em'}}>mujahidbappai@gmail.com</Title> */}
            <Text type='secondary' style={{width:'100%', marginTop:'0', maxWidth:'50px', marginLeft:'.3em'}}>{orgUserRole}</Text>
          </div>
     </div>
    </Dropdown>
    )
}
