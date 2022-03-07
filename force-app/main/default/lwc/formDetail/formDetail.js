import { LightningElement, track, api, wire } from 'lwc';
import saveFormDetailRecord from '@salesforce/apex/formDetail.saveFormDetailRecord';
import saveCustomFields from '@salesforce/apex/formDetail.saveCustomFields';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import Data_Type from '@salesforce/schema/Form_Detail__c.Data_Type__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FormDetail_Object from '@salesforce/schema/Form_Detail__c';
import { NavigationMixin } from 'lightning/navigation';

const columns = [
    { label: 'Custom Field Name', fieldName: 'Field_name__c'},
    { label: 'Data Type', fieldName: 'Data_Type__c'},
    { label: 'Edit', type: "button", typeAttributes: {label: 'Edit', name: 'editFields', 
      title: 'Edit', value: 'editfields', iconPosition: 'center'}},
    { label: 'Delete Form', type: "button-icon", typeAttributes: { name: "delete", value: "delete",
      iconName: "utility:delete" } }
];

export default class FormDetail extends NavigationMixin(LightningElement) {
    objectApiName = FormDetail_Object;

    columns = columns;
    @api formnamefrmdetail;
    @track forNonCustomFields= true;
    @track displayName = '';
    @track dataType = 'None Selected';
    @track formDetailName = '';
    @track fieldName = '';
    @track fieldAPIName = '';
    @track pickListValues = '';
    @track finalAnswer = '';
    @track isEditable = '';
    @track isRequired = '';
    @track description = '';
    @track formdetailrecoredid = '';
    @track formdetailrecoredid2 ='';
    @track Complex = '';
    //@track frmdetailidlist = [];
    @track errorMsg = '';
    @track defaultValue = '';
    @track minValue = '';
    @track maxValue = '';
    @track currencyDefaultValue = '';
    @track items = '';
    // @track finished = false;
    // @track insert = true;
    @track insertOperator;
    //@track more = true;
    //@track insertButton = false;
    @track formDetailIdListArray = [];//{'Field_name__c':'Anycheckbox','Data_Type__c':'Checkbox'}
    @track complexBool= false;
    @track value = 'Simple'; // radiobutton by sk
    @track l_All_Types;     // radiobutton by sk
    @track TypeOptions;   // radiobutton by sk
    @api countBool;
    @track displayCount;
    @api orderCount;
    @track parentNoOfChild='';
    @track customFormModal = false; 
    @api parentCustomFieldsList;
    @api parentCustomFieldsListCopy=[];
    @track customFieldId;
    //freshAddField;
    @track displayOrderError=true;
    @track displayTextValue ='';
    @track isCustomFieldEdit;
    @track isAddField;
    @track parentCustomNoAddFieldsList;
    //@track lastElement=[];
    /*value = '';

    get options() {
        return [
            { label: 'Simple', value: 'option1' },
            { label: 'Complex', value: 'option2' },
        ];
    }*/
    /*get formulaOptions() {
        return [
            { label: '+ Add', value: '+' },
            { label: '- Subtract', value: '-' },
            { label: '* Multiply', value: '*' },
            { label: '/ Divide', value: '/' },
            { label: '^ Exponentiation', value: '^' },
            { label: '( Open Parenthesis', value: '(' },
            { label: ') Close Parenthesis', value: ')' },
            { label: '& Concatenate', value: '&' },
            { label: '= Equal', value: '=' },
            { label: '<> Not Equal', value: '<>' },
            { label: '< Less Than', value: '<' },
            { label: '> Greater Than', value: '>' },
            { label: '<= Less Than or Equal', value: '< =' },
            { label: '>= greater Than or Equal', value: '>=' },
            { label: '&& And', value: '&&' },
            { label: '|| Or', value: '||' },
        ];
    }*/

    connectedCallback(){
       // this.freshAddField = true;
        this.displayCount = 1;
        if(this.countBool === false){
            this.displayCount = this.orderCount;
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: Data_Type
    })
    wiredPickListValue({ data, error }) {
        if (data) {

            this.pickListValues = data.values;
 

            this.error = undefined;
        }
        if (error) {

            this.error = error;
            this.pickListValues = undefined;
        }
    }

    @track defaultRadioOptions = [
        { label: 'Checked', value: 'Checked' },
        { label: 'Unchecked', value: 'Unchecked' },
    ];

