import React, { Component } from 'react';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Card, CardBody, Col, Row, Input } from 'reactstrap';
import { Button } from 'primereact/button';
import api from '../../../utils/apiClient';
import APIConstant from '../../../utils/constants';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import 'react-toastify/dist/ReactToastify.css';
import { CommonConfig } from '../../../utils/constants';

const PreviousBoatingExperinceInYearsMaster = [
   { label: '0', value: '0' },
   { label: '1', value: '1' },
   { label: '2', value: '2' },
   { label: '3', value: '3' },
   { label: '4', value: '4' },
   { label: '5', value: '5' },
   { label: '6', value: '6' },
   { label: '7', value: '7' },
   { label: '8', value: '8' },
   { label: '9', value: '9' },
   { label: '10', value: '10' },
   { label: '11', value: '11' },
   { label: '12', value: '12' },
   { label: '13', value: '13' },
   { label: '14', value: '14' },
   { label: '15', value: '15' },
   { label: '16', value: '16' },
   { label: '17', value: '17' },
   { label: '18', value: '18' },
   { label: '19', value: '19' },
   { label: '20', value: '20' },
   { label: '21', value: '21' },
   { label: '22', value: '22' },
   { label: '23', value: '23' },
   { label: '24', value: '24' },
   { label: '25', value: '25' },
   { label: '26', value: '26' },
   { label: '27', value: '27' },
   { label: '28', value: '28' },
   { label: '29', value: '29' },
   { label: '30', value: '30' },
];
const typeMaster = [
   { label: 'Type1', value: 'Type1' },
   { label: 'Type2', value: 'Type2' },
   { label: 'Type3', value: 'Type3' },
];
class NewPolicy extends Component {
   constructor(props) {
      super(props);

      this.state = {
         contactShown: '',
         filteredcontactsSingle: null,
         contactArray: [],
         contactName: '',
         contactAddr1: '',
         contactAddr2: '',
         contactAddr3: '',
         contactCity: '',
         contactState: '',
         contactCountry: '',
         contactPostalCode: '',
         contactEmail: '',
         contactPhone: '',
         contactCode: '',
         enabled: false,
         country: '',
         isEnabledPolicySetup: true,

         //Sagar
         contactShownError: true,
         PersonId: '',
         //Sagar  
      };

   }


   componentDidMount() {

   }

   show(field, condition) {
      if (condition) {
         document.getElementById(field).className = "form-control is-invalid";
      } else {
         document.getElementById(field).className = "form-control";
      }
   }


   filterSingle(e) {
      // debugger;
      let data1 = { val: e.query };
      api.post('api/getContactList', data1).then(res => {
         if (res.success) {
            console.log(res.data);

            let data2 = [];
            for (let i = 0; i < res.data.length; i++) {
               data2.push({
                  label: res.data[i].fullname + '|' + res.data[i].PhoneNumber + '|' + res.data[i].countryname,
                  value: res.data[i].PersonId + '+_+' + res.data[i].fullname + '+_+' + res.data[i].addr + '+_+' + res.data[i].City + '+_+' + res.data[i].State + '+_+' + res.data[i].countryname + '+_+' + res.data[i].PostalCode + '+_+' + res.data[i].Email + '+_+' + res.data[i].CountryCode + '+_+' + res.data[i].AreaCode + '+_+' + res.data[i].PhoneNumber + '+_+' + res.data[i].ContactCode
               });
            }
            (res.data.length) ? this.setState({ enabled: true }) : this.setState({ enabled: false });

            this.setState({ contactArray: res.data, filteredcontactsSingle: data2 });
         } else {

         }
      }).catch(err => {
         console.log("error", err);
      });
      // this.getContact();  //NewPolicy
      // let results = this.state.contactArray.filter((contact) => {
      //    return contact.label.toLowerCase().startsWith(e.query.toLowerCase());
      // });


   }

   // getContact() {

   //    const data1 = { datavalue: '' };

   //    api.post('api/getContact', data1).then(res => {
   //       if (res.success) {
   //          var data2 = [];
   //          for (var i = 0; i < res.data.length; i++)

   //             data2.push({ label: res.data[i]['entityname'] + '|' + res.data[i]['PhoneNumber'] + '|' + res.data[i].Country, value: res.data[i]['PersonId'] + '+_+' + res.data[i]['entityname'] + '+_+' + res.data[i]['AddrLine1'] + '+_+' + res.data[i]['AddrLine2'] + '+_+' + res.data[i]['AddrLine3'] + '+_+' + res.data[i]['City'] + '+_+' + res.data[i]['State'] + '+_+' + res.data[i]['Country'] + '+_+' + res.data[i]['PhoneNumber'] });
   //          this.setState({ contactArray: data2 });
   //       } else {

