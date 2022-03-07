public with sharing class validationRule {
    //customLookup ValidationRule

   @AuraEnabled(cacheable=true)
   //, String validFromFieldName
   public static List<Form_Detail__c> getValidationFields(Id validFormName){
       System.debug('validFormName---->>>'+validFormName);
       List<Form_Detail__c> vRList = new List<Form_Detail__c>();
       //if(validFromFieldName!=''){
       //String ValidField ='%' + validFromFieldName + '%';
       vRList= [SELECT Id, Name, Field_name__c, Form_Name__c FROM Form_Detail__c Where Form_Name__c =:validFormName];
       return vRList;
    // AND Field_name__c LIKE:ValidField   
   // }
  // return vRList;
}

//get ValidationRule
    @AuraEnabled(cacheable=true)
    public static List<Validation_Rule__c> getValidationRule(List<id> validationList)
   {
       System.debug('validationList---->'+validationList);
        return[select id,Name,Error_Text__c,Field_Detail_Id__c,Form_Name__c,Logical_Op__c,Value__c from Validation_Rule__c order by Name desc];

 }
   @AuraEnabled
  //Insert ValidationRule
   public static Validation_Rule__c  saveValidationRule( string vRName,string vRErrorText,id vRFieldDetailid,id vRFormName,string vRLogicalOp,string vRValue)
   {
    //Validation_Rule__c  validationRuleObj;
       //List<Form__c> vRF=new List<Form__c>();
       //for(Form__c VRid:vRF)
       //{};
        Validation_Rule__c validationRuleObj=new Validation_Rule__c();
       validationRuleObj.Name=vRName;
       validationRuleObj.Error_Text__c=vRErrorText;
       validationRuleObj.Form_Name__c=vRFormName;
       validationRuleObj.Field_Detail_Id__c=vRFieldDetailid;  
       validationRuleObj.Logical_Op__c=vRLogicalOp;
       validationRuleObj.Value__c=vRValue;
       insert validationRuleObj;      
     return validationRuleObj;
   }
}