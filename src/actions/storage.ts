import { v4 } from "uuid";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";

function getStorage() {
  const { storage } = createBrowserSupabaseClient();
  return storage;
}

interface UploadFileProps {
  file: File;
  bucket: string;
  folder?: string;
}

export async function uploadFile({ file, bucket, folder }: UploadFileProps) {
  const fileName = file.name;
  const fileExtension = fileName.split(".").pop();
  const path = `${folder ? `${folder}/` : ""}${v4()}.${fileExtension}`;

  const { data, error } = await getStorage().from(bucket).upload(path, file);

  if (error) {
    throw error;
  }

  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${data?.path}`;

  return imageUrl;
}
