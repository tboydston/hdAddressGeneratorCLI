/**
 * TODO 
 * 'options' is passed to functions AND called internally. Streamline this a bit. 
 */

const fs = require('fs')
const HdAddGen = require('hdAddressGenerator')
const colors = require('colors')

class AddressGeneratorCli {

    validRequests = ["help","supportedCoins","withSeed","withMnemonic","withMnemonicBIP32","withSeedBIP32","withMnemonicBIP141","withSeedBIP141"]
    shortOptionEquivalents = {
        "m":"mnemonic",
        "h":"hardened",
        "phrase":"passPhrase",
        "acc":"account",
        "ch":"change",
        "pass":"bip38Password",
        "path":"customPath",
        "algo":"hashAlgo",
        "s":"startIndex",
        "t":"total",
        "ca":"convertAddress"
    }

    requireOptions = {
        "help":[],
        "withSeed":["seed"],
        "withMnemonic":["mnemonic"],
        "withMnemonicBIP32":["mnemonic","customPath"],
        "withSeedBIP32":["seed","customPath"],
        "withMnemonicBIP141":["mnemonic","customPath","hashAlgo"],
        "withSeedBIP141":["seed","customPath","hashAlgo"]
    }

    defaultOptions = {
        passPhrase:false,
        hardened:false,
        coin:"BTC",
        bip:44, 
        account:0,
        change:0, 
        bip38Password:false, 
        customPath:false, 
        hashAlgo:false,
        startIndex:0,
        total:10,
        format:"json",
        hideRootKeys:false,
        hidePrivateKeys:false,
        file:false,
        convertAddress:false
    }

    validOptions = {
        bip:[32,44,49,84,142],
        format:["json","table","csv"],
        addressConversion:["cashAddress","bitpayAddress","bchSlp"]
    }

    options = {}
    results = {}
    hdAdd = {}
    args = {}

    constructor(args){
        this.args = args 
    }

    /**
     * Generate deterministic addresses based on process.argv data.
     * @returns obj
     */
    async generate(){

        try{

            this.options = await this.processInput(this.args)
            this.hdAdd = await this.processCommand(this.options)
            this.results = await this.generateKeys()

        } catch (e) {
            throw e
        }

        return this.results
    
    }
    
    /**
     * Takes raw process.argv input, validates it, adds in missing defaults and 
     * sanitizes it for address generation.
     * @param {array} args Raw process.argv input.
     * @returns obj
     */
    async processInput(args){

        let submittedOptions = {}

        try{
            
            submittedOptions = await this.processOptions(args,this.defaultOptions)
            submittedOptions.command = args[2]

            await this.validateOptions(submittedOptions)
    
        } catch (e){
            throw(e)
        }

        return submittedOptions 
    
    }
    
    /**
     * Based on submitted object, returns HdAddressGenerator object.
     * @param {obj} options 
     * @returns obj
     */
    async processCommand(options){

        let hdAdd = {}
    
        try{
            if ( options.command == "withSeed") hdAdd = HdAddGen.withSeed(options.seed,options.coin,options.hardened,options.bip,options.account,options.change,options.bip38Password)
            if ( options.command == "withMnemonic") hdAdd = HdAddGen.withMnemonic(options.mnemonic,options.passPhrase,options.coin,options.hardened,options.bip,options.account,options.change,options.bip38Password) 
            if ( options.command == "withSeedBIP32") hdAdd = HdAddGen.withSeedBIP32(options.seed,options.coin,options.customPath,options.hardened,options.bip38Password)
            if ( options.command == "withMnemonicBIP32") hdAdd = HdAddGen.withMnemonicBIP32(options.mnemonic,options.passPhrase,options.coin,options.customPath,options.hardened,options.bip38Password)
            if ( options.command == "withSeedBIP141") hdAdd = HdAddGen.withSeedBIP141(options.seed,options.coin,options.customPath,options.hashAlgo,options.hardened,options.bip38Password)
            if ( options.command == "withMnemonicBIP141") hdAdd = HdAddGen.withMnemonicBIP141(options.mnemonic,options.passPhrase,options.coin,options.customPath,options.hashAlgo,options.hardened,options.bip38Password)
        } catch (e){
            throw e
        }

        return hdAdd
    
    }
    
