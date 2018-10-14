import React, { Component } from 'react';
import './App.css';
import styled,{css} from 'styled-components'


const Logo = styled.div`
  font-size: 1.5em;
`

const Controlbtn = styled.div`
  cursor: pointer;
  ${props => props.active && css`
    text-shadow: 0px 0px 60px #03ff03;
  `} 
`
const AppLayout = styled.div`
  padding: 40px; 
`
const Bar = styled.div`
  display: grid; 
  margin-bottom: 40px;
  grid-template-columns: 180px auto 100px 100px;
`
const Content = styled.div` 
`

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
    page: 'dashboard',
    ...checkFirstVisit()
  }
  // define a helper function to determine what state is active on the page
  displayingDashboard = () => this.state.page === 'dashboard'
  displayingSetting = () => this.state.page === 'settings'
  firstVisitMessage = () => {
    if(this.state.firstVisit){
      return ( <div>Welcome to AssetDash, please select your favorite coins to begin!</div>)
    }
  }

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
          Confirm Favorites
        </div>
      </div>
    )
  }


  render() {
    // here are the child components
    return (
      // Parent component!!!
      // below begins a JSX block
    <AppLayout> 
      <Bar>
        <Logo>
          AssetDash
        </Logo>
        <div>
        </div>
        {/* add a click handler and define what state is */}
       {!this.state.firstVisit && ( <Controlbtn onClick = {()=>{this.setState({page: 'dashboard'})}} active={this.displayingDashboard()}>
          Dashboard
        </Controlbtn>)}
        <Controlbtn onClick = {()=>{this.setState({page: 'settings'})}} active={this.displayingSetting()}>
          Settings
        </Controlbtn>
      </Bar>
      <Content>
        {this.displayingSetting() && this.settingsContent()}
      </Content>
     </AppLayout>
      );
  }
}

export default App;
