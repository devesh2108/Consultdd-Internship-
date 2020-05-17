import React, {Component} from 'react';
import "../../../App.css";
import { Popconfirm, Spin, Tabs} from 'antd';
import {ArrowLeftOutlined,UploadOutlined,DeleteOutlined,DownloadOutlined} from "@ant-design/icons"
import SubmissionTab from "../../viewForms/submissionTab/submissionTab";
import LeadTab from "./leadTab";
import InterviewTab from "./interviewTab";
import SubPOTab from "./poTab";
import {addAttachment, deleteAttachment, getUniqueSubmission} from "../../../services/service";
import moment from "moment-timezone";


const {TabPane} = Tabs;

class DetailTabView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            status: "",
            edit: false,
            tabStatus: "",
            activeInterview: "",
            selected: [false],
            currentRoundData: {},
            is_active: false,
            consultant_name: "",
            attachments: [],
            active_resume: false,
            active_other: false,
            documentLoading: false,
            canEdit: ""
        }

    }

    componentDidMount() {

        this.getUniqueSubmission(this.props.sub_id);

    }

    getUniqueSubmission(id) {

        this.setState({
            documentLoading: true
        })
        const data = JSON.parse(localStorage.getItem('DATA'));
        const marketer = data.id;
        getUniqueSubmission(id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                let tabStatus, activeInterview = 0;
                let currentRoundData = {};
                if (res.results.attachments.length === 0) {
                    this.setState({
                        active_resume: true
                    })
                } else {
                    res.results.attachments.map((file, i) => {

                        if (file.type === "resume") {
                            this.setState({
                                active_resume: false,
                            })
                        }
                    })
                }
                if (this.props.round !== null) {
                    res.results.interviews.map((interview, index) => {
                        if (interview.round === this.props.round) {

                            activeInterview = interview.round;
                            currentRoundData = interview;
                        }
                    })
                } else {
                    res.results.interviews.map((interview, index) => {
                        if (interview.round === 1) {
                            console.log("interview----", interview)
                            activeInterview = interview.round;
                            currentRoundData = interview;
                        }
                    })
                }

                if (res.results.project === null) {
                    if (res.results.interviews.length === 0) {
                        tabStatus = "sub";
                    } else {
                        tabStatus = "interview"
                    }
                } else {
                    tabStatus = "po"
                }
                console.log("currentRoundData----", currentRoundData)
                this.setState({
                    data: res.results,
                    attachments: res.results.attachments,
                    canEdit: res.results.status,
                    status: status,
                    tabStatus: tabStatus,
                    activeInterview: activeInterview,
                    currentRoundData: currentRoundData,
                    is_active: marketer === res.results.marketer_id,
                    consultant_name: res.results.consultant.name,
                    documentLoading: false
                })
            })
            .catch(error => {
                console.log(error)
            });
    };

    handleChangeFile = (event, type) => {
        console.log(event.target.files[0])
        this.setState({
            documentLoading: true
        })
        const formData = new FormData();
        formData.append("object_id", this.props.sub_id)
        formData.append("obj_type", "submission");
        formData.append("attachment_type", type);
        formData.append('file', event.target.files[0]);
        if (event.target.files[0] !== undefined) {
            addAttachment(formData)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    let attachments = this.state.attachments;
                    attachments.push(res.result)
                    if (type === 'resume') {
                        this.setState({active_resume: true})
                    }
                    this.setState({
                        attachments: attachments,
                        documentLoading: false
                    })

                })
                .catch(error => {
                    console.log(error)
                });

        }


    }
    deleteFile = (id, type) => {
        let arr = [];
        this.setState({
            documentLoading: true
        })
        deleteAttachment(id)
            .then((response) => {

                const statusCode = response.status;

                arr = this.state.attachments.filter(function (item) {
                    return item.id !== id
                })
                if (type === "resume") {
                    this.setState({
                        active_resume: true
                    })
                }
                this.setState({attachments: arr, documentLoading: false})

                return Promise.all([statusCode, response]);
            })
            .catch(error => {
                console.log(error)
            });

    }

    setEdit = () => {
        this.setState({
            edit: true
        })
    };

    unsetEdit = () => {
        this.setState({
            edit: false
        })
    };


    render() {
        return (
            this.state.status === 200 &&
            <div>

                <div className="sub_new_view2">

                    <ul>
                        <li><ArrowLeftOutlined style={{color: '#fff', fontSize: '20px'}}
                                  onClick={this.props.handleClose}/></li>
                        <li>
                            <h2 style={{color: '#fff'}}>{this.state.consultant_name}</h2>
                        </li>
                    </ul>
                    <div className="box1"></div>
                </div>

                <div>
                    <div className="col-md-8">
                        <Tabs
                            type="card"
                            defaultActiveKey={this.props.currentKey.toString()}
                            activeKey={this.props.currentKey.toString()}
                            onChange={this.props.handleSelect}
                        >
                            <TabPane key="1" tab="Requirements">
                                <LeadTab leadData={this.state.data.lead} edit={this.state.edit} setEdit={this.setEdit}
                                         unsetEdit={this.unsetEdit}/>
                            </TabPane>
                            <TabPane key="2" tab="Submission">
                                <SubmissionTab
                                    submissionData={this.state.data}
                                    is_active={this.state.is_active}
                                    canEdit={this.state.canEdit}

                                />
                            </TabPane>
                            {this.state.tabStatus === "interview" || this.state.tabStatus === "po" ?
                                <TabPane key="3" tab="Interview">
                                    <InterviewTab currentRoundData={this.state.data.interviews[0]}
                                                  interviewData={this.state.data.interviews}
                                                  is_active={this.state.is_active}
                                                  activeInterview={this.state.activeInterview}

                                    />
                                </TabPane>
                                : null
                            }
                            {
                                this.state.tabStatus === "po" ?
                                    <TabPane key="4" tab="Project">
                                        <SubPOTab
                                            is_active={this.state.is_active}
                                            poData={this.state.data}

                                        />
                                    </TabPane> : null
                            }
                        </Tabs>
                    </div>
                    {this.props.popOver &&
                    <Popconfirm
                        title="Are you sure delete this task?"
                        onConfirm={this.props.confirm}
                        onCancel={this.props.cancel}
                        okText="Yes"
                        cancelText="No"
                    />
                    }

                    <div className="col-md-4">

                        <div className="profile_title">
                            <h1> Profile </h1>
                        </div>


                        <div className="right_profile_section">
                            <ul>

                                <li>
                                    <span>Date of Birth:</span>{this.state.data.date_of_birth !== null && moment(this.state.data.date_of_birth).format("YYYY-MM-DD")}
                                </li>
                                <li><span>Visa Type:</span> {this.state.data.visa_type}</li>
                                <li>
                                    <span>Visa Start:</span>{this.state.data.visa_start !== null && moment(this.state.data.visa_start).format("YYYY-MM-DD")}
                                </li>
                                <li>
                                    <span>Visa End:</span>{this.state.data.visa_end !== null && moment(this.state.data.visa_end).format("YYYY-MM-DD")}
                                </li>
                                <li><span>City: </span>{this.state.data.current_city}</li>
                                <li><span>Education:</span> {this.state.data.education}</li>
                                <li><span>Links:</span> {this.state.data.linkedin}</li>
                                <br/>
                                <li><span>Owner:</span>{this.state.data.owner}</li>
                            </ul>
                        </div>
                        {
                            this.state.is_active ?
                                !this.state.documentLoading ?
                                    <div>

                                        {
                                            this.state.active_resume && <label className="uploadnew">
                                                Attach resume
                                                <UploadOutlined/>
                                                <input type="file" style={{visibility: 'hidden'}}
                                                       onClick={(event) => {
                                                           event.target.value = null
                                                       }}
                                                       onChange={(e) =>
                                                           this.handleChangeFile(e, 'resume')}/>
                                            </label>
                                        }
                                        <label className="uploadnew">
                                            Other Documents
                                            <UploadOutlined/>
                                            <input type="file" style={{visibility: 'hidden'}}
                                                   onClick={(event) => {
                                                       event.target.value = null
                                                   }}
                                                   onChange={(e) =>
                                                       this.handleChangeFile(e, 'other')}/>
                                        </label>
                                        {this.state.attachments.length !== 0 && this.state.attachments.map((item, index) =>
                                            <div key={index}>
                                                <span> {item.file_name}</span>
                                                <span style={{marginLeft: '10px'}}>{item.attachment_type}</span>
                                                <DeleteOutlined className="deleteIcon" onClick={()=>this.deleteFile(item.id, item.attachment_type)}/>
                                                <DownloadOutlined />

                                                <br/>
                                            </div>
                                        )}
                                    </div>
                                    :
                                    <Spin size="small">Loading...</Spin>
                                : null
                        }

                    </div>
                </div>


            </div>


        )
    }
}

export default DetailTabView;
