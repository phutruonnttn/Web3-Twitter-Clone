import React from "react";
import { Icon } from "web3uikit";
import { Link, useParams, useNavigate } from "react-router-dom";
import './Profile.css';
import { defaultImgs } from "../defaultimgs";
import TweetInFeed from "../components/TweetInFeed";
import { useEffect, useState } from "react";
import Web3 from 'web3';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config';


const Profile = () => {
  let { address } = useParams();
  const [profile, setProfile] = useState()
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:3000');
  const contractList = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

  const navigate = useNavigate()

  useEffect(() => {
    async function getProfile() {
      const info = await contractList.methods.getProfile(address).call();
      setProfile(info)
    }
    getProfile()
  },[address])

  const clickBack = () => {
    navigate(-1)
  }

  return (
    <>
    <div className="pageIdentify">
      <div class="back-icon-comment" onClick={clickBack}>
          <Icon svg="chevronLeft" fill="white" size="30"/>
      </div>
      Profile
    </div>
    <img className="profileBanner" src={profile?.[3] !== "" ? profile?.[3] : defaultImgs[1]} alt="Banner"></img>
    <div className="pfpContainer">
      <img className="profilePFP" src={profile?.[2] !== "" ? profile?.[2] : defaultImgs[0]} alt="Avatar"></img>
      {profile?.[0] === "" ? (<div className="profileName">No Name</div>) : (<div className="profileName">{profile?.[0]}</div>)}
      <div className="profileWallet">{`${address.slice(0, 4)}...
            ${address.slice(38)}`}</div>
      <Link to="/settings">
          <div className="profileEdit">Edit profile</div>
      </Link>
      {profile?.[1] === "" ? 
        <div className="profileBio">
          No bio
        </div> : 
        <div className="profileBio">
          {profile?.[1]}
        </div>}
      <div className="profileTabs">
          <div className="profileTab">
          Your Tweets
          </div>
      </div>
    </div>
    <TweetInFeed profile={true} ethAddress={address}></TweetInFeed>
    
    </>
  );
};

export default Profile;

