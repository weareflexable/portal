import React,{useState} from 'react';
import {Typography,Avatar,Button} from 'antd'
import { useServicesContext } from '../../../context/ServicesContext';
import { useAuthContext } from '../../../context/AuthContext';
const {Text,Title,Paragraph} = Typography;

interface ServiceSwitcherProps{
  onOpenSwitcher: ()=> void
}

export default function ServiceSwitcher({onOpenSwitcher}:ServiceSwitcherProps){

  const {currentService} =  useServicesContext()
  const {currentUser} = useAuthContext()
  console.log(currentUser)
    
    return (
                <div
                 style={
                    {display:'flex', 
                    cursor:'pointer', 
                    borderRadius:'50px', 
                    padding:'.5em', 
                    justifyContent:'center', 
                    alignItems:'center'
                    }}>
                  <Avatar src={`https://nftstorage.link/ipfs/${currentService.logoImageHash}`}/>
                  <div style={{display:'flex', flexDirection:'column'}}>
                    <Title  ellipsis level={5} style={{marginBottom:'.001em', width:'150px', marginRight:'.5em', marginLeft:'.5em'}}>{currentService.name}</Title>
                    {currentUser.role == 1? null : <Button onClick={onOpenSwitcher} type='link' size='small' style={{padding:'0', textAlign:'start', margin:'0', marginLeft:'.5em'}}>Switch service</Button>}
                  </div>
                </div>
          )
}
