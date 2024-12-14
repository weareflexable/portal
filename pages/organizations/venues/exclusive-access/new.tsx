import React,{useEffect, useRef, useState} from 'react';
import {Card,Form, Image as AntImage, Input,InputNumber, DatePicker,Upload,Button,notification, Space, Alert, Typography, TimePicker, Select, Row, Col, Steps, Radio, Tooltip, Popconfirm, message, Drawer, Collapse, FormInstance, UploadProps} from 'antd';
const { TextArea } = Input;
import Image from 'next/image'

const { Panel } = Collapse;


const {Text,Title} = Typography;
import {QuestionCircleOutlined,SelectOutlined,ArrowLeftOutlined,MinusCircleOutlined,InfoCircleOutlined,PlusCircleOutlined,UploadOutlined} from '@ant-design/icons'


import { useRouter } from 'next/router';
import { Availability, AvailabilityPayload, ServiceItem, ServiceItemReqPaylod } from '../../../../types/Services';
import dayjs from 'dayjs'
import { useServicesContext } from '../../../../context/ServicesContext';
import useServiceItemTypes from '../../../../hooks/useServiceItemTypes';
import { uploadToPinata } from '../../../../utils/nftStorage';
import axios from 'axios';
import { useAuthContext } from '../../../../context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useUrlPrefix from '../../../../hooks/useUrlPrefix'; 
import { useOrgContext } from '../../../../context/OrgContext';
import utils from '../../../../utils/env';







const getBase64 = (file: any): Promise<string> => 
new Promise((resolve, reject) => {
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = () => resolve(reader.result as string);
reader.onerror = (error) => reject(error);
});


interface ServiceFormProps{
}

