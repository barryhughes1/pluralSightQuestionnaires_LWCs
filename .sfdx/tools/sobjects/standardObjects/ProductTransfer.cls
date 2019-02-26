// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ProductTransfer {
    global List<ActivityHistory> ActivityHistories;
    global List<AttachedContentDocument> AttachedContentDocuments;
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
    global Datetime ExpectedPickupDate;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<ProductTransferFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global List<ProductTransferHistory> Histories;
    global Id Id;
    global Boolean IsDeleted;
    global Boolean IsReceived;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global List<OpenActivity> OpenActivities;
    global SObject Owner;
    global Id OwnerId;
    global List<FeedItem> Parent;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global Product2 Product2;
    global Id Product2Id;
    global List<ProductItemTransaction> ProductItemTransactions;
    global ProductRequest ProductRequest;
    global Id ProductRequestId;
    global ProductRequestLineItem ProductRequestLineItem;
    global Id ProductRequestLineItemId;
    global String ProductTransferNumber;
    global Double QuantityReceived;
    global Double QuantitySent;
    global String QuantityUnitOfMeasure;
    global SObject ReceivedBy;
    global Id ReceivedById;
    global List<FlowRecordRelation> RelatedRecord;
    global List<OutgoingEmail> RelatedTo;
    global List<EventRelationChangeEvent> Relation;
    global ReturnOrder ReturnOrder;
    global Id ReturnOrderId;
    global ReturnOrderLineItem ReturnOrderLineItem;
    global Id ReturnOrderLineItemId;
    global Shipment Shipment;
    global Datetime ShipmentExpectedDeliveryDate;
    global Id ShipmentId;
    global String ShipmentStatus;
    global String ShipmentTrackingNumber;
    global String ShipmentTrackingUrl;
    global Location SourceLocation;
    global Id SourceLocationId;
    global ProductItem SourceProductItem;
    global Id SourceProductItemId;
    global String Status;
    global Datetime SystemModstamp;
    global List<Task> Tasks;
    global List<TopicAssignment> TopicAssignments;
    global List<TaskChangeEvent> What;

    global ProductTransfer () 
    {
    }
}