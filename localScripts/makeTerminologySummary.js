#!/usr/bin/env node

let fs = require('fs')

let syncRequest = require('../../common/node_modules/sync-request');

//arReport.push("### Terminology Summary \n\n")

let vocabPath = '../shorthand/build/input/vocabulary/'; //where the FHIR files are found. 

//the summary of ValueSets and bundings to the model
let outFileName = "../shorthand/build/input/pagecontent/terminologySummary.xml"
let arReport = [];
arReport.push('<div xmlns="http://www.w3.org/1999/xhtml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://hl7.org/fhir ../../src-generated/schemas/fhir-single.xsd">')
  
//details of code systems defined by the IG
let csFileName = "../shorthand/build/input/pagecontent/codeSystem.xml"
let arCS= []
arCS.push('<div xmlns="http://www.w3.org/1999/xhtml">');

let serverRoot = "http://home.clinfhir.com:8054/baseR4/";   //the server to upload FSH & SD
let arModelId = ["NzNHIPatient"];

//first, create a hash of the entries in the vocab folder - and the codesystem detail
let hashVS = {}
fs.readdirSync(vocabPath).forEach(function(file) {

    //let fullFileName = vocabPath + file;     //location of the fsh file
    //let contents = fs.readFileSync(fullFileName, {encoding: 'utf8'})
//console.log(file)
    if (file !== '.DS_Store') {
        let ar = file.split('-')
        let fullFileName = vocabPath + file;     //location of the fsh file
        console.log('filename: ' + fullFileName)
        //create a Binary resource and upload to the server
        let contents = fs.readFileSync(fullFileName, {encoding: 'utf8'})
        let resource = JSON.parse(contents.toString())
    
        if (ar.length > 1) {
            if (ar[0] == 'ValueSet') {       //this is a profile or an extension...
                hashVS[resource.url] = {vs:resource,element:[]}
            }
    
            if (ar[0] == 'CodeSystem') { 
    
                arCS.push("<h4>" + resource.name + "</h4>");
    
                arCS.push("<div class='row'>");
                arCS.push("<div class='col-6'>");
                arCS.push("<strong>" + resource.url + "</strong>");
                arCS.push("</div>")
    
                arCS.push("<div class='col-6'>");
                arCS.push("<em>" + resource.description + "</em>");
                arCS.push("</div>")
    
                arCS.push("</div>")
    
                
    
                arCS.push("<table class='table table-condensed table-bordered'>\n")
                arCS.push("<tr><th width='15%'>Code</th><th>Display</th></tr>")
    
                resource.concept.forEach(function(concept){
                    arCS.push("<tr>")
                    arCS.push("<td>" + concept.code + "</td>");
                    arCS.push("<td>" + concept.display + "</td>");
                    arCS.push("</tr>")
                })
    
                arCS.push("</table>")
            }
        }
    }

})

//the codesystem display doesn't add value to the existing IG pages
//arCS.push("</div>");
//console.log(hashVS)
//next, load the models and create the report


//actully, might want a separate file for each and adjust the menu.xml... - maybe...
arModelId.forEach(function(modelId){

    arReport.push("<h4>"+modelId + "</h4>");
    arReport.push("<h5> Summary by element</h5>");
    arReport.push("<table class='table table-condensed table-bordered'>\n")
    arReport.push("<tr><th>Path</th><th>Url</th><th>Title</th><th>Description</th><th>CodeSystem Urls</th></tr>");

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
            if (isCoded(ed)) {
                arReport.push("<tr>");
                arReport.push("<td>" + dropFirst(ed.path) + "</td>");
                
                if (ed.binding) {
                    let url = ed.binding.valueSet;     //the vs canonical url

                    console.log(url)
                    arReport.push("<td>" + url + "</td>");
                    let vo = hashVS[url];
                    if (vo) {
                        let vs = vo.vs;
                        vo.element.push(dropFirst(ed.path))
                        arReport.push("<td>" + vs.title + "</td>");
                        arReport.push("<td>" + vs.description + "</td>");
                        
            
                        let lne = "<td>"
                        if (vs.compose.include) {
                            vs.compose.include.forEach(function(inc){
                                lne += "<div>" + inc.system + "</div>"
                            })
                        }
                        arReport.push(lne + "</td>")


                    } else {

                        arReport.push("<td></td><td></td><td>This ValueSet not defined in this IG</td>");
                    }

                } else {
                    arReport.push("<td></td><td></td><td>This element has no binding</td>");
                }
                arReport.push("</tr>");
            }

        })
        arReport.push("</table>");
    }

    arReport.push("<h5> Summary by ValueSet </h5>");
    arReport.push("<table class='table table-condensed table-bordered'>\n")
    arReport.push("<tr><th>Url</th><th>elements</th></tr>");

    for (let [key, value] of Object.entries(hashVS)) {

        if (value.element.length > 0) {
            arReport.push("<tr>");
        } else {
            arReport.push("<tr style='background-color: #ffcccc' >");
        }

        //console.log(value)
        arReport.push("<td>" + key + "</td>");
        if (value.element.length > 0) {
            arReport.push("<td>");
            value.element.forEach(function(el){
                arReport.push("<div>" + el + "</div>");
            })
            arReport.push("</td>");
        } else {
            arReport.push("<td>There are no elements in the model bound to this ValueSet</td>");
        }
        
        arReport.push("</tr>");
      }
      arReport.push("</table>");

})
arReport.push("</div>");

let report = arReport.join('\n')
fs.writeFileSync(outFileName,report)

let cs = arCS.join('\n')
fs.writeFileSync(csFileName,cs)

//console.log()
//now, pull out the resources from the vocab folder...

return;


function dropFirst(s) {
    let ar = s.split('.')
    ar.splice(0,1)
    return ar.join('.')
}

fs.readdirSync(path).forEach(function(file) {

    let fullFileName = path + file;     //location of the fsh file
    //let contents = fs.readFileSync(fullFileName, {encoding: 'utf8'})


    let ar = file.split('-')
    if (ar.length > 1) {

        if (ar[0] == 'ValueSet') {       //this is a profile or an extension...

            
            let fullFileName = path + file;     //location of the fsh file
            console.log(fullFileName)
            //create a Binary resource and upload to the server
            let contents = fs.readFileSync(fullFileName, {encoding: 'utf8'})
            let vs = JSON.parse(contents.toString())

            summary += "<tr>"
            summary += "<td>" + vs.title + "</td>"
            summary += "<td>" + vs.description + "</td>"
            summary += "<td>" + vs.url + "</td>"

            summary += "<td>"
            if (vs.compose.include) {
                vs.compose.include.forEach(function(inc){
                    summary += "<div>" + inc.system + "</div>"
                })
            }
            summary += "</td>"

            summary += "</tr>\n"

        }
    }
})

summary += "</table>"

console.log(summary)
fs.writeFileSync(outFileName,summary)

//return true if the ed is coded
function isCoded(ed) {
    let arCoded = ['CodeableConcept','Coding','code']
    if (ed.type) {
        for (const typ of ed.type) {
            if (arCoded.indexOf(typ.code) > -1) {
                return true
                //break;
            }
        }
    } else {
        return false;
    }
    return false;
}
