// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Announcement {
    global List<CollaborationGroup> Announcement;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global Datetime ExpirationDate;
    global FeedItem FeedItem;
    global Id FeedItemId;
    global Id Id;
    global Boolean IsArchived;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global CollaborationGroup Parent;
    global Id ParentId;
    global List<FlowRecordRelation> RelatedRecord;
    global Boolean SendEmails;
    global Datetime SystemModstamp;

    global Announcement () 
    {
    }
}