export default function ServiceItemForm(){

    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0);
    // State to hold the id of the service item that will get created in the
    // first form.
    const [createdItemId, setCreatedItemId] = useState('')

    const {currentOrg} = useOrgContext()

     const isBankConnected = currentOrg?.isBankConnected
    
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
            content: <BasicForm isBankConnected={isBankConnected} nextStep={next}/>,
            },
            {
            title: 'Customize',
            content: <AvailabilityForm serviceItemId={createdItemId} />,
            },
        ];


      const items = steps.map((item) => ({ key: item.title, title: item.title }));


    return (
        <div style={{background:'#ffffff', height:'100%', minHeight:'100vh'}}>
           <div style={{marginBottom:'3rem', padding: '1rem', borderBottom:'1px solid #e5e5e5',}}>
                <Row>
                    <Col offset={1}> 
                   
                         <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Button  type='link' onClick={()=>router.back()} icon={<ArrowLeftOutlined rev={undefined}/>}/>
                            <Title style={{margin:'0', textTransform:'capitalize'}} level={3}>{router.isReady?`New ${router.query.label}`:'...'}</Title>
                        </div>
                    </Col>
                </Row>
            </div>
           <Row > 
                <Col offset={5} span={11}>
                      {isBankConnected
                        ? null
                        : <Alert
                            style={{ marginBottom: '2rem' }}
                            type="info"
                            showIcon
                            message='Connect your bank account'
                            closable description='Your services will not be listed on marketplace because you are still yet to add a bank account. It will be saved as drafts until an account is linked to your profile.'
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

function BasicForm({nextStep, isBankConnected}:BasicInfoProps){

    
     // TODO: set field for editing
     //@ts-ignore

     const [isHashingImage, setIsHashingImage] = useState(false)
     const {currentService} = useServicesContext()
     const {paseto} = useAuthContext()
     const router = useRouter()

     const urlPrefix = useUrlPrefix()

     // make this default value to be lineskip images first element
    const artworkRef = useRef<string|any>(lineSkipHashes[0])
    

    const queryClient = useQueryClient()

    function handleArtworkChange(hash:string){
        artworkRef.current = hash
    }

   

     const onFinish = async (formData:any)=>{

        // availability should return empty array whenever user decides not to add custom dates
        // const transformedAvailability = formData.availability?convertDates(formData.availability):[]
        setIsHashingImage(true)
        const artworkHash = typeof artworkRef.current === 'object'? await uploadToPinata(artworkRef.current): artworkRef.current
        setIsHashingImage(false)

        // // only generate key if it's a new service
            const formObject: ServiceItemReqPaylod = {
                name: formData.name,
                price: String(Number(formData.price) * 100),
                ticketsPerDay: Number(formData.ticketsPerDay),
                description:formData.description,
                // status: isBankConnected? '1': '4',
                status: '1',
                orgServiceId: currentService.id,
                serviceItemTypeId: router.query.key, // TODO: Get this value from context,
                logoImageHash: artworkHash as string,
                validityStartDate: dayjs(formData.validity.start).format(),
                validityEndDate: dayjs(formData.validity.end).format()
            }

            createData.mutate(formObject)


    }
    const [form] = Form.useForm()


    const createDataHandler = async(newItem:ServiceItemReqPaylod)=>{

        const {data} = await axios.post(`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items`, newItem,{
            headers:{
                "Authorization": paseto
            },
        })
        return data
    }

    const createData = useMutation(createDataHandler,{
       onSuccess:(data)=>{
        // form.resetFields()
        const customMessage = isBankConnected? 'Successfully created new exclusive-access!': 'Successfully created exclusive-access as draft!'
        notification['success']({

            message: customMessage
        })
            console.log(data)
            nextStep(data.data)
            
       },
       onSettled:()=>{
        queryClient.invalidateQueries(['all-serviceItems'])
       },
        onError:(err)=>{
            console.log(err)
            notification['error']({
                message: 'Encountered an error while creating service itme',
              });
            // leave modal open
        } 
    })

    const {isError, isLoading:isCreatingData, isSuccess:isDataCreated, data:createdData} = createData


   

    return(
        <Form
        name="serviceItemForm"
        initialValues={{ remember: false }}
        layout='vertical'
        form={form}
        style={{marginTop:'2rem'}}
        onFinish={onFinish}
        >

        <Form.Item
            name="name"
            label="Title"
            rules={[
                { required: true, message: 'This field is valid' },
                { max: 150, message: 'Sorry, name cant be more than 150 characters' },
                
            ]}
         >
            <Input allowClear size='large' maxLength={150} showCount placeholder="Wonderland cage" />
        </Form.Item>

        <Form.Item name='description' rules={[
            { required: true, message: 'Please write a description for your service' },
            { min: 25, message: 'Please provide a minimum of 25 characters' },
            ]}  label="Description">
            <TextArea allowClear maxLength={1000} minLength={25} size='large' showCount  placeholder='Tell us more about this service' rows={2} />
        </Form.Item>

          {/* price and tickets per day */}
          <Row>
            <Col span={11} style={{height:'100%'}}>
                <Form.Item
                    name='price'
                    label='Price'
                    style={{width:'100%'}}
                    rules={[{ required: true, message: 'This field is required!' }, { pattern: /^\d+$/, message: 'Value entered must be a number' },]}
                >
                    <Input size='large' style={{width:'100%'}} suffix='Per ticket' prefix="$" placeholder="0.00" /> 
                </Form.Item> 
            </Col>
            <Col offset={1} span={12}>
                <Form.Item
                    name='ticketsPerDay'
                    label='Tickets per day'
                    style={{width:'100%'}}
                    rules={[{ required: true, message: 'This field is required!' }, { pattern: /^\d+$/, message: 'Value entered must be a number' },]}
                    >
                    <Input size='large' suffix='Tickets Per day' style={{width:'100%'}} placeholder="20" />
                </Form.Item>
            </Col>
        </Row>

        <Form.Item
            label="Validity Period"
            hasFeedback
            required
            style={{marginBottom:'0'}}
            extra={`Enter a timeframe you want your DAT to be redeemable by customers. This may vary based on your industry and service you provide. Eg: a "Saturday Night Line Skip" at a bar might be valid from 7pm on Saturday night until 4am Sunday morning, to allow the late night partygoers a chance to redeem their tickets. A restaurant DAT for a "Last Minute Saturday Reservation" might only need to have validity period of 12 noon - 12 midnight`} 
            rules={[{required: true, message: 'This field is required' }]}
        >
            <Space.Compact size='large'  block>
            <Form.Item  rules={[{required:true, message:'Please provide a start time'}]}  name={['validity','start']} noStyle>
                <TimePicker  use12Hours placeholder="Start"  format="h A" size="large" />
            </Form.Item>
            <Form.Item  rules={[{required:true, message:'Please provide a end time'}]}  name={['validity','end']} noStyle>
                <TimePicker use12Hours placeholder="End"  format="h A" size="large" />
            </Form.Item>

            </Space.Compact>
            {/* <Text style={{marginLeft:'1rem'}}>9 hrs interval for all tickets</Text>   */}

        </Form.Item> 



        <Artwork onHandleArtwork={handleArtworkChange}/>

        <Form.Item style={{marginTop:'4rem'}}>
            <Space>
                <Button onClick={()=>router.back()}  type='ghost'>
                    Cancel
                </Button>
                <SubmitButton
                    isBankConnected={isBankConnected}
                    isCreatingData={isCreatingData}
                    isHashingAssets={isHashingImage} 
                    form={form}
                />
            </Space>
            
        </Form.Item>

        </Form>
    )
}



interface AvailabilityProp{
    serviceItemId: string,
}
function AvailabilityForm({serviceItemId}:AvailabilityProp){

    const [form] = Form.useForm()
    const router = useRouter()
    const queryClient = useQueryClient()

    const urlPrefix = useUrlPrefix()

    const {paseto} = useAuthContext()
    
    // This functions takes in custom availability array and
   // changes the format of the date field of every item in the array.
   function convertDates(customDates:Availability){ // TODO: rename this function and it's parameters
    console.log(customDates)
     const res = customDates.map(date=>{ 
          const updatedDate = {
              ...date,
              date: dayjs(date.date).format(),
              ticketsPerDay: Number(date.ticketsPerDay),
              price: String(date.price*100)
          }
          return updatedDate
      })

      return res;
   }

    async function onFinish(formData:any){
        console.log('form data',formData.availability)
        const transformedDates = convertDates(formData.customDates)
        const reqPayload = {
            serviceItemId: serviceItemId,
            availability: transformedDates
        }

        createData.mutate(reqPayload)
    }


    const createDataHandler = async(newItem:AvailabilityPayload)=>{ 
        const {data} = await axios.post(`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items/availability`, newItem,{
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
            <Title style={{marginBottom:'.2rem'}} level={3}>Create Custom Dates</Title>
            <div style={{ marginTop:'1rem', display:'flex', flexDirection:'column', marginBottom:'1rem', borderRadius:'4px'}}>
                <Text style={{marginBottom:'.2rem'}}>{`You can add multiple custom dates (i.e. New Year's Eve, St. Patricks Day, Cinco De Mayo, e.t.c) on which this service will be available on the marketplace.`}</Text>
                <Text style={{marginBottom:'1rem',display:'block'}}>{` These custom dates generally align with increased traffic/demand on your establishment and price & quantity of DATs should reflect that. These prices and quantity changes will go into effect on that day and that day only. After the custom date has passed, DAT price and quantitly will go back to the default settings you outlined on the "Basic info" step`}</Text>
                <Collapse>
                    <Panel header="See example" key="1">
                        <Text style={{marginTop:'.2rem'}}>{`For Eg. A Bar that offers 50 Line Skip DATs for $15 each on a normal Saturday night may wish to create a custom date for New Year's Eve in which they offer 100 Line Skip DATs for $25 each`}</Text>
                    </Panel>
                </Collapse>
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

            <Form.List name="customDates">
                {(fields, { add, remove }) => (
                    <>
                    {fields.map(({ key, name, ...restField }) => (
                        <div style={{padding:'1rem', marginBottom:'1rem', borderRadius:'4px', border:'1px solid #FFC680'}} key={key}>

                            {/* label */}
                            <Form.Item
                                    {...restField}
                                    // @ts-ignore
                                    requiredMark='optional'
                                    // label='Label'
                                    // rules={[{ required: true, message: 'Please provide a valid label for the date' }]}
                                    name={[name, 'name']}
                                    style={{width:'100%'}}
                                >
                                <Input size='large' suffix={<Tooltip title='This field is optional'><InfoCircleOutlined rev={undefined}/></Tooltip> } placeholder='Christmas eve' />
                            </Form.Item>

                            {/* price and tickets per day */}
                            <Row>
                                <Col span={11} style={{height:'100%'}}>
                                    <Form.Item
                                        name={[name, 'price']}
                                        // label='Price'
                                        {...restField}
                                        style={{width:'100%'}}
                                        rules={[{ required: true, message: 'Please input a valid price!' }]}
                                    >
                                        <Input size='large' style={{width:'100%'}} suffix='Per ticket' prefix="$" placeholder="0.00" /> 
                                    </Form.Item> 
                                </Col>
                                <Col offset={1} span={12}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'ticketsPerDay']}
                                        // label='Tickets per day'
                                        style={{width:'100%'}}
                                        rules={[{ required: true, message: 'Please input a valid number!' }]}
                                        >
                                        <Input size='large' suffix='Tickets Per day' style={{width:'100%'}} placeholder="20" />
                                    </Form.Item>
                                </Col>
                            </Row>
            
                                {/* date */}
                            <Row>
                                <Col span={11}>
                                    <Form.Item
                                        {...restField}
                                        rules={[{ required: true, message: 'Please select a date!' }]}
                                        name={[name, 'date']}
                                        // label="Date"
                                        style={{width:'100%'}}
                                    >
                                        <DatePicker size='large' style={{width:'100%'}} />
                                    </Form.Item>
                                </Col>
                            </Row>
            
                            
                            {/* controls */}
                            <Col span={4}>
                                <Form.Item style={{marginBottom:'0', width:'100%'}}>
                                    <Space >
                                    <Popconfirm
                                        title="Remove custom date"
                                        description="Are you sure to remove this custom date?"
                                        onConfirm={() => remove(name)}
                                        // onCancel={cancel}
                                        okText="Yes, Remove"
                                        cancelText="No"
                                    >
                                        <Button shape="round" icon={<MinusCircleOutlined rev={undefined}  />} size='small'  type='text'>Remove Custom Date</Button>
                                    </Popconfirm>
                                    </Space>           
                                </Form.Item>
                            </Col>
                         </div>
                    ))}

                    <Form.Item>
                        <Button icon={<PlusCircleOutlined rev={undefined} />} size='large' shape='round' onClick={() => add()}>
                             Add Custom Date
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
                    !form.isFieldTouched('customDates')
                    // !!form.getFieldsError().filter(({ errors }) => errors.length).length
                    }
                >
                Create Custom Dates
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
            setSelectedArtwork(router.query.label === 'Bottle service'?bottleServiceHashes[0]:router.query.label == 'Reservation'?reservationHashes[0]:lineSkipHashes[0])
            onHandleArtwork(router.query.label === 'Bottle service'?bottleServiceHashes[0]:router.query.label == 'Reservation'?reservationHashes[0]:lineSkipHashes[0])
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
                <Tooltip trigger={['click']} placement='right' overlayInnerStyle={{width:'500px'}}  title={<LogoTip  src='/explainers/serviceItem-explainer.png'/>}>
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
                <AntImage alt='artwork'  style={{width:'400px', height:'400px', marginBottom:'.5rem', objectFit:'cover'}}  src={isDataSource? selectedArtwork: `${utils.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${selectedArtwork}`}/>
                <Text type='secondary'>This cover image will be used for your listing on marketplace and for the Digital Access Token NFT</Text>
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
 
    const currentHashes = currentServiceItemType && currentServiceItemType === 'Line skip'?lineSkipHashes:currentServiceItemType === 'Reservation'? reservationHashes:bottleServiceHashes || lineSkipHashes

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
            {/* <Image alt='artwork for lineskip' style={{objectFit: 'cover', height:'300px', width:'400px'}} src={`${utils.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${lineSkipHash}`}/> */}
            {
                currentHashes.map((image:string)=>(
                    <div key={image} onClick={()=>onSelectImage(image)} style={{border:`4px solid ${selected === image? '#1677ff':'#eeeeee'}`,borderRadius:'4px',  display:'inline-block', marginRight:'1rem', padding:'.5rem'}}>
                        <Image  alt='artwork for lineskip' height='300px' width='300px'  src={`${utils.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${image}`}/> 
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


interface ILogoTip{
    src:string
}

function LogoTip({src}:ILogoTip){
    return(
        <div>
            <AntImage style={{objectFit:'cover'}}  src={src} alt='Service explainer as displayed on marketplace'/>
            <Text style={{color:'white'}}>It is very important that you provide the requested the image size else, it will look distorted on marketplace.</Text>
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

    const router = useRouter() 
  
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


    // const displayButton = isBankConnected? (
    //      <Button shape="round" type="primary" disabled={!submittable} size="large" loading={isHashingAssets || isCreatingData}  htmlType="submit" >
    //      {router.isReady?`Create ${router.query.label}`:'...'}
    //  </Button>
    // ):(
    //      <Button shape="round" type="primary" disabled={!submittable} size="large" loading={isHashingAssets || isCreatingData}  htmlType="submit" >
    //      Save as draft
    //  </Button>
    // )
    const displayButton = (
    <Button shape="round" type="primary" disabled={!submittable} size="large" loading={isHashingAssets || isCreatingData}  htmlType="submit" >
         {router.isReady?`Create ${router.query.label}`:'...'}
     </Button>)
   
  
    return (
       displayButton
    );
  };
  