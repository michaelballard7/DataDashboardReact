import React, { Component } from 'react';
import './App.css';
import styled from 'styled-components'


const CustomElement = styled.div `
  color: green;
  font-size: 30px;

`


const BlueElement = CustomElement.extend` 
  color: blue;

`

// this is the parent component
class App extends Component {
  render() {
    // here are the child components
    return (
      <div>
        <CustomElement>
          Hello Green
        </CustomElement>
        <BlueElement>
          Hello Blue
        </BlueElement>
       </div>
    );
  }
}

export default App;
