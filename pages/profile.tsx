import {useState} from 'react'
import {Form,Input,Col, Image, Row, Select, Upload, Button, Layout, Typography, Avatar} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import AppLayout from '../components/shared/Layout/layout';
const {Option} = Select
const {Title} = Typography;
const {Content} = Layout

const countryList = require('country-list')
import codes from 'country-calling-code';
// import CountryList from 'country-list-with-dial-code-and-flag'


const getBase64 = (file: any): Promise<string> => 
new Promise((resolve, reject) => {
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = () => resolve(reader.result as string);
reader.onerror = (error) => reject(error);
});

console.log(codes) 

export default function Profile(){

    const placeholder = 'placeholder.png'
    const [profilePic, setProfilePic] = useState(placeholder)

    // check if user has uploaded profile picture
    const isProfilePic = profilePic !== placeholder

    function handleEditProfile(formData:any){
        console.log(formData)
    }

    function onSelectCountry(value:any){
        console.log(value)
    }

    function removePic(){
        setProfilePic(placeholder)
    }


    const normFile = async(e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }

        console.log(e)
        const imageBlob = e.fileList[0].originFileObj
        const src = await getBase64(imageBlob)
        setProfilePic(src)
        // console.log(src)
       

        return e?.fileList;
      };


    return(
        <AppLayout>
        <Row>
            <Col offset={1} span={21}>
                <Title style={{marginLeft: '1em', marginTop:'1em'}} level={2}>User Profile</Title>
                <Content
                    style={{
                    padding: '1em',
                    margin:'1em',
                    background:'white' ,
                    width:`50%`,
                    maxWidth:'100%',
                    // height: '100%',
                    // minHeight:'70vh',
                    }}
                > 

            <Form
                // form={form}
                layout='vertical'
                name="userProfile"
                onFinish={handleEditProfile}
                scrollToFirstError
            >
                    {/* <Form.Item> */}

                    <Image src={profilePic} alt='Profile picture' style={{borderRadius:'200px',objectFit:'cover',border:'1px solid #e5e5e5'}} height={200} width={200}/>  
                    {/* </Form.Item> */}
                    <Form.Item
                        name="profilePic"
                        // label="Profile picture"
                        valuePropName="profilePic"
                        rules={[{ required: true, message: 'Please upload a profile image!' }]}
                        getValueFromEvent={normFile}
                    >


                            <Upload name="profilePic" multiple={false} fileList={[]} >
                                <Button size='small' type='link' icon={<UploadOutlined />}>Upload profile picture</Button>
                            </Upload>

                    </Form.Item>

                    <Form.Item
                        name="fullName"
                        label="Full name"
                        hasFeedback
                        rules={[ 
                        {
                            type: 'string',
                            message: 'The input is not a valid name!',
                        },
                        {
                            required: true,
                            message: 'Please input your full name!',
                        },
                        ]}
                    >
                        <Input placeholder='Ryan Prochna' />
                    </Form.Item>

                    <Form.Item
                        name="country"
                        label="Country"
                        rules={[{ required: true, message: 'Please select your country !' }]}
                    >
                        <Select
                        placeholder="United states of America"
                        onChange={onSelectCountry}
                        defaultValue={'USA'}
                        allowClear
                        >
                            {countryList.getData().map((country:any)=>(
                                <Option key={country.code} value={country.code}>{country.name}</Option>
                            ))}
                        </Select>
                    </Form.Item> 

                    <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                    >
                        <Input addonBefore={prefixSelector} placeholder={'44124321'} style={{ width: '100%' }} />
                    </Form.Item>


                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                        Apply changes
                        </Button>
                    </Form.Item>

            </Form>

                </Content>
            </Col>
        </Row>
    </AppLayout>
           
    )
}


// const countryList = [
//     {
//         value: 'USA',
//         label: 'United States of America'
//     },
//     {
//         value: 'India',
//         label: 'India'
//     },
//     {
//         value: 'Nigeria',
//         label: 'Nigeria'
//     },
// ]

const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select defaultValue={'1'} style={{ width: 120 }}>
        {codes.map(code=>
            <Option key={code.country} value={code.countryCodes[0]}>+{code.countryCodes[0]}</Option>
        )}
        {/* <Option value="86">+86</Option>
        <Option value="87">+87</Option>
        <Option value="234">+234</Option> */}
      </Select>
    </Form.Item>
  );