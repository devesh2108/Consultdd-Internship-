import React, {Component} from 'react';
import {
    deleteAttachment, didyoumean,
    editResume, addAttachment,
    getSubClientSuggestions,
    updateSubmission
} from "../../../services/service";
import Button from "@material-ui/core/Button";
import {Popover,message,Select,Tag,Tooltip,Input} from "antd";
import {UploadOutlined,DeleteOutlined} from "@ant-design/icons"
import 'antd/dist/antd.css';
import {BASE_URL} from "../../../services/httpService";

const server_url = BASE_URL;
class AddSub extends Component {

    constructor(props, context) {
        const company = localStorage.getItem('TEAM');
        super(props, context);
        this.state = {
            loading: false,
            error: null,
            key: 0,
            vendor: '',
            consultant: '',
            consultant_id: null,
            emp: company,
            status: 0,
            rate: 0,
            client: '',
            consultantList: [],
            clientList: [],
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
            marketing_contact: "",
            disabled: true,
            hideButton: true,
            suggestionList1: [],
            suggestionList2: [],
            sFlag: false,
            attachments: [],
            attachedFiles: [],
            attachment_type: 'resume',
            resume_selected: false,
            consultant_details: {},
            file: new FormData(),
            selected: [false],
        }

        //console.log(this.props.resume);
        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.addSubmission = this.addSubmission.bind(this);
        this.onStartChange = this.onStartChange.bind(this);
        this.onVisaStartChange = this.onVisaStartChange.bind(this);
        this.onVisaEndChange = this.onVisaEndChange.bind(this);
        this.onSelectClient = this.onSelectClient.bind(this);
    }

    componentDidMount() {
        // console.log("lead id", this.props.leadId)
    }

