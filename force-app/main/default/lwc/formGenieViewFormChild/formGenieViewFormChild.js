import { LightningElement ,api,track} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getformInfo from '@salesforce/apex/form.getformInfo';
import getstepdetails from '@salesforce/apex/form.getstepDetails';
import getstepfieldInfo from '@salesforce/apex/step.getstepfieldInfo';
import getsteptransition from '@salesforce/apex/step.getsteptransition';
import getformdetaildata from '@salesforce/apex/form.getformDetailData';
import getFormDetailInfoFromStepField from '@salesforce/apex/form.getFormDetailInfoFromStepField';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getformdetail from '@salesforce/apex/formDetail.getFormsDetails';
import Savedata from '@salesforce/apex/form.Savedata';
export default class ForGenie_ViewFormChild extends NavigationMixin(LightningElement) {
    @api selectedformid;
    @api closepage;
    @api viewdetails=false;
    @track stepdetails=[];
    @track stepid;
    @track stepfieldid;
    @track header;
    @track footer;
    @track logo;
    @track title;
    @track formDetail=[];
    @track checkbox=false;
    @track date=false;
    @track phone=false;
    @track Currency=false;
    @track AutoNumber=false;
    @track RadioButton=false;
    @track Picklist=false;
    @track Text=false;
    @track time=false;
    @track TimeDate=false;
    @track textArea=false;
    @track textArealong=false;
    @track textAreaRich=false;
    @track textencrpted=false;
    @track URL=false;
    @track percent=false;
    @track Email=false;
    @track number=false;
    @track multiPicklist=false;


    
    @track DetailData;
    @track displaycheckbox=[];
    @track displaydate=[];
    @track displayPhone=[];
    @track displaycurrency;
    @track displaytext=[];
    @track displaynumber=[];
    @track displaytextlong=[];
    @track displaytextrich=[];
    @track displaytextarea=[];
    @track displaytextencrypted=[];
    @track displayPercent=[];
    @track displayEmail=[];
    @track displaydatetime=[];
    @track displayPicklist;
    @track displayMultiselect;
    @track displayRadioButton;
    @track displaytime=[];
    @track displayAutoNumber=[];
    @track displayURL=[];
    @track picklistOptionValues=[];
    @track detailId;
    @track mapData = [];

    @track idss;
    @track txtval='';
    @track txtareaval='';
    @track txtarelongaval='';
    @track txtdateval='';
    @track txteryptval='';
    @track checkval=false;
    @track emailval='';
    @track phoneval='';
    @track check='';
    @track txtrichval='';
    @track numval='';
    @track perval='';
    @track timeval='';
    @track datetimeval='';
    @track URLval;
    @track autoval;
    @track fordetailResult=[];
    @track formDetailid;  
    
