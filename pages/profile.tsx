import {useEffect, useState} from 'react'
import {Form,Input,Col, Image, Row, Select, Upload, Button, Layout, Typography, Avatar, Spin, Space, Radio, Skeleton} from 'antd'
import {UploadOutlined, ArrowLeftOutlined} from '@ant-design/icons'
import {QueryClient, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

const {Option} = Select
const {Title,Text} = Typography;
const {Content} = Layout

const countryList = require('country-list')
import codes from 'country-calling-code';
import { useRouter } from 'next/router';
import { useAuthContext } from '../context/AuthContext';
import CurrentUser from '../components/Header/CurrentUser/CurrentUser';
import axios from 'axios';
import { asyncStore } from '../utils/nftStorage';



const getBase64 = (file: any): Promise<string> => 
new Promise((resolve, reject) => {
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = () => resolve(reader.result as string);
reader.onerror = (error) => reject(error);
});



export default function Profile(){

    // placeholder hash on nft.storage
    const placeholder = 'bafkreic3hz2mfy7rpyffzwbf2jfklehmuxnvvy3ardoc5vhtkq3cjd7of4'

    const [profilePic, setProfilePic] = useState<string>(placeholder)
    const router  = useRouter()
    const {currentUser,paseto} = useAuthContext()
    // This state is just enabled to mimick behaviour of fetching user data from db
    const [isLoadingProfile, setIsLoadingProfile] = useState(true)

    async function fetchUserDetails(){
      const res = await axios.get(`${process.env.NEXT_PUBLIC_NEW_API_URL}/users`,{
        headers:{
          "Authorization": paseto
        }
      })
      return res.data.data
    }
    const userQuery = useQuery({
      queryKey:['user'], 
      queryFn: fetchUserDetails, 
      enabled:paseto!==''})

    

    const [form] = Form.useForm();

    // useEffect(() => {
    //     const profilePicHash = currentUser.profile_pic !== ''? currentUser.profilePic: placeholder;
    //     setProfilePic(profilePicHash)
    //     form.setFieldsValue({
    //         fullName: currentUser.name,
    //         phone: currentUser.mobile_number,
    //         country: currentUser.country
    //     })
    // }, [])  

    useEffect(()=>{
        setTimeout(()=>{
            setIsLoadingProfile(false)
        },3000)
    })

    // check if user has uploaded profile picture
    const isProfilePic = profilePic !== placeholder

    function handleEditProfile(formData:any){
        console.log(formData)
    }



      if(isLoadingProfile){
        return(
            <div style={{display:'flex', background:'#ffffff', width:'100%', height:'100vh', justifyContent:'center', alignItems:'center'}}>
                <Spin tip='Loading user profile ...' size='large'/>
            </div>
        )
      }


    return(
        <div style={{background:'#ffffff', minHeight:'100vh'}}>
            <div style={{marginBottom:'3rem', padding: '1rem', borderBottom:'1px solid #e5e5e5',}}>
                <Row>
                    <Col offset={1}> 
                        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Button shape='round'  type='text' onClick={()=>router.back()} icon={<ArrowLeftOutlined/>}/>
                            <Title style={{margin:'0'}} level={3}>Profile</Title>
                        </div>
                    </Col>
                </Row>
            </div>
        <Row>
            <Col offset={1} span={21}>
                {/* <Title style={{marginLeft: '1em', marginTop:'1em'}} level={2}>User Profile</Title> */}
                <Content
                    style={{
                    padding: '1em',
                    margin:'1em',
                    // background:'white' , 
                    width:`50%`,
                    maxWidth:'100%',
                    }}
                > 

                    {userQuery.isLoading
                    ?<Skeleton.Input active size={'large'}  block />
                    :<EditableImage selectedRecord={userQuery.data&&userQuery.data[0]}/>
                    }
                    <EditableEmail selectedRecord={userQuery.data&&userQuery.data[0]}/>
                    <EditableName selectedRecord={userQuery.data&&userQuery.data[0]}/>
                    <EditablePhone selectedRecord={userQuery.data&&userQuery.data[0]}/>
                    <EditableGender selectedRecord={userQuery.data&&userQuery.data[0]}/>
                    <EditableCountry selectedRecord={userQuery.data&&userQuery.data[0]}/>

                </Content>
            </Col>
        </Row>
     </div>
           
    )
}


function getPrefixSelector(userCountry:any){
    let currenUserCountry = codes.forEach((item,index) =>{
        item.country === userCountry ? item.countryCodes[0]:'1'
    })
    return(
        <Form.Item name="prefix" noStyle>
        <Select defaultValue={'1'} style={{ width: 120 }}>
          {codes.map(code=>
              <Option key={code.country} value={code.countryCodes[0]}>+{code.countryCodes[0]}</Option>
          )}
        </Select>
      </Form.Item> 
    )
}
// const prefixSelector = (
   
//   );
interface EditableProp{
    selectedRecord: User
}

function EditableEmail({selectedRecord}:EditableProp){


    // const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()

    const queryClient = useQueryClient()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
   
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/users`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationKey:['email'],
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['user']})
      }
    })
  
    function onFinish(updatedItem:any){
      const payload = {
        key:'email',
        value:updatedItem.name,
      }
      mutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = mutation ;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{selectedRecord.email}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editableEmail"
       initialValues={selectedRecord}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
            <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input a valid email address' }]}
            >
                <Input allowClear disabled={isEditing} placeholder="bill@yahoo.com" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item style={{ width:'100%'}}>
                <Space >
                    <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                        Cancel
                    </Button>
                    <Button shape="round" loading={isEditing} type="link" size="small"  htmlType="submit" >
                        Apply changes
                    </Button>
                </Space>
                          
            </Form.Item>
          </Col>
        </Row>
             
      </Form>
    )
    return(
      <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Email</Text>
      {isEditMode?editable:readOnly}
      </div>
    )
  }
function EditableName({selectedRecord}:EditableProp){


    // const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()

    const queryClient = useQueryClient()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
   
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/users`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationKey:['fullName'],
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['user']})
      }
    })
  
    function onFinish(updatedItem:any){
      const updatedRecord = {
        ...selectedRecord,
        name: updatedItem.fullName
      }
      const payload = {
        key:'name',
        value:updatedItem.name,
      }
      // setState(updatedRecord)
      mutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = mutation ;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{selectedRecord.name}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editableName"
       initialValues={selectedRecord}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
            <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please input a valid service name' }]}
            >
                <Input allowClear disabled={isEditing} placeholder="Bill Jones" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item style={{ width:'100%'}}>
                <Space >
                    <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                        Cancel
                    </Button>
                    <Button shape="round" loading={isEditing} type="link" size="small"  htmlType="submit" >
                        Apply changes
                    </Button>
                </Space>
                          
            </Form.Item>
          </Col>
        </Row>
             
      </Form>
    )
    return(
      <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Full Name</Text>
      {isEditMode?editable:readOnly}
      </div>
    )
  }
