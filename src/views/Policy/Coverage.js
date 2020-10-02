import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Card, CardBody, Container, Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input, Button } from 'reactstrap';
import api from '../../utils/apiClient';
import { useTranslation, withTranslation, Trans } from 'react-i18next';

class Coverage extends Component {
   constructor() {
      super();
      this.state = {
         vesselTypeId: '',
         CoverageAvailable: [],
         CoverageAlreadyList: [],
         toggleSaveModal: false,
         toggleDeleteModal: false,
         tempdata: [],
         CurrencySymbol:'',
      }
   }

   componentDidMount() {
      if (this.props.match.params.constructor === Object && Object.keys(this.props.match.params).length !== 0) {
         this.setState({ policyStatus: this.props.status, CurrencySymbol: this.props.CurrencySymbol });
      }
      console.log("componentDidMount", this.props.CurrencySymbol);
      // this.getAddOnCoverage();
      this.getPolicyVesselType(this.props.match.params.id);
      this.setState({ PolicyId: this.props.match.params.id })
   }

   getPolicyVesselType(policyId) {
      const data = { policyId: policyId };
      api.post('api/getPolicyHolderDetails', data).then(res => {
         if (res.success) {
            this.setState({ vesselTypeId: res.data[0][0].VesselTypeId, });
            this.getPolicyAddOnCoverage();
         } else {
         }
      }).catch(err => {

      });
   }

   getPolicyAddOnCoverage() {
      let data = {
         VesselTypeId: this.state.vesselTypeId
      }

      api.post('api/getPolicyAddOnCoverage', data).then(res => {
        
         if (res.success) {

            var formattedData = [];
            for (var i = 0; i < res.data.length; i++) {
               formattedData.push({
                  id: [i + 1],
                  AddOnCoverageId: res.data[i].AddOnCoverageId,
                  policyOption: res.data[i].AddOnCoverageName,
                  premium: res.data[i].AddOnCoveragePremiumAmount,
                  feeAmount: res.data[i].AddOnCoverageFeeAmount,
                  isAdded: false,
               })
            }
            this.setState({ CoverageAvailable: formattedData });
            this.getPolicyAddedCoverage();
         } else {
         }
      }).catch(err => {

      });
   }

   getPolicyAddedCoverage() {
      let data = {
         PolicyId: this.state.PolicyId
      }

      api.post('api/getPolicyAddedCoverage', data).then(res => {
         if (res.success) {

            var formattedData = [];
            for (var i = 0; i < res.data.length; i++) {

               formattedData.push({
                  PolicyAddOnCoverageId: res.data[i].PolicyAddOnCoverageId,
                  AddOnCoverageId: res.data[i].AddOnCoverageId,
                  policyOption: res.data[i].AddOnCoverageName,
                  premium: res.data[i].AddOnCoveragePremiumAmount,
                  feeAmount: res.data[i].AddOnCoverageFeeAmount,
                  IsDefault: res.data[i].IsDefault.data[0],
                  isAdded: true,
               })

               let CoverageAvailableArray = this.state.CoverageAvailable;
               let index2 = CoverageAvailableArray.findIndex(x => x.policyOption === res.data[i].AddOnCoverageName);
               if (index2 != -1) {
                  CoverageAvailableArray[index2].isAdded = true;
                  this.setState({ CoverageAvailable: CoverageAvailableArray });
               }

            }

            this.setState({ CoverageAlreadyList: formattedData });

         } else {
         }
      }).catch(err => {

      });
   }

   // getAddOnCoverage() {
   //    api.post('api/getAddOnCoverage', {}).then(res => {
   //       if (res.success) {
   //          var formattedData = [];
   //          for (var i = 0; i < res.data.length; i++) {
   //             formattedData.push({
   //                id: [i + 1],
   //                AddOnCoverageId: res.data[i].AddOnCoverageId,
   //                policyOption: res.data[i].AddOnCoverageName,
   //                premium: res.data[i].AddOnCoveragePremiumAmount,
   //                feeAmount: res.data[i].AddOnCoverageFeeAmount,
   //                isAdded: false,
   //             })
   //          }
   //          this.setState({ CoverageAvailable: formattedData });
   //          this.getAddedCoverage();
   //       } else {

