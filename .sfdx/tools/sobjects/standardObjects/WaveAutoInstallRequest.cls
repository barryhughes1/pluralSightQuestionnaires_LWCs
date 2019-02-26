// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class WaveAutoInstallRequest {
    global String Configuration;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String FailedReason;
    global Folder Folder;
    global Id FolderId;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String Name;
    global List<FlowRecordRelation> RelatedRecord;
    global String RequestLog;
    global String RequestStatus;
    global String RequestType;
    global Datetime SystemModstamp;
    global String TemplateApiName;
    global String TemplateVersion;
    global List<WaveCompatibilityCheckItem> WaveCompatibilityCheckItems;

    global WaveAutoInstallRequest () 
    {
    }
}