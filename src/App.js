import React, { Component } from 'react';
import './App.css';
import styled,{css} from 'styled-components'
import AppBar from './appbar.js'
import CoinList from './CoinList.js'
import _ from 'lodash'
const cc = require('cryptocompare')

const AppLayout = styled.div`
  padding: 40px; 
`

const Content = styled.div` 
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
    localStorage.setItem('assetDash', 'test');
    this.setState({
      firstVisit: false,
      page: 'dashboard'
    })
  }


  settingsContent = () =>{
    return (
      <div>
        {this.firstVisitMessage()}
        <div onClick={this.confirmFavorites}>
          Choose Favorite Coins: 
        </div>
        <div>
          {CoinList.call(this, true)}
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

  isInFavorites = (key)=>{
    return _.includes(this.state.favorites, key)

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