    @track maskRadioOptions = [
        { label: '*', value: '*' },
        { label: 'X', value: 'X' },
    ];

    valueHandleChange(event) {
        if (event.target.name == 'formDetailFN') {
            this.formnamefrmdetail = event.target.value;

        }
        if (event.target.name == 'DisplayName') {
            this.displayName = event.target.value;
 
        }
        if (event.target.name == 'datatype') {
            this.dataType = event.target.value;
            if(this.dataType === 'Custom'){
                this.forNonCustomFields = false;
            }
            else{
                this.forNonCustomFields = true;
            }
        }
        if (event.target.name == 'fieldname') {
            this.fieldName = event.target.value;
        }
        if (event.target.name == 'defaultvaluecurrency') {
            this.defaultValue = event.target.value;
        }
        if (event.target.name == 'defaultvaluedate') {
            this.defaultValue = event.target.value;
        }
        if (event.target.name == 'dvDateTime') {
            this.defaultValue = event.target.value;
        }
        if (event.target.name == 'defaultValueemail') {
            this.defaultValue = event.target.value;
        }
        if (event.target.name == 'defaultvaluenumber') {
            this.defaultValue = event.target.value;
        }
        if (event.target.name == 'defaultvaluepercent') {
            this.defaultValue = String(event.target.value);
        }
        if (event.target.name == 'defaultvaluephone') {
            this.defaultValue = event.target.value;
        }
        /* if (event.target.name == 'defaultvalueRadio' || 'maskCharacterRadio') {
             this.defaultValue = event.target.value;
         }*/
        if (event.target.name == 'DefaultvalueText') {
            this.defaultValue = event.target.value;
        }
        //Text-Area && Text-Area (Long) 
        if (event.target.name == 'DefaultvalueTextArea') {
            this.defaultValue = event.target.value;
        }
        //Text-Area && Text-Area (Long) above
        if (event.target.name == 'DefaultvalueTextAreaRich') {
            this.defaultValue = event.target.value;
        }
        if (event.target.name == 'DefaultValueTime') {
            this.defaultValue = event.target.value;
        }
        if (event.target.name == 'DefaultValueURL') {
            this.defaultValue = event.target.value;
        }

        if (event.target.name == 'MinValueCurrency') {
            this.minValue = event.target.value;
        }
        if (event.target.name == 'MaxValueCurrency') {
            this.maxValue = event.target.value;
        }
        if (event.target.name == 'minValueDate') {
            this.minValue = event.target.value;
        }
        if (event.target.name == 'maxValueDate') {
            this.maxValue = event.target.value;
        }
        if (event.target.name == 'minValueDT') {
            this.minValue = event.target.value;
        }
        if (event.target.name == 'maxValueDT') {
            this.maxValue = event.target.value;
        }
        if (event.target.name == 'minValueNumber') {
            this.minValue = event.target.value;
        }
        if (event.target.name == 'maxValueNumber') {
            this.maxValue = event.target.value;
        }
        if (event.target.name == 'minValuePercent') {
            this.minValue = event.target.value;
        }
        if (event.target.name == 'maxValuePercent') {
            this.maxValue = event.target.value;
        }
        if (event.target.name == 'TextMinValue') {
            this.minValue = event.target.value;
        }
        if (event.target.name == 'TextMaxValue') {
            this.maxValue = event.target.value;
        }
        //Text-Area && Text-Area (Long)
        if (event.target.name == 'minValueTextArea') {
            this.minValue = event.target.value;
        }
        if (event.target.name == 'maxValueTextArea') {
            this.maxValue = event.target.value;
        }
        //Text-Area && Text-Area (Long) above
        if (event.target.name == 'minValueTextAreaRich') {
            this.minValue = event.target.value;
        }
        if (event.target.name == 'maxValueTextAreaRich') {
            this.maxValue = event.target.value;
        }
        if (event.target.name == 'minValueTime') {
            this.minValue = event.target.value;
        }
        if (event.target.name == 'maxValueTime') {
            this.maxValue = event.target.value;
        }
        /*if (event.target.name == 'itemsInCheckboxName') {
            this.items = event.target.value;
        }*/
        if (event.target.name == 'optionList') {
                this.items = event.target.value;
            }
        if (event.target.name == 'iseditale') {
            this.isEditable = event.target.checked;
        }
        if (event.target.name == 'isrequired') {
            this.isRequired = event.target.checked;
        }
        if (event.target.name == 'Description') {
            this.description = event.target.value;
        }
        /*if (event.target.name == 'finishedfields') {
            if (event.target.checked) {
                this.finished = true;
                this.insert = false;
            }
            else {
                this.finished = false;
                this.insert = true;
            }
        }*/
        if (event.target.name == 'insertoperator') {
            this.insertOperator = event.detail.value;;
        }
        if (event.target.name == 'NoofChild') {
            this.parentNoOfChild = event.detail.value;;
        }
        if (event.target.name == 'displayText') {
            this.displayTextValue = event.detail.value;;
        }   
    }

