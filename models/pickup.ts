import { AvatarImageModel,GeoLocation } from "./common";

export interface PickupRequest {
  name: string;
  code: string;
  address: string;
  provinceId: number;
  districtId: number;
  wardId: number;
  mobilePhone: string;
  avatarImage: AvatarImageModel;
  images: AvatarImageModel[];
  description: string;
  location: GeoLocation;
  openTime: number;
  closeTime: number;
  status: number;
}

export interface PickUpStore {
  pickUpStoreId: string;
  name: string;
  code: string;
  provinceId: number;
  districtId: number;
  wardId: number;
  address: string;
  province: string;
  district: string;
  ward: string;
  fullAddress: string;
  mobilePhone: string;
  avatarImage: AvatarImageModel;
  images: AvatarImageModel[];
  description: string;
  location: GeoLocation;
  openTime: number;
  closeTime: number;
  status: number;
  createdAt: string;
  version: number;
}
