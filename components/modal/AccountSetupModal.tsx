'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton, 
  Input,
  Button,
  FormLabel,
  VStack,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useRouter } from 'next/router';
import { getAuthFromCookies } from '../../context/appkit';
import axios from 'axios';

export function AccountSetupModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const { isConnected, address } = useAppKitAccount();
  const toast = useToast();
  const router = useRouter();
  const { token } = getAuthFromCookies();

  // ---------------- SEND OTP (only if email is provided) ----------------
  const handleSendOtp = async () => {
    if (!isConnected || !address || !token) {
      toast({ title: 'Wallet or token missing', status: 'error' });
      return;
    }
    if (!email) {
      toast({ title: 'Please enter your email', status: 'error' });
      return;
    }

    try {
      setSending(true);
      await axios.post(
        'https://platform.dev.flexabledats.com/api/v1.0/user/email/otp_send',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token, // no Bearer
          },
        }
      );

      toast({
        title: 'OTP sent successfully',
        description: `OTP has been sent to ${email}`,
        status: 'success',
      });
    } catch (err: any) {
      const backendError = err?.response?.data?.error;
      toast({
        title: 'Failed to send OTP',
        description: backendError || err.message || 'Error sending OTP',
        status: 'error',
      });
    } finally {
      setSending(false);
    }
  };

  // ---------------- VERIFY OTP & LOGIN ----------------
  const handleVerifyOtp = async () => {
    if (!isConnected || !address || !token) {
      toast({ title: 'Wallet or token missing', status: 'error' });
      return;
    }

    // ✅ If no email & no username → login directly without OTP
    if (!email && !username) {
      localStorage.setItem('PLATFORM_PASETO', token);
      localStorage.setItem('walletAddress', address || '');

      toast({ title: 'Login successful', status: 'success' });
      onClose();
      router.push('/').then(() => window.location.reload());
      return;
    }

    // ✅ If email is provided, require OTP
    if (email && !otp) {
      toast({ title: 'Please enter OTP received on email', status: 'error' });
      return;
    }

    try {
      setVerifying(true);

      // Call OTP verify if email is provided
      if (email) {
        await axios.post(
          'https://platform.dev.flexabledats.com/api/v1.0/user/email/otp_verify',
          { otp: Number(otp) },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          }
        );

        toast({ title: 'OTP verified successfully', status: 'success' });
      }

      // Save data and login
      localStorage.setItem('PLATFORM_PASETO', token);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('username', username);
      localStorage.setItem('walletAddress', address || '');

      toast({ title: 'Login successful', status: 'success' });
      onClose();
      router.push('/').then(() => window.location.reload());
    } catch (err: any) {
      const backendError = err?.response?.data?.error || err?.response?.data?.message;
      toast({
        title: 'Failed to verify/login',
        description: backendError || err.message || 'Error verifying OTP',
        status: 'error',
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent bg="gray.900" color="white">
        <ModalHeader>Complete Account Setup</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch" p={2}>
            {/* Username (optional) */}
            <div>
              <FormLabel>Username (optional)</FormLabel>
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Email (optional) */}
            <div>
              <FormLabel>Email (optional)</FormLabel>
              <Input
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Send OTP Button (only if email is entered) */}
            <HStack spacing={4}>
              <Button
                colorScheme="blue"
                onClick={handleSendOtp}
                isLoading={sending}
                loadingText="Sending..."
                isDisabled={!email}
              >
                Send OTP
              </Button>
            </HStack>

            {/* OTP input (only if email is entered) */}
            {email && (
              <div>
                <FormLabel>Enter OTP</FormLabel>
                <Input
                  placeholder="Enter OTP received on email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}

            {/* Verify & Continue Button */}
            <Button
              colorScheme="green"
              onClick={handleVerifyOtp}
              isLoading={verifying}
              loadingText="Processing..."
            >
              Continue
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
