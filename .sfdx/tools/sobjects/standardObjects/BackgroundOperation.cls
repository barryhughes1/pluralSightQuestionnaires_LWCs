// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class BackgroundOperation {
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Error;
    global String ExecutionGroup;
    global Datetime ExpiresAt;
    global Datetime FinishedAt;
    global BackgroundOperation GroupLeader;
    global Id GroupLeaderId;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global List<BackgroundOperation> MergedOperations;
    global String Name;
    global Integer NumFollowers;
    global String ParentKey;
    global Datetime ProcessAfter;
    global List<FlowRecordRelation> RelatedRecord;
    global Integer RetryBackoff;
    global Integer RetryCount;
    global Integer RetryLimit;
    global String SequenceGroup;
    global Integer SequenceNumber;
    global Datetime StartedAt;
    global String Status;
    global Datetime SubmittedAt;
    global Datetime SystemModstamp;
    global Integer Timeout;
    global String WorkerUri;

    global BackgroundOperation () 
    {
    }
}