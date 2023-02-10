/* eslint-disable spaced-comment */
import { DateHelpers } from "@jamalsoueidan/bsb.helpers.date";
import {
  NotifcationServiceSendBookingUpdateCustomer,
  NotificationServiceCancelAll,
  NotificationServiceSendBookingConfirmationCustomer,
  NotificationServiceSendBookingReminderCustomer,
  NotificationServiceSendBookingReminderStaff,
} from "@jamalsoueidan/bsb.services.notification";
import { ProductModel } from "@jamalsoueidan/bsb.services.product";
import {
  BookingServiceCreateProps,
  BookingServiceFindProps,
  BookingServiceGetAllProps,
  BookingServiceGetByIdProps,
  BookingServiceUpdateBodyProps,
  BookingServiceUpdateQueryProps,
  ShopQuery,
} from "@jamalsoueidan/bsb.types";
import mongoose from "mongoose";
import { BookingModel } from "./booking.model";

export const BookingServiceCreate = async (
  body: BookingServiceCreateProps & ShopQuery,
) => {
  const product = await ProductModel.findOne({
    productId: body.productId,
  }).lean();

  if (product) {
    const booking = await BookingModel.create({
      ...body,
      fulfillmentStatus: "booked",
      isSelfBooked: true,
      lineItemId: Date.now() + Math.floor(100000 + Math.random() * 900000),
      lineItemTotal: 1,
      orderId: Date.now() + Math.floor(100000 + Math.random() * 900000),
      title: product.title,
    });

    await NotificationServiceSendBookingConfirmationCustomer({
      booking,
      shop: body.shop,
    });

    await NotificationServiceSendBookingReminderStaff({
      bookings: [booking],
      shop: body.shop,
    });

    await NotificationServiceSendBookingReminderCustomer({
      bookings: [booking],
      shop: body.shop,
    });

    return booking;
  }
  throw new Error("no product found");
};

export const BookingServiceFind = async (shop: BookingServiceFindProps) =>
  BookingModel.find({ shop });

export const BookingServiceGetAll = ({
  shop,
  start,
  end,
  staff,
}: BookingServiceGetAllProps & ShopQuery) =>
  BookingModel.aggregate([
    {
      $match: {
        end: {
          $lt: DateHelpers.closeOfDay(end),
        },
        shop,
        start: {
          $gte: DateHelpers.beginningOfDay(start),
        },
        ...(staff && { staff: new mongoose.Types.ObjectId(staff) }),
      },
    },
  ]);

export const BookingServiceUpdate = async (
  query: BookingServiceUpdateQueryProps & ShopQuery,
  body: BookingServiceUpdateBodyProps,
) => {
  const booking = await BookingModel.findOne(query);
  if (!booking) {
    throw new Error("Not found");
  }
  booking.staff = new mongoose.Types.ObjectId(body.staff);
  booking.start = new Date(body.start);
  booking.end = new Date(body.end);
  booking.isEdit = true;

  const { shop } = query;

  await NotificationServiceCancelAll({
    lineItemId: booking.lineItemId,
    orderId: booking.orderId,
    shop,
  });

  await NotifcationServiceSendBookingUpdateCustomer({
    booking,
    shop,
  });

  await NotificationServiceSendBookingReminderStaff({
    bookings: [booking],
    shop,
  });

  await NotificationServiceSendBookingReminderCustomer({
    bookings: [booking],
    shop,
  });

  return booking.save();
};

export const BookingServiceGetById = async ({
  shop,
  _id,
}: BookingServiceGetByIdProps & ShopQuery) => {
  const bookings = await BookingModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(_id),
        shop,
      },
    },
  ]);

  return bookings.length > 0 ? bookings[0] : null;
};
