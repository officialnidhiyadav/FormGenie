public with sharing class manageFieldsList {
    //return Data
    @AuraEnabled(cacheable=true)
    public static List<Form_Detail__c> getFormFields(List<Id> formdetailidlist) {
        System.debug('formdetailidlist---->>'+ formdetailidlist);
        return [SELECT Id, Field_name__c, Data_Type__c, Form_Name__c FROM Form_Detail__c WHERE Form_Name__c IN :formdetailidlist 
                ORDER BY Field_name__c];
    }

    //Insert data
    @AuraEnabled
    public static Step_Field__c insertStepFields(Id sfManageFieldsStepId, Id sfManageFieldId, string sfStepFieldName){
        Step_Field__c stepFieldObj = new Step_Field__c();
        stepFieldObj.Form_Detail__c = sfManageFieldId;
        stepFieldObj.Step__c = sfManageFieldsStepId;
        stepFieldObj.Name = sfStepFieldName;
        insert stepFieldObj;
        return stepFieldObj;
    }

    /*@AuraEnabled( cacheable = true )  
    public static List<Form_Detail__c> searchFormFields( String searchKey ) {  
      
        String strKey = '%' + searchKey + '%';  
        return [ SELECT Id, Field_name__c, Data_Type__c, Form_Name__c FROM Form_Detail__c WHERE Field_name__c LIKE: strKey];  
          
    }*/ 
    @AuraEnabled
    public static void deleteFieldsDone(list<Id> fieldId){
        try {
            List<Form_Detail__c> lstFieldsToDelete = new List<Form_Detail__c>();
            System.debug('fieldId ====> '+fieldId);
            for(Id idField : fieldId) {
                lstFieldsToDelete.add(new Form_Detail__c(Id = idField));
            }
            if(!lstFieldsToDelete.isEmpty()) {
                delete lstFieldsToDelete;
            }
        }
        catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }
}