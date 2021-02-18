import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useHistory, useParams } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProductGridItem } from "../components/ProductGridItem";
import { useMe } from "../hooks/useMe";
import { validateAuth } from "../utils";
import {
  findCategoryBySlug,
  findCategoryBySlugVariables,
} from "../__generated__/findCategoryBySlug";

export const FIND_CATEGORY_BY_SLUG_QUERY = gql`
  query findCategoryBySlug($input: FindCategoryBySlugInput!) {
    findCategoryBySlug(input: $input) {
      ok
      error
      category {
        id
        slug
        name
        products {
          id
          name
          price
          bigImg
          savedAmount
        }
      }
    }
  }
`;

interface IParams {
  slug: string;
}

export const Category = () => {
  const history = useHistory();
  const { refetch } = useMe();
  const { slug } = useParams<IParams>();
  const { loading, data } = useQuery<
    findCategoryBySlug,
    findCategoryBySlugVariables
  >(FIND_CATEGORY_BY_SLUG_QUERY, {
    variables: {
      input: {
        slug,
      },
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    (async () => {
      const updatedUser = await refetch();
      await validateAuth(updatedUser, history);
    })();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div>
      <Helmet>
        <title>{data?.findCategoryBySlug.category?.slug} | 랜더미</title>
      </Helmet>
      <BackButton />
      <div className="max-w-screen-2xl min-h-screen mx-10 2xl:mx-auto pt-10 pb-32 grid  md:grid-cols-4 md:auto-rows-fr   gap-5">
        {data?.findCategoryBySlug.ok &&
          data?.findCategoryBySlug.category?.products &&
          data?.findCategoryBySlug.category?.products.map((product) => (
            <Link
              className="h-96"
              key={product.id}
              to={`/product/${product.id}`}
            >
              <ProductGridItem
                name={product.name}
                price={product.price}
                bigImg={product.bigImg}
                savedAmount={product.savedAmount}
              />
            </Link>
          ))}
      </div>
    </div>
  );
};
