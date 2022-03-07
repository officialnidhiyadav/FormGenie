import { LightningElement, wire, api, track } from 'lwc';
import getStepList from '@salesforce/apex/stepList.getStepList';
import getStepDetailsList from '@salesforce/apex/step.getStepDetailsList';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

import getFormFields from '@salesforce/apex/manageFieldsList.getFormFields';
import insertStepFields from '@salesforce/apex/manageFieldsList.insertStepFields';
import deleteFieldsDone from '@salesforce/apex/manageFieldsList.deleteFieldsDone';
import stepList1 from './templates/stepList1.html';
import manageFieldsList from './templates/manageFieldsList.html';

import { NavigationMixin } from 'lightning/navigation';


//stepList disabled: false disabled: { fieldName: 'disableButton'}
const columns = [
    { label: 'Step Title', fieldName: 'Step_Title__c', editable: true },
    { label: 'Step Name', fieldName: 'Name', editable: true },
    {
        label: 'Manage Fields For Step', fieldName: 'click', type: "button", typeAttributes: {
            label: 'Manage Fields', name: 'manageFields', title: 'Manage Fields', disabled: { fieldName: 'typeButton_disabled' },
            value: 'managefields', iconPosition: 'left'
        }
    }
    //, onclick:{manageField}
];

//manageFieldsList
const columns1 = [
    { label: 'Field Name', fieldName: 'Field_name__c', editable: true },
    { label: 'Data Type', fieldName: 'Data_Type__c', editable: true },
]

export default class StepList extends NavigationMixin (LightningElement) {
    /** Tracks which screen the wizard is on */
    @track pageNumber = 1;

    //stepList
    columns = columns
    draftValues = []
    @api formnamesteplist;
    @api publicCallWireStepList;
    @api frmDetailIdList;
    @track stepResult;
    @track stepDetails;
    @track error;
    @track stepId;
    @track managestepId;
    @track firstStepId='';

    deselectRecords = [];

    @wire(getStepList, { steplist: '$formnamesteplist' })
    stepDetailNme(result) {
        this.stepResult = result;
        if (result.data) {
            this.stepDetails = result.data;
            console.log('formDetails data----->>' + this.stepDetails);
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.stepDetails = undefined;
            console.log('what is error-->>' + JSON.stringify(this.error));
        }
    }

