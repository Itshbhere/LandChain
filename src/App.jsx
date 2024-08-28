import { useState } from "react";
import NFTMarketplace from "./Pages/NFTMarketplace";
import Maincard from "./Components/Maincard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import SignUp from "./Pages/Signup";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import DropDown from "./Pages/DropDown";
import Dashboard from "./Pages/Dashboard";
import NFT from "./Pages/NFT";
import NFTCard from "./Components/NFTCard";
import Bottombar from "./Components/Bottombar";
import NFTAuction from "./Pages/NFTAuction";
// import ViewYourNft from "./Pages/ViewYourNft";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Marketplace" element={<NFTMarketplace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/DD" element={<DropDown />} />
        <Route path="/NFT" element={<NFT />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/NFTCard" element={<NFTCard />} />
        <Route path="/NFTAuction" element={<NFTAuction />} />
      </Routes>
      <Bottombar />
    </BrowserRouter>
  );
}

export default App;
