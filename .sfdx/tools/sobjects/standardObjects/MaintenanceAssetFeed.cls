// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class MaintenanceAssetFeed {
    global FeedComment BestComment;
    global Id BestCommentId;
    global String Body;
    global Integer CommentCount;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global List<FeedAttachment> FeedAttachments;
    global List<FeedComment> FeedComments;
    global List<FeedLike> FeedEntity;
    global List<FeedPollVote> FeedItem;
    global List<FeedLike> FeedLikes;
    global List<FeedSignal> FeedSignals;
    global List<FeedTrackedChange> FeedTrackedChanges;
    global Id Id;
    global User InsertedBy;
    global Id InsertedById;
    global Boolean IsDeleted;
    global Boolean IsRichText;
    global Datetime LastModifiedDate;
    global Integer LikeCount;
    global String LinkUrl;
    global MaintenanceAsset Parent;
    global Id ParentId;
    global SObject RelatedRecord;
    global Id RelatedRecordId;
    global Datetime SystemModstamp;
    global String Title;
    global String Type;

    global MaintenanceAssetFeed () 
    {
    }
}