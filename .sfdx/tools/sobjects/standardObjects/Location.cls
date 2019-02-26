// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Location {
    global List<Address> Addresses;
    global List<Asset> Assets;
    global List<AssociatedLocation> AssociatedLocations;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<Location> ChildLocations;
    global Date CloseDate;
    global List<CombinedAttachment> CombinedAttachments;
    global Date ConstructionEndDate;
    global Date ConstructionStartDate;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global List<Shipment> DestinationLocationShipments;
    global List<ProductRequestLineItem> DestinationProductRequestLineItems;
    global List<ProductRequest> DestinationProductRequests;
    global List<ProductTransfer> DestinationProductTransfers;
    global List<ReturnOrderLineItem> DestinationReturnOrderLineItems;
    global List<ReturnOrder> DestinationReturnOrders;
    global String DrivingDirections;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<LocationFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global List<LocationHistory> Histories;
    global Id Id;
    global Boolean IsDeleted;
    global Boolean IsInventoryLocation;
    global Boolean IsMobile;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global Double Latitude;
    global Location Location;
    global Integer LocationLevel;
    global String LocationType;
    global Double Longitude;
    global List<MaintenancePlan> MaintenancePlans;
    global String Name;
    global Date OpenDate;
    global SObject Owner;
    global Id OwnerId;
    global List<FeedItem> Parent;
    global Location ParentLocation;
    global Id ParentLocationId;
    global Date PossessionDate;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global List<ProductItem> ProductItems;
    global List<FlowRecordRelation> RelatedRecord;
    global Date RemodelEndDate;
    global Date RemodelStartDate;
    global Location RootLocation;
    global Id RootLocationId;
    global List<ServiceResource> ServiceResources;
    global List<ServiceTerritoryLocation> ServiceTerritories;
    global List<Shipment> SourceLocationShipments;
    global List<ProductRequestLineItem> SourceProductRequestLineItems;
    global List<ProductRequest> SourceProductRequests;
    global List<ProductTransfer> SourceProductTransfers;
    global List<ReturnOrderLineItem> SourceReturnOrderLineItems;
    global List<ReturnOrder> SourceReturnOrders;
    global Datetime SystemModstamp;
    global String TimeZone;
    global Address VisitorAddress;
    global Id VisitorAddressId;
    global List<WorkOrderLineItem> WorkOrderLineItems;
    global List<WorkOrder> WorkOrders;

    global Location () 
    {
    }
}