import React, { Component } from 'react';
import styled,{css} from 'styled-components';

// Navbar child logo element
const Logo = styled.div`
    font-size: 1.5em;
`
// Navbar child Controlbtn element
const Controlbtn = styled.div`
    cursor: pointer;
    ${props => props.active && css`
    text-shadow: 0px 0px 60px #03ff03;
  `} 
`

// Navbar parent element
const Bar = styled.div`
  display: grid; 
  margin-bottom: 40px;
  grid-template-columns: 180px auto 100px 100px;
`
// create the composed component
export default function () {
    return (<Bar>
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
  </Bar>)
}