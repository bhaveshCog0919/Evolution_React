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


class RiskQuestionList extends Component {
    constructor() {
        super();

        let columns = [
            { field: "QuestionCategoryName", header: "Category", sortable: true, filter: true, id: 0 },
            { field: "QuestionGroupName", header: "Group", sortable: true, filter: true, id: 1 },
            { field: "QuestionCode", header: "Question Code", sortable: true, filter: true, id: 2 },
            { field: "RiskQuestion", header: "Question", sortable: true, filter: true, id: 3 },
            { field: "IsRateable", header: "Is Rated?", sortable: true, filter: true, id: 4 },
            { field: "ResponseType", header: "Response Type", sortable: true, filter: true, id: 5 },
            { field: "ResponseWeightTypeName", header: "Rating Type", sortable: true, filter: true, id: 6 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, id: 7 }
        ];

        this.onColumnToggle = this.onColumnToggle.bind(this);

        this.state = {
            cols: columns,
            RiskQuestionList: [],
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
            effectiveDate: moment().format('YYYY-MM-DD'),
            effectiveDateError: true,
            historyDates: '',
            historyDatesArr: [],
            isEnable: false,
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
        this.getRiskQuestion();
        this.getTimelineDetails();
        this.getVesselClass();
        this.getDropDownValues('RATINGTYPE', 'systemEndorsementArr', 'SortOrder');
        this.getDropDownValues('RATINGOPERATOR', 'NumberOperator1Arr', 'SortOrder');
        this.getDropDownValues('RATINGOPERATOR2', 'NumberOperator2Arr', 'SortOrder');
        this.getDropDownValues('RATINGOPERATOR', 'DateOperator1Arr', 'SortOrder');
        this.getDropDownValues('RATINGOPERATOR2', 'DateOperator2Arr', 'SortOrder');
        this.getDropDownValues('TEXTOPERATOR', 'systemEndorsementTextArr', 'SortOrder');
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

    getRiskQuestion() {
        const data = {
            QuestionCategory: 'QUESTIONCATEGORY',
            QuestionGroup: 'QUESTIONGROUP',
            ResponseType: 'RESPONSETYPE',
            ResponseWeitghtType: 'RESPONSEWEIGHTTYPE',
            VesselClassId: '0f90c38f-3f40-11ea-b7f2-fa163eb9754c',
        };
        api.post('api/getRiskQuestion', data).then(res => {
            console.log("getRiskQuestion", res.data);
            if (res.success) {
                var formattedData = [];
                for (var i = 0; i < res.data.length; i++) {
                    formattedData.push({
                        id: [i + 1],
                        QuestionCategoryName: res.data[i].QuestionCategoryName,
                        QuestionGroupName: res.data[i].QuestionGroupName,
                        QuestionCode: res.data[i].QuestionCode,
                        RiskQuestion: res.data[i].RiskQuestion,
                        IsRateable: res.data[i].IsRateable.data[0] === 0 ? 'No' : 'Yes',
                        ResponseTypeName: res.data[i].ResponseType,
                        ResponseWeightTypeName: res.data[i].ResponseWeightTypeName,
                        ReferenceStringMapType: res.data[i].ReferenceStringMapType,
                        RiskQuestionId: res.data[i].RiskQuestionId,
                        loggedInUserId: CommonConfig.loggedInUserId(),
                        ResponseType: res.data[i].ResponseTypeName,
                        effectiveDate: CommonConfig.isEmpty(res.data[i].StartDate) ? '' : moment(res.data[i].StartDate).format('YYYY-MM-DD'),
                    })
                }
                this.setState({ RiskQuestionList: formattedData });
            }
        }).catch(err => {
        });
    }

    OpenModal = (data) => {
        console.log("OpenModal", data);
        this.setState({ toogleEditModal: !this.state.toogleEditModal, tempData: data, IsRateable: (data.IsRateable === 'Yes' ? true : false), ResponseWeightTypeName: data.ResponseWeightTypeName, textOperations: [], NumberOperations: [], DateOperations: [], RiskQuestionId: data.RiskQuestionId, effectiveDate: data.effectiveDate });
        this.getListValue(data);
    }

    getListValue(ReferenceStringMapType) {
        console.log("getListValue", ReferenceStringMapType);
        try {
            const data = {
                stringmaptype: ReferenceStringMapType.ReferenceStringMapType
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    console.log("getListValue", res.data);
                    const dataToSend = {
                        RiskQuestionId: ReferenceStringMapType.RiskQuestionId,
                        // ReferenceStringMapType: ReferenceStringMapType.ReferenceStringMapType
                    }
                    api.post("api/getRiskQuestionResponseWeightageData", dataToSend).then(res => {
                        if (res.success) {
                            console.log("getRiskQuestionResponseWeightageData", res.data);
                            if (!res.data.length) {
                                debugger
                                if (ReferenceStringMapType.ResponseTypeName === "Number" || ReferenceStringMapType.ResponseTypeName === "Percentage" || ReferenceStringMapType.ResponseTypeName === "Amount") {
                                    this.setState({ NumberOperations: [this.state.NumberArr] });
                                } else if (ReferenceStringMapType.ResponseTypeName === "Text") {
                                    this.setState({ textOperations: [this.state.TextArr] });
                                } else if (ReferenceStringMapType.ResponseTypeName === "Date" || ReferenceStringMapType.ResponseTypeName === "Year") {
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
                                    temppDataForNumber.RiskQuestionResponseWeightageId = CommonConfig.isEmpty(res.data[i].RiskQuestionResponseWeightageId) ? '' : res.data[i].RiskQuestionResponseWeightageId;
                                    temppDataForNumber.isDeleted = false;
                                    // temppDataForNumber.IsOnlyOneOperator= true;

                                    temppDataForText.TextRating = CommonConfig.isEmpty(res.data[i].Rating) ? res.data[i].AbsoluteAmount : res.data[i].Rating;
                                    temppDataForText.TextOperator = CommonConfig.isEmpty(res.data[i].Operator1) ? '' : res.data[i].Operator1;
                                    temppDataForText.TextToCompare = CommonConfig.isEmpty(res.data[i].Bound1) ? '' : res.data[i].Bound1;
                                    temppDataForText.RiskQuestionResponseWeightageId = CommonConfig.isEmpty(res.data[i].RiskQuestionResponseWeightageId) ? '' : res.data[i].RiskQuestionResponseWeightageId;
                                    temppDataForText.isDeleted = false;

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
                                    temppDataForDate.RiskQuestionResponseWeightageId = CommonConfig.isEmpty(res.data[i].RiskQuestionResponseWeightageId) ? '' : res.data[i].RiskQuestionResponseWeightageId;
                                    temppDataForDate.isDeleted = false;
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
                    }).catch(err => {
                        console.log("err", err);
                    });
                }
            }).catch(err => {
                console.log("err", err);
            });
        } catch (error) {
            console.log("error", error);
        }
    }

    getVesselClass() {
        let data = {} //Static policy ID
        api.post('api/getVesselClassList', data).then(res => {
            console.log(res);

            if (res.success) {
                this.setState({ VesselClassList: res.data });
            } else {
            }
        }).catch(err => {
            console.log("errr", err);
        });
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
                        invSpace = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/
                    } else if (this.state.ResponseWeightTypeName === "Absolute") {
                        invSpace = /^[0-9]+(\.[0-9][0-9])?$/;
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
                        invSpace = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/
                    } else if (this.state.ResponseWeightTypeName === "Absolute") {
                        invSpace = /^[0-9]+(\.[0-9][0-9])?$/;
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
                    if (this.state.ResponseWeightTypeName === "Rating") {
                        invSpace = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/
                    } else if (this.state.ResponseWeightTypeName === "Absolute") {
                        invSpace = /^[0-9]+(\.[0-9][0-9])?$/;
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
                        invSpace = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/
                    } else if (this.state.ResponseWeightTypeName === "Absolute") {
                        invSpace = /^[0-9]+(\.[0-9][0-9])?$/;
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

    export = () => {
        this.dt.exportCSV();
    }

    toggleEdit = () => {
        this.setState({ toogleEditModal: false, textOperations: [], IsRateable: false, NumberOperations: [], ListValue: [], DateOperations: [], isEnable: false, historyDates: '', historyDatesArr: [] });
    }

    updateQuestion = () => {
        let data = {
            ResponseTypeName: this.state.tempData.ResponseTypeName,
            IsRateable: this.state.IsRateable,
            ResponseWeightTypeName: this.state.ResponseWeightTypeName,
            RiskQuestionId: this.state.RiskQuestionId,
            effectiveDate: this.state.effectiveDate,
            loggedInUserId: CommonConfig.loggedInUserId()
        };
        if (this.state.tempData.ResponseTypeName === "Text") {
            if (this.state.IsRateable) {
                data.textOperations = this.state.textOperations;
            } else {
                data.textOperations = '';
            }
        } else if (this.state.tempData.ResponseTypeName === "Number" || this.state.tempData.ResponseTypeName === "Percentage" || this.state.tempData.ResponseTypeName === "Amount") {
            if (this.state.IsRateable) {
                data.NumberOperations = this.state.NumberOperations;
            } else {
                data.NumberOperations = '';
            }
        } else if (this.state.tempData.ResponseTypeName === "Date" || this.state.tempData.ResponseTypeName === "Year") {
            if (this.state.IsRateable) {
                data.DateOperations = this.state.DateOperations;
            } else {
                data.DateOperations = '';
            }
        } else if (this.state.tempData.ResponseTypeName === "ListOfValues" || this.state.tempData.ResponseTypeName === "YesNo") {
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
                this.getRiskQuestion();
                // setTimeout(function () {
                //     window.location.reload();
                // }, 1000);
            }
        }).catch(err => {
        });
    }

    getTimelineDetails() {
        var formattedData = [];
        let firstPage = (formattedData.length) ? '1' : '0';
        let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
        let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
    }

    actionTemplate(rowData, column) {
        return <div>
            {/* <Button type="button" icon="pi pi-pencil" className="p-button-warning" tooltip="Edit" onClick={() => this.OpenModal(rowData)} tooltipOptions={{ position: 'bottom' }}></Button> */}
            <Button type="button" icon="pi pi-clock" className="p-button-primary" tooltip="Show History" onClick={() => this.goToHistoryPage(rowData)} tooltipOptions={{ position: 'bottom' }} style={{ marginLeft: 10 }}></Button>
            {/* <Button color="warning" style={{ marginRight: '.5em' }}  title="Edit"><i className="pi pi-pencil"></i></Button> */}
        </div>;
    }

    goToHistoryPage = (data) => {
        var Id = data.RiskQuestionId;
        this.props.history.push({
            pathname: '/Master/RiskQuestionHistory/' + Id,
            state: {
                Id: Id,
            }
        });
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.RiskQuestionList.length) ? l : this.state.RiskQuestionList.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.RiskQuestionList.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    checked = (isChecked, value) => {
        console.log("checked", isChecked);
        this.setState({ IsRateable: isChecked });
    }

    selectType(value, type) {
        console.log("selectType", value, type);

        if (type === 'vesselClass') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ vesselClassError: true, vesselClass: value });
                this.show("vesselClass", true, "vesselClassError", "Please select Vessel Class Name");
            } else {
                this.setState({ vesselClassError: false, vesselClass: value });
                this.show("vesselClass", false, "vesselClassError", "");
            }
        }

