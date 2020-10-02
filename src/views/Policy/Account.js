import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Menu } from 'primereact/menu';
import { Button as BTN } from 'primereact/button';
import { apiBase } from '../../utils/config';
import { Modal, ModalHeader, Col, Row, Input, Button, InputGroup, UncontrolledTooltip } from 'reactstrap';
import api from '../../utils/apiClient';
import APIConstant from '../../utils/constants';
import moment from 'moment';
import { CommonConfig } from '../../utils/constants';
import { withTranslation } from 'react-i18next';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';

var IBAN = require('iban');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'JWT fefege...',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    'X-Requested-With': 'XMLHttpRequest'
};
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

class Account extends Component {

    constructor(props) {

        super(props);

        let columns = [
            // { dataField: "SequenceNumber", text: "#" },
            { dataField: "TransactionDate", text: "Txn Date" },
            { dataField: "Narration", text: "Transaction" },
            { dataField: "UniqueReferenceId", text: "Reference ID" },
            { dataField: "ClientTransactionType", text: "Description" },
            { dataField: "AmountCharge", text: "Amount Charged", formatter: this.formatAmountChargedData },
            { dataField: "TotalPaymentAmount", text: "Payment Amount", formatter: this.formatPaymentData },
            // { dataField: "PaymentMode", text: "Payment Mode" },
            { dataField: "CreatedBy", text: "Added By" },
            { dataField: "Balance", text: "Balance", formatter: this.formatBalanceData },
            { dataField: "Action", text: "Actions", formatter: this.actionFormatter, edit: this.editAccount, accountRecordActions: this.accountRecordActions },
        ];

        this.state = {
            LanguageId: (props.i18n.language === 'en') ? 'en-GB' : (props.i18n.language === 'es') ? 'es-ES' : (props.i18n.language === 'ie') ? 'en-IE' : props.i18n.language,
            policyAccountList: [],
            PolicyComputation: '',
            isEdit: false,
            EntityBankDetailId: '',
            brand: null,
            colors: null,
            delPolicyId: [],
            toggleModalDel: false,
            toggleModalAdd: false,
            cols: columns,
            arr: [],
            rowData: '',
            selectedPage: 0,
            rowsPerPageOptions: CommonConfig.dataTableConfig.rowsPerPageOptions,
            str: '',
            rowsPerPage: CommonConfig.dataTableConfig.rowsPerPage,
            globalFilter: null,
            toggleNewEntryModal: false,
            toggleBnkDetailsModal: false,

            policyNumber: props.PolicyNumber,
            policyType: props.PolicyType,
            policyHolder: props.PolicyHolder,
            policyId: '',
            EntityId: '',
            EntityType: '',
            referenceId: '',

            PolicyAccountId: "",
            accountData: "",
            newEntryDate: moment().format('DD-MM-YYYY'),
            newEntryDateError: false,
            transactionType: 'Debit',
            description: '',
            descriptionError: true,
            chargeAmount: 0,
            chargeAmountError: true,
            chargeFee: 0,
            chargeFeeError: '',
            totalChargeAmount: 0,
            totalChargeAmountError: '',
            paymentAmount: 0,
            paymentAmountError: true,
            paymentMode: '',
            paymentModeError: true,
            paymentDue: 0,
            paymentStatus: '',
            paymentStatusError: true,
            note: '',
            addedBy: '',
            addedDate: '',
            updatedBy: '',
            updatedDate: '',
            paymentModearr: [],
            returnPaymentModearr: [],
            paymentStatusarr: [],
            isMakePayment: false,
            isReturnPayment: false,
            country: '',
            IBAN: '',
            IBANError: true,

            journalEntry: '',
            journalEntryError: true,
            journalDebitData: [],

            BIC: '',
            BICError: false,

            bankCountry: '',
            bankCountryError: true,
            countryList: [],

            bankName: '',
            bankNameError: true,

            accountName: '',
            accountNameError: true,
            bankDetailsRes: [],

            CurrencySymbol: '',
            calculateBalanceAFTPay: 0,

            TransactionType: '',
            toggleModal: false,
            regenerateDoc: [],

            outstanding: 0,
            existOutstanding: 0,
            updatedPremium: 0,
            updatedPremiumAdminFee: 0,
            updatedPremiumLevy: 0,
            updatedPremiumLessLevy: 0,
            showCalculation: false,

            isAccountRecordEdit: false,
            Currency: 'Euro',
            CardholderName: '',
            CardNumber: '',
            CardType: 'VISA',
            ExpiryMonth: '1',
            ExpiryYear: '2020',
            CVV: '',
            IsSelectedCard: 0,
            RenewalDate: '',
            Forename: '',
            Surname: '',
            EmailId: '',
            ContactTelephoneNumber: '',
            CardholderNameError: false,
            CardNumberError: false,
            CardTypeError: false,
            ExpiryMonthError: false,
            ExpiryYearError: false,
            CVVError: false,

            isPaymentPopup: false,
            SystemOutstandingTransactions: [],
            OutstandingTransactions: [],

            entryType: '',
            entryTypeError: true,
            journalDebitData: [],
            journalCreditData: [],

            IsLapsePolicy: 0,
            DaysOverdue: 0,
            RenewalDate: '',

            IsLapsePolicyPopup: false,
            lapsePolicyNote: '',

            isGenerateRenewal: 0,
            PremiumType: '',
            isPolicyRenewal: 0,

            expandedRows: null,
            childAccountData: [],

            subAccMenu: false,
            returnPaymentData: {},

            isTransferFundPopup: false,
            transferFundData: {},
            PolicyOutstandingTransactions: [],
            SystemPolicyOutstandingTransactions: [],
            paymentAmountRemains: 0
        };

        this.onColumnToggle = this.onColumnToggle.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        // this.export = this.export.bind(this);

        /*
        let columns = [
          { field: "SequenceNumber", header: "#", sortable: true, filter: true, id: 0, style: { width: '2%' }, expander: true },
          { field: "TransactionDate", header: "Txn Date", sortable: true, filter: true, filterMatchMode: 'contains', id: 1, },
          { field: "Narration", header: "Transaction", sortable: true, filter: true, filterMatchMode: 'contains', id: 1, },
          { field: "UniqueReferenceId", header: "Txn ID", sortable: true, filter: true, filterMatchMode: 'contains', id: 2, },
          { field: "ClientTransactionType", header: "Description", sortable: true, filter: true, filterMatchMode: 'contains', id: 3, },
          { body: this.formatAmountChargedData.bind(this), field: "AmountCharge", header: "Amount Charged", sortable: true, filter: true, filterMatchMode: 'contains', id: 4 },
          { body: this.formatPaymentData.bind(this), field: "PaymentAmount", header: "Payment Amount", sortable: true, filter: true, filterMatchMode: 'contains', id: 5 },
          { field: "PaymentMode", header: "Payment Mode(Status)", sortable: true, filter: true, filterMatchMode: 'contains', id: 6 },
          { field: "CreatedBy", header: "Added By", sortable: true, filter: true, filterMatchMode: 'contains', id: 7 },
          // { field: "UpdatedBy", header: "Updated by", sortable: true, filter: true, filterMatchMode: 'contains', id: 8 },
          { body: this.formatBalanceData.bind(this), field: "Balance", header: "Balance", sortable: true, filter: true, filterMatchMode: 'contains', id: 9 },
          { body: this.actionTemplate.bind(this), header: "Action", sortable: false, filter: false, filterMatchMode: 'contains', id: 10, style: { width: '12%' } }
        ];*/

        /*this.colOptions = [];
        for (let col of columns) {
          this.colOptions.push({ label: col.header, value: col });
        }*/

    }

    componentDidMount() {

        this.setState({ newEntryDate: moment().format('YYYY-MM-DD') })
        if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
            this.setState({ policyId: this.props.match.params.id, EntityId: this.props.EntityId, EntityType: this.props.EntityType, CurrencySymbol: this.props.CurrencySymbol, RenewalDate: this.props.RenewalDate, Currency: this.props.currency });
        }
        this.getAccountDetails();
        this.getDropDownValues();
        this.getPaymentMode();
        this.getReturnPaymentMode();
        this.getJournalDebitData();
        this.getJournalCreditData();
        this.getPaymentStatus();
        this.getDropDownValues('POLICYCOUNTRY', 'countryList', 'StringMapName');
        this.getUserBankAccountDetails();
        this.getPolicyDetails();
        this.getPaymentDetails();
        this.getLapsePolicyDetails();

