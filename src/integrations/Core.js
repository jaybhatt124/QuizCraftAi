import { base44 } from '@/api/base44Client';

export const InvokeLLM = async (data) => {
  const result = await base44.integrations.InvokeLLM(data);
  return result;
};

export const SendEmail = (data) => base44.integrations.SendEmail(data);
export const UploadFile = (data) => base44.integrations.UploadFile(data);
export const GenerateImage = (data) => base44.integrations.GenerateImage(data);
export const ExtractDataFromUploadedFile = (data) => base44.integrations.ExtractDataFromUploadedFile(data);