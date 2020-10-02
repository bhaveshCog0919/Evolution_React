// import React from 'react';
// import ContactManagement from './views/ContactManagement/ContactManagement';
// import AddContactManagement from './views/ContactManagement/AddContactManagement';
// import Tasks from './views/ContactManagement/tasks';
// import Addtasks from './views/ContactManagement/Addtasks';
// import Notes from './views/Notes/Notes';
// import ContactNotes from './views/ContactManagement/Notes';
// import ContactDocuments from './views/ContactManagement/Documents';
// import ContactPolicy from './views/ContactManagement/Policy';

// const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));

// const routes = [
//   { path: '/', exact: true, name: 'Home'},
//   { path: '/dashboard', name: 'Dashboard', component: Dashboard },
//   { path: '/contactmanagement', name: 'ContactManagement', component: ContactManagement },
//   { path: '/addcontactmanagement', name: 'AddContactManagement', component: AddContactManagement },
//   { path: '/tasks', name: 'Tasks', component: Tasks },
//   { path: '/Addtasks', name: 'Add Tasks', component: Addtasks },
//   { path: '/notes', name: 'Notes', component: Notes },
//   { path: '/ContactNotes', name: 'Notes', component: ContactNotes },
//   { path: '/ContactPolicy', name: 'Policy', component: ContactPolicy },
//   { path: '/ContactDocuments', name: 'Documents', component: ContactDocuments },
// ];

// export default routes;



import React from 'react';
import DashboardPolicyList from './views/Dashboard/DashboardPolicyList'
import ContactManagement from './views/ContactManagement/ContactManagement';
import SearchContact from './views/ContactManagement/SearchContact';
import AddContactManagement from './views/ContactManagement/AddContactManagement';
import ContactDetails from './views/ContactManagement/ContactDetails';
import ViewContactDetails from './views/ContactManagement/ViewContactDetails';
import Tasks from './views/ContactManagement/tasks';
import Addtasks from './views/ContactManagement/Addtasks';
import Notes from './views/Notes/Notes';
import ContactNotes from './views/ContactManagement/Notes';
import ContactDocuments from './views/ContactManagement/Documents';
import ContactPolicy from './views/ContactManagement/Policy';
import AddContactPolicy from './views/ContactManagement/AddPolicy';
import PolicyDetails from './views/Policy/PolicyDetails';
import PolicyDetailsMerged from './views/Policy/PolicyDetailsMerged';
import PolicyList from './views/Policy/PolicyList';
import SearchPolicy from './views/Policy/SearchPolicy';
import Endorsements from './views/Policy/Endorsements';
import Vessel from './views/Policy/Vessel';
import Mooring from './views/Policy/Mooring';
import Timeline from './views/Policy/Timeline';
import NewPolicy from './views/Policy/New Policy/NewPolicy';
import CreatePolicy from './views/Policy/New Policy/CreatePolicy';
import GenerateQuote from './views/Policy/New Policy/GenerateQuote';
import RiskQuestionList from './views/Master/RiskQuestion/RiskQuestionList';
import MooringGuide from './views/Master/MooringGuide/mooringGuide';
import LeadMangement from './views/Master/LeadManagement/LeadManagement';
import AddMooringGuide from './views/Master/MooringGuide/AddMooringGuide';
import AddMooringZone from './views/Master/MooringZones/AddMooringZone';
import MooringZone from './views/Master/MooringZones/MooringZone';
import Endorsement from './views/Master/Endorsement/EndorsementList';
import Levy from './views/Master/Levy/Levy';
import LevyHistory from './views/Master/Levy/LevyHistory';
import NoClaimBonus from './views/Master/NoClaimBonus/NoClaimBonus';
import NoClaimBonusHistory from './views/Master/NoClaimBonus/NoClaimBonusHistory';
import BinderManage from './views/Binder/BinderManage';
import AddUpdateBinder from './views/Binder/AddUdateBinder/AddUpdateBinder';
import VesselType from './views/Master/VesselType/VesselType';
import VesselClass from './views/Master/VesselClass/VesselClass';
import Assumption from './views/Master/Assumption/Assumption';
import StringMap from './views/Master/StringMap/StringMap';
import SysConfig from './views/Master/SysConfig/SysConfig';
import BulkDocument from './views/SidebarNav/BulkDocument';
import AgedDebtorsList from './views/Reports/AgedDebtorsList';
import AgentBatch from './views/Reports/AgentBatch';
import BulkRenewals from './views/Reports/BulkRenewals';
import MigrationReport from './views/Reports/MigrationReport';
import AgentCommissionReport from './views/Reports/AgentCommissionReport';
import SMSReport from './views/Reports/SMSReport';
import EmailReport from './views/Reports/EmailReport';
import DraftPage from './views/Reports/DraftPage';

