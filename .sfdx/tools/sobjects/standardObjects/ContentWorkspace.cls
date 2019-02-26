// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ContentWorkspace {
    global List<AttachedContentDocument> AttachedContentDocuments;
    global List<CombinedAttachment> CombinedAttachments;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global List<ContentFolderLink> ContentFolderLinks;
    global List<ContentWorkspaceSubscription> ContentWorkspace;
    global List<ContentWorkspaceMember> ContentWorkspaceMembers;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global RecordType DefaultRecordType;
    global Id DefaultRecordTypeId;
    global String Description;
    global String DeveloperName;
    global List<ContentNotification> EntityIdentifier;
    global List<ContentVersion> FirstPublishLocation;
    global Id Id;
    global Boolean IsRestrictContentTypes;
    global Boolean IsRestrictLinkedContentTypes;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastWorkspaceActivityDate;
    global String Name;
    global String NamespacePrefix;
    global List<ContentDocument> Parent;
    global ContentFolder RootContentFolder;
    global Id RootContentFolderId;
    global Boolean ShouldAddCreatorMembership;
    global Datetime SystemModstamp;
    global String TagModel;
    global ContentAsset WorkspaceImage;
    global Id WorkspaceImageId;
    global String WorkspaceType;

    global ContentWorkspace () 
    {
    }
}