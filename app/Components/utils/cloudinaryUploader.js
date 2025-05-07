// src/utils/cloudinaryUploader.js

/**
 * Uploads an array of image files to Cloudinary.
 *
 * @param {File[]} files - An array of File objects to upload.
 * @returns {Promise<string[]>} A promise that resolves with an array of Cloudinary secure URLs.
 * @throws {Error} If any upload fails or configuration is missing.
 */
export const uploadImagesToCloudinary = async (files) => {
	const CLOUD_NAME = "dnjjxgwpw"; // Use Vite env variables
	const UPLOAD_PRESET = "gallery_uploads_unsigned"; // Use Vite env variables

	if (!CLOUD_NAME || !UPLOAD_PRESET) {
		console.error(
			'Cloudinary configuration (cloud name or upload preset) is missing in environment variables.'
		);
		throw new Error(
			'Cloudinary configuration missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.'
		);
	}

	const uploadPromises = files.map((file) => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', UPLOAD_PRESET); // Use an UNSIGNED preset for client-side uploads

		const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

		return fetch(url, {
			method: 'POST',
			body: formData,
		})
			.then((response) => {
				if (!response.ok) {
					return response.json().then((err) => {
						throw new Error(
							`Cloudinary upload failed: ${err.error.message || response.statusText}`
						);
					});
				}
				return response.json();
			})
			.then((data) => {
				if (!data.secure_url) {
					throw new Error('Cloudinary response missing secure_url.');
				}
				return data.secure_url; // Return the secure URL
			});
	});

	try {
		// Wait for all uploads to complete
		const uploadedUrls = await Promise.all(uploadPromises);
		console.log('All images uploaded successfully:', uploadedUrls);
		return uploadedUrls; // Return array of URLs
	} catch (error) {
		console.error('Error uploading one or more images:', error);
		// Re-throw the error so the calling component can handle it
		throw error;
	}
};




/**
 * Uploads a single profile image file to Cloudinary.
 *
 * @param {File} profileImageFile - The profile image File object to upload.
 * @returns {Promise<string>} A promise that resolves with the Cloudinary secure URL of the uploaded image.
 * @throws {Error} If the upload fails, configuration is missing, or input is invalid.
 */
export const uploadProfileImageToCloudinary = async (profileImageFile) => {
	// TODO: Replace with Vite environment variables
// const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
// const PROFILE_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PROFILE_PRESET; // Use a specific preset for profiles
const CLOUD_NAME = "dnjjxgwpw"; // Replace with your actual Cloudinary cloud name
const PROFILE_UPLOAD_PRESET = "profile_pics_unsigned"; // Replace with your unsigned profile picture upload preset (can be same as gallery if desired)

if (!CLOUD_NAME || !PROFILE_UPLOAD_PRESET) {
	console.error(
		'Cloudinary configuration (cloud name or profile upload preset) is missing.'
	);
	throw new Error(
		'Cloudinary configuration missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_PROFILE_PRESET in your .env file.'
	);
}

	// Input validation
	if (!(profileImageFile instanceof File)) {
			console.error('Invalid input: profileImageFile must be a File object.');
			throw new Error('Invalid input: Expected a File object for profile image upload.');
	}

const formData = new FormData();
formData.append('file', profileImageFile);
formData.append('upload_preset', PROFILE_UPLOAD_PRESET); // Use the specific preset for profile pictures

const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

try {
	const response = await fetch(url, {
		method: 'POST',
		body: formData,
	});

	if (!response.ok) {
					// Try to get more specific error from Cloudinary response body
					const err = await response.json().catch(() => ({})); // Handle cases where response isn't valid JSON
					throw new Error(
							`Cloudinary profile upload failed: ${err?.error?.message || response.statusText}`
					);
	}

	const data = await response.json();

	if (!data.secure_url) {
		throw new Error('Cloudinary response missing secure_url for profile image.');
	}

	console.log('Profile image uploaded successfully:', data.secure_url);
	return data.secure_url; // Return the single URL string

} catch (error) {
	console.error('Error uploading profile image:', error);
	// Re-throw the error so the calling component can handle it
	throw error;
}
};







/**
 * Uploads an array of image files to Cloudinary.
 *
 * @param {File[]} files - An array of File objects to upload.
 * @returns {Promise<string[]>} A promise that resolves with an array of Cloudinary secure URLs.
 * @throws {Error} If any upload fails or configuration is missing.
 */