   //       }
   //    }).catch(err => {

   //    });
   // }

   // getAddedCoverage() {
   //    let data = { PolicyId: this.props.match.params.id }; //'bef076c0-2ea5-11ea-a563-fa163eb9754c' }
   //    api.post('api/getAddedCoverage', data).then(res => {
   //       if (res.success) {
   //          var formattedData = [];
   //          for (var i = 0; i < res.data.length; i++) {

   //             formattedData.push({
   //                PolicyAddOnCoverageId: res.data[i].PolicyAddOnCoverageId,
   //                AddOnCoverageId: res.data[i].AddOnCoverageId,
   //                policyOption: res.data[i].AddOnCoverageName,
   //                premium: res.data[i].AddOnCoveragePremiumAmount,
   //                feeAmount: res.data[i].AddOnCoverageFeeAmount,
   //                // IsDefault: res.data[i].IsDefault.data[0],
   //                isAdded: true,
   //             })

   //             let CoverageAvailableArray = this.state.CoverageAvailable;
   //             let index2 = CoverageAvailableArray.findIndex(x => x.policyOption === res.data[i].AddOnCoverageName);

   //             CoverageAvailableArray[index2].isAdded = true;
   //             this.setState({ CoverageAvailable: CoverageAvailableArray });
   //          }
   //          this.setState({ CoverageAlreadyList: formattedData });

   //       } else {

   //       }
   //    }).catch(err => {

   //    });
   // }

   addToListModal(data) {
      this.setState({ tempdata: data })
      this.saveModalOpen();
   }

   addToList(data, field) {
      let CoverageAlreadyArray = this.state.CoverageAlreadyList;
      let index1 = CoverageAlreadyArray.findIndex(x => x.policyOption === data.policyOption);
      if (index1 > -1) {
         CoverageAlreadyArray[index1].isAdded = true;
         this.setState({ CoverageAlreadyList: CoverageAlreadyArray })
      } else {
         var CoverageAlready = [
            {
               PolicyAddOnCoverageId: null,
               AddOnCoverageId: data.AddOnCoverageId,
               policyOption: data.policyOption,
               premium: data.premium,
               feeAmount: data.FeeAmount,
               isAdded: true,
            }
         ];

         this.setState({ CoverageAlreadyList: this.state.CoverageAlreadyList.concat(CoverageAlready) });
      }
      let CoverageAvailableArray = this.state.CoverageAvailable;
      let index2 = CoverageAvailableArray.findIndex(x => x.policyOption === data.policyOption);
      CoverageAvailableArray[index2].isAdded = true;
      this.setState({ CoverageAvailable: CoverageAvailableArray });
      this.Save(CoverageAlready);
   }

   Save = (CoverageAlready) => {
      let data = {
         CoverageAlreadyList: CoverageAlready,
         PolicyId: this.state.PolicyId,
      }
      api.post('api/addPolicyCovarage', data).then(res => {
         if (res.data.success) {
            toast.success(res.data.message);
            this.getPolicyAddedCoverage();
            this.toggleSave();
         } else {

         }
      }).catch(err => {
      });
   }

   deleteCoverageModal(data) {
      this.setState({ tempdata: data })
      this.deleteModalOpen();
   }

