import { LightningElement, api, wire, track } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import Data_Type from '@salesforce/schema/Form_Detail__c.Data_Type__c';
export default class FgCustomFormFields extends LightningElement {
    @track pickListValues = '';
    @track newpicklistValue;
    @track displayName='';
    @track dataType = 'None Selected';
    @track formDetailName = '';
    @track fieldName = '';
    @track fieldAPIName = '';
    @track isEditable = '';
    @track isRequired = '';
    @track description = '';
    @track Complex = '';
    @track defaultValue = '';
    @track minValue = '';
    @track maxValue = '';
    @track items = '';
    @track complexBool = false;
    @track value = 'Simple'; // radiobutton by sk
    @api countBool;
    @track displayCount;
    @api orderCount;
    @track customFieldsRealTime = [];
    @track customFields = [];
    @track customFieldIdEdit;
    @track customFieldIdEditObject;
    @track editRowId='';

    showModal = false;

    @api show(lastElemetn,buttonString) {
        console.log('Show this.customFields--->>',JSON.stringify(this.customFields));
        this.showModal = true;
        //if(this.childIsAddField===true){
        if(this.customFields === null && buttonString === 'addField'){
            this.displayName = '';
            this.fieldName= '';
            this.fieldAPIName= '';
        }
        if(this.customFields != null && buttonString === 'addField'){
           this.dataType = '';
           this.displayName = lastElemetn[0].Display_Name__c;
            this.formDetailName = lastElemetn[0].Name;
            this.fieldName = '';
            this.fieldAPIName = '';
            this.isEditable = '';
            this.isRequired = '';
            this.description = '';
            this.defaultValue = '';
            this.minValue = '';
            this.maxValue = '';
            this.displayCount = lastElemetn[0].Display_Order_number__c+1;
            this.items = '';
        }
   // }
    }

