import React, { Component } from 'react';
import styled,{css} from 'styled-components'
import {subtleBoxShadow,greenBoxShadow,lightBlueBackground} from './Style'


// create the css grid layout
const CoinGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr  1fr;
    grid-gap: 15px;
    margin-top: 40px;
`

const CoinTile = styled.div`
    ${subtleBoxShadow}
    ${lightBlueBackground}
    padding: 10px;
    &:hover{
        cursor: pointer;
        ${greenBoxShadow}
    }
`

const CoinHeaderGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;

`

const CoinSymbol = styled.div`
    justify-self: right;
`

export default function(){
    console.log('Sammple', this.state.coinList['BTC'])
    return <CoinGrid>
        {Object.keys(this.state.coinList).slice(0,1000).map(coin =>
            <CoinTile>
                <CoinHeaderGrid>
                    <div> {this.state.coinList[coin].CoinName}</div>
                    <CoinSymbol> {this.state.coinList[coin].Symbol}</CoinSymbol>
               </CoinHeaderGrid>
                {<img style={{height: '50px'}} src={`http://cryptocompare.com/${this.state.coinList[coin].ImageUrl}`}/>}
            </CoinTile>
            
            )}
        
         </CoinGrid>
}