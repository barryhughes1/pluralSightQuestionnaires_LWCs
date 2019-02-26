// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Lead {
    global List<AcceptedEventRelation> AcceptedEventRelations;
    global List<ActivityHistory> ActivityHistories;
    global Address Address;
    global Decimal AnnualRevenue;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<Attachment> Attachments;
    global List<CampaignMember> CampaignMembers;
    global String City;
    global String CleanStatus;
    global List<CombinedAttachment> CombinedAttachments;
    global String Company;
    global String CompanyDunsNumber;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global Account ConvertedAccount;
    global Id ConvertedAccountId;
    global Contact ConvertedContact;
    global Id ConvertedContactId;
    global Date ConvertedDate;
    global Opportunity ConvertedOpportunity;
    global Id ConvertedOpportunityId;
    global String Country;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global DandBCompany DandbCompany;
    global Id DandbCompanyId;
    global List<DeclinedEventRelation> DeclinedEventRelations;
    global String Description;
    global List<DuplicateRecordItem> DuplicateRecordItems;
    global String Email;
    global Datetime EmailBouncedDate;
    global String EmailBouncedReason;
    global List<EmailMessageRelation> EmailMessageRelations;
    global List<EmailStatus> EmailStatuses;
    global List<EventRelation> EventRelations;
    global List<Event> Events;
    global String Fax;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<LeadFeed> Feeds;
    global String FirstName;
    global List<ContentVersion> FirstPublishLocation;
    global String GeocodeAccuracy;
    global List<LeadHistory> Histories;
    global Id Id;
    global String Industry;
    global Boolean IsConverted;
    global Boolean IsDeleted;
    global Boolean IsUnreadByOwner;
    global String Jigsaw;
    global String JigsawContactId;
    global Date LastActivityDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String LastName;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global Double Latitude;
    global List<LeadCleanInfo> LeadCleanInfos;
    global List<CampaignMember> LeadOrContact;
    global String LeadSource;
    global List<ListEmailIndividualRecipient> ListEmailIndividualRecipients;
    global Double Longitude;
    global Lead MasterRecord;
    global Id MasterRecordId;
    global String MobilePhone;
    global String Name;
    global List<Note> Notes;
    global List<NoteAndAttachment> NotesAndAttachments;
    global Integer NumberOfEmployees;
    global List<OpenActivity> OpenActivities;
    global List<OutgoingEmailRelation> OutgoingEmailRelations;
    global SObject Owner;
    global Id OwnerId;
    global List<FeedItem> Parent;
    global List<UserEmailPreferredPerson> PersonRecord;
    global String Phone;
    global String PhotoUrl;
    global String PostalCode;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global String Rating;
    global List<RecordActionHistory> RecordActionHistories;
    global List<RecordAction> RecordActions;
    global List<CollaborationGroupRecord> RecordAssociatedGroups;
    global List<FlowRecordRelation> RelatedRecord;
    global List<EventRelationChangeEvent> Relation;
    global String Salutation;
    global List<ServiceAppointment> ServiceAppointments;
    global List<LeadShare> Shares;
    global String State;
    global String Status;
    global String Street;
    global Datetime SystemModstamp;
    global List<Task> Tasks;
    global String Title;
    global List<TopicAssignment> TopicAssignments;
    global List<UndecidedEventRelation> UndecidedEventRelations;
    global String Website;
    global List<EventChangeEvent> Who;

    global Lead () 
    {
    }
}