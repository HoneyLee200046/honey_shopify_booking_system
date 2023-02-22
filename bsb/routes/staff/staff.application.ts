/* eslint-disable no-param-reassign */
import { AppControllerProps } from "@jamalsoueidan/bsb.types.api";
import {
  StaffBodyCreate,
  StaffBodyUpdate,
  StaffRole,
  StaffServiceGetAllProps,
  StaffServiceGetStaffByIdQuery,
} from "@jamalsoueidan/bsb.types.staff";

export const getAllStaffApp = ({
  query,
  session,
}: AppControllerProps<StaffServiceGetAllProps>) => {
  if (session.role > StaffRole.owner) {
    query.group = session.group;
  }
};

export const createStaffApp = ({
  body,
  session,
}: AppControllerProps<never, Partial<StaffBodyCreate>>) => {
  if (session.isAdmin) {
    if (body.group !== session.group) {
      throw { access: "not allowed to create user in another group" };
    }
    // can only create user role staff
    body.role = StaffRole.user;
  }
};

export const getStaffByIdApp = ({
  query,
  session,
}: AppControllerProps<StaffServiceGetStaffByIdQuery>) => {
  if (session.role > StaffRole.owner) {
    query.group = session.group;
  }
};

export const updateStaffApp = ({
  body,
  session,
}: AppControllerProps<never, StaffBodyUpdate>) => {
  if (session.isAdmin) {
    if (body.group !== session.group) {
      throw { access: "not allowed to move user in another group" };
    }

    // can only create user role staff
    body.role = StaffRole.user;
  }
};
