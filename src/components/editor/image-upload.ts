import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";


const onUpload = async(file: File) => {
  
  const formData = new FormData();
  formData.append('image', file);

  const promise = fetch("/api/images", {
    method: "POST",
    body: formData
  });

  return new Promise((resolve, reject) => {
    toast.promise(
      promise.then(async (res) => {
        // Successfully uploaded image
        if (res.status === 200) {
          const { imageUrl } = (await res.json()) as { imageUrl: string };
          // preload the image
          const image = new Image();
          image.src = imageUrl;
          image.onload = () => {
            resolve(imageUrl);
          };
          // No blob store configured
        } 
        else if (res.status === 401) {
          resolve(file);
          throw new Error("reading image locally instead.");
          // Unknown error
        } 
        else {
          throw new Error("Error uploading image. Please try again.");
        }
      }),
      {
        loading: "Uploading image...",
        success: "Image uploaded successfully.",
        error: (e) => {
          reject(e);
          return e.message;
        },
      },
    );
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
