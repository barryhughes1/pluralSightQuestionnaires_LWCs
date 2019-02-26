// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class FeedComment {
    global List<WorkTypeFeed> BestComment;
    global String CommentBody;
    global String CommentType;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global List<FeedAttachment> FeedAttachments;
    global List<FeedSignal> FeedEntity;
    global SObject FeedItem;
    global Id FeedItemId;
    global List<FeedRevision> FeedRevisions;
    global List<FeedComment> FeedThreadedComments;
    global Boolean HasEntityLinks;
    global Id Id;
    global User InsertedBy;
    global Id InsertedById;
    global Boolean IsDeleted;
    global Boolean IsRichText;
    global Boolean IsVerified;
    global User LastEditBy;
    global Id LastEditById;
    global Datetime LastEditDate;
    global SObject Parent;
    global Id ParentId;
    global SObject RelatedRecord;
    global Id RelatedRecordId;
    global Integer Revision;
    global String Status;
    global Datetime SystemModstamp;
    global Integer ThreadChildrenCount;
    global Datetime ThreadLastUpdatedDate;
    global Integer ThreadLevel;
    global FeedComment ThreadParent;
    global Id ThreadParentId;

    global FeedComment () 
    {
    }
}