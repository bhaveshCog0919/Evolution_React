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


class TESTPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            custom: true,
            messagetype: 'SMS',

            policyCount: 0,

            templateList: [],
            templateId: '',

            editMessageField:false,
            
            DynamicTemplateList:[],
            DynamicTemplateId:'',

            templateNote: '',

            updateTemplate:false,

            loginId: CommonConfig.loggedInUserId()

        };
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    }

    componentDidMount() {
        this.getSmsEmailTemplate();
        this.getSmsEmailCount();
    }

    sendSMSEMAIL(){
        let data = {};
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
                        value: element.MessageTemplateId,
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
                this.state.templateList=[];
                res.data.forEach(element => {
                    var data = {
                        value:element.MessageTemplateId,
                        label:element.TamplateName
                    }
                    this.state.templateList.push(data);
                });
            }
        });
    }

    getSmsEmailCount() { 
        let data = {
            // messagetype: this.state.messagetype,
            // templateId: this.state.templateId,
            loginId: this.state.loginId,
        };
        api.post('api/getSmsEmailCount', data).then(res => {
            debugger;
            if (res.success) {
            }
        });
    }

    testRenewalSendEmail() {
        let data = {
            // messagetype: this.state.messagetype,
            // templateId: this.state.templateId,
            loginId: this.state.loginId,
        };
        api.post('api/testRenewalSendEmail', data).then(res => {
            debugger;
            if (res.success) {
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

    editMessageField(){
        this.setState({ editMessageField: !this.state.editMessageField});
        this.getDinamicField();
    }
    selectType(value, type) {
        if (value === '' || value === undefined || value === null) {
            this.setState({ [type]: '' });
        } else {
            this.setState({ [type]: value.value });
        }
    }

    handleDetailsChange(evt) {
        const data = evt.editor.getData();
        if (CommonConfig.isEmpty(data)) {
            this.setState({  templateNote: '' });
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
                        <h5 className="m-0 p-0">Cognisun Testing Page</h5>
                    </CardHeader>
                    <Collapse isOpen={this.state.custom} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                        <CardBody>
                            <div className="filter-data">
                                <Row style={{marginBottom:'25px'}}>
                                    <Col md='1'>
                                        <div>
                                            <BTN color="success" title="Sent" onClick={() => this.testRenewalSendEmail()}>Test Renewal SendEmail</BTN>
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
export default withTranslation()(TESTPage);