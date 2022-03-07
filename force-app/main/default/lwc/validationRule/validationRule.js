import { LightningElement, wire, track ,api} from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import saveValidationRule from '@salesforce/apex/validationRule.saveValidationRule';
import Logical_Op from '@salesforce/schema/Validation_Rule__c.Logical_Op__c';
import ValidationRule_Object from '@salesforce/schema/Validation_Rule__c';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';


export default class ValidationRule extends LightningElement {

    objectApiName = ValidationRule_Object;

   @track validationRuleObj = ValidationRule_Object;;
    @track logicalOpTest;
    @track logicalOp='';
    @track ageVal;
    @track pickListValues;
    @track validationRecoredId = '';
    @track validRulesName='';
    @track validationValue='';
    @track validationErrorText='';

  // @api fieldDetailId;
    @api formnamevalidation;
    @api formnamefrmdetail;

    @track selectedField = '';
    @track fieldDetailId='';

    @wire(getPicklistValues,{
        recordTypeId : '012000000000000AAA',       
        fieldApiName: Logical_Op
    })
        wiredPickListValue({ data, error}){
            if(data){
                console.log(`Picklist values are`, data.values);
                this.pickListValues = data.values;
                this.error= undefined;
            }
            if(error){
                console.log(`Error while fetching Picklist values ${error}`);
                this.error= error;
                this.pickListValues = undefined;
            }
        }
        handleLogicalOpChange(event){
            this.validationRuleObj.Logical_Op__c = event.detail.value;
            console.log('this.validationRuleObj.Logical_Op__c -->>',this.validationRuleObj.Logical_Op__c);
           // this.logicalOp = event.target.value;
            this.validationValue=this.selectedField+this.validationRuleObj.Logical_Op__c;
            
            window.console.log('StreamOpted ==> '+this.logicalOp);
            if(this.logicalOp=='||'){
                this.logicalOpTest='OR';
            }
            if(this.logicalOp=='&&'){
                this.logicalOpTest='AND';
            }
           
        }

        handleAgeOnChange(event){
            this.ageVal = event.target.value;
            if(this.ageVal<=18){
                this.logicalOpTest='<';
                this.logicalOp=this.logicalOpTest;
            }
            else if(this.ageVal>=18){
                this.logicalOpTest='>';
                this.logicalOp=this.logicalOpTest;
            }

            
            
        }
        //get ValidationRule FormName
        valueHandleChange(event){
            /*if (event.target.name == 'formDetailFN') {
                this.formnamefrmdetail = event.target.value;
               // alert('--'+this.qwerty);
                window.console.log('formnamefrmdetail ==> ' + this.formnamefrmdetail);
            }*/
            if (event.target.name == 'validationrulesname') {
                this.validRulesName = event.target.value;
               // alert('--'+this.qwerty);
                window.console.log('formnamefrmdetail ==> ' + this.formnamefrmdetail);
            }
           /* if(event.target.name='fieldDetailId'){
                this.fieldDetailId=event.target.value;
                //alert('--'+this.fieldDetailId);
            }*/
            if(event.target.name=='validvalue'){
                //let onChangevalidationValue = 
                this.validationValue=event.target.value;
                //alert('--'+this.fieldDetailId);
            }
            if(event.target.name=='errorText'){
                //let onChangevalidationValue = 
                this.validationErrorText=event.target.value;
                //alert('--'+this.fieldDetailId);
            }
        }
       /* //get ValidationRule FormDeatilId
        valueHandleChange(event){
            if(event.target.name='fieldDetailId'){
                this.fieldDetailId=event.target.value;
                //alert('--'+this.fieldDetailId);
            }
        }*/
        //CustomlookValidation event
        /*handleSelected(event){
            this.formnamevalidation=event.detail;

        }*/
        //InsertValidationRecord
        handleSave(event){
            console.log('formnamevalidation--->>', this.formnamevalidation);
            console.log('fieldDetailId--->>', this.fieldDetailId);
            console.log('validRulesName--->>', this.validRulesName);
            console.log('logicalOp--->>', this.logicalOp);
            console.log('validationValue--->>', this.validationValue);
            console.log('validationErrorText--->>', this.validationErrorText);

            saveValidationRule({
              
                vRFormName:this.formnamevalidation,
                vRFieldDetailid:this.fieldDetailId,
                vRName:this.validRulesName,
                VRLogicalOp:this.logicalOp,
                vRValue:this.validationValue,
                vRErrorText:this.validationErrorText
                
            })
            .then(result=>{
                console.log('resultId----->'+result.Id);
                this.validationRecoredId=result.Id;
                const toastEvent=new ShowToastEvent({
                      title:'Success!!',
                      message:'Record Created Successfully',
                      variant:'success'

                });
                this.dispatchEvent(toastEvent);

            })
            .catch(error=>{
                this.dispatchEvent( new ShowToastEvent({
                    title:'Failed!!',
                    message:'Record Creation Unsuccessful!!',
                    variant:'error'
                }));
                this.error=error.message;

            });

        }

        handleSelected(event){
    this.selectedField = event.detail.nameOfFiled;
    this.fieldDetailId = event.detail.idOfField;
    this.validationValue=this.selectedField+this.logicalOp;
    
        }
}