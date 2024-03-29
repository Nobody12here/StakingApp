import "./App.css";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import Staking_page from "./Components/Staking_page/Staking_page";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <div className="overlay"></div>
      <div>
        <Toaster />
        <Header />

        <Staking_page/>

        <Footer />
      </div>
    </div>
  );
}

export default App;
