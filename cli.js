const fs = require('fs')
const HdAddGen = require('hdAddressGenerator')

const validRequests = ["help","withSeed","withMnemonic","withMnemonicBIP32","withSeedBIP32","withMnemonicBIP141","withSeedBIP141","help"]
const shortOptionEquivalents = {
    "m":"mnemonic",
    "h":"hardened",
    "phrase":"passPhrase",
    "acc":"account",
    "ch":"change",
    "pass":"bip38Password",
    "path":"customPath",
    "algo":"hashAlgo",
    "s":"startIndex",
    "t":"total"
}

const requireOptions = {
    "help":[],
    "withSeed":["seed"],
    "withMnemonic":["mnemonic"],
    "withMnemonicBIP32":["mnemonic","customPath"],
    "withSeedBIP32":["seed","customPath"],
    "withMnemonicBIP141":["mnemonic","customPath","hashAlgo"],
    "withSeedBIP141":["seed","customPath","hashAlgo"]
}


const defaultOptions = {
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
    file:false
}

const validOptions = {
    bip:[32,44,49,84,142],
    format:["json","table","csv"]
}


const args = process.argv

;(async()=>{

let options = await processInput(args)
let hdAdd = await processCommand(options)
let results = await generateKeys(options.total,options.startIndex,options.hidePrivateKeys,hdAdd)

processOutput(results,options)


})();

async function processInput(args){

    let options = {}
    let command = ""

    try{

        options = processOptions(args,defaultOptions)
        options.command = args[2]

        validateOptions(options,validOptions)

    } catch (e){
        console.log(e)
        printHelp(args)
        process.exit()
    }



    return options 

}

async function processCommand(options){

    let hdAdd = {}

    try{
        if ( options.command == "help" ) printHelp(args)
        if ( options.command == "withSeed") hdAdd = HdAddGen.withSeed(options.seed,options.coin,options.hardened,options.bip,options.account,options.change,options.bip38Password)
        if ( options.command == "withMnemonic") hdAdd = HdAddGen.withMnemonic(options.mnemonic,options.passPhrase,options.coin,options.hardened,options.bip,options.account,options.change,options.bip38Password)
        if ( options.command == "withSeedBIP32") hdAdd = HdAddGen.withSeedBIP32(options.seed,options.coin,options.customPath,options.hardened,options.bip38Password)
        if ( options.command == "withMnemonicBIP32") hdAdd = HdAddGen.withMnemonicBIP32(options.mnemonic,options.passPhrase,options.coin,options.customPath,options.hardened,options.bip38Password)
        if ( options.command == "withSeedBIP141") hdAdd = HdAddGen.withSeedBIP141(options.seed,options.coin,options.customPath,options.hashAlgo,options.hardened,options.bip38Password)
        if ( options.command == "withMnemonicBIP141") hdAdd = HdAddGen.withMnemonicBIP141(options.mnemonic,options.passPhrase,options.coin,options.customPath,options.hashAlgo,options.hardened,options.bip38Password)
    } catch (e){
        console.log(e)
        process.exit()
    }

    return hdAdd

}

async function generateKeys(total,startIndex,hidePrivateKeys,hdAdd){

    let results = {}
    results.rootKeys = {}
    results.rootKeys.hashAlgo = hdAdd.hashAlgo
    results.rootKeys.bip32Path = hdAdd.bip32Path
    results.rootKeys.bip32Seed = hdAdd.bip32Seed
    results.rootKeys.bip32RootKey = hdAdd.bip32RootKey
    results.rootKeys.accountXprivKey = ( !hidePrivateKeys ) ? hdAdd.accountXprivKey : "REDACTED"
    results.rootKeys.accountXpubKey = hdAdd.accountXpubKey
    results.rootKeys.bip32XprivKey = ( !hidePrivateKeys ) ? hdAdd.bip32XprivKey : "REDACTED"
    results.rootKeys.bip32XpubKey = hdAdd.bip32XpubKey
    
    results.addresses = []
    
    let fullAddresses = await hdAdd.generate(total,startIndex)
    
    fullAddresses.forEach(address => {
        results.addresses.push({
            path:address.path,
            address:address.address,
            pubKey:address.pubKey,
            privKey:( ( !hidePrivateKeys ) ? address.privKey : "REDACTED"),

        })
    })

    return results
}

function processOutput(results,options){
    
    let format = options.format

    if ( format == "json" ){
        console.log(results)
    }

    if ( format == "table" ){
        if ( !options.hideRootKeys ) console.table(results.rootKeys )
        console.table(results.addresses )
    }

    if ( format == "csv" ){
        if ( !options.hideRootKeys ) {
            for (const key in results.rootKeys) {
                console.log(`${key},${results.rootKeys[key]}`)
            }
        }
        results.addresses.forEach(address => {
            console.log(`${address.path},${address.address},${address.pubKey},${address.privKey}`)
        })

    }

}

function processOptions(args,options){

    let command = args[2]

    if( !validRequests.includes(command) ) {
        throw `Invalid command. Supported commands: ${validRequests.join(", ")}.`
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
        if ( shortOptionEquivalents[optionArray[0]] != undefined ){
            optionArray[0] = shortOptionEquivalents[optionArray[0]]
        }

         
    

        options[optionArray[0]] = optionArray[1]

    }

    // If a key file is specified load the key file. 
    options = ( options.file != false ) ? loadFile(options) : options


    requireOptions[command].forEach( requiredOption => {
        if ( options[requiredOption] == undefined ){
            throw `Command: ${command} is missing a required options. Required options: ${requireOptions[command].join(", ")}`
        }
    })
    

    return options


} 


