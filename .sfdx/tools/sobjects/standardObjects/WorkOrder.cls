// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class WorkOrder {
    global Account Account;
    global Id AccountId;
    global List<ActivityHistory> ActivityHistories;
    global Address Address;
    global Asset Asset;
    global Id AssetId;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<Attachment> Attachments;
    global BusinessHours BusinessHours;
    global Id BusinessHoursId;
    global Case Case;
    global Id CaseId;
    global List<WorkOrder> ChildWorkOrders;
    global String City;
    global List<CombinedAttachment> CombinedAttachments;
    global Contact Contact;
    global Id ContactId;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global String Country;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global List<WorkOrder> DescendantWorkOrders;
    global String Description;
    global List<DigitalSignature> DigitalSignatures;
    global Double Discount;
    global Double Duration;
    global Double DurationInMinutes;
    global String DurationType;
    global List<EmailMessage> Emails;
    global Datetime EndDate;
    global List<Event> Events;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<WorkOrderFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global String GeocodeAccuracy;
    global Decimal GrandTotal;
    global List<WorkOrderHistory> Histories;
    global Id Id;
    global Boolean IsClosed;
    global Boolean IsDeleted;
    global Boolean IsGeneratedFromMaintenancePlan;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global Double Latitude;
    global Integer LineItemCount;
    global Location Location;
    global Id LocationId;
    global Double Longitude;
    global MaintenancePlan MaintenancePlan;
    global Id MaintenancePlanId;
    global Integer MinimumCrewSize;
    global List<Note> Notes;
    global List<NoteAndAttachment> NotesAndAttachments;
    global List<OpenActivity> OpenActivities;
    global SObject Owner;
    global Id OwnerId;
    global List<FeedItem> Parent;
    global WorkOrder ParentWorkOrder;
    global Id ParentWorkOrderId;
    global String PostalCode;
    global Pricebook2 Pricebook2;
    global Id Pricebook2Id;
    global String Priority;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global List<ProductRequestLineItem> ProductRequestLineItems;
    global List<ProductRequest> ProductRequests;
    global List<ProductConsumed> ProductsConsumed;
    global List<ProductRequired> ProductsRequired;
    global Integer RecommendedCrewSize;
    global List<RecordActionHistory> RecordActionHistories;
    global List<RecordAction> RecordActions;
    global List<FlowRecordRelation> RelatedRecord;
    global List<OutgoingEmail> RelatedTo;
    global List<EventRelationChangeEvent> Relation;
    global List<ResourcePreference> ResourcePreferences;
    global ReturnOrder ReturnOrder;
    global Id ReturnOrderId;
    global ReturnOrderLineItem ReturnOrderLineItem;
    global Id ReturnOrderLineItemId;
    global WorkOrder RootWorkOrder;
    global Id RootWorkOrderId;
    global Integer ServiceAppointmentCount;
    global List<ServiceAppointment> ServiceAppointments;
    global String ServiceReportLanguage;
    global ServiceReportLayout ServiceReportTemplate;
    global Id ServiceReportTemplateId;
    global List<ServiceReport> ServiceReports;
    global ServiceTerritory ServiceTerritory;
    global Id ServiceTerritoryId;
    global List<SkillRequirement> SkillRequirements;
    global Datetime StartDate;
    global String State;
    global String Status;
    global String StatusCategory;
    global String Street;
    global String Subject;
    global Decimal Subtotal;
    global Date SuggestedMaintenanceDate;
    global Datetime SystemModstamp;
    global List<Task> Tasks;
    global Decimal Tax;
    global List<TimeSheetEntry> TimeSheetEntries;
    global List<TopicAssignment> TopicAssignments;
    global Decimal TotalPrice;
    global List<EventChangeEvent> What;
    global List<WorkOrderLineItem> WorkOrderLineItems;
    global String WorkOrderNumber;
    global WorkType WorkType;
    global Id WorkTypeId;

    global WorkOrder () 
    {
    }
}