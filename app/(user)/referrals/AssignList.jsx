'use client'
import React from 'react';
import RealEstateCard from './RealEstateCard';
import ListingCard from './ListingCard';
import Modal from '../../Components/common/modal';
import AddContract from '../contract/add-contract';

const AssignList = () => {

	const [addAgent, setAddAgent] = useState(false)
	const [addProperty, setAddProperty] = useState(false)

	const handleAddAgent = () => {
		setAddAgent(!addAgent)
	}
	const handleAddProperty = () => {
		setAddProperty(!addProperty)
	}

	return (
		<div className='w-full h-full '>
			<div className='flex justify-between items-center'>
				<div className='sm:text-[18px] text-sm font-[600] text-[#000000] '>
					Contact Details
				</div>
				<button onClick={handleAddAgent} className='flex shadowbtn cursor-pointer hover:bg-[#004372] text-[#FFFFFF] font-[700] text-center rounded-[14px] items-center justify-center bg-[#002B4B] sm:w-[140px] w-[115px] sm:text-base text-sm h-[48px]'>
					+ Add Agent
				</button>
			</div>
			<div className='flex flex-wrap gap-5 my-5'>
				<RealEstateCard
					imageUrl='/assets/Image.svg' // Replace with your actual image path in /public
					title='Realestate Reality Group'
					locationLine1='St. Rivens'
					locationLine2='101 Street'
					agentCount={1}
					altText='Modern apartment buildings'
				/>
				<RealEstateCard
					imageUrl='/assets/Image.svg' // Replace with your actual image path in /public
					title='Realestate Reality Group'
					locationLine1='St. Rivens'
					locationLine2='101 Street'
					agentCount={1}
					altText='Modern apartment buildings'
				/>
			</div>

			<div className='flex justify-between mt-16 mb-5 items-center'>
				<div className='sm:text-[18px] text-sm font-[600] text-[#000000] '>
					Contact Details
				</div>
				<button onClick={handleAddProperty} className='flex shadowbtn cursor-pointer hover:bg-[#004372] text-[#FFFFFF] font-[700] text-center rounded-[14px] items-center justify-center bg-[#002B4B] sm:w-[140px] w-[115px] sm:text-base text-sm h-[48px]'>
					+ Add Property
				</button>
			</div>

			<ListingCard
				imageUrl="/assets/Image.svg"
				location="St. Rivens, CA"
				title="1023 Lousie Venue"
				status="Active Listing"

				liveWebsiteColorClass="text-[#438B08]"
				imageAlt="Modern buildings cityscape"
			/>

			{/* <Modal isOpen={addAgent} onClose={handleAddAgent}>
				<AddContract />
			</Modal>

			<Modal isOpen={addProperty} onClose={handleAddProperty}>
				<AddContract />
			</Modal> */}
		</div>
	);
};

export default AssignList;
