import React from "react";
import { Link } from "react-router-dom";
import "./Settings.css";
import { useState, useRef, useEffect } from "react";
import { Input } from "web3uikit";
import Web3 from "web3"
import { defaultImgs } from "../defaultimgs";
import { useMoralis } from "react-moralis";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config';

const Settings = () => {

  const [pfps, setPfps] = useState([]);
  const [selectedPFP, setSelectedPFP] = useState();
  const inputBanner = useRef(null);
  const inputAvatar = useRef(null);
  const [selectedBanner, setSelectedBanner] = useState(defaultImgs[1]);
  const [selectedAvatar, setSelectedAvatar] = useState(defaultImgs[1]);
  const [theBanner, setTheBanner] = useState();
  const [theAvatar, setTheAvatar] = useState();
  const [username, setUsername] = useState();
  const [bio, setBio] = useState();
  const { Moralis, isAuthenticated } = useMoralis();
  // const Web3Api = useMoralisWeb3Api();
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:3000');
  const contractList = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  const [account, setAccount] = useState()

  useEffect(() => {
    async function loadAccount() {
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0])

      const oldInfo = await contractList.methods.getProfile(accounts[0]).call()

    }
    loadAccount()
    
  },[])

  // const resolveLink = (url) => {
  //   if (!url || !url.includes("ipfs://")) return url;
  //   return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
  // };

  // useEffect(() => {

  //   const fetchNFTs = async () => {
  //     const options = {
  //       chain: "mumbai",
  //       address: account
  //     }

  //     const mumbaiNFTs = await Web3Api.account.getNFTs(options);
  //     const images = mumbaiNFTs.result.map(
  //       (e) => resolveLink(JSON.parse(e.metadata)?.image)
  //     );
  //     setPfps(images);
  //   }

  //   fetchNFTs();

  // },[isAuthenticated, account])

  const onBannerClick = () => {
    inputBanner.current.click();
  };

  const onAvatarClick = () => {
    inputAvatar.current.click()
  }

  const changeBanner = (event) => {
    
    const img = event.target.files[0];
    setTheBanner(img);
    setSelectedBanner(URL.createObjectURL(img));
  };

  const changeAvatar = (event) => {
    const img = event.target.files[0];
    setTheAvatar(img);
    setSelectedAvatar(URL.createObjectURL(img));
  }

  const saveAvatar = async () => {
    if (theAvatar) {
      var avatar = theAvatar;
      var fileAvatar = new Moralis.File(avatar.name, avatar);
      await fileAvatar.saveIPFS();

      await contractList.methods.changeAvatar(fileAvatar.ipfs()).send({from: account})
      window.location.reload();
    }
  }

  const saveBanner = async () => {
    if (theBanner) {
      var banner = theBanner;
      var fileBanner = new Moralis.File(banner.name, banner);
      await fileBanner.saveIPFS();

      await contractList.methods.changeBanner(fileBanner.ipfs()).send({from: account})
      window.location.reload();
    }
  }

  const saveProfile = async () => {

    await contractList.methods.changeProfile(username, bio).send({from: account})
    window.location.reload();

  }

  return (
    <>
      <div className="pageIdentify">Settings</div>
      <div className="settingsPage">
        <Input
          label="Name"
          name="NameChange"
          width="100%"
          labelBgColor="#141d26"
          onChange={(e)=> setUsername(e.target.value)}
        />

        <Input
          label="Bio"
          name="bioChange"
          width="100%"
          labelBgColor="#141d26"
          onChange={(e)=> setBio(e.target.value)}
        />
        <div className="save" onClick={() => saveProfile()}>
          Save
        </div>

        <div className="pfp">
          Profile Image 

          <div className="pfpOptions">
          <img
              src={selectedAvatar}
              onClick={onAvatarClick}
              className="banner"
            ></img>
            <input
              type="file"
              name="file"
              ref={inputAvatar}
              onChange={changeAvatar}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <div className="save" onClick={() => saveAvatar()}>
          Save
        </div>

        <div className="pfp">
          Profile Banner
          <div className="pfpOptions">
            <img
              src={selectedBanner}
              onClick={onBannerClick}
              className="banner"
            ></img>
            <input
              type="file"
              name="file"
              ref={inputBanner}
              onChange={changeBanner}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="save" onClick={() => saveBanner()}>
          Save
        </div>
      </div>
    </>
  );
};

export default Settings;
