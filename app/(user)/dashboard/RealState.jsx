import React from 'react';
import Image from 'next/image';

const RealState = ({
	imageUrl,
	altText = 'Real estate listing',
	title,
	locationLine1,
	createdAt,
}) => {


  const formattedDate = createdAt
  ? new Date(createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  : 'Unknown';
	return (
		<div className='flex  flex-col px-5 py-4 bg-[#F4F9FD] rounded-[24px]  space-x-4  transition-shadow duration-200 ease-in-out'>
			<div className='flex gap-2'>
				<Image
					src={imageUrl}
					alt={altText}
					width={51}
					height={48}
					className='rounded-lg object-cover'
				/>
				<div className='flex-1 min-w-0'>
					{' '}
					{/* flex-1 allows text to take remaining space, min-w-0 prevents overflow issues */}
					{/* truncate prevents long titles from breaking layout */}
					<p className='text-sm text-[#91929E] mt-1'>{locationLine1}</p>
					<h3 className='text-lg font-bold text-[#0A1629] truncate'>{title}</h3>
				</div>
			</div>

			{/* Text Content Section */}
			<div className='flex mt-2 justify-between'>
				<div className='flex gap-1 items-center'>
					<Image
						src='/assets/inactive.svg'
						alt={'altText'}
						width={24}
						height={24}
						className='rounded-lg object-cover'
					/>
					<div className='text-[#7D8592] text-[14px] font-[600]'>
					Created {formattedDate}
					</div>
				</div>
				{/* <div className='text-sm font-[700] flex text-[#FFBD21] justify-center items-center '>
					<Image
						src='/assets/medium.svg'
						alt={'altText'}
						width={24}
						height={20}
						className='rounded-lg object-cover'
					/>
					medium
				</div> */}
			</div>
		</div>
	);
};

export default RealState;
