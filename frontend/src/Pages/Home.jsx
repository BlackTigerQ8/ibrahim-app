import React from "react";
import Header from "../components/header/Header";
import Explore from "../components/explore/Explore";
import Class from "../components/class/Class";
import Join from "../components/join/Join";
import Price from "../components/price/Price";

//
const Home = () => {
  return (
    <>
      <Header />
      <Explore />
      <Class />
      <Join />
      <Price />
    </>
  );
};

export default Home;
