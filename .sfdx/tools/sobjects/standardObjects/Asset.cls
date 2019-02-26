// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Asset {
    global Account Account;
    global Id AccountId;
    global List<ActivityHistory> ActivityHistories;
    global List<CaseChangeEvent> Asset;
    global Integer AssetLevel;
    global Account AssetProvidedBy;
    global Id AssetProvidedById;
    global Account AssetServicedBy;
    global Id AssetServicedById;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<Attachment> Attachments;
    global List<Case> Cases;
    global List<Asset> ChildAssets;
    global List<CombinedAttachment> CombinedAttachments;
    global Contact Contact;
    global Id ContactId;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global List<EmailMessage> Emails;
    global List<Event> Events;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<AssetFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global List<AssetHistory> Histories;
    global Id Id;
    global Date InstallDate;
    global Boolean IsCompetitorProduct;
    global Boolean IsDeleted;
    global Boolean IsInternal;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global Location Location;
    global Id LocationId;
    global List<MaintenanceAsset> MaintenanceAssets;
    global String Name;
    global List<Note> Notes;
    global List<NoteAndAttachment> NotesAndAttachments;
    global List<OpenActivity> OpenActivities;
    global User Owner;
    global Id OwnerId;
    global Asset Parent;
    global Id ParentId;
    global Decimal Price;
    global List<AssetRelationship> PrimaryAssets;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global Product2 Product2;
    global Id Product2Id;
    global String ProductCode;
    global Date PurchaseDate;
    global Double Quantity;
    global List<RecordActionHistory> RecordActionHistories;
    global List<RecordAction> RecordActions;
    global List<AssetRelationship> RelatedAssets;
    global List<FlowRecordRelation> RelatedRecord;
    global List<OutgoingEmail> RelatedTo;
    global List<EventRelationChangeEvent> Relation;
    global List<ReturnOrderLineItem> ReturnOrderLineItems;
    global List<Asset> RootAsset;
    global Id RootAssetId;
    global String SerialNumber;
    global List<ServiceAppointment> ServiceAppointments;
    global List<AssetShare> Shares;
    global String Status;
    global String StockKeepingUnit;
    global Datetime SystemModstamp;
    global List<Task> Tasks;
    global List<TopicAssignment> TopicAssignments;
    global Date UsageEndDate;
    global List<EventChangeEvent> What;
    global List<WorkOrderLineItem> WorkOrderLineItems;
    global List<WorkOrder> WorkOrders;

    global Asset () 
    {
    }
}