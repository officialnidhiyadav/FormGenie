import { LightningElement, api, track } from 'lwc';
import Step_Object from '@salesforce/schema/Step__c';
import saveStepRecord from '@salesforce/apex/step.saveStepRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Step extends LightningElement {
    objectApiName = Step_Object;
    @api formnamefrmdetailStep;
    @track stepTitle = '';
    @track stepName = '';
    @track formName = '';
    @track transitionActionName = '';
    @track isFirstStep = '';

    @track steprecoredid = '';
    @track errorMsg = '';
    @track frmdetailidlist = [];
    @track enableProgressbar = '';

    valueHandleChange(event) {
        if (event.target.name == 'steptitle') {
            this.stepTitle = event.target.value;
            window.console.log(typeof this.stepTitle);
            window.console.log('value of>>>>>>' + this.stepTitle);
            let stringStepName = event.target.value;
            this.stepName = stringStepName.replace(/ /g, "_") + "__c";
            window.console.log(typeof this.stepName);
            window.console.log('value of>>>>>>' + this.stepName);
        }
        if (event.target.name == 'transitionactionname') {
            this.transitionActionName = event.target.value;
        }
        if (event.target.name == 'progressbar') {
            this.enableProgressbar = event.target.checked;
            console.log('enableProgressbar  --->>' + this.enableProgressbar);
        }
        if (event.target.name == 'isfirststep') {
            this.isFirstStep = event.target.checked;
            console.log('isFirstStep  --->>' + this.isFirstStep);
        }

    }

    handleInsert() {
        console.log('stepTitle  --->>' + this.stepTitle);
        console.log('stepName type --->>' + this.stepName);
        console.log('formnamefrmdetailStep --->>' + this.formnamefrmdetailStep);
        console.log('transitionActionName --->>' + this.transitionActionName);
        console.log('enableProgressbar --->>' + this.enableProgressbar);
        saveStepRecord({
            pageStepTitle: this.stepTitle, pageStepName: this.stepName, pageFormName: this.formnamefrmdetailStep,
            pageTransitionActionName: this.transitionActionName, 
            pageEnableProgressbar: this.enableProgressbar, pageIsFirstStep: this.isFirstStep
        })
            .then(result => {
                console.log('resultId----->>' + result.Id);
                this.steprecoredid = result.Id;
                window.console.log('steprecoredid----->> ' + JSON.stringify(this.steprecoredid));
                this.frmdetailidlist.push({ 'Id': result.Id, 'Step_Title__c': result.Step_Title__c, 'Name': result.Name });
                this.frmdetailidlist = [...this.frmdetailidlist];
                console.log('frmdetailidlist ---->>>>' + JSON.stringify(this.frmdetailidlist));
                // console.log('frmdetailidlist ---->>>>'+ this.frmdetailidlist);
                // this.frmdetailidlist.push(this.formdetailrecoredid);
                // console.log('frmdetailidlist ---->>>>'+ this.frmdetailidlist);
                const toastEvent = new ShowToastEvent({
                    title: 'Success!',
                    message: 'Record created successfully',
                    variant: 'success'
                });
                this.dispatchEvent(toastEvent);
            })
            .catch(error => {
                this.errorMsg = error.message;
                window.console.log(this.error);
            });
        this.template.querySelectorAll('ightning-input[data-id="resetDT"]').forEach(element => {
            element.value = null;
        });
        this.template.querySelectorAll('lightning-input[data-id="resetDT"]').forEach(element => {
            if (element.type === 'checkbox' || element.type === 'checkbox-button') {
                element.checked = false;
            } else {
                element.value = null;
            }
        });

        this.dataRefresh();
        //window.location.reload();
    }
    dataRefresh() {
        this.stepTitle = '';
        this.stepName = '';
        this.transitionActionName = '';
        this.enableProgressbar = '';
        this.isFirstStep= '';
    }
}