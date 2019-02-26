// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class DigitalSignature {
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String DigitalSignatureNumber;
    global Blob DocumentBody;
    global String DocumentContentType;
    global Integer DocumentLength;
    global String DocumentName;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global SObject Parent;
    global Id ParentId;
    global String Place;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global List<FlowRecordRelation> RelatedRecord;
    global String SignatureType;
    global String SignedBy;
    global Datetime SignedDate;
    global Datetime SystemModstamp;

    global DigitalSignature () 
    {
    }
}