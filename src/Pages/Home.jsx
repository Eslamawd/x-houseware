import React from "react";
import GreenBanner from "../components/GreenBanner";
import HeaderPrivileges from "../components/HeaderPrivileges";
import BrowseByCategory from "../components/BrawseByCategory";
import FlashSales from "../components/FlashSeals";

function Home() {
  return (
    <>
      <GreenBanner />
      <HeaderPrivileges />
      <BrowseByCategory />
      <FlashSales />
    </>
  );
}

export default Home;
