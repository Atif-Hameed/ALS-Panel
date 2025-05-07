'use client';
import React, { useState, useRef, useEffect } from 'react';
import { propertyImagesToCloudinary } from '../../../Components/utils/cloudinaryUploader';
import { propertyFloorPlanToCloudinary } from '../../../Components/utils/cloudinaryUploader';
import { API_BASE_URL } from '../../../api';
import Image from 'next/image';

const PlusIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className='w-8 h-8 text-gray-500'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M12 4.5v15m7.5-7.5h-15'
		/>
	</svg>
);

const FileIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className='w-10 h-10 text-gray-500'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'
		/>
	</svg>
);

const LoadingSpinner = () => (
	<svg
		className='animate-spin h-6 w-6 text-white'
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
	>
		<circle
			className='opacity-25'
			cx='12'
			cy='12'
			r='10'
			stroke='currentColor'
			strokeWidth='4'
		></circle>
		<path
			className='opacity-75'
			fill='currentColor'
			d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
		></path>
	</svg>
);

const CheckIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={3}
		stroke='currentColor'
		className='w-5 h-5 text-green-500'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='m4.5 12.75 6 6 9-13.5'
		/>
	</svg>
);

const ErrorIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='currentColor'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='white'
		className='w-6 h-6 text-red-600'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z'
		/>
	</svg>
);

