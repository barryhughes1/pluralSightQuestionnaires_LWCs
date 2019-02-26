// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Campaign {
    global List<ActivityHistory> ActivityHistories;
    global Decimal ActualCost;
    global Decimal AmountAllOpportunities;
    global Decimal AmountWonOpportunities;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<Attachment> Attachments;
    global Decimal BudgetedCost;
    global List<ListEmailChangeEvent> Campaign;
    global RecordType CampaignMemberRecordType;
    global Id CampaignMemberRecordTypeId;
    global List<CampaignMemberStatus> CampaignMemberStatuses;
    global List<CampaignMember> CampaignMembers;
    global List<Campaign> ChildCampaigns;
    global List<CombinedAttachment> CombinedAttachments;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global List<EmailMessage> Emails;
    global Date EndDate;
    global List<Event> Events;
    global Double ExpectedResponse;
    global Decimal ExpectedRevenue;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<CampaignFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global List<CampaignHistory> Histories;
    global Id Id;
    global Boolean IsActive;
    global Boolean IsDeleted;
    global Date LastActivityDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global List<ListEmailRecipientSource> ListEmailRecipientSources;
    global List<ListEmail> ListEmails;
    global String Name;
    global Integer NumberOfContacts;
    global Integer NumberOfConvertedLeads;
    global Integer NumberOfLeads;
    global Integer NumberOfOpportunities;
    global Integer NumberOfResponses;
    global Integer NumberOfWonOpportunities;
    global Double NumberSent;
    global List<OpenActivity> OpenActivities;
    global List<Opportunity> Opportunities;
    global User Owner;
    global Id OwnerId;
    global List<FeedComment> Parent;
    global Id ParentId;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global List<CollaborationGroupRecord> RecordAssociatedGroups;
    global List<FlowRecordRelation> RelatedRecord;
    global List<OutgoingEmail> RelatedTo;
    global List<EventRelationChangeEvent> Relation;
    global List<CampaignShare> Shares;
    global Date StartDate;
    global String Status;
    global Datetime SystemModstamp;
    global List<Task> Tasks;
    global List<TopicAssignment> TopicAssignments;
    global String Type;
    global List<EventChangeEvent> What;

    global Campaign () 
    {
    }
}