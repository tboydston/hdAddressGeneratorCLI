const coinPath = "node_modules/hdaddressgenerator/tests/coins/"
const assert = require('assert')
const fs = require("fs")
const settings = require("./settings")
const coins = fs.readdirSync(coinPath)
const AddressGeneratorCli = require("../addressGeneratorCli.js");

let coinData = {}

if( settings.testCoin == "ALL") {

    coins.forEach(coin => {
        
        coinName = coin.split(".")[0]
        coinData[coinName] = {}
        coinData[coinName] = require("../"+coinPath+coin)

    })

} else {

    coinName = settings.testCoin
    coinData[coinName] = {}
    coinData[coinName] = require(coinPath+coinName+".js")

}

console.log("If encrypted address testing is enabled this may take a while.")


for (const coin in coinData) {

    const ref = coinData[coin]
    
    describe(`${ref.longName} (${ref.shortName})`, async () => {

        

        let bip44 = false
        let bip44WithPassPhrase = false
        let bip44Hardened = false
        let bip44Encrypted = false
        let bip44seed = false
        let bip49 = false
        let bip49Encrypted = false
        let bip84 = false
        let bip32 = false
        let bip32seed = false
        let bip141 = false
        let bip141seed = false 
        
        try{ bip44 = await new AddressGeneratorCli(['','','withMnemonic','--coin='+ref.shortName,'-m='+settings.mnemonic,'-t='+'3']).generate() } catch(e){console.log(e)}
        try{ bip44WithPassPhrase = await new AddressGeneratorCli(['','','withMnemonic','--coin='+ref.shortName,'-m='+settings.mnemonic,'-phrase='+settings.passphrase,'-t='+'3']).generate() } catch(e){console.log(e)}
        try{ bip44Hardened = await new AddressGeneratorCli(['','','withMnemonic','--coin='+ref.shortName,'-m='+settings.mnemonic,'-h=true','-t='+'3']).generate() } catch(e){console.log(e)}
        try{ bip44Encrypted = await new AddressGeneratorCli(['','','withMnemonic','--coin='+ref.shortName,'-m='+settings.mnemonic,'-pass='+settings.bip38Password,'-t='+'3']).generate() } catch(e){bip44Encrypted=false}
        try{ bip44seed = await new AddressGeneratorCli(['','','withSeed','--seed='+settings.bip32Seed,'--coin='+ref.shortName,'-t='+'3']).generate() } catch(e){console.log(e)}
        try{ bip49 = await new AddressGeneratorCli(['','','withMnemonic','--coin='+ref.shortName,'-m='+settings.mnemonic,'--bip=49','-t='+'3']).generate() } catch(e){console.log(e)}
        try{ bip49Encrypted = await new AddressGeneratorCli(['','','withMnemonic','--coin='+ref.shortName,'-m='+settings.mnemonic,'--bip=49','-pass='+settings.bip38Password,'-t='+'3']).generate() } catch(e){console.log(e)}
        try{ bip84 = await new AddressGeneratorCli(['','','withMnemonic','--coin='+ref.shortName,'-m='+settings.mnemonic,'--bip=84','-t='+'3']).generate() } catch(e){console.log(e)}
        try{ bip32 = await new AddressGeneratorCli(['','','withMnemonicBIP32','--coin='+ref.shortName,'-m='+settings.mnemonic,"-path=m/0'/0'",'--bip=32','-t='+'3']).generate() } catch(e){console.log(e)}
        try{ bip32seed = await new AddressGeneratorCli(['','','withSeedBIP32','--seed='+settings.bip32Seed,'--coin='+ref.shortName,"-path=m/0'/0'",'--bip=32','-t='+'3']).generate() } catch(e){console.log(e)}
        try{ bip141 = await new AddressGeneratorCli(['','','withMnemonicBIP141','--coin='+ref.shortName,'-m='+settings.mnemonic,"-path=m/0'/0'",'-algo=p2wpkhInP2sh','--bip=142','-t='+'3']).generate() } catch(e){console.log(e)}
        try{ bip141seed = await new AddressGeneratorCli(['','','withSeedBIP141','--seed='+settings.bip32Seed,'--coin='+ref.shortName,"-path=m/0'/0'",'-algo=p2wpkhInP2sh','--bip=142','-t='+'3']).generate() } catch(e){console.log(e)}

        // Test root Keys
        if ( ref.bip32RootKeyBip44 != undefined ){
            it(`Expect ${ref.shortName} bip32RootKeyBip44 to match reference.`, () => {
            assert.strictEqual(bip44.rootKeys.bip32RootKey,ref.bip32RootKeyBip44)
            })
        }

        if ( ref.bip32RootKeyBip49 != undefined ){
            it(`Expect ${ref.shortName} bip32RootKeyBip49 to match reference.`, () => {
                assert.strictEqual(bip49.rootKeys.bip32RootKey,ref.bip32RootKeyBip49)
            })
        }
        if ( ref.bip32RootKeyBip84 != undefined ){
            it(`Expect ${ref.shortName} bip32RootKeyBip84 to match reference.`, () => {
                assert.strictEqual(bip84.rootKeys.bip32RootKey,ref.bip32RootKeyBip84)
            })
        }
        if ( ref.bip32RootKeyBip84 != undefined ){
            it(`Expect ${ref.shortName} bip32RootKeyBip84 to match reference.`, () => {
                assert.strictEqual(bip84.rootKeys.bip32RootKey,ref.bip32RootKeyBip84)
            })
        }
        if ( ref.bip32RootKeyBip44WithPassphrase != undefined ){
            it(`Expect ${ref.shortName} bip32RootKeyBip44 to match reference when passphrase used.`, () => {
                assert.strictEqual(bip44WithPassPhrase.rootKeys.bip32RootKey,ref.bip32RootKeyBip44WithPassphrase)
            })
        }
        if ( ref.bip32RootKeyBip49 != undefined ){
            it(`Expect ${ref.shortName} bip32RootKeyBip141 to match reference.`, () => {
                assert.strictEqual(bip141.rootKeys.bip32RootKey,ref.bip32RootKeyBip49)
            })
        }
    
    
        // Test extended pub key as this generally requires all previous keys to be accurate. 
        if ( ref.bip32ExtPubKeyBip44 != undefined ){
            it(`Expect ${ref.shortName} bip32ExtPubKeyBip44 to match reference.`, () => {
                assert.strictEqual(bip44.rootKeys.bip32XpubKey,ref.bip32ExtPubKeyBip44)
            })
        }
        if ( ref.bip32ExtPubKeyBip49 != undefined ){
            it(`Expect ${ref.shortName} bip32ExtPubKeyBip49 to match reference.`, () => {
                assert.strictEqual(bip49.rootKeys.bip32XpubKey,ref.bip32ExtPubKeyBip49)
            })
        }
        if ( ref.bip32ExtPubKeyBip84 != undefined ){
            it(`Expect ${ref.shortName} bip32ExtPubKeyBip84 to match reference.`, () => {
                assert.strictEqual(bip84.rootKeys.bip32XpubKey,ref.bip32ExtPubKeyBip84)
            })
        }
    
        // Test address generation.
        if ( ref.addressBip44index0 != undefined && ref.addressBip44index1 != undefined ){
            it(`Expect ${ref.shortName} addressBip44index0 and addressBip44index1 address, pub, and priv keys to match reference.`, async () => {
                let addresses = await bip44.addresses
        
                assert.strictEqual(addresses[0].address,ref.addressBip44index0)
                assert.strictEqual(addresses[0].pubKey,ref.pubKeyBip44index0)
                assert.strictEqual(addresses[0].privKey,ref.privKeyBip44index0)
                assert.strictEqual(addresses[1].address,ref.addressBip44index1)
                assert.strictEqual(addresses[1].pubKey,ref.pubKeyBip44index1)
                assert.strictEqual(addresses[1].privKey,ref.privKeyBip44index1)
        
            })
        }

        if ( ref.addressBip44index0 != undefined && ref.addressBip44index1 != undefined && bip44seed != false ){
            it(`Expect ${ref.shortName} addressBip44index0 and addressBip44index1 address when generated with seed, pub, and priv keys to match reference.`, async () => {
                let addresses = await bip44seed.addresses
        
                assert.strictEqual(addresses[0].address,ref.addressBip44index0)
                assert.strictEqual(addresses[0].pubKey,ref.pubKeyBip44index0)
                assert.strictEqual(addresses[0].privKey,ref.privKeyBip44index0)
                assert.strictEqual(addresses[1].address,ref.addressBip44index1)
                assert.strictEqual(addresses[1].pubKey,ref.pubKeyBip44index1)
                assert.strictEqual(addresses[1].privKey,ref.privKeyBip44index1)
        
            })
        }
    
        if ( ref.addressBip44HardIndex0 != undefined ){
            it(`Expect ${ref.shortName} addressBip44HardIndex0 hardened address, pub, and priv keys to match reference.`, async () => {
                let addresses = await bip44Hardened.addresses
        
                assert.strictEqual(addresses[0].address,ref.addressBip44HardIndex0)
                assert.strictEqual(addresses[0].pubKey,ref.pubKeyBip44HardIndex0)
                assert.strictEqual(addresses[0].privKey,ref.privKeyBip44HardIndex0)
        
            })
        }
    
        if ( ref.addressBip44EncryptedIndex0 != undefined ){        
            it(`Expect ${ref.shortName} bip44Encrypted encrypted address, pub, and priv keys to match reference.`, async () => {
                let addresses = await bip44Encrypted.addresses
        
                assert.strictEqual(addresses[0].address,ref.addressBip44EncryptedIndex0)
                assert.strictEqual(addresses[0].pubKey,ref.pubKeyBip44EncryptedIndex0)
                assert.strictEqual(addresses[0].privKey,ref.privKeyBip44EncryptedIndex0)
        
            }).timeout(10000)
        }
    
        if ( ref.addressBip49index0 != undefined && ref.addressBip49index1 != undefined ){         
            it(`Expect ${ref.shortName} addressBip49index0 and addressBip49index1 address, pub, and priv keys to match reference.`, async () => {
                let addresses = await bip49.addresses
        
                assert.strictEqual(addresses[0].address,ref.addressBip49index0)
                assert.strictEqual(addresses[0].pubKey,ref.pubKeyBip49index0)
                assert.strictEqual(addresses[0].privKey,ref.privKeyBip49index0)
                assert.strictEqual(addresses[1].address,ref.addressBip49index1)
                assert.strictEqual(addresses[1].pubKey,ref.pubKeyBip49index1)
                assert.strictEqual(addresses[1].privKey,ref.privKeyBip49index1)
        
            })
        }

        if ( ref.addressBip49EncryptedIndex0 != undefined ){  
            it(`Expect ${ref.shortName} bip49Encrypted encrypted address, pub, and priv keys to match reference.`, async () => {
                let addresses = await bip49Encrypted.addresses
        
                assert.strictEqual(addresses[0].address,ref.addressBip49EncryptedIndex0)
                assert.strictEqual(addresses[0].pubKey,ref.pubKeyBip49EncryptedIndex0)
                assert.strictEqual(addresses[0].privKey,ref.privKeyBip49EncryptedIndex0)
        
            }).timeout(10000)
        }
    
        if ( ref.addressBip84index0 != undefined && ref.addressBip84index1 != undefined ){ 
            it(`Expect ${ref.shortName} addressBip84index0 and addressBip84index1 address, pub, and priv keys to match reference.`, async () => {
                let addresses = await bip84.addresses
        
                assert.strictEqual(addresses[0].address,ref.addressBip84index0)
                assert.strictEqual(addresses[0].pubKey,ref.pubKeyBip84index0)
                assert.strictEqual(addresses[0].privKey,ref.privKeyBip84index0)
                assert.strictEqual(addresses[1].address,ref.addressBip84index1)
                assert.strictEqual(addresses[1].pubKey,ref.pubKeyBip84index1)
                assert.strictEqual(addresses[1].privKey,ref.privKeyBip84index1)
        
            })
        }

        if ( ref.addressBip32index0 != undefined && ref.addressBip32index1 != undefined ){ 
            it(`Expect ${ref.shortName} addressBip32index0 and addressBip32index1 address, pub, and priv keys to match reference.`, async () => {
                let addresses = await bip32.addresses
        
                assert.strictEqual(addresses[0].address,ref.addressBip32index0)
                assert.strictEqual(addresses[0].pubKey,ref.pubKeyBip32index0)
                assert.strictEqual(addresses[0].privKey,ref.privKeyBip32index0)
                assert.strictEqual(addresses[1].address,ref.addressBip32index1)
                assert.strictEqual(addresses[1].pubKey,ref.pubKeyBip32index1)
                assert.strictEqual(addresses[1].privKey,ref.privKeyBip32index1)
        
            })
        }
    
        if ( ref.addressBip32index0 != undefined && ref.addressBip32index1 != undefined && bip32seed != false ){ 
            it(`Expect ${ref.shortName} addressBip32index0 and addressBip32index1 address with seed instead of mnemonic, pub, and priv keys to match reference.`, async () => {
                let addresses = await bip32seed.addresses
        
                assert.strictEqual(addresses[0].address,ref.addressBip32index0)
                assert.strictEqual(addresses[0].pubKey,ref.pubKeyBip32index0)
                assert.strictEqual(addresses[0].privKey,ref.privKeyBip32index0)
                assert.strictEqual(addresses[1].address,ref.addressBip32index1)
                assert.strictEqual(addresses[1].pubKey,ref.pubKeyBip32index1)
                assert.strictEqual(addresses[1].privKey,ref.privKeyBip32index1)
        
            })
        }
    
        if ( ref.addressBip141index0 != undefined && ref.addressBip141index1 != undefined ){ 
            it(`Expect ${ref.shortName} addressBip32index0 and addressBip32index1 address, pub, and priv keys to match reference.`, async () => {
                let addresses = await bip141.addresses
        
                assert.strictEqual(addresses[0].address,ref.addressBip141index0)
                assert.strictEqual(addresses[0].pubKey,ref.pubKeyBip141index0)
                assert.strictEqual(addresses[0].privKey,ref.privKeyBip141index0)
                assert.strictEqual(addresses[1].address,ref.addressBip141index1)
                assert.strictEqual(addresses[1].pubKey,ref.pubKeyBip141index1)
                assert.strictEqual(addresses[1].privKey,ref.privKeyBip141index1)
        
            })
        }
    
        if ( ref.addressBip141index0 != undefined && ref.addressBip141index1 != undefined && bip141seed != false ){         
            it(`Expect ${ref.shortName} addressBip32index0 and addressBip32index1 address with seed instead of mnemonic, pub, and priv keys to match reference.`, async () => {
                let addresses = await bip141seed.addresses
        
                assert.strictEqual(addresses[0].address,ref.addressBip141index0)
                assert.strictEqual(addresses[0].pubKey,ref.pubKeyBip141index0)
                assert.strictEqual(addresses[0].privKey,ref.privKeyBip141index0)
                assert.strictEqual(addresses[1].address,ref.addressBip141index1)
                assert.strictEqual(addresses[1].pubKey,ref.pubKeyBip141index1)
                assert.strictEqual(addresses[1].privKey,ref.privKeyBip141index1)
        
            })
        }
        
    })



}
