// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ListEmail {
    global List<ActivityHistory> ActivityHistories;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global Campaign Campaign;
    global Id CampaignId;
    global List<CombinedAttachment> CombinedAttachments;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global List<EmailMessage> Emails;
    global List<Event> Events;
    global List<ContentVersion> FirstPublishLocation;
    global String FromAddress;
    global String FromName;
    global Boolean HasAttachment;
    global String HtmlBody;
    global Id Id;
    global Boolean IsDeleted;
    global Boolean IsTracked;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReferencedDate;
    global Datetime LastViewedDate;
    global List<ListEmailIndividualRecipient> ListEmail;
    global String Name;
    global List<OpenActivity> OpenActivities;
    global SObject Owner;
    global Id OwnerId;
    global List<FlowRecordRelation> RelatedRecord;
    global List<EventRelationChangeEvent> Relation;
    global Datetime ScheduledDate;
    global String Status;
    global String Subject;
    global Datetime SystemModstamp;
    global List<Task> Tasks;
    global String TextBody;
    global Integer TotalSent;
    global List<EventChangeEvent> What;

    global ListEmail () 
    {
    }
}