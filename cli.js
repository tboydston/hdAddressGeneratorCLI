const AddressGeneratorCli = require("./addressGeneratorCli.js")
const coinNetworkList = require('coinnetworklist')

;(async()=>{

    let results = {}
    let addGenCli = new AddressGeneratorCli(process.argv)

    if ( process.argv[2] == undefined || process.argv[2] == 'printHelp' ){
        printHelp(process.argv,addGenCli.defaultOptions)
        process.exit()
    }

    if ( process.argv[2] == "supportedCoins" ){
        printCoinList()
        process.exit()
    }

    try{
        results = await addGenCli.generate()
    } catch(e){
        console.log(e)
        process.exit()
    }
    
    addGenCli.processOutput()  
    
})();


/**
 * Prints general or command specific help to console.
 * @param {array} args process.args array
 */
async function printHelp(args,defaultOptions){

    let command = ""

    if( args[3] == undefined ){
        console.log()
        console.log("HELP")
        console.log()
        console.log("   usage: node cli.js [command] --option=key -o=key")
        console.log("   example: node cli.js withMnemonic --coin=BTC -m='brand improve symbol strike say focus ginger imitate ginger appear wheel brand swear relief zero'")
        console.log()
        console.log("COMMANDS")
        console.log()
        console.log("   help   Print this help menu.")
        console.log("   help [command]  Print help for specific command.")
        console.log("   supportedCoins  Print list of all supported coins.")
        console.log("   withSeed   Generate BIP 44(legacy),49(segwit compatible), or 84(bech32) address using seed.")
        console.log("   withMnemonic   Generate BIP 44(legacy),49(segwit compatible), or 84(bech32) address using mnemonic and optional pass phrase.")
        console.log("   withSeedBIP32   Generate BIP 32 legacy addresses with custom path and seed.")
        console.log("   withMnemonicBIP32   Generate BIP 32 legacy addresses with custom path, mnemonic, and optional pass phrase.")
        console.log("   withSeedBIP141   Generate BIP 141 addresses with custom path, seed, and hashing algo.")
        console.log("   withMnemonicBIP141   Generate BIP 141 addresses with custom path, mnemonic, and hashing algo.")
        console.log()
        console.log("OPTIONS")
        console.log() 
        console.log("   --mnemonic -m  BIP39 mnemonic with spaces between words.")  
        console.log("   --seed BIP39 seed used instead of a mnemonic.")  
        console.log("   --hardened -h Should the resulting addresses be hardened?") 
        console.log("   --passPhrase -phrase Additional BIP39 passphrase custom passphrase to further secure mnemonic.") 
        console.log("   --coin Coin short name ( BTC, ETH, XRP, ect.).") 
        console.log("   --bip What BIP style addresses are you trying to create. Default: 44 Options: 32,44,49,84,141") 
        console.log("   --account -acc Account used in HD address path.") 
        console.log("   --change -ch Used in HD address path to signify if address is for change.") 
        console.log("   --bip38Password -pass Additional password used to encrypt private keys.") 
        console.log("   --customPath -path Custom path overwriting the path generated using bip/account/change.")
        console.log("   --hashAlgo -algo Algorithm used to hash the address. Coin must have supporting network information. Options: p2pkh,p2wpkhInP2sh,p2wpkh") 
        console.log("   --startIndex -s Which address index to start generating addresses from.") 
        console.log("   --total -t Total number of addresses to generate.") 
        console.log("   --format What format would you like the results returned in. Options: json(default), csv, or table") 
        console.log("   --hideRootKeys Do not show the root keys used to generate the addresses.") 
        console.log("   --hidePrivateKeys Hide all private keys.") 
        console.log("   --file Load mnemonic or seed from file.") 
        console.log("   --convertAddress -ca For certain coins ( currently only BCH ). You may need to convert legacy addresses into different formats. Options: cashAddress,bitpayAddress,bchSlp") 
        console.log()

    } else { 
        command = args[3] 
    }

    if ( command == "withSeed" ){
        console.log()
        console.log("withSeed   Generate BIP 44(legacy),49(segwit compatible), or 84(bech32) address using seed.")
        console.log("Required Options: seed")
        console.log("Supported Options: seed, coin, hardened, bip, account, change, bip38Password")
        console.log()
        printDefaultOptions(defaultOptions)
    }

    if ( command == "withMnemonic" ){
        console.log()
        console.log("withMnemonic   Generate BIP 44(legacy),49(segwit compatible), or 84(bech32) address using mnemonic and optional pass phrase.")
        console.log("Required Options: mnemonic")
        console.log("Supported Options: mnemonic, passPhrase, coin, hardened, bip, account, change, bip38Password")
        console.log()
        printDefaultOptions(defaultOptions)
    }

    if ( command == "withSeedBIP32" ){
        console.log()
        console.log("withSeedBIP32   Generate BIP 32 legacy addresses with custom path and seed.")
        console.log("Required Options: seed, customPath")
        console.log("Supported Options: seed, coin, customPath, hardened, bip38Password)")
        console.log()
        printDefaultOptions(defaultOptions)
    }

    if ( command == "withMnemonicBIP32" ){
        console.log()
        console.log("withMnemonicBIP32   Generate BIP 32 legacy addresses with custom path, mnemonic, and optional pass phrase.")
        console.log("Required Options: mnemonic, customPath")
        console.log("Supported Options: mnemonic, passPhrase, coin, customPath, hardened, bip38Password)")
        console.log()
        printDefaultOptions(defaultOptions)
    }

    if ( command == "withSeedBIP141" ){
        console.log()
        console.log("withSeedBIP141   Generate BIP 141 addresses with custom path, seed, and hashing algo.")
        console.log("Required Options: seed, customPath, hashAlgo")
        console.log("Supported Options: seed, coin, customPath, hardened, hashAlgo, bip38Password)")
        console.log()
        printDefaultOptions(defaultOptions)
    }

    if ( command == "withMnemonicBIP141" ){
        console.log()
        console.log("withMnemonicBIP141   Generate BIP 141 addresses with custom path, mnemonic, and hashing algo.")
        console.log("Required Options: mnemonic, customPath, hashAlgo")
        console.log("Supported Options: mnemonic, coin, customPath, hardened, hashAlgo, bip38Password)")
        console.log()
        printDefaultOptions(defaultOptions)
    }

}

/**
 * Prints and formats default options to console.
 */
async function printDefaultOptions(defaultOptions){

    let responseString = "Defaults: "

    for (const key in defaultOptions) {
        responseString += key+"="+defaultOptions[key]+", "
    }

    responseString.slice(responseString.length-2,responseString.length)

    console.log(responseString)
    console.log()

}


/**
 * Print list of supported coins to console.
 */
async function printCoinList(){

    for (const key in coinNetworkList ) {
        if (Object.hasOwnProperty.call(coinNetworkList, key)) {
            const coin = coinNetworkList[key];
            console.log(`${coin.longName}(${coin.shortName})`)
        }
    }

}