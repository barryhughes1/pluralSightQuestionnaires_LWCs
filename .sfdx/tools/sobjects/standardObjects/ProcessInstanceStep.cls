// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ProcessInstanceStep {
    global SObject Actor;
    global Id ActorId;
    global String Comments;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global Double ElapsedTimeInDays;
    global Double ElapsedTimeInHours;
    global Double ElapsedTimeInMinutes;
    global Id Id;
    global SObject OriginalActor;
    global Id OriginalActorId;
    global ProcessInstance ProcessInstance;
    global Id ProcessInstanceId;
    global ProcessNode StepNode;
    global Id StepNodeId;
    global String StepStatus;
    global Datetime SystemModstamp;

    global ProcessInstanceStep () 
    {
    }
}