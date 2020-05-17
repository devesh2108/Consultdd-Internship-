import React, {Component} from 'react';
import {DatePicker} from "antd";
import 'antd/dist/antd.css';
import Button from "@material-ui/core/Button";

class AddProfile extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            email: "",
            education: "",
            dob: null,
            location: "",
            visa_start: null,
            visa_end: null,
            visa_type: "",
            links: "",
            title:"",
            current_profile:this.props.current_profile,
            flag:false

        };
        this.handleChange = this.handleChange.bind(this);
        this.onStartChange = this.onStartChange.bind(this);
        this.onVisaStartChange = this.onVisaStartChange.bind(this);
        this.onVisaEndChange = this.onVisaEndChange.bind(this);
        this.addProfile = this.addProfile.bind(this);

    }

    componentDidMount() {

            this.setState({
                email:this.state.current_profile.email,
                education:this.state.current_profile.education,
                location:this.state.current_profile.location,
                visa_type:this.state.current_profile.visa_type,
                links:this.state.current_profile.links,
                dob:this.state.current_profile.dob,
                // visa_start:new Date(this.state.current_profile.visa_start).format("YYYY-MM-DD"),
                // visa_end:new Date(this.state.current_profile.visa_end).format("YYYY-MM-DD")
            })



    }

    handleChange(event) {

        this.setState({[event.target.name]: event.target.value});
    };

    onStartChange = (value) => {
        this.setState({dob: value})
    };

    onVisaStartChange = (value) => {
        this.setState({visa_start: value})
    };
    onVisaEndChange = (value) => {
        this.setState({visa_end: value})
    };
    addProfile(){

    }

    render() {
        return (
            <div>
                <form>

                <div className="mainform">
                <div className="headform">
                    Add Profile
                    </div>

                    <div className="mainform2">
                    <div className="row">
                    
                    <div className="col-md-6">
                      <label>
                            Title:
                            <input
                                id="outlined-required"
                                className="form-control"
                                name="title"
                                value={this.state.title}
                                onChange={this.handleChange}/>
                        </label>
                        <br/>
                        <label>
                            Email:
                            <input
                                required
                                id="outlined-required"
                                className="form-control"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                        </label>
                        <br/>
                        <label>
                            Education:
                            <input
                                required
                                id="outlined-required"
                                className="form-control"
                                name="education"
                                value={this.state.education}
                                onChange={this.handleChange}/>
                        </label>
                        <br/>
                        <label>
                            Location:
                            <input
                                required
                                id="outlined-required"
                                className="form-control"
                                name="location"
                                value={this.state.location}
                                onChange={this.handleChange}/>
                        </label>
                        <br/>

                        <label>
                            Date of Birth:
                            <br/>
                            <DatePicker
                                format="YYYY-MM-DD"
                                value={this.state.dob}
                                placeholder="Date of birth"
                                onChange={this.onStartChange}
                            />
                        </label>

                    </div>

                    <div className="col-md-6">
                   
                       
                        <label>
                            Visa Type:
                            <br/>
                            <select className="form-control" onChange={(e) => this.setState({visa_type: e.target.value})}>
                                <option value="h1b">H1B</option>
                                <option value="b1">B1</option>
                                <option value="opt">OPT</option>
                            </select>
                        </label>
                        <br/>
                <label>
                    Visa Start Date:
                    <br/>
                    <DatePicker 
                        format="YYYY-MM-DD"
                        value={this.state.visa_start}
                        placeholder="Visa Start"
                        onChange={this.onVisaStartChange}
                    />
                </label>
                <br/>
                <label>
                    Visa End Date:
                    <br/>
                    <DatePicker
                        format="YYYY-MM-DD"
                        value={this.state.visa_end}
                        placeholder="Visa End"
                        onChange={this.onVisaEndChange}
                    />
                </label>
                <br/>
                        <label>
                        Link:
                        <input type="text"
                               name="links"
                               onChange={this.handleChange}
                               required
                               id="outlined-required"
                               className="form-control"
                               value={this.state.links}/>
                    </label>
                <br/>
                <br/>
                <br/>

                    <div className="addprofilebuttons">
                        <Button onClick={this.props.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.addProfile} color="primary">
                            Add Profile
                        </Button>
                    </div>
                    </div>


                    </div>
                    </div>
                    </div>
                </form>
                
            </div>


        );
    }
}

export default AddProfile;
