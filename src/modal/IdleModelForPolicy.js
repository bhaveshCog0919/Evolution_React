import React from 'react';
import {
    Button, Modal, ModalBody, ModalHeader, ModalFooter
} from "reactstrap";
var smalltime =   Number(localStorage.getItem('PolicyDetailModalTimer'))
export const IdleTimeOutModalForPolicy = ({ showModal, handleContinue, handleLogout, handleClose , remainingTime }) => {
    return (
        <Modal isOpen={showModal} onHide={handleClose}>
            <ModalHeader closeButton>
                System detected no Activity on this page. 
             </ModalHeader>
            <ModalBody> If you do not click Continue button in next {smalltime} seconds, you will be forced out to dashboard.</ModalBody>
            <ModalFooter>
                <div>
                    {/* <Button style={{ marginLeft: "10px" }} color="danger" onClick={handleClose}>Cancel</Button> */}
                    <Button style={{ marginLeft: "10px" }} color="success" onClick={handleContinue}>Continue</Button>
                </div>

            </ModalFooter>
        </Modal>
    )
}