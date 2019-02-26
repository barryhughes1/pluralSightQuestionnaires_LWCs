// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ResourcePreference {
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<CombinedAttachment> CombinedAttachments;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<ResourcePreferenceFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global List<ResourcePreferenceHistory> Histories;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global List<FeedItem> Parent;
    global String PreferenceType;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global SObject RelatedRecord;
    global Id RelatedRecordId;
    global String ResourcePreferenceNumber;
    global ServiceResource ServiceResource;
    global Id ServiceResourceId;
    global Datetime SystemModstamp;
    global List<TopicAssignment> TopicAssignments;

    global ResourcePreference () 
    {
    }
}