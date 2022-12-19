import React from 'react'
import {Typography,Avatar,Button, Dropdown} from 'antd'
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
      router.replace(`/organizations/services`)
   }
   const navigateBackToOrgs=()=>{
      router.replace(`/organizations`)
   }

   const navigateToProfile=()=>{
    router.replace('/profile')
   }
  

  const items: MenuProps['items'] = [
    {label:<Text onClick={navigateBackToServices}  >Back to services</Text>, key:'servicesPage'},
    {label:<Text onClick={navigateBackToOrgs} >Back to organizations</Text>, key:'organizationsPage'},
    {type:'divider', key:'divider0'},
    {label:<Text onClick={openOrgSwitcher}  >Switch organization</Text>, key:'switchOrganizations'},
    {type:'divider', key:'divider1'},
    {label:<Text onClick={navigateToProfile}  >Profile</Text>, key:'profile'},
    {type:'divider', key:'divider2'},
    {label:<Button onClick={logout} danger type='link'>Logout</Button>, key:'logout'},
  ];


    return(
      <Dropdown trigger={['click']} menu={{items}} >
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
