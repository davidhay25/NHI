

There are 2 main API calls supported in this release:

* A direct retrieval of a Patient resource based on the NHI number
* The [$match](http://hl7.org/fhir/patient-operation-match.html) operation

### Direct retrieval 
This takes the form:

    [host]/Patient/{nhi number}

This works because the id of the resource is the same as the current NHI number. 


The NHI is also included in the resource with the 'identifier.use' element having the value 'official'. Previous NHI numbers will be included in the resources as 'dormant' identifiers (identifier.use = 'old')

### $Match

To query for a patient when the NHI is unknown, use the [$match](http://hl7.org/fhir/patient-operation-match.html) operation. This 
operation takes in a variable number of parameters, and uses those to perform a match against the patients in teh registry using
'fuzzy matching' (rather than an exact match). Each matching resource that is returned includes a 'score' that indicates how close the resource is to the supplied parameters.

To perform a search, construct a 'place holder' Patient resource with the elements of the resource being the parameters you wish to query on. The resource is then placed inside a special Parameters resource, which is then POSTed to the $match endpoind, ie:

    [host]/Patient/$match

For example the following parameters resource POSTed to $match will return all male patients named 'Doe' born in 1975.


    {
    "resourceType": "Parameters",
    "id": "example",
    "parameter": [
        {
            "name": "resource",
            "resource" :
            {
                "resourceType": "Patient",
                "id": "matchPatient",
                "name": [
                    {
                    "family": "Doe"
                    }
                ],
                "birthDate": "1975",
                "gender": "male"
                }
            }
        ]
    }



The following parameters are supported by this implementation. Parameters marked as required must be present or the seach will be rejected.

| Parameter | Description | Required
| --- | --- |
| name | Any part of the persone name | yes |
| Date of Birth | Note that partial dates are supported | yes | 

### Update operations

Update is not supported in this release. It will be added in subsequent releases.