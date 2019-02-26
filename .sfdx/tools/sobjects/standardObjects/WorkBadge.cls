// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class WorkBadge {
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global WorkBadgeDefinition Definition;
    global Id DefinitionId;
    global String Description;
    global User Giver;
    global Id GiverId;
    global Id Id;
    global String ImageUrl;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global String Message;
    global User Recipient;
    global Id RecipientId;
    global List<FlowRecordRelation> RelatedRecord;
    global WorkThanks Source;
    global Id SourceId;
    global Datetime SystemModstamp;

    global WorkBadge () 
    {
    }
}