export interface Warranty {
  id: number;
  warrantyName: string;
  displayOrder: number;
  isActive: boolean;
}

export interface WarrantyCreateOrUpdateCommand {
  id: number;
  warrantyName: string;
  displayOrder: number;
  isActive: boolean;
}

export interface WarrantyFormDescription {
  id: number;
  name: string;
}

export interface WarrantyViewModel {
  warrantys: Warranty[];
  form: WarrantyFormDescription[];
}