export const propertyImagesToCloudinary = async (files) => {
	const CLOUD_NAME = "dnjjxgwpw"; // Use Vite env variables
	const UPLOAD_PRESET = "property_uploads_unsigned"; // Use Vite env variables

	if (!CLOUD_NAME || !UPLOAD_PRESET) {
		console.error(
			'Cloudinary configuration (cloud name or upload preset) is missing in environment variables.'
		);
		throw new Error(
			'Cloudinary configuration missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.'
		);
	}

	const uploadPromises = files.map((file) => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', UPLOAD_PRESET); // Use an UNSIGNED preset for client-side uploads

		const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

		return fetch(url, {
			method: 'POST',
			body: formData,
		})
			.then((response) => {
				if (!response.ok) {
					return response.json().then((err) => {
						throw new Error(
							`Cloudinary upload failed: ${err.error.message || response.statusText}`
						);
					});
				}
				return response.json();
			})
			.then((data) => {
				if (!data.secure_url) {
					throw new Error('Cloudinary response missing secure_url.');
				}
				return data.secure_url; // Return the secure URL
			});
	});

	try {
		// Wait for all uploads to complete
		const uploadedUrls = await Promise.all(uploadPromises);
		console.log('All images uploaded successfully:', uploadedUrls);
		return uploadedUrls; // Return array of URLs
	} catch (error) {
		console.error('Error uploading one or more images:', error);
		// Re-throw the error so the calling component can handle it
		throw error;
	}
};








/**
 * Uploads an array of image files to Cloudinary.
 *
 * @param {File[]} files - An array of File objects to upload.
 * @returns {Promise<string[]>} A promise that resolves with an array of Cloudinary secure URLs.
 * @throws {Error} If any upload fails or configuration is missing.
 */
export const propertyFloorPlanToCloudinary = async (files) => {
	const CLOUD_NAME = "dnjjxgwpw"; // Use Vite env variables
	const UPLOAD_PRESET = "property_floorplan_unsigned"; // Use Vite env variables

	if (!CLOUD_NAME || !UPLOAD_PRESET) {
		console.error(
			'Cloudinary configuration (cloud name or upload preset) is missing in environment variables.'
		);
		throw new Error(
			'Cloudinary configuration missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.'
		);
	}

	const uploadPromises = files.map((file) => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', UPLOAD_PRESET); // Use an UNSIGNED preset for client-side uploads

		const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

		return fetch(url, {
			method: 'POST',
			body: formData,
		})
			.then((response) => {
				if (!response.ok) {
					return response.json().then((err) => {
						throw new Error(
							`Cloudinary upload failed: ${err.error.message || response.statusText}`
						);
					});
				}
				return response.json();
			})
			.then((data) => {
				if (!data.secure_url) {
					throw new Error('Cloudinary response missing secure_url.');
				}
				return data.secure_url; // Return the secure URL
			});
	});

	try {
		// Wait for all uploads to complete
		const uploadedUrls = await Promise.all(uploadPromises);
		console.log('All images uploaded successfully:', uploadedUrls);
		return uploadedUrls; // Return array of URLs
	} catch (error) {
		console.error('Error uploading one or more images:', error);
		// Re-throw the error so the calling component can handle it
		throw error;
	}
};





/**
 * Uploads an array of document files (e.g., .doc, .docx, .pdf) to Cloudinary.
 *
 * @param {File[]} files - An array of File objects to upload.
 * @returns {Promise<string[]>} A promise that resolves with an array of Cloudinary secure URLs.
 * @throws {Error} If any upload fails or configuration is missing.
 */
export const contractToCloudenery = async (files) => {
	const CLOUD_NAME = "dnjjxgwpw"; // Use Vite env variables
	const UPLOAD_PRESET = "upload-pdf"; // Use Vite env variables

	if (!CLOUD_NAME || !UPLOAD_PRESET) {
		console.error(
			'Cloudinary configuration (cloud name or upload preset) is missing in environment variables.'
		);
		throw new Error(
			'Cloudinary configuration missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.'
		);
	}

	const uploadPromises = files.map((file) => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', UPLOAD_PRESET); // Use an UNSIGNED preset for client-side uploads
		formData.append('resource_type', 'raw'); // Set resource type to 'raw' for non-image files

		const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

		return fetch(url, {
			method: 'POST',
			body: formData,
		})
			.then((response) => {
				if (!response.ok) {
					return response.json().then((err) => {
						throw new Error(
							`Cloudinary upload failed: ${err.error.message || response.statusText}`
						);
					});
				}
				return response.json();
			})
			.then((data) => {
				if (!data.secure_url) {
					throw new Error('Cloudinary response missing secure_url.');
				}
				return data.secure_url; // Return the secure URL
			});
	});

	try {
		// Wait for all uploads to complete
		const uploadedUrls = await Promise.all(uploadPromises);
		console.log('All files uploaded successfully:', uploadedUrls);
		return uploadedUrls; // Return array of URLs
	} catch (error) {
		console.error('Error uploading one or more files:', error);
		// Re-throw the error so the calling component can handle it
		throw error;
	}
};



/**
 * Uploads a single document file (e.g., .doc, .docx, .pdf) to Cloudinary.
 *
 * Make sure you have VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET
 * defined in your .env file (e.g., .env.local).
 * The upload preset MUST be configured as UNSIGNED in your Cloudinary settings
 * for client-side uploads to work without exposing secrets.
 *
 * @param {File} file - The File object to upload.
 * @returns {Promise<string>} A promise that resolves with the Cloudinary secure URL for the uploaded file.
 * @throws {Error} If configuration is missing or the upload fails.
 */
