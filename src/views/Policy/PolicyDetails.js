import React, { Component } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Card, CardBody, Col, Row, Input, Button as BTN, CardHeader, Collapse, Nav, NavItem, NavLink, TabContent, TabPane, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Underwriting from './Underwriting';
import Vessel from './Vessel';
import General from './General';
import Endorsements from './Endorsements';
import Mooring from './Mooring';
import Coverage from './Coverage';
import Account from './Account';
import Timeline from './Timeline';
import api from '../../utils/apiClient';
import APIConstant, { CommonConfig } from '../../utils/constants';
import { apiBase } from '../../utils/config';
import { ScrollPanel } from 'primereact/scrollpanel';
import { AutoComplete } from 'primereact/autocomplete';
import { toast } from 'react-toastify';
import { withTranslation } from 'react-i18next';
import SidebarNav from '../SidebarNav/SidebarNav';
import Moment from 'moment';
import moment from 'moment';
import { func } from 'prop-types';

class PolicyDetails extends Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);

		this.state = {

			// showPolicySummary:false,//For Model visible and hide

			activeTab: new Array(4).fill('1'),

			showSummary: true,
			showWarningsMessagesReminders: false,
			errorNote: [],
			languageList: [],
			currencyList: [],
			countryList: [],
			policyTypeList: [],
			policyReferNotes: [],

			policyNumber: '',
			policyType: '',
			phone: '',
			language: '',
			languageId: '',
			policyHolder: '',
			email: '',
			refrred: false,
			showRefer: false,
			status: '',
			country: '',
			currency: '',
			vesselTypeName: '',
			changeLanguage: false,
			changeCurrency: false,
			changePolicyType: false,
			changeVesselType: false,
			changeCountry: false,

			computationId: '',

			//Summary
			premiumPolicyType: '',
			defaultPremiumPolicyType: '',
			premiumPolicyTypeError: true,
			premiumPolicyTypeList: [],
			confirmPremiumPolicyType: false,
			comprehensivePremiumPolicyType: false,
			PremiumTypeList: [],
			PremiumType: '',
			policyTotalSumInsured: '',
			policyRate: '',
			policyStartingPremium: '',
			policyAdjustments: '',
			policyAdjustmentsPremium: '',
			policyNCB: '',
			policyLocalTax: '',
			policyAdminFees: '',
			policyAddOns: '',
			policyTotalDue: '',
			policyExcess: '',
			policyCommission: '',
			policySummaryCurrency: '',

			policySummaryDetails: '',
			policyWarningMessagesReminders: [],

			contactEntityType: '',
			contactEntityId: '',

			inceptionDate: '',
			lastBindDate: '',
			isBindPolicyVisible: false, // to Bind Policy based on Inception Date
			isBindPolicy: false,
			contactPolicies: 0,
			CurrencySymbol: '',
			RenewalDate: '',
			paymentStatus: '',

			isRenewal: 0,
			isDisplaySummary: 1,

			isAwaitingDocument: 0,

			isRenewalActive: 0,
			paymentDue: 0,
			isGenerateRenewal: 0,

			isBindPopup: false,
			bindDate: moment().format('YYYY-MM-DD'),
			bindDateError: false,

			isTargetTotalDuePopup: false,
			targetTotalDue: '',
			targetTotalDueError: false,
			targetUnderWriterAmount: '',

			midTermModel: false,
			adjustmentDate: moment().format('YYYY-MM-DD'),
			adjustmentDateError: true,
			adjustmentAmount: 0,
			adjustmentAmountList: [],
			adjustmentAmountError: true,
			transactionType: 'Premium Increased',
			suggestedByEvo: '',
			policyNumber: '',
			paymentDue: 0,
			newDuePayment: 0,
			DefaultChargeAmount: 0,
			actualAmount: 0,
			actualAmountError: true,
			DefaultChargeFee: 0,
			mtdFees: 0,
			mtdFeesError: true,
			totalMtdCharges: 0,
			mtdNote: '',
			mtdNoteError: true,
		};
	}

	componentDidMount() {
		// document.body.classList.add('loading-indicator-custom');
		// setTimeout(function () {
		//   document.body.classList.remove('loading-indicator-custom');
		// }, 8000);

		let loginId = CommonConfig.loggedInUserData().LoginId;
		this.setState({ loginId: loginId })
		window.scrollTo(0, 0);
		this.getPolicyHolder();
		this.getPaymentDue();
		this.getLanguageData();
		this.getCurrencyData();
		this.getSummaryData(0);
		this.getReminderWarningMessage();
		this.getDropDownValues('POLICYTYPE', 'policyTypeList');
		this.getDropDownValues('POLICYCOUNTRY', 'countryList', 'StringMapName');
		this.getDropDownValues('RECOMPUTEPREMIUM', 'PremiumTypeList', 'StringMapName');
		this.getDropDownValues('ADJUSTMENTTYPE', 'adjustmentAmountList', 'StringMapName');
		this.getPaymentStatus();
		// this.generatePdf();
		this.isRenewalComutationActive();
		// this.toggle(0, this.props.match.params.tab);
		this.isErrorNotes();
		this.isGenerateRenewal();
	}

	toggle(tabPane, tab) {
		if (tab === undefined || tab === '' || tab === null) {
			tab = '1';
		}
		const newArray = this.state.activeTab.slice();
		newArray[tabPane] = tab
		this.setState({
			activeTab: newArray,
		});
		let policyId = this.props.match.params.id;
		this.props.history.push({
			pathname: '/PolicyDetails/' + policyId + '/' + tab,
			state: {
				id: policyId,
				tab: tab
			}
		});
	}

	initialToggle(tabPane, tab) {
		if (tab === undefined || tab === '' || tab === null) {
			tab = '1';
		}
		if (this.state.policyType == 'MarineTrade' || this.state.policyType == 'MultiVessel') {
			tab = '2';
		}
		const newArray = this.state.activeTab.slice();
		newArray[tabPane] = tab
		this.setState({
			activeTab: newArray,
		});
		let policyId = this.props.match.params.id;
		this.props.history.push({
			pathname: '/PolicyDetails/' + policyId + '/' + tab,
			state: {
				id: policyId,
				tab: tab
			}
		});
	}

	tabPane() {
		if (this.state.policyNumber != null && this.state.policyNumber != "") {
			return (
				<>
					<TabPane tabId="1">
						<Vessel CurrencySymbol={this.state.CurrencySymbol} status={this.state.status} {...this.props} />
					</TabPane>
					<TabPane tabId="2">
						<Underwriting CurrencySymbol={this.state.CurrencySymbol} status={this.state.status} PolicyCountry={this.state.country} {...this.props} />
					</TabPane>
					<TabPane tabId="3">
						<General CurrencySymbol={this.state.CurrencySymbol} status={this.state.status} {...this.props} />
					</TabPane>
					<TabPane tabId="4">
						<Endorsements CurrencySymbol={this.state.CurrencySymbol} status={this.state.status} {...this.props} />
					</TabPane>
					<TabPane tabId="5">
						<Mooring CurrencySymbol={this.state.CurrencySymbol} status={this.state.status} {...this.props} />
					</TabPane>
					<TabPane tabId="6">
						<Coverage CurrencySymbol={this.state.CurrencySymbol} status={this.state.status} {...this.props} />
					</TabPane>
					<TabPane tabId="7">
						<Account EntityType={this.state.contactEntityType} status={this.state.status} EntityId={this.state.contactEntityId} PolicyNumber={this.state.policyNumber} PolicyType={this.state.policyType} PolicyHolder={this.state.policyHolder} CurrencySymbol={this.state.CurrencySymbol} currency={this.state.currency} status={this.state.status} RenewalDate={this.state.RenewalDate} {...this.props} />
					</TabPane>
					<TabPane tabId="8">
						<Timeline CurrencySymbol={this.state.CurrencySymbol} {...this.props} />
					</TabPane>
				</>
			);
		}
	}

	getPaymentStatus() {
		const data = { policyId: this.props.match.params.id };
		api.post('api/getPaymentStatus', data).then(res => {
			if (res.success) {
				var newRes = res.data[0];
				this.setState({ paymentStatus: newRes[0].returnValue });
			}
		});
	}

	policyDataReload() {
		this.getPolicyHolder();
		this.getLanguageData();
		this.getCurrencyData();
		this.getSummaryData(0);
		this.getReminderWarningMessage();
		this.getDropDownValues('POLICYTYPE', 'policyTypeList', 'sortorder');
	}

	newPolicy() {
		this.props.history.push({
			pathname: '/NewPolicy/',
		})
	}

	newClaim() {
		toast.success("Comming Soon...");
	}

	editLanguage() {
		this.setState({ changeLanguage: !this.state.changeLanguage });
	}

	editCurrency() {
		this.setState({ changeCurrency: !this.state.changeCurrency });
	}

	editCountry() {
		this.setState({ changeCountry: !this.state.changeCountry });
	}

	editPolicyType() {
		this.setState({ changePolicyType: !this.state.changePolicyType });
	}

	getNotesbyEntityTypeAndEntityId() {
		try {
			const data = { EntityId: this.props.match.params.id, EntityType: "Policy" };

			api.post(APIConstant.path.getNotesbyEntityTypeAndEntityId, data).then(res => {
				if (res.success) {

					this.setState({
						policyReferNotes: res.data
					});
				} else {
					console.log("else");
				}
			}).catch(err => {
				console.log("error", err);
			});
		} catch (error) {
			console.log("error", error);
		}
	}

	getActiveReferralNotes() {
		try {
			const data = { EntityId: this.props.match.params.id };

			api.post(APIConstant.path.getActiveReferralNotes, data).then(res => {
				if (res.success) {

					this.setState({
						policyReferNotes: res.data
					});
				} else {
					console.log("else");
				}
			}).catch(err => {
				console.log("error", err);
			});
		} catch (error) {
			console.log("error", error);
		}
	}

	generatePdf() {
		const data = { policyId: this.props.match.params.id };
		api.post('api/generatePdf', data).then(res => {
			if (res.success) {
				console.log(res.data[0]);
			} else {

			}
		}).catch(err => {

		});
	}

	getPolicyHolder() {
		const data = { policyId: this.props.match.params.id };
		api.post('api/getPolicyHolderDetails', data).then(res => {
			if (res.success) {
				let resdata = res.data[0];
				console.log("getPolicyHolderDetails", resdata[0]);
				this.setState({
					policyNumber: resdata[0].PolicyNumber,
					policyType: resdata[0].PolicyType,
					phone: resdata[0].CountryCode + ' ' + ((resdata[0].AreaCode == null) ? '' : resdata[0].AreaCode) + ' ' + CommonConfig.formatPhoneNumber(resdata[0].Phone),
					countryCode: resdata[0].CountryCode,
					areaCode: resdata[0].AreaCode,
					language: resdata[0].DocLang,
					languageId: resdata[0].LanguageId,
					policyHolder: resdata[0].entityname,
					email: resdata[0].EmailId,
					refrred: (res.data[0][0].IsReferred.data[0] == 0) ? false : true,
					showRefer: (res.data[0][0].IsReferred.data[0] == 0) ? false : true,
					status: resdata[0].Status,
					country: resdata[0].Country,
					currency: resdata[0].Currency,
					vesselTypeName: resdata[0].VesselTypeName,
					contactEntityId: resdata[0].EntityId,
					contactEntityType: resdata[0].EntityType,
					inceptionDate: resdata[0].InceptionDate,
					lastBindDate: resdata[0].LastBindDate,
					CurrencySymbol: resdata[0].CurrencySymbol,
					RenewalDate: resdata[0].RenewalDate,
					isAwaitingDocument: resdata[0].IsAwaitingDocument.data[0]
				});
				this.checkPolicyBind();
				// this.getNotesbyEntityTypeAndEntityId();
				this.getActiveReferralNotes();
				this.getPolicyCount();
				this.initialToggle(0, this.props.match.params.tab);
				this.getPremiumPolicyType(resdata[0].Country, 0);
				this.getTPOType();
			} else {

			}
		}).catch(err => {
			console.log('error', err);
		});
	}

	getPaymentDue() {
		try {
			let data = {
				PolicyId: this.props.match.params.id
			}
			api.post('api/getPolicyAccountList', data).then(res => {
				let accountData = res.data[0];
				console.log("getPolicyAccountList", accountData);
				if (res.success) {

					if (accountData.length) {
						var duePayment = accountData[0].Balance;
					} else {
						duePayment = 0.00;
					}
					this.setState({ paymentDue: duePayment });
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

	getLanguageData() {
		try {
			api.get(APIConstant.path.getLanguage).then(res => {
				if (res.success) {
					this.setState({ languageList: res.data });
				} else {
				}
			}).catch(err => {
			});
		} catch (error) {
		}
	}

	getCurrencyData() {
		try {
			api.get(APIConstant.path.getCurrency).then(res => {
				if (res.success) {
					this.setState({ currencyList: res.data });
				} else {
				}
			}).catch(err => {
			});
		} catch (error) {
		}
	}

	getDropDownValues(stringMapType, setStateName, orderby) {
		try {
			const data = {
				stringmaptype: stringMapType,
				orderby: orderby
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

	getSummaryData(isRenewal) {
		const data = { policyId: this.props.match.params.id, IsRenewal: isRenewal };
		api.post('api/getSummaryData', data).then(res => {
			if (res.success) {

				// let res.data[0][0] = res.data[0][0];
				var length = res.data[0].length
				var temp = length == 0 ? '' : res.data[0][0].SumInsured;
				this.setState({
					isDisplaySummary: res.data[0].length,
					computationId: length == 0 ? '' : res.data[0][0].PolicyComputationId,
					policyTotalSumInsured: length == 0 ? '' : res.data[0][0].SumInsured,
					policyRate: length == 0 ? '' : res.data[0][0].BaseRate + ' %',
					policyStartingPremium: length == 0 ? '' : res.data[0][0].StartingPremium,
					policyAdjustments: length == 0 ? '' : res.data[0][0].Adjustments,
					policyAdjustmentsPremium: length == 0 ? '' : res.data[0][0].AdjustedPremium,
					policyNCB: length == 0 ? '' : res.data[0][0].NCBDiscount,
					policyLocalTax: length == 0 ? '' : res.data[0][0].LevyTotalAmount,
					policyAdminFees: length == 0 ? '' : res.data[0][0].AdminFee,
					policyAddOns: length == 0 ? '' : res.data[0][0].AddOnCoverage != null ? res.data[0][0].AddOnCoverage : 0.00,
					policyTotalDue: length == 0 ? '' : res.data[0][0].TotalDue,
					policyExcess: length == 0 ? '' : res.data[0][0].Excess,
					policyCommission: length == 0 ? '' : res.data[0][0].GrossCommission,
					policySummaryCurrency: length == 0 ? '' : res.data[0][0].Currency,
				});
			} else {

			}
		}).catch(err => {

		});
	}

	isRenewalComutationActive() {
		const data = { policyId: this.props.match.params.id };
		api.post(APIConstant.path.isRenewalComutationActive, data).then(res => {

			if (res.success) {
				if (res.data.length != 0) {
					this.setState({ isRenewalActive: 1 });
				}
			} else {

			}
		}).catch(err => {

		});
	}

	getReminderWarningMessage() {

		const data = { PolicyId: this.props.match.params.id, CurrentUser: CommonConfig.loggedInUserId() };
		api.post('api/getReminderWarningMessage', data).then(res => {
			if (res.success) {
				this.setState({ policyWarningMessagesReminders: res.data })
			} else {

			}
		}).catch(err => {

		});
	}

	isErrorNotes() {
		const data = { PolicyId: this.props.match.params.id, CurrentUser: CommonConfig.loggedInUserId() };
		api.post('api/isErrorNotes', data).then(res => {
			console.log('isErrorNotes', res.data);
			if (res.success) {
				if (res.data.length != 0) {
					this.setState({ errorNote: res.data, showSummary: false, showWarningsMessagesReminders: true })
				} else {
					this.setState({ showWarningsMessagesReminders: false, showSummary: true })
				}
			} else {

			}
		}).catch(err => {

		});
	}

	changePolicyData(type) {
		let data = '';
		if (type === 'language') {
			data = { PolicyId: this.props.match.params.id, type: type, DocLang: this.state.language, LanguageId: this.state.languageId };
		}

		if (type === 'currency') {
			data = { PolicyId: this.props.match.params.id, type: type, Currency: this.state.currency };
		}

		if (type === 'policyType') {
			data = { PolicyId: this.props.match.params.id, type: type, PolicyType: this.state.policyType };
		}

		if (type === 'country') {
			data = { PolicyId: this.props.match.params.id, type: type, Country: this.state.country };
		}

		api.post('api/changePolicyData', data).then(res => {
			if (res.success) {
				console.log(res);
				if (type === 'country') {
					this.getPremiumPolicyType(this.state.country, 1);
				}
			} else {
			}
		}).catch(err => {

		});
	}

	showSummaryDetails(ComputaionId, ComputaionMode) {
		const data = { policyId: this.props.match.params.id, policyComputationId: this.state.computationId, mode: ComputaionMode };

		api.post('api/showSummaryDetails', data).then(res => {
			if (res.success) {
				this.setState({ policySummaryDetails: res.data[0][0].Html, showPolicySummary: true, computationId: ComputaionId });
			} else {

			}
		}).catch(err => {

		});
	}

	recomputePremium(PolicyId, isRenewal, currentUser, direct) {
		const data = { policyId: PolicyId, IsRenewal: isRenewal, CurrentUser: currentUser };
		api.post('api/recomputePremium', data).then(res => {

			if (res.success) {
				if (CommonConfig.isEmpty(res.data.returnValue)) {
					toast.success("Premium was recalculated successfully");
					if (direct) {
						setTimeout(() => {
							window.location.reload();
						}, 2000);
					}
					this.getSummaryData(this.state.isRenewal);
					this.isRenewalComutationActive();
				}
				else {
					toast.error("There was an error while calculating the premium. " + res.data.returnValue);
				}
			} else {
				console.log('error');
			}
		}).catch(err => {

		});
	}

	// ProceedWithCalculation() {
	//   const data = { computationId: this.state.computationId, CurrentUser: CommonConfig.loggedInUserId() };
	//   api.post('api/ProceedWithCalculation', data).then(res => {

	//     if (res.success) {
	//       if (CommonConfig.isEmpty(res.data.returnValue)) {
	//         this.setState({ computationId: res.data.computationId, policySummaryDetails: '', showPolicySummary: false });
	//         toast.success("Calculation Commited Successfully");
	//       }
	//       else {
	//         toast.error("There was an error while calculating the premium");
	//       }
	//     } else {
	//       console.log('error');
	//     }
	//   }).catch(err => {

	//   });
	// }

	bindPolicy() {
		this.setState({ isBindPopup: true, bindDateError: false });
	}

	runBindPolicy() {

		if (this.state.bindDateError) {
			toast.error('Please enter Binder Date.');
			return false;
		}

		const data = {
			policyId: this.props.match.params.id,
			IsReferred: 0,
			bindDate: this.state.bindDate,
			CurrentUser: CommonConfig.loggedInUserId()
		};
		api.post('api/bindPolicy', data).then(res => {
			console.log("bindPolicy-i-i-i-i-i", res);
			if (res.success) {
				if (CommonConfig.isEmpty(res.data.returnValue)) {
					toast.success("Policy was Bound Successfully");
					setTimeout(() => {
						window.location.reload();
					}, 2000);
				}
				else {
					toast.error(res.data.returnValue);
				}
			} else {
				console.log('error');
			}
		}).catch(err => {
			console.log('error', err);
		});

		this.setState({ isBindPopup: false, bindDateError: false });
	}

	cancelBindPolicy() {
		this.setState({ isBindPopup: false, bindDateError: false });
	}

	bindRenewalPolicy() {
		const data = { policyId: this.props.match.params.id, IsReferred: 1, CurrentUser: CommonConfig.loggedInUserId() };
		api.post('api/bindRenewalPolicy', data).then(res => {

			if (res.success) {
				if (CommonConfig.isEmpty(res.data.returnValue)) {
					toast.success("Policy was Bound Successfully");
					setTimeout(() => {
						window.location.reload();
					}, 2000);
				}
				else {
					toast.error(res.data.returnValue);
				}
			} else {
				console.log('error');
			}
		}).catch(err => {

		});
	}

	confirmCancelPolicy() {
		this.getCancelPolicyModelData();
		this.setState({
			midTermModel: true, modelAction: 2
		});
	}

	getCancelPolicyModelData() {
		try {
			const data = {
				PolicyId: this.props.match.params.id
			};
			api.post(APIConstant.path.getCancelPolicyModelData, data).then(res => {
				console.log('getCancelPolicyModelData', res);
				if (res.success) {
					this.setState({
						// transactionType: 'Premium Increased',
						adjustmentDate: moment().format('YYYY-MM-DD'),
						policyNumber: res.data[0].policyNumber,
						paymentDue: res.data[0].totalDue,
						newDuePayment: res.data[0].newTotalDue,
						DefaultChargeAmount: res.data[0].actualAmount,
						actualAmount: res.data[0].actualAmount,
						DefaultChargeFee: res.data[0].midTermAdjustmentFee,
						mtdFees: res.data[0].midTermAdjustmentFee,
						mtdFeesError: false,
						actualAmountError: false,
						adjustmentDateError: false
					});
					this.calculateMTDTotal();
					this.calculateNewTotalDue();

					var Increased = Number(this.state.newDuePayment) > Number(this.state.paymentDue);
					var Decreased = Number(this.state.newDuePayment) < Number(this.state.paymentDue);
					var Equal = Number(this.state.newDuePayment) == Number(this.state.paymentDue);

					console.log("endMidTerm", Increased, Decreased, Equal);

					if (Increased) {
						this.setState({ transactionType: "Premium Increased" });
					} else if (Decreased) {
						this.setState({ transactionType: "Premium Reduced" });
					} else if (Equal) {
						this.setState({ transactionType: "Premium Unchanged" });
					}

				} else {
					console.log("Else");
				}
			}).catch(err => {
				console.log("errrr", err);
			});
		} catch (error) {
			console.log("errrr", error);
		}
	}

	calculateMTDTotal() {

		setTimeout(() => {
			var tempTotal = 0;
			var tempTotal = Number(this.state.actualAmount) + Number(this.state.mtdFees);
			this.setState({ totalMtdCharges: tempTotal });
			var newTotalDue = Number(this.state.paymentDue) + tempTotal;
			this.setState({ newDuePayment: newTotalDue });
			var defaultTempTotal = 0;
			var defaultTempTotal = Number(this.state.DefaultChargeAmount) + Number(this.state.DefaultChargeFee);
			this.setState({ defaultTotal: defaultTempTotal })
		}, 1000)
	}

	calculateNewTotalDue() {

		setTimeout(() => {
			var newTotalDue = 0;
			var newTotalDue = Number(this.state.paymentDue) + Number(this.state.actualAmount) + Number(this.state.mtdFees);
			this.setState({ newDuePayment: newTotalDue });
		}, 1000);
	}

	cancelMidTermModel() {
		this.setState({
			midTermModel: false,
			mtdFees: 0,
			mtdNote: '',
			actualAmount: 0,
			adjustmentDate: moment().format('YYYY-MM-DD'),
		});
	}

	cancelPolicy() {
		if (
			this.state.mtdFeesError === false &&
			this.state.adjustmentDateError === false &&
			this.state.mtdNoteError === false
		) {
			const data = {
				PolicyId: this.props.match.params.id,
				// MidTermId: this.state.MidTermId,
				ChargeAmount: this.state.actualAmount,
				ChargeFee: this.state.mtdFees,
				DefaultChargeAmount: this.state.DefaultChargeAmount,
				DefaultChargeFee: this.state.DefaultChargeFee,
				PremiumBefore: this.state.paymentDue,
				PremiumAfter: this.state.newDuePayment.toFixed(2),

				Currency: this.state.currency,
				AdjustmentType: this.state.transactionType,
				AdjustmentDate: this.state.adjustmentDate,
				Note: this.state.mtdNote,
				// Levy: this.state.Levy,
				loggedInUserId: CommonConfig.loggedInUserId(),
				languageId: this.state.languageId,
				Difference: this.state.totalMtdCharges.toFixed(2),
			}
			console.log('spCancelPolicy',data);
			
			api.post(APIConstant.path.cancelPolicy, data).then(res => {
				console.log('spCancelPolicy',res);
				if (res.success) {
					if (CommonConfig.isEmpty(res.data.returnValue)) {
						this.setState({ midTermModel: false })
						toast.success("Policy was canceled Successfully");
						setTimeout(() => {
							window.location.reload();
						}, 1500);
					}
					else {
						toast.error(res.data.returnValue);
					}
				} else {
					console.log('error');
				}
			}).catch(err => {

			});
		} else {
			if (this.state.actualAmountError != false) {
				toast.error("Please enter actual amount")
				return;
			}
			if (this.state.mtdFeesError != false) {
				toast.error("Please enter adjutment fees")
				return;
			}
			if (this.state.adjustmentDateError != false) {
				toast.error("Please enter Cancel Policy date")
				return;
			}
			if (this.state.mtdNoteError != false) {
				toast.error("Please enter note")
				return;
			}
		}
	}

	isGenerateRenewal() {
		const data = { policyId: this.props.match.params.id };
		api.post(APIConstant.path.isGenerateRenewal, data).then(res => {
			console.log('isGenerateRenewal', res.data[0].returnValue);
			if (res.success) {
				if (!CommonConfig.isEmpty(res.data[0].returnValue) && res.data[0].returnValue != 0) {
					console.log('res.data[0].returnValue', res.data[0].returnValue);
					this.setState({ isGenerateRenewal: res.data[0].returnValue, PremiumType: 'Renewal', isRenewal: 1 })
					this.getSummaryData(1);
				}
			} else {
				console.log('error');
			}
		}).catch(err => {

		});
	}

	generateRenewal() {
		const data = {
			policyId: this.props.match.params.id,
			isRenewal: 1,
			currentUser: CommonConfig.loggedInUserId()
		};
		api.post(APIConstant.path.generateRenewal, data).then(res => {
			console.log('generateRenewal', res.data[0].returnValue);
			if (res.success) {
				if (CommonConfig.isEmpty(res.data[0].returnValue)) {
					// DOC generate logic
					var docData1 = {
						policyId: this.props.match.params.id,
						processType: 'Renewal',
						isDocumentGenerateAllow: 1
					}
					api.post('api/generateDocument', docData1).then(res => {

						if (res.success) {
							toast.success("Renewal generated successfully");
							setTimeout(() => {
								window.location.reload();
							}, 1000);
						} else {
							toast.error(res.message);
						}
					}).catch(err => {
						console.log("api/generateProcessDocument > Error");
					});
				}
				else {
					toast.error(res.data[0].returnValue);
				}
			} else {
				console.log('error');
			}
		}).catch(err => {

		});
	}

	confirmRenewal() {

		var docData1 = {
			policyId: this.props.match.params.id,
			processType: 'ConfirmationOfRenewal',
			isDocumentGenerateAllow: 1
		}
		api.post('api/generateDocument', docData1).then(res => {

			if (res.success) {

				const data = {
					policyId: this.props.match.params.id,
					currentUser: CommonConfig.loggedInUserId()
				};
				api.post(APIConstant.path.confirmRenewal, data).then(res => {
					console.log('confirmRenewal', res);
					if (res.success) {
						if (CommonConfig.isEmpty(res.data[0].returnValue)) {
							toast.success("Renewal Confirmed Successfully");
							setTimeout(() => {
								window.location.reload();
							}, 1000);
						}
					} else {
						console.log('error');
					}
				}).catch(err => {

				});

			} else {
				toast.error(res.message);
			}
		}).catch(err => {
			console.log("api/generateProcessDocument > Error");
		});
	}

	hideModel = (e) => {
		this.setState({ policySummaryDetails: '', showPolicySummary: false });
	}

	checkPolicyBind() {
		if (this.state.status === 'Quotation') {
			this.setState({ isBindPolicyVisible: true });
		}
		if (this.state.lastBindDate == null || this.state.lastBindDate == "") {
			this.setState({ isBindPolicy: false });
		} else {
			this.setState({ isBindPolicy: true });
		}
	}

	getTPOType() {
		try {
			const data = {
				policyId: this.props.match.params.id,
			};
			api.post(APIConstant.path.getTPOType, data).then(res => {
				if (res.success) {
					this.setState({ premiumPolicyType: res.data[0].returnValue, defaultPremiumPolicyType: res.data[0].returnValue });
				} else {
				}
			}).catch(err => {
			});
		} catch (error) {
		}
	}

	getPremiumPolicyType(country, isRefresh) {
		console.log('getPremiumPolicyType',country);		
		try {
			var PremiumStringMapType = '';
			if (country == "Spain") {
				PremiumStringMapType = 'SPAINPREMIUMPOLICYTYPE';
			} else {
				PremiumStringMapType = 'PREMIUMPOLICYTYPE';
			}
			const data = {
				stringmaptype: PremiumStringMapType,
				orderby: 'sortorder'
			};
			api.post(APIConstant.path.dropdownbycode, data).then(res => {
				this.setState({ premiumPolicyTypeList: res.data});
				if (isRefresh) {
					// console.log('this.state.country', this.state.country)
					// let countryData = this.state.country == 'Spain' ? (res.data.filter(x => x.StringMapKey !== 'ThirdParty')) : (res.data.filter(x => x.StringMapKey !== 'Basica' && x.StringMapKey !== 'Extra'));

					// console.log('this.state.country', countryData);

					this.setState({ country: country, changeCountry: false });
					this.autoBinderByCountry(this.state.country);				
				} else {
				}
			}).catch(err => {
			});
		} catch (error) {
		}
	}

	autoBinderByCountry(country) {
		try {
			const data = {
				PolicyId: this.props.match.params.id,
				Country: country,
				CurrentUser: CommonConfig.loggedInUserId()
			};
			console.log('autoBinderByCountry',data);			
			api.post(APIConstant.path.autoBinderByCountry, data).then(res => {
				if (res.success) {
					console.log('autoBinderByCountry',res);	
					const dataTwo = {
						PolicyId: this.props.match.params.id,
						type: 'country', 
						Country: country 
					};
					api.post('api/changePolicyData', dataTwo).then(responce => {
						if (responce.success) {
							console.log('changePolicyData',responce);
							setTimeout(() => {
								window.location.reload();
							}, 200);
						} else {
						}
					}).catch(err => {
					
					});
				} else {
				}
			}).catch(err => {
			});
		} catch (error) {
		}
	}

	selectPremiumPolicyType(value) {
		if (value.value == 'Comprehensive') {
			this.setState({ premiumPolicyType: value.value, comprehensivePremiumPolicyType: true });
		} else {
			this.setState({ premiumPolicyType: value.value, confirmPremiumPolicyType: true });
		}
	}

	resetPremiumPolicyType(premiumPolicyType) {
		if (premiumPolicyType == 'Comprehensive') {
			this.setState({ premiumPolicyType: this.state.defaultPremiumPolicyType, comprehensivePremiumPolicyType: false });
		} else {
			this.setState({ premiumPolicyType: this.state.defaultPremiumPolicyType, confirmPremiumPolicyType: false });
		}
	}

	setPremiumPolicyType() {
		const data = {
			policyId: this.props.match.params.id,
			PremiumPolicyType: this.state.premiumPolicyType,
			IsRenewal: this.state.isRenewal,
			CurrentUser: CommonConfig.loggedInUserId()
		};
		api.post(APIConstant.path.setPremiumPolicyType, data).then(res => {

			if (res.success) {
				if (CommonConfig.isEmpty(res.data.returnValue)) {
					toast.success("Coverage Updated Successfully");
					setTimeout(() => {
						window.location.reload();
					}, 2000);
				}
				else {
					toast.error(res.data.returnValue);
				}
			} else {
				console.log('error');
			}
		}).catch(err => {

		});
	}

	selectContainerType(value, type) {
		if (type === 'language') {
			let languageData = this.state.languageList.filter((list) => {
				return list.LanguageId == value;
			});
			this.setState({ languageId: value, language: languageData[0].Language, changeLanguage: false });
		}

		if (type === 'currency') {
			this.setState({ currency: value, changeCurrency: false });
		}

		if (type === 'policyType') {
			this.setState({ policyType: value, changePolicyType: false });
		}

		if (type === 'country') {
			this.setState({ country: value, changeCountry: false });
			
		}

		if (type === 'PremiumType') {
			var IsRenewal = '';
			if (value == 'Current') {
				IsRenewal = 0;
			} else {
				IsRenewal = 1;
			}
			this.getSummaryData(IsRenewal);
			this.setState({ isRenewal: IsRenewal, PremiumType: value });

		}

		setTimeout(() => {
			this.changePolicyData(type);
		}, 200);
	}

	redirectToPolicyList = (e) => {
		this.props.history.push({
			pathname: '/PolicyList/' + this.state.contactEntityId + '/' + this.state.contactEntityType,
			state: {
				id: this.state.contactEntityId,
				entityType: this.state.contactEntityType
			}
		});
	}

	getPolicyCount = () => {
		let data = {
			id: this.state.contactEntityId,
			entityType: this.state.contactEntityType,
		}
		api.post('api/getUserPolicyList', data).then(res => {
			if (res.data.success) {
				this.setState({ contactPolicies: res.data.data.length });
			} else {
				console.log('err');
			}
		}).catch(err => {
			console.log("error", err);
		});
	}

	redirectToNewPolicy = () => {
		this.props.history.push({
			pathname: '/CreatePolicy/' + this.state.contactEntityId,
			state: {
				id: this.state.contactEntityId
			}
		});
	}

	// selectType(value, type) {
	// 	if (type === 'language') {
	// 		let languageData = this.state.languageList.filter((list) => {
	// 			return list.LanguageId == value;
	// 		});
	// 		this.setState({ languageId: value, language: languageData[0].Language, changeLanguage: false });
	// 	}
	// 	if (type === 'currency') {
	// 		this.setState({ currency: value, changeCurrency: false });
	// 	}
	// 	if (type === 'policyType') {
	// 		this.setState({ policyType: value, changePolicyType: false });
	// 	}
	// 	setTimeout(() => {
	// 		this.changePolicyData(type);
	// 	}, 200);
	// }

	handleChange = (e) => {

		this.setState({ [e.target.name]: e.target.value });

		if (e.target.name === 'refrred') {

			if (e.target.checked) {
				this.setState({ refrred: e.target.checked, refrredError: false });
			} else {
				this.setState({ refrred: e.target.checked, refrredError: true });
			}
			var refer = (e.target.checked ? 1 : 0);
			let data = {
				policyId: this.props.match.params.id,
				CurrentUser: CommonConfig.loggedInUserId(),
				IsReffer: refer
			}
			api.post('api/alterReferralFlag', data).then(res => {
				if (res.success) {
					this.setState({ refrred: res.data.returnValue });
					window.location.reload();
				} else {
					console.log('err');
				}
			}).catch(err => {
				console.log("error", err);
			});
		}

		if (e.target.name === 'bindDate') {
			console.log('bindDate');
			if (CommonConfig.isEmpty(e.target.value)) {
				this.setState({ bindDateError: true });
				this.show("bindDate", true, "bindDateError", "Please enter Bind Date");
			} else {
				this.setState({ bindDateError: false, bindDate: e.target.value });
				this.show("bindDate", false, "bindDateError", "");
			}
		}

		if (e.target.name === 'targetTotalDue') {

			if (CommonConfig.isEmpty(e.target.value) || !CommonConfig.RegExp.decimalWithOne.test(e.target.value)) {
				this.setState({ targetTotalDueError: true });
				this.show("targetTotalDue", true, "targetTotalDueError", "Please enter Target Total Due.");
			} else {
				this.setState({ targetTotalDueError: false, targetTotalDue: e.target.value });
				this.show("targetTotalDue", false, "targetTotalDueError", "");
			}
		}

		if (e.target.name === 'mtdNote') {
			if (e.target.value === '' || e.target.value === null) {
				this.setState({ mtdNoteError: true });
				this.show("mtdNote", true);
			} else {
				if (!CommonConfig.RegExp.alphaNumeric.test(e.target.value)) {
					this.setState({ mtdNoteError: true });
					this.show("mtdNote", true);
				} else {
					this.setState({ mtdNoteError: false, mtdNote: e.target.value });
					this.show("mtdNote", false);
				}
			}
		}

		if (e.target.name === 'adjustmentDate') {
			if (e.target.value === '' || e.target.value === null) {
				this.setState({ adjustmentDateError: true });
				this.show("adjustmentDate", true);
			} else {
				this.setState({ adjustmentDateError: false, adjustmentDate: e.target.value });
				this.show("adjustmentDate", false);
			}
		}

	}

	handleCancelModelChanges = (e) => {

		this.setState({ [e.target.name]: e.target.value });

		if (e.target.name === 'mtdFees') {
			if (e.target.value === '' || e.target.value === null) {
				this.setState({ mtdFeesError: true });
				this.show("mtdFees", true);
			} else {
				if (!CommonConfig.RegExp.decimalWithNegative.test(e.target.value)) {
					this.setState({ mtdFeesError: true });
					this.show("mtdFees", true);
				} else {
					this.setState({ mtdFeesError: false, mtdFees: e.target.value });
					this.show("mtdFees", false);
				}
			}
		}

		if (e.target.name === 'actualAmount') {
			if (e.target.value === '' || e.target.value === null) {
				this.setState({ actualAmountError: true });
				this.show("actualAmount", true);
			} else {
				if (!CommonConfig.RegExp.decimalWithNegative.test(e.target.value)) {
					this.setState({ actualAmountError: true });
					this.show("actualAmount", true);
				} else {
					this.setState({ actualAmountError: false, actualAmount: e.target.value });
					this.show("actualAmount", false);
				}
			}
		}

		this.calculateMTDTotal();
		this.calculateNewTotalDue();
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

	showTargetTotalDuePopup() {
		this.setState({ targetUnderWriterAmount: '', isTargetTotalDuePopup: true });
	}
	hideTargetTotalDuePopup() {
		this.setState({ isTargetTotalDuePopup: false, targetUnderWriterAmount: '' });
	}

	getUnderwriterAmount() {
		try {
			if (this.state.targetTotalDueError == false) {

				let data = {
					PolicyId: this.props.match.params.id,
					TargetAmount: this.state.targetTotalDue,
					IsRenewal: this.state.isRenewal
				};
				api.post('api/getUnderwriterAmount', data).then(res => {
					console.log("getUnderwriterAmount-----", res);
					if (res.data[0].length) {
						this.setState({ targetUnderWriterAmount: res.data[0][0].UnderwriterAmount });
					} else {
						console.log("error", res);
					}
				}).catch(error => {
					console.log("error", error);
				});
			} else {

			}
		} catch (error) {
			console.log("error", error);
		}
	}

	render() {
		const { t } = this.props;

		var header = <div>
			<Row>
				{(this.state.showRefer) ?
					(<Col md="12">
						<div className="policy-warning">
							{this.state.policyReferNotes.map((ct, i) => {
								return (<div><span style={{ fontSize: 18 }}>*</span><span style={{ marginRight: 15 }}>{ct.NoteText}</span></div>)
							})
							}
						</div>
					</Col>
					) : (null)}
				{(this.state.status == 'Declined') ?
					(<Col md="12" style={{ textAlign: "center", color: "red", fontSize: 15 }}>
						{t("policyDetails:PolicyisDeclinedbytheSystem")}
					</Col>
					) : (null)}

				<Col xs="12" md="12">
					<Row>
						<Col md="2">
							<div className="policy-box">
								<p>{t("policyDetails:Policy")}</p>
								<span>{this.state.policyNumber}</span>
							</div>
						</Col>
						<Col md="6">
							<div className="policy-box">
								<p>{this.state.vesselTypeName}</p>
								<div className="qt-status">
									{(this.state.status == 'Lapsed' || this.state.status == 'Cancel' || this.state.status == 'Canceled') ? (
										<p className="pl-status badge badge-danger">{this.state.status}</p>
									) : (
											<p className="pl-status badge badge-primary">{this.state.status}</p>
										)}

									{(this.state.paymentStatus == 'PAID')
										?
										<div>
											<p className="pl-status badge badge-success">{this.state.paymentStatus}</p>
											<p className="pl-status badge badge-primary">Due: {<i className={this.state.CurrencySymbol} ></i>}{this.state.paymentDue}</p>
										</div>
										:
										(this.state.paymentStatus == 'UNPAID')
											?
											<div>
												<p className="pl-status badge badge-danger">{this.state.paymentStatus}</p>
												<p className="pl-status badge badge-primary">Due: {<i className={this.state.CurrencySymbol} ></i>}{this.state.paymentDue}</p>
											</div>
											:
											(null)}
									{(this.state.refrred) ?
										(<p className="pl-status badge badge-danger">{t("policyDetails:Referred")}</p>)
										: (null)}
									{(this.state.isAwaitingDocument) ?
										(<p className="pl-status badge badge-danger">{t("policyDetails:IsAwaitingDocument")}</p>)
										: (null)}
								</div>
								<div className="pl-inner">
									<label>
										{t("policyDetails:Refer")}
										<Input type="checkbox" name="refrred" id="refrred" onChange={(e) => this.handleChange(e)} value={this.state.refrred} checked={this.state.refrred == true ? true : false} value={this.state.refrred} style={{ marginLeft: "10px" }} disabled={CommonConfig.ShowHideActionOnPolicyStatus(this.state.status) ? (false) : (true)}>
										</Input>
									</label>
								</div>
							</div>
						</Col>

						<Col md="2">
							<div className="policy-box">
								<p>{t("policyDetails:Policies")}</p>
								<span onClick={(e) => this.redirectToPolicyList()} title={t("policyDetails:Policies")} style={{ cursor: "pointer", backgroundColor: "#008c9a", color: "#ffffff", padding: "1px 5px", borderRadius: 5 }}>
									{this.state.contactPolicies}
								</span>
							</div>
						</Col>
						<Col md="2" style={{ paddingLeft: 0 }}>
							<div className="policy-box">
								<p>{t("policyDetails:Claims")}</p>
								<span>0</span>
							</div>
						</Col>
					</Row>

					<Row>
						<Col md="3">
							<div className="policy-box">
								<p>{t("policyDetails:PolicyHolder")}</p>
								<span>{this.state.policyHolder}</span>
							</div>
						</Col>
						<Col md="3">
							<div className="policy-box">
								<p>{t("policyDetails:Email")}</p>
								<span>{this.state.email}</span>
							</div>
						</Col>
						<Col md="3">
							<div className="policy-box">
								<p>{t("policyDetails:Phone")}</p>
								<span>{this.state.phone}</span>
							</div>
						</Col>
						<Col md="3">
							<div className="policy-box">
								<p> {t("policyDetails:Country")} </p>
								<div className="pl-inner">
									{(this.state.changeCountry) ? (
										<Input style={{ display: "inline-block", width: "auto", marginLeft: 10 }} type="select" name="country" id="country" onChange={(e) =>this.getPremiumPolicyType(e.target.value, 1)/* this.selectContainerType(e.target.value, 'country')*/} value={this.state.country}>											{
												this.state.countryList.map((ct, i) => {
													return (<option value={ct.label}>{ct.label}</option>)
												})
											}
										</Input>
									) : (
											<span style={{ marginLeft: 10 }}>{this.state.country}</span>
										)}
									{CommonConfig.ShowHideActionOnPolicyStatus(this.state.status) ? (
										<BTN color="primary" onClick={() => this.editCountry()} title="Change Country">
											<i className="fa fa-pencil"></i>
										</BTN>
									) : (null)}
								</div>

							</div>
						</Col>
					</Row>

					<Row>
						<Col md="4">
							<div className="policy-box">
								<p>{t("policyDetails:PolicyType")}</p>
								<div className="pl-inner">
									{(this.state.changePolicyType) ? (
										<Input type="select" name="policyType" id="policyType" onChange={(e) => this.selectContainerType(e.target.value, 'policyType')} value={this.state.policyType} style={{ width: "fit-content", display: "inline-block" }}>
											{this.state.policyTypeList.map((ct, i) => {
												return (<option value={ct.StringMapKey}>{ct.StringMapName}</option>)
											})
											}
										</Input>
									) : (
											<span>{this.state.policyType}</span>
										)}
									{(this.state.policyType != 'MarineTrade' && CommonConfig.ShowHideActionOnPolicyStatus(this.state.status)) ?
										(<BTN color="primary" onClick={() => this.editPolicyType()} title="Change Policy Type">
											<i className="fa fa-pencil"></i>
										</BTN>)
										: (null)}
								</div>
							</div>
						</Col>

						<Col md="4">
							<div className="policy-box">
								<p>
									{t("policyDetails:Language")}

									{(this.state.changeLanguage) ? (
										<Input style={{ display: "inline-block", width: "auto", marginLeft: 10 }} type="select" name="languageId" id="languageId" onChange={(e) => this.selectContainerType(e.target.value, 'language')} value={this.state.languageId}>
											{
												this.state.languageList.map((ct, i) => {
													return (<option value={ct.LanguageId}>{ct.Language}</option>)
												})
											}
										</Input>
									) : (
											<span style={{ marginLeft: 10 }}>{this.state.language}</span>
										)}
									{CommonConfig.ShowHideActionOnPolicyStatus(this.state.status) ? (
										<BTN color="primary" onClick={() => this.editLanguage()} title="Change Language">
											<i className="fa fa-pencil"></i>
										</BTN>
									) : (null)}
								</p>
							</div>
						</Col>
						<Col md="4">
							<div className="policy-box">
								<p>{t("policyDetails:Currency")}</p>
								<div className="pl-inner">
									{(this.state.changeCurrency) ? (
										<Input type="select" name="currency" id="currency" onChange={(e) => this.selectContainerType(e.target.value, 'currency')} value={this.state.currency} style={{ width: "fit-content", display: "inline-block" }}>
											{this.state.currencyList.map((ct, i) => {
												return (<option value={ct.CurrncyCode}>{ct.CurrncyCode}</option>)
											})
											}
										</Input>
									) : (
											<span>{this.state.currency}</span>
										)}

									{(CommonConfig.ShowHideActionOnPolicyStatus(this.state.status) && this.state.loginId == ('karen@yachtsman.ie' || 'matt@yachtsman.ie')) ? (
										<BTN color="primary" onClick={() => this.editCurrency()} title="Change Currency">
											<i className="fa fa-pencil"></i>
										</BTN>
									) : (null)}
								</div>
							</div>
						</Col>
					</Row>
				</Col>
			</Row>
		</div>;

		return (
			<div>
				<Row>
					<Col>
						<div>
							<Row md="12" style={{ marginBottom: "10px" }}>
								<Col md="3">
									<div className="policy-box">
										<p>Coverage Type</p>
										<span><Input type="select" name="premiumPolicyType" id="premiumPolicyType" onChange={(e) => this.selectPremiumPolicyType(e.target, 'premiumPolicyType')} value={this.state.premiumPolicyType} disabled={CommonConfig.ShowHideActionOnPolicyStatus(this.state.status) ? (false) : (true)}>
											<option value=''>Select</option>
											{this.state.premiumPolicyTypeList.map((sm, i) => {
												return (<option value={sm.StringMapKey}>{sm.StringMapName}</option>)
											})
											}
										</Input></span>
									</div>
								</Col>
								<Col md="9">
									{
										(this.state.contactEntityType != "") ? (
											<div style={{ float: "right", marginLeft: "5px", marginRight: "5px" }} >
												<SidebarNav
													contactEntityType={this.state.contactEntityType}
													contactEntityId={this.state.contactEntityId}
													NavPage="Policy" NavID={this.props.match.params.id}
													{...this.props} />
											</div>
										) : (null)
									}
									{(this.state.status === 'Active' && this.state.status !== 'Cancel')
										?
										<BTN style={{ float: "right", marginLeft: "5px", marginRight: "5px" }} color="danger" onClick={() => this.confirmCancelPolicy()}>Cancel Policy</BTN>
										:
										(null)
									}
								<BTN style={{ float: "right", marginLeft: "5px", marginRight: "5px" }} color="primary" onClick={() => this.redirectToNewPolicy()}>{t("policyDetails:New Policy")}</BTN>
									{
										CommonConfig.ShowHideActionOnPolicyStatus(this.state.status) ? (
											<BTN style={{ float: "right", marginLeft: "5px", marginRight: "5px" }} color="primary" onClick={() => this.newClaim()}>{t("policyDetails:NewClaim")}</BTN>
										) : (null)}

									{
										(this.state.isBindPolicyVisible) ? (
											<BTN style={{ float: "right", marginLeft: "5px", marginRight: "5px" }} color="primary" onClick={() => this.bindPolicy()}>{t("policyDetails:BindPolicy")}</BTN>
										) : (null)
									}
									{/* <BTN style={{ float: "right", marginLeft: "5px", marginRight: "5px" }} color="primary" onClick={() => this.policyDataReload()} title="Reload Policy Data">
										<i className="fa fa-refresh"></i>
									</BTN> */}
									{/* <BTN style={{ float: "right", marginLeft: "5px", marginRight: "5px" }} color="primary" onClick={() => this.recomputePremium(this.props.match.params.id, 0, CommonConfig.loggedInUserId(), 1)}>Recompute Premium</BTN> */}
								</Col>
							</Row>
						</div>
						<div className="input-box">
							{header}
						</div>
						{/* <Col xs="12" md="12" style={{ padding: 20 }}>

            <Row style={{ marginTop: 10 }}>
              <Col md="2">
                <h5><b>{t("policyDetails:Policy")}</b> {this.state.policyNumber}</h5>
              </Col>
              <Col md="2">
                <h5>{this.state.vesselTypeName}
                  {((this.state.status != "Active" || this.state.status != "Active") && this.state.status != '') ? (
                    <BTN style={{ margin: "10px" }} color="primary" onClick={() => this.editVesselType()} title="Change Vessel Type">
                      <i className="fa fa-pencil"></i>
                    </BTN>
                  ) : (null)}
                </h5>
              </Col>
              <Col md="1">
                <h6 style={{ backgroundColor: "#08ff08", padding: "2px 10px", width: "max-content", float: "left", marginTop: "-15px" }}>{this.state.status}</h6>
                <h6 style={{ backgroundColor: "#ffaa09", padding: "2px 10px", width: "max-content", float: "left", margin: "10px -60px" }}>UNPAID</h6>
              </Col>
              <Col md="2">
                <h5><b>{t("policyDetails:Phone")} </b> {this.state.phone}</h5>
              </Col>
              <Col md="2">
                <h5><b>{t("policyDetails:Claims")} </b> 0</h5>
              </Col>
             
            </Row>

            <Row style={{ marginTop: 10 }}>
              <Col md="4">
                <h5><b>{t("policyDetails:PolicyHolder")}</b> {this.state.policyHolder} </h5><br />
                <h6><b>{t("policyDetails:PolicyType")} </b>
                  {(this.state.changePolicyType) ? (
                    <Input type="select" name="policyType" id="policyType" onChange={(e) => this.selectType(e.target.value, 'policyType')} value={this.state.policyType} style={{ width: "fit-content", display: "inline-block" }}>
                      {this.state.policyTypeList.map((ct, i) => {
                        return (<option value={ct.StringMapName}>{ct.StringMapName}</option>)
                      })
                      }
                    </Input>
                  ) : (
                      <span>{this.state.policyType}</span>
                    )}
                  <BTN style={{ margin: "10px" }} color="primary" onClick={() => this.editPolicyType()} title="Change Policy Type">
                    <i className="fa fa-pencil"></i>
                  </BTN>
                </h6>
              </Col>
              <Col md="4">
                <h5><b>{t("policyDetails:Email")} </b> {this.state.email}</h5><br />
                <h5>{t("policyDetails:Refer")}
                  <Input type="checkbox" name="Refer" id="Refer" checked={this.state.refred == true ? true : false} value={this.state.refred} style={{ marginLeft: "10px" }}>
                  </Input></h5>
              </Col>
              <Col md="4" style={{ marginTop: "-25px" }}>
                <h6>
                  <b>{t("policyDetails:Country")}</b> {this.state.country}<br />
                  <b>{t("policyDetails:Language")} </b>
                  {(this.state.changeLanguage) ? (
                    <Input type="select" name="languageId" id="languageId" onChange={(e) => this.selectType(e.target.value, 'language')} value={this.state.languageId} style={{ width: "fit-content", display: "inline-block" }}>
                      {this.state.languageList.map((ct, i) => {
                        return (<option value={ct.LanguageId}>{ct.Language}</option>)
                      })
                      }
                    </Input>
                  ) : (
                      <span>{this.state.language}</span>
                    )}
                  <BTN style={{ margin: "10px" }} color="primary" onClick={() => this.editLanguage()} title="Change Language">
                    <i className="fa fa-pencil"></i>
                  </BTN>
                  <br />
                  <b>{t("policyDetails:Currency")} </b>
                  {(this.state.changeCurrency) ? (
                    <Input type="select" name="currency" id="currency" onChange={(e) => this.selectType(e.target.value, 'currency')} value={this.state.currency} style={{ width: "fit-content", display: "inline-block" }}>
                      {this.state.currencyList.map((ct, i) => {
                        return (<option value={ct.CurrncyCode}>{ct.CurrncyCode}</option>)
                      })
                      }
                    </Input>
                  ) : (
                      <span>{this.state.currency}</span>
                    )}
                  <BTN style={{ margin: "10px" }} color="primary" onClick={() => this.editCurrency()} title="Change Currency">
                    <i className="fa fa-pencil"></i>
                  </BTN>
                </h6>
              </Col>
            </Row> */}

						<div className="input-box" id="Summary">
							<Card className="mb-0">
								<CardHeader id="headingOne">
									<BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ showSummary: !this.state.showSummary, showWarningsMessagesReminders: false })} aria-expanded={this.state.showSummary} aria-controls="collapseOne">
										<h5 className="m-0 p-0">
											{/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}

											{t("policyDetails:Summary")}
											<i style={{ float: 'right' }} className={this.state.showSummary ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
										</h5>
									</BTN>
								</CardHeader>
								<Collapse isOpen={this.state.showSummary} data-parent="#Summary" id="collapseOne" aria-labelledby="headingOne">
									<CardBody>
										<Row>
											<Col md="2">
												<h5 style={{ color: '#008c9a' }}>{(this.state.isRenewal == 1) ? 'Renewal' : 'Current'} Calculation</h5>
											</Col>
											{(this.state.isRenewal == 1) ?
												(<Col md="10">
													<Row>
														<Col md="4">
															<p>Renewal Date: {moment(this.state.RenewalDate).format(CommonConfig.dateFormat.forDatePicker)}</p>
														</Col>
														{/* {(this.state.isBindPolicy) ?
                              (null)
                              : (<Col md="4">
                                {(this.state.isRenewalActive == 1)
                                  ? <BTN color="primary" onClick={() => this.bindRenewalPolicy()}>Bind Renewal</BTN>
                                  : (null)
                                }
                              </Col>)} */}
														{(this.state.isGenerateRenewal == 1 && CommonConfig.ShowHideActionOnPolicyStatus(this.state.status)) ?
															(<Col>
																<BTN color="primary" onClick={() => this.generateRenewal()}>Generate Renewals</BTN>
															</Col>)
															: (null)}
														{(this.state.isGenerateRenewal == 2 && CommonConfig.ShowHideActionOnPolicyStatus(this.state.status)) ?
															(<Col md='5'>
																<Row>
																	<Col md='5'>
																		<BTN color="primary" onClick={() => this.confirmRenewal()}>Confirm Renewals</BTN>
																	</Col>
																	<Col md='7'>
																		<BTN color="primary" onClick={() => this.generateRenewal()}>Regenerate Renewals</BTN>
																	</Col>
																</Row>
															</Col>)
															: (null)}

													</Row>
												</Col>)
												:
												(<Col md="4">
													<Row>
														<Col md="6">
															<p>Inception Date: {moment(this.state.inceptionDate).format(CommonConfig.dateFormat.forDatePicker)}</p>
														</Col>
														<Col md="6">
															<p>Renewal Date: {moment(this.state.RenewalDate).format(CommonConfig.dateFormat.forDatePicker)}</p>
														</Col>
													</Row>
												</Col>)}
										</Row>
										<Row>
											<Col md="2">
												<p>{t("policyDetails:Allvaluesarein")}{this.state.currency}.</p>
											</Col>
											<Col md="7">
											</Col>
											<Col md="3" style={{ textAlign: "right" }}>
												<Input type="select" name="PremiumType" id="PremiumType" onChange={(e) => this.selectContainerType(e.target.value, 'PremiumType')} value={this.state.PremiumType} style={{ width: "fit-content", display: "inline-block", marginRight: 5 }}>
													{this.state.PremiumTypeList.map((cl, i) => {
														return (<option value={cl.StringMapKey}>{cl.StringMapName}</option>)
													})
													}
												</Input>
												<em id="PremiumTypeError" className="error invalid-feedback"></em>

												{/* <BTN style={{ padding: '7px 10px', marginRight: 5 }} className="btn-sm" color="primary" onClick={() => this.recomputePremium(this.props.match.params.id, this.state.isRenewal, CommonConfig.loggedInUserId())} title="Recompute Premium">
													<i className="fa fa-calculator"></i>
												</BTN> */}

												{(this.state.isRenewal == 1) ? (

													<BTN style={{ padding: '7px 10px' }} className="btn-sm" color="primary" onClick={() => this.showSummaryDetails(this.state.computationId, 'Renewal')} title={t("policyDetails:SummaryDetail")}>
														<i className="fa fa-eye"></i>
													</BTN>
												) : (
														<BTN style={{ padding: '7px 10px' }} className="btn-sm" color="primary" onClick={() => this.showSummaryDetails(this.state.computationId, 'Current')} title={t("policyDetails:SummaryDetail")}>
															<i className="fa fa-eye"></i>
														</BTN>
													)}

											</Col>
											<Col md="4">
												<Card>
													<CardBody>
														<div className="input-box">
															<Row style={{ padding: "3px 10px" }}>
																<Col md="8">
																	<label>{t("policyDetails:TotalSumInsured")}</label>
																</Col>
																{/* <Col md="2">
                                  <BTN className="btn-sm" color="primary" onClick={() => this.showSummaryDetails("policyTotalSumInsured")} title={t("policyDetails:TotalSumInsured")}>
                                    <i className="fa fa-eye"></i>
                                  </BTN>
                                </Col> */}
																<Col md="4">
																	<label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyTotalSumInsured}</label>
																</Col>
															</Row>

															<Row style={{ padding: "3px 10px" }}>
																<Col md="8">
																	<label>{t("policyDetails:Rate")}</label>
																</Col>
																{/* <Col md="2">
                                  <BTN className="btn-sm" color="primary" onClick={() => this.showSummaryDetails("policyRate")} title={t("policyDetails:Rate")}>
                                    <i className="fa fa-eye"></i>
                                  </BTN>
                                </Col> */}
																<Col md="4">
																	<label>{this.state.policyRate}</label>
																</Col>
															</Row>

															<Row style={{ padding: "3px 10px" }}>
																<Col md="8">
																	<label>{t("policyDetails:Starting Premium")}</label>
																</Col>
																{/* <Col md="2">
                                  <BTN className="btn-sm" color="primary" onClick={() => this.showSummaryDetails("policyStartingPremium")} title={t("policyDetails:Starting Premium")}>
                                    <i className="fa fa-eye"></i>
                                  </BTN>
                                </Col> */}
																<Col md="4">
																	<label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyStartingPremium}</label>
																</Col>
															</Row>

															<Row style={{ padding: "3px 10px" }}>
																<Col md="8">
																	<label>{t("policyDetails:Adjustments")}</label>
																</Col>
																{/* <Col md="2">
                                  <BTN className="btn-sm" color="primary" onClick={() => this.showSummaryDetails("policyAdjustments")} title={t("policyDetails:Adjustments")}>
                                    <i className="fa fa-eye"></i>
                                  </BTN>
                                </Col> */}
																<Col md="4">
																	<label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyAdjustments}</label>
																</Col>
															</Row>
														</div>
													</CardBody>
												</Card>
											</Col>

											<Col md="4">
												<Card>
													<CardBody>
														<div className="input-box">
															<Row style={{ padding: "3px 10px" }}>
																<Col md="8">
																	<label>{t("policyDetails:AdjustmentsPremium")}</label>
																</Col>
																{/* <Col md="2">
                                  <BTN className="btn-sm" color="primary" onClick={() => this.showSummaryDetails("policyAdjustmentsPremium")} title={t("policyDetails:AdjustmentsPremium")}>
                                    <i className="fa fa-eye"></i>
                                  </BTN>
                                </Col> */}
																<Col md="4">
																	<label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyAdjustmentsPremium}</label>
																</Col>
															</Row>

															<Row style={{ padding: "3px 10px" }}>
																<Col md="8">
																	<label>{t("policyDetails:NoClaimBonus")}</label>
																</Col>
																{/* <Col md="2">
                                </Col> */}
																<Col md="4">
																	<label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyNCB}</label>
																</Col>
															</Row>

															<Row style={{ padding: "3px 10px" }}>
																<Col md="8">
																	<label>{t("policyDetails:LocalTax")}</label>
																</Col>
																{/* <Col md="2">
                                  <BTN className="btn-sm" color="primary" onClick={() => this.showSummaryDetails("policyLocalTax")} title={t("policyDetails:LocalTax")}>
                                    <i className="fa fa-eye"></i>
                                  </BTN>
                                </Col> */}
																<Col md="4">
																	<label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyLocalTax}</label>
																</Col>
															</Row>

															<Row style={{ padding: "3px 10px" }}>
																<Col md="8">
																	<label>{t("policyDetails:AdminFees")}</label>
																</Col>
																{/* <Col md="2">
                                  <BTN className="btn-sm" color="primary" onClick={() => this.showSummaryDetails("policyAdminFees")} title={t("policyDetails:AdminFees")}>
                                    <i className="fa fa-eye"></i>
                                  </BTN>
                                </Col> */}
																<Col md="4">
																	<label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyAdminFees}</label>
																</Col>
															</Row>
														</div>
													</CardBody>
												</Card>
											</Col>

											<Col md="4">
												<Card>
													<CardBody>
														<div className="input-box">
															<Row style={{ padding: "3px 10px" }}>
																<Col md="8">
																	<label>{t("policyDetails:AddOns")}</label>
																</Col>
																{/* <Col md="2">
                                  <BTN className="btn-sm" color="primary" onClick={() => this.showSummaryDetails("policyAddOns")} title={t("policyDetails:AddOns")}>
                                    <i className="fa fa-eye"></i>
                                  </BTN>
                                </Col> */}
																<Col md="4">
																	<label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyAddOns}</label>
																</Col>
															</Row>

															<Row style={{ padding: "3px 8px", backgroundColor: '#008c9a', borderRadius: 7 }}>
																<Col md="8">
																	<label style={{ color: '#ffffff' }}>{t("policyDetails:TotalDue")}</label>
																</Col>
																{/* <Col md="2">
                                  <BTN className="btn-sm" color="primary" onClick={() => this.showSummaryDetails("policyTotalDue")} title={t("policyDetails:TotalDue")}>
                                    <i className="fa fa-eye"></i>
                                  </BTN>
                                </Col> */}
																<Col md="3">
																	<label style={{ color: '#ffffff' }}>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyTotalDue}</label>
																</Col>
																{CommonConfig.ShowHideActionOnPolicyStatus(this.state.status) ? (
																	<Col md="1">
																		<BTN style={{ padding: '0px 0px', fontSize: 14 }} className="btn-sm" color="primary" title="Total Due Suggestion"
																			onClick={() => this.showTargetTotalDuePopup()}>
																			<i className="fa fa-calculator"></i>
																		</BTN>
																	</Col>
																) : (null)}
															</Row>

															<Row style={{ padding: "3px 10px" }}>
																<Col md="8">
																	<label>{t("policyDetails:Excess")}</label>
																</Col>
																{/* <Col md="2">
                                  <BTN className="btn-sm" className="btn-sm" color="primary" onClick={() => this.showSummaryDetails("policyExcess")} title={t("policyDetails:Excess")}>
                                    <i className="fa fa-eye"></i>
                                  </BTN>
                                </Col> */}
																<Col md="4">
																	<label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyExcess}</label>
																</Col>
															</Row>

															<Row style={{ padding: "3px 10px" }}>
																<Col md="8">
																	<label>{t("policyDetails:Commission")}</label>
																</Col>
																{/* <Col md="2">
                                  <BTN className="btn-sm" color="primary" onClick={() => this.showSummaryDetails("policyCommission")} title={t("policyDetails:Commission")}>
                                    <i className="fa fa-eye"></i>
                                  </BTN>
                                </Col> */}
																<Col md="4">
																	<label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyCommission}</label>
																</Col>
															</Row>
														</div>
													</CardBody>
												</Card>
											</Col>
										</Row>
									</CardBody>

								</Collapse>
							</Card>
						</div>

						<div className="input-box" id="WarningsMessagesReminders">
							<Card className="mb-0">
								<CardHeader id="headingOne">
									<BTN block color="link" className="text-left m-0 p-0" onClick={() => this.setState({ showWarningsMessagesReminders: !this.state.showWarningsMessagesReminders, showSummary: false })} aria-expanded={this.state.showWarningsMessagesReminders} aria-controls="collapseOne">
										<h5 className="m-0 p-0">
											{/* <i style={{marginRight: 5}} className="fa fa-address-card-o"></i> */}
											{t("policyDetails:Notes")}
											<i style={{ float: 'right' }} className={this.state.showWarningsMessagesReminders ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
										</h5>
									</BTN>
								</CardHeader>
								<Collapse isOpen={this.state.showWarningsMessagesReminders} data-parent="#WarningsMessagesReminders" id="collapseOne" aria-labelledby="headingOne">
									<CardBody>
										<Row>
											<Col md="12">
												<Card style={{ border: 0, margin: 0 }}>
													<CardBody style={{ padding: 0 }}>
														<div className="input-box">
															<Row style={{ padding: "3px 10px" }}>
																{this.state.policyWarningMessagesReminders.length ? (
																	<div>
																		{this.state.policyWarningMessagesReminders.map((ct, i) => {
																			return (
																				<Col md="12">
																					<h5>
																						{ct.NotificationType == "Warning" ? (
																							<i className="fa fa-exclamation-triangle" title="Warning" style={{ marginRight: 10, color: "#FFCC00" }}></i>
																						) : ct.NotificationType == "Reminder" ? (
																							<i className="fa fa-bell" title="Reminder" style={{ marginRight: 10 }}></i>
																						) : ct.NotificationType == "Message" ? (
																							<i className="fa fa-commenting" title="Message" style={{ marginRight: 10 }}></i>
																						) : (null)}
																						{ct.IsImportant.data[0] == 1 ? (
																							<i className="fa fa-exclamation-circle" title="Important" style={{ marginRight: 10, color: "#ec0606" }}></i>
																						) : (null)}
																						<span>{ct.NotificationText}</span>
																					</h5>
																				</Col>
																			)
																		})
																		}
																	</div>



																) : (null)}
																{this.state.errorNote.length ? (
																	<div>
																		{this.state.errorNote.map((ct, i) => {
																			return (
																				<Col md="12">
																					<ul style={{ listStyle: "none" }}>
																						<li style={{ color: 'red' }}><i style={{ paddingRight: 10 }} className='fa fa-anchor'></i>{ct.NoteText}</li>
																					</ul>
																				</Col>
																			)
																		})
																		}
																	</div>
																) : (null)}
															</Row>
														</div>
													</CardBody>
												</Card>
											</Col>
										</Row>
									</CardBody>
								</Collapse>
							</Card>
						</div>

						{this.state.showPolicySummary ? (
							<Modal isOpen={true} className="policydetail_modal">
								<ModalHeader>
									Summary Details
                  {/* {(CommonConfig.isEmpty(this.state.computationId)) ?
                    (null) :
                    (<div style={{ position: "absolute", right: 67, top: 16, float: "right" }}>
                      <BTN className="btn-sm" color="primary" onClick={() => this.ProceedWithCalculation()} title='Proceed with calculation'>
                        Proceed with calculation
                    </BTN>
                    </div>
                    )} */}
									<a style={{ position: "absolute", right: 15, float: "right", cursor: "pointer" }} onClick={() => this.hideModel()}>
										<i class="fa fa-close"></i>
									</a>
								</ModalHeader>
								<ModalBody>
									<div dangerouslySetInnerHTML={{ __html: this.state.policySummaryDetails }}></div>
								</ModalBody>
							</Modal>
						) : (null)
						}

						{/* <Row>
              <Col>
                <Modal isOpen={this.state.primary} toggle={this.reset}
                  className={'modal-primary ' + this.props.className}>
                  <ModalHeader toggle={this.reset}>{t("masterNoClaimBonus:ModalHeading." + this.state.heading + "")}{}</ModalHeader>
                  <ModalBody>
                    <form className="form" action="#">
                      <Row style={{ marginTop: "10px" }}>
                        <Col md="6">
                          <div className="input-box">
                            <label>{t("masterNoClaimBonus:NoofYears.label")}*</label>
                            <Input type="text" name="years" id="years" onChange={e => this.handleChange(e)} placeholder={t("masterNoClaimBonus:NoofYears.placeholder")} value={this.state.years} >
                            </Input>
                            <em className="error invalid-feedback">{t("masterNoClaimBonus:NoofYears.error_blank")}</em>
                          </div>
                        </Col>
                      </Row>

                      <Row style={{ marginTop: "10px" }}>
                        <Col md="6">
                          <div className="imput-box">
                            <label>{t("masterNoClaimBonus:DiscountRate.label")}*</label>
                            <Input type="text" name="discount" id="discount" onChange={e => this.handleChange(e)} placeholder={t("masterNoClaimBonus:DiscountRate.placeholder")} value={this.state.discount} >
                            </Input>
                            <em className="error invalid-feedback">{t("masterNoClaimBonus:DiscountRate.error_blank")}</em>
                          </div>
                        </Col>
                      </Row>
                    </form>
                  </ModalBody>
                  <ModalFooter>
                    <BTN color="success" onClick={() => this.saveNoClaimBonus()}><i class="fa fa-check"></i> {t("buttons." + this.state.buttonName + "")}</BTN>{' '}
                    <BTN color="primary" onClick={() => this.reset()}><i class="fa fa-close"></i> {t("buttons.Cancel")}</BTN>
                  </ModalFooter>
                </Modal>
              </Col>
            </Row> */}


						<Row style={{ marginTop: "20px" }}>
							<Col md="12">
								<Nav tabs>
									{(this.state.policyType != 'MarineTrade' && this.state.policyType != 'MultiVessel') ?
										(<NavItem>
											<NavLink active={this.state.activeTab[0] === '1'} onClick={() => { this.toggle(0, '1'); }}>

												{t("policyDetails:Vessel")}
											</NavLink>
										</NavItem>)
										: (null)}
									<NavItem>
										<NavLink active={this.state.activeTab[0] === '2'} onClick={() => { this.toggle(0, '2'); }}>

											{t("policyDetails:Underwriting")}
										</NavLink>
									</NavItem>
									{(this.state.policyType != 'MarineTrade' && this.state.policyType != 'MultiVessel') ?
										(<NavItem>
											<NavLink active={this.state.activeTab[0] === '3'} onClick={() => { this.toggle(0, '3'); }}>

												{t("policyDetails:General")}
											</NavLink>
										</NavItem>)
										: (null)}
									{(this.state.policyType != 'MarineTrade' && this.state.policyType != 'MultiVessel') ?
										(<NavItem>
											<NavLink active={this.state.activeTab[0] === '4'} onClick={() => { this.toggle(0, '4'); }}>

												{t("policyDetails:Endorsements")}
											</NavLink>
										</NavItem>)
										: (null)}
									{(this.state.policyType != 'MarineTrade' && this.state.policyType != 'MultiVessel') ?
										(<NavItem>
											<NavLink active={this.state.activeTab[0] === '5'} onClick={() => { this.toggle(0, '5'); }}>

												{t("policyDetails:Navigation")}
											</NavLink>
										</NavItem>)
										: (null)}
									{(this.state.policyType != 'MarineTrade' && this.state.policyType != 'MultiVessel') ?
										(<NavItem>
											<NavLink active={this.state.activeTab[0] === '6'} onClick={() => { this.toggle(0, '6'); }}>

												{t("policyDetails:AddOnCoverage")}
											</NavLink>
										</NavItem>)
										: (null)}
									<NavItem>
										<NavLink active={this.state.activeTab[0] === '7'} onClick={() => { this.toggle(0, '7'); }}>

											{t("policyDetails:Account")}
										</NavLink>
									</NavItem>
									<NavItem>
										<NavLink active={this.state.activeTab[0] === '8'} onClick={() => { this.toggle(0, '8'); }}>

											{t("policyDetails:Timeline")}
										</NavLink>
									</NavItem>
								</Nav>
								<TabContent activeTab={this.state.activeTab[0]}>
									{this.tabPane()}
								</TabContent>
							</Col>





							{/* <div className="content-section implementation">
                <TabView renderActiveOnly={false}>
                  <TabPanel header="Vessel">
                    <Vessel {...this.props} />
                  </TabPanel>
                  <TabPanel header="Underwriting">
                    <Underwriting {...this.props} />
                  </TabPanel>
                  <TabPanel header="General">
                    <General {...this.props} />
                  </TabPanel>
                  <TabPanel header="Endorsements">
                    <Endorsements {...this.props} />
                  </TabPanel>
                  <TabPanel header="Mooring / Navigation">
                    <Mooring {...this.props} />
                  </TabPanel>
                  <TabPanel header="Add On Coverage">
                    <Coverage {...this.props} />
                  </TabPanel>
                  <TabPanel header="Account">
                    <Account {...this.props} />
                  </TabPanel>
                  <TabPanel header="Timeline">
                    <Timeline {...this.props} />
                  </TabPanel>
                </TabView>
              </div> */}
						</Row>

						{this.state.isBindPopup ? (
							<Modal isOpen={true} className="PolicyBindModal">
								<ModalHeader>
									Please confirm bind date to Bind Policy
                  <a style={{ position: "absolute", right: 15, float: "right", cursor: "pointer" }} onClick={() => this.cancelBindPolicy()}>
										<i class="fa fa-close"></i>
									</a>
								</ModalHeader>

								<Col style={{ margin: "20px" }}>
									<div className="input-box">
										<Row>
											<Col md="3" style={{ padding: 0 }}>
												<label> Bind Date * </label>
											</Col>
											<Col md="6">
												<div className="input-box">
													<Input type="date" name="bindDate" id="bindDate"
														placeholder="Bind Date"
														onBlur={(e) => this.handleChange(e)}
														onChange={(e) => this.handleChange(e)}
														value={this.state.bindDate}
													/>
													<em id="bindDateError" className="error invalid-feedback" ></em>
												</div>
											</Col>
										</Row>
									</div>
								</Col>

								<div style={{ margin: 20 }}>
									<Row className="pull-right" style={{ backgroundColor: "#fff", marginRight: 10 }}>
										<BTN color="success" onClick={() => this.runBindPolicy()} style={{ marginRight: "20px" }}> Bind Policy </BTN>
										<BTN color="danger" onClick={() => this.cancelBindPolicy()}> Cancel </BTN>
									</Row>
								</div>

							</Modal>
						) : (null)
						}


						{this.state.isTargetTotalDuePopup ? (
							<Modal isOpen={true} className="PolicyTargetTotalDue">
								<ModalHeader>
									<label>Compute the Underwriter Amount</label>
									<a style={{ position: "absolute", right: 15, float: "right", cursor: "pointer" }} onClick={() => this.hideTargetTotalDuePopup()}>
										<i class="fa fa-close"></i>
									</a>
								</ModalHeader>

								<Col style={{ margin: "20px" }}>
									<div className="input-box">

										<Row style={{ marginBottom: "20px" }}>
											<Col md="3" style={{ padding: 0 }}>
												<label> Total Due </label>
											</Col>
											<Col md="6">
												<label>{<i className={this.state.CurrencySymbol}></i>}{this.state.policyTotalDue}</label>
											</Col>
										</Row>

										<Row style={{ marginBottom: "20px" }}>
											<Col md="3" style={{ padding: 0 }}>
												<label> Target Total Due * </label>
											</Col>
											<Col md="6">
												<div className="input-box">
													<Input type="text" name="targetTotalDue" id="targetTotalDue"
														placeholder="Target Total Due"
														onBlur={(e) => this.handleChange(e)}
														onChange={(e) => this.handleChange(e)}
														value={this.state.targetTotalDue}
													/>
													<em id="targetTotalDueError" className="error invalid-feedback" ></em>
												</div>
											</Col>
										</Row>

										<Row>
											<Col md="3" style={{ padding: 0 }}>
												<label> Underwriter Amount </label>
											</Col>
											<Col md="6">
												{(!CommonConfig.isEmpty(this.state.targetUnderWriterAmount)) ? (
													<label>
														{<i className={this.state.CurrencySymbol}></i>}
														{this.state.targetUnderWriterAmount}
													</label>
												) : (null)}
											</Col>
										</Row>

									</div>
								</Col>

								<div style={{ margin: 20 }}>
									<Row className="pull-right" style={{ backgroundColor: "#fff", marginRight: 10 }}>
										<BTN color="success" onClick={() => this.getUnderwriterAmount()} style={{ marginRight: "20px" }}> Compute the Underwriter Amount </BTN>
										<BTN color="danger" onClick={() => this.hideTargetTotalDuePopup()}> Cancel </BTN>
									</Row>
								</div>
							</Modal>
						) : (null)}
					</Col>
				</Row>
				<Modal toggle={() => this.resetPremiumPolicyType(this.state.premiumPolicyType)} isOpen={this.state.confirmPremiumPolicyType}>
					<ModalHeader toggle={() => this.resetPremiumPolicyType(this.state.premiumPolicyType)}>
						Confirm change Coverage Type?
          			</ModalHeader>

					<ModalBody>
						<span>Are you sure you want to change Coverage type to <b>{this.state.premiumPolicyType}</b> ?</span>
					</ModalBody>

					<ModalFooter>
						<BTN color="danger" onClick={() => this.resetPremiumPolicyType(this.state.premiumPolicyType)}>
							<i className="fa fa-close"></i>
							No
						</BTN>
						<BTN color="success" onClick={() => this.setPremiumPolicyType(this.state.selectedRecord)}>
							<i className="fa fa-check"></i>
							Yes
						</BTN>
					</ModalFooter>
				</Modal>
				<Modal toggle={() => this.resetPremiumPolicyType(this.state.premiumPolicyType)} isOpen={this.state.comprehensivePremiumPolicyType}>
					<ModalHeader toggle={() => this.resetPremiumPolicyType(this.state.premiumPolicyType)}>
						Coverage Type {this.state.premiumPolicyType}
					</ModalHeader>

					<ModalBody>
						<span>Please change Vessel Type and add Sum Insured Amount to chnage the Coverage type to <b>{this.state.premiumPolicyType}</b> ?</span>
					</ModalBody>

					<ModalFooter>
						<BTN color="success" onClick={() => this.resetPremiumPolicyType(this.state.premiumPolicyType)}>
							<i className="fa fa-check"></i>
							Ok
						</BTN>
					</ModalFooter>
				</Modal>

				<Modal isOpen={this.state.midTermModel}
					className={'modal-lg modal-primary '}
				>
					<ModalHeader toggle={() => this.setState({ midTermModel: false })}>Cancel Policy</ModalHeader>
					<ModalBody>
						<Col style={{ margin: 15 }}>

							<Row>
								<Col md="3">
									<label>Policy Number</label>
								</Col>
								<Col md="3">
									<label>{this.state.policyNumber}</label>
								</Col>

								<Col md="3">
									<label>Total Due</label>
								</Col>
								<Col md="3">
									<label>{<i className={this.state.CurrencySymbol} ></i>} {this.state.paymentDue}</label>
								</Col>
							</Row>

							<Row style={{ marginTop: 10 }}>
								<Col md="3">
									<label>Adjustment Date *</label>
								</Col>
								<Col md="3">
									<Input type="date" name="adjustmentDate" id="adjustmentDate" onChange={(e) => this.handleChange(e)} value={this.state.adjustmentDate}
										min={moment().subtract(100, 'years').format('YYYY-MM-DD')}
										max={moment().format('YYYY-MM-DD')} />
									<em className="error invalid-feedback" >Please enter adjustment date</em>
								</Col>

								<Col md="3">
									<label>New Total Due</label>
								</Col>
								<Col md="3">
									<label>{<i className={this.state.CurrencySymbol} ></i>} {this.state.newDuePayment.toFixed(2)}</label>
								</Col>
							</Row>

							<Row style={{ marginTop: 30, marginLeft: 10 }}>
								<Col>
									<Row>
										{this.state.adjustmentAmountList.map((value, index) => {
											// console.log("adjustmentAmountList", value, index);
											return (
												<Col md="4">
													<Input type="radio" name="transactionType" value={value.StringMapName} onChange={() => this.onRadioBtnClick(value.StringMapName)} checked={this.state.transactionType == value.StringMapName ? true : false} /><label>{value.StringMapName}</label>
												</Col>
											)
										})}
									</Row>
								</Col>
							</Row>

							{(this.state.transactionType == 'Premium Unchanged') ? (
								null
							) : (
									<div>
										<Row style={{ marginTop: 10 }}>
											<Col md="4">
												<label></label>
											</Col>

											<Col md="2">
												<label>Suggested</label>
											</Col>

											<Col md="2">
												<label>Actual</label>
											</Col>
										</Row>

										<Row style={{ marginTop: 10 }}>
											<Col md="4">
												<label>Actual Amount</label>
											</Col>
											<Col md="2">
												<label>{<i className={this.state.CurrencySymbol} ></i>}{this.state.DefaultChargeAmount}
												</label>
											</Col>
											<Col md="2">
												<div className="input-box">
													<Input type="text" name="actualAmount" id="actualAmount" onChange={(e) => this.handleCancelModelChanges(e)} value={this.state.actualAmount}>
													</Input>
													<em className="error invalid-feedback" >Please enter Actual Amount</em>
												</div>
											</Col>
										</Row>
									</div>
								)}

							<Row style={{ marginTop: 10 }}>
								<Col md="4">
									<label>Mid Term Adjustment Fee
                        {/* {this.state.suggestedByEvo} */}
									</label>
								</Col>
								<Col md="2">
									<label>{<i className={this.state.CurrencySymbol} ></i>}{this.state.DefaultChargeFee}
									</label>
								</Col>
								<Col md="2">
									<div className="input-box">
										<Input type="text" name="mtdFees" id="mtdFees" onChange={(e) => this.handleCancelModelChanges(e)} value={this.state.mtdFees}>
										</Input>
										<em className="error invalid-feedback" >Please enter Mid Term Adjustment Fee</em>
									</div>
								</Col>
								<Col md="4">
									{(this.state.transactionType == 'Premium Unchanged') ? (
										<a href="javascript:void(0)" onClick={() => this.toggleForNoCharge('PremiumUnchanged')}>Do not charge</a>
									) : (
											null
										)}

								</Col>
							</Row>

							<Row style={{ marginTop: 10 }}>
								<Col md="4">
									<label>Total Mid Term Charges</label>
								</Col>
								<Col md="2">
									<label>{<i className={this.state.CurrencySymbol} ></i>}{this.state.defaultTotal}</label>
								</Col>
								<Col md="4">
									<label>{<i className={this.state.CurrencySymbol} ></i>}{this.state.totalMtdCharges.toFixed(2)}</label>
								</Col>
							</Row>

							<Row style={{ marginTop: 10 }}>
								<Col md="4">
									<label>Note*</label>
								</Col>
								<Col md="5">
									<div className="input-box">
										<Input type="textarea" name="mtdNote" id="mtdNote" onChange={(e) => this.handleChange(e)} value={this.state.mtdNote}>
										</Input>
										<em className="error invalid-feedback" >Please enter notes</em>
									</div>
								</Col>
							</Row>

						</Col>
					</ModalBody>
					<ModalFooter>
						<BTN color="success" onClick={() => this.cancelPolicy()}><i style={{ marginRight: "10px" }} className="fa fa-check"></i>Accept</BTN>
						<BTN style={{ marginLeft: 20 }} color="danger" onClick={() => this.cancelMidTermModel()}><i style={{ marginRight: "10px" }} className="fa fa-times"></i>Cancel</BTN>
					</ModalFooter>
				</Modal>
			</div>
		);
	}
}

export default withTranslation()(PolicyDetails);