function EditablePhone({selectedRecord}:EditableProp){

    const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
   const queryClient = useQueryClient()
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/users`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationKey:['mobileNumber'],
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['user']})
      }
    })
  
    function onFinish(updatedItem:User){
      const payload = {
        key:'contact_number',
        value: updatedItem.contactNumber,
      }

      const updatedRecord = {
        ...selectedRecord,
        name: updatedItem.mobileNumber
      }
      setState(updatedRecord)
      mutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = mutation ;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{selectedRecord.contactNumber}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editablePhone"
       initialValues={selectedRecord}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
            <Form.Item
                name="contactNumber"
                rules={[{ required: true, message: 'Please input a valid phone number' }]}
            >
                <Input  disabled={isEditing} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item style={{ width:'100%'}}>
                <Space >
                    <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                        Cancel
                    </Button>
                    <Button shape="round" loading={isEditing} type="link" size="small"  htmlType="submit" >
                        Apply changes
                    </Button>
                </Space>
                          
            </Form.Item>
          </Col>
        </Row>
             
      </Form>
    )
    return(
      <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Mobile Number</Text>
        {isEditMode?editable:readOnly}
      </div>
    )
  }
function EditableGender({selectedRecord}:EditableProp){

    const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }

    const queryClient = useQueryClient()
  
   
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/users`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationKey:['gender'],
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['user']})
      }
    })
  
    function onFinish(updatedItem:User){
      const payload = {
        key:'gender',
        value: updatedItem.gender,
      }
      const updatedRecord = {
        ...selectedRecord,
        name: updatedItem.gender
      }
      // setState(updatedRecord)
      mutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = mutation ;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{selectedRecord.gender}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editableGender"
       initialValues={selectedRecord}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
            <Form.Item
                name="gender"
                rules={[{ required: true, message: 'Please select your gender' }]}
            >
                <Radio.Group>
                    <Radio value="Male">Male</Radio>
                    <Radio value="Female">Female</Radio>
                </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item style={{ width:'100%'}}>
                <Space >
                    <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                        Cancel
                    </Button>
                    <Button shape="round" loading={isEditing} type="link" size="small"  htmlType="submit" >
                        Apply changes
                    </Button>
                </Space>
                          
            </Form.Item>
          </Col>
        </Row>
             
      </Form>
    )
    return(
      <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Gender</Text>
        {isEditMode?editable:readOnly}
      </div>
    )
  }

