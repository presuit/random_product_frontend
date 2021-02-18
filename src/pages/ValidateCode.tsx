import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useHistory, useLocation } from "react-router-dom";
import { NotValidToken } from "../components/NotValidToken";
import { useMe } from "../hooks/useMe";
import {
  confirmVerificationCode,
  confirmVerificationCodeVariables,
} from "../__generated__/confirmVerificationCode";

const CONFIRM_VALIDATION_CODE_MUTATION = gql`
  mutation confirmVerificationCode($input: ConfirmVerificationCodeInput!) {
    confirmVerificationCode(input: $input) {
      ok
      error
      userId
    }
  }
`;

export const ValidationCode = () => {
  const location = useLocation();
  const history = useHistory();
  const client = useApolloClient();
  const code = location.search.split("?code=")[1];
  const { data: userData, error: userError } = useMe();

  const onCompleted = (data: confirmVerificationCode) => {
    const {
      confirmVerificationCode: { ok, userId },
    } = data;
    if (ok && userId) {
      client.writeFragment({
        id: `User:${userId}`,
        fragment: gql`
          fragment UserVerifCodeFragment on User {
            isVerified
          }
        `,
        data: {
          isVerified: true,
        },
      });
      alert("성공적으로 인증 되었습니다.");
      history.push("/");
    }
  };

  const [confirmVerificationCodeMutation, { loading, data }] = useMutation<
    confirmVerificationCode,
    confirmVerificationCodeVariables
  >(CONFIRM_VALIDATION_CODE_MUTATION, { onCompleted });
  useEffect(() => {
    confirmVerificationCodeMutation({
      variables: {
        input: {
          code,
        },
      },
    });
  }, []);

  if (userData?.me.user?.isVerified === true) {
    alert("이미 인증 된 유저입니다.");
    history.push("/");
  }

  if (userError) {
    return <NotValidToken />;
  }

  return (
    <div>
      <Helmet>
        <title>유저 인증 코드 | 랜더미</title>
      </Helmet>
      <div className="min-h-screen flex flex-col justify-center items-center bg-indigo-500">
        {loading && (
          <h1 className="text-white font-semibold text-2xl">Loading...</h1>
        )}
        {!loading && data?.confirmVerificationCode.error && (
          <div className="px-5 py-10 flex flex-col justify-center items-center border mx-3 bg-white rounded-xl">
            <h1 className="text-black font-semibold text-2xl">
              {data?.confirmVerificationCode.error}
            </h1>
            <Link className="text-black mt-10 hover:underline" to="/">
              홈으로 가기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
