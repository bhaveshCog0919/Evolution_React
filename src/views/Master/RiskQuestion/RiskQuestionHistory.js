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
import moment from 'moment';
import { render } from 'react-dom';
import BootstrapTable from 'react-bootstrap-table-next';

class RiskQuestionHistory extends Component {

    constructor() {
        super();

        const columns = [
            { dataField: "QuestionCode", text: "Question Code" },
            { dataField: "RiskQuestion", text: "Question" },
            { dataField: "QuestionGroup", text: "Group" },
            { dataField: "ResponseWeightTypeName", text: "Rating Type" },
            { dataField: "StartDate", text: "Effective Date" },
            { dataField: "Qualifier", text: "Qualifier" },
            { dataField: "isCurrent", text: "Is Current" },
            { dataField: "Action", text: "Actions", formatter: this.actionFormatter, OpenModal: this.updateHistoryRecord, viewHistoryRecord: this.viewHistoryRecord, deleteHistoryRecord: this.deleteHistoryRecord, },
        ];

        this.state = {
            cols: columns,
            forAction: false,
            isAdd: false,
            isDelet: false,
            isOpenForUpdate: false,
            products: [],
            RiskQuestionHistoryList: [],
            rowData: '',
            VesselClassList: [],
            VesselTypeList: [],
            vesselClass: '',
            VesselClassId: '',
            vesselClassError: true,
            VesselTypeId: '',
            vesselType: '',
            vesselTypeError: true,
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            toogleEditModal: false,
            tempData: '',
            IsRateable: false,
            ResponseWeightTypeName: '',
            ResponseWeightTypeNameError: true,
            ResponseWeightType: '',
            ResponseWeightTypeError: true,
            textOperation: '',
            textOperations: [],
            TextArr: {
                id: 1,
                TextRating: '',
                TextOperator: '',
                TextToCompare: '',
                TextToCompareError: false,
                isDeleted: false,
            },
            NumberOperations: [],
            NumberArr: {
                id: 1,
                NumberRating: '',
                NumberOperator1: '',
                NumberOperator1Arr: [],
                NumberBound1: '',
                NumberOperator2: '',
                NumberOperator2Arr: [],
                NumberBound2: '',
                IsOnlyOneOperator: false,
                IsAllOtherOperator: true,
                NumberRatingError: false,
                isDeleted: false,
            },
            DateOperations: [],
            DateArr: {
                id: 1,
                DateRating: '',
                DateOperator1: '',
                DateOperator1Arr: [],
                DateBound1: '',
                DateOperator2: '',
                DateOperator2Arr: [],
                DateBound2: '',
                IsOnlyOneOperator: false,
                IsAllOtherOperator: true,
                DateRatingError: false,
                isDeleted: false,
            },
            TextRatingError: true,
            TextRating: '',
            ListValue: [],
            Rating: '',
            RatingError: true,
            listType: '',
            systemEndorsementArr: [],
            systemEndorsement: '',
            systemEndorsementError: true,
            systemEndorsementText: '',
            systemEndorsementTextArr: [],
            RiskQuestionId: '',
            RiskQuestionResponseWeightageId: '',
            ResponseType: '',
            effectivedate: 'Effective Date',
            effectiveDate: '',
            effectiveDateError: true,
            historyDatesArr: [],
            historyDates: '',
            fromDate: '',
            ToDate: '',
            diaplayDate: '',
            diaplayDateArr: [],
            isEnable: false,
            isEdit: false,
        };
    }

    componentDidMount() {
        if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
            this.getRiskQuestionHistory(this.props.match.params.Id);
        }

