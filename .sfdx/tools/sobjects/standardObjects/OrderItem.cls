// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class OrderItem {
    global List<AttachedContentDocument> AttachedContentDocuments;
    global Double AvailableQuantity;
    global List<OrderItem> ChildOrderItems;
    global List<CombinedAttachment> CombinedAttachments;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global Date EndDate;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<OrderItemFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global List<OrderItemHistory> Histories;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Decimal ListPrice;
    global Order Order;
    global Id OrderId;
    global String OrderItemNumber;
    global List<OrderItemChangeEvent> OriginalOrderItem;
    global Id OriginalOrderItemId;
    global List<FeedItem> Parent;
    global PricebookEntry PricebookEntry;
    global Id PricebookEntryId;
    global Product2 Product2;
    global Id Product2Id;
    global Double Quantity;
    global List<FlowRecordRelation> RelatedRecord;
    global List<ReturnOrderLineItem> ReturnOrderLineItems;
    global Date ServiceDate;
    global Datetime SystemModstamp;
    global Decimal TotalPrice;
    global Decimal UnitPrice;

    global OrderItem () 
    {
    }
}