/*

    ShapeShift Wallet Class

    Class based wallet development

 */

const TAG = " | shapeshift SDK | "

//import chain-adapters
import { NativeAdapterArgs, NativeHDWallet } from '@shapeshiftoss/hdwallet-native'
import { BIP32Params, ChainTypes, UtxoAccountType } from '@shapeshiftoss/types'
import dotenv from 'dotenv'
dotenv.config()
import { ChainAdapterManager } from '@shapeshiftoss/chain-adapters'

//requires
const log = require("@pioneer-platform/loggerdog")()
let {
    getPaths,
    baseAmountToNative,
    nativeToBaseAmount,
} = require("@pioneer-platform/pioneer-coins")

export enum HDWALLETS {
    'native',
    'keepkey',
    'trezor',
    'ledger',
    'metamask'
}

export interface Config {
    username: string;
    queryKey: string;
    spec:string,
    mnemonic: string,
    unchainedUrls:{
        [ChainTypes.Bitcoin]: {
            httpUrl: string,
            wsUrl: string
        },
        [ChainTypes.Ethereum]: {
            httpUrl: string,
            wsUrl: string
        }
        // [ChainTypes.Osmosis]: {
        //     httpUrl: string,
        //     wsUrl: string
        // }
    }
}

export interface Transaction {
    blockchain: string;
    network: string;
    asset: string;
    symbol?: string;
    addressFrom?: string;
    addressTo: string;
    amount: string;
    memo?: string | undefined;
    nonce?:number
    feeLevel?:string,
    fee?:any
    noBroadcast?:boolean,
    serialized?:string,
    unsignedTx?:any
}