    /*valueCurrencyChange(event){
        if (event.target.name == 'defaultvaluecurrency') {
           this.defaultValue =   this.template.querySelector('lightning-input[data-name="currencyDV"]')
            this.defaultValue = event.target.value;
        }

    }*/

    /* radiobutton js add to component by sk */

    handleSelected(event){


        this.Complex = event.detail;

    }

    get options() {
        return [
            {label:'Simple', value:'Simple'},
            {label:'Complex', value:'Complex'},
        ];
        }
                       
       handleChange(event){
            const selectedOption = event.detail.value;
            if(selectedOption == 'Simple'){
                this.value= event.target.value;
                this.complexBool=false;
            }
            if(selectedOption =='Complex'){
               this.value= event.target.value;
               // const changeValue = event.detail.value;
                 this.complexBool=true
            }
        }

    /* radiobutton js add to component by sk */

    get numberPicklistValue() {
        return (this.dataType === 'Checkbox' || this.dataType === 'Currency' || this.dataType === 'Date' ||
            this.dataType === 'Date/Time' || this.dataType === 'Email' || this.dataType === 'Number' ||
            this.dataType === 'Percent' || this.dataType === 'Phone' || this.dataType === 'Picklist' || 
            this.dataType === 'Picklist (Multi-Select)' || this.dataType === 'Radio Button' || this.dataType === 'Text' || 
            this.dataType === 'Text Area' || this.dataType === 'Text (Encrypted)' || this.dataType === 'Text Area (Long)' || 
            this.dataType === 'Text Area (Rich)' ||this.dataType === 'Time' || this.dataType === 'URL' ||
            this.dataType === 'Custom' || this.dataType === 'Label'
        )
    }

    // getter for Non Custom Field (Field name, Field API Name, Is Editable, Is Required, Description)

    get nonCustomFields(){
        return (this.dataType === 'Checkbox' || this.dataType === 'Currency' || this.dataType === 'Date' ||
            this.dataType === 'Date/Time' || this.dataType === 'Email' || this.dataType === 'Number' ||
            this.dataType === 'Percent' || this.dataType === 'Phone' || this.dataType === 'Picklist' || 
            this.dataType === 'Picklist (Multi-Select)' || this.dataType === 'Radio Button' || this.dataType === 'Text' || 
            this.dataType === 'Text Area' || this.dataType === 'Text (Encrypted)' || this.dataType === 'Text Area (Long)' || 
            this.dataType === 'Text Area (Rich)' ||this.dataType === 'Time' || this.dataType === 'URL'
        )
    }

    get labelField(){
        return (this.dataType === 'Label')
    }

    //getter for Custom Fields

    get customFields(){
        return (this.dataType === 'Custom')
    }

    // getter for default value


    get itemsInOptionList() {
        return (this.dataType === 'Checkbox' || this.dataType === 'Picklist' || this.dataType === 'Picklist (Multi-Select)' || this.dataType === 'Radio Button')
    }
    /*get defaultValueCheckbox() {
        return (this.dataType === 'Checkbox')
    }*/
    get complexTypeRender(){
        return (this.dataType === 'Picklist')
    }
    get defaultValueCurrency() {
        return (this.dataType === 'Currency')
    }
    get defaultValueDate() {
        return (this.dataType === 'Date')
    }
    get defaultValueDateTime() {
        return (this.dataType === 'Date/Time')
    }
    get defaultValueEmail() {
        return (this.dataType === 'Email')
    }
    get defaultValueNumber() {
        return (this.dataType === 'Number')
    }
    get defaultValuePercent() {
        return (this.dataType === 'Percent')
    }
    get defaultValuePhone() {
        return (this.dataType === 'Phone')
    }
    get defaultValueText() {
        return (this.dataType === 'Text')
    }
    get defaultValueTextArea() {
        return (this.dataType === 'Text Area' || this.dataType === 'Text Area (Long)')
    }
    get maskCharacterTextEncrypted() {
        return (this.dataType === 'Text (Encrypted)')
    }
    get defaultValueTextAreaRich() {
        return (this.dataType === 'Text Area (Rich)')
    }
    get defaultValueTime() {
        return (this.dataType === 'Time')
    }
    get defaultValueURL() {
        return (this.dataType === 'URL')
    }

