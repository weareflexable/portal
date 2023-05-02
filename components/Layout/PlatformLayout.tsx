import { Spin, Menu, Col, Row, Typography, Layout } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState, useEffect } from "react";
import ManagerLayout from "./ManagerLayout";
const {Content} = Layout

const {Title} = Typography


interface PlatformLayoutProps{
    children: ReactNode
  }
  
  export default function PlatformLayout({children}:PlatformLayoutProps){
    const {asPath,push,query,isReady} = useRouter()  
  
      const [selectedPage, setSelectedPage] = useState('service-types')
  
    
  
      const splittedRoutes = asPath.split('/')
      const routeFromUrl = splittedRoutes && splittedRoutes[3]
      splittedRoutes.pop()
  
      
  
      useEffect(() => {
        if(isReady){
            setSelectedPage(routeFromUrl)
          }
      }, [isReady])
  
  
      function onClickNavItemHandler(e:any){
        // push(`/manager/${e.key}`)
        setSelectedPage(e.key)
          
      }
  
  
      
      if(!isReady){
        <div style={{width:'100vw', height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
          return <Spin size='large'/>
        </div>
      }
    
    return(
      <ManagerLayout>
        <Row>
        <Col offset={1} span={22}>
            <Title style={{marginTop:'1em', marginLeft:'0'}} level={2}>Platform</Title>
            <Content
                style={{
                width:`98%`,
                maxWidth:'100%',
                }}
            >

         <div style={{display:'flex',  marginTop:'.8rem', marginBottom:'2.5rem',  height:'100%', justifyContent:'space-between'}}>
            <Menu theme="light" style={{height:'100%', background:'#f7f7f7', width:'100%'}} mode="horizontal" defaultSelectedKeys={[selectedPage]} selectedKeys={[selectedPage]} onSelect={onClickNavItemHandler} items={navItems} />
          </div>
          {children}
        </Content>
        </Col>
        </Row>
      </ManagerLayout>  
      
    )
  }
  
  
  const navItems=[
    // {
    //   key:'dashboard',
    //   label: <Link href='/manager/dashboard'>Dashboard</Link>,
    //   icon:<PieChartOutlined />
    // },
    {
      key:'service-types',
      label:<Link href='/manager/platform/service-types'>Service Types</Link>,
    },
    {
      key:'service-item-types',
      label:<Link href='/manager/platform/service-item-types'>Service Item Types</Link>,
    }
  ]
