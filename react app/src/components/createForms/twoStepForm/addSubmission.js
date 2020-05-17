import React, {Component} from 'react';
import {
    getAllConsultants,
    getConsultantDetails,
    addNewProfile,
    updateProfile,
    getSubSuggestions,
    addSubmission
} from "../../../services/service";
import Button from "@material-ui/core/Button";
import {DatePicker, Popover, Select, Upload,Drawer,message} from "antd";
import {UploadOutlined,DeleteOutlined} from "@ant-design/icons"
import moment from 'moment-timezone';
import 'antd/dist/antd.css';
import AddSub from "./addSub";

class AddSubmission extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            error: null,
            key: 0,
            vendor: '',
            consultant: '',
            consultant_id: null,
            consultant_name: '',
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
            attachment_type: '',
            resume_selected:false,
            consultant_details:{},
            addSub:false,
            submission_id:-1,
            visa_type:'-----',
            visa_start:null,
            visa_end:null,
            dob:null
        }

        //console.log(this.props.handleClose);
        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.getAllConsultant = this.getAllConsultant.bind(this);
        this.getConsultantDetails = this.getConsultantDetails.bind(this);
        this.addSubmission = this.addSubmission.bind(this);
        this.onStartChange = this.onStartChange.bind(this);
        this.onVisaStartChange = this.onVisaStartChange.bind(this);
        this.onVisaEndChange = this.onVisaEndChange.bind(this);
        this.handleAttachmentChange = this.handleAttachmentChange.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
    }

    componentDidMount() {
        //console.log("lead id", this.props.leadId)
        this.getAllConsultant()
    }

    handleChangeFile(event) {

        let fd = this.state.file_data
        fd.append('file', event.target.files[0])

        let temp_list = {
            'type': 'resume',
            'file': event.target.files[0]
        }
        this.setState({
            attachment_type:'resume',
            attachments :[temp_list],
            file_data: fd
        })
    }

    deleteFile(file) {
        var array = [...this.state.attachments]; // make a separate copy of the array
        var index = array.indexOf(file)
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({attachments: array});
        }
        this.state.file_data.delete('file')
    }

    handleChange(event) {
        //console.log(event.target.name, event.target.name === 'client', event.target.value, event.target.value.length);
        this.setState({[event.target.name]: event.target.value});
    }


    closeModal() {
        this.setState({profile: false,addSub: false});
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
                //console.log(res.results);
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
        
        this.state.file_data.append('lead', this.props.leadId);
        this.state.file_data.append('consultant', this.state.profile_id);
        if (this.props.leadId && this.state.profile_id && this.state.attachment_type) {
            addSubmission(this.state.file_data)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    console.log("response",res);
                    if(status === 201){
                        console.log(status);
                        this.setState({
                            submission_id:res.result.id,
                            resume:res.result.attachments
                        })

                        this.props.openSubModal();
                    }
                    else{
                        message.error("Something went wrong")
                    }


                })
                .catch(error => {
                    console.log(error)
                });
        } else {
            alert("Please fill all the values")
        }

    }

    getConsultantDetails(id) {
        getConsultantDetails(id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                //console.log("consultant details", res.results)
if(status === 200) {
    this.setState({
        consultant_details: res.results,
        consultant: res.results.id,
        consultant_profiles: res.results.profiles
    });

    this.getSuggestions(this.props.leadId, res.results.id);
}
else{
                    if(status === 400){
                        message.error("Something Went Wrong")
                    }
}

            })
            .catch(error => {
                console.log(error)
            });

    }

    onConsultantChange(value) {
        this.setState({consultant_id: value.split(",")[0],consultant_name: value.split(",")[1]})
    }

    onConsultantSearch(val) {
    }

    getCurrentProfile(id) {

        if (this.state.consultant_profiles.length != 0) {
            this.state.consultant_profiles.map((item, i) => (

                    item.id == id ? (
                            this.setState({
                                current_profile: item,
                                profile_id: item.id,
                                title: item.title,
                                education: item.education,
                                location: item.location,
                                visa_type: item.visa_type,
                                links: item.links,

                                dob: moment(item.dob),
                                visa_start: moment(item.visa_start),
                                visa_end: moment(item.visa_end),
                                disabled: true
                            }))
                        : null
                )
            )
        } else {
            this.setState({
                current_profile: {},
                profile_id: 0,
                title: '',
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

    getSuggestions(id, consultant_name) {
        getSubSuggestions(id, consultant_name)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                    this.setState({
                        suggestionList1: res.result
                    })

            })
            .catch(error => {
                console.log(error)
            });


    }

    render() {
        const company = localStorage.getItem('TEAM');
        return (

            this.state.status === 200 ?
            <div className="subnew1">
                <div className="submissionform">
                    <div className="applysubmission">
                        <div className="col-md-12">
                            <div className="row">

                                <div className="col-md-6">
                                    <div>
                                        <label><span style={{color:'red',fontSize:9}}>*</span> Consultant: </label>
                                        <Select
                                            showSearch
                                            style={{width: '100%'}}
                                            placeholder="Select a consultant"
                                            optionFilterProp="children"
                                            onChange={(e) => {
                                                this.onConsultantChange(e);
                                                this.getConsultantDetails(e.split(',')[0])
                                            }}
                                            onSearch={this.onConsultantSearch}
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {this.state.consultantList.map((item, i) => (
                                                <Select.Option key={i} value={item.id+','+item.name}>{item.name}</Select.Option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="submissionleft_sec">
                                        {this.state.consultant_profiles.length != 0 ?
                                            <div>
                                               <label> <span style={{color:'red',fontSize:9}}>*</span> Profile: </label>
                                                <Select
                                                    showSearch
                                                    style={{width: '100%'}}
                                                    placeholder="Select a profile"
                                                    optionFilterProp="children"
                                                    onChange={(e) => {
                                                        this.setState({profile_id: e,
                                                            disabled: true,
                                                            flag: true,
                                                            hideButton: true});
                                                        this.getCurrentProfile(e)
                                                    }}
                                                    onSearch={this.onConsultantSearch}
                                                    filterOption={(input, option) =>
                                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {this.state.consultant_profiles.map((item, i) => (


                                                            <Select.Option key={i} value={item.id}>{item.title}</Select.Option>
                                                    ))}
                                                </Select>
                                            </div> :
                                            null}
                                    </div>
                                </div>


                                <br/>
                                {
                                    this.state.suggestionList1.length === 0 ? null :
                                        <Popover
                                            placement="left"
                                            content={
                                                <div>
                                                    <div>
                                                        This consultant is already submitted on this vendor:
                                                        <br/>
                                                        {this.state.suggestionList1.map((item) =>

                                                            <div>
                                                                <div>
                                                                    <h6>Consultant: {item.consultant_name}</h6>
                                                                    <h6>Marketer: {item.marketer_name}</h6>
                                                                    <h6>Vendor: {item.company_name}</h6>
                                                                    <h6>Location: {item.location}</h6>
                                                                    <h6>Job Title: {item.job_title}</h6>
                                                                </div>
                                                                <br/>

                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            }
                                        >

                                            <Button style={{color: 'blue', background: 'white', marginTop:'10px' , marginLeft:'17px'}}> Suggestions </Button>
                                        
                                        </Popover>
                                }
                                <br/>

                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <div className="add_sub_attach2">
                                        <label>
                                            Resume:
                                            {/* <br/> */}
                                            <UploadOutlined />
                                                <input type="file" style={{visibility:'hidden'}} onChange={(e) =>
                                                    this.handleChangeFile(e)}/>
                                        </label>
                                    </div>
                                </div>                    

                                <div>

                                    {
                                        this.state.attachments.map(item => {

                                                return (
                                                <div className="maindelete">
                                                    <span> {item.file.name}</span>
                                                    <span style={{marginLeft: '10px'}}>{item.type}</span>
                                                    <DeleteOutlined className="deleteIcon"  onClick={() => this.deleteFile(item)}/>
                                                </div>
                                                )
                                            }
                                        )

                                    }

                                </div>
                            </div>
                        </div>


                    </div>

                   <br clear="all" />

                    <div className="addsubmission">

                        <Button color="primary"
                                onClick={this.props.handleClose}>
                            Cancel
                        </Button>
                        <Button color="primary"
                                onClick={() => this.addSubmission()}>
                            Next
                        </Button>
                    </div>

                    { this.props.addSub &&

                        <Drawer
                                title=""
                                width={550}
                                onClose={this.props.handleClose}
                                visible={this.props.addSub}
                        >
                            <AddSub
                                setSubmission={this.props.setSubmission}
                                sub_id={this.state.submission_id}
                                leadId={this.props.leadId}
                                resume={this.state.resume}
                                consultant={this.state.consultant}
                                consultant_name={this.state.consultant_name}
                                handleClose={this.props.handleClose}
                            />
                        </Drawer>
                    }


                </div>

                </div>

                : <div>
                    No data
                </div>
                
        );
    }
}

export default AddSubmission;
