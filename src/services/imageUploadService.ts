const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

export interface ImgBBResponse {
    data: {
        id: string;
        title: string;
        url_viewer: string;
        url: string;
        display_url: string;
        width: string;
        height: string;
        size: string;
        time: string;
        expiration: string;
        image: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        thumb: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        medium: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        delete_url: string;
    };
    success: boolean;
    status: number;
}

export const uploadImageToImgBB = async (file: File, userName?: string): Promise<string> => {
    try {
        // Convert file to base64
        const base64 = await fileToBase64(file);
        
        // Create form data
        const formData = new FormData();
        formData.append('image', base64);
        formData.append('key', IMGBB_API_KEY);
        
        // Add user name to organize images
        if (userName) {
            // Clean the username for use as filename
            const cleanUserName = userName.replace(/[^a-zA-Z0-9]/g, '_');
            const timestamp = Date.now();
            const fileName = `ExecutiveMember_${cleanUserName}_${timestamp}`;
            formData.append('name', fileName);
        }
        
        // Make API request
        const response = await fetch(IMGBB_API_URL, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ImgBBResponse = await response.json();
        
        if (!result.success) {
            throw new Error('Image upload failed');
        }
        
        // Return the image URL
        return result.data.url;
        
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image. Please try again.');
    }
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                // Remove the data:image/...;base64, prefix
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            } else {
                reject(new Error('Failed to convert file to base64'));
            }
        };
        reader.onerror = error => reject(error);
    });
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    if (!file.type.startsWith('image/')) {
        return { isValid: false, error: 'Please select a valid image file.' };
    }
    
    // Check file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
        return { isValid: false, error: 'Image size should be less than 2MB.' };
    }
    
    return { isValid: true };
}; 