        this.getDropDownValues('RATINGTYPE', 'systemEndorsementArr', 'SortOrder');
        this.getDropDownValues('RATINGOPERATOR', 'NumberOperator1Arr', 'SortOrder');
        this.getDropDownValues('RATINGOPERATOR2', 'NumberOperator2Arr', 'SortOrder');
        this.getDropDownValues('RATINGOPERATOR', 'DateOperator1Arr', 'SortOrder');
        this.getDropDownValues('RATINGOPERATOR2', 'DateOperator2Arr', 'SortOrder');
        this.getDropDownValues('TEXTOPERATOR', 'systemEndorsementTextArr', 'SortOrder');
        this.getDropDownValues('DISPLAYMODE', 'diaplayDateArr', 'SortOrder');
        this.setState({ effectiveDate: moment().format('YYYY-MM-DD'), effectiveDateError: false })
    }

    getDropDownValues(stringMapType, setStateName, orderBy) {
        try {
            const data = {
                stringmaptype: stringMapType,
                orderby: orderBy
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    console.log("getDropDownValues", res.data);
                    this.setState({ [setStateName]: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getRiskQuestionHistory(Id) {
        try {
            var data = {
                RiskQuestionId: Id,
                fromDate: CommonConfig.isEmpty(this.state.fromDate) ? '' : this.state.fromDate,
                ToDate: CommonConfig.isEmpty(this.state.ToDate) ? '' : this.state.ToDate,
                diaplayDate: CommonConfig.isEmpty(this.state.diaplayDate) ? '' : this.state.diaplayDate,
            }
            api.post('api/getHistoryDates', data).then(res => {
                if (res.success) {
                    console.log("getRiskQuestionHistory", res.data);
                    var newArr = [];
                    for (var i = 0; i < res.data[0].length; i++) {
                        newArr.push({
                            QuestionCode: res.data[0][i].QuestionCode,
                            RiskQuestion: res.data[0][i].RiskQuestion,
                            QuestionGroup: res.data[0][i].QuestionGroup,
                            ResponseWeightTypeName: res.data[0][i].ResponseType,
                            StartDate: moment(res.data[0][i].StartDate).format('DD-MM-YYYY'),
                            UpdatedOn: res.data[0][i].UpdatedOn,
                            IsRateable: res.data[0][i].IsRateable.data[0] === 0 ? 'No' : 'Yes',
                            QuestionCategoryName: res.data[0][i].QuestionCategory,
                            ResponseWeightType: res.data[0][i].ResponseWeightType,
                            Qualifier: res.data[0][i].Qualifier,
                            isCurrent: res.data[0][i].IsCurrent,
                            forAction: res.data[0][i].ACTION === "Edit" ? true : false,
                            RiskQuestionHistoryId: res.data[0][i].RiskQuestionHistoryId
                        })
                        this.setState({ QuestionCode: res.data[0][i].QuestionCode });
                    }
                    console.log("getRiskQuestionHistory", newArr);
                    this.setState({ products: newArr });
                }
            })
        } catch (error) {
            console.log("getRiskQuestionHistoryErr", error);
        }
    }

    actionFormatter(cell, rowData) {
        return <div>
            {(rowData.forAction) ? (
                <div>
                    <Button type="button" icon="pi pi-pencil" className="p-button-warning" tooltip="Edit" onClick={() => this.OpenModal(rowData)} tooltipOptions={{ position: 'bottom' }}></Button>
                    {(Date(moment(rowData.StartDate).format('YYYY-MM-DD')) >= moment().format('YYYY-MM-DD')) ? (
                        <Button style={{ marginLeft: 10 }} type="button" icon="pi pi-trash" className="p-button-danger" tooltip="delete" onClick={() => this.deleteHistoryRecord(rowData)} tooltipOptions={{ position: 'bottom' }}></Button>
                    ) : (null)}
                </div>
            ) : (
                    <Button type="button" icon="pi pi-eye" className="p-button-primary" tooltip="View" onClick={() => this.viewHistoryRecord(rowData)} tooltipOptions={{ position: 'bottom' }}></Button>
                )}

            {/* <Button type="button" icon="pi pi-clock" className="p-button-primary" tooltip="Show History" onClick={() => this.goToHistoryPage(rowData)} tooltipOptions={{ position: 'bottom' }} style={{ marginLeft: 10 }}></Button> */}
            {/* <Button color="warning" style={{ marginRight: '.5em' }}  title="Edit"><i className="pi pi-pencil"></i></Button> */}
        </div>;
    }

    deleteHistoryRecord = (row) => {
        this.setState({ isDelet: true, newVar: row });
    }

    viewHistoryRecord = (row) => {
        this.setState({ isView: true, isEdit: true, tempData: row, IsRateable: (row.IsRateable === 'Yes' ? true : false), ResponseWeightTypeName: row.ResponseWeightTypeName, textOperations: [], NumberOperations: [], DateOperations: [], effectiveDate: moment(row.StartDate, 'DD-MM-YYYY').format('YYYY-MM-DD'), ResponseWeightType: row.ResponseWeightType, RiskQuestionHistoryId: row.RiskQuestionHistoryId });
        this.handleOnExpand(row);
    }

    updateHistoryRecord = (row) => {
        this.setState({
            isEdit: true, tempData: row, IsRateable: (row.IsRateable === 'Yes' ? true : false), ResponseWeightTypeName: row.ResponseWeightTypeName, textOperations: [], NumberOperations: [], DateOperations: [],
            effectiveDate: (moment(row.StartDate, 'DD-MM-YYYY').format("YYYY-MM-DD") > moment().format("YYYY-MM-DD")) ? moment(row.StartDate, 'DD-MM-YYYY').format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
            ResponseWeightType: row.ResponseWeightType, RiskQuestionHistoryId: row.RiskQuestionHistoryId
        });
        this.handleOnExpand(row);
        console.log("rowEventssssssssss", row);
    }

    handleOnExpand = (row, isExpand, rowIndex, e) => {
        console.log("handleOnExpandddd55", row);
        try {
            var dataToSend = {
                RiskQuestionId: this.props.match.params.Id,
                RiskQuestionHistoryId: row.RiskQuestionHistoryId,
            }
            console.log("handleOnExpandddd3", dataToSend);
            api.post('api/getResponseByHistoryDates', dataToSend).then(res => {
                if (res.success) {
                    console.log("handleOnExpandddd321", res.data);
                    if (!res.data.length) {
                        if (this.state.ResponseWeightTypeName === "Number" || this.state.ResponseWeightTypeName === "Percentage" || this.state.ResponseWeightTypeName === "Amount") {
                            this.setState({ NumberOperations: [this.state.NumberArr] });
                        } else if (this.state.ResponseWeightTypeName === "Text") {
                            this.setState({ textOperations: [this.state.TextArr] });
                        } else if (this.state.ResponseWeightTypeName === "Date" || this.state.ResponseWeightTypeName === "Year") {
                            this.setState({ DateOperations: [this.state.DateArr] });
                        }
                    } else {
                        var formattedData = [];
                        var NumberOperations = [];
                        var textOperations = [];
                        var DateOperations = [];
                        let i;
                        for (i = 0; i < res.data.length; i++) {
                            var temppDataForNumber = {
                                id: 1,
                                NumberRating: '',
                                NumberOperator1: '',
                                NumberOperator1Arr: [],
                                NumberBound1: '',
                                NumberOperator2: '',
                                NumberOperator2Arr: [],
                                NumberBound2: '',
                                IsOnlyOneOperator: true,
                                IsAllOtherOperator: true,
                                DateRatingError: false,
                                isDeleted: false,
                            };

                            var temppDataForText = {
                                id: 1,
                                TextRating: '',
                                TextOperator: '',
                                TextToCompare: '',
                                isDeleted: false,
                            }

                            var temppDataForDate = {
                                id: 1,
                                DateRating: '',
                                DateOperator1: '',
                                DateOperator1Arr: [],
                                DateBound1: '',
                                DateOperator2: '',
                                DateOperator2Arr: [],
                                DateBound2: '',
                                IsOnlyOneOperator: true,
                                IsAllOtherOperator: true,
                                NumberRatingError: false,
                                isDeleted: false,
                            }
                            formattedData.push({
                                Response: CommonConfig.isEmpty(res.data[i].ResponseStringMapKey) ? '' : (res.data[i].ResponseStringMapKey).trim(),
                                Rating: CommonConfig.isEmpty(res.data[i].Rating) ? CommonConfig.isEmpty(res.data[i].AbsoluteAmount) ? 0 : res.data[i].AbsoluteAmount : res.data[i].Rating,
                                RiskQuestionResponseWeightageHistoryId: CommonConfig.isEmpty(res.data[i].RiskQuestionResponseWeightageHistoryId) ? '' : res.data[i].RiskQuestionResponseWeightageHistoryId,
                                RiskQuestionResponseWeightageId: CommonConfig.isEmpty(res.data[i].RiskQuestionResponseWeightageId) ? '' : res.data[i].RiskQuestionResponseWeightageId

                            });

                            temppDataForNumber.id = i + 1;
                            temppDataForNumber.NumberRating = CommonConfig.isEmpty(res.data[i].Rating) ? res.data[i].AbsoluteAmount : res.data[i].Rating;
                            temppDataForNumber.NumberOperator1 = CommonConfig.isEmpty(res.data[i].Operator1) ? '' : res.data[i].Operator1;
                            temppDataForNumber.NumberBound1 = CommonConfig.isEmpty(res.data[i].Bound1) ? 0.00 : res.data[i].Bound1;

                            temppDataForNumber.NumberOperator2 = CommonConfig.isEmpty(res.data[i].Operator2) ? '' : res.data[i].Operator2;
                            if (temppDataForNumber.NumberOperator2 === "One Operator Only") {
                                temppDataForNumber.IsOnlyOneOperator = false;
                            } else {
                                temppDataForNumber.IsOnlyOneOperator = true;
                            }
                            temppDataForNumber.NumberBound2 = CommonConfig.isEmpty(res.data[i].Bound2) ? 0.00 : res.data[i].Bound2;
                            temppDataForNumber.RiskQuestionResponseWeightageHistoryId = CommonConfig.isEmpty(res.data[i].RiskQuestionResponseWeightageHistoryId) ? '' : res.data[i].RiskQuestionResponseWeightageHistoryId;
                            temppDataForNumber.isDeleted = false;
                            temppDataForNumber.RiskQuestionResponseWeightageId = CommonConfig.isEmpty(res.data[i].RiskQuestionResponseWeightageId) ? '' : res.data[i].RiskQuestionResponseWeightageId;
                            // temppDataForNumber.IsOnlyOneOperator= true;

                            temppDataForText.TextRating = CommonConfig.isEmpty(res.data[i].Rating) ? res.data[i].AbsoluteAmount : res.data[i].Rating;
                            temppDataForText.TextOperator = CommonConfig.isEmpty(res.data[i].Operator1) ? '' : res.data[i].Operator1;
                            temppDataForText.TextToCompare = CommonConfig.isEmpty(res.data[i].Bound1) ? '' : res.data[i].Bound1;
                            temppDataForText.RiskQuestionResponseWeightageId = CommonConfig.isEmpty(res.data[i].RiskQuestionResponseWeightageId) ? '' : res.data[i].RiskQuestionResponseWeightageId;
                            temppDataForText.isDeleted = false;
                            temppDataForText.RiskQuestionResponseWeightageId = CommonConfig.isEmpty(res.data[i].RiskQuestionResponseWeightageId) ? '' : res.data[i].RiskQuestionResponseWeightageId;

                            temppDataForDate.id = i + 1;
                            temppDataForDate.DateRating = CommonConfig.isEmpty(res.data[i].Rating) ? res.data[i].AbsoluteAmount : res.data[i].Rating;
                            temppDataForDate.DateOperator1 = CommonConfig.isEmpty(res.data[i].Operator1) ? 0.00 : res.data[i].Operator1;
                            temppDataForDate.DateBound1 = CommonConfig.isEmpty(res.data[i].Bound1) ? 0.00 : res.data[i].Bound1;
                            temppDataForDate.DateOperator2 = CommonConfig.isEmpty(res.data[i].Operator2) ? 0.00 : res.data[i].Operator2;
                            if (temppDataForDate.NumberOperator2 === "One Operator Only") {
                                temppDataForDate.IsOnlyOneOperator = false;
                            } else {
                                temppDataForDate.IsOnlyOneOperator = true;
                            }
                            temppDataForDate.DateBound2 = CommonConfig.isEmpty(res.data[i].Bound2) ? 0.00 : res.data[i].Bound2;
                            temppDataForDate.RiskQuestionResponseWeightageHistoryId = CommonConfig.isEmpty(res.data[i].RiskQuestionResponseWeightageHistoryId) ? '' : res.data[i].RiskQuestionResponseWeightageHistoryId;
                            temppDataForDate.isDeleted = false;
                            temppDataForDate.RiskQuestionResponseWeightageId = CommonConfig.isEmpty(res.data[i].RiskQuestionResponseWeightageId) ? '' : res.data[i].RiskQuestionResponseWeightageId;
                            // temppDataForDate.IsOnlyOneOperator= true;

                            NumberOperations.push(temppDataForNumber);
                            textOperations.push(temppDataForText);
                            DateOperations.push(temppDataForDate);
                        }
                        this.setState({ NumberOperations: NumberOperations });
                        this.setState({ textOperations: textOperations });
                        this.setState({ DateOperations: DateOperations });
                        this.setState({ ListValue: formattedData });
                    }
                }
            })
        } catch (error) {
            console.log("handleOnExpandErr", error);
        }
    }

    upDateModel() {
        this.setState({ isOpenForUpdate: true });
    }

    updateQuestion = () => {
        var isAdd = this.state.isAdd;
        var isEdit = this.state.isEdit;
        let resultsData = this.state.products.filter(x => x.StartDate === moment(this.state.effectiveDate).format('DD-MM-YYYY'));
        console.log("updateQuestion", resultsData);
        if (!this.state.effectiveDateError) {

            if (resultsData.length) {
                isAdd = false;
                isEdit = true;
                this.setState({ RiskQuestionHistoryId: resultsData[0].RiskQuestionHistoryId })
                this.upDateModel();
            } else {
                isAdd = true;
                isEdit = false;

                let data = {
                    RiskQuestionHistoryId: this.state.RiskQuestionHistoryId,
                    ResponseTypeName: this.state.ResponseWeightType,
                    IsRateable: this.state.IsRateable,
                    ResponseWeightTypeName: this.state.ResponseWeightTypeName,
                    RiskQuestionId: this.props.match.params.Id,
                    effectiveDate: this.state.effectiveDate,
                    loggedInUserId: CommonConfig.loggedInUserId(),
                    IsAdd: isAdd,
                    IsEdit: isEdit,
                };
                if (this.state.tempData.ResponseWeightTypeName === "Text") {
                    if (this.state.IsRateable) {
                        data.textOperations = this.state.textOperations;
                    } else {
                        data.textOperations = '';
                    }
                } else if (this.state.tempData.ResponseWeightTypeName === "Number" || this.state.tempData.ResponseWeightTypeName === "Percentage" || this.state.tempData.ResponseWeightTypeName === "Amount") {
                    if (this.state.IsRateable) {
                        data.NumberOperations = this.state.NumberOperations;
                    } else {
                        data.NumberOperations = '';
                    }
                } else if (this.state.tempData.ResponseWeightTypeName === "Date" || this.state.tempData.ResponseWeightTypeName === "Year") {
                    if (this.state.IsRateable) {
                        data.DateOperations = this.state.DateOperations;
                    } else {
                        data.DateOperations = '';
                    }
                } else if (this.state.tempData.ResponseWeightTypeName === "ListOfValues" || this.state.tempData.ResponseWeightTypeName === "YesNo") {
                    if (this.state.IsRateable) {
                        data.ListValue = this.state.ListValue;
                    } else {
                        data.ListValue = '';
                    }
                }
                console.log("IsOnlyOneOperator", data);

                api.post('api/UpdateRiskQuestionWeightage', data).then(res => {
                    console.log("UpdateRiskQuestionWeightage", res);
                    if (res.success) {
                        console.log("UpdateRiskQuestionWeightage", res.data);
                        toast.success(res.data.message);
                        this.toggleEdit('save');
                        // setTimeout(function () {
                        //     window.location.reload();
                        // }, 1000);   
                        this.getRiskQuestionHistory(this.props.match.params.Id);
                    }
                }).catch(err => {
                });
            }
        } else {
            if (this.state.effectiveDateError) {
                toast.error("Please select valid Effective Date")
                return;
            }
        }
    }

    updateQuestionModal = () => {
        let data = {
            RiskQuestionHistoryId: this.state.RiskQuestionHistoryId,
            ResponseTypeName: this.state.ResponseWeightType,
            IsRateable: this.state.IsRateable,
            ResponseWeightTypeName: this.state.ResponseWeightTypeName,
            RiskQuestionId: this.props.match.params.Id,
            effectiveDate: this.state.effectiveDate,
            loggedInUserId: CommonConfig.loggedInUserId(),
            IsEdit: 'true',
        };
        if (this.state.tempData.ResponseWeightTypeName === "Text") {
            if (this.state.IsRateable) {
                data.textOperations = this.state.textOperations;
            } else {
                data.textOperations = '';
            }
        } else if (this.state.tempData.ResponseWeightTypeName === "Number" || this.state.tempData.ResponseWeightTypeName === "Percentage" || this.state.tempData.ResponseWeightTypeName === "Amount") {
            if (this.state.IsRateable) {
                data.NumberOperations = this.state.NumberOperations;
            } else {
                data.NumberOperations = '';
            }
        } else if (this.state.tempData.ResponseWeightTypeName === "Date" || this.state.tempData.ResponseWeightTypeName === "Year") {
            if (this.state.IsRateable) {
                data.DateOperations = this.state.DateOperations;
            } else {
                data.DateOperations = '';
            }
        } else if (this.state.tempData.ResponseWeightTypeName === "ListOfValues" || this.state.tempData.ResponseWeightTypeName === "YesNo") {
            if (this.state.IsRateable) {
                data.ListValue = this.state.ListValue;
            } else {
                data.ListValue = '';
            }
        }
        console.log("IsOnlyOneOperator", data);

        api.post('api/UpdateRiskQuestionWeightage', data).then(res => {
            console.log("UpdateRiskQuestionWeightage", res);
            if (res.success) {
                console.log("UpdateRiskQuestionWeightage", res.data);
                toast.success(res.data.message);
                this.toggleEditModel('save');
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
                this.getRiskQuestionHistory(this.props.match.params.Id);
            }
        }).catch(err => {
        });
    }

    deleteModal = (newVar) => {
        console.log("deleteModal", newVar);
        try {
            var dataToSend = {
                IsDiscard: 'true',
                RiskQuestionHistoryId: newVar.RiskQuestionHistoryId,
                loggedInUserId: CommonConfig.loggedInUserId(),
            }
            api.post('api/deleteRiskQuestion', dataToSend).then(res => {
                console.log("deleteRiskQuestion", res);
                if (res.success) {
                    toast.success(res.message);
                    this.toggleEdit('save');
                    setTimeout(function () {
                        window.location.reload();
                    }, 800);
                    this.getRiskQuestionHistory(this.props.match.params.Id);
                }
            }).catch(err => {
            });
        } catch (error) {
            console.log("deleteModal", error);
        }
    }

    expandRow = {
        onlyOneExpanding: true,
        showExpandColumn: true,
        expandByColumnOnly: true,
        onExpand: this.handleOnExpand,
        renderer: row => (
            <div>
                <div>
                    {/* {(row.ResponseWeightTypeName === "ListOfValues" */}
                    {(row.ResponseWeightTypeName === "ListOfValues") ?
                        <div>
                            <Row>
                                <Col md="3">
                                    <b>Rating/Absolute Amount</b>
                                </Col>
                                <Col md="3">
                                    <b>Response</b>
                                </Col>
                            </Row>
                            {this.state.ListValue.map((value, index) => {
                                return (
                                    <Row>
                                        <Col md="3">
                                            <label>{value.Rating}</label>
                                        </Col>
                                        <Col md="9">
                                            <label>{value.Response}</label>
                                        </Col>
                                    </Row>
                                )
                            }
                            )}
                        </div>
                        : (row.ResponseWeightTypeName === "YesNo") ? (
                            <div>
                                <Row>
                                    <Col md="3">
                                        <b>Rating/Absolute Amount</b>
                                    </Col>
                                    <Col md="3">
                                        <b>Response</b>
                                    </Col>
                                </Row>
                                {this.state.ListValue.map((value, index) => {
                                    return (
                                        <Row>
                                            <Col md="3">
                                                <label>{value.Rating}</label>
                                            </Col>
                                            <Col md="9">
                                                <label>{value.Response}</label>
                                            </Col>
                                        </Row>
                                    )
                                }
                                )}
                            </div>
                        ) : (row.ResponseWeightTypeName === "Number" || row.ResponseWeightTypeName === "Percentage" || row.ResponseWeightTypeName === "Amount") ? (
                            <div>
                                <Row>
                                    <Col md="2">
                                        <b>Rating/Absolute Amount</b>
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
                                {this.state.NumberOperations.map((value, index) => {
                                    return (
                                        <Row>
                                            <Col md="2">
                                                <label>{value.NumberRating}</label>
                                            </Col>
                                            <Col md="2">
                                                <label>{value.NumberOperator1}</label>
                                            </Col>
                                            <Col md="2">
                                                <label>{value.NumberBound1}</label>
                                            </Col>
                                            <Col md="2">
                                                <label>{value.NumberOperator2}</label>
                                            </Col>
                                            <Col md="2">
                                                <label>{value.NumberBound2}</label>
                                            </Col>
                                        </Row>
                                    )
                                }
                                )}
                            </div>
                        ) : (row.ResponseWeightTypeName === "Date" || row.ResponseWeightTypeName === "Year") ? (
                            <div>
                                <Row>
                                    <Col md="2">
                                        <b>Rating/Absolute Amount</b>
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
                                {this.state.DateOperations.map((value, index) => {
                                    console.log("handleOnExpandddd123", value);
                                    return (
                                        <Row>
                                            <Col md="2">
                                                <label>{value.DateRating}</label>
                                            </Col>
                                            <Col md="2">
                                                <label>{value.DateOperator1}</label>
                                            </Col>
                                            <Col md="2">
                                                <label>{value.DateBound1}</label>
                                            </Col>
                                            <Col md="2">
                                                <label>{value.DateOperator2}</label>
                                            </Col>
                                            <Col md="2">
                                                <label>{value.DateBound2}</label>
                                            </Col>
                                        </Row>
                                    )
                                }
                                )}
                            </div>
                        ) : (row.ResponseWeightTypeName === "Text") ? (
                            <div>
                                <Row>
                                    <Col md="2">
                                        <b>Rating/Absolute Amount</b>
                                    </Col>
                                    <Col md="2">
                                        <b>Operator</b>
                                    </Col>
                                    <Col md="3">
                                        <b>Text for Comparison</b>
                                    </Col>
                                </Row>
                                <div>
                                    {this.state.textOperations.map((value, index) => {
                                        console.log("handleOnExpandddd123", value);
                                        return (
                                            <Row>
                                                <Col md="2">
                                                    <label>{value.TextRating}</label>
                                                </Col>
                                                <Col md="2">
                                                    <label>{value.TextOperator}</label>
                                                </Col>
                                                <Col md="3">
                                                    <label>{value.TextToCompare}</label>
                                                </Col>
                                            </Row>
                                        )
                                    })}
                                </div>
                            </div>
                        ) : (null)}
                </div>
            </div>
        )
    };


    toggleEdit = () => {
        this.setState({ isEdit: false, isView: false, effectiveDate: moment().format('YYYY-MM-DD'), effectiveDateError: false });
    }

    toggleEditModel = () => {
        this.setState({ isOpenForUpdate: false });
    }

    toggleDelete = () => {
        this.setState({ isDelet: false })
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
        this.state.textOperations[i].isDeleted = true;
        console.log("removeRowToNumberArray", this.state.textOperations);
        this.setState({ textOperations: this.state.textOperations });
    }

    removeRowToNumberArray(value, i) {
        this.state.NumberOperations[i].isDeleted = true;
        console.log("removeRowToNumberArray", this.state.NumberOperations);
        this.setState({ NumberOperations: this.state.NumberOperations });
    }

    removeRowToDateArray(value, i) {
        this.state.DateOperations[i].isDeleted = true;
        console.log("removeRowToNumberArray", this.state.DateOperations);
        this.setState({ DateOperations: this.state.DateOperations });
    }

    InputValidate = (name, PIndex) => evt => {
        console.log("InputValidate", name, PIndex, this.state.ResponseWeightTypeName);
        this.setState({ [evt.target.name]: evt.target.value });
        const NewTextDetails = this.state.textOperations.map((Package, index) => {
            if (PIndex === index) {
                if (name === "TextRating") {
                    let invSpace, TextRatingErr;
                    if (this.state.ResponseWeightTypeName === "Rating") {
                        invSpace = CommonConfig.RegExp.percentageWithNegative;
                    } else if (this.state.ResponseWeightTypeName === "Absolute") {
                        invSpace = CommonConfig.RegExp.decimalWithNegative;
                    }

                    if (invSpace.test(evt.target.value)) {
                        TextRatingErr = false;
                    } else {
                        TextRatingErr = true;
                    }
                    return { ...Package, TextRating: evt.target.value, TextRatingError: TextRatingErr };
                } else if (name === "TextOperator") {
                    // let IsAllOtherOperatorValue;
                    // if (evt.target.value === "All Others") {
                    //     IsAllOtherOperatorValue = false;
                    // } else {
                    //     IsAllOtherOperatorValue = true;
                    // }
                    return { ...Package, TextOperator: evt.target.value };
                }
                else if (name === "TextToCompare") {
                    let invSpace = CommonConfig.RegExp.nameWithoutSpace, TextRatingErr;
                    // if (this.state.ResponseWeightTypeName === "Rating") {
                    //     invSpace = CommonConfig.RegExp.allowAllWithSpace
                    // }

                    if (!invSpace.test(evt.target.value)) {
                        TextRatingErr = true;
                    }
                    return { ...Package, TextToCompare: evt.target.value, TextToCompareError: TextRatingErr };
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
            if (PIndex === index) {
                if (name === "NumberRating") {
                    let invSpace, NumberRatingErr;
                    if (this.state.ResponseWeightTypeName === "Rating") {
                        invSpace = CommonConfig.RegExp.percentageWithNegative;
                    } else if (this.state.ResponseWeightTypeName === "Absolute") {
                        invSpace = CommonConfig.RegExp.decimalWithNegative;
                    }

                    if (invSpace.test(evt.target.value)) {
                        NumberRatingErr = false;
                    } else {
                        NumberRatingErr = true;
                    }
                    return { ...Package, NumberRating: evt.target.value, NumberRatingError: NumberRatingErr };
                }
                else if (name === "NumberOperator1") {
                    let IsAllOtherOperatorValue;
                    if (evt.target.value === "All Others") {
                        IsAllOtherOperatorValue = false;
                    } else {
                        IsAllOtherOperatorValue = true;
                    }
                    return { ...Package, NumberOperator1: evt.target.value, IsAllOtherOperator: IsAllOtherOperatorValue };
                }

                else if (name === "NumberBound1") {
                    let invSpace, DateRatingErr;
                    invSpace = CommonConfig.RegExp.number;
                    if (invSpace.test(evt.target.value)) {
                        DateRatingErr = false;
                    } else {
                        DateRatingErr = true;
                    }
                    return { ...Package, NumberBound1: evt.target.value, NumberRatingError: DateRatingErr };
                }

                else if (name === "NumberOperator2") {
                    console.log("evt.target.value", evt.target.value);
                    let IsOnlyOneOperatorValue;
                    if (evt.target.value === "One Operator Only") {
                        IsOnlyOneOperatorValue = false;
                    } else {
                        IsOnlyOneOperatorValue = true;
                    }
                    return { ...Package, NumberOperator2: evt.target.value, IsOnlyOneOperator: IsOnlyOneOperatorValue };
                }

                else if (name === "NumberBound2") {
                    let invSpace, DateRatingErr;
                    invSpace = CommonConfig.RegExp.number;
                    if (invSpace.test(evt.target.value)) {
                        DateRatingErr = false;
                    } else {
                        DateRatingErr = true;
                    }
                    return { ...Package, NumberBound2: evt.target.value, NumberRatingError: DateRatingErr };
                }
            } else {
                return { ...Package };
            }
        });
        this.setState({ NumberOperations: NewTextDetails }, function () {
        });
    }

    ListValueValidate = (name, PIndex) => evt => {
        console.log(name, PIndex);
        this.setState({ [evt.target.name]: evt.target.value });
        const NewTextDetails = this.state.ListValue.map((Package, index) => {
            console.log("ListValueindex", index, PIndex === index);
            if (PIndex === index) {
                if (name === "Rating") {
                    let invSpace, NumberRatingErr;
                    if (this.state.ResponseWeightType === "Rating") {
                        invSpace = CommonConfig.RegExp.percentageWithNegative;
                    } else if (this.state.ResponseWeightType === "Absolute") {
                        invSpace = CommonConfig.RegExp.decimalWithNegative;
                    }

                    if (invSpace.test(evt.target.value)) {
                        NumberRatingErr = false;
                    } else {
                        NumberRatingErr = true;
                    }
                    return { ...Package, Rating: evt.target.value, RatingError: NumberRatingErr };
                }
            } else {
                return { ...Package };
            }
        });
        this.setState({ ListValue: NewTextDetails }, function () {
        });
    }

    DateInputValidate = (name, PIndex) => evt => {
        console.log(name, PIndex);
        this.setState({ [evt.target.name]: evt.target.value });
        const NewTextDetails = this.state.DateOperations.map((Package, index) => {
            if (PIndex === index) {
                if (name === "DateRating") {
                    let invSpace, DateRatingErr;
                    if (this.state.ResponseWeightTypeName === "Rating") {
                        invSpace = CommonConfig.RegExp.percentageWithNegative;
                    } else if (this.state.ResponseWeightTypeName === "Absolute") {
                        invSpace = CommonConfig.RegExp.decimalWithNegative;
                    }
                    if (invSpace.test(evt.target.value)) {
                        DateRatingErr = false;
                    } else {
                        DateRatingErr = true;
                    }
                    return { ...Package, DateRating: evt.target.value, DateRatingError: DateRatingErr };
                }

                else if (name === "DateOperator1") {
                    let IsAllOtherOperatorValue;
                    if (evt.target.value === "All Others") {
                        IsAllOtherOperatorValue = false;
                    } else {
                        IsAllOtherOperatorValue = true;
                    }
                    return { ...Package, DateOperator1: evt.target.value, IsAllOtherOperator: IsAllOtherOperatorValue };
                }

                else if (name === "DateBound1") {
                    let invSpace, DateRatingErr;
                    invSpace = CommonConfig.RegExp.number;
                    if (invSpace.test(evt.target.value)) {
                        DateRatingErr = false;
                    } else {
                        DateRatingErr = true;
                    }
                    return { ...Package, DateBound1: evt.target.value, DateRatingError: DateRatingErr };
                }

                else if (name === "DateOperator2") {
                    let IsOnlyOneOperatorValue;
                    if (evt.target.value === "One Operator Only") {
                        IsOnlyOneOperatorValue = false;
                    } else {
                        IsOnlyOneOperatorValue = true;
                    }
                    return { ...Package, DateOperator2: evt.target.value, IsOnlyOneOperator: IsOnlyOneOperatorValue };
                } else if (name === "DateBound2") {
                    let invSpace, DateRatingErr;
                    invSpace = CommonConfig.RegExp.number;
                    if (invSpace.test(evt.target.value)) {
                        DateRatingErr = false;
                    } else {
                        DateRatingErr = true;
                    }
                    return { ...Package, DateBound2: evt.target.value, DateRatingError: DateRatingErr };
                }
            } else {
                return { ...Package };
            }
        });
        this.setState({ DateOperations: NewTextDetails }, function () {
        });
    }

    checked = (isChecked, value) => {
        console.log("checked", isChecked);
        this.setState({ IsRateable: isChecked });
    }

    selectType(value, type) {
        console.log("selectType", value, type);

        if (type === 'ResponseWeightType') {
            if (value === '' || value === null || value === undefined) {
                this.setState({ ResponseWeightTypeError: true, ResponseWeightType: value });
                this.show("ResponseWeightType", true, "ResponseWeightTypeError", "Select valid type");
            } else {
                const NewTextDetails = this.state.NumberOperations.map((Package, index) => {
                    return { ...Package, NumberRating: 0.00 };
                });
                const NewTextDetailsForDate = this.state.DateOperations.map((Package, index) => {
                    return { ...Package, DateRating: 0.00 };
                });
                const NewTextDetailsForList = this.state.ListValue.map((Package, index) => {
                    return { ...Package, Rating: 0.00 };
                });
                this.setState({ NumberOperations: NewTextDetails, DateOperations: NewTextDetailsForDate, ListValue: NewTextDetailsForList })
                this.setState({ ResponseWeightTypeError: false, ResponseWeightType: value });
                this.show("ResponseWeightType", false, "ResponseWeightTypeError", "Select valid type");
            }
        }

        if (type === 'diaplayDate') {
            this.setState({ diaplayDate: value })
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'effectiveDate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ effectiveDateError: true });
                this.show("effectiveDate", true, "effectiveDateError", "Enter valid effective date");
            } else if (moment(e.target.value).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
                this.setState({ effectiveDateError: true });
                this.show("effectiveDate", true, "effectiveDate", "Please enter valid effective date");
            } else {
                this.setState({ effectiveDateError: false, effectiveDate: e.target.value });
                this.show("effectiveDate", false, "effectiveDateError", "");
            }
        }

        if (e.target.name === 'fromDate') {
            this.setState({ fromDate: e.target.value });
        }

        if (e.target.name === 'ToDate') {
            this.setState({ ToDate: e.target.value });
        }
    }

    show(field, condition, errorField, message) {
        console.log("(field, condition, errorField, message)", field, condition, errorField, message);
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

    searchByDateAndDisplayMode() {
        try {
            var dataToSend = {
                RiskQuestionId: this.props.match.params.Id,
                fromDate: CommonConfig.isEmpty(this.state.fromDate) ? '' : this.state.fromDate,
                ToDate: CommonConfig.isEmpty(this.state.ToDate) ? '' : this.state.ToDate,
                diaplayDate: CommonConfig.isEmpty(this.state.diaplayDate) ? '' : this.state.diaplayDate,
            }
            api.post('api/getHistoryDates', dataToSend).then(res => {
                if (res.success) {
                    console.log("getRiskQuestionHistory", res.data);
                    var newArr = [];
                    for (var i = 0; i < res.data[0].length; i++) {
                        newArr.push({
                            QuestionCode: res.data[0][i].QuestionCode,
                            RiskQuestion: res.data[0][i].RiskQuestion,
                            QuestionGroup: res.data[0][i].QuestionGroup,
                            ResponseWeightTypeName: res.data[0][i].ResponseType,
                            StartDate: moment(res.data[0][i].StartDate).format('DD-MM-YYYY'),
                            UpdatedOn: res.data[0][i].UpdatedOn,
                            // RiskQuestionResponseWeightageHistoryId: res.data[0][i].RiskQuestionResponseWeightageHistoryId,
                            IsRateable: res.data[0][i].IsRateable.data[0] === 0 ? 'No' : 'Yes',
                            QuestionCategoryName: res.data[0][i].QuestionCategory,
                            ResponseWeightType: res.data[0][i].ResponseWeightType,
                            Qualifier: res.data[0][i].Qualifier,
                            isCurrent: res.data[0][i].IsCurrent,
                        })
                        this.setState({ QuestionCode: res.data[0][i].QuestionCode });
                    }
                    console.log("getRiskQuestionHistory", newArr);
                    this.setState({ products: newArr });
                }
            })
        } catch (error) {
            console.log("getRiskQuestionHistoryErr", error);
        }
    }

    render() {

        return (
            <div>
                <div className="basic-header">
                    <h1>RiskQuestion History</h1>
                </div>
                <div style={{ marginTop: 10 }}>
                    <Row>
                        <Col md="1" style={{ padding: 0, marginLeft: 15 }}>
                            <b>Question Code</b>
                        </Col>
                        <Col md="2">
                            <label>{this.state.QuestionCode}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="1" style={{ padding: 0, marginLeft: 20 }}>
                            <b>Effective Date</b>
                        </Col>
                        <Col md="2">
                            <Input type="date" name="fromDate" id="fromDate" onChange={(e) => this.handleChange(e)} value={this.state.fromDate} />
                        </Col>
                        <Col md="1" style={{ padding: 0, marginLeft: 20 }}>
                            <b>To</b>
                        </Col>
                        <Col md="2">
                            <Input type="date" name="ToDate" id="ToDate" onChange={(e) => this.handleChange(e)} value={this.state.ToDate} />
                        </Col>
                        <Col md="1" style={{ padding: 0, marginLeft: 15 }}>
                            <b>Display Mode</b>
                        </Col>
                        <Col md="2">
                            <Input type="select" name="diaplayDate" id="diaplayDate" onChange={(e) => this.selectType(e.target.value, 'diaplayDate')} value={this.state.diaplayDate}>
                                <option value=''>Select display date</option>
                                {this.state.diaplayDateArr.map((type, i) => {
                                    return (<option value={type.StringMapName}>{type.StringMapName}</option>)
                                })
                                }
                            </Input>
                        </Col>
                        <Col md="2">
                            <BTN color="success" onClick={() => this.searchByDateAndDisplayMode()}><i class="fa fa-check"></i>Search</BTN>{' '}
                        </Col>
                    </Row>
                </div>
                <div style={{ marginTop: 30 }}>
                    <BootstrapTable
                        keyField='StartDate'
                        data={this.state.products}
                        columns={this.state.cols}
                        rowEvents={this.rowEvents}
                        expandRow={this.expandRow}
                    />
                </div>
                <Modal isOpen={this.state.isEdit} toggle={() => this.toggleEdit('save')}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={() => this.toggleEdit('save')}>Risk Question</ModalHeader>

                    <ModalBody>
                        <Row>
                            <Col md="4">
                                <b>Question Category:</b> {this.state.tempData.QuestionCategoryName}
                            </Col>
                            <Col md="4">
                                <b>Question Group:</b> {this.state.tempData.QuestionGroup}
                            </Col>
                            <Col md="4">
                                <b>Question Code:</b> {this.state.tempData.QuestionCode}
                            </Col>
                        </Row>

                        <Row style={{ marginTop: 10 }}>
                            <Col>
                                <span style={{ fontSize: 20 }}><b>Question:</b> {this.state.tempData.RiskQuestion}</span>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col>
                                <b>Response Type:</b> {this.state.tempData.ResponseWeightTypeName}
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col md="2">
                                <b>Is Rateable?</b>
                            </Col>
                            <Col>
                                <Input disabled={this.state.isView} type='checkbox' name='IsRateable' value='IsRateable' id='IsRateable' checked={(this.state.IsRateable)}
                                    onClick={(e) => this.checked(e.target.checked)} />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col md="1">
                                <b>Type</b>
                            </Col>
                            <Col md="2">
                                <div className="input-box">
                                    <Input disabled={this.state.isView} type="select" name="ResponseWeightType" id="ResponseWeightType" onChange={(e) => this.selectType(e.target.value, 'ResponseWeightType')} value={this.state.ResponseWeightType}>
                                        <option value=''>Select Rating Type</option>
                                        {this.state.systemEndorsementArr.map((type, i) => {
                                            return (<option value={type.StringMapName}>{type.StringMapName}</option>)
                                        })
                                        }
                                    </Input>
                                    <em id="ResponseWeightTypeError" className="error invalid-feedback"></em>
                                    {/* <em className="error invalid-feedback" >Please enter mooring registration no</em> */}
                                </div>
                            </Col>
                            <Col md="2">
                                <label>{this.state.effectivedate}</label>
                            </Col>
                            <Col md="3">
                                <Input disabled={this.state.isView} type="date" name="effectiveDate" id="effectiveDate" onChange={(e) => this.handleChange(e)} value={this.state.effectiveDate}
                                    min={moment().format('YYYY-MM-DD')}
                                    max={moment().add(100, 'years').format('YYYY-MM-DD')}
                                >
                                </Input>
                                <em id="effectiveDateError" className="error invalid-feedback"></em>
                            </Col>
                        </Row>
                        <div>
                            {(this.state.tempData.ResponseWeightTypeName === "ListOfValues") ?   /*<~~~~~~~~~~~LIST~~~~~~~~~~>*/
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
                                                        <div>
                                                            <Input disabled={this.state.isView} type="text" name="Rating" id="Rating" value={value.Rating} onChange={this.ListValueValidate('Rating', index)}></Input>
                                                            {(value.RatingError) ?
                                                                <em style={{ display: "block" }} className="error invalid-feedback"> Please enter valid input </em>
                                                                : (null)}
                                                        </div>
                                                        : (null)}
                                                </Col>
                                                <Col md="10">
                                                    <b>{value.Response}</b>
                                                </Col>
                                            </Row>
                                        )
                                    }
                                    )}
                                </div>

                                : (this.state.tempData.ResponseWeightTypeName === "YesNo") ?   /*<~~~~~~~~~~~YESNO~~~~~~~~~~>*/
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
                                                            <div>
                                                                <Input disabled={this.state.isView} type="text" name="Rating" id="Rating" value={value.Rating} onChange={this.ListValueValidate('Rating', index)}></Input>
                                                                {(value.RatingError) ?
                                                                    <em style={{ display: "block" }} className="error invalid-feedback"> Please enter valid input </em>
                                                                    : (null)}
                                                            </div>
                                                            : (null)}
                                                    </Col>
                                                    <Col md="3">
                                                        <b>{value.Response}</b>
                                                    </Col>
                                                </Row>
                                            )
                                        }
                                        )}
                                    </div>

                                    : (this.state.tempData.ResponseWeightTypeName === "Number" || this.state.tempData.ResponseWeightTypeName === "Percentage" || this.state.tempData.ResponseWeightTypeName === "Amount") ?   /*<~~~~~~~~~~~NUMBER~~~~~~~~~~>*/
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
                                                    console.log("NumberOperations", value);
                                                    return (
                                                        <div>
                                                            {(value.isDeleted == true) ? (null) : (
                                                                <Row>
                                                                    <Col md="2">
                                                                        {(this.state.IsRateable) ?
                                                                            <div className="input-box">
                                                                                <Row>
                                                                                    <Col>
                                                                                        <Input type="text" name="NumberRating" value={value.NumberRating} id="NumberRating" onChange={this.NumberInputValidate('NumberRating', index)} />
                                                                                        {(value.NumberRatingError) ?
                                                                                            <em style={{ display: "block" }} className="error invalid-feedback"> Please enter valid input </em>
                                                                                            : (null)}
                                                                                    </Col>
                                                                                </Row>
                                                                            </div>
                                                                            : (null)}
                                                                    </Col>
                                                                    <Col md="2">
                                                                        <div className="input-box">
                                                                            <Input disabled={this.state.isView} type="select" name="NumberOperator1" onChange={this.NumberInputValidate('NumberOperator1', index)} value={value.NumberOperator1}>
                                                                                <option value=''>Select Rating Type</option>
                                                                                {this.state.NumberOperator1Arr.map((type, i) => {
                                                                                    return (<option value={type.StringMapName}>{type.StringMapName}</option>)
                                                                                })
                                                                                }
                                                                            </Input>
                                                                        </div>
                                                                    </Col>
                                                                    <Col md="2">
                                                                        {(value.IsAllOtherOperator) ?
                                                                            <div className="input-box">
                                                                                <Input type="text" name="NumberBound1" value={value.NumberBound1} onChange={this.NumberInputValidate('NumberBound1', index)}></Input>
                                                                            </div>
                                                                            : (null)}
                                                                    </Col>
                                                                    <Col md="2">
                                                                        {/* {(value.IsAllOtherOperator && value.IsOnlyOneOperator) ? */}
                                                                        <div className="input-box">
                                                                            <Input disabled={this.state.isView} type="select" name="NumberOperator2" onChange={this.NumberInputValidate('NumberOperator2', index)} value={value.NumberOperator2}>
                                                                                <option value=''>Select Rating Type</option>
                                                                                {this.state.NumberOperator2Arr.map((type, i) => {
                                                                                    return (<option value={type.value}>{type.label}</option>)
                                                                                })
                                                                                }
                                                                            </Input>
                                                                        </div>
                                                                        {/* : (null)} */}
                                                                    </Col>
                                                                    <Col md="2">
                                                                        {(value.IsAllOtherOperator && value.IsOnlyOneOperator) ?
                                                                            <div className="input-box">
                                                                                <Input type="text" name="NumberBound2" value={value.NumberBound2} onChange={this.NumberInputValidate('NumberBound2', index)}></Input>
                                                                            </div>
                                                                            : (null)}
                                                                    </Col>
                                                                    {(value.IsAllOtherOperator) ?
                                                                        <Col>
                                                                            <a onClick={() => this.addRowToArray('Number')}>Add Row</a>
                                                                            {(index !== 0) ?
                                                                                <a onClick={() => this.removeRowToNumberArray(value, index)}>  Remove</a> : null
                                                                            }
                                                                        </Col>
                                                                        : (null)}
                                                                </Row>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        : (this.state.tempData.ResponseWeightTypeName === "Date" || this.state.tempData.ResponseWeightTypeName === "Year") ?   /*<~~~~~~~~~~~DATE~~~~~~~~~~>*/
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
                                                                            <Input type="text" name="DateRating" id="DateRating"
                                                                                value={value.DateRating}
                                                                                onChange={this.DateInputValidate('DateRating', index)} />
                                                                            {(value.DateRatingError) ?
                                                                                <em style={{ display: "block" }} className="error invalid-feedback"> Please enter valid input </em>
                                                                                : (null)}
                                                                        </div>
                                                                        : (null)}
                                                                </Col>
                                                                <Col md="2">
                                                                    <div className="input-box">
                                                                        <Input disabled={this.state.isView} type="select" name="DateOperator1" onChange={this.DateInputValidate('DateOperator1', index)} value={value.DateOperator1}>
                                                                            <option value=''>Select Rating Type</option>
                                                                            {this.state.DateOperator1Arr.map((type, i) => {
                                                                                return (<option value={type.value}>{type.label}</option>)
                                                                            })
                                                                            }
                                                                        </Input>
                                                                    </div>
                                                                </Col>

                                                                <Col md="2">
                                                                    {(value.IsAllOtherOperator) ?
                                                                        <div className="input-box">
                                                                            <Input type="text" name="DateBound1" value={value.DateBound1} onChange={this.DateInputValidate('DateBound1', index)}></Input>
                                                                        </div>
                                                                        : (null)}
                                                                </Col>


                                                                <Col md="2">
                                                                    {/* {(value.IsAllOtherOperator && value.IsOnlyOneOperator) ? */}
                                                                    <div className="input-box">
                                                                        <Input disabled={this.state.isView} type="select" name="DateOperator2" onChange={this.DateInputValidate('DateOperator2', index)} value={value.DateOperator2}>
                                                                            <option value=''>Select Rating Type</option>
                                                                            {this.state.DateOperator2Arr.map((type, i) => {
                                                                                return (<option value={type.value}>{type.label}</option>)
                                                                            })
                                                                            }
                                                                        </Input>
                                                                    </div>
                                                                    {/* : (null)} */}
                                                                </Col>


                                                                <Col md="2">
                                                                    {(value.IsAllOtherOperator && value.IsOnlyOneOperator) ?
                                                                        <div className="input-box">
                                                                            <Input type="text" name="DateBound2" value={value.DateBound2} onChange={this.DateInputValidate('DateBound2', index)}></Input>
                                                                        </div>
                                                                        : (null)}
                                                                </Col>
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

                                            : (this.state.tempData.ResponseWeightTypeName === "Text") ?   /*<~~~~~~~~~~~TEXT~~~~~~~~~~>*/
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
                                                                                <Input type="text" name="TextRating" id="TextRating" value={value.TextRating} onChange={this.InputValidate('TextRating', index)} />
                                                                                {(value.TextRatingError) ?
                                                                                    <em style={{ display: "block" }} className="error invalid-feedback"> Please enter valid input </em>
                                                                                    : (null)}
                                                                            </div>
                                                                            : (null)}
                                                                    </Col>
                                                                    <Col md="3">
                                                                        <div className="input-box">
                                                                            <Input type="select" name="systemEndorsementText" onChange={this.InputValidate('TextOperator', index)} value={value.TextOperator}>
                                                                                <option value=''>Select Rating Type</option>
                                                                                {this.state.systemEndorsementTextArr.map((type, i) => {
                                                                                    return (<option value={type.value}>{type.label}</option>)
                                                                                })
                                                                                }
                                                                            </Input>
                                                                        </div>
                                                                    </Col>
                                                                    <Col md="3">
                                                                        <div className="input-box">
                                                                            <Input type="text" name="TextToCompare" id="TextToCompare" value={value.TextToCompare} onChange={this.InputValidate('TextToCompare', index)} />
                                                                            {(value.TextToCompareError) ?
                                                                                <em style={{ display: "block" }} className="error invalid-feedback"> Please enter valid input </em>
                                                                                : (null)}
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


                    < ModalFooter >
                        {(this.state.isView) ? (
                            null
                        ) : (
                                <div>
                                    <BTN color="success" onClick={() => this.updateQuestion()}><i class="fa fa-check"></i> Update</BTN>
                                    <BTN style={{ marginLeft: 10 }} color="primary" onClick={() => this.toggleEdit('save')}><i class="fa fa-close"></i> Cancel</BTN>
                                </div>
                            )}
                    </ModalFooter >
                </Modal >

                <Modal isOpen={this.state.isOpenForUpdate} toggle={() => this.toggleEditModel('save')}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={() => this.toggleEditModel('save')}>Risk Question</ModalHeader>

                    <ModalBody>
                        <label>Values for this date {moment(this.state.effectiveDate).format('DD-MM-YYYY')} is already added for {this.state.tempData.RiskQuestion}, are you sure you want to update this record ?</label>
                    </ModalBody>

                    < ModalFooter >
                        <BTN color="success" onClick={() => this.updateQuestionModal()}><i class="fa fa-check"></i> Yes</BTN>{' '}
                        <BTN color="primary" onClick={() => this.toggleEditModel('save')}><i class="fa fa-close"></i> No</BTN>
                    </ModalFooter >
                </Modal >

                <Modal isOpen={this.state.isDelet} toggle={() => this.toggleDelete('save')}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={() => this.toggleDelete('save')}>Risk Question</ModalHeader>

                    <ModalBody>
                        <label>Are you sure want to delete this records ?</label>
                    </ModalBody>

                    < ModalFooter >
                        <BTN color="success" onClick={() => this.deleteModal(this.state.newVar)}><i class="fa fa-check"></i> Yes</BTN>{' '}
                        <BTN color="primary" onClick={() => this.toggleDelete('save')}><i class="fa fa-close"></i> No</BTN>
                    </ModalFooter >
                </Modal >

            </div >
        )
    }
}

export default RiskQuestionHistory;