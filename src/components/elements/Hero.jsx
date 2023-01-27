import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { useWeb3React } from "@web3-react/core";
import { connectors } from "../utils/Connectors";
import Card from 'react-bootstrap/Card';
import { Button, Col } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const Hero = () => {
  const [smShow, setSmShow] = useState(false);
  const { activate, deactivate, active, chainId, account } = useWeb3React();
  const { library } = useWeb3React();

  const [value, setValue] = useState('');

  const handleSelect = (e) => {
    setValue(e)
  }

  function truncate(text, startChars, endChars, maxLength) {
    if (text.length > maxLength) {
      var start = text.substring(0, startChars);
      var end = text.substring(text.length - endChars, text.length);
      while ((start.length + end.length) < maxLength) {
        start = start + '.';
      }
      return start + end;
    }
    return text;
  }
  
  const truncateAccount = truncate(`${account}`, 2, 2, 8);

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${Number(97).toString(16)}` }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${Number(97).toString(16)}`,
                rpcUrls: ["https://data-seed-prebsc-2-s1.binance.org:8545"],
                chainName: " Smart Chain - Testnet",
                nativeCurrency: { name: "BSC Testnet", decimals: 18, symbol: "BNB" },
                blockExplorerUrls: ["https://testnet.bscscan.com/"],
              }
            ],
          });
        } catch (error) {
          console.error(error)
        }
      }
    }
  };

  return (
    <div className="Hero-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div>Connection Status: {active}</div>
            <div>Account: {truncateAccount}</div>
            <div>Network ID: {chainId}</div>

            {active ?
              <button className="btn btn-outline-danger my-5" onClick={deactivate}>Disconnect</button> :
              <button className="btn btn-outline-success my-5" onClick={() => setSmShow(true)}>Connect</button>
            }

            <Modal
              size="sm"
              show={smShow}
              onHide={() => setSmShow(false)}
              aria-labelledby="example-modal-sizes-title-lg">
              <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                  Wallet Connections
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="btns-group text-center">
                  <div className="btn-style">
                    <button className="btn btn-outline-primary mb-3" onClick={() => { activate(connectors.Injected); setSmShow(false) }}>Metamask</button>
                  </div>
                  <div className="btn-style">
                    <button className="btn btn-outline-primary mb-3" onClick={() => { activate(connectors.CoinbaseWallet); setSmShow(false) }}>Coinbase Wallet</button>
                  </div>
                  <div className="btn-style">
                    <button className="btn btn-outline-primary mb-3" onClick={() => { activate(connectors.WalletConnect); setSmShow(false) }}>Wallet Connect</button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>

            {active && (
              <Col className="text-center">
                <Card border="secondary" style={{ width: '18rem' }}>
                  <Card.Body>
                    <Card.Title>Switch Newtwork</Card.Title>
                    <Button variant="outline-info" onClick={switchNetwork} disabled={!value}>Switch</Button>
                    <DropdownButton id="dropdown-basic-button" size="sm" className="mt-3" title={value ? value : 'Select Type'} onSelect={handleSelect} >
                      <Dropdown.Item eventKey="BNB">BNB</Dropdown.Item>
                    </DropdownButton>
                  </Card.Body>
                </Card>
              </Col>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
