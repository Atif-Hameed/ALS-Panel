import React from 'react';

const LeftSide = ({ setSteps, steps }) => {
console.log("step",steps)
console.log(setSteps)
const handleClick2 = () => {
  setSteps(0);
};
const handleClick = () => {
  if (steps === 2) {
		setSteps(1); 
	}
};
const handleClick1 = () => {
	if (steps === 3) {
		setSteps(2);
	}
 
};

	return (
		<div className='md:w-1/2 sm:w-[40%] hidden sm:flex relative'>
			<div className='absolute inset-0'>
				<img
					src='/assets/leftside.svg'
					alt='City View'
					className='w-full h-full object-cover'
				/>
			</div>

			{/* Stepper */}
			<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-8'>
				<div className='flex items-center gap-3'>
					<div 	onClick={handleClick2} className='w-6 h-6 border-2 border-white rounded-full flex items-center justify-center'>
						<div className='w-4 h-4 bg-white rounded-full'></div>
					</div>
					<span className='text-white font-[400] text-[14px]'>Personal</span>
				</div>

				<div className='flex flex-col items-center gap-6'>
					<div className='w-[1px] ml-3 self-start h-20 bg-white'></div>
					<div className='flex items-center gap-3'>
						<div
						onClick={handleClick}
							className={`w-6 h-6 ${
								[1, 2, 3].includes(steps)
									? 'border-2 border-white'
									: 'border-1 border-[#F1F1F1B2]'
							} flex justify-center text-center items-center rounded-full`}
						>
							<div
								className={`w-4 h-4 border-1 ${
									[1, 2, 3].includes(steps) ? 'bg-white' : ''
								} border-[#F1F1F1B2] rounded-full`}
							></div>
						</div>
						<span
							className={`${
								[1, 2, 3].includes(steps) ? 'text-white' : 'text-[#F1F1F1B2]'
							} font-[400] text-[14px]`}
						>
							Address
						</span>
					</div>
				</div>

				<div className='flex flex-col items-center gap-6'>
					<div className='w-[1px] ml-3 self-start h-20 bg-white'></div>
					<div className='flex items-center gap-3'>
						<div
							onClick={handleClick1}
							className={`w-6 h-6 ${
								[2, 3].includes(steps)
									? 'border-2 border-white'
									: 'border-1 border-[#F1F1F1B2]'
							} flex justify-center text-center items-center rounded-full`}
						>
							<div
								className={`w-4 h-4 border-1 ${
									[2, 3].includes(steps) ? 'bg-white' : ''
								} border-[#F1F1F1B2] rounded-full`}
							></div>
						</div>
						<span
							className={`${
								[2, 3].includes(steps) ? 'text-white' : 'text-[#F1F1F1B2]'
							} font-[400] text-[14px]`}
						>
							Contact
						</span>
					</div>
				</div>

				<div className='flex flex-col items-center gap-6'>
					<div className='w-[1px] ml-3 self-start h-20 bg-white'></div>
					<div className='flex items-center gap-3'>
						<div
							className={`w-6 h-6 ${
								steps === 3 ? 'border-2 border-white' : 'border-1 border-[#F1F1F1B2]'
							} flex justify-center text-center items-center rounded-full`}
						>
							<div
								className={`w-4 h-4 border-1 ${
									steps === 3 ? 'bg-white' : ''
								} border-[#F1F1F1B2] rounded-full`}
							></div>
						</div>
						<span
							className={`${
								steps === 3 ? 'text-white' : 'text-[#F1F1F1B2]'
							} font-[400] text-[14px]`}
						>
							License
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LeftSide;
