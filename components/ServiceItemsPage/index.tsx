import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../hooks/useOrgs";
const {Text} = Typography
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useAuthContext } from '../../context/AuthContext';
import { useServicesContext } from '../../context/ServicesContext';
import {PlusOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { useOrgContext } from "../../context/OrgContext";
import { asyncStore } from "../../utils/nftStorage";
import { ServiceItem } from "../../types/Services";
const {TextArea} = Input


// const mockServiceItems:ServiceItem[]=[
//   {
//      id:"dfadfafd",
//     name: "Classic Line skip",
//     imageHash: '',
//     serviceItemType: "line-skip",
//     description: "Best bar in the middle of new york",
//     updatedAt: "Jan 22, 2022",
//     createdAt: "Jan 24, 2022",
// },
//   {
//      id:"dfadfafd",
//     name: "Bottle service rosto",
//     imageHash: '',
//     serviceItemType: "line-skip",
//     description: "Best bar in the middle of new york",
//     updatedAt: "Jan 22, 2022",
//     createdAt: "Jan 24, 2022",
// },
// ]


export default function ServiceItemsView(){

    const {paseto} = useAuthContext()
    const {currentService} = useServicesContext()
    const queryClient = useQueryClient()
    const router = useRouter()
    const {switchOrg} = useOrgs()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
    // const isFilterEmpty = Object.keys(filteredInfo).length === 0;

    type DataIndex = keyof ServiceItem;

    const [selectedServiceItem, setSelectedServiceItem] = useState<any|ServiceItem>({})
    const [currentFilter, setCurrentFilter] = useState({id:'1',name: 'Active'})
    const [pageNumber, setPageNumber] = useState<number|undefined>(0)

    async function fetchServiceItems(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/service-items?key=org_service_id&value=${currentService.id}&pageNumber=${pageNumber}&pageSize=10`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }

   
    async function changeServiceItemStatus({serviceItemId, statusNumber}:{serviceItemId:string, statusNumber: string}){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/service-items`,
            data:{
                key:'status',
                value: statusNumber, // 0 means de-activated in db
                serviceItemId: serviceItemId 
            },
            headers:{
                "Authorization": paseto
            }
        })
        return res; 
    }

    
    const changeStatusMutation = useMutation(['data'],{
        mutationFn: changeServiceItemStatus,
        onSuccess:(data:any)=>{
            queryClient.invalidateQueries({queryKey:['serviceItems']})
        },
        onError:()=>{
            console.log('Error changing status')
        }
    })


    function inActiveItemsHandler(serviceItem:ServiceItem){
        changeStatusMutation.mutate({serviceItemId:serviceItem.id, statusNumber:'0'})
    }

    function activeItemsHandler(serviceItem:ServiceItem){
        changeStatusMutation.mutate({serviceItemId:serviceItem.id, statusNumber:'2'})
    }


    const serviceItemsQuery = useQuery({queryKey:['serviceItems', {currentFilter,pageNumber:pageNumber}], queryFn:fetchServiceItems, enabled:paseto !== ''})
    const res = serviceItemsQuery.data && serviceItemsQuery.data;
    const servicesData = res && res.data
    const totalLength = res && res.dataLength;


  
    const handleChange: TableProps<ServiceItem>['onChange'] = (data) => {
      console.log(data.current)
      //@ts-ignore
      setPageNumber(data.current-1); // Subtracting 1 because pageSize param in url starts counting from 0
    };
  
  
    function getTableRecordActions(){
        switch(currentFilter.id){
            // 1 = approved
            case '1': return activeItemActions 
            // 2 = inReview
            case '2': return inActiveItemActions 
        }
    }

    function viewOrgDetails(serviceItem:ServiceItem){
      // set state
      setSelectedServiceItem(serviceItem)
      // opne drawer
      setIsDrawerOpen(true)

    }
  
    
      const onMenuClick=(e:any, record:ServiceItem) => {
        const event = e.key
        switch(event){
          case 'inActive': inActiveItemsHandler(record);
          break;
          case 'active': activeItemsHandler(record)
          break;
          case 'viewDetails': viewOrgDetails(record)
        }
      };
      
  
    const columns: ColumnsType<ServiceItem> = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render:(_,record)=>{
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={'/favicon.ico'}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text>{record.name}</Text>  
                    </div>
                </div>
            )
        },
      },
      // {
      //   title: 'Type',
      //   dataIndex: 'serviceItemType',
      //   key: 'serviceItemType',
      // },
      
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status)=>{
          const statusText = status === '1'? 'Active': 'InActive'
          return <Badge status="processing" text={statusText} />
        }
      },
      {
          title: 'CreatedAt',
          dataIndex: 'createdAt',
          key: 'createdAt',
          render: (_,record)=>{
              const date = dayjs(record.createdAt).format('MMM DD, YYYY')
              return(
            <Text>{date}</Text>
            )
        },
    },
      {
          title: 'UpdatedAt',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          render: (_,record)=>{
              const date = dayjs(record.updatedAt).format('MMM DD, YYYY')
              return(
            <Text>{date}</Text>
            )
        },
    },
    {
      dataIndex: 'actions', 
      key: 'actions',
      render:(_,record)=>{
        const items = getTableRecordActions()
        return (<Dropdown.Button menu={{ items , onClick: (e)=>onMenuClick(e,record) }}>Actions</Dropdown.Button>)
      }
    }
    ];

        return (
            <div>
                <div style={{marginBottom:'1.5em', display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                <Radio.Group defaultValue={currentFilter.id} buttonStyle="solid">
                    {serviceItemsFilters.map(filter=>(
                        <Radio.Button key={filter.id} onClick={()=>setCurrentFilter(filter)} value={filter.id}>{filter.name}</Radio.Button>
                     )
                    )}
                </Radio.Group>
                <div style={{width: "20%",display:'flex', marginTop:'2rem', justifyContent:'space-between', alignItems:'center'}}>
                  <Button type='link' loading={serviceItemsQuery.isRefetching} onClick={()=>serviceItemsQuery.refetch()} icon={<ReloadOutlined />}>Refresh</Button>
                  <Button shape='round' type='primary' icon={<PlusOutlined/>} onClick={()=>router.push('/organizations/services/serviceItems/new')}>New service-item</Button>
                </div>

                </div>
                <Table 
                  style={{width:'100%'}} 
                  key='dfadfe' 
                  pagination={{
                    total:totalLength,  
                    showTotal:(total) => `Total ${total} items`,
                  }} 
                  loading={serviceItemsQuery.isLoading || serviceItemsQuery.isRefetching} 
                  columns={columns} 
                  onChange={handleChange} 
                  dataSource={servicesData} 
                />
                {
                  isDrawerOpen
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedServiceItem={selectedServiceItem}/>
                  :null
                }
            </div>
    )



}

interface DrawerProps{
  selectedServiceItem: ServiceItem,
  isDrawerOpen: boolean,
  closeDrawer: (value:boolean)=>void
}
function DetailDrawer({selectedServiceItem,isDrawerOpen,closeDrawer}:DrawerProps){

const queryClient = useQueryClient()

function closeDrawerHandler(){
  queryClient.invalidateQueries(['serviceItems'])
  closeDrawer(!isDrawerOpen)
}

return( 
<Drawer title="Organization Details" width={640} placement="right" closable={true} onClose={closeDrawerHandler} open={isDrawerOpen}>
  
  <EditableName selectedServiceItem={selectedServiceItem}/>
  <EditableDescription selectedServiceItem={selectedServiceItem}/>
  {/* <EditableCoverImage selectedServiceItem={selectedServiceItem}/> */}

  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Divider/>
    <Button danger type="link">De-activate service-item</Button>
    <Divider/>
  </div>

</Drawer>
)
}


interface EditableProp{
  selectedServiceItem: ServiceItem
}

function EditableName({selectedServiceItem}:EditableProp){

  const [state, setState] = useState(selectedServiceItem)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  const queryClient = useQueryClient()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

 

  const nameMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/service-items`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const nameMutation = useMutation({
    mutationKey:['name'],
    mutationFn: nameMutationHandler,
    onSuccess:()=>{
      toggleEdit()
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      key:'name',
      value: updatedItem.name,
      id: selectedServiceItem.id
    }
    const updatedRecord = {
      ...selectedServiceItem,
      name: updatedItem.name
    }
    setState(updatedRecord)
    nameMutation.mutate(payload)
  }

  const {isLoading:isEditing} = nameMutation ;

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{state.name}</Text>
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableName"
     initialValues={selectedServiceItem}
     onFinish={onFinish}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
          <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input a valid service name' }]}
          >
              <Input  disabled={isEditing} placeholder="Flexable serviceItem" />
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
    <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
      <Text type="secondary" style={{ marginRight: '2rem',}}>Name</Text>
    {isEditMode?editable:readOnly}
    </div>
  )
}

function EditableDescription({selectedServiceItem}:EditableProp){

  const [state, setState] = useState(selectedServiceItem)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const [form]  = Form.useForm()

  const nameMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/service-items`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }

  const nameMutation = useMutation({
    mutationKey:['description'],
    mutationFn: nameMutationHandler,
    onSuccess:()=>{
      toggleEdit()
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      key:'description',
      value: updatedItem.description,
      id: selectedServiceItem.id
    }
    const updatedRecord = {
      ...selectedServiceItem,
      name: updatedItem.description
    }
    setState(updatedRecord)
    nameMutation.mutate(payload)
  }

  const {isLoading:isEditing} = nameMutation 

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{state.description}</Text>
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableDescription"
     initialValues={selectedServiceItem}
     onFinish={onFinish}
     form={form}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
        <Form.Item 
            name="description"
            rules={[{ required: true, message: 'Please input a description for service item!' }]}
        >
            <TextArea rows={3} placeholder='Description...'/>

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
      <Text type="secondary" style={{ marginRight: '2rem',}}>Description</Text>
    {isEditMode?editable:readOnly}
    </div>
  )
}


