import { Button, Drawer, Typography } from "antd"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Image from 'next/image'
const {Title,Text} = Typography;

interface ArtworkProps{
    onHandleArtwork: (value:string)=>void
}
export default function Artwork({onHandleArtwork}:ArtworkProps){

    const router = useRouter()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [currentServiceItemType, setCurrentServiceItemType] = useState<null|string|string[]|undefined>(undefined)
    const [selectedArtwork, setSelectedArtwork] = useState(lineSkipHashes[0]) // 

    function toggleDrawer(){
        setIsDrawerOpen(!isDrawerOpen)
    }

    useEffect(() => {
        if(router.isReady){
            setCurrentServiceItemType(router.query.label)
            setSelectedArtwork(router.query.label === 'Bottle service'?bottleServiceHashes[0]:lineSkipHashes[0])
        }
    }, [router.isReady, router.query.label])

    function selectImage(image:string){
        setSelectedArtwork(image)
        onHandleArtwork(image)
    }

    return(
        <div>
            <Title style={{marginTop:'4rem'}} level={3}>Artwork</Title>
            <div style={{display:'flex', flexDirection:'column'}}>
                <Button type='link' style={{alignSelf:'flex-end'}} onClick={toggleDrawer}>Select a different artwork</Button>
                <Image alt='artwork' objectFit='cover' height='400px' width='300px'  src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${selectedArtwork}`}/>
                <Text type='secondary'>This cover image will be used for listing on marketplace and Digital access token NFT</Text>
            </div>
            <ArtworkPicker 
                currentServiceItemType={currentServiceItemType}
                currentSelectedArtwork = {selectedArtwork}
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
    currentSelectedArtwork: string,
    onToggleDrawer: ()=>void
}
export function ArtworkPicker({isOpen, currentSelectedArtwork, currentServiceItemType, onSelectImage, onToggleDrawer}:ArtworkPickerProps){
 
    const currentHashes = currentServiceItemType && currentServiceItemType === 'Line skip'?lineSkipHashes:bottleServiceHashes || lineSkipHashes

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
    'bafkreigg636y3fh5robhm57fokgxnbnhclzjlw5lujzqw6b5lddper3xuu'
]

