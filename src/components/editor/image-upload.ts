import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";


const onUpload = async(file: File) => {
  
  const formData = new FormData();
  formData.append('image', file);

  return new Promise(async(resolve, reject) => {

    try {
      const response = await fetch("/api/images", {
        method: "POST",
        body: formData
      });

      if (response.status === 200) {
        const { imageUrl } = (await response.json()) as { imageUrl: string };
        // preload the image
        const image = new Image();
        image.src = imageUrl;
        image.onload = () => {
          console.log('Image uploaded successfully');
          resolve(imageUrl);
        };
      }
      else if (response.status === 401) {
        console.log('Reading image locally');
        resolve(file);
      } 
      else {
        throw new Error("Error uploading image. Please try again.");
      } 

    } catch (error) {
      console.error('Upload failed:', error);
      reject(error);
    }

  });
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    }
    if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});
