'use client';
import { useEffect, useState } from 'react';
import { useSignup } from '../SignupContext';
import LeftSide from './LeftSide';
import Select from 'react-select';
import { countryOptions } from '../../utils/countries';

const SignupAddress = ({ setSteps, steps }) => {
	const { signupAddress, setSignupAddress } = useSignup();

	const [formData, setFormData] = useState({
		officeName: signupAddress?.officeName || '',
		street: signupAddress?.street || '',
		apartment: signupAddress?.apartment || '',
		city: signupAddress?.city || '',
		state: signupAddress?.state || '',
		zipCode: signupAddress?.zipCode || '',
		country: signupAddress?.country || '',
		latitude: signupAddress?.latitude || "",
		logitude: signupAddress?.logitude || "",
	});

	const [errors, setErrors] = useState({});
	const [focused, setFocused] = useState({});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState('');

	console.log(signupAddress)

	useEffect(() => {
		const fillMissingLocation = () => {
			const storedLat = localStorage.getItem("userLat");
			const storedLng = localStorage.getItem("userLong");
			setFormData(prev => ({
				...prev,
				latitude: signupAddress?.latitude || storedLat || prev.latitude,
				logitude: signupAddress?.logitude || storedLng || prev.logitude,
			  }));
		};

		fillMissingLocation();
	}, []);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });

		setErrors((prevErrors) => {
			const newErrors = { ...prevErrors };
			delete newErrors[e.target.name];
			return newErrors;
		});
	};

	const handleFocus = (field) => {
		setFocused({ ...focused, [field]: true });
	};

	const handleBlur = (field) => {
		setFocused({ ...focused, [field]: false });
	};

	const validateForm = () => {
		let newErrors = {};
		Object.keys(formData).forEach((field) => {
			if (!formData[field]) {
				newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)
					} is required`;
			}
		});
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};


	const handleSubmit = async (e) => {
		e.preventDefault();
		setSuccess('');
		setLoading(true);

		if (!validateForm()) {
			setLoading(false);
			return;
		}
		setSignupAddress(formData);
		setSteps(2);
		setLoading(false);
		setSuccess('Address data saved successfully!');
	};
	const showLabel = (field) => {
		return focused[field] || formData[field];
	};

	return (
		<div className='flex h-screen overflow-hidden'>
			<LeftSide setSteps={setSteps} steps={steps} />

			<div className='md:w-1/2 sm:w-[60%] w-full flex items-center justify-center'>
				<div className='w-full p-4'>
					<h2 className='text-[#002B4B] text-[32px] font-[800] text-center mb-10'>
						Sign Up
					</h2>

					{errors.general && (
						<p className='text-red-500 text-center'>{errors.general}</p>
					)}
					{success && <p className='text-green-500 text-center'>{success}</p>}

					<form
						onSubmit={handleSubmit}
						autoComplete="off"
						className='gap-6 w-full flex flex-col items-center'
					>

						<div className='w-[349px]'>
							{showLabel('officeName') && (
								<label className='text-[14px] font-[400] text-gray-600'>
									Office Name
									<span className="text-red-500">*</span>
								</label>
							)}
							<div
								className={`border-b ${focused.officeName ? 'border-[#000113]' : 'border-[#CBD5E1]'
									}`}
							>
								<input
									type='text'
									name='officeName'
									placeholder='Office Name'
									value={formData.officeName}
									onChange={handleChange}
									onFocus={() => handleFocus('officeName')}
									onBlur={() => handleBlur('officeName')}
									className='w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none'
								/>
							</div>
							{errors.officeName && (
								<p className='text-red-500 text-[14px] font-[400]'>{errors.officeName}</p>
							)}
						</div>

						<div className='grid grid-cols-2 gap-4 w-[349px]'>
							{['street', 'apartment', 'city', 'state'].map((field) => (
								<div key={field} className='w-full'>
									{showLabel(field) && (
										<label className='text-[14px] font-[400] text-gray-600'>
											{field.charAt(0).toUpperCase() + field.slice(1)}
											<span className="text-red-500">*</span>
										</label>
									)}
									<div
										className={`border-b ${focused[field] ? 'border-[#000113]' : 'border-[#CBD5E1]'
											}`}
									>
										<input
											type={field === 'city' ? 'text' : 'text'}
											name={field}
											placeholder={
												field.charAt(0).toUpperCase() + field.slice(1)
											}
											value={formData[field]}
											onChange={(e) => {
												if (field === 'city') {

													const regex = /^[A-Za-z\s]*$/;
													if (regex.test(e.target.value) || e.target.value === '') {
														handleChange(e);
													}
												} else {
													handleChange(e);
												}
											}}
											onFocus={() => handleFocus(field)}
											onBlur={() => handleBlur(field)}
											className='w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none'
										/>
									</div>
									{errors[field] && (
										<p className='text-red-500 text-[14px] font-[400]'>{errors[field]}</p>
									)}
								</div>
							))}
						</div>

						<div className='grid grid-cols-1 gap-4 w-[349px]'>
							{['zipCode'].map((field) => (
								<div key={field} className='w-full'>
									{showLabel(field) && (
										<label className='text-[14px] font-[400] text-gray-600'>
											{field.charAt(0).toUpperCase() + field.slice(1)}
											<span className="text-red-500">*</span>
										</label>
									)}
									<div
										className={`border-b ${focused[field] ? 'border-[#000113]' : 'border-[#CBD5E1]'
											}`}
									>
										<input
											type='text'
											name={field}
											placeholder={
												field.charAt(0).toUpperCase() + field.slice(1)
											}
											value={formData[field]}
											onChange={handleChange}
											onFocus={() => handleFocus(field)}
											onBlur={() => handleBlur(field)}
											className='w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none'
										/>
									</div>
									{errors[field] && (
										<p className='text-red-500 text-[14px] font-[400]'>{errors[field]}</p>
									)}
								</div>
							))}
						</div>

						<div className='w-[349px]'>
							{['country'].map((field) => (
								<div key={field} className='w-full mb-2'>
									{showLabel(field) && (
										<label className='text-[14px] font-[400] text-gray-600'>
											{field.charAt(0).toUpperCase() + field.slice(1)}
											<span className="text-red-500">*</span>
										</label>
									)}
								</div>
							))}
							<Select
								options={countryOptions}
								value={countryOptions.find(
									(option) => option.value === formData.country
								)}
								onChange={(selectedOption) =>
									setFormData({ ...formData, country: selectedOption.value })
								}
								onFocus={() => handleFocus('country')}
								onBlur={() => handleBlur('country')}
								placeholder="Country"
								menuPlacement="auto"
								styles={{
									control: (provided, state) => ({
										...provided,
										borderColor: state.isFocused ? '#000113' : '#CBD5E1',
										color: '#000113',
										'&:hover': { borderColor: '#000113' },
										boxShadow: state.isFocused ? '0 0 0 1px #000113' : 'none',
									}),
									singleValue: (provided) => ({
										...provided,
										color: '#000113',
										fontSize: "14px"
									}),
									placeholder: (provided) => ({
										...provided,

									}),
									menu: (provided) => ({
										...provided,
										color: '#000113',
									}),
									option: (provided, state) => ({
										...provided,
										color: '#000113',
										backgroundColor: state.isFocused ? '#CBD5E1' : 'white',
										'&:hover': { backgroundColor: '#CBD5E1' },
									}),
								}}
								className='w-full'
							/>
							{errors.country && (
								<p className='text-red-500 text-[14px] font-[400]'>{errors.country}</p>
							)}
						</div>

						<button
							type='submit'
							className='w-[349px] cursor-pointer h-[40px] text-white bg-[#002B4B] font-[500] text-[14px] p-2 rounded-[4px] hover:bg-blue-900'
							disabled={loading}
						>
							{loading ? 'loading...' : 'Continue'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SignupAddress;
