import React, { Component } from 'react';
import './App.css';
import styled from 'styled-components'


const Logo = styled.div`
  font-size: 1.5em;
`

const Controlbtn = styled.div`
 
`

const AppLayout = styled.div`
  padding: 40pct;
  display: grid;
  grid-template-columns: 100px auto 100px 100px;

`

// this is the parent component
class App extends Component {
  render() {
    // here are the child components
    return (
      // Parent component???
     <AppLayout>
       <Logo >
         AssetDash
       </Logo>
       <div>
       </div>
       <Controlbtn>
         Dashboard
       </Controlbtn>
       <Controlbtn >
         Settings
       </Controlbtn>
     </AppLayout>
      
      );
  }
}

export default App;
