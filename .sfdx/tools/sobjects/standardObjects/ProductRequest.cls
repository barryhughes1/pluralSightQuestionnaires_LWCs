// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ProductRequest {
    global Account Account;
    global Id AccountId;
    global List<ActivityHistory> ActivityHistories;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global Case Case;
    global Id CaseId;
    global List<CombinedAttachment> CombinedAttachments;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global Location DestinationLocation;
    global Id DestinationLocationId;
    global List<EmailMessage> Emails;
    global List<Event> Events;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<ProductRequestFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global List<ProductRequestHistory> Histories;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global Datetime NeedByDate;
    global List<OpenActivity> OpenActivities;
    global SObject Owner;
    global Id OwnerId;
    global List<FeedItem> Parent;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global List<ProductRequestLineItem> ProductRequestLineItems;
    global String ProductRequestNumber;
    global List<ProductTransfer> ProductTransfers;
    global List<FlowRecordRelation> RelatedRecord;
    global List<OutgoingEmail> RelatedTo;
    global List<EventRelationChangeEvent> Relation;
    global List<ReturnOrder> ReturnOrders;
    global Address ShipToAddress;
    global String ShipToCity;
    global String ShipToCountry;
    global String ShipToGeocodeAccuracy;
    global Double ShipToLatitude;
    global Double ShipToLongitude;
    global String ShipToPostalCode;
    global String ShipToState;
    global String ShipToStreet;
    global String ShipmentType;
    global Location SourceLocation;
    global Id SourceLocationId;
    global String Status;
    global Datetime SystemModstamp;
    global List<Task> Tasks;
    global List<TopicAssignment> TopicAssignments;
    global List<EventChangeEvent> What;
    global WorkOrder WorkOrder;
    global Id WorkOrderId;
    global WorkOrderLineItem WorkOrderLineItem;
    global Id WorkOrderLineItemId;

    global ProductRequest () 
    {
    }
}