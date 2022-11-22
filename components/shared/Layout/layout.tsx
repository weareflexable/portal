import {

    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
  import {  Menu, Breadcrumb, Typography ,Button, Layout, MenuProps} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';
import { useAuthContext } from '../../../context/AuthContext';
import CurrentUser from '../../Header/CurrentUser/CurrentUser';
import OrgSwitcher from '../../Header/OrgSwitcherButton/OrgSwitcherButton';
import ServiceSwitcherButton from '../../Header/ServicesSwitcherButton/ServicesSwitcherButton';
import OrgSwitcherModal from '../OrgSwitcherModal/OrgSwitcherModal';
import ServicesSwitcherModal from '../ServicesSwitcherModal/ServicesSwitcherModal';
import UnAuthenticatedView from '../UnAuthenticated/UnAuthenticatedView';



const { Header, Sider, Content } = Layout;

  interface LayoutProps{
    children: ReactNode,
    width?: number
  }

  
  const AppLayout: React.FC<LayoutProps> = ({children,width=80}) => {
    
    const {asPath,push} = useRouter()  
    const {isAuthenticated,setIsAuthenticated} = useAuthContext()
    const [showSwitcherModal, setSwitcherModal] = useState(false) 
    const [showOrgSwitcher, setShowOrgSwitcher] = useState(false) 
    
    const splittedRoutes = asPath.split('/')
    const selectedRoute = splittedRoutes[5]
    splittedRoutes.pop()
    const basePath = splittedRoutes.join('/')
  
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
                  defaultSelectedKeys={[selectedRoute]}
                  items={[
                    {
                      key: 'dashboard',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link style={{border: '1px solid'}} type='link' href={`${basePath}/dashboard`}>Dashboard</Link> </div> ,
                    },
                    {
                      key: 'bookings',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link type='link' href={`${basePath}/bookings`}>Bookings</Link> </div> ,
                    },
                    {
                      key: 'serviceItems',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link type='link' href={`${basePath}/serviceItems`}>Service Items</Link> </div> ,
                    },
                    {
                      key: 'staff',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link type='link' href={`${basePath}/staff`}>Staff</Link> </div> ,
                    },
                    {
                      key: 'billings',
                      label: <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link type='link' href={`${basePath}/billings`}>Billings</Link> </div> ,
                    },
                  ]}
                />
                {
                  !isAuthenticated ? <Button type='primary' onClick={()=>push('/login')}>Login</Button>
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