// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class TimeSheet {
    global List<ActivityHistory> ActivityHistories;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<CombinedAttachment> CombinedAttachments;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global List<EmailMessage> Emails;
    global Date EndDate;
    global List<Event> Events;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<TimeSheetFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global List<TimeSheetHistory> Histories;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global List<OpenActivity> OpenActivities;
    global SObject Owner;
    global Id OwnerId;
    global List<FeedItem> Parent;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global List<FlowRecordRelation> RelatedRecord;
    global List<OutgoingEmail> RelatedTo;
    global List<EventRelationChangeEvent> Relation;
    global ServiceResource ServiceResource;
    global Id ServiceResourceId;
    global Date StartDate;
    global String Status;
    global Datetime SystemModstamp;
    global List<Task> Tasks;
    global List<TimeSheetEntry> TimeSheetEntries;
    global Integer TimeSheetEntryCount;
    global String TimeSheetNumber;
    global List<TopicAssignment> TopicAssignments;
    global List<EventChangeEvent> What;

    global TimeSheet () 
    {
    }
}