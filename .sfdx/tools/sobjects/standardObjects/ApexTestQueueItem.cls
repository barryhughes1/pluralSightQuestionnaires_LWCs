// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ApexTestQueueItem {
    global ApexClass ApexClass;
    global Id ApexClassId;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String ExtendedStatus;
    global Id Id;
    global AsyncApexJob ParentJob;
    global Id ParentJobId;
    global List<ApexTestResult> QueueItem;
    global List<FlowRecordRelation> RelatedRecord;
    global Boolean ShouldSkipCodeCoverage;
    global String Status;
    global Datetime SystemModstamp;
    global ApexTestRunResult TestRunResult;
    global Id TestRunResultId;

    global ApexTestQueueItem () 
    {
    }
}