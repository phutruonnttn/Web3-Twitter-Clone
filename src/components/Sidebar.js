import React from "react";
import "./Sidebar.css";
import { Icon } from "web3uikit";
import { Link } from "react-router-dom";
import { useMoralis } from "react-moralis";
import { defaultImgs } from "../defaultimgs";
import Web3 from 'web3';
import { useEffect, useState } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config';

const Sidebar = () => {

  const { Moralis} = useMoralis();
  const user = Moralis.User.current();
  const [account, setAccount] = useState();
  const [info, setInfo] = useState()
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:3000');
  const contractList = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

  useEffect(() => {
    async function loadAccount() {
      var accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0])

      const info = await contractList.methods.getProfile(accounts[0]).call()
      setInfo(info)
    }

    loadAccount();
  }, [])
  

  return (
    <>
      <div className="siderContent">
        <div className="menu">
          <div className="details">
            <Icon fill="#ffffff" size={33} svg="twitter" />
          </div>

          <Link to="/" className="link">
            <div className="menuItems">
              <Icon fill="#ffffff" size={33} svg="list" />
              Home
            </div>
          </Link>

          <Link to={`/profile/${account}`} className="link">
            <div className="menuItems">
              <Icon fill="#ffffff" size={33} svg="user" />
              Profile
            </div>
          </Link>

          <Link to="/settings" className="link">
            <div className="menuItems">
              <Icon fill="#ffffff" size={33} svg="cog" />
              Settings
            </div>
          </Link>
        </div>

        <div className="details">
          <img src={info?.[2] !== "" ? info?.[2] : defaultImgs[0]} className="profilePic" alt="Avatar"></img>
          <div className="profile">
            <div className="who">
              {info?.[0] !== "" ? info?.[0] : <div>No name</div>} 
            </div>
            <div className="accWhen">
              {account?.slice(0, 4)}...{account?.slice(38)}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Sidebar;
