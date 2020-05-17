import React, {Component} from 'react';
import {
    getAllConsultants,
    getConsultantDetails,
    addNewProfile,
    updateProfile,
    addSubmission
} from "../services/service";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import {DatePicker, Select, Form,message} from "antd";
import moment from 'moment-timezone';
import 'antd/dist/antd.css';

const visa_type=[
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

class ManageProfiles extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            error: null,
            key: 0,
            vendor: '',
            consultant: '',
            consultant_id: null,
            emp: 'consultadd',
            status: 0,
            rate: 0,
            client: '',
            consultantList: [],
            resume: null,
            file_data: new FormData(),
            profile: false,
            profile_status: false,
            consultant_profiles: [],
            original_profile: {},
            current_profile: {},
            profile_id: 0,
            flag: false,
            marketing_email: '',
            title: "",
            disabled: true,
            hideButton: true,
            suggestionList1: [],
            suggestionList2: [],
            sFlag: false,
            attachments: [],
            attachedFiles: [],
            attachment_type: 'resume',
            resume_selected: false,
            consultant_detail: null,
            owner:''
        }


        console.log(this.props.handleClose);
        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.getAllConsultant = this.getAllConsultant.bind(this);
        this.getConsultantDetails = this.getConsultantDetails.bind(this);
        this.addSubmission = this.addSubmission.bind(this);
        this.onStartChange = this.onStartChange.bind(this);
        this.onVisaStartChange = this.onVisaStartChange.bind(this);
        this.onVisaEndChange = this.onVisaEndChange.bind(this);
        this.addProfile = this.addProfile.bind(this);
        this.editProfile = this.editProfile.bind(this);
        this.onEditCancel = this.onEditCancel.bind(this);
        this.onAddCancel = this.onAddCancel.bind(this);
        this.handleAttachmentChange = this.handleAttachmentChange.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
    }

    componentDidMount() {
        console.log("lead id", this.props.leadId)
        this.getAllConsultant()
    }

    handleChangeFile(event) {
        this.state.file_data.append('file', event.target.files[0])

        this.state.attachedFiles.push(this.state.attachment_type);

        let temp_list = {
            'type': this.state.attachment_type,
            'file': event.target.files[0]
        }
        this.state.attachments.push(temp_list)
        if (this.state.attachment_type === 'resume') {
            this.setState({resume_selected: true})
        }
        console.log(this.state.attachedFiles)


        // let aa = event.target.files;
        // let att = []
        // for(let f in aa){
        //
        //     console.log("1111>>>>", typeof aa[f], aa[f])
        //     if (typeof aa[f] === 'object'){
        //         att.push(aa[f].name);
        //         // this.state.file_data.append("file", aa[f]);
        //     }
        // }
        // console.log("att>>>", att);
        // this.setState({
        //     attachments: event.target.files,
        //     attachedFiles: att
        // });
        // this.state.file_data.append("file", event.target.files[0]);
    }

    deleteFile(file, key) {
        var array = [...this.state.attachments]; // make a separate copy of the array
        var index = array.indexOf(file)
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({attachments: array});
        }
    }

    handleChange(event) {
        console.log(event.target.name, event.target.name === 'client', event.target.value, event.target.value.length);
        this.setState({[event.target.name]: event.target.value});
    }


    closeModal() {
        this.setState({profile: false});
    }

    openModal() {
        this.setState({profile: true});
    }

    getAllConsultant() {
        getAllConsultants()
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res.results);
                this.setState({
                    consultantList: res.results
                });
                // this.setState({consultant_id: res.results[0].id});
                // this.setState({consultant: res.results[0].name});
                // this.getConsultantDetails(this.state.consultant_id);
                // console.log(this.state.consultant_id);

                this.setState({status: status})
                // this.props.changeStepCount(2,res.result.id,id);

            })
            .catch(error => {
                console.log(error)
            });
    }

    handleAttachmentChange = (e) => {
        this.setState({
            attachment_type: e
        });
    };

    addSubmission() {
        console.log("attachment list", this.state.attachments)

        this.state.file_data.append('type', this.state.attachedFiles)
        this.state.file_data.append('client', this.state.client);
        this.state.file_data.append('lead', this.props.leadId);
        this.state.file_data.append('rate', this.state.rate);
        this.state.file_data.append('employer', this.state.emp);
        this.state.file_data.append('consultant', this.state.profile_id);
        this.state.file_data.append('marketing_email', this.state.marketing_email);
        console.log(this.props.leadId);
        if (this.props.leadId) {
            addSubmission(this.state.file_data)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    console.log(res);
                    console.log(status);
                    this.props.handleClose();

                })
                .catch(error => {
                    console.log(error)
                });
        } else {
            alert("Please fill all the values")
        }

    }

    getConsultantDetails(id) {
        this.setState({consultant_profiles:[]})
        getConsultantDetails(id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log("consultant details", res.results)

                this.setState({
                    consultant_detail: res.results,
                    consultant: res.results.name,
                    consultant_profiles: res.results.profiles
                });

                this.state.consultant_profiles.map((item, i) =>

                    item.is_original === true ? (

                        this.setState({
                            current_profile: item,
                            original_profile: item,
                            profile_id: item.id,
                            owner: item.owner,
                            title: item.title,
                            education: item.education,
                            location: item.location,
                            visa_type: item.visa_type,
                            links: item.links,

                            dob: moment(item.dob),
                            visa_start:item.visa_start === null? null:moment(item.visa_start),
                            visa_end: item.visa_end === null? null:moment(item.visa_end),
                            profile_status: true
                        })
                    ) : null
                )
                console.log(this.state.current_profile)


            })
            .catch(error => {
                console.log(error)
            });

    }

    onConsultantChange(value) {
        this.setState({consultant_id: value})
        console.log(`selected ${value}`);
    }

    onConsultantSearch(val) {
        console.log("search:", val);
    }

    getCurrentProfile(id) {
        console.log(id)

        if (this.state.consultant_profiles.length != 0) {
            this.state.consultant_profiles.map((item, i) => (

                    item.id == id ? (
                            this.setState({
                                current_profile: item,
                                profile_id: item.id,
                                title: item.title,
                                owner: item.owner,
                                education: item.education,
                                location: item.location,
                                visa_type: item.visa_type,
                                links: item.links,

                                dob: moment(item.dob),
                                visa_start:item.visa_start === null? null: moment(item.visa_start),
                                visa_end: item.visa_end === null? null:moment(item.visa_end),
                                disabled: true
                            }),
                                console.log("item", item))
                        : null
                )
            )
        } else {
            this.setState({
                current_profile: {},
                profile_id: 0,
                title: '',
                owner: '',
                education: '',
                location: '',
                visa_type: null,
                links: '',

                dob: null,
                visa_start: null,
                visa_end: null,
                disabled: true,
                flag: true
            })

        }
    }

    onStartChange = (value) => {
        this.setState({dob: value})
    };

    onVisaStartChange = (value) => {
        this.setState({visa_start: value})
    };

    onVisaEndChange = (value) => {
        this.setState({visa_end: value})
    };

    addProfile() {
        const body = {
            "title": this.state.title,
            "location": this.state.location,
            "consultant": this.state.consultant_id,
            "education": this.state.education,
            "visa_type": this.state.visa_type,
            "links": this.state.links,
            "dob": moment(this.state.dob).format("YYYY-MM-DD"),
            "visa_start": moment(this.state.visa_start).format("YYYY-MM-DD"),
            "visa_end": moment(this.state.visa_end).format("YYYY-MM-DD")
        }
        console.log("add profile", body)
        if(this.state.title && this.state.consultant_id){
            addNewProfile(body)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    console.log(res)
                    this.state.consultant_profiles.push(res.result)
                    this.setState({
                        current_profile: res.result,
                        consultant_id: res.result.consultant,
                        profile_id: res.result.id,
                        owner: res.result.owner,
                        title: res.result.title,
                        education: res.result.education,
                        location: res.result.location,
                        visa_type: res.result.visa_type,
                        links: res.result.links,
                        dob: moment(res.result.dob),
                        visa_start: moment(res.result.visa_start),
                        visa_end: moment(res.result.visa_end),
                        flag: false,
                        disabled: true,
                        hideButton: true
                    })
                    message.success("Profile Created.")


                })
                .catch(error => {
                    console.log(error)
                });
        }
        else{
            message.error("Please fill all details.")
        }


    }

    editProfile() {
        console.log(this)
        let self = this;
        const body = {
            "id": self.state.profile_id,
            "title": this.state.title,
            "location": this.state.location,
            "consultant": this.state.consultant_id,
            "education": this.state.education,
            "visa_type": this.state.visa_type,
            "links": this.state.links,
            "dob": moment(this.state.dob).format("YYYY-MM-DD"),
            "visa_start": moment(this.state.visa_start).format("YYYY-MM-DD"),
            "visa_end": moment(this.state.visa_end).format("YYYY-MM-DD")
        }
        console.log(body)
        if(this.state.title && this.state.consultant_id) {
            updateProfile(body)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    console.log(res)
                    message.success("Profile Updated.")

                })
                .catch(error => {
                    console.log(error)
                });
        }
        else{
            message.error("Please fill all details.")
        }

    }

    onAddCancel() {
        this.setState({
            current_profile: this.state.original_profile,
            profile_id: this.state.original_profile.id,
            title: this.state.original_profile.title,
            education: this.state.original_profile.education,
            location: this.state.original_profile.location,
            visa_type: this.state.original_profile.visa_type,
            links: this.state.original_profile.links,
            owner: this.state.original_profile.owner,
            dob: moment(this.state.original_profile.dob),
            visa_start: moment(this.state.original_profile.visa_start),
            visa_end: moment(this.state.original_profile.visa_end),
            flag: false,
            disabled: true,
            hideButton: true
        })
        message.success("Cancelled")

    }

    onEditCancel() {
        this.setState({
            current_profile: this.state.current_profile,
            profile_id: this.state.current_profile.id,
            title: this.state.current_profile.title,
            education: this.state.current_profile.education,
            location: this.state.current_profile.location,
            visa_type: this.state.current_profile.visa_type,
            links: this.state.current_profile.links,
            owner: this.state.current_profile.owner,
            dob: moment(this.state.current_profile.dob),
            visa_start: moment(this.state.current_profile.visa_start),
            visa_end: moment(this.state.current_profile.visa_end),
            flag: false,
            disabled: true,
            hideButton: true
        })
        message.success("Cancelled")

    }


    render() {

        return (

            this.state.status === 200 ?
            <div>
                <div className="submissionform">
                    <div className="applysubmission">
                      <h2> Manage Candidate Profiles </h2>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="row">
                                        <label> Consultant: </label>
                                        <Select
                                            showSearch
                                            style={{width: '100%'}}
                                            placeholder="Select a consultant"
                                            optionFilterProp="children"
                                            onChange={(e) => {
                                                console.log(e)
                                                this.onConsultantChange(e);
                                                this.getConsultantDetails(e)
                                            }}
                                            onSearch={this.onConsultantSearch}
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {this.state.consultantList.map((item, i) => (
                                                <Select.Option value={item.id}>{item.name}</Select.Option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="submissionleft_sec submissionleft_sec2">
                                        {this.state.consultant_profiles.length != 0 ?
                                            <div>
                                               <label> Profile: </label>
                                                <Select
                                                    showSearch
                                                    value={this.state.title}
                                                    style={{width: '80%'}}
                                                    placeholder="Select a profile"
                                                    optionFilterProp="children"
                                                    onChange={(e) => {
                                                        console.log(e)

                                                        this.setState({
                                                            profile_id: e,
                                                            disabled: true,
                                                            flag: true,
                                                            hideButton: true
                                                        })
                                                        this.getCurrentProfile(e)

                                                    }}
                                                    onSearch={this.onConsultantSearch}
                                                    filterOption={(input, option) =>
                                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {this.state.consultant_profiles.map((item, i) => (

                                                        <Select.Option value={item.id}>{item.title}</Select.Option>
                                                    ))}
                                                </Select>

                                                <Icon style={{backgroundColor:'#005ead',marginLeft:'8px',marginTop:'2px',color:'white'}} onClick={() =>
                                                    this.setState({
                                                        current_profile: {},
                                                        profile_id: this.state.original_profile.id,
                                                        title: '',
                                                        education: this.state.original_profile.education,
                                                        owner: this.state.original_profile.owner,
                                                        location: this.state.original_profile.location,
                                                        visa_type: this.state.original_profile.visa_type,
                                                        links: this.state.original_profile.links,
                                                        dob: moment(this.state.original_profile.dob),
                                                        visa_start: moment(this.state.original_profile.visa_start),
                                                        visa_end: moment(this.state.original_profile.visa_end),
                                                        flag: false,
                                                        disabled: false,
                                                        hideButton: false
                                                    })
                                                }> add</Icon>
                                            </div> :


                                         null
                                        }
                                    </div>

                                </div>

                            </div>
                            {this.state.consultant_detail !== null ?
                                <div className="row">

                                    <div className="col-md-6">

                                        <Form.Item label="Email">
                                            {this.state.consultant_detail.email}

                                        </Form.Item>

                                        <Form.Item label="Skill">
                                            {this.state.consultant_detail.skills}

                                        </Form.Item>

                                        <Form.Item label="SSN">
                                            {this.state.consultant_detail.ssn}
                                        </Form.Item>

                                        <Form.Item label="Gender">
                                            {this.state.consultant_detail.gender === 'male' ? 'Male' : 'Female'}
                                        </Form.Item>


                                    </div>


                                    <div className="col-md-6">

                                        <Form.Item label="Rate">
                                            {this.state.consultant_detail.rate}
                                        </Form.Item>

                                        <Form.Item label="Team">
                                            {this.state.consultant_detail.teams.map((team,i)=> <div>{team.name}</div>)}

                                        </Form.Item>
                                        <Form.Item label="Phone Number">
                                            {this.state.consultant_detail.phone_no}

                                        </Form.Item>
                                        <Form.Item label="Skype ID">
                                            {this.state.consultant_detail.skype}

                                        </Form.Item>

                                        <Form.Item label="RTG">
                                            <input type="checkbox" checked={this.state.consultant_detail.rtg}
                                                   disabled={true}/>
                                        </Form.Item>

                                    </div>


                                </div>
                                : null}
                        </div>

                    </div>
                    <br/><br/>
                    <div className="col-md-6">

                        <div className="mainform mainform_section">

                            <div className="headform">
                                <span> {this.state.original_profile === this.state.current_profile?'Profile Details':!this.state.flag && !this.state.disabled ? ' Add Profile' : 'Profile Details'}</span>
                                <span style={{marginLeft:'210px'}}>Created by: {this.state.owner}</span>
                            </div>

                            <div className="mainform2">
                                <div className="row">
                                    <br/>
                                    <div className="col-md-6">
                                        <label>
                                            Title Suffix:
                                            <input
                                                disabled={this.state.disabled}
                                                id="outlined-required"
                                                className="form-control"
                                                name="title"
                                                value={this.state.title}
                                                onChange={this.handleChange}/>
                                        </label>
                                        <br/>
                                        <label>
                                            Date of Birth:
                                            <br/>
                                            <DatePicker
                                                disabled={this.state.disabled}
                                                format="YYYY-MM-DD"
                                                value={this.state.dob}
                                                placeholder="Date of birth"
                                                onChange={this.onStartChange}
                                            />
                                        </label>
                                        <br/>
                                        <label>
                                            Education:
                                            <input
                                                required
                                                disabled={this.state.disabled}
                                                id="outlined-required"
                                                className="form-control"
                                                name="education"
                                                value={this.state.education}
                                                onChange={this.handleChange}/>
                                        </label>
                                        <br/>
                                        <label>
                                            Current Location:
                                            <input
                                                required
                                                disabled={this.state.disabled}
                                                id="outlined-required"
                                                className="form-control"
                                                name="location"
                                                value={this.state.location}
                                                onChange={this.handleChange}/>
                                        </label>
                                        <br/>

                                    </div>

                                    <div className="col-md-6">


                                        <label>
                                            Visa Type:
                                            <br/>
                                            <select
                                                value={this.state.visa_type}
                                                className="form-control" disabled={this.state.disabled}
                                                    onChange={(e) => this.setState({visa_type: e.target.value})}>
                                                {visa_type.map((item)=><option value={item}>{item}</option>)}

                                            </select>
                                        </label>
                                        <br/>
                                        <label>
                                            Visa Start Date:
                                            <br/>
                                            <DatePicker
                                                disabled={this.state.disabled}
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
                                                disabled={this.state.disabled}
                                                format="YYYY-MM-DD"
                                                value={this.state.visa_end}
                                                placeholder="Visa End"
                                                onChange={this.onVisaEndChange}
                                            />
                                        </label>
                                        <br/>
                                        <label>
                                            LinkedIN:
                                            <input type="text"
                                                   disabled={this.state.disabled}
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


                                    </div>
                                    {this.state.original_profile === this.state.current_profile ? null :
                                        <div className="addprofilebuttons">
                                            {this.state.hideButton ?
                                                this.state.flag && !this.state.disabled ?
                                                    <Button onClick={() => this.setState({
                                                        disabled: false,
                                                        hideButton: false,
                                                        flag: false,
                                                        title: ''
                                                    })}
                                                            color="primary">
                                                        Add Profile
                                                    </Button> :
                                                    null
                                                :
                                                !this.state.flag && !this.state.disabled ?
                                                    <div>
                                                        <Button onClick={this.addProfile} color="primary">
                                                            Submit
                                                        </Button>
                                                        <Button onClick={this.onAddCancel} color="primary">
                                                            Cancel
                                                        </Button>
                                                    </div> :
                                                    <div>
                                                        <Button onClick={this.editProfile} color="primary">
                                                            Submit
                                                        </Button>
                                                        <Button onClick={this.onEditCancel} color="primary">
                                                            Cancel
                                                        </Button>
                                                    </div>
                                            }
                                        </div>
                                    }
                                </div>

                            </div>
                        </div>

                    </div>

                </div>


             </div>

                : <div>
                    No data
                </div>
        );
    }
}

export default ManageProfiles;