const UplaodPage = ({ propertyId, propertyName }) => {
	const [galleryImages, setGalleryImages] = useState([]);
	const [galleryImagesprev, setGalleryImagesprev] = useState([]);
	const imageFileInputRef = useRef(null);
	const [loading, setLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const [galleryVideos, setGalleryVideos] = useState([]);
	const [galleryVideoprev, setGalleryVideoprev] = useState([]);

	const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
	const [selectedVideoProvider, setSelectedVideoProvider] = useState('youtube');
	const [videoUrlInput, setVideoUrlInput] = useState('');
	const [videoUrlError, setVideoUrlError] = useState('');
	const [loading1, setLoading1] = useState(false);
	const [showVideo, setShowVideo] = useState(false);

	const [otherMediaItems, setOtherMediaItems] = useState([]);
	const [isOtherMedia, setIsOtherMedia] = useState(false)
	const [isRemoveOtherMedia, setIsRemoveOtherMedia] = useState(false)

	const [isAddOtherMediaModalOpen, setIsAddOtherMediaModalOpen] =
		useState(false);
	const [selectedOtherMediaProvider, setSelectedOtherMediaProvider] =
		useState('matterport');
	const [otherMediaUrlInput, setOtherMediaUrlInput] = useState('');
	const [otherMediaUrlError, setOtherMediaUrlError] = useState('');

	// --- State for Floor Plans ---
	const [floorPlanImages, setFloorPlanImages] = useState([]);
	const [floorPlans, setFloorPlans] = useState([]);

	const [otherMediaPrev, setOtherMediaPrev] = useState([]);
	const [loading2, setLoading2] = useState(false);

	const floorPlanFileInputRef = useRef(null);
	const [isFloorplain, setIsFloorplain] = useState(false)
	const [floorPlanUploadError, setFloorPlanUploadError] = useState('');
	const [isFloorPlanModalOpen, setIsFloorPlanModalOpen] = useState(false);
	const [floorPlanNameInput, setFloorPlanNameInput] = useState('');

	// --- Shared State ---
	const [isAddingPreview, setIsAddingPreview] = useState(false);
	const [initialCheckDone, setInitialCheckDone] = useState(true);
	const [globalError, setGlobalError] = useState('');



	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [imageToDeleteIndex, setImageToDeleteIndex] = useState(null);
	useEffect(() => {
		if (propertyId) {
			fetch(`${API_BASE_URL}/property/property-images/${propertyId}`)
				.then((res) => res.json())
				.then((data) => {
					if (
						data.propertyImages &&
						Array.isArray(data.propertyImages.propertyImages)
					) {
						// Extract the image array with index
						const imagesWithIndex = data.propertyImages.propertyImages.map(
							(img, index) => ({
								index,
								url: img,
							})
						);
						setGalleryImagesprev(imagesWithIndex);
					}
				})
				.catch((error) => {
					console.error('Error fetching property images:', error);
				});
		}
	}, [propertyId, isSaving, loading]);

	useEffect(() => {
		if (propertyId) {
			fetch(`${API_BASE_URL}/property/property-video/${propertyId}`)
				.then((res) => res.json())
				.then((data) => {
					if (data.data && Array.isArray(data.data.propertyVideoUrl)) {
						const videosWithIndex = data.data.propertyVideoUrl.map(
							(url, index) => ({
								index,
								url,
							})
						);
						setGalleryVideoprev(videosWithIndex);
					}
				})
				.catch((error) => {
					console.error('Error fetching property videos:', error);
				});
		}
	}, [propertyId, loading1, showVideo]);

	useEffect(() => {
		if (propertyId) {
			fetch(`${API_BASE_URL}/property/property-other-media/${propertyId}`)
				.then((res) => res.json())
				.then((data) => {
					if (data.data && Array.isArray(data.data.propertyOther)) {
						// Map media URLs with index
						const formatted = data.data.propertyOther.map((url, index) => ({
							index,
							url,
						}));
						setOtherMediaPrev(formatted);
					}
				})
				.catch((error) => {
					console.error('Error fetching other media:', error);
				});
		}
	}, [propertyId, isOtherMedia, isRemoveOtherMedia]);

	useEffect(() => {
		if (propertyId) {
			const fetchFloorPlans = async () => {
				try {
					const response = await fetch(
						`${API_BASE_URL}/property/property-floor-plan/${propertyId}`
					);
					const data = await response.json();

					if (data.message === 'Floor plans fetched successfully') {
						setFloorPlans(data.data.floorPlans);
					} else {
						setError('No floor plans found for this property');
					}
				} catch (error) {
					console.error('Error fetching floor plans:', error);
					setError('Failed to fetch floor plans');
				} finally {
					setLoading(false);
				}
			};

			fetchFloorPlans();
		}
	}, [propertyId, loading2, isFloorplain]);

	console.log(floorPlans, 'ffffffffffffffffffffffffffffffffff');
	console.log(otherMediaPrev, 'otherMediaPrev');

	const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random()}`;

	const handleAddImageClick = () => {
		if (initialCheckDone && !propertyId) {
			setGlobalError('Cannot add images: Property ID is missing.');
			return;
		}
		setGlobalError('');
		if (imageFileInputRef.current) {
			imageFileInputRef.current.click();
		}
	};

	const updateImageStatus = (id, status, data = {}) => {
		setGalleryImages((prevImages) =>
			prevImages.map((img) =>
				img.id === id ? { ...img, status, ...data } : img
			)
		);
	};

	const handleImageFileChange = (event) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		if (!propertyId) {
			setGlobalError('Cannot select images: Property ID is missing.');
			event.target.value = null; // Clear the input
			return;
		}
		setGlobalError('');

		setIsAddingPreview(true);

		const newImagesToAdd = [];
		const promises = [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (!file.type.startsWith('image/')) {
				setGlobalError(
					`File "${file.name}" is not a valid image. Only image files were added.`
				);
				continue;
			}

			const imageId = generateId('img');
			const reader = new FileReader();

			const promise = new Promise((resolve, reject) => {
				reader.onloadend = () => {
					const newImage = {
						file: file,
						fileName: file.name,
						previewUrl: reader.result,
						id: imageId,
						status: 'pending',
						error: null,
					};
					resolve(newImage);
				};
				reader.onerror = (error) => {
					console.error('FileReader Error:', error);
					resolve({
						file: null,
						fileName: file.name,
						previewUrl: null,
						id: imageId,
						status: 'error',
						error: 'Failed to read file.',
					});
				};
				reader.readAsDataURL(file);
			});
			promises.push(promise);
		}

		Promise.all(promises)
			.then((resolvedImages) => {
				setGalleryImages((prevImages) => [
					...prevImages,
					...resolvedImages.filter((img) => img.status !== 'error'),
				]);
				resolvedImages
					.filter((img) => img.status === 'error')
					.forEach((errImg) => {
						console.error(`Failed to process file: ${errImg.fileName}`);
					});

				setIsAddingPreview(false);
			})
			.catch((err) => {
				console.error('Error processing files:', err);
				setGlobalError('An unexpected error occurred while adding images.');
				setIsAddingPreview(false);
			});

		event.target.value = null;
	};

	const handleSaveImages = async () => {
		if (!propertyId) {
			setGlobalError('Cannot save images: Property ID is missing.');
			return;
		}

		const imagesToUpload = galleryImages.filter(
			(img) => img.status === 'pending' && img.file
		);

		if (imagesToUpload.length === 0) {
			setGlobalError('No new images to save.');
			return;
		}

		setGlobalError('');
		setIsSaving(true);

		const imageIdsToUpload = imagesToUpload.map((img) => img.id);
		setGalleryImages((prevImages) =>
			prevImages.map((img) =>
				imageIdsToUpload.includes(img.id)
					? { ...img, status: 'uploading' }
					: img
			)
		);

		const filesToUpload = imagesToUpload.map((img) => img.file);

		try {
			const cloudinaryResults = await propertyImagesToCloudinary(filesToUpload);

			const successfulUploads = [];
			const failedCloudinaryUploadIds = [];

			imagesToUpload.forEach((img, index) => {
				const cloudinaryUrl = cloudinaryResults[index];
				if (cloudinaryUrl) {
					successfulUploads.push({ id: img.id, url: cloudinaryUrl });
				} else {
					failedCloudinaryUploadIds.push(img.id);
					updateImageStatus(img.id, 'error', {
						error: 'Cloudinary upload failed.',
					});
				}
			});

			if (successfulUploads.length > 0) {
				const backendUrl = `${API_BASE_URL}/property/create-images`;
				const urlsToSend = successfulUploads.map((up) => up.url);

				try {
					const response = await fetch(backendUrl, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							propertyId: propertyId,
							propertyImages: urlsToSend,
						}),
					});

					const result = await response.json();

					if (!response.ok) {
						throw new Error(
							result.message || `Backend error: ${response.status}`
						);
					}

					const successfulIds = successfulUploads.map((up) => up.id);
					setGalleryImages((prevImages) =>
						prevImages.map((img) =>
							successfulIds.includes(img.id)
								? { ...img, status: 'uploaded', file: null }
								: img
						)
					);
				} catch (backendError) {
					console.error('Backend save failed:', backendError);
					const attemptedIds = successfulUploads.map((up) => up.id);
					setGalleryImages((prevImages) =>
						prevImages.map((img) =>
							attemptedIds.includes(img.id)
								? {
									...img,
									status: 'error',
									error: backendError.message || 'Backend save failed.',
								}
								: img
						)
					);
					setGlobalError(
						`Failed to save images to backend: ${backendError.message}`
					);
				}
			} else if (failedCloudinaryUploadIds.length > 0) {
				setGlobalError('Some image uploads failed. Please try again.');
			}
		} catch (error) {
			console.error('Upload process error:', error);
			setGlobalError(
				error.message || 'An unexpected error occurred during upload.'
			);
			setGalleryImages((prevImages) =>
				prevImages.map((img) =>
					imageIdsToUpload.includes(img.id) && img.status === 'uploading' // Only revert those not already marked as error
						? {
							...img,
							status: 'error',
							error: error.message || 'Upload failed.',
						}
						: img
				)
			);
		} finally {
			setIsSaving(false);
		}
	};

	const handleRemoveImage = (idToRemove) => {
		setGalleryImages((prevImages) =>
			prevImages.filter((image) => image.id !== idToRemove)
		);
	};

	const handleDeleteClick = (index) => {
		setImageToDeleteIndex(index);
		setShowDeleteModal(true);
	};

	const handleConfirmedDelete = (index) => {
		if (!propertyId) {
			console.error('Property ID is missing.');
			return;
		}

		setLoading(true);

		fetch(`${API_BASE_URL}/property/property-images/delete`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				propertyId,
				index,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.message === 'Image deleted successfully') {
					console.log('Image deleted');
					// Optionally update image list here
				} else {
					console.error('Failed to delete image');
				}
			})
			.catch((error) => {
				console.error('Error deleting image:', error);
			})
			.finally(() => {
				setLoading(false);
				setShowDeleteModal(false);
				setImageToDeleteIndex(null);
			});
	};

	const isUploadingAnyImage = galleryImages.some(
		(img) => img.status === 'uploading'
	);

	const handleAddVideoClick = () => {
		setVideoUrlInput('');
		setVideoUrlError('');
		setIsAddVideoModalOpen(true);
	};

	const handleAddVideoFromModal = async () => {
		setVideoUrlError('');

		if (!propertyId) {
			setVideoUrlError(
				'Cannot add video: Property ID is missing. Please save property details first.'
			);

			return;
		}
		if (!selectedVideoProvider) {
			setVideoUrlError('Please select a video provider.');
			return;
		}
		const trimmedUrl = videoUrlInput.trim();
		if (!trimmedUrl) {
			setVideoUrlError('Please enter a video URL.');
			return;
		}

		const isValidForEmbed = getEmbedUrl(selectedVideoProvider, trimmedUrl);
		if (!isValidForEmbed) {
			setVideoUrlError(
				`Invalid or unsupported ${selectedVideoProvider} URL format.`
			);
			return;
		}

		const videoId = generateId('vid-url');
		const newVideo = {
			id: videoId,
			provider: selectedVideoProvider,
			url: trimmedUrl,
			title: `${selectedVideoProvider} Video`,
			status: 'saving',
			error: null,
		};

		setGalleryVideos((prevVideos) => [...prevVideos, newVideo]);
		setIsAddVideoModalOpen(false);
		setShowVideo(true);

		try {
			const backendUrl = `${API_BASE_URL}/property/create-video`;
			const response = await fetch(backendUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					propertyId: propertyId,
					videoUrl: newVideo.url,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || `Server error: ${response.status}`);
			}
			setShowVideo(false);

			console.log('Video saved successfully:', result.message);
			updateVideoStatus(videoId, 'saved');
		} catch (error) {
			console.error('Failed to save video URL:', error);
			updateVideoStatus(videoId, 'error', {
				error: error.message || 'Failed to save video.',
			});
		}
	};

	const handleRemoveVideo = (idToRemove) => {
		setGalleryVideos((prevVideos) =>
			prevVideos.filter((video) => video.id !== idToRemove)
		);
	};

	const handleDeleteVideo = (index) => {
		if (!propertyId) {
			alert('Property ID is missing.');
			return;
		}

		const confirmDelete = window.confirm(
			'Are you sure you want to delete this video?'
		);
		if (!confirmDelete) return;

		setLoading1(true);
		fetch(`${API_BASE_URL}/property/property-video/delete`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				propertyId,
				index,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.message === 'Video deleted successfully') {
					setLoading1(false);
				} else {
					alert(data.message || 'Failed to delete the video.');
				}
			})
			.catch((error) => {
				console.error('Error deleting video:', error);
				alert('An error occurred while deleting the video.');
				setLoading1(false);
			});
	};

	const getEmbedUrl = (provider, url) => {
		if (!provider || !url || typeof url !== 'string' || url.trim() === '') {
			console.warn(
				'getEmbedUrl called with invalid provider or URL:',
				provider,
				url
			);
			return null;
		}

		const trimmedUrl = url.trim();

		try {
			new URL(trimmedUrl);

			let videoId = null;

			if (provider === 'youtube') {
				const youtubeRegex =
					/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
				const match = trimmedUrl.match(youtubeRegex);
				videoId = match ? match[1] : null;
				return videoId
					? `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&modestbranding=1`
					: null;
			} else if (provider === 'vimeo') {
				const vimeoRegex =
					/(?:https?:\/\/)?(?:www\.|player\.)?vimeo\.com\/(?:video\/)?(\d+)/;
				const match = trimmedUrl.match(vimeoRegex);
				videoId = match ? match[1] : null;
				return videoId
					? `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`
					: null;
			} else if (provider === 'wistia') {
				const wistiaRegex =
					/(?:https?:\/\/)?(?:.*\.)?(?:wistia\.com|wistia\.net)\/(?:medias|embed(?:\/iframe|\/playlists)?)\/([a-z0-9]+)/;
				const match = trimmedUrl.match(wistiaRegex);
				videoId = match ? match[1] : null;
				return videoId
					? `https://fast.wistia.net/embed/iframe/${videoId}?videoFoam=true`
					: null;
			}
		} catch (e) {
			console.error('Error parsing video URL structure:', trimmedUrl, e);
			return null;
		}

		console.warn(
			'Could not extract video ID for provider:',
			provider,
			'URL:',
			trimmedUrl
		);
		return null;
	};

	const OTHER_MEDIA_PROVIDERS = [
		{
			id: 'matterport',
			name: 'Matterport',
			logo: 'https://cribflyer-publicsite.s3.amazonaws.com/logos/vendor/matterport.png',
		},
		{
			id: 'cloudpano',
			name: 'CloudPano',
			logo: 'https://cribflyer-publicsite.s3.amazonaws.com/logos/vendor/cloud-pano.png',
		},
		{
			id: 'iguide',
			name: 'iGUIDE',
			logo: 'https://cribflyer-publicsite.s3.amazonaws.com/logos/vendor/iguide.png',
		},
		{
			id: 'immoviewer',
			name: 'Immoviewer',
			logo: 'https://cribflyer-publicsite.s3.amazonaws.com/logos/vendor/immoviewer.png',
		},
		{
			id: 'truplace',
			name: 'TruPlace',
			logo: 'https://cribflyer-publicsite.s3.amazonaws.com/logos/vendor/truplace.png',
		},
		{
			id: 'tourbuzz',
			name: 'Tourbuzz',
			logo: 'https://cribflyer-publicsite.s3.amazonaws.com/logos/vendor/tourbuzz.png',
		},
		{
			id: 'iframe',
			name: 'Embed URL (iframe)',
			logo: 'https://cribflyer-publicsite.s3.amazonaws.com/logos/vendor/iframe-generic.png',
		},
		{
			id: 'panorama',
			name: '360° Panorama',
			logo: 'https://cribflyer-publicsite.s3.amazonaws.com/logos/vendor/360-pano.png',
		},
	];
	const handleAddOtherMediaClick = () => {
		setOtherMediaUrlInput('');
		setOtherMediaUrlError('');
		setSelectedOtherMediaProvider('matterport');
		setIsAddOtherMediaModalOpen(true);
	};

	const updateOtherMediaStatus = (id, status, data = {}) => {
		setOtherMediaItems((prevItems) =>
			prevItems.map((item) =>
				item.id === id ? { ...item, status, ...data } : item
			)
		);
	};

	const handleAddOtherMediaFromModal = async () => {
		setOtherMediaUrlError('');

		if (!propertyId) {
			setOtherMediaUrlError('Cannot add media: Property ID is missing.');
			return;
		}
		if (!selectedOtherMediaProvider) {
			setOtherMediaUrlError('Please select a provider or type.');
			return;
		}
		const trimmedUrl = otherMediaUrlInput.trim();
		if (!trimmedUrl) {
			setOtherMediaUrlError('Please enter a URL or embed code.');
			return;
		}

		if (
			selectedOtherMediaProvider === 'iframe' &&
			!trimmedUrl.startsWith('http') &&
			!trimmedUrl.includes('<iframe')
		) {
			setOtherMediaUrlError(
				'Please enter a valid URL (starting with http/https) or an <iframe> embed code.'
			);
			return;
		}
		if (
			selectedOtherMediaProvider !== 'iframe' &&
			!trimmedUrl.startsWith('http')
		) {
			setOtherMediaUrlError(
				'Please enter a valid URL (starting with http/https).'
			);
			return;
		}

		const mediaId = generateId('media-url');
		const newItem = {
			id: mediaId,
			provider: selectedOtherMediaProvider,
			url: trimmedUrl,
			status: 'saved',
			error: null,
		};
		console.log('otherMediaItems', newItem);
		setOtherMediaItems((prevItems) => [...prevItems, newItem]);
		setIsOtherMedia(true)
		try {
			const response = await fetch(
				`${API_BASE_URL}/property/create-other-media`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						propertyId: propertyId,
						mediaUrls: [trimmedUrl],
					}),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Failed to add media.');
			}

			// --- Update UI on Success ---
			setOtherMediaItems((prevItems) =>
				prevItems.map((item) =>
					item.id === mediaId ? { ...item, status: 'saved' } : item
				)
			);
			setIsOtherMedia(false)
			console.log('Media added successfully:', data);
		} catch (error) {
			console.error('Error adding media:', error);
			setIsOtherMedia(false)

			// --- Handle Error in UI ---
			setOtherMediaItems((prevItems) =>
				prevItems.map((item) =>
					item.id === mediaId
						? { ...item, status: 'error', error: error.message }
						: item
				)
			);
			setOtherMediaUrlError(error.message);
		}

		setIsAddOtherMediaModalOpen(false);
	};

	const handleRemoveOtherMedia = async (index) => {
		if (!propertyId) {
			alert('Property ID is missing.');
			return;
		}
		setIsRemoveOtherMedia(true)
		try {
			const response = await fetch(
				`${API_BASE_URL}/property/property-other-media/${propertyId}/${index}`,
				{
					method: 'DELETE',
				}
			);

			const data = await response.json();

			if (response.ok) {
				setIsRemoveOtherMedia(false)

				alert('Media removed successfully');
			} else {
				alert(data.message || 'Error removing media');
				IsRemoveOtherMedia(false)

			}
		} catch (error) {
			setIsRemoveOtherMedia(false)

			console.error('Error removing media:', error);
			alert('Failed to remove media. Please try again later.');
		}
	};

	const getMediaEmbedSource = (provider, urlOrEmbed) => {
		if (!urlOrEmbed) return null;
		if (provider === 'iframe' && urlOrEmbed.includes('<iframe')) {
			const match = urlOrEmbed.match(/src="([^"]+)"/);
			return match ? match[1] : null;
		}
		if (urlOrEmbed.startsWith('http')) {
			return urlOrEmbed;
		}
		return null;
	};

	const handleAddFloorPlanClick = () => {
		if (disableOtherAddButtons) return;
		setFloorPlanUploadError('');
		setFloorPlanNameInput('');
		setIsFloorPlanModalOpen(true);
	};

	const handleModalSelectFileClick = () => {
		if (floorPlanFileInputRef.current) {
			floorPlanFileInputRef.current.click();
		}
	};

	const updateFloorPlanStatus = (id, status, data = {}) => {
		setFloorPlanImages((prevImages) =>
			prevImages.map((img) =>
				img.id === id ? { ...img, status, ...data } : img
			)
		);
	};

	const handleFloorPlanFileChange = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		if (!propertyId) {
			setGlobalError('Cannot upload floor plan: Property ID is missing.');
			setIsFloorPlanModalOpen(false);
			event.target.value = null;
			return;
		}
		setGlobalError('');

		const currentPlanName = floorPlanNameInput;
		const floorPlanId = generateId('fp');

		if (file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onloadstart = () => {
				setIsAddingPreview(true);
				setIsFloorPlanModalOpen(false);
			};
			reader.onloadend = () => {
				const newFloorPlan = {
					file: file,
					previewUrl: reader.result,
					id: floorPlanId,
					fileName: file.name,
					planName: currentPlanName || file.name,
					status: 'uploading',
					error: null,
				};
				setFloorPlanImages((prevImages) => [...prevImages, newFloorPlan]);
				setIsAddingPreview(false);
				setFloorPlanNameInput('');

				uploadSingleFloorPlan(
					file,
					floorPlanId,
					currentPlanName || file.name,
					propertyId
				);
			};
			reader.onerror = () => {
				setFloorPlanUploadError('Failed to read floor plan image file.');
				setIsAddingPreview(false);
			};
			reader.readAsDataURL(file);
		} else {
			setFloorPlanUploadError(
				'Please select a valid image file for the floor plan.'
			);
		}
		event.target.value = null;
	};

	const uploadSingleFloorPlan = async (
		file,
		floorPlanId,
		planName,
		currentPropertyId
	) => {
		try {

			setIsFloorplain(true)
			console.log(`Uploading floor plan ${file.name} to Cloudinary...`);
			const uploader =
				propertyFloorPlanToCloudinary || propertyImagesToCloudinary;
			const uploadedUrls = await uploader([file]);

			if (!uploadedUrls || uploadedUrls.length === 0 || !uploadedUrls[0]) {
				throw new Error(
					'Cloudinary floor plan upload failed or returned no URL.'
				);
			}
			const cloudinaryUrl = uploadedUrls[0];

			updateFloorPlanStatus(floorPlanId, 'uploading', { cloudinaryUrl });


			const backendUrl = `${API_BASE_URL}/property/create-floor-plain`;
			const response = await fetch(backendUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					propertyId: currentPropertyId,
					url: cloudinaryUrl,
					planName: planName,
				}),
			});

			const result = await response.json();
			if (!response.ok) {
				throw new Error(
					result.message ||
					`Backend error saving floor plan: ${response.status}`
				);
			}

			setIsFloorplain(false)
			updateFloorPlanStatus(floorPlanId, 'uploaded', { file: null });
		} catch (error) {
			setIsFloorplain(false)
			console.error(`Upload failed for floor plan ${floorPlanId}:`, error);
			updateFloorPlanStatus(floorPlanId, 'error', {
				error: error.message || 'Floor plan upload failed.',
				file: null,
			});
		}
	};

	const handleRemoveFloorPlan = (idToRemove) => {
		setFloorPlanImages((prevImages) =>
			prevImages.filter((image) => {
				return image.id !== idToRemove;
			})
		);
		if (floorPlanImages.length === 1) setFloorPlanUploadError('');
	};

	const handleDelFloorPlan = async (index) => {
		if (!propertyId) {
			alert('Property ID is missing.');
			return;
		}
		const confirmDelete = window.confirm(
			'Are you sure you want to delete this image?'
		);

		if (!confirmDelete) return;

		setLoading2(true)
		try {
			const response = await fetch(
				`${API_BASE_URL}/property/property-floor-plan/${propertyId}/${index}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			const data = await response.json();
			if (response.ok) {
				setLoading2(false)

				console.log(data);
			} else {
				setLoading2(false)
				console.error(data);
			}
		} catch (error) {
			setLoading2(false)
			console.error(error);
		}
	};



	// --- Determine disabling state ---
	const isUploadingAnyFloorPlan = floorPlanImages.some(
		(img) => img.status === 'uploading'
	);
	const disableAddImageButton = isSaving || isAddingPreview;
	// Determine if Save button should be disabled
	const pendingImagesCount = galleryImages.filter(
		(img) => img.status === 'pending'
	).length;
	const disableSaveButton = isSaving || pendingImagesCount === 0;

	const disableOtherAddButtons = isAddingPreview || isUploadingAnyFloorPlan;
	const disableModalSelect = isAddingPreview || isUploadingAnyFloorPlan;

	return (
		<div className='space-y-8 p-4 h-full overflow-y-scroll'>
			{globalError && (
				<div className='p-3 mb-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm'>
					{globalError}
				</div>
			)}

			{/* --- Photos Section ---  */}
			<div className='p-0'>
				{globalError && (
					<div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
						{globalError}
					</div>
				)}

				<div className='mb-8'>
					<h2 className='text-lg font-semibold text-gray-800 mb-4'>
						Photos {propertyName ? `for ${propertyName}` : ''}
					</h2>
					<div className='flex flex-wrap gap-4 items-start mb-4'>
						{/* Display existing images (read-only or deletable) */}
						{galleryImagesprev.map((image) => (
							<div
								key={image.index} // Use a stable key from your data
								className='w-[130px] flex flex-col items-center'
							>
								<div className='w-[130px] h-[122px] bg-gray-100 border border-gray-200 rounded shadow-sm relative group '>
									<img
										src={image.url}
										alt={`Existing image ${image.index}`}
										className='w-full h-full object-cover'
									/>
									{/* Optional: Add delete button for existing images */}
									{image.status !== 'deleting' && (
										<button
											type="button"
											onClick={() => handleDeleteClick(image.index)}
											className="absolute top-[-8px] right-[-8px] bg-white border border-gray-300 text-gray-700 rounded-full w-5 h-5 p-0 text-[10px] flex items-center justify-center shadow-md z-20 transition-opacity group-hover:opacity-100 opacity-0 focus:opacity-100 hover:bg-gray-100 hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-400"
											aria-label="Remove existing image"
											title="Remove"
										>
											X
										</button>
									)}
								</div>
								{showDeleteModal && (
									<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
										<div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center">
											<h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
											<p className="text-sm text-gray-600 mb-6">
												Do you really want to delete this image? This action cannot be undone.
											</p>
											<div className="flex justify-center gap-4">
												<button
													className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
													onClick={() => {
														handleConfirmedDelete(imageToDeleteIndex);
														setShowDeleteModal(false);
													}}
												>
													Yes, Delete
												</button>
												<button
													className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
													onClick={() => {
														setShowDeleteModal(false);
														setImageToDeleteIndex(null);
													}}
												>
													Cancel
												</button>
											</div>
										</div>
									</div>
								)}

								<div className='text-xs text-center w-full truncate px-1 h-4 mt-1'>
									{/* Can display status if needed, e.g., 'Saved' */}
								</div>
							</div>
						))}

						{/* Display newly added/uploading images */}
						{galleryImages.map((image) => (

							<div
								key={image.id}
								className={`w-[130px] flex flex-col items-center ${image.status === 'uploaded' ? 'hidden' : ''}`}
							>
								<div className='w-[130px] h-[122px] bg-gray-100 border border-gray-200 rounded shadow-sm relative group '>
									{image.previewUrl ? (
										<img
											src={image.previewUrl}
											alt={image.fileName || `Image ${image.id}`}
											className='w-full h-full object-cover'
										/>
									) : (
										<div className='w-full h-full flex items-center justify-center text-xs text-gray-500'>
											Preview N/A
										</div>
									)}
									{/* Overlays for status */}
									{(image.status === 'uploading' ||
										(isSaving && image.status === 'pending')) && ( // Show spinner if saving pending images too
											<div className='absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10'>
												<LoadingSpinner />
											</div>
										)}
									{image.status === 'error' && (
										<div
											className='absolute inset-0 bg-red-700 bg-opacity-80 flex items-center justify-center z-10 cursor-help' // Add cursor-help
											title={image.error || 'An error occurred'} // Show specific error on hover
										>
											<ErrorIcon />
										</div>
									)}

									{/* Remove button for pending/error/uploaded images (client-side removal) */}
									{image.status !== 'uploading' &&
										!(isSaving && image.status === 'pending') && ( // Don't allow removal while actively saving/uploading
											<button
												type='button'
												onClick={() => handleRemoveImage(image.id)}
												className='absolute top-[-8px] right-[-8px] bg-white border border-gray-300 text-gray-700 rounded-full w-5 h-5 p-0 text-[10px] flex items-center justify-center shadow-md z-20 transition-opacity group-hover:opacity-100 opacity-0 focus:opacity-100 hover:bg-gray-100 hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-400'
												aria-label='Remove image'
												title='Remove'
											>
												X
											</button>
										)}
								</div>
								{/* Status text below image */}
								<div className='text-xs text-center w-full truncate px-1 h-4 mt-1'>
									{image.status === 'pending' && !isSaving && (
										<span className='text-gray-500'></span>
									)}
									{(image.status === 'uploading' ||
										(isSaving && image.status === 'pending')) && (
											<span className='text-blue-600'>Uploading...</span>
										)}
									{image.status === 'uploaded' && (
										<span className='text-green-600'>Saved</span>
									)}
									{image.status === 'error' && (
										<span
											className='text-red-600'
											title={image.error || 'An error occurred'}
										>
											Error
										</span>
									)}
								</div>
							</div>
						))}

						{/* Add Image Button Placeholder */}
						<button
							type='button'
							onClick={handleAddImageClick}
							className={`w-[130px] h-[122px] bg-[#EBE9E9] flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors rounded border border-gray-300 ${disableAddImageButton ? 'opacity-50 cursor-not-allowed' : ''
								}`}
							aria-label='Add gallery image'
							disabled={disableAddImageButton}
						>
							{isAddingPreview ? (
								<LoadingSpinner />
							) : (
								<div className='h-10 w-10 rounded-full flex justify-center items-center bg-white'>
									<PlusIcon />
								</div>
							)}
						</button>
					</div>

					{/* Hidden File Input */}
					<input
						type='file'
						ref={imageFileInputRef}
						onChange={handleImageFileChange}
						accept='image/*'
						style={{ display: 'none' }}
						multiple // Allow multiple file selection
						disabled={disableAddImageButton}
					/>
				</div>

				{/* Save Images Button */}
				<button
					type='button'
					onClick={handleSaveImages} // Trigger the upload process
					className={`flex shadowbtn cursor-pointer text-white font-semibold text-center rounded-lg items-center justify-center w-[140px] h-12 transition-colors ${disableSaveButton
						? 'bg-gray-400 cursor-not-allowed'
						: 'bg-[#002B4B] hover:bg-[#001f36]'
						}`}
					disabled={disableSaveButton}
				>
					{/* (${pendingImagesCount}) */}
					{isSaving ? 'Saving...' : `Save Images `}
				</button>
			</div>

			{/* --- Videos Section ---  */}

			<div className='mb-8'>
				<h2 className='text-lg font-semibold text-gray-800 mb-4'>Videos</h2>
				<div className='flex flex-wrap gap-4 items-start mb-4'>
					{' '}
					{/* {galleryVideos.map((video) => {
						const embedUrl = getEmbedUrl(video.provider, video.url);
						return (
							<div
								key={video.id}
								className='w-[130px] flex flex-col items-center'
							>
								<div className='w-[130px] h-[122px] bg-gray-900 shadow-sm relative group border border-gray-700 rounded '>
									{embedUrl ? (
										<iframe
											src={embedUrl}
											title={video.title || `Video ${video.id}`}
											className='w-full h-full'
											frameBorder='0'
											allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
											allowFullScreen
										></iframe>
									) : (
										<div className='w-full h-full flex items-center justify-center text-white text-xs p-2 text-center bg-red-800'>
											Invalid URL or provider
										</div>
									)}
									<button
										type='button'
										onClick={() => handleRemoveVideo(video.id)}
										className='absolute top-[-8px] right-[-8px] bg-white border border-gray-300 text-gray-700 rounded-full w-5 h-5 p-0 text-[10px] flex items-center justify-center shadow-md z-20 transition-opacity group-hover:opacity-100 opacity-0 focus:opacity-100 hover:bg-gray-100 hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-400'
										aria-label='Remove video'
										title='Remove'
									>
										X
									</button>
								</div>
							</div>
						);
					})} */}
					{galleryVideoprev.map((video) => {
						return (
							<div
								key={video.index}
								className='w-[130px] flex flex-col items-center'
							>
								<div className='w-[130px] h-[122px] bg-gray-900 shadow-sm relative group border border-gray-700 rounded'>
									{video.url ? (
										<iframe
											src={video.url.replace('watch?v=', 'embed/')} // Convert YouTube URL to embeddable format
											title={`Video ${video.index}`}
											className='w-full h-full rounded'
											frameBorder='0'
											allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
											allowFullScreen
										></iframe>
									) : (
										<div className='w-full h-full flex items-center justify-center text-white text-xs p-2 text-center bg-red-800'></div>
									)}
									<button
										type='button'
										onClick={() => handleDeleteVideo(video.index)}
										className='absolute top-[-8px] right-[-8px] bg-white border border-gray-300 text-gray-700 rounded-full w-5 h-5 p-0 text-[10px] flex items-center justify-center shadow-md z-20 transition-opacity group-hover:opacity-100 opacity-0 focus:opacity-100 hover:bg-gray-100 hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-400'
										aria-label='Remove video'
										title='Remove'
									>
										X
									</button>
								</div>
							</div>
						);
					})}
					<button
						type='button'
						onClick={handleAddVideoClick}
						className={`w-[130px] h-[122px] bg-[#EBE9E9] flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors rounded border border-gray-300 ${disableOtherAddButtons ? 'opacity-50 cursor-not-allowed' : ''
							}`}
						aria-label='Add gallery video'
						disabled={disableOtherAddButtons}
					>
						<div className=' h-10 w-10 rounded-full flex justify-center items-center'>
							<PlusIcon />
						</div>
					</button>
				</div>
			</div>

			{/* --- Add Video Modal --- */}
			{isAddVideoModalOpen && (
				<div
					className='fixed inset-0 z-50 bg-transparent shadow-2xl bg-opacity-60 flex items-center justify-center p-4'
					onClick={() => setIsAddVideoModalOpen(false)}
				>
					<div
						className='bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative'
						onClick={(e) => e.stopPropagation()}
					>
						<button
							type='button'
							onClick={() => setIsAddVideoModalOpen(false)}
							className='absolute top-3 right-3 text-gray-400 hover:text-gray-600'
							aria-label='Close modal'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='w-6 h-6'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M6 18 18 6M6 6l12 12'
								/>
							</svg>
						</button>

						<h3 className='text-xl font-semibold text-gray-900 mb-5'>
							Add Video
						</h3>

						{/* Provider Selection */}
						<div className='mb-4'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Select provider:
							</label>
							<div className='flex space-x-3'>
								{['youtube', 'vimeo', 'wistia'].map((provider) => (
									<button
										key={provider}
										type='button'
										onClick={() => setSelectedVideoProvider(provider)}
										className={`flex-1 p-3 border rounded-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${selectedVideoProvider === provider
											? 'border-indigo-500 border-2 shadow-md'
											: 'border-gray-300 hover:border-gray-400'
											}`}
									>
										{provider === 'youtube' && (
											<Image
												src='https://cribflyer-publicsite.s3.amazonaws.com/logos/vendor/youtube-2.png'
												alt='YouTube'
												height={50}
												width={100}
												className=' mx-auto'
											/>
										)}
										{provider === 'vimeo' && (
											<Image
												src='https://cribflyer-publicsite.s3.amazonaws.com/logos/vendor/vimeo-2.png'
												height={50}
												width={100}
												className=' mx-auto'
											/>
										)}
										{provider === 'wistia' && (
											<Image
												src='https://cribflyer-publicsite.s3.amazonaws.com/logos/vendor/wistia-2.png'
												alt='Wistia'
												height={50}
												width={100}
												className='h-5 object-cover mx-auto'
											/>
										)}
									</button>
								))}
							</div>
						</div>

						{/* URL Input */}
						<div className='mb-4'>
							<label
								htmlFor='video-url-input'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								Enter{' '}
								{selectedVideoProvider.charAt(0).toUpperCase() +
									selectedVideoProvider.slice(1)}{' '}
								URL:
							</label>
							<input
								type='url'
								id='video-url-input'
								name='video-url-input'
								value={videoUrlInput}
								onChange={(e) => setVideoUrlInput(e.target.value)}
								placeholder={`e.g., https://www.${selectedVideoProvider}.com/watch?v=...`}
								className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${videoUrlError
									? 'border-red-500 focus:ring-red-500 focus:border-red-500'
									: 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
									}`}
								required
							/>
							<p className='mt-2 text-xs text-gray-500'>
								Upload your video to{' '}
								{selectedVideoProvider.charAt(0).toUpperCase() +
									selectedVideoProvider.slice(1)}{' '}
								first, then copy/paste the video URL here.
							</p>
						</div>

						{/* Error Display */}
						{videoUrlError && (
							<p className='text-red-600 text-sm mb-4 -mt-2'>{videoUrlError}</p>
						)}

						{/* Action Button */}
						<button
							type='button'
							onClick={handleAddVideoFromModal}
							className='w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
						>
							Add Video
						</button>
					</div>
				</div>
			)}

			{/* --- Other Media Section ---  */}
			<div className='mb-8'>
				<h2 className='text-lg font-semibold text-gray-800 mb-4'>
					3D Tours & Other Media
				</h2>
				<div className='flex flex-wrap gap-4 items-start mb-4'>
					{' '}
					{/* Use items-start */}
					{/* {otherMediaItems.map((item) => {
						// Map over otherMediaItems
						const embedSrc = getMediaEmbedSource(item.provider, item.url);
						const providerInfo = OTHER_MEDIA_PROVIDERS.find(
							(p) => p.id === item.provider
						);

						return (
							<div
								key={item.id}
								className='w-[130px] flex flex-col items-center'
							>
								<div className='w-[130px] h-[122px] bg-gray-200 shadow-sm relative group border border-gray-300 rounded  flex items-center justify-center'>
									{embedSrc && item.status !== 'error' ? (
										<iframe
											src={embedSrc}
											title={providerInfo?.name || `Media ${item.id}`}
											className='w-full h-full border-0'
											allowFullScreen
											allow='fullscreen; vr'
										></iframe>
									) : (
										<div
											className={`w-full h-full flex flex-col items-center justify-center text-center p-2 ${
												item.status === 'error'
													? 'bg-red-100 text-red-700'
													: 'bg-gray-100 text-gray-500'
											}`}
											title={
												item.error || providerInfo?.name || 'Invalid Embed'
											}
										>
											{providerInfo?.logo ? (
												<img
													src={providerInfo.logo}
													alt={providerInfo.name}
													className='h-10 w-auto mb-1 opacity-80'
												/>
											) : (
												<FileIcon />
											)}
											<span className='text-xs mt-1'>
												{item.status === 'error'
													? 'Error'
													: providerInfo?.name || 'Media'}
											</span>
										</div>
									)}

									{item.status !== 'saving' && (
										<button
											type='button'
											onClick={() => handleRemoveOtherMedia(item.id)}
											className='absolute top-[-8px] right-[-8px] bg-white border border-gray-300 text-gray-700 rounded-full w-5 h-5 p-0 text-[10px] flex items-center justify-center shadow-md z-20 transition-opacity group-hover:opacity-100 opacity-0 focus:opacity-100 hover:bg-gray-100 hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-400'
											aria-label='Remove media'
											title='Remove'
										>
											X
										</button>
									)}
								</div>
							</div>
						);
					})} */}
					{otherMediaPrev.map((item) => {
						// Get embed source if available
						const embedSrc = getMediaEmbedSource(item.provider, item.url);
						const providerInfo = OTHER_MEDIA_PROVIDERS.find(
							(p) => p.id === item.provider
						);

						return (
							<div
								key={item.index}
								className='w-[130px] flex flex-col items-center'
							>
								<div className='w-[130px] h-[122px] bg-gray-200 shadow-sm relative group border border-gray-300 rounded flex items-center justify-center'>
									{embedSrc && item.status !== 'error' ? (
										<iframe
											src={embedSrc}
											title={providerInfo?.name || `Media ${item.index}`}
											className='w-full h-full border-0'
											allowFullScreen
											allow='fullscreen; vr'
										></iframe>
									) : (
										<div
											className={`w-full h-full flex flex-col items-center justify-center text-center p-2 ${item.status === 'error'
												? 'bg-red-100 text-red-700'
												: 'bg-gray-100 text-gray-500'
												}`}
											title={
												item.error || providerInfo?.name || 'Invalid Embed'
											}
										>
											{providerInfo?.logo ? (
												<img
													src={providerInfo.logo}
													alt={providerInfo.name}
													className='h-10 w-auto mb-1 opacity-80'
												/>
											) : (
												<FileIcon />
											)}
											<span className='text-xs mt-1'>
												{item.status === 'error'
													? 'Error'
													: providerInfo?.name || 'Media'}
											</span>
										</div>
									)}

									{item.status !== 'saving' && (
										<button
											type='button'
											onClick={() => handleRemoveOtherMedia(item.index)}
											className='absolute top-[-8px] right-[-8px] bg-white border border-gray-300 text-gray-700 rounded-full w-5 h-5 p-0 text-[10px] flex items-center justify-center shadow-md z-20 transition-opacity group-hover:opacity-100 opacity-0 focus:opacity-100 hover:bg-gray-100 hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-400'
											aria-label='Remove media'
											title='Remove'
										>
											X
										</button>
									)}
								</div>
							</div>
						);
					})}
					<button
						type='button'
						onClick={handleAddOtherMediaClick}
						className={`w-[130px] h-[122px] bg-[#EBE9E9] flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors rounded border border-gray-300 ${disableOtherAddButtons ? 'opacity-50 cursor-not-allowed' : ''
							}`}
						aria-label='Add 3D tour or other media'
						disabled={disableOtherAddButtons}
					>
						<div className=' h-10 w-10 rounded-full flex justify-center items-center'>
							<PlusIcon />
						</div>
					</button>
				</div>
			</div>
			
			{/* --- Add Other Media Modal --- */}
			{isAddOtherMediaModalOpen && (
				<div
					className='fixed inset-0 z-50 bg-transparent shadow-2xl flex items-center justify-center p-4'
					onClick={() => setIsAddOtherMediaModalOpen(false)}
				>
					<div
						className='bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative'
						onClick={(e) => e.stopPropagation()}
					>
						<button
							type='button'
							onClick={() => setIsAddOtherMediaModalOpen(false)}
							className='absolute top-3 right-3 text-gray-400 hover:text-gray-600'
							aria-label='Close modal'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='w-6 h-6'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M6 18 18 6M6 6l12 12'
								/>
							</svg>
						</button>

						<h3 className='text-xl font-semibold text-gray-900 mb-5'>
							Add 3D Tour or Other Media
						</h3>

						<div className='mb-5'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Select source / type:
							</label>
							<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
								{' '}
								{OTHER_MEDIA_PROVIDERS.map((provider) => (
									<button
										key={provider.id}
										type='button'
										onClick={() => setSelectedOtherMediaProvider(provider.id)}
										className={`p-3 border rounded-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 flex flex-col items-center justify-center text-center h-24 ${selectedOtherMediaProvider === provider.id
											? 'border-indigo-500 border-2 shadow-md bg-indigo-50'
											: 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
											}`}
									>
										{/* Display Logo */}
										{provider.logo ? (
											<Image
												height={50}
												width={100}
												src={provider.logo}
												alt={provider.name}
												className='   object-cover'
											/>
										) : (
											<FileIcon />
										)}
									</button>
								))}
							</div>
						</div>

						<div className='mb-4'>
							<label
								htmlFor='other-media-url-input'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								Enter URL or Embed Code:
							</label>
							<textarea
								id='other-media-url-input'
								name='other-media-url-input'
								rows={3}
								value={otherMediaUrlInput}
								onChange={(e) => setOtherMediaUrlInput(e.target.value)}
								placeholder={
									selectedOtherMediaProvider === 'iframe'
										? 'Paste full URL (https://...) or <iframe> code'
										: `Paste the share URL from ${OTHER_MEDIA_PROVIDERS.find(
											(p) => p.id === selectedOtherMediaProvider
										)?.name || 'your provider'
										}`
								}
								className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm font-mono text-xs ${otherMediaUrlError
									? 'border-red-500 focus:ring-red-500 focus:border-red-500'
									: 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
									}`}
								required
							/>
							<p className='mt-1 text-xs text-gray-500'>
								Find the sharing link or embed code provided by{' '}
								{OTHER_MEDIA_PROVIDERS.find(
									(p) => p.id === selectedOtherMediaProvider
								)?.name || 'the source'}
								.
							</p>
						</div>

						{otherMediaUrlError && (
							<p className='text-red-600 text-sm mb-4 -mt-2'>
								{otherMediaUrlError}
							</p>
						)}

						<button
							type='button'
							onClick={handleAddOtherMediaFromModal}
							className='w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
						>
							Add Media
						</button>
					</div>
				</div>
			)}
			
			{/* --- Floor Plans Section --- */}
			<div className='mb-8'>
				<h2 className='text-lg font-semibold text-gray-800 mb-4'>
					Floor Plans
				</h2>
				<div className='flex flex-wrap gap-4 items-start mb-4'>
					{' '}
					{floorPlanImages.map((image) => (
						<div
							key={image.id}
							className={`w-[130px] flex flex-col items-center ${image.status === "uploaded" ? 'hidden' : ""}`}
						>
							<div className='w-[130px] h-[122px] bg-gray-100 shadow-sm relative group border border-gray-200 rounded'>
								<img
									src={image.previewUrl}
									alt={
										image.planName || image.fileName || `Floor Plan ${image.id}`
									}
									className='w-full h-full object-contain p-1'
								/>
								{image.status === 'uploading' && (
									<div className='absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10'>
										<LoadingSpinner />
									</div>
								)}
								{image.status === 'error' && (
									<div
										className='absolute inset-0 bg-red-700 bg-opacity-80 flex items-center justify-center z-10'
										title={image.error}
									>
										<ErrorIcon />
									</div>
								)}
								{image.status === 'uploaded' && (
									<div className='absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-0.5 shadow z-10'>
										<CheckIcon />
									</div>
								)}
								{image.status !== 'uploading' && (
									<button
										type='button'
										onClick={() => handleRemoveFloorPlan(image.id)}
										className='absolute top-[-8px] right-[-8px] bg-white border border-gray-300 text-gray-700 rounded-full w-5 h-5 p-0 text-[10px] flex items-center justify-center shadow-md z-20
                                                    transition-opacity group-hover:opacity-100 opacity-0 focus:opacity-100 hover:bg-gray-100 hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-400'
										aria-label='Remove floor plan'
										title='Remove'
									>
										X
									</button>
								)}
							</div>

							<div className='text-xs text-center w-full truncate px-1 h-4 mt-1'>
								{image.status === 'uploading' && (
									<span className='text-blue-600'>Uploading...</span>
								)}
								{image.status === 'uploaded' && (
									<span className='text-green-600'>
										{image.planName || 'Uploaded'}
									</span>
								)}{' '}
								{image.status === 'error' && (
									<span className='text-red-600' title={image.error}>
										Error
									</span>
								)}
								{(!image.status || image.status === 'idle') && (
									<span className='text-gray-500'>
										{image.planName || image.fileName}
									</span>
								)}
							</div>
						</div>
					))}
					{floorPlans.map((image, index) => (
						<div
							key={index}
							className='w-[130px] flex flex-col items-center'
						>
							<div className='w-[130px] h-[122px] bg-gray-100 shadow-sm relative group border border-gray-200 rounded'>
								<img
									src={image.url}
									alt={`Floor Plan`}
									className='w-full h-full object-contain p-1'
								/>
								{image.status === 'uploading' && (
									<div className='absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10'>
										<LoadingSpinner />
									</div>
								)}
								{image.status === 'error' && (
									<div
										className='absolute inset-0 bg-red-700 bg-opacity-80 flex items-center justify-center z-10'
										title={image.error}
									>
										<ErrorIcon />
									</div>
								)}
								{/* {image.status === 'uploaded' && (
									<div className='absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-0.5 shadow z-10'>
										<CheckIcon />
									</div>
								)} */}
								{image.status !== 'uploading' && (
									<button
										type='button'
										onClick={() => handleDelFloorPlan(index)}
										className='absolute top-[-8px] right-[-8px] bg-white border border-gray-300 text-gray-700 rounded-full w-5 h-5 p-0 text-[10px] flex items-center justify-center shadow-md z-20
                                                    transition-opacity group-hover:opacity-100 opacity-0 focus:opacity-100 hover:bg-gray-100 hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-400'
										aria-label='Remove floor plan'
										title='Remove'
									>
										X
									</button>
								)}
							</div>

							<div className='text-xs text-center w-full truncate px-1 h-4 mt-1'>
								{image.status === 'uploading' && (
									<span className='text-blue-600'>Uploading...</span>
								)}
								{image.status === 'uploaded' && (
									<span className='text-green-600'>
										{image.planName || 'Uploaded'}
									</span>
								)}{' '}
								{image.status === 'error' && (
									<span className='text-red-600' title={image.error}>
										Error
									</span>
								)}
								{(!image.status || image.status === 'idle') && (
									<span className='text-gray-500'>
										{image.planName || image.fileName}
									</span>
								)}
							</div>
						</div>
					))}
					<button
						type='button'
						onClick={handleAddFloorPlanClick}
						className={`w-[130px] h-[122px] bg-[#EBE9E9] flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors rounded border border-gray-300  ${disableOtherAddButtons ? 'opacity-50 cursor-not-allowed' : ''
							}`}
						aria-label='Add floor plan image'
						disabled={disableOtherAddButtons}
					>
						<div className=' h-10 w-10 rounded-full flex justify-center items-center'>
							<PlusIcon />
						</div>
					</button>
				</div>
				<input
					type='file'
					ref={floorPlanFileInputRef}
					onChange={handleFloorPlanFileChange}
					accept='image/*'
					style={{ display: 'none' }}
				/>
			</div>

			{/* --- Floor Plan Modal --- */}
			{isFloorPlanModalOpen && (
				<div
					className='fixed inset-0 z-40 bg-transparent shadow-2xl bg-opacity-60 flex items-center justify-center p-4' // Changed overlay to black
					onClick={() => setIsFloorPlanModalOpen(false)}
				>
					<div
						className='bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative'
						onClick={(e) => e.stopPropagation()}
					>
						<button
							type='button'
							onClick={() => setIsFloorPlanModalOpen(false)}
							className='absolute top-2 right-2 text-gray-500 hover:text-gray-800'
							aria-label='Close modal'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='w-6 h-6'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M6 18 18 6M6 6l12 12'
								/>
							</svg>
						</button>

						<h3 className='text-lg font-medium text-gray-900 mb-4'>
							Add Floor Plan
						</h3>

						<div className='mb-4'>
							<label
								htmlFor='floorplan-input'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								{' '}
								Plan Name{' '}
							</label>
							<input
								type='text'
								id='floorplan-input'
								name='floorplan-input'
								value={floorPlanNameInput}
								onChange={(e) => setFloorPlanNameInput(e.target.value)}
								placeholder='e.g., Ground Floor Plan'
								className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
							/>
						</div>

						<button
							type='button'
							onClick={handleModalSelectFileClick}
							className={`w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${disableModalSelect ? 'opacity-50 cursor-not-allowed' : ''
								}`}
							disabled={disableModalSelect}
						>
							{isAddingPreview || isUploadingAnyFloorPlan
								? 'Processing...'
								: 'Select File from Device'}
						</button>

						{floorPlanUploadError && (
							<p className='text-red-600 text-sm mt-3'>
								{floorPlanUploadError}
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default UplaodPage;
