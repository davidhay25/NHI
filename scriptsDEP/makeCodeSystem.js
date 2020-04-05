#!/usr/bin/env node

//generate the CodeSystem and ValueSets from input csv files
//line 1 - name
//line 2 - codesystem url
//line 3 - valueset url
//line 4 - title
//line 5 - description
//line 6 - blank

//lines > 6 - concept,description

let fs = require('fs');
let syncRequest = require('sync-request');

//comment out this line to prevent sending the resources to the terminology server
//note that the terminology resources must also be on the same server as thi IG - otherwise updates will be rejected...
let serverRoot = "https://ontoserver.csiro.au/stu3-latest/"
//let serverRoot = "http://home.clinfhir.com:8054/baseR4/"


let path = '../codesystems/';   //path to source csv files
let outFolder = '../codesystems/out/';    //path to output files


fs.readdirSync(path).forEach(function(file) {

    let ar = file.split('.')
    if (ar.length > 1) {
        if (ar.pop() == 'csv' ) {

            console.log('------------ ' + file)
            

            //assume this is a csv file in the required format
            let fullFileName = path + file;
            let contents = fs.readFileSync(fullFileName).toString()//, {encoding: 'utf8'})

            //remove any BOM
            contents = contents.replace(/^\uFEFF/, "")

            let arContents = contents.split('\n')
            let name = splitLine(arContents[0])[0];
           
            let csCanonical = splitLine(arContents[1])[0];
            let vsCanonical = splitLine(arContents[2])[0];
            let title = splitLine(arContents[3])[0];
            let description = splitLine(arContents[4])[0];

            arContents.splice(0,6)      //remove the header lines

            //make the CodeSystem
            let cs = {resourceType:"CodeSystem",id:name,status:"draft",name:name,title:title,description:description,content:'complete'}
            cs.url = csCanonical;
            cs.concept = [];


            arContents.forEach(function(lne){
                lne = lne.replace('\r','')
                let ar = splitLine(lne)
                if (ar[0] && ar[1]) {
                    let concept = {code:ar[0],display:ar[1]}
                    cs.concept.push(concept)
                } else {
                    console.log('Ignoring empty codes or values')
                }
                
            })

            //write out the CodeSystem
            let csFileName = outFolder+name + "-cs.json";
            fs.writeFileSync(csFileName,JSON.stringify(cs))
                    
            //make the ValueSet that refers to the CodeSystem as a whole
            let vs = {resourceType:"ValueSet",id:name,status:"draft",name:name,title:title,description:description};
            vs.url = vsCanonical;
            vs.compose = {include:[{system:csCanonical}]}

            //write out the ValueSet
            let vsFileName = outFolder+name + "-vs.json";
            fs.writeFileSync(vsFileName,JSON.stringify(vs))

            //save to the Terminology server if configured to do so...
            if (serverRoot) {
                PUTFile(serverRoot + "CodeSystem/" + name,cs)
                PUTFile(serverRoot + "ValueSet/" + name,vs)
            }

        }
    }
})

//PUT a file to the server, given url and contents
function PUTFile(url,resource) {

    console.log(url);
    var options = {};
    options.headers = {"content-type": "application/json+fhir"}
    options.timeout = 20000;        //20 seconds
    options.body = JSON.stringify(resource);

    var response = syncRequest('PUT', url, options);
   
    if (response.statusCode !== 200 && response.statusCode !== 201) {
        console.log('  error' + response.body.toString())
        console.log(response.statusCode)
        console.log(JSON.stringify(resource))
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


function splitLine(lne) {
    lne = lne.replace('\r','')
    return lne.split(',')
}
