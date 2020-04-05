#!/usr/bin/env node

/** Utilities related to IG's. Used by the other scripts
 * 
 *  updateIG - updates the loaded IG
    loadIG Load an IG into memory
    PUTFile - generic PUT operation
 * 
 */


let fs = require('fs');
let syncRequest = require('sync-request');
let IG;

loadIG = function (name) {
    let pathToIG = "../"+ name;
    let contents = fs.readFileSync(pathToIG, {encoding: 'utf8'})
    IG = JSON.parse(contents)
    console.log("IG loaded: "+ name)
}

//
function updateIG(vo) {
    return
    // vo = {reference: }
    console.log(vo.reference)
    for (let res in IG.definition.resource) {
        if (res.reference == vo.reference) {
            console.log('found')
            return;
        }
    }
    
    console.log('not found')

    //not found 
    let res = {name:vo.name,descrption:vo.descrption}
    IG.definition.resource.push(res)

}

//PUT a file to the server, given url and contents
function PUTFile(url,resource) {
    console.log('--------------');
    console.log(url);
    var options = {};
    options.headers = {"content-type": "application/json+fhir"}
    options.timeout = 20000;        //20 seconds
    options.body = JSON.stringify(resource);

    var response = syncRequest('PUT', url, options);
    console.log(response.statusCode)
    if (response.statusCode !== 200 && response.statusCode !== 201) {
        console.log('  error' + response.body.toString())
        return false
    } else {
        if (response.statusCode == 200) {
            console.log('Updated ' + url)
        } 
        
        if (response.statusCode == 201) {
            console.log('Created ' + url)
        }
       
        return true
    }
}


module.exports = {
    updateIG : updateIG,
    loadIG : loadIG,
    PUTFile : PUTFile
}