import { base44 } from '@/api/base44Client';

export const InvokeLLM = (data) => base44.integrations.Core.InvokeLLM(data);
export const SendEmail = (data) => base44.integrations.Core.SendEmail(data);
export const UploadFile = (data) => base44.integrations.Core.UploadFile(data);
export const GenerateImage = (data) => base44.integrations.Core.GenerateImage(data);
export const ExtractDataFromUploadedFile = (data) => base44.integrations.Core.ExtractDataFromUploadedFile(data);