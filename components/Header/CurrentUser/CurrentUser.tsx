import React, { useEffect, useState } from 'react'
import {Typography,Avatar,Button, Dropdown, Badge, Tag} from 'antd'
import {DownOutlined,LogoutOutlined} from '@ant-design/icons'
import { useAuthContext } from '../../../context/AuthContext'
import { useOrgContext } from '../../../context/OrgContext'
const {Text,Title} = Typography
import type { MenuProps } from 'antd';
import { useServicesContext } from '../../../context/ServicesContext'
import { useRouter } from 'next/router'
import utils from '../../../utils/env'

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

    // move this into a hook
    const borderColor = currentUser.role == 1 ? 'purple': currentUser.role == 2 ? 'volcano': currentUser.role == 3? 'cyan': currentUser.role == 0?'blue':'green'

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
      router.replace(`/organizations/venues`)
   }
   const navigateBackToOrgs=()=>{
      router.replace(`/organizations`)
   }

   const navigateToProfile=()=>{
    router.push('/profile')
   }
  

  // const items = currentUser.role == 1 ? getManagerMenu() :getAdminMenu()

  let items = []


  if(currentUser && currentUser.role == 2){
    if(isVenueRoute){
        items = getVenueRoutes()
    }else{
      items = getAdminMenu()
    }
  }else if(currentUser && currentUser.role == 1) {
    if(isVenueRoute){
      items = getManagerVenueRoutes()
    }else{
      items = getManagerMenu()
    }
  }else if(currentUser && currentUser.role == 0){
    items = getSuperAdminRoutes()
  }else{
    items = getManagerMenu()
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
      {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={navigateBackToServices}  >Back to launchpad</Text>, key:'venuesPage'},
    {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={navigateBackToOrgs} >Back to organizations</Text>, key:'organizationsPage'},
    {type:'divider', key:'divider0'},
    {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={openOrgSwitcher}  >Switch organization</Text>, key:'switchOrganizations'},
    {type:'divider', key:'divider1'},
    {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={navigateToProfile}  >Profile</Text>, key:'profile'},
    {type:'divider', key:'divider2'},
    {label:<Button onClick={logout} danger type='link'>Logout</Button>, key:'logout'},
    ]
  }
  

  function getManagerVenueRoutes(){
    return[
      {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={navigateBackToServices}  >Back to launchpad</Text>, key:'venuesPage'},
    {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={()=>router.replace('/manager/organizations')} >Back to organizations</Text>, key:'organizationsPage'},
    {type:'divider', key:'divider0'},
    {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={navigateToProfile}  >Profile</Text>, key:'profile'},
    {type:'divider', key:'divider2'},
    {label:<Button onClick={logout} danger type='link'>Logout</Button>, key:'logout'},
    ]
  }

  function getSuperAdminRoutes(){
    return[
      {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={navigateBackToServices}  >Back to launchpad</Text>, key:'venuesPage'},
    {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={()=>router.replace('/manager/organizations')} >Back to organizations</Text>, key:'organizationsPage'},
    {type:'divider', key:'divider0'},
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
    {label:
    <div style={{ width:'100%',height:'100%', display:'block'}} >
      <div style={{width: '100%', display:'flex'}}>
      <Text ellipsis  style={{width:'100%', marginTop:'0', marginLeft:'.3em'}}>{currentUser && currentUser.name}</Text>
      <Tag color='purple' style={{ marginTop:'0', marginLeft:'.3em'}}>{currentUser && currentUser.userRoleName}</Tag>
      </div>
      <Text ellipsis type='secondary'  style={{width:'100%', marginTop:'0', marginLeft:'.3em'}}>{currentUser && currentUser.email}</Text>
    </div>, 
    key:'userData'},
    {type:'divider', key:'divider23'},
    {label:<Text style={{ width:'100%',height:'100%', display:'block'}} onClick={navigateToProfile}  >Profile</Text>, key:'profile'},
    {type:'divider', key:'divider2'},
    {label:<Button onClick={logout} danger type='link'>Logout</Button>, key:'logout'},
    ]
  }
 

    return(
      //@ts-ignore
      <Dropdown trigger={['click']} menu={{items}} >
      <div
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
            
             <Avatar size={'large'} style={{border:`2px solid ${borderColor}`}} src={`${utils.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${currentUser && currentUser.profilePic}`}/>
            
          {/* <Badge count={currentUser && currentUser.userRoleName} offset={[10, 10]}>  */}
          {/* <div style={{display:'flex', marginLeft:'.4rem', flexDirection:'column'}}> */}
            {/* <Text ellipsis  style={{width:'100%', marginTop:'0', marginLeft:'.3em'}}>{currentUser && currentUser.name}</Text> */}
            {/* <Text type='secondary' ellipsis style={{width:'150px', marginBottom:'0', marginTop:'0', marginRight:'.5em', marginLeft:'.3em'}}>{currentUser && currentUser.email}</Text> */}
          {/* </div> */}
            {/* </Badge> */}
     </div>
    </Dropdown>
    )
}
