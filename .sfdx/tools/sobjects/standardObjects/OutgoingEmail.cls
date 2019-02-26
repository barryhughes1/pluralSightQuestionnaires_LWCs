// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class OutgoingEmail {
    global String BccAddress;
    global String CcAddress;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global EmailTemplate EmailTemplate;
    global Id EmailTemplateId;
    global String ExternalId;
    global List<ContentVersion> FirstPublishLocation;
    global String HtmlBody;
    global Id Id;
    global List<OutgoingEmailRelation> OutgoingEmailRelations;
    global SObject RelatedTo;
    global Id RelatedToId;
    global String Subject;
    global String TextBody;
    global String ToAddress;
    global String ValidatedFromAddress;
    global SObject Who;
    global Id WhoId;

    global OutgoingEmail () 
    {
    }
}