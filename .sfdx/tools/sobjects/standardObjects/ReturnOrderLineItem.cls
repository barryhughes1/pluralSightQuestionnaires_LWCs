// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ReturnOrderLineItem {
    global List<ActivityHistory> ActivityHistories;
    global Asset Asset;
    global Id AssetId;
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
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<ReturnOrderLineItemFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global List<ReturnOrderLineItemHistory> Histories;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global List<OpenActivity> OpenActivities;
    global OrderItem OrderItem;
    global Id OrderItemId;
    global List<FeedItem> Parent;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global String ProcessingPlan;
    global Product2 Product2;
    global Id Product2Id;
    global ProductItem ProductItem;
    global Id ProductItemId;
    global ProductRequestLineItem ProductRequestLineItem;
    global Id ProductRequestLineItemId;
    global List<ProductTransfer> ProductTransfers;
    global Double QuantityReturned;
    global String QuantityUnitOfMeasure;
    global String ReasonForReturn;
    global List<FlowRecordRelation> RelatedRecord;
    global List<OutgoingEmail> RelatedTo;
    global List<EventRelationChangeEvent> Relation;
    global String RepaymentMethod;
    global ReturnOrder ReturnOrder;
    global Id ReturnOrderId;
    global String ReturnOrderLineItemNumber;
    global Location SourceLocation;
    global Id SourceLocationId;
    global Datetime SystemModstamp;
    global List<Task> Tasks;
    global List<TopicAssignment> TopicAssignments;
    global List<EventChangeEvent> What;
    global List<WorkOrderLineItem> WorkOrderLineItems;
    global List<WorkOrder> WorkOrders;

    global ReturnOrderLineItem () 
    {
    }
}