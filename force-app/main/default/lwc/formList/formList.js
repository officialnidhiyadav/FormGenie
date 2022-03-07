import { LightningElement, track, wire, api } from 'lwc';
import getForms from '@salesforce/apex/form.getForms';
import { getRecord } from 'lightning/uiRecordApi';
import Title__c from '@salesforce/schema/Form__c.Title__c';
import Name from '@salesforce/schema/Form__c.Name';
import Active__c from '@salesforce/schema/Form__c.Active__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'Title', fieldName: Title__c.fieldApiName, type: 'text' },
    { label: 'Form Name', fieldName: Name.fieldApiName, type: 'text' },
    { label: 'Active', fieldName: Active__c.fieldApiName, type: 'text' },
    { type: "button-icon", label: 'Edit Form', typeAttributes: { name: "edit", value: "edit", iconName: "utility:edit" } },
    { type: "button-icon", label: 'Delete Form', typeAttributes: { name: "delete", value: "delete", iconName: "utility:delete" } },
    {
        type: "button", label: 'Details Of Form', fieldName: 'click', typeAttributes: {
            label: 'Details',
            name: 'detailsform', title: 'Details Of Form', disabled: false, value: 'detailsFrom',
            iconPosition: 'left'
        }
    }
];

export default class FormList extends NavigationMixin(LightningElement) {
    @track data;
    @track error;
    @track columns = columns;

    @api recordId;
    //@wire(getRecords,{recordsId: '$recordsId', fields:[Name]})
    wiredDataResult;
    @wire(getForms)
    formRecords({ error, data }) {
        this.wiredDataResult = data;
        if (data) {
            this.data = data;
        }
        else if (error) {
            this.data = undefined;
        }
        refreshApex(this.wiredDataResult);
    }

    renderedCallback() {
        getForms()
            .then(result => {
                this.data = result;
            })
            .catch(error => {
                this.error = error;
            });
        refreshApex(this.data);
    }

    /*
    handleClick(event) {
        event.preventDefault();
        let componentDef = {
            componentDef: "c:form",
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
    */

    handleClick() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Form_Page'
            }
        });
    }
    handleRowAction(event) {
        try {
            const actionName = event.detail.action.name;
            const recId = event.detail.row.Id;
            /* switch ( actionName ) {
                 case 'view':
                     this[NavigationMixin.Navigate]({
                         type: 'standard__recordPage',
                         attributes: {
                             recordId: row.Id,
                             actionName: 'view'
                         }
                     });
                     break;*/
            if (actionName === "edit") {
                this[NavigationMixin.Navigate]({
                    type: "standard__recordPage",
                    attributes: {
                        recordId: recId,
                        componentDef: "c:form",
                        actionName: "edit"
                    }
                });
            }
            else if (actionName === "delete") {
                this.recordId = recId;
                //window.console.log('recordId# ' + this.recordId);
                deleteRecord(this.recordId)
                    .then(() => {
                        const toastEvent = new ShowToastEvent({
                            title: 'Record Deleted',
                            message: 'Record deleted successfully',
                            variant: 'success'
                        })
                        this.dispatchEvent(toastEvent);
                        return refreshApex(this.wiredDataResult);
                    })
            }
            else if (actionName === "detailsform") {
                event.preventDefault();
                let componentDef = {
                    componentDef: "c:detailsOfForm",
                    attributes: {
                        formId : recId
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
        catch (exception) {
            processScriptThrownException(this, exception);
        }
    }
}