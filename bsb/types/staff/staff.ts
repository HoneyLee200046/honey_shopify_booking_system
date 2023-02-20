export enum StaffUserRole {
  "owner" = 1,
  "admin" = 3,
  "user" = 99,
}

export const StaffUserRoleKeys = Object.keys(StaffUserRole).reduce(
  (acc: number[], curr, index, arr) => {
    if (index < arr.length / 2) acc.push(parseInt(curr, 10));
    return acc;
  },
  [],
);

export interface StaffUser {
  password: string;
  language: string;
  timeZone: string;
  role: StaffUserRole;
}

export interface Staff {
  _id: string;
  shop: string;
  fullname: string;
  email: string;
  phone: string;
  active: boolean;
  avatar: string;
  position: string;
  postal: number;
  address: string;
  group: string;
  user?: StaffUser;
}

export interface StaffBodyUpdate extends Partial<Omit<Staff, "_id" | "shop">> {}
export interface StaffBodyCreate extends Omit<Staff, "_id" | "shop"> {}

export interface StaffUserReceivePasswordBodyRequest {
  phone: string;
}

export interface StaffUserReceivePasswordResponse {
  message: string;
}

export interface StaffUserLoginBodyRequest {
  identification: string;
  password: string;
}

export interface StaffUserLoginResponse {
  token: string;
}

export interface StaffUserSettingsResponse {
  language: string;
  timeZone: string;
}

export interface StaffUserSettingsUpdateBodyRequest
  extends Omit<StaffUserSettingsResponse, "_id"> {}