        if (type === 'ResponseWeightTypeName') {
            if (value === '' || value === null || value === undefined) {
                this.setState({ ResponseWeightTypeNameError: true, ResponseWeightTypeName: value });
                this.show("ResponseWeightTypeName", true, "ResponseWeightTypeNameError", "Select valid type");
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
                this.setState({ ResponseWeightTypeNameError: false, ResponseWeightTypeName: value });
                this.show("ResponseWeightTypeName", false, "ResponseWeightTypeNameError", "Select valid type");
            }
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.name === 'effectiveDate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ effectiveDateError: true });
                this.show("effectiveDate", true, "effectiveDateError", "Enter valid effective date");
            } else {
                this.setState({ effectiveDateError: false, effectiveDate: e.target.value });
                this.show("effectiveDate", false, "effectiveDateError", "");
            }
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

    editZone(task) {
        if (task == "view") {
            this.setState({ isEnable: false });
            // window.location.reload();
        } else {
            this.setState({ isEnable: true });
        }
    }

    render() {
        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode="contains" />;
        });
        return (
            <div>
                <div className="basic-header">
                    <h1>Risk Question List</h1>
                </div>


                <div className="basic-header">
                    <div></div>
                    <div className="header-right-option">
                        <div style={{ textAlign: 'right' }}>
                            <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="30" style={{ marginRight: 10 }} />
                        </div>
                        <MultiSelect value={this.state.cols} options={this.colOptions}
                            fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                            onChange={this.onColumnToggle} style={{ width: '50px' }}
                        />
                        <Button type="button" icon="pi pi-external-link" tooltip="Export As CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>
                    </div>
                </div>

                <div className="table-custom">
                    <DataTable
                        ref={(el) => this.dt = el}
                        value={this.state.RiskQuestionList}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
                        paginator={true}
                        rows={this.state.rowsPerPage}
                        totalRecords={this.state.RiskQuestionList.length}
                        exportFilename="Risk Question List"
                        currentPageReportTemplate={this.state.str}
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions}
                        globalFilter={this.state.globalFilter}
                        emptyMessage="No records found"
                        responsive={true}
                        resizableColumns={true}
                        columnResizeMode="fit"
                        scrollable={true}
                        scrollHeight="265px">
                        {columns}
                    </DataTable>

                </div>

                <Modal isOpen={this.state.toogleEditModal} toggle={() => this.toggleEdit('save')}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={() => this.toggleEdit('save')}>Risk Question</ModalHeader>

                    <ModalBody>
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

                        <Row style={{ marginTop: 10 }}>
                            <Col>
                                <span style={{ fontSize: 20 }}><b>Question:</b> {this.state.tempData.RiskQuestion}</span>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col>
                                <b>Response Type:</b> {this.state.tempData.ResponseTypeName}
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col md="2">
                                <b>Is Rateable?</b>
                            </Col>
                            <Col>
                                <Input type='checkbox' name='IsRateable' value='IsRateable' id='IsRateable' checked={(this.state.IsRateable)}
                                    onClick={(e) => this.checked(e.target.checked)} />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col md="1">
                                <b>Type</b>
                            </Col>
                            <Col md="2">
                                <div className="input-box">
                                    <Input type="select" name="ResponseWeightTypeName" id="ResponseWeightTypeName" onChange={(e) => this.selectType(e.target.value, 'ResponseWeightTypeName')} value={this.state.ResponseWeightTypeName}>
                                        <option value=''>Select Rating Type</option>
                                        {this.state.systemEndorsementArr.map((type, i) => {
                                            return (<option value={type.StringMapName}>{type.StringMapName}</option>)
                                        })
                                        }
                                    </Input>
                                    <em id="ResponseWeightTypeNameError" className="error invalid-feedback"></em>
                                    {/* <em className="error invalid-feedback" >Please enter mooring registration no</em> */}
                                </div>
                            </Col>
                            <Col md="2">
                                <label>{this.state.effectivedate}</label>
                            </Col>
                            <Col md="3">
                                <Input type="date" name="effectiveDate" id="effectiveDate" onChange={(e) => this.handleChange(e)} value={this.state.effectiveDate}
                                    min={moment().format('YYYY-MM-DD')}
                                    max={moment().add(100, 'years').format('YYYY-MM-DD')}
                                >
                                </Input>
                                <em id="effectiveDateError" className="error invalid-feedback"></em>
                            </Col>
                        </Row>
                        <div>
                            {(this.state.tempData.ResponseTypeName === "ListOfValues") ?   /*<~~~~~~~~~~~LIST~~~~~~~~~~>*/
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
                                                            <Input type="text" name="Rating" id="Rating" value={value.Rating} onChange={this.ListValueValidate('Rating', index)}></Input>
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

                                : (this.state.tempData.ResponseTypeName === "YesNo") ?   /*<~~~~~~~~~~~YESNO~~~~~~~~~~>*/
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
                                                                <Input type="text" name="Rating" id="Rating" value={value.Rating} onChange={this.ListValueValidate('Rating', index)}></Input>
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

                                    : (this.state.tempData.ResponseTypeName === "Number" || this.state.tempData.ResponseTypeName === "Percentage" || this.state.tempData.ResponseTypeName === "Amount") ?   /*<~~~~~~~~~~~NUMBER~~~~~~~~~~>*/
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
                                                                            <Input type="select" name="NumberOperator1" onChange={this.NumberInputValidate('NumberOperator1', index)} value={value.NumberOperator1}>
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
                                                                            <Input type="select" name="NumberOperator2" onChange={this.NumberInputValidate('NumberOperator2', index)} value={value.NumberOperator2}>
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

                                        : (this.state.tempData.ResponseTypeName === "Date" || this.state.tempData.ResponseTypeName === "Year") ?   /*<~~~~~~~~~~~DATE~~~~~~~~~~>*/
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
                                                                        <Input type="select" name="DateOperator1" onChange={this.DateInputValidate('DateOperator1', index)} value={value.DateOperator1}>
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
                                                                        <Input type="select" name="DateOperator2" onChange={this.DateInputValidate('DateOperator2', index)} value={value.DateOperator2}>
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

                                            : (this.state.tempData.ResponseTypeName === "Text") ?   /*<~~~~~~~~~~~TEXT~~~~~~~~~~>*/
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
                    <ModalFooter>
                        <BTN color="success" onClick={() => this.updateQuestion()}><i class="fa fa-check"></i> Update</BTN>{' '}
                        <BTN color="primary" onClick={() => this.toggleEdit('save')}><i class="fa fa-close"></i> Cancel</BTN>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default RiskQuestionList;