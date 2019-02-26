// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ServiceReport {
    global ContentVersion ContentVersionDocument;
    global Id ContentVersionDocumentId;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global Blob DocumentBody;
    global String DocumentContentType;
    global Integer DocumentLength;
    global String DocumentName;
    global List<ServiceReportHistory> Histories;
    global Id Id;
    global Boolean IsDeleted;
    global Boolean IsSigned;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global SObject Parent;
    global Id ParentId;
    global List<FlowRecordRelation> RelatedRecord;
    global String ServiceReportLanguage;
    global String ServiceReportNumber;
    global Datetime SystemModstamp;
    global String Template;

    global ServiceReport () 
    {
    }
}