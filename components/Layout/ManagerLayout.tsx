import {
    UserOutlined,
    BankOutlined,
    BranchesOutlined,
    PieChartOutlined,
    BookOutlined
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
// import OrgSwitcherModal from '../OrgSwitcherModal/OrgSwitcherModal';
// import ServicesSwitcherModal from '../ServicesSwitcherModal/ServicesSwitcherModal';
import UnAuthenticatedView from '../shared/UnAuthenticated/UnAuthenticatedView';



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
  
  const ManagerLayout: React.FC<LayoutProps> = ({children}) => {
    
    const {asPath,push,query,isReady} = useRouter()  
    const {isAuthenticated} = useAuthContext()
    // const [showSwitcherModal, setSwitcherModal] = useState(false) 
    const [showOrgSwitcher, setShowOrgSwitcher] = useState(false) 
    const [pageRoutes, setPageRoutes] = useState<PageRoute>({basePath:'',selectedRoute:'dashboard'})
    const [selectedPage, setSelectedPage] = useState('organizations')

  

    const splittedRoutes = asPath.split('/')
    const routeFromURl = splittedRoutes && splittedRoutes[2]
    splittedRoutes.pop()
    

    useEffect(() => {
      if(isReady){
        const basePath =splittedRoutes.join('/')
        //   setPageRoutes({
        //     basePath:basePath,
        //     selectedRoute:selectedRoute,
        //   })
        setSelectedPage(routeFromURl)
        }
    }, [isReady])


    
    if(!isReady){
      <div style={{width:'100vw', height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
        return <Spin size='large'/>
      </div>
    }

    function onClickNavItemHandler(e:any){

      // push(`/manager/${e.key}`)
      setSelectedPage(e.key)
        
    }
  
    return (
   <ErrorBoundary name={`Layout for ${pageRoutes.basePath}`} >
      <Layout style={{minHeight:'100vh',height:'100%'}}>
          <Row>
            <Header style={{background:'white', width:'100%', display:'flex',  justifyContent:'space-between', alignItems:'center'}}>
              <Col style={{display:'flex', justifyContent:'space-between',alignItems:'center'}} offset={0} span={24}>
                  <div style={{display:'flex', width:'100%',  height:'100%', justifyContent:'space-between'}}>
                    {/* <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link  href={`/manager/organizations`} ><a style={{color:`${selectedRoute==='organizations'?'#1890ff':'black'}`}}>Organizations</a></Link> </div>
                    <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link  href={`/manager/bookings`} ><a style={{color:`${selectedRoute==='bookings'?'#1890ff':'black'}`}}>Bookings</a></Link> </div> 
                    <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link  href={`/manager/users`} ><a style={{color:`${selectedRoute==='users'?'#1890ff':'black'}`}}>Users</a></Link> </div> 
                    <div style={{height:'100%',display:'flex',alignItems:'center'}}> <Link  href={`/manager/platform/service-types`} ><a style={{color:`${selectedRoute==='platform'?'#1890ff':'black'}`}}>Platform</a></Link> </div>  */}
                    <Menu theme="light" style={{height:'100%', width:'100%'}} mode="horizontal" defaultSelectedKeys={[selectedPage]} selectedKeys={[selectedPage]} onSelect={onClickNavItemHandler} items={navItems} />
                  </div>

                  <div style={{display:'flex', justifyContent:'flex-end'}}>

                    { !isAuthenticated ? <Button type='primary' shape='round' onClick={()=>{location.href=`${process.env.NEXT_PUBLIC_AUTH}/login?redirect_to=portal`}}>Login</Button>:
                      <CurrentUser openOrgSwitcher={()=>setShowOrgSwitcher(!showOrgSwitcher)} user={{email:'mbappai@yahoo.com',role:'admin'}}/>
                    }
                    </div>
                      
              </Col>
             </Header> 
              
            {/* <Sider collapsible width={200}>
                <Menu

                  // mode="inline"
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  style={{ height: '100%' }}
                  items={navItems}
                />
            </Sider> */}
                     
              
          </Row>
          <Layout style={{width:'100%',height:'100%'}}>
              {isAuthenticated? children : <UnAuthenticatedView/>}
          </Layout>
      </Layout>
      </ErrorBoundary>
    );
  };

export default ManagerLayout


const navItems=[
  // {
  //   key:'dashboard',
  //   label: <Link href='/manager/dashboard'>Dashboard</Link>,
  //   icon:<PieChartOutlined />
  // },
  {
    key:'organizations',
    label:<Link href='/manager/organizations'>Organizations</Link>,
    icon: <BranchesOutlined />
  },
  {
    key:'bookings',
    label:<Link href='/manager/bookings'>Bookings</Link>,
    icon: <BookOutlined />
  },
  {
    key:'users',
    label:<Link href='/manager/users'>Users</Link>,
    icon: <UserOutlined />
  },
  {
    key:'platform',
    label:<Link href='/manager/platform/services'>Platform</Link>,
    icon: <BankOutlined />
  },
]