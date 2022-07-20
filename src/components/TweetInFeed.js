import React from "react";
import "./TweetInFeed.css";
import Addbar from "./Addbar"
import { defaultImgs } from "../defaultimgs";
import { Icon, Modal } from "web3uikit";
import Web3 from 'web3';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config';

const TweetInFeed = ({profile, ethAddress, search, searchText, detail, id, comment, owner}) => {

  const initialState = []

  const [tweets, setTweets] = useState([]);
  const [stars, setStars] = useState([]);
  const [color, setColor] = useState([]);
  const [account, setAccount] = useState();
  const [visible, setVisible] = useState(false);
  const [selectedTweet, setSelectedTweet] = useState();
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:3000');
  const contractList = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

  

  useEffect(() => {
    async function loadTweetFeed() {
      const counter = await contractList.methods.getCounter().call();
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0])

      for(var i=0;i<counter;i++) {
        const tweet = await contractList.methods.getTweetwithInfo(i).call();
        if(tweet[7] === true) {
          continue;
        }
        const stars = await contractList.methods.getStar(i).call();
        const starred = await contractList.methods.whoStar(i).call({from: accounts[0]})
        let star = parseInt(stars)
        setTweets((tweets) => [...tweets, tweet]);
        setStars((stars) => [...stars,star]);
        if(starred === true) {
          setColor((color) => [...color, "#ff1493"])
        } else {
          setColor((color) => [...color, "#3f3f3f"])
        }
      }
    }

    async function loadTweetProfile() {
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0])
      const tweetIdList = await contractList.methods.getUserTweet(ethAddress).call();
      setTweets(initialState)
      setStars(initialState)

      for(var i=0;i<tweetIdList[1];i++) {
        const tweet = await contractList.methods.getTweetwithInfo(tweetIdList[0][i]).call();
        if(tweet[7] === true) {
          continue;
        }
        const stars = await contractList.methods.getStar(tweetIdList[0][i]).call();
        let star = parseInt(stars)
        setTweets((tweets) => [...tweets, tweet]);
        setStars((stars) => [...stars,star]);
        const starred = await contractList.methods.whoStar(tweetIdList[0][i]).call({from: accounts[0]})
        if(starred === true) {
          setColor((color) => [...color, "#ff1493"])
        } else {
          setColor((color) => [...color, "#3f3f3f"])
        }

      }
    }

    async function loadTweetSearch() {

      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0])
      const tweetIdList = await contractList.methods.searchTweet(searchText).call();
      setTweets(initialState)
      setStars(initialState)

      for(var i=0;i<tweetIdList[1];i++) {
        const tweet = await contractList.methods.getTweetwithInfo(tweetIdList[0][i]).call();
        if(tweet[7] === true) {
          continue;
        }
        const stars = await contractList.methods.getStar(tweetIdList[0][i]).call();
        let star = parseInt(stars)
        setTweets((tweets) => [...tweets, tweet]);
        setStars((stars) => [...stars,star]);
        const starred = await contractList.methods.whoStar(tweetIdList[0][i]).call({from: accounts[0]})
        if(starred === true) {
          setColor((color) => [...color, "#ff1493"])
        } else {
          setColor((color) => [...color, "#3f3f3f"])
        }

      }

    }

    async function loadTweetDetail() {

      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0])
      setTweets(initialState)
      setStars(initialState)

      const tweet = await contractList.methods.getTweetwithInfo(id).call();
      const stars = await contractList.methods.getStar(id).call();
      let star = parseInt(stars)
      setTweets((tweets) => [...tweets, tweet]);
      setStars((stars) => [...stars,star]);
      const starred = await contractList.methods.whoStar(id).call({from: accounts[0]})
      if(starred === true) {
        setColor((color) => [...color, "#ff1493"])
      } else {
        setColor((color) => [...color, "#3f3f3f"])
      }
    }
    
    async function loadComment() {
      // const comments = await contractList.methods.getTweetwithInfo(id).call();

      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0])

      setTweets(initialState)
      setStars(initialState)

      const tweet = await contractList.methods.getTweetwithInfo(owner).call();
      for(let i=0;i<tweet[8].length;i++) {
        const comment = await contractList.methods.getTweetwithInfo(tweet[8][i]).call();
        const stars = await contractList.methods.getStar(tweet[8][i]).call();

        let star = parseInt(stars)
        setTweets((tweets) => [...tweets, comment]);
        setStars((stars) => [...stars,star]);
        const starred = await contractList.methods.whoStar(tweet[8][i]).call({from: accounts[0]})
        if(starred === true) {
          setColor((color) => [...color, "#ff1493"])
        } else {
          setColor((color) => [...color, "#3f3f3f"])
        }
      }
      
    }
    

    if(profile === false) {
      loadTweetFeed();
      
    } else if (detail === true) {
      loadTweetDetail()
    }
    else if (search === true) {
      loadTweetSearch()
    }
    else if(profile === true) {
      loadTweetProfile();
    } else if(comment === true) {
      loadComment()
    }
    
  }, [ethAddress, searchText, id, owner])


  const onClickStar = ( async (index, id) => {

    var whoStar = await contractList.methods.whoStar(id).call({from: account});

    if (whoStar === false) {
      await contractList.methods.star(id).send({from: account});

      let tmpStars = [...stars];
      tmpStars[index] += 1;
      setStars(tmpStars);

      let tmpColor = [...color];
      tmpColor[index] = "#ff1493"
      setColor(tmpColor);
    } else {
      await contractList.methods.unStar(id).send({from: account});

      let tmpStars = [...stars];
      tmpStars[index] -= 1;
      setStars(tmpStars);

      let tmpColor = [...color];
      tmpColor[index] = "#3f3f3f"
      setColor(tmpColor);
    }

  })

  return (
    
    <>
      {tweets.map((tweet, index) => {
          return (
            <>
              <div className="feedTweet">
                <Link to={`/profile/${tweet[2]}`} className="link"> 
                  <img src={tweet?.[6] === "" ? defaultImgs[0] : tweet?.[6]} className="profilePic" alt="Avatar"></img>
                </Link>
                <div className="completeTweet">
                  <div className="who">
                    {tweet?.[5] === "" ? <div>No name</div> : tweet?.[5]}
                      <div className="accWhen">{
                            `${tweet[2].slice(0, 4)}...${tweet[2].slice(38)} ·

                            ${tweet[4]}
                            `  
                          }
                      </div>
                  </div>
                  <div className="tweetContent">
                  {tweet[0]}
                  {tweet[1] !== "No Img" ? (
                          <img
                            src={tweet[1]}
                            className="tweetImg"
                          ></img>
                        ) : null}
                  </div>
                  {tweet?.[10] >= 0 ? <TweetInFeed detail={true} id={tweet?.[10]}/> : null}
                  
                  <div className="interactions">
                    <Link to={`/comment/${tweet[9]}`} className="link"> 
                    <div className="interactionNums">
                      <Icon fill="#3f3f3f" size={20} svg="messageCircle" />
                      {tweet?.[8].length}
                    </div>
                    </Link>
                    <div className="interactionNums" onClick={(e) => {onClickStar(index, tweet?.[9])}}>
                      <Icon fill={color?.[index]} size={20} svg="star" />
                      {stars[index]}
                    </div>
                    <div className="interactionNums" onClick={e => {
                      setSelectedTweet(tweet?.[9])
                      setVisible(true);}}>
                      <Icon fill="#3f3f3f" size={20} svg="matic" />
                    </div>
                  </div>
                </div>

                {selectedTweet && (
                
                <Modal onCloseButtonPressed={() => setVisible(false)}
                      isVisible={visible}
                      hasFooter={false}
                      width="700px"> 
                  <h1>Retweet</h1>
                  <div className="modal">
                    <Addbar retweet={true} id={tweet?.[9]}/>
                  </div>
                </Modal>
                
                )}
              </div>
            </>
          );

        }
      ).reverse()}    
    </>
  );
};

export default TweetInFeed;