import Bordereaux from './views/Reports/PremiumBordereaux';
import SubAgentStatement from './views/Reports/SubAgentStatement';
import SubAgentPaymentReport from './views/Reports/SubAgentPaymentReport';
import SubAgentAutoStatementSummary from './views/Reports/subAgentAutoStatementSummary';
import ServiceCenterStatement from './views/Reports/ServiceCenterStatement';
import CashbookInOut from './views/Reports/CashbookInOut';
import MonitoringReport from './views/Reports/MonitoringReport';
import RiskQuestionHistory from './views/Master/RiskQuestion/RiskQuestionHistory';
import StringMapHistory from './views/Master/StringMap/StringMapHistory';
import DocumentMaster from './views/Master/Documents/Documents';
import SysConfigHistory from './views/Master/SysConfig/SysConfigHistory';
import MooringGuideHistory from './views/Master/MooringGuide/MooringGuideHistory';
import VesselClassHistory from './views/Master/VesselClass/VesselClassHistory';
import ClaimsDetail from './views/Claims/ClaimsDetail';
// import NewPolicy from './views/Policy/New Policy/newPolicy1';
// import admin from './views/Master/Admin';
import Renewal_Follow_up_Report from './views/Reports/Renewal_Follow_up_Report';
import Contact_Missing_Report from './views/Reports/Contact_Missing_Report';
import Renewal_Forecasting_Report from './views/Reports/Renewal_Forecasting_Report';
import Renewal_Not_Sent_Report from './views/Reports/Renewal_Not_Sent_Report';
import Lead_Quotation_and_newbusiness_report from './views/Reports/Lead_Quotation_and_newbusiness_report';

import TESTPage from './views/Reports/TESTPage';
import NewClaim from './views/Claims/NewClaim/NewClaim';
import ClaimList from './views/Claims/ClaimList';

const Compose = React.lazy(() => import('./views/Apps/Email/Compose'));
const Inbox = React.lazy(() => import('./views/Apps/Email/Inbox'));
const Message = React.lazy(() => import('./views/Apps/Email/Message'));
const Sent = React.lazy(() => import('./views/Apps/Email/Sent'));
const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const ChangePassword = React.lazy(() => import('./views/Pages/ChangePassword/ChangePassword'));

