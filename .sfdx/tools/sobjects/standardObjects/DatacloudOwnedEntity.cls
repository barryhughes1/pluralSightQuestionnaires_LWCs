// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class DatacloudOwnedEntity {
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String DataDotComKey;
    global String DatacloudEntityType;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String Name;
    global String PurchaseType;
    global DatacloudPurchaseUsage PurchaseUsage;
    global Id PurchaseUsageId;
    global List<FlowRecordRelation> RelatedRecord;
    global Datetime SystemModstamp;
    global User User;
    global Id UserId;

    global DatacloudOwnedEntity () 
    {
    }
}