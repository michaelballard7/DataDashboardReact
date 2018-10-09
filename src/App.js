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
  `
  }
  

`

const AppLayout = styled.div`
  padding: 40pct; 

`
const Bar = styled.div`
  display: grid; 
  margin-bottom: 40px;
  grid-template-columns: 180px auto 100px 100px;

`

const Content = styled.div` 

`

// this is the parent component
class App extends Component {

  // set state in this object which is refereence in the component render
  state = {
    page: 'dashboard'
  }

  // define a helpers to under what is active on the page
  displayingDashboard = () => this.state.page === 'dashboard'
  displayingSetting = () => this.state.page === 'settings'

  render() {
    // here are the child components
    return (
      // Parent component!!!
      // below begins a JSX block
    <AppLayout> 
      <Bar>
        <Logo >
          AssetDash
        </Logo>
        <div>
        </div>
        {/* add a click handler and define what state is */}
        <Controlbtn onClick = {()=>{this.setState({page: 'dashboard'})}} active={this.displayingDashboard()}>
          Dashboard
        </Controlbtn>
        <Controlbtn onClick = {()=>{this.setState({page: 'settings'})}} active={this.displayingSetting()}>
          Settings
        </Controlbtn>
      </Bar>
      <Content>
        Hi Im {this.state.page}
      </Content>
     </AppLayout>
      );
  }
}

export default App;
