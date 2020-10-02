import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, Button as BTN } from 'reactstrap';
import api from '../../utils/apiClient';
import APIConstant from '../../utils/constants';
import moment from 'moment';
import { CommonConfig } from '../../utils/constants';
import { apiBase } from '../../utils/config';
import ShowMoreText from 'react-show-more-text';
import { useTranslation, withTranslation, Trans } from 'react-i18next';

class Notes extends Component {
  constructor(props) {
    super(props);
    console.log("props",props);

    let columns = [
      { field: "id", header: "Id", sortable: true, filter: false, id: 0 },
      { field: "category", header: "category", sortable: true, filter: true, id: 1 },
      { field: "user", header: "User", sortable: true, filter: true, id: 2 },
      { field: "title", header: "Title", sortable: true, filter: true, id: 3 },
      { field: "note", body: this.noteTemplate.bind(this), header: "note", sortable: true, filter: true, id: 4 },
      { field: "created", header: "Created", sortable: true, filter: false, id: 5 },
      { field: "updated", header: "Updated", sortable: true, filter: false, id: 6 },
      { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, id: 7 }
    ];
    const NType = [
      { label: 'Policy', value: 'Policy' },
      { label: 'Claim', value: 'Claim' }
    ];
    this.state = {
      toggleModal: false,
      cols: columns,
      arr: [],
      isImportant: 1,
      Notes: '',
      Type: [],
      notesType: '',
      notestitle: '',
      notesdescription: '',
      notestitleError: true,
      notesdescriptionError: true,
      NotesTypeError: true,
      noteID: '',
      isNoteEdit: false,
      EntityId: 'fddf9f64-0f38-4ebb-81d4-0e52f548f549',
      EntityType: 'Organization',

      userImg: '',
      userImgData: '',
      noteaddon: '',

      str: '',
      rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
      rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
      selectedPage: 0,
      titleNote: "Add",
      LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
    };
    this.colOptions = [];
    for (let col of columns) {
      this.colOptions.push({ label: col.header, value: col });
    }
    this.onColumnToggle = this.onColumnToggle.bind(this);
    this.onBrandChange = this.onBrandChange.bind(this);
    this.export = this.export.bind(this);
  }

  componentDidMount() {
    this.getNoteList();
    this.getNotesType();
  }

  getNoteList() {
    api.post('api/getNotes', {}).then(res => {
      if (res.success) {
        var formattedData = [];
        console.log('erfwefcafc', res.data);

        for (var i = 0; i < res.data.length; i++) {
          formattedData.push({
            id: [i + 1],
            noteID: res.data[i].NoteId,
            category: res.data[i].NoteType,
            user: res.data[i].EntityName,
            title: res.data[i].NoteTitle,
            note: res.data[i].NoteText,
            created: moment(res.data[i].CreatedOn).format(CommonConfig.dateFormat.dateTime),
            updated: res.data[i].UpdatedOn != null ? moment(res.data[i].UpdatedOn).format(CommonConfig.dateFormat.dateTime) : '',
            link: res.data[i].Link,
          })
        }
        let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
        let str = '1 to ' + lastPage + ' out of ' + formattedData.length + ' records';
        this.setState({ arr: formattedData, str: str });
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
        console.log('NOTETYPE', res);

        if (res.success) {
          this.setState({ Type: res.data });
        } else {

        }
      }).catch(err => {

      });
    } catch (error) {

    }
  }

  getPageString = (e) => {
    let firstPage = e.first + 1;
    let l = e.rows * (e.page + 1);
    let lastPage = (l < this.state.arr.length) ? l : this.state.arr.length
    var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.arr.length + ' records';
    this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
  }

  updateNotes = (rowdata) => {
    this.setState({
      isNoteEdit: true, notesdescription: rowdata.note, notesdescriptionError: false,
      notestitle: rowdata.title, notestitleError: false,
      notesType: rowdata.category, NotesTypeError: false,
      noteID: rowdata.noteID,
      userImg: apiBase + rowdata.link,
      titleNote: "Edit"
    });
    this.show("notestitle", false);
    this.show("notesdescription", false);
    this.show('notesType', false);
  }

