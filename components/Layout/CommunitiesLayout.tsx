import {

    UserOutlined,
    VideoCameraOutlined,
    LeftOutlined
  } from '@ant-design/icons';
  import {  Menu, Breadcrumb, Typography ,Button, Layout, MenuProps, Spin, Col, Row} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import CurrentUser from '../Header/CurrentUser/CurrentUser';
import ErrorBoundary from '../shared/ErrorBoundary/ErrorBoundary';
import OrgSwitcherModal from '../shared/OrgSwitcherModal/OrgSwitcherModal';
import ServicesSwitcherModal from '../shared/ServicesSwitcherModal/ServicesSwitcherModal';
import UnAuthenticatedView from '../shared/UnAuthenticated/UnAuthenticatedView';
import useCommunity from '../../hooks/useCommunity';




const { Header, Sider, Content } = Layout;
const {Text, Title} = Typography

  interface LayoutProps{
    children: ReactNode,
    width?: number
  }

  type PageRoute = {
    basePath: string,
    selectedRoute: string
  }
  
  const CommunitiesLayout: React.FC<LayoutProps> = ({children}) => {
    
    const {asPath, isReady} = useRouter()  
    const {isAuthenticated, currentUser, paseto} = useAuthContext()
    const {currentCommunity} = useCommunity()
    const [showSwitcherModal, setSwitcherModal] = useState(false) 
    const [showOrgSwitcher, setShowOrgSwitcher] = useState(false) 
    const [pageRoutes, setPageRoutes] = useState<PageRoute>({basePath:'',selectedRoute:'dashboard'})
    const [currentPage, setCurrentPage] = useState('communityVenues')
    const [isHydrated, setIsHydrated] = useState(false)

    const router = useRouter()

    
    // console.log('from layout',asPath)\\

    const items: MenuProps['items'] = [
        {
            key:'communityVenues',
            label: 'Community Venues'
        },
        {
            key:'bookings',
            label: 'Bookings'
        },
        {
            key:'staff',
            label: 'Staff'
        }
    ]

    const splittedRoutes = asPath.split('/')
    // console.log('is re-rendering layout')
    const selectedRoute = splittedRoutes && splittedRoutes[3]
    console.log(selectedRoute)
    splittedRoutes.pop() 

    function onClickNavItemHandler(e:any){

            router.push(`/organizations/communities/${e.key}`)
       
        setCurrentPage(e.key)
        
    }

    useEffect(() => {
      setIsHydrated(true)
      if(isReady){
        // const basePath =splittedRoutes.join('/')
        //   setPageRoutes({
        //     basePath:basePath,
        //     selectedRoute:selectedRoute,
        //   })
        setCurrentPage(selectedRoute)
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
                <div style={{display:'flex',   height:'100%', justifyContent:'space-between'}}>
                  <div style={{marginRight:'4rem', marginBottom:'0', display:'flex', alignItems:'center'}}>
                    <Button type='link' onClick={()=>router.push('/organizations/communities')} icon={<LeftOutlined />}/>
                    <Title style={{marginLeft:'.5rem', padding:'0', marginBottom:'0', display:'flex', alignItems:'center'}} level={4}>{isHydrated?currentCommunity.name:'...'}</Title>
                  </div>
                  <Menu theme="light" style={{background:'#f7f7f7'}} mode="horizontal" defaultSelectedKeys={[currentPage]} selectedKeys={[currentPage]} onSelect={onClickNavItemHandler} items={items} />
                </div> 

                <div style={{display:'flex', justifyContent:'flex-end'}}>
                  {
                      !isAuthenticated ? <Button type='primary' onClick={()=>{location.href=`${process.env.NEXT_PUBLIC_AUTH}/login?redirect_to=portal`}}>Login</Button>
                      :(
                        <div style={{display:'flex'}}>
                          {/* <ServiceSwitcherButton onOpenSwitcher={()=>setSwitcherModal(!showSwitcherModal)}/> */}
                          <CurrentUser openOrgSwitcher={()=>setShowOrgSwitcher(!showOrgSwitcher)} user={{email:'mbappai@yahoo.com',role:'admin'}}/>
                        </div>
                        )
                   }
                </div>
            </Col>

            </Header> 
                       
            <Col offset={1} span={22}>
              <Layout style={{width:'100%',height:'100%'}}>
                  {isAuthenticated? children : <UnAuthenticatedView/>}
              </Layout>
              </Col>
            </Row>
      </Layout>
      </ErrorBoundary>
    );
  };

export default CommunitiesLayout

