import { ProductServiceUpdate } from "@jamalsoueidan/bsb.services.product";
import {
  createSchedule,
  createStaff,
  shop,
} from "@jamalsoueidan/bsd.testing-library.mongodb";
import { addDays, addHours } from "date-fns";
import {
  CollectionServiceCreate,
  CollectionServiceDestroy,
  CollectionServiceGetAll,
} from "./collection";
import { GetCollectionProps } from "./collection.helper";
import mock from "./collection.mock";

require("@jamalsoueidan/bsd.testing-library.mongodb/mongodb.jest");

jest.mock("./collection.helper", () => ({
  getCollection: ({ id }: GetCollectionProps) => {
    const mock = require("./collection.mock").default;
    const collection = mock.find((c) => c.id === id);
    return Promise.resolve(collection);
  },
  __esModule: true,
}));

describe("collection testing", () => {
  it("Should be able create collections", async () => {
    const id = "gid://shopify/Collection/425845817661";
    await CollectionServiceCreate({ session: { shop } } as any, {
      selections: [id],
    });

    const collection = mock.find((c) => c.id === id);
    const collections = await CollectionServiceGetAll();

    expect(collections.length).toEqual(1);
    expect(collections[0].title).toEqual(collection?.title);
    expect(collections[0].products.length).toEqual(2);
  });

  it("Should be able to get collections with product => staff relations", async () => {
    await CollectionServiceCreate({ session: { shop } } as any, {
      selections: [
        "gid://shopify/Collection/425845817661",
        "gid://shopify/Collection/425290039613",
      ],
    });

    let collections = await CollectionServiceGetAll();
    let collection = collections.find((c) => c.collectionId === 425845817661);

    expect(collection?.products.length).toEqual(2);
    expect(collection?.products[0].active).toBeFalsy();

    if (collection?.products[0]) {
      const staff = await createStaff();
      const start = addDays(new Date(), 1);

      await createSchedule({
        end: addHours(start, 5),
        staff: staff._id,
        start,
        tag: "test",
      });

      await ProductServiceUpdate(
        { id: collection?.products[0]._id, shop },
        {
          staff: [{ _id: staff._id, tag: "test" }],
        },
      );
    }

    collections = await CollectionServiceGetAll();
    collection = collections.find((c) => c.collectionId === 425845817661);

    expect(collection?.products.length).toEqual(2);
    const product = collection?.products[0];
    expect(product?.staff.length).toBe(1);
    expect(product?.staff[0].avatar).not.toBeNull();
    expect(product?.staff[0].fullname).not.toBeNull();
  });

  it("Should be able destroy collection", async () => {
    await CollectionServiceCreate({ session: { shop } } as any, {
      selections: [
        "gid://shopify/Collection/425845817661",
        "gid://shopify/Collection/425290039613",
      ],
    });

    let collections = await CollectionServiceGetAll();
    expect(collections.length).toEqual(2);
    await CollectionServiceDestroy({ id: collections[0]._id, shop });
    collections = await CollectionServiceGetAll();
    expect(collections.length).toEqual(1);
  });
});
