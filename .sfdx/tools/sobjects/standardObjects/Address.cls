// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Address {
    global Address Address;
    global String AddressType;
    global String City;
    global String Country;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global String DrivingDirections;
    global String GeocodeAccuracy;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Double Latitude;
    global String LocationType;
    global Double Longitude;
    global String Name;
    global Location Parent;
    global Id ParentId;
    global String PostalCode;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global List<FlowRecordRelation> RelatedRecord;
    global String State;
    global String Street;
    global Datetime SystemModstamp;
    global String TimeZone;
    global List<Location> VisitorAddress;

    global Address () 
    {
    }
}