import { uploadFile } from "actions/editor/upload-file";
import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";

const onUpload = async (file: File) => {
  const formData = new FormData();
  formData.set("file", file);
  const res = await uploadFile(formData);

  if (!res.success) {
    toast.error(res.error);
    throw new Error(res.error);
  }
  return res.url;
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    } else if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});
