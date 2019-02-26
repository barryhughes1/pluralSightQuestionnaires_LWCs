// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class MacroInstruction {
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Macro Macro;
    global Id MacroId;
    global String Name;
    global String Operation;
    global List<FlowRecordRelation> RelatedRecord;
    global Integer SortOrder;
    global Datetime SystemModstamp;
    global String Target;
    global String Value;
    global String ValueRecord;

    global MacroInstruction () 
    {
    }
}