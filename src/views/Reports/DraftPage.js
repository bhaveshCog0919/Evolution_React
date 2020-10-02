import React, { Component } from 'react';
import { Modal, Collapse, Button as BTN, ModalHeader, Card, CardHeader, CardBody, Col, Row, Input, Form } from 'reactstrap';
import { Button } from 'primereact/button';
import api from '../../utils/apiClient';
import { withTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import 'react-toastify/dist/ReactToastify.css';
import { CommonConfig } from '../../utils/constants';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import APIConstant from '../../utils/constants';
import Select from 'react-select';
import 'react-select/dist/react-select.min.css';
import { off } from 'codemirror';
import { toast } from 'react-toastify';
import CKEditor from 'ckeditor4-react';


class DraftPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            custom: true,
            messagetype: 'SMS',

            policyCount: 0,

            templateList: [],
            templateId: '',

            editMessageField: false,

            DynamicTemplateList: [],
            DynamicTemplateId: '',
            addRecipientSmsEmailData: [],
            templateNote: '',

            updateTemplate: false,
            batchMessageHeaderId: localStorage.getItem('batchMessageHeaderId'),
            loginId: CommonConfig.loggedInUserId()

        };
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    }

    componentDidMount() {

        this.getSmsEmailTemplate();
        this.getSmsEmailCount();
    }

    SentData() {
        let data = {
            templateId: this.state.templateId,
            custom: this.state.custom,
            messagetype: this.state.messagetype,

            policyCount: this.state.policyCount,
            getSmsEmailCount: this.state.getSmsEmailCount,
            templateList: this.state.templateList,
            templateId: this.state.templateId,

            editMessageField: this.state.editMessageField,

            DynamicTemplateList: this.state.templateId,
            DynamicTemplateId: this.state.DynamicTemplateId,

            templateNote: this.state.templateNote,

            updateTemplate: this.state.updateTemplate,

            loginId: this.state.loginId,
            batchMessageHeaderId: localStorage.getItem('batchMessageHeaderId'),
        };
        api.post('api/sendSMSEMAIL', data).then(res => {
            if (res.success) {
            }
        });
    }

    getDinamicField() {
        let data = {
            messagetype: this.state.messagetype,
            templateId: this.state.templateId,
            loginId: this.state.loginId,
        };
        api.post('api/getDinamicField', data).then(res => {
            debugger;
            if (res.success) {
                this.state.DynamicTemplateList = [];
                res.data.forEach(element => {
                    var data = {
                        value: element.TamplateName,
                        label: element.TamplateName
                    }
                    this.state.DynamicTemplateList.push(data);
                });
            }
        });
    }

    getSmsEmailTemplate() {
        let data = {
            messagetype: this.state.messagetype,
            // templateId: this.state.templateId,
            loginId: this.state.loginId,
        };
        api.post('api/getSmsEmailTemplate', data).then(res => {
            debugger;
            if (res.success) {
                this.state.templateList = [];
                this.setState({ templateListdata: res.data });
                res.data.forEach(element => {
                    var data = {
                        value: element.MessageTemplateId,
                        label: element.TamplateName
                    }
                    this.state.templateList.push(data);
                });
            }
        });
    }

    getSmsEmailCount() {
        let data = {
            batchMessageHeaderId: localStorage.getItem('batchMessageHeaderId'),
            loginId: this.state.loginId,
        };
        api.post('api/getSmsEmailCount', data).then(res => {
            debugger;
            if (res.success) {
                this.setState({
                    getSmsEmailCount: res.data,
                    policyCount: res.data.length
                });
            }
        });
    }


    onRadioBtnClick(radioType, radioSelected) {
        this.setState({ [radioType]: radioSelected });
        this.getSmsEmailTemplate();
        this.getDinamicField();
    }

    componentWillUpdate(nextProps) {

    }

    editMessageField() {
        this.setState({ editMessageField: !this.state.editMessageField });
        this.getDinamicField();
    }
    selectType(value, type) {
        if (value === '' || value === undefined || value === null) {
            this.setState({ [type]: '' });
        } else {
            this.setState({ [type]: value.value });
            debugger;
            if (type == 'templateId') {
                this.state.templateListdata.forEach(element => {
                    // this.setState({ templateNote: '' });
                    if (element.MessageTemplateId == value.value) {

                        this.setState({ templateNote: element.TemplateMessage });
                    }
                });
            }
            else if (type == 'DynamicTemplateId') {
                var note = this.state.templateNote;
                note = note + value.value;
                this.setState({ templateNote: note });
            }
        }
    }

    handleDetailsChange = (evt) => {
        const data = evt.editor.getData();
        if (CommonConfig.isEmpty(data)) {
            this.setState({ templateNote: '' });
        } else {
            this.setState({ templateNote: data });
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        const { t } = this.props;
        var header = null;

        return (
            <div className="input-box" id="accordion">
                <Card className="mb-0">
                    <CardHeader id="headingOne">
                        <h5 className="m-0 p-0">Draft message</h5>
                    </CardHeader>
                    <Collapse isOpen={this.state.custom} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                        <CardBody>
                            <div className="filter-data">
                                <Row>
                                    <Col md='2'>
                                        <div className="input-box">
                                            <label style={{ marginTop: '10px' }}>You have Selected: {this.state.policyCount}</label>
                                        </div>
                                    </Col></Row>
                                <Row style={{ marginBottom: '25px' }}>
                                    <Col md='2'>
                                        <div className="input-box">
                                            <label style={{ marginTop: '10px' }}>Message Type</label>
                                        </div>
                                    </Col>
                                    <Col md='1'>
                                        <div className="input-box">
                                            <label style={{ marginTop: '10px' }}>
                                                <Input type="radio" name="messagetype" checked={(this.state.messagetype === 'SMS') ? true : false} value={this.state.messagetype} onClick={() => this.onRadioBtnClick('messagetype', 'SMS')} />SMS</label>
                                        </div>
                                    </Col>
                                    <Col md='1'>
                                        <div className="input-box">
                                            <label style={{ marginTop: '10px' }}>
                                                <Input type="radio" name="messagetype" checked={(this.state.messagetype === 'EMAIL') ? true : false}
                                                    value={this.state.messagetype} onClick={() => this.onRadioBtnClick('messagetype', 'EMAIL')} />EMAIL</label>
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{ marginBottom: '25px' }}>
                                    <Col md='2'>
                                        <div className="input-box">
                                            <label style={{ marginTop: '10px' }}>Select SMS/Email Template</label>
                                        </div>
                                    </Col>
                                    <Col md='2'>
                                        <div className="input-box">
                                            <Select name="templateId" id="templateId" options={this.state.templateList}
                                                value={this.state.templateId} onChange={(data) => this.selectType(data, 'templateId')}
                                            />
                                        </div>
                                    </Col>

                                </Row>
                                <Row style={{ marginBottom: '25px' }}>
                                    <Col md='1'>
                                        <div><BTN color="success" title="Edit" onClick={() => this.editMessageField()}>Edit</BTN></div></Col>
                                    <Col md='2'>
                                        {(this.state.editMessageField) ? (<div className="input-box">
                                            <label style={{ marginTop: '10px' }}>Pick Dynamic Field</label>
                                        </div>) : (null)}

                                    </Col>
                                    <Col md='2'>
                                        {(this.state.editMessageField) ? (<div className="input-box">
                                            <Select name="DynamicTemplateId" id="DynamicTemplateId" options={this.state.DynamicTemplateList}
                                                value={this.state.DynamicTemplateId} onChange={(data) => this.selectType(data, 'DynamicTemplateId')}
                                            />
                                        </div>) : (null)}
                                    </Col>

                                </Row>
                                <Row style={{ marginBottom: '25px' }}>
                                    <Col md='1'>{(this.state.messagetype == 'SMS') ? (
                                        <div className="input-box">
                                            <label style={{ marginTop: '10px' }}>Message</label>
                                        </div>) : (<div className="input-box">
                                            <label style={{ marginTop: '10px' }}>Email</label>
                                        </div>)}
                                    </Col>
                                    <Col md='11'>
                                        {(this.state.messagetype == 'SMS') ? (
                                            <div className="input-box">
                                                <label style={{ marginTop: '10px' }}>
                                                    <Input name="templateNote" type="textarea" id="templateNote" className="" onChange={e => this.handleChange(e)} value={this.state.templateNote} />
                                                </label>
                                            </div>) : (<CKEditor name="templateNote" id="templateNote" data={this.state.templateNote} onChange={this.handleDetailsChange} />)}
                                    </Col>
                                </Row>
                                <Row style={{ marginBottom: '25px' }}>
                                    <Col md='2' style={{ marginLeft: '25px' }}>
                                        <div className="input-box">
                                            <label style={{ marginTop: '10px' }}>
                                                <Input type="radio" name="updateTemplate" checked={(this.state.updateTemplate === 'yes') ? true : false}
                                                    value={this.state.updateTemplate} onClick={() => this.onRadioBtnClick('updateTemplate', 'yes')} />Update Template</label>
                                        </div>
                                    </Col>
                                    <Col md='1'>
                                        <div>
                                            <BTN color="success" title="Sent" onClick={() => this.SentData()}>Send</BTN>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </CardBody>
                    </Collapse>
                </Card>
            </div>
        );
    }

}
export default withTranslation()(DraftPage);