import { Button, Col, Row, Layout, Typography, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
const {Title} = Typography
const {Content} = Layout
import ManagerLayout from "../../../components/Manager/Layout/Layout";
import ServiceTypesView from "../../../components/Manager/Platform/serviceTypesView";

export default function Platform(){
    return(
        <ManagerLayout>
            <Row>
                <Col offset={1} span={22}>
                    <Title style={{marginTop:'1em'}} level={2}>Platform</Title>
                    <Content
                        style={{
                        margin:'1em', 
                        width:`98%`,
                        maxWidth:'100%',
                        }}
                    >
                      <PlatformLayout>
                        <ServiceTypesView/>
                      </PlatformLayout>
                    </Content>
                </Col>
            </Row>
        </ManagerLayout>
    )
}

interface PlatformLayoutProps{
  children: ReactNode
}

function PlatformLayout({children}:PlatformLayoutProps){
  const {asPath,push,query,isReady} = useRouter()  
    const [pageRoutes, setPageRoutes] = useState({basePath:'',selectedRoute:'dashboard'})

    const splittedRoutes = asPath.split('/')
    const selectedRoute = splittedRoutes && splittedRoutes[3]
    splittedRoutes.pop()

    

    useEffect(() => {
      if(isReady){
        const basePath =splittedRoutes.join('/')
          setPageRoutes({
            basePath:basePath,
            selectedRoute:selectedRoute,
          })
        }
    }, [isReady])


    
    if(!isReady){
      <div style={{width:'100vw', height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
        return <Spin size='large'/>
      </div>
    }
  
  return(
    <div>
       <div style={{display:'flex', width:'250px', marginTop:'2rem', marginBottom:'2rem',  height:'100%', justifyContent:'space-between'}}>
          <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link  href={`/manager/platform/service-types`} ><a style={{color:`${selectedRoute==='service-types'?'#1890ff':'black'}`}}>Service types</a></Link> </div> 
          <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link  href={`/manager/platform/service-item-types`} ><a style={{color:`${selectedRoute==='service-item-types'?'#1890ff':'black'}`}}>Service-item types</a></Link> </div>
        </div>
        {children}
    </div>
  )
}