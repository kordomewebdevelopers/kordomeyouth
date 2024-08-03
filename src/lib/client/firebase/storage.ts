import { blobToDataURL, toBlob } from "$helpers/image";
import { getBlob, getDownloadURL, uploadBytes } from "firebase/storage";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "./init";

type ErrorType = { status: "error"; message: string };
type SuccessType = { status: "success"; url: string };
type ResultType = ErrorType | SuccessType;

export const uploadToFB = async (
  file: string,
  folder: string,
  filename: string
) => {
  try {
    const blobFile = await toBlob(file);
    const storageRef = ref(storage, `${folder}/${filename}`);

    await uploadBytes(storageRef, blobFile);

    return {
      status: "success",
      url: await getDownloadURL(storageRef),
    } as ResultType;
  } catch (error: any) {
    return { status: "error", message: error.message } as ResultType;
  }
};

export const deleteFromFB = async (filename: string, folder: string) => {
  try {
    const storageRef = ref(storage, `${folder}/${filename}`);
    await deleteObject(storageRef);
    return "success";
  } catch {
    return "failure";
  }
};

export const downloadFromFB = async (filename: string, folder: string) => {
  const storageRef = ref(storage, `${folder}/${filename}`);

  const blob = await getBlob(storageRef);

  return await blobToDataURL(blob);
};
