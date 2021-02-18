import { ApolloError, gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { validateAuth } from "../utils";
import { requestEmail } from "../__generated__/requestEmail";

const REQUEST_EMAIL_MUTATION = gql`
  mutation requestEmail {
    requestEmail {
      ok
      error
    }
  }
`;

export const NotValidUser = () => {
  const history = useHistory();

  const onCompleted = (data: requestEmail) => {
    const {
      requestEmail: { ok, error },
    } = data;
    if (ok === true) {
      alert("이메일 전송에 성공했습니다. 이메일을 확인해 주세요!");
    } else {
      alert(error);
    }
  };

  const onError = (error: ApolloError) => {
    alert(error);
  };

  const [requestEmailMutation] = useMutation<requestEmail>(
    REQUEST_EMAIL_MUTATION,
    {
      onCompleted,
      onError,
    }
  );
  const { data, refetch: refetchUser } = useMe();

  const onClickToResetToken = () => {
    localStorage.removeItem("token");
    history.push("/");
    window.location.reload();
  };

  const onClickToRequestEmail = () => {
    return requestEmailMutation();
  };

  useEffect(() => {
    if (data?.me.user?.isVerified && data?.me.user?.isVerified === true) {
      history.push("/");
      window.location.reload();
    }
  }, [data]);

  useEffect(() => {
    (async () => {
      const upadtedUser = await refetchUser();
      await validateAuth(upadtedUser, history);
    })();
  }, []);

  return (
    <div>
      <Helmet>
        <title>인증 되지 않은 유저 | 랜더미</title>
      </Helmet>
      <div className="min-h-screen flex justify-center items-center bg-indigo-500">
        <div className="max-w-screen-sm w-full mx-10 bg-white shadow-xl rounded-md py-12 px-10 sm:mx-0">
          <div className="text-center font-semibold text-2xl">
            <h1>입력하신 이메일로 인증 링크를 보냈습니다.</h1>
            <h2 className="text-base mt-3">
              메일을 체크하고 링크를 클릭하여 인증을 마쳐주세요!
            </h2>
          </div>
          <div className="grid grid-cols-2 w-full mt-10 bg-gray-200  border ">
            <button
              onClick={onClickToResetToken}
              className="py-5 hover:bg-indigo-500 transition-colors  focus:outline-none "
            >
              이전 페이지로 돌아가기
            </button>
            <button
              onClick={onClickToRequestEmail}
              className="py-5 hover:bg-indigo-500 transition-colors  focus:outline-none "
            >
              이메일 다시 보내기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
