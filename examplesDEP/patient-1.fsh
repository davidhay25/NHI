Instance:   Myperson
InstanceOf: Patient

* extension[0].url = "http://clinfhir.com/ext"
* extension[0].valueString = "Test"
* extension[1].url = "http://clinfhir.com/ext1"
* extension[1].extension[0].url = "test"
* extension[1].extension[0].valueString = "ttt"
* name[0].family = "Anyperson"
* name[0].given[0] = "Eve"
* name[0].given[1] = "Steven"
* birthDate = "1960-04-25"