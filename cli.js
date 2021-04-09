const AddressGeneratorCli = require("./addressGeneratorCli.js")


;(async()=>{

    let results = {}
    let addGenCli = new AddressGeneratorCli(process.argv)

    try{
        results = await addGenCli.generate()
    } catch(e){
        console.log(e .red)
        addGenCli.printHelp()
        process.exit()
    }

    addGenCli.processOutput()  
    
})();
