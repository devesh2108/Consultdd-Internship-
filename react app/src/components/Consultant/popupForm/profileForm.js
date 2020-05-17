import React, {Component} from 'react';
import 'antd/dist/antd.css';
import moment from "moment-timezone";
import {Input, Select, DatePicker, Button,message} from "antd";
import {addProfile, editProf} from "../../../functions/onProfile";

const visa_type = [
    "",
    "CPT",
    "H1B",
    "H4-EAD",
    "GC-EAD",
    "Green Card",
    "OPT",
    "OPT-EXT",
    "USC",
    "OPT EAD",
    "Asylam Visa",
    "Not Auth",
    "Other"
];

class ProfileForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            visaType: '',
            dob:'',
            visaStart: '',
            visaEnd: '',
            education: '',
            current_city: '',
            linkedin: '',
            links: '',
        }
        this.onChange = this.onChange.bind(this);
        this.onVisaTypeChange = this.onVisaTypeChange.bind(this);
        this.onVisaStartChange = this.onVisaStartChange.bind(this);
        this.onVisaEndChange = this.onVisaEndChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

    componentDidMount() {
        console.log(this.props.profile)
        if (this.props.profile !== {}) {
            this.setState({
                title: this.props.edit ? this.props.profile.title : "",
                visaType: this.props.profile.visa_type,
                dob: moment(this.props.profile.dob),
                visaStart: moment(this.props.profile.visa_start),
                visaEnd: moment(this.props.profile.visa_end),
                education: this.props.profile.education,
                current_city: this.props.profile.current_city,
                linkedin: this.props.profile.linkedin,
                links: this.props.profile.links,
            })
        }
    }

    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onVisaTypeChange(value) {
        this.setState({visaType: value})
    }
    onDOBChange = (value) => {
        this.setState({dob: value})
    };

    onVisaStartChange = (value) => {
        this.setState({visa_start: value})
    };
    onVisaEndChange = (value) => {
        this.setState({visa_end: value})
    };
    async onSubmit(){
        let data;
        if(this.props.edit){
            data = await editProf(this.state,this.props.profile.id,this.props.consultantId)
            this.props.changeCurrentProfile(data)
            this.props.handleClose()
            message.success("Profile Updated Successfully.")
        }
        else{
            data = await addProfile(this.state,this.props.consultantId)
            this.props.addProfile(data)
            this.props.handleClose();
            message.success("Profile Added Successfully.")
        }


    }

    render() {
        return (
            <div>

        <div className="row">

            <div className="col-md-6">


                <div className="profileformnew">
                    <label>
                        <span>Title</span>
                    </label>
                    <Input name="title" value={this.state.title} onChange={this.onChange}/>
                </div>
                <div className="profileformnew">
                    <label>
                        <span>Date of Birth</span>
                    </label>

                    <DatePicker
                        format="YYYY-MM-DD"
                        className="profledate"
                        value={this.state.dob}
                        placeholder="Date Of Birth"
                        onChange={this.onDOBChange}
                    />
                    <br />
                </div>


                <div className="profileformnew">
                    <label>
                        <span>Visa Start</span>
                    </label>

                    <DatePicker
                        format="YYYY-MM-DD"
                        className="profledate"
                        value={this.state.visaStart}
                        placeholder="Visa Start"
                        onChange={this.onVisaStartChange}
                    />
                    <br />
                </div>


                <div className="profileformnew">
                    <label>
                        <span>Education</span>
                    </label>
                    <Input name="education" value={this.state.education} onChange={this.onChange}/>
                </div>

                
                <div className="profileformnew">
                    <label>
                        <span>LinkedIn</span>
                    </label>
                    <Input name="linkedin" value={this.state.linkedin} onChange={this.onChange}/>
                </div>
 

            </div>




            <div className="col-md-6">

              <div className="profileformnew">
                    <label>
                        <span>Visa Type</span>
                    </label>
                    <Select
                        value={this.state.visaType}
                        className="profledateselect"
                        onChange={this.onVisaTypeChange}>
                        {visa_type.map((item) => <Select.Option
                            value={item}>{item}</Select.Option>)}
                    </Select>
                    <br />
                </div>


                <div className="profileformnew">
                    <label>
                        <span>Visa End</span>
                    </label>
                    <DatePicker
                        format="YYYY-MM-DD"
                        className="profledate"
                        value={this.state.visaEnd}
                        placeholder="Visa End"
                        onChange={this.onVisaEndChange}
                    />
                </div>


                <div className="profileformnew">
                    <label>
                        <span>Current City</span>
                    </label>
                    <Input name="current_city" value={this.state.current_city} onChange={this.onChange}/>
                </div>


                <div className="profileformnew">
                    <label>
                        <span>Links</span>
                    </label>
                    <Input name="links" value={this.state.links} onChange={this.onChange}/>
                </div>

                <div className="profileformnew">
                   <Button onClick={this.onSubmit}> Submit </Button>
                </div>

            </div>

            


        </div>


        

        
            </div>


        )

    }
}

export default ProfileForm;