// function EditableCoverImage({selectedServiceItem}:EditableProp){

//   const [isEditMode, setIsEditMode] = useState(false) 
//   const [isHashingImage, setIsHashingImage] = useState(false)
//   const [updatedCoverImageHash, setUpdatedCoverImageHash] = useState(selectedServiceItem.imageHash)

//   const queryClient = useQueryClient()

//   const {paseto} = useAuthContext()

//   function toggleEdit(){
//     setIsEditMode(!isEditMode)
//   }

//   const readOnly = (
//       <div style={{width:'100%', marginTop:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
//         <Image style={{width:'500px', height:'200px', objectFit:'cover', border:'1px solid #f2f2f2'}} alt='cover image for serviceItemanization' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${updatedCoverImageHash}`}/>
//         <Button type="link" onClick={toggleEdit}>Edit</Button>
//       </div>
//   )

//   const mutationHandler = async(updatedItem:any)=>{
//     const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/serviceItem`,updatedItem,{
//       headers:{
//           //@ts-ignore
//           "Authorization": paseto
//       }
//     })
//       return data;
//   }
//   const mutation = useMutation({
//     mutationKey:['logoImage'],
//     mutationFn: mutationHandler,
//     onSuccess:()=>{
//       toggleEdit()
//     }
//   })