    handleChangeFile(event) {
        //console.log(event.target.files[0])
        this.state.file.append('file', event.target.files[0]);
        this.state.file.append("obj_type", "submission");
        this.state.file.append("attachment_type", "misc");
        this.state.file.append("object_id", this.props.sub_id)
        addAttachment(this.state.file)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                //console.log(res)
                this.state.attachments.push(res.result);
                this.setState({flag: true})

            })
            .catch(error => {
                console.log(error)
            });
    }

    deleteAttachment(id) {
        let arr = [];
        deleteAttachment(id)
            .then((response) => {

                const statusCode = response.status;

                arr = this.state.attachments.filter(function (item) {
                    return item.id !== id
                })
                this.setState({attachments: arr})

                return Promise.all([statusCode, response]);
            })
            .catch(error => {
                console.log(error)
            });
    }

    handleChange(event) {
        //console.log(event.target.name, event.target.name === 'client', event.target.value, event.target.value.length);
        this.setState({[event.target.name]: event.target.value});
        if (event.target.name === 'client' && event.target.value.length >= 3) {
            this.getSuggestions(this.props.leadId, this.props.consultant, event.target.value)
        }
    }


    closeModal() {
        this.setState({profile: false});
    }

    openModal() {
        this.setState({profile: true});
    }

    addSubmission() {

        const body = {
            'client': this.state.client,
            'sub_id': this.props.sub_id,
            'rate': this.state.rate,
            'employer': this.state.emp,
            'marketing_email': this.state.marketing_email,
            'marketing_phone': this.state.marketing_contact,
            'vendor_contact': '',
            'status': 'sub'
        }
        //console.log(body)
        if (this.props.sub_id && this.state.emp && this.state.marketing_email && this.state.marketing_contact) {
            updateSubmission(body, this.props.sub_id)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    console.log(res);
                    console.log(status);
                    if (status === 202) {
                        message.success("Submission Created.")
                        this.props.handleClose();
                        this.props.setSubmission();
                    }
                    else {
                        message.error("Something went wrong.")
                    }


                })
                .catch(error => {
                    console.log(error)
                });
        } else {
            message.error("Please fill all the values")
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

    didYouMean(client) {
        didyoumean(client)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                //console.log("didyoumean response", res)
                if (status === 200) {
                    this.setState({
                        clientList: res.result
                    })
                }
                else {
                    message.error("Something Went Wrong!")
                }

            })
            .catch(error => {
                console.log(error)
            });
    };

    getSuggestions(id, consultant_name, client_name) {
        getSubClientSuggestions(id, consultant_name, client_name)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                //console.log("suggestions response", res)
                if (status === 200) {
                    this.setState({
                        suggestionList2: res.result
                    })
                }
                else {
                    message.error("Something Went Wrong!")
                }

            })
            .catch(error => {
                console.log(error)
            });
    }

    onSelectClient(data, i) {
        //console.log(data)
        let selected = [];
        selected[i] = true
        this.setState({
            client: data,
            selected: selected,
        })

    }

    render() {
        const company = localStorage.getItem('TEAM');
        return (
            <div>

            

                <div className="subnew2">
                    <div className="submissionform">
                        <div className="applysubmission">
                            <div className="col-md-12">
                                <div className="row">
                                    <h3> {this.props.consultant_name} </h3>
                                    <a className="resumebuttonnew"
                                       href={server_url + this.props.resume[0].attachment_file} target="_blank">View
                                        Resume</a>
                                    <div className="col-md-12">
                                        <div className="row">
                                            <label>
                                                Employer <span style={{color: 'red'}}>*</span>
                                                <Select className="form-control" value={this.state.emp}
                                                        onChange={(e) => {
                                                            //console.log(e)
                                                            this.setState({emp: e});
                                                        }}>

                                                    <Select.Option
                                                        eventkey={company.toLowerCase() === 'consultadd' ? '0' : '1'}
                                                        value={company}>{company}</Select.Option>
                                                    {company.toLowerCase() === 'consultadd' ? null :
                                                        <Select.Option eventkey="0"
                                                                       value="consultadd">Consultadd</Select.Option>}


                                                </Select>
                                            </label>
                                            <br/>
                                            <label>
                                                Rate:(Only Number)
                                                <Input

                                                    placeholder="$"
                                                    id="outlined-required"
                                                    className="form-control"
                                                    name="rate"
                                                    value={this.state.rate}
                                                    onChange={this.handleChange}/>
                                            </label>
                                        </div>
                                    </div>

                                    {/* <div className="row">
                                     <div className="col-md-12">

                                     </div>
                                     </div>              */}

                                <label>
                                    Client:
                                    <div>
                                    <Input
                                        id="outlined-required"
                                        className="form-control"
                                        name="client"
                                        value={this.state.client}
                                        onChange={this.handleChange}
                                    onBlur={()=>this.didYouMean(this.state.client)}
                                    />
                                    {this.state.clientList.length !== 0 &&
                                    
                                    <div className="view_sub_btnnew">
                                        <span> Did you mean: </span>

                                        <div style={{borderWidth: 1, borderColor: 'black'}}>

                                            {this.state.clientList.map((tag, index) => {
                                                const isLongTag = tag > 20;
                                                const tagElem = (
                                                    <div style={{ color: this.state.selected[index] ? 'white' : '#007ae2',
                                                        backgroundColor: this.state.selected[index] ? '#007ae2' : 'white'}} onClick={() => this.onSelectClient(tag, index)}>
                                                        <Tag
                                                            style={{
                                                                width: '20%',
                                                                fontSize: 9,
                                                                marginTop: '8px',
                                                                color: this.state.selected[index] ? 'white' : '#007ae2',
                                                                backgroundColor: this.state.selected[index] ? '#007ae2' : 'white'
                                                            }} onClick={() => this.onSelectClient(tag, index)}>
                                                                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                                                </Tag>
                                                            </div>
                                                        );

                                                        return isLongTag ? (
                                                                <Tooltip title={tag} key={tag}>
                                                                    {tagElem}
                                                                </Tooltip>
                                                            ) : (
                                                                tagElem
                                                            );
                                                    })}

                                                </div>
                                            </div>}
                                        </div>
                                    </label>
                                    {
                                        this.state.suggestionList2.length === 0 ? null :
                                            <Popover
                                                placement="right"
                                                content={
                                                    <div>
                                                        <div>
                                                            This consultant is already submitted on this client:
                                                            <br/>
                                                            {this.state.suggestionList2.map((item) =>

                                                                <div>
                                                                    <div>
                                                                        <h6>Consultant: {item.consultant_name}</h6>
                                                                        <h6>Marketer: {item.marketer_name}</h6>
                                                                        <h6>Client: {item.client}</h6>
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
                                            
                                            <Button  style={{color: 'blue', background: 'white' , marginTop:'20px'}}>Suggestions</Button>
                                        
                                        </Popover>

                                }
                                <label>
                                    Marketing Email:<span style={{color:'red'}}>*</span>
                                    <Input
                                        required
                                        id="outlined-required"
                                        className="form-control"
                                        name="marketing_email"
                                        value={this.state.marketing_email}
                                        onChange={this.handleChange}/>
                                </label>

                                <br/>
                                <label>
                                    Marketing Phone no:<span style={{color:'red'}}>*</span>
                                    <Input
                                        required
                                        id="outlined-required"
                                        className="form-control"
                                        name="marketing_contact"
                                        value={this.state.marketing_contact}
                                        onChange={this.handleChange}/>
                                </label>

                                <br/>

                                    <div className="add_sub_attach">
                                        <label>
                                            Others:
                                            <UploadOutlined/>
                                            <Input type="file" style={{visibility: 'hidden'}}
                                                   onChange={(e) => this.handleChangeFile(e)}/>
                                        </label>
                                    </div>

                                    <div>

                                        {
                                            this.state.attachments.map(item => {


                                                    return (<div className="maindelete">
                                                        <span> {item.attachment_file.split("/")[6]}</span>
                                                        <span style={{marginLeft: '10px'}}>{item.attachment_type}</span>
                                                        <DeleteOutlined className="deleteIcon"
                                                              onClick={() => this.deleteAttachment(item.id)}/>
                                                    </div>)
                                                }
                                            )

                                        }

                                    </div>
                                </div>
                            </div>

                        </div>


                        <br/><br/>

                        <div className="col-md-6">

                        </div>


                    </div>

                    <div className="addsubmission addsubmissionnew">
                        <Button color="primary"
                                onClick={() => this.addSubmission()}>
                            Submit
                        </Button>
                        <Button color="primary"
                                onClick={this.props.handleClose}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>


        );
    }
}

export default AddSub;
