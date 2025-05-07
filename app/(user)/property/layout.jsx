'use client';
import AddressInfo from "./address-info/AddressInfo";
import Feature from "./feature/Feature";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import UplaodPage from "./upload/UplaodPage";
import { useRouter } from "next/navigation"; 

export default function UserLayout({ children }) {
  const [handelPropertyNames, setHandelPropertyNames] = useState(null);
  const [hanelPropertyId, setHandelPropertyId] = useState(null);
  const [step, setStep] = useState();
  const [isAddress, setIsAddress] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState(null);

  const router = useRouter();

  const actualStep = step?.split("-")[0];

  // Sync activeSubTab with step
  useEffect(() => {
    if (step) {
      setActiveSubTab(step.split("-")[0]);
    }
  }, [step]);

  // ✅ Redirect when actualStep is "Create Site"
  useEffect(() => {
    if (actualStep === "Create Site") {
      router.push(`/create-site/${hanelPropertyId}`);
    }
  }, [actualStep, router]);

  return (
    <div className=" h-[77vh]">
      <div className='text-[#0A1629] font-[700] text-[24px] my-4 sm:text-[30px] md:text-[36px]'>
        Properties
      </div>
      <div className='flex flex-col lg:flex-row h-[calc(100%-70px)] gap-4'>

        <div className="lg:w-[265px]  h-full">
          <Sidebar
            isAddress={isAddress}
            setHandelPropertyId={setHandelPropertyId}
            setHandelPropertyNames={setHandelPropertyNames}
            setStep={setStep}
            activeSubTab={activeSubTab}
          />
        </div>

        <main className='bg-[#FFFFFF] w-full p-4 h-full sm:p-6 rounded-[24px] lg:flex-1'>
          {actualStep === "Features" && (
            <Feature
              key={hanelPropertyId}
              propertyName={handelPropertyNames}
              propertyId={hanelPropertyId}
            />
          )}
          {actualStep === "Details & Address" && (
            <AddressInfo
              setIsAddress={setIsAddress}
              key={hanelPropertyId}
              property={handelPropertyNames}
              propertyId={hanelPropertyId}
            />
          )}
          {actualStep === "Uploads" && (
            <UplaodPage
              key={hanelPropertyId}
              propertyName={handelPropertyNames}
              propertyId={hanelPropertyId}
            />
          )}
        </main>
      </div>
    </div>
  );
}