  DeleteNotesModal = (rowdata) => {
    this.setState({ noteID: rowdata.noteID });
    this.openModal(rowdata);
  }

  DeleteNotes = (noteID) => {
    api.post('api/deleteNote', { noteId: noteID }).then(res => {
      if (res.success) {
        this.reset();
        this.openModal();
        toast.success('Notes deleted successful!');
        this.getNoteList();
      } else {

      }
    }).catch(err => {
    });
  }

  reset = () => {
    this.setState({
      isNoteEdit: false, notesdescription: '', notesdescriptionError: true,
      notestitle: '', notestitleError: true,
      notesType: '', NotesTypeError: true,
      noteID: '', userImg: '', userImgData: '', noteaddon: '', titleNote: "Add"
    });
    this.show("notestitle", false);
    this.show("notesdescription", false);
    this.show('notesType', false);
    document.getElementById("noteaddon").value = null;
  }

  executeOnClick(isExpanded) {
  }

  noteTemplate(rowData, column) {
    return <div>
      <ShowMoreText
        lines={3}
        more='Show more'
        less='Show less'
        anchorClass=''
        onClick={this.executeOnClick}
        expanded={false}>
        {rowData.note}
      </ShowMoreText>
    </div>;
  }

  actionTemplate(rowData, column) {
    return <div>
      <Button type="button" icon="pi pi-pencil" style={{ margin: 2 }} tooltip="Edit" tooltipOptions={{ position: 'bottom' }} onClick={() => this.updateNotes(rowData)}></Button>
      <Button type="button" icon="pi pi-trash" style={{ margin: 2 }} tooltip="Delete" tooltipOptions={{ position: 'bottom' }} onClick={() => this.DeleteNotesModal(rowData)}></Button>
    </div>;
  }

  onBrandChange(event) {
    this.dt.filter(event.value, 'brand', 'equals');
    this.setState({ brand: event.value });
  }

  export() {
    this.dt.exportCSV();
  }

  openModal() {
    this.setState({ toggleModal: !this.state.toggleModal });
  }

  toggleLarge = () => {
    this.setState({ toggleModal: false });
  }

