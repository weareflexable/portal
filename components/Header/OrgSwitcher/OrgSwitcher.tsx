import React,{useState} from 'react';
import {Typography,Space,Dropdown, MenuProps,Menu} from 'antd'
const {Text,Title} = Typography;


interface OrgSwitcherProps{
    org: string
}

const menuArray = [
    {
      label: 'Conura org',
      key: '1',
    },
    {
      label: 'Mike banas inc',
      key: '2',
    },
  ];

export default function OrgSwitcher({org='Avery Juice'}:OrgSwitcherProps){

    const [currentOrg,setCurrentOrg] = useState(org)

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {

        const key=  e.target
        console.log(e.target)
      };
      
      const handleMenuClick: MenuProps['onClick'] = e => {
        console.log('click', e);
      };

const menu = (
    <Menu
      onClick={handleMenuClick}
      items={menuArray}
    />
  );

    
    return (
            <Dropdown.Button onClick={handleButtonClick} overlay={menu}>
              <Space direction='vertical' className='flex-col'>
                <Text>{currentOrg}</Text>
              </Space>
            </Dropdown.Button>
          )
}
