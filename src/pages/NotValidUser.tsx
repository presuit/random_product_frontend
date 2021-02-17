import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useMe } from "../hooks/useMe";

export const NotValidUser = () => {
  const history = useHistory();
  const { data } = useMe();

  const onClickToResetToken = () => {
    localStorage.removeItem("token");
    history.push("/");
    window.location.reload();
  };

  useEffect(() => {
    if (data?.me.user?.isVerified && data?.me.user?.isVerified === true) {
      history.push("/");
      window.location.reload();
    }
  }, [data]);

  return (
    <div>
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
          </div>
        </div>
      </div>
    </div>
  );
};
