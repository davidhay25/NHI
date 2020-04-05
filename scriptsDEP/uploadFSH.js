#!/usr/bin/env node

/**
 * Upload the fsh files for profiles, extensions and examples.
 * FSH files are uploaded to [host]/Binary/{type}-{id} where {type} is profile / extension / example
 * For profiles and extensions, the SD is also uploaded
 * 
 * Should be run after any of the FSH files are changed and sushi executed
 * (makeExtensionFSH should be executed after changing any of the Logical Models, and before this script )
 */

let serverRoot = "http://home.clinfhir.com:8054/baseR4/";   //the server to upload FSH & SD

let IG = require("./IGUtils")
IG.loadIG('nzRegistry.json');   //load the indicated IG. Not really needed actually....

console.log('Uploading FSH abd SD files to ' + serverRoot)
let fs = require('fs');

let path = '../shorthand/'; //where the FSH files are found. SD's are in the subfolder build/input/resources/

fs.readdirSync(path).forEach(function(file) {
    let ar = file.split('-')
    if (ar.length > 1) {

        if (ar[0] == 'profile' || ar[0] == 'extension' || ar[0] == 'example') {       //this is a profile or an extension...
            //assume the filename format is {type}-{id}.fsh with id being the id of the logical model.
            //the profile id on the server will then be the same as this filename... (incl. case)
          
            //the name is everything after the first '-'
            let type = ar[0];       // profile, extension or example
            ar.splice(0,1);
            let name = ar.join('-') ;//   ar[1]

            //remove the extension to get the id
            let ar1 = name.split('.')
            let id =  ar1[0];        //get the id
        
            let url = serverRoot + "Binary/" + type + "-" + id;  //address of the fsh Binary on the server
            
            let fullFileName = path + file;     //location of the fsh file
            
            //create a Binary resource and upload to the server
            let contents = fs.readFileSync(fullFileName, {encoding: 'utf8'})
            let resource = {resourceType:'Binary',contentType:'text/plain'}
            resource.id = type + "-" + id; //add the type (extension  or profile) to the id...
            let buff =  Buffer.from(contents);
            resource.data  = buff.toString('base64');
            IG.PUTFile(url,resource)

            //For profiles and extensions, see if there is a generated SD and upload that as well. 
            //Note that the IG needs to have an extension in the entry for the logical model that references this...

            if (type == 'profile' || type == 'extension') {
                let SDFileName = path + "build/input/resources/StructureDefinition-"+ id + ".json";
                try {
                    let sdContents = fs.readFileSync(SDFileName, {encoding: 'utf8'})
                    let resource = JSON.parse(sdContents)
    
                    let sdId = id+"-" + type;
                    resource.id = sdId;  
                    let sdUrl = serverRoot + "StructureDefinition/"+sdId;   //the url on the server, not the canonical url
                
                    delete resource.version             //temp - need to update my server as it doesn't accept the most current 
                    resource.fhirVersion = "4.0.0"
                    IG.PUTFile(sdUrl,resource)          //save the SD to the server
                } catch (ex) {
                    console.log('No StructureDefinition found - ' + SDFileName + " " + ex)
                }
            } else if (type == 'example') {
                //The example rersource instances are not uploaded. Use uploadResources.js for that...
            }
        }
}

})