    /**
     * Prepare and format rootKeys and addresses. 
     * @returns obj
     */
    async generateKeys(){
        
        let results = {}
        results.rootKeys = {}
        results.rootKeys.hashAlgo = this.hdAdd.hashAlgo
        results.rootKeys.bip32Path = this.hdAdd.bip32Path
        results.rootKeys.bip32Seed = this.hdAdd.bip32Seed
        results.rootKeys.bip32RootKey = this.hdAdd.bip32RootKey
        results.rootKeys.accountXprivKey = ( !this.options.hidePrivateKeys ) ? this.hdAdd.accountXprivKey : "REDACTED"
        results.rootKeys.accountXpubKey = this.hdAdd.accountXpubKey
        results.rootKeys.bip32XprivKey = ( !this.options.hidePrivateKeys ) ? this.hdAdd.bip32XprivKey : "REDACTED"
        results.rootKeys.bip32XpubKey = this.hdAdd.bip32XpubKey
        
        results.addresses = []

        try {

            let fullAddresses = await this.hdAdd.generate(this.options.total,this.options.startIndex)
            
            fullAddresses.forEach(address => {
                results.addresses.push({
                    path:address.path,
                    address: ( this.options.convertAddress != false ) ? this.hdAdd.convertAddress(address.address,this.options.convertAddress) : address.address,
                    pubKey:address.pubKey,
                    privKey:( ( !this.options.hidePrivateKeys ) ? address.privKey : "REDACTED")
                })
            })

        } catch (e){
            throw(e)
        } 
    
        return results

    }
    
    /**
     * Formats and logs to console address generation data. 
     */
    async processOutput(){

        let format = this.options.format
    
        if ( format == "json" ){
            console.log(this.results)
        }
    
        if ( format == "table" ){
            if ( !this.options.hideRootKeys ) console.table(this.results.rootKeys )
            console.table(this.results.addresses )
        }
    
        if ( format == "csv" ){

            if ( !this.options.hideRootKeys ) {
                for (const key in this.results.rootKeys) {
                    console.log(`${key},${this.results.rootKeys[key]}`)
                }
            }

            this.results.addresses.forEach(address => {
                console.log(`${address.path},${address.address},${address.pubKey},${address.privKey}`)
            })
    
        }
    
    }
    
    /**
     * Converts, sanitizes, validates, and prepares user submitted options.
     * @param {array} args process.argv array.
     * @param {obj} options 
     * @returns 
     */
    async processOptions(args,options){

        let command = args[2]
    
        if( !this.validRequests.includes(command) ) {
            throw `Invalid command. Supported commands: ${this.validRequests.join(", ")}.`
        }
    
        for (let i = 3; i < args.length; i++) {
    
            let rawOption = ""
            if ( args[i].substring(0, 2) == "--" ){
                rawOption = args[i].substring(2, args[i].length)
            } else if ( args[i].substring(0, 1) == "-" ){
                rawOption = args[i].substring(1, args[i].length)
            } else {
                throw `${args[i]} is an invalid option or the formatting is incorrect.`
            }
            
            let optionArray = rawOption.split("=")

            if ( optionArray[1] == undefined ){
                    throw `${args[i]} is an invalid option or the formatting is incorrect.`
            }
    
            // Convert short options to extended option keys. 
            if ( this.shortOptionEquivalents[optionArray[0]] != undefined ){
                optionArray[0] = this.shortOptionEquivalents[optionArray[0]]
            }
            
            // Convert input strings to correct types. 
            if ( optionArray[1] == "true" ){
                options[optionArray[0]] = true
            } else if ( optionArray[1] == "false" ){
                options[optionArray[0]] = false
            } else if ( !isNaN(optionArray[1]) ) {
                options[optionArray[0]] = parseInt(optionArray[1])
            } else {
                options[optionArray[0]] = optionArray[1]
            }    
    
        }
    
        // If a key file is specified load the key file. 
        options = ( options.file != false ) ? await this.loadFile(options) : options
    
        this.requireOptions[command].forEach( requiredOption => {
            if ( options[requiredOption] == undefined ){
                throw `Command: ${command} is missing a required options. Required options: ${this.requireOptions[command].join(", ")}`
            }
        })
        
        return options
    
    
    } 
    
    /**
     * Validates options against constants.
     * @param {obj} options 
     */
    async validateOptions( options ){

        if ( !this.validOptions.bip.includes(parseInt(options.bip)) ){
            throw `BIP value: ${options.bip} is not supported. Supported BIP: ${this.validOptions.bip.join(", ")}`
    
        }
    
        if ( !this.validOptions.format.includes(options.format) ){
            throw `Format value: ${options.format} is not supported. Supported Formats: ${this.validOptions.format.join(", ")}`
        }

        if ( options.convertAddress != false && !this.validOptions.addressConversion.includes(options.convertAddress) ){
            throw `Convert address value: ${options.convertAddress} is not supported. Supported Formats: ${this.validOptions.addressConversion.join(", ")}`
        }
    
    }
    
    /**
     * Loads external key or mnemonic file.
     * @param {obj} options 
     * @returns 
     */
    async loadFile(options){
    
        let fileContents = {}
    
        try{
            fileContents = JSON.parse(fs.readFileSync(options.file))
        } catch (e){
            throw `File expected to be in JSON format. See ReadMe for file format details. `
        }
    
        if ( fileContents.mnemonic != undefined ){
            options.mnemonic = fileContents.mnemonic
        }
    
        if ( fileContents.seed != undefined ){
            options.seed = fileContents.seed
        }
    
        return options 
    
    }

}

module.exports = AddressGeneratorCli