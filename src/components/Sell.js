import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import ApadAbi from '../contractsData/Alienpad.json'
import ApadAddress from '../contractsData/Alienpad-address.json'
import ExchangeAbi from '../contractsData/Exchange.json'
import ExchangeAddress from '../contractsData/Exchange-address.json'

const Sell = () => {

    useEffect(() => {
        loadweb3()
        loadblockchaindata()
      }, [])


  const [loader, setLoader] = useState(true)
  const [currentAccount, setCurrentAccount] = useState()
  const [exchangeinstance, setExchangeInstance] = useState({})
  const [balanceineth, setBalanceInEth] = useState(null)
  const [userapadbalance, setUserApadBalance] = useState(null)
  const [etherOutput , setEtherOutput] = useState()
  const [TokenAmountValue , setTokenAmountValue] = useState()


  const loadweb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('metamask not found')
    }
  }

  const loadblockchaindata = async () => {
    setLoader(true)

    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()

    const account = accounts[0]
    setCurrentAccount(account)

    const networkId = await web3.eth.net.getId()

    if (networkId === 3) {
      const apad = new web3.eth.Contract(ApadAbi.abi, ApadAddress.address)
      const apadbalance = await apad.methods.balanceOf(account).call()
      const apadbalancewei  = await web3.utils.fromWei(apadbalance,'ether')
      setUserApadBalance(apadbalancewei)

      const exchange = new web3.eth.Contract(
        ExchangeAbi.abi,
        ExchangeAddress.address,
      )
      setExchangeInstance(exchange)

      const balanceofeth = await web3.eth.getBalance(account)
      setBalanceInEth(web3.utils.fromWei(balanceofeth, 'ether'))
      setLoader(false)
    } else {
      window.alert('please connect to ropsten network')
    }
  }


  const onsubmit  = async ()=>{
    console.log(parseFloat(TokenAmountValue))
    if(parseFloat(TokenAmountValue) > 0){
     await  sell(TokenAmountValue)
    }else{
      window.alert("null value not allowed")
    }
  }


  const sell = async(TokenAmountValue)=>{

    const web3 = new Web3(window.ethereum);
 
    const amount = await web3.utils.toWei(TokenAmountValue,"ether")

    await exchangeinstance.methods
    .sell(amount)
    .send({from : currentAccount})
    .once("recepient",(recepient)=>{
        window.alert("success")
    })
  }


  if (loader) {
    return (
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }


  return (
    <div className="container">
      <div class="card text-center">
        <div class="card-header">
          <ul class="nav nav-pills card-header-pills gap-3">
            <li class="nav-item">
              <a class="btn btn-primary" href="/">
                Buy
              </a>
            </li>
            <li class="nav-item">
              <a class="btn btn-primary" href="/sell">
                Sell
              </a>
            </li>
          </ul>
        </div>
        <div class="card-body ">
          <p className="float-right"> Apad: {userapadbalance}</p>
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="Enter amount in Apad"
              value={TokenAmountValue}
              onChange={(event)=>{
                setTokenAmountValue(event.target.value)
                const TokenAmount = event.target.value.toString();
                setEtherOutput(TokenAmount / 1600);
              }}
            />
            <span class="input-group-text" id="basic-addon2">
              Apad
            </span>
          </div>
          <p>Eth:{balanceineth} </p>

          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              value={etherOutput}
              placeholder="Enter amount in Eth"
            />
            <span class="input-group-text" id="basic-addon2">
              Eth
            </span>
          </div>
          <button type="button" class="btn btn-dark " onClick={onsubmit}>Sell</button>
        </div>
      </div>
    </div>
  )
}

export default Sell