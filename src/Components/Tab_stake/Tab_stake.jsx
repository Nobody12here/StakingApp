import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { MdOutlineRestartAlt } from "react-icons/md";
import "./Tab_stake.css";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import toast from "react-hot-toast";
import Web3 from "web3";
import { useAccount, useBalance, useNetwork, useSwitchNetwork } from "wagmi";
import {
  Staking_ABI,
  Staking_Address,
  Staking_Token_ABI,
  Staking_Token_Address,
} from "../../util/Contract";
import { logDOM } from "@testing-library/react";
import { Button, Popover } from "antd";
import { Modal, Space } from "antd";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import moment from "moment";
import Countdown from "react-countdown";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Tab_stake({ Token_BalanceOF }) {
  const [value, setValue] = React.useState(0);
  const [getValue, setgetValue] = useState("");
  const [spinner, setspinner] = useState(false);
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const [minStake, setminStake] = useState(0);
  const [DepositeToken, setDepositeToken] = useState(0);
  const [totalReward, settotalReward] = useState(0);
  const [spinner_Red, setspinner_Red] = useState(false);
  const [claim_Spinner, setclaim_Spinner] = useState(false);
  const [unClaim_Spinner, setunClaim_Spinner] = useState(false);
  const [selectDays, setselectDays] = useState(1);
  const [Active, setActive] = useState(0);

  const data1 = useBalance({
    address: address || null,
  });
  const webSupply = new Web3("https://ethereum-sepolia-rpc.publicnode.com");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const Stake = async () => {
    try {
      if (address) {
        if (getValue != "") {
          if (getValue > Token_BalanceOF) {
            toast.error("Insufficient balance");
            setspinner(false);
          } else {
            if (Number(getValue) < Number(minStake)) {
              toast.error(`Minimum Stake Amount ${minStake}`);
              setspinner(false);
            } else {
              setspinner(true);
              let Token_Amout = webSupply.utils.toWei(getValue);
              
              Token_Amout = Token_Amout.toString();
              console.log("Token amount = ",Token_Amout)
              const { request } = await prepareWriteContract({
                address: Staking_Token_Address,
                abi: Staking_Token_ABI,
                functionName: "approve",
                args: [Staking_Address, Token_Amout],
                account: address,
              });
              const { hash } = await writeContract(request);
              const data = await waitForTransaction({
                hash,
              });
              setspinner(true);

              setTimeout(async () => {
                setspinner(true);

                toast.success("Approve SuccessFully");
                const { request } = await prepareWriteContract({
                  address: Staking_Address,
                  abi: Staking_ABI,
                  functionName: "farm",
                  args: [Token_Amout, selectDays],
                  account: address,
                });
                const { hash } = await writeContract(request);
                const data = await waitForTransaction({
                  hash,
                });
                setTimeout(() => {
                  setspinner(false);
                  toast.success("Transaction Completed");
                }, 4000);
              }, 2000);

              setspinner(false);
            }
          }
        } else {
          toast.error("Please Enter Amount First");
          setspinner(false);
        }
      } else {
        toast.error("Connect Wallet!");
        setspinner(false);
      }
    } catch (error) {
      setspinner(false);
      console.error(error)
      toast.error("Transaction Failed");
      
    }
  };

  const Read_Fuc = async () => {
    try {
      let contractOf_Token = new webSupply.eth.Contract(
        Staking_Token_ABI,
        Staking_Token_Address
      );
      let contractOf = new webSupply.eth.Contract(Staking_ABI, Staking_Address);

      let minimumDeposit = await contractOf.methods.minimumDeposit().call();
      minimumDeposit = minimumDeposit / 10**9;
      minimumDeposit = minimumDeposit.toString();
      setminStake(minimumDeposit);
      if (address) {
        let Users = await contractOf.methods.Users(address).call();
        
        Users = Users.DepositeToken / 10**18;
        Users = Users.toString();
        setDepositeToken(Users);
        let pendindRewards = await contractOf.methods
          .pendindRewards(address)
          .call();
        pendindRewards = pendindRewards / 10**18;
        pendindRewards = pendindRewards.toString();

        settotalReward(parseFloat(pendindRewards).toFixed(2));
        setspinner_Red(false);
      }
      setspinner_Red(false);
    } catch (error) {
      setspinner_Red(false);

      console.log(error);
    }
  };

  useEffect(() => {
    Read_Fuc();
  }, [address]);

  const claim = async () => {
    try {
      setclaim_Spinner(true);
      const { request } = await prepareWriteContract({
        address: Staking_Address,
        abi: Staking_ABI,
        functionName: "claim",
        account: address,
      });
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash,
      });
      setTimeout(() => {
        setclaim_Spinner(false);
        toast.success("Transaction Completed");
      }, 2000);
    } catch (error) {
      console.log(error);
      setclaim_Spinner(false);
    }
  };

  const unstake_Token = async (index) => {
    try {
      setunClaim_Spinner(true);
      const { request } = await prepareWriteContract({
        address: Staking_Address,
        abi: Staking_ABI,
        functionName: "harvest",
        args: [[index]],

        account: address,
      });
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash,
      });
      setTimeout(() => {
        setunClaim_Spinner(false);
        toast.success("Transaction Completed");
      }, 2000);
    } catch (error) {
      setunClaim_Spinner(false);

      console.log(error);
    }
  };

  const [UserInformationStak, setUserInformationStak] = useState();

  const checkBalance = async () => {
    let stakingContractOf;

    stakingContractOf = new webSupply.eth.Contract(
      Staking_ABI,
      Staking_Address
    );
    if (address) {
      let UserInformation = await stakingContractOf.methods
        .UserInformation(address)
        .call();
      console.log("UserInformation", UserInformation);
      let array1 = UserInformation[0];
      let array2 = UserInformation[1];
      let array3 = UserInformation[2];
      console.log(array3)
      let myArray = [];
      let currentTime = Math.floor(new Date().getTime() / 1000.0);
      for (let i = 0; i < array1.length; i++) {
        let currentTimestamp = array3[i];
        let date = moment(Number(array3[i]) * 1000).format("DD-MM-YYYY");
        let obj = {
          address: address,
          amount: array1[i] / 10**18,

          unLoackTime: Number(currentTimestamp) + Number(86400 ) * array2[i],
          LockTime: date,
        };
        myArray = [...myArray, obj];
      }

      setUserInformationStak(myArray);
    }
  };
  console.log("UserInformationStak", UserInformationStak);

  useEffect(() => {
    checkBalance();
  }, []);

  const Completionist = () => {
    return (
      <>
        <div className="text_days fs-5 ">Unstaked Time Reached!</div>
      </>
    );
  };

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <Completionist />;
    } else {
      return (
        <div className="text_days fs-5 ">
          {/* {days} D {hours} H {minutes} M {seconds} S */}
          {days}d : {hours}h : {minutes}m : {seconds}s
        </div>
      );
    }
  };
  const confirm = (index) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content:
        "Before unstake time 10% will be deducted from your staked amount",
      okText: "Continue",
      cancelText: "Cancel",
      onOk: () => unstake_Token(index),
    });
  };
  // const unstake = async (index) => {
  //   try {
  //     setspinner(true);
  //     const { request } = await prepareWriteContract({
  //       address: XBIT_Pool_Staking_Address,
  //       abi: XBIT_Pool_Staking_ABI,
  //       functionName: "harvest",
  //       args: [[index]],
  //       account: address,
  //     });
  //     const { hash } = await writeContract(request);
  //     const data = await waitForTransaction({
  //       hash,
  //     });
  //     toast.success("Transaction Confirmed");
  //     setspinner(false);
  //     checkBalance();
  //   } catch (e) {
  //     console.log("Error while calling Unstaking function", e);
  //     setspinner(false);
  //   }
  // };
  return (
    <div>
      <div className="d-flex justify-content-center main_div_stking">
        <Box className="ineerd" sx={{  }}>
          <div
            className=""
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  label={<span className="text-white">Stake</span>}
                  {...a11yProps(0)}
                />
                <Tab
                  label={<span className="text-white">Withdraw</span>}
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>
          </div>
          <CustomTabPanel value={value} index={0}>
            {address ? (
              <>
                <div className="stkae_content">
                  <div className="d-flex justify-content-between mb-2">
                    <div>
                      <p className="ab_stk">Amount</p>
                    </div>
                    <div>
                      <p className="ab_stk">
                        My Balance: {Token_BalanceOF} $TOKEN
                      </p>
                    </div>
                  </div>

                  <div className="d-flex">
                    <div className="left_int_side">
                      <p className="mb-0">$TOKEN</p>
                    </div>
                    <div className="text">
                      <input
                        type="text"
                        name=""
                        placeholder="0"
                        className="stkk_inpu"
                        id=""
                        value={getValue}
                        onChange={(e) => setgetValue(e.target.value)}
                      />
                    </div>
                    <div
                      className="left_int_side"
                      onClick={() =>
                        Token_BalanceOF == 0
                          ? setgetValue(0)
                          : setgetValue(Token_BalanceOF)
                      }
                    >
                      <button className="stk_max">MAX</button>
                    </div>
                  </div>

                  <p className="clr_text">Min Stake Amount: {minStake} Tokens</p>

                  <div className="row justify-content-center my-4">
                    <div className="col-md-3 col-4 p-1">
                      <div
                        className="stke_planes"
                        onClick={() => (setselectDays(14), setActive(4))}
                        style={{
                          background:
                            Active == 4
                              ? "linear-gradient(98.76deg, rgb(56, 195, 207) 0%, rgb(135, 103, 211) 100%)"
                              : "transparent",
                        }}
                      >
                        <button className="days_plan">14 days</button>
                        <div className="about_plan">
                          <p className="mb-0 Return_inner">10% Return</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-4 p-1">
                      <div
                        className="stke_planes"
                        onClick={() => (setselectDays(30), setActive(3))}
                        style={{
                          background:
                            Active == 3
                              ? "linear-gradient(98.76deg, rgb(56, 195, 207) 0%, rgb(135, 103, 211) 100%)"
                              : "transparent",
                        }}
                      >
                        <button className="days_plan">30 days</button>
                        <div className="about_plan">
                          <p className="mb-0 Return_inner">20% Return</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-4 p-1">
                      <div
                        className="stke_planes"
                        onClick={() => (setselectDays(60), setActive(2))}
                        style={{
                          background:
                            Active == 2
                              ? "linear-gradient(98.76deg, rgb(56, 195, 207) 0%, rgb(135, 103, 211) 100%)"
                              : "transparent",
                        }}
                      >
                        <button className="days_plan">60 days</button>
                        <div className="about_plan">
                          <p className="mb-0">30% Return</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-4 p-1">
                      <div
                        className="stke_planes"
                        onClick={() => (setselectDays(90), setActive(1))}
                        style={{
                          background:
                            Active == 1
                              ? "linear-gradient(98.76deg, rgb(56, 195, 207) 0%, rgb(135, 103, 211) 100%)"
                              : "transparent",
                        }}
                      >
                        <button className="days_plan">90 days</button>
                        <div className="about_plan">
                          <p className="mb-0">50% Return</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button className="allowance_btn mt-2" onClick={Stake}>
                      {spinner ? "Loading..." : "STAKE"}
                    </button>
                  </div>

                  <div className="">
                    <p className="text-center clr_text rewards ">
                      My Rewards{" "}
                      <span
                        className="mx-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => (Read_Fuc(), setspinner_Red(true))}
                      >
                        <MdOutlineRestartAlt
                          className={spinner_Red ? "Icons_spinner" : ""}
                        ></MdOutlineRestartAlt>
                      </span>
                    </p>
                  </div>
                  <div className="d-flex justify-content-around mt-3">
                    <div>
                      <p className="ab_stk text-center ">Total Staked Amount</p>
                      <p className="rewards clr_text text-center ">
                        {DepositeToken} $TEST TOKEN
                      </p>
                    </div>
                    <div>
                      <p className="ab_stk text-center">Total Rewards</p>
                      <p className="rewards clr_text text-center">
                        {totalReward} $TEST TOKEN
                      </p>
                    </div>
                  </div>

                  {/* <button className="re_inves mt-2" onClick={claim}>
                    {claim_Spinner ? "Loading..." : "CLAIM REWARDS"}{" "}
                  </button> */}
                  <button
                    className="connnect_wallet_stk"
                    onClick={() =>
                      address
                        ? chain?.id == chains[0]?.id
                          ? open()
                          : switchNetwork?.(chains[0]?.id)
                        : open()
                    }
                  >
                    {address ? (
                      chain?.id == chains[0]?.id ? (
                        address ? (
                          <>
                            {`${address.substring(0, 6)}...${address.substring(
                              address.length - 4
                            )}`}
                          </>
                        ) : (
                          "connect wallet"
                        )
                      ) : (
                        "Switch Network"
                      )
                    ) : (
                      "Connect Wallet"
                    )}
                  </button>
                  <a
                    href=""
                    target="_blank"
                    className="how_stkae with_drea"
                  >
                    How to Stake
                  </a>
                </div>
              </>
            ) : (
              <>
                <button
                  className="connnect_wallet_stk"
                  onClick={() =>
                    address
                      ? chain?.id == chains[0]?.id
                        ? open()
                        : switchNetwork?.(chains[0]?.id)
                      : open()
                  }
                >
                  {address ? (
                    chain?.id == chains[0]?.id ? (
                      address ? (
                        <>
                          {`${address.substring(0, 6)}...${address.substring(
                            address.length - 4
                          )}`}
                        </>
                      ) : (
                        "connect wallet"
                      )
                    ) : (
                      "Switch Network"
                    )
                  ) : (
                    "Connect Wallet"
                  )}
                </button>
                <a
                  href="https://docs.intelliquantcoin.com/usdinqu-staking/how-to-stake"
                  target="_blank"
                  className="how_stkae with_drea"
                >
                  How to Stake
                </a>
              </>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {address ? (
              <>
                <div className="d-flex justify-content-center">
                  <div>
                    <p className="ab_stk">Staked $TOKEN: {DepositeToken} </p>
                  </div>
                </div>
                <div className="container mx-auto   py-5">
                  <div className="flex flex-col items-center justify-center lg:py-0 py-8">
                    <div className="text-center">
                      <p className="text-center  text-3xl text-white font-bold">
                        Your Stakes
                      </p>
                      {/* <hr className="line flex mx-auto " /> */}
                    </div>
                    <div className="MuiBox-root css-ihc79b">
                      <div className="d-flex justify-content-center align-items-center mb-3">
                        <button
                          className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium css-4hkj1c refershBTB"
                          tabIndex={0}
                          type="button"
                          onClick={() => checkBalance()}
                        >
                          <span className="me-2 fs-6 ">Refresh</span>
                          <span
                            role="img"
                            aria-label="sync"
                            className="anticon anticon-sync SyncOutlined fs-6 "
                          >
                            <svg
                              viewBox="64 64 896 896"
                              focusable="false"
                              data-icon="sync"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M168 504.2c1-43.7 10-86.1 26.9-126 17.3-41 42.1-77.7 73.7-109.4S337 212.3 378 195c42.4-17.9 87.4-27 133.9-27s91.5 9.1 133.8 27A341.5 341.5 0 01755 268.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 003 14.1l175.7 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c0-6.7-7.7-10.5-12.9-6.3l-56.4 44.1C765.8 155.1 646.2 92 511.8 92 282.7 92 96.3 275.6 92 503.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8zm756 7.8h-60c-4.4 0-7.9 3.5-8 7.8-1 43.7-10 86.1-26.9 126-17.3 41-42.1 77.8-73.7 109.4A342.45 342.45 0 01512.1 856a342.24 342.24 0 01-243.2-100.8c-9.9-9.9-19.2-20.4-27.8-31.4l60.2-47a8 8 0 00-3-14.1l-175.7-43c-5-1.2-9.9 2.6-9.9 7.7l-.7 181c0 6.7 7.7 10.5 12.9 6.3l56.4-44.1C258.2 868.9 377.8 932 512.2 932c229.2 0 415.5-183.7 419.8-411.8a8 8 0 00-8-8.2z" />
                            </svg>
                          </span>
                        </button>
                      </div>

                      <div
                        className="MuiTableContainer-root css-48ybtg"
                        border="none"
                        pt={2}
                        pb={5}
                      >
                        <table
                          className="MuiTable-root css-1owb465"
                          aria-label="simple table"
                          style={{  }}
                        >
                          <thead className="MuiTableHead-root css-1wbz3t9">
                            <tr className="MuiTableRow-root MuiTableRow-head css-1gqug66">
                              <th
                                className="MuiTableCell-root MuiTableCell-head MuiTableCell-alignCenter MuiTableCell-sizeMedium css-1gzy9y4"
                                scope="col"
                                style={{
                                  fontSize: 16,
                                  color: "rgb(255, 255, 255)",
                                }}
                              >
                                #
                              </th>
                              <th
                                className="MuiTableCell-root MuiTableCell-head MuiTableCell-alignCenter MuiTableCell-sizeMedium css-1gzy9y4"
                                scope="col"
                                style={{
                                  fontSize: 16,
                                  color: "rgb(255, 255, 255)",
                                }}
                              >
                                Staked Amount
                              </th>
                              <th
                                className="MuiTableCell-root MuiTableCell-head MuiTableCell-alignCenter MuiTableCell-sizeMedium css-1gzy9y4"
                                scope="col"
                                style={{
                                  fontSize: 16,
                                  color: "rgb(255, 255, 255)",
                                }}
                              >
                                Withdrawal Time
                              </th>
                              <th
                                className="MuiTableCell-root MuiTableCell-head MuiTableCell-alignCenter MuiTableCell-sizeMedium css-1gzy9y4"
                                scope="col"
                                style={{
                                  fontSize: 16,
                                  color: "rgb(255, 255, 255)",
                                }}
                              >
                                Unstake
                              </th>
                            </tr>
                          </thead>
                          <tbody className="MuiTableBody-root css-1xnox0e">
                            {!UserInformationStak ? (
                              <>
                                <td
                                  className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-q34dxg"
                                  colSpan={5}
                                  style={{ border: "none" }}
                                >
                                  <div className="MuiBox-root css-ehd0rl">
                                    <p className="MuiTypography-root MuiTypography-body1 css-o7q7an">
                                      You have no staking data
                                    </p>
                                  </div>
                                </td>{" "}
                              </>
                            ) : (
                              <>
                                {UserInformationStak?.map((items, index) => {
                                  let current_Time = Math.floor(
                                    new Date().getTime() / 1000.0
                                  );

                                  return (
                                    <>
                                      {items.unstaked == true ||
                                      items.withdrawan == true ? (
                                        <></>
                                      ) : (
                                        <>
                                          <tr className="MuiTableRow-root css-1gqug66">
                                            <td
                                              className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-q34dxg text-white text-center"
                                              scope="col"
                                            >
                                              {index + 1}
                                            </td>
                                            <td
                                              className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-q34dxg text-white text-center"
                                              scope="col"
                                            >
                                              {items.amount}
                                            </td>
                                            <td
                                              className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-q34dxg text-white text-center"
                                              scope="col"
                                            >
                                              <Countdown
                                                date={
                                                  Date.now() +
                                                  (parseInt(items.unLoackTime) *
                                                    1000 -
                                                    Date.now())
                                                }
                                                renderer={renderer}
                                              />
                                            </td>
                                            <td
                                              className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-q34dxg text-white text-center"
                                              scope="col"
                                            >
                                              <button
                                                className="MuiButtonBase-root  MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium css-4hkj1c"
                                                tabIndex={0}
                                                type="button"
                                                style={{
                                                  backgroundColor: "#fff",
                                                  color: "#000",
                                                }}
                                                // onClick={() => confirm(index)}
                                                onClick={() =>
                                                  current_Time >=
                                                  items.unLoackTime
                                                    ? unstake_Token(index)
                                                    :confirm(index)
                                                }
                                              >
                                                {/* {
                                        spinner ?
                                        "Loading ...":"Unstake"
                                      } */}
                                                Unstake
                                                <span className="MuiTouchRipple-root css-w0pj6f" />
                                              </button>
                                            </td>{" "}
                                          </tr>{" "}
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <button className="allowance_btn mt-4" onClick={unstake_Token}>
                  {" "}
                  {unClaim_Spinner ? "Loading..." : "UNSTAKE"}{" "}
                </button> */}

                <button
                  className="connnect_wallet_stk"
                  onClick={() =>
                    address
                      ? chain?.id == chains[0]?.id
                        ? open()
                        : switchNetwork?.(chains[0]?.id)
                      : open()
                  }
                >
                  {address ? (
                    chain?.id == chains[0]?.id ? (
                      address ? (
                        <>
                          {`${address.substring(0, 6)}...${address.substring(
                            address.length - 4
                          )}`}
                        </>
                      ) : (
                        "connect wallet"
                      )
                    ) : (
                      "Switch Network"
                    )
                  ) : (
                    "Connect Wallet"
                  )}
                </button>
                <a
                  href=""
                  target="_blank"
                  className="how_stkae with_drea"
                >
                  How to Stake
                </a>
              </>
            ) : (
              <>
                <button
                  className="connnect_wallet_stk"
                  onClick={() =>
                    address
                      ? chain?.id == chains[0]?.id
                        ? open()
                        : switchNetwork?.(chains[0]?.id)
                      : open()
                  }
                >
                  {address ? (
                    chain?.id == chains[0]?.id ? (
                      address ? (
                        <>
                          {`${address.substring(0, 6)}...${address.substring(
                            address.length - 4
                          )}`}
                        </>
                      ) : (
                        "connect wallet"
                      )
                    ) : (
                      "Switch Network"
                    )
                  ) : (
                    "Connect Wallet"
                  )}
                </button>

                <a
                  href=""
                  target="_blank"
                  className="how_stkae with_drea"
                >
                  How to Stake
                </a>
              </>
            )}
          </CustomTabPanel>
        </Box>
      </div>
    </div>
  );
}
