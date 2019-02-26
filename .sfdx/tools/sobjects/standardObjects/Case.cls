// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Case {
    global Account Account;
    global Id AccountId;
    global List<ActivityHistory> ActivityHistories;
    global Asset Asset;
    global Id AssetId;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<Attachment> Attachments;
    global List<CaseComment> CaseComments;
    global List<CaseContactRole> CaseContactRoles;
    global String CaseNumber;
    global List<CaseSolution> CaseSolutions;
    global List<Case> Cases;
    global Datetime ClosedDate;
    global List<CombinedAttachment> CombinedAttachments;
    global String Comments;
    global Contact Contact;
    global String ContactEmail;
    global String ContactFax;
    global Id ContactId;
    global String ContactMobile;
    global String ContactPhone;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global List<EmailMessage> EmailMessages;
    global List<EmailMessage> Emails;
    global List<Event> Events;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<CaseFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global List<CaseHistory> Histories;
    global Id Id;
    global Boolean IsClosed;
    global Boolean IsDeleted;
    global Boolean IsEscalated;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global List<OpenActivity> OpenActivities;
    global String Origin;
    global SObject Owner;
    global Id OwnerId;
    global List<FeedItem> Parent;
    global Id ParentId;
    global String Priority;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global List<ProductRequestLineItem> ProductRequestLineItems;
    global List<ProductRequest> ProductRequests;
    global String Reason;
    global List<RecordActionHistory> RecordActionHistories;
    global List<RecordAction> RecordActions;
    global List<CollaborationGroupRecord> RecordAssociatedGroups;
    global List<FlowRecordRelation> RelatedRecord;
    global List<EventRelationChangeEvent> Relation;
    global List<ReturnOrder> ReturnOrders;
    global List<CaseShare> Shares;
    global String Status;
    global String Subject;
    global String SuppliedCompany;
    global String SuppliedEmail;
    global String SuppliedName;
    global String SuppliedPhone;
    global Datetime SystemModstamp;
    global List<Task> Tasks;
    global List<CaseTeamMember> TeamMembers;
    global List<CaseTeamTemplateRecord> TeamTemplateRecords;
    global List<TopicAssignment> TopicAssignments;
    global String Type;
    global List<EventChangeEvent> What;
    global List<WorkOrder> WorkOrders;

    global Case () 
    {
    }
}