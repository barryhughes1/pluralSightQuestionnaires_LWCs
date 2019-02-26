// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ContentVersion {
    global String Checksum;
    global ContentBody ContentBody;
    global Id ContentBodyId;
    global ContentDocument ContentDocument;
    global Id ContentDocumentId;
    global String ContentLocation;
    global User ContentModifiedBy;
    global Id ContentModifiedById;
    global Datetime ContentModifiedDate;
    global Integer ContentSize;
    global String ContentUrl;
    global List<ContentDistribution> ContentVersion;
    global List<ServiceReport> ContentVersionDocument;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global List<ContentNotification> EntityIdentifier;
    global ExternalDataSource ExternalDataSource;
    global Id ExternalDataSourceId;
    global String ExternalDocumentInfo1;
    global String ExternalDocumentInfo2;
    global Integer FeaturedContentBoost;
    global Date FeaturedContentDate;
    global String FileExtension;
    global String FileType;
    global SObject FirstPublishLocation;
    global Id FirstPublishLocationId;
    global List<ContentVersionHistory> Histories;
    global Id Id;
    global Boolean IsAssetEnabled;
    global Boolean IsDeleted;
    global Boolean IsLatest;
    global Boolean IsMajorVersion;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global List<ContentDocument> LatestPublishedVersion;
    global Integer NegativeRatingCount;
    global String Origin;
    global User Owner;
    global Id OwnerId;
    global String PathOnClient;
    global Integer PositiveRatingCount;
    global String PublishStatus;
    global Integer RatingCount;
    global String ReasonForChange;
    global List<FeedAttachment> Record;
    global List<MaintenanceAssetFeed> RelatedRecord;
    global String SharingOption;
    global String SharingPrivacy;
    global Datetime SystemModstamp;
    global String TagCsv;
    global String TextPreview;
    global String Title;
    global Blob VersionData;
    global String VersionNumber;

    global ContentVersion () 
    {
    }
}