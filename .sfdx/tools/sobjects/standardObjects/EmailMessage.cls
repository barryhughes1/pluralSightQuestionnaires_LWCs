// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class EmailMessage {
    global Task Activity;
    global Id ActivityId;
    global List<OpenActivity> AlternateDetail;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<Attachment> Attachments;
    global String BccAddress;
    global String CcAddress;
    global List<CombinedAttachment> CombinedAttachments;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global List<EmailMessageRelation> EmailMessageRelations;
    global EmailTemplate EmailTemplate;
    global Id EmailTemplateId;
    global Datetime FirstOpenedDate;
    global List<ContentVersion> FirstPublishLocation;
    global String FromAddress;
    global String FromName;
    global Boolean HasAttachment;
    global String Headers;
    global String HtmlBody;
    global Id Id;
    global Boolean Incoming;
    global Boolean IsBounced;
    global Boolean IsClientManaged;
    global Boolean IsDeleted;
    global Boolean IsExternallyVisible;
    global Boolean IsOpened;
    global Boolean IsTracked;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastOpenedDate;
    global Datetime MessageDate;
    global String MessageIdentifier;
    global Case Parent;
    global Id ParentId;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global List<FlowRecordRelation> RelatedRecord;
    global SObject RelatedTo;
    global Id RelatedToId;
    global List<EmailMessage> ReplyToEmailMessage;
    global Id ReplyToEmailMessageId;
    global String Status;
    global String Subject;
    global Datetime SystemModstamp;
    global String TextBody;
    global String ThreadIdentifier;
    global String ToAddress;
    global String ValidatedFromAddress;

    global EmailMessage () 
    {
    }
}