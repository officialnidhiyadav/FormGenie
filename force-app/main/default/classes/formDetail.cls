public with sharing class formDetail {
    @AuraEnabled(cacheable=true)
    //getFormDetail
    public static List<Form_Detail__c> getFormsDetails(Id formnameidclass)
    {

        return[SELECT Id,Display_Name__c,Data_Type__c,OptionList__c,Form_Name__c FROM Form_Detail__c WHERE Form_Name__c =: formnameidclass ORDER BY Form_Name__c DESC];

    }
    @AuraEnabled
    //insert
    public static Form_Detail__c saveFormDetailRecord(Id fdFormName,string fdDisplayName, string fdFormDetailName, Integer fdDisplayOrder,
                                                      string fdDataType, string fdFieldName,string fdFieldAPIName,
                                                      Boolean fdIsEditable, Boolean fdIsRequired,string fdDescription, 
                                                      String fdDefaultValue, string fdMinValue, string fdMaxValue, string fdItems, String fdComplex,
                                                      String fdDisplayTextValue
                                                      ){
        
        System.debug('form name -->>'+fdFormName+'Displayname--->>'+fdDisplayName);
        Form_Detail__c formDetailObj = new Form_Detail__c();
        formDetailObj.Form_Name__c=fdFormName;
        formDetailObj.Display_Name__c=fdDisplayName;
        formDetailObj.Name=fdFormDetailName;
        formDetailObj.Display_Order_number__c = fdDisplayOrder;
        formDetailObj.Data_Type__c=fdDataType;
        formDetailObj.Field_name__c=fdFieldName;
        formDetailObj.Field_API_Name__c=fdFieldAPIName;
        formDetailObj.Is_Editable__c=fdIsEditable;
        formDetailObj.Is_Required__c=fdIsRequired;
        formDetailObj.Description__c=fdDescription;
        formDetailObj.Complex__c=fdComplex;
        formDetailObj.Default_value__c=fdDefaultValue;
        formDetailObj.Min_Value__c=fdMinValue;
        formDetailObj.Max_Value__c=fdMaxValue;
        formDetailObj.OptionList__c=fdItems;
        formDetailObj.Display_Text__c=fdDisplayTextValue;
        System.debug('formDetailsObj -->>'+formDetailObj);
        upsert formDetailObj;
        return formDetailObj;
    }
    @AuraEnabled
    //get Form Fields
    public static List<Form_Detail__c> getFieldList(Id formId){
        List<Form_Detail__c> formFieldList = [SELECT Id, Form_Name__c, Field_name__c,Data_Type__c, 
        Display_Order_number__c FROM Form_Detail__c WHERE Form_Name__c = :formId ORDER BY Display_Order_number__c ASC];
        return formFieldList;
    }
    @AuraEnabled
    //update Form Fields order
    public static List<Form_Detail__c> updateFieldOrder(Id formId, List<Form_Detail__c> formFieldsList){
        system.debug('formId'+formId);
        system.debug('formFieldsList'+formFieldsList);
        Map<Id, Form_Detail__c> formFieldsMap = new Map<Id, Form_Detail__c>();
        for(Form_Detail__c formFieldIds :formFieldsList){
            formFieldsMap.put(formFieldIds.Id, formFieldIds);
        }
        List<Form_Detail__c> formFieldList = [SELECT Id, Display_Order_number__c,Form_Name__c FROM Form_Detail__c WHERE Id = :formFieldsMap.keySet() AND Form_Name__c = :formId];
        for(Form_Detail__c fieldorder :formFieldList){
            fieldorder.Display_Order_number__c = formFieldsMap.get(fieldorder.Id).Display_Order_number__c;
        }
        update formFieldList;
        return formFieldList;
        }

        @AuraEnabled
        //insert Custom Fields
        public static List<Form_Detail__c> saveCustomFields(Form_Detail__c formDetailRec,List<Form_Detail__c> customFieldList)
        {
            System.debug('customFieldList--->>'+ customFieldList);
            System.debug('formDetailRec--->>'+ formDetailRec);

            insert formDetailRec;

            List<Form_Detail__c> fdList = new List<Form_Detail__c>();
            for(Form_Detail__c formDetailRecord : customFieldList){
                Form_Detail__c formDetailObj = new Form_Detail__c();
                formDetailObj.Form_Name__c = formDetailRec.Form_Name__c;
                formDetailObj.Display_Name__c = formDetailRecord.Display_Name__c;
                formDetailObj.Name = formDetailRecord.Name;
                formDetailObj.Data_Type__c = formDetailRecord.Data_Type__c;
                formDetailObj.Field_name__c = formDetailRecord.Field_name__c;
                formDetailObj.Field_API_Name__c = formDetailRecord.Field_API_Name__c;
                formDetailObj.Is_Editable__c = formDetailRecord.Is_Editable__c;
                formDetailObj.Is_Required__c = formDetailRecord.Is_Required__c;
                formDetailObj.Description__c = formDetailRecord.Description__c;
                formDetailObj.Default_value__c = formDetailRecord.Default_value__c;
                formDetailObj.Min_Value__c = formDetailRecord.Min_Value__c;
                formDetailObj.Max_Value__c = formDetailRecord.Max_Value__c;
                formDetailObj.Parent_Field_Id__c = formDetailRec.Id;
                fdList.add(formDetailObj);
            }
            System.debug('fdList--->>'+fdList);
            insert fdList;
            return fdList;
    }
    }