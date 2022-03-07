import { LightningElement, track, wire, api } from 'lwc';
import getFormsDetails from '@salesforce/apex/formDetail.getFormsDetails';
//import getFormsDetails from '@salesforce/apex/formDetailController.getFormsDetails';
import { getRecord } from 'lightning/uiRecordApi';
import Name_FIELD from '@salesforce/schema/Form_Detail__c.Name';
import { NavigationMixin } from 'lightning/navigation';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Edit', name: 'Edit' }
];

const columns = [{ label: 'Display Name', fieldName: 'Display_Name__c', type: 'text' },
                 { label: 'Data type', fieldName: 'Data_Type__c', type: 'text' },
                 { type: 'action', typeAttributes: { rowActions: actions } }];

export default class FormList extends NavigationMixin(LightningElement) {
    @track data=[];
    @track error;
    @track columns = columns;
    @api formnamefrmdetailList;
    @track datalength=null;

    //@api columns=[{label: 'Form Detail Name',fieldName: 'Name', type: 'text'}];

    //@api recordsId;
    //@wire(getRecords,{recordsId: '$recordsId', fields:[NAME_FIELD]})

    @wire(getFormsDetails, { formnameidclass: '$formnamefrmdetailList' }) 
    formRecords({ error, data }) {
        if (data) { 
            this.data = data;
            
            this.datalength = this.data.length +1;
            console.log('datalength-->>', this.datalength);
        }
        else if (error) {
            this.data = undefined;
        }
    }

    handleClick(event) {
        event.preventDefault();
        let componentDef =
        {
            componentDef: "c:formDetail",
            attributes: {
                formnamefrmdetail: this.formnamefrmdetailList,
                countBool: false,
                orderCount: this.datalength,
              }
        };
        // Encode the componentDefinition JS object to Base64 format to make it url addressable
        let encodedComponentDef = btoa(JSON.stringify(componentDef));
        this[NavigationMixin.Navigate]
            ({
                type: 'standard__webPage',
                attributes:
                {
                    url: '/one/one.app#' + encodedComponentDef
                }
            });
    }

    handleStep(event){
        console.log('formnamefrmdetailList----->>>'+this.formnamefrmdetailList);
        event.preventDefault();
        let componentDef = {
            componentDef: "c:step",
            attributes: {
                formnamefrmdetailStep: this.formnamefrmdetailList
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

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'view'
                    }
                });
                break;
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: 'Form__c',
                        actionName: 'edit'
                    }
                });
                break;
            default:
        }
    }
    handleStepTransaction(event){
        event.preventDefault();
        let componentDef = {
            componentDef: "c:stepTransaction",
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
    handleValidation(event){
        event.preventDefault();
        let componentDef = {
            componentDef: "c:validationRule",
            attributes: {
                formnamevalidation: this.formnamefrmdetailList
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