   deleteCoverage(data) {
      if (data.PolicyAddOnCoverageId) {
         let apiData = { PolicyAddOnCoverageId: data.PolicyAddOnCoverageId }
         api.post('api/deleteAddedCoverage', { apiData }).then(res => {
            if (res.success) {
               // toast.success('Coverage Deleted Successfully');
            } else {

            }
         }).catch(err => {

         });
      }
      let CoverageAvailableArray = this.state.CoverageAvailable;
      let index1 = CoverageAvailableArray.findIndex(x => x.policyOption === data.policyOption);
      CoverageAvailableArray[index1].isAdded = false;

      let listIndex = this.state.CoverageAlreadyList.findIndex(x => x.policyOption === data.policyOption);
      this.state.CoverageAlreadyList.splice(listIndex, 1);

      this.setState({ CoverageAvailable: CoverageAvailableArray });
      toast.success('Coverage Deleted Successfully');
      this.setState({ tempdata: data })
      this.toggleDelete();
   }

   deleteModalOpen() {
      this.setState({ toggleDeleteModal: !this.state.toggleDeleteModal });
   }

   toggleDelete = () => {
      this.setState({ toggleDeleteModal: false, tempdata: [] });
   }

   saveModalOpen() {
      this.setState({ toggleSaveModal: !this.state.toggleSaveModal });
   }

   toggleSave = () => {
      this.setState({ toggleSaveModal: false, tempdata: [] });
   }

   goBack() {
      this.props.history.push('/PolicyDetails');
   }

