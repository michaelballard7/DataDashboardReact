import React, { Component } from 'react';
import './App.css';
import styled,{css} from 'styled-components'
import AppBar from './appbar.js'
import Search from './Search'
import CoinList from './CoinList.js'
import {ConfirmButton} from './Button.js'
import fuzzy from 'fuzzy'
import _ from 'lodash'


const cc = require('cryptocompare')

const AppLayout = styled.div`
  padding: 40px; 
`

const Content = styled.div` 
`

export const CenterDiv = styled.div`
  display: grid;
  justify-content: center;

`

const MAX_FAVORITES = 10

const checkFirstVisit = () => {
  let cryptoDash = localStorage.getItem('assetDash')
  if(!cryptoDash){
    return {
      firstVisit: true, 
      page: 'settings'
    }
  }
  return {}
}

// this is the parent component
class App extends Component {
  // set state in this object which is refereence in the component render
  state = {
    page: 'settings',
    favorites: ['ETH', 'BTC', 'XMR', 'DOGE', 'EOS'],
    ...checkFirstVisit()  // study the uses of the spread
  }


  componentDidMount = () => {
    this.fetchCoins();
  }

  fetchCoins = async () =>{
    let coinList = (await cc.coinList()).Data;
    this.setState({coinList});
  }

  // define a helper functions to determine what state is active on the page
  displayingDashboard = () => this.state.page === 'dashboard'
  displayingSetting = () => this.state.page === 'settings'

  // define a helper function to determine if this is the first visit
  firstVisitMessage = () => {
    if(this.state.firstVisit){
      return ( <div>Welcome to AssetDash, please select your favorite coins to begin!</div>)
    }
  }

  // define a helper function to establish local storage
  confirmFavorites = ()=> {
    this.setState({
      firstVisit: false,
      page: 'dashboard'
    })
    localStorage.setItem('assetDash', JSON.stringify({
      favorites: this.state.favorites
    }) );
  }


  settingsContent = () =>{
    return (
      <div>
        {this.firstVisitMessage()}
        <div>
          {CoinList.call(this, true)}
          <CenterDiv>
          <ConfirmButton onClick={this.confirmFavorites}> 
              Select Coins Follow: 
           </ConfirmButton>
          </CenterDiv>
          {Search.call(this)}
          {CoinList.call(this)}
          
        </div>
      </div>
    )
  }

  loadingContent = () => {
    if(!this.state.coinList){
      return <div>
        Loading Coins
      </div>
    } 
  }


  addCoinToFavorites = (key) => {
    console.log('Adding', key)
    let favorites = [...this.state.favorites];
    if (favorites.length < MAX_FAVORITES){
      favorites.push(key)
      this.setState({favorites})
    }
  }

  removeCoinFromFavorites = (key) => {
    console.log('Removing', key)
    let favorites = [...this.state.favorites];
    this.setState({favorites:_.pull(favorites, key)}) //low dash call .pull()
  }

  isInFavorites = (key)=>  _.includes(this.state.favorites, key)

  handleFilter = _.debounce( (inputValue) => {
    let coinSymbols = Object.keys(this.state.coinList);
    let coinNames = coinSymbols.map(sym => this.state.coinList[sym].CoinName);
    let allStringsToSearch = coinSymbols.concat(coinNames);
    let fuzzyResults = fuzzy.filter(inputValue, allStringsToSearch, {}).map(result => result.string);
    let filteredCoins = _.pickBy(this.state.coinList, (result, symKey)=> {
      let coinName = result.CoinName;
      // if fuzzy results contains this symbol  or the coinName, include it (return true)
      return _.includes(fuzzyResults, symKey) || _.includes(fuzzyResults, coinName)
    })
    this.setState({filteredCoins})
  }, 500)

  filterCoins = (e) => {
    let inputValue= _.get(e, 'target.value' )
    if(!inputValue){
      this.setState({
        filteredCoins: null
      })
      return;
    }
    this.handleFilter(inputValue)
  }

  render() {
    // here are the child components
    return (
      // Parent component!!!
      // below begins a JSX block
    <AppLayout>
      {/* make a call to the appBar component module  */}
      {AppBar.call(this)}

      {this.loadingContent() || <Content>
        {this.displayingSetting() && this.settingsContent()}
      </Content>}
     </AppLayout>
      );
  }
}

export default App;
