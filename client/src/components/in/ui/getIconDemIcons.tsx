/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileImage, FileText } from "lucide-react";

const imageTypes = ["jpg", "png"];
const textTypes = ["doc", "docx", "pdf"];
const excelTypes = ["xls", "xlsx"];

export const getIconForBase = (type: any) => {
  const t = type.toLowerCase();

  if (imageTypes.includes(t)) {
    return <FileImage className="w-5 h-5 text-blue-500" />;
  }

  if (excelTypes.includes(t)) {
    return <FileText className="w-5 h-5 text-green-500" />;
  }

  if (textTypes.includes(t)) {
    return <FileText className="w-5 h-5 text-red-500" />;
  }

  return <FileText className="w-5 h-5 text-gray-500" />;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getIconForQuote = (type: any) => {
  const t = type.toLowerCase();

  if (imageTypes.includes(t)) {
    return <FileImage className="w-5 h-5 text-blue-500" />;
  }

  return <FileText className="w-5 h-5 text-red-500" />;
};
