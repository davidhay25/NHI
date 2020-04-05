#!/usr/bin/env node

/**
Create an html table that represents the model 
 */
let fs = require('fs');
let syncRequest = require('../../common/node_modules/sync-request');

let serverRoot = "http://home.clinfhir.com:8054/baseR4/";   //the server to upload FSH & SD
let modelId = "NzNHIPatient";
//et outFile="./modelTable.html";



//let path = '../shorthand/build/input/vocabulary/'; //where the FSH files are found. SD's are in the subfolder build/input/resources/
let outFile = "../shorthand/build/input/pagecontent/models.md"

let extensionUrl = "http://clinfhir.com/fhir/StructureDefinition/simpleExtensionUrl";

let fileContent = "### Patient\n"

var options = {};
options.headers = {"content-type": "application/json+fhir"}
options.timeout = 20000;        //20 seconds


let url = serverRoot + "StructureDefinition/"+modelId;

var response = syncRequest('GET', url, options);
console.log(response.statusCode)
if (response.statusCode !== 200 ) {
    console.log('  error' + response.body.toString())
    return false
} else {
    let table = "<table class='table table-condensed table-bordered'>";
    table += "<tr><th>Element</th><th>DataType</th><th>Description</th><th>Mult.</th><th>Details</th></tr>"
    let model = JSON.parse(response.body.toString())
    model.snapshot.element.forEach(function(ed){
        table += "<tr>"
        
        let path = getLast(ed.path)

        let displayPath = "<div style='padding-left:"+ indent(ed.path) + "px'>" + path + "</div>"
        table += "<td>" + displayPath + "</td>"

        //table += "<td>" + ed.mustSupport + "</td>"

        table += "<td>"
        //see if there is an extension
        let ext = getSingleExtensionValue(ed,extensionUrl);

        if (ed.type) {

            ed.type.forEach(function(typ){
                let lne = typ.code;
                //console.log(typ.code)

                if (typ.targetProfile) {
                    lne += ' -> '
                    typ.targetProfile.forEach(function(prof){
                        lne += getLast(prof,'/');
                    })
                }
                if (ext && ext.valueString) {
                    lne += "<div>(Extension)</div>"
                }
                table += "<div>" + lne  + "</div>";
            })
           
        }
        table += "</td>"

        table += "<td>";
            if (ed.description) {
                table += ed.description;
            }

            if (ed.comment) {
                table +=  "<div>" + ed.comment + "</div>" 
            }


        table +=   "</td>"

        table += "<td>" + ed.min + ".." + ed.max + "</td>"

        table += "<td>"

        if (ed.binding) {
            table += "<div>VS: " + ed.binding.valueSet + " (" + ed.binding.strength + ") </div>"
        }

        //see if there is an extension
        //let ext = getSingleExtensionValue(ed,extensionUrl);
        if (ext) {
            let url = ext.valueString;      //the url of the extension
            table += "<div>Ext: " +url+ " </div>"
        }
                    


        table += "</td>"

        
        table += "</tr>\n"

    })
    table += "</table>"

    fileContent += table;

    fs.writeFileSync(outFile,fileContent)


    console.log(table)
}

function getLast(s,char) {
    char = char || '.'
    let ar = s.split(char);;
    return ar[ar.length-1]
}

function indent(s) {
    var ar = s.split('.');
    return 10 * ar.length;
}

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