    connectedCallback()
    {
        getformInfo({ formid:this.selectedformid})
        .then(result => {
            this.header=result[0].Message_Header__c;
            this.header= this.header.slice(3, -4);
            this.footer=result[0].Footer_Message__c;
            this.footer=this.footer.slice(3,-4);
            this.title=result[0].Title__c;
        })

        getformdetail({formnameidclass:this.selectedformid})
        .then(result => {
            this.fordetailResult=result;
            // Step Details Start----------------------------------------------------------------------------------------
            getstepdetails({ formid:this.selectedformid})
            .then(result => {
            this.stepdetails=result;
            console.log('How many Steps????===>'+this.stepdetails.length);
            console.log('Steps Record Related to Selected Form===>'+JSON.stringify( this.stepdetails));
            if(this.stepdetails.length>0 )
            {
                for(let i=0;i<=this.stepdetails.length; i++)
                {
                    this.stepid=this.stepdetails[i].Id;
                    console.log(' this.stepid'+JSON.stringify( this.stepid));
                    for(let i=0; i<= this.stepid.length;i++)
                    {
                        getsteptransition({stepid:this.stepid,formid:this.selectedformid})
                        .then(result => {
                        console.log('Step Transition=====>'+JSON.stringify(result));
                        })
                    }
                    console.log('Result Data -->' + JSON.stringify(this.stepdetails[i].Name));
                    if(this.stepid.length>0)
                    {
                        getstepfieldInfo({stepid: this.stepid})
                        .then(result =>
                        {
                           console.log('Step fields ====>'+JSON.stringify( result )); 
                            console.log('Steps data'+JSON.stringify(result.length));
                            //Check if step 1 Exist==========================>>
                            if(result.length>0)
                            {
                                for(var i=0;i<=result.length; i++)
                                {
                                    this.stepfieldid=result[i].Form_Detail__c;
                                    console.log('  this.stepfieldid'+  this.stepfieldid);
                                    getFormDetailInfoFromStepField({detailId: this.stepfieldid})
                                    .then(result => {
                                    console.log('result this.stepfieldid'+JSON.stringify(result));
                                    for(let i=0;i<result.length;i++){
                                    this.DetailData=result[i];
                                    this.formDetail=result[i].Data_Type__c;
                                    this.formDetailid=result[i].Id;
                                    this.allFieldsData();//Displaying Fields 
                                    getformdetaildata({detailId:result[i].Id})
                                    .then(result => {
                                    if(result){
                                        for(let i=0;i<result.length;i++)
                                        {
                                            this.idss=result[i].Data_Type__c;
                        
                                            if(this.idss=='Text'){
                                            this.txtval=result[i].Value__c;
                                            }
                                            if(this.idss=='Text Area'){
                                            this.txtareaval=result[i].Value__c;
                                            }
                                            if(this.idss=='Text Area (Rich)'){
                                            this.txtrichval=result[i].Value__c; 
                                            }
                                            if(this.idss=='Date'){
                                            this.txtdateval=result[i].Value__c;
                                            }
                                            if(this.idss=='Text (Encrypted)'){
                                            this.txteryptval=result[i].Value__c;
                                            }
                                            if(this.idss=='Email'){
                                            this.emailval=result[i].Value__c;  
                                            }
                                            if(this.idss=='Phone'){
                                            this.phoneval=result[i].Value__c;  
                                            } 
                                            if(this.idss=='Text Area (Long)'){
                                            this.txtarelongaval=result[i].Value__c;  
                                            }
                                            if(this.idss=='Number'){
                                            this.numval=result[i].Value__c; 
                                            }  
                                            if(this.idss=='Percent'){
                                            this.perval=result[i].Value__c; 
                                            }
                                            if(this.idss=='Time'){
                                            this.timeval=result[i].Value__c; 
                                            }
                                            if(this.idss=='Date/Time'){
                                            this.datetimeval=result[i].Value__c; 
                                            }
                                            if(this.idss=='URL'){
                                            this.URLval=result[i].Value__c; 
                                            }
                                            if(this.idss=='Auto Number'){
                                            this.autoval=result[i].Value__c; 
                                            }
                                            if(this.idss=='Checkbox'){
                                            this.checkval=result[i].Value__c;
                                            //document.getElementById("Checks").checked = true;
                                            //console.log('ZZZZZZZZZZZZZZZZZZ'+this.checkval);
                                            }
                                        }
                                    }      
                                    })

                                }
                                    });
                                }
                            }
                            else
                            {
                                console.log('no result Found');
                            }  
                        })
                    }
                        
                }
            }


            else{
                //console.log('FORM DETAIL===>'+JSON.stringify(result));
                for(var i=0;i<this.fordetailResult.length;i++){
                    this.DetailData=this.fordetailResult[i];
                    this.formDetail=this.fordetailResult[i].Data_Type__c;
                    this.formDetailid=this.fordetailResult[i].Id;
                   console.log('@@@@@@@@@@@@@@@@@'+JSON.stringify(this.formDetailid));
                   this.allFieldsData();
                    getformdetaildata({detailId:this.fordetailResult[i].Id})
                    .then(result => {
                    if(result){
                        for(let i=0;i<result.length;i++)
                        {
                            this.idss=result[i].Data_Type__c;
        
                            if(this.idss=='Text'){
                            this.txtval=result[i].Value__c;
                            }
                            if(this.idss=='Text Area'){
                            this.txtareaval=result[i].Value__c;
                            }
                            if(this.idss=='Text Area (Rich)'){
                            this.txtrichval=result[i].Value__c; 
                            }
                            if(this.idss=='Date'){
                            this.txtdateval=result[i].Value__c;
                            }
                            if(this.idss=='Text (Encrypted)'){
                            this.txteryptval=result[i].Value__c;
                            }
                            if(this.idss=='Email'){
                            this.emailval=result[i].Value__c;  
                            }
                            if(this.idss=='Phone'){
                            this.phoneval=result[i].Value__c;  
                            } 
                            if(this.idss=='Text Area (Long)'){
                            this.txtarelongaval=result[i].Value__c;  
                            }
                            if(this.idss=='Number'){
                            this.numval=result[i].Value__c; 
                            }  
                            if(this.idss=='Percent'){
                            this.perval=result[i].Value__c; 
                            }
                            if(this.idss=='Time'){
                            this.timeval=result[i].Value__c; 
                            }
                            if(this.idss=='Date/Time'){
                            this.datetimeval=result[i].Value__c; 
                            }
                            if(this.idss=='URL'){
                            this.URLval=result[i].Value__c; 
                            }
                            if(this.idss=='Auto Number'){
                            this.autoval=result[i].Value__c; 
                            }
                            if(this.idss=='Checkbox'){
                            this.checkval=result[i].Value__c;
                            //document.getElementById("Checks").checked = true;
                            //console.log('ZZZZZZZZZZZZZZZZZZ'+this.checkval);
                            }
                        }
                    }      
                    })
                }
            }
        })
// Step Details End---------------------------------------------------------------------------------
           
 })
        }
     
