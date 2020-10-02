import React, { Component } from 'react';
import Stepper from 'react-js-stepper'
import { Col, Row, Modal, ModalBody, ModalHeader, ModalFooter, Button as BTN, Input } from 'reactstrap';
import { DataTable } from 'primereact/datatable';
import readXlsxFile from 'read-excel-file'
import { Column } from 'primereact/column';
import sampleCSV from "../../../assets/files/Bulk Import Binder Rating1.csv"
import uuid from "uuid";
import moment from 'moment';
import api from '../../../utils/apiClient';
import APIConstant from '../../../utils/constants';
import { CommonConfig } from '../../../utils/constants';
import { toast } from 'react-toastify';
const steps = [{ title: 'File Upload' }, { title: 'Check File Data' }, { title: 'Import Result' },]

export class BulkUpload extends Component {


    constructor(props) {

        super(props);
        let columns = [
            { field: "RowNum", header: "RowNum", sortable: true, filter: true, id: 0 },
            { field: "Country", header: "Country", sortable: true, filter: true, id: 0 },
            { field: "VesselClass", header: "VesselClass", sortable: true, filter: true, id: 1 },
            { field: "VesselType", header: "VesselType", sortable: true, filter: true, id: 2 },
            { field: "ValueFrom", header: "Value From", sortable: true, filter: true, id: 3 },
            { field: "ValueTo", header: "Value To", sortable: true, filter: true, id: 0 },
            { field: "Excess", header: "Excess", sortable: true, filter: true, id: 1 },
            { field: "BaseRateNewBusiness", header: "Base Rate(%)", sortable: true, filter: true, id: 2 },
            { field: "AbsoluteNewBusiness", header: "AbsoluteNewBusiness Rate(%)", sortable: true, filter: true, id: 2 },
            { field: "RateRenewal", header: "Rate Renewal Rate(%)", sortable: true, filter: true, id: 2 },
            { field: "AbsoluteRenewal", header: "Absolute Renewal Rate(%)", sortable: true, filter: true, id: 2 },
            { field: "Status", header: "Status", sortable: true, filter: true, id: 2 },
            { field: "ErrorMsg", header: "Error Message", sortable: true, filter: true, id: 2 },
        ];

        this.state = {
            currStep: 1,
            //for step one 
            fullReplaceMent: true,
            incremental: false,
            file: null,
            insertsucessRecord: [],
            //for step two 
            totalRecords: 0,
            recordWithError: 0,
            recordWithSucess: 0,
            cols: columns,
            fileData: [],
            totalfinaldata: [],
            selectedPage: 0,
            documentList: [],
            directoryList: [],
            selecteddirectory: '',
            selectedfile: '',
            headerId: '',
            operationType: '',
            file: '',
            fileError: true,
            Extension: '',
            FileName: '',
            BinderId: "",
            FileNameError: true,
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            //for step three
            totalRecordsInsert: 0,
            totalRecordsInsertSuccess: 0,
            totalRecordsInsertFail: 0,
            effectiveDate: moment().format("YYYY-MM-DD"),
        }
        this.fileOnChange = this.fileOnChange.bind(this)
        this.downloadErrorFile = this.downloadErrorFile.bind(this);

    }

    componentDidMount() {
        this.setState({ BinderId: this.props.BinderId })
    }

