import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import ApadAbi from '../contractsData/Alienpad.json'
import ApadAddress from '../contractsData/Alienpad-address.json'
import ExchangeAbi from '../contractsData/Exchange.json'
import ExchangeAddress from '../contractsData/Exchange-address.json'

const Buy = () => {
  useEffect(() => {
    loadweb3()
    loadblockchaindata()
  }, [])

  const [loader, setLoader] = useState(true)
  const [currentAccount, setCurrentAccount] = useState()
  const [exchangeinstance, setExchangeInstance] = useState({})
  const [balanceineth, setBalanceInEth] = useState(null)
  const [userapadbalance, setUserApadBalance] = useState(null)
  const [etheramountvalue , setEtherAmountValue] = useState()
  const [apadamount , setApadAmount] = useState()

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
    console.log(parseFloat(etheramountvalue))
    if(parseFloat(etheramountvalue) > 0){
     await  buy(etheramountvalue)
    }else{
      window.alert("null value not allowed")
    }
  }

  const buy = async(a)=>{

    const web3 = new Web3(window.ethereum);
 
    const amountofethinwei = await web3.utils.toWei(a.toString())
    await exchangeinstance.methods
    .buy().send({from : currentAccount,value : amountofethinwei})
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
              <a class="btn btn-primary" href="/buy">
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
          <p className="float-right"> ETH: {balanceineth}</p>
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="Enter amount in Ether"
              value={etheramountvalue}
              onChange={(event)=>{
                setEtherAmountValue(event.target.value)
                const etherAmount = event.target.value.toString();
                setApadAmount(etherAmount * 1600);
              }}
            />
            <span class="input-group-text" id="basic-addon2">
              Ether
            </span>
          </div>
          <p>Apad:{userapadbalance} </p>

          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              value={apadamount}
              placeholder="Enter amount in Apad token"
            />
            <span class="input-group-text" id="basic-addon2">
              Apad
            </span>
          </div>
          <button type="button" class="btn btn-dark "onClick={onsubmit}>Buy</button>
        </div>
      </div>
    </div>
  )
}

export default Buy
