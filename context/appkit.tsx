import {
  useAppKitAccount,
  useAppKitProvider,
  createAppKit,
} from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { mainnet, base, baseSepolia } from '@reown/appkit/networks';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BrowserProvider } from 'ethers';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

const GATEWAY_URL = 'https://platform.dev.flexabledats.com';
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined.');

const metadata = {
  name: 'Marketplace',
  description: 'Powering the future of AI interaction through multi-agent collaboration.',
  url: 'https://platform.dev.flexabledats.com/',
  icons: ['https://cyreneai.com/Cyrene_mobile_logo.webp']
};

const setAuthCookies = (token: string, walletAddress: string) => {
  const options = {
    expires: 7,
    path: '/',
    sameSite: 'Strict' as const,
    secure: process.env.NODE_ENV === 'production',
  };
  Cookies.set('erebrus_token_evm', token, options);
  Cookies.set('erebrus_wallet_evm', walletAddress.toLowerCase(), options);
};

const clearAuthCookies = () => {
  Cookies.remove('erebrus_token_evm', { path: '/' });
  Cookies.remove('erebrus_wallet_evm', { path: '/' });
};

const getAuthFromCookies = () => ({
  token: Cookies.get('erebrus_token_evm'),
  wallet: Cookies.get('erebrus_wallet_evm'),
});

const generateAndAuthenticate = async (walletAddress: string, walletProvider: any) => {
  try {
    const messageRes = await axios.post(`${GATEWAY_URL}/api/v1.0/auth/web3/wallet`, {
      walletAddress,
      chainName: 'base',
    });

    const { flowId, eula: message } = messageRes.data.payload;
    const combinedMessage = `${message}${flowId}`;

    if (!walletProvider?.request) throw new Error('Wallet provider not ready');
    await walletProvider.request({ method: 'eth_requestAccounts' });

    const provider = new BrowserProvider(walletProvider);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();

    if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error('Wallet address mismatch');
    }

    let signature = await signer.signMessage(combinedMessage);
    if (signature.startsWith('0x')) signature = signature.slice(2);

    const authRes = await axios.post(`${GATEWAY_URL}/api/v1.0/auth/web3/wallet`, {
      flowId,
      signature,
      walletAddress,
      chainName: 'base',
    });

    const token = authRes?.data?.payload?.token;
    const userId = authRes?.data?.payload?.userId;

    if (token) {
      setAuthCookies(token, walletAddress);
      return { token, userId };
    } else {
      throw new Error('Token not received');
    }
  } catch (error) {
    console.error('Signature/Auth error:', error);
    throw error;
  }
};

export function useWalletAuth() {
  const { isConnected, address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<any>('eip155');

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const { token } = getAuthFromCookies();
    return !!token;
  });

  const authenticate = async () => {
    if (!isConnected || !address) {
      toast.error('Wallet not connected');
      return false;
    }

    try {
      setIsAuthenticating(true);
      const result = await generateAndAuthenticate(address, walletProvider);
      if (result?.token) {
          console.log('token',result?.token)

        setAuthSuccess(true);
        setIsAuthenticated(true); // ✅ Set it here
        toast.success('Login successful');
        return true;
      }
    } catch (error: any) {
      const msg = error?.message || 'Login failed';
      setAuthError(msg);
      toast.error(msg);
    } finally {
      setIsAuthenticating(false);
    }

    return false;
  };

  useEffect(() => {
    const { token } = getAuthFromCookies();
    setIsAuthenticated(!!token);
  }, [isConnected]);

  useEffect(() => {
    if (!isConnected) {
      clearAuthCookies();
      setAuthSuccess(false);
      setIsAuthenticated(false); // ✅ Reset on disconnect
    }
  }, [isConnected]);

  return {
    isConnected,
    address,
    isAuthenticated,
    isAuthenticating,
    authError,
    authSuccess,
    authenticate,
  };
}

export function AppKit({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// AppKit initialization
createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: [baseSepolia],
  projectId,
  defaultNetwork: baseSepolia,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-font-family': 'Inter, sans-serif',
    '--w3m-accent': '#3B82F6',
    '--w3m-color-mix': '#3B82F6',
    '--w3m-color-mix-strength': 40
  },
  chainImages: {
    1: '/ethereum.png',
    8453: '/base.png',
  },
  features: {
    analytics: true,
  },
});
export { getAuthFromCookies };