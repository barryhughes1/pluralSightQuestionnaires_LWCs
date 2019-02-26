// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class FeedPollVote {
    global FeedPollChoice Choice;
    global Id ChoiceId;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global SObject FeedItem;
    global Id FeedItemId;
    global Id Id;
    global Boolean IsDeleted;
    global Datetime LastModifiedDate;
    global List<FlowRecordRelation> RelatedRecord;

    global FeedPollVote () 
    {
    }
}