    show(field, condition) {
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        } else {
            document.getElementById(field).className = "form-control";
        }
    }

    handleOnClickStepper = (step) => {
        this.setState({ currStep: step });
    }

    handleOnClickNext1 = () => {
        this.upload()
    }

    handleOnClickNext = () => {
        let nextStep = this.state.currStep + 1;
        this.setState({ currStep: nextStep })
    }

    handleOnClickNext2 = () => {
        this.bulkInsertBinderRatingBands()
    }

    upload() {

        if (
            this.state.selectedfile !== "" &&
            this.state.FileNameError === false
        ) {
            var formData = new FormData();
            formData.append('directory', 'BinderRatingBands');
            formData.append('FileName', (this.state.FileName).trim());
            formData.append('Extension', this.state.Extension);
            formData.append('bulkImportDocument', this.state.selectedfile);
            formData.append('BinderId', this.state.BinderId);
            formData.append('SubBinderId', "");
            formData.append('UserId', CommonConfig.loggedInUserId());
            formData.append('inscreamental', this.state.fullReplaceMent == true ? "I" : "U");

            api.post(APIConstant.path.bulkInsertBinderRatingBands, formData).then(res => {
                if (res.success) {
                    toast.success("Binder File Uploaded With Validation");
                    this.setState({
                        headerId: res.data.headerId,
                        totalRecords: res.data.totalRecords,
                        recordWithSucess: res.data.successRecords,
                        recordWithError: res.data.errorRecords,
                        totalfinaldata: res.data.data,
                        fileData: res.data.data.map((obj) => {
                            return {
                                AbsoluteNewBusiness: obj.AbsoluteNewBusiness,
                                AbsoluteRenewal: obj.AbsoluteRenewal,
                                Status: obj.Status,
                                ErrorMsg: obj.ErrorMsg,
                                LanguageId: obj.LanguageId,
                                BulkImportDetailId: obj.BulkImportDetailId,
                                BulkImportHeaderId: obj.BulkImportHeaderId,
                                RowNum: obj.RowNum,
                                Country: obj.Country,
                                VesselClass: obj.VesselClass,
                                VesselType: obj.VesselType,
                                ValueFrom: obj.ValueFrom,
                                ValueTo: obj.ValueTo,
                                Excess: obj.Excess,
                                BaseRateNewBusiness: obj.BaseRateNewBusiness,
                                RateRenewal: obj.RateRenewal
                            }
                        })
                    })
                    let nextStep = this.state.currStep + 1;
                    this.setState({ currStep: nextStep })
                } else {
                }
            }).catch(err => {
                console.log(err)
            });
        }
        else {
            if (this.state.selectedfile === '' || this.state.selectedfile === undefined || this.state.selectedfile === null);
        }
    }

    bulkInsertBinderRatingBands() {
        debugger;
        try {
            const data = {
                operationType: this.state.fullReplaceMent == true ? "I" : "U",
                headerId: this.state.headerId,
                UserId: CommonConfig.loggedInUserId(),
                EffectiveDate: moment(this.state.effectiveDate).format("YYYY-MM-DD"),
            };
            api.post(APIConstant.path.insertRatingBandsFromDetail, data).then(res => {
                if (res.success) {
                    let nextStep = this.state.currStep + 1;

                    this.setState({
                        currStep: nextStep,
                        totalRecordsInsert: this.state.totalRecords,
                        totalRecordsInsertSuccess: res.data.affectedRows,
                        totalRecordsInsertFail: this.state.totalRecords - res.data.affectedRows
                    })
                } else {
                    console.log(res)
                }
            }).catch(err => {
                console.log(err)
            });
        } catch (error) {
            console.log(error)
        }
    }

    handleOnClickBack = () => {
        let prevStep = this.state.currStep - 1;
        this.setState({ currStep: prevStep, FileNameError: true, FileName: '', Extension: '' })
    }

    onFormSubmit(e) {
        e.preventDefault() // Stop form submit
        this.fileUpload(this.state.file).then((response) => {
            console.log(response.data);
        })
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.fileData.length) ? l : this.state.fileData.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.fileData.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    selectFile = (event) => {
        if (event.target.files && event.target.files[0]) {
            var docname = event.target.files[0].name.split('.').slice(0, -1).join('.');
            var ext = event.target.files[0].name.split('.').pop();
            this.setState({ selectedfile: event.target.files[0], FileName: docname, FileNameError: false, Extension: ext });
            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({ file: e.target.result });
            };
            reader.readAsDataURL(event.target.files[0]);
        }
        else {
            this.setState({ FileNameError: true, FileName: '', Extension: '' });
        }
    }

    fileOnChange(e) {
        this.setState({ file: e.target.files[0] })
        readXlsxFile(e.target.files[0]).then((rows) => {
            if (Array.isArray(rows)) {
                var sucessRecord = [];
                var errRecord = [];
                for (var i = 1; i < rows.length; i++) {
                    var temp = {
                        Country: rows[i][0],
                        Class: rows[i][1],
                        Type: rows[i][2],
                        ValueFrom: rows[i][3],
                        ValueTo: rows[i][4],
                        Excess: rows[i][5],
                        BaseRate: rows[i][6],
                    }
                    var insertdata = [
                        uuid.v4(),
                        this.state.BinderId,
                        rows[i][1],
                        rows[i][2],
                        rows[i][0],
                        rows[i][3],
                        rows[i][4],
                        rows[i][5],
                        0,
                        0,
                        rows[i][6],
                        0,
                        CommonConfig.loggedInUserId(),
                        "Active",
                        moment().format("YYYY-MM-DD"),
                        CommonConfig.loggedInUserId(),
                        moment().format("YYYY-MM-DD"),
                        moment().format("YYYY-MM-DD"),
                        moment().format("YYYY-MM-DD"),
                        "en-GB"
                    ]

                    this.state.insertsucessRecord.push(insertdata)
                    if (rows[i][0] == "" && rows[i][0] == null) {
                        errRecord.push(temp)
                    }
                    else {
                        sucessRecord.push(temp)
                    }
                }
                this.setState({
                    fileData: sucessRecord,
                    totalRecords: rows.length - 1,
                    recordWithSucess: sucessRecord.length,
                    recordWithError: errRecord.length
                })
            }
        })
    }

    download() {
        window.location.href = sampleCSV;
    }

    downloadErrorFile() {

        this.dt.exportCSV();
    }
    handleChange = (e) => {

        this.setState({ [e.target.name]: e.target.value });
        if (e.target.name === 'effectiveDate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ effectiveDateError: true });
                this.show("effectiveDate", true);
            } else {
                this.setState({ effectiveDateError: false, effectiveDate: e.target.value });
                this.show("effectiveDate", false);
            }
        }

    }

    renderfileUpload() {
        return <div>
            <div>Bulk Import Rating Bands for Binder</div>
            <div style={{ marginTop: '40px' }}>
                <Row>
                    <Col md="3">
                        <label>Import Type</label>
                    </Col>
                    <Col md="9">
                        <div className="rc-inline">
                            <label>
                                <Input type="radio" name="fullReplaceMent" checked={(this.state.fullReplaceMent)}
                                    value={this.state.radioSelected} onChange={() => this.setState({
                                        fullReplaceMent: true, incremental: false
                                    })} />
                                Full Replacement
                                </label><label>This Option will completly replace the existing band values with the file value being imported. the band values that are not specifield in new file will not be inactivated.</label>
                        </div>
                        <div className="rc-inline">
                            <label >
                                <Input type="radio" disabled={"disabled"} name="incremental" checked={(this.state.incremental)}
                                    value={this.state.radioSelected} onChange={() => this.setState({
                                        fullReplaceMent: false, incremental: true
                                    })} />
                                Incremental
                                                                </label>
                            <label>This Option will only add or update the band values with the file values being imported. The band values that are not specified in the file will stay intact.</label>
                        </div>

                        {/* <label>New Business Rate (%)</label> */}
                    </Col>
                </Row>
                <div style={{ marginTop: '40px' }}>
                    <BTN onClick={this.download}>Download Sample File </BTN>
                </div>
                <div style={{ marginTop: '40px' }}>
                    <Row>
                        <Col md="3">
                            <label>Specify File to Import</label>
                        </Col>
                        <Col md="9">
                            <form onSubmit={this.onFormSubmit}>
                                <input accept=".csv" type="file" onChange={this.selectFile} />
                            </form>
                        </Col>
                    </Row>
                </div>

                <ModalFooter>
                    <BTN color="success" onClick={() => this.handleOnClickNext1()}> Check File Data  <i class="fa fa-arrow-right"></i></BTN>{' '}
                </ModalFooter>
            </div>
        </div>
    }

    rendercheckFiledata() {
        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} />;
        });
        return <div>
            <div style={{ paddingTop: '40px' }}>
                <Row>
                    <Col md="3">
                        <label>Total Records in file : {this.state.totalRecords}</label>
                    </Col>
                    <Col md="3">
                        <label>Record With Error : {this.state.recordWithError}</label>
                    </Col>
                    <Col md="6">
                        <label>Record With Successful Data Check : {this.state.recordWithSucess}</label>
                    </Col>
                </Row>
                <div className="table-custom">
                    <DataTable ref={(el) => this.dt = el} value={this.state.fileData} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} totalRecords={this.state.fileData.length} exportFilename="Binder Rating Error List"
                        currentPageReportTemplate={this.state.str} scrollable={true} scrollHeight="250px"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                        responsive={true} resizableColumns={true} columnResizeMode="fit"
                        scrollable={true} scrollHeight="265px">
                        {columns}
                    </DataTable></div>
                <Row style={{ padding: '10px 0px' }}>
                    <Col md="2">
                        <label>Effective Date</label>
                    </Col>
                    <Col md="3">
                        <Input type="date" name="effectiveDate" id="effectiveDate" onChange={(e) => this.handleChange(e)} value={this.state.effectiveDate}
                            min={moment().format('YYYY-MM-DD')}
                            max={moment().add(100, 'years').format('YYYY-MM-DD')}
                        >
                        </Input>
                        <em className="error invalid-feedback" >Please Enter Valid Effective Date</em>
                    </Col>
                </Row>
            </div>
            <ModalFooter>
                {(this.state.recordWithError > 0) ? (<BTN onClick={this.downloadErrorFile}>Download File </BTN>) : ''}
                <BTN color="success" onClick={() => this.handleOnClickBack()}><i class="fa fa-arrow-left"></i>  Back</BTN>{' '}
                {(this.state.recordWithError > 0 || this.state.effectiveDate == "") ?
                    (<BTN color="success" disabled={"disabled"} onClick={() => this.handleOnClickNext2()}> Proceed with import  <i class="fa fa-arrow-right"></i></BTN>)
                    : (<BTN color="success" onClick={() => this.handleOnClickNext2()}> Proceed with import  <i class="fa fa-arrow-right"></i></BTN>)
                }

            </ModalFooter>
        </div>
    }

    renderimportresult() {
        var handleCallBack = this.props.handleCallBack;
        return <div>

            <Col>
                <Row>
                    <i style={{ color: "#00ff00", fontSize: 70 }} color="success" class="fa fa-check-circle"></i>
                </Row>
                <Row>
                    <label>{this.state.totalRecordsInsertSuccess} Record Importd </label>
                </Row>
                <Row>
                    <label>{this.state.totalRecordsInsertFail} Record Importd Fail</label>
                </Row>
                <Row>
                    <label>Data Imported Sucessfully! </label>
                </Row>
            </Col>


            <ModalFooter>
                <BTN color="primary" onClick={() => this.setState({
                    currStep: 1
                }
                )}>  Import Again</BTN>{' '}
                <BTN color="success" onClick={() => handleCallBack(false)}> Ok  <i class="fa fa-check"></i></BTN>{' '}
            </ModalFooter>
        </div>
    }


    render() {
        return <div>
            <Stepper
                steps={steps}
                activeStep={this.state.currStep}
                onSelect={this.handleOnClickStepper}
                showNumber={true}
            />
            <div style={{ marginTop: '40px' }}>
                {this.state.currStep === 1 ? this.renderfileUpload() :
                    this.state.currStep === 2 ? this.rendercheckFiledata() : this.state.currStep === 3 ? this.renderimportresult() :
                        <div></div>
                }
            </div>

        </div>;
    }
}