        this.isGenerateRenewal();
    }

    isGenerateRenewal() {
        const data = { policyId: this.props.match.params.id };
        api.post(APIConstant.path.isGenerateRenewal, data).then(res => {
            console.log('PolicyAccount isGenerateRenewal', res);
            if (res.success) {
                if (!CommonConfig.isEmpty(res.data[0].returnValue) && res.data[0].returnValue != 0) {
                    console.log('res.data[0].returnValue', res.data[0].returnValue);
                    this.setState({ isGenerateRenewal: res.data[0].returnValue, PremiumType: 'Renewal', isPolicyRenewal: 1 })
                }
            } else {
                console.log('error');
            }
        }).catch(err => {

        });
    }

    getPaymentDetails() {
        try {
            const data = {
                policyId: this.props.match.params.id,
            };
            api.post('api/getpaymentholderdetails', data).then(res => {
                if (res.success) {

                    let resdata = res.data[0];
                    this.setState({
                        EntityId: resdata[0].EntityId,
                        EntityType: resdata[0].EntityType,
                        RenewalDate: resdata[0].RenewalDate,
                        Forename: resdata[0].Forename,
                        Surname: resdata[0].Surname,
                        EmailId: resdata[0].EmailId,
                        ContactTelephoneNumber: resdata[0].CountryCode + ' ' + resdata[0].AreaCode + ' ' + CommonConfig.formatPhoneNumber(resdata[0].Phone),
                        // SelectSavedCard:res.data[0].SelectSavedCard,
                        // CardholderName: res.data[0].CardholderName,
                        // CardNumber: res.data[0].CardNumber,
                        // CardType: res.data[0].CardType,
                        // ExpiryMonth: res.data[0].ExpiryMonth,
                        // ExpiryYear: res.data[0].ExpiryYear,
                        // IsSelectedCard: res.data[0].IsSelectedCard,
                    });
                } else {
                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);
        }
    }

    getPolicyDetails() {
        try {
            const data = {
                policyId: this.props.match.params.id,
            };
            api.post('api/getPolicyComputation', data).then(res => {
                if (res.success) {
                    console.log("-i-i-i-i--i-i--i---i---i", res.data[0]);
                    let resdata = res.data[0];
                    this.setState({ PolicyComputation: resdata });
                    console.log("-i-i-i-i--i-i--i---i---i", this.state.PolicyComputation);
                } else {
                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);
        }
    }

    getDropDownValues(stringMapType, setStateName, orderBy) {
        try {
            const data = {
                stringmaptype: stringMapType,
                orderby: orderBy
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    this.setState({ [setStateName]: res.data });
                } else {
                }
            }).catch(err => {
            });
        } catch (error) {
        }
    }

    getJournalDebitData() {
        try {
            const data = {
                stringmaptype: 'JOURNALENTRYDEBIT',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var journalDebitData = [];
                    for (let i = 0; i < res.data.length; i++) {
                        journalDebitData.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ journalDebitData: journalDebitData });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);
        }
    }

    getJournalCreditData() {
        try {
            const data = {
                stringmaptype: 'JOURNALENTRYCREDIT',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var journalCreditData = [];
                    for (let i = 0; i < res.data.length; i++) {
                        journalCreditData.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ journalCreditData: journalCreditData });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);
        }
    }

    getPaymentMode() {
        try {
            const data = {
                stringmaptype: 'PAYMENTMODE',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var paymentMode = [];
                    for (let i = 0; i < res.data.length; i++) {
                        paymentMode.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    console.log("paymentMode-----", paymentMode);
                    this.setState({ paymentModearr: paymentMode });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);
        }
    }

    getReturnPaymentMode() {

        try {
            const data = {
                stringmaptype: 'RETURNPAYMENTMODE',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var returnPaymentMode = [];
                    for (let i = 0; i < res.data.length; i++) {
                        returnPaymentMode.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ returnPaymentModearr: returnPaymentMode });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);
        }
    }

    getPaymentStatus() {
        try {
            const data = {
                stringmaptype: 'PAYMENTSTATUS',
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    var paymentStatus = [];
                    for (let i = 0; i < res.data.length; i++) {
                        paymentStatus.push({
                            label: res.data[i].StringMapName,
                            value: res.data[i].Description
                        })
                    }
                    this.setState({ paymentStatusarr: paymentStatus });
                } else {

                }
            }).catch(err => {
                console.log("error", err);
            });
        } catch (error) {
            console.log("error", error);
        }
    }

    getAccountDetails() {
        try {
            // debugger
            let data = {
                PolicyId: this.props.match.params.id
            }
            api.post('api/getDebitAccountList', data).then(res => {
                console.log("getDebitAccountList", res);

                let accountData = res.data[0];
                if (res.success) {

                    if (accountData.length) {
                        var duePayment = accountData[0].ClosingBalance;
                    } else {
                        duePayment = 0.00;
                    }

                    let formattedData = [];
                    let i;
                    for (i = 0; i < accountData.length; i++) {

                        let PaymentMode = "";
                        if (accountData[i].PaymentMode == "null") {
                        } else if (accountData[i].PaymentMode) {
                            PaymentMode = accountData[i].PaymentMode + ' (' + accountData[i].PaymentStatus + ')';
                        }

                        var CreatedBy = CommonConfig.isEmpty(accountData[i].CreatedBy) ? '' : accountData[i].CreatedByName + " (" + moment(accountData[i].CreatedOn).format(CommonConfig.dateFormat.dateTime) + ")";

                        var UpdatedBy = CommonConfig.isEmpty(accountData[i].UpdatedBy) ? '' : accountData[i].CreatedByName + " (" + moment(accountData[i].UpdatedOn).format(CommonConfig.dateFormat.dateTime) + ")";

                        formattedData.push({
                            CurrencySymbol: this.props.CurrencySymbol,
                            Id: accountData[i].Id,
                            PolicyAccountId: accountData[i].PolicyAccountId,
                            DocumentId: accountData[i].DocumentId,
                            SequenceNumber: accountData[i].Id,
                            CreatedOn: moment(accountData[i].CreatedOn).format(CommonConfig.dateFormat.dateOnly),
                            CreatedOnDate: accountData[i].CreatedOn,
                            ClientTransactionType: accountData[i].ClientTransactionType,
                            TransactionUniqueReferenceId: accountData[i].TransactionUniqueReferenceId,
                            UniqueReferenceId: accountData[i].UniqueReferenceId,
                            ReferenceId: accountData[i].ReferenceId,
                            Description: accountData[i].Description,
                            ChargeAmount: accountData[i].ChargeAmount,
                            ChargeFeeAmount: accountData[i].ChargeFeeAmount,
                            TotalChargeAmount: accountData[i].TotalChargeAmount,
                            AmountCharge: accountData[i].TotalChargeAmount,
                            PaymentAmount: accountData[i].PaymentAmount,
                            Outstanding: accountData[i].Outstanding,
                            PaymentMode: PaymentMode,
                            CreatedBy: CreatedBy,
                            UpdatedBy: UpdatedBy,
                            Balance: accountData[i].Balance,
                            TransactionType: accountData[i].TransactionType,
                            PaymentModeName: accountData[i].PaymentMode,
                            TransactionDate: moment(accountData[i].TransactionDate).format(CommonConfig.dateFormat.dateOnly),
                            PaymentStatus: accountData[i].PaymentStatus,
                            Note: accountData[i].Note,
                            IsReceiptGenerated: CommonConfig.isEmpty(accountData[i].IsReceiptGenerated) ? 0 : accountData[i].IsReceiptGenerated.data[0],
                            ReceiptDocumentId: CommonConfig.isEmpty(accountData[i].ReceiptDocumentId) ? '' : accountData[i].ReceiptDocumentId,
                            URL: CommonConfig.isEmpty(accountData[i].URL) ? '' : accountData[i].URL,
                            RelatedReferenceId: accountData[i].RelatedReferenceId,
                            SystemEntryType: accountData[i].SystemEntryType,
                            RenewalOrInceptionDate: accountData[i].RenewalOrInceptionDate,
                            Narration: accountData[i].Narration,
                            BatchEntryId: accountData[i].BatchEntryId,
                            Balance: accountData[i].Balance,
                            Actions: accountData[i].Actions,
                            TotalPaymentAmount: accountData[i].TotalPaymentAmount
                        });
                    }
                    let firstPage = (formattedData.length) ? '1' : '0';
                    let lastPage = (this.state.rowsPerPage < formattedData.length) ? this.state.rowsPerPage : formattedData.length;
                    let str = firstPage + ' to ' + lastPage + ' out of ' + formattedData.length + ' records';
                    this.setState({ arr: formattedData, str: str, paymentDue: duePayment, policyAccountList: accountData });
                    console.log("formattedData", this.state.arr);
                } else {
                    console.log("getAccountDetails > error 3", res);
                }
            }).catch(err => {
                console.log("getAccountDetails > error 2", err);
            });
        } catch (err) {
            console.log("getAccountDetails > error 1", err);
        }
    }

    getDropDownValues(stringMapType, setStateName) {
        try {
            const data = {
                stringmaptype: stringMapType,
                orderby: 'sortorder'
            };
            api.post(APIConstant.path.dropdownbycode, data).then(res => {
                if (res.success) {
                    this.setState({ [setStateName]: res.data });
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

    onColumnToggle(event) {
        let valueInOrder = event.value.sort((x, y) => { return x.id - y.id });
        this.setState({ cols: valueInOrder });
    }

    actionTemplate(rowData, column) {
        // console.log("actionTemplate", rowData);
        var path = apiBase + "" + rowData.URL;
        return <div>
            {/* {(rowData.TransactionType !== 'Payment') ? ( */}
            <BTN type="button" icon="pi pi-eye" className="p-button-primary" tooltip="View" tooltipOptions={{ position: 'bottom' }} style={{ marginRight: '.5em' }} onClick={(e) => this.editAccount(e, rowData)}>
            </BTN>
            {/* ) : (null)} */}

            {/* <BTN type="button" icon="pi pi-trash" className="p-button-danger" tooltip="Delete" tooltipOptions={{ position: 'bottom' }} style={{ marginRight: '.5em' }} onClick={(e) => this.showDeletePaymentPopup(e, rowData)}>
      </BTN> */}

            {(rowData.TransactionType === 'Payment') ? (
                <BTN type="button" icon="pi pi-file" className="p-button-primary" tooltip="Generate Receipt of Payment" tooltipOptions={{ position: 'bottom' }} style={{ marginRight: '.5em' }} onClick={(e) => this.generateReceipt(rowData)}>
                </BTN>
            ) : (
                    null
                )}

            {(rowData.TransactionType === 'Payment' && rowData.IsReceiptGenerated === 1) ? (
                <BTN type="button" icon="pi pi-eye" className="p-button-warning" tooltip="View Receipt of Payment" tooltipOptions={{ position: 'bottom' }} style={{ marginRight: '.5em' }} onClick={(e) => window.open(path, "_blank")} >
                </BTN>
            ) : (null)}

        </div>;
    }

    generateReceipt = (rowData) => {
        console.log("generateReceipt", rowData);
        if (rowData.IsReceiptGenerated === 1) {
            this.setState({ toggleModal: true, regenerateDoc: rowData })
        } else {
            let data = {
                PolicyAccountId: rowData.PolicyAccountId,
                loggedInUserId: CommonConfig.loggedInUserId()
            }
            api.post('api/generateReciept', data).then(res => {
                if (res.success) {
                    console.log("generateReceipt", res.data);
                    toast.success(res.data.message);
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                }
            });
        }
    }

    againGenerateReceipt() {
        let data = {
            PolicyAccountId: this.state.regenerateDoc.PolicyAccountId,
            loggedInUserId: CommonConfig.loggedInUserId()
        }
        api.post('api/generateReciept', data).then(res => {
            if (res.success) {
                toast.success(res.data.message);
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            }
        });
    }

    hidePopup() {
        this.setState({ toggleModal: false })
    }

    formatAmountChargedData(cell, rowData) {
        console.log("formatAmountChargedData", this);
        return (
            <div style={{ float: 'right' }}>{<i className={rowData.CurrencySymbol} ></i>}{(CommonConfig.isEmpty(rowData.TotalChargeAmount) ? ('0') : (rowData.TotalChargeAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")))}</div>
        )
    }

    formatPaymentData(cell, rowData) {
        return (
            <div style={{ float: 'right' }}>{<i className={rowData.CurrencySymbol} ></i>}{(CommonConfig.isEmpty(rowData.TotalPaymentAmount) ? ('0') : (rowData.TotalPaymentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")))}</div>
        )
    }

    formatBalanceData(cell, rowData) {
        return (
            <div style={{ float: 'right' }}>{<i className={rowData.CurrencySymbol} ></i>}{(CommonConfig.isEmpty(rowData.Balance) ? ('0') : (rowData.Balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")))}</div>
        )
    }

    editAccount = (e, rowData) => {
        this.setState({ PolicyAccountId: rowData.PolicyAccountId, referenceId: rowData.ReferenceId });
        if (rowData.TransactionType == 'Debit') {
            this.setState({ paymentAmountError: false, newEntryDateError: false, descriptionError: false, paymentModeError: false, chargeAmountError: false, isEdit: true })
        }
        else if (rowData.TransactionType == 'Credit') {
            this.setState({ newEntryDateError: false, descriptionError: false, paymentAmountError: false, paymentModeError: false, chargeAmountError: false, isEdit: true })
        } else {
            this.setState({ newEntryDateError: false, descriptionError: false, paymentAmountError: false, paymentModeError: false, chargeAmountError: false, isEdit: true, isAccountRecordEdit: true, entryTypeError: false })
        }

        setTimeout(() => {

            if (rowData.TransactionType == 'Debit' || rowData.TransactionType == 'Credit') {
                this.showJournalEntryPopup(rowData);
            } else {
                if (rowData.TransactionType == 'Payment') {
                    this.showMakePaymentPopup(rowData);
                } else {
                    this.showReturnPaymentPopup(rowData);
                }
            }

        }, 100);
    }

    showJournalEntryPopup = (rowData) => {
        if (rowData === undefined) {
            this.resetAccountForm();
        } else {
            this.setState({
                PolicyAccountId: rowData.PolicyAccountId,
                newEntryDate: moment(rowData.TransactionDate, 'DD/MM/YYYY').format("YYYY-MM-DD"),
                transactionType: rowData.TransactionType,
                referenceId: rowData.ReferenceId,
                description: rowData.Description,
                chargeAmount: rowData.ChargeAmount,
                chargeFee: rowData.ChargeFeeAmount,
                totalChargeAmount: rowData.TotalChargeAmount,
                paymentAmount: rowData.PaymentAmount,
                paymentMode: rowData.PaymentModeName,
                paymentStatus: rowData.PaymentStatus,
                note: rowData.Note,
                isMakePayment: false,
                isReturnPayment: false,
            });
            this.calculateBalanceAFTPay();
        }

        this.setState({ toggleNewEntryModal: true, accountData: rowData });
    }

    showMakePaymentPopup(rowData) {
        if (rowData === undefined) {
            this.getPolicyOutstandingTransaction();
        } else {
            this.setState({ isEdit: true });
            this.getBatchPaymentDetails(rowData);
        }
    }

    hideMakePaymentPopup() {
        this.setState({ isPaymentPopup: false, transactionType: 'Payment', description: '', paymentAmount: '', descriptionError: false, paymentAmountError: false, existOutstanding: 0 });
    }

    async saveMakePaymentEntry() {
        try {

            if (this.state.newEntryDateError) {
                toast.error('Please Enter Transaction Date');
            } else if (this.state.descriptionError) {
                toast.error('Please Enter Description');
            } else if (this.state.paymentAmountError) {
                toast.error('Please Enter Payment Amount');
            } else if (this.state.paymentModeError) {
                toast.error('Please Select Payment Mode');
            } else if (this.state.paymentAmount == 0) {
                toast.error('Payment amount can not be 0.');
            } else if (this.validateTransactionsTotal()) {
                toast.error('Total Amount Applied must be match with Payment Amount');
            } else {
                let data = {
                    PolicyId: this.props.match.params.id,
                    EntryType: '',
                    NewEntryDate: moment(this.state.newEntryDate).format(CommonConfig.dateFormat.dbDateTime),
                    TransactionType: this.state.transactionType,
                    ReferenceId: this.state.referenceId,
                    Description: this.state.description,
                    PaymentAmount: this.state.paymentAmount,
                    PaymentMode: this.state.paymentMode,
                    PaymentStatus: "Success",
                    Note: this.state.note,
                    CreatedBy: CommonConfig.loggedInUserId(),
                    PaymentEntries: this.state.OutstandingTransactions,
                    LanguageId: this.state.LanguageId
                };
                if (data.PaymentMode == "Debit/Credit Card") {

                    if (this.state.CardholderName === '' || this.state.CardholderName === null || this.state.CardholderName === 'null' || this.state.CardholderName === 'NULL' || this.state.CardholderName === 'undefined' || this.state.CardholderName === undefined) {
                        this.show("CardholderName", true, "CardholderNameError", "Please enter CardholderName");
                        return;
                    } else if (this.state.CardNumber === '' || this.state.CardNumber === null || this.state.CardNumber === 'null' || this.state.CardNumber === 'NULL' || this.state.CardNumber === 'undefined' || this.state.CardNumber === undefined) {
                        this.show("CardNumber", true, "CardNumberError", "Please enter CardNumber");
                        return;
                    } else if (this.state.CardType === '' || this.state.CardType === null || this.state.CardType === 'null' || this.state.CardType === 'NULL' || this.state.CardType === 'undefined' || this.state.CardType === undefined) {
                        this.show('CardType', true, "CardTypeError", "Select CardType");
                        return;
                    } else if (this.state.ExpiryMonth === '' || this.state.ExpiryMonth === null || this.state.ExpiryMonth === 'null' || this.state.ExpiryMonth === 'NULL' || this.state.ExpiryMonth === 'undefined' || this.state.ExpiryMonth === undefined) {
                        this.show('ExpiryMonth', true, "ExpiryMonthError", "Select ExpiryMonth");
                        return;
                    } else if (this.state.ExpiryYear === '' || this.state.ExpiryYear === null || this.state.ExpiryYear === 'null' || this.state.ExpiryYear === 'NULL' || this.state.ExpiryYear === 'undefined' || this.state.ExpiryYear === undefined) {
                        this.show('ExpiryYear', true, "ExpiryYearError", "Select ExpiryYear");
                        return;
                    } else if (this.state.CVV === '' || this.state.CVV === null || this.state.CVV === 'null' || this.state.CVV === 'NULL' || this.state.CVV === 'undefined' || this.state.CVV === undefined) {
                        this.show("CVV", true, "CVVError", "Please enter valid CVV");
                        return;
                    } else {
                        const params = new URLSearchParams();
                        params.append('CardNumber', this.state.CardNumber);
                        params.append('CardholderName', this.state.CardholderName);
                        params.append('ExpiryMonth', this.state.ExpiryMonth);
                        params.append('ExpiryYear', this.state.ExpiryYear);
                        params.append('CVV', this.state.CVV);
                        params.append('TotalAmount', data.PaymentAmount);
                        params.append('Currency', this.state.Currency);
                        params.append('amount', data.PaymentAmount);
                        await axios({
                            method: 'post',
                            url: CommonConfig.phpapi,
                            data: params
                        }).then(response => {
                            if (response.data.responseCode == "00") {
                                toast.success("Payment has been done successfully.");
                                console.log("payment", response.data);
                                // console.log("fdsdsdffsd",response.data.timestamp);
                                // console.log("fdsdsdffsd",response.data.transactionReference.transactionId);
                                // console.log("fdsdsdffsd",response.data.transactionReference.orderId);
                                var renewalPolicy = {
                                    RenewalPolicyDate: this.state.RenewalDate,
                                    PolicyNo: this.state.policyNumber,
                                    PolicyHolderForeName: this.state.Forename,
                                    PolicyHolderSurName: this.state.Surname,
                                    ContactNo: this.state.ContactTelephoneNumber,
                                    PolicyHolderEmail: this.state.EmailId,
                                    Amount: data.PaymentAmount,
                                    CardHolderName: this.state.CardholderName,
                                    CardNumber: this.state.CardNumber,
                                    CardType: this.state.CardType,
                                    ExpiryMonth: this.state.ExpiryMonth,
                                    ExpiryYear: this.state.ExpiryYear,
                                    Cvv: this.state.CVV,
                                    PaymentSource: 'Evolution',
                                    Currency: this.state.Currency,
                                    PaymentTimestamp: response.data.timestamp,
                                    PaymentTransactionId: response.data.transactionReference.transactionId,
                                    PaymentOrderId: response.data.transactionReference.orderId
                                };
                                api.post('api/renewalPolicy', renewalPolicy).then(res => {
                                    console.log("res", res);
                                    this.saveMakePaymentEntryCallAPI(data);
                                }).catch(err => {
                                    toast.error("Payment has been done successfully but not able to add entry in database.");
                                    console.log("addUpdateAccountEntry error 2", err);
                                });
                            }
                            else {
                                toast.error("payment not done");
                            }
                        }).catch(error => {
                            console.log(error);
                        });
                    }
                }
                else {
                    this.saveMakePaymentEntryCallAPI(data);
                }

            }
        } catch (error) {
            console.log("saveMakePaymentEntry error 1", error);
        }
    }

    saveMakePaymentEntryCallAPI(data) {
        console.log("saveMakePaymentEntry-request", JSON.stringify(data));
        try {
            api.post('api/saveMakePaymentEntry', data).then(res => {
                console.log("saveMakePaymentEntry-response", res.data);
                if (res.success && res.data.success) {

                    let accountEntries = res.data.data[0].AccountEntries;
                    let accountRecord = accountEntries.split(',');

                    console.log("saveMakePaymentEntry-accountRecord", accountRecord);

                    for (var i = 0; i < accountRecord.length; i++) {
                        if (!CommonConfig.isEmpty(accountRecord[i])) {
                            let generateRecieptData = {
                                PolicyAccountId: accountRecord[i],
                                loggedInUserId: CommonConfig.loggedInUserId()
                            }
                            api.post('api/generateReciept', generateRecieptData).then(generateRecieptRes => {
                                console.log("generateReciept ", i, accountRecord.length, generateRecieptRes);
                                if (i == accountRecord.length) {
                                    this.hideMakePaymentPopup();
                                    toast.success(res.data.message);
                                    setTimeout(function () {
                                        window.location.reload();
                                    }, 1000);
                                }
                            });
                        }
                    }
                }
            }).catch(err => {
                toast.error("Not able to add entry in database.");
                console.log("saveMakePaymentEntry-err", err);
            });
        } catch (error) {
            toast.error("Not able to add entry in database.");
            console.log("saveMakePaymentEntry-err", error);
        }

    }

    validateTransactionsTotal() {
        let OutstandingTransactions = this.state.OutstandingTransactions;
        let PaymentAmount = this.state.paymentAmount;
        let TotalAmount = 0;

        for (let i = 0; i < OutstandingTransactions.length; i++) {
            TotalAmount = parseFloat(TotalAmount) + parseFloat(OutstandingTransactions[i].AmountApplied);
        }

        if (PaymentAmount == TotalAmount) {
            return false;
        }
        return true;
    }

    showReturnPaymentPopup(rowData) {

        console.log("showReturnPaymentPopup>", rowData);

        if (rowData === undefined) {
            var statusDesc = this.state.returnPaymentData.ClientTransactionType + " : Return Payment";
            this.setState({
                toggleNewEntryModal: true,
                transactionType: 'ReturnPayment',
                isMakePayment: true,
                isReturnPayment: true,
                newEntryDateError: false,
                chargeAmountError: false,
                calculateBalanceAFTPay: 0,
                description: statusDesc,
                note: '',
                paymentAmount: 0,
                descriptionError: false,
                paymentAmountError: false,
                entryTypeError: false,
                isEdit: false,
                isAccountRecordEdit: false,
                existOutstanding: 0
            });
            if (!CommonConfig.isEmpty(this.state.returnPaymentData)) {
                this.setState({
                    paymentAmount: Math.abs(this.state.returnPaymentData.Balance),
                });
            }
        } else {
            this.setState({
                toggleNewEntryModal: true,
                transactionType: 'ReturnPayment',
                isMakePayment: true,
                isReturnPayment: true,
                calculateBalanceAFTPay: this.state.paymentDue,
                description: rowData.Description,
                paymentAmount: Math.abs(rowData.PaymentAmount),
                paymentMode: rowData.PaymentMode,
                note: rowData.Note,
                isEdit: true,
                isAccountRecordEdit: true,
                newEntryDate: moment(rowData.TransactionDate).format("YYYY-MM-DD"),
                existOutstanding: rowData.Outstanding
            });
        }
    }

    showBankDetailsPopup() {
        let accountNameError = CommonConfig.isEmpty(this.state.accountName) ? true : false;
        let bankNameError = CommonConfig.isEmpty(this.state.bankName) ? true : false;
        let bankCountryError = CommonConfig.isEmpty(this.state.bankCountry) ? true : false;
        let IBANError = CommonConfig.isEmpty(this.state.IBAN) ? true : false;

        this.setState({
            toggleBnkDetailsModal: true, paymentAmountError: false,
            accountNameError: accountNameError, bankNameError: bankNameError, bankCountryError: bankCountryError, IBANError: IBANError
        });
    }

    showDeletePaymentPopup = (e, rowData) => {
        this.setState({ toggleModalDel: true, delPolicyId: rowData });
    }

    deleteAccount = () => {
        // console.log('deleteAccount state', this.state.delPolicyId.TransactionType);
        // return;
        let data = {
            PolicyAccountId: this.state.delPolicyId.PolicyAccountId,
            loggedInUserId: CommonConfig.loggedInUserId(),
            DocumentId: this.state.delPolicyId.DocumentId,
        }
        try {
            api.post('api/deleteAccountById', data).then(res => {
                if (res.success) {
                    if (res.data.success) {
                        if (this.state.delPolicyId.TransactionType == 'Payment') {
                            let data = {
                                PolicyAccountId: this.state.delPolicyId.PolicyAccountId,
                                loggedInUserId: CommonConfig.loggedInUserId()
                            }
                            api.post('api/updateTransactionOutstanding', data).then(response => {
                                this.setState({ toggleModalDel: false, delPolicyId: '' });
                                toast.success(res.data.message);
                                setTimeout(function () {
                                    window.location.reload();
                                }, 1000);
                            });
                        } else {
                            this.setState({ toggleModalDel: false, delPolicyId: '' });
                            toast.success(res.data.message);
                            setTimeout(function () {
                                window.location.reload();
                            }, 1000);
                        }

                    }
                }
            }).catch(err => {
                console.log("err..", err);
            });
        }
        catch (err) {
            console.log("err..", err);
        }
    }

    hideEntryPopup() {
        this.setState({
            toggleNewEntryModal: false, accountData: "", referenceId: '', description: '', ChargeAmount: 0, chargeFee: 0, paymentAmount: 0, PaymentAmount: 0, paymentStatus: '', paymentMode: '', descriptionError: true,
            paymentAmountError: true, paymentModeError: true, paymentStatusError: true, PolicyAccountId: '', newEntryDate: moment().format("YYYY-MM-DD"), isEdit: false, isAccountRecordEdit: false, returnPaymentData: {}
        });
        this.calculateBalanceAFTPay();
    }

    hideBankDetailsPopup() {
        this.setState({
            toggleBnkDetailsModal: false, accountNameError: false, bankNameError: false,
            bankCountryError: false, IBANError: false, BICError: false,
            accountName: this.state.bankDetailsRes.AccountName,
            bankName: this.state.bankDetailsRes.BankName,
            bankCountry: this.state.bankDetailsRes.Country,
            IBAN: this.state.bankDetailsRes.IBAN,
            BIC: this.state.bankDetailsRes.BIC,
        });
    }

    hidedeletePopup() {
        this.setState({ toggleModalDel: false })
    }

    async addUpdateAccountEntry() {
        try {
            if (
                this.state.newEntryDateError === false && this.state.descriptionError === false && this.state.paymentAmountError === false &&
                this.state.chargeAmountError === false && this.state.paymentModeError === false && this.state.entryTypeError === false
            ) {
                let accountForm = {
                    PolicyId: this.props.match.params.id,
                    PolicyAccountId: this.state.PolicyAccountId,
                    EntryType: CommonConfig.isEmpty(this.state.entryType) ? '' : this.state.entryType,
                    NewEntryDate: moment(this.state.newEntryDate).format(CommonConfig.dateFormat.dbDateTime),
                    TransactionType: this.state.transactionType,
                    ReferenceId: this.state.referenceId,
                    Description: this.state.description,
                    ChargeAmount: this.state.chargeAmount,
                    ChargeFeeAmount: this.state.chargeFee,
                    TotalChargeAmount: this.state.totalChargeAmount,
                    PaymentAmount: this.state.paymentAmount,
                    PaymentMode: this.state.paymentMode,
                    PaymentStatus: "Success",
                    Note: this.state.note,
                    CreatedBy: CommonConfig.loggedInUserId(),
                    Outstanding: Number(this.state.outstanding),
                    Premium: Number(this.state.updatedPremium),
                    AdminFee: Number(this.state.updatedPremiumAdminFee),
                    Levy: Number(this.state.updatedPremiumLevy),
                    LessLevy: Number(this.state.updatedPremiumLessLevy),
                    LanguageId: this.state.LanguageId
                }

                if (accountForm.TransactionType == 'ReturnPayment') {
                    accountForm.TransactionUniqueReferenceId = this.state.returnPaymentData.UniqueReferenceId.toString();
                }

                var API = 'api/addUpdateAccountEntry';
                if (this.state.isReturnPayment) {
                    API = 'api/addReturnPaymentEntry';
                }

                console.log("addReturnPaymentEntry > ", accountForm);

                api.post(API, accountForm).then(res => {
                    console.log("addUpdateAccountEntry>", res);
                    if (res.success) {
                        if (res.data.success) {
                            if (this.state.isMakePayment && !this.state.isReturnPayment) {
                                let generateRecieptData = {
                                    PolicyAccountId: res.data.data,
                                    loggedInUserId: CommonConfig.loggedInUserId()
                                }
                                api.post('api/generateReciept', generateRecieptData).then(generateRecieptRes => {
                                    if (res.success) {
                                        toast.success(res.data.message);
                                        this.hideEntryPopup();
                                        setTimeout(function () {
                                            // window.location.reload();
                                        }, 1000);
                                    }
                                });
                            } else {
                                toast.success(res.data.message);
                                this.hideEntryPopup();
                                setTimeout(function () {
                                    window.location.reload();
                                }, 1000);
                            }
                        } else {
                            toast.error(res.data.message);
                            this.hideEntryPopup();
                            setTimeout(function () {
                                window.location.reload();
                            }, 1000);
                        }
                    }
                }).catch(err => {
                    console.log("addUpdateAccountEntry error 2", err);
                    this.hideEntryPopup();
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                });

            } else {
                this.show("newEntryDate", this.state.newEntryDateError, "newEntryDateError", "Please enter transaction date")
                this.show("description", this.state.descriptionError, "descriptionError", "Please enter description")
                this.show("paymentAmount", this.state.paymentAmountError, "paymentAmountError", "Please enter payment amount");
                this.show("chargeAmount", this.state.chargeAmountError, "chargeAmountError", "Please enter charge amount");
                this.show("paymentMode", this.state.paymentModeError, "paymentModeError", "Please select payment mode");
                this.show("entryType", this.state.entryTypeError, "entryTypeError", "Please select type");
            }
        } catch (error) {
            console.log("addUpdateAccountEntry error 1", error);
        }
    }

    getUserBankAccountDetails() {
        try {
            const data = { EntityId: this.props.EntityId, EntityType: this.props.EntityType };
            console.log("getUserBankAccountDetails > req", data);
            api.post(APIConstant.path.getUserBankAccountDetails, data).then(res => {
                console.log("getUserBankAccountDetails > res", res);
                if (res.data.length) {
                    var BankExists = 1
                    this.setState({ accountNameError: false, IBANError: false, BICError: false, bankNameError: false, bankCountryError: false });
                } else {
                    this.setState({
                        EntityBankDetailId: '',
                        accountName: '',
                        IBAN: '',
                        BIC: '',
                        bankName: '',
                        bankCountry: '',
                        bankExists: 0,
                        bankDetailsRes: []
                    });
                    this.setState({ accountNameError: true, IBANError: true, BICError: false, bankNameError: true, bankCountryError: true });
                }
                if (res.success) {
                    this.setState({
                        EntityBankDetailId: res.data[0].EntityBankDetailId,
                        accountName: res.data[0].AccountName,
                        IBAN: res.data[0].IBAN,
                        BIC: res.data[0].BIC,
                        bankName: res.data[0].BankName,
                        bankCountry: res.data[0].Country,
                        bankExists: BankExists,
                        bankDetailsRes: res.data[0]
                    });
                } else {
                    console.log("else");
                }
            }).catch(err => {
                console.log("sss", err);
            });
        } catch (error) {
            console.log("ssss", error);
        }
    }

    addUpdateBankDetails() {
        try {

            if (
                this.state.accountNameError === false &&
                this.state.bankNameError === false &&
                this.state.bankCountryError === false &&
                this.state.IBANError === false
            ) {
                let data = {
                    EntityBankDetailId: this.state.EntityBankDetailId,
                    entityId: this.props.EntityId,
                    EntityType: this.props.EntityType,
                    AccountName: this.state.accountName,
                    IBAN: this.state.IBAN,
                    BIC: this.state.BIC,
                    BankName: this.state.bankName,
                    Country: this.state.bankCountry,
                    LoggedInUserId: CommonConfig.loggedInUserId()
                }
                api.post('api/addUpdateBankDetails', data).then(res => {
                    if (res.success) {
                        if (res.data.success) {
                            toast.success(res.data.message);
                            // window.location.reload();
                        } else {
                            toast.error(res.data.message);
                        }
                        setTimeout(() => {
                            this.getUserBankAccountDetails();
                            this.hideBankDetailsPopup();
                        }, 100);
                    }
                }).catch(err => {
                    console.log("addUpdateAccountEntry error 2", err);
                });
            } else {
                this.show("accountName", this.state.accountNameError, 'accountNameError', 'Please enter Account Name');
                this.show("bankName", this.state.bankNameError, 'bankNameError', 'Please enter Bank Name.');
                this.show("bankCountry", this.state.bankCountryError, 'bankCountryError', 'Please select country.');
                this.show("IBAN", this.state.IBANError, 'IBANError', 'Please enter valid IBAN.');
                //this.show("BIC", this.state.BICError);
            }

        } catch (error) {
            console.log("error", error);
        }
    }

    clearBankDetails() {
        try {
            let data = {
                EntityBankDetailId: this.state.EntityBankDetailId,
                EntityId: this.props.EntityId,
                LoggedInUserId: CommonConfig.loggedInUserId()
            };
            console.log("clearBankDetails", data);
            api.post('api/clearBankDetails', data).then(res => {
                console.log("clearBankDetails > res", res);
                if (res.success) {
                    if (res.data.success) {
                        toast.success(res.data.message);
                    } else {
                        toast.error(res.data.message);
                    }
                    setTimeout(() => {
                        this.getUserBankAccountDetails();
                        this.hideBankDetailsPopup();
                    }, 100);
                }
            }).catch(err => {
                console.log("clearBankDetails error", err);
            });
        } catch (error) {
            console.log("clearBankDetails > error", error);
        }
    }

    handleDateChange = (e, type) => {
        this.setState({ [type]: e });
    }

    onRadioBtnClick(radioSelected) {
        this.setState({
            newEntryDate: moment().format('YYYY-MM-DD'),
            transactionType: 'Debit',
            referenceId: '',
            description: '',
            chargeAmount: 0,
            chargeFee: 0,
            totalChargeAmount: 0,
            paymentAmount: 0,
            paymentMode: '',
            paymentStatus: '',

            note: '',
            addedBy: '',
            addedDate: '',
            updatedBy: '',
            updatedDate: ''
        })
        // this.resetAccountForm();
        this.setState({
            transactionType: radioSelected
        });
        if (radioSelected == 'Credit') {
            this.setState({
                paymentAmountError: true, chargeAmountError: false
            });
        }
    }

    selectType(value, type) {

        if (type === 'paymentMode') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ paymentModeError: true, paymentMode: value });
                this.show('paymentMode', true, "paymentModeError", "Select payment mode");
            } else {
                this.setState({ paymentModeError: false, paymentMode: value });
                this.show('paymentMode', false, "paymentModeError", "");

            }
        }

        if (type === 'paymentStatus') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ paymentStatusError: true, paymentStatus: value });
                this.show('paymentStatus', true, "paymentStatusError", "Select payment status");
            } else {
                this.setState({ paymentStatusError: false, paymentStatus: value });
                this.show('paymentStatus', false, "paymentStatusError", "");

            }
        }

        if (type === 'bankCountry') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ bankCountryError: true, bankCountry: value });
                this.show("bankCountry", true, "bankCountryError", "Please select Country");
            } else {
                this.setState({ bankCountryError: false, bankCountry: value });
                this.show("bankCountry", false, "bankCountryError", "");
            }
        }

        if (type === 'CardType') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ CardTypeError: true, CardType: value });
                this.show('CardType', true, "CardTypeError", "Select CardType");
            } else {
                this.setState({ CardTypeError: false, CardType: value });
                this.show('CardType', false, "CardTypeError", "");
            }
            // this.setState({ CardType: value });
        }

        if (type === 'ExpiryMonth') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ ExpiryMonthError: true, ExpiryMonth: value });
                this.show('ExpiryMonth', true, "ExpiryMonthError", "Select ExpiryMonth");
            } else {
                this.setState({ ExpiryMonthError: false, ExpiryMonth: value });
                this.show('ExpiryMonth', false, "ExpiryMonthError", "");
            }
            // this.setState({ ExpiryMonth: value });
        }

        if (type === 'ExpiryYear') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ ExpiryYearError: true, ExpiryYear: value });
                this.show('ExpiryYear', true, "ExpiryYearError", "Select ExpiryYear");
            } else {
                this.setState({ ExpiryYearError: false, ExpiryYear: value });
                this.show('ExpiryYear', false, "ExpiryYearError", "");
            }
            // this.setState({ ExpiryYear: value });
        }

        if (type === 'entryType') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ entryTypeError: true, entryType: value });
                this.show('entryType', true, "entryTypeError", "Please select type");
            } else {
                this.setState({ entryTypeError: false, entryType: value, description: value });
                this.show('entryType', false, "entryTypeError", "");
            }
        }

    }

    show(field, condition, errorField, message) {
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

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        let nameRegExp = CommonConfig.RegExp.nameWithSpace;
        let numberRegExp = CommonConfig.RegExp.number;
        let decimalRegExp = CommonConfig.RegExp.decimalWithOne;
        let allowAllWithSpace = CommonConfig.RegExp.allowAllWithSpace;
        // let cardnumRegExp = /[^0-9]/;
        // "^(?:(?<visa>4[0-9]{12}(?:[0-9]{3})?)|" +
        // "(?<mastercard>5[1-5][0-9]{14})|" +
        // "(?<discover>6(?:011|5[0-9]{2})[0-9]{12})|" +
        // "(?<amex>3[47][0-9]{13})|" +
        // "(?<diners>3(?:0[0-5]|[68][0-9])?[0-9]{11})|" +
        // "(?<jcb>(?:2131|1800|35[0-9]{3})[0-9]{11}))$"
        let cvvRegExp = /^[0-9]{3,4}$/;
        let value = e.target.value;
        if (e.target.name === 'newEntryDate') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ newEntryDateError: true });
                this.show("newEntryDate", true, "newEntryDateError", "Please enter date");
            } else {
                this.setState({ newEntryDateError: false, newEntryDate: e.target.value });
                this.show("newEntryDate", false, "newEntryDateError", "");
            }
        }

        if (e.target.name === 'chargeAmount') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ chargeAmountError: true });
                this.show("chargeAmount", true, "chargeAmountError", "Please enter charge fees ");
            } else {
                let nameRegEx = decimalRegExp;
                let name = e.target.value;
                if (!nameRegEx.test(name)) {
                    this.setState({ chargeAmountError: true });
                    this.show("chargeAmount", true, "chargeAmountError", "Please enter valid charge fees");
                } else {
                    this.setState({ chargeAmountError: false, chargeAmount: e.target.value });
                    this.show("chargeAmount", false, "chargeAmountError", "");
                }
            }
        }

        if (e.target.name === 'paymentAmount') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ paymentAmountError: true });
                this.show("paymentAmount", true, "paymentAmountError", "Please enter charge fees ");
            } else {
                let nameRegEx = decimalRegExp;
                let name = e.target.value;
                if (!nameRegEx.test(name)) {
                    this.setState({ paymentAmountError: true });
                    this.show("paymentAmount", true, "paymentAmountError", "Please enter valid charge fees");
                } else {
                    this.setState({ paymentAmountError: false, paymentAmount: e.target.value });
                    this.show("paymentAmount", false, "paymentAmountError", "");
                }
            }
            setTimeout(() => {
                if (this.state.isTransferFundPopup) {
                    this.calculateTransferFundPremium();
                } else {
                    this.calculatePremium();
                }
            }, 500);
        }

        if (e.target.name === 'chargeFee') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ chargeFeeError: true });
                this.show("chargeFee", true, "chargeFeeError", "Please enter charge fees ");
            } else {
                let nameRegEx = numberRegExp;
                let name = e.target.value;
                if (!nameRegEx.test(name)) {
                    this.setState({ chargeFeeError: true });
                    this.show("chargeFee", true, "chargeFeeError", "Please enter valid charge fees");
                } else {
                    this.setState({ chargeFeeError: false, chargeFee: e.target.value });
                    this.show("chargeFee", false, "chargeFeeError", "");
                }
            }
        }

        if (e.target.name === 'description') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ descriptionError: true });
                this.show("description", true, "descriptionError", "Please enter description ");
            } else {
                let nameRegEx = allowAllWithSpace;
                let name = e.target.value;
                if (!nameRegEx.test(name)) {
                    this.setState({ descriptionError: true });
                    this.show("description", true, "descriptionError", "Please enter valid description");
                } else {
                    this.setState({ descriptionError: false, description: e.target.value });
                    this.show("description", false, "descriptionError", "");
                }
            }
        }

        if (e.target.name === 'accountName') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ accountNameError: true });
                this.show("accountName", true, "accountNameError", "Please enter Account Name ");
            } else {
                let nameRegEx = CommonConfig.RegExp.nameWithSpace;
                let name = e.target.value;
                if (!nameRegEx.test(name)) {
                    this.setState({ accountNameError: true });
                    this.show("accountName", true, "accountNameError", "Please enter valid Account Name");
                } else {
                    this.setState({ accountNameError: false, accountName: e.target.value });
                    this.show("accountName", false, "accountNameError", "");
                }
            }
        }

        if (e.target.name === 'bankName') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ bankNameError: true });
                this.show("bankName", true, "bankNameError", "Please enter Bank Name");
            } else {
                let nameRegEx = CommonConfig.RegExp.nameWithSpace;
                let name = e.target.value;
                if (!nameRegEx.test(name)) {
                    this.setState({ bankNameError: true });
                    this.show("bankName", true, "bankNameError", "Please enter valid Bank Name");
                } else {
                    this.setState({ bankNameError: false, bankName: e.target.value });
                    this.show("bankName", false, "bankNameError", "");
                }
            }
        }

        if (e.target.name === 'IBAN') {
            if (CommonConfig.isEmpty(e.target.value)) {
                this.setState({ IBANError: true });
                this.show("IBAN", true, "IBANError", "Please enter IBAN Number");
            } else {
                // let nameRegEx = CommonConfig.RegExp.alphaNumeric;
                let name = e.target.value;
                if (IBAN.isValid(name)) {
                    this.setState({ IBANError: false, IBAN: name });
                    this.show("IBAN", false, "IBANError", "");
                } else {
                    this.setState({ IBANError: true });
                    this.show("IBAN", true, "IBANError", "Please enter valid IBAN Number");
                }
            }
        }

        if (e.target.name === 'BIC') {
            this.setState({ BICError: false });

            /*if (CommonConfig.isEmpty(e.target.value)) {
               this.setState({ BICError: true });
               this.show("BIC", true, "BICError", "Please enter BIC Number");
             } else {
               let nameRegEx = CommonConfig.RegExp.alphaNumeric;
               let name = e.target.value;
               if (!nameRegEx.test(name)) {
                 this.setState({ BICError: true });
                 this.show("BIC", true, "BICError", "Please enter valid BIC Number");
               } else {
                 if (e.target.value.length < 8 || e.target.value.length > 11) {
                   this.setState({ BICError: true, BIC: e.target.value });
                   this.show("BIC", true, "BICError", "BIC number must be between 8 to 11 Characters");
                 } else {
                   this.setState({ BICError: false, BIC: e.target.value });
                   this.show("BIC", false, "BICError", "");
                 }
               }
             }*/
        }

        if (e.target.name === 'CardholderName') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ CardholderNameError: true });
                this.show("CardholderName", true, "CardholderNameError", "Please enter CardholderName");
            } else {
                if (!nameRegExp.test(value)) {
                    this.setState({ CardholderNameError: true });
                    this.show("CardholderName", true, "CardholderNameError", "Please enter valid CardholderName");
                } else {
                    this.setState({ CardholderNameError: false, CardholderName: value });
                    this.show("CardholderName", false, "CardholderNameError", "");
                }

            }
        }

        if (e.target.name === 'CardNumber') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ CardNumberError: true });
                this.show("CardNumber", true, "CardNumberError", "Please enter CardNumber");
            } else {
                // if (!cardnumRegExp.test(value)) {
                //     this.setState({ CardNumberError: true });
                //     this.show("CardNumber", true, "CardNumberError", "Please enter valid CardNumber");
                //   } else {
                this.setState({ CardNumberError: false, CardNumber: value });
                this.show("CardNumber", false, "CardNumberError", "");
                // }

            }
        }

        if (e.target.name === 'CVV') {
            if (CommonConfig.isEmpty(value)) {
                this.setState({ CVVError: true });
                this.show("CVV", true, "CVVError", "Please enter CVV");
            } else {
                if (!cvvRegExp.test(value)) {
                    this.setState({ CVVError: true });
                    this.show("CVV", true, "CVVError", "Please enter valid CVV");
                } else {
                    this.setState({ CVVError: false, CVV: value });
                    this.show("CVV", false, "CVVError", "");
                }

            }
        }

        this.calculateBalanceAFTPay();
        this.totalChargeAmt();
    }

    handleChangeAmount(e, i) {

        let value = e.target.value;
        if (CommonConfig.isEmpty(value)) {
            value = '';
        }

        let SystemOutstandingTransactions = this.state.SystemOutstandingTransactions;
        let OutstandingTransactions = this.state.OutstandingTransactions;
        let transaction = SystemOutstandingTransactions[i];

        let AmountApplied = value;
        let TotalDue = transaction.TotalDue;
        let LevyTotalAmount = transaction.LevyTotalAmount;
        let Outstanding = transaction.Outstanding;

        OutstandingTransactions[i].AmountApplied = AmountApplied;

        if (Outstanding >= AmountApplied) {
            let UpdatedAdminFee = 0;
            let OutstandingAfterPayment = 0;
            var UpdatedLevy = 0;
            var UpdatedNetPremium = 0;

            OutstandingAfterPayment = Outstanding - AmountApplied;
            UpdatedAdminFee = (transaction.AdminFee * AmountApplied) / TotalDue;
            UpdatedLevy = (AmountApplied * LevyTotalAmount) / TotalDue;
            UpdatedNetPremium = AmountApplied - UpdatedLevy - UpdatedAdminFee;
            OutstandingTransactions[i].OutstandingAfterPayment = Number(OutstandingAfterPayment).toFixed(2);
            OutstandingTransactions[i].UpdatedNetPremium = Number(UpdatedNetPremium).toFixed(2);
            OutstandingTransactions[i].UpdatedLevy = Number(UpdatedLevy).toFixed(2);
            OutstandingTransactions[i].UpdatedAdminFee = Number(UpdatedAdminFee).toFixed(2);

            this.show("AmountApplied", false, "AmountAppliedError", "");
        } else {
            this.show("AmountApplied", true, "AmountAppliedError", "Please enter proper amount");
        }

        this.setState({ OutstandingTransactions: OutstandingTransactions });

    }

    resetAccountForm() {
        this.setState({
            newEntryDate: moment().format('YYYY-MM-DD'),
            transactionType: 'Debit',
            referenceId: '',
            description: '',
            chargeAmount: 0,
            chargeFee: 0,
            totalChargeAmount: 0,
            paymentAmount: 0,
            paymentMode: '',
            paymentStatus: '',
            note: '',
            addedBy: '',
            addedDate: '',
            updatedBy: '',
            updatedDate: '',
            PolicyAccountId: '',
            isMakePayment: false,
            isReturnPayment: false,
            newEntryDateError: false,
            descriptionError: true,
            chargeAmountError: true,
            paymentAmountError: false,
            paymentModeError: false,
            paymentStatusError: true
        });
        this.calculateBalanceAFTPay();
        this.totalChargeAmt();
    }

    calculateBalanceAFTPay() {

        if (this.state.paymentDue && this.state.paymentAmount) {
            setTimeout(() => {
                var calculateBalanceAFTPay = 0;
                var calculateBalanceAFTPay = Number(this.state.paymentDue) - Number(this.state.paymentAmount);

                this.setState({ calculateBalanceAFTPay: calculateBalanceAFTPay });
            }, 100);
            // console.log("calculateBalanceAFTPay", this.state.calculateBalanceAFTPay);
        }
    }

    totalChargeAmt() {

        if (this.state.chargeAmount) {
            setTimeout(() => {
                var totalAmount = 0;
                var totalAmount = Number(this.state.chargeAmount) + Number(this.state.chargeFee);

                this.setState({ totalChargeAmount: totalAmount });
            }, 100);
            console.log("totalAmount", this.state.totalAmount);
        }
    }

    calculatePremium() {
        try {

            let SystemOutstandingTransactions = this.state.SystemOutstandingTransactions;
            let OutstandingTransactions = this.state.OutstandingTransactions;
            let PaymentAmount = this.state.paymentAmount;
            var ExistOutstanding = Number(this.state.existOutstanding);
            var RemainingPaymentAmount = PaymentAmount;

            for (let i = 0; i < SystemOutstandingTransactions.length; i++) {

                let transaction = SystemOutstandingTransactions[i];

                let AmountApplied = 0;
                let TotalDue = transaction.TotalDue;
                let LevyTotalAmount = transaction.LevyTotalAmount;

                let Outstanding = transaction.Outstanding;
                let OutstandingAfterPayment = 0;
                let UpdatedNetAmount = 0;
                var UpdatedNetPremium = 0;
                var UpdatedLevy = 0;
                let UpdatedAdminFee = 0;

                if (RemainingPaymentAmount > 0) {
                    AmountApplied = (RemainingPaymentAmount <= Outstanding) ? RemainingPaymentAmount : Outstanding;
                    OutstandingAfterPayment = Outstanding - AmountApplied;
                    UpdatedAdminFee = (transaction.AdminFee * AmountApplied) / TotalDue;
                    UpdatedNetAmount = AmountApplied - UpdatedAdminFee;
                    UpdatedLevy = (AmountApplied * LevyTotalAmount) / TotalDue;
                    UpdatedNetPremium = AmountApplied - UpdatedLevy - UpdatedAdminFee;
                    RemainingPaymentAmount = RemainingPaymentAmount - AmountApplied;
                }

                OutstandingTransactions[i].AmountApplied = Number(AmountApplied).toFixed(2);
                OutstandingTransactions[i].OutstandingAfterPayment = Number(OutstandingAfterPayment).toFixed(2);
                OutstandingTransactions[i].UpdatedNetPremium = Number(UpdatedNetPremium).toFixed(2);
                OutstandingTransactions[i].UpdatedLevy = Number(UpdatedLevy).toFixed(2);
                OutstandingTransactions[i].UpdatedAdminFee = Number(UpdatedAdminFee).toFixed(2);
            }
            this.setState({ OutstandingTransactions: OutstandingTransactions });

        } catch (error) {
            console.log("calculatePremium >> error", error);
        }
    }

    getCurrentDecription() {
        let desc = "";
        let policyAccountList = this.state.policyAccountList;
        policyAccountList = policyAccountList.filter(function (val) {
            return val.SystemEntryType != '';
        });
        if (policyAccountList.length) {
            desc = policyAccountList[0].SystemEntryType;
        }
        return desc;
    }

    getPolicyOutstandingTransaction(rowData) {
        console.log('rowData >', rowData);
        let data = {
            PolicyId: this.props.match.params.id,
            LoggedInUserId: CommonConfig.loggedInUserId(),
            UniqueReferenceId: ''
        };
        if (rowData !== undefined) {
            data.UniqueReferenceId = rowData.UniqueReferenceId;
        }
        api.post('api/getPolicyOutstandingTransaction', data).then(res => {
            console.log("getPolicyOutstandingTransaction res", res);
            if (res.success) {
                if (res.data[0].length) {
                    this.setState({ SystemOutstandingTransactions: res.data[0], OutstandingTransactions: res.data[0] });

                    var statusDesc = rowData.ClientTransactionType; // this.getCurrentDecription();
                    this.setState({ isPaymentPopup: true, transactionType: 'Payment', description: statusDesc, paymentAmount: res.data[0][0].Outstanding, descriptionError: false, paymentAmountError: false, existOutstanding: 0, isEdit: false, newEntryDateError: false });

                    setTimeout(() => {
                        this.calculatePremium();
                    }, 100);

                } else {
                    toast.warn("There is no Payment Due for this Policy.");
                }
            }
        }).catch(err => {
            console.log("getPolicyOutstandingTransaction error", err);
        });
    }

    getBatchPaymentDetails(rowData) {
        let data = {
            PolicyAccountId: this.state.PolicyAccountId
        }
        console.log("getBatchPaymentDetails rowdata ", rowData);
        api.post('api/getBatchPaymentDetails', data).then(res => {
            console.log("getBatchPaymentDetails res", res);
            if (res.success) {
                if (res.data.length) {
                    var OutstandingTransactions = res.data;
                    this.setState({ OutstandingTransactions: OutstandingTransactions });

                    console.log("getBatchPaymentDetails > OutstandingTransactions", OutstandingTransactions);

                    var paymentAmountTotal = 0;

                    for (var i in OutstandingTransactions) {
                        paymentAmountTotal += parseFloat(OutstandingTransactions[i].PaymentAmount);
                    }

                    this.setState({
                        isPaymentPopup: true, transactionType: 'Payment',
                        paymentAmountError: false, paymentAmount: paymentAmountTotal.toFixed(2),
                        description: rowData.Description, descriptionError: false,
                        existOutstanding: 0, isEdit: true,
                        newEntryDate: moment(rowData.TransactionDate).format("YYYY-MM-DD"),
                        paymentMode: rowData.PaymentMode,
                        note: rowData.Note
                    });
                }
            }
        }).catch(err => {
            console.log("getBatchPaymentDetails error", err);
        });
    }

    shortWriteoff(UniqueReferenceId, writeoffAmount) {
        try {
            let data = {
                PolicyId: this.state.policyId,
                UniqueReferenceId: UniqueReferenceId,
                PaymentAmount: writeoffAmount,
                LoggedInUserId: CommonConfig.loggedInUserId()
            }
            console.log("shortWriteoff > ", data);
            api.post('api/shortWriteoff', data).then(res => {
                console.log("shortWriteoff > res >", res);
                if (res.success) {
                    if (res.data.success) {
                        toast.success(res.data.message);
                        window.location.reload();
                    } else {
                        toast.error(res.data.message);
                    }
                }
            }).catch(err => {
                console.log("shortWriteoff > error > 1", err);
            });

        } catch (error) {
            console.log("shortWriteoff > error > 2", error);
        }
    }

    getLapsePolicyDetails() {
        try {
            let data = {
                PolicyId: this.props.match.params.id,
                LoggedInUserId: CommonConfig.loggedInUserId()
            }
            api.post('api/getLapsePolicyDetails', data).then(res => {
                console.log("getLapsePolicyDetails > res >", res);
                if (res.success) {
                    if (res.data.length) {
                        this.setState({
                            IsLapsePolicy: res.data[0].IsLapsePolicy,
                            DaysOverdue: res.data[0].DaysOverdue,
                            RenewalDate: res.data[0].RenewalDate
                        });
                    }
                }
            }).catch(err => {
                console.log("getLapsePolicyDetails > error > 1", err);
            });

        } catch (error) {
            console.log("getLapsePolicyDetails > error > 2", error);
        }
    }

    showLapsePolicyPopup() {
        this.setState({ IsLapsePolicyPopup: true, lapsePolicyNote: '' });
    }

    hideLapsePolicyPopup() {
        this.setState({ IsLapsePolicyPopup: false, lapsePolicyNote: '' });
    }

    lapsePolicy() {
        try {
            let data = {
                PolicyId: this.state.policyId,
                Note: this.state.lapsePolicyNote,
                LoggedInUserId: CommonConfig.loggedInUserId()
            }
            api.post('api/lapsePolicy', data).then(res => {
                console.log("lapsePolicy > res >", res);
                if (res.success) {
                    if (res.data.success) {
                        toast.success(res.data.message);
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                    } else {
                        toast.error(res.data.message);
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                    }
                } else {
                    toast.error(res.message);
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);
                }
            }).catch(err => {
                console.log("lapsePolicy > error > 1", err);
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            });

        } catch (error) {
            console.log("lapsePolicy > error > 2", error);
        }
    }

    actionFormatter = (cell, rowData) => {
        console.log("actionFormatter > ", cell, rowData, this);

        var tempActions = rowData.Actions;
        var actions = CommonConfig.isEmpty(tempActions) ? [] : tempActions.split(',');
        console.log('actionFormatter > actions > ', actions);

        var accountRecordMenu = [];
        if (actions.length) {
            for (var i = 0; i < actions.length; i++) {
                if (actions[i] != '') {
                    accountRecordMenu.push({
                        label: actions[i],
                        data: rowData,
                        UniqueReferenceId: rowData.UniqueReferenceId,
                    });
                }
            }
        }

        var path = apiBase + "" + rowData.URL;
        return (
            <div className={'Account' + rowData.Id}>
                <BTN type="button" icon="pi pi-eye" className="p-button-primary" tooltip="View" tooltipOptions={{ position: 'bottom' }} style={{ marginRight: '.5em' }} onClick={(e) => this.editAccount(e, rowData)}>
                </BTN>

                {(accountRecordMenu.length) ? (
                    <Input type="select"
                        style={{ width: '40%', display: 'inline-block' }}
                        name={"accountRecord" + rowData.Id} id={"accountRecord" + rowData.Id}
                        onChange={(e) => this.accountRecordActions(e.target.value, rowData, false)}
                    >
                        <option value=''>Select</option>
                        {
                            accountRecordMenu.map((type, i) => {
                                return (<option value={type.label} key={i}>{type.label}</option>)
                            })
                        }
                    </Input>
                ) : (null)}

                {/* <Menu model={accountRecordMenu} popup={true} ref={el => this.menu = el} id={"accountMenu" + rowData.Id} />
                <BTN icon="pi pi-ellipsis-v" className="p-button-primary"
                    aria-controls={"accountMenu" + rowData.Id} aria-haspopup={true}
                    onMouseEnter={(event) => this.menu.toggle(event)} /> */}

            </div>
        );
    }

    handleOnExpand = (row, isExpand, rowIndex, e) => {
        try {
            if (isExpand) {
                let data = {
                    UniqueReferenceId: row.UniqueReferenceId
                };
                api.post('api/getChildAccountRecords', data).then(res => {
                    this.setState({ childAccountData: [] });
                    var tempChildAccountData = res.data[0];
                    console.log("getChildAccountRecords", tempChildAccountData);
                    if (res.success) {

                        tempChildAccountData.forEach(function (element) {
                            var tempActions = element.Menu;
                            var childActions = CommonConfig.isEmpty(tempActions) ? [] : tempActions.split(',');
                            console.log('handleOnExpand > childActions > ', childActions);

                            var childAccountRecordMenu = [];
                            if (childActions.length) {
                                for (var i = 0; i < childActions.length; i++) {
                                    if (childActions[i] != '') {
                                        childAccountRecordMenu.push({
                                            label: childActions[i],
                                            UniqueReferenceId: element.UniqueReferenceId,
                                        });
                                    }
                                }
                            }
                            element.Actions = childAccountRecordMenu;
                            element.CurrencySymbol = row.CurrencySymbol;
                            element.Path = apiBase + "" + element.URL;
                        });

                        setTimeout(() => {
                            this.setState({ childAccountData: tempChildAccountData });
                        }, 500);
                    } else {
                        console.log("getChildAccountRecords > error 3", res);
                    }
                }).catch(err => {
                    this.setState({ childAccountData: [] });
                    console.log("getChildAccountRecords > error 2", err);
                });
            }
        } catch (error) {
            console.log("handleOnExpand > Err", error);
        }
    }

    expandRow = {
        onlyOneExpanding: true,
        showExpandColumn: true,
        expandByColumnOnly: true,
        parentClassName: (isExpanded, row, rowIndex) => {
            return 'parent-expand-foo';
        },
        onExpand: this.handleOnExpand,
        renderer: row => (
            <div>
                {(this.state.childAccountData.length > 0) ? (

                    <table width={'100%'} style={{ border: 'none' }}>
                        <tr>
                            <th>#</th>
                            <th>Txn Date</th>
                            <th>Transaction</th>
                            <th>Reference Id</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Payment Mode</th>
                            <th>Added By</th>
                            <th>Outstanding</th>
                            <th>Actions</th>
                        </tr>
                        {
                            this.state.childAccountData.map((accountEntry, i) => {
                                console.log("childAccountData > " + i + " > ", accountEntry);
                                return (
                                    <tr>
                                        <td>{(i + 1)}</td>
                                        <td>{moment(accountEntry.TransactionDate).format(CommonConfig.dateFormat.dateOnly)}</td>
                                        <td>{accountEntry.ClientTransactionType}</td>
                                        <td>{accountEntry.UniqueReferenceId}</td>
                                        <td>{accountEntry.Description}</td>
                                        <td>
                                            {
                                                (accountEntry.TransactionType == 'Payment' || accountEntry.TransactionType == 'ReturnPayment') ?
                                                    (
                                                        <div style={{ float: 'right' }}>
                                                            {<i className={accountEntry.CurrencySymbol} ></i>}
                                                            {(CommonConfig.isEmpty(accountEntry.PaymentAmount) ? ('') : (accountEntry.PaymentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")))}
                                                        </div>
                                                    ) : (
                                                        <div style={{ float: 'right' }}>
                                                            {<i className={accountEntry.CurrencySymbol} ></i>}
                                                            {(CommonConfig.isEmpty(accountEntry.TotalChargeAmount) ? ('') : (accountEntry.TotalChargeAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")))}
                                                        </div>
                                                    )
                                            }
                                        </td>
                                        <td>
                                            {(accountEntry.TransactionType == 'Payment' || accountEntry.TransactionType == 'ReturnPayment') ? (accountEntry.PaymentMode) : ('N/A')}
                                        </td>
                                        <td>
                                            {accountEntry.CreatedByName}
                                            {
                                                (CommonConfig.isEmpty(accountEntry.CreatedOn) ?
                                                    ('') : " (" + moment(accountEntry.CreatedOn).format(CommonConfig.dateFormat.dateTime)) + ")"
                                            }
                                        </td>
                                        <td>
                                            <div style={{ float: 'right' }}>
                                                {<i className={accountEntry.CurrencySymbol} ></i>}
                                                {(CommonConfig.isEmpty(accountEntry.Outstanding) ? ('0') : (accountEntry.Outstanding.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")))}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={"childRccountRecordMenu" + accountEntry.Id} >
                                                {(accountEntry.IsLocked) ? (
                                                    <span>
                                                        <i style={{ fontSize: '30px', verticalAlign: 'sub', color: 'red' }} className="pi pi-lock" href="#" id={"LockedTooltip" + accountEntry.BReference}></i>
                                                        <UncontrolledTooltip placement="top" target={"LockedTooltip" + accountEntry.BReference}>
                                                            {accountEntry.BReference}
                                                        </UncontrolledTooltip>
                                                    </span>
                                                ) : (null)}

                                                <BTN type="button" icon="pi pi-eye" className="p-button-primary" tooltip="View" tooltipOptions={{ position: 'bottom' }} onClick={(e) => this.editAccount(e, accountEntry)}>
                                                </BTN>

                                                {((accountEntry.ClientTransactionType !== 'Contra' && accountEntry.ClientTransactionType !== 'Short Write Off') && accountEntry.TransactionType === 'Payment') ? (
                                                    <BTN type="button" icon="pi pi-file" className="p-button-primary" tooltip="Generate Receipt of Payment" tooltipOptions={{ position: 'bottom' }} style={{ marginRight: '.5em' }} onClick={(e) => this.generateReceipt(accountEntry)}>
                                                    </BTN>
                                                ) : (null)}

                                                {(accountEntry.TransactionType === 'Payment') ? (
                                                    CommonConfig.isEmpty(accountEntry.IsReceiptGenerated) ? (null) : (
                                                        <BTN type="button" icon="pi pi-eye" className="p-button-warning" tooltip="View Receipt of Payment" tooltipOptions={{ position: 'bottom' }} style={{ marginRight: '.5em' }} onClick={(e) => window.open(accountEntry.Path, "_blank")} >
                                                        </BTN>
                                                    )
                                                ) : (null)}

                                                {(accountEntry.Actions.length) ? (
                                                    <Input type="select"
                                                        style={{ width: '40%', display: 'inline-block' }}
                                                        name={"childRccountRecord" + accountEntry.Id} id={"childRccountRecord" + accountEntry.Id}
                                                        onChange={(e) => this.accountRecordActions(e.target.value, accountEntry, true)}
                                                    >
                                                        <option value=''>Select</option>
                                                        {
                                                            accountEntry.Actions.map((type, j) => {
                                                                return (<option value={type.label} key={j}>{type.label}</option>)
                                                            })
                                                        }
                                                    </Input>
                                                ) : (null)}

                                                {/* <Menu model={accountEntry.Menu} popup={true} ref={el => this.menu = el} id={"subAccountMenu" + i} />
                                                    <BTN icon="pi pi-ellipsis-v" className="p-button-primary"
                                                        aria-controls={"subAccountMenu" + i} aria-haspopup={true}
                                                        onMouseEnter={(event) => this.menu.toggle(event)}
                                                    // onMouseLeave={(event) => this.menu.toggle(event)}
                                                        /> */}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                ) : (
                        <small style={{ textAlign: "center" }}>No Record for this transaction.</small>
                    )}
            </div>
        )
    };

    accountRecordActions = (type, rowData, isAccountChildEntry) => {
        try {
            console.log("actionFormatter > accountRecordActions > ", type, rowData, isAccountChildEntry);

            if (type == 'Make Payment') {
                this.getPolicyOutstandingTransaction(rowData);

            } else if (type == 'Short Write Off') {
                var isConfirm = window.confirm("Are you sure you wants to Short Write Off " + rowData.Balance + " amount?");
                if (isConfirm == true) {
                    this.shortWriteoff(rowData.UniqueReferenceId, rowData.Balance);
                }
            } else if (type == 'Return Payment') {
                this.setState({ returnPaymentData: rowData });
                setTimeout(() => {
                    this.showReturnPaymentPopup();
                }, 100);
            } else if (type == 'Transfer Fund') {
                this.getAccountTransferFund(rowData);

            } else if (type == 'Contra' || type == 'Cancel Payment' || type == 'Bounce Cheque' || type == 'Bank Transfer Failed' || type == 'Credit Card Declined') {
                var isConfirm = window.confirm("Are you sure you wants to " + type + " #" + rowData.UniqueReferenceId + "?");
                if (isConfirm == true) {
                    this.processAccountEntry(type, rowData);
                }
            }

            // Dropdown action to default 'Select';
            if (isAccountChildEntry) {
                if (document.getElementsByName('childRccountRecord' + rowData.Id)) {
                    document.getElementsByName('childRccountRecord' + rowData.Id)[0].value = '';
                }
            } else {
                if (document.getElementsByName('accountRecord' + rowData.Id)) {
                    document.getElementsByName('accountRecord' + rowData.Id)[0].value = '';
                }
            }

        } catch (error) {
            console.log("accountRecordActions > error ", error);
        }
    }

    processAccountEntry = (type, rowData) => {
        try {
            if (rowData.UniqueReferenceId) {

                let data = {
                    UniqueReferenceId: rowData.UniqueReferenceId,
                    AccountActionType: type,
                    CurrentUser: CommonConfig.loggedInUserId(),
                };
                api.post('api/processAccountEntry', data).then(res => {
                    console.log("processAccountEntry > res", res);
                    if (res.success) {
                        console.log("processAccountEntry > response > data", res.data);
                        toast.success(type + " successfully.");
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000);
                    } else {
                        toast.error('Account record is not relevent for ' + type + ' action.');
                    }
                }).catch(err => {
                    console.log("processAccountEntry error", err);
                    toast.error(err);
                });
            } else {
                toast.error('Account record is not relevent for ' + type + ' action.');
            }
        } catch (error) {
            console.log("processAccountEntry > error ", error);
            toast.error(error);
        }
    }

    cancelTransaction(data) {
        console.log("cancelTransaction >> ", data);
    }

    hideTransferFundPopup() {
        this.setState({
            isTransferFundPopup: false,
            paymentMode: '',
            transferFundData: '',
            paymentAmountRemains: 0,
            PolicyOutstandingTransactions: ''
        });
    }

    handleTransferFundChangeAmount(e, i) {

        let value = e.target.value;
        if (CommonConfig.isEmpty(value)) {
            value = '';
        }

        let SystemPolicyOutstandingTransactions = this.state.SystemPolicyOutstandingTransactions;
        let PolicyOutstandingTransactions = this.state.PolicyOutstandingTransactions;
        let transaction = SystemPolicyOutstandingTransactions[i];

        let AmountApplied = value;
        let TotalDue = transaction.TotalDue;
        let LevyTotalAmount = transaction.LevyTotalAmount;
        let Outstanding = transaction.Outstanding;

        PolicyOutstandingTransactions[i].AmountApplied = AmountApplied;

        if (Outstanding >= AmountApplied) {
            let UpdatedAdminFee = 0;
            let OutstandingAfterPayment = 0;
            var UpdatedLevy = 0;
            var UpdatedNetPremium = 0;

            OutstandingAfterPayment = Outstanding - AmountApplied;
            UpdatedAdminFee = (transaction.AdminFee * AmountApplied) / TotalDue;
            UpdatedLevy = (AmountApplied * LevyTotalAmount) / TotalDue;
            UpdatedNetPremium = AmountApplied - UpdatedLevy - UpdatedAdminFee;
            PolicyOutstandingTransactions[i].OutstandingAfterPayment = Number(OutstandingAfterPayment).toFixed(2);
            PolicyOutstandingTransactions[i].UpdatedNetPremium = Number(UpdatedNetPremium).toFixed(2);
            PolicyOutstandingTransactions[i].UpdatedLevy = Number(UpdatedLevy).toFixed(2);
            PolicyOutstandingTransactions[i].UpdatedAdminFee = Number(UpdatedAdminFee).toFixed(2);

            this.show("AmountApplied" + i, false, "AmountAppliedError", "");
        } else {
            this.show("AmountApplied" + i, true, "AmountAppliedError", "Please enter proper amount");
        }

        this.setState({ PolicyOutstandingTransactions: PolicyOutstandingTransactions });

        let PaymentAmount = this.state.paymentAmount;
        let TotalAmount = 0;
        for (let i = 0; i < PolicyOutstandingTransactions.length; i++) {
            var POAmountApplied = PolicyOutstandingTransactions[i].AmountApplied == '' ? 0 : PolicyOutstandingTransactions[i].AmountApplied;
            TotalAmount = parseFloat(TotalAmount) + parseFloat(POAmountApplied);
        }
        var paymentAmountRemains = Number(PaymentAmount - TotalAmount).toFixed(2);
        this.setState({ paymentAmountRemains: paymentAmountRemains });

    }

    getAccountTransferFund(rowData) {
        try {
            console.log("getAccountTransferFund > rowData", rowData);
            let data = {
                PolicyId: this.state.policyId,
                CurrentUser: CommonConfig.loggedInUserId(),
            };
            api.post('api/getAccountTransferFund', data).then(res => {
                console.log("getAccountTransferFund > res", res);
                if (res.success) {
                    if (res.data[0].length) {
                        this.setState({
                            isTransferFundPopup: true,
                            PolicyOutstandingTransactions: res.data[0],
                            SystemPolicyOutstandingTransactions: res.data[0],
                            transactionType: 'Payment',
                            description: 'Transfer a Fund',
                            paymentMode: 'Fund Transfer',
                            paymentAmount: Math.abs(rowData.Balance),
                            existOutstanding: 0,
                            isEdit: false,
                            paymentModeError: false,
                            newEntryDateError: false,
                            descriptionError: false,
                            paymentAmountError: false,
                            transferFundData: rowData
                        });

                        setTimeout(() => {
                            this.calculateTransferFundPremium();
                        }, 100);
                    } else {
                        toast.warn("There are no Payment Due for any Policy of " + this.state.policyHolder + ".");
                    }
                } else {
                    toast.error('There are no due for other Policy of ' + this.state.policyHolder + '.');
                }
            }).catch(err => {
                console.log("getAccountTransferFund error", err);
                toast.error(err);
            });
        } catch (error) {
            console.log("getAccountTransferFund > error ", error);
            toast.error(error);
        }
    }

    calculateTransferFundPremium() {
        try {
            let SystemPolicyOutstandingTransactions = this.state.SystemPolicyOutstandingTransactions;
            let PolicyOutstandingTransactions = this.state.PolicyOutstandingTransactions;
            let PaymentAmount = this.state.paymentAmount;
            var ExistOutstanding = Number(this.state.existOutstanding);
            var RemainingPaymentAmount = PaymentAmount;

            for (let i = 0; i < SystemPolicyOutstandingTransactions.length; i++) {

                let transaction = SystemPolicyOutstandingTransactions[i];

                console.log("transaction", transaction);

                let AmountApplied = 0;
                let TotalDue = Number(transaction.TotalDue);
                let LevyTotalAmount = Number(transaction.LevyTotalAmount);

                let Outstanding = Number(transaction.Outstanding);
                let OutstandingAfterPayment = 0;
                let UpdatedNetAmount = 0;
                var UpdatedNetPremium = 0;
                var UpdatedLevy = 0;
                let UpdatedAdminFee = 0;

                if (RemainingPaymentAmount > 0) {
                    AmountApplied = (RemainingPaymentAmount <= Outstanding) ? Number(RemainingPaymentAmount) : Number(Outstanding);
                    OutstandingAfterPayment = Outstanding - AmountApplied;
                    UpdatedAdminFee = (transaction.AdminFee * AmountApplied) / TotalDue;
                    UpdatedNetAmount = AmountApplied - UpdatedAdminFee;
                    UpdatedLevy = (AmountApplied * LevyTotalAmount) / TotalDue;
                    UpdatedNetPremium = AmountApplied - UpdatedLevy - UpdatedAdminFee;
                    RemainingPaymentAmount = RemainingPaymentAmount - AmountApplied;
                } else {
                    OutstandingAfterPayment = Outstanding - AmountApplied;
                }

                PolicyOutstandingTransactions[i].AmountApplied = Number(AmountApplied).toFixed(2);
                PolicyOutstandingTransactions[i].OutstandingAfterPayment = Number(OutstandingAfterPayment).toFixed(2);
                PolicyOutstandingTransactions[i].UpdatedNetPremium = Number(UpdatedNetPremium).toFixed(2);
                PolicyOutstandingTransactions[i].UpdatedLevy = Number(UpdatedLevy).toFixed(2);
                PolicyOutstandingTransactions[i].UpdatedAdminFee = Number(UpdatedAdminFee).toFixed(2);
            }
            this.setState({ PolicyOutstandingTransactions: PolicyOutstandingTransactions, paymentAmountRemains: RemainingPaymentAmount });

        } catch (error) {
            console.log("calculatePremium >> error", error);
        }
    }

    validateTransferFundTotal() {
        console.log("validateTransferFundTotal >", this.state);
        let PolicyOutstandingTransactions = this.state.PolicyOutstandingTransactions;
        let PaymentAmount = this.state.paymentAmount;
        let TotalAmount = 0;

        for (let i = 0; i < PolicyOutstandingTransactions.length; i++) {
            TotalAmount = parseFloat(TotalAmount) + parseFloat(PolicyOutstandingTransactions[i].AmountApplied);
        }

        if (TotalAmount > 0 && TotalAmount <= PaymentAmount) {
            return false;
        }
        return true;
    }

    saveTransferFund() {
        try {
            if (this.state.newEntryDateError) {
                toast.error('Please Enter Transaction Date');
            } else if (this.state.descriptionError) {
                toast.error('Please Enter Description');
            } else if (this.state.paymentAmountError) {
                toast.error('Please Enter Payment Amount');
            } else if (this.state.paymentModeError) {
                toast.error('Please Select Payment Mode');
            } else if (this.state.paymentAmount == 0) {
                toast.error('Payment amount can not be 0.');
            } else if (this.validateTransferFundTotal()) {
                toast.error('Total Amount Applied must be in between 1 to ' + this.state.paymentAmount + '.');
            } else {
                let data = {
                    PolicyId: this.props.match.params.id,
                    EntryType: '',
                    TransferFundRecord: this.state.transferFundData,
                    NewEntryDate: moment(this.state.newEntryDate).format(CommonConfig.dateFormat.dbDateTime),
                    TransactionType: this.state.transactionType,
                    ReferenceId: this.state.referenceId,
                    Description: this.state.description,
                    PaymentAmount: this.state.paymentAmount,
                    PaymentMode: this.state.paymentMode,
                    PaymentStatus: "Success",
                    Note: this.state.note,
                    CreatedBy: CommonConfig.loggedInUserId(),
                    PaymentEntries: this.state.PolicyOutstandingTransactions,
                    LanguageId: this.state.LanguageId
                };
                console.log("saveTransferFund > ", data);

                this.saveTransferFundAPICall(data);
            }
        } catch (error) {
            console.log("saveMakePaymentEntry error 1", JSON.stringify(error));
        }
    }

    saveTransferFundAPICall(data) {
        console.log("saveTransferFund-request", JSON.stringify(data));
        try {
            api.post('api/saveTransferFund', data).then(res => {
                console.log("saveTransferFund-response", res.data);
                if (res.success && res.data.success) {
                    this.hideTransferFundPopup();
                    toast.success(res.data.message);
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                }
            }).catch(err => {
                toast.error("Not able to add entry in database.");
                console.log("saveTransferFund-err", err);
            });
        } catch (error) {
            toast.error("Not able to add entry in database.");
            console.log("saveTransferFund-err", error);
        }
    }

    render() {
        return (
            <div className="table-custom">

                <Row>

                    <Col md="2" style={{ alignSelf: 'center' }}>
                        <span> Policy Number: {this.state.policyNumber}</span>
                    </Col>

                    <Col md="10" className="p-0">
                        <BTN type="button" icon="fa fa-bank" className="p-button-primary" tooltip="Bank Details" tooltipOptions={{ position: 'bottom' }} onClick={() => this.showBankDetailsPopup()}>
                        </BTN>

                        <div style={{ display: "inline-block", margin: "10px 20px" }}>
                            <h5>
                                Payment Due : <i className={this.props.CurrencySymbol} ></i>  {this.state.paymentDue ? this.state.paymentDue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}

                            </h5>
                        </div>

                        {(this.state.IsLapsePolicy) ? (
                            <div style={{ alignSelf: 'center', display: "inline-block", margin: "10px" }}>
                                <small>
                                    Renewal Date: {moment(this.state.RenewalDate).format(CommonConfig.dateFormat.dateOnly)}
                                    ({(this.state.DaysOverdue < 0) ? this.state.DaysOverdue + ' Day(s) Overdue' : (Math.abs(this.state.DaysOverdue) + ' Day(s) to Renewal')})
                                </small>
                                <Button style={{ margin: "10px" }} color="danger" onClick={() => this.showLapsePolicyPopup()}>Lapse Policy</Button>
                            </div>
                        ) : (null)}

                        {/* 
                            <Button style={{ margin: "5px" }} color="primary" onClick={() => this.showJournalEntryPopup()}>Journal Entry</Button> 
                            <Col md="3" style={{ alignSelf: "center" }}> 
                            {(this.state.isPolicyRenewal == 1) ? (null) : (
                                <Button style={{ margin: "5px" }} color="primary" onClick={() => this.showMakePaymentPopup()}>Make Payment</Button>
                            )}
                            <Button style={{ margin: "5px" }} color="primary" onClick={() => this.showReturnPaymentPopup()}>Return Payment</Button> 
                            </Col>
                        */}
                    </Col>

                </Row>

                <BootstrapTable
                    keyField='SequenceNumber'
                    data={this.state.arr}
                    columns={this.state.cols}
                    expandRow={this.expandRow}
                />

                <Modal isOpen={this.state.toggleNewEntryModal} className={'modal-lg'} style={{ maxWidth: '70%' }}>
                    <ModalHeader toggle={() => this.hideEntryPopup()}>
                        {(this.state.transactionType == 'Payment' || this.state.transactionType == 'ReturnPayment') ? 'Payment Entry' : 'Journal Entry'}
                    </ModalHeader>

                    <Col style={{ margin: "20px" }}>

                        <Row>
                            <Col md="3"> Policy </Col>
                            <Col md="3"> <label>{this.state.policyNumber}</label> </Col>
                            <Col md="3"> Policy Type </Col>
                            <Col md="3"> <label>{this.state.policyType}</label> </Col>
                        </Row>

                        <Row style={{ marginTop: 10 }}>
                            <Col md="3"> Policy Holder </Col>
                            <Col md="4"> <label>{this.state.policyHolder}</label> </Col>
                        </Row>

                        <Row style={{ marginTop: 10 }}>
                            <Col md="3">Transaction Date*</Col>
                            <Col md="4">
                                <InputGroup>
                                    <Input disabled={this.state.isEdit} type="date" name="newEntryDate" id="newEntryDate" placeholder="transaction date" onBlur={(e) => this.handleChange(e)}
                                        onChange={(e) => this.handleChange(e)} value={this.state.newEntryDate}
                                        min={moment().subtract(100, 'years').format('DD-MM-YYYY')}
                                        max={moment().format('DD-MM-YYYY')}
                                    />
                                    <em id="newEntryDateError" className="error invalid-feedback" ></em>
                                </InputGroup>

                                {/* <DatePicker name="newEntryDate" onChange={e => this.handleDateChange(e, 'newEntryDate')}
                                value={this.state.newEntryDate} maxDate={moment().toDate()}
                                /> */}
                            </Col>
                        </Row>

                        <div>
                            {/* {
                                (this.state.transactionType === 'Debit' || this.state.transactionType === 'Credit') ?
                                    (
                                        <Row style={{ marginTop: 10 }}>
                                            <Col md="3"> Type* </Col>
                                            <Col md="4">
                                                {
                                                    (this.state.transactionType === 'Debit') ? (
                                                        <Input type="select" name="entryType" id="entryType" onChange={(e) => this.selectType(e.target.value, 'entryType')} value={this.state.entryType} disabled={this.state.isEdit}>
                                                            <option value=''>Select Type</option>
                                                            {this.state.journalDebitData.map((type, i) => {
                                                                return (<option value={type.label} key={i}>{type.value}</option>)
                                                            })
                                                            }
                                                        </Input>
                                                    ) : (
                                                            <Input type="select" name="entryType" id="entryType" onChange={(e) => this.selectType(e.target.value, 'entryType')} value={this.state.entryType} disabled={this.state.isEdit}>
                                                                <option value=''>Select Type</option>
                                                                {this.state.journalCreditData.map((type, i) => {
                                                                    return (<option value={type.label} key={i}>{type.value}</option>)
                                                                })
                                                                }
                                                            </Input>
                                                        )
                                                }
                                                <em id="entryTypeError" className="error invalid-feedback" ></em>
                                            </Col>
                                        </Row>
                                    ) : (
                                        null
                                    )
                            } */}

                            <Row style={{ marginTop: 10 }}>
                                <Col md="3"> Description* </Col>
                                <Col md="4">
                                    <Input name="description" type="text" id="description" className=""
                                        onChange={e => this.handleChange(e)} onBlur={e => this.handleChange(e)} value={this.state.description} disabled={this.state.isEdit} />
                                    <em id="descriptionError" className="error invalid-feedback" ></em>
                                </Col>
                            </Row>

                            {
                                (this.state.transactionType === 'Debit') ?
                                    (
                                        <div>
                                            <Row style={{ marginTop: 10 }}>
                                                <Col md="3"> Charge Amount* </Col>
                                                <Col md="4">
                                                    <Input name="chargeAmount" type="text" id="chargeAmount" onChange={e => this.handleChange(e)} onBlur={e => this.handleChange(e)} value={this.state.chargeAmount} disabled={this.state.isEdit} />
                                                    <em id="chargeAmountError" className="error invalid-feedback" ></em>
                                                </Col>
                                            </Row>

                                        </div>
                                    ) : (
                                        null
                                    )
                            }

                            {
                                (this.state.transactionType === 'Credit') ?
                                    (
                                        <Row style={{ marginTop: 10 }}>
                                            <Col md="3"> Adj Amount* </Col>
                                            <Col md="4">
                                                <Input name="paymentAmount" type="number" id="paymentAmount" onChange={e => this.handleChange(e)} onBlur={e => this.handleChange(e)} value={this.state.paymentAmount} disabled={this.state.isEdit} />
                                                <em id="paymentAmountError" className="error invalid-feedback" ></em>
                                            </Col>
                                        </Row>
                                    ) : (
                                        null
                                    )
                            }

                            {
                                (this.state.transactionType === 'ReturnPayment') ?
                                    (
                                        <div>
                                            <Row style={{ marginTop: 10 }}>
                                                <Col md="3"> Payment Amount* </Col>
                                                <Col md="4">
                                                    <Input name="paymentAmount" type="number" id="paymentAmount" onChange={e => this.handleChange(e)} onBlur={e => this.handleChange(e)} value={this.state.paymentAmount} disabled={this.state.isEdit} />
                                                </Col>
                                            </Row>

                                            <Row style={{ marginTop: 10 }}>
                                                <Col md="3"> Return Payment Mode* </Col>
                                                <Col md="4">
                                                    <Input type="select" name="paymentMode" id="paymentMode" disabled={this.state.isEdit}
                                                        onChange={(e) => this.selectType(e.target.value, 'paymentMode')} value={this.state.paymentMode}
                                                    >
                                                        <option value=''>Select payment mode</option>
                                                        {this.state.returnPaymentModearr.map((type, i) => {
                                                            return (<option value={type.label} key={i}>{type.value}</option>)
                                                        })
                                                        }
                                                    </Input>
                                                    <em id="paymentModeError" className="error invalid-feedback" ></em>
                                                </Col>
                                            </Row>
                                        </div>
                                    ) : (
                                        null
                                    )
                            }

                            <Row style={{ marginTop: 10 }}>
                                <Col md="3"> Note </Col>
                                <Col md="4">
                                    <Input name="note" type="textarea" id="note" onChange={e => this.handleChange(e)} onBlur={e => this.handleChange(e)} value={this.state.note} disabled={this.state.isEdit} />
                                </Col>
                            </Row>

                        </div>
                    </Col>

                    {CommonConfig.isEmpty(this.state.PolicyAccountId) ? (
                        <div style={{ margin: 20 }}>
                            <Row className="pull-right" style={{ backgroundColor: "#fff", marginRight: 10 }}>
                                <Button style={{ marginLeft: "10px" }} color="success" onClick={() => this.addUpdateAccountEntry()}>
                                    < i style={{ marginRight: "10px" }} className="fa fa-check" ></i >
                                    Save
                                </Button>
                                <Button style={{ marginLeft: "10px" }} color="danger" onClick={() => this.hideEntryPopup()}>
                                    <i style={{ marginRight: "10px" }} className="fa fa-times"></i>
                                    Cancel
                                </Button>
                            </Row>
                        </div>
                    ) : (null)}
                </Modal>

                <Modal isOpen={this.state.isPaymentPopup} className={'modal-lg'} style={{ maxWidth: '70%' }}>
                    <ModalHeader toggle={() => this.hideMakePaymentPopup()}>Payment Entry</ModalHeader>

                    <div style={{ padding: 20 }}>

                        <Row>
                            <Col md="3"> Policy </Col>
                            <Col md="3"> <label>{this.state.policyNumber}</label> </Col>
                            <Col md="3"> Policy Type </Col>
                            <Col md="3"> <label>{this.state.policyType}</label> </Col>
                        </Row>

                        <Row style={{ marginTop: 10 }}>
                            <Col md="3"> Policy Holder </Col>
                            <Col md="4"> <label>{this.state.policyHolder}</label> </Col>
                        </Row>

                        <Row style={{ marginTop: 10 }}>
                            <Col md="3">Transaction Date*</Col>
                            <Col md="4">
                                <InputGroup>
                                    <Input disabled={this.state.isEdit} type="date" name="newEntryDate" id="newEntryDate" placeholder="transaction date" onBlur={(e) => this.handleChange(e)}
                                        onChange={(e) => this.handleChange(e)} value={this.state.newEntryDate}
                                        min={moment().subtract(100, 'years').format('DD-MM-YYYY')}
                                        max={moment().format('DD-MM-YYYY')}
                                    />
                                    <em id="newEntryDateError" className="error invalid-feedback" ></em>
                                </InputGroup>
                            </Col>
                        </Row>

                        <div>

                            <Row style={{ marginTop: 10 }}>
                                <Col md="3"> Description* </Col>
                                <Col md="4">
                                    <Input disabled={this.state.isEdit} name="description" type="text" id="description" className=""
                                        onChange={e => this.handleChange(e)} onBlur={e => this.handleChange(e)} value={this.state.description} />
                                    <em id="descriptionError" className="error invalid-feedback" ></em>
                                </Col>
                            </Row>

                            <div>
                                <Row style={{ marginTop: 10 }}>
                                    <Col md="3"> Payment Amount* </Col>
                                    <Col md="4">
                                        <Input disabled={this.state.isEdit} name="paymentAmount" type="number" id="paymentAmount" onChange={e => this.handleChange(e)} onBlur={e => this.handleChange(e)} value={this.state.paymentAmount} />
                                    </Col>
                                </Row>

                                <Row style={{ marginTop: 10 }}>
                                    <Col md="3"> Payment Mode* </Col>
                                    <Col md="4">
                                        <Input disabled={this.state.isEdit} type="select" name="paymentMode" id="paymentMode"
                                            onChange={(e) => this.selectType(e.target.value, 'paymentMode')} value={this.state.paymentMode}
                                        >
                                            <option value=''>Select payment mode</option>
                                            {this.state.paymentModearr.map((type, i) => {
                                                return (<option value={type.label} key={i}>{type.value}</option>)
                                            })
                                            }
                                        </Input>
                                        <em id="paymentModeError" className="error invalid-feedback" ></em>
                                    </Col>

                                    {/* {(this.state.PolicyAccountId == '') ?
                                        <Col md="5">
                                            <Row>
                                                <Col md="8"> Payment Due: </Col>
                                                <Col md="4">
                                                    <i className={this.props.CurrencySymbol} ></i> {this.state.paymentDue}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="8"> Balance after payment: </Col>
                                                <Col md="4">
                                                    <i className={this.props.CurrencySymbol} ></i> {this.state.calculateBalanceAFTPay.toFixed(2)}
                                                </Col>
                                            </Row>
                                        </Col>
                                        : (null)} */}
                                </Row>
                            </div>

                            {(this.state.OutstandingTransactions.length) ? (
                                <div>

                                    <table border='1' style={{ width: '100%', marginTop: 15, marginBottom: 15 }}>
                                        <thead>
                                            <th style={{ width: '20%' }}>Transaction Type</th>
                                            <th style={{ width: '10%' }}>Reference Id</th>
                                            {
                                                (this.state.isEdit) ? (null) : <th style={{ width: '10%' }}>Outstanding</th>
                                            }
                                            <th style={{ width: '10%' }}>Amount Applied</th>
                                            {
                                                (this.state.isEdit) ? (null) : <th style={{ width: '10%' }}>Outstanding After Payment</th>
                                            }
                                            <th style={{ width: '10%' }}>Net Premium</th>
                                            <th style={{ width: '10%' }}>Levy</th>
                                            <th style={{ width: '10%' }}>Admin</th>
                                        </thead>
                                        <tbody>
                                            {this.state.OutstandingTransactions.map((transaction, i) => {
                                                return (
                                                    <tr>
                                                        <td>{transaction.Narration}</td>
                                                        <td>{transaction.UniqueReferenceId}</td>
                                                        {
                                                            (this.state.isEdit) ? (null) : <td>{transaction.Outstanding}</td>
                                                        }
                                                        <td>
                                                            <Input disabled={this.state.isEdit} name="AmountApplied" id="AmountApplied" type="number" value={transaction.AmountApplied} onChange={e => this.handleChangeAmount(e, i)} onBlur={e => this.handleChangeAmount(e, i)} />
                                                        </td>
                                                        {
                                                            (this.state.isEdit) ? (null) : <td>{transaction.OutstandingAfterPayment}</td>
                                                        }
                                                        <td>{transaction.UpdatedNetPremium}</td>
                                                        <td>{transaction.UpdatedLevy}</td>
                                                        <td>{transaction.UpdatedAdminFee}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>

                                    <em id="AmountAppliedError" style={{ color: 'red', }} className="error" ></em>
                                </div>
                            ) : (null)}

                            {(this.state.paymentMode == 'Debit/Credit Card') ? (
                                <div>

                                    <Row style={{ marginTop: 10 }}>
                                        <Col md="3"> Card Type (*) </Col>
                                        <Col md="4">
                                            <Input name="CardType" type="select" id="CardType" onChange={(e) => this.selectType(e.target.value, 'CardType')} value={this.state.CardType} >
                                                <option value="VISA">Visa</option>
                                                <option value="MC">Master Card</option>
                                                <option value="laser">Laser</option>
                                            </Input>

                                            <em id="CardTypeError" className="error invalid-feedback" ></em>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: 10 }}>
                                        <Col md="3"> Cardholder Name (*) </Col>
                                        <Col md="4">
                                            <Input name="CardholderName" type="text" id="CardholderName" onChange={e => this.handleChange(e)} onBlur={e => this.handleChange(e)} value={this.state.CardholderName} />
                                            <em id="CardholderNameError" className="error invalid-feedback" ></em>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: 10 }}>
                                        <Col md="3"> Card Number (*) </Col>
                                        <Col md="4">
                                            <Input name="CardNumber" type="text" id="CardNumber" onChange={e => this.handleChange(e)} onBlur={e => this.handleChange(e)} value={this.state.CardNumber} />
                                            <em id="CardNumberError" className="error invalid-feedback" ></em>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: 10 }}>
                                        <Col md="3"> Expiry (*) </Col>
                                        <Col md="2">
                                            <Input name="ExpiryMonth" type="select" id="ExpiryMonth" onChange={(e) => this.selectType(e.target.value, 'ExpiryMonth')} value={this.state.ExpiryMonth} >
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                                <option value="11">11</option>
                                                <option value="12">12</option>
                                            </Input>
                                            <em id="ExpiryMonthError" className="error invalid-feedback" ></em>
                                        </Col>
                                        <Col md="2">
                                            <Input name="ExpiryYear" type="select" id="ExpiryYear" onChange={(e) => this.selectType(e.target.value, 'ExpiryYear')} value={this.state.ExpiryYear} >
                                                <option value="2020">2020</option>
                                                <option value="2021">2021</option>
                                                <option value="2022">2022</option>
                                                <option value="2023">2023</option>
                                                <option value="2024">2024</option>
                                                <option value="2025">2025</option>
                                                <option value="2026">2026</option>
                                                <option value="2027">2027</option>
                                                <option value="2028">2028</option>
                                                <option value="2029">2029</option>
                                                <option value="2030">2030</option>
                                            </Input>
                                            <em id="ExpiryYearError" className="error invalid-feedback" ></em>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: 10 }}>
                                        <Col md="3"> CVV (*) </Col>
                                        <Col md="4">
                                            <Input name="CVV" type="password" id="CVV" onChange={e => this.handleChange(e)} onBlur={e => this.handleChange(e)} value={this.state.CVV} />
                                            <em id="CVVError" className="error invalid-feedback" ></em>
                                        </Col>
                                    </Row>

                                </div>
                            ) : (null)}

                            <Row style={{ marginTop: 10 }}>
                                <Col md="3"> Note </Col>
                                <Col md="4">
                                    <Input disabled={this.state.isEdit} name="note" type="textarea" id="note" onChange={e => this.handleChange(e)} onBlur={e => this.handleChange(e)} value={this.state.note} />
                                </Col>
                            </Row>

                        </div>

                    </div>

                    {CommonConfig.isEmpty(this.state.PolicyAccountId) ? (
                        <div style={{ margin: 20 }}>
                            <Row className="pull-right" style={{ backgroundColor: "#fff", marginRight: 10 }}>
                                <Button style={{ marginLeft: "10px" }} color="success" onClick={() => this.saveMakePaymentEntry()}>
                                    <i style={{ marginRight: "10px" }} className="fa fa-check" ></i > Save
                                </Button>
                                <Button style={{ marginLeft: "10px" }} color="danger" onClick={() => this.hideMakePaymentPopup()}>
                                    <i style={{ marginRight: "10px" }} className="fa fa-times"></i> Cancel
                                </Button>
                            </Row>
                        </div>
                    ) : (null)}

                </Modal>

                <Modal isOpen={this.state.isTransferFundPopup} className={'modal-lg'} style={{ maxWidth: '70%' }}>
                    <ModalHeader toggle={() => this.hideTransferFundPopup()}>Transfer a Fund</ModalHeader>

                    <div style={{ padding: 20 }}>

                        <Row>
                            <Col md="3"> Policy </Col>
                            <Col md="3"> <label>{this.state.policyNumber}</label> </Col>
                            <Col md="3"> Policy Type </Col>
                            <Col md="3"> <label>{this.state.policyType}</label> </Col>
                        </Row>

                        <Row style={{ marginTop: 10 }}>
                            <Col md="3"> Policy Holder </Col>
                            <Col md="4"> <label>{this.state.policyHolder}</label> </Col>
                        </Row>

                        <Row style={{ marginTop: 10 }}>
                            <Col md="3">Transaction Date*</Col>
                            <Col md="4">
                                <InputGroup>
                                    <Input disabled={this.state.isEdit} type="date" name="newEntryDate" id="newEntryDate" placeholder="transaction date" onBlur={(e) => this.handleChange(e)}
                                        onChange={(e) => this.handleChange(e)} value={this.state.newEntryDate}
                                        min={moment().subtract(100, 'years').format('DD-MM-YYYY')}
                                        max={moment().format('DD-MM-YYYY')}
                                    />
                                    <em id="newEntryDateError" className="error invalid-feedback" ></em>
                                </InputGroup>
                            </Col>
                        </Row>

                        <div>

                            <Row style={{ marginTop: 10 }}>
                                <Col md="3"> Description* </Col>
                                <Col md="4">
                                    <Input disabled={this.state.isEdit} name="description" type="text" id="description" className=""
                                        onChange={e => this.handleChange(e)} onBlur={e => this.handleChange(e)} value={this.state.description} />
                                    <em id="descriptionError" className="error invalid-feedback" ></em>
                                </Col>
                            </Row>

                            <div>
                                <Row style={{ marginTop: 10 }}>
                                    <Col md="3"> Payment Amount* </Col>
                                    <Col md="4">
                                        <Input disabled={true} name="paymentAmount" type="number" id="paymentAmount" onChange={e => this.handleChange(e)} onBlur={e => this.handleChange(e)} value={this.state.paymentAmount} />
                                    </Col>
                                    <Col md="3">
                                        {this.state.paymentAmountRemains < 0 ?
                                            (<span style={{ color: 'red' }}> Balance: {this.state.paymentAmountRemains} </span>)
                                            :
                                            (<span> Balance: {this.state.paymentAmountRemains} </span>)
                                        }
                                    </Col>
                                </Row>

                                <Row style={{ marginTop: 10 }}>
                                    <Col md="3"> Payment Mode* </Col>
                                    <Col md="4">
                                        <Input disabled={this.state.isEdit} type="select" name="paymentMode" id="paymentMode"
                                            onChange={(e) => this.selectType(e.target.value, 'paymentMode')} value={this.state.paymentMode}
                                        >
                                            <option value=''>Select payment mode</option>
                                            {this.state.paymentModearr.map((type, i) => {
                                                return (
                                                    (type.label == 'Fund Transfer') ?
                                                        <option value={type.label} key={i}>{type.value}</option>
                                                        : (null)
                                                )
                                            })
                                            }
                                        </Input>
                                        <em id="paymentModeError" className="error invalid-feedback" ></em>
                                    </Col>
                                </Row>
                            </div>

                            {(this.state.PolicyOutstandingTransactions.length) ? (
                                <div>
                                    <table border='1' style={{ width: '100%', marginTop: 15, marginBottom: 15 }}>
                                        <thead>
                                            <th style={{ width: '20%' }}>Policy Number</th>
                                            <th style={{ width: '20%' }}>Transaction Type</th>
                                            <th style={{ width: '10%' }}>Reference Id</th>
                                            <th style={{ width: '10%' }}>Outstanding</th>
                                            <th style={{ width: '10%' }}>Amount Applied</th>
                                            <th style={{ width: '10%' }}>Outstanding After Payment</th>
                                            <th style={{ width: '10%' }}>Net Premium</th>
                                            <th style={{ width: '10%' }}>Levy</th>
                                            <th style={{ width: '10%' }}>Admin</th>
                                        </thead>
                                        <tbody>
                                            {this.state.PolicyOutstandingTransactions.map((transaction, i) => {
                                                return (
                                                    <tr>
                                                        <td>{transaction.PolicyNumber}</td>
                                                        <td>{transaction.Narration}</td>
                                                        <td>{transaction.UniqueReferenceId}</td>
                                                        <td>{transaction.Outstanding}</td>
                                                        <td>
                                                            <Input disabled={this.state.isEdit} name="AmountApplied" id={"AmountApplied" + i} type="number" value={transaction.AmountApplied} onChange={e => this.handleTransferFundChangeAmount(e, i)} onBlur={e => this.handleTransferFundChangeAmount(e, i)} />
                                                        </td>
                                                        <td>{transaction.OutstandingAfterPayment}</td>
                                                        <td>{transaction.UpdatedNetPremium}</td>
                                                        <td>{transaction.UpdatedLevy}</td>
                                                        <td>{transaction.UpdatedAdminFee}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>

                                    <em id="AmountAppliedError" style={{ color: 'red', }} className="error" ></em>
                                </div>
                            ) : (null)}

                            <Row style={{ marginTop: 10 }}>
                                <Col md="3"> Note </Col>
                                <Col md="4">
                                    <Input disabled={this.state.isEdit} name="note" type="textarea" id="note" onChange={e => this.handleChange(e)} onBlur={e => this.handleChange(e)} value={this.state.note} />
                                </Col>
                            </Row>

                        </div>

                    </div>

                    <div style={{ margin: 20 }}>
                        <Row className="pull-right" style={{ backgroundColor: "#fff", marginRight: 10 }}>
                            <Button style={{ marginLeft: "10px" }} color="success" onClick={() => this.saveTransferFund()}>
                                <i style={{ marginRight: "10px" }} className="fa fa-check" ></i > Save
                                </Button>
                            <Button style={{ marginLeft: "10px" }} color="danger" onClick={() => this.hideTransferFundPopup()}>
                                <i style={{ marginRight: "10px" }} className="fa fa-times"></i> Cancel
                                </Button>
                        </Row>
                    </div>

                </Modal>

                <Modal isOpen={this.state.toggleBnkDetailsModal} className={'modal-lg'}>
                    <ModalHeader toggle={() => this.hideBankDetailsPopup()}> Enter Bank Details </ModalHeader>
                    <Col style={{ margin: "20px" }}>
                        <Row>
                            <Col md="12">
                                {/* <Card> <CardBody style={{ backgroundColor: "#f2f2f2" }}> */}
                                <div className="input-box">
                                    <Row>
                                        <Col md="3">
                                            <label>Account Name*</label>
                                        </Col>
                                        <Col md="6">
                                            <Input type="text" name="accountName" id="accountName" onChange={(e) => this.handleChange(e)} value={this.state.accountName} />
                                            <em id="accountNameError" className="error invalid-feedback"></em>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="input-box">
                                    <Row>
                                        <Col md="3">
                                            <label>Bank Name*</label>
                                        </Col>
                                        <Col md="6">
                                            <Input type="text" name="bankName" id="bankName" onChange={(e) => this.handleChange(e)} value={this.state.bankName} />
                                            <em id="bankNameError" className="error invalid-feedback"></em>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="input-box">
                                    <Row>
                                        <Col md="3">
                                            <label>Country*</label>
                                        </Col>
                                        <Col md="3">
                                            <Input type="select" name="bankCountry" id="bankCountry" onChange={(e) => this.selectType(e.target.value, 'bankCountry')} value={this.state.bankCountry}>
                                                <option value=''>Select country</option>
                                                {this.state.countryList.map((type, i) => {
                                                    return (<option value={type.StringMapKey}>{type.StringMapName}</option>)
                                                })
                                                }
                                            </Input>
                                            <em id="bankCountryError" className="error invalid-feedback"></em>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="input-box">
                                    <Row>
                                        <Col md="3">
                                            <label>IBAN*</label>
                                        </Col>
                                        <Col md="6">
                                            <Input type="text" name="IBAN" id="IBAN" onChange={(e) => this.handleChange(e)} value={this.state.IBAN} />
                                            <em id="IBANError" className="error invalid-feedback"></em>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="input-box">
                                    <Row>
                                        <Col md="3">
                                            <label>BIC</label>
                                        </Col>
                                        <Col md="3">
                                            <Input type="text" name="BIC" id="BIC" onChange={(e) => this.handleChange(e)} value={this.state.BIC} />
                                            <em id="BICError" className="error invalid-feedback"></em>
                                        </Col>
                                    </Row>
                                </div>
                                {/* </CardBody> </Card> */}
                            </Col>
                        </Row>

                        <div style={{ margin: 20 }}>
                            <Row className="pull-right" style={{ backgroundColor: "#fff", marginRight: 10 }}>

                                {(CommonConfig.isEmpty(this.state.EntityBankDetailId)) ? (null) : (
                                    <Button style={{ marginLeft: "10px" }} color="danger" onClick={() => this.clearBankDetails()}>
                                        <i style={{ marginRight: "10px" }} className="fa fa-trash"></i> Clear Bank Details
                                    </Button>
                                )}
                                <Button style={{ marginLeft: "10px" }} color="success" onClick={() => this.addUpdateBankDetails()}>
                                    <i style={{ marginRight: "10px" }} className="fa fa-check" ></i> Save
                                </Button>
                                <Button style={{ marginLeft: "10px" }} color="primary" onClick={() => this.hideBankDetailsPopup()}>
                                    <i style={{ marginRight: "10px" }} className="fa fa-times"></i> Cancel
                                </Button>
                            </Row>
                        </div>
                    </Col>
                </Modal>

                <Modal isOpen={this.state.toggleModalDel} className={'modal-lg'}>
                    <ModalHeader toggle={() => this.hidedeletePopup()}>
                        Delete Payment
          </ModalHeader>
                    <Col style={{ margin: "20px" }}>
                        <Row>
                            <Col md="12">
                                Are you sure want to delete this payment of {<i className={this.props.CurrencySymbol} ></i>} {(this.state.delPolicyId.TransactionType === 'Credit' || this.state.delPolicyId.TransactionType === 'Payment' || this.state.delPolicyId.TransactionType === 'ReturnPayment') ? this.state.delPolicyId.PaymentAmount : this.state.delPolicyId.AmountCharge} {this.state.delPolicyId.PaymentModeName} on {this.state.delPolicyId.TransactionDate}
                            </Col>
                        </Row>
                    </Col>

                    <div style={{ margin: 20 }}>
                        <Row className="pull-right" style={{ backgroundColor: "#fff", marginRight: 10 }}>
                            <Button style={{ marginLeft: "10px" }} color="danger" onClick={() => this.deleteAccount()}>
                                <i style={{ marginRight: "10px" }} className="fa fa-trash"></i>
                Delete
              </Button>
                            <Button style={{ marginLeft: "10px" }} color="primary" onClick={() => this.hidedeletePopup()}>
                                <i style={{ marginRight: "10px" }} className="fa fa-times"></i>
                Cancel
              </Button>
                        </Row>
                    </div>
                </Modal>

                <Modal isOpen={this.state.toggleModal} className={'modal-lg'} toggle={() => this.hidePopup()}>
                    <ModalHeader toggle={() => this.hidePopup()}>
                        Regenerate Receipt of Payment
          </ModalHeader>
                    <Col style={{ margin: "20px" }}>
                        <Row>
                            <Col md="12">
                                Are you sure want to re-generate this receipt of payment ?
              </Col>
                        </Row>
                    </Col>

                    <div style={{ margin: 20 }}>
                        <Row className="pull-right" style={{ backgroundColor: "#fff", marginRight: 10 }}>
                            <Button style={{ marginLeft: "10px" }} color="success" onClick={() => this.againGenerateReceipt()}>
                                <i style={{ marginRight: "10px" }} className="fa fa-check"></i>
                Yes
              </Button>
                            <Button style={{ marginLeft: "10px" }} color="primary" onClick={() => this.hidePopup()}>
                                <i style={{ marginRight: "10px" }} className="fa fa-times"></i>
                No
              </Button>
                        </Row>
                    </div>
                </Modal>

                <Modal isOpen={this.state.IsLapsePolicyPopup} className={'modal-lg'} toggle={() => this.hideLapsePolicyPopup()}>
                    <ModalHeader toggle={() => this.hideLapsePolicyPopup()}> Are you sure you want to Lapse this policy ? </ModalHeader>

                    <Col md='12' style={{ marginTop: 15 }}>

                        <Row style={{ marginTop: 15 }}>
                            <Col md="2">Policy Number</Col>
                            <Col md="2">{this.state.policyNumber}</Col>
                        </Row>

                        {/* <Row style={{ marginTop: 15 }}>
              <Col md="2">Payment Due</Col>
              <Col md="2">{this.state.paymentDue}</Col>
            </Row> */}

                        <Row style={{ marginTop: 15 }}>
                            <Col md="2"> Note </Col>
                            <Col md="6">
                                <Input type="textarea" name="lapsePolicyNote" id="lapsePolicyNote" rows='3' onChange={e => this.handleChange(e)} onBlur={e => this.handleChange(e)} value={this.state.lapsePolicyNote} />
                            </Col>
                        </Row>

                    </Col>

                    <div style={{ margin: 20 }}>
                        <Row className="pull-right" style={{ backgroundColor: "#fff", marginRight: 10 }}>
                            <Button style={{ marginLeft: "10px" }} color="success" onClick={() => this.lapsePolicy()}>
                                <i style={{ marginRight: "10px" }} className="fa fa-check"></i>Yes
              </Button>
                            <Button style={{ marginLeft: "10px" }} color="primary" onClick={() => this.hideLapsePolicyPopup()}>
                                <i style={{ marginRight: "10px" }} className="fa fa-times"></i>Cancel
              </Button>
                        </Row>
                    </div>
                </Modal>

            </div >
        )
    }
}

export default withTranslation()(Account);
