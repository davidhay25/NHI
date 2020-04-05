#!/usr/bin/env node

//Create List resources to represent specific scenarios. 

let IG = require("./IGUtils")

console.log(IG)

IG.loadIG('nzRegistry.json')




let fs = require('fs');
let syncRequest = require('sync-request');

let path = '../shorthand/';     //where the fsh scenario files are located
let outPutPath = '../shorthand/build/input/resources/';     //where the List resources will be placed

//get all the instance files. id must be unique within the scenario - even across types
let hash = {}, err = false;
fs.readdirSync(outPutPath).forEach(function(file) {
    
    file = file.substr(0,file.length -5);       //strip off the .json extension
    //console.log(file)
    let ar = file.split('-')
    let ar1 = ar.splice(0,1)
    let type = ar1[0]
    if (type !== 'StructureDefinition') {
        let id = ar.join('-')
        if (hash[id]) {
            console.log('>>>>>>>>>> duplicate id:' + id)
            err = true
        }   
        hash[id] = type;
    }
})

if (err) {
    return;
}

//now look for scenario files in the shorthand folder
let foundInstance = false;      //set true as soon as an instance is found. All text before that is the scenario description
fs.readdirSync(path).forEach(function(file) {
    let arFileName = file.split('-');
    if (arFileName.length > 1) {

        if (arFileName[0] == 'scenario') {       //This is a scenario

            arFileName.splice(0,1);
            arFileName = arFileName.join("")
            let ar1 = arFileName.split('.')
            let id = ar1[0];//.join("")
            let scenario = {resourceType:'List',id:id,status:'current',mode:'snapshot',entry:[]}
            let text = ""
            let fullFileName = path + file;     //location of the fsh file
            
            //load the scenario fsh file
            let contents = fs.readFileSync(fullFileName, {encoding: 'utf8'})
            let ar = contents.split('\n')
            ar.forEach(function(lne){
                let ar1 = lne.split(':')
                if (ar1[0] == 'Instance') {     //this is an instance declared in the file
                    foundInstance = true;
                    let id = ar1[1].trim()

                    //id = id.split('-').join('')  
                    let type = hash[id]
                    let entry = {item:{reference:type + '/' + id}}
                    scenario.entry.push(entry)

                    console.log('|'+id+'|',type)
                } else {
                    if (!foundInstance) {
                        let lne1 = lne.split('/').join('')    //get rid of the comments
                        if (lne1) {
                            text += "<p>" + lne1 + "</p>"
                        }
                        
                    }
                }
            })


            

            scenario.text = {status:'generated',div:"<div xmlns='http://www.w3.org/1999/xhtml'>" + text + '</div>'}

            let scenarioFileName = outPutPath+'List-'+id + ".json";
           
            fs.writeFileSync(scenarioFileName,JSON.stringify(scenario,null,2))
           
            console.log(scenario)
            console.log(scenarioFileName)

        }
    }
})

