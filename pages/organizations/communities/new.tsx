import React,{useEffect, useRef, useState} from 'react';
import {Card,Form, Image as AntImage, Input,InputNumber, DatePicker,Upload,Button,notification, Space, Alert, Typography, TimePicker, Select, Row, Col, Steps, Radio, Tooltip, Popconfirm, message, Drawer, Collapse, InputRef} from 'antd';
const { TextArea } = Input;
import Image from 'next/image'

const { Panel } = Collapse;


const {Text,Title} = Typography;
import {QuestionCircleOutlined,SelectOutlined,ArrowLeftOutlined, MinusOutlined,MinusCircleOutlined,InfoCircleOutlined,PlusCircleOutlined} from '@ant-design/icons'


import { useRouter } from 'next/router';
import { Availability, AvailabilityPayload, ServiceItem, ServiceItemReqPaylod } from '../../../types/Services';
import dayjs from 'dayjs'
import { useServicesContext } from '../../../context/ServicesContext';
import useServiceItemTypes from '../../../hooks/useServiceItemTypes';
import { asyncStore } from '../../../utils/nftStorage';
import axios from 'axios';
import { useAuthContext } from '../../../context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useUrlPrefix from '../../../hooks/useUrlPrefix'; 
import { usePlacesWidget } from 'react-google-autocomplete';
import { CommunityReq } from '../../../types/Community';
import useOrgs from '../../../hooks/useOrgs';
import { useOrgContext } from '../../../context/OrgContext';




export default function ServiceItemForm(){

    const router = useRouter() 
    
    const [currentStep, setCurrentStep] = useState(0);
    // State to hold the id of the service item that will get created in the
    // first form.
    const [createdItemId, setCreatedItemId] = useState('')
    
          const next = (data:any) => {
            const serviceItemId = data[0].id // extract id of newly created service item
            setCreatedItemId(serviceItemId)
            setCurrentStep(currentStep + 1);
          };
        
          const prev = () => {
            setCurrentStep(currentStep - 1);
          };

        const steps = [
            {
            title: 'Basic Info',
            content: <BasicForm nextStep={next}/>,
            },
            {
            title: 'Add Venues',
            content: <VenuesForm serviceItemId={createdItemId} />,
            },
        ];


      const items = steps.map((item) => ({ key: item.title, title: item.title }));


    return (
        <div style={{background:'#ffffff', height:'100%', minHeight:'100vh'}}>
           <div style={{marginBottom:'3rem', padding: '1rem', borderBottom:'1px solid #e5e5e5',}}>
                <Row>
                    <Col offset={1}> 
                         <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Button  type='link' onClick={()=>router.back()} icon={<ArrowLeftOutlined/>}/>
                            <Title style={{margin:'0', textTransform:'capitalize'}} level={3}>Create Community</Title>
                        </div>
                    </Col>
                </Row>
            </div>
           <Row > 
                <Col offset={5} span={11}>
                <Steps current={currentStep} items={items} />
                    {/* <BasicForm nextStep={next}/> */}
                    {steps[currentStep].content}
                </Col>
           </Row>
        </div>
         )

}

interface BasicInfoProps{
    nextStep: (data:any)=>void
}