const routes = [
  
  { path: '/', exact: true, name: 'Home' },
  { path: '/ClaimsDetail', name: 'ClaimsDetail', component: ClaimsDetail},
  { path: '/NewClaim', name: 'NewClaim', component: NewClaim},
  { path: '/ClaimList', name: 'ClaimList', component: ClaimList},
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/DashboardPolicyList/:mode', name: 'DashboardPolicyList', component: DashboardPolicyList },
  { path: '/changePassword', name: 'Change Password', exact: true, component: ChangePassword },
  { path: '/contactList', name: 'Contact Management', component: ContactManagement },
  { path: '/SearchContact', name: 'Search Contact', component: SearchContact },
  { path: '/addContactDetails', name: 'Add New Contact', component: AddContactManagement },
  { path: '/editContactDetails/:id/:entityType', name: 'Edit Contact', component: AddContactManagement },
  { path: '/viewContactDetails/:id/:entityType', name: 'View Contact', component: ViewContactDetails },
  { path: '/tasks', name: 'Tasks', component: Tasks },
  { path: '/Addtasks', name: 'Add Tasks', component: Addtasks },
  { path: '/notes', name: 'Notes', component: Notes },
  { path: '/ContactNotes', name: 'Notes', component: ContactNotes },
  { path: '/ContactPolicy', name: 'Policy', component: ContactPolicy },
  { path: '/AddContactPolicy', name: 'Add Policy', component: AddContactPolicy },
  { path: '/ContactDocuments', name: 'Documents', component: ContactDocuments },
  { path: '/apps', name: 'Apps', component: Compose, exact: true },
  { path: '/apps/email', name: 'Email', component: Compose, exact: true },
  { path: '/apps/email/compose', name: 'Compose', component: Compose },
  { path: '/apps/email/inbox/:id', name: 'Inbox', component: Inbox },
  { path: '/apps/email/inbox', name: 'Inbox', component: Inbox },
  { path: '/apps/email/sent', name: 'Sent', component: Sent },
  { path: '/apps/email/message', name: 'Message', component: Message },
  { path: '/PolicyDetails/:id/:tab', name: 'Policy', component: PolicyDetails },
  { path: '/PolicyDetailsMerged/:id/:tab/:subTab', name: 'Policy', component: PolicyDetailsMerged },
  { path: '/PolicyList', name: 'Policy', component: PolicyList },
  { path: '/SearchPolicy', name: 'Policy', component: SearchPolicy },
  { path: '/NewPolicy', name: 'NewPolicy', component: NewPolicy },
  { path: '/CreatePolicy/:Id', name: 'CreatePolicy', component: CreatePolicy },
  { path: '/UpdatePolicy/:Id/:PolicyId', name: 'UpdatePolicy', component: CreatePolicy },
  { path: '/GenerateQuote/:Id', name: 'GenerateQuote', component: GenerateQuote },
  { path: '/Master/MooringGuide', name: 'MooringGuide', component: MooringGuide },
  { path: '/AddMooringGuide/', name: 'AddMooringGuide', component: AddMooringGuide },
  { path: '/EditMooringGuide/:Id', name: 'AddMooringGuide', component: AddMooringGuide },
  { path: '/EditMooringZone/:Id', name: 'AddMooringZone', component: AddMooringZone },
  { path: '/AddMooringZone/', name: 'AddMooringZone', component: AddMooringZone },
  { path: '/Master/MooringZone', name: 'MooringZone', component: MooringZone },
  { path: '/Master/LeadManagement', name: 'Lead Management', component: LeadMangement },
  { path: '/Master/RiskQuestion', name: 'RiskQuestionList', component: RiskQuestionList },
  { path: '/Master/RiskQuestionHistory/:Id', name: 'RiskQuestionHistory', component: RiskQuestionHistory },
  { path: '/Master/Endorsement', name: 'EndorsementList', component: Endorsement },
  { path: '/Master/RiskQuestion', name: 'RiskQuestionList', component: RiskQuestionList },
  { path: '/Master/RiskQuestionHistory/:Id', name: 'RiskQuestionHistory', component: RiskQuestionHistory },
  { path: '/Master/Endorsement', name: 'EndorsementList', component: Endorsement },
  { path: '/Master/Levy', name: 'Levy', component: Levy },
  { path: '/Master/LevyHistory/:Id', name: 'LevyHistory', component: LevyHistory },
  { path: '/Master/NoClaimBonus', name: 'NoClaimBonus', component: NoClaimBonus },
  { path: '/Master/NoClaimBonusHistory/:Id', name: 'NoClaimBonusHistory', component: NoClaimBonusHistory },
  { path: '/Master/Binder', name: 'Binder', component: BinderManage },
  { path: '/Master/AddUpdateBinder/:Id', name: 'Add Update Binder', component: AddUpdateBinder },
  { path: '/Master/AddUpdateBinder', name: 'Add Update Binder', component: AddUpdateBinder },
  { path: '/Master/VesselType/:Id', name: 'VesselType', component: VesselType },
  { path: '/Master/VesselType', name: 'VesselType', component: VesselType },
  { path: '/Master/VesselClass', name: 'VesselClass', component: VesselClass },
  { path: '/Master/VesselType/:Id', name: 'VesselType', component: VesselType },
  { path: '/Master/VesselType', name: 'VesselType', component: VesselType },
  { path: '/Master/VesselClass', name: 'VesselClass', component: VesselClass },
  { path: '/Master/VesselClassHistory/:Id', name: 'VesselClassHistory', component : VesselClassHistory },
  { path: '/Master/Assumption', name: 'Assumption', component: Assumption },
  { path: '/Master/StringMap', name: 'StringMap', component: StringMap },
  { path: '/Master/StringMapHistory/:Id', name: 'StringMapHistory', component: StringMapHistory },
  { path: '/Master/SysConfig', name: 'SysConfig', component: SysConfig },
  { path: '/Master/SysConfigHistory/:Id', name: 'SysConfigHistory', component: SysConfigHistory },
  { path: '/Master/MooringGuideHistory/:Id', name: 'MooringGuideHistory', component: MooringGuideHistory },
  { path: '/bulkdocument', name: 'BulkDocument', component: BulkDocument },
  { path: '/AgedDebtorsList', name: 'Aged Debtors List', component: AgedDebtorsList },
  { path: '/AgentBatch', name: 'Agent Statement Batch', component: AgentBatch },
  { path: '/AgentCommissionReport', name: 'Agent Commission Report', component: AgentCommissionReport },
  { path: '/bordereaux', name: 'Premium Bordereaux', component: Bordereaux },
  { path: '/subagentstatement', name: 'SubAgent Statement', component: SubAgentStatement },
  { path: '/SubAgentPaymentReport', name: 'SubAgent Payment Reportt', component: SubAgentPaymentReport },
  { path: '/SubAgentAutoStatementSummary', name: 'Sub Agent Auto Statement Summary', component: SubAgentAutoStatementSummary },
  { path: '/ServiceCenterStatement', name: 'ServiceCenter Statement', component: ServiceCenterStatement },
  { path: '/cashbook', name: 'Cashbook In/Out', component: CashbookInOut },
  { path: '/SMSReport', name: 'SMS', component: SMSReport },
  { path: '/EmailReport', name: 'SMS', component: EmailReport },
  { path: '/DraftPage', name: 'SMS', component: DraftPage },
  { path: '/MonitoringReport', name: 'Monitoring Report', component: MonitoringReport },
  { path: '/BulkRenewals', name: 'Bulk Renewals', component: BulkRenewals },
  { path: '/MigrationReport', name: 'Migration Report', component: MigrationReport },
  { path: '/Master/DocumentMaster', name: 'DocumentMaster', component: DocumentMaster },


  { path: '/TestPage', name: 'Test Page', component: TESTPage },


  { path: '/Renewal_Follow_up_Report', name: 'Renewal Follow up Report', component: Renewal_Follow_up_Report },
  { path: '/Renewal_Forecasting_Report', name: 'Renewal Forecasting Report', component: Renewal_Forecasting_Report },
  { path: '/Renewal_Not_Sent_Report', name: 'Renewal Not Sent Report', component: Renewal_Not_Sent_Report },
  { path: '/Contact_Missing_Report', name: 'Contact with missing Phone and Email', component: Contact_Missing_Report },
  { path: '/Lead_Quotation_and_newbusiness_report', name: 'Lead Quotation and newbusiness report', component: Lead_Quotation_and_newbusiness_report },
  // { path: '/CreatePolicy', name: 'New Policy', component: CreatePolicy },
  // { path: '/admin', name: 'Admin', component: admin },
];

export default routes;
