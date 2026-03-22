import { base44 } from '@/api/base44Client';

export const InvokeLLM = async ({ prompt, response_json_schema }) => {
  return await base44.functions.invoke("InvokeLLM", { prompt, response_json_schema });
};

export const SendEmail = async (data) => {
  return await base44.functions.invoke("SendEmail", data);
};

export const UploadFile = async (data) => {
  return await base44.functions.invoke("UploadFile", data);
};

export const GenerateImage = async (data) => {
  return await base44.functions.invoke("GenerateImage", data);
};

export const ExtractDataFromUploadedFile = async (data) => {
  return await base44.functions.invoke("ExtractDataFromUploadedFile", data);
};