function BasicForm({nextStep}:BasicInfoProps){

    
     // TODO: set field for editing
     //@ts-ignore

     const [isHashingImage, setIsHashingImage] = useState(false)
     const {currentOrg} = useOrgs()
     const {paseto} = useAuthContext()
     const router = useRouter()

     const urlPrefix = useUrlPrefix()

     // make this default value to be lineskip images first element
    const artworkRef = useRef<string|null>(lineSkipHashes[0])
    

    const queryClient = useQueryClient()

    function handleArtworkChange(hash:string){
        artworkRef.current = hash
    }

   

     const onFinish = async (formData:any)=>{

        // availability should return empty array whenever user decides not to add custom dates
        // const transformedAvailability = formData.availability?convertDates(formData.availability):[]

        // // only generate key if it's a new service
            const formObject: CommunityReq = {
                // @ts-ignore
                orgId: currentOrg.orgId,
                name: `Key to: ${formData.name}`,
                price: String(formData.price * 100),
                currency: 'USD',
                description:formData.description,
                artworkHash: artworkRef.current,
                logoImageHash: artworkRef.current
            }

            console.log(formObject)
            createData.mutate(formObject)


    }
    const [form] = Form.useForm()


    const createDataHandler = async(newItem:CommunityReq)=>{

        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community`, newItem,{
            headers:{
                "Authorization": paseto
            },
        })
        return data
    }

    const createData = useMutation(createDataHandler,{
       onSuccess:(data)=>{
        console.log(data)
        const status = data.status
        if(status <= 200){
            notification['success']({
                message: 'Successfully created new community!'
            })
                console.log(data)
                nextStep(data.data)
        }else{
            notification['error']({
                message: data.message,
              });
        }
            
       },
       onSettled:()=>{
        queryClient.invalidateQueries(['all-serviceItems'])
   },
        onError:(err)=>{
            console.log(err)
            notification['error']({
                message: 'Encountered an error while creating community',
              });
            // leave modal open
        } 
    })

    const {isError, isLoading:isCreatingData, isSuccess:isDataCreated, data:createdData} = createData


   

    return(
        <Form
        name="communityForm"
        initialValues={{ remember: false }}
        layout='vertical'
        form={form}
        style={{marginTop:'2rem'}}
        onFinish={onFinish}
        >

        <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input a valid community name' }]}
         >
            <Input allowClear size='large' addonBefore='Key to:' maxLength={150} placeholder="Napoli" />
        </Form.Item>

        <Form.Item name='description' rules={[{ required: true, message: 'Please write a description for your service' }]}  label="Description">
            <TextArea allowClear maxLength={500} size='large' showCount  placeholder='Tell us more about this community' rows={2} />
        </Form.Item>

          {/* price */}
          <Row>
            <Col span={11} style={{height:'100%'}}>
                <Form.Item
                    name='price'
                    label='Price'
                    style={{width:'100%'}}
                    rules={[{ required: true, message: 'Please input a valid price!' }]}
                >
                    <Input size='large' style={{width:'100%'}} suffix='Per ticket' prefix="$" placeholder="0.00" /> 
                </Form.Item> 
            </Col>
        </Row>

        {/* <Form.Item
            label="Validity Period"
            hasFeedback
            required
            style={{marginBottom:'0'}}
            extra={`Enter a timeframe you want your DAT to be redeemable by customers. This may vary based on your industry and service you provide. Eg: a "Saturday Night Line Skip" at a bar might be valid from 7pm on Saturday night until 4am Sunday morning, to allow the late night partygoers a chance to redeem their tickets. A restaurant DAT for a "Last Minute Saturday Reservation" might only need to have validity period of 12 noon - 12 midnight`} 
            rules={[{required: true, message: 'Please select a time period' }]}
        >
            <Input.Group  compact>
            <Form.Item  rules={[{required:true, message:'Please provide a start time'}]}  name={['validity','start']} noStyle>
                <TimePicker  use12Hours placeholder="Start"  format="h A" size="large" />
            </Form.Item>
            <Form.Item  rules={[{required:true, message:'Please provide a end time'}]}  name={['validity','end']} noStyle>
                <TimePicker use12Hours placeholder="End"  format="h A" size="large" />
            </Form.Item>

            </Input.Group>
            {/* <Text style={{marginLeft:'1rem'}}>9 hrs interval for all tickets</Text>   */}

        {/* </Form.Item>  */} 



        <Artwork onHandleArtwork={handleArtworkChange}/>

        <Form.Item style={{marginTop:'4rem'}}>
            <Space>
                <Button onClick={()=>router.back()}  type='ghost'>
                    Cancel
                </Button>

                <Button shape='round' size='large' loading={isHashingImage||isCreatingData} type="primary"  htmlType="submit" >
                    Create Community
                </Button>

            </Space>
            
        </Form.Item>

        </Form>
    )
}



interface AvailabilityProp{
    serviceItemId: string,
}
function VenuesForm({serviceItemId}:AvailabilityProp){

    const [form] = Form.useForm()
    const router = useRouter()
    const queryClient = useQueryClient()

    const urlPrefix = useUrlPrefix()

    const {paseto} = useAuthContext()

    const [fullAddress, setFullAddress] = useState({
        latitude:0,
        longitude:0,
        state: '',
        country:'',
        city:''
    })
    
    const antInputRef = useRef();
    const areaCodeRef = useRef<InputRef>(null)
    const centralOfficeCodeRef = useRef<InputRef>(null)
    const tailNoRef = useRef<InputRef>(null)

    function handleAreaCodeRef(e:any){
        if(e.target.value.length >= 3){ 
            centralOfficeCodeRef.current!.focus()
        }
    }
    function handleCentralOfficeCode(e:any){
        if(e.target.value.length >= 3){ 
            tailNoRef.current!.focus()
        }
    }

    const extractFullAddress = (place:any)=>{
        const addressComponents = place.address_components 
            let addressObj = {
                state:'',
                country:'',
                city:'',
                latitude:place.geometry.location.lat(),
                longitude:place.geometry.location.lng()
            };
            addressComponents.forEach((address:any)=>{
                const type = address.types[0]
                if(type==='country') addressObj.country = address.long_name
                if(type === 'locality') addressObj.state = address.short_name
                if(type === 'administrative_area_level_1') addressObj.city = address.short_name
            })

            return addressObj
    }

      const { ref: antRef } = usePlacesWidget({
        apiKey: `${process.env.NEXT_PUBLIC_MAPS_AUTOCOMPLETE_API}`, // move this key to env
        options:{
            componentRestrictions:{country:'us'},
            types: ['address'],
            fields: ['address_components','geometry','formatted_address']
        },
        onPlaceSelected: (place) => {
            // console.log(antInputRef.current.input)
            console.log(place)
            form.setFieldValue('address',place?.formatted_address)
            
            const fullAddress = extractFullAddress(place)
            // add street address
            const addressWithStreet={
                ...fullAddress,
                street: place?.formatted_address
            }
            setFullAddress(addressWithStreet)

            //@ts-ignore
          antInputRef.current.input.value = place?.formatted_address

        },
      });
    
    async function onFinish(formData:any){
        console.log('form data',formData.availability)
        // const transformedDates = convertDates(formData.venues)
        const reqPayload = {
            serviceItemId: serviceItemId,
            availability: []
        }

        createData.mutate(reqPayload)
    }


    const createDataHandler = async(newItem:AvailabilityPayload)=>{ 
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items/availability`, newItem,{
            headers:{
                "Authorization": paseto
            },
        })
        return data
    }

    const createData = useMutation(createDataHandler,{
       onSuccess:(data)=>{
        form.resetFields()
        notification['success']({
            message: 'Successfully created custom availabilties!'
        })
            router.back()
            // nextStep(data.data)
            
       },
        onError:(err)=>{
            console.log(err)
            notification['error']({
                message: 'Encountered an error while creating custom custom dates',
              });
            // leave modal open
        } ,
        onSettled:()=>{
            queryClient.invalidateQueries(['all-serviceItems'])
       },
    })

    const {isError, isLoading:isCreatingData, isSuccess:isDataCreated, data:createdData} = createData



    return(
        <>
        <div style={{width:'100%', marginTop:'3rem', display:'flex',flexDirection:'column'}}>
            <Title style={{marginBottom:'.2rem'}} level={3}>Add Venues</Title>
            <div style={{ marginTop:'1rem', display:'flex', flexDirection:'column', marginBottom:'.1rem', borderRadius:'4px'}}>
                {/* <Text style={{marginBottom:'.2rem'}}>{`You can add multiple venues (i.e. New Year's Eve, St. Patricks Day, Cinco De Mayo, e.t.c) on which this service will be available on the marketplace.`}</Text> */}
               
            </div>
        </div>  
        <Form
            name="serviceItemAvailability"
            initialValues={{ remember: false }}
            layout='vertical'
            form={form}
            style={{marginTop:'2rem'}}
            onFinish={onFinish}
            >

            <Form.List  name="venues">
                {(fields, { add, remove }) => (
                    <>
                    {fields.map(({ key, name, ...restField }) => (
                        <div style={{padding:'1rem', marginBottom:'1rem', borderRadius:'4px', border:'1px solid #FFC680'}} key={key}>

                            {/* label */}
                            <Form.Item
                                    {...restField}
                                    required
                                    // label='Label'
                                    // rules={[{ required: true, message: 'Please provide a valid label for the date' }]}
                                    name={[name, 'name']}
                                    style={{width:'100%'}}
                                >
                                <Input size='large' suffix={<Tooltip title='This field is optional'><InfoCircleOutlined/></Tooltip> } placeholder='Christmas eve' />
                            </Form.Item>


                            <Form.Item  
                                name="address"
                                label='Address'
                                extra={<Text type="secondary"><InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} /> Please refresh the page if the address you selected is not being displayed in the field </Text> }
                                rules={[{ required: true, message: 'Please input a valid address!' }]}
                            >
                                <Input 
                                    // suffix={
                                    //     <Tooltip title="Please refresh the page if the date you selected is not being displayed in the field">
                                    //       <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                    //     </Tooltip>
                                    //   }
                                    size="large" 
                                    allowClear
                                    ref={(c) => {
                                    // @ts-ignore
                                    antInputRef.current = c;
                                    // @ts-ignore
                                    if (c) antRef.current = c.input;
                                    }} 
                                    placeholder="Syracuse, United states" 
                                    />
                            </Form.Item>

                            <Form.Item
                        // name="contactNumber"
                        label="Contact Number"
                        required
                        style={{marginBottom:'1rem'}}
                        rules={[{ required: true, message: 'Please input a valid phone number' }]}
                    >
                        <Input.Group compact>
                            <Form.Item initialValue={'+1'} name={['contact','countryCode']} noStyle>
                                <Input allowClear style={{width:'10%'}} disabled size="large"/>
                            </Form.Item>
                            <Form.Item name={['contact','areaCode']} noStyle>
                                <Input allowClear ref={areaCodeRef} maxLength={3} onChange={handleAreaCodeRef} style={{width:'20%'}} size="large" placeholder="235" />
                            </Form.Item>
                            <Form.Item name={['contact','centralOfficeCode']} noStyle>
                                <Input allowClear ref={centralOfficeCodeRef} onChange={handleCentralOfficeCode} maxLength={3} style={{width:'20%'}} size="large" placeholder="380" />
                            </Form.Item>
                            <div style={{height:'40px',margin:'0 .3rem 0 .3rem', display:'inline-flex', alignItems:'center',  verticalAlign:'center'}}>
                            <MinusOutlined style={{color:"#e7e7e7"}} />
                            </div>
                            <Form.Item name={['contact','tailNumber']} noStyle>
                                <Input ref={tailNoRef} maxLength={4} style={{width:'20%'}} size="large" placeholder="3480" />
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>


                            {/* promotion */}
                            <Form.Item name='promotion' rules={[{ required: true, message: 'Please write a description for your service' }]}  label="Promotion">
                                <TextArea allowClear maxLength={500} size='large' showCount  placeholder='Tell us more about this service' rows={2} />
                            </Form.Item>
            
                           
            
                            
                            {/* controls */}
                            <Col span={4}>
                                <Form.Item style={{marginBottom:'0', width:'100%'}}>
                                    <Space >
                                    <Popconfirm
                                        title="Remove venue"
                                        description="Are you sure to remove this custom date?"
                                        onConfirm={() => remove(name)}
                                        // onCancel={cancel}
                                        okText="Yes, Remove"
                                        cancelText="No"
                                    >
                                        <Button shape="round" icon={<MinusCircleOutlined  />} size='small'  type='text'>Remove Venue</Button>
                                    </Popconfirm>
                                    </Space>           
                                </Form.Item>
                            </Col>
                         </div>
                    ))}

                    <Form.Item>
                        <Button icon={<PlusCircleOutlined />} size='large' shape='round' onClick={() => add()}>
                             Add Venue
                        </Button>
                    </Form.Item>
                    </>
                )}
            </Form.List>


            <Form.Item style={{marginTop:'4rem'}}>
                <Space>
                    <Button shape='round' onClick={()=>router.back()} type='ghost'>
                        Skip for now
                    </Button>

                    {/* <Button shape='round' size='large' loading={isCreatingData} type='primary' htmlType="submit" >
                         Create Custom Dates
                    </Button> */}
                    <Form.Item
                        style={{marginBottom:'0'}}
                        shouldUpdate
                    >
                    {() => (
                     <Button
                     size='large' 
                    type='primary'
                    shape='round'
                    loading={isCreatingData}
                    htmlType="submit"
                    disabled={
                    !form.isFieldTouched('venue')
                    // !!form.getFieldsError().filter(({ errors }) => errors.length).length
                    }
                >
                Add Venues
                </Button>
                )}
                </Form.Item>
                </Space>
                
            </Form.Item>

           

            </Form>
        </>
    )
}

