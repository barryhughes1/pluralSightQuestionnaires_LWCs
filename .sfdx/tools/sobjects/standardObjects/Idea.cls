// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Idea {
    global String Body;
    global String Categories;
    global List<IdeaComment> Comments;
    global Community Community;
    global Id CommunityId;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String CreatorFullPhotoUrl;
    global String CreatorName;
    global String CreatorSmallPhotoUrl;
    global Id Id;
    global Boolean IsDeleted;
    global Boolean IsHtml;
    global Boolean IsMerged;
    global IdeaComment LastComment;
    global Datetime LastCommentDate;
    global Id LastCommentId;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global Integer NumComments;
    global Idea ParentIdea;
    global Id ParentIdeaId;
    global List<FlowRecordRelation> RelatedRecord;
    global String Status;
    global Datetime SystemModstamp;
    global String Title;
    global Double VoteScore;
    global Double VoteTotal;
    global List<Vote> Votes;

    global Idea () 
    {
    }
}