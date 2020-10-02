import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";
import api from "../../../utils/apiClient";
import APIConstant from "../../../utils/constants";
import { ToastContainer, toast } from "react-toastify";

class ForgotPassword extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      username: "",
      usernameError: true
    };
  }

  

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });

    if (e.target.name === "username") {
      if (e.target.value === "" || e.target.value === null) {
        this.setState({
          usernameError: true
        });
        this.show("username", true);
      } else {
        this.setState({
          usernameError: false,
          username: e.target.value
        });
        this.show("username", false);
      }
    }
  };

  show(field,condition)
  {
    if (condition) {
      document.getElementById(field).className = "form-control is-invalid";
    }
    else
    {
      document.getElementById(field).className = "form-control";
    }
  }

  onForgot() {
    if(this.state.usernameError===false){
      const form = {
        'username': this.state.username
      }

      api.post(APIConstant.path.forgotpassword, form)
      .then(res => {
        if (res.success) {
          toast.success(res.message)
          this.props.history.push('/login')
        }
        else {
          toast.error(res.message)
       }
      }).catch(err => {
          toast.error(err)
      })
     }
     else
     {
        this.show("username",this.state.usernameError)
     }
  }

  render() {
    return (
      <div>
         <ToastContainer></ToastContainer>
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form>
                    <h1>ForgotPassword</h1>
                    <p className="text-muted">Reset Password Form</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        name="username"
                        type="text"
                        id="username"
                        className=""
                        placeholder="Username"
                        autoComplete="username"
                        onChange={e => this.handleChange(e)}
                        value={this.state.username}
                      />
                    </InputGroup>
                    <Button
                      color="primary"
                      className="px-4"
                      onClick={() => this.onForgot()}
                    >
                      Submit
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      </div>
    );
  }
}

export default ForgotPassword;
