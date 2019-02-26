// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ContentDocument {
    global User ArchivedBy;
    global Id ArchivedById;
    global Date ArchivedDate;
    global List<ContentFolderMember> ChildRecord;
    global ContentAsset ContentAsset;
    global Id ContentAssetId;
    global List<ContentDistribution> ContentDistributions;
    global List<ContentVersionComment> ContentDocument;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global Datetime ContentModifiedDate;
    global Integer ContentSize;
    global List<ContentVersion> ContentVersions;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global List<ContentNotification> EntityIdentifier;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<ContentDocumentFeed> Feeds;
    global String FileExtension;
    global String FileType;
    global List<ContentDocumentHistory> Histories;
    global Id Id;
    global Boolean IsArchived;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global ContentVersion LatestPublishedVersion;
    global Id LatestPublishedVersionId;
    global User Owner;
    global Id OwnerId;
    global List<FeedComment> Parent;
    global Id ParentId;
    global String PublishStatus;
    global List<FeedAttachment> Record;
    global List<FlowRecordRelation> RelatedRecord;
    global String SharingOption;
    global String SharingPrivacy;
    global Datetime SystemModstamp;
    global String Title;
    global List<TopicAssignment> TopicAssignments;

    global ContentDocument () 
    {
    }
}