import React,{useEffect, useRef, useState} from 'react';
import {Card,Form, Image as AntImage, Input,InputNumber, DatePicker,Upload,Button,notification, Space, Alert, Typography, TimePicker, Select, Row, Col, Steps, Radio, Tooltip, Popconfirm, message, Drawer, Collapse, InputRef, FormInstance, UploadProps} from 'antd';
const { TextArea } = Input;
import Image from 'next/image'




const {Text,Title} = Typography;
import {QuestionCircleOutlined,SelectOutlined,ArrowLeftOutlined, UploadOutlined, MinusOutlined,MinusCircleOutlined,InfoCircleOutlined,PlusCircleOutlined} from '@ant-design/icons'


import router, { useRouter } from 'next/router';
import axios from 'axios';
import { useAuthContext } from '../../../context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useUrlPrefix from '../../../hooks/useUrlPrefix'; 
import { usePlacesWidget } from 'react-google-autocomplete';
import { Community, CommunityReq } from '../../../types/Community';
import useOrgs from '../../../hooks/useOrgs';
import { CommunityVenue, CommunityVenueForm as CommunityVenueFormType, CommunityVenueReq } from '../../../types/CommunityVenue';
import { asyncStore} from "../../../utils/nftStorage";
import { useOrgContext } from '../../../context/OrgContext';





export default function CommunityForm(){

    const router = useRouter() 

    const {currentOrg} = useOrgContext()

    const isBankConnected = currentOrg?.isBankConnected
    
    const [currentStep, setCurrentStep] = useState(0);
    // State to hold the id of the service item that will get created in the
    // first form.
    const [createdItemId, setCreatedItemId] = useState('')
    
          const next = (data:any) => {
            const communityId = data.id // extract id of newly created community
            setCreatedItemId(communityId)
            setCurrentStep(currentStep + 1);
          };
        
          const prev = () => { 
            setCurrentStep(currentStep - 1);
          };

        const steps = [
            {
            title: 'Basic Info',
            content: <BasicForm isBankConnected={isBankConnected} nextStep={next}/>,
            },
            {
            title: 'Add Venues',
            content: <VenuesForm communityId={createdItemId} />,
            },
        ];


      const items = steps.map((item) => ({ key: item.title, title: item.title }));


    return (
        <div style={{background:'#ffffff', height:'100%', minHeight:'100vh'}}>
           <div style={{marginBottom:'3rem', padding: '1rem 0', borderBottom:'1px solid #e5e5e5',}}>
                <Row>
                    <Col offset={2}> 
                         <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Button  type='link' onClick={()=>router.back()} icon={<ArrowLeftOutlined rev={undefined}/>}/>
                            <Title style={{margin:'0', textTransform:'capitalize'}} level={3}>Create Community</Title>
                        </div>
                    </Col>
                </Row>
            </div> 
           <Row > 
                <Col offset={2} span={11}>
                     {isBankConnected
                        ? null
                        : <Alert
                            style={{ marginBottom: '2rem' }}
                            type="info"
                            showIcon
                            message='Connect your bank account'
                            closable description='Your community will not be listed on marketplace because you are still yet to add a bank account. It will be saved as drafts until an account is linked to your profile.'
                            action={
                                <Button onClick={() => router.push('/organizations/billings')} size="small">
                                    Add account
                                </Button>
                            }
                        />}
                <Steps current={currentStep} items={items} />
                    {/* <BasicForm nextStep={next}/> */}
                    {steps[currentStep].content}
                </Col>
           </Row>
        </div>
         )

}

interface BasicInfoProps{
    nextStep: (data:any)=>void,
    isBankConnected: boolean
}

const getBase64 = (file: any): Promise<string> => 
new Promise((resolve, reject) => {
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = () => resolve(reader.result as string);
reader.onerror = (error) => reject(error);
});

const PLACEHOLDER_IMAGE = '/placeholder.png'

