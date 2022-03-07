import { LightningElement, track, api } from 'lwc';
import TransitionRule_Object from '@salesforce/schema/Transition_Rule__c';

export default class TransitionRule extends LightningElement {
    objectApiName = TransitionRule_Object;
    
    @api toStepId;
    @track operatorSelected='';
    @track optionsValue;
    @api stepTransactionId;
    

    get operatorsOptions() {
        return [
            { label: '= Equal', value: '=' },
            { label: '<> Not Equal', value: '<>' },
            { label: '< Less Than', value: '<' },
            { label: '> Greater Than', value: '>' },
            { label: '<= Less Than or Equal', value: '< =' },
            { label: '>= greater Than or Equal', value: '>=' }
        ];
    }

    valueHandleChange(event) {
        /*if (event.target.name == 'stepfields') {
            this.stepFiledSelected = event.target.value;
            window.console.log('this.stepFiledSelected--->> ' + this.stepFiledSelected);
        }*/
        if (event.target.name == 'selectedOperator') {
            this.operatorSelected = event.target.value;
            window.console.log('this.operatorSelected--->> ' + this.operatorSelected);
            console.log('toStepId-->>',this.toStepId)
        }
        if (event.target.name == 'valuename') {
            this.optionsValue = event.target.value;
            window.console.log('this.optionsValue--->> ' + this.optionsValue);
        }
        if (event.target.name == 'steptransactionid') {
            this.stepTransactionId = event.target.value;
            window.console.log('this.stepTransactionId--->> ' + this.stepTransactionId);
        }
    }
    handleSelected(event){
        console.log(event.detail);
        this.selectedAccountId = event.detail;
    }
    addMore(){
        console.log('operatorSelected-->>',this.operatorSelected);

    }
}