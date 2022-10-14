import {useState} from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import RegisterOrgForm from '../components/Accounts/RegisterOrgForm/RegisterOrgForm';
import LoginForm from '../components/Accounts/LoginForm/LoginForm';

const Home: NextPage = () => {

  const [formType, setFormType] = useState('registerOrg')

  const showRegisterForm = () =>{
    setFormType('registerOrg')
  }

  const showLoginForm = () =>{
    setFormType('login')
  }

  return (
    <div className='flex w-full h-full justify-center items-center' >
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      { formType === 'registerOrg'?<RegisterOrgForm toLoginForm={showLoginForm}/>:<LoginForm toRegisterOrg={showRegisterForm}/>}

    </div>
  )
}

export default Home
