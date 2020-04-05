Instance:   patient2
InstanceOf: NhiPatient
Usage: #example

* text.div = "<div xmlns='http://www.w3.org/1999/xhtml'>John Doe</div>"
* text.status = #additional

//name. The source of the name was a NZ Visa
* name.family = "Doe"
* name.given = "John"
* name.given[1] = "Albertus"
* name.extension[informationsource].valueCodeableConcept.coding.system = "http://standards.digital.health.nz/fhir/ValueSet/nzinfosource"
* name.extension[informationsource].valueCodeableConcept.coding.code = #NZPV
* name.extension[informationsource].valueCodeableConcept.coding.display = "New Zealand Permanant visa"

* gender = #male

//Birth date, verified by passport
* birthDate = "1989-12-12"
* birthDate.extension[informationsource].valueCodeableConcept.coding.system = "http://standards.digital.health.nz/fhir/ValueSet/nzinfosource"
* birthDate.extension[informationsource].valueCodeableConcept.coding.code = #PPRT
* birthDate.extension[informationsource].valueCodeableConcept.coding.display = "Passport"

//the current NHI
* identifier.use = #official
* identifier.system = "https://standards.digital.health.nz/id/nhi"
* identifier.value = "WER4568"

//a dormant (replaced)  NHI
* identifier.use = #old
* identifier.system = "https://standards.digital.health.nz/id/nhi"
* identifier.value = "ABC1234"

//ethnicity is 'not stated'
* extension[nzEthnicity].valueCodeableConcept.coding.system = "https://standards.digital.health.nz/codesystem/ethnic-group-level-4"
* extension[nzEthnicity].valueCodeableConcept.coding.code = #9999
* extension[nzEthnicity].valueCodeableConcept.coding.display = "Not Stated"

//email address & phone
* telecom.system = #email
* telecom.value = "johndoe@erewhon.com"
* telecom[1].system = #phone
* telecom[1].value = "+64 9 000 0000"

//physical address
* address.line = "23 Thule St"
* address.city = "Waipu"

//DHB (from address) is Counties Manakau DHB (Assuming that Organization1 is the DHB)
//* extension[dhb].valueReference = Reference(organization1)

* extension[dhb].valueCodeableConcept.coding.system = "https://standards.digital.health.nz/fhir/ValueSet/dhb"
* extension[dhb].valueCodeableConcept.coding.code = #cmdhb



//born in Palmerston North, New Zealand. Verified by passport
* extension[patient-birthPlace].extension[placeOfBirth].valueString = "Palmerston North"

//birth country New Zealand. The  is temporary, due to some current limitations with the shorthand generator
* extension[patient-birthPlace].extension[country].valueCodeableConcept.coding.system = "http://hl7.org/fhir/ValueSet/iso3166-1-2"
* extension[patient-birthPlace].extension[country].valueCodeableConcept.coding.code = #NZ
* extension[patient-birthPlace].extension[country].valueCodeableConcept.coding.display = "New Zealand"

//source of information about the birthplace was a passport
* extension[patient-birthPlace].extension[source].valueCodeableConcept.coding.system = "http://standards.digital.health.nz/fhir/ValueSet/nzinfosource"
* extension[patient-birthPlace].extension[source].valueCodeableConcept.coding.code = #PPRT
* extension[patient-birthPlace].extension[source].valueCodeableConcept.coding.display = "Passport"



//The general practitioner is described by the practitionerrole1 resource (has references to Practitioner & Organization)
* generalPractitioner = Reference(practitionerrole1)

//The patient is of maori descent...
* extension[patient-maoriDescent].valueCodeableConcept.coding.system = "http://standards.digital.health.nz/fhir/ValueSet/nzmaoridescent"
* extension[patient-maoriDescent].valueCodeableConcept.coding.code = #yes

//... and belongs to the Tainui iwi
* extension[patient-iwi].valueCodeableConcept.coding.system = "http://standards.digital.health.nz/fhir/ValueSet/nziwi"
* extension[patient-iwi].valueCodeableConcept.coding.code = #2001
* extension[patient-iwi].valueCodeableConcept.coding.display = "Tainui"


