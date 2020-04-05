#!/usr/bin/env node
//create a summary of use of extensions 
let fs = require('fs')

let syncRequest = require('../../common/node_modules/sync-request');

//the extension from the LM where the extension url is placed...
let extensionUrl = "http://clinfhir.com/fhir/StructureDefinition/simpleExtensionUrl";

let extensionPath = '../shorthand/build/input/extensions/'; //where the FHIR files are found. 

//the summary of Extensions
let outFileName = "../shorthand/build/input/pagecontent/extensionSummary.xml"

let arReport = [];
arReport.push('<div xmlns="http://www.w3.org/1999/xhtml">')

let serverRoot = "http://home.clinfhir.com:8054/baseR4/";   //the server where the LM is...
let arModelId = ["NzNHIPatient"];

//first, create a hash of the extension definitions in the folder - 
let hashExtension = {}
fs.readdirSync(extensionPath).forEach(function(file) {

    let ar = file.split('-')
    let type= ar[0]
    let fullFileName = extensionPath + file;     //location of the fsh file
    console.log('filename: ' + file)
    if (type == 'StructureDefinition') {
        let contents = fs.readFileSync(fullFileName, {encoding: 'utf8'})
        let resource = JSON.parse(contents.toString())
        let url = resource.url
        let ar = file.split('.')
        let extensionHtml = ar[0] + '.html'
        hashExtension[url] = {html:extensionHtml,ext:resource,element:[]}
    }
})

//next, load the models and create the report
arModelId.forEach(function(modelId){

    let url = serverRoot + "StructureDefinition/"+modelId;
    let options = {};
    options.headers = {"content-type": "application/json+fhir"}
    options.timeout = 20000;        //20 seconds

    let response = syncRequest('GET', url, options);
    console.log(response.statusCode)
    if (response.statusCode !== 200 ) {
        console.log('  error' + response.body.toString())
        return false
    } else {
        let model = JSON.parse(response.body.toString())
        model.snapshot.element.forEach(function(ed){
           

            let ext = getSingleExtensionValue(ed,extensionUrl);
            if (ext) {
                let url = ext.valueString;      //the url of the extension
                ////console.log(url)
                if ( hashExtension[url]) {
                    hashExtension[url].element.push(ed.path)
                } else {
                    hashExtension[url] = {element: [ed.path],external:true}
                }
            }                    
          
        })
    }
})

//console.log(hashExtension)

arReport.push("<table class='table table-condensed table-bordered'>\n")
arReport.push("<tr><th>Url</th><th>Description</th><th>Where used</th></tr>");


//convert into an array and sort
let ar = []
for (let [key, value] of Object.entries(hashExtension)) {
    ar.push({key:key, value:value})
}
ar.sort(function(a,b){
    if (a.key > b.key) {
        return 1
    } else {
        return -11
    }
})

ar.forEach(function(vo) {
    let key = vo.key, value=vo.value;
    arReport.push("<tr>");

    arReport.push("<td><a href='"+value.html+"'>" + key + "</a></td>");

    arReport.push("<td>");
    if (value.ext) {
        arReport.push(value.ext.description);
    } else {
        if (value.external) {
            arReport.push("(Not defined in this IG)");
        }
        
    }
    arReport.push("</td>");
    arReport.push("<td>");
    value.element.forEach(function(element){
        arReport.push("<div>" + element + "</div>");
    })

    arReport.push("</td>");
    arReport.push("</tr>");
})


arReport.push("</table>");
arReport.push("</div>");

let report = arReport.join('\n')
fs.writeFileSync(outFileName,report)


return;

function getSingleExtensionValue(resource,url) {
    //return the value of an extension assuming there is only 1...
    var extension;
    if (resource && url) {
        resource.extension = resource.extension || []
        resource.extension.forEach(function(ext){
            if (ext.url == url) {extension = ext}
        });
    }

    return extension;
}