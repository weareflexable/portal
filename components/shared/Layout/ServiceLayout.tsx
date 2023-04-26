import { ReactNode, useEffect, useState } from "react"
import {Typography, Row, Col, Button, Skeleton, Segmented} from 'antd'
import CurrentUser from "../../Header/CurrentUser/CurrentUser"
import { useOrgContext } from "../../../context/OrgContext"
import { useRouter } from "next/router"
import {ArrowLeftOutlined} from '@ant-design/icons'

const {Title} =  Typography

interface ServiceLayoutProps{
    children: ReactNode
}

export default function ServiceLayout({children}:ServiceLayoutProps){

    const {currentOrg} = useOrgContext() 
    const router = useRouter()
    const [isHydrated, setIsHydrated] = useState(false)
    const [selectedPage, setSelectedPage] = useState('communities')

    const pageName = router.pathname.split('/')
    // console.log(pageName[2])

    useEffect(() => {
        setIsHydrated(true)
        if(router.isReady){
            console.log(pageName[2])
            setSelectedPage(pageName[2])
        }
      }, [])
  

    function gotoBillingsPage(){
        router.push('/organizations/billings')
      }

    function onChangeHandler(e:any){
        console.log(e)
        if(e === 'venues'){
            router.push('/organizations/venues')
        }else{
            router.push('/organizations/communities')
        }

        setSelectedPage(e)
    }
  

    return(
        <div style={{background:'#f7f7f7', minHeight:'100vh'}}>
        <Row style={{marginTop:'.5em'}} gutter={[16,16]}>
            <header style={{width:'100%', padding:'1rem 0' , background:'#ffffff'}}>
                <Col style={{display:'flex', justifyContent:'space-between'}} offset={1} span={22}>
                    <div style={{display:'flex', flex:'7',alignItems:'center'}}> 
                        <Button style={{display:'flex', padding: '0', margin:'0', alignItems:'center', textAlign:'left'}} onClick={()=>router.replace('/')} icon={<ArrowLeftOutlined />} type='link'/>
                        {isHydrated ? <Title style={{margin:'0'}} level={4}>{currentOrg.name}</Title>:<Skeleton.Input active size='default'/> } 
                    </div>

                    {
                    isHydrated
                        ?<div style={{ display:'flex', flex:'3', justifySelf:'flex-end', alignItems:'center'}}>
                        <Button type="link" style={{marginRight:'2rem'}} onClick={gotoBillingsPage} >Billings</Button>
                        <CurrentUser/>
                    </div>
                    : <Skeleton.Input active size='default'/>
                    }
                </Col>
            </header>
            <Col offset={1} span={22}>
                <div style={{width:'100%', display:'flex', justifyContent:'center'}}>
                    {/* @ts-ignore */}
                <Segmented  size="large" onChange={onChangeHandler} style={{background:'#e5e5e5', marginBottom: '2rem'}} value={selectedPage} options={[{label:'Venues',value:'venues'},{label:'Communities',value:'communities'}]}/>
                </div>
                {children}
            </Col>
        </Row>
        </div>
    )
}