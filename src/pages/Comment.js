import { TextArea, Icon, Input } from "web3uikit";
import "./Comment.css";
import TweetInFeed from "../components/TweetInFeed"
import { defaultImgs } from "../defaultimgs";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config';
import { useMoralis } from "react-moralis";
import Web3 from 'web3';
import { useState, useEffect, useRef } from "react"
  
  function Comment({ comment }) {

    const { Moralis } = useMoralis();

    const { id } = useParams()
    const [tweet, setTweet] = useState()
    const inputFile = useRef(null);
    const [selectedFile, setSelectedFile] = useState();
    const [theFile, setTheFile] = useState();
    const [account, setAccount] = useState();
    const [info, setInfo] = useState()
    const navigate = useNavigate()

    const web3 = new Web3(Web3.givenProvider || 'http://localhost:3000');
    const contractList = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    useEffect(() => {
        async function loadAccount() {
          const accounts = await web3.eth.requestAccounts();
          setAccount(accounts[0])
    
          const info = await contractList.methods.getProfile(accounts[0]).call();
          setInfo(info)
        }
        loadAccount()
      }, [])
    
      async function addComment() {
    
        let img;
        if (theFile) {
          const data = theFile;
          const file = new Moralis.File(data.name, data);
          await file.saveIPFS();
          img = file.ipfs();
        }else{
          img = "No Img"
        }
    
        let dateNow = new Date().toLocaleString() + ''
    
        await contractList.methods.addComment(id, tweet, img, dateNow).send({from: account})
        window.location.reload();
      }
    
      const onImageClick = () => {
        inputFile.current.click();
      };
    
      const changeHandler = (event) => {
        const img = event.target.files[0];
        setTheFile(img);
        setSelectedFile(URL.createObjectURL(img));
      };

      const clickBack = () => {
        navigate(-1)
      }

    return (
        <>
            <div className="pageIdentify">
                <div class="back-icon-comment" onClick={clickBack}>
                    <Icon svg="chevronLeft" fill="white" size="30"/>
                </div>
                Tweet
            </div>
            <div className="mainContent">
                
                <TweetInFeed detail={true} id={id}/>
                <h2>Reply</h2>
                <div className="profileTweet">
                    <img src={info?.[2] !== "" ? info?.[2] : defaultImgs[0]} className="profilePic" alt="Avatar"></img>
                    <div className="tweetBox">
                    <TextArea
                        label="Your Reply"
                        name="tweetTxtArea"
                        placeholder="Tweet your reply"
                        type="text"
                        onChange={(e) => setTweet(e.target.value)}
                        width="95%"
                    ></TextArea>
                    {selectedFile && (
                        <img src={selectedFile} className="tweetImg"></img>
                    )}
                    <div className="imgOrTweet">
                        <div className="imgDiv" onClick={onImageClick}>
                            <input
                                type="file"
                                name="file"
                                ref={inputFile}
                                onChange={changeHandler}
                                style={{ display: "none"}}
                            />
                            <Icon fill="#1DA1F2" size={20} svg="image"></Icon>
                        </div>
                            <div className="tweetOptions">
                                <div className="tweet" onClick={addComment} style={{ backgroundColor: "#8247e5" }}>
                                    <Icon fill="#ffffff" size={20} svg="eth" title="Tweet" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <h2>Comments</h2>
                <TweetInFeed comment={true} owner={id}/>
            </div>
        </>
    );
  }
  
  export default Comment;