function BasicForm({nextStep, isBankConnected}:BasicInfoProps){

    
     // TODO: set field for editing
     //@ts-ignore

     const {currentOrg} = useOrgs()
     const {paseto} = useAuthContext()
     const router = useRouter()

     const [isHashingAssets, setIsHashingAssets] = useState(false)
     const [logoImage, setLogoImage] = useState(PLACEHOLDER_IMAGE)

     const urlPrefix = useUrlPrefix()

     // make this default value to be lineskip images first element
    const artworkRef = useRef<string|null>(lineSkipHashes[0])
    

    const queryClient = useQueryClient()

    function handleArtworkChange(hash:string){
        artworkRef.current = hash
    }


    const extractLogoImage = async(e: any) => {
        // e.preventDefault()
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
        return e;
        }

        const imageBlob = e.fileList[0].originFileObj
        console.log("blob",imageBlob)
        const src = await getBase64(imageBlob)
        setLogoImage(src)
   

    return e?.fileList;
  };
   

     const onFinish = async (formData:any)=>{

            const logoRes = await formData.logoImageHash
            setIsHashingAssets(true)
            //@ts-ignore
            const imageHash = await asyncStore(logoRes[0].originFileObj)
            //@ts-ignore
            const artworkHash = typeof artworkRef.current === 'object'? await asyncStore(artworkRef.current): artworkRef.current
            setIsHashingAssets(false)



        // // only generate key if it's a new service
            const formObject: CommunityReq = {
                orgId: currentOrg.orgId,
                // @ts-ignore
                status: isBankConnected? '1': '4',
                name: `Key to: ${formData.name}`,
                price: String(formData.price * 100),
                currency: 'USD',
                description:formData.description,
                artworkHash: artworkHash,
                logoImageHash: imageHash
            }


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
            const customMessage = isBankConnected? 'Successfully created new community!': 'Successfully created community as draft!'
            notification['success']({
                message: customMessage
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
            rules={[
                { required: true, message: 'This field is required' },
                { max: 150, message: 'Sorry, your service name cant be more than 150 characters' },
                ]}
         >
            <Input allowClear size='large' addonBefore='Key to:' maxLength={150} showCount placeholder="Napoli" />
        </Form.Item>

        <Form.Item name='description' rules={[{max:500, message:"Description shouldn't exceed 500 characters"},{ required: true, message: 'This field is required' }]}  label="Description">
            <TextArea allowClear maxLength={500} size='large' showCount  placeholder='Tell us more about this community' rows={2} />
        </Form.Item>

          {/* price */}
          <Row>
            <Col span={11} style={{height:'100%'}}>
                <Form.Item
                    name='price'
                    label='Price'
                    style={{width:'100%'}}
                    rules={[{ required: true, message: 'Please input a valid price!' }, { pattern: /^\d+$/, message: 'Price must be a number'}]}
                >
                    <Input size='large' style={{width:'100%'}} suffix='Per DAT' prefix="$" placeholder="0.00" /> 
                </Form.Item> 
            </Col>
        </Row>

 

        <Artwork onHandleArtwork={handleArtworkChange}/>

        <div style={{marginBottom:'2rem', marginTop:'3rem'}}>
            <Title level={3}>Image Upload</Title>
            <Text >Your logo  will be visible on the marketplace listing</Text> 
            <Tooltip trigger={['click']} placement='right' overlayInnerStyle={{width:'500px'}}  title={<LogoTip src='/explainers/community-logo-explainer.png'/>}>
                <Button type="link">Show me <QuestionCircleOutlined rev={undefined}/></Button>
            </Tooltip>
        </div>

        <AntImage alt='community logo' src={logoImage} style={{width:'150px',height:'150px', borderRadius:'50%', border:'1px solid #e5e5e5'}}/>
        <Form.Item
            name="logoImageHash"  
            valuePropName="logoImageHash"
            getValueFromEvent={extractLogoImage}
            extra={'Please upload a PNG or JPEG that is 2400px x 1200px'} 
            rules={[{ required: true, message: 'Please upload an image' }]}
        >
            
            <Upload  name="logoImageHash" multiple={false} fileList={[]}  >
                    <Button size='small' type='link'>Upload logo image</Button>
            </Upload>
        </Form.Item>

        <Form.Item style={{marginTop:'4rem'}}>
            <Space>
                <Button onClick={()=>router.back()}  type='ghost'>
                    Cancel
                </Button>

               <SubmitButton
                    form={form}
                    isBankConnected={isBankConnected}
                    isCreatingData={isCreatingData}
                    isHashingAssets={isHashingAssets}
                />

            </Space>
            
        </Form.Item>

        </Form>
    )
}



interface VenueFormProp{
    communityId: string,
}
function VenuesForm({communityId}:VenueFormProp){

    const [form] = Form.useForm()
    const router = useRouter()
    const queryClient = useQueryClient()


    const urlPrefix = useUrlPrefix()

    const {paseto} = useAuthContext()

    function transformContactNumbersInVenues(venues:CommunityVenueFormType[]){

        const venuesCopy = [...venues];
        const transformedVenues  = venuesCopy.map((venue:CommunityVenueFormType)=>{ 
           return{
               name: venue.name,
               email: venue.email,
               promotion: venue.promotion,
               marketValue: String(venue.marketValue * 100),
               address: venue.address,
               contactNumber: `+1${venue.contact.areaCode}${venue.contact.centralOfficeCode}${venue.contact.tailNumber}`
           }
        })
   
        return transformedVenues;
      }
   


    async function onFinish(formData:any){
        const transformedVenues = transformContactNumbersInVenues(formData.venues)
        // console.log('form data',transformedVenues)
        // const transformedDates = convertDates(formData.venues)
        const reqPayload = {
            communityId: communityId,
            venues: transformedVenues
        }

        createData.mutate(reqPayload)

    }


    const createDataHandler = async(newItem:CommunityVenueReq)=>{ 
        const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community-venues`, newItem,{
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
            message: 'Successfully added venues under your community!'
        })
            router.back()
            // nextStep(data.data)
            
       },
        onError:(err)=>{
            console.log(err)
            notification['error']({
                message: 'Encountered an error while creating adding venues to your community',
              });
            // leave modal open
        } ,
        onSettled:()=>{
            queryClient.invalidateQueries(['all-communities'])
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
            name="communityVenues"
            initialValues={{ remember: false }}
            layout='vertical'
            form={form}
            style={{marginTop:'2rem'}}
            onFinish={onFinish}
            >

            <Form.List name="venues">
                {(fields, { add, remove }) => (
                    <>
                    {fields.map(({ key, name, ...restField }) => (
                       <CommunityVenueForm
                        name={name}
                        formInstance = {form}
                        key={key}
                        restField={restField}
                        remove={remove}
                       />
                    ))}

                    <Form.Item>
                        <Button icon={<PlusCircleOutlined rev={undefined} />} size='large' shape='round' onClick={() => add()}>
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

interface IArtwork{
    onHandleArtwork: (value:any)=>void
}

function Artwork({onHandleArtwork}:IArtwork){

    const router = useRouter()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [currentServiceItemType, setCurrentServiceItemType] = useState<null|string|string[]|undefined>(undefined)
    const [selectedArtwork, setSelectedArtwork] = useState('') 

    const isDataSource = selectedArtwork.startsWith('data')


    const props: UploadProps = {
        name: 'file',
        multiple:false, 
        // fileList:[],
        showUploadList:false,
        onChange: async (info) => {
            const imageBlob = info.file.originFileObj
              const src = await getBase64(imageBlob)
              setSelectedArtwork(src)
              onHandleArtwork(info.file.originFileObj)
        },
      };

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
                <Tooltip trigger={['click']} placement='right' overlayInnerStyle={{width:'500px'}}  title={<LogoTip  src='/explainers/community-artwork-explainer.png'/>}>
                        <Button type="link">Learn more<QuestionCircleOutlined rev={undefined} /></Button>
                </Tooltip>
            </div> 
            <div style={{display:'flex',width:'400px', marginTop:'2rem', flexDirection:'column'}}>
                <div style={{alignSelf:'flex-end',display:'flex'}}>
                <Button shape='round' icon={<SelectOutlined rev={undefined} />} style={{ marginBottom:'.5rem'}} onClick={toggleDrawer}>Select a different artwork</Button> 
                <Text style={{margin:'0 .5rem'}}>or</Text>
                <Upload fileList={[]} {...props}>
                    <Button icon={<UploadOutlined rev={''} style={{ marginBottom:'.5rem'}}  />} size='small' type='link'>Upload image</Button>
                </Upload>
                </div>
                <AntImage alt='artwork'  style={{width:'400px', height:'400px', marginBottom:'.5rem', objectFit:'cover'}}  src={isDataSource? selectedArtwork: `${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${selectedArtwork}`}/>
                <Text type='secondary'>This cover image will be used for your listing on marketplace and for the Digital access token NFT</Text>
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
    



function LogoTip({src}:{src:string}){
    return(
        <div style={{}}>
            <AntImage style={{objectFit:'cover', marginBottom:'1rem'}}  src={src} alt='Artwork explainer as displayed on marketplace'/>
            <Text style={{color:'white'}}>{"It is very important to provide the requested image size (2400 x 1200) or else the image will appear distorted on the marketplace"}</Text>
        </div>
    ) 
}




interface CommunityVenueFormProps{
    name: number,
    restField:{fieldKey?: number | undefined},
    remove: (index: number | number[]) => void,
    formInstance: FormInstance<any>
}

function CommunityVenueForm({remove, name, formInstance, restField}:CommunityVenueFormProps){


    const [formAddress, setFormAddress] = useState('')
    
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
            street: '',
            latitude:String(place.geometry.location.lat()),
            longitude:String(place.geometry.location.lng())
        };
        addressComponents.forEach((address:any)=>{
            const type = address.types[0]
            if(type==='country') addressObj.country = address.long_name
            if(type==='route') addressObj.street = address.long_name
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
            fields: ['address_components','geometry','formatted_address','place_id']
        },
        onPlaceSelected: (place) => {

            
            const fullAddress = extractFullAddress(place)
            
            formInstance.setFieldValue(['venues',name,'address','fullAddress'],place?.formatted_address)
            formInstance.setFieldValue(['venues',name,'address','country'],fullAddress.country)
            formInstance.setFieldValue(['venues',name,'address','street'],fullAddress.street)
            formInstance.setFieldValue(['venues',name,'address','state'],fullAddress.state)
            formInstance.setFieldValue(['venues',name,'address','city'],fullAddress.city)
            formInstance.setFieldValue(['venues',name,'address','latitude'],fullAddress.latitude)
            formInstance.setFieldValue(['venues',name,'address','longitude'],fullAddress.longitude)
            formInstance.setFieldValue(['venues',name,'address','placeId'],place?.place_id)
            // add street address

            console.log(fullAddress)
        
            //@ts-ignore 
          antInputRef.current.input.value = place?.formatted_address

        },
      });
    
  

    return(
        <div style={{padding:'1rem', marginBottom:'1rem', borderRadius:'4px', border:'1px solid #FFC680'}} >

                            {/* label */}
                            <Form.Item
                                    {...restField}
                                    required
                                    // label='Label'
                                    // rules={[{ required: true, message: 'Please provide a valid label for the date' }]}
                                    name={[name, 'name']}
                                    style={{width:'100%'}}
                                >
                                <Input size='large'required placeholder='Benjamins On Franklin' />
                            </Form.Item>

                            {/* email */}
                            <Form.Item
                                    {...restField}
                                    required
                                    // label='Label'
                                    // rules={[{ required: true, message: 'Please provide a valid label for the date' }]}
                                    name={[name, 'email']}
                                    style={{width:'100%'}}
                                >
                                <Input size='large' type='email' required placeholder='billcage@yahoo.com' />
                            </Form.Item>

                                {/* promotion */}
                            <Form.Item  {...restField} name={[name,'promotion']} rules={[{ required: true, message: 'Please write a description for your venue' }]}  label="Promotion">
                                <TextArea allowClear maxLength={300} size='large' showCount  placeholder='One flight of our award winning wines' rows={2} />
                            </Form.Item>

                            {/* marketValue */}
                            <Row>
                                <Col span={11} style={{height:'100%'}}>
                                    <Form.Item

                                        {...restField} 
                                        name={[name,'marketValue']} 
                                        extra="Market Value of the promotion is required so that the Community DAT can be properly priced on the Marketplace"
                                        label='Market Value'
                                        style={{width:'100%'}}
                                        rules={[{ required: true, message: 'Please input a valid price!' }]}
                                    >
                                        <Input size='large' style={{width:'100%'}}  prefix="$" placeholder="0.00" /> 
                                    </Form.Item> 
                                </Col>
                            </Row>

                            <Form.Item
                                name={[name, 'address']}
                                {...restField}
                            >
                                <Input.Group>
                                    <Form.Item  
                                    name={[name,'address','fullAddress']}
                                    label='Address'
                                    extra={<Text type="secondary"><InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} rev={undefined} /> Please refresh the page if the address you selected is not being displayed in the field </Text> }
                                    rules={[{ required: true, message: 'Please input a valid address!' }]}
                                >
                                    <Input 
                                        // suffix={
                                        //     <Tooltip title="Please refresh the page if the date you selected is not being displayed in the field">
                                        //       <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                        //     </Tooltip>
                                        //   }                                                                                                                
                                        size="large" 
                                        value={formAddress}
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
                                    <Form.Item hidden name={['address','fullAddress']} >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name={['address','country']} hidden>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name={['address','state']} hidden>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name={['address','street']} hidden>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name={['address','latitude']} hidden>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name={['address','longitude']} hidden>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name={['address','placeId']} hidden>
                                        <Input/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>   
                            

                            <Form.Item
                                label="Contact Number"
                                {...restField}
                                // name={[name, 'contact']}
                                required 
                                style={{marginBottom:'1rem'}}
                                rules={[{ required: true, message: 'Please input a valid phone number' }]}
                            >
                                <Input.Group compact>
                                    <Form.Item  name={[name,'contact','countryCode']} noStyle>
                                        <Input allowClear style={{width:'10%'}} disabled size="large"/>
                                    </Form.Item>
                                    <Form.Item  name={[name,'contact','areaCode']} noStyle>
                                        <Input allowClear ref={areaCodeRef} maxLength={3} onChange={handleAreaCodeRef} style={{width:'20%'}} size="large" placeholder="235" />
                                    </Form.Item>
                                    <Form.Item name={[name,'contact','centralOfficeCode']} noStyle>
                                        <Input allowClear ref={centralOfficeCodeRef} onChange={handleCentralOfficeCode} maxLength={3} style={{width:'20%'}} size="large" placeholder="380" />
                                    </Form.Item>
                                    <div style={{height:'40px',margin:'0 .3rem 0 .3rem', display:'inline-flex', alignItems:'center',  verticalAlign:'center'}}>
                                    <MinusOutlined style={{ color: "#e7e7e7" }} rev={undefined} />
                                    </div>
                                    <Form.Item name={[name,'contact','tailNumber']} noStyle>
                                        <Input ref={tailNoRef} maxLength={4} style={{width:'20%'}} size="large" placeholder="3480" />
                                    </Form.Item>
                                </Input.Group>
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
                                        {/* @ts-ignore */}
                                        <Button shape="round" icon={<MinusCircleOutlined  />} size='small'  type='text'>Remove Venue</Button>
                                    </Popconfirm>
                                    </Space>           
                                </Form.Item>
                            </Col>
         </div>
    )
}


interface SubmitButtonProps{
    isHashingAssets: boolean,
    isCreatingData: boolean,
    isBankConnected: boolean,
    form: FormInstance
}


const SubmitButton = ({ form, isBankConnected, isCreatingData, isHashingAssets }:SubmitButtonProps) => {
    const [submittable, setSubmittable] = useState(false);
  
    // Watch all values
    const values = Form.useWatch([], form);
  
    useEffect(() => {
        

      form.validateFields({validateOnly:true}).then(
        (res) => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        },
      );
    }, [values]);
  
    return (
        <Button shape="round" type="primary" disabled={!submittable} size="large" loading={isHashingAssets || isCreatingData}  htmlType="submit" >
         { isBankConnected? 'Create community': 'Save as draft'}
     </Button>
    );
  };