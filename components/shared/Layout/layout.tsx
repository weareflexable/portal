import {

    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
  import {  Menu, Breadcrumb, Typography ,Button, Layout, MenuProps, Spin} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useState, useEffect } from 'react';
import { useAuthContext } from '../../../context/AuthContext';
import CurrentUser from '../../Header/CurrentUser/CurrentUser';
import OrgSwitcher from '../../Header/OrgSwitcherButton/OrgSwitcherButton';
import ServiceSwitcherButton from '../../Header/ServicesSwitcherButton/ServicesSwitcherButton';
import OrgSwitcherModal from '../OrgSwitcherModal/OrgSwitcherModal';
import ServicesSwitcherModal from '../ServicesSwitcherModal/ServicesSwitcherModal';
import UnAuthenticatedView from '../UnAuthenticated/UnAuthenticatedView';



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
  
  const AppLayout: React.FC<LayoutProps> = ({children,width=80}) => {
    
    const {asPath,push,query,isReady} = useRouter()  
    const {isAuthenticated,setIsAuthenticated} = useAuthContext()
    const [showSwitcherModal, setSwitcherModal] = useState(false) 
    const [showOrgSwitcher, setShowOrgSwitcher] = useState(false) 
    const [pageRoutes, setPageRoutes] = useState<PageRoute>({basePath:'',selectedRoute:'dashboard'})

    
    
    
    const handleRoute=(route:string)=>{
      push(`${pageRoutes.basePath}/${route}`)
    }

    useEffect(() => {
      if(isReady){
        const splittedRoutes = asPath.split('/')
        const selectedRoute = splittedRoutes && splittedRoutes[5]
        splittedRoutes.pop()
        const basePath =splittedRoutes.join('/')

          setPageRoutes({
            basePath:basePath,
            selectedRoute:selectedRoute,

          })
        }
    }, [isReady,asPath])

    console.log(pageRoutes)
    
    if(!isReady){
      <div style={{width:'100vw', height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
        return <Spin size='large'/>
      </div>
    }
  
    return (

      <Layout style={{minHeight:'100vh',height:'100%'}}>
      { showOrgSwitcher?<OrgSwitcherModal
          isModalOpen={showOrgSwitcher}
          onCloseModal={()=>setShowOrgSwitcher(!showOrgSwitcher)}
        />:null}
        {showSwitcherModal?<ServicesSwitcherModal
          isModalOpen={showSwitcherModal} 
          onCloseModal={()=>setSwitcherModal(!showSwitcherModal)}
        />:null}

              <Header style={{lineHeight:'1.4',background:'white', width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <Menu
                style={{height:'100%',display:'flex', flex:'3'}}
                  theme="light"
                  mode="horizontal"
                  defaultSelectedKeys={[pageRoutes.selectedRoute]}
                  items={[
                    {
                      key: 'dashboard',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link  href={`${pageRoutes.basePath}/dashboard`} ><a>Dashboard</a></Link> </div> ,
                    },
                    {
                      key: 'bookings',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link  href={`${pageRoutes.basePath}/bookings`} ><a>Bookings</a></Link> </div> ,
                    },
                    {
                      key: 'serviceItems',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link  href={`${pageRoutes.basePath}/serviceItems`} ><a>Service Items</a></Link> </div> ,
                    },
                    {
                      key: 'staff',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link  href={`${pageRoutes.basePath}/staff`} ><a>Staff</a></Link> </div> ,
                    },
                    {
                      key: 'billings',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link  href={`${pageRoutes.basePath}/dashboard`} ><a>Billings</a></Link> </div> ,
                    },
                  ]}
                />
                {
                  !isAuthenticated ? <Button type='primary' onClick={()=>{location.href=`${process.env.NEXT_PUBLIC_AUTH}/login?redirect_to='portal`}}>Login</Button>
                  :(
                    <div style={{display:'flex',flex:'2'}}>
                      <ServiceSwitcherButton onOpenSwitcher={()=>setSwitcherModal(!showSwitcherModal)}/>
                      <CurrentUser openOrgSwitcher={()=>setShowOrgSwitcher(!showOrgSwitcher)} user={{email:'mbappai@yahoo.com',role:'admin'}}/>
                    </div>
                    )
                }
    
              </Header> 
              <Layout style={{width:'100%',height:'100%'}}>
                  {isAuthenticated? children : <UnAuthenticatedView/>}
              </Layout>
      </Layout>
    );
  };

export default AppLayout