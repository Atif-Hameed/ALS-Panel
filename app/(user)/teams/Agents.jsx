'use client'
import React, { useEffect, useState } from 'react';
import Card from './Card';
import Button from '../../Components/common/custom-button';
import Modal from '../../Components/common/modal';
import { getAllActiveReferal, getAllReferals } from '../../actions/agent.action';
import Image from 'next/image';
import dumy from './dumy.png';

const Agents = ({ agents: parentAgents, onAddAgent, onRemoveAgent, errors, userId }) => {
	const [add, setAdd] = useState(false);
	const [agentList, setAgentList] = useState([]);
	const [selectedAgent, setSelectedAgent] = useState(null);
	const [formData, setFormData] = useState({
		agentId: '',
		name: '',
		email: '',
		level: 'JUNIOR',
		profileImage: ""
	});
	const [formErrors, setFormErrors] = useState({});


	console.log("Agents are: ", JSON.stringify(parentAgents.map(agent => agent.profileImage)));
	// console.log("agentList",agentList)
	// console.log("selectedAgent",selectedAgent)

	const handleAdd = () => {
		setAdd(!add);
		setFormErrors({});
	};

	const fetchAgents = async (userId) => {
		try {
			const { data, error } = await getAllActiveReferal(userId);
			if (data?.data) {
				setAgentList(data.data);
			}
		} catch (error) {
			console.error('Error fetching agents:', error);
		}
	};

	useEffect(() => {
		fetchAgents(userId);
	}, [userId]);

	const handleAgentSelect = (e) => {
		const selectedId = e.target.value;
		const agent = agentList.find(a => a._id === selectedId);
		if (agent) {
			setSelectedAgent(agent);
			setFormData({
				agentId: agent._id,
				name: agent.name,
				email: agent.email,
				profileImage:agent.profileImage,
				level: 'JUNIOR' // Default level
			});
		}
	};

	const handleLevelChange = (e) => {
		setFormData(prev => ({
			...prev,
			level: e.target.value
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Validate form
		const errors = {};
		if (!formData.agentId) errors.agent = 'Please select an agent';
		if (!formData.level) errors.level = 'Please select a level';

		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			return;
		}

		// Call parent handler to add agent
		onAddAgent({
			agentId: formData.agentId,
			name: formData.name,
			email: formData.email,
			level: formData.level,
			profileImage:formData.profileImage,
			joinDate: new Date()
		});

		// Reset form and close modal
		setFormData({
			agentId: '',
			name: '',
			email: '',
			profileImage:"",
			level: 'JUNIOR'
		});
		setSelectedAgent(null);
		setAdd(false);
	};

	return (
		<div className='w-full bg-[#FFFFFF] sm:p-6 p-4'>
			<div className='flex justify-between items-center'>
				<h1 className='text-lg font-semibold'>Agents Assigned</h1>
				<Button
					label='+Add Agent'
					onClick={handleAdd}
					className='bg-dark text-white !px-4 !h-[48px] font-semibold rounded-lg'
				/>
			</div>

			{/* Display current agents */}
			<div className='grid xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 mt-8'>
				{parentAgents?.map((agent, index) => (
					<Card
						key={index}
						name={agent.name}
						profileImage={agent.profileImage}
						role="Agent"
						level={agent.level}
						imageSrc={dumy}
						progress={65}
						onRemove={() => onRemoveAgent(agent.agentId)}
					/>
				))}
			</div>

			{/* Add Agent Modal */}
			<Modal isOpen={add} onClose={handleAdd}>
				<div className="p-6">
					<h2 className="text-xl font-semibold mb-4">Add New Agent</h2>
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Select Agent
							</label>
							<select
								className="w-full p-2 border rounded"
								onChange={handleAgentSelect}
								value={selectedAgent?._id || ''}
							>
								<option value="">Select an agent</option>
								{agentList.map(agent => (
									<option key={agent._id} value={agent._id}>
										{agent.name}
									</option>
								))}
							</select>
							{formErrors.agent && (
								<p className="text-red-500 text-xs mt-1">{formErrors.agent}</p>
							)}
						</div>

						{selectedAgent && (
							<>
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Name
									</label>
									<input
										type="text"
										className="w-full p-2 border rounded"
										value={formData.name}
										readOnly
									/>
								</div>

								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Email
									</label>
									<input
										type="email"
										className="w-full p-2 border rounded"
										value={formData.email}
										readOnly
									/>
								</div>

							</>
						)}

						<div className="flex justify-end gap-2 mt-6">
							<Button
								type="button"
								label="Cancel"
								onClick={handleAdd}
								className="bg-gray-200 !h-[48px] px-4 text-gray-800 rounded-lg"
							/>
							<Button
								type="submit"
								label="Add Agent"
								className="bg-dark !h-[48px] px-4  text-white rounded-lg"
								disabled={!selectedAgent}
							/>
						</div>
					</form>
				</div>
			</Modal>
		</div>
	);
};

export default Agents;