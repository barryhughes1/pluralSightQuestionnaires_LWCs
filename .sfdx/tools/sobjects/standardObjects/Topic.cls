// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Topic {
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global List<CustomBrand> CustomBrands;
    global String Description;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<TopicFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global Id Id;
    global String ManagedTopicType;
    global String Name;
    global List<FeedComment> Parent;
    global List<FlowRecordRelation> RelatedRecord;
    global Datetime SystemModstamp;
    global Integer TalkingAbout;
    global List<KnowledgeableUser> Topic;
    global List<TopicAssignment> TopicAssignments;

    global Topic () 
    {
    }
}