export const uploadSingleContractToCloudinary = async (file) => {
	// 1. Use Vite environment variables correctly
	const CLOUD_NAME = "dnjjxgwpw";
	const UPLOAD_PRESET = "als-upload";

	// Validate configuration
	if (!CLOUD_NAME || !UPLOAD_PRESET) {
			const errorMsg =
					'Cloudinary configuration missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.';
			console.error(errorMsg);
			// Provide more specific feedback if needed
			if (!CLOUD_NAME) console.error('VITE_CLOUDINARY_CLOUD_NAME is missing.');
			if (!UPLOAD_PRESET) console.error('VITE_CLOUDINARY_UPLOAD_PRESET is missing.');
			throw new Error(errorMsg);
	}

	// Validate input
	if (!file || !(file instanceof File)) {
			 throw new Error('Invalid input: A single File object is required.');
	}

	console.log(`Uploading to Cloudinary cloud: ${CLOUD_NAME} using preset: ${UPLOAD_PRESET}`);

	const formData = new FormData();
	formData.append('file', file);
	formData.append('upload_preset', UPLOAD_PRESET);
	// formData.append('cloud_name', CLOUD_NAME)
	// formData.append('resource_type', 'auto'); 

	// Optional: Add folder or tags
	// formData.append('folder', 'contracts');
	// formData.append('tags', 'contract, document');

	const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`;

	console.log(`Uploading file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);

	try {
			const response = await fetch(url, {
					method: 'POST',
					body: formData,
			});

			if (!response.ok) {
					let errorDetails = `HTTP status ${response.status}: ${response.statusText}`;
					try {
							const err = await response.json();
							if (err && err.error && err.error.message) {
									errorDetails = err.error.message;
							}
					} catch (e) {
							console.warn("Could not parse error response body as JSON.");
					}
					throw new Error(
							`Cloudinary upload failed for ${file.name}: ${errorDetails}`
					);
			}

			const data = await response.json();

			if (!data.secure_url) {
					console.error('Cloudinary response missing secure_url. Full response:', data);
					throw new Error(`Cloudinary upload succeeded for ${file.name}, but response missing secure_url.`);
			}

			console.log(`Successfully uploaded ${file.name}: ${data.secure_url}`);
			return data.secure_url; // Return the single secure URL string

	} catch (error) {
			// Catch fetch errors (network issues) or errors thrown above
			console.error(`Error uploading file ${file.name} to Cloudinary:`, error.message || error);
			// Re-throw the error so the calling component knows something went wrong
			throw error;
	}
};



// These should ideally come from environment variables, but using constants for now
const CLOUD_NAME = "dnjjxgwpw";
const UPLOAD_PRESET = "upload-pdf"; // Make sure this is an UNSIGNED preset in your Cloudinary settings for client-side uploads

/**
 * Uploads a single file to Cloudinary using the Fetch API.
 * Assumes an unsigned upload preset is configured in Cloudinary.
 *
 * @param {File} file - The file object to upload.
 * @returns {Promise<string>} A promise that resolves with the secure HTTPS URL of the uploaded file.
 * @throws {Error} If the upload fails or no secure_url is returned.
 */
export const uploadSingleContractToCloudinary0000 = async (file) => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  // Use the browser's FormData API to build the request body
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  // You can add other upload parameters here if needed, e.g., tags, folder
  // formData.append('folder', 'signed_contracts');

  // Construct the Cloudinary upload URL
  // Using 'auto' for resource_type lets Cloudinary detect if it's image, video, or raw
  const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

  try {
    const response = await fetch(cloudinaryUploadUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      // Cloudinary often provides error details in the response body
      console.error("Cloudinary Upload Error Response:", data);
      throw new Error(data.error?.message || `Cloudinary upload failed with status ${response.status}`);
    }

    // Check if the expected URL is in the response
    if (data.secure_url) {
      console.log('File uploaded successfully to Cloudinary:', data.secure_url);
      return data.secure_url; // Return the HTTPS URL
    } else {
      console.error("Cloudinary response missing 'secure_url':", data);
      throw new Error('Cloudinary upload succeeded but did not return a secure URL.');
    }
  } catch (error) {
    console.error('Error during Cloudinary upload:', error);
    // Re-throw the error to be caught by the calling function (handleSubmit)
    throw error;
  }
};



export const uploadSingleContractToCloudinary1122 = async (pdfFile, cloudName, uploadPreset) => {
  try {
    // Validate input
    if (!pdfFile || pdfFile.type !== 'application/pdf') {
      throw new Error('Invalid PDF file provided');
    }

    // Create form data to send
    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('upload_preset', uploadPreset);
    formData.append('resource_type', 'auto'); // Auto-detect resource type (will recognize PDF)

    // Cloudinary upload endpoint
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

    // Make the upload request
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload PDF to Cloudinary');
    }

    const data = await response.json();
    
    // Return the secure URL of the uploaded PDF
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading PDF to Cloudinary:', error);
    throw error; // Re-throw to allow caller to handle
  }
};