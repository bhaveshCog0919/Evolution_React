import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, Button as BTN, InputGroup } from 'reactstrap';
import api from '../../../utils/apiClient';
import { CommonConfig } from '../../../utils/constants';
import moment from 'moment';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import APIConstant from '../../../utils/constants';

class VesselClassHistory extends Component {
    constructor(props) {
        super(props);

        const { t } = props;
        let columns = [
            { field: "vesselClassCode", header: "ClassID", sortable: true, filter: true, filterMatchMode: 'contains', id: 0 },
            { field: "vesselClassName", header: "ClassName", sortable: true, filter: true, filterMatchMode: 'contains', id: 1 },
            { field: "vesselTypeCount", header: "NoofTypes", sortable: true, filter: true, filterMatchMode: 'contains', id: 2 },
            { field: "adminFee", header: "AdminFee", sortable: true, filter: true, filterMatchMode: 'contains', id: 3 },
            { field: "currency", header: "Currency", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
            { field: "sortOrder", header: "SortOrder", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
            { field: "effective_date", header: "Effective Date", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
            // { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 7 }
        ];

        this.state = {
            toggleModal: false,
            vesselClassList: [],

            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,

            vesselClassId: '',
            vesselClassCode: '',

            vesselClassName: '',
            vesselClassNameError: true,

            adminFee: '',
            adminFeeError: true,

            currency: 'Euro',
            currencyError: false,
            currencyList: [],

            effectivedate: 'Effective Date',
            effectiveDate: '',
            effectiveDateError: true,

            sortOrder: '',

            cols: columns,
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            selectedPage: 0,
            str: '',
            globalFilter: null,

            heading: 'Add',
            buttonName: 'Save',
            toastName: 'Saved',
            primary: false,
            toggleModal: false,
            SortOrderInc: "",
            isVessel: false
        };

        this.colOptions = [];
        for (let col of columns) {
            this.colOptions.push({ label: col.header, value: col });
        }
        this.onColumnToggle = this.onColumnToggle.bind(this);
        // this.actionTemplate = this.actionTemplate.bind(this);
    }

    componentDidMount() {
        console.log('this.props',this.props);
        
        if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
            this.getVesselClassHistoryList(this.props.match.params.Id)
        }
    }

    getVesselClassHistoryList(Id) {
        var dataToSent = {
            VesselClassId: Id,
        }
        api.post('api/getVesselClassHistoryList', dataToSent).then(res => {
            console.log('getVesselClassHistoryList', res);
            var formattedArr = [];
            for (var i = 0; i < res.data.length; i++) {
                formattedArr.push({
                    vesselClassId: res.data[i].VesselClassId,
                    vesselClassCode: res.data[i].VesselClassCode,
                    vesselClassName: res.data[i].VesselClassName,
                    vesselTypeCount: res.data[i].VesselTypeCount,
                    adminFee: res.data[i].AdminFee,
                    currency: res.data[i].Currency,
                    sortOrder: res.data[i].SortOrder,
                    effective_date: moment(res.data[i].StartDate).format(CommonConfig.dateFormat.forDatePicker),
                    isVessel: true
                });
            }
            console.log('formattedArr',formattedArr);            
            this.setState({ vesselClassList: formattedArr })
        })
    }

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    show(field, condition) {
        if (condition) {
            document.getElementById(field).className = "form-control is-invalid";
        } else {
            document.getElementById(field).className = "form-control";
        }
    }

    render() {
        const { t } = this.props;
        let columns = this.state.cols.map((col, i) => {
            return <Column field={col.field} header={col.header} body={col.body} sortable={col.sortable} filter={col.filter} filterMatchMode="contains" />;
        });
        return (
            <div>
                <div className="basic-header">
                    <h1>Vessel Class History</h1>
                </div>

                <div className="table-custom">
                    <DataTable
                        ref={(el) => this.dt = el}
                        value={this.state.vesselClassList}
                        first={this.state.selectedPage}
                        onPage={(e) => this.getPageString(e)}
                        paginator={true}
                        rows={this.state.rowsPerPage}
                        totalRecords={this.state.vesselClassList.length}
                        exportFilename={t("masterVesselClass:Export_File")}
                        currentPageReportTemplate={this.state.str}
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={this.state.rowsPerPageOptions}
                        globalFilter={this.state.globalFilter}
                        emptyMessage={t("translation:NoRecordsMsg")}
                        responsive={true}
                        resizableColumns={true}
                        columnResizeMode="fit"
                        scrollHeight="340px">
                        {columns}
                    </DataTable>
                </div>
            </div>
        )
    }
}

export default withTranslation()(VesselClassHistory);