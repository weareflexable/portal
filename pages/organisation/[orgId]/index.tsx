import React,{Suspense} from 'react'
import {Spin} from 'antd'
import ServiceView from '../../../components/ServicesPage/ServicesView/ServicesView'
import dynamic from 'next/dynamic'

const DynamicServices = dynamic(()=>import('../../../components/ServicesPage/ServicesView/ServicesView'),{
    ssr:false
})

export default function Services(){

    return( 
        <Suspense fallback={<Spin size='large'/>}>
            <DynamicServices/>
        </Suspense>
    )
}