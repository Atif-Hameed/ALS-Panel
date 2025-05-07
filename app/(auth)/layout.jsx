import { SignupProvider } from './SignupContext';

export default function RootLayout({ children }) {
  return (
    <SignupProvider>
      {children}
    </SignupProvider>
  );
}
