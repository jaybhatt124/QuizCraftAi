import { base44 } from '@/api/base44Client';

export const InvokeLLM = async ({ prompt, response_json_schema }) => {
  return await base44.functions.InvokeLLM({ prompt, response_json_schema });
};

export const SendEmail = async ({ to, subject, body }) => {
  return await base44.functions.SendEmail({ to, subject, body });
};

export const UploadFile = async ({ file }) => {
  return await base44.functions.UploadFile({ file });
};

export const GenerateImage = async ({ prompt }) => {
  return await base44.functions.GenerateImage({ prompt });
};

export const ExtractDataFromUploadedFile = async ({ file_url }) => {
  return await base44.functions.ExtractDataFromUploadedFile({ file_url });
};