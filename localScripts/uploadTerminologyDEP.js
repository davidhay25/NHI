#!/usr/bin/env node

/**
 * Upload the ternimology resources to tx.fhir.org
 **/

console.log("Uploading Terminology resources")

let path = '../shorthand/build/input/vocabulary/'; 

let fs = require('fs');
let syncRequest = require('../../common/node_modules/sync-request/lib');
let serverRoot = "http://tx.fhir.org/r4/"


fs.readdirSync(path).forEach(function(file) {
    let ar = file.split('-')
    let type = ar[0]
    if (type == 'CodeSystem' || type=='ValueSet'){
        let fullFileName = path + file;     //location of the fsh file
        //console.log(fullFileName)

       
        let contents = fs.readFileSync(fullFileName, {encoding: 'utf8'}).toString();
        let json = JSON.parse(contents)
        let id = 'cf-' + json.id
        json.id = id;
        let url = serverRoot + type + "/" + id
        PUTResource(url,json)
        ///console.log(url);
       // let vs = JSON.parse(contents.toString())
    }
})


function PUTResource(url,resource) {

    console.log(url);
    var options = {};
    options.headers = {"content-type": "application/json+fhir","Accept":"application/json+fhir"}
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