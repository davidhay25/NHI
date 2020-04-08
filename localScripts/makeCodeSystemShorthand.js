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

let path = '../codesystems/';   //path to source csv files
//let outFolder = '../shorthand/terminology/';    //path to output files
let outFolder = path //= '../shorthand/terminology/';    //path to output files

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

            let arFile = [];        //the output file


            //make the valueset
           
            arFile.push("ValueSet: " + name )
            arFile.push('Title: "' + title + '"')
            arFile.push('Description: "' + description + '"')
            arFile.push('* ^url = ' + csCanonical)
           

            arFile.push('')
          

            //make the codesystem
            arFile.push("CodeSystem: " + name )
            arFile.push('Title: "' + title + '"')
            arFile.push('Description: "' + description + '"')
            arFile.push('* ^url = ' + vsCanonical)
            arFile.push('')
            arContents.forEach(function(lne){
                lne = lne.replace('\r','')
                let ar = splitLine(lne)
                if (ar[0] && ar[1]) {

                    let description = ar[1];
                    description = description.replace(/["']/g,'')
                    console.log(ar[1],description)

                    arFile.push("* #" + ar[0] + ' "' + description + '"');

                   
                } else {
                    console.log('Ignoring empty codes or values')
                }
                
            })


            //write out the FSH file
            let vsFileName = outFolder+name + "-cs.fsh";
            let vs = arFile.join('\n')
             fs.writeFileSync(vsFileName,vs)



/* temp

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
                    
           */
           



        }
    }
})


function splitLine(lne) {
    lne = lne.replace('\r','')
    return lne.split(',')
}
