import React from 'react';
import { useEffect, useState, useRef } from 'react';
import Web3 from 'web3';
import { STAKING_UTILS } from './config';
import MyContract from './Staking.json';

// css, images, fonts
import logo from './images/bitcoin.png';
import metamaskImg from './images/metamask.png'


function App() {
  const [account, setAccount] = useState(false); // state variable to set account.
  const [amountStake, setAmountStake] = useState("");
  const [blockNumber, setBlockNumber] = useState("");
  const [stakingReward, setStakingReward] = useState("Nothing here");
  const [stakingId, setStakingId] = useState(null);
  const [accountSlice, setAccountSlice] = useState(null);
  const [events, setEvents] = useState(null);

  useEffect(() => {
    async function load() {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const accounts = await web3.eth.requestAccounts();
      const accountOnline = accounts[0];
      const sliceString = accounts[0].slice(0, 6).concat('...', accounts[0].slice(7, 11));
      setAccountSlice(sliceString);
      setAccount(accountOnline);
      console.log(accountOnline, 'account in first ')
    }
    load();
  }, []);

  useEffect(() => {
    async function loadBalance(account) {
      console.log(account, 'asdasdsas')
      const accountBalance = await myContractWeb3.methods.balanceOf(account).call();
      const stakeEther = web3.utils.fromWei(accountBalance.toString(), 'ether')

      setStakingReward(stakeEther)
      console.log(accountBalance, 'acount balance')
    }

    if (account != false) {
      loadBalance(account);
      connectEth();
      console.log(connectEth(), 'connectEth function running here')
    }

  }, [account])


  const connectEth = async () => {
    const myContractWeb3 = new web3.eth.Contract(MyContract.abi, '0x4c83a3fd89dab9abc40b2fd59c32edc4fc8dac4f', {
      from: account,
      gasPrice: '100000000000',
      gas: 1000000
    });
  }



  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');

  const myContractWeb3 = new web3.eth.Contract(MyContract.abi, '0x4c83a3fd89dab9abc40b2fd59c32edc4fc8dac4f', {
    from: account,
    gasPrice: '100000000000',
    gas: 1000000
  });

  const handleWithdraw = async (e) => {
    e.preventDefault();
    console.log(account, 'account in handleWithdraw')
    let id = await myContractWeb3.getPastEvents('StakeAdded', {
      fromBlock: 0,
      toBlock: 'latest'
    }, (error, event) => {
      if (!error) {
        let obj = JSON.parse(JSON.stringify(event));
        let array = Object.keys(obj)
        let queue = [];
        for (let i = 0; i < obj.length; i++) {
          if (obj[array[i]].returnValues.owner == account) {
            queue.push(obj[array[i]].returnValues.stakeId);
            console.log(obj[array[i]].returnValues.stakeId, 'this is staking id');
          }
        }
        const result = myContractWeb3.methods.withdrawEth([queue[queue.length - 1 ]]).send({
          from: account,
        }).then(console.log);
      }
    });
  }

  const handleStake = async (e) => {
    console.log(account, 'account in handleStake')
    e.preventDefault();
    const unlockAfterBlock = web3.utils.toBN(blockNumber);
    const stakeAmount = web3.utils.toWei(amountStake, 'ether');

    const result = await myContractWeb3.methods.stakeEth(unlockAfterBlock).send({
      from: account,
      value: stakeAmount
    }).then(console.log);
  }


  return (
    <div>

      <div className="uk-section-default tm-section-texture">

        <div uk-sticky="media: 960" className="uk-navbar-container tm-navbar-container uk-navbar-transparent uk-sticky uk-sticky-fixed" style={{ position: "fixed", top: "0px", width: "1186px", fontFamily: "Inter", fontWeight: "600" }}>
          <div className="uk-container uk-container-expand">
            <nav className="uk-navbar uk-navbar-center">
              <div className="uk-navbar-center">
                <ul className="uk-navbar-nav uk-visible@m">
                  <li>
                    <a> Stake </a>
                  </li>
                  <li>
                    <a href="#">Pools</a>
                  </li>
                  <li>
                    <a href="docs/introduction">Swap</a>
                  </li>
                  <li>
                    <a href="#">Vote</a>
                  </li>
                </ul>

                <div className="uk-navbar-item uk-visible@m">
                  <a href="/download"
                    style={{ borderRadius: "500px", borderRadius: "10px", border: "1px solid #000000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} className="uk-button uk-button-default tm-button-default uk-icon ">
                    <img src={metamaskImg} style={{ height: "19px", width: "19px", display: "-webkit-inline-box", marginRight: "5px" }} />
                    {accountSlice}
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </div>


        <div uk-height-viewport="offset-top: true; offset-bottom: true" className="uk-section uk-section-small uk-flex uk-flex-middle uk-text-center" style={{ minHeight: "calc((100vh - 80px) - 102.5px)" }}>

          <div
            className="uk-width-1-1"
            style={{
              position: "absolute",
              top: "150px"
            }}
          >
            <div className="uk-container">
              <h1 className="uk-text-lead" style={{ fontFamily: "Inter", fontWeight: "400" }}>Stake</h1>
              <p className="uk-text-center">
                <img
                  className="uk-margin-medium"
                  style={{ height: "180px", width: "100px", display: "-webkit-inline-box" }}
                  src={logo} />
              </p>
              <div className="uk-card uk-card-default uk-card-body uk-width-1-2@m" style={{ borderRadius: "32px", display: "inline-block" }}>
                <form onSubmit={handleStake}>
                  <fieldset className="uk-fieldset">
                    <legend className="uk-legend">RWRD</legend>
                    <div className="uk-margin">
                      <div className="uk-column-1-2">
                        <p>Deposit </p>
                        <p>Balance:  {stakingReward} </p>
                      </div>
                      <input
                        className="uk-input"
                        type="number"
                        style={{
                          borderRadius: "18px",
                          textAlign: "right"
                        }}
                        placeholder="Eth"
                        value={amountStake}
                        onChange={e => setAmountStake(e.target.value)}
                      />
                    </div>

                    <div className="uk-margin">
                      <p>Blocks </p>
                      <input
                        className="uk-input"
                        type="number"
                        style={{
                          borderRadius: "18px",
                          textAlign: "right"
                        }}
                        placeholder="Blocks"
                        value={blockNumber}
                        onChange={e => setBlockNumber(e.target.value)}
                      />
                    </div>
                    <div uk-grid="" className="uk-child-width-auto uk-grid-medium uk-flex-inline uk-flex-center uk-grid">
                      <div className="uk-first-column">

                        <input
                          type="submit"
                          value="Stake"
                          className="uk-button uk-button-secondary tm-button-primary uk-button-large tm-button-large uk-visible@s"
                          style={{ borderRadius: "16px", fontFamily: "Nunito", fontWeight: "400" }}
                        />
                      </div>
                    </div>

                    <button
                      className="uk-button uk-button-default tm-button-default uk-button-large tm-button-large uk-visible@s"
                      style={{
                        marginLeft: "30px",
                        borderRadius: "16px"
                      }}
                      onClick={handleWithdraw}
                    >
                      withdraw
                    </button>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;