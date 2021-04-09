# Highly Deterministic Crypto Address Generator CLI

Generate hierarchical deterministic(HD) coin specific crypto addresses from single master key pair for over 190 different cryptocurrencies through your terminal. 

Ideal for cold wallet, air gapped address generation. 

# Features 

- BIP 32,44,49,84,141 address logic. 
- p2pkh(legacy), p2wpkhInP2sh(segwit compatible), p2wpkh(bech32) hashing.
- Unique address building logic for ETH,EOS,XRP,XLM, and others. 
- Custom BIP 39 Passphrases.
- BIP 38 private key encryption.

# Installation  

``
git clone https://github.com/tboydston/hdAddressGeneratorCLI
npm install
``

# Usage 

`
node cli.js [command] --option=key -o=key
`

## Example

`
node cli.js withMnemonic --coin=BTC -m='brand improve symbol strike say focus ginger imitate ginger appear wheel brand swear relief zero'
`

## Commands

``
   help   Print this help menu.
   help [command]  Print help for specific command.
   supportedCoins  Print list of all supported coins.
   withSeed   Generate BIP 44(legacy),49(segwit compatible), or 84(bech32) address using seed.
   withMnemonic   Generate BIP 44(legacy),49(segwit compatible), or 84(bech32) address using mnemonic and optional pass phrase.
   withSeedBIP32   Generate BIP 32 legacy addresses with custom path and seed.
   withMnemonicBIP32   Generate BIP 32 legacy addresses with custom path, mnemonic, and optional pass phrase.
   withSeedBIP141   Generate BIP 141 addresses with custom path, seed, and hashing algo.
   withMnemonicBIP141   Generate BIP 141 addresses with custom path, mnemonic, and hashing algo.
``

## Options

``
   --mnemonic -m  BIP39 mnemonic with spaces between words.
   --seed BIP39 seed used instead of a mnemonic.
   --hardened -h Should the resulting addresses be hardened?
   --passPhrase -phrase Additional BIP39 passphrase custom passphrase to further secure mnemonic.
   --coin Coin short name ( BTC, ETH, XRP, ect.).
   --bip What BIP style addresses are you trying to create. Default: 44 Options: 32,44,49,84,141
   --account -acc Account used in HD address path.
   --change -ch Used in HD address path to signify if address is for change.
   --bip38Password -pass Additional password used to encrypt private keys.
   --customPath -path Custom path overwriting the path generated using bip/account/change.
   --hashAlgo -algo Algorithm used to hash the address. Coin must have supporting network information. Options: p2pkh,p2wpkhInP2sh,p2wpkh
   --startIndex -s Which address index to start generating addresses from.
   --total -t Total number of addresses to generate.
   --format What format would you like the results returned in. Options: json(default), csv, or table
   --hideRootKeys Do not show the root keys used to generate the addresses.
   --hidePrivateKeys Hide all private keys.
   --file Load mnemonic or seed from file.
   --convertAddress -ca Convert legacy addresses into different formats. Options: cashAddress,bitpayAddress,bchSlp
``

## Command Specific 

### withSeed

Generate BIP 44(legacy),49(segwit compatible), or 84(bech32) address using seed.

**Required Options:** seed

**Supported Options:** seed, coin, hardened, bip, account, change, bip38Password

**Defaults:** passPhrase=false, hardened=false, coin=BTC, bip=44, account=0, change=0, bip38Password=false, customPath=false, hashAlgo=false, startIndex=0, total=10, format=json, hideRootKeys=false, hidePrivateKeys=false, file=false

### withMnemonic

Generate BIP 44(legacy),49(segwit compatible), or 84(bech32) address using mnemonic and optional pass phrase.

**Required Options:** mnemonic

**Supported Options:** mnemonic, passPhrase, coin, hardened, bip, account, change, bip38Password

**Defaults:** passPhrase=false, hardened=false, coin=BTC, bip=44, account=0, change=0, bip38Password=false, customPath=false, hashAlgo=false, startIndex=0, total=10, format=json, hideRootKeys=false, hidePrivateKeys=false, file=false

### withSeedBIP32

Generate BIP 32 legacy addresses with custom path and seed.

**Required Options:** seed, customPath

**Supported Options:** seed, coin, customPath, hardened, bip38Password)

**Defaults:** passPhrase=false, hardened=false, coin=BTC, bip=44, account=0, change=0, bip38Password=false, customPath=false, hashAlgo=false, startIndex=0, total=10, format=json, hideRootKeys=false, hidePrivateKeys=false, file=false


### withMnemonicBIP32

Generate BIP 32 legacy addresses with custom path, mnemonic, and optional pass phrase.
**Required Options:** mnemonic, customPath

**Supported Options:** mnemonic, passPhrase, coin, customPath, hardened, bip38Password)

**Defaults:** passPhrase=false, hardened=false, coin=BTC, bip=44, account=0, change=0, bip38Password=false, customPath=false, hashAlgo=false, startIndex=0, total=10, format=json, hideRootKeys=false, hidePrivateKeys=false, file=false


### withSeedBIP141   

Generate BIP 141 addresses with custom path, seed, and hashing algo.

**Required Options:** seed, customPath, hashAlgo

**Supported Options:** seed, coin, customPath, hardened, hashAlgo, bip38Password)

**Defaults:** passPhrase=false, hardened=false, coin=BTC, bip=44, account=0, change=0, bip38Password=false, customPath=false, hashAlgo=false, startIndex=0, total=10, format=json, hideRootKeys=false, hidePrivateKeys=false, file=false

### withMnemonicBIP141   

Generate BIP 141 addresses with custom path, mnemonic, and hashing algo.

**Required Options:** mnemonic, customPath, hashAlgo

**Supported Options:** mnemonic, coin, customPath, hardened, hashAlgo, bip38Password)

**Defaults:** passPhrase=false, hardened=false, coin=BTC, bip=44, account=0, change=0, bip38Password=false, customPath=false, hashAlgo=false, startIndex=0, total=10, format=json, hideRootKeys=false, hidePrivateKeys=false, file=false, 

# Tests

Tests included with this CLI act as integration tests to insure the CLI is operating correctly. Individual coin tests are done in the [hdAddressGenerator](https://github.com/tboydston/hdAddressGenerator/) library this CLI is based on. Before using this library please insure that your coin has a test in this library. If it does not it is easy to add one. Simple follow the test instructions in the readme for [hdAddressGenerator](https://github.com/tboydston/hdAddressGenerator/) and submit a pull request. Tests run for this CLI will pull coin test data from this library automatically.

