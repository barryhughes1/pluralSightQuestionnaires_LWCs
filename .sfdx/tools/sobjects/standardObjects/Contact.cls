// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Contact {
    global List<AcceptedEventRelation> AcceptedEventRelations;
    global Account Account;
    global List<AccountContactRole> AccountContactRoles;
    global Id AccountId;
    global List<ActivityHistory> ActivityHistories;
    global List<Asset> Assets;
    global String AssistantName;
    global String AssistantPhone;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<Attachment> Attachments;
    global List<OrderChangeEvent> BillToContact;
    global Date Birthdate;
    global List<CampaignMember> CampaignMembers;
    global List<CaseContactRole> CaseContactRoles;
    global List<Case> Cases;
    global String CleanStatus;
    global List<CombinedAttachment> CombinedAttachments;
    global List<OpportunityContactRoleChangeEvent> Contact;
    global List<ContactCleanInfo> ContactCleanInfos;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global List<ContractContactRole> ContractContactRoles;
    global List<Contract> ContractsSigned;
    global List<LeadChangeEvent> ConvertedContact;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global List<Order> CustomerAuthorizedBy;
    global List<DeclinedEventRelation> DeclinedEventRelations;
    global String Department;
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
    global List<ContactFeed> Feeds;
    global String FirstName;
    global List<ContentVersion> FirstPublishLocation;
    global List<ContactHistory> Histories;
    global String HomePhone;
    global Id Id;
    global Boolean IsDeleted;
    global Boolean IsEmailBounced;
    global String Jigsaw;
    global String JigsawContactId;
    global Date LastActivityDate;
    global Datetime LastCURequestDate;
    global Datetime LastCUUpdateDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String LastName;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global List<CampaignMember> LeadOrContact;
    global String LeadSource;
    global List<ListEmailIndividualRecipient> ListEmailIndividualRecipients;
    global Address MailingAddress;
    global String MailingCity;
    global String MailingCountry;
    global String MailingGeocodeAccuracy;
    global Double MailingLatitude;
    global Double MailingLongitude;
    global String MailingPostalCode;
    global String MailingState;
    global String MailingStreet;
    global List<MaintenancePlan> MaintenancePlans;
    global Contact MasterRecord;
    global Id MasterRecordId;
    global List<CaseTeamTemplateMember> Member;
    global String MobilePhone;
    global String Name;
    global List<Note> Notes;
    global List<NoteAndAttachment> NotesAndAttachments;
    global List<OpenActivity> OpenActivities;
    global List<OpportunityContactRole> OpportunityContactRoles;
    global Address OtherAddress;
    global String OtherCity;
    global String OtherCountry;
    global String OtherGeocodeAccuracy;
    global Double OtherLatitude;
    global Double OtherLongitude;
    global String OtherPhone;
    global String OtherPostalCode;
    global String OtherState;
    global String OtherStreet;
    global List<OutgoingEmailRelation> OutgoingEmailRelations;
    global User Owner;
    global Id OwnerId;
    global List<FeedItem> Parent;
    global List<UserEmailPreferredPerson> PersonRecord;
    global String Phone;
    global String PhotoUrl;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global List<Questionnaire_Returned__c> Questionnaires_Returned__r;
    global List<RecordActionHistory> RecordActionHistories;
    global List<RecordAction> RecordActions;
    global List<CollaborationGroupRecord> RecordAssociatedGroups;
    global List<ContentDistribution> RelatedRecord;
    global List<EventRelationChangeEvent> Relation;
    global List<Contact> ReportsTo;
    global Id ReportsToId;
    global List<ReturnOrder> ReturnOrders;
    global String Salutation;
    global List<ServiceAppointment> ServiceAppointments;
    global List<ContactShare> Shares;
    global List<OrderChangeEvent> ShipToContact;
    global Datetime SystemModstamp;
    global List<Task> Tasks;
    global String Title;
    global List<TopicAssignment> TopicAssignments;
    global List<UndecidedEventRelation> UndecidedEventRelations;
    global List<User> Users;
    global List<OutgoingEmail> Who;
    global List<WorkOrder> WorkOrders;

    global Contact () 
    {
    }
}