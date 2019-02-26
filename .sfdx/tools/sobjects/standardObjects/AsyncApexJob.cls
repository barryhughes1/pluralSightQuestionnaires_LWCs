// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class AsyncApexJob {
    global ApexClass ApexClass;
    global Id ApexClassId;
    global List<ApexTestRunResult> AsyncApex;
    global List<FlexQueueItem> AsyncApexJob;
    global Datetime CompletedDate;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String ExtendedStatus;
    global Id Id;
    global Integer JobItemsProcessed;
    global String JobType;
    global String LastProcessed;
    global Integer LastProcessedOffset;
    global String MethodName;
    global Integer NumberOfErrors;
    global AsyncApexJob ParentJob;
    global Id ParentJobId;
    global List<FlowRecordRelation> RelatedRecord;
    global String Status;
    global Integer TotalJobItems;

    global AsyncApexJob () 
    {
    }
}