function validateOptions( options, validOptions ){

    if ( !validOptions.bip.includes(options.bip) ){
        throw `BIP value: ${options.bip} is not supported. Supported BIP: ${validOptions.bip.join(", ")}`

    }

    if ( !validOptions.format.includes(options.format) ){
        throw `Format value: ${options.format} is not supported. Supported BIP: ${validOptions.formats.join(", ")}`
    }

}

function loadFile(options){

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


function printHelp(args){

    let command = ""

    if( args[3] == undefined ){

        console.log("usage: node cli.js [command] --option=key -o=key")
        console.log("COMMANDS")
        console.log("help   Print this help menu.")
        console.log("help [command]  Print help for specific command.")
        // console.log("coinList  Print list of all supported coins.")
        console.log("withSeed   Generate BIP 44(legacy),49(segwit compatible), or 84(bech32) address using seed.")
        console.log("withMnemonic   Generate BIP 44(legacy),49(segwit compatible), or 84(bech32) address using mnemonic and optional pass phrase.")
        console.log("withSeedBIP32   Generate BIP 32 legacy addresses with custom path and seed.")
        console.log("withMnemonicBIP32   Generate BIP 32 legacy addresses with custom path, mnemonic, and optional pass phrase.")
        console.log("withSeedBIP141   Generate BIP 141 addresses with custom path, seed, and hashing algo.")
        console.log("withMnemonicBIP141   Generate BIP 141 addresses with custom path, mnemonic, and hashing algo.")
        console.log("OPTIONS")  
        console.log("--mnemonic -m  BIP39 mnemonic with spaces between words.")  
        console.log("--seed BIP39 seed used instead of a mnemonic.")  
        console.log("--hardened -h Should the resulting addresses be hardened?") 
        console.log("--passPhrase -phrase Additional BIP39 passphrase custom passphrase to further secure mnemonic.") 
        console.log("--coin Coin short name ( BTC, ETH, XRP, ect.).") 
        console.log("--bip What BIP style addresses are you trying to create. Default: 44 Options: 32,44,49,84,141") 
        console.log("--account -acc Account used in HD address path.") 
        console.log("--change -ch Used in HD address path to signify if address is for change.") 
        console.log("--bip38Password -pass Additional password used to encrypt private keys.") 
        console.log("--customPath -path Custom path overwriting the path generated using bip/account/change.")
        console.log("--hashAlgo -algo Algorithm used to hash the address. Coin must have supporting network information. Options: p2pkh,p2wpkhInP2sh,p2wpkh") 
        console.log("--startIndex -s Which address index to start generating addresses from.") 
        console.log("--total -t Total number of addresses to generate.") 
        console.log("--format What format would you like the results returned in. Options: json(default), csv, or table") 
        console.log("--hideRootKeys Do not show the root keys used to generate the addresses.") 
        console.log("--hidePrivateKeys Hide all private keys.") 
        console.log("--file Load mnemonic or seed from file.") 

    } else { 
        command = args[3] 
    }

    if ( command == "withSeed" ){
        console.log("withSeed   Generate BIP 44(legacy),49(segwit compatible), or 84(bech32) address using seed.")
        console.log("Required Options: seed")
        console.log("Supported Options: seed, coin, hardened, bip, account, change, bip38Password")
        printDefaultOptions()
    }

    if ( command == "withMnemonic" ){
        console.log("withMnemonic   Generate BIP 44(legacy),49(segwit compatible), or 84(bech32) address using mnemonic and optional pass phrase.")
        console.log("Required Options: mnemonic")
        console.log("Supported Options: mnemonic, passPhrase, coin, hardened, bip, account, change, bip38Password")
        printDefaultOptions()
    }
    
    if ( command == "withSeedBIP32" ){
        console.log("withSeedBIP32   Generate BIP 32 legacy addresses with custom path and seed.")
        console.log("Required Options: seed, customPath")
        console.log("Supported Options: seed, coin, customPath, hardened, bip38Password)")
        printDefaultOptions()
    }

    if ( command == "withMnemonicBIP32" ){
        console.log("withMnemonicBIP32   Generate BIP 32 legacy addresses with custom path, mnemonic, and optional pass phrase.")
        console.log("Required Options: mnemonic, customPath")
        console.log("Supported Options: mnemonic, passPhrase, coin, customPath, hardened, bip38Password)")
        printDefaultOptions()
    }

    if ( command == "withSeedBIP141" ){
        console.log("withSeedBIP141   Generate BIP 141 addresses with custom path, seed, and hashing algo.")
        console.log("Required Options: seed, customPath, hashAlgo")
        console.log("Supported Options: seed, coin, customPath, hardened, hashAlgo, bip38Password)")
        printDefaultOptions()
    }

    if ( command == "withMnemonicBIP141" ){
        console.log("withMnemonicBIP141   Generate BIP 141 addresses with custom path, mnemonic, and hashing algo.")
        console.log("Required Options: mnemonic, customPath, hashAlgo")
        console.log("Supported Options: mnemonic, coin, customPath, hardened, hashAlgo, bip38Password)")
        printDefaultOptions()
    }

    process.exit()

}

function printDefaultOptions(){

    let responseString = "Defaults: "

    for (const key in defaultOptions) {
        responseString += key+"="+defaultOptions[key]+", "
    }

    responseString.slice(responseString.length-2,responseString.length)

    console.log(responseString)

}