   //       }
   //    }).catch(err => {
   //       console.log("error", err);
   //    });
   // }

   showContactLabel(e) {
      // debugger;
      this.show("contactShown", false);
      var contact = e.value.value.split('+_+');
      this.setState({ contactShown: e.value, contactShownError: false, PersonId: contact[0] });

      this.setState({ contactName: contact[1] });
      this.setState({ contactAddr1: (contact[2] != '') ? contact[2] + ', ' : '' });
      this.setState({ contactCity: (contact[3] != '') ? contact[3] + ', ' : '' });
      this.setState({ contactState: (contact[4] != '' && contact[4] != 'undefined') ? contact[4] + ', ' : '' });
      this.setState({ contactCountry: (contact[5] != '') ? contact[5] + '' : '' });
      this.setState({ contactPostalCode: (contact[6] != '') ? ', ' + contact[6] + '' : '' });
      this.setState({ contactEmail: (contact[7] != '') ? contact[7] + '' : '' });
      this.setState({ contactPhone: (contact[10] != '') ? CommonConfig.formatPhone(contact[8], contact[9], contact[10]) : '' });
      this.setState({ contactCode: (contact[11] != '') ? ' (#' + contact[11] + ')' : '' });
      this.setState({ isEnabledPolicySetup: false })
   }

   gotoNextPage() {
      if (this.state.contactShownError === false) {
         var Id = this.state.PersonId;
         this.props.history.push({
            pathname: '/CreatePolicy/' + Id,
            state: {
               Id: Id
            }
         });
      }
      else {
         this.show("contactShown", this.state.contactShownError);
      }
   }

   showContactLabel1(e) {
      // debugger;
      (CommonConfig.isEmpty(e.value)) ? this.setState({ enabled: false }) : this.setState({ enabled: true });
      this.setState({
         contactShown: e.value,
         isEnabledPolicySetup: true,
         contactName: '',
         contactAddr1: '',
         contactAddr2: '',
         contactAddr3: '',
         contactCity: '',
         contactState: '',
         contactCountry: '',
         contactPostalCode: '',
         contactEmail: '',
         contactPhone: '',
         contactCode: ''
      });
   }


   newContact() {
      this.props.history.push({
         pathname: '/addContactDetails',
      });
   }

   render() {

      return (
         <div>
            <Row>
               <Col style={{ margin: "20px" }}>
                  <div className="input-box">
                     <Row>
                        <Col md="5" >
                           <label>Contact Name or ID</label>

                           <div className="input-box">
                              <AutoComplete value={this.state.contactShown} minLength={2} suggestions={this.state.filteredcontactsSingle} completeMethod={(e) => this.filterSingle(e)} field="label"
                                 name="contactShown" id="contactShown" size={49} placeholder="Contact Name or ID" onSelect={(e) => this.showContactLabel(e)} onChange={(e) => this.showContactLabel1(e)} />
                              <em className="error invalid-feedback"> Please select a contact </em>
                           </div>
                           <span style={{ color: "#16626C" }}>Please enter min 3-4 characters to search</span>
                        </Col>

                        <Col >
                           <div className="add-btn">
                              <i className="pi pi-search"></i> <Button type="button" icon="pi pi-plus" disabled={this.state.enabled} tooltip="Add Contact" tooltipOptions={{ position: 'bottom' }} onClick={() => this.newContact()}></Button>
                           </div>
                        </Col>
                        <Col >
                           <div className="user-info">
                              <b>{this.state.contactName}{this.state.contactCode}</b><br />
                              {this.state.contactAddr1}
                              {this.state.contactAddr2}
                              {this.state.contactAddr3}
                              {this.state.contactCity}
                              {this.state.contactState}
                              {this.state.contactCountry}
                              {this.state.contactPostalCode}<br />
                              {this.state.contactPhone}<br />
                              {this.state.contactEmail}<br /><br />
                              <Button type="button" icon="pi pi-plus" label="New Policy Setup" disabled={this.state.isEnabledPolicySetup} tooltipOptions={{ position: 'bottom' }} onClick={() => this.gotoNextPage()}></Button>
                           </div>
                        </Col>
                     </Row>
                  </div>
               </Col>
            </Row>
         </div>
      );

   }
}

export default NewPolicy;