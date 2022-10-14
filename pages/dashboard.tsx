import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
  import { Layout, Menu } from 'antd';
  import React, { useState } from 'react';
  
  const { Header, Sider, Content } = Layout;
  
  const Dashboard: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
  
    return (
      <Layout className='h-screen'>
        <Sider collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <UserOutlined />,
                label: 'Store',
              },
              {
                key: '2',
                icon: <VideoCameraOutlined />,
                label: 'Organisation staff',
              },
              {
                key: '3',
                icon: <UploadOutlined />,
                label: 'Profile',
              },
            ]}
          />
        </Sider>
        <Layout className="site-layout">
          <Header className="bg-white" style={{ padding: 0 }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
          </Header>
          <Content
            className="bg-white p-6 my-7"
            style={{
              minHeight: 280,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    );
  };

export default Dashboard