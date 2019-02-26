// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Folder {
    global String AccessType;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String DeveloperName;
    global List<EmailTemplate> Folder;
    global Id Id;
    global Boolean IsReadonly;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String Name;
    global String NamespacePrefix;
    global List<Report> Owner;
    global Folder Parent;
    global Id ParentId;
    global List<Folder> SubFolders;
    global Datetime SystemModstamp;
    global String Type;

    global Folder () 
    {
    }
}