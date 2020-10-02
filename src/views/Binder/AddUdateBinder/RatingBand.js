import React, { Component } from 'react';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'react-toastify/dist/ReactToastify.css';
import { Col, Row, Modal, ModalBody, ModalHeader, ModalFooter, Button as BTN, Input } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CommonConfig } from '../../../utils/constants';
import { BulkUpload } from './BulkUpload';
import api from '../../../utils/apiClient';
import APIConstant from '../../../utils/constants';
import moment from 'moment';
import { toast } from 'react-toastify';
import userGuide from "../../../assets/User Manual/Binder Bulk Upload Guide.pdf"

class RatingBands extends Component {
    constructor(props) {
        super(props);

        let columns = [
            { field: "Class", header: "Class", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "Type", header: "Type", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "Country", header: "Country", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { field: "From", header: "From", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "To", header: "To", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { field: "Excess", header: "Excess", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { field: "BaseRateRENP", header: "Base Rate % - RENEWAL", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
            { field: "BaseRateREN", header: "Base Absolute Amount RENEWAL", sortable: true, filter: true, filterMatchMode: 'contains', id: 7 },
            { field: "BaseRateNewP", header: "Base Rate % - NEW Business", sortable: true, filter: true, filterMatchMode: 'contains', id: 8 },
            { field: "BaseRateNew", header: "Base Absolute Amount NEW Business", sortable: true, filter: true, filterMatchMode: 'contains', id: 9 },
            { field: "effectiveDateView", header: "Effective Date", sortable: true, filter: true, filterMatchMode: 'contains', id: 10 },
            { field: "Qualifier", header: "Qualifier", sortable: true, filter: true, filterMatchMode: 'contains', id: 11 },
            { field: "IsCurrent", header: "Is Current", sortable: true, filter: true, filterMatchMode: 'contains', id: 12 },
            { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 13 }
        ];

        let columns1 = [
            { field: "Row", header: "Row", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "Country", header: "Country", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "Class", header: "CLASS", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { field: "Type", header: "TYPE", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "From", header: "Value From", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { field: "To", header: "Value To", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { field: "Excess", header: "Excess", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
            { field: "BaseRateNewP", header: "Base Rate(%) - New Business", sortable: true, filter: true, filterMatchMode: 'contains', id: 7 },
            { field: "BaseRateNew", header: "Absolute - New Business", sortable: true, filter: true, filterMatchMode: 'contains', id: 8 },
            { field: "BaseRateRENP", header: "Base Rate(%) – Renewal", sortable: true, filter: true, filterMatchMode: 'contains', id: 10 },
            { field: "BaseRateREN", header: "Absolute – Renewal", sortable: true, filter: true, filterMatchMode: 'contains', id: 11 },
            { field: "Status", header: "Status", sortable: true, filter: true, filterMatchMode: 'contains', id: 12 },
            { field: "ErrorMessage", header: "Error Message", sortable: true, filter: true, filterMatchMode: 'contains', id: 13 },
        ];

        const orginial = this.setState;
        // this.state = JSON.parse(localStorage.getItem('ratingbandstate'))
        //     ? JSON.parse(localStorage.getItem('ratingbandstate'))
        //     : 
        this.state = {
            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            cols: columns,
            cols1: columns1,
            toogleAddUpdateRatingBandModal: false,
            toogleBulkUpload: false,
            filter: {
                country: "",
                countryid: "",
                classname: "",
                classid: "",
                vesseltype: "",
                vesseltypeid: "",
                displayname: "Current"
            },
            BinderId: "",
            //dev 1
            UMRN: "",
            Excess: "",
            rangeFrom: "",
            rangeTo: "",
            RNRate: "",
            RNABAmount: "",
            newBZRate: "",
            newBZABAmount: "",
            displaynamemaster: [],
            countrymaster: [],
            countryError: false,
            classnamemaster: [],
            classnameError: false,
            vesseltypemaster: [],
            vesseltypeError: false,
            RatingBandsData: [],
            currency: "",
            currencyError: false,
            currencymaster: [],
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            isRate: true,
            rateOrAmount: "Rate",
            paginatorTemplate: "CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",
            rangeFromError: true,
            rangeToError: true,
            ExcessError: true,
            RNRateError: true,
            RNABAmountError: true,
            newBZRateError: true,
            newBZABAmountError: true,
            toggleUpdateModal: false,
            isHideRemoved: false,
            RatingBandsBulkUpload: [],
            showBulkdt: false,
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }

        this.colOptions1 = [];
        for (let col1 of columns1) {
            this.colOptions1.push({ label: col1.header, value: col1 });
        }

        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.export = this.export.bind(this);
        this.downloadUserGuide = this.downloadUserGuide.bind(this);

        var handleCallBack = this.handleCallBack.bind(this);
    }

    downloadUserGuide() {
        window.location.href = userGuide;
    }

    componentWillUnmount() {
        localStorage.removeItem('ratingbandstate')
    }

    getPageString = (e) => {
        let firstPage = e.first + 1;
        let l = e.rows * (e.page + 1);
        let lastPage = (l < this.state.RatingBandsData.length) ? l : this.state.RatingBandsData.length
        var str = firstPage + ' to ' + lastPage + ' out of ' + this.state.RatingBandsData.length + ' records';
        this.setState({ selectedPage: e.first, str: str, rowsPerPage: e.rows });
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    export() {
        this.state.showBulkdt = true;
        this.setState({ showBulkdt: true });
        setTimeout(() => {
            setTimeout(() => {
                this.state.showBulkdt = false;
                this.setState({ showBulkdt: false });
            }, 500);
            this.dt.exportCSV();
        }, 500);
    }

    getVesselType(value) {
        try {
            const data = {
                VesselClassId: value
            };
            api.post(APIConstant.path.getVesselType, data).then(res => {
                if (res.success) {
                    console.log("VesselType....", res.data);
                    var formattedData = [];
                    for (var i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            label: res.data[i].VesselTypeName,
                            value: res.data[i].VesselTypeId,
                        });
                    }
                    this.setState({ vesseltypemaster: formattedData });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getCurrency() {
        try {
            api.get(APIConstant.path.getCurrency).then(res => {
                var formattedData = [];
                if (res.success) {
                    console.log("Currency....", res.data);
                    for (var i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            label: res.data[i].CurrncyCode,
                            value: res.data[i].CurrncyCode,
                        });
                    }
                    this.setState({ currencymaster: formattedData });
                } else {
                }
            }).catch(err => {
            });
        } catch (err) {
        }
    }

    getVesselClass() {
        try {
            api.get(APIConstant.path.getVesselClass).then(res => {
                console.log("getAuthorizeClass", res);
                if (res.success) {
                    console.log("VesselClass....", res.data);
                    var formattedData = [];
                    for (var i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            label: res.data[i].VesselClassName,
                            value: res.data[i].VesselClassId,
                        });
                    }
                    this.setState({ classnamemaster: formattedData });
                } else {

                }
            }).catch(err => {

            });
        } catch (err) {
        }
    }

    getCountry() {
        try {
            const data = {
                stringmaptype: 'COUNTRY',
                orderby: 'sortorder'
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                console.log("===========Bounder Class Data", res.data)
                var formattedData = [];
                if (res.success) {
                    for (var i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].StringMapKey,
                        });
                    }
                    this.setState({ countrymaster: formattedData });
                } else {
                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("err", error);
        }
    }

    editBand(e) {
        debugger;
        var filterData = this.state.filter
        filterData.classname = e.Class
        filterData.vesseltype = e.Type
        filterData.classid = e.VesselClassId
        filterData.vesseltypeid = e.VesselTypeId
        filterData.country = e.Country
        filterData.countryid = e.Country
        this.setState({
            toogleAddUpdateRatingBandModal: true,
            rangeFrom: e.From,
            rangeTo: e.To,
            Excess: e.Excess,
            RNRate: e.BaseRateRENP,
            RNABAmount: e.BaseRateREN,
            newBZRate: e.BaseRateNewP,
            newBZABAmount: e.BaseRateNew,
            currency: e.Currency,
            filter: filterData,
            isEdit: true,
            isView: false,
            isAdd: false,
            effectiveDate: (moment(e.effectiveDate).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD")) ? moment(e.effectiveDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
            rangeFromError: false,
            rangeToError: false,
            ExcessError: false,
            RNRateError: false,
            RNABAmountError: false,
            newBZRateError: false,
            newBZABAmountError: false,
            isRate: e.isRate,
            rateOrAmount: e.rateOrAmount,
            BinderRatingBandHistoryId: e.id,
            Class: e.Class,
            Status: e.Status
        })
    }

    viewBand(e) {
        var filterData = this.state.filter
        filterData.classname = e.Class
        filterData.vesseltype = e.Type
        filterData.classid = e.VesselClassId
        filterData.vesseltypeid = e.VesselTypeId
        filterData.country = e.Country
        filterData.countryid = e.Country
        this.setState({
            toogleAddUpdateRatingBandModal: true,
            rangeFrom: e.From,
            rangeTo: e.To,
            Excess: e.Excess,
            RNRate: e.BaseRateRENP,
            RNABAmount: e.BaseRateREN,
            newBZRate: e.BaseRateNewP,
            newBZABAmount: e.BaseRateNew,
            BinderRatingBandHistoryId: e.id,
            currency: e.Currency,
            filter: filterData,
            isEdit: false,
            isView: true,
            isAdd: false,
            effectiveDate: moment(e.effectiveDate).format("YYYY-MM-DD"),
            rangeFromError: false,
            rangeToError: false,
            ExcessError: false,
            RNRateError: false,
            RNABAmountError: false,
            newBZRateError: false,
            newBZABAmountError: false,
            isRate: e.isRate,
            rateOrAmount: e.rateOrAmount,
            Status: e.Status
        })
    }

    addBand() {
        if (this.state.BinderId == '') {
            toast.error('To add Rating Band Please Create New binder or edit existing Binder');
        }
        else if (this.state.filter.classid == '') {
            toast.error('Please Select Vessel Class');
        } else if (this.state.filter.vesseltypeid == '') {
            toast.error('Please Select Vessel Type');
        } else if (this.state.filter.country == '') {
            toast.error('Please Select Country');
        } else {
            this.setState({
                toogleAddUpdateRatingBandModal: true,
                rangeFrom: '',
                rangeTo: '',
                Excess: '',
                RNRate: '',
                RNABAmount: '',
                newBZRate: '',
                newBZABAmount: '',
                BinderRatingBandHistoryId: '',
                currency: '',
                isEdit: false,
                isView: false,
                isAdd: true,
                isRate: true,
                rateOrAbsolute: "Rate",
                effectiveDate: moment().format("YYYY-MM-DD"),
                rangeFromError: true,
                rangeToError: true,
                ExcessError: true,
                RNRateError: true,
                RNABAmountError: true,
                newBZRateError: true,
                newBZABAmountError: true,
            })
        }
    }

    openDeleteModal = (rowData) => {
        debugger;
        this.setState({
            toggleModal: !this.state.toggleModal,
            BinderRatingBandHistoryId: this.state.BinderRatingBandHistoryId,
            BinderRatingBandFrom: this.state.rangeFrom,
            BinderRatingBandTo: this.state.rangeTo,
            BinderRatingBandVesselClass: this.state.Class,
            BinderRatingBandEffectiveDate: moment(this.state.effectiveDate).format('DD-MM-YYYY')
        });
    }

    toggleLarge = () => {
        this.setState({
            toggleModal: false,
            // BinderRatingBandHistoryId: "",
            // BinderRatingBandFrom: "",
            // BinderRatingBandTo: "",
            // BinderRatingBandVesselClass: "",
        });
    }

    toggleUpdateLarge = () => {
        this.setState({
            toggleUpdateModal: false,
            BinderRatingBandHistoryId: this.state.oldBinderRatingBandHistoryId ? this.state.oldBinderRatingBandHistoryId : this.state.BinderRatingBandHistoryId
            // BinderRatingBandHistoryId: "",
            // BinderRatingBandFrom: "",
            // BinderRatingBandTo: "",
            // BinderRatingBandVesselClass: "",
        });
    }

    deleteBand() {
        let data = {
            "BinderRatingBandHistoryId": this.state.BinderRatingBandHistoryId,
            "UserId": CommonConfig.loggedInUserId(),
            "IsDescard": true,
            "Status": "Inactive",
            "CurrentUser": CommonConfig.loggedInUserId(),
        }
        api.post(APIConstant.path.deleteRatingBinder, data).then(res => {
            if (res.success) {
                debugger;
                // if (res.data[0][0].ErrorMsg !== "") {
                //     console.log(res.data[0][0])
                //     toast.error(res.data[0][0].ErrorMsg);
                // } else {
                toast.success("Rating Band successfully deleted");
                // }
                this.toggleLarge();
                this.getRatingBinder(this.state.BinderId)
                this.setState({ toogleAddUpdateRatingBandModal: false })
            }
        }).catch(err => {
            console.log(err)
        })


    }

    valid() {
        debugger;
        let valid = false;

        if (this.state.rangeFromError) {
            toast.error('Please Enter Range From');
        } else if (this.state.rangeToError) {
            toast.error('Please Enter Range To');
        } else if (this.state.ExcessError) {
            toast.error('Please Enter Excess');
        } else if (this.state.RNRateError && this.state.isRate == true) {
            toast.error('Please Enter Renewal Rate (%)');
        }
        // else if (parseInt(this.state.RNRate) == 0 && this.state.isRate == true) {
        //     toast.error('Please Enter More than 0 Renewal Rate (%)');
        // } 
        else if (this.state.RNABAmountError && this.state.isRate == false) {
            toast.error('Please Enter Renewal Absolute Amount');
        }
        // else if (parseInt(this.state.RNABAmount) == 0 && this.state.isRate == false) {
        //     toast.error('Please Enter More than 0 Renewal Absolute Amount');
        // } 
        else if (this.state.newBZRateError && this.state.isRate == true) {
            toast.error('Please Enter New Business Rate (%)');
        }
        //  else if (parseInt(this.state.newBZRate) == 0 && this.state.isRate == true) {
        //     toast.error('Please Enter More than 0 New Business Rate (%)');
        // } 
        else if (this.state.newBZABAmountError && this.state.isRate == false) {
            toast.error('Please Enter New Business Absolute Amount');
        }
        //  else if (parseInt(this.state.newBZABAmount) == 0 && this.state.isRate == false) {
        //     toast.error('Please Enter More than 0 New Business Absolute Amount');
        // }
        else {
            valid = true;
        }
        return valid;
    }

    updateRatingBand(results) {
        debugger;
        this.setState({
            toggleUpdateModal: true,
            BinderRatingBandHistoryId: results[0].id,
            BinderRatingBandFrom: this.state.rangeFrom,
            BinderRatingBandTo: this.state.rangeTo,
            currentEffectiveDate: this.state.effectiveDate,
            updateEffectiveDate: moment(results[0].effectiveDate).format('DD-MM-YYYY'),
            effectiveDate: results[0].effectiveDate,
            BinderRatingBandVesselClass: this.state.Class,
            oldBinderRatingBandHistoryId: this.state.BinderRatingBandHistoryId,
            isAdd: false,
            isEdit: true,
        });
    }

    addUpdateRatingBand() {
        // this.toggleUpdateLarge();
        if (this.valid()) {
            debugger;

            let results = this.state.RatingBandsData.filter((RatingBands) => {
                return RatingBands.From == this.state.rangeFrom && RatingBands.To == this.state.rangeTo && RatingBands.effectiveDate == this.state.effectiveDate && RatingBands.id !== this.state.BinderRatingBandHistoryId && RatingBands.Status == 'Active';
            });

            let resultsData = this.state.RatingBandsData.filter((RatingBands) => {
                return RatingBands.From == this.state.rangeFrom && RatingBands.To == this.state.rangeTo && RatingBands.id === this.state.BinderRatingBandHistoryId;
            });

            if (results.length > 0) {
                this.updateRatingBand(results);
            } else {

                var isAdd = this.state.isAdd;
                var isEdit = this.state.isEdit;

                if (resultsData.length > 0) {
                    if (this.state.effectiveDate !== resultsData[0].effectiveDate && this.state.isEdit) {
                        isAdd = true;
                        isEdit = false;
                    }
                }

                let data = {
                    "BinderRatingBandHistoryId": this.state.isEdit ? this.state.BinderRatingBandHistoryId : "",
                    "BinderId": this.state.BinderId,
                    "UserId": CommonConfig.loggedInUserId(),
                    "VesselClassId": this.state.filter.classid,
                    "CurrencyId": this.state.currency,
                    "CountryId": this.state.filter.countryid,
                    "VesselTypeId": this.state.filter.vesseltypeid,
                    "Country": this.state.filter.country,
                    "RangeFrom": this.state.rangeFrom.replace(",", ""),
                    "RangeTo": this.state.rangeTo.replace(",", ""),
                    "Excess": this.state.Excess,
                    "RenewalRatePercent": (this.state.RNRate) ? this.state.RNRate : 0,
                    "RenewalRateAbsolute": (this.state.RNABAmount) ? this.state.RNABAmount : 0,
                    "NewBusinessRatePercent": (this.state.newBZRate) ? this.state.newBZRate : 0,
                    "NewBusinessRateAbsolute": (this.state.newBZABAmount) ? this.state.newBZABAmount : 0,
                    "StartDate": this.state.effectiveDate,
                    "IsAdd": isAdd,
                    "IsEdit": isEdit,
                    "IsDescard": false,
                    "CurrentUser": CommonConfig.loggedInUserId(),
                    "LanguageId": this.state.LanguageId,
                    "Status": "Active",
                }

                api.post(APIConstant.path.addUpdateBinderRatingBands, data).then(res => {
                    console.log(res)
                    if (res.success) {
                        var filterData = this.state.filter
                        // filterData.classname = ''
                        // filterData.vesseltype = ''
                        // filterData.classid = ''
                        // filterData.vesseltypeid = ''
                        // filterData.country = ''
                        // filterData.countryid = ''
                        // this.setState({ filter: filterData })
                        toast.success(res.data.message);
                        this.getRatingBinder(this.state.BinderId)
                    } else {
                        toast.error(res.data.message);
                    }
                    this.addRatingBand()
                }).catch(err => {
                    console.log(err)
                    this.addRatingBand()
                })
            }
        }
    }

    getRatingBinder(BinderId) {

        if (this.state.filter.classid != "" || this.state.filter.country != "") {
            let data = {
                "BinderId": BinderId,
                "UserId": CommonConfig.loggedInUserId(),
                "VesselClassId": this.state.filter.classid,
                "VesselTypeId": this.state.filter.vesseltypeid,
                "Country": this.state.filter.country,
                "DisplayName": this.state.filter.displayname,
                // "isHideRemoved": this.state.isHideRemoved
            }
            api.post(APIConstant.path.getBinderRatingBinder, data).then(res => {
                debugger;
                console.log(res)
                if (res.success) {
                    console.log("===========Binder Rating Data")
                    console.log(res.data);
                    this.setState({
                        RatingBandsBulkUpload: res.data[0].map((obj, key) => {
                            return {
                                Row: key + 1,
                                Class: obj.VesselClassName == undefined ? "NA" : obj.VesselClassName,
                                Type: obj.VesselTypeName == undefined ? "NA" : obj.VesselTypeName,
                                From: obj.RangeFrom,
                                To: obj.RangeTo,
                                Excess: obj.Excess,
                                BaseRateRENP: obj.RenewalRatePercent,
                                BaseRateREN: obj.RenewalRateAbsolute,
                                BaseRateNewP: obj.NewBusinessRatePercent,
                                BaseRateNew: obj.NewBusinessRateAbsolute,
                                Country: obj.Country,
                                Status: "",
                                ErrorMessage: "",
                            }
                        })
                    })
                    this.setState({
                        RatingBandsData: res.data[0].map((obj) => {
                            return {
                                id: obj.BinderRatingBandHistoryId,
                                Class: obj.VesselClassName == undefined ? "NA" : obj.VesselClassName,
                                Type: obj.VesselTypeName == undefined ? "NA" : obj.VesselTypeName,
                                From: obj.RangeFrom.toLocaleString(),
                                To: obj.RangeTo.toLocaleString(),
                                Excess: obj.Excess,
                                BaseRateRENP: obj.RenewalRatePercent,
                                BaseRateREN: obj.RenewalRateAbsolute,
                                BaseRateNewP: obj.NewBusinessRatePercent,
                                BaseRateNew: obj.NewBusinessRateAbsolute,
                                VesselClassId: obj.VesselClassId,
                                VesselTypeId: obj.VesselTypeId,
                                Currency: obj.Currency,
                                Country: obj.Country,
                                UMRN: obj.UMRN,
                                isRate: (obj.RenewalRatePercent > 0 && obj.NewBusinessRatePercent > 0) ? true : false,
                                rateOrAmount: (obj.RenewalRatePercent > 0 && obj.NewBusinessRatePercent > 0) ? "Rate" : "Amount",
                                effectiveDate: moment(obj.StartDate).format("YYYY-MM-DD"),
                                effectiveDateView: moment(obj.StartDate).format("DD-MM-YYYY"),
                                Qualifier: obj.Qualifier,
                                IsCurrent: obj.IsCurrent,
                                ACTION: obj.ACTION,
                                Status: obj.Status
                            }
                        })
                    })
                }
            }).catch(err => {
                console.log(err)
            });
        } else {
            toast.error('Please Select Vessel Class or Country');
        }
    }

    actionTemplate(rowData, column) {
        // debugger;
        return <div>
            {(rowData.ACTION == "Edit") ? (
                <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => this.editBand(rowData)}
                    style={{ marginRight: '.5em' }} tooltip="Edit" tooltipOptions={{ position: 'bottom' }}>
                </Button>
            ) : ""}
            {(rowData.ACTION == "View") ? (
                <Button type="button" icon="pi pi-eye" className="p-button-primary" onClick={() => this.viewBand(rowData)}
                    style={{ marginRight: '.5em' }} tooltip="View" tooltipOptions={{ position: 'bottom' }}>
                </Button>
            ) : ""}
            {/* <Button type="button" icon="pi pi-trash" className="p-button-danger" onClick={() => this.deleteBand(rowData)} tooltip="Delete" tooltipOptions={{ position: 'bottom' }}></Button> */}
            {/* <Button type="button" icon="pi pi-trash" className="p-button-danger" tooltip="Delete" onClick={() => this.openDeleteModal(rowData)} tooltipOptions={{ position: 'bottom' }}></Button> */}
        </div>;
    }

    componentWillMount() {

    }

    getBounderRisk(BinderId) {
        let data = {
            "BinderId": BinderId,
            "UserId": CommonConfig.loggedInUserId()
        }
        api.post(APIConstant.path.getBounder, data).then(res => {
            console.log(res)
            if (res.success) {
                console.log("===========Bounder Class Data", res.data)
                // console.log(res.data)
                var formattedData = [];
                if (res.success) {
                    for (var i = 0; i < res.data.length; i++) {
                        formattedData.push({
                            label: res.data[i].Country,
                            value: res.data[i].Country,
                        });
                    }
                    this.setState({ countrymaster: formattedData });
                } else {
                }
            }
        }).catch(err => {
            console.log(err)
        });
    }

    getAuthorizeClass(BinderID) {

        let data = {
            "BinderId": BinderID
        }
        api.post(APIConstant.path.getAuthorizeClass, data).then(res => {
            console.log("getAuthorizeClass", res)
            var formattedData = [];
            if (res.success) {
                for (var i = 0; i < res.data.length; i++) {
                    formattedData.push({
                        label: res.data[i].VesselClassName,
                        value: res.data[i].VesselClassId,
                    });
                }
                this.setState({ classnamemaster: formattedData });
            } else {
            }

        }).catch(err => {
            console.log(err)
        });
    }

    componentDidMount() {
        var splitData = this.props.location.pathname.split("/");
        // if (splitData[3] !== undefined) {

        if (!CommonConfig.isEmpty(splitData[3])) {

            this.setState({ BinderId: splitData[3] })
            // this.getRatingBinder(splitData[3])
            this.getAuthorizeClass(splitData[3])
            this.getBounderRisk(splitData[3])
            this.getBinderData(splitData[3])
        }

        // if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
        //     this.setState({ BinderId: this.props.match.params.Id })
        //     // this.getRatingBinder(this.props.match.params.Id)
        //     this.getAuthorizeClass(this.props.match.params.Id)
        //     this.getBounderRisk(this.props.match.params.Id)
        //     this.getBinderData(this.props.match.params.Id)
        // }
        // this.getCountry()
        this.getCurrency()
        this.getDisplayName()
        // this.getVesselClass()
    }


    getBinderData(binderId) {
        try {
            let data = { "binderId": binderId }
            api.post(APIConstant.path.getBinderDataById, data).then(res => {
                console.log(res);
                var data = res.data[0];
                this.setState({
                    UMRN: data.UMRN,
                    Currency: data.Currency,
                })
                this.GetSelectedAuthorizeGroup(data.BinderId)
                this.getNextBinderList()

            }).catch(err => {
            });
        } catch (err) {
        }
    }

    getDisplayName() {
        try {
            const data = {
                stringmaptype: 'DISPLAYMODE',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    console.log("displayname", res.data);
                    var displayname = [];
                    for (let i = 0; i < res.data.length; i++) {
                        displayname.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ displaynamemaster: displayname });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);

        }
    }

    filterList() {

    }

    selectType = (event, type) => {
        let filterData = this.state.filter
        if (type == "country") {
            if (event.value === '' || event.value === undefined || event.value === null) {
                filterData.country = ""
                filterData.countryid = ""
                this.setState({ filter: filterData })
            } else {
                let index = this.state.countrymaster.findIndex(x => x.value === event.value);
                let data = this.state.countrymaster[index]
                filterData.country = data.value
                filterData.countryid = data.value
                this.setState({ filter: filterData })
            }
        }
        else if (type == "vesseltype") {
            if (event.value === '' || event.value === undefined || event.value === null) {
                filterData.vesseltype = ""
                filterData.vesseltypeid = ""
                this.setState({ filter: filterData })
            } else {
                let index = this.state.vesseltypemaster.findIndex(x => x.value === event.value);
                let data = this.state.vesseltypemaster[index]
                filterData.vesseltype = data.label
                filterData.vesseltypeid = data.value
                this.setState({ filter: filterData })
            }
        }
        else if (type == "classname") {
            if (event.value === '' || event.value === undefined || event.value === null) {
                filterData.classname = ""
                filterData.classid = ""
                this.setState({ filter: filterData })
            } else {
                let index = this.state.classnamemaster.findIndex(x => x.value === event.value);
                let data = this.state.classnamemaster[index]
                filterData.classname = data.label
                filterData.classid = data.value
                this.setState({ filter: filterData })
            }
            this.getVesselType(event.value)

        }
        else if (type == "currency") {
            this.setState({ currency: event.value })
        }

        else if (type == "displayname") {
            if (event.value === '' || event.value === undefined || event.value === null) {
                // filterData.classname = ""
                // filterData.classid = ""
                // this.setState({ filter: filterData })
            } else {
                let index = this.state.displaynamemaster.findIndex(x => x.value === event.value);
                let data = this.state.displaynamemaster[index]
                filterData.displayname = data.label
                this.setState({ filter: filterData })
            }

        }

        else if (type == "rateOrAmount") {
            debugger;
            this.setState({ rateOrAmount: event.value })
            if (event.value == "Rate") {
                this.setState({ isRate: true, RNABAmount: 0, newBZABAmount: 0 })
            } else {
                this.setState({ isRate: false, RNRate: 0, newBZRate: 0 })
            }
        }
    }

    addRatingBand() {
        this.setState({ toogleAddUpdateRatingBandModal: !this.state.toogleAddUpdateRatingBandModal });
    }

    toggleAddUpdate = () => {
        // var filterData = this.state.filter
        // filterData.classname = ''
        // filterData.vesseltype = ''
        // filterData.classid = ''
        // filterData.vesseltypeid = ''
        // filterData.country = ''
        // filterData.countryid = ''
        // this.setState({ filter: filterData })
        this.setState({ toogleAddUpdateRatingBandModal: false, });
    }

    toggleBulkUpload = () => {
        if (this.state.BinderId == '') {
            toast.error('To add Rating Band Please Create New binder or edit existing Binder');
        } else {
            this.setState({
                toogleBulkUpload: !this.state.toogleBulkUpload
            });
        }

    }

    handleCallBack(aBool) {
        this.setState({
            toogleBulkUpload: aBool
        });
        this.getRatingBinder(this.state.BinderId)
    }

    show(field, condition) {
        console.log("show", field);
        console.log("show", condition);
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        } else {
            document.getElementById(field).className = "form-control";
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        let decimalRegExp = CommonConfig.RegExp.decimalWithOne;

        if (e.target.name === 'rangeFrom') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ rangeFromError: true });
                this.show("rangeFrom", true);
            } else {
                if (!decimalRegExp.test(e.target.value)) {
                    this.setState({ rangeFromError: true });
                    this.show("rangeFrom", true);
                } else {
                    this.setState({ rangeFromError: false, rangeFrom: e.target.value });
                    this.show("rangeFrom", false);
                }
            }
        }

        if (e.target.name === 'rangeTo') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ rangeToError: true });
                this.show("rangeTo", true);
            } else {
                if (!decimalRegExp.test(e.target.value)) {
                    this.setState({ rangeToError: true });
                    this.show("rangeTo", true);
                } else {
                    this.setState({ rangeToError: false, rangeTo: e.target.value });
                    this.show("rangeTo", false);
                }
            }
        }

        if (e.target.name === 'Excess') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ ExcessError: true });
                this.show("Excess", true);
            } else {
                if (!decimalRegExp.test(e.target.value)) {
                    this.setState({ ExcessError: true });
                    this.show("Excess", true);
                } else {
                    this.setState({ ExcessError: false, Excess: e.target.value });
                    this.show("Excess", false);
                }
            }
        }

        if (e.target.name === 'RNRate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ RNRateError: true });
                this.show("RNRate", true);
            } else {
                if (!decimalRegExp.test(e.target.value)) {
                    this.setState({ RNRateError: true });
                    this.show("RNRate", true);
                } else {
                    this.setState({ RNRateError: false, RNRate: e.target.value });
                    this.show("RNRate", false);
                }
            }
        }

        if (e.target.name === 'RNABAmount') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ RNABAmountError: true });
                this.show("RNABAmount", true);
            } else {
                if (!decimalRegExp.test(e.target.value)) {
                    this.setState({ RNABAmountError: true });
                    this.show("RNABAmount", true);
                } else {
                    this.setState({ RNABAmountError: false, RNABAmount: e.target.value });
                    this.show("RNABAmount", false);
                }
            }
        }

        if (e.target.name === 'newBZRate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ newBZRateError: true });
                this.show("newBZRate", true);
            } else {
                if (!decimalRegExp.test(e.target.value)) {
                    this.setState({ newBZRateError: true });
                    this.show("newBZRate", true);
                } else {
                    this.setState({ newBZRateError: false, newBZRate: e.target.value });
                    this.show("newBZRate", false);
                }
            }
        }

        if (e.target.name === 'newBZABAmount') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ newBZABAmountError: true });
                this.show("newBZABAmount", true);
            } else {
                if (!decimalRegExp.test(e.target.value)) {
                    this.setState({ newBZABAmountError: true });
                    this.show("newBZABAmount", true);
                } else {
                    this.setState({ newBZABAmountError: false, newBZABAmount: e.target.value });
                    this.show("newBZABAmount", false);
                }
            }
        }

        if (e.target.name === 'effectiveDate') {
            if (e.target.value === '' || e.target.value === null) {
                this.setState({ effectiveDateError: true });
                this.show("effectiveDate", true);
            } else {
                this.setState({ effectiveDateError: false, effectiveDate: e.target.value });
                this.show("effectiveDate", false);
            }
        }

        if (e.target.name === 'isHideRemoved') {
            debugger;
            this.setState({ isHideRemoved: e.target.checked, RatingBandsDataAll: this.state.RatingBandsData });
            if (e.target.checked) {
                let results = this.state.RatingBandsData.filter((RatingBands) => {
                    return RatingBands.Status !== 'Inactive';
                });
                this.setState({ RatingBandsData: results })
            } else {
                this.setState({ RatingBandsData: this.state.RatingBandsDataAll })
            }

        }

    }

    render() {
        // console.log("Rating Band---", this.state)
        let columns1 = '';
        let columns = '';
        if (this.state.showBulkdt == true) {
            columns1 = this.state.cols1.map((col, i) => {
                return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} />;
            });
        } else {
            columns = this.state.cols.map((col, i) => {
                return <Column key={i} field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode={col.filterMatchMode} />;
            });
        }

        return (
            <div>
                <div className="basic-header">
                    <div className="input-box col-md-12">
                        <Row>
                            <Col md="1.5" style={{ padding: "0px 10px" }}>
                                <label>Class Name *</label>
                            </Col>
                            <Col md="2.5">
                                <Input type="select" name="classname" id="classname" onChange={(e) => this.selectType(e.target, 'classname')} value={this.state.filter.classid}>
                                    <option value=''>Select class name</option>
                                    {this.state.classnamemaster.map((type, i) => { return (<option value={type.value} label={type.label}></option>) })}
                                </Input>
                                <em className="error invalid-feedback" >Please select ClassName</em>
                            </Col>
                            <Col md="1.5" style={{ padding: "0px 10px" }}>
                                <label>Vessel Type *</label>
                            </Col>
                            <Col md="2.5">
                                <Input type="select" name="vesseltype" id="vesseltype" onChange={(e) => this.selectType(e.target, 'vesseltype')} value={this.state.filter.vesseltypeid}>
                                    <option value=''>Select VesselType</option>
                                    {this.state.vesseltypemaster.map((type, i) => { return (<option value={type.value} label={type.label}>{type.label}</option>) })}
                                </Input>
                                <em className="error invalid-feedback" >Please select VesselType</em>
                            </Col>
                            <Col md="1.5" style={{ padding: "0px 10px" }}>
                                <label>Country *</label>
                            </Col>
                            <Col md="2.5">
                                <Input type="select" name="country" id="country" onChange={(e) => this.selectType(e.target, 'country')} value={this.state.filter.country}>
                                    <option value='' >Select Country</option>
                                    {this.state.countrymaster.map((type, i) => { return (<option value={type.value} label={type.label}>{type.label}</option>) })}
                                </Input>
                                <em className="error invalid-feedback" >Please select Country</em>
                            </Col>
                            <Col md="1.5" style={{ padding: "0px 10px" }}>
                                <label>Display Name *</label>
                            </Col>
                            <Col md="2.5">
                                <Input type="select" name="displayname" id="displayname" onChange={(e) => this.selectType(e.target, 'displayname')} value={this.state.filter.displayname}>
                                    {this.state.displaynamemaster.map((type, i) => { return (<option value={type.value} label={type.label}>{type.label}</option>) })}
                                </Input>
                                <em className="error invalid-feedback" >Please select Country</em>
                            </Col>
                            <Col md="1">
                                <BTN color="success" style={{ marginRight: '.5em', borderRadius: "20px" }} onClick={() => this.getRatingBinder(this.state.BinderId)} title="Go" > Go </BTN>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="header-right-option col-md-5" style={{ marginLeft: "auto" }}>

                    <Input type="checkbox" name="isHideRemoved" id="isHideRemoved" onChange={(e) => this.handleChange(e)} value={this.state.isHideRemoved} checked={this.state.isHideRemoved == true} />
                    <label>Hide Removed</label>

                    <Button type="button" icon="pi pi-plus" tooltip="Add Rating Band" tooltipOptions={{ position: 'bottom' }} onClick={() => this.addBand()}></Button>
                    <Button type="button" tooltip="Bulk Uploads" label="Bulk Uploads" tooltipOptions={{ position: 'bottom' }} onClick={() => this.toggleBulkUpload()} style={{ margin: "0px 10px" }}></Button>

                    <MultiSelect value={this.state.cols} options={this.colOptions}
                        fixedPlaceholder={true} placeholder={CommonConfig.dataTableConfig.columnToggleIcon} tooltip="Show / Hide Column"
                        onChange={this.onColumnToggle} style={{ width: '50px' }}
                    />
                    {/* <Button type="button" icon="pi pi-plus" tooltip="Add RatingBands" tooltipOptions={{ position: 'bottom' }} onClick={() => this.addRatingBand()}></Button> */}
                    <Button type="button" icon="pi pi-external-link" tooltip="Export as CSV" tooltipOptions={{ position: 'bottom' }} onClick={this.export} style={{ marginRight: 10 }}></Button>

                    <Button type="button" icon="pi pi-question-circle" tooltip="Bulk Upload User Guide" tooltipOptions={{ position: 'bottom' }} onClick={this.downloadUserGuide} style={{ marginRight: 10 }}></Button>

                </div>

                {(this.state.showBulkdt == true) ? (
                    <div className="table-custom">
                        <DataTable ref={(el) => this.dt = el} value={this.state.RatingBandsBulkUpload} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                            paginator={true} rows={this.state.rowsPerPage} totalRecords={this.state.RatingBandsBulkUpload.length} exportFilename="Rating Band List"

                            currentPageReportTemplate={this.state.str} scrollable={true} scrollHeight="340px"
                            paginatorTemplate={this.state.paginatorTemplate}
                            rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                            responsive={true} resizableColumns={true} columnResizeMode="fit" //stateKey="contactList" stateStorage="local" header={header} 
                        >
                            {columns1}
                        </DataTable>
                    </div>

                ) : (
                        <div className="table-custom">
                            <DataTable ref={(el) => this.dt = el} value={this.state.RatingBandsData} first={this.state.selectedPage} onPage={(e) => this.getPageString(e)}
                                paginator={true} rows={this.state.rowsPerPage} totalRecords={this.state.RatingBandsData.length} exportFilename="Rating Band List"

                                currentPageReportTemplate={this.state.str} scrollable={true} scrollHeight="340px"
                                paginatorTemplate={this.state.paginatorTemplate}
                                rowsPerPageOptions={this.state.rowsPerPageOptions} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                                responsive={true} resizableColumns={true} columnResizeMode="fit" //stateKey="contactList" stateStorage="local" header={header} 
                            >
                                {columns}
                            </DataTable>
                            <Modal isOpen={this.state.toogleAddUpdateRatingBandModal} toggle={() => this.toggleAddUpdate()}
                                className={'modal-lg ' + this.props.className}>
                                <ModalHeader toggle={() => this.toggleAddUpdate()}>Add/Update RatingBands</ModalHeader>
                                <ModalBody>
                                    <Row>
                                        <Col md="3">
                                            <label>Binder</label>
                                        </Col>
                                        <Col md="5">
                                            <label>{this.state.UMRN}</label>
                                        </Col>
                                        <Col md="1">
                                            <label>Currency</label>
                                        </Col>
                                        <Col md="3">
                                            <label>{this.state.Currency}</label>
                                        </Col>
                                        {/* <Col md="3">
                                    <Input type="select" name="currency" id="currency" onChange={(e) => this.selectType(e.target, 'currency')} value={this.state.currency}>
                                        <option value='' disabled={"disabled"}>Select Currency</option>
                                        {this.state.currencymaster.map((type, i) => { return (<option value={type.value} label={type.label}>{type.label}</option>) })}
                                    </Input>
                                    <em className="error invalid-feedback" >Please select Currency</em>
                                </Col> */}
                                    </Row>
                                    <Row>
                                        <Col md="2">
                                            <label>Class Name</label>
                                        </Col>
                                        <Col md="2">
                                            <label>{this.state.filter.classname}</label>
                                        </Col>
                                        <Col md="2">
                                            <label>Vessel Type</label>
                                        </Col>
                                        <Col md="2">
                                            <label>{this.state.filter.vesseltype}</label>
                                        </Col>
                                        <Col md="2">
                                            <label>Country</label>
                                        </Col>
                                        <Col md="2">
                                            <label>{this.state.filter.country}</label>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="3">
                                            <label>Range From*</label>
                                        </Col>
                                        <Col md="3">
                                            <Input type="text" disabled={this.state.isEdit || this.state.isView} name="rangeFrom" id="rangeFrom" placeholder="Range From"
                                                onChange={(e) => this.handleChange(e)} value={this.state.rangeFrom}
                                            />
                                            <em className="error invalid-feedback" >Please Enter Range From</em>
                                        </Col>
                                        <Col md="3">
                                            <label>To*</label>
                                        </Col>
                                        <Col md="3">
                                            <Input type="text" disabled={this.state.isEdit || this.state.isView} name="rangeTo" id="rangeTo" placeholder="Range To"
                                                onChange={(e) => this.handleChange(e)} value={this.state.rangeTo}
                                            />
                                            <em className="error invalid-feedback" >Please Enter Range To </em>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="3">
                                            <label>Excess*</label>
                                        </Col>
                                        <Col md="3">
                                            <Input type="text" disabled={this.state.isView} name="Excess" id="Excess" onChange={(e) => this.handleChange(e)} value={this.state.Excess}>
                                            </Input>
                                            <em className="error invalid-feedback" >Please Enter Excess</em>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md="3">
                                            <label>Rate or Amount*</label>
                                        </Col>
                                        <Col md="3">
                                            <Input type="select" disabled={this.state.isView} name="rateOrAmount" id="rateOrAmount" onChange={(e) => this.selectType(e.target, 'rateOrAmount')} value={this.state.rateOrAmount}>
                                                <option value='Rate'>Rate(%)</option>
                                                <option value='Amount'>Absolute Amount</option>
                                            </Input>
                                        </Col>
                                    </Row>


                                    {(this.state.isRate) ? (<Row>
                                        <Col md="3">
                                            <label>Renewal Rate (%)*</label>
                                        </Col>
                                        <Col md="3">
                                            <Input type="text" disabled={this.state.isView} name="RNRate" id="RNRate" onChange={(e) => this.handleChange(e)} value={this.state.RNRate}>
                                            </Input>
                                            <em className="error invalid-feedback" >Please Enter Renewal Rate (%)</em>
                                        </Col>
                                        <Col md="3">
                                            <label>New Business Rate (%)*</label>
                                        </Col>
                                        <Col md="3">
                                            <Input type="text" disabled={this.state.isView} name="newBZRate" id="newBZRate" onChange={(e) => this.handleChange(e)} value={this.state.newBZRate}>
                                            </Input>
                                            <em className="error invalid-feedback" >Please Enter New Business Rate (%)</em>
                                        </Col>
                                    </Row>) : (<Row>
                                        <Col md="3">
                                            <label>Renewal Absolute Amount*</label>
                                        </Col>
                                        <Col md="3">
                                            <Input type="text" disabled={this.state.isView} name="RNABAmount" id="RNABAmount" onChange={(e) => this.handleChange(e)} value={this.state.RNABAmount}>
                                            </Input>
                                            <em className="error invalid-feedback" >Please Enter Renewal Absolute Amount</em>
                                        </Col>
                                        <Col md="3">
                                            <label>New Business Absolute Amount*</label>
                                        </Col>
                                        <Col md="3">
                                            <Input type="text" disabled={this.state.isView} name="newBZABAmount" id="newBZABAmount" onChange={(e) => this.handleChange(e)} value={this.state.newBZABAmount}>
                                            </Input>
                                            <em className="error invalid-feedback" >Please Enter New Business Absolute Amount</em>
                                        </Col>
                                    </Row>)}

                                    <Row>
                                        <Col md="3">
                                            <label>Effective Date</label>
                                        </Col>
                                        <Col md="3">
                                            <Input type="date" name="effectiveDate" disabled={this.state.isView} id="effectiveDate" onChange={(e) => this.handleChange(e)} value={this.state.effectiveDate}
                                                min={moment().format('YYYY-MM-DD')}
                                                max={moment().add(100, 'years').format('YYYY-MM-DD')}
                                            >
                                            </Input>
                                            <em className="error invalid-feedback" >Please Enter Valid Effective Date</em>
                                        </Col>
                                    </Row>
                                </ModalBody>
                                <ModalFooter>
                                    {(this.state.isEdit || this.state.isAdd) ? (<BTN color="success" onClick={() => this.addUpdateRatingBand()}><i class="fa fa-check"></i> Save</BTN>) : ""}
                                    {(this.state.isEdit && this.state.effectiveDate > moment().format('YYYY-MM-DD')) ? (<BTN color="danger" onClick={() => this.openDeleteModal()}><i class="fa fa-times"></i> Discard</BTN>) : ""}
                                    <BTN color="primary" onClick={() => this.toggleAddUpdate()}><i class="fa fa-angle-left"></i> Cancel</BTN>
                                </ModalFooter>
                            </Modal>

                            <Modal isOpen={this.state.toogleBulkUpload} toggle={() => this.toggleBulkUpload()}
                                className={'modal-lg ' + this.props.className} style={{ maxWidth: "1200px" }}>
                                <ModalHeader toggle={() => this.toggleBulkUpload()}>Bulk Upload</ModalHeader>
                                <ModalBody>
                                    <BulkUpload name="bhavik" BinderId={this.state.BinderId}
                                        handleCallBack={this.handleCallBack.bind(this)}
                                    ></BulkUpload>
                                </ModalBody>
                            </Modal>

                            <Modal isOpen={this.state.toggleModal} toggle={this.toggleLarge}
                                className={'modal-lg ' + this.props.className}>
                                <ModalHeader toggle={this.toggleLarge}>Delete Rating Band</ModalHeader>
                                <ModalBody>
                                    Are you sure, You want to delete {this.state.BinderRatingBandVesselClass} {this.state.BinderRatingBandFrom} - {this.state.BinderRatingBandTo} of {this.state.BinderRatingBandEffectiveDate} Rating Band?
                    </ModalBody>
                                <ModalFooter>
                                    <BTN color="success" onClick={() => this.deleteBand()}><i class="fa fa-check"></i> Delete</BTN>{' '}
                                    <BTN color="primary" onClick={this.toggleLarge}><i class="fa fa-close"></i>Cancel</BTN>
                                </ModalFooter>
                            </Modal>

                            <Modal isOpen={this.state.toggleUpdateModal} toggle={this.toggleUpdateLarge}
                                className={'modal-lg ' + this.props.className}>
                                <ModalHeader toggle={this.toggleUpdateLarge}>Update Rating Band</ModalHeader>
                                <ModalBody>
                                    We have already record of {this.state.updateEffectiveDate} for {this.state.BinderRatingBandFrom} - {this.state.BinderRatingBandTo} Rating Band. <br /> Do You want to update {this.state.BinderRatingBandVesselClass} {this.state.BinderRatingBandFrom} - {this.state.BinderRatingBandTo} Rating Band?
                    </ModalBody>
                                <ModalFooter>
                                    <BTN color="success" onClick={() => { this.addUpdateRatingBand(); this.toggleUpdateLarge(); }}><i class="fa fa-check"></i> Yes</BTN>{' '}
                                    <BTN color="primary" onClick={this.toggleUpdateLarge}><i class="fa fa-close"></i>No</BTN>
                                </ModalFooter>
                            </Modal>

                        </div>

                    )}

            </div>
        );
    }
}

export default withTranslation()(RatingBands);