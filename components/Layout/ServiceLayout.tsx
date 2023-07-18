import { ReactNode, useEffect, useState } from "react"
import {Typography, Row, Col, Button, Skeleton, Layout, Segmented, Menu, MenuProps} from 'antd'
import CurrentUser from "../Header/CurrentUser/CurrentUser"
import { useOrgContext } from "../../context/OrgContext"
import { useRouter } from "next/router"
import {ArrowLeftOutlined} from '@ant-design/icons'


const { Header } = Layout;
const {Title} =  Typography

interface ServiceLayoutProps{
    children: ReactNode
}

export default function ServiceLayout({children}:ServiceLayoutProps){

    const {currentOrg} = useOrgContext() 
    const router = useRouter()
    const [isHydrated, setIsHydrated] = useState(false)
    const [selectedPage, setSelectedPage] = useState('venues')


    const splittedRoutes = router.pathname.split('/')
    const selectedRoute = splittedRoutes && splittedRoutes[2]
    // console.log(pageName[2])

    const items: MenuProps['items'] = [
        {
            key:'billings',
            label: 'Billings'
        }
    ]

    const secondaryItems: MenuProps['items'] = [
        {
            key:'venues',
            label: 'Venues'
        },
        {
            key:'communities',
            label: 'Communities'
        },
        {
            key:'events',
            label: 'Events'
        }
    ]

    useEffect(() => {
        setIsHydrated(true)
        if(router.isReady){
            setSelectedPage(selectedRoute)
        }
      }, [])
  


    function onChangeHandler(e:any){
        router.push(`/organizations/${e.key}`)
        // if(e.key === 'venues'){
        //     router.push('/organizations/venues')
        // }else if(e.key === 'communities'){
        //     router.push('/organizations/communities')
        // }else{
        //     router.push('/organizations/billings')
        // }

        setSelectedPage(e.key) 
    }
  

    return(
        <div style={{background:'#f7f7f7', minHeight:'100vh'}}>
        <Row style={{marginTop:'.5em'}} gutter={[16,16]}>
        <Header style={{background:'#f7f7f7',borderBottom:'1px solid', borderBottomColor:'#e3e3e3', justifyContent:'space-between', width:'100%', display:'flex', alignItems:'center'}}>
                <Col style={{display:'flex', justifyContent:'space-between'}} offset={1} span={22}>
                    <div style={{display:'flex', flex:'7',alignItems:'center'}}> 
                        <Button style={{display:'flex', padding: '0', margin:'0', alignItems:'center', textAlign:'left'}} onClick={()=>router.replace('/')} icon={<ArrowLeftOutlined rev={undefined} />} type='link'/>
                        {isHydrated ? <Title style={{margin:'0'}} level={4}>{currentOrg.name}</Title>:<Skeleton.Input active size='default'/> } 
                    </div>

                    {
                    isHydrated
                    ?<div style={{ display:'flex', flex:'5',  width:'100%', justifyContent:'flex-end', alignItems:'center'}}>
                        <Menu theme="light" style={{ background:'#f7f7f7', width:'20%'}} mode="horizontal" defaultSelectedKeys={[selectedPage]} selectedKeys={[selectedPage]} onSelect={onChangeHandler} items={items} />
                        <CurrentUser/>
                    </div>
                    : <Skeleton.Input active size='default'/>
                }
                </Col>
            </Header>
                <Col style={{display:'flex', justifyContent:'space-between'}} offset={1} span={22}>
                 <Menu theme="light" style={{ background:'#f7f7f7', width:'100%'}} mode="horizontal" defaultSelectedKeys={[selectedPage]} selectedKeys={[selectedPage]} onSelect={onChangeHandler} items={secondaryItems} />
                </Col>
            <Col offset={1} span={22}>
                {children}
            </Col>
        </Row>
        </div>
    )
}