// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class CollaborationGroup {
    global Announcement Announcement;
    global Id AnnouncementId;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global String BannerPhotoUrl;
    global Boolean CanHaveGuests;
    global List<CollaborationGroupRecord> CollaborationGroupRecords;
    global String CollaborationType;
    global List<CombinedAttachment> CombinedAttachments;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<CollaborationGroupFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global String FullPhotoUrl;
    global String GroupEmail;
    global List<CollaborationGroupMemberRequest> GroupMemberRequests;
    global List<CollaborationGroupMember> GroupMembers;
    global Boolean HasPrivateFieldsAccess;
    global Id Id;
    global String InformationBody;
    global String InformationTitle;
    global Boolean IsArchived;
    global Boolean IsAutoArchiveDisabled;
    global Boolean IsBroadcast;
    global Datetime LastFeedModifiedDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global String MediumPhotoUrl;
    global Integer MemberCount;
    global String Name;
    global User Owner;
    global Id OwnerId;
    global List<FeedItem> Parent;
    global List<FlowRecordRelation> RelatedRecord;
    global List<CollaborationInvitation> SharedEntity;
    global String SmallPhotoUrl;
    global Datetime SystemModstamp;

    global CollaborationGroup () 
    {
    }
}