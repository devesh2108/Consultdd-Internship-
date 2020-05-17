import React, {Component} from 'react';
import "../../App.css"
import {
    Input, Button, Tabs,message
} from 'antd';
import {editAssetData,} from '../../services/service'
const {TextArea} = Input;
const {TabPane} = Tabs;
class editEmailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            phone_number: '',
            username: '',
            password: '',
            remarks: '',
            provider: '',
            alternate_email: '',
            alternate_phone_number: '',
            tech:'',
            owner:''
        }
        this.handleChange = this.handleChange.bind(this);
        this.editEmailInfo = this.editEmailInfo.bind(this);
        this.setProvider = this.setProvider.bind(this);

    }
    componentDidMount(){
        this.setState({
            owner:this.props.assetObj.owner__full_name,
            email:this.props.assetObj.email,
            password:this.props.assetObj.password,
            phone_number:this.props.assetObj.number,
            username:this.props.assetObj.username,
            remarks:this.props.assetObj.remarks,
            provider:this.props.assetObj.provider,
            alternate_email:this.props.assetObj.alter_email,
            alternate_phone_number:this.props.assetObj.alter_number,
            tech:this.props.selected_type === 'social' || this.props.selected_type === 'job_board'?this.props.assetObj.tech :''

        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    editEmailInfo() {

        let body = {}
        if (this.props.selected_type === 'email') {
            body = {
                'password': this.state.password,
                'remarks': this.state.remarks,
                'alter_number': this.state.alternate_phone_number,
            }
        }
        else {
            body = {
                'password': this.state.password,
                'remarks': this.state.remarks,
                'tech':this.state.tech

            }
        }
        editAssetData(this.props.asset_id,body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {

                message.success("Successfully edited.")
                this.props.onUpdateChange(this.props.asset_id,this.props.selected_type,res.result)
                this.props.handleClose()

            })
            .catch(error => {
                console.log(error)
            });

    }

    setProvider = (e) => {
        this.setState({provider: e})
    }


    render() {
        return (
            <div>
                Onwer:{this.state.owner}
                {this.props.selected_type === 'email' ?
                    <div>
                        
                    <div className="row">

                    <div className="editform">

                    <div className="col-md-6 col-sm-6 col-xs-12">

                    <label> Email: </label>
                    <Input
                        style={{width: '100%', border: 0}}
                        readOnly={true}
                        value={this.state.email}
                        name="email"
                    />
                        <label> Password: </label>
                        <Input.Password
                            type="password"
                            style={{width: '100%'}}
                            placeholder="Enter Password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            name="password"
                        />
                       
                     <label> Phone Number: </label>
                     <Input
                        style={{width: '100%', border: 0}}
                        placeholder="Enter Phone Number"
                        readOnly={true}
                        value={this.state.phone_number}
                        name="phone_number"
                     />


                      
                    </div>


                    <div className="col-md-6 col-sm-6 col-xs-12">
                  
                    <label> Alternate Email: </label>
                    <Input
                        style={{width: '100%', border: 0}}
                        value={this.state.alternate_email}
                        readOnly={true}
                        name="alternate_email"
                    />
                      
                    <label> Alternate Phone Number: </label>
                    <Input
                        style={{width: '100%'}}
                        placeholder="Enter Alternate Phone Number"
                        value={this.state.alternate_phone_number}
                        onChange={this.handleChange}
                        name="alternate_phone_number"
                    />
                        </div>
                    </div>

                        
                  <div className="col-md-12 col-sm-12 col-xs-12">
                   <div className="editform">
                    <label> Remarks: </label>
                    <TextArea
                        style={{width: '100%'}}
                        autosize={{minRows: 10, maxRows: 25}}
                        placeholder="Add Remarks"
                        value={this.state.remarks}
                        onChange={this.handleChange}
                        name="remarks"
                    />
                    </div>

                    <div className="emailformbutton2"> 
                        <Button onClick={() => this.editEmailInfo('email')}>Submit</Button>
                    </div>

                    </div>

                    </div>
                    </div>
                    :
                    this.props.selected_type === 'social' ?
                        <div>
                        
                        <div class="row">

                           <div className="editsocialnew">

                            <div class="col-md-6 col-sm-6 col-xs-12">

                                <label> Username: </label>
                                <Input
                                style={{width: '100%', border: 0}}
                                placeholder="Enter Username"
                                value={this.state.username}
                                readOnly={true}
                                name="username"
                                />

                                <label> Phone Number: </label>
                                <Input
                                style={{width: '100%', border: 0}}
                                placeholder="Enter Phone Number"
                                readOnly={true}
                                value={this.state.phone_number}
                                name="phone_number"
                               />

                            </div>


                            <div class="col-md-6 col-sm-6 col-xs-12">

                                <label> Password: </label>
                                <Input.Password
                                type="password"
                                style={{width: '100%'}}
                                placeholder="Enter Password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                name="password"
                                />
                                <label> Technology: </label>
                                <Input
                                    style={{width: '100%',}}
                                    placeholder="Enter Technology"
                                    value={this.state.tech}
                                    onChange={this.handleChange}
                                    name="tech"
                                />

                            </div>
                        

                           <div className="col-md-12 col-sm-12 col-xs-12">

                                <label> Remarks: </label>
                                <TextArea
                                style={{width: '100%'}}
                                autosize={{minRows: 10, maxRows: 25}}
                                className=""
                                placeholder="Add Remarks"
                                value={this.state.remarks}
                                onChange={this.handleChange}
                                name="remarks"
                                />
                              
                            <div className="emailformbutton"> 
                              <Button onClick={() => this.editEmailInfo('social')}>Submit</Button>
                           </div>

                           </div>

                        </div>




                        </div>

                        </div>
                        :
                        this.props.selected_type === 'phone number' ?
                            <div>

                                <div className="row">
                                <div className="editphonenew">
                                
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <label> Email: </label>
                                    <Input
                                    style={{width: '100%', border: 0}}
                                    readOnly={true}
                                    value={this.state.email}
                                    name="email"
                                />
                                 </div>


                            <div class="col-md-6 col-sm-6 col-xs-12">
                            <label> Password: </label>
                            <Input.Password
                                    type="password"
                                    style={{width: '100%'}}
                                    placeholder="Enter Password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    name="password"
                                />
                            </div>


                            <div class="col-md-12 col-sm-12 col-xs-12">

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
                                    <Button onClick={() => this.editEmailInfo('phone')}>Submit</Button>
                                </div>

                            </div>

                            

                                </div>

                                </div>

                            </div>
                            : <div>

                                <div className="row">

                                    <div className="editphonenew">

                                        <div class="col-md-6 col-sm-6 col-xs-12">

                                            <label> Email: </label>
                                            <Input
                                                style={{width: '100%', border: 0}}
                                                readOnly={true}
                                                value={this.state.email}
                                                name="email"
                                            />
                                            <label> Technology: </label>
                                            <Input
                                                style={{width: '100%',}}
                                                placeholder="Enter Technology"
                                                value={this.state.tech}
                                                onChange={this.handleChange}
                                                name="tech"
                                            />

                                        </div>


                                        <div class="col-md-6 col-sm-6 col-xs-12">

                                            <label> Password: </label>
                                            <Input.Password
                                                type="password"
                                                style={{width: '100%'}}
                                                placeholder="Enter Password"
                                                value={this.state.password}
                                                onChange={this.handleChange}
                                                name="password"
                                            />

                                        </div>


                                        <div class="col-md-12 col-sm-12 col-xs-12">

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
                                                <Button onClick={() => this.editEmailInfo('phone')}>Submit</Button>
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>}


            </div>
        )
    }
}

export default editEmailForm;
