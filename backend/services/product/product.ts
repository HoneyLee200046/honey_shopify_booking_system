import { ScheduleModel } from "@jamalsoueidan/backend.services.schedule";
import { ShopQuery } from "@jamalsoueidan/backend.types.api";
import {
  ProductServiceGetAllProps,
  ProductServiceGetAvailableStaffProps,
  ProductServiceGetAvailableStaffReturn,
  ProductServiceGetByIdProps,
  ProductServiceUpdateBodyProps,
  ProductServiceUpdateQueryProps,
  ProductServiceUpdateReturn,
} from "@jamalsoueidan/backend.types.product";
import { startOfDay } from "date-fns";
import mongoose, { PipelineStage } from "mongoose";
import { ProductModel } from "./product.model";

export const ProductServiceGetAll = async ({
  staff,
  group,
  shop,
}: ProductServiceGetAllProps & ShopQuery) => {
  const pipeline: PipelineStage[] = [
    {
      $match: {
        shop,
      },
    },
    {
      $unwind: { path: "$staff", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        as: "staff.staff",
        foreignField: "_id",
        from: "Staff",
        localField: "staff.staff",
      },
    },
    {
      $unwind: {
        path: "$staff.staff",
      },
    },
    {
      $addFields: {
        "staff.staff.tag": "$staff.tag",
      },
    },
    {
      $addFields: {
        staff: "$staff.staff",
      },
    },
    { $sort: { "staff.fullname": 1 } },
    {
      $project: {
        "staff.address": 0,
        "staff.email": 0,
        "staff.language": 0,
        "staff.password": 0,
        "staff.timeZone": 0,
      },
    },
  ];

  if (staff) {
    pipeline.push({
      $match: {
        "staff._id": new mongoose.Types.ObjectId(staff),
      },
    });
  }

  if (group) {
    pipeline.push({
      $match: {
        "staff.group": group,
      },
    });
  }

  pipeline.push(
    {
      $group: {
        _id: "$_id",
        product: { $first: "$$ROOT" },
        staff: { $push: "$staff" },
      },
    },
    {
      $addFields: {
        "product.staff": "$staff",
      },
    },
    { $replaceRoot: { newRoot: "$product" } },
  );

  return ProductModel.aggregate(pipeline);
};

export const ProductServiceGetById = async ({
  id,
  group,
  shop,
}: ProductServiceGetByIdProps & ShopQuery) => {
  const product = await ProductModel.findOne({
    _id: new mongoose.Types.ObjectId(id),
    shop,
    "staff.0": { $exists: false }, // if product contains zero staff, then just return the product, no need for aggreation
  });

  if (product) {
    return product;
  }

  const pipeline: PipelineStage[] = [
    {
      $match: { _id: new mongoose.Types.ObjectId(id), shop },
    },
    {
      $unwind: { path: "$staff", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        as: "staff.staff",
        foreignField: "_id",
        from: "Staff",
        localField: "staff.staff",
      },
    },
    {
      $unwind: {
        path: "$staff.staff",
      },
    },
    {
      $addFields: {
        "staff.staff.tag": "$staff.tag",
      },
    },
    {
      $addFields: {
        staff: "$staff.staff",
      },
    },
    { $sort: { "staff.fullname": 1 } },
    {
      $project: {
        "staff.address": 0,
        "staff.email": 0,
        "staff.language": 0,
        "staff.password": 0,
        "staff.timeZone": 0,
      },
    },
  ];

  if (group) {
    pipeline.push({
      $match: {
        "staff.group": group,
      },
    });
  }

  pipeline.push(
    {
      $group: {
        _id: "$_id",
        product: { $first: "$$ROOT" },
        staff: { $push: "$staff" },
      },
    },
    {
      $addFields: {
        "product.staff": "$staff",
      },
    },
    { $replaceRoot: { newRoot: "$product" } },
  );

  const products = await ProductModel.aggregate(pipeline);

  return products.length > 0 ? products[0] : null;
};

export const ProductServiceUpdate = async (
  query: ProductServiceUpdateQueryProps & ShopQuery,
  body: ProductServiceUpdateBodyProps,
): Promise<ProductServiceUpdateReturn> => {
  const { staff, ...properties } = body;

  const newStaffier =
    staff?.map((s) => ({
      staff: s._id,
      tag: s.tag,
    })) || [];

  // turn active ON=true first time customer add staff to product
  const product = await ProductModel.findById(
    new mongoose.Types.ObjectId(query.id),
  ).lean();

  let { active } = properties;
  if (product?.staff.length === 0 && newStaffier.length > 0) {
    active = true;
  }
  if (newStaffier.length === 0) {
    active = false;
  }

  return ProductModel.updateOne(
    {
      _id: new mongoose.Types.ObjectId(query.id),
      shop: query.shop,
    },
    {
      $set: { ...properties, active, staff: newStaffier },
    },
    {
      new: true,
    },
  );
};

// @description return all staff that don't belong yet to the product
export const ProductServiceGetAvailableStaff = ({
  shop,
  group,
}: ProductServiceGetAvailableStaffProps & ShopQuery) => {
  const pipeline: PipelineStage[] = [
    {
      $match: {
        shop,
        start: {
          $gte: startOfDay(new Date()),
        },
      },
    },
    {
      $group: {
        _id: {
          staff: "$staff",
          tag: "$tag",
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ staff: "$_id.staff", tag: "$_id.tag" }],
        },
      },
    },
    {
      $group: {
        _id: "$staff",
        tags: { $push: "$tag" },
      },
    },
    {
      $project: {
        _id: "$_id",
        tags: "$tags",
      },
    },
    {
      $lookup: {
        as: "staffs",
        foreignField: "_id",
        from: "Staff",
        localField: "_id",
      },
    },
    {
      $unwind: "$staffs", // explode array
    },
    {
      $addFields: {
        "staffs.tags": "$tags",
      },
    },
    {
      $replaceRoot: {
        newRoot: "$staffs",
      },
    },
    { $sort: { fullname: 1 } },
    {
      $project: {
        address: 0,
        email: 0,
        language: 0,
        password: 0,
        timeZone: 0,
      },
    },
  ];

  if (group) {
    pipeline.push({
      $match: {
        group,
      },
    });
  }

  return ScheduleModel.aggregate<ProductServiceGetAvailableStaffReturn>(
    pipeline,
  );
};
