public with sharing class step {
    @AuraEnabled
    //insert
    public static Step__c saveStepRecord(string pageStepTitle, string pageStepName, Id pageFormName, 
                                         string pageTransitionActionName, Boolean pageEnableProgressbar,
                                         Boolean pageIsFirstStep
                                                      ){
        Step__c stepObj = new Step__c();
        stepObj.Step_Title__c=pageStepTitle;
        stepObj.Name=pageStepName;
        stepObj.Form_Name__c=pageFormName;
        stepObj.Transition_Action_Name__c=pageTransitionActionName;
        stepObj.Enable_Progressbar__c=pageEnableProgressbar;
        stepObj.IsFirstStep__c=pageIsFirstStep;
        insert stepObj;
        return stepObj;
    }
    @AuraEnabled
    //get Step List for Details
    public static List<Step__c> getStepDetailsList(Id formIdStepDetails){
    List<Step__c> stepList = [SELECT Id, Name, Step_Title__c, Form_Name__c FROM Step__c WHERE Form_Name__c = :formIdStepDetails];
    return stepList;                                            
  }
     @AuraEnabled(cacheable=true)
    
    public static list<Step_Field__c> getstepfieldInfo(Id stepid)
    {
          System.debug('stepid==========>'+stepid);
        list<Step_Field__c> stepfieldlist=[select Id,Name,Step__c,Form_Detail__c from Step_Field__c where Step__c=:stepid AND Form_Detail__c !=null ];
       System.debug('stepfieldlist==========>'+stepfieldlist);
             return stepfieldlist;
    }
      @AuraEnabled(cacheable=true)
      public static list<Step_Transaction__c> getsteptransition(Id stepid,Id formid)
    {
          System.debug('stepid==========>'+stepid);
        list<Step_Transaction__c> steptransition=[select Id,Name,Form_Name__c, Step__c from Step_Transaction__c where Step__c=:stepid AND Form_Name__c=:formid ];
       System.debug('steptransition==========>'+steptransition);
             return steptransition;
    }
}