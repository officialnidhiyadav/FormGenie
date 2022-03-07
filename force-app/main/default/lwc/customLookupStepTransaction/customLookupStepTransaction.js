import { LightningElement, wire, track, api } from 'lwc';
import getSteps from '@salesforce/apex/stepTransaction.getSteps';

export default class CustomLookupStepTransaction extends LightningElement {
    // step
    @track stepName = '';
    @track stepFieldsList = [];
    @track stepFieldsListCopy = [];
    @track newStepFieldsList;
    @track copyNewStepFieldsList;
    @track stepId = '';
    @api stepFrmNme;
    @track messageResult = false;
    @track isShowResult = true;
    @track showSearchedValues = false;
    @track stepTitle = '';

    // next
    @track nextStepName = '';
    @track nextMessageResult = false;
    @track isNextShowResult = true;
    @track showNextSearchedValues = false;
    @track displayNextStepFiledsList = [];
    @track nextStepId = '';
    @track nextStepTitle = '';

   // step

    @wire(getSteps, { stepFormName: '$stepFrmNme', stpName: '$stepName' })
    retrieveSteps({ error, data }) {
        this.messageResult = false;
        if (data) {
            /*console.log('data value-->>', data);
            this.stepTitle = data[0].Step_Title__c;
            console.log('this.stepTitle--->>', this.stepTitle);*/
            // TODO: Error handling 
            console.log('data::' + data.length);
            console.log('this.stepId-->>', this.stepId);
            if (this.stepId != '') {
                let stepIdCopy = this.stepId;
                this.newStepFieldsList = this.stepFieldsListCopy.filter(function (currentItem, index, array) {
                    console.log('currentItem-->>', currentItem.Id);
                    console.log('stepIdCopy-->>', stepIdCopy);
                    return (currentItem.Id != stepIdCopy)
                })
                console.log('newStepFieldsList::' + JSON.stringify(this.newStepFieldsList));
                this.copyNewStepFieldsList = [...this.newStepFieldsList];
                console.log('this.copyNewStepFieldsList-->>', JSON.stringify(this.copyNewStepFieldsList));
            }

            var stepValues = { idOfStep: this.stepId, nameOfStep: this.stepTitle};
            const selectedEvent = new CustomEvent('selected', { detail: stepValues });
            // Dispatches the event.
            this.dispatchEvent(selectedEvent);

            if (data.length > 0 && this.isShowResult) {
                this.stepFieldsList = data;
                this.stepFieldsListCopy = [...this.stepFieldsList];
                console.log('this.stepFieldsList-->>', JSON.stringify(this.stepFieldsList), typeof this.stepFieldsList);
                console.log('this.stepFieldsListCopy-->>', JSON.stringify(this.stepFieldsListCopy), typeof this.stepFieldsListCopy);
                //let stepIdCopy = this.stepId; 
                //console.log('stepIdCopy-->>', stepIdCopy);
                this.showSearchedValues = true;
                this.messageResult = false;
            }
            else if (data.length == 0) {
                this.stepFieldsList = [];
                this.stepFieldsListCopy = [];
                this.showSearchedValues = false;
                if (this.stepName != '')
                    this.messageResult = true;
            }

        } else if (error) {
            // TODO: Data handling
            this.stepId = '';
            this.stepName = '';
            this.stepTitle = '';
            this.stepFieldsList = [];
            this.stepFieldsListCopy = [];
            this.showSearchedValues = false;
            this.messageResult = true;
        }
    }
    handleClick(event) {
        this.isShowResult = true;
        this.messageResult = false;
    }

    handleKeyChange(event) {
        this.messageResult = false;
        this.stepName = event.target.value;
    }

    handleParentSelection(event) {
        this.showSearchedValues = false;
        this.isShowResult = false;
        this.messageResult = false;
        //Set the parent calendar id
        this.stepId = event.target.dataset.value;
        //Set the parent calendar label
        this.stepName = event.target.dataset.label;
        this.stepTitle = event.target.dataset.title;
        console.log('stepId::' + this.stepId + typeof this.stepId);
        console.log('check-->>');
        // this.copyNewStepFieldsList = [...this.newStepFieldsList];
        // console.log('copyNewStepFieldsList::'+JSON.stringify(this.copyNewStepFieldsList));   
    }
    @api
    stepAndNextDataRefresh() {
        this.stepName = '';
        this.stepTitle = '';
        this.nextStepName='';
        this.nextStepTitle='';
    }

    //**********  next step ******************

    handleNextClick(event) {
        this.isNextShowResult = true;
        this.nextMessageResult = false;
    }

    handleNextKeyChange(event) {
        this.nextMessageResult = false;
        this.nextStepName = event.target.value;
        this.onNextChange();
    }
    onNextChange() {
        this.nextMessageResult = false;
        if (this.copyNewStepFieldsList) {
            // TODO: Error handling 
            console.log('copyNewStepFieldsList::' + this.copyNewStepFieldsList.length);
            if (this.copyNewStepFieldsList.length > 0 && this.isNextShowResult) {
                this.displayNextStepFiledsList = [...this.copyNewStepFieldsList];
                this.showNextSearchedValues = true;
                this.nextMessageResult = false;
            }
            else if (this.copyNewStepFieldsList.length == 0) {
                this.displayNextStepFiledsList = [];
                this.showNextSearchedValues = false;
                if (this.nextStepName != '')
                    this.nextMessageResult = true;
            }

        } else if (error) {
            // TODO: Data handling
            this.nextStepId = '';
            this.nextStepName = '';
            this.nextStepTitle='';
            this.displayNextStepFiledsList = [];
            this.showNextSearchedValues = false;
            this.nextMessageResult = true;
        }

    }

    handleNextParentSelection(event) {
        this.showNextSearchedValues = false;
        this.isNextShowResult = false;
        this.nextMessageResult = false;
        //Set the parent calendar id
        this.nextStepId = event.target.dataset.value;
        //Set the parent calendar label
        this.nextStepName = event.target.dataset.label;
        this.nextStepTitle = event.target.dataset.title;
        console.log('nextStepId::' + this.nextStepId + typeof this.nextStepId);
        console.log('check-->>');
        var nextStepValues = { idOfNextStep: this.nextStepId, nameOfNextStep: this.nextStepTitle};
        const nextSelectedEvent = new CustomEvent('nextselected', { detail: nextStepValues });
        // Dispatches the event.
        this.dispatchEvent(nextSelectedEvent);
   
    }
}


