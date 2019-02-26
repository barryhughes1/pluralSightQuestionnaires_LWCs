// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class MaintenancePlan {
    global Account Account;
    global Id AccountId;
    global List<ActivityHistory> ActivityHistories;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<CombinedAttachment> CombinedAttachments;
    global Contact Contact;
    global Id ContactId;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global Boolean DoesAutoGenerateWorkOrders;
    global Boolean DoesGenerateUponCompletion;
    global List<EmailMessage> Emails;
    global Date EndDate;
    global List<Event> Events;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<MaintenancePlanFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global Integer Frequency;
    global String FrequencyType;
    global Integer GenerationHorizon;
    global Integer GenerationTimeframe;
    global String GenerationTimeframeType;
    global List<MaintenancePlanHistory> Histories;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global Location Location;
    global Id LocationId;
    global List<MaintenanceAsset> MaintenanceAssets;
    global String MaintenancePlanNumber;
    global String MaintenancePlanTitle;
    global Integer MaintenanceWindowEndDays;
    global Integer MaintenanceWindowStartDays;
    global Date NextSuggestedMaintenanceDate;
    global List<OpenActivity> OpenActivities;
    global SObject Owner;
    global Id OwnerId;
    global List<FeedItem> Parent;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global List<FlowRecordRelation> RelatedRecord;
    global List<OutgoingEmail> RelatedTo;
    global List<EventRelationChangeEvent> Relation;
    global Date StartDate;
    global String SvcApptGenerationMethod;
    global Datetime SystemModstamp;
    global List<Task> Tasks;
    global List<TopicAssignment> TopicAssignments;
    global List<EventChangeEvent> What;
    global String WorkOrderGenerationMethod;
    global String WorkOrderGenerationStatus;
    global List<WorkOrderLineItem> WorkOrderLineItems;
    global List<WorkOrder> WorkOrders;
    global WorkType WorkType;
    global Id WorkTypeId;

    global MaintenancePlan () 
    {
    }
}