    onchangeCheckbox(event){
        let value= event.detail.checked;
        let Ids= event.target.dataset.recordId;
        this.mapData.push({Value:value,Key:Ids});
    }
   
    @track phoneval1;
    @track phoneid;
    onchangePhone(event) {
    this.phoneval1= event.detail.value;
    this.phoneid= event.target.dataset.recordId;
    }
    onPhoneBlur(){
        this.mapData.push({Value:this.phoneval1,Key:this.phoneid});
    }
    @track emailval1;
    @track emailids;
    onchangeEmail(event)  {
        this.emailval1= event.detail.value;
        this.emailids= event.target.dataset.recordId;
    }
    onemailblur(){
        this.mapData.push({Value:this.emailval1,Key:this.emailids});
        console.log('mapData'+JSON.stringify( this.mapData));
    }
    onchangeDate(event) {
        let value= event.detail.value;
        let Ids= event.target.dataset.recordId;
        this.mapData.push({Value:value,Key:Ids});
        console.log('mapData'+JSON.stringify( this.mapData));
    }
    @track numval1;
    @track numid;
    onchangeNumber(event) {
       this.numval1= event.detail.value;
       this.numid= event.target.dataset.recordId;
      // document.getElementById("Numbers").checked = true;
    }
    numberblur(){
        this.mapData.push({Value:this.numval1,Key:this.numid});
        console.log('mapData'+JSON.stringify( this.mapData));
    }
    @track autoval1;
    @track autoid;
    onchangeAutoNumber(event){
    this.autoval1= event.detail.value;
    this.autoid=event.target.dataset.recordId;
    }
    onAutoNoBlur(){
        this.mapData.push({Value:this.autoval1,Key:this.autoid});
        console.log('mapData'+JSON.stringify( this.mapData));   
    }
    onchangePercent(event) {
        let value= event.detail.value;
        let Ids= event.target.dataset.recordId;
        this.mapData.push({Value:value,Key:Ids});
        console.log('mapData'+JSON.stringify( this.mapData));
    }
    @track value1;
    @track Ids1;
    onchangeText(event){
    this.value1= event.detail.value;
    this.Ids1= event.target.dataset.recordId;
  
    }
    textOnblur(){
    this.mapData.push({Value:this.value1,Key:this.Ids1});
    console.log('mapData'+JSON.stringify( this.mapData));  
    }
    @track txtareaval1;
    @track txtareaIds;
        onchangeTextArea(event){
        this.txtareaval1= event.detail.value;
        this.txtareaIds= event.target.dataset.recordId;
    }
    textareaOnblur(){
        this.mapData.push({Value: this.txtareaval1,Key:this.txtareaIds});
        console.log('mapData'+JSON.stringify( this.mapData));
    }
        onchangeTextLong(event){
        let value= event.detail.value;
            let Ids= event.target.dataset.recordId;
            this.mapData.push({Value:value,Key:Ids});
        console.log('mapData'+JSON.stringify( this.mapData));

    }
    @track txtrich1;
    @track txtrichid;
        onchangeTextRich(event){
        this.txtrich1= event.detail.value;
        this.txtrichid= event.target.dataset.recordId;
    }
    txtrichblur(){
        this.mapData.push({Value:this.txtrich1,Key:this.txtrichid});
        console.log('mapData'+JSON.stringify( this.mapData));
    }
    @track txtencryval1;
    @track txtencyid;
    onchangeTextEncrypt(event){
        this.txtencryval1= event.detail.value;
        this.txtencyid= event.target.dataset.recordId;
    
    }
    textencryOnblur(){
        this.mapData.push({Value:this.txtencryval1,Key:this.txtencyid});
        console.log('mapData'+JSON.stringify( this.mapData));
    }
    onchangeTime(event){
        let value= event.detail.value;
        let Ids= event.target.dataset.recordId;
        this.mapData.push({Value:value,Key:Ids});
        console.log('mapData'+JSON.stringify( this.mapData));
    }
    onchangeTimeDate(event){
        let value= event.detail.value;
        let Ids= event.target.dataset.recordId;
        this.mapData.push({Value:value,Key:Ids});
        console.log('mapData'+JSON.stringify( this.mapData));
    }
    @track urlval;
    @track urlid; 
    onchangeURL(event){
        this.urlval= event.detail.value;
        this.urlid= event.target.dataset.recordId;   
    }
    URLblur(){
        this.mapData.push({Value:this.urlval,Key:this.urlid});
        console.log('mapData'+JSON.stringify( this.mapData));   
    }
            
           
     handleClose()
     {
        this.closepage=false;
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
             apiName: 'View_Form'
            }
        });
    }
 
    handleSave()
    {
        console.log(this.mapData);  
        Savedata({data:this.mapData})
       .then(result => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: "Success",
                message:"Data Inserted Successfully",
                variant: "Success"
            })
        );
        this.closepage=false;
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
             apiName: 'View_Form'
            }
       });  
       })
    }

 allFieldsData(){
    if(this.formDetail=='Text'){
        this.detailId=this.DetailData;
        this.displaytext.push(this.detailId);  
        this.text=true; 
    }
    if(this.formDetail=='Text Area'){
        this.detailId= this.DetailData;
        this.displaytextarea.push(this.detailId);
        this.textArea=true;   
    }
    if(this.formDetail=='Text Area (Rich)'){
        this.detailId= this.DetailData;
        this.displaytextrich.push(this.detailId);
        this.textAreaRich=true;   
    }
    if(this.formDetail=='Date'){
        this.detailId= this.DetailData;  
        this.displaydate.push(this.detailId);
        this.date=true; 
    }
    if(this.formDetail=='Text (Encrypted)'){
        this.detailId= this.DetailData;
        this.displaytextencrypted.push(this.detailId);
        this.textencrpted=true;    
    }
    if(this.formDetail=='Email'){
        this.detailId=this.DetailData; 
        this.displayEmail.push(this.detailId);
        this.Email=true;  
    }
    if(this.formDetail=='Phone'){
        this.detailId= this.DetailData;
        this.displayPhone.push(this.detailId);
        this.phone=true;   
    }
    if(this.formDetail=='Text Area (Long)'){
        this.detailId= this.DetailData;
        this.displaytextlong.push(this.detailId);
        this.textArealong=true;   
    }
    if(this.formDetail=='Number'){
        this.detailId= this.DetailData;
        this.number=true;   
        this.displaynumber.push(this.detailId);
    }
    if(this.formDetail=='Percent'){
        this.detailId= this.DetailData;
        this.percent=true;   
        this.displayPercent.push(this.detailId);
    }
    if(this.formDetail=='Time'){
        this.detailId= this.DetailData;
        this.time=true;   
        this.displaytime.push(this.detailId);
    }
    if(this.formDetail=='Date/Time'){
        this.detailId= this.DetailData;
        this.TimeDate=true;   
        this.displaydatetime.push(this.detailId);
    }
    if(this.formDetail=='URL'){
        this.detailId= this.DetailData;
        this.URL=true;   
        this.displayURL.push(this.detailId);
    }
    if(this.formDetail=='Auto Number'){
        this.detailId= this.DetailData;
        this.AutoNumber=true;   
        this.displayAutoNumber.push(this.detailId);
    }
    if(this.formDetail=='Checkbox'){
        this.detailId= this.DetailData;
        this.displaycheckbox.push(this.detailId);
        this.checkbox=true;
    }
 }

}