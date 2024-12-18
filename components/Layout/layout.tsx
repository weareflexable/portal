import {

    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
  import {  Menu, Breadcrumb, Typography ,Button, Layout, MenuProps, Spin, Col, Row} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import CurrentUser from '../Header/CurrentUser/CurrentUser';
import OrgSwitcher from '../Header/OrgSwitcherButton/OrgSwitcherButton';
import ServiceSwitcherButton from '../Header/ServicesSwitcherButton/ServicesSwitcherButton';
import ErrorBoundary from '../shared/ErrorBoundary/ErrorBoundary';
import OrgSwitcherModal from '../shared/OrgSwitcherModal/OrgSwitcherModal';
import ServicesSwitcherModal from '../shared/ServicesSwitcherModal/ServicesSwitcherModal';
import UnAuthenticatedView from '../shared/UnAuthenticated/UnAuthenticatedView';
import utils from '../../utils/env';




const { Header, Sider, Content } = Layout;
const {Text} = Typography

  interface LayoutProps{
    children: ReactNode,
    width?: number
  }

  type PageRoute = {
    basePath: string,
    selectedRoute: string
  }
  
  const AppLayout: React.FC<LayoutProps> = ({children}) => {
    
    const {asPath, isReady} = useRouter()  
    const {isAuthenticated, currentUser, paseto} = useAuthContext()
    const [showSwitcherModal, setSwitcherModal] = useState(false) 
    const [showOrgSwitcher, setShowOrgSwitcher] = useState(false) 
    const [pageRoutes, setPageRoutes] = useState<PageRoute>({basePath:'',selectedRoute:'dashboard'})

    
    // console.log('from layout',asPath)

    const splittedRoutes = asPath.split('/')
    // console.log('is re-rendering layout')
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
  
    return (
   <ErrorBoundary name={`Layout for ${pageRoutes.basePath}`} >
      <Layout style={{minHeight:'100vh',height:'100%'}}>
      { showOrgSwitcher?<OrgSwitcherModal
          isModalOpen={showOrgSwitcher}
          onCloseModal={()=>setShowOrgSwitcher(!showOrgSwitcher)}
        />:null}
        {showSwitcherModal?<ServicesSwitcherModal
          isModalOpen={showSwitcherModal} 
          onCloseModal={()=>setSwitcherModal(!showSwitcherModal)}
        />:null}

          <Row>
          <Header style={{background:'#f7f7f7',borderBottom:'1px solid', borderBottomColor:'#e3e3e3', justifyContent:'space-between', width:'100%', display:'flex', alignItems:'center'}}>
                  
            <Col style={{display:'flex', justifyContent:'space-between',alignItems:'center'}} span={23}>
                <div style={{display:'flex', width:'200px',  height:'100%', justifyContent:'space-between'}}>
                  {/* <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link  href={`${pageRoutes.basePath}/dashboard`} ><a style={{color:`${selectedRoute==='dashboard'?'#1890ff':'black'}`}}>Dashboard</a></Link> </div> */}
                  <div style={{height:'100%',display:'flex',alignItems:'flex-start'}}> <Link  href={`${pageRoutes.basePath}/serviceItems`} ><a style={{color:`${selectedRoute==='serviceItems'?'#1890ff':'black'}`}}>Services</a></Link></div> 
                  <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link  href={`${pageRoutes.basePath}/bookings`} ><a style={{color:`${selectedRoute==='bookings'?'#1890ff':'black'}`}}>Bookings</a></Link> </div>
                  <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link  href={`${pageRoutes.basePath}/staff`} ><a style={{color:`${selectedRoute==='staff'?'#1890ff':'black'}`}}>Staff</a></Link> </div>
                  {/* <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link  href={`${pageRoutes.basePath}/billings`} ><a style={{color:`${selectedRoute==='billings'?'#1890ff':'black'}`}}>Billings</a></Link> </div> */}
                </div> 

                <div style={{display:'flex', justifyContent:'flex-end'}}>
                  {
                      !isAuthenticated ? <Button type='primary' onClick={()=>{location.href=`${utils.NEXT_PUBLIC_AUTH}/login?redirect_to=portal`}}>Login</Button>
                      :(
                        <div style={{display:'flex'}}>
                          <ServiceSwitcherButton onOpenSwitcher={()=>setSwitcherModal(!showSwitcherModal)}/>
                          <CurrentUser openOrgSwitcher={()=>setShowOrgSwitcher(!showOrgSwitcher)} user={{email:'mbappai@yahoo.com',role:'admin'}}/>
                        </div>
                        )
                   }
                </div>
            </Col>

                </Header> 
                    
              
            </Row>
              <Layout style={{width:'100%',height:'100%'}}>
                  {isAuthenticated? children : <UnAuthenticatedView/>}
              </Layout>
      </Layout>
      </ErrorBoundary>
    );
  };

export default AppLayout

