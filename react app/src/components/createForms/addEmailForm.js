import React, {Component} from 'react';
import "../../App.css"
import {
    Input, Button, Select, message
} from 'antd';
import Icon from "@ant-design/icons"
import {addAsset} from '../../services/service'

const {TextArea} = Input;

const emailProviderList = [
    {
        label: 'Gmail',
        value: 'gmail'
    },
    {
        label: 'Yahoo',
        value: 'yahoo'
    },
    {
        label: 'Other',
        value: 'other'
    },
];
const socialProviderList = [
    {
        label: 'Github',
        value: 'github'
    },
    {
        label: 'LinkedIn',
        value: 'linkedin'
    },
    {
        label: 'Stack Overflow',
        value: 'stackoverflow'
    },
    {
        label: 'Other',
        value: 'other'
    },
];
const phoneProviderList = [
    {
        label: 'Google Voice',
        value: 'google_voice'
    },
    {
        label: 'Telos',
        value: 'telos'
    },
    {
        label: 'TextNow',
        value: 'textnow'
    },
    {
        label: 'Vonage',
        value: 'vonage'
    },
    {
        label: 'Other',
        value: 'other'
    },
];
const jobBoardsProviderList = [
    {
        label: 'Dice',
        value: 'dice'
    },
    {
        label: 'Monster',
        value: 'monster'
    },
    {
        label: 'Career Builder',
        value: 'career_builder'
    },
    {
        label: 'Other',
        value: 'other'
    },
];

class addEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            owner: '',
            email: '',
            phone_number: '',
            username: '',
            password: '',
            remarks: '',
            provider: 'Other',
            type: '',
            tech: '',
            alternate_email: '',
            alternate_phone_number: '',
            form_errors: {email: '', password: '', username: ''},
            email_valid: false,
            pswd_valid: false,
            provider_valid: false,
            username_valid: false,
            form_valid: false,
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.addEmailInfo = this.addEmailInfo.bind(this);
        this.setProvider = this.setProvider.bind(this);


    }

    validateField(fieldName, value) {
        console.log(fieldName, value)
        let fieldValidationErrors = this.state.form_errors;
        let email_valid = this.state.email_valid;
        let pswd_valid = this.state.pswd_valid;
        let username_valid = this.state.username_valid;

        switch (fieldName) {
            case 'email':
                var re = /\S+@\S+\.\S+/;
                email_valid = re.test(String(value).toLowerCase())
                console.log(email_valid)
                fieldValidationErrors.email = email_valid ? '' : ' is invalid';
                break;
            case 'password':
                pswd_valid = value.length > 0;
                fieldValidationErrors.password = pswd_valid ? '' : ' is too short';
                break;
            case 'username':
                username_valid = value.length > 0;
                fieldValidationErrors.username = username_valid ? '' : ' is empty';
                break;
            default:
                break;
        }
        this.setState({
            form_errors: fieldValidationErrors,
            email_valid: email_valid,
            pswd_valid: pswd_valid,
            username_valid: username_valid,
        }, this.validateForm);
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'has-error');
    }

    validateForm() {
        this.setState({form_valid: this.state.email_valid && this.state.pswd_valid  && this.state.username_valid});
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        console.log(name, value)
        this.setState({
                [name]: value
            },
            () => {
                this.validateField(name, value)
            }
        )
    }

    addEmailInfo() {
        const body = {
            'email': this.state.email,
            'password': this.state.password,
            'username': this.state.username,
            'provider': this.state.provider,
            'remarks': this.state.remarks,
            'tech': this.state.tech,
            'alter_email': this.state.alternate_email,
            'alter_number': this.state.alternate_phone_number,
            'number': this.state.phone_number,
            'asset_type': this.props.type
        }
        console.log(body)
        if (this.state.form_valid) {
            addAsset(body)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {

                    if (status === 401) {
                        localStorage.removeItem('TOKEN');
                        localStorage.removeItem('TEAM');
                        localStorage.removeItem('ROLE');
                        localStorage.removeItem('ID');
                        localStorage.removeItem('NAME');
                        this.props.history.push('/login')
                    } else {
                        if (status === 201) {

                            message.success("Added Email")
                            this.props.addData(this.props.type,res.result,200)
                            this.props.handleClose();
                        }
                        else {
                            message.error(res.error)
                        }

                    }

                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    setProvider = (e) => {
        console.log(e)
        if(e !== undefined){
            this.setState({provider: e,provider_valid:true})
        }
        else{
            this.setState({provider: '',provider_valid:false})
        }

    }

    render() {
        let providerList=[]
        if(this.props.type === 'email'){
            providerList=emailProviderList
        }
        else if(this.props.type === 'social'){
            providerList=socialProviderList
        }
        else if(this.props.type === 'number'){
            providerList=phoneProviderList
        }
        else {
            providerList=jobBoardsProviderList
        }
        return (
            <div>
                
                <div className="row">

                    <div className="col-md-6 col-sm-6 col-xs-12">

                    <div class="emailformnew">
                    

                    <div className={`form-group ${this.errorClass(this.state.form_errors.username)}`}>
                      <label> Username: </label>
                        <Input
                        style={{width: '100%'}}
                        placeholder="Enter Username"
                        value={this.state.username}
                        onChange={this.handleChange}
                        name="username"
                    />
                        {this.state.form_errors.username.length > 0 ?
                            <span style={{color: 'red'}}>Username {this.state.form_errors.username}</span> :
                            ''
                        }
                    </div>



                     <div className={`form-group ${this.errorClass(this.state.form_errors.email)}`}>
                        <label> Email: </label>
                        <Input
                        style={{width: '100%'}}
                        placeholder="Enter Email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        name="email"
                        />

                        {this.state.form_errors.email.length > 0 ?
                            <span style={{color: 'red'}}>Email {this.state.form_errors.email}</span> :
                            ''
                        }
                    </div>

                    <div className="form-group">  
                        <label> Phone Number: </label>
                        <Input
                            style={{width: '100%'}}
                            placeholder="Enter Phone Number"
                            value={this.state.phone_number}
                            onChange={this.handleChange}
                            name="phone_number"
                          />
                        </div>

                    <div className="form-group">
                   <label> Provider:</label> <Select
                    allowClear
                    value={this.state.provider}
                    style={{width: '100%'}}
                    placeholder="Provider"
                    optionFilterProp="children"
                    onSelect={(e) => this.setProvider(e)}
                >
                    {
                        providerList.map((item, i) => (
                            <Select.Option key={i}
                                           value={item.value}>{item.label}</Select.Option>
                        ))}
                </Select>
                    {!this.state.provider_valid && this.state.provider === '' ?
                        <span style={{color: 'red'}}>Provider is empty</span> :
                        ''
                    }
                </div>

                
                </div>

                    </div>

                    <div className="col-md-6 col-sm-6 col-xs-12">
                        
                    <div class="emailformnew">

                    <div className={`form-group ${this.errorClass(this.state.form_errors.password)}`}>
                        <label> Password: </label>
                        <Input.Password
                        type="password"
                        style={{width: '100%' }}
                        placeholder="Enter Password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        name="password"
                    />
                        {this.state.form_errors.password.length > 0 ?
                            <span style={{color: 'red'}}>Password {this.state.form_errors.password}</span> :
                            ''
                        }
                    </div>


                    <div className="form-group">
                        <label> Alternate Email: </label><Input
                        style={{width: '100%'}}
                        placeholder="Enter Alternate Email"
                        value={this.state.alternate_email}
                        onChange={this.handleChange}
                        name="alternate_email"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label> Alternate Phone Number: </label><Input
                        style={{width: '100%'}}
                        placeholder="Enter Alternate Phone Number"
                        value={this.state.alternate_phone_number}
                        onChange={this.handleChange}
                        name="alternate_phone_number"
                    />

                    </div>
                        {this.props.type === 'job_board' || this.props.type === 'social'?
                        <div className="form-group">
                            <label> Technology </label><Input
                            style={{width: '100%'}}
                            placeholder="Enter Technology"
                            value={this.state.tech}
                            onChange={this.handleChange}
                            name="tech"
                        />
                        </div>
                            :null}

        
            </div>   

            </div>

        </div>


                <label> Remarks: </label> 
                <TextArea
                style={{width: '100%'}}
                autosize={{minRows: 10, maxRows: 25}}
                placeholder="Add Remarks"
                value={this.state.remarks}
                onChange={this.handleChange}
                name="remarks"
            />
                 
              <div className="emailformbutton"> 
                <Button onClick={this.addEmailInfo}>Submit</Button>
             </div>

            </div>
        )
    }
}

export default addEmail;
