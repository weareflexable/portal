import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthContextProvider } from '../context/AuthContext';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { OrgContextProvider } from '../context/OrgContext';
import { ServicesContextProvider } from '../context/ServicesContext';
import ErrorBoundary from '../components/shared/ErrorBoundary/ErrorBoundary';

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <OrgContextProvider>
            <ServicesContextProvider>
              <ErrorBoundary name='entire app'>
                <Component {...pageProps} />
              </ErrorBoundary>
            </ServicesContextProvider>
        </OrgContextProvider>
      </AuthContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default MyApp
