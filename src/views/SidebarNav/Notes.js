import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Sidebar } from 'primereact/sidebar';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button as BTN, Row, Col, Input, Card, CardHeader, CardBody, Collapse } from 'reactstrap';
import api from '../../utils/apiClient';
import APIConstant from '../../utils/constants';
import moment from 'moment';
import { CommonConfig } from '../../utils/constants';
import { withTranslation } from 'react-i18next';
import ShowMoreText from 'react-show-more-text';

class PersonNotes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Type: [],
      noteList: [],
      isImportant: 0,
      notesType: '',
      notesdescription: '',
      NotesTypeError: true,
      notesdescriptionError: true,
      noteID: '',
      isNoteEdit: false,
      ReasonArray: [],
      ResponseTypeArray: [],
      showReasonDD: false,
      responseType: '',
      responseTypeError:false,
      reasonTypeError:false,
      reasonType: '',
      DateTime: '',
      reasonsShow: false,
      contactMode:'',
      contactModeError: false,
      contactModeList:[],
      renewalMonth:'',
      renewalMonthList:[],
      renewalMonthError: false,
      notesInceptionDate: '',
      notesInceptionDate1:'',
      isEditRenewalMonth: false,
      isEditDate: false,
      InceptionDate: '',

      SecurityGroupList: [
          { label: 'New Business', value: 'New Business' },
          { label: 'Renewal', value: 'Renewal' },
          { label: 'Underwriting', value: 'Underwriting' },
      ],
      
      EntityId: '',
      EntityType: '',
      LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,

      addNoteCollapse: false,
    };
    // This data we will get from Policy and Contact pages.
    if (props.NavPage) {
      this.state.NavPage = props.NavPage;
      this.state.EntityType = props.NavPage;
      this.state.InceptionDate = props.inceptionDate;
    }
    if (props.NavID) {
      this.state.NavID = props.NavID;
      this.state.EntityId = props.NavID;
    }
    
  }

  async componentDidMount() {
    await this.getDropDownValues('MONTH', 'renewalMonthList');
    // await this.getPolicyHolder();
   await this.getDropDownValues('CONTACTMODE', 'contactModeList');
    // this.getDropDownValues('FOLLOWUPREASON', 'ReasonArray');
    await this.getDropDownValues('FOLLOWUPRESPONSE', 'ResponseTypeArray');
    await this.getNoteList();
    await this.getNotesType();
  }


  async getPolicyHolder() {
    const data = { policyId: this.state.EntityId };
    console.log("getPolicyHolderDetails", data);
    await api.post('api/getPolicyHolderDetails', data).then(res => {
        console.log("getPolicyHolderDetails", res);
        if (res.success) {
            let resdata = res.data[0];
            console.log("getPolicyHolderDetails", resdata[0]);
            this.setState({
                InceptionDate: resdata[0].InceptionDate,
            });
        } else {
        }
    }).catch(err => {
        console.log('error', err);
    });
}


  async getNoteList() {
    var t = this.state.InceptionDate ? new Date(this.state.InceptionDate) : new Date();
        
        var renewalMonth = "";
        if(t.getMonth() + 1 < 10){
            renewalMonth = "0"+ (t.getMonth() + 1);  
        }  
        else{
            renewalMonth = (t.getMonth() + 1);
        } 
        let renewalValue = this.state.renewalMonthList.filter(x=> x.StringMapKey == renewalMonth);
        let finalRenewalDate = {
            value : renewalMonth,
            label : renewalValue[0].StringMapName
        }
        this.setState({ notesInceptionDate: moment(this.state.InceptionDate).format('DD-MM-YYYY'),notesInceptionDate1: moment(this.state.InceptionDate).format('YYYY-MM-DD') , renewalMonth: finalRenewalDate});


    const data = {
      'entityId': this.state.EntityId,
      'entityType': this.state.EntityType,
      'CurrentUser': CommonConfig.loggedInUserData().EntityId
    };

    // if (CommonConfig.loggedInUserData().SecurityGroupName == "New Business") {
      await api.post('api/getNewBusineesNotes', data).then(res => {
          if (res.success) {
              console.log(" new business notes......", res.data)
              this.setState({ noteList: res.data });
          } else {
              toast.warn("No notes found for Policy.");
          }
      }).catch(err => {
          console.log("getNoteList err", err);
      });
    // }else{
    //   api.post('api/getNotes', data).then(res => {
    //     if (res.success) {
    //       console.log(" new normal notes......", res.data)
    //      this.setState({ noteList: res.data });
    //     } else {

    //     }
    //   }).catch(err => {

    //   });
    // } 
  }

  getPolicyHolder() {
    const data = { policyId: this.props.match.params.id };
    console.log("getPolicyHolderDetails", data);
    api.post('api/getPolicyHolderDetails', data).then(res => {
        console.log("getPolicyHolderDetails", res);
        if (res.success) {
            let resdata = res.data[0];
            console.log("getPolicyHolderDetails", resdata[0]);
            this.setState({
                inceptionDate: resdata[0].InceptionDate,
            });
        } else {

        }
    }).catch(err => {
        console.log('error', err);
    });
}

  async getDropDownValues(stringMapType, setStateName) {
    try {
        let data = {
            stringmaptype: stringMapType,
            orderby: 'sortorder'
        };
        if (stringMapType == "MONTH"){
            data = {
                stringmaptype: stringMapType,
                orderby: 'StringMapKey'
            };  
        }
        await api.post(APIConstant.path.dropdownbycode, data).then(res => {
            if (res.success) {
                this.setState({ [setStateName]: res.data });
            } else {
            }
        }).catch(err => {
        });
    } catch (error) {
        console.log("error...", error);
    }
  }

  getDropDownReasonValues(response, setStateName) {
    try {
        const data = {
            StingMapKey: response,
        };
        api.post(APIConstant.path.dropdownbycodeforreason, data).then(res => {
            if (res.success) {
                console.log("ressssssssssssss/....", res)
                this.setState({ ReasonArray: res.data[0] });
            } else {
            }
        }).catch(err => {
        });
    } catch (error) {
        console.log("error...", error);
    }
  }

  getNotesType() {
    try {
      const data = {
        stringmaptype: 'NOTETYPE'
      };
      api.post(APIConstant.path.dropdownbycode, data).then(res => {
        if (res.success) {
          this.setState({ Type: res.data });
        } else {

        }
      }).catch(err => {

      });
    } catch (error) {

    }
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  Important() {
    (this.state.isImportant === 0 ? this.setState({ isImportant: 1 }) : this.setState({ isImportant: 0 }))
  }

  saveNotes = () => {
    if (
      this.state.NotesTypeError === false &&
      this.state.notesdescriptionError === false) {

      const NotesForm = new FormData();
      NotesForm.append('noteId', this.state.noteID);
      NotesForm.append('notesType', this.state.notesType);
      NotesForm.append('notesdescription', this.state.notesdescription.trim());
      NotesForm.append('entityid', this.state.EntityId);
      NotesForm.append('entitytype', this.state.EntityType);
      NotesForm.append('isflag', this.state.isImportant);
      NotesForm.append('loggedInUserId', CommonConfig.loggedInUserId());
      NotesForm.append('languageId', this.state.LanguageId);

      api.post('api/addNotes', NotesForm).then(res => {
        if (res.success) {
          this.reset();
          toast.success('Notes added successfully');
          toast.success(res.message);
          this.getNoteList();
        } else {

        }
      }).catch(err => {
      });
    } else {
      this.show("notesType", this.state.NotesTypeError);
      this.show("notesdescription", this.state.notesdescriptionError);
    }
  }

  saveNotesNewBusiness = () => {
    if (this.state.notesdescriptionError === false) {
        if (this.state.responseType == "") {
            toast.error('Please Select Response Type');
            return
        }

        if (this.state.responseType == "Not Interested") {
            if (this.state.reasonType == "") {
                toast.error('Please Select Reason Type');
                return
            }
        }

        if (this.state.contactMode == "") {
            toast.error('Please Select Contact mode');
            return
        }
        
        if (this.state.renewalMonth == "") {
            toast.error('Please Select Renewal Month');
            return
        }

        var data = {
            'EntityType': 'Policy',
            'EntityId': this.state.NavID,
            'PolicyId': this.state.NavID,
            'isflag': this.state.isImportant,
            'Response': this.state.responseType,
            'Reason': this.state.reasonType,
            'NoteText': this.state.notesdescription.trim(),
            'FollowUpDateTime': this.state.DateTime,
            // 'RenewalMonth': this.state.renewalMonth,
            'InceptionDate': this.state.notesInceptionDate1,
            'ContactMode': this.state.contactMode,
            'CurrentUser': CommonConfig.loggedInUserData().EntityId
        }
        console.log("dataaaaaa..........",data)
        api.post('api/saveFollowUpNote', data).then(res => {
            if (res.data.success) {
                toast.success('Follow-Up note added successfully');
                this.resetNewBusiness();
                this.getNoteList({ PolicyId: this.state.NavID });
                
            } else {
                toast.error(res.data.msg);
            }
        }).catch(err => {
        });
    } else {
        if(this.state.responseType ==''){
            this.show("responseType", true, "responseTypeError" , "Please Select Response" )
        }
        if(this.state.contactMode ==''){
            this.show("contactMode", true, "contactModeError" , "Please Select Contact mode" )
        }
        if(this.state.renewalMonth ==''){
            this.show("renewalMonth", true, "renewalMonthError" , "Please Select Renewal month" )
        }
        this.show("notesType", this.state.NotesTypeError);
        this.show("notesdescription", this.state.notesdescriptionError);
    }
}

  resetNewBusiness = () => {
    var t = new Date(this.state.InceptionDate);
        
        var renewalMonth = "";
        if(t.getMonth() + 1 < 10){
            renewalMonth = "0"+ (t.getMonth() + 1);  
        }  
        else{
            renewalMonth = (t.getMonth() + 1);
        } 
        let renewalValue = this.state.renewalMonthList.filter(x=> x.StringMapKey == renewalMonth);
        let finalRenewalDate = {
            value : renewalMonth,
            label : renewalValue[0].StringMapName
        }

    this.setState({
      notesdescription: '', notesdescriptionError: true,
      responseType: '',
      notesInceptionDate: moment(this.state.InceptionDate).format('DD-MM-YYYY'),
      notesInceptionDate1: moment(this.state.inceptionDate).format('YYYY-MM-DD'),
      reasonType: '',
      DateTime: '',
      renewalMonth: finalRenewalDate,
      contactMode:'',
      isImportant: 0,
      isEditDate:false,
      isEditRenewalMonth: false,
    });
    this.show("notesdescription", false);

    this.setState({ addNoteCollapse: false });
  }


  // show(field, condition) {
  //   if (condition) {
  //     document.getElementById(field).className = "form-control is-invalid";
  //   } else {
  //     document.getElementById(field).className = "form-control";
  //   }
  // }

  show(field, condition, errorField, message) {
    if (condition) {
        if (document.getElementById(field))
            document.getElementById(field).className = "form-control is-invalid";

        if (document.getElementById(errorField))
            document.getElementById(errorField).innerHTML = '<p>' + message + ' </p>';
    } else {
        if (document.getElementById(field))
            document.getElementById(field).className = "form-control";

        if (document.getElementById(errorField))
            document.getElementById(errorField).innerHTML = null;
    }
  }

  selectType1(value, type) {
    if (value === '' || value === null) {
      this.setState({ NotesTypeError: true, notesType: value });
      this.show('notesType', true);
    } else {
      this.setState({ NotesTypeError: false, notesType: value });
      this.show('notesType', false);
    }
  }

  selectType(value , type){
    if (type === 'responseType') {

      if (value === '' || value === undefined || value === null) {
          this.setState({ responseType: '', responseTypeError: true ,showReasonDD: false });
          this.show('responseType', true ,"responseTypeError", "Please select Response")
      } else {
          this.setState({ responseType: value.value , responseTypeError:false});
          this.show('responseType', false ,"responseTypeError", "")

          this.getDropDownReasonValues(value.value, 'ReasonArray')
          
          if (value.value == "Not Interested" || value.value == "Lost" || value.value == "Purge"|| value.value == "Abandoned" ){
            this.setState({showReasonDD: true});
          }else{
            this.setState({showReasonDD: false});
          }
      }
    }

    if (type === 'reasonType') {
      if (value === '' || value === undefined || value === null) {
          this.setState({ reasonType: '', reasonTypeError: true });
          this.show('reasonType', true ,"reasonTypeError", "Please select Reason")
      } else {
          this.setState({ reasonType: value.value ,reasonTypeError:false});
          this.show('reasonType', false ,"reasonTypeError", "");
      }
    }

    if (type === 'contactMode') {
      if (value.value == '' || value.value == undefined || value.value == null) {
          this.setState({ contactMode: '', contactModeError: true });
          this.show('contactMode', true, "contactModeError", "Please select Contact mode");
      } else {
          this.setState({ contactMode: value.value, contactModeError: false });
          this.show('contactMode', false, "contactModeError", "");
      }
    }

    if (type === 'renewalMonth') {
      if (value.value == '' || value.value == undefined || value.value == null) {
          this.setState({ renewalMonth: '', renewalMonthError:true });
          this.show('renewalMonth', true, "renewalMonthError", "Please select Renewal month");
      } else {
        var date = new Date();
        var ShowMonth = value.value;
         console.log(ShowMonth);

        var curmonth = new Date().getMonth() + 1;
        console.log(curmonth);
        if (ShowMonth < curmonth)

            var curyear = new Date().getFullYear() + 1;
        else
            var curyear = new Date().getFullYear();
        console.log("curyear", curyear);

        var inceptionDate = moment([parseInt(curyear), parseInt(value.value) - 1]).format('DD-MM-YYYY');
        var inceptionDate1 = moment([parseInt(curyear), parseInt(value.value) - 1]).format('YYYY-MM-DD');
        this.setState({ renewalMonth: value.value, renewalMonthError:true , notesInceptionDate: inceptionDate,notesInceptionDate1: inceptionDate1 });
        this.show('renewalMonth', false, "renewalMonthError", "");
          // this.setState({ renewalMonth: value.value, renewalMonthError:true });
          // this.show('renewalMonth', false, "renewalMonthError", "");

      }
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === 'notesdescription') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ notesdescriptionError: true });
        this.show("notesdescription", true);
      } else {
        this.setState({ notesdescriptionError: false, notesdescription: e.target.value });
        this.show("notesdescription", false);
      }
    }
    if(e.target.name === 'inceptionDate'){
      if (CommonConfig.isEmpty(e.target.value)) {
          this.setState({ inceptionDateError: true });
          this.show("inceptionDate", true, "inceptionDateError", "Please enter Inception Date");
      }else {  
          var t = new Date(e.target.value);
          var renewalMonth = "";
          if(t.getMonth() + 1 < 10){
              renewalMonth = "0"+ (t.getMonth() + 1);  
          }  
          else{
              renewalMonth = (t.getMonth() + 1);
          } 
          let data = this.state.renewalMonthList.filter(x=> x.StringMapKey == renewalMonth);
          var inceptionDate = moment(e.target.value).format('DD-MM-YYYY');                
          console.log("data.......",e.target.value);
          let finalRenewalDate = {
              value : renewalMonth,
              label : data[0].StringMapName
          }
          this.setState({ notesInceptionDate: inceptionDate ,notesInceptionDate1: e.target.value, inceptionDateError: false ,renewalMonth: finalRenewalDate });
          this.show('inceptionDate', false , "inceptionDateError", "");
      }
    }
  }

  editDate(task) {
    if (task == "view") {
        this.setState({ isEditDate: false });
    } else {
        this.setState({ isEditDate: true });
    }
  }

