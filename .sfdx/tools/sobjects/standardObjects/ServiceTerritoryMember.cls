// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ServiceTerritoryMember {
    global Address Address;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global String City;
    global List<CombinedAttachment> CombinedAttachments;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global String Country;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global Datetime EffectiveEndDate;
    global Datetime EffectiveStartDate;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<ServiceTerritoryMemberFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global String GeocodeAccuracy;
    global List<ServiceTerritoryMemberHistory> Histories;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global Double Latitude;
    global Double Longitude;
    global String MemberNumber;
    global OperatingHours OperatingHours;
    global Id OperatingHoursId;
    global List<FeedItem> Parent;
    global String PostalCode;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global List<FlowRecordRelation> RelatedRecord;
    global ServiceResource ServiceResource;
    global Id ServiceResourceId;
    global ServiceTerritory ServiceTerritory;
    global Id ServiceTerritoryId;
    global String State;
    global String Street;
    global Datetime SystemModstamp;
    global String TerritoryType;
    global List<TopicAssignment> TopicAssignments;

    global ServiceTerritoryMember () 
    {
    }
}