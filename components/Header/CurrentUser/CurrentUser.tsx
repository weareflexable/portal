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
    openOrgSwitcher?: ()=>void
}


export default function CurrentUser({openOrgSwitcher}:CurrentUserProps){

    const {logout,currentUser} = useAuthContext()
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
  

  const items: MenuProps['items'] = currentUser.role == 1 ? getManagerMenu() :getAdminMenu()

  function getAdminMenu(){
    return[
      {label:<Text onClick={navigateBackToServices}  >Back to services</Text>, key:'servicesPage'},
    {label:<Text onClick={navigateBackToOrgs} >Back to organizations</Text>, key:'organizationsPage'},
    {type:'divider', key:'divider0'},
    {label:<Text onClick={openOrgSwitcher}  >Switch organization</Text>, key:'switchOrganizations'},
    {type:'divider', key:'divider1'},
    {label:<Text onClick={navigateToProfile}  >Profile</Text>, key:'profile'},
    {type:'divider', key:'divider2'},
    {label:<Button onClick={logout} danger type='link'>Logout</Button>, key:'logout'},
    ]
  }

  function getManagerMenu(){
    return[
    {label:<Text onClick={navigateBackToServices}>Back to services</Text>, key:'servicesPage'},
    {label:<Text onClick={()=>router.push('/manager/organizations')} >Back to organizations</Text>, key:'organizationsPage'},
    {type:'divider', key:'divider0'},
    {label:<Text onClick={navigateToProfile}  >Profile</Text>, key:'profile'},
    {type:'divider', key:'divider2'},
    {label:<Button onClick={logout} danger type='link'>Logout</Button>, key:'logout'},
    ]
  }


    return(
      <Dropdown trigger={['click']} menu={{items}} >
      <div
        onClick={()=>console.log('show modal to switch')} 
          style={
            {
              display:'flex', 
            cursor:'pointer', 
            //  background:'#f4f4f4' , 
            borderRadius:'50px', 
            //  padding:'.5em', 
            justifyContent:'center', 
            alignItems:'center',
          }}>
          <Avatar src={''}/>
          <div style={{display:'flex', marginLeft:'.4rem', flexDirection:'column'}}>
            <Text ellipsis  style={{width:'100%', marginTop:'0', marginLeft:'.3em'}}>{currentUser.name}</Text>
            <Text type='secondary' ellipsis style={{width:'150px', marginBottom:'0', marginTop:'0', marginRight:'.5em', marginLeft:'.3em'}}>{currentUser.email}</Text>
          </div>
     </div>
    </Dropdown>
    )
}
