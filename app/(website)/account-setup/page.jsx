import AccountSetupForm from '../../Components/pages/account-setup/account-setup';
import Hero from '../../Components/pages/account-setup/hero'
import React from 'react'

const page = async ({ searchParams }) => {

    const { email, userId, plan } = await searchParams;

    return (
        <div>
            <Hero />
            <AccountSetupForm initialEmail={email} userId={userId} plan={plan} />
        </div>
    )
}

export default page