    handleDialogClose() {
        this.showModal = false;
    }

    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: Data_Type
    })
    wiredPickListValue({ data, error }) {
        if (data) {
            this.pickListValues = data.values;
            this.newpicklistValue = this.pickListValues.filter(function (currentItem) {
                return currentItem.label != 'Custom';
            })
            this.error = undefined;
        }
        if (error) {
            this.error = error;
            this.pickListValues = undefined;
        }
    }

    @track maskRadioOptions = [
        { label: '*', value: '*' },
        { label: 'X', value: 'X' },
    ];

    connectedCallback(){
        
        this.displayCount = 1;
    }

    @api addArrayList(customFieldId, actionName){
        if(actionName === 'editFields'){
        this.customFieldIdEdit = customFieldId;
        this.customFieldIdEditObject = JSON.parse(JSON.stringify(this.customFieldIdEdit));
        this.editRowId=this.customFieldIdEdit.custUid;
        this.displayName=this.customFieldIdEdit.Display_Name__c;
        this.dataType = this.customFieldIdEdit.Data_Type__c;
        this.formDetailName = this.customFieldIdEdit.Name;
        this.fieldName = this.customFieldIdEdit.Form_Name__c;
        this.fieldAPIName = this.customFieldIdEdit.Field_API_Name__c;
        this.isEditable =  this.customFieldIdEdit.Is_Editable__c;
        this.isRequired =  this.customFieldIdEdit.Is_Required__c;
        this.description =  this.customFieldIdEdit.Description__c;
        this.defaultValue =  this.customFieldIdEdit.Default_value__c;
        this.minValue =  this.customFieldIdEdit.Min_Value__c;
        this.maxValue =  this.customFieldIdEdit.Max_Value__c;
        this.displayCount =  this.customFieldIdEdit.Display_Order_number__c;
        this.customFields = [];
        this.customFields.push(this.customFieldIdEdit);
        console.log('edit addArrayList this.customFields--->>', JSON.stringify(this.customFields));
    }
    if(actionName === 'delete'){
        this.customFields = [];
    }

    }

    valueHandleChange(event) {
        if (event.target.name == 'formDetailFN') {
            this.formnamefrmdetail = event.target.value;
        }
        if (event.target.name == 'datatype') {
            this.dataType = event.target.value;
        }
        if (event.target.name == 'DisplayName') {
            this.displayName = event.target.value;
        }
        if (event.target.name == 'fieldname') {
            this.fieldName = event.target.value;
            console.log('onChange this.customFields--->>>',JSON.stringify(this.customFields));
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

    }

    handleSelected(event) {


        this.Complex = event.detail;

    }

    get options() {
        return [
            { label: 'Simple', value: 'Simple' },
            { label: 'Complex', value: 'Complex' },
        ];
    }

    handleChange(event) {
        const selectedOption = event.detail.value;
        if (selectedOption == 'Simple') {
            this.value = event.target.value;
            this.complexBool = false;
        }
        if (selectedOption == 'Complex') {
            this.value = event.target.value;
            this.complexBool = true
        }
    }

    get numberPicklistValue() {
        return (this.dataType === 'Checkbox' || this.dataType === 'Currency' || this.dataType === 'Date' ||
            this.dataType === 'Date/Time' || this.dataType === 'Email' || this.dataType === 'Number' ||
            this.dataType === 'Percent' || this.dataType === 'Phone' || this.dataType === 'Picklist' ||
            this.dataType === 'Picklist (Multi-Select)' || this.dataType === 'Radio Button' || this.dataType === 'Text' ||
            this.dataType === 'Text Area' || this.dataType === 'Text (Encrypted)' || this.dataType === 'Text Area (Long)' ||
            this.dataType === 'Text Area (Rich)' || this.dataType === 'Time' || this.dataType === 'URL' ||
            this.dataType === 'Custom'
        )
    }

    get itemsInOptionList() {
        return (this.dataType === 'Checkbox' || this.dataType === 'Picklist' || this.dataType === 'Picklist (Multi-Select)' || this.dataType === 'Radio Button')
    }

    get complexTypeRender() {
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

    saveFields(event) {
        console.log('save this.customFields',JSON.stringify(this.customFields));
        console.log('save this.customFields length',this.customFields.length)
        let customFieldsCopy = JSON.parse(JSON.stringify(this.customFields));
        if(this.editRowId === ''){
        const uniqueId = (length=16) => {
            return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace(".", ""))
          }
          //var uIdCust = uniqueId();
            this.customFieldsRealTime.push({ 'custUid': uniqueId(),
                'Display_Name__c': this.displayName, 'Name': this.formDetailName, 
                'Display_Order_number__c': this.displayCount,'Data_Type__c': this.dataType, 
                'Field_name__c': this.fieldName, 'Field_API_Name__c': this.fieldAPIName, 
                'Is_Editable__c': this.isEditable, 'Is_Required__c': this.isRequired, 
                'Description__c': this.description, 'Default_value__c': this.defaultValue, 
                'Min_Value__c': this.minValue, 'Max_Value__c': this.maxValue
            });
           
            this.customFields.push(this.customFieldsRealTime[0]);
        }
        else{
            if( this.customFields.length === 0){
            this.customFields.push(this.customFieldsRealTime[0]);
        }
        else if(this.customFields.length > 0){
            console.log('else if customFieldsCopy--->>',customFieldsCopy);
            for(const currentItem of customFieldsCopy){
                if (currentItem.custUid === this.editRowId){
                customFieldsCopy[0].custUid = this.editRowId;
                customFieldsCopy[0].Display_Name__c = this.displayName;
                customFieldsCopy[0].Name = this.formDetailName;
                customFieldsCopy[0].Display_Order_number__c = this.displayCount;
                customFieldsCopy[0].Data_Type__c = this.dataType;
                customFieldsCopy[0].Field_name__c = this.fieldName;
                customFieldsCopy[0].Field_API_Name__c = this.fieldAPIName;
                customFieldsCopy[0].Is_Editable__c = this.isEditable;
                customFieldsCopy[0].Is_Required__c = this.isRequired;
                customFieldsCopy[0].Description__c = this.description;
                customFieldsCopy[0].Default_value__c = this.defaultValue;
                customFieldsCopy[0].Min_Value__c = this.minValue;
                customFieldsCopy[0].Max_Value__c = this.maxValue;  
                }
              }

            this.customFields = [];
            this.customFields.push(customFieldsCopy[0]);
            
            /*this.customFields[0].custUid = this.customFieldsRealTime[0].custUid;
            this.customFields[0].Display_Name__c = this.customFieldsRealTime[0].Display_Name__c;
            this.customFields[0].Name = this.customFieldsRealTime[0].Name;
            this.customFields[0].Display_Order_number__c = this.customFieldsRealTime[0].Display_Order_number__c;
            this.customFields[0].Data_Type__c = this.customFieldsRealTime[0].Data_Type__c;
            this.customFields[0].Field_name__c = this.customFieldsRealTime[0].Field_name__c;
            this.customFields[0].Field_API_Name__c = this.customFieldsRealTime[0].Field_API_Name__c;
            this.customFields[0].Is_Editable__c = this.customFieldsRealTime[0].Is_Editable__c;
            this.customFields[0].Is_Required__c = this.customFieldsRealTime[0].Is_Required__c;
            this.customFields[0].Description__c = this.customFieldsRealTime[0].Description__c;
            this.customFields[0].Default_value__c = this.customFieldsRealTime[0].Default_value__c;
            this.customFields[0].Min_Value__c = this.customFieldsRealTime[0].Min_Value__c;
            this.customFields[0].Max_Value__c = this.customFieldsRealTime[0].Max_Value__c;*/
        }
        }
        console.log('bfore dispatch--->>',JSON.stringify(this.customFields))
        const selectedEvent = new CustomEvent('selected', { detail: this.customFields });
        this.dispatchEvent(selectedEvent);

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

        this.defaultValue = undefined;
        this.dataRefresh();
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
        this.displayCount = this.displayCount + 1;
        this.customFieldsRealTime = [];
    }

}