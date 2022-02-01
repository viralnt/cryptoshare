const express = require('express');
const app = express();
const port = 3000;
var a="";
const { LCDClient, Coin, MsgSend, MnemonicKey} = require('@terra-money/terra.js');

const terra = new LCDClient({

  URL: 'https://bombay-lcd.terra.dev',
  chainID: 'bombay-12',

});
app.get('/createtransaction', (req, res) => {
async function call() {

    const marketParams = await terra.market.parameters();

    const exchangeRates = await terra.oracle.exchangeRates();

    console.log(marketParams.base_pool);//output:7000000000000
//a=a+marketParams.base_pool+"<br/>";
    console.log(exchangeRates.get('uusd'));
    //output:Coin { denom: 'uusd', amount: 51.082904565265863751 }
//a=a+exchangeRates.get('uusd')+"<br/>";
}

call();



// get the current swap rate from 1 TerraUSD to TerraKRW
const offerCoin = new Coin('uusd', '1000000');
terra.market.swapRate(offerCoin, 'ukrw').then(c => {
  console.log(`${offerCoin.toString()} can be swapped for ${c.toString()}`);
//  a=a+`${offerCoin.toString()} can be swapped for ${c.toString()}`+"<br/>";
});

// create a key out of a mnemonic
const mk = new MnemonicKey({
  mnemonic:
    'notice oak worry limit wrap speak medal online prefer cluster roof addict wrist behave treat actual wasp year salad speed social layer crew genius',
});

// a wallet can be created out of any key
// wallets abstract transaction building
const wallet = terra.wallet(mk);

// create a simple message that moves coin balances
const send = new MsgSend(
  'terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v',
  'terra17lmam6zguazs5q5u6z5mmx76uj63gldnse2pdp',
  { uluna: 1000000, ukrw: 1230201, uusd: 1312029 }
);

wallet
  .createAndSignTx({
    msgs: [send],
    memo: 'Terra Transaction for February 2022!!',
  })
  .then(tx => terra.tx.broadcast(tx))
  .then(result => {
    console.log(`TX hash: ${result.txhash}`);
	a=a+`TX hash: ${result.txhash}`+`<br/>memo: 'Terra Transaction for February 2022!!' <br/>Transaction From Account: 'terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v'<br/>Transaction To Account: 'terra17lmam6zguazs5q5u6z5mmx76uj63gldnse2pdp'<br/>Amount: { uluna: 1000000, ukrw: 1230201, uusd: 1312029 }`;
	res.send(a);
  a=""
  });
  
    }); 

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))
