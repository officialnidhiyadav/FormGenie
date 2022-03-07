import { LightningElement, wire, track, api } from 'lwc';
import getStepTransactionList from '@salesforce/apex/stepTransaction.getStepTransactionList';
import { NavigationMixin } from 'lightning/navigation';

const columns = [
    { label: 'Step Transaction Name', fieldName: 'Name', editable: true },
    { label: 'First Step', fieldName: 'Step_Name__c', editable: true },
    { label: 'Next Step', fieldName: 'Next_Step__c', editable: true }
];

export default class StepTransactionList extends NavigationMixin (LightningElement) {
    columns = columns;

    @api formNameStepTransnList;
    @track stepTransactionResult;
    @track stepTransactionData;
    @track error;

    @wire(getStepTransactionList, { stepTransnList: '$formNameStepTransnList' })
    stepTransactionName(result) {
        this.stepTransactionResult = result;
        if (result.data) {
            this.stepTransactionData = result.data;
            console.log('stepTransactionData data----->>' + this.stepTransactionData);
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.stepTransactionData = undefined;
            console.log('what is error-->>' + JSON.stringify(this.error));
        }
    }
    handleAdd(event){
        event.preventDefault();
        let componentDef = {
            componentDef: "c:stepTransaction",
            attributes: {
                formnameStepTransn: this.formNameStepTransnList
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