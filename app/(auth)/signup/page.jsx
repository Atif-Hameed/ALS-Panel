'use client';
import React, { useState } from 'react';
import SignupPersonal from './SignupPersonal';
import SignupAddress from './SignupAddress';
import SignUpContact from './SignUpContact';
import SignUpLicense from './SignUpLicense';

const SignUpPage = () => {
	const [steps, setSteps] = useState(0);
	
	return (
		<div className='bg-white '>
			{steps === 0 && <SignupPersonal setSteps={setSteps} />}
			{steps === 1 && <SignupAddress steps={steps} setSteps={setSteps} />}
			{steps === 2 && <SignUpContact steps={steps} setSteps={setSteps} />}
			{steps === 3 && <SignUpLicense steps={steps} setSteps={setSteps} />}
		</div>
	);
};

export default SignUpPage;
