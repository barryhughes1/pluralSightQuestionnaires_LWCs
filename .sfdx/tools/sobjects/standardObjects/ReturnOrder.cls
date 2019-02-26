// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ReturnOrder {
    global Account Account;
    global Id AccountId;
    global List<ActivityHistory> ActivityHistories;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global Case Case;
    global Id CaseId;
    global List<CombinedAttachment> CombinedAttachments;
    global Contact Contact;
    global Id ContactId;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global Location DestinationLocation;
    global Id DestinationLocationId;
    global List<EmailMessage> Emails;
    global List<Event> Events;
    global Datetime ExpectedArrivalDate;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<ReturnOrderFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global List<ReturnOrderHistory> Histories;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global List<OpenActivity> OpenActivities;
    global Order Order;
    global Id OrderId;
    global SObject Owner;
    global Id OwnerId;
    global List<FeedComment> Parent;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global ProductRequest ProductRequest;
    global Id ProductRequestId;
    global List<ProductTransfer> ProductTransfers;
    global List<FlowRecordRelation> RelatedRecord;
    global List<OutgoingEmail> RelatedTo;
    global List<EventRelationChangeEvent> Relation;
    global List<ReturnOrderLineItem> ReturnOrderLineItems;
    global String ReturnOrderNumber;
    global User ReturnedBy;
    global Id ReturnedById;
    global Address ShipFromAddress;
    global String ShipFromCity;
    global String ShipFromCountry;
    global String ShipFromGeocodeAccuracy;
    global Double ShipFromLatitude;
    global Double ShipFromLongitude;
    global String ShipFromPostalCode;
    global String ShipFromState;
    global String ShipFromStreet;
    global String ShipmentType;
    global Location SourceLocation;
    global Id SourceLocationId;
    global String Status;
    global Datetime SystemModstamp;
    global List<Task> Tasks;
    global List<TopicAssignment> TopicAssignments;
    global List<EventChangeEvent> What;
    global List<WorkOrderLineItem> WorkOrderLineItems;
    global List<WorkOrder> WorkOrders;

    global ReturnOrder () 
    {
    }
}