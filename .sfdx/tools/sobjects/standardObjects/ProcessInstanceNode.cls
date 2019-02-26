// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ProcessInstanceNode {
    global Datetime CompletedDate;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global Double ElapsedTimeInDays;
    global Double ElapsedTimeInHours;
    global Double ElapsedTimeInMinutes;
    global Id Id;
    global Boolean IsDeleted;
    global User LastActor;
    global Id LastActorId;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String NodeStatus;
    global ProcessInstance ProcessInstance;
    global Id ProcessInstanceId;
    global ProcessNode ProcessNode;
    global Id ProcessNodeId;
    global String ProcessNodeName;
    global List<FlowRecordRelation> RelatedRecord;
    global Datetime SystemModstamp;

    global ProcessInstanceNode () 
    {
    }
}