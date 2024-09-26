import { v2 as cloudinary } from 'cloudinary';


export async function uploadCloudinary(filePath: string) {
    cloudinary.config({
        cloud_name: "dynme1dqd",
        api_key: "253413868896945",
        api_secret: "UkxD5R78OOQTQFBuKq3ar4cwyV4"
    });

    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'CRUD_angular',
            
        });
        console.log(result);
        
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Failed to upload image');
    }
}
