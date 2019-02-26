// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class AssociatedLocation {
    global Datetime ActiveFrom;
    global Datetime ActiveTo;
    global String AssociatedLocationNumber;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global List<AssociatedLocationHistory> Histories;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global Location Location;
    global Id LocationId;
    global Account ParentRecord;
    global Id ParentRecordId;
    global List<FlowRecordRelation> RelatedRecord;
    global Datetime SystemModstamp;
    global String Type;

    global AssociatedLocation () 
    {
    }
}