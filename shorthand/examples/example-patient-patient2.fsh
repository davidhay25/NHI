Instance:   patient2
InstanceOf: NhiPatient
Usage: #example
* contained = Pr2

* text.div = "<div xmlns='http://www.w3.org/1999/xhtml'>Test patient 2</div>"
* text.status = #additional

//name. The source of the name was a NZ Visa
* name.family = "Doe"
* name.given = "John"
* name.given[1] = "Albertus"
* name.extension[informationsource].valueCodeableConcept.coding.system = "https://standards.digital.health.nz/cs/informationsource"
* name.extension[informationsource].valueCodeableConcept.coding.code = #NZPV
* name.extension[informationsource].valueCodeableConcept.coding.display = "New Zealand Permanent Visa"

* gender = #male

//Birth date, verified by passport
* birthDate = "1989-12-12"
* birthDate.extension[informationsource].valueCodeableConcept.coding.system = "https://standards.digital.health.nz/cs/informationsource"
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
* extension[ethnicity].valueCodeableConcept.coding.system = "https://standards.digital.health.nz/cs/ethnic-group-level-4"
* extension[ethnicity].valueCodeableConcept.coding.code = #99999
* extension[ethnicity].valueCodeableConcept.coding.display = "Not Stated"

//email address & phone
* telecom.system = #email
* telecom.value = "johndoe@erewhon.com"
* telecom[1].system = #phone
* telecom[1].value = "+64 9 000 0000"

//physical address
* address.line = "23 Thule St"
* address.city = "Waipu"
* address.extension[suburb].valueString = "Cove"
* address.extension[buildingName].valueString = "Big Black House"

//DHB (from address) is Counties Manakau DHB (Assuming that Organization1 is the DHB)
//* extension[dhb].valueReference = Reference(organization1)

* extension[dhb].valueCodeableConcept.coding.system = "https://standards.digital.health.nz/cs/dhb"
* extension[dhb].valueCodeableConcept.coding.code = #cmdhb



//born in Palmerston North, New Zealand. Verified by passport
* extension[patient-countryOfBirth].extension[placeOfBirth].valueString = "Palmerston North"

//birth country New Zealand. The  is temporary, due to some current limitations with the shorthand generator
* extension[patient-countryOfBirth].extension[country].valueCodeableConcept.coding.system = "urn:iso:std:iso:3166"
* extension[patient-countryOfBirth].extension[country].valueCodeableConcept.coding.code = #NZ
* extension[patient-countryOfBirth].extension[country].valueCodeableConcept.coding.display = "New Zealand"

//source of information about the birthplace was a passport
* extension[patient-countryOfBirth].extension[source].valueCodeableConcept.coding.system = "https://standards.digital.health.nz/cs/informationsource"
* extension[patient-countryOfBirth].extension[source].valueCodeableConcept.coding.code = #PPRT
* extension[patient-countryOfBirth].extension[source].valueCodeableConcept.coding.display = "Passport"



//The general practitioner is described by the practitionerrole1 resource (has references to Practitioner & Organization)
* generalPractitioner.reference = "#Pr2"


Instance:   Pr2
InstanceOf: PractitionerRole
Description: "Practitioner role for test patient 2"
Usage: #inline

* practitioner.type = "Practitioner"
* practitioner.identifier.system = "https://standards.digital.health.nz/id/hpi-person"
* practitioner.identifier.value = "hpiNum1"
* practitioner.display = "Dr Marcus Welby"

* organization.type = "Organization"
* organization.identifier.system = "https://standards.digital.health.nz/id/hpi-organisation"
* organization.identifier.value = "hpiOrgId"
* organization.display = "HealthIsUs"

* location.type = "Organization"
* location.identifier.system = "https://standards.digital.health.nz/id/hpi-facility"
* location.identifier.value = "hpiFacilityId"
* location.display = "Good Health Medcial Centre"