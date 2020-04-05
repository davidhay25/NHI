#!/usr/bin/env node

//download all the LM's into a folder

let fs = require('fs');
let syncRequest = require('sync-request');
let options = {};
options.headers = {"accept": "application/json+fhir"}
options.timeout = 20000;        //20 seconds

let remoteFhirServer = "http://home.clinfhir.com:8054/baseR4/"; //the server where the models are stored
let backupFolder = '../logicalModelsFromServer/'

//todo - load model names from IG guide...
arModels = ["HpiPractitioner","NzNHIPatient","HpiPractitionerRole","HpiLocation","HpiOrganization"];

arModels.forEach(function (modelId) {
    console.log("=============== " + modelId + " =================")
    let urlModel = remoteFhirServer + "StructureDefinition/"+modelId;
    let response = syncRequest('GET', urlModel, options);
    let model = JSON.parse(response.body.toString());

    let fileName = backupFolder + "StructureDefinition-"+ modelId;
    fs.writeFileSync(fileName,JSON.stringify(model))




})