interface ArtworkProps{
    onHandleArtwork: (value:string)=>void
}
function Artwork({onHandleArtwork}:ArtworkProps){

    const router = useRouter()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [currentServiceItemType, setCurrentServiceItemType] = useState<null|string|string[]|undefined>(undefined)
    const [selectedArtwork, setSelectedArtwork] = useState('') // 

    function toggleDrawer(){
        setIsDrawerOpen(!isDrawerOpen)
    }

    useEffect(() => {
        if(router.isReady){
            setCurrentServiceItemType(router.query.label)
            setSelectedArtwork(communityHashes[0])
            onHandleArtwork(communityHashes[0])
        }
    }, [router.isReady, router.query.label])

    function selectImage(image:string){
        setSelectedArtwork(image)
        onHandleArtwork(image)
    }

    return(
        <div>
            <div style={{display:'flex', marginTop:'3rem',alignItems:'baseline'}}>
                <Title style={{margin:'0'}} level={3}>Artwork</Title>
                <Tooltip trigger={['click']} placement='right' title={<LogoTip/>}>
                        <Button type="link">Learn more<QuestionCircleOutlined /></Button>
                </Tooltip>
            </div>
            <div style={{display:'flex',width:'400px', marginTop:'2rem', flexDirection:'column'}}>
                <div style={{alignSelf:'flex-end',display:'flex'}}>
                <Button shape='round' icon={<SelectOutlined />} style={{ marginBottom:'.5rem'}} onClick={toggleDrawer}>Select a different artwork</Button>
                </div>
                <AntImage alt='artwork'  style={{width:'400px', height:'400px', objectFit:'cover'}}  src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${selectedArtwork}`}/>
                <Text type='secondary'>This cover image will be used for listing on marketplace and Digital access token NFT</Text>
            </div>
            <ArtworkPicker 
                currentServiceItemType={currentServiceItemType}
                selected = {selectedArtwork}
                isOpen={isDrawerOpen}
                onSelectImage = {selectImage}
                onToggleDrawer={toggleDrawer}
            />
        </div>
    )
}


interface ArtworkPickerProps{
    currentServiceItemType: null|string|string[]|undefined,
    isOpen: boolean,
    onSelectImage: (image:string) =>void
    selected: string,
    onToggleDrawer: ()=>void
}
function ArtworkPicker({isOpen, selected, currentServiceItemType, onSelectImage, onToggleDrawer}:ArtworkPickerProps){
 
    const currentHashes = communityHashes

    return(
        <Drawer
        height={'500px'}
        title="Select an artwork for your service"
        placement={'bottom'}
        closable={true}
        onClose={onToggleDrawer}
        open={isOpen}
      >
        <div style={{width:'100%', height:'100%', position:'relative',   overflowY: 'hidden', whiteSpace:'nowrap', overflowX:'scroll'}}>
            {/* <Image alt='artwork for lineskip' style={{objectFit: 'cover', height:'300px', width:'400px'}} src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${lineSkipHash}`}/> */}
            {
                currentHashes.map((image:string)=>(
                    <div key={image} onClick={()=>onSelectImage(image)} style={{border:`4px solid ${selected === image? '#1677ff':'#eeeeee'}`,borderRadius:'4px',  display:'inline-block', marginRight:'1rem', padding:'.5rem'}}>
                        <Image  alt='artwork for lineskip' height='300px' width='300px'  src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${image}`}/> 
                    </div>
                ))
            }

        </div>
      </Drawer>
    )
}




const lineSkipHashes = [
    'bafkreicl6mxs4xifx6vef3lacxrfozbqzw2h7ccekkr2qsxe552jo3zzbm',
    'bafkreifuv3jjwm2tltcgpe36br3q4qrwyrd4aqj7dv4apqqi64kwc7ma6q',
    'bafkreicxz3njmsqovgifgdjwngoghbmaeieywgw5j2gzoy26dtecdqfc7e',
    'bafkreig4h3dhawjzqiieegze7ksbzj5i3no4duexaxzezgm5d272yp7gpq',
    'bafkreidm6lrgassu63uald57ocsbn2xkmzexq3n3c5mbkf23vhxcl4jxzm'
]

const bottleServiceHashes = [
    'bafkreih5kmywbykilkwduqdx7lttuuzin2puselw6swwnhi3hrnztuv6r4',
    'bafkreignk6ctyc3ngrklrmnpqnrbovij3e5x23ups5ynbwghe6rwwpnq4y',
    'bafkreibzyvawcyr3zjnvob6rfr7edzct7a63radq6ec5k5woa2v7belvs4',
    'bafkreidrgnhgak5zurcyud73kzgm347fkvruoy5mjm4stosetpfocyhem4',
    'bafkreigbbf73imovkwrsjrcvys6cggwff2jwb6ixi5weovlxftb73t54qe',
    'bafkreifll4nla7zdudxrlei3widcqtiz6phaa5zlbzyo5fdd76byytytgy',
    'bafkreiffhginn626rfdqsrn4lqpzhpsdfqbdeqxmofr3offdl6akp5qixy'
]

const reservationHashes = [
    'bafkreidftkdvxbfqyot4a4ye6cmybkbuj4pqvrzp6o2uzr27264ba2zjgm',
    'bafkreiajyd5ogq4q6ledndv4fyd2tkxovxtc6xf73326i262lg4aio5dba',
    'bafkreiewtngckptrzm457vubintmg4nq2dpmentkkha7g4jwmhljmhbzya',
    'bafkreib43d4lfkf2g44bmjfke7nhccmfvto45ye6onnwznfuarh4b7vl3i',
    'bafkreigg636y3fh5robhm57fokgxnbnhclzjlw5lujzqw6b5lddper3xuu',
    'bafkreih5jcke4ymriq6apvm25xoyvtxrv44ouqn7sfh2je2zbkbxpanlsy',
    'bafkreiaz3477vw4dg6j355xqofjhrmjrwreha6jhyacjlznv5oaygupyni',
    'bafkreih734aianxaolqai32r7cqrbivue2226d4hgqc73kfo2hvppicomi',
    'bafkreid32byuipzwp6sam43nmbpickr6b2jejsuhxwqiv4mxrg547uok54',
    'bafkreibgzw5opyl7g6mhskmgjyjdqagavoyh53xe6r4x6ieeopkjysteoi',
    'bafkreid2wrsgpjfwzk3wagtodz55dmmukp2cw6wfcemsuo6smggwijcoyy',
    'bafkreihbecuafbkgdzogx3ihzivefvnol4iwvzfnd6piyzltzo4mes2tcm',
    'bafkreibr5dsleh6jqzp2eul24dom4ir5pvap3j37rupbrmfttsmqcwolme',
    'bafkreihuw2obzpj4qtmthpy7frky5e5r7autjtbkc4vse2gufpt4xua37q',
    'bafkreigsagycab37kiuv5ohywerw3ks3e5mkbpfzb4atdv3rfpfxtngwq4',
    'bafybeieagreig3jmjzcakenmdo3ekhbyhf42pkcsmwdc6wonhcorof4evi',
    'bafybeidjw44qhp44ahzhi2dyma6ln4tsaefay6etlyggbfed7lzcg54jou'
]

const communityHashes = [
    'bafybeigsd6qwrclttmfq6zh72rldkcfyjc3xqmyuucu4rzavwfa3o3ndmm',
    'bafybeidz65dnck3frd76dhvgcrznirf6sxbfentxi5lm3mz7ch6hifgr3a',
    'bafybeicyq4jqhkvo6i7luzcnav5dazwo6xysfhxdqgmqat2wy46s2xdloe',
    'bafybeif67t7snc6umd5twrzqicq7jugtqo3dofnvncjvhtccuo7d34iy3q',
    'bafybeicq6jhmuf2g5cqp6tmv72h2rvc6nwds3nez4wpj6ysppv455lmazi',
    'bafybeiff2bdvjr2p2q2uimgfaoebik3yuu23bhdredz52j3ctrmbrabese',
    'bafybeigsghat6a2sbhyjmmchk6onztdstxjx45cxwzrdiub5hmiyf5kwqa',
    'bafybeihkfzmeegpiz67fxn2i3rmohdddjcoyk5y45rmvaqvv5sotrdxypm',
    'bafybeif66cmurjviz35rid5morzsnp277cs3qhjdgquvpe6n54ntuolnnu',
    'bafybeibbyfj22f3wdrgu4dzsnpfixtn7zfmrxn7i3efavfdhnczz2sqala'
    ]
    



function LogoTip(){
    return(
        <div>
            <AntImage style={{objectFit:'cover'}}  src={'/explainers/serviceItem-explainer.png'} alt='Service explainer as displayed on marketplace'/>
            <Text style={{color:'white'}}>It is very important that you provide the requested the image size else, it will look distorted on marketplace.</Text>
        </div>
    ) 
}