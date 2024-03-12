import React, { useEffect, useState } from "react";
import "./Staking_page.css";
import Tab_stake from "../Tab_stake/Tab_stake";
import { useAccount } from "wagmi";
import {
  Staking_ABI,
  Staking_Address,
  Staking_Token_ABI,
  Staking_Token_Address,
} from "../../util/Contract";
import Web3 from "web3";

export default function Staking_page() {
  const { address } = useAccount();
  const [Token_BalanceOF, setToken_BalanceOF] = useState(0);
  const [totalStaking, settotalStaking] = useState(0);

  const webSupply = new Web3("https://ethereum-sepolia-rpc.publicnode.com");

  const Token_Balance = async () => {
    let contractOf_Token = new webSupply.eth.Contract(
      Staking_Token_ABI,
      Staking_Token_Address
    );

    if (address) {
      let balance = await contractOf_Token.methods.balanceOf(address).call();
      
      balance = balance / 10**18;
      
      // balance = balance.toString();
      setToken_BalanceOF(parseFloat(balance).toFixed(2));

      let Token_balance = await contractOf_Token.methods
        .balanceOf(Staking_Address)
        .call();
      
      Token_balance = Token_balance / 10**18;
      Token_balance = Token_balance.toString();
      
      settotalStaking(parseFloat(Token_balance).toFixed(3));
    }
  };

  useEffect(() => {
    let interval = setInterval(() => {
      Token_Balance();
    }, 1000);
    return () => clearInterval(interval);
  }, [address]);
  return (
    <div className="main_staking_page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7">
            <div className="main_box_staking">
              <h1>$TOKEN STAKING</h1>
              <p className="stk_para">Total in $TOKEN Staking</p>
              <p className="tota_de">
                {" "}
                <span className="fw-bold new_clr">{totalStaking} $TOKEN</span>
              </p>
              {/* <h5>APY: 120%</h5> */}
              <Tab_stake Token_BalanceOF={Token_BalanceOF} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
