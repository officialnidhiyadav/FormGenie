import { LightningElement, api, track } from 'lwc';
import StepTransaction_Object from '@salesforce/schema/Step_Transaction__c';
import saveStepTransactionRecord from '@salesforce/apex/stepTransaction.saveStepTransactionRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';


export default class StepTransaction extends NavigationMixin (LightningElement) {
    objectApiName = StepTransaction_Object;

    @api formnameStepTransn;
    @track stepTransactionName = '';
    @track parentStepId = '';
    @track parentStepName = '';
    @track parentNextStepId = '';
    @track parentNextStepName = '';
    @track transitionActionName = '';
    @track formFlowCondition = '';

    @track stepTransactionRecordId;
    @track errorMsg = '';

    valueHandleChange(event) {
        if (event.target.name == 'steptransactionname') {
            this.stepTransactionName = event.target.value;
        }
        if (event.target.name == 'stepname') {
            this.parentStepName = event.target.value;
        }
        if (event.target.name == 'nextStep') {
            this.parentNextStepName = event.target.value;
        }
        if (event.target.name == 'transitionactionname') {
            this.transitionActionName = event.target.value;
        }
        if (event.target.name == 'formflowcondition') {
            this.formFlowCondition = event.target.value;
        }
    }
    handleInsert(event) {
        console.log('formnameStepTransn--->>', this.formnameStepTransn);
        console.log('stepTransactionName--->>', this.stepTransactionName);
        console.log('parentStepId--->>', this.parentStepId);
        console.log('parentStepName--->>', this.parentStepName);
        console.log('parentNextStepId--->>', this.parentNextStepId);
        console.log('parentNextStepName--->>', this.parentNextStepName);
        console.log('transitionActionName--->>', this.transitionActionName);
        console.log('formFlowCondition--->>', this.formFlowCondition);
        saveStepTransactionRecord({
            stFormName: this.formnameStepTransn, stTransactionName: this.stepTransactionName, stParentStepId: this.parentStepId,
            stParentStepName: this.parentStepName, stParentNextStepId: this.parentNextStepId, stParentNextStepName: this.parentNextStepName,
            stTransitionActionName: this.transitionActionName, stFormFlowCondition: this.formFlowCondition
        })
            .then(result => {
                console.log('resultId----->>' + result.Id);

                this.stepTransactionRecordId = result.Id;
                const toastEvent = new ShowToastEvent({
                    title: 'Success!',
                    message: 'Record created successfully',
                    variant: 'success'
                });
                this.dispatchEvent(toastEvent);
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Failed!!',
                    message: 'Record Creation Unsuccessful!! Please Check The Required Fields',
                    variant: 'error'
                    
                }));
                //this.errorMsg = error.message;
                // window.console.log('this.error--->>',error);
                this.error = error.message;
            });

        this.template.querySelectorAll('lightning-input[data-id="resetDT"]').forEach(element => {
            element.value = null;
        });

        this.dataRefresh();

        const objstepChild = this.template.querySelector('c-custom-lookup-step-transaction');
        objstepChild.stepAndNextDataRefresh();

        /*const objnextstepChild = this.template.querySelector('c-custom-lookup-next-step');
        objnextstepChild.nextStepDataRefresh();*/
    }
    dataRefresh() {
        this.stepTransactionName = '';
        this.parentStepId = '';
        this.parentStepName = '';
        this.parentNextStepId = '';
        this.parentNextStepName = '';
        this.transitionActionName = '';
        this.formFlowCondition = '';
        this.errorMsg = '';
    }

    handleSelected(event) {
        this.parentStepId = event.detail.idOfStep;
        this.parentStepName = event.detail.nameOfStep;
    }
    handleNextSelected(event) {
        this.parentNextStepId = event.detail.idOfNextStep;
        this.parentNextStepName = event.detail.nameOfNextStep;
    }

    addCondition(event){
        event.preventDefault();
        let componentDef = {
            componentDef: "c:transitionRule",
            attributes: {
                toStepId: this.parentStepId
              }
            
        };
        // Encode the componentDefinition JS object to Base64 format to make it url addressable
        let encodedComponentDef = btoa(JSON.stringify(componentDef));
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/one/one.app#' + encodedComponentDef
            }
        });
    }

}