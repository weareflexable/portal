import { useQueryClient, useMutation } from "@tanstack/react-query"
import { Row, Col, Button, Space, Typography, Image as AntImage } from "antd"
import axios from "axios"
import { useState } from "react"
import { useAuthContext } from "../../../context/AuthContext"
import useUrlPrefix from "../../../hooks/useUrlPrefix"
import { Community } from "../../../types/Community.types"
import { ArtworkPicker } from "../../ServiceItemsPage/Artwork"
import {SelectOutlined} from "@ant-design/icons"
import Image  from 'next/image'

const {Text} = Typography

interface EditableProp{
    selectedRecord: Community
}

export function EditableArtwork({selectedRecord}:EditableProp){
  
    const [isEditMode, setIsEditMode] = useState(false) 
    const [updatedCoverImageHash, setUpdatedCoverImageHash] = useState(selectedRecord.artworkHash)
    const [artwork, setArtwork] = useState(selectedRecord.artworkHash)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const {paseto} = useAuthContext()

    const urlPrefix = useUrlPrefix()

    const queryClient = useQueryClient()
  
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
        setUpdatedCoverImageHash(data.data[0].artworkHash)
        queryClient.invalidateQueries(['community'])
      }
    })

  
    async function onFinish(){
    
  
      const payload = {
        key:'artwork_hash',
        value: artwork,
        id: selectedRecord.id
      }
      // setUpdatedCoverImageHash(coverImageHash)
      mutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = mutation
  
  
    const editable = ( 
      <div
       style={{ marginTop:'.5rem' }}
       >
        <Row>
          <Col span={10}>
           <Image alt='Artwork preview' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${artwork}`} height='300px' width='300px'/>
           <Button shape='round' icon={<SelectOutlined />} style={{ marginTop:'.5rem'}} onClick={toggleDrawer}>Select a different artwork</Button>
            <ArtworkPicker
              currentServiceItemType={'Community'}
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
                    <Button shape="round" loading={isEditing} disabled={artwork === ''} onClick={onFinish}  type="link" size="small"  htmlType="submit" >
                        Apply changes
                    </Button>
                </Space>
                          
          </Col>
        </Row>
             
      </div>
    )

    const readOnly = (
      <div style={{width:'100%', marginTop:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <AntImage style={{width:'300px', height:'300px', objectFit:'cover', border:'1px solid #f2f2f2'}} alt='cover image for community artwork' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${updatedCoverImageHash}`}/>
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
  