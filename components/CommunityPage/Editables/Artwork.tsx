import { useQueryClient, useMutation } from "@tanstack/react-query"
import { Row, Col, Button, Space, Typography, Image as AntImage, Drawer, Upload, UploadProps } from "antd"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useAuthContext } from "../../../context/AuthContext"
import useUrlPrefix from "../../../hooks/useUrlPrefix"
import { Community } from "../../../types/Community"
import {SelectOutlined,UploadOutlined} from "@ant-design/icons"
import Image  from 'next/image'
import { getBase64 } from "../../../utils/convertToBase64"
import { useRouter } from "next/router"
import { asyncStore } from "../../../utils/nftStorage"
 
const {Text} = Typography

interface EditableProp{
    selectedRecord: Community
}

export function EditableArtwork({selectedRecord}:EditableProp){
  
  const {paseto} = useAuthContext()

  // make this default value to be lineskip images first element
  const artworkRef = useRef<string|any>(selectedRecord.artworkHash)


 const queryClient = useQueryClient()

    const [isEditMode, setIsEditMode] = useState(false) 
    const [updatedArtworkHash, setUpdatedArtworkHash] = useState(selectedRecord.artworkHash)
    const [artwork, setArtwork] = useState<string|any>(selectedRecord.artworkHash)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const urlPrefix = useUrlPrefix()

    const [imageBlob, setImageBlob] = useState<any>()

    const [isHashingImage, setIsHashingImage] = useState(false)

    const isUploadedImage = artwork.startsWith('data')
    
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }


    
    function toggleDrawer(){
      setIsDrawerOpen(!isDrawerOpen)
    }

    function handleSelectImage(imageHash:string){
      setArtwork(imageHash)
    }
   
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationKey:['artwork_hash'],
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:(data)=>{
        setUpdatedArtworkHash(data.data[0].artworkHash)
        queryClient.invalidateQueries(['community'])
      }
    })

    const props: UploadProps = {
      name: 'file',
      multiple:false, 
      showUploadList:false,
      onChange: async (info) => {
          const imageBlob = info.file.originFileObj
            const src = await getBase64(imageBlob)
            setArtwork(src)
            setImageBlob(info.file.originFileObj)
      },
    };

  
    async function onFinish(){

      //hash image here\
      setIsHashingImage(true)
      const artworkHash = isUploadedImage? await asyncStore(imageBlob): artwork
      setIsHashingImage(false)
  
      const payload = {
        key:'artwork_hash',
        value: artworkHash,
        id: selectedRecord.id
      }
      // setUpdatedArtworkHash(coverImageHash)
      mutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = mutation
  
  
    const editable = ( 
      <div
       style={{ marginTop:'.5rem' }}
       >
        <Row>
          <Col span={10}>
           <Image alt='Artwork preview' src={isUploadedImage? artwork: `${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${artwork}`} height='300px' width='300px'/>
            <div style={{display:'flex',width:'400px', marginTop:'2rem',  flexDirection:'column'}}>
                <div style={{alignSelf:'flex-end',  alignItems:'center', display:'flex'}}>
                <Button shape='round' icon={<SelectOutlined rev={undefined} />} onClick={toggleDrawer}>Select a different artwork</Button> 
                <Text style={{margin:'0 .5rem'}}>or</Text>
                <Upload {...props}>
                    <Button   size='small' type='link'>Upload</Button>
                </Upload>
                </div>
                {/* <AntImage alt='artwork'  style={{width:'400px', height:'400px', marginBottom:'.5rem', objectFit:'cover'}}  src={isDataSource? selectedArtwork: `${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${selectedArtwork}`}/> */}
            </div>
            <ArtworkPicker
              isOpen ={isDrawerOpen}
              onToggleDrawer = {toggleDrawer}
              onSelectImage = {handleSelectImage}
              currentSelectedArtwork = {artwork}
            />
          </Col>
          <Col span={4}>

                <Space >
                    <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                        Cancel
                    </Button>
                    <Button shape="round" loading={isEditing || isHashingImage} disabled={artwork === ''} onClick={onFinish}  type="link" size="small"  htmlType="submit" >
                        Apply changes
                    </Button>
                </Space>
                          
          </Col>
        </Row>
             
      </div>
    )

    const readOnly = (
      <div style={{width:'100%', marginTop:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <AntImage style={{width:'300px', height:'300px', objectFit:'cover', border:'1px solid #f2f2f2'}} alt='cover image for community artwork' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${updatedArtworkHash}`}/>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
    )

    return(
      <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Artwork</Text>
        {isEditMode?editable:readOnly}
      </div>
    )
  }



  



  interface IArtworkPicker{
    isOpen: boolean,
    onSelectImage: (image:string) =>void
    currentSelectedArtwork: string,
    onToggleDrawer: ()=>void
}

  export function ArtworkPicker({isOpen, currentSelectedArtwork, onSelectImage, onToggleDrawer}:IArtworkPicker){
 
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
                    <div key={image} onClick={()=>onSelectImage(image)} style={{border:`4px solid ${currentSelectedArtwork === image? '#1677ff':'#eeeeee'}`,borderRadius:'4px',  display:'inline-block', marginRight:'1rem', padding:'.5rem'}}>
                        <Image  alt='artwork for community' height='300px' width='300px'  src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${image}`}/> 
                    </div>
                ))
            }

        </div>
      </Drawer>
    )
}




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
  
  