import UplaodPage from './UplaodPage'



import React, { Suspense } from 'react'; 

function LoadingAddressForm() {
  return <div>Loading address form...</div>;
}

const PropertyAddressPage = ({ searchParams }) => {
  const propertyName = searchParams?.propertyName;
  const propertyId = searchParams?.propertyId;

  if (!propertyId) {
    return (
      <div style={{ padding: '20px', color: 'red', fontWeight: 'bold' }}>
        Error: Missing Property ID in URL. Cannot load address information.
      </div>
    );
  }

  return (
    <div className='h-full'>
      <Suspense fallback={<LoadingAddressForm />}>
        <UplaodPage
          propertyName={propertyName || ''} 
          propertyId={propertyId}                
        />
      </Suspense>
    </div>
  );
};

export default PropertyAddressPage;