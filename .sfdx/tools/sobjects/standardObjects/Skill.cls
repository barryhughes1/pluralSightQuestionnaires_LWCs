// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Skill {
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global String DeveloperName;
    global Id Id;
    global Boolean IsDeleted;
    global String Language;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastViewedDate;
    global String MasterLabel;
    global List<ServiceResourceSkill> ServiceResources;
    global List<SkillRequirement> SkillRequirements;
    global Datetime SystemModstamp;

    global Skill () 
    {
    }
}