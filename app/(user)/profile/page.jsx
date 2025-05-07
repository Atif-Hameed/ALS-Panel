'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import TabSwitcher from './TabSwitcher';
import PersonalProfile from './PersonalProfile';
import SocailLink from './SocailLink';
import ExternalLink from './ExternalLink';
import Account from './Account';
import { API_BASE_URL } from "../../api";

const Home = () => {
	const tabs = ["Personal Profile", "Social Links", "External Links", "Account"];
	const [activeTab, setActiveTab] = useState(tabs[0]);
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [userId, setUserId] = useState(null);

	// Get userId from localStorage
	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedUserId = localStorage.getItem('userId');
			setUserId(storedUserId);
		}
	}, []);

	// Fetch user data
	const refreshUserData = () => {
		if (userId) {
			setLoading(true);
			fetch(`${API_BASE_URL}/auth/get-user/${userId}`)
				.then(response => response.json())
				.then(data => {
					setUserData(data.user);
					setLoading(false);
				})
				.catch(error => {
					console.error('Error fetching user data:', error);
					setLoading(false);
				});
		}
	};

	// Refresh data when userId is set
	useEffect(() => {
		if (userId) {
			refreshUserData();
		}
	}, [userId]);

	// Refresh data whenever Personal Profile tab is active
	useEffect(() => {
		if (activeTab === "Personal Profile") {
			refreshUserData();
		}
	}, [activeTab]);

	return (
		<div className='w-full bg-[#F4F9FD]  '>
			<div className='flex justify-between '>
				<div className='text-[#0A1629] font-[700] text-[24px] sm:text-[30px] md:text-[36px]'>
					My Profile
				</div>
			</div>

			<div className='bg-white p-6 mt-4 rounded-[24px]'>
				<TabSwitcher tabs={tabs} setActiveTab={setActiveTab} activeTab={activeTab} containerStyle={'!mt-0'} />

				{loading ? (
					<div className="text-center text-gray-500 mt-4">Loading...</div>
				) : (
					<>
						{activeTab.toLowerCase().trim() === "personal profile" && (
							<PersonalProfile
								setActiveTab={setActiveTab}
								userData={userData}
								userId={userId}
								setUserData={setUserData}
								refreshUserData={refreshUserData}
							/>
						)}
						{activeTab === "Social Links" && (
							<SocailLink
								setActiveTab={setActiveTab}
								userId={userId}
								refreshUserData={refreshUserData}
							/>
						)}
						{activeTab === "External Links" && (
							<ExternalLink
								setActiveTab={setActiveTab}
								userId={userId}
								refreshUserData={refreshUserData}
							/>
						)}
						{activeTab === "Account" && (
							<Account
								userData={userData?.role}
								userId={userId}
								refreshUserData={refreshUserData}
							/>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default Home;
