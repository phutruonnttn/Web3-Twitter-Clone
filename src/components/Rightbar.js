import React from "react";
import './Rightbar.css';
import spaceshooter from "../images/spaceshooter.jpeg";
import netflix from "../images/netflix.jpeg";
import academy from "../images/academy.png";
import youtube from "../images/youtube.png";
import js from "../images/js.png";
import { Input, Button } from "web3uikit";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react"


const Rightbar = () => {
  const trends = [
    {
      img: spaceshooter,
      text: "Learn how to build a Web3 FPS game using unity...",
      link: "https://moralis.io/moralis-projects-learn-to-build-a-web3-space-fps-game/",
    },
    {
      img: netflix,
      text: "The fisrt Moralis Project! Let's Netflix and chill...",
      link: "https://moralis.io/moralis-projects-learn-to-build-a-web3-netflix-clone/",
    },
    {
      img: academy,
      text: "Master DeFi in 2022. Start  at the Moralis Academy...",
      link: "https://academy.moralis.io/courses/defi-101",
    },
    {
      img: js,
      text: "Become a Web3 Developer with just simple JS...",
      link: "https://academy.moralis.io/all-courses",
    },
    {
      img: youtube,
      text: "Best youtube channel to learn about Web3...",
      link: "https://www.youtube.com/channel/UCgWS9Q3P5AxCWyQLT2kQhBw",
    },
  ];
  const [ search, setSearch ] = useState()

  const navigate = useNavigate();

  function clickSearch() {
    navigate(`/search/${search}`)
  }

  return (
    <>
    <div className="rightbarContent">
      <Input
        label="Search Twitter"
        name ="Search Twitter"
        prefixIcon="search"
        labelBgColor="#141d26" 
        onChange={e => setSearch(e.target.value)}
        >
      </Input>
      <br></br>
      <Button
        color="red"
        icon="search"
        id="test-button-large-outline"
        onClick={() => clickSearch()}
        size="large"
        text="Search"
        theme="outline"
        type="button"
      />

    <div className="trends">
      News For You
      {trends.map((e) => {
          return(
            <>
            <div className="trend" onClick={() => window.open(e.link)}>
              <img src={e.img} className="trendImg"></img>
              <div className="trendText">{e.text}</div>
            </div>
            </>
          )
      })}
    </div>

    </div>
    </>
  );
};

export default Rightbar;

