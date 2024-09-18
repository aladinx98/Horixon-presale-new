import React, { useEffect, useState } from "react";
import "./style.css";
// import logo from '../../images/logo.png';
import coin from "../../images/HRN.png";
import presale from "../../images/1.png";
import btm1 from "../../images/3.png";
import f4 from "../../images/icon.png";
import PresaleAbi from "../../Helpers/presaleAbi.json";
import USDTAbi from "../../Helpers/usdtAbi.json";
import TokenModal from "./TokenModal";
import { list } from "../../Helpers/tokenlist";
import { FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import Web3 from "web3";
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";

import t1 from "../../images/t1.png";
import r1 from "../../images/r1.png";
import t2 from "../../images/t2.png";
import r2 from "../../images/r2.png";
import t3 from "../../images/t3.png";
import r3 from "../../images/r3.png";

import buy from "../../images/buy.png";

const isValid = (regex) => (input) => regex.test(input);
const numberRegex = /^\d*\.?\d*$/;
const isValidNumber = isValid(numberRegex);

function MainSection() {
  const { isConnected, address } = useAccount();
  const cAddress = "0xb57c85406cB24D0109a1E55a791ab0c081bbE25D";
  const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";

  const [data, setData] = useState({
    bnb: "",
    gart: "",
  });
  const [open, setOpen] = useState(false);
  const [currentToken, setCurrentToken] = useState(list[0]);
  const [approvalDone, setApprovalDone] = useState(false);
  const gartVal = currentToken.name === "BNB" ? 208571 : 42;

  const webSupply_Binance = new Web3("https://1rpc.io/bnb");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [timer, setTimer] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const endDate = new Date("2024-09-06T00:00:00Z"); // Set your presale end date here
      const now = new Date();
      const distance = endDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimer(`${days}d ${hours}h ${minutes}m ${seconds}s`);

      if (distance < 0) {
        clearInterval(interval);
        setTimer("Presale Ended");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // const processBuy = async () => {
  //   if (!data.bnb || !data.gart) {
  //     toast.error("Please enter the correct value.");
  //     return;
  //   }

  //   try {
  //     const contract = new webSupply_Binance.eth.Contract(PresaleAbi, cAddress);
  //     let bnbValue = webSupply_Binance.utils.toWei(data.bnb.toString());

  //     const transaction = await prepareWriteContract({
  //       address: cAddress,
  //       abi: PresaleAbi,
  //       functionName: "buyHRN",
  //       value: bnbValue,
  //       from: address,
  //     });

  //     const toastId = toast.loading("Processing transaction...");
  //     const receipt = await writeContract(transaction);

  //     toast.success("Transaction completed successfully", { id: toastId });
  //     setData({ bnb: "", gart: "" });
  //   } catch (error) {
  //     toast.error("Something went wrong with the transaction!");
  //     console.error(error);
  //   }
  // };

  const buyWithUsdt = async () => {
    try {
      const contract = new webSupply_Binance.eth.Contract(PresaleAbi, cAddress);
      let bnbValue = webSupply_Binance.utils.toWei(data.bnb.toString());
      const bnbValueNumber = Number(bnbValue);
      const buyTransaction = await prepareWriteContract({
        address: cAddress,
        abi: PresaleAbi,
        functionName: "buyWithUSDT",
        args: [bnbValueNumber],
        from: address,
      });

      const toastId = toast.loading("Processing Buy Transaction..");
      await writeContract(buyTransaction);

      toast.success("Buy Transaction completed successfully", { id: toastId });
      setData({ bnb: "", gart: "" });

      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (error) {
      toast.error("Something went wrong with the transaction!");
      console.error(error);
    }
  };

  const approveTransaction = async () => {
    try {
      const tokenContract = new webSupply_Binance.eth.Contract(
        USDTAbi,
        usdtAddress
      );
      let bnbValue = webSupply_Binance.utils.toWei(data.bnb.toString());
      const bnbValueNumber = Number(bnbValue);
      const approvalTransaction = await prepareWriteContract({
        address: usdtAddress,
        abi: USDTAbi,
        functionName: "approve",
        args: [cAddress, bnbValueNumber],
        from: address,
      });

      const toastId = toast.loading("Approving transaction...");
      const hash = await writeContract(approvalTransaction);
      toast.loading("Processing Approval Transaction..", { id: toastId });
      await waitForTransaction(hash);
      toast.dismiss(toastId);
      toast.success("Approval completed successfully");
      setApprovalDone(true);
    } catch (error) {
      toast.error("Something went wrong with the transaction!");
      console.error(error);
    }
  };



  return (
    <>
      <br />
      <br />
      <div className="flex main-section shadow md:shadow-lg">
        <div className="main-section-form card">

          <div className="flex items-center justify-center">
            {/* <img src={presale} /> */}
            <h1 span class="head-h1"><span class="head-text">Private Sale</span> Ends in</h1>
          </div>

          <h2 className=" text-size mt-5 relative w-full text-center text-white transition-colors duration-200 ease-in-out group-hover:text-white">{timer}</h2>

          <div id="main" className="mt-5 grid grid-cols-3 gap-1 justify-evenly">
            <div className=" w-26 h-24">
              <img className="mb-3" src={t1} />
              <h2 className="rate">0.012 $</h2>
            </div>
            <div className=" w-26 h-24">
            <img className="mb-3" src={t2} />
            <h2 className="rate">0.024 $</h2>
          </div>
          <div className=" w-26 h-24">
            <img className="mb-3" src={t3} />
            <h2 className="rate">0.036 $</h2>
          </div>
        </div>

        <br />
        <p className="mgtp">Pay with</p>
        <div className="input-box">
          <div className="form-group">
            <input
              type="text"
              value={data.bnb}
              className="text-black"
              onChange={(e) => {
                const val = e.target.value
                  .split("")
                  .filter((el) => isValidNumber(el))
                  .join("");
                setData({
                  ...data,
                  bnb: val,
                  gart: val * gartVal,
                });
              }}
            />

            <div className="py-2 px-4 font-semibold">
              <img src={currentToken.icon} alt="snk" />
              <p style={{ color: "black" }}>{currentToken.name}</p>
            </div>
          </div>
        </div>

        <p className="mgtp">You will get</p>
        <div className="input-box">
          <div className="form-group">
            <input
              type="text"
              className="text-black"
              value={data.gart}
              onChange={(e) => {
                const val = e.target.value
                  .split("")
                  .filter((el) => isValidNumber(el))
                  .join("");
                setData({
                  ...data,
                  gart: val,
                  bnb: val / gartVal,
                });
              }}
            />
            <div className="py-2 px-4 text-gray font-semibold ">
              <img src={coin} alt="snk" />
              <p style={{ color: "black" }}>HRN</p>
            </div>
          </div>
        </div>

        <div>
          <div style={{ textAlign: "center", margin: "1.5em 0" }}>
            {currentToken.name === "USDT" && !approvalDone && (
              <button
                onClick={approveTransaction}
              >
                <img src={btm1} />
              </button>
            )}

            {currentToken.name === "USDT" && approvalDone && (
              <button
                className=""
                onClick={buyWithUsdt}
              >
                <img src={buy} />
              </button>
            )}

            
          </div>
        </div>
        <div className="smart flex items-center justify-center">
        <img className="img-box" src={f4} />
            <a className="mgtp f-text" href="/" target="_blank"> How to buy Horixon</a>
          </div>
      </div>

      <TokenModal
        open={open}
        setOpen={setOpen}
        handleOpen={handleOpen}
        handleClose={handleClose}
        currentChain={currentToken}
        setCurrentChain={setCurrentToken}
        setData={setData}
      />
    </div >
    </>
  );
}

export default MainSection;
