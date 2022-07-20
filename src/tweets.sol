// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract tweets {

    address public owner;
    uint256 private counter;

    constructor() {
        counter = 0;
        owner = msg.sender;
     }

    struct profile {
        string name;
        string bio;
        string avatar;
        string banner;
    }

    struct tweet {
        address tweeter;
        uint256 id;
        string tweetTxt;
        string tweetImg;
        uint256 countStarred;
        string dateCreated;  
        uint256[] comments;
        bool isComment;
    }

    event tweetCreated (
        address tweeter,
        uint256 id,
        string tweetTxt,
        string tweetImg,
        uint256 countStarred,
        string dateCreated,
        uint256[] comments,
        bool isComment,
        int256 reTweet
    );

    mapping(uint256 => tweet) Tweets;
    mapping(address => mapping(uint256 => bool)) starred;
    mapping(address => profile) userInfo;
    mapping(uint256 => int256) reTweeter;

    function changeProfile(string memory name, string memory bio) public {
        profile storage newProfile = userInfo[msg.sender];
        newProfile.name = name;
        newProfile.bio = bio;
    }

    function changeAvatar(string memory avatar) public {
        profile storage newProfile = userInfo[msg.sender];
        newProfile.avatar = avatar;
    }

    function changeBanner(string memory banner) public {
        profile storage newProfile = userInfo[msg.sender];
        newProfile.banner = banner;
    }

    function getProfile(address add) public view returns(string memory, string memory, string memory, string memory) {
        profile storage p = userInfo[add];
        return(p.name, p.bio, p.avatar, p.banner);
    }

    function addTweet(
        string memory tweetTxt,
        string memory tweetImg,
        string memory dateNow
        ) public payable {
            require(msg.value > (0.001 ether), "Please submit at least 0.002 ether");
            tweet storage newTweet = Tweets[counter];
            newTweet.tweetTxt = tweetTxt;
            newTweet.tweetImg = tweetImg;
            newTweet.tweeter = msg.sender;
            newTweet.id = counter;
            newTweet.dateCreated = dateNow;
            newTweet.countStarred = 0;
            newTweet.isComment = false;
            reTweeter[counter] = -1;
            emit tweetCreated(
                msg.sender, 
                counter, 
                tweetTxt, 
                tweetImg,
                0,
                dateNow,
                newTweet.comments,
                false,
                -1
            );
            counter++;

            payable(owner).transfer(msg.value);
    }

    function getTweetwithInfo(uint256 id) public view returns (string memory, string memory, address, uint256, string memory, string memory, string memory, bool, uint256[] memory, uint256, int256){
        require(id < counter, "No such Tweet");

        tweet storage t = Tweets[id];
        profile storage p = userInfo[t.tweeter];
 
        return (t.tweetTxt, t.tweetImg, t.tweeter, t.countStarred, t.dateCreated, p.name, p.avatar, t.isComment, t.comments, t.id, reTweeter[t.id]);
    }

    function getUserTweet(address add) public view returns (uint256[] memory, uint256) {
        uint256 count=0;
        tweet storage t;
        for (uint i=0; i<counter; i++) {
            t = Tweets[i];
            if(t.tweeter == add) {
                count++;
            }
        }

        uint256[] memory listTweet = new uint256[](count);
        uint256 c = 0;
        for (uint256 i = 0; i < counter; i++) {
            t = Tweets[i];
            if (t.tweeter == add) {
                listTweet[c] = i;
                c++;
            }
        }
        return (listTweet, count);
    }

     function star(uint256 id) public {
        require(id < counter, "No such Tweet");
        require(starred[msg.sender][id] == false);
        tweet storage t = Tweets[id];
        t.countStarred++;
        starred[msg.sender][id] = true;
    }

    function unStar(uint256 id) public {
        require(id < counter, "No such Tweet");
        require(starred[msg.sender][id] == true);
        tweet storage t = Tweets[id];
        t.countStarred--;
        starred[msg.sender][id] = false;
    }

    function getStar(uint256 id) public view returns(uint256) {
        require(id < counter, "No such Tweet");
        return Tweets[id].countStarred;
    }

    function whoStar(uint256 id) public view returns(bool) {
        if (starred[msg.sender][id] == false) {
            return (false);
        } else {
            return (true);
        }
    }

    function getCounter() public view returns(uint256) {
        uint256 count;
        count = counter;
        return (count);
    }

    function contains(string memory what, string memory where)
        internal
        pure
        returns (bool)
    {
        bytes memory whatBytes = bytes(what);
        bytes memory whereBytes = bytes(where);

        if (whereBytes.length < whatBytes.length) return false;

        bool found = false;
        for (uint256 i = 0; i <= whereBytes.length - whatBytes.length; i++) {
            bool flag = true;
            for (uint256 j = 0; j < whatBytes.length; j++)
                if (whereBytes[i + j] != whatBytes[j]) {
                    flag = false;
                    break;
                }
            if (flag) {
                found = true;
                break;
            }
        }
        return found;
    }

    //searchTweet tra ve 1 list ID cac tweet co chua chuoi txt -> dung getTweet de lay tung tweet
    function searchTweet(string memory txt)
        public
        view
        returns (uint256[] memory, uint256)
    {
        tweet storage t;
        uint256 count = 0;
        for (uint256 i = 0; i < counter; i++) {
            t = Tweets[i];
            if (contains(txt, t.tweetTxt)) {
                count++;
            }
        }
        uint256[] memory listTweet = new uint256[](count);
        uint256 c = 0;
        for (uint256 i = 0; i < counter; i++) {
            t = Tweets[i];
            if (contains(txt, t.tweetTxt)) {
                listTweet[c] = i;
                c++;
            }
        }
        return (listTweet, count);
    }

    function addComment(uint256 id,string memory tweetTxt, string memory tweetImg, string memory dateNow) public {
        require(id < counter, "No such Tweet");

        tweet storage newTweet = Tweets[counter];
        tweet storage cmtForTweet = Tweets[id];

        newTweet.tweetTxt = tweetTxt;
        newTweet.tweetImg = tweetImg;
        newTweet.tweeter = msg.sender;
        newTweet.id = counter;
        newTweet.dateCreated = dateNow;
        newTweet.countStarred = 0;
        newTweet.isComment = true;
        reTweeter[counter] = -1;

        cmtForTweet.comments.push(counter);

        emit tweetCreated(
                msg.sender, 
                counter, 
                tweetTxt, 
                tweetImg,
                0,
                dateNow,
                newTweet.comments,
                true,
                -1
            );
        
        counter++;

    }

    function reTweet(uint256 id,string memory tweetTxt, string memory tweetImg, string memory dateNow) public {
        require(id < counter, "No such Tweet");

        tweet storage newTweet = Tweets[counter];

        newTweet.tweetTxt = tweetTxt;
        newTweet.tweetImg = tweetImg;
        newTweet.tweeter = msg.sender;
        newTweet.id = counter;
        newTweet.dateCreated = dateNow;
        newTweet.countStarred = 0;
        newTweet.isComment = false;
  
        reTweeter[counter] = int256(id);

        emit tweetCreated(
                msg.sender, 
                counter, 
                tweetTxt, 
                tweetImg,
                0,
                dateNow,
                newTweet.comments,
                false,
                int256(id)
            );
        
        counter++;
    }
}

    