editRenewalMonth(task){
    if(task == 'view'){
        this.setState({ isEditRenewalMonth : false});
    } else {
        this.setState({ isEditRenewalMonth: true });
    }
}

  updateNotes = (data) => {
    this.setState({
      isNoteEdit: true, notesdescription: data.NoteText, notesdescriptionError: false,
      notesType: data.NoteType, NotesTypeError: false, isImportant: data.IsFlag.data[0],
      noteID: data.NoteId, addNoteCollapse: true
    });
    this.show("notesdescription", false);
    this.show('notesType', false);
  }

  reset = () => {
    this.setState({
      isNoteEdit: false, notesdescription: '', notesdescriptionError: true,
      notesType: '', NotesTypeError: true,
      noteID: '', isImportant: 0,
    });
    this.show("notesdescription", false);
    this.show('notesType', false);
  }

  executeOnClick(isExpanded) {
  }

  HideSideBar() {
    this.setState({ visible: false });
    this.reset();
  }

  render() {
    const { t, i18n } = this.props;
    const SaveButton = t("buttons.Save");
    const AddButton = t("buttons.Add");
    const EditButton = t("buttons.Edit");
    const DeleteButton = t("buttons.Delete");
    const CloseButton = t("buttons.Close");
    const BackButton = t("buttons.Back");
    const UpdateButton = t("buttons.Update");

    return (
      <div>
        <a onClick={(e) => this.setState({ visible: true })}>Notes</a>
        <Sidebar showCloseIcon={false} blockScroll={true} visible={this.state.visible} position="right" onHide={(e) => this.HideSideBar()} style={{ width: 900 }}>

          <div>
            <span className="text-left float-right" onClick={(e) => this.HideSideBar()}>
              <i className="fa fa-close"></i>
            </span>
          </div>
          <ScrollPanel style={{ width: '100%', height: '92%', paddingLeft: "20px", paddingRight: "20px" }}>

            <Card className="mb-0">
              <CardHeader id="headingOne">
                <BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ addNoteCollapse: !this.state.addNoteCollapse })} aria-expanded={this.state.addNoteCollapse} aria-controls="collapseOne">
                  <h5 className="m-0 p-0"> {(this.state.isNoteEdit) ? t("contactNotes:EditNotes") : t("contactNotes:AddNotes")} <i style={{ float: "right" }} className={this.state.addNoteCollapse ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i> </h5>
                </BTN>
              </CardHeader>

              <Collapse isOpen={this.state.addNoteCollapse} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                <form onSubmit={this.handleSubmit} style={{ padding: 10 }}>
                {CommonConfig.loggedInUserData().SecurityGroupName == "New Business" ?
                                        (<>
                                        {/* <Row>
                                            <Col md='2'>
                                                <label>Contact Mode</label>
                                            </Col>
                                            <Col md='3'>
                                                    <Input type="select" name ="contactMode" id="contactMode" onChange={(e) => this.selectType(e.target,'contactMode')} value={this.state.contactMode}>
                                                    <option value=''>Select</option>
                                                    {this.state.contactModeList.map((x) => {
                                                        return(<option value={x.StringMapKey}>{x.StringMapName}</option>)
                                                    })
                                                    }
                                                    </Input>
                                                    <em id="contactModeError" className="error invalid-feedback"></em>
                                            </Col>
                                            <Col md='2'>
                                                <label> Renewal Month</label>
                                            </Col>
                                            <Col md='2'>
                                                    <Input type="select" name ="renewalMonth" id="renewalMonth" onChange={(e) => this.selectType(e.target,'renewalMonth')} value={this.state.renewalMonth}>
                                                    <option value=''>Select</option>
                                                    {this.state.renewalMonthList.map((x) => {
                                                        return(<option value={x.StringMapKey}>{x.StringMapName}</option>)
                                                    })
                                                    }    
                                                    </Input>
                                                    <em id="renewalMonthError" className="error invalid-feedback"></em>
                                                
                                            </Col>
                                        </Row> */}
                                                                                <Row>
                                            <Col md='4'>
                                                <label>Contact Mode</label>

                                                    <Input type="select" name ="contactMode" id="contactMode" onChange={(e) => this.selectType(e.target,'contactMode')} value={this.state.contactMode}>
                                                    <option value=''>Select</option>
                                                    {this.state.contactModeList.map((x) => {
                                                        return(<option value={x.StringMapKey}>{x.StringMapName}</option>)
                                                    })
                                                    }
                                                    </Input>
                                                    <em id="contactModeError" className="error invalid-feedback"></em>

                                                {/* </div> */}
                                            </Col>
                                            {!this.state.isEditRenewalMonth ? 
                                            <Col md='4'>
                                                <label> Renewal Month : {CommonConfig.isEmpty(this.state.renewalMonth) !== true ? this.state.renewalMonth.label : this.state.renewalMonth}</label>
                                                <>
                                                    <BTN style={{ float: "right" }} color="primary"
                                                        onClick={this.state.isEditRenewalMonth ? () => this.editRenewalMonth("view") : () => this.editRenewalMonth("edit")}
                                                    >
                                                    <i className="fa fa-pencil"></i>
                                                        
                                                    </BTN>
                                                    </>
                                            </Col>
                                            :
                                            <Col md='4'>
                                                <>
                                                <label> Renewal Month :</label>

                                                    <Input type="select" name ="renewalMonth" id="renewalMonth" onChange={(e) => this.selectType(e.target,'renewalMonth')} value={this.state.renewalMonth.value}>
                                                    <option value=''>Select</option>
                                                    {this.state.renewalMonthList.map((x) => {
                                                        return(<option value={x.StringMapKey}>{x.StringMapName}</option>)
                                                    })
                                                    }    
                                                    </Input>
                                                    <em id="renewalMonthError" className="error invalid-feedback"></em>
                                                {/* </div> */}
                                                </>
                                                 
                                            </Col>
                                            }
                                            {!this.state.isEditDate?
                                            <Col md='4'>
                                                <label>Inception date: {this.state.notesInceptionDate}</label>
                                                
                                                <BTN style={{ float: "right" }} color="primary"
                                                    onClick={this.state.isEditDate ? () => this.editDate("view") : () => this.editDate("edit")}
                                                >
                                                <i className="fa fa-pencil"></i>
                                                </BTN>
                                                
                                            </Col>
                                            :<Col md='4'>
                                                <label>Inception date: {this.state.notesInceptionDate}</label>
                                                <div>
                                                    <Input type="date" name="inceptionDate" id="inceptionDate"
                                                        placeholder="Inception Date"
                                                        style={{ width: '80%', display: "inline-block" }}
                                                        onChange={(e) => this.handleChange(e ,'inceptionDate')}
                                                        value={this.state.notesInceptionDate1}
                                                    />
                                                    <em id="iceptionDateError" className="error invalid-feedback"></em>
                                                </div>

                                                {/* <label>Inception date: </label>
                                                <Input type="date" id="inceptionDate" name="inceptionDate"
                                                        value={moment(this.state.notesInceptionDate).format('DD-MM-YYYY')}
                                                        onChange={(e) => this.handleChange(e, 'inceptionDate')}
                                                >
                                                </Input>
                                                <em id="iceptionDateError" className="error invalid-feedback"></em> */}
                                            </Col>
                                            }
                                        </Row>
                                        <Row>
                                            <Col md="3">
                                                <div className="input-box with-icon">
                                                    <label>Response*</label>
                                                    <Input type="select" name="responseType" id="responseType" onChange={(e) => this.selectType(e.target, 'responseType')} value={this.state.responseType}>
                                                        <option value=''>Select</option>
                                                        {this.state.ResponseTypeArray.map((ct, i) => {
                                                            return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                                        })
                                                        }
                                                    </Input>
                                                    <em id="responseTypeError" className="error invalid-feedback"></em>
                                                </div>
                                            </Col>
                                            {this.state.showReasonDD ?
                                                (<Col md="6">
                                                    <div className="input-box with-icon">
                                                        <label>Reason</label>
                                                        <Input type="select" name="reasonType" id="reasonType" onChange={(e) => this.selectType(e.target, 'reasonType')} value={this.state.reasonType}>
                                                            <option value=''>Select</option>
                                                            {this.state.ReasonArray.map((ct, i) => {
                                                                return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                    </div>
                                                </Col>) : (null)}
                                        </Row>
                                        </>) 
                                    : (null)}
                  <Row>
                    <Col md="6">
                    {CommonConfig.loggedInUserData().SecurityGroupName != "New Business" ?
                      (<div className="input-box with-icon">
                        <label>{t("contactNotes:NotesType.label")}*</label>
                        <Input type="select" name="notesType" id="notesType" onChange={(e) => this.selectType1(e.target.value, 'notesType')} value={this.state.notesType}>
                          <option value=''>{t("contactNotes:NotesType.placeholder")}</option>
                          {this.state.Type.map((ct, i) => {
                            return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                          })
                          }
                        </Input>
                        <em className="error invalid-feedback">{t("contactNotes:NotesType.error_blank")}</em>
                        </div>) : (null)}
                        <a title={t("contactNotes:ImportantNotes")} href="javascript:void(0)" onClick={() => this.Important()} style={{ color: this.state.isImportant === 0 ? '#aaaaaa' : '#ff0000', fontSize: 25 }}><i class="fa fa-exclamation-circle" aria-hidden="true"></i></a>
                      {/* </div> */}
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <div className="input-box">
                        <label>{t("contactNotes:Notes.label")}*</label>
                        <Input type="textarea" name="notesdescription" id="notesdescription" placeholder={t("contactNotes:Notes.placeholder")} value={this.state.notesdescription} onChange={e => this.handleChange(e)} autoResize={true} />
                        <em className="error invalid-feedback">{t("contactNotes:Notes.error_blank")}</em>
                      </div>
                    </Col>
                  </Row>
                  {CommonConfig.loggedInUserData().SecurityGroupName == "New Business" ?
                    (<Row>
                        <Col md="6">
                            <div className="input-box with-icon">
                                <label>Next Follow-Up Date & Time</label>
                                <Input type="datetime-local" id="DateTime" name="DateTime"
                                    value={this.state.DateTime}
                                    onChange={(e) => this.handleChange(e, 'DateTime')}>
                                </Input>
                            </div>
                        </Col>
                    </Row>)
                  : (null)}
                  <Row className="text-center">
                    <Col>
                      {(this.state.isNoteEdit) ?
                        (
                          (CommonConfig.loggedInUserData().SecurityGroupName == "New Business" ?
                          <div className="pull-right">
                            <BTN color="success" onClick={() => this.saveNotesNewBusiness()}><i class="fa fa-check"></i> Save</BTN>{' '}
                            <BTN color="primary" onClick={() => this.resetNewBusiness()}><i class="fa fa-angle-left"></i> Cancel</BTN>
                          </div>
                          :
                          <div className="pull-right">
                            <BTN color="success" onClick={() => this.saveNotes()}><i class="fa fa-check"></i> Save</BTN>{' '}
                            <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-angle-left"></i> Cancel</BTN>
                          </div>
                          )
                        ) : (
                          (CommonConfig.loggedInUserData().SecurityGroupName == "New Business" ?
                          <div className="pull-right">
                            <BTN color="success" onClick={() => this.saveNotesNewBusiness()}><i class="fa fa-check"></i> Save</BTN>{' '}
                            <BTN color="primary" onClick={() => this.resetNewBusiness()}><i class="fa fa-angle-left"></i> Cancel</BTN>
                          </div>
                          :
                          <div className="pull-right">
                            <BTN color="success" onClick={() => this.saveNotes()}><i class="fa fa-check"></i> Save</BTN>{' '}
                            <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-angle-left"></i> Cancel</BTN>
                          </div>
                          )
                        )
                      }
                    </Col>
                  </Row>
                </form>
              </Collapse>
            </Card>

            <div className="added-note-outer">
              <h4>{this.state.noteList.length} notes</h4>
              <ul>
                {this.state.noteList.map((notes, i) => {
                  return (
                    <li>
                      <div className="addednote-left">
                        <span style={{ color: notes.IsFlag.data[0] === 0 ? '#aaaaaa' : '#ff0000' }}><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span>
                        <h3>{notes.NoteType}</h3>
                        {/* {(CommonConfig.loggedInUserData().SecurityGroupName == "New Business") ?
                          (<div> */}
                              {(notes.ContactMode == null || notes.ContactMode == '') && (notes.RenewalMonth == null || notes.RenewalMonth == '' ) ? null:
                              <Row>
                                {notes.ContactMode == null || notes.ContactMode == ''? null :
                                <Col md='6'>
                                  <p><b>Contact Mode:</b> {notes.ContactMode}</p> 
                                </Col>
                                }
                                {notes.RenewalMonth == null || notes.RenewalMonth == ''? null:
                                <Col md='6'>
                                  <p><b>Renewal Month:</b> {notes.RenewalMonth}</p> 
                                </Col>
                                }
                              </Row>
                              }
                              {(notes.Response == null || notes.Response == '') && (notes.Reason == null || notes.Reason == '' ) ? null:
                              <Row>
                                {notes.Response == null || notes.Response == ''? null:
                                  <Col md="6">
                                    <p><b>Response:</b> {notes.Response}</p> 
                                  </Col>
                                }
                                <Col md='6'>
                                {notes.Reason == null || notes.Reason == '' ? null: <p><b>Reason: </b> {notes.Reason}</p> }
                                </Col>
                              </Row>
                              }
                              {notes.FollowUpDateTime == '0000-00-00 00:00:00' || notes.FollowUpDateTime == null || notes.FollowUpDateTime == "" ? null :
                                <Row>
                                  <Col>
                                    <p><b>Follow Up DateTime: </b> {moment(notes.FollowUpDateTime).format(CommonConfig.dateFormat.dateTime)}</p> 
                                  </Col>
                                </Row>
                             }
                            
                        <p>
                          <ShowMoreText
                            lines={2}
                            more='Show more'
                            less='Show less'
                            anchorClass=''
                            onClick={this.executeOnClick}
                            expanded={false}>
                            {notes.NoteText}
                          </ShowMoreText>
                        </p>
                        <Row>
                          <Col md='8'>
                            <p><b>Added By</b></p>
                            <span className="date"><i class="fa fa-user" aria-hidden="true"></i> {notes.CreatedByName +" " }</span>
                            <span className="date"><i class="fa fa-calendar" aria-hidden="true"></i> {moment(notes.CreatedOn).format(CommonConfig.dateFormat.dateTime)}
                            </span>
                          </Col>
                          {(notes.UpdatedByName != null) ? (
                            <Col md='8'>
                              <p><b>Updated By</b></p>
                              <span className="date"><i class="fa fa-user" aria-hidden="true"></i> {notes.UpdatedByName +" " }</span>
                              <span className="date"><i class="fa fa-calendar" aria-hidden="true"></i> {moment(notes.UpdatedOn).format(CommonConfig.dateFormat.dateTime)}</span>
                            </Col>
                          ) : (null)}
                        </Row>
                      </div>

                      {/* {(notes.NoteTitle == 'Manual Refer Policy' || notes.NoteTitle == 'Manual Refer Policy(H)' || notes.NoteTitle == 'Sum Insured Updated' || notes.NoteTitle == 'System Refer Policy' || notes.NoteTitle == 'System Refer Policy(H)' || notes.NoteTitle == 'Mooring Information Updated') ? (null) : (
                        <div className="addednote-right">
                          <Button type="button" icon="pi pi-pencil" tooltip="Edit" tooltipOptions={{ position: 'bottom' }} onClick={() => this.updateNotes(notes)}></Button>
                        </div>
                      )} */}
                    </li>
                  )
                })
                }
              </ul>
            </div>

          </ScrollPanel>

        </Sidebar>
      </div>
    );
  }
}

export default withTranslation()(PersonNotes);
