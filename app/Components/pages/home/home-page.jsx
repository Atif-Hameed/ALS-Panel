'use client'
import React from 'react';
import Button from '../../shared/custom-btn';
import Link from 'next/link';
import CustomImage from '../../shared/custom-image';
import logo from '../../../../public/assets/images/logo.svg';
import Footer from '../../layout/footer';


const HomePage = () => {

    const handleAgentClick = () => {
        localStorage.setItem("view", "agent");
        window.location.href = "/agent-search?isConsumer=false";
    };

    const handleConsumerClick = () => {
        localStorage.setItem("view", "consumer");
        window.location.href = "/agent-search?isConsumer=true";
    };

    return (
        <div>
            <div className="h-screen relative overflow-hidden w-full bg-[url('/assets/main.jpg')] bg-cover flex justify-center items-center bg-center">
                <div className="absolute top-2 z-50 left-5 w-full flex justify-start ">
                    <Link href="/">
                        <CustomImage src={logo} className="lg:h-20 h-16 w-fit" />
                    </Link>
                </div>

                <div className="grid sm:grid-cols-2 grid-cols-1 md:w-[70%] w-[85%] mt-20 z-50 gap-12">
                    <div className="bg-[#F4EBD0CC] sm:w-fit w-full p-8 flex flex-col items-start gap-4">
                        <h1 className="lg:text-4xl md:text-3xl text-xl">BECOME</h1>
                        <h1 className="xl:text-[55px] lg:text-5xl md:text-4xl text-3xl text-[#122620] font-[800]">
                            ENTERPRISE AGENTS
                        </h1>
                        <Button
                            label="Explore More"
                            style="bg-[#122620] !text-[#D6AD60] rounded-sm font-semibold px-8 py-2"
                            onClick={handleAgentClick}
                        />
                    </div>

                    <div className="bg-[#212121CF] sm:w-fit w-full p-8 flex flex-col items-start gap-4">
                        <h1 className="lg:text-4xl md:text-3xl text-xl text-white">BECOME</h1>
                        <h1 className="xl:text-[55px] lg:text-5xl md:text-4xl text-3xl text-white font-[800]">
                            ENTERPRISE CONSUMERS
                        </h1>
                        <Button
                            label="Explore More"
                            style="bg-white !text-[#D6AD60] rounded-sm font-semibold px-8 py-2"
                            onClick={handleConsumerClick}
                        />
                    </div>
                </div>

                <div className="absolute w-full h-full top-0 left-0 z-20 bg-black opacity-30"></div>
            </div>

            <Footer />
        </div>
    );
};

export default HomePage;