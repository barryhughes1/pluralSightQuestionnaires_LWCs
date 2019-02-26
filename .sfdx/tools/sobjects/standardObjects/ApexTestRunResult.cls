// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ApexTestRunResult {
    global List<ApexTestResult> ApexTestRunResult;
    global AsyncApexJob AsyncApexJob;
    global Id AsyncApexJobId;
    global Integer ClassesCompleted;
    global Integer ClassesEnqueued;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global Datetime EndTime;
    global Id Id;
    global Boolean IsAllTests;
    global Boolean IsDeleted;
    global String JobName;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Integer MethodsCompleted;
    global Integer MethodsEnqueued;
    global Integer MethodsFailed;
    global String Source;
    global Datetime StartTime;
    global String Status;
    global Datetime SystemModstamp;
    global List<ApexTestQueueItem> TestRunResult;
    global Integer TestTime;
    global User User;
    global Id UserId;

    global ApexTestRunResult () 
    {
    }
}