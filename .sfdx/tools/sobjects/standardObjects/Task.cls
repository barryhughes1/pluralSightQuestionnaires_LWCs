// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Task {
    global Account Account;
    global Id AccountId;
    global List<EmailMessage> Activity;
    global Date ActivityDate;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<Attachment> Attachments;
    global String CallDisposition;
    global Integer CallDurationInSeconds;
    global String CallObject;
    global String CallType;
    global List<CombinedAttachment> CombinedAttachments;
    global Datetime CompletedDateTime;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<TaskFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global Id Id;
    global Boolean IsArchived;
    global Boolean IsClosed;
    global Boolean IsDeleted;
    global Boolean IsHighPriority;
    global Boolean IsRecurrence;
    global Boolean IsReminderSet;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global User Owner;
    global Id OwnerId;
    global List<FeedItem> Parent;
    global String Priority;
    global List<RecordActionHistory> RecordActionHistories;
    global List<RecordAction> RecordActions;
    global List<TaskChangeEvent> RecurrenceActivity;
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
    global List<Task> RecurringTasks;
    global List<FlowRecordRelation> RelatedRecord;
    global Datetime ReminderDateTime;
    global String Status;
    global String Subject;
    global Datetime SystemModstamp;
    global List<EmailStatus> Task;
    global String TaskSubtype;
    global List<TopicAssignment> TopicAssignments;
    global SObject What;
    global Id WhatId;
    global SObject Who;
    global Id WhoId;

    global Task () 
    {
    }
}