module.exports = class wallet {
    private type: any;
    private spec: any;
    private username: string;
    private mnemonic: any;
    private HDWallet: any;
    private adapters: any;
    private init: (wallet?: any) => Promise<any>;
    private unchainedUrls: any;
    private broadcastTx: (transaction: any) => Promise<any>;
    private signTx: (transaction: any) => Promise<any>;
    private buildTx: (transaction: any) => Promise<any>;
    private queryKey: string;
    private blockchains: string[];
    private chainAdapterManager: any;
    private getBalance: (asset: string) => Promise<any>;
    private nativeToBaseAmount: any;
    private baseAmountToNative: any;
    private getPaths: any;
    constructor(type:HDWALLETS,config:Config,isTestnet?:boolean) {
        if(!config.username) throw Error("invalid config missing username")
        if(!config.queryKey) throw Error("invalid config missing queryKey")
        if(!config.spec) throw Error("invalid config missing spec")
        if(!config.mnemonic) throw Error("invalid config missing mnemonic")
        this.adapters = {}
        this.blockchains = []
        this.username = config.username
        this.queryKey = config.queryKey
        this.type = type
        this.spec = config.spec
        this.mnemonic = config.mnemonic
        this.unchainedUrls = config.unchainedUrls
        //import tools
        this.nativeToBaseAmount = nativeToBaseAmount
        this.baseAmountToNative = baseAmountToNative
        this.getPaths = getPaths
        this.init = async function (wallet?: any) {
            let tag = TAG + " | init_wallet | "
            try {
                //TODO validate mnemonic

                //HDWallet
                const nativeAdapterArgs: NativeAdapterArgs = {
                    mnemonic: this.mnemonic,
                    deviceId: this.username
                }
                this.HDWallet = new NativeHDWallet(nativeAdapterArgs)
                await this.HDWallet.initialize()

                //blockchains
                this.blockchains = Object.keys(config.unchainedUrls)
                log.info(tag,"blockchains: ",this.blockchains)
                this.chainAdapterManager = new ChainAdapterManager(config.unchainedUrls)

                for(let i = 0; i < this.blockchains.length; i++){
                    let blockchain = this.blockchains[i]
                    log.info(tag,"blockchain: ",blockchain)
                    //get adapter
                    this.adapters[blockchain] = this.chainAdapterManager.byChain(blockchain)
                    //TODO sub to payments

                }
                return {
                    blockchains:this.blockchains,
                    // pubkeys,
                    // wallet,
                }
            } catch (e) {
                log.error(tag, e)
                throw e
            }
        }
        this.getBalance = async function (blockchain: string, asset?:string) {
            let tag = TAG + " | getBalance | "
            try {
                if(!blockchain) throw Error("invalid transaction missing blockchain")

                let addressParams:any = {}
                if(blockchain === 'bitcoin'){
                    addressParams = {
                        purpose: 84,
                        coinType: 0,
                        accountNumber: 0,
                        isChange: false,
                        index: 10
                    }
                } else if (blockchain === 'ethereum') {
                    addressParams = {
                        purpose: 44,
                        coinType: 60,
                        accountNumber: 0
                    }
                }

                log.info(tag,"addressParams: ",addressParams)
                log.info(tag,"blockchain: ",blockchain)
                let address:any = await this.adapters[blockchain].getAddress({
                    wallet:this.HDWallet,
                    bip32Params: addressParams,
                    accountType: UtxoAccountType.SegwitNative
                })
                log.info(tag,"address: ",address)

                //get pubkey
                let pubkeyInfo:any = await this.adapters[blockchain].getAccount(address)
                log.info(tag,"pubkeyInfo: ",pubkeyInfo)

                //TODO save pubkey to .pubkeys?
                //TODO save balance to .balances?


                return pubkeyInfo.balance
            } catch (e) {
                log.error(tag, e)
                throw e
            }
        }
        this.buildTx = async function (transaction: Transaction) {
            let tag = TAG + " | buildTx | "
            try {
                if(!transaction.blockchain) throw Error("invalid transaction missing.blockchain")
                if(!transaction.addressTo) throw Error("invalid transaction missing.addressTo")

                let unsignedTx:any = {}
                let txInput
                switch(transaction.blockchain) {
                    case ChainTypes.Bitcoin:
                        log.info(tag,"Bitcoin Tx build!")
                        //TODO get from this.paths
                        const btcBip32Params: BIP32Params = {
                            purpose: 84,
                            coinType: 0,
                            accountNumber: 0,
                            isChange: false,
                            index: 10
                        }

                        txInput = {
                            to: transaction.addressTo,
                            value: transaction.amount,
                            wallet:this.HDWallet,
                            bip32Params: btcBip32Params,
                            chainSpecific: { accountType: UtxoAccountType.SegwitNative, satoshiPerByte: '4' }
                        }
                        log.info(tag,"txInput: ",txInput)
                        unsignedTx = await this.adapters[ChainTypes.Bitcoin].buildSendTransaction(txInput)
                        log.info(tag,"unsignedTx: ",unsignedTx)
                        break;
                    case ChainTypes.Ethereum:
                        log.info(tag,"Ethereum Tx build!")
                        const ethBip32Params: BIP32Params = { purpose: 44, coinType: 60, accountNumber: 0 }

                        txInput = {
                            to: transaction.addressTo,
                            value: transaction.amount,
                            wallet:this.HDWallet,
                            bip32Params: ethBip32Params,
                            chainSpecific: { gasPrice: '0', gasLimit: '0' }
                        }
                        log.info(tag,"txInput: ",txInput)
                        unsignedTx = await this.adapters[ChainTypes.Ethereum].buildSendTransaction(txInput)
                        log.info(tag,"unsignedTx: ",unsignedTx)
                        break;
                    default:
                        throw Error("Blockchain not supported! "+transaction.blockchain)
                    // code block
                }

                let output = {
                    transaction,
                    unsignedTx
                }

                return output
            } catch (e) {
                log.error(tag, e)
                throw e
            }
        }
        this.signTx = async function (transaction: Transaction) {
            let tag = TAG + " | signTx | "
            try {
                if(!transaction.blockchain) throw Error("invalid transaction missing blockchain")
                if(!transaction.unsignedTx) throw Error("invalid transaction missing unsignedTx")

                let signedTx:any = await this.adapters[transaction.blockchain].signTransaction({
                    wallet:this.HDWallet,
                    txToSign: transaction.unsignedTx
                })
                log.info(tag,"signedTx: ",signedTx)

                let output = {
                    transaction,
                    unsignedTx:transaction.unsignedTx,
                    serialized:signedTx
                }

                return output
            } catch (e) {
                log.error(tag, e)
                throw e
            }
        }
        this.broadcastTx = async function (transaction: Transaction) {
            let tag = TAG + " | broadcastTx | "
            try {
                if(!transaction.blockchain) throw Error("invalid transaction missing blockchain")
                if(!transaction.unsignedTx) throw Error("invalid transaction missing unsignedTx")
                if(!transaction.serialized) throw Error("invalid transaction missing unsignedTx")
                if(!this.adapters[transaction.blockchain]) throw Error("blockchain not initialized! "+transaction.blockchain)

                let broadcast:any = await this.adapters[ChainTypes.Bitcoin].broadcastTransaction(transaction.serialized)
                log.info(tag,"broadcast: ",broadcast)

                let output = {
                    transaction,
                    unsignedTx:transaction.unsignedTx,
                    serialized:transaction.serialized,
                    broadcast
                }

                return output
                return {}
            } catch (e) {
                log.error(tag, e)
                throw e
            }
        }
    }
}

