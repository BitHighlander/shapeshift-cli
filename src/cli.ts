#!/usr/bin/env node
"use strict";
/*
        Pioneer CLI
            -Highlander

    Exploring New Worlds!

 */
require("dotenv").config();
require("dotenv").config({path: "./../.env"});
require("dotenv").config({path: "../../.env"});
require("dotenv").config({path: "../../../.env"});
require("dotenv").config({path: "../../../.env"});
require("dotenv").config({path: "../../../../.env"});


const TAG = " | Cli index.js | ";
//cli tools
const inquirer = require("inquirer");

import {
    showWelcome
} from './modules/views'

import dotenv from 'dotenv'
dotenv.config()
import { ChainAdapterManager } from '@shapeshiftoss/chain-adapters'

//requires
let WalletClass = require('./index.js')
var beautify = require("json-beautify");
//Subcommand patch
const program = require( './modules/commander-patch' );
const log = require("loggerdog-client")();

// must be before .parse()
program.on('--help', () => {
    // showWelcome()
    // log.info("help info")
});

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
    mnemonic: process.env['CLI_MNEMONIC'],
    username:'cliuser',
    spec:'TODO',
    queryKey:"asasdfgadsfgdsfg",
    unchainedUrls
}
if(!config.mnemonic) throw Error("Must put a mnemonic into env! CLI_MNEMONIC")

//init wallet offline
log.info("config: ",config)
let Wallet = new WalletClass('native',config);

/*
    TX module
        transfers
        swaps
        stakes
 */

const walletCommand = program
    .option('-y, --yes', 'Approve Transaction')
    .command( 'tx' )
    .description( 'build a transaction' )
    .forwardSubcommands();

walletCommand
    .command( 'send' )
    .description( 'build a basic transfer transaction  example: tx send BTC address* amount* ?memo*' )
    .action( async () => {
        log.info("send ",process.argv)
        if(process.argv.length === 7) {
            //asset
            let asset = process.argv[4]

            //TODO caip?
            //infured network
            let blockchain
            asset = asset.toUpperCase()
            if(asset === 'BTC'){
                blockchain = 'bitcoin'
            } else if(asset === 'ETH'){
                blockchain = 'ethereum'
            }

            //address
            let address = process.argv[5]
            //amount
            let amount = process.argv[6]

            log.info("params: ",{asset,address,amount})
            //build unsigned
            let info = await Wallet.init()
            log.info("INFO: ",info)

            //verify balance
            let balance = await Wallet.getBalance(blockchain,asset)
            log.info("balance: ",balance)

            //estimate fee
            //verify balance left for fee
            //verify adaquate funding for tx
            //else calculate MAX send

            let amountNative = Wallet.baseAmountToNative(asset,amount)
            log.info("amountNative: ",amountNative)

            //build tx
            let tx:any = {
                blockchain,
                asset,
                addressTo:address,
                amount:amountNative
            }
            log.info("tx: ",tx)
            let resp = await Wallet.buildTx(tx)
            log.info("resp: ",resp)
            tx.unsignedTx = resp.unsignedTx.txToSign

            //if approve auto
            let flagsOpts = program.opts()
            let flags = Object.keys(flagsOpts)
            log.info("flags: ",flags)

            let signedTx
            if(flags.indexOf('yes') >= 0){
                signedTx = await Wallet.signTx(tx)
            } else {
                //display
                console.log(beautify(resp.transaction, null, 2, 100));
                console.log(beautify(resp.unsignedTx, null, 2, 100));

                //prompt for approval
                const questions = [
                    {
                        type: "input",
                        name: "approve",
                        message: "confirm transaction ('yes/y' all other responses reject)",
                        default: "confirm transaction",
                    },
                    //wallets
                ];

                inquirer.prompt(questions).then(async function (answers: any) {
                    log.info("questions: ",answers)
                    //check if name available

                    //confim
                    if(answers.approve == 'yes' || answers.approve == 'y'){
                        //sign transaction
                        log.info("tx: ",tx)
                        signedTx = await Wallet.signTx(tx)
                    }
                });
            }

            //display signed
            log.info("signedTx: ",signedTx)

            //indquire yes/no to broadcast?
            //if noBroadcast = false dont prompt

        } else if(process.argv.length === 8){
            //TODO handle memo!
            throw Error("memos not built yet!")
        }else{
            //invalid length
            throw Error(" invalid params! length: "+process.argv.length)
        }
    } );

walletCommand
    .command( 'swap' )
    .description( 'swap between assets' )
    .action( () => {
        log.info("swap ",process.argv)
    } );

walletCommand
    .command( 'stake' )
    .description( 'stake assets to earn interest' )
    .action( () => {
        log.info("stake ",process.argv)
    } );


// /*
//     Platform APPs
//         App ecosystem
//         Create
//         Publish
//         Revoke
//  */
//
// const appCommand = program
//     .command( 'app' )
//     .description( 'Create a Pioneer Application' )
//     .forwardSubcommands();
//
// appCommand
//     .command( 'create' )
//     .action( () => {
//         let tag = " | app | "
//
//         const questions = [
//             {
//                 type: "input",
//                 name: "appname",
//                 message: "select an application name",
//                 default: "sample app",
//             },
//             //wallets
//         ];
//
//         inquirer.prompt(questions).then(async function (answers: any) {
//             //check if name available
//             log.debug(tag,"answers: ",answers)
//             //generate template to file
//             //platform.create(answers.appname)
//             //create app remote
//
//         });
//     } );

// appCommand
//     .command( 'ls' )
//     .action( () => {
//         //list all apps
//     } );
//
// appCommand
//     .command( 'publish' )
//     .action( () => {
//         let tag = " | app | "
//         //push to app store
//     } );


/*
    onStart
        If no commands, assume --it
 */
log.debug("args",process.argv)

const onInteractiveTerminal = async function(){
    let tag = TAG + " | onInteractiveTerminal | "
    try{
        log.debug("Starting Interactive Terminal")
        //start --it mode
        // showWelcome()

        //TODO
        //all the things


    }catch(e){
        log.error("Terminal Exit: ",e)
        process.exit(2)
    }
}

if(process.argv.length === 2){
    onInteractiveTerminal()
} else {
    program.parse( process.argv );
}


















