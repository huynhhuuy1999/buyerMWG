import { FileProperties } from "./common";

export interface ContractDeliveryRequest {
  fullName: string;
  mobilePhone: string;
  address: string;
  contractId: string;
}

export interface ContractRequest {
  name: string;
  contractNumber: string;
  contractFile: FileProperties;
  contractAccept: boolean;
  contractReason: string;
  appendixFile: FileProperties;
  appendixAccept: boolean;
  appendixReason: string;
  note: string;
}
