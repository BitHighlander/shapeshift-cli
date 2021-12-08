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

//import chain-adapters
import { NativeAdapterArgs, NativeHDWallet } from '@shapeshiftoss/hdwallet-native'
import { BIP32Params, ChainTypes, UtxoAccountType } from '@shapeshiftoss/types'
import dotenv from 'dotenv'
dotenv.config()
import { ChainAdapterManager } from '@shapeshiftoss/chain-adapters'
//requires
//Subcommand patch
const program = require( './modules/commander-patch' );
const log = require("loggerdog-client")();

const foxContractAddress = '0xc770eefad204b5180df6a14ee197d99d808ee52d'

//import cliish thing from chain-adapters
const getWallet = async (): Promise<NativeHDWallet> => {
    const nativeAdapterArgs: NativeAdapterArgs = {
        mnemonic: process.env.CLI_MNEMONIC,
        deviceId: 'test'
    }
    const wallet = new NativeHDWallet(nativeAdapterArgs)
    await wallet.initialize()

    return wallet
}

const unchainedUrls = {
    [ChainTypes.Bitcoin]: {
        httpUrl: 'https://dev-api.bitcoin.shapeshift.com',
        wsUrl: 'wss://dev-api.bitcoin.shapeshift.com'
    },
    [ChainTypes.Ethereum]: {
        httpUrl: 'https://dev-api.ethereum.shapeshift.com',
        wsUrl: 'wss://dev-api.ethereum.shapeshift.com'
    }
}

const main = async () => {
    try {
        const chainAdapterManager = new ChainAdapterManager(unchainedUrls)
        const wallet = await getWallet()

        /** BITCOIN CLI */
        // const btcChainAdapter = chainAdapterManager.byChain(ChainTypes.Bitcoin)
        // const btcBip32Params: BIP32Params = {
        //     purpose: 84,
        //     coinType: 0,
        //     accountNumber: 0,
        //     isChange: false,
        //     index: 10
        // }
        //
        // const btcAddress = await btcChainAdapter.getAddress({
        //     wallet,
        //     bip32Params: btcBip32Params,
        //     accountType: UtxoAccountType.SegwitNative
        // })
        // console.log('btcAddress:', btcAddress)
        //
        // const btcAccount = await btcChainAdapter.getAccount(btcAddress)
        // console.log('btcAccount:', btcAccount)
        //
        // await btcChainAdapter.subscribeTxs(
        //     { wallet, bip32Params: btcBip32Params, accountType: UtxoAccountType.SegwitNative },
        //     (msg) => console.log(msg),
        //     (err) => console.log(err)
        // )
        //
        // const txInput = {
        //     to: 'bc1qkumt74m9tl0anhrga37t52xlknu0eag3scg7nr',
        //     value: '400',
        //     wallet,
        //     bip32Params: btcBip32Params,
        //     chainSpecific: { accountType: UtxoAccountType.SegwitNative, satoshiPerByte: '4' }
        // }
        //
        // try {
        //     const btcUnsignedTx = await btcChainAdapter.buildSendTransaction(txInput)
        //     const btcSignedTx = await btcChainAdapter.signTransaction({
        //         wallet,
        //         txToSign: btcUnsignedTx.txToSign
        //     })
        //     console.log('btcSignedTx:', btcSignedTx)
        // } catch (err) {
        //     console.log('btcTx error:', err.message)
        // }
        //
        // // // const btcTxID = await btcChainAdapter.broadcastTransaction(btcSignedTx)
        // // // console.log('btcTxID: ', txid)

        // /** ETHEREUM CLI */
        const ethChainAdapter = chainAdapterManager.byChain(ChainTypes.Ethereum)
        const ethBip32Params: BIP32Params = { purpose: 44, coinType: 60, accountNumber: 0 }

        const ethAddress = await ethChainAdapter.getAddress({ wallet, bip32Params: ethBip32Params })
        console.log('ethAddress:', ethAddress)

        const ethAccount = await ethChainAdapter.getAccount(ethAddress)
        console.log('ethAccount:', ethAccount)

        await ethChainAdapter.subscribeTxs(
            { wallet, bip32Params: ethBip32Params },
            (msg) => console.log(msg),
            (err) => console.log(err)
        )

        // send eth example
        try {
            const ethUnsignedTx = await ethChainAdapter.buildSendTransaction({
                to: `0x47CB53752e5dc0A972440dA127DCA9FBA6C2Ab6F`,
                value: '1',
                wallet,
                bip32Params: ethBip32Params,
                chainSpecific: { gasPrice: '0', gasLimit: '0' }
            })
            const ethSignedTx = await ethChainAdapter.signTransaction({
                wallet,
                txToSign: ethUnsignedTx.txToSign
            })
            console.log('ethSignedTx:', ethSignedTx)
        } catch (err) {
            console.log('ethTx error:', err.message)
        }

        // const ethTxID = await ethChainAdapter.broadcastTransaction(ethSignedTx)
        // console.log('ethTxID:', ethTxID)

        // send fox example (erc20)
        try {
            const erc20UnsignedTx = await ethChainAdapter.buildSendTransaction({
                to: `0x47CB53752e5dc0A972440dA127DCA9FBA6C2Ab6F`,
                value: '1',
                wallet,
                bip32Params: ethBip32Params,
                chainSpecific: { gasPrice: '0', gasLimit: '0', erc20ContractAddress: foxContractAddress }
            })
            const erc20SignedTx = await ethChainAdapter.signTransaction({
                wallet,
                txToSign: erc20UnsignedTx.txToSign
            })
            console.log('erc20SignedTx:', erc20SignedTx)

            //const erc20TxID = await ethChainAdapter.broadcastTransaction(erc20SignedTx)
            //console.log('erc20TxID:', erc20TxID)
        } catch (err) {
            console.log('erc20Tx error:', err.message)
        }

        /** COSMOS CLI */

        /** OSMOSIS CLI */

    } catch (err) {
        console.error(err)
    }
}

