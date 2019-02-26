// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Calendar {
    global List<AcceptedEventRelation> AcceptedEventRelations;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global List<DeclinedEventRelation> DeclinedEventRelations;
    global List<EventRelation> EventRelations;
    global Id Id;
    global Boolean IsActive;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String Name;
    global List<Event> Owner;
    global List<EventRelationChangeEvent> Relation;
    global Datetime SystemModstamp;
    global String Type;
    global List<UndecidedEventRelation> UndecidedEventRelations;
    global User User;
    global Id UserId;

    global Calendar () 
    {
    }
}