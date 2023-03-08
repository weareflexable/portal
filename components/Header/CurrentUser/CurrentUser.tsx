import React, { useEffect, useState } from 'react'
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

const venueRoutes = ['serviceItems','dashboard','staff','bookings']


export default function CurrentUser({openOrgSwitcher}:CurrentUserProps){

    const {logout,currentUser} = useAuthContext()
    const {currentService} = useServicesContext()
    const router = useRouter()
    const {orgUserRole} = useOrgContext()
    const [isManagerRoute, setIsManagerRoute] = useState(false)
    const [isVenueRoute,setIsVenueRoute] = useState<any>(false)

   
    useEffect(() => {
      const isManagerRoute = router.isReady? router.asPath.includes('/manager'): false
      if(router.isReady){
        let exist = false
        venueRoutes.forEach(route=>{
          if(router.asPath.includes(route) === true){
            exist = true
            return
          }
        })
        setIsVenueRoute(exist)
      }
      
      setIsManagerRoute(isManagerRoute)
    }, [])

   const navigateBackToServices=()=>{
      router.replace(`/organizations/services`)
   }
   const navigateBackToOrgs=()=>{
      router.replace(`/organizations`)
   }

   const navigateToProfile=()=>{
    router.push('/profile')
   }
  

  // const items = currentUser.role == 1 ? getManagerMenu() :getAdminMenu()

  let items = []


  if(currentUser.role == 2){
    if(isVenueRoute){
        items = getVenueRoutes()
    }else{
      items = getAdminMenu()
    }
  }else{
    if(isVenueRoute){
      items = getVenueRoutes()
    }else{
      items = getManagerMenu()
    }
  }

  // console.log(isVenueRoute)

  function getAdminMenu(){
    return[
      // {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={navigateBackToServices}  >Back to launchpad</Text>, key:'servicesPage'},
    // {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={navigateBackToOrgs} >Back to organizations</Text>, key:'organizationsPage'},
    // {type:'divider', key:'divider0'},
    // {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={openOrgSwitcher}  >Switch organization</Text>, key:'switchOrganizations'},
    {type:'divider', key:'divider1'},
    {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={navigateToProfile}  >Profile</Text>, key:'profile'},
    {type:'divider', key:'divider2'},
    {label:<Button onClick={logout} danger type='link'>Logout</Button>, key:'logout'},
    ]
  }

  function getVenueRoutes(){
    return[
      {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={navigateBackToServices}  >Back to launchpad</Text>, key:'servicesPage'},
    {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={navigateBackToOrgs} >Back to organizations</Text>, key:'organizationsPage'},
    {type:'divider', key:'divider0'},
    {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={openOrgSwitcher}  >Switch organization</Text>, key:'switchOrganizations'},
    {type:'divider', key:'divider1'},
    {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={navigateToProfile}  >Profile</Text>, key:'profile'},
    {type:'divider', key:'divider2'},
    {label:<Button onClick={logout} danger type='link'>Logout</Button>, key:'logout'},
    ]
  }
  

  

  function getManagerMenu(){
    return[
    // {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={navigateBackToServices}>Back to launchpad</Text>, key:'servicesPage'},
    // {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={()=>router.push('/manager/organizations')} >Back to organizations</Text>, key:'organizationsPage'},
    // {type:'divider', key:'divider0'},
    {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={navigateToProfile}  >Profile</Text>, key:'profile'},
    {type:'divider', key:'divider2'},
    {label:<Button onClick={logout} danger type='link'>Logout</Button>, key:'logout'},
    ]
  }
 

    return(
      //@ts-ignore
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
          <Avatar src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${currentUser.profilePic}`}/>
          <div style={{display:'flex', marginLeft:'.4rem', flexDirection:'column'}}>
            <Text ellipsis  style={{width:'100%', marginTop:'0', marginLeft:'.3em'}}>{currentUser.name}</Text>
            <Text type='secondary' ellipsis style={{width:'150px', marginBottom:'0', marginTop:'0', marginRight:'.5em', marginLeft:'.3em'}}>{currentUser.email}</Text>
          </div>
     </div>
    </Dropdown>
    )
}
