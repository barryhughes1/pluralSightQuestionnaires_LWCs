// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ServiceResource {
    global Account Account;
    global Id AccountId;
    global List<ActivityHistory> ActivityHistories;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<Attachment> Attachments;
    global List<CombinedAttachment> CombinedAttachments;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global List<EmailMessage> Emails;
    global List<Event> Events;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<ServiceResourceFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global List<ServiceResourceHistory> Histories;
    global Id Id;
    global Boolean IsActive;
    global Boolean IsCapacityBased;
    global Boolean IsOptimizationCapable;
    global Double LastKnownLatitude;
    global Location LastKnownLocation;
    global Datetime LastKnownLocationDate;
    global Double LastKnownLongitude;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global Location Location;
    global Id LocationId;
    global String Name;
    global List<Note> Notes;
    global List<NoteAndAttachment> NotesAndAttachments;
    global List<OpenActivity> OpenActivities;
    global SObject Owner;
    global Id OwnerId;
    global List<FeedItem> Parent;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global User RelatedRecord;
    global Id RelatedRecordId;
    global List<OutgoingEmail> RelatedTo;
    global List<EventRelationChangeEvent> Relation;
    global List<ResourceAbsence> ResourceAbsences;
    global List<ResourcePreference> ResourcePreferences;
    global String ResourceType;
    global List<AssignedResource> ServiceAppointments;
    global ServiceCrew ServiceCrew;
    global Id ServiceCrewId;
    global List<ServiceCrewMember> ServiceCrewMembers;
    global List<ServiceResourceCapacity> ServiceResourceCapacities;
    global List<ServiceResourceSkill> ServiceResourceSkills;
    global List<ServiceTerritoryMember> ServiceTerritories;
    global Datetime SystemModstamp;
    global List<Task> Tasks;
    global List<TimeSheet> TimeSheets;
    global List<TopicAssignment> TopicAssignments;
    global List<EventChangeEvent> What;

    global ServiceResource () 
    {
    }
}