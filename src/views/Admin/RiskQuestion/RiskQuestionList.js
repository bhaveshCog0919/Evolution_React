import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, Button as BTN } from 'reactstrap';
import api from '../../../utils/apiClient';
import APIConstant from '../../../utils/constants';
import { CommonConfig } from '../../../utils/constants';


class RiskQuestionList extends Component {
    constructor() {
        super();

        let columns = [
            { field: "QuestionCategoryName", header: "Category", sortable: true, filter: true, id: 0 },
            { field: "QuestionGroupName", header: "Group", sortable: true, filter: true, id: 1 },
            { field: "QuestionCode", header: "Question Code", sortable: true, filter: true, id: 2 },
            { field: "RiskQuestion", header: "Question", sortable: true, filter: true, id: 3 },
            { field: "IsRateable", header: "Is Rated?", sortable: true, filter: true, id: 4 },
            { field: "ResponseTypeName", header: "Response Type", sortable: true, filter: true, id: 5 },
            { field: "ResponseWeightTypeName", header: "Rating Type", sortable: true, filter: true, id: 6 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, id: 7 }
        ];

        this.onColumnToggle = this.onColumnToggle.bind(this);

        this.state = {
            brand: null,
            colors: null,
            cols: columns,
            RiskQuestionList: [],
            rowData: '',
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            toogleEditModal: false,
            tempData: '',
            IsRateable: '',
            ResponseWeightTypeName: '',
            textOperation: '',
            textOperations: [],
            TextArr: {
                id: 1,
                TextRating: '',
                TextOperator: '',
                TextToCompare: ''
            },
            NumberOperations: [],
            NumberArr: {
                id: 1,
                NumberRating: '',
                NumberOperator1: '',
                NumberBound1: '',
                NumberOperator2: '',
                NumberBound2: '',
                IsOnlyOneOperator: true,
                IsAllOtherOperator: true
            },
            DateOperations: [],
            DateArr: {
                id: 1,
                DateRating: '',
                DateOperator1: '',
                DateBound1: '',
                DateOperator2: '',
                DateBound2: '',
                IsOnlyOneOperator: true,
                IsAllOtherOperator: true,
                NumberRatingError: false,
            },
            TextRatingError: true,
            TextRating: '',
            ListValue: [],
        };
        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    componentDidMount() {
        this.getTimelineDetails();
        this.getRiskQuestion();
    }

    getRiskQuestion() {
        const data = {
            QuestionCategory: 'QUESTIONCATEGORY',
            QuestionGroup: 'QUESTIONGROUP',
            ResponseType: 'RESPONSETYPE',
            ResponseWeitghtType: 'RESPONSEWEIGHTTYPE',
            VesselClassId: 'dbc97a98-39a5-11ea-bd8d-fa163eb9754c'
        };
        api.post('api/getRiskQuestion', data).then(res => {
            if (res.success) {
                var formattedData = [];
                for (var i = 0; i < res.data.length; i++) {
                    formattedData.push({
                        id: [i + 1],
                        QuestionCategoryName: res.data[i].QuestionCategoryName,
                        QuestionGroupName: res.data[i].QuestionGroupName,
                        QuestionCode: res.data[i].QuestionCode,
                        RiskQuestion: res.data[i].RiskQuestion,
                        IsRateable: res.data[i].IsRateable.data[0] == 0 ? 'No' : 'Yes',
                        ResponseTypeName: res.data[i].ResponseTypeName,
                        ResponseWeightTypeName: res.data[i].ResponseWeightTypeName,
                        ReferenceStringMapType: res.data[i].ReferenceStringMapType
                    })
                }
                this.setState({ RiskQuestionList: formattedData });
            }
        }).catch(err => {
        });
    }

    OpenModal = (data) => {
        this.setState({ toogleEditModal: !this.state.toogleEditModal, tempData: data, IsRateable: (data.IsRateable == 'Yes' ? true : false), ResponseWeightTypeName: data.ResponseWeightTypeName, textOperations: [this.state.TextArr], NumberOperations: [this.state.NumberArr], DateOperations: [this.state.DateArr] });
        this.getListValue(data.ReferenceStringMapType);
    }

    getListValue(ReferenceStringMapType) {
        try {
            const data = {
                stringmaptype: ReferenceStringMapType
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    this.setState({ ListValue: res.data });
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    addRowToArray(type) {
        var i = this.state.textOperations.length;
        if (type === 'Text') {
            var textOperation = this.state.textOperations;
            textOperation.push(this.state.TextArr);
            this.setState({ textOperations: textOperation });
        } else if (type === 'Number') {
            var NumberOperation = this.state.NumberOperations;
            NumberOperation.push(this.state.NumberArr);
            this.setState({ NumberOperations: NumberOperation });
        } else if (type === 'Date') {
            var DateOperation = this.state.DateOperations;
            DateOperation.push(this.state.DateArr);
            this.setState({ DateOperations: DateOperation });
        }
    }

    removeRowToArray(value, i) {
        this.state.textOperations.splice(i, 1);
        this.setState({ dummy: 1 });
    }

    removeRowToNumberArray(value, i) {
        this.state.NumberOperations.splice(i, 1);
        this.setState({ dummy: 1 });
    }

    removeRowToDateArray(value, i) {
        this.state.DateOperations.splice(i, 1);
        this.setState({ dummy: 1 });
    }

    show(field, condition) {
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        } else {
            document.getElementById(field).className = "form-control";
        }
    }

    InputValidate = (name, PIndex) => evt => {
        this.setState({ [evt.target.name]: evt.target.value });
        const NewTextDetails = this.state.textOperations.map((Package, index) => {
            if (PIndex == index) {
                if (name == "TextRating") {
                    return { ...Package, TextRating: evt.target.value };
                } else if (name == "TextOperator") {
                    return { ...Package, TextOperator: evt.target.value };
                } else if (name == "TextToCompare") {
                    return { ...Package, TextToCompare: evt.target.value };
                }
            } else {
                return { ...Package };
            }
        });
        this.setState({ textOperations: NewTextDetails }, function () {
        });
    }

    NumberInputValidate = (name, PIndex) => evt => {
        console.log(name, PIndex);
        this.setState({ [evt.target.name]: evt.target.value });
        const NewTextDetails = this.state.NumberOperations.map((Package, index) => {
            if (PIndex == index) {
                if (name == "NumberRating") {
                    if (this.state.ResponseWeightTypeName == "Rating") {
                        var invSpace = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/
                    } else if (this.state.ResponseWeightTypeName == "Absolute") {
                        var invSpace = /^[0-9]+(\.[0-9][0-9])?$/;
                    }
                    if (!invSpace.test(evt.target.value)) {
                        var NumberRatingErr = true;
                    } else {
                        var NumberRatingErr = false;
                    }
                    return { ...Package, NumberRating: evt.target.value };
                } else if (name == "NumberOperator1") {
                    if (evt.target.value == "All Others") {
                        var IsAllOtherOperatorValue = false;
                    } else {
                        var IsAllOtherOperatorValue = true;
                    }
                    return { ...Package, NumberOperator1: evt.target.value, IsAllOtherOperator: IsAllOtherOperatorValue, NumberRatingError: NumberRatingErr };
                } else if (name == "NumberBound1") {
                    return { ...Package, NumberBound1: evt.target.value };
                } else if (name == "NumberOperator2") {
                    if (evt.target.value == "One Operator Only") {
                        var IsOnlyOneOperatorValue = false;
                    } else {
                        var IsOnlyOneOperatorValue = true;
                    }
                    return { ...Package, NumberOperator2: evt.target.value, IsOnlyOneOperator: IsOnlyOneOperatorValue };
                } else if (name == "NumberBound2") {
                    return { ...Package, NumberBound2: evt.target.value };
                }
            } else {
                return { ...Package };
            }
        });
        this.setState({ NumberOperations: NewTextDetails }, function () {
        });
    }

    DateInputValidate = (name, PIndex) => evt => {
        console.log(name, PIndex);
        this.setState({ [evt.target.name]: evt.target.value });
        const NewTextDetails = this.state.DateOperations.map((Package, index) => {
            if (PIndex == index) {
                if (name == "DateRating") {
                    return { ...Package, DateRating: evt.target.value };
                } else if (name == "DateOperator1") {
                    if (evt.target.value == "All Others") {
                        var IsAllOtherOperatorValue = false;
                    } else {
                        var IsAllOtherOperatorValue = true;
                    }
                    return { ...Package, DateOperator1: evt.target.value, IsAllOtherOperator: IsAllOtherOperatorValue };
                } else if (name == "DateBound1") {
                    return { ...Package, DateBound1: evt.target.value };
                } else if (name == "DateOperator2") {
                    if (evt.target.value == "One Operator Only") {
                        var IsOnlyOneOperatorValue = false;
                    } else {
                        var IsOnlyOneOperatorValue = true;
                    }
                    return { ...Package, DateOperator2: evt.target.value, IsOnlyOneOperator: IsOnlyOneOperatorValue };
                } else if (name == "DateBound2") {
                    return { ...Package, DateBound2: evt.target.value };
                }
            } else {
                return { ...Package };
            }
        });
        this.setState({ DateOperations: NewTextDetails }, function () {
        });
    }

    toggleEdit = () => {
        this.setState({ toogleEditModal: false, textOperations: [] });
    }

    updateQuestion = () => {
        console.log("this.state", this.state);
        // if(this.state.tempData.ResponseTypeName == "Text"){
        //     this.state.tempData.textOperations = this.state.textOperations;
        // } else if(this.state.tempData.ResponseTypeName == "Number" || this.state.tempData.ResponseTypeName == "Percentage" || this.state.tempData.ResponseTypeName == "Amount"){
        //     this.state.tempData.NumberOperations = this.state.NumberOperations;
        // } else if (this.state.tempData.ResponseTypeName == "Date" || this.state.tempData.ResponseTypeName == "Year"){
        //     this.state.tempData.DateOperations = this.state.DateOperations;
        // }
        // api.post('api/UpdateRiskQuestions', this.state.tempData).then(res => {
        //     if (res.success) {
        //         toast.success(res.data.message);
        //     } else {

        //     }
        // }).catch(err => {
        // });
    }

    getTimelineDetails() {
        var formattedData = [];
        let firstPage = (formattedData.length) ? '1' : '0';
        let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
        let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" tooltip="Edit" onClick={() => this.OpenModal(rowData)} tooltipOptions={{ position: 'bottom' }}></Button>
            {/* <Button color="warning" style={{ marginRight: '.5em' }}  title="Edit"><i className="pi pi-pencil"></i></Button> */}
        </div>;
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.RiskQuestionList.length) ? l : this.state.RiskQuestionList.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.RiskQuestionList.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    checked = (isChecked, value) => {
        this.setState({ IsRateable: isChecked });
    }

    selectType = (value, type) => {
        if (type == 'ratingType') {
            this.setState({ ResponseWeightTypeName: value });
        } else if (type == 'textOperation') {
            this.setState({ textOperation: value });
        }
    }

    render() {
        console.log(this.state);
        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} />;
        });
        return (
            <div>
                <div className="basic-header">
                    <h1>Risk Question List</h1>
                    <div className="header-right-option">
                        <div style={{ textAlign: 'right' }}>
                            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="30" style={{ marginRight: 10 }} />
                        </div>
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />
                    </div>
                </div>
                <div className="table-custom">
                    <DataTable ref={(el) => this.dt = el} value={this.state.RiskQuestionList} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                        paginator={true} rows={this.state.rowsPerPage} totalRecords={this.state.RiskQuestionList.length} exportFilename="Task List"
                        currentPageReportTemplate={this.state.str} scrollable={true} scrollHeight="250px"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                        responsive={true} resizableColumns={true} columnResizeMode="fit"
                        scrollable={true} scrollHeight="265px">
                        {columns}
                    </DataTable>

                    <Modal isOpen={this.state.toogleEditModal} toggle={() => this.toggleEdit('save')}
                        className={'modal-lg ' + this.props.className}>
                        <ModalHeader toggle={() => this.toggleEdit('save')}>Risk Question</ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col md="3">
                                    <b>Class:</b> Dinghy
                            </Col>
                            </Row>
                            <Row>
                                <Col md="4">
                                    <b>Question Category:</b> {this.state.tempData.QuestionCategoryName}
                                </Col>
                                <Col md="4">
                                    <b>Question Group:</b> {this.state.tempData.QuestionGroupName}
                                </Col>
                                <Col md="4">
                                    <b>Question Code:</b> {this.state.tempData.QuestionCode}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <span style={{ fontSize: 20 }}><b>Question:</b> {this.state.tempData.RiskQuestion}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <b>Response Type:</b> {this.state.tempData.ResponseTypeName}
                                </Col>
                            </Row>
                            <Row>
                                <Col md="2">
                                    <b>Is Rateable?</b>
                                </Col>
                                <Col>
                                    <Input type='checkbox' name='contactmode' value='IsRateable' checked={(this.state.IsRateable)}
                                        onClick={(e) => this.checked(e.target.checked)} />
                                </Col>
                            </Row>
                            <Row>
                                <Col md="2">
                                    <b>Type</b>
                                </Col>
                                <Col md="3">
                                    <div className="input-box">
                                        <Input type="select" name="systemEndorsement" id="systemEndorsement" onChange={(e) => this.selectType(e.target.value, 'ratingType')} value={this.state.ResponseWeightTypeName}>
                                            <option value=''>Select Rating Type</option>
                                            <option value='Rating'>Rating</option>
                                            <option value='Absolute'>Absolute</option>
                                        </Input>
                                    </div>
                                </Col>
                            </Row>
                            <div>
                                {(this.state.tempData.ResponseTypeName == "List of values") ?   /*<~~~~~~~~~~~LIST~~~~~~~~~~>*/
                                    <div>
                                        <Row>
                                            <Col md="2">
                                                <b>{this.state.ResponseWeightTypeName}</b>
                                            </Col>
                                            <Col md="3">
                                                <b>Response</b>
                                            </Col>
                                        </Row>
                                        {this.state.ListValue.map((value, index) => {
                                            return (
                                                <Row>
                                                    <Col md="2">
                                                        {(this.state.IsRateable) ?
                                                            <Input type="text"></Input>
                                                            : (null)}
                                                    </Col>
                                                    <Col md="3">
                                                        <b>{value.StringMapName}</b>
                                                    </Col>
                                                </Row>
                                            )
                                        }
                                        )}
                                    </div>

                                    : (this.state.tempData.ResponseTypeName == "Yes No") ?   /*<~~~~~~~~~~~YESNO~~~~~~~~~~>*/
                                        <div>
                                            <Row>
                                                <Col md="2">
                                                    <b>{this.state.ResponseWeightTypeName}</b>
                                                </Col>
                                                <Col md="3">
                                                    <b>Response</b>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="2">
                                                    {(this.state.IsRateable) ?
                                                        <Input type="text"></Input>
                                                        : (null)}
                                                </Col>
                                                <Col md="3">
                                                    <b>Yes</b>
                                                </Col>
                                            </Row>
                                        </div>

                                        : (this.state.tempData.ResponseTypeName == "Number" || this.state.tempData.ResponseTypeName == "Percentage" || this.state.tempData.ResponseTypeName == "Amount") ?   /*<~~~~~~~~~~~NUMBER~~~~~~~~~~>*/
                                            <div>
                                                <Row>
                                                    <Col md="2">
                                                        <b>{this.state.ResponseWeightTypeName}</b>
                                                    </Col>
                                                    <Col md="2">
                                                        <b>Operator 1</b>
                                                    </Col>
                                                    <Col md="2">
                                                        <b>Bound 1</b>
                                                    </Col>
                                                    <Col md="2">
                                                        <b>Operator 2</b>
                                                    </Col>
                                                    <Col md="2">
                                                        <b>Bound 2</b>
                                                    </Col>

                                                </Row>
                                                <div>
                                                    {this.state.NumberOperations.map((value, index) => {
                                                        return (
                                                            <Row>
                                                                <Col md="2">
                                                                    {(this.state.IsRateable) ?
                                                                        <div className="input-box">
                                                                            <Input type="text" name="NumberRating" value={value.NumberRating} onChange={this.NumberInputValidate('NumberRating', index)} />
                                                                            {(value.NumberRatingError) ?
                                                                            <em className="error invalid-feedback"> Please enter valid input </em>
                                                                            : (null)}
                                                                        </div>
                                                                        : (null)}
                                                                </Col>
                                                                <Col md="2">
                                                                    <div className="input-box">
                                                                        <Input type="select" name="NumberOperator1" onChange={this.NumberInputValidate('NumberOperator1', index)} value={value.NumberOperator1}>
                                                                            <option value=''> </option>
                                                                            <option value='='>=</option>
                                                                            <option value='All Others'>All Others</option>
                                                                            <option value='One Operator Only'>One Operator Only</option>
                                                                        </Input>
                                                                    </div>
                                                                </Col>

                                                                {(value.IsAllOtherOperator) ?
                                                                    <Col md="2">
                                                                        <div className="input-box">
                                                                            <Input type="text" name="NumberBound1" value={value.NumberBound1} onChange={this.NumberInputValidate('NumberBound1', index)}></Input>
                                                                        </div>
                                                                    </Col>
                                                                    : (null)}


                                                                {(value.IsAllOtherOperator && value.IsOnlyOneOperator) ?
                                                                    <Col md="2">
                                                                        <div className="input-box">
                                                                            <Input type="select" name="NumberOperator2" onChange={this.NumberInputValidate('NumberOperator2', index)} value={value.NumberOperator2}>
                                                                                <option value=''> </option>
                                                                                <option value='='>=</option>
                                                                                <option value='All Others'>All Others</option>
                                                                                <option value='One Operator Only'>One Operator Only</option>
                                                                            </Input>
                                                                        </div>
                                                                    </Col>
                                                                    : (null)}


                                                                {(value.IsAllOtherOperator && value.IsOnlyOneOperator) ?
                                                                    <Col md="2">
                                                                        <div className="input-box">
                                                                            <Input type="text" name="NumberBound2" value={value.NumberBound2} onChange={this.NumberInputValidate('NumberBound2', index)}></Input>
                                                                        </div>
                                                                    </Col>
                                                                    : (null)}

                                                                {(value.IsAllOtherOperator) ?
                                                                    <Col>
                                                                        <a onClick={() => this.addRowToArray('Number')}>Add Row</a>
                                                                        {(index !== 0) ?
                                                                            <a onClick={() => this.removeRowToNumberArray(value, index)}>  Remove</a> : null
                                                                        }
                                                                    </Col>
                                                                    : (null)}
                                                            </Row>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            : (this.state.tempData.ResponseTypeName == "Date" || this.state.tempData.ResponseTypeName == "Year") ?   /*<~~~~~~~~~~~DATE~~~~~~~~~~>*/
                                                <div>
                                                    <Row>
                                                        <Col md="2">
                                                            <b>{this.state.ResponseWeightTypeName}</b>
                                                        </Col>
                                                        <Col md="2">
                                                            <b>Operator 1</b>
                                                        </Col>
                                                        <Col md="2">
                                                            <b>Bound 1</b>
                                                        </Col>
                                                        <Col md="2">
                                                            <b>Operator 2</b>
                                                        </Col>
                                                        <Col md="2">
                                                            <b>Bound 2</b>
                                                        </Col>
                                                    </Row>
                                                    <div>
                                                        {this.state.DateOperations.map((value, index) => {
                                                            return (
                                                                <Row>
                                                                    <Col md="2">
                                                                        {(this.state.IsRateable) ?
                                                                            <div className="input-box">
                                                                                <Input type="text" name="DateRating" value={value.DateRating} onChange={this.DateInputValidate('DateRating', index)} />
                                                                                <em className="error invalid-feedback"> Please enter valid input </em>
                                                                            </div>
                                                                            : (null)}
                                                                    </Col>
                                                                    <Col md="2">
                                                                        <div className="input-box">
                                                                            <Input type="select" name="DateOperator1" onChange={this.DateInputValidate('DateOperator1', index)} value={value.DateOperator1}>
                                                                                <option value=''> </option>
                                                                                <option value='='>=</option>
                                                                                <option value='All Others'>All Others</option>
                                                                                <option value='One Operator Only'>One Operator Only</option>
                                                                            </Input>
                                                                        </div>
                                                                    </Col>
                                                                    {(value.IsAllOtherOperator) ?
                                                                        <Col md="2">
                                                                            <div className="input-box">
                                                                                <Input type="text" name="DateBound1" value={value.DateBound1} onChange={this.DateInputValidate('DateBound1', index)}></Input>
                                                                            </div>
                                                                        </Col>
                                                                        : (null)}
                                                                    {(value.IsAllOtherOperator && value.IsOnlyOneOperator) ?
                                                                        <Col md="2">
                                                                            <div className="input-box">
                                                                                <Input type="select" name="DateOperator2" onChange={this.DateInputValidate('DateOperator2', index)} value={value.DateOperator2}>
                                                                                    <option value=''> </option>
                                                                                    <option value='='>=</option>
                                                                                    <option value='All Others'>All Others</option>
                                                                                    <option value='One Operator Only'>One Operator Only</option>
                                                                                </Input>
                                                                            </div>
                                                                        </Col>
                                                                        : (null)}
                                                                    {(value.IsAllOtherOperator && value.IsOnlyOneOperator) ?
                                                                        <Col md="2">
                                                                            <div className="input-box">
                                                                                <Input type="text" name="DateBound2" value={value.DateBound2} onChange={this.DateInputValidate('DateBound2', index)}></Input>
                                                                            </div>
                                                                        </Col>
                                                                        : (null)}
                                                                    {(value.IsAllOtherOperator) ?
                                                                        <Col>
                                                                            <a onClick={() => this.addRowToArray('Date')}>Add Row</a>
                                                                            {(index !== 0) ?
                                                                                <a onClick={() => this.removeRowToDateArray(value, index)}>  Remove</a> : null
                                                                            }
                                                                        </Col>
                                                                        : (null)}
                                                                </Row>
                                                            )
                                                        })}
                                                    </div>
                                                </div>

                                                : (this.state.tempData.ResponseTypeName == "Text") ?   /*<~~~~~~~~~~~TEXT~~~~~~~~~~>*/
                                                    <div>
                                                        <Row>
                                                            <Col md="2">
                                                                <b>{this.state.ResponseWeightTypeName}</b>
                                                            </Col>
                                                            <Col md="3">
                                                                <b>Operator</b>
                                                            </Col>
                                                            <Col md="3">
                                                                <b>Text for Comparison</b>
                                                            </Col>
                                                        </Row>
                                                        <div>
                                                            {this.state.textOperations.map((value, index) => {
                                                                return (
                                                                    <Row>
                                                                        <Col md="2">
                                                                            {(this.state.IsRateable) ?
                                                                                <div className="input-box">
                                                                                    <Input type="text" name="TextRating" value={value.TextRating} onChange={this.InputValidate('TextRating', index)} />
                                                                                    <em className="error invalid-feedback"> Please enter valid input </em>
                                                                                </div>
                                                                                : (null)}
                                                                        </Col>
                                                                        <Col md="3">
                                                                            <div className="input-box">
                                                                                <Input type="select" name="systemEndorsement" onChange={this.InputValidate('TextOperator', index)} value={value.TextOperator}>
                                                                                    <option value=''> </option>
                                                                                    <option value='='>=</option>
                                                                                    <option value='All Others'>All Others</option>
                                                                                    <option value='One Operator Only'>One Operator Only</option>
                                                                                </Input>
                                                                            </div>
                                                                        </Col>
                                                                        <Col md="3">
                                                                            <div className="input-box">
                                                                                <Input type="text" name="TextToCompare" value={value.TextToCompare} onChange={this.InputValidate('TextToCompare', index)}></Input>
                                                                            </div>
                                                                        </Col>
                                                                        <Col>
                                                                            <a onClick={() => this.addRowToArray('Text')}>Add Row</a>
                                                                            {(index !== 0) ?
                                                                                <a onClick={() => this.removeRowToArray(value, index)}>  Remove</a> : null
                                                                            }
                                                                        </Col>
                                                                    </Row>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                    : (null)
                                }
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <BTN color="success" onClick={() => this.updateQuestion()}><i class="fa fa-check"></i> Update</BTN>{' '}
                            <BTN color="primary" onClick={() => this.toggleEdit('save')}><i class="fa fa-angle-left"></i> Cancel</BTN>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default RiskQuestionList;