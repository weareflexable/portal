import React,{useState} from 'react';
import {Typography,Avatar,Button} from 'antd'
import { useOrgContext } from '../../../context/OrgContext';
const {Text,Title,Paragraph} = Typography;

interface OrgSwitcherProps{
  onOpenSwitcher: ()=> void
}

export default function OrgSwitcher({onOpenSwitcher}:OrgSwitcherProps){

  const {currentOrg} =  useOrgContext()
    
    return (
                <div
                 onClick={onOpenSwitcher} 
                 style={
                    {display:'flex', 
                    cursor:'pointer', 
                    borderRadius:'50px', 
                    padding:'.5em', 
                    justifyContent:'center', 
                    alignItems:'center'
                    }}>
                  <Avatar src={currentOrg.logoUrl}/>
                  <div style={{display:'flex', flexDirection:'column'}}>
                    <Title  ellipsis level={5} style={{marginBottom:'.001em', width:'150px', marginRight:'.5em', marginLeft:'.5em'}}>{currentOrg.name}</Title>
                    <Button onClick={onOpenSwitcher} type='link' size='small' style={{padding:'0', textAlign:'start', margin:'0', marginLeft:'.5em'}}>Switch organistation</Button>
                  </div>
                </div>
          )
}
