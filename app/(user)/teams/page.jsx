'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import TabSwitcher from '../profile/TabSwitcher';
import TeamInfo from './TeamInfo';
import TeamTable from './team-table';
import Agents from './Agents';
import Logos from './Logos';
import Button from '../../Components/common/custom-button';
import { createTeam, getTeamById, getTeams, updateTeam } from '../../actions/team.action';
import toast from 'react-hot-toast';

const Teams = () => {
	const tabs = ['Team Details', 'Agents', 'Other Details'];
	const [activeTab, setActiveTab] = useState(tabs[0]);
	const [openAddTeam, setOpenAddTeam] = useState(false);
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(false);
	const [selectedTeam, setSelectedTeam] = useState();
	const [data, setData] = useState(false);
	const [userId, setUserId] = useState(null);
	const [formData, setFormData] = useState({
		ownerId: '',
		basicInfo: {
			name: '',
			address: '',
			website: '',
			city: '',
			state: '',
			unit: '',
			zipCode: '',
		},
		agents: [],
		logos: []
	});

	// console.log("Selected team data is :", JSON.stringify(selectedTeam))

	// editing mode
	useEffect(() => {
		if (selectedTeam) {
			// Open the form
			setOpenAddTeam(true);

			

			// Set the form data with the selected team's data
			setFormData({
				ownerId: selectedTeam.ownerId || '',
				basicInfo: {
					name: selectedTeam.basicInfo?.name || '',
					address: selectedTeam.basicInfo?.address || '',
					website: selectedTeam.basicInfo?.website || '',
					city: selectedTeam.basicInfo?.city || '',
					state: selectedTeam.basicInfo?.state || '',
					unit: selectedTeam.basicInfo?.unit || '',
					zipCode: selectedTeam.basicInfo?.zipCode || '',
				},
				agents: selectedTeam.agents?.map(agent => ({
					agentId: agent.agentId,
					name: agent.name,
					email: agent.email,
					profileImage:agent.parentAgents,
					level: agent.level || 'JUNIOR',
					joinDate: agent.joinDate || new Date()
				})) || [],
				logos: selectedTeam.logos?.map(logo => ({
					url: logo.url,
					display: logo.display || false,
					uploadedAt: logo.uploadedAt || new Date()
				})) || []
			});
		}
	}, [selectedTeam]);

	const [errors, setErrors] = useState({});
	const [isFormValid, setIsFormValid] = useState(false);
	const [currentTabValid, setCurrentTabValid] = useState(false);

	const fetchTeams = async (userId) => {
		try {
			setFetching(true)
			const { data, error } = await getTeams(userId);
			if (error) {
				console.log(error)
				setFetching(false)
			}
			if (data) {
				console.log(data)
				setData(data.data)
				setFetching(false)
			}
		} catch (error) {
			console.log(error)
			setFetching(false)
		} finally {
			setFetching(false)
		}
	}

	useEffect(() => {
		// This will only run on the client side
		const userIdFromStorage = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
		setUserId(userIdFromStorage);
	}, []);

	useEffect(() => {
		if (userId) {
			fetchTeams(userId);
			setFormData(prev => ({
				...prev,
				ownerId: userId
			}));
		}
	}, [userId]);

	// Validate current tab whenever formData or activeTab changes
	useEffect(() => {
		validateCurrentTab();
	}, [formData, activeTab]);

	const validateCurrentTab = () => {
		const newErrors = {};
		let isValid = true;

		switch (activeTab) {
			case 'Team Details':
				if (!formData.basicInfo.name.trim()) {
					newErrors.name = 'Company Name is required';
					isValid = false;
				}
				if (!formData.basicInfo.address.trim()) {
					newErrors.address = 'Address is required';
					isValid = false;
				}
				if (!formData.basicInfo.city.trim()) {
					newErrors.city = 'City is required';
					isValid = false;
				}
				if (!formData.basicInfo.zipCode.trim()) {
					newErrors.zipCode = 'Zip Code is required';
					isValid = false;
				}
				break;

			case 'Agents':
				if (formData.agents.length === 0) {
					newErrors.agents = 'At least one agent is required';
					isValid = false;
				}
				break;

			case 'Other Details':
				if (formData.logos.length === 0) {
					// newErrors.logos = 'At least one logo is required';
					isValid = false;
				}
				break;
		}

		setErrors(newErrors);
		setCurrentTabValid(isValid);
		// Modified validation logic for edit vs create
		if (selectedTeam) {
			// In edit mode, form is valid if current tab is valid
			setIsFormValid(isValid);
		} else {
			// In create mode, form is only valid on last tab
			setIsFormValid(activeTab === tabs[tabs.length - 1] && isValid);
		}
	};

	const handleAddTeam = () => {
		setOpenAddTeam(!openAddTeam);
		if (!openAddTeam) {
			resetForm();
			setActiveTab(tabs[0]); // Reset to first tab
		}
	};

	const resetForm = () => {
		setFormData({
			ownerId: userId || '',
			basicInfo: {
				name: '',
				address: '',
				website: '',
				city: '',
				state: '',
				unit: '',
				zipCode: '',
			},
			agents: [],
			logos: []
		});
		setErrors({});
	};

	const handleBasicInfoChange = (field, value) => {
		setFormData(prev => ({
			...prev,
			basicInfo: {
				...prev.basicInfo,
				[field]: value
			}
		}));
	};

	const handleAgentAdd = (agent) => {
		setFormData(prev => ({
			...prev,
			agents: [...prev.agents, {
				agentId: agent.agentId,
				name: agent.name,
				email: agent.email,
				profileImage:agent.profileImage,
				level: agent.level || 'JUNIOR',
				joinDate: new Date()
			}]
		}));
	};

	const handleAgentRemove = (agentId) => {
		setFormData(prev => ({
			...prev,
			agents: prev.agents.filter(agent => agent.agentId !== agentId)
		}));
	};

	const handleLogoAdd = (logoUrl) => {

		console.log("Url", logoUrl)
		const newLogos = [...formData.logos];
		const display = newLogos.length === 0;
		// newLogos.push({
		// 	url: logoUrl,
		// 	display,
		// 	uploadedAt: new Date()
		// });
		// setFormData(prev => ({ ...prev, logos: newLogos }));
		setFormData(prev => ({
			...prev,
			logos: [...prev.logos, {
				url: logoUrl.url,  // Ensure this is just the URL string
				display: logoUrl.display,
				uploadedAt: logoUrl.uploadedAt || new Date()
			}]
		}));
	};

	const handleLogoRemove = (logoUrl) => {
		const newLogos = formData.logos.filter(logo => logo.url !== logoUrl);
		if (newLogos.length > 0 && !newLogos.some(logo => logo.display)) {
			newLogos[0].display = true;
		}
		setFormData(prev => ({ ...prev, logos: newLogos }));
	};

	const handleSetDisplayLogo = (logoUrl) => {
		setFormData(prev => ({
			...prev,
			logos: prev.logos.map(logo => ({
				...logo,
				display: logo.url === logoUrl
			}))
		}));
	};

	const goToNextTab = () => {
		// if (!currentTabValid) return;
		const currentIndex = tabs.indexOf(activeTab);
		if (currentIndex < tabs.length - 1) {
			setActiveTab(tabs[currentIndex + 1]);
		}
	};

	const goToPrevTab = () => {
		const currentIndex = tabs.indexOf(activeTab);
		if (currentIndex > 0) {
			setActiveTab(tabs[currentIndex - 1]);
		}
	};

	const handleSubmit = async () => {
		// if (!isFormValid) return;
		try {
			setLoading(true)
			let response;
			if (selectedTeam?._id) {
				// Update existing team
				response = await updateTeam(selectedTeam._id, formData);
				console.log(response)
			} else {
				// Create new team
				response = await createTeam(formData);
			}

			if (response.error) {
				toast.error(response.error || `Unable to ${selectedTeam ? 'update' : 'create'} team!`);
				setLoading(false);
				return;
			}
			toast.success(`Team ${selectedTeam ? 'Updated' : 'Created'} Successfully!`);
			setLoading(false);
			resetForm();
			setOpenAddTeam(false);
			setSelectedTeam(null);
			fetchTeams(userId);
		} catch (error) {
			console.log(error)
			toast.error(error.message || 'internal Server Error!')
			setLoading(false)
		} finally {
			setLoading(false)
		}
	};

	const isFirstTab = activeTab === tabs[0];
	const isLastTab = activeTab === tabs[tabs.length - 1];

	// console.log(formData)

	return (
		<div className='w-full mt-3'>
			<div className='flex w-full justify-between items-center'>
				<div className='text-[#0A1629] font-[700] text-[24px] sm:text-[36px]'>Teams</div>
				<Button
					onClick={handleAddTeam}
					label={openAddTeam ? 'All Teams' : '+ Add Team'}
					className='flex cursor-pointer w-[159px] sm:w-[179px] h-[48px] items-center justify-center sss gap-2 bg-[#002B4B] text-[#FFFFFF] px-4  rounded-lg text-sm font-semibold  hover:bg-[#001f35] transition'
				/>
			</div>

			{openAddTeam && (
				<div className='w-full'>
					<TabSwitcher
						tabs={tabs}
						setActiveTab={setActiveTab}
						activeTab={activeTab}
						parentStyle={'sm:gap-10'}
						allowChange={true}
					/>

					<div className='mt-6 rounded-[24px]'>
						{activeTab === "Team Details" && (
							<TeamInfo
								data={formData.basicInfo}
								onChange={handleBasicInfoChange}
								errors={errors}
							/>
						)}
						{activeTab === "Agents" && (
							<Agents
								agents={formData.agents}
								onAddAgent={handleAgentAdd}
								onRemoveAgent={handleAgentRemove}
								errors={errors}
								userId={userId}
							/>
						)}
						{activeTab === "Other Details" && (
							<Logos
								logos={formData.logos}
								onAddLogo={handleLogoAdd}
								onRemoveLogo={handleLogoRemove}
								onSetDisplayLogo={handleSetDisplayLogo}
								errors={errors}
							/>
						)}
					</div>

					<div className={`mt-6 flex ${isFirstTab ? 'justify-end' : 'justify-between '} gap-4`}>
						{!isFirstTab && (
							<Button
								onClick={goToPrevTab}
								label="Back"
								className='bg-dark text-white !h-[48px] !w-[100px] font-semibold rounded-lg'
							/>
						)}

						{(!isLastTab && !selectedTeam) ? (
							<Button
								onClick={goToNextTab}
								label="Next"
								className={`bg-dark text-white !h-[48px] !w-[100px] font-semibold rounded-lg ${!currentTabValid ? ' ' : ''
									}`}
								// disabled={!currentTabValid}
							/>
						) : (
							<Button
								onClick={handleSubmit}
								label={selectedTeam ? "Update Team" : "Create Team"}
								loading={loading}
								loadingLabel={selectedTeam ? "Updating..." : "Creating..."}
								className={`bg-dark text-white !h-[48px] rounded-lg ${!isFormValid ? '' : ''
									}`}
								disabled={ loading}
							/>
						)}
					</div>
				</div>
			)}

			{!openAddTeam && <TeamTable loading={fetching} userId={userId} data={data} fetchTeams={fetchTeams} setSelectedTeam={setSelectedTeam} />}
		</div>
	);
};

export default Teams;