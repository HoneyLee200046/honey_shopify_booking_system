import { StaffRole } from "@jamalsoueidan/bsb.types.staff";
import { Tag } from "@jamalsoueidan/bsb.types.tag";
import {
  createAppExpress,
  createShopifyExpress,
} from "@jamalsoueidan/bsd.testing-library.express";
import { createStaff } from "@jamalsoueidan/bsd.testing-library.mongodb";
import { addDays, addMonths, setHours } from "date-fns";
import { scheduleRouteCreateGroup } from "../schedule.routes";

require("@jamalsoueidan/bsd.testing-library.mongodb/mongodb.jest");

const group = "a";
const tag = Tag.all_day;
const date = setHours(new Date(), 10);
const start = date.toJSON();
const end = addMonths(setHours(date, 16), 1).toJSON();

describe("Shopify: schedule create group route test", () => {
  it("Should be able to create group for all users", async () => {
    const staff = await createStaff();

    const request = createShopifyExpress(scheduleRouteCreateGroup);
    const res = await request
      .post(`/schedules/group?staff=${staff.id}`)
      .send({
        days: [new Date(), addDays(new Date(), 1).toJSON()],
        end,
        start,
        tag,
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.payload.length).toBe(9);
  });

  it("Should NOT be able to create group with invalid date", async () => {
    const staff = await createStaff();

    const request = createShopifyExpress(scheduleRouteCreateGroup);
    const res = await request
      .post(`/schedules/group?staff=${staff.id}`)
      .send({
        days: [],
        end: "",
        start: "",
        tag,
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBeFalsy();
    expect(res.body.error.days).toBeDefined();
    expect(res.body.error.start).toBeDefined();
    expect(res.body.error.end).toBeDefined();
  });
});

describe("Application: schedule create group route test", () => {
  it("User: Should able to create group for himself", async () => {
    const loggedInStaff = await createStaff({
      group,
      role: StaffRole.user,
    });

    const request = createAppExpress(scheduleRouteCreateGroup, loggedInStaff);
    const res = await request
      .post(`/schedules/group?staff=${loggedInStaff.id}`)
      .send({
        days: [new Date(), addDays(new Date(), 1).toJSON()],
        end,
        start,
        tag,
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.payload.length).toBeGreaterThan(1);
  });

  it("User: Should not able to create group for other", async () => {
    const loggedInStaff = await createStaff({
      group,
      role: StaffRole.user,
    });

    const staff = await createStaff({
      group,
      role: StaffRole.user,
    });

    const request = createAppExpress(scheduleRouteCreateGroup, loggedInStaff);
    const res = await request
      .post(`/schedules/group?staff=${staff.id}`)
      .send({
        days: [new Date(), addDays(new Date(), 1).toJSON()],
        end,
        start,
        tag,
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBeFalsy();
  });

  it("Admin: Should be able to create group for staff in the same group", async () => {
    const loggedInStaff = await createStaff({
      group,
      role: StaffRole.admin,
    });

    const staff = await createStaff({
      group,
      role: StaffRole.user,
    });

    const request = createAppExpress(scheduleRouteCreateGroup, loggedInStaff);
    const res = await request
      .post(`/schedules/group?staff=${staff.id}`)
      .send({
        days: [new Date(), addDays(new Date(), 1).toJSON()],
        end,
        start,
        tag,
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.payload.length).toBeGreaterThan(1);
  });

  it("Admin: Should NOT be able to create group staff in other group", async () => {
    const loggedInStaff = await createStaff({
      group,
      role: StaffRole.admin,
    });

    const staff = await createStaff({
      group: "b",
      role: StaffRole.user,
    });

    const request = createAppExpress(scheduleRouteCreateGroup, loggedInStaff);
    const res = await request
      .post(`/schedules/group?staff=${staff.id}`)
      .send({
        days: [new Date(), addDays(new Date(), 1).toJSON()],
        end,
        start,
        tag,
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBeFalsy();
  });
});
