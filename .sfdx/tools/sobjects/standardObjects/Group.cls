// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Group {
    global List<FieldDefinition> BusinessOwner;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global List<EntityDefinition> DataSteward;
    global List<UserChangeEvent> DelegatedApprover;
    global List<User> DelegatedUsers;
    global String DeveloperName;
    global Boolean DoesIncludeBosses;
    global Boolean DoesSendEmailToMembers;
    global String Email;
    global List<GroupMember> GroupMembers;
    global Id Id;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global List<ContentWorkspaceMember> Member;
    global String Name;
    global SObject Owner;
    global Id OwnerId;
    global List<QueueSobject> QueueSobjects;
    global SObject Related;
    global Id RelatedId;
    global Datetime SystemModstamp;
    global String Type;
    global List<AccountShare> UserOrGroup;

    global Group () 
    {
    }
}