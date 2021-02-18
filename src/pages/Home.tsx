import { gql, useQuery, useReactiveVar } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { ProductGridItem } from "../components/ProductGridItem";
import { useMe } from "../hooks/useMe";
import {
  allProducts,
  allProductsVariables,
} from "../__generated__/allProducts";
import { Menu } from "../components/Menu";
import { currentHomePage } from "../apollo";
import { Helmet } from "react-helmet-async";
import { NotValidToken } from "../components/NotValidToken";
import { LoadingSpinner } from "../components/LoadingSpinner";

const ALL_PRODUCTS_QUERY = gql`
  query allProducts($input: AllProductsInput!) {
    allProducts(input: $input) {
      ok
      error
      totalResults
      totalPages
      products {
        id
        name
        price
        bigImg
        savedAmount
      }
    }
  }
`;

export const Home = () => {
  const currentPage = useReactiveVar(currentHomePage);
  const [page, setPage] = useState(currentPage);
  const {
    data: userData,
    loading: userLoading,
    refetch: refetchUser,
    error: userError,
  } = useMe();
  const {
    data: productsData,
    loading: productsLoading,
    refetch,
    error: allProductError,
  } = useQuery<allProducts, allProductsVariables>(ALL_PRODUCTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });
  useEffect(() => {
    refetch({ input: { page } });
    refetchUser();
  }, []);

  if (userError || allProductError) {
    return <NotValidToken />;
  }

  if (productsLoading || userLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Helmet>
        <title>홈 | 랜더미</title>
      </Helmet>
      {!userLoading && userData?.me.user?.isVerified === true && (
        <div>
          <div className="max-w-screen-2xl min-h-screen mx-10 2xl:mx-auto pt-10 pb-32 grid  md:grid-cols-4 grid-rows-2 gap-5 ">
            {!productsLoading &&
              productsData?.allProducts.products?.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <ProductGridItem
                    name={product.name}
                    price={product.price}
                    bigImg={product.bigImg}
                    savedAmount={product.savedAmount}
                  />
                </Link>
              ))}
          </div>
          <Menu
            totalPages={productsData?.allProducts.totalPages}
            totalProducts={productsData?.allProducts.totalResults}
            page={page}
            setPage={setPage}
          />
        </div>
      )}
    </div>
  );
};
