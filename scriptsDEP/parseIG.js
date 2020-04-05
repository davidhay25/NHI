#!/usr/bin/env node

//single use script...

let out = ""
let fs = require('fs');
let fileName = "../nzRegistry.json"

let contents = fs.readFileSync(fileName, {encoding: 'utf8'})
let resource = JSON.parse(contents)

resource.definition.resource.forEach(function(res){
    console.log(res.reference.reference)
    out += res.reference.reference + ":\n"

    out += "  name: " + res.name + "\n" 
    
    if (res.description) {
        out += "  description: " + res.description + "\n" 
    }
   /*
    if (res.exampleBoolean) {
        out += "  exampleBoolean: true\n" 
    }
*/
    if (res.exampleCanonical) {
        out += "  exampleCanonical: " + res.exampleCanonical + "\n" 
    }

console.log(res)

})

console.log(out)

fs.writeFileSync('../lines.txt',out)