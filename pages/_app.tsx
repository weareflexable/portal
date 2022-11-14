import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'antd/dist/antd.css';
import { AuthContextProvider } from '../context/AuthContext';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { OrgContextProvider } from '../context/OrgContext';
import { ServicesContextProvider } from '../context/ServicesContext';

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <OrgContextProvider>
            <ServicesContextProvider>
                <Component {...pageProps} />
            </ServicesContextProvider>
        </OrgContextProvider>
      </AuthContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default MyApp
