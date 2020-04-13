#!/usr/bin/env node

/**
Create a logical model suitable for the IG builder

 */
let fs = require('fs');
let syncRequest = require('../../common/node_modules/sync-request');

let serverRoot = "http://home.clinfhir.com:8054/baseR4/";   //the server to upload FSH & SD
let modelId = "NzNHIPatient";
let Id = "NhiPatientLM";        //we'll change the Id
let domain = "http://hl7.org.nz/fhir/"

let outFile = "../shorthand/build/input/models/StructureDefinition-" + Id + '.json'

let options = {};
options.headers = {"content-type": "application/json+fhir"}
options.timeout = 20000;        //20 seconds

let url = serverRoot + "StructureDefinition/"+modelId;
console.log(url)
let response = syncRequest('GET', url, options);
console.log(response.statusCode)
if (response.statusCode !== 200 ) {
    console.log('  error' + response.body.toString())
} else {
    let model = JSON.parse(response.body.toString())
    let newModel = JSON.parse(JSON.stringify(model));
    delete newModel.extension;
    delete newModel.snapshot;
    delete newModel.identifier;
    delete newModel.keyword;
    newModel.id = Id;
    newModel.url = domain + "StructureDefinition/" + Id;
    newModel.name = "Id"
    newModel.title = "Logical Model for patient";
    newModel.differential = {element:[]}

    model.snapshot.element.forEach(function(ed,inx){
        if (inx ==0) {
            delete ed.label;
        }
        delete ed.extension
        newModel.differential.element.push(ed)
    })
    fs.writeFileSync(outFile,JSON.stringify(newModel))

}
