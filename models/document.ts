import { FileProperties } from "./common";

export interface Document {
  documentId: string;
  merchantId: number;
  name: string;
  typeOfBusinessModel: number;
  license: LicenseDocument[];
  isDeleted: boolean;
  createdAt: string;
  verion: number;
}

export interface LicenseDocument {
  typeOfDocument: number;
  isRequire: boolean;
  files: FileProperties[];
  totalFile: number;
}

export interface DocumentRequest {
  name: string;
  license: LicenseDocument[];
  typeOfBusinessModel: number;
}
