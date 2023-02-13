import { ShopifySession } from "@jamalsoueidan/pkg.bsb";
import { ShopifyRestResources } from "@shopify/shopify-api";
import { ShopifyApp } from "@shopify/shopify-app-express";

interface Product {
  id: string;
  title: string;
  featuredImage: {
    url: string;
  };
}

interface Collection {
  id: string;
  title: string;
  products: {
    nodes: Array<Product>;
  };
}

interface GetCollectionQuery {
  body: {
    data: {
      collection: Collection;
    };
  };
}

const getCollectionQuery = `
  query collectionFind($id: ID!) {
    collection(id: $id) {
      id
      title
      products(first: 50) {
        nodes {
          id
          title
          featuredImage {
            url
          }
        }
      }
    }
  }
`;

export interface GetCollectionProps {
  session: ShopifySession;
  shopify: ShopifyApp<ShopifyRestResources, never>;
  id: string;
}

export const getCollection = async ({
  session,
  shopify,
  id,
}: GetCollectionProps): Promise<Collection> => {
  const client = new shopify.api.clients.Graphql({ session } as never);

  const payload: GetCollectionQuery = await client.query({
    data: {
      query: getCollectionQuery,
      variables: {
        id,
      },
    },
  });

  return payload.body.data.collection;
};
