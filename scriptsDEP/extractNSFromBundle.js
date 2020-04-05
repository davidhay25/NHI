#!/usr/bin/env node

//this is a single use script to download the namingsystems and update the IG

let fs = require('fs');

let IGPath = "../nzRegistry.json";
let IG = JSON.parse(fs.readFileSync(IGPath).toString());
console.log(IG)

let folder = "../namingSystems/";
let bundle = JSON.parse(fs.readFileSync(folder+"bundleNS.json").toString());

bundle.entry.forEach(function(entry){
    let ns = entry.resource;

    //save the resource
    let nsFileName = "../namingsystems/"+ns.id + ".json";
    fs.writeFileSync(nsFileName,JSON.stringify(ns,null,2))

    let ref = "NamingSystem/"+ns.id
    //locate in IG
    let found = false;
    IG.definition.resource.forEach(function(res){
        if (res.reference.reference && res.reference.reference == ref) {
            found = true
        }
    })
    console.log(ref,found)
    if (!found) {
        //update the IG
        let res = {name: ns.name,description:ns.description,extension:[]}
        res.reference = {reference:'NamingSystem/'+ns.id}
        res.extension.push({url:'http://clinfhir.com/StructureDefinition/igEntryType',valueCode:"namingsystem"})
       
        console.log(res)
        IG.definition.resource.push(res)
    }
})

fs.writeFileSync(IGPath,JSON.stringify(IG,null,2))


//onsole.log(bundle)



