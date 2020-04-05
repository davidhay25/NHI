#!/usr/bin/env node

/**
 * make the summary file use dby the NZ IG / profile viewer*/

let fs = require('fs');

let serverRoot = "http://home.clinfhir.com:8054/baseR4/"
let path = '../shorthand/build/input/resources/';       //where the files are located
let summary = {profiles:[],extensions:[]}     //the summary source document

//add the base resource for the graph
let baseItem = {}
baseItem.name = "DomainResource"
baseItem.description = "Domain Resource";
baseItem.url = "http://hl7.org/fhir/StructureDefinition/DomainResource"
summary.profiles.push(baseItem)

//load all the extension definitions into a hash by url
let hashExtension = {}
fs.readdirSync(path).forEach(function(file) {
    let ar = file.split('-')
    if (ar.length > 1) {

        let type = ar[0];
        if (type == 'StructureDefinition') {       //Only want structure definition
            let fullFileName = path + file;     //location of the SD file
            let contents = fs.readFileSync(fullFileName, {encoding: 'utf8'})
            let resource = JSON.parse(contents)
            if (resource.type == 'Extension') {
                //this is an extension. Add to the hash of extensions
                hashExtension[resource.url] = resource
            }
        }
    }
})

fs.readdirSync(path).forEach(function(file) {
    let ar = file.split('-')
    if (ar.length > 1) {

        let type = ar[0];
        if (type == 'StructureDefinition') {       //Only want structure definition

            let fullFileName = path + file;     //location of the SD file
            let contents = fs.readFileSync(fullFileName, {encoding: 'utf8'})
            let resource = JSON.parse(contents)

            if (resource.type !== "Extension") {
                //console.log(fullFileName)
                let item = {}
                item.name = resource.name;
                item.description = resource.description;
                item.url = resource.url;

                let baseProfileName = getNameFromUrl(resource.baseDefinition)
                item.baseProfile = baseProfileName
                item.extensions = []
                item.bindings = []

                //assemble the list of extensions for this profile
                resource.snapshot.element.forEach(function(element){
                    if (element.type) {
                        element.type.forEach(function(typ){
                            if (typ.code == "Extension") {
                                if (typ.profile) {
                                    typ.profile.forEach(function(prof){
                                        let extItem = {url:prof,path:element.path}
                                        let extDefinition = hashExtension[prof]

                                        //let analysis = analyseExtension(hashExtension[prof]);
                                        if (extDefinition) {
                                            extItem.analysis = analyseExtension(extDefinition)
                                        } else {
                                            console.log('No definition found for ' + prof)
                                        }

                                        

                                       // extItem.binding = element.binding



                                        item.extensions.push(extItem)
                                    })
                                }
                            }   
                        })
                    }
                    //look for bindings directly from the element...
                    if (element.binding && element.binding.valueSet) {
                        delete element.binding.extension;
                        let bindItem = {binding:element.binding, path:element.path}
                        item.bindings.push(bindItem)
                    }            
                })

                summary.profiles.push(item)
                if (resource.baseDefinition.indexOf("http://hl7.org/fhir/StructureDefinition/")>-1 ) {
                    //this is a core resource type. There should only be 1 level 2 profile that refers to it, so just add an item
                    let coreItem = {}
                    coreItem.name = baseProfileName
                    coreItem.description = "Core profile for "+ baseProfileName;
                    coreItem.baseProfile = "DomainResource"
                    coreItem.url = "http://hl7.org/fhir/StructureDefinition/" + getNameFromUrl(resource.baseDefinition);
                    summary.profiles.push(coreItem)
                }
            } else {
                //this is an extension
                let item = {};
                item.url = resource.url;
                item.description = resource.description;
                item.analysis =  analyseExtension(resource)
                summary.extensions.push(item)
            }
        }
}

})
//console.log(summary)

let fileName = path + "igSummary.json"
fs.writeFileSync(fileName,JSON.stringify(summary,null,2))

function getNameFromUrl(url) {
    let ar = url.split('/')
    return ar[ar.length-1]
}

//pull out the contents of the extension. Assume mo more than 2 levels of extension
function analyseExtension(SD) {
    
    let extensionSummary = {};
    //first, is this complex or simple?
    let isComplex = false
    
    SD.differential.element.forEach(function(ed){
     /*   if (ed.id.indexOf('Extension.extension:') > -1 ) {
            //this is an element describing an extension inside an extension - ie a 'child' element
            isComplex = true;
        }

        */

        if (ed.path == 'Extension.url') {
            //the canoniocal url of the extension - whether simple or complex 
            extensionSummary.url = ed.fixedUri;
        }

        console.log(ed.path.substr(0,15))
        if (ed.path.substr(0,15) == 'Extension.value') {
            //this is the value type for a simple extension. (complex will be Extension.extension.value...)
            extensionSummary.style = 'simple'
          /*  if (ed.slicing) {
                //this is the discriminator element - it will have the type
                extensionSummary.type = ed.type
            }
*/
            if (ed.type) {
                //this is the discriminator element - it will have the type
                extensionSummary.type = ed.type
            }

            if (ed.binding) {
                extensionSummary.binding = ed.binding;
            }
        }
    })

    if (extensionSummary.style == 'simple') {
        //this is a simple extension. 
        return extensionSummary
    }

    //this is a complex extension. we already have the url, now go looking for the children
    extensionSummary.style = 'complex'
    extensionSummary.children = []
    let currentChild;
    SD.differential.element.forEach(function(ed){
        if (ed.path == 'Extension.extension' && ed.sliceName){
            //this is a new slice.
            currentChild = {name:ed.sliceName}
            extensionSummary.children.push(currentChild)
        }
        if (ed.path.substr(0,25) == 'Extension.extension.value') {
            if (ed.type) {
                currentChild.type = ed.type
            }
            if (ed.binding) {
                currentChild.binding = ed.binding
            }
        }


    })

    return extensionSummary;


}
