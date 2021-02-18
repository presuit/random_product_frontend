import { useHistory } from "react-router-dom";
import { useMe } from "./hooks/useMe";
import { NotValidToken } from "./components/NotValidToken";
import { LoadingSpinner } from "./components/LoadingSpinner";

const colors = [
  "blugGray",
  "coolGray",
  "trueGray",
  "warmGray",
  "orange",
  "amber",
  "lime",
  "emerald",
  "teal",
  "cyan",
  "lightBlue",
  "violet",
  "fuchsia",
  "rose",
];

export const pickRandomBgColor = (): string => {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
};

export const getDate = (dateNumber: number): string => {
  const dateObj = new Date(dateNumber);
  const dateYear = dateObj.getFullYear();
  const dateMonth = dateObj.getMonth() + 1;
  const dateDate = dateObj.getDate();
  return `${dateYear}년 ${dateMonth}월 ${dateDate}일`;
};

export const getNameSuppressed = (name: string): string => {
  let newName = name;
  if (name.length > 10) {
    newName = `${name.substr(0, 10)}...`;
  }
  return newName;
};

export const numberWithCommas = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const validateAuth = async () => {
  const { refetch } = useMe();
  const history = useHistory();
  const newUserData = await refetch();
  if (newUserData.data?.me.user?.isVerified === false) {
    history.push("/not-valid-user");
  }
  if (newUserData.loading) {
    return LoadingSpinner;
  }
  if (newUserData.error) {
    return NotValidToken;
  }
};

export {};
