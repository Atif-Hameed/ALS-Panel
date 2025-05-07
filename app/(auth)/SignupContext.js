'use client';

import { createContext, useState, useContext } from 'react';

const SignupContext = createContext(null);

export const SignupProvider = ({ children }) => {
  const [signupData, setSignupData] = useState(null);
  const [signupAddress, setSignupAddress] = useState(null)
  const [signupLicense, setSignupLicense] = useState(null)
  const [signupContact, setSignupContact] = useState(null)

  return (
    <SignupContext.Provider value={{ signupData, setSignupData ,signupAddress, setSignupAddress,signupContact, setSignupContact,signupLicense, setSignupLicense }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => useContext(SignupContext);
