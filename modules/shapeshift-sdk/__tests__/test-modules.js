/*
    Test module

 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let WalletClass = require('../lib/index.js')

let username = process.env['TEST_USERNAME_2'] || 'testuser'
let queryKey = process.env['TEST_QUERY_KEY_2'] || 'testkey'

let run_test = async function(){
    try{
        const unchainedUrls = {
            ['bitcoin']: {
                httpUrl: 'https://dev-api.bitcoin.shapeshift.com',
                wsUrl: 'wss://dev-api.bitcoin.shapeshift.com'
            },
            ['ethereum']: {
                httpUrl: 'https://dev-api.ethereum.shapeshift.com',
                wsUrl: 'wss://dev-api.ethereum.shapeshift.com'
            }
        }

        let config = {
            mnemonic: process.env['WALLET_MAIN'] || 'alcohol woman abuse must during monitor noble actual mixed trade anger aisle',
            username,
            spec:'TODO',
            queryKey:"asasdfgadsfgdsfg",
            unchainedUrls
        }

        //init wallet offline
        let Wallet = new WalletClass('native',config);

        let info = await Wallet.init()
        console.log("INFO: ",info)

    }catch(e){
        console.error(e)
    }
}
run_test()
