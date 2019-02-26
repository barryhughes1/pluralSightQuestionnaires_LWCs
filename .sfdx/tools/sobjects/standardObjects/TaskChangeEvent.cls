// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class TaskChangeEvent {
    global Account Account;
    global Id AccountId;
    global Date ActivityDate;
    global String CallDisposition;
    global Integer CallDurationInSeconds;
    global String CallObject;
    global String CallType;
    global Object ChangeEventHeader;
    global Datetime CompletedDateTime;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global Id Id;
    global Boolean IsClosed;
    global Boolean IsRecurrence;
    global Boolean IsReminderSet;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global User Owner;
    global Id OwnerId;
    global String Priority;
    global Task RecurrenceActivity;
    global Id RecurrenceActivityId;
    global Integer RecurrenceDayOfMonth;
    global Integer RecurrenceDayOfWeekMask;
    global Date RecurrenceEndDateOnly;
    global String RecurrenceInstance;
    global Integer RecurrenceInterval;
    global String RecurrenceMonthOfYear;
    global String RecurrenceRegeneratedType;
    global Date RecurrenceStartDateOnly;
    global String RecurrenceTimeZoneSidKey;
    global String RecurrenceType;
    global Datetime ReminderDateTime;
    global String ReplayId;
    global String Status;
    global String Subject;
    global SObject What;
    global Id WhatId;
    global SObject Who;
    global Id WhoId;

    global TaskChangeEvent () 
    {
    }
}