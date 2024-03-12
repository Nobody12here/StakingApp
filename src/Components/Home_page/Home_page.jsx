import React from "react";
import About_eth from "../About_eth/About_eth";
import Buy_eth from "../Buy_eth/Buy_eth";
import Roadmap from "../Roadmap/Roadmap";
import Whitepaper from "../Whitepaper/Whitepaper";
import COMPARISONS from "../COMPARISONS/COMPARISONS";
import FAQ from "../FAQ/FAQ";

export default function Home_page() {
  return (
    <div>
      
      <About_eth />
      <Buy_eth />
      <Roadmap />
      <Whitepaper />
      <COMPARISONS />
      <FAQ />
    </div>
  );
}