    handleSave(event) {
        console.log(event.detail.draftValues);
        const recordInputs = event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft)
            return { fields }
        })
        console.log("recordInputs", recordInputs)

        const promises = recordInputs.map(recordInput => updateRecord(recordInput))
        Promise.all(promises).then(result => {
            this.showToastMsg('success', 'Field updated')
            this.draftValues = []
            console.log('stepDetailNme object-->>', this.stepDetailNme);
            // return refreshApex(this.stepDetailNme);
            return refreshApex(this.stepResult);
        }).catch(error => {
            this.showToastMsg('Error creating record', error.body.message, error)
        })

    }
    showToastMsg(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant || 'success'
            })
        )
    }

    handleRowAction(event) {
        console.log('before--->>', event.detail.action.name);
        const actionName = event.detail.action.name;
        this.stepId = event.detail.row.Id;
        /*if(event.detail.row.Id === this.stepId ){
            event.detail.action.disabled = true;
        }*/
        console.log('this.stepId row-->>', this.stepId);
        console.log('actionName----->>', actionName);
        console.log('formnamesteplist--->>',this.formnamesteplist);
        if (actionName === 'manageFields') {
            this.pageNumber++;
            this._pushState();
        }
    }

   handleManageSelection(event) {
        var manageSelectedRows = event.detail.selectedRows;
        var manageel = this.template.querySelector('lightning-datatable');
        console.log('manageSelectedRows type--->>', typeof manageSelectedRows);
        console.log('manageSelectedRows 11111--->>', JSON.stringify(manageSelectedRows));

        let fieldSelectedIds = new Set();
        if(manageSelectedRows.length===1){
            let objValues = Object.values(manageSelectedRows);
            console.log('objValues--->>>',objValues);

            fieldSelectedIds.add(objValues[0].Id);
            this.deselectRecords = Array.from(fieldSelectedIds);

            this.manageFieldId=objValues[0].Id;
            this.stepFieldName = String(objValues[0].Field_name__c);
        }

        if(manageSelectedRows.length>1)
        {
            var manageel = this.template.querySelector('lightning-datatable');
            var deselectedRowsLength = manageSelectedRows;
            manageSelectedRows=manageel.selectedRows=manageel.selectedRows.slice(1);
            let objValues = Object.values(deselectedRowsLength);

            fieldSelectedIds.add(objValues[1].Id);
            this.selectedRecords = Array.from(fieldSelectedIds);

            console.log('objValues length>1--->>>',objValues);
            this.manageFieldId=objValues[1].Id;
            this.stepFieldName = String(objValues[1].Field_name__c);
            event.preventDefault();
            return;
        }



        /*if (you want to disable the button for this row) {
            data[i].typeButton_disabled = true;
        }
        else {
            data[i].typeButton_disabled = false;
        }*/

    }

    /* refresStepList() {
         return refreshApex(this.stepResult);
     } */

     singleManageFields(){
        this.pageNumber++;
        this._pushState();
     }

     stepTransactionListEvent(event){
        event.preventDefault();
        let componentDef = {
            componentDef: "c:stepTransactionList",
            attributes: {
                formNameStepTransnList: this.formnamesteplist
                //firstStepStepTransaction: 
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



    //manageFieldsList
    columns1 = columns1;
    @api manageFieldsListVar;
    @api manageFieldsStepId;
    @track formDetailNmeResult;
    @track manageFieldDetails = '';
    @track searchFields;
    @track error;
    @track errorMsg;
    @track manageFieldId = '';
    @track stepFieldName = '';
    @track buttonLabel = 'Delete Selected Field';
    @track isTrue = false;

    selectedRecords = [];

    @wire(getFormFields, { formdetailidlist: '$formnamesteplist' })
    formDetailNme(result) {
        this.formDetailNmeResult = result;
        if (result.data) {
            this.manageFieldDetails = result.data;
            console.log('manageFieldDetails data----->>' + this.manageFieldDetails);
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.manageFieldDetails = undefined;
            console.log('what is error-->>' + JSON.stringify(this.error));
        }
    }

    /*handleRowAction(event){
         this.manageFieldId = event.detail.row.Id;
         this.stepFieldName = event.detail.row.Field_name__c;
     }*/

    handleRowSelection = event => {
        var selectedRows = event.detail.selectedRows;
        console.log('selectedRows type--->>', typeof selectedRows);
        console.log('selectedRows 11111--->>', JSON.stringify(selectedRows));
        // this set elements the duplicates if any

        let fieldDeleteIds = new Set();

        if (selectedRows.length === 1) {
            let objValues = Object.values(selectedRows);
            console.log('objValues--->>>', objValues);

            fieldDeleteIds.add(objValues[0].Id);
            this.selectedRecords = Array.from(fieldDeleteIds);

            this.manageFieldId = objValues[0].Id;
            this.stepFieldName = String(objValues[0].Field_name__c);
        }
        if (selectedRows.length > 1) {
            var el = this.template.querySelector('lightning-datatable');
            console.log('el--->>', JSON.stringify(el));
            console.log('selectedRows slice length>1--->>>', JSON.stringify(selectedRows));
            var selectedRowsLength = selectedRows;
            selectedRows = el.selectedRows = el.selectedRows.slice(1);
            //selectedRows=el.selectedRows.slice(1);
            console.log('selectedRowsLength slice2--->>>', selectedRowsLength);
            let objValues = Object.values(selectedRowsLength);

            fieldDeleteIds.add(objValues[1].Id);
            this.selectedRecords = Array.from(fieldDeleteIds);

            console.log('objValues length>1--->>>', objValues);
            this.manageFieldId = objValues[1].Id;
            this.stepFieldName = String(objValues[1].Field_name__c);
            event.preventDefault();
            return;
        }
    }
    addFields() {
        console.log('this.manageFieldsStepId--->>', this.manageFieldsStepId);
        console.log('this.manageFieldId--->>', this.manageFieldId);
        console.log('this.stepFieldName --->>', this.stepFieldName);
        console.log('typeof stepFieldName---->>', typeof stepFieldName);
        console.log('manageFieldsListVar---->>', this.manageFieldsListVar);

        insertStepFields({
            sfManageFieldsStepId: this.stepId, sfManageFieldId: this.manageFieldId,
            sfStepFieldName: this.stepFieldName
        })
            .then(result => {
                this.stepFieldRecoreId = result.Id;
                window.console.log('stepFieldRecoreId-->> ' + this.stepFieldRecoreId);
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
    }

    deleteFieldRecord() {
        if (this.selectedRecords) {
            // setting values to reactive variables
            this.buttonLabel = 'Processing....';
            this.isTrue = true;

            // calling apex class to delete selected records.
            this.deleteFields();
        }
    }
    deleteFields() {
        console.log('this.selectedRecords', this.selectedRecords);
        deleteFieldsDone({ fieldId: this.selectedRecords })
            .then(result => {
                window.console.log('result ====> ' + result);

                this.buttonLabel = 'Delete Selected Field';
                this.isTrue = false;

                // showing success message
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success!!',
                        message: ' Field is deleted.',
                        variant: 'success'
                    }),
                );

                // Clearing selected row indexs 
                this.template.querySelector('lightning-datatable').selectedRows = [];

                // refreshing table data using refresh apex
                return refreshApex(this.formDetailNmeResult);

            })
            .catch(error => {
                window.console.log(error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error while getting Field',
                        message: error.message,
                        variant: 'error'
                    }),
                );
            });
    }
    goBackToStep(event) {
        this.pageNumber--;
        this._pushState();
    }











    //History
    render() {
        switch (this.pageNumber) {
            case 1: return stepList1;
            case 2: return manageFieldsList;
            default: throw new Error();
        }
    }

    /**
     * Lifecycle hook to initialize the component
     */
    connectedCallback() {
        this._setOnPopStateHandler();
        this._syncInitialState();
        if(this.publicCallWireStepList=== true){
            this.callApexforDatatable();
        }
    }

    callApexforDatatable(event){
        getStepDetailsList({formIdStepDetails : this.formnamesteplist})
      .then(result => {
        console.log('result-->>',result);
        this.frmDetailIdList = result;
      })
      .catch(error => {
        this.errorMsg = error.message;
        window.console.log(this.error);
      });
    }
    /**
     * Sets a handler to handle browser Back and Forward button clicks, and
     * other browser navigation events. 
     */
    _setOnPopStateHandler() {
        window.onpopstate = (ev) => {

            // get the state for the history entry the user is going to be on
            const state = ev.state;

            if (state && state.pageNumber) {
                this.pageNumber = state.pageNumber;
            }
        };
    }

    /**
     * Responsible for syncing the `history.state` object with the wizard upon
     * page load.
     * 
     * Handles two situation:
     *   1. A `history.state` object exists with a page number, in which case
     *      that page number is used
     * 
     *   2. A `history.state` object does not exist or it exists but does not
     *      contain the page number. In this case `history.state` is replaced
     *      with a state object containing `state.pageNumber = 1`.
     */
    _syncInitialState() {
        if (history.state && history.state.pageNumber) {
            this.pageNumber = history.state.pageNumber;
        } else {
            this._replaceState();
        }
    }

    /**
     * Pushes the state of the component (the page number) as an entry to the 
     * browser's history.
     */
    _pushState() {

        /* The Lightning platform or other components may also be 
           using the state object. A copy is created so no existing data 
           is lost  */
        const state = Object.assign({}, history.state);

        state.pageNumber = this.pageNumber;
        history.pushState(state, '');
    }

    /**
     * Replaces the current history entry with an entry containing the
     * component's current state (the page number).
     */
    _replaceState() {

        /* The Lightning platform or other components may also be 
           using the state object. A copy is created so no existing data 
           is lost  */
        const state = Object.assign({}, history.state);

        state.pageNumber = this.pageNumber;
        history.replaceState(state, '');
    }

}