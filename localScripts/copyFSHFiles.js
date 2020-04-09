#!/usr/bin/env node

/**
 * copy the .fsh files from shorthand to ig-data/input/pagecontent as notes...
 * assume that all files have an Id: to derive the filename from
 * todo - think about including terminology (especially valuesets)
 * run after sushi, but before build (as updates build/input folder)
 **/

console.log("Copying FSH files")

let path = '../shorthand/'; 

let fs = require('fs');

fs.readdirSync(path).forEach(function(file) {
    let ar = file.split('.')
    let ext = ar[ar.length-1]

    if (ext == 'fsh' ){
        let fullFileName = path + file;     //location of the fsh file
        let outFileName;
        //console.log(fullFileName)

       
        let contents = fs.readFileSync(fullFileName, {encoding: 'utf8'}).toString();

        let arLines = contents.split('\n')
        let arOutput = []
        arLines.forEach(function(line){
            let ar = line.split(" ");
            if (ar[0] == 'Id:') {
                outFileName = "../shorthand/build/input/pagecontent/StructureDefinition-"+ ar[1] + '.md'
                console.log(outFileName)
               
            }

            if (ar[0] == '//') {
                let newLine = "<div style='color:green'>" + line + "</div>"
                arOutput.push(newLine)
            } else {
                arOutput.push(line)
            }


        //console.log(line)
        })
        if (outFileName) {
            let newFile = arOutput.join('\n')
            fs.writeFileSync(outFileName,newFile)
        }
        


    }
})