function EditableCountry({selectedRecord}:EditableProp){

    const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
   const queryClient = useQueryClient()
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/users`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationKey:['country'],
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['user']})
      }
    })
  
    function onFinish(updatedItem:User){
      const payload = {
        key:'country',
        value: updatedItem.country,
      }
      const updatedRecord = {
        ...selectedRecord,
        name: updatedItem.country
      }
      // setState(updatedRecord)
      mutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = mutation ;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{selectedRecord.country}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editableCountry"
       initialValues={selectedRecord}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
          <Form.Item
            name="country"
            rules={[{ required: true, message: 'Please select your country !' }]}
          >
                <Select
                placeholder="United states of America"
                defaultValue={'USA'}
                allowClear
                >
                    {countryList.getData().map((country:any)=>(
                        <Option key={country.code} value={country.name}>{country.name}</Option>
                    ))}
                </Select>
            </Form.Item> 
          </Col>
          <Col span={4}>
            <Form.Item style={{ width:'100%'}}>
                <Space >
                    <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                        Cancel
                    </Button>
                    <Button shape="round" loading={isEditing} type="link" size="small"  htmlType="submit" >
                        Apply changes
                    </Button>
                </Space>
                          
            </Form.Item>
          </Col>
        </Row>
             
      </Form>
    )

    return(
      <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Country</Text>
        {isEditMode?editable:readOnly}
      </div>
    )
  }

function EditableImage({selectedRecord}:EditableProp){

  const [isEditMode, setIsEditMode] = useState(false) 
  const [isHashingImage, setIsHashingImage] = useState(false)
  const [updatedCoverImageHash, setUpdatedProfilePicHash] = useState(selectedRecord.profilePic)


  const {paseto} = useAuthContext()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const queryClient = useQueryClient() 
 

  const mutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/users`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const mutation = useMutation({
    mutationKey:['profilePic'],
    mutationFn: mutationHandler,
    onSuccess:()=>{
      toggleEdit()
    },
    onSettled:()=>{
      queryClient.invalidateQueries({queryKey:['user']})
    }
  })

  async function onFinish(field:any){

    // hash it first
    const res = await field.profilePic

    setIsHashingImage(true)
    const profilePicHash = await asyncStore(res[0].originFileObj)
    setIsHashingImage(false)


    const payload = {
      key:'profile_pic',
      value: profilePicHash,
    }
    setUpdatedProfilePicHash(profilePicHash)
    mutation.mutate(payload)
  }

  const {isLoading:isEditing} = mutation

  const extractImage = async(e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
    return e;
    }

   return e?.fileList;
};

const readOnly = (
    <div style={{width:'100%', marginTop:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Image style={{width:'150px', height:'150px', objectFit:'cover', borderRadius:'50%', border:'1px solid #f2f2f2'}} alt={`Profile pic for ${selectedRecord.name}`}  src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${updatedCoverImageHash}`}/>
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)


  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableProfileImage"
     initialValues={selectedRecord}
     onFinish={onFinish}
     >
      <Row>
        <Col span={10}>
          <Form.Item
              name="profilePic"
              valuePropName="profilePic"
              getValueFromEvent={extractImage}
              rules={[{ required: true, message: 'Please upload an image' }]}
          >
              
              <Upload name="profilePic" listType="picture" multiple={false}>
                   <Button size='small' disabled={isHashingImage} type='link'>Upload profile image</Button>
              </Upload>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item style={{ width:'100%'}}>
              <Space >
                  <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                      Cancel
                  </Button>
                  <Button shape="round" loading={isEditing||isHashingImage} type="link" size="small"  htmlType="submit" >
                      Apply changes
                  </Button>
              </Space>
                        
          </Form.Item>
        </Col>
      </Row>
           
    </Form>
  )
  return(
    <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
      <Text type="secondary" style={{ marginRight: '2rem',}}>Profile picture</Text>
      {isEditMode?editable:readOnly}
    </div>
  )
}


  type User = {
    id:string,
    name: string,
    profilePic: string,
    email: string,
    contactNumber: string,
    mobileNumber: string,
    city: string,
    country: string,
    gender: string,
    walletAddress?: string,
    userType: string,
    mfaType: string,
    superiadUserId: string,
    mfa: string
  }