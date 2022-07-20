import React from 'react'
import './Search.css';
import { Input, Button, Icon } from 'web3uikit';
import TweetInFeed from "../components/TweetInFeed"
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";



const Search = () => {

  const [search, setSearch] = useState();
  const navigate = useNavigate();
  const { searchNow } = useParams();

  function clickSearch() {
    navigate(`/search/${search}`)
  }

  const clickBack = () => {
    navigate(-1)
  }

  return (
    <>  
        <div className="pageIdentify">
        <div class="back-icon-comment" onClick={clickBack}>
          <Icon svg="chevronLeft" fill="white" size="60"/>
        </div>
        <header className='search-header'>

            <Input
                label="Search a name"
                name="Search bar"
                // onBlur={function noRefCheck(){}}
                onChange={((e) => {
                    setSearch(e.target.value)
                })}
                width="500px"
                labelBgColor="#141d26" 
                prefixIcon="search"
                value={searchNow}
            />

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
        </header>
        </div>
        
        <h2>Tweets</h2>
        <TweetInFeed search={true} searchText={searchNow} />
    </>
  );
}

export default Search