//   async function onFinish(field:any){

//     // hash it first
//     const coverImageRes = await field.coverImage

//     setIsHashingImage(true)
//     const coverImageHash = await asyncStore(coverImageRes[0].originFileObj)
//     setIsHashingImage(false)

//     console.log(coverImageHash)

//     const payload = {
//       key:'cover_image_hash',
//       value: coverImageHash,
//       serviceItemId: selectedServiceItem.id
//     }
//     setUpdatedCoverImageHash(coverImageHash)
//     mutation.mutate(payload)
//   }

//   const {isLoading:isEditing} = mutation

//   const extractCoverImage = async(e: any) => {
//     console.log('Upload event:', e);
//     if (Array.isArray(e)) {
//     return e;
//     }

//    return e?.fileList;
// };


//   const editable = (
//     <Form
//      style={{ marginTop:'.5rem' }}
//      name="editableCoverImage"
//      initialValues={selectedServiceItem}
//      onFinish={onFinish}
//      >
//       <Row>
//         <Col span={10}>
//           <Form.Item
//               name="coverImage"
//               valuePropName="coverImage"
//               getValueFromEvent={extractCoverImage}
//               rules={[{ required: true, message: 'Please input a valid zip code' }]}
//           >
              
//               <Upload name="coverImageHash" listType="picture" multiple={false}>
//                    <Button size='small' disabled={isHashingImage} type='link'>Upload cover image</Button>
//               </Upload>
//           </Form.Item>
//         </Col>
//         <Col span={4}>
//           <Form.Item style={{ width:'100%'}}>
//               <Space >
//                   <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
//                       Cancel
//                   </Button>
//                   <Button shape="round" loading={isEditing||isHashingImage} type="link" size="small"  htmlType="submit" >
//                       Apply changes
//                   </Button>
//               </Space>
                        
//           </Form.Item>
//         </Col>
//       </Row>
           
//     </Form>
//   )
//   return(
//     <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
//       <Text type="secondary" style={{ marginRight: '2rem',}}>Cover Image</Text>
//       {isEditMode?editable:readOnly}
//     </div>
//   )
// }




const serviceItemsFilters = [
  {
      id: '1',
      name: 'Active'
  },
  {
      id: '2',
      name: 'In-active'
  },
]

const inActiveItemActions = [
    {
        key: 'accept',
        label: 'Accept'
    },
    {
        key: 'reject',
        label: 'Reject'
    },
    {
        key: 'viewDetails',
        label: 'View details'
    },

]
const activeItemActions = [
    {
        key: 'review',
        label: 'Review'
    },
    {
        key: 'viewDetails',
        label: 'View details'
    },

]