import axios from 'axios';

const generateImageURL = async (image) => {
  try {
    // Validate input
    if (!image) {
      throw new Error('No image provided');
    }

    // Validate environment variables
    const cloudName = import.meta.env.VITE_CLOUDINARY_ENV;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;
    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary configuration missing: VITE_CLOUDINARY_ENV or VITE_CLOUDINARY_PRESET not set');
    }

    // Create FormData for upload
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', uploadPreset);

    // Log for debugging
    console.log('Uploading to Cloudinary:', {
      cloudName,
      uploadPreset,
      fileName: image.name,
      fileType: image.type,
      fileSize: image.size,
    });

    // Make the upload request
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    // Return the secure URL in the expected format
    return { url: response.data.secure_url };
  } catch (error) {
    console.error('generateImageURL error:', {
      message: error.message,
      stack: error.stack,
    });
    throw error; // Rethrow to be caught in Register.jsx
  }
};

export default generateImageURL;