  onColumnToggle(event) {
    let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
    this.setState({ cols: valueInOrder });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === 'notestitle') {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({ notestitleError: true });
        this.show("notestitle", true);
      } else {
        this.setState({ notestitleError: false, notestitle: e.target.value });
        this.show("notestitle", false);
      }
    }
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

  selectImage = (event) => {

    if (event.target.files && event.target.files[0]) {
      this.setState({ userImgData: event.target.files[0] });
      let reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ userImg: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);

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

  saveNotes = () => {
    if (
      this.state.notestitleError === false &&
      this.state.NotesTypeError === false &&
      this.state.notesdescriptionError === false
    ) {
      const NotesForm = new FormData();
      NotesForm.append('noteId', this.state.noteID);
      NotesForm.append('notetitle', this.state.notestitle.trim());
      NotesForm.append('notesType', this.state.notesType);
      NotesForm.append('notesdescription', this.state.notesdescription.trim());
      NotesForm.append('entityid', this.state.EntityId);
      NotesForm.append('entitytype', this.state.EntityType);
      NotesForm.append('isflag', this.state.isImportant);
      NotesForm.append('loggedInUserId', CommonConfig.loggedInUserId());
      NotesForm.append('languageId', this.state.LanguageId);

      if (this.state.userImgData && this.state.userImgData != '' && this.state.userImgData != undefined && this.state.userImgData != null) {
        NotesForm.append('notesAddOn', this.state.userImgData);
      }
      api.post('api/addNotes', NotesForm).then(res => {

        if (res.success) {
          document.getElementById("noteaddon").value = null;
          this.reset();
          if (res.data.affectedRows) {
            toast.success('Notes updated successfully');
          } else {
            toast.success('Notes added successfully');
          }
          toast.success(res.message);
          this.getNoteList();
        } else {

        }
      }).catch(err => {
      });
    } else {
      this.show("notestitle", this.state.notestitleError);
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

  render() {
    var header = <div>
      <Row>
        <Col xs="12" md="12" style={{ padding: 20 }}>
          <Row>
            <Col xs="12" md="12">
              <h4 style={{ float: 'left' }}>{this.state.titleNote} Notes</h4>
            </Col>
          </Row>
          <form onSubmit={this.handleSubmit}>
            <Row style={{ marginTop: 10 }}>
              <Col md="3">
                <div className="input-box">
                  <label>Note Title*</label>
                  <Input type="text" name="notestitle" id="notestitle" onChange={e => this.handleChange(e)} placeholder="Note Title" size="30" value={this.state.notestitle} />
                  <em className="error invalid-feedback"> Please enter note title </em>
                </div>
              </Col>
              <Col md="3">
                <div className="input-box">
                  <label>Notes Type*</label>
                  <Input type="select" name="notesType" id="notesType" onChange={(e) => this.selectType(e.target.value, 'notesType')} value={this.state.notesType}>
                    <option value=''>Select Notes Type</option>
                    {this.state.Type.map((ct, i) => {
                      return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
                    })
                    }
                  </Input>
                  <em className="error invalid-feedback"> Please select note type </em>
                </div>
              </Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Col md="9">
                <div className="input-box">
                  <label>Notes*</label>
                  <Input type="textarea" name="notesdescription" id="notesdescription" rows={5} cols={50} placeholder="please write note" value={this.state.notesdescription} onChange={e => this.handleChange(e)} autoResize={true} />
                  <em className="error invalid-feedback"> Please enter note </em>
                </div>
              </Col>
              <Col md="3">
                <div className="input-box">
                  <label>Notes Addon</label>
                  <Input type="file" name="noteaddon" id="noteaddon" onChange={this.selectImage} />
                </div>
              </Col>
            </Row>
            <Row className="text-center">
              <Col>
                {(this.state.isNoteEdit) ?
                  (
                    <div>
                      <div className="pull-right">
                        <BTN color="success" onClick={() => this.saveNotes()}><i class="fa fa-check"></i> Update</BTN>{' '}
                        <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-angle-left"></i> Cancel</BTN>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="pull-right">
                        <BTN color="success" onClick={() => this.saveNotes()}><i class="fa fa-check"></i> Save</BTN>{' '}
                        <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-angle-left"></i> Cancel</BTN>
                      </div>
                    </div>
                  )
                }
              </Col>
            </Row>
          </form>
        </Col>
        <Col xs="4" md="4">
          <div style={{ textAlign: 'left' }}>
            <MultiSelect value={this.state.cols} options={this.colOptions} onChange={this.onColumnToggle} style={{ width: '50px' }} fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column" />
          </div>
        </Col>
        <Col xs="4" md="4">
          <div className="content-section introduction">
            <div className="feature-intro">
              <h1>Notes</h1>
            </div>
          </div>
        </Col>
        <Col xs="4" md="4">
          <div style={{ 'textAlign': 'right' }}>
            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="30" style={{ marginBottom: 10 }} />
            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
            <Button type="button" icon="pi pi-external-link" style={{ margin: 2 }} tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export}></Button>
          </div>
        </Col>
      </Row>
    </div>;

    let columns = this.state.cols.map((col, i) => {
      return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} />;
    });

    return (
      <div>
        <div className="table-custom">
          <DataTable ref={(el) => this.dt = el} value={this.state.arr}
            currentPageReportTemplate={this.state.str} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
            paginator={true} rows={this.state.rowsPerPage} header={header} exportFilename="Notes"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown "
            rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
            responsive={true} resizableColumns={true} columnResizeMode="fit">
            {columns}
          </DataTable>
        </div>

        <Modal isOpen={this.state.toggleModal} toggle={this.toggleLarge}
          className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.toggleLarge}>Delete Notes</ModalHeader>
          <ModalBody>
            Are you sure you want to delete note?
          </ModalBody>
          <ModalFooter>
            <BTN color="success" onClick={() => this.DeleteNotes(this.state.noteID)}><i class="fa fa-check"></i> Yes</BTN>{' '}
            <BTN color="primary" onClick={this.toggleLarge}><i class="fa fa-angle-left"></i> Cancel</BTN>
          </ModalFooter>
        </Modal>

      </div>
    );
  }
}

// export default Notes;
export default withTranslation()(Notes);