main().then(() => console.log('DONE'))


//import cliish thing from swapper

//import cliish thing from staker

//TODO generalized TX builder class that wraps all these things



//TODO make a real cli bro
// // must be before .parse()
// program.on('--help', () => {
//     showWelcome()
// });
//
// /*
//     Platform APPs
//         App ecosystem
//         Create
//         Publish
//         Revoke
//  */
//
// const walletCommand = program
//     .command( 'wallet' )
//     .description( 'Create a wallet' )
//     .forwardSubcommands();
//
// walletCommand
//     .command( 'create' )
//     .action( () => {
//         log.debug(" Create a new wallet")
//     } );
//
//
// /*
//     Pioneer Server
//         (docs)
//  */
// //TODO flag run on port
// // const projectCommand = program
// //     .command( 'server start' )
// //     .description( 'Start The Pioneer Server' )
// //     .action( () => {
// //         server.start()
// //     } );
// //
// // projectCommand
// //     .command( 'start' )
// //     .action( () => {
// //         server.start()
// //     } );
//
// //TODO stop server
// //TODO kill on exit
//
// /*
//     Platform Users
//         List users
//         ping user
//         send request
//         view requests
//  */
// const userCommand = program
//     .command( 'user' )
//     .description( 'Create a Pioneer Application' )
//     .forwardSubcommands();
//
// userCommand
//     .command( 'list' )
//     .action( () => {
//         log.debug(" user list command passed")
//     } );
//
// userCommand
//     .command( 'request' )
//     .action( () => {
//         log.debug(" user request command passed")
//     } );
//
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
//
// // appCommand
// //     .command( 'ls' )
// //     .action( () => {
// //         //list all apps
// //     } );
// //
// // appCommand
// //     .command( 'publish' )
// //     .action( () => {
// //         let tag = " | app | "
// //         //push to app store
// //     } );
//
//
// /*
//     onStart
//         If no commands, assume --it
//  */
// log.debug("args",process.argv)
//
// const onInteractiveTerminal = async function(){
//     let tag = TAG + " | onInteractiveTerminal | "
//     try{
//         log.debug("Starting Interactive Terminal")
//         //start --it mode
//         showWelcome()
//
//         //TODO
//         //all the things
//
//
//     }catch(e){
//         log.error("Terminal Exit: ",e)
//         process.exit(2)
//     }
// }
//
// if(process.argv.length === 2){
//     onInteractiveTerminal()
// } else {
//     program.parse( process.argv );
// }
//

















