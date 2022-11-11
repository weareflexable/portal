import React,{useState} from 'react';
import {Typography,Space,Dropdown, MenuProps,Menu,Avatar} from 'antd'
import {DownOutlined} from '@ant-design/icons'
import { useOrgContext } from '../../../context/OrgContext';
const {Text,Title,Paragraph} = Typography;


export default function OrgSwitcher(){

  const {currentOrg} =  useOrgContext()
    
    return (
                <div
                 onClick={()=>console.log('show modal to switch')} 
                 style={
                    {display:'flex', 
                    cursor:'pointer', 
                    background:'#f4f4f4' , 
                    borderRadius:'50px', 
                    padding:'.5em', 
                    justifyContent:'center', 
                    alignItems:'center'
                    }}>
                  <Avatar src={''}/>
                  <Text style={{marginBottom:0, marginRight:'.5em', marginLeft:'1em'}}>Mujeex Labs</Text>
                </div>
          )
}