    // getter for min max

    get minMaxValueCurrency() {
        return (this.dataType === 'Currency')
    }
    get minMaxValueDate() {
        return (this.dataType === 'Date')
    }
    get minMaxValueDateTime() {
        return (this.dataType === 'Date/Time')
    }
    get minMaxValueNumber() {
        return (this.dataType === 'Number' || this.dataType === 'Text' || this.dataType === 'Text Area' ||
            this.dataType === 'Text (Encrypted)' || this.dataType === 'Text Area (Long)' || this.dataType === 'Text Area (Rich)'
        )
    }
    get minMaxValuePercent() {
        return (this.dataType === 'Percent')
    }
    get minMaxValuePhone() {
        return (this.dataType === 'Phone')
    }
    get minMaxValueTime() {
        return (this.dataType === 'Time')
    }

    /*get disableInsert() {
        return this.insertButton == true;
    }*/
    /*get disableAddMore() {
        return this.more == true;
    }*/

    handleCustomFieldShowModalPopup(){
        //if(this.parentCustomFieldsListCopy.length === 0){
            this.isAddField = true;
            if(this.parentCustomFieldsListCopy.length === 0){
                //this.freshAddField = false;
                let lastElemetn = null;
                let buttonString = '';
                const modal = this.template.querySelector("c-fg-custom-form-fields");
        modal.show(lastElemetn, buttonString);
            }
            else{
            let lastElemetn = this.parentCustomFieldsListCopy.slice(-1);
            let buttonString = 'addField';

        const modal = this.template.querySelector("c-fg-custom-form-fields");
        modal.show(lastElemetn, buttonString);
    }
    //}
        /*if(this.parentCustomFieldsListCopy.length > 0){
           this.lastElement = this.parentCustomFieldsListCopy.slice(-1);
           const modal = this.template.querySelector("c-fg-custom-form-fields");
        modal.show();
    }*/
    }

   /* addMore() {
        //this.finished = false;
        //this.insert = true;
        this.insertButton = false;
        this.more = true;
    }*/

