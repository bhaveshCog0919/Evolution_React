import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Sidebar } from 'primereact/sidebar';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Col, Row, Input, Button as BTN } from 'reactstrap';
import api from '../../utils/apiClient';
import APIConstant from '../../utils/constants';
import moment from 'moment';
import { CommonConfig } from '../../utils/constants';
import { withTranslation } from 'react-i18next';
import ShowMoreText from 'react-show-more-text';

class x_PersonNotes extends Component {
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
      EntityId: '20ee69f7-4895-4d9d-87d1-d440e4f8810b',
      EntityType: 'User'
    };
  }

  componentDidMount() {
    this.getNoteList();
    this.getNotesType();
  }

  getNoteList() {
    const data = {
      'entityid': this.state.EntityId,
      'entitytype': this.state.EntityType,
      'CurrentUser': CommonConfig.loggedInUserData().EntityId

    };
    // api.post('api/getNotes', data).then(res => {
      api.post('api/getNewBusineesNotes', data).then(res => {
      if (res.success) {
        this.setState({ noteList: res.data });
      } else {

      }
    }).catch(err => {

    });
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

  show(field, condition) {
    if (condition) {
      document.getElementById(field).className = "form-control is-invalid";
    } else {
      document.getElementById(field).className = "form-control";
    }
  }

  selectType(value, type) {
    if (value === '' || value === null) {
      this.setState({ NotesTypeError: true, notesType: value });
      this.show('notesType', true);
    } else {
      this.setState({ NotesTypeError: false, notesType: value });
      this.show('notesType', false);
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
  }

  updateNotes = (data) => {
    this.setState({
      isNoteEdit: true, notesdescription: data.NoteText, notesdescriptionError: false,
      notesType: data.NoteType, NotesTypeError: false, isImportant: data.IsFlag.data[0],
      noteID: data.NoteId
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
        <Sidebar showCloseIcon={false} blockScroll={true} visible={this.state.visible} position="right" onHide={(e) => this.HideSideBar()} style={{ width: 450 }}>
          <div style={{ padding: "20px" }}>
            <Row>
              <Col xs="12" md="12">
                <Row>
                  {(this.state.isNoteEdit)?<h4>{t("contactNotes:editNotes")}</h4>:<h4>{t("contactNotes:addNotes")}</h4>}
                </Row>
                <form onSubmit={this.handleSubmit} style={{ borderBottomStyle: 'solid', borderBottomWidth: 1, borderBottomColor: "#d8d6d6", paddingBottom: 10 }}>
                  <Row>
                    <Col md="3" style={{ padding: 0 }}>
                      <label>{t("contactNotes:NotesType.label")}*</label>
                    </Col>
                    <Col md="8">
                      <div className="input-box">
                        <Input type="select" name="notesType" id="notesType" onChange={(e) => this.selectType(e.target.value, 'notesType')} value={this.state.notesType}>
                          <option value=''>{t("contactNotes:NotesType.placeholder")}</option>
                          {this.state.Type.map((ct, i) => {
                            return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                          })
                          }
                        </Input>
                        <em className="error invalid-feedback">{t("contactNotes:NotesType.error_blank")}</em>
                      </div>
                    </Col>
                    <Col md="1">
                      <a title={t("contactNotes:ImportantNotes")} href="javascript:void(0)" onClick={() => this.Important()} style={{ color: this.state.isImportant === 0 ? '#aaaaaa' : '#ff0000', fontSize: 25 }}>!</a>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="3" style={{ padding: 0 }}>
                      <label>{t("contactNotes:Notes.label")}*</label>
                    </Col>
                    <Col md="9">
                      <div className="input-box">
                        <Input type="textarea" name="notesdescription" id="notesdescription" placeholder={t("contactNotes:Notes.placeholder")} value={this.state.notesdescription} onChange={e => this.handleChange(e)} autoResize={true} />
                        <em className="error invalid-feedback">{t("contactNotes:Notes.error_blank")}</em>
                      </div>
                    </Col>
                  </Row>
                  <Row className="text-center">
                    <Col>
                      {(this.state.isNoteEdit) ?
                        (
                          <div className="pull-right">
                            <BTN color="success" onClick={() => this.saveNotes()}><i class="fa fa-check"></i> Update</BTN>{' '}
                            <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-angle-left"></i> Cancel</BTN>
                          </div>
                        ) : (
                          <div className="pull-right">
                            <BTN color="success" onClick={() => this.saveNotes()}><i class="fa fa-check"></i> Save</BTN>{' '}
                            <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-angle-left"></i> Cancel</BTN>
                          </div>
                        )
                      }
                    </Col>
                  </Row>
                </form>
              </Col>
            </Row>
            <p style={{ textAlign: "left", marginTop: "5px", marginBottom: "5px", fontWeight: "bold" }}>{this.state.noteList.length} notes</p>

            <Row className="remove-margin">
              <Col xs="12" md="12" style={{ textAlign: 'center', borderStyle: "solid", borderWidth: 1, borderRadius: 5, padding: 10, backgroundColor: "#ffffff" }}>
                <ScrollPanel style={{ width: '100%', height: '300px' }}>
                  <div className="content-section introduction">
                    {this.state.noteList.map((notes, i) => {

                      return (<div className="notes-listing" style={{ borderBottom: "1px solid #000" }}>
                        <Row style={{ marginTop: "10px" }}>
                          <Col xs="1" md="1">
                            <a title={notes.IsFlag.data[0] === 0 ? "Normal" : "Important"} href="javascript:void(0)" style={{ color: notes.IsFlag.data[0] === 0 ? '#aaaaaa' : '#ff0000', fontSize: 25 }}>!</a>
                          </Col>
                          <Col xs="10" md="9">
                            <div className="notes-detail" style={{ textAlign: "left" }}>
                              <h5><b>{notes.NoteType}</b></h5>
                              <ShowMoreText
                                // style = {{ color:"#4688F4" }}
                                lines={2}
                                more='Show more'
                                less='Show less'
                                anchorClass=''
                                onClick={this.executeOnClick}
                                expanded={false}>
                                {notes.NoteText}
                              </ShowMoreText>
                              {/* <p style={{ textAlign: "justify" }}>{notes.notetext}</p> */}
                            </div>
                            <div className="notes-sender-details" style={{ textAlign: "right", marginTop: 10 }}>
                              <p><b>{notes.EntityName}</b>  {moment(notes.StartDate).format(CommonConfig.dateFormat.dateTime)}</p>
                            </div>
                          </Col>
                          <Col xs="1" md="2">
                            <Button type="button" icon="pi pi-pencil" tooltip="Edit" tooltipOptions={{ position: 'bottom' }} onClick={() => this.updateNotes(notes)}></Button>
                          </Col>
                        </Row>
                      </div>)
                    })
                    }
                  </div>
                </ScrollPanel>
              </Col>
            </Row>
          </div>
        </Sidebar>
      </div>
    );
  }
}

export default withTranslation()(x_PersonNotes);
