// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class CaseChangeEvent {
    global Account Account;
    global Id AccountId;
    global Asset Asset;
    global Id AssetId;
    global String CaseNumber;
    global Object ChangeEventHeader;
    global Datetime ClosedDate;
    global Contact Contact;
    global Id ContactId;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global Id Id;
    global Boolean IsClosed;
    global Boolean IsEscalated;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String Origin;
    global User Owner;
    global Id OwnerId;
    global Case Parent;
    global Id ParentId;
    global String Priority;
    global String Reason;
    global String ReplayId;
    global String Status;
    global String Subject;
    global String SuppliedCompany;
    global String SuppliedEmail;
    global String SuppliedName;
    global String SuppliedPhone;
    global String Type;

    global CaseChangeEvent () 
    {
    }
}