    handleCustomFields(event){
        if(this.isAddField === true){
        this.parentCustomFieldsList = event.detail;
        this.parentCustomFieldsListCopy = JSON.parse(JSON.stringify(this.parentCustomFieldsList));
        }

        if(this.isAddField === false){
        this.parentCustomNoAddFieldsList = event.detail;
        let updateparentCustonFields = JSON.parse(JSON.stringify(this.parentCustomNoAddFieldsList));
        console.log('updateparentCustonFields[0]--->>',updateparentCustonFields[0]);
        console.log('updateparentCustonFields--->>',updateparentCustonFields);
        for(const currentItem of this.parentCustomFieldsListCopy){
            if (currentItem.custUid === updateparentCustonFields[0].custUid){
                currentItem.custUid = updateparentCustonFields[0].custUid;
                currentItem.Display_Name__c = updateparentCustonFields[0].Display_Name__c;
                currentItem.Name = updateparentCustonFields[0].Name;
                currentItem.Display_Order_number__c = updateparentCustonFields[0].Display_Order_number__c;
                currentItem.Data_Type__c = updateparentCustonFields[0].Data_Type__c;
                currentItem.Field_name__c = updateparentCustonFields[0].Field_name__c;
                currentItem.Field_API_Name__c = updateparentCustonFields[0].Field_API_Name__c;
                currentItem.Is_Editable__c = updateparentCustonFields[0].Is_Editable__c;
                currentItem.Is_Required__c = updateparentCustonFields[0].Is_Required__c;
                currentItem.Description__c = updateparentCustonFields[0].Description__c;
                currentItem.Default_value__c = updateparentCustonFields[0].Default_value__c;
                currentItem.Min_Value__c = updateparentCustonFields[0].Min_Value__c;
                currentItem.Max_Value__c = updateparentCustonFields[0].Max_Value__c;  
            }
          }
        /*this.parentCustomFieldsListCopy.forEach(function(currentItem){
            if(currentItem.custUid === updateparentCustonFields[0].custUid){
            this.parentCustomFieldsListCopy[0].custUid = currentItem.custUid;
            this.parentCustomFieldsListCopy[0].Display_Name__c = currentItem.Display_Name__c;
            this.parentCustomFieldsListCopy[0].Name = currentItem.Name;
            this.parentCustomFieldsListCopy[0].Display_Order_number__c = currentItem.Display_Order_number__c;
            this.parentCustomFieldsListCopy[0].Data_Type__c = currentItem.Data_Type__c;
            this.parentCustomFieldsListCopy[0].Field_name__c = currentItem.Field_name__c;
            this.parentCustomFieldsListCopy[0].Field_API_Name__c = currentItem.Field_API_Name__c;
            this.parentCustomFieldsListCopy[0].Is_Editable__c = currentItem.Is_Editable__c;
            this.parentCustomFieldsListCopy[0].Is_Required__c = currentItem.Is_Required__c;
            this.parentCustomFieldsListCopy[0].Description__c = currentItem.Description__c;
            this.parentCustomFieldsListCopy[0].Default_value__c = currentItem.Default_value__c;
            this.parentCustomFieldsListCopy[0].Min_Value__c = currentItem.Min_Value__c;
            this.parentCustomFieldsListCopy[0].Max_Value__c = currentItem.Max_Value__c;  
            }
        })*/
        }
        console.log('this.parentCustomFieldsListCopy before coppy--->>',this.parentCustomFieldsListCopy);
        this.parentCustomFieldsListCopy = [...this.parentCustomFieldsListCopy]
        this.parentCustomFieldsList = [...this.parentCustomFieldsListCopy]
    }

    handleInsert(event) {
        //this.finished = true;
        // this.insert = false;
        //this.insertButton = true;
       // this.more = false;
        if(this.forNonCustomFields === true){
        saveFormDetailRecord({
            fdFormName: this.formnamefrmdetail, fdDisplayName: this.displayName, fdFormDetailName: this.formDetailName,
            fdDisplayOrder : this.displayCount, fdDataType: this.dataType, fdFieldName: this.fieldName, fdFieldAPIName: this.fieldAPIName,
            fdIsEditable: this.isEditable, fdIsRequired: this.isRequired, fdDescription: this.description,
            fdDefaultValue: this.defaultValue, fdMinValue: this.minValue, fdMaxValue: this.maxValue, fdItems: this.items, fdComplex: this.Complex,
            fdDisplayTextValue: this.displayTextValue
        })
            .then(result => {

                this.formdetailrecoredid2 = result.Id;
                this.formdetailrecoredid =  this.accountidfrmparent=event.target.dataset.formdetailrecoredid;
                this.formDetailIdListArray.push({'Id': result.Id,'Field_name__c': result.Field_name__c, 'Data_Type__c': result.Data_Type__c});
                this.formDetailIdListArray = [...this.formDetailIdListArray];
                // this.frmdetailidlist.push(this.formdetailrecoredid);
                const toastEvent = new ShowToastEvent({
                    title: 'Success!',
                    message: 'Record created successfully',
                    variant: 'success'
                });
                this.dispatchEvent(toastEvent);
            })
            .catch(error => {
                this.errorMsg = error.message;
            });
        }

        if(this.forNonCustomFields === false){
            var customParent = {   
                'sobjectType': 'Form_Detail__c', 
                'Form_Name__c': this.formnamefrmdetail,  
                'Display_Name__c': this.displayName,  
                'Name': this.formDetailName,  
                'Display_Order_number__c': this.displayCount,
                //'Section_Text__c': this.dateAndTime,
                'Data_Type__c': this.dataType,
                'No_of_Child__c': this.parentNoOfChild,
              }  
              
    saveCustomFields({
        formDetailRec : customParent,
        customFieldList: this.parentCustomFieldsList
       })
         .then(result => {
            this.displayOrderError = true;
           this.parentCustomFieldsListCopy= null;
           this.columns = null;
           this.parentCustomFieldsList = null;
           const toastEvent = new ShowToastEvent({
             title: 'Success!',
             message: 'Record created successfully',
             variant: 'success'
           });
           this.dispatchEvent(toastEvent);
         })
         .catch(error => {
            this.dispatchEvent( new ShowToastEvent({
                title:'Failed!!',
                message:'Custom Field is not having Child Fields',
                variant:'error'
            }));
            this.displayOrderError = false;
           //this.errorMsg = error.message;
         });
        }

        this.template.querySelectorAll('lightning-input[data-id="resetDT"]').forEach(element => {
            if (element.type === 'checkbox' || element.type === 'checkbox-button') {
                element.checked = false;
            } else {
                element.value = null;
            }
        });

        this.template.querySelectorAll('lightning-textarea[data-id="resetDT"]').forEach(element => {
            element.value = null;
        });
        this.template.querySelectorAll('lightning-input-rich-text[data-id="resetDT"]').forEach(element => {
            element.value = null;
        });
        /*this.template.querySelectorAll('lightning-combobox[data-id="resetDT"]').forEach(element => {
            element.value = 'None Selected';
            this.Section_Text__c = 'None Selected';
        });*/

        this.defaultValue = undefined;
        this.dataRefresh();
        //var delayInMilliseconds = 3000; //1 second
        //setTimeout(function() {
        /* const objChild = this.template.querySelectorAll('c-form-detail-fields');
         objChild.processChildData();*/
        //
        //this.template.querySelector("c-form-detail-fields").processChildData();
        //},delayInMilliseconds);
    }
    dataRefresh() {
        this.dataType = 'None Selected';
        this.fieldName = '';
        this.fieldAPIName = '';
        this.isEditable = '';
        this.isRequired = '';
        this.description = '';
        this.defaultValue = '';
        this.minValue = '';
        this.maxValue = '';
        this.items = '';
        this.complex = '';
        if(this.displayOrderError=== false){
        this.displayCount = this.displayCount+1;
        }
        this.parentNoOfChild = '';
        this.displayTextValue='';
        this.columns = columns;
        this.parentCustomFieldsList = [];
        this.parentCustomFieldsListCopy = [];
    }

    handleRowAction(event){
        const actionName = event.detail.action.name;
        this.customFieldId = event.detail.row;
        var customFieldIdparse = JSON.parse(JSON.stringify(this.customFieldId));
        if (actionName === 'editFields') {
            this.isAddField = false;
            let lastElemetn = null;
            let buttonString = 'editFields';
            const objChild = this.template.querySelector('c-fg-custom-form-fields');
            objChild.addArrayList(this.customFieldId, actionName);
            const modal = this.template.querySelector("c-fg-custom-form-fields");
            modal.show(lastElemetn,buttonString);
        }
        if (actionName === 'delete') {
            const index = this.parentCustomFieldsListCopy.findIndex((element) => element.custUid === customFieldIdparse.custUid);
              let parentCustomFieldsListCopyDelete = [...this.parentCustomFieldsListCopy];
              parentCustomFieldsListCopyDelete.splice(index,1);
                this.parentCustomFieldsListCopy = parentCustomFieldsListCopyDelete;
                const objChild = this.template.querySelector('c-fg-custom-form-fields');
                objChild.addArrayList(this.customFieldId, actionName);
        }
    }

    reorderFields(event){
        event.preventDefault();
        let componentDef = {
            componentDef: "c:reorderFields",
            attributes: {
                formnamereorderid: this.formnamefrmdetail
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

    handleNextFD(event) {
        event.preventDefault();
        let componentDef = {
            componentDef: "c:formDetailList",
            attributes: {
                formnamefrmdetailList: this.formnamefrmdetail
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

    suffixC(event) {        
        if (event.target.name == 'DisplayName') {
            let stringFormDetailName = event.target.value;
            if (stringFormDetailName != '') {
                this.formDetailName = stringFormDetailName.replace(/ /g, "_") + "__c";
            }
            else {
                this.formDetailName = '';
            }
        }
        if (event.target.name == 'fieldname') {
            let stringFieldAPIName = event.target.value;
            if (stringFieldAPIName != '') {
                this.fieldAPIName = stringFieldAPIName.replace(/ /g, "_") + "__c";
            }
            else {
                this.fieldAPIName = '';
            }
        }

    }
}