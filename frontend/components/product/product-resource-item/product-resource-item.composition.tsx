import { withApplication } from "@jamalsoueidan/bit-dev.preview.with-application";
import React from "react";
import { ProductResourceItem } from "./product-resource-item";

const product = {
  _id: "63f3b154ec0ff414e3f386fd",
  active: true,
  buffertime: 0,
  collectionId: 425845817661,
  duration: 60,
  hidden: false,
  imageUrl: "",
  productId: 8006173360445,
  shop: "testeriphone.myshopify.com",
  staff: [
    {
      __v: 0,
      _id: "63f3a8e90a05d212213e8781",
      active: true,
      address: "ads",
      avatar:
        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000",
      email: "",
      fullname: "jamalsoueida",
      group: "all",
      phone: "4531317428",
      position: "2",
      postal: 8911,
      role: 99,
      shop: "testeriphone.myshopify.com",
    },
    {
      __v: 0,
      _id: "63fbf5944682b5cb96896844",
      active: true,
      address: "ads",
      avatar:
        "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000",
      email: "",
      fullname: "sara soueidan",
      group: "all",
      phone: "4531317427",
      position: "1",
      postal: 8020,
      role: 3,
      shop: "testeriphone.myshopify.com",
    },
  ],
  title: "Brudekonsultation",
};

export const BasicProductResourceItem = withApplication(() => (
  <ProductResourceItem product={product} />
));
