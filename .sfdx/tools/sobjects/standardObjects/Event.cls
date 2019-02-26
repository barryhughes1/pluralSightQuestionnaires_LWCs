// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Event {
    global List<AcceptedEventRelation> AcceptedEventRelations;
    global Account Account;
    global Id AccountId;
    global Date ActivityDate;
    global Datetime ActivityDateTime;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<Attachment> Attachments;
    global List<CombinedAttachment> CombinedAttachments;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global List<DeclinedEventRelation> DeclinedEventRelations;
    global String Description;
    global Integer DurationInMinutes;
    global Datetime EndDateTime;
    global List<EventRelationChangeEvent> Event;
    global List<EventRelation> EventRelations;
    global String EventSubtype;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<EventFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global String GroupEventType;
    global Id Id;
    global Boolean IsAllDayEvent;
    global Boolean IsArchived;
    global Boolean IsChild;
    global Boolean IsDeleted;
    global Boolean IsGroupEvent;
    global Boolean IsPrivate;
    global Boolean IsRecurrence;
    global Boolean IsRecurrence2;
    global Boolean IsRecurrence2Exception;
    global Boolean IsRecurrence2Exclusion;
    global Boolean IsReminderSet;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String Location;
    global SObject Owner;
    global Id OwnerId;
    global List<FeedComment> Parent;
    global Datetime Recurrence2PatternStartDate;
    global String Recurrence2PatternText;
    global String Recurrence2PatternTimeZone;
    global String Recurrence2PatternVersion;
    global Event RecurrenceActivity;
    global Id RecurrenceActivityId;
    global Integer RecurrenceDayOfMonth;
    global Integer RecurrenceDayOfWeekMask;
    global Date RecurrenceEndDateOnly;
    global String RecurrenceInstance;
    global Integer RecurrenceInterval;
    global String RecurrenceMonthOfYear;
    global Datetime RecurrenceStartDateTime;
    global String RecurrenceTimeZoneSidKey;
    global String RecurrenceType;
    global List<Event> RecurringEvents;
    global List<FlowRecordRelation> RelatedRecord;
    global Datetime ReminderDateTime;
    global String ShowAs;
    global Datetime StartDateTime;
    global String Subject;
    global Datetime SystemModstamp;
    global List<TopicAssignment> TopicAssignments;
    global List<UndecidedEventRelation> UndecidedEventRelations;
    global SObject What;
    global Id WhatId;
    global SObject Who;
    global Id WhoId;

    global Event () 
    {
    }
}