import { base44 } from '@/api/base44Client';

export const InvokeLLM = async ({ prompt, response_json_schema }) => {
  return await base44.integrations.Core.InvokeLLM({ prompt, response_json_schema });
};

export const SendEmail = async (data) => {
  return await base44.integrations.Core.SendEmail(data);
};

export const UploadFile = async (data) => {
  return await base44.integrations.Core.UploadFile(data);
};

export const GenerateImage = async (data) => {
  return await base44.integrations.Core.GenerateImage(data);
};

export const ExtractDataFromUploadedFile = async (data) => {
  return await base44.integrations.Core.ExtractDataFromUploadedFile(data);
};