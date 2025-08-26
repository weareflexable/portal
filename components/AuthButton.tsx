'use client';

import { Button } from '../components/ui/button';
import { useWalletAuth } from '../context/appkit';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';
import { cn } from '../components/lib/utils';
import { useDisclosure } from '@chakra-ui/react';
import { UserVerificationDialog } from './modal/UserVerificationDialog';
import { useAppKitAccount } from '@reown/appkit/react';
import { toast } from 'sonner';

export function AuthButton() {
  const {

    isConnected,
    isAuthenticated,
    isAuthenticating,
    authenticate
  } = useWalletAuth();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address } = useAppKitAccount();

  const handleClick = async () => {
    const success = await authenticate();
    if (success) {
      onOpen();
    }
  };

  const handleSuccess = (userData: any) => {
    // You can save userData to state, context, or redirect
    toast.success("User verification successful!");
    console.log("Verified user:", userData);
  };
  if (!isConnected) return null;

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isAuthenticating || isAuthenticated}
        size="sm"
        className={cn(
          "ml-2 transition-all duration-200 font-medium",
          isAuthenticated
            ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
            : "border-orange-200 hover:border-orange-300 hover:bg-orange-50",
          isAuthenticating && "cursor-not-allowed opacity-70"
        )}
        variant={isAuthenticated ? "default" : "outline"}
      >
        {isAuthenticating ? (
          <div className="flex items-center gap-1.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="text-xs">Verifying</span>
          </div>
        ) : isAuthenticated ? (
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            <span className="text-xs">Verify</span>
          </div>
        )}
      </Button>

      {/* ✅ Modal for Account Verification */}
      {/* <AccountSetupModal isOpen={isOpen} onClose={onClose} /> */}
      <UserVerificationDialog
        isOpen={isOpen}
        onClose={onClose}
        walletAddress={address || ""}   // required prop
        onSuccess={handleSuccess}       // required prop
      />
    </>
  );
}
