public with sharing class stepTransaction {
//get Step Transaction List ORDER BY CreatedDate DESC
    @AuraEnabled(cacheable=true)
    public static List<Step_Transaction__c> getStepTransactionList(Id stepTransnList){
return [SELECT Id, Name, Step_Name__c, Next_Step__c,Form_Name__c FROM Step_Transaction__c WHERE Form_Name__c = :stepTransnList];
}
//custom lookup for Step
@AuraEnabled(cacheable=true)
            public static List<Step__c> getSteps(Id stepFormName, String stpName){
                System.debug('stepFormName-->>'+ stepFormName);
                List<Step__c> stepList = new List<Step__c>();
                if(stpName!=''){
                    String stepName = '%' + stpName + '%';
                    stepList = [SELECT id, Name,Step_Title__c, Form_Name__c FROM Step__c WHERE Form_Name__c =: stepFormName AND Name LIKE:stepName];
                    return stepList;  
                }
                return stepList;
    }
//insert
    @AuraEnabled
    public static Step_Transaction__c saveStepTransactionRecord(Id stFormName,string stTransactionName, Id stParentStepId, 
                                                                string stParentStepName, Id stParentNextStepId, string stParentNextStepName,
                                                                string stTransitionActionName, string stFormFlowCondition){
        Step_Transaction__c stepTransObj = new Step_Transaction__c();
        stepTransObj.Form_Name__c=stFormName;
        stepTransObj.Name=stTransactionName;
        stepTransObj.Step__c=stParentStepId;
        stepTransObj.Step_Name__c=stParentStepName;
        stepTransObj.Next_StepLookUp__c=stParentNextStepId;
        stepTransObj.Next_Step__c=stParentNextStepName;
        stepTransObj.Transition_Action_Name__c=stTransitionActionName;
        stepTransObj.Form_Flow_Condition__c=stFormFlowCondition;
        insert stepTransObj;
        return stepTransObj;
    }
}
