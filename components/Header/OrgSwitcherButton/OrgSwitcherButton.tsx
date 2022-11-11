import React,{useState} from 'react';
import {Typography,Avatar} from 'antd'
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
                    background:'#f4f4f4' , 
                    borderRadius:'50px', 
                    padding:'.5em', 
                    justifyContent:'center', 
                    alignItems:'center'
                    }}>
                  <Avatar src={currentOrg.logoUrl}/>
                  <Text style={{marginBottom:0, marginRight:'.5em', marginLeft:'1em'}}>{currentOrg.name}</Text>
                </div>
          )
}
