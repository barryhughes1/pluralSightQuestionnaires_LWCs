// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class FeedItem {
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
    global List<Announcement> FeedItem;
    global List<WorkThanks> FeedItemThanks;
    global List<FeedLike> FeedLikes;
    global List<FeedRevision> FeedRevisions;
    global List<FeedSignal> FeedSignals;
    global List<FeedTrackedChange> FeedTrackedChanges;
    global Boolean HasContent;
    global Boolean HasFeedEntity;
    global Boolean HasLink;
    global Boolean HasVerifiedComment;
    global Id Id;
    global User InsertedBy;
    global Id InsertedById;
    global Boolean IsClosed;
    global Boolean IsDeleted;
    global Boolean IsRichText;
    global User LastEditBy;
    global Id LastEditById;
    global Datetime LastEditDate;
    global Datetime LastModifiedDate;
    global Integer LikeCount;
    global String LinkUrl;
    global SObject Parent;
    global Id ParentId;
    global List<FeedAttachment> Record;
    global SObject RelatedRecord;
    global Id RelatedRecordId;
    global Integer Revision;
    global String Status;
    global Datetime SystemModstamp;
    global String Title;
    global List<TopicAssignment> TopicAssignments;
    global String Type;

    global FeedItem () 
    {
    }
}