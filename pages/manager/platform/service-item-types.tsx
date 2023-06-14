import { Button, Col, Row, Layout, Typography, Spin, Menu } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
const {Title} = Typography
const {Content} = Layout
import ManagerLayout from "../../../components/Manager/Layout/Layout";
import ServiceItemTypesView from "../../../components/Manager/Platform/serviceItemTypesView";
import PlatformLayout from "../../../components/Layout/PlatformLayout";


export default function Platform(){
    return(
           
                        <ServiceItemTypesView/>
            
    )
}


Platform.PageLayout = PlatformLayout

