// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Solution {
    global List<ActivityHistory> ActivityHistories;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<Attachment> Attachments;
    global List<CaseSolution> CaseSolutions;
    global List<CombinedAttachment> CombinedAttachments;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global List<EmailMessage> Emails;
    global List<Event> Events;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<SolutionFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global List<SolutionHistory> Histories;
    global Id Id;
    global Boolean IsDeleted;
    global Boolean IsHtml;
    global Boolean IsPublished;
    global Boolean IsPublishedInPublicKb;
    global Boolean IsReviewed;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global List<OpenActivity> OpenActivities;
    global User Owner;
    global Id OwnerId;
    global List<FeedItem> Parent;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global List<FlowRecordRelation> RelatedRecord;
    global List<CategoryData> RelatedSobject;
    global List<OutgoingEmail> RelatedTo;
    global List<EventRelationChangeEvent> Relation;
    global String SolutionName;
    global String SolutionNote;
    global String SolutionNumber;
    global String Status;
    global Datetime SystemModstamp;
    global List<Task> Tasks;
    global Integer TimesUsed;
    global List<TopicAssignment> TopicAssignments;
    global List<Vote> Votes;
    global List<EventChangeEvent> What;

    global Solution () 
    {
    }
}