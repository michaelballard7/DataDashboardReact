import React, { Component } from 'react';
import './App.css';
import styled,{css} from 'styled-components'
import AppBar from './appbar.js'
import Search from './Search'
import Dashboard from './Dashboard'
import CoinList from './CoinList.js'
import {ConfirmButton} from './Button.js'
import fuzzy from 'fuzzy'
import _ from 'lodash'
import moment from 'moment';

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
const TIME_UNITS = 10

const checkFirstVisit = () => {
  let assetDash = JSON.parse(localStorage.getItem('assetDash'))
  if(!assetDash){
    return {
      firstVisit: true,
      page: 'settings'
    }
  }
  let {favorites, currentFavorite} = assetDash;
  return {
    favorites,
    currentFavorite
  }
}

// this is the parent component
class App extends Component {
  // set state in this object which is refereence in the component render
  state = {
    page: 'dashboard',
    favorites: ['ETH', 'BTC', 'XMR', 'DOGE', 'EOS'],
    ...checkFirstVisit()  // study the uses of the spread
  }

  componentDidMount = () => {
    this.fetchHistorical();
    this.fetchCoins();
    this.fetchPrices();

  }

  fetchCoins = async () =>{
    let coinList = (await cc.coinList()).Data;
    this.setState({coinList});
    console.log("The algo is",coinList['BTC'].Algorithm)
    console.log("Coin list is active")
  }

  fetchHistorical = async () => {
    if (this.state.currentFavorite){
      let results = await this.historical();
      let historical = [{
        name: this.state.currentFavorite,
        data: results.map((ticker, index) => [moment().subtract({months:TIME_UNITS - index}).valueOf(), ticker.USD])
      }]
      this.setState({historical});

    }
  }

  historical = () => {
    let promises = [];
    for(let units = TIME_UNITS; units>0; units--){
      promises.push(cc.priceHistorical(this.state.currentFavorite, ['USD'], moment().subtract({months: units}).toDate()))
    }
    return Promise.all(promises)
  }

  fetchPrices = async () => {
    let prices;
    try {
      prices = await this.prices();
    } catch(e){
      this.setState({error: true});
    }
    this.setState({prices})
  }

  prices = () => {
    let promises = [];
    this.state.favorites.forEach(sym => {
      promises.push(cc.priceFull(sym,'USD'))
    });
    return Promise.all(promises)
  }

  // define a helper functions to determine what state is active on the page
  displayingDashboard = () => this.state.page === 'dashboard'
  displayingSetting = () => this.state.page === 'settings'

  // define a helper function to determine if this is the first visit
  firstVisitMessage = () => {
    if(this.state.firstVisit){
      return ( <div>Welcome to AssetDash, please select coins you want to follow!</div>)
    }
  }

  // define a helper function to establish local storage
  confirmFavorites = ()=> {
    let currentFavorite = this.state.favorites[0]
    this.setState({
      firstVisit: false,
      page: 'dashboard',
      prices: null,
      currentFavorite,
      historical: null
    }, ()=>{
      this.fetchPrices()
      this.fetchHistorical()
    })

    localStorage.setItem('assetDash', JSON.stringify({
      favorites: this.state.favorites,
      currentFavorite
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
              Display your searched coins:
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
    if (!this.state.prices){
      return <div> Loading Prices </div>
    }
  }

  iWantANewLife = (word) => {
    console.log("I am not thrilled with what happening here")
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
        {this.displayingDashboard() && Dashboard.call(this)}
      </Content>}
     </AppLayout>
      );
  }
}

export default App;
