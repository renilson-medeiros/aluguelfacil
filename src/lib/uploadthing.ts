import { type UploadFile } from "uploadthing/client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api/uploadthing";

export async function uploadPropertyImages(files: File[]): Promise<string[]> {
  if (!files.length) return [];

  const formData = new FormData();
  files.forEach(file => formData.append("file", file));

  const response = await fetch(`${API_URL}/propertyImages`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erro ao enviar arquivos: ${text}`);
  }

  const data: { url: string }[] = await response.json();
  return data.map(item => item.url);
}

export type UploadedFile = {
  file: UploadFile;
  url: string;
};