   render() {
      const { t, i18n } = this.props;
      const SaveButton = t("buttons.Save");
      const AddButton = t("buttons.Add");
      const EditButton = t("buttons.Edit");
      const DeleteButton = t("buttons.Delete");
      const CloseButton = t("buttons.Close");
      const BackButton = t("buttons.Back");
      const UpdateButton = t("buttons.Update");
      return (

         <div>
            <Container>
               <Row>
                  <Col md="6">
                     <span>{t("policyAddOnCoverage:AlreadyPurchased.title")}</span>
                     <Card>
                        <CardBody>
                           <div className="input-box">
                              <Row>
                                 <Col md="12">
                                    <div style={{ marginTop: 10 }} className="input-box">
                                       <table className="added-detail-table" style={{ width: "100%" }}>
                                          <thead>
                                             <tr>
                                                <th>{t("policyAddOnCoverage:AlreadyPurchased.PolicyOption")}</th>
                                                <th>{t("policyAddOnCoverage:AlreadyPurchased.Premium")}({<i className={this.props.CurrencySymbol}></i>})</th>
                                                <th>{t("policyAddOnCoverage:AlreadyPurchased.AdminFees")}({<i className={this.props.CurrencySymbol}></i>})</th>
                                                <th>{t("policyAddOnCoverage:AlreadyPurchased.Total")}({<i className={this.props.CurrencySymbol}></i>})</th>
                                                <th>{t("policyAddOnCoverage:AlreadyPurchased.Action")}</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {this.state.CoverageAlreadyList.map((ca, i) => {
                                                if (ca.isAdded) {
                                                   return (
                                                      <tr>
                                                         <td>{ca.policyOption}</td>
                                                         <td style={{ textAlign: 'right' }}>{ca.premium}</td>
                                                         <td style={{ textAlign: 'right' }}>{ca.feeAmount}</td>
                                                         <td style={{ textAlign: 'right' }}>{Number(ca.premium) + Number(ca.feeAmount)}</td>
                                                         <td style={{ textAlign: 'center' }}>
                                                         {(ca.IsDefault == 0) ?
                                                            <Button title={DeleteButton} onClick={() => this.deleteCoverageModal(ca, 'CoverageAlready')} style={{ marginLeft: 5 }} color="danger">
                                                               <i className="fa fa-trash"></i>
                                                            </Button>
                                                         : 'Default'}
                                                         </td>
                                                      </tr>
                                                   )
                                                }
                                             }
                                             )}
                                          </tbody>
                                       </table>
                                    </div>
                                 </Col>
                              </Row>
                           </div>
                        </CardBody>
                     </Card>
                  </Col>
               </Row>
               <Row>
                  <Col md="6">
                     <span>{t("policyAddOnCoverage:AvailableToPurchase.title")}</span>
                     <Card>
                        <CardBody>
                           <div className="input-box">
                              <Row>
                                 <Col md="12">
                                    <div style={{ marginTop: 10 }} className="input-box">
                                       <table className="added-detail-table" style={{ width: "100%" }}>
                                          <thead>
                                             <tr>
                                                <th>{t("policyAddOnCoverage:AvailableToPurchase.PolicyOption")}</th>
                                                <th>{t("policyAddOnCoverage:AvailableToPurchase.Premium")}({<i className={this.props.CurrencySymbol}></i>})</th>
                                                <th>{t("policyAddOnCoverage:AlreadyPurchased.AdminFees")}({<i className={this.props.CurrencySymbol}></i>})</th>
                                                <th>{t("policyAddOnCoverage:AlreadyPurchased.Total")}({<i className={this.props.CurrencySymbol}></i>})</th>
                                                <th>{t("policyAddOnCoverage:AvailableToPurchase.Action")}</th>
                                             </tr>
                                          </thead>
                                          <tbody>

                                             {this.state.CoverageAvailable.map((ca, i) => {
                                                if (!ca.isAdded) {
                                                   return (
                                                      <tr>
                                                         <td>{ca.policyOption}</td>
                                                         <td style={{ textAlign: 'right' }}>{ca.premium}</td>
                                                         <td style={{ textAlign: 'right' }}>{ca.feeAmount}</td>
                                                         <td style={{ textAlign: 'right' }}>{Number(ca.premium) + Number(ca.feeAmount)}</td>
                                                         <td style={{ textAlign: 'center' }}>
                                                            <Button title={AddButton} color="primary" onClick={() => this.addToListModal(ca, 'CoverageAvailable')}>
                                                               <i className="fa fa-plus"></i>
                                                            </Button>
                                                         </td>
                                                      </tr>
                                                   )
                                                }
                                             }
                                             )}
                                          </tbody>
                                       </table>
                                    </div>
                                 </Col>
                              </Row>
                           </div>
                        </CardBody>
                     </Card>
                  </Col>
               </Row>
            </Container>

            <Modal isOpen={this.state.toggleSaveModal} toggle={this.toggleSave}
               className={'modal-lg ' + this.props.className}>
               <ModalHeader toggle={this.toggleSave}>{t("policyAddOnCoverage:ConformationSaveModal.Header")}</ModalHeader>
               <ModalBody>
                  Are you sure you want to Add <b>{this.state.tempdata.policyOption}</b> Coverage?
               </ModalBody>
               <ModalFooter>
                  <button color="primary" onClick={() => this.addToList(this.state.tempdata)}>{t("policyAddOnCoverage:ConformationSaveModal.Approval")}</button>
                  <button color="secondary" onClick={this.toggleSave}>{t("policyAddOnCoverage:ConformationSaveModal.Reject")}</button>
               </ModalFooter>
            </Modal>

            <Modal isOpen={this.state.toggleDeleteModal} toggle={this.toggleDelete}
               className={'modal-lg ' + this.props.className}>
               <ModalHeader toggle={this.toggleDelete}>{t("policyAddOnCoverage:ConformationDeleteModal.Header")}</ModalHeader>
               <ModalBody>
                  Do you want to delete <b>{this.state.tempdata.policyOption}</b> Coverage?
               </ModalBody>
               <ModalFooter>
                  <button color="primary" onClick={() => this.deleteCoverage(this.state.tempdata)}>{t("policyAddOnCoverage:ConformationDeleteModal.Approval")}</button>
                  <button color="secondary" onClick={this.toggleDelete}>{t("policyAddOnCoverage:ConformationDeleteModal.Reject")}</button>
               </ModalFooter>
            </Modal>
         </div>
      )
   }
}

export default withTranslation()(Coverage);