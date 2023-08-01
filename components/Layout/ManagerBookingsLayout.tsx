import { Col, Row, Layout, Menu, Typography } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ManagerLayout from "./ManagerLayout";

const {Content} = Layout
const {Title} =  Typography

interface Props{
    children: ReactNode
}
export default function ManagerBookingsLayout({children}:Props){

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


    return(
        <ManagerLayout>
            <Row>
         <Col offset={1} span={22}>
            <Title style={{marginTop:'1rem', marginLeft:'0'}} level={2}>Bookings</Title>
            <Content
                style={{
                width:`100%`,
                maxWidth:'100%',
                }}
            >
         <div style={{display:'flex',  marginTop:'.8rem', marginBottom:'2rem',  height:'100%', justifyContent:'space-between'}}>
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
    {
      key:'venues',
      label:<Link href='/manager/bookings/venues'>Venues</Link>,
    },
    {
      key:'communities',
      label:<Link href='/manager/bookings/communities'>Communities</Link>,
    },
    {
      key:'events',
      label:<Link href='/manager/bookings/events'>Events</Link>,
    }
  ]