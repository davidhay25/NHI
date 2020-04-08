#!/usr/bin/env node

// replace the page.page node in the IG that sushi clobbers
let fs = require('fs');
IGFileName = "./input/ImplementationGuide-hl7.org.nz.nhi.json";
let contents = fs.readFileSync(IGFileName).toString()
let IG = JSON.parse(contents)


IG.definition.page.page = []
IG.definition.page.page.push({nameUrl:"index.html",title:"Home",generation:"markdown"})
IG.definition.page.page.push({nameUrl:"models.html",title:"Models",generation:"markdown"})
IG.definition.page.page.push({nameUrl:"terminologySummary.html",title:"ValueSets",generation:"html"})
IG.definition.page.page.push({nameUrl:"codeSystem.html",title:"CodeSystems",generation:"html"})
IG.definition.page.page.push({nameUrl:"extensionSummary.html",title:"Extensions",generation:"html"})
IG.definition.page.page.push({nameUrl:"downloads.html",title:"Downloads",generation:"markdown"})
IG.definition.page.page.push({nameUrl:"API.html",title:"API",generation:"markdown"})
IG.definition.page.page.push({nameUrl:"notes.html",title:"Implementer Notes",generation:"markdown"})

fs.writeFileSync(IGFileName,JSON.stringify(IG));