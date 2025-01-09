import type { APIRoute } from "astro";
import { uploadToS3 } from "@/utils/storage/storage"; 

export const POST: APIRoute = async ({request}) => {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;
        // const organizationId = formData.get('organizationId')?.toString();
        // const userId = formData.get('userId')?.toString();
        const organizationId = '123';
        const userId = '123';

        // console.log(file);

        if (!organizationId || !userId) {
            return new Response(JSON.stringify({ error: 'Organization ID and User ID are required' }), {
                status: 400
            });
        }

        if (!file) {
             console.log(' no file');
        return new Response(JSON.stringify({ error: 'No image provided' }), {
            status: 400
        });
        }


        if (!file.type.startsWith('image/')) {
            console.log('invalid file type');
        return new Response(JSON.stringify({ error: 'Invalid file type. Must be an image.' }), {
            status: 400
        });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileExtension = file.name.split('.').pop();
        const fileName = `organizations/${organizationId}/blogImages-${Date.now()}.${fileExtension}`;

        const imageUrl = await uploadToS3(buffer, fileName, file.type);

        return new Response(
            JSON.stringify({
                success: true,
                imageUrl: imageUrl
            }),
            { 
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

    } catch (error) {
        console.error('Upload error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to upload image' }),
            { status: 500 }
        );
    }
};
