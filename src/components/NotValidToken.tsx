import { useHistory } from "react-router-dom";
import { TOKEN_NAME } from "../apollo";

export const NotValidToken: React.FC = () => {
  const history = useHistory();

  const onClickToRestart = () => {
    const token = localStorage.getItem(TOKEN_NAME);
    if (token) {
      localStorage.removeItem(TOKEN_NAME);
    }
    history.push("/");
    window.location.reload();
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center  px-16">
      <h1 className="text-5xl font-bold text-red-500">유저 에러 발생!</h1>
      <h3 className="mt-10 text-3xl font-medium text-white">
        유저 토큰에 문제가 생겼습니다.
      </h3>
      <h3 className="mt-10 text-3xl font-medium text-white">
        다시 로그인 해주세요.
      </h3>

      <button
        onClick={onClickToRestart}
        className="mt-10 py-5 px-5 ring-4 ring-indigo-600  focus:outline-none rounded-lg shadow-lg text-white "
      >
        다시 로그인하기
      </button>
    </div>
  );
};
