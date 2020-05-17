import React, {Component} from 'react';
import "../../App.css"
import {
    Input, Button, message
} from 'antd';
import {changePswd, resetPswd} from "../../services/service";


class ResetPswd extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            email: '',
            repswd:'',
            pswd:'',
            token:'',
            emailValid: false,
            tokenValid: false,
            repswdValid: false,
            pswdValid: false,
            formErrors: {email: '',token:'',pswd:'',repswd:''},
            flag: false,
            emailInvalidString:'',
            status:null,
            correct_token:false,
            height:'auto',
            display:'block'
        }
        this.handleChange = this.handleChange.bind(this)
        this.validateField = this.validateField.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.resetPassword = this.resetPassword.bind(this)
        this.errorClass = this.errorClass.bind(this)
        this.handleEmail = this.handleEmail.bind(this)
    }
    handleEmail(event){
        console.log(event.target.name)
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
                email: value
            },
            () => {
                this.validateField(name, value)
            }
        )
    }

    handleChange(event) {
        console.log(event.target.name)
        console.log(event.target.value)
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
                [name]: value
            },
            () => {
                this.validateField(name, value)
            }
        )
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let tokenValid = this.state.tokenValid;
        let repswdValid = this.state.repswdValid;
        switch (fieldName) {
            case 'email':
                var re = /\S+@\S+\.\S+/;
                //console.log(re.test(String(value).toLowerCase()))
                if (re.test(String(value).toLowerCase())) {
                    emailValid = true
                }
                else {
                    emailValid = false
                }
                fieldValidationErrors.email = emailValid ? '' : 'is not valid';
                break;
            case 'token':
                tokenValid = value.length !== 0
                fieldValidationErrors.token = tokenValid ? '' : 'cannot be empty';
                break;
            case 'repswd':
                if(this.state.pswd === value){
                    repswdValid = true
                }
                else{
                    repswdValid = false
                }
                fieldValidationErrors.repswd = repswdValid ? '' : 'did not match';
                break;
            default:
                console.log("Employee Email validation", emailValid);
                break;
        }

        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,
            tokenValid: tokenValid,
            repswdValid: repswdValid,
        }, this.validateForm);

    };

    errorClass(error) {
        return (error.length === 0 ? '' : 'has-error');
    };

    handleSubmit(){
        const body= {
            'email': this.state.email
        }
            if(this.state.emailValid){
            resetPswd(body)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                this.setState({status :status})
                    if(status === 200){
                        this.setState({
                            height:'40px',
                            display:'none',
                            emailInvalidString:''
                        })
                    }
                    else if(status == 400){
                        this.setState({
                            emailInvalidString:'You are not an active user.'
                        })

                    }
                    else{
                        this.setState({
                            emailInvalidString:'Something is wrong.'
                        })
                    }

                })
                .catch(error => {
                    console.log(error)
                });
            }

    };

    resetPassword(){
        const body= {
            'token': this.state.token,
            'password':this.state.pswd
        }
            if(this.state.tokenValid && this.state.repswdValid){
            changePswd(body)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                console.log(res)
                    if(status === 200){
                    this.props.history.push("./login")
                    }
                    else if(status === 404 && res.status === 'notfound'){
                        this.setState({correct_token:true})
                    }
                    else{
                        message.error("Something went wrong.")
                    }

                })
                .catch(error => {
                    console.log(error)
                });
            }


    };

    render() {
        return (
            <Container-fluid>
                <div className="ResetPassmain">
          

                    <div className="ResetPass" style={{height:this.state.height}} >
                    <h2>Reset Password</h2>
                    {this.state.status !== 200 &&
                        <div className="Resetbox" style={{display:this.state.display}} >
                            <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
                                <label>
                                    Enter Email: </label>
                                    <Input placeholder="Enter your official email id" name="email" type="text" value={this.state.email}
                                        onChange={this.handleEmail}/>
                               
                                {this.state.formErrors.email.length > 0 ?
                                    <span style={{color: 'red'}}>Email {this.state.formErrors.email}</span> :
                                    ''
                                }
                            </div>
                          
                    <Button onClick={this.handleSubmit}  >Submit</Button>
                    {this.state.emailInvalidString !== ''?<span>{this.state.emailInvalidString}</span>:null}
                   </div>
                    }
                      </div>

                    {this.state.status === 200 &&
                        <div className="ResetPass2">
                            <p style={{fontWeight: '700'}}> Check your email and paste the token below.</p>
                        
                        <div className="mainboxsection">
                            <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
                            <label>
                                Token:
                                <Input  name="token" type="text" value={this.state.token}
                                       onChange={this.handleChange}/>
                            </label>
                                {this.state.correct_token ?
                                    <span style={{color: 'red'}}>Token is not correct</span>:null
                                }
                                {this.state.formErrors.token.length > 0 ?
                                    <span style={{color: 'red'}}>Token {this.state.formErrors.token}</span> :
                                    ''
                                }
                            </div>
                            {this.state.tokenValid &&
                            <div>
                                <div>
                                    <label>
                                        New Password:
                                        <Input name="pswd" type="password" value={this.state.pswd}
                                               onChange={this.handleChange}/>
                                    </label>
                                </div>
                                <div className={`form-group ${this.errorClass(this.state.formErrors.repswd)}`}>
                                    <label>
                                        Confirm New Password:
                                        <Input name="repswd" type="password" value={this.state.repswd}
                                               onChange={this.handleChange}/>
                                    </label>
                                    {this.state.formErrors.repswd.length > 0 ?
                                        <span style={{color: 'red'}}>Password {this.state.formErrors.repswd}</span> :
                                        ''
                                    }
                                </div>
                                < Button onClick={this.resetPassword} >Submit</Button>
                            </div>
                            }
                        </div>
                      </div>

                    }
                </div>
            </Container-fluid>


        );
    }
}   

export default ResetPswd;
