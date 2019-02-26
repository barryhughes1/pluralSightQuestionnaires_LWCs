// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class AssignedResource {
    global Double ActualTravelTime;
    global String AssignedResourceNumber;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<CombinedAttachment> CombinedAttachments;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global Double EstimatedTravelTime;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<AssignedResourceFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global List<FeedItem> Parent;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global List<FlowRecordRelation> RelatedRecord;
    global ServiceAppointment ServiceAppointment;
    global Id ServiceAppointmentId;
    global ServiceCrew ServiceCrew;
    global Id ServiceCrewId;
    global ServiceResource ServiceResource;
    global Id ServiceResourceId;
    global Datetime SystemModstamp;

    global AssignedResource () 
    {
    }
}