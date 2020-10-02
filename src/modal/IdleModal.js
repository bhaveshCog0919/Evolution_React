import React from 'react';
import {
    Button, Modal, ModalBody, ModalHeader, ModalFooter
} from "reactstrap";

export const IdleTimeOutModal = ({ showModal, handleClose, handleLogout, remainingTime }) => {
    return (
        <Modal isOpen={showModal} onHide={handleClose}>
            <ModalHeader closeButton>
                Your session is about to expire in 60 seconds.
             </ModalHeader>
            <ModalBody>Please click on Stay button to continue working in this session.</ModalBody>
            <ModalFooter>
                <div>
                    <Button style={{ marginLeft: "10px" }} color="danger" onClick={handleLogout}>Logout</Button>
                    <Button style={{ marginLeft: "10px" }} color="success" onClick={handleClose}>Stay</Button>
                </div>

            </ModalFooter>
        </Modal>
    )
}