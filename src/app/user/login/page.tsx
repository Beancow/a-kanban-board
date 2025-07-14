'use client';

import { useEffect } from 'react';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { firebaseAuth } from '../../../../firebase-config';
import { useAuth } from '../../components/AuthProvider';
import { Box, Card, Heading, Text } from '@radix-ui/themes';

const uiConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => {
      // Avoid redirecting, as the AuthProvider will handle it.
      return false;
    },
  },
};

export default function LoginPage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // The AuthProvider handles redirection. We just need to start the UI
    // if the user is not signed in.
    if (!loading && !user) {
      // FirebaseUI will clear the container when it's done, so we need to
      // re-initialize it every time the component mounts.
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebaseAuth);
      ui.start('#firebaseui-auth-container', uiConfig);
    }
  }, [loading, user]);

  // The AuthProvider will redirect away from this page if the user is signed in,
  // so we don't need to render anything in that case.
  if (loading || user) {
    return null;
  }

  return (
    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--gray-2)' }}>
      <Card size="4" style={{ width: '400px' }}>
        <Heading as="h1" size="6" align="center" mb="2">
          Welcome
        </Heading>
        <Text as="p" align="center" color="gray" mb="5">
          Sign in to continue to the Kanban Board
        </Text>
        <div id="firebaseui-auth-container"></div>
      </Card>
    </Box>
  );
}