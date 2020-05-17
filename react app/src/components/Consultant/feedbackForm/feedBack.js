import React, {Component} from "react";
import {Modal, Button, Rate, Select, Input} from "antd";
import {createfeedback} from "../../../services/service"

const {TextArea} = Input;

const FEEDBACK_TYPE = [
    {key: "pre_joining", value: "Pre Joining"},
    {key: "screening", value: "Screening"},
    {key: "training", value: "Training"},
    {key: "engineering", value: "Engineering"},
];

const roleArray = [
    {"key": "hr", name: "HR"},
    {"key": "superadmin", name: "Super Admin"},
    {"key": "admin", name: "Admin"},
    {"key": "marketer", name: "Marketer"},
    {"key": "recruiter", name: "Recruiter"},
    {"key": "relation_manager", name: "Relation"},
    {"key": "trainer", name: "Trainer"},
    {"key": "finance", name: "Finance"},
    {"key": "consultant", name: "Consultant"},
    {"key": "interviwee", name: "Interviewee"},
];

export default class Feedback extends Component {

    constructor(props) {
        super(props);
        this.state = {
            experience: "",
            communication: "",
            problem_solving: "",
            programming: "",
            organizational: "",
            role_knowledge: "",
            remark: "",
            rating: 0,
            role: null,
            feedbackType:''
        };

    }
    componentDidMount(){
        FEEDBACK_TYPE.map((feedback, index)=> {
            if (this.props.feedBackType === feedback.key) {
                 this.setState({feedbackType:feedback.value})
            }
        })
    }

    handleOk = ()=> {
        const data = JSON.parse(localStorage.getItem('DATA'));
        const id = data.id;


        const body = {
            feedback: this.state.feedback,
            experience: this.state.experience,
            communication: this.state.communication,
            problem_solving: this.state.problem_solving,
            programming: this.state.programming,
            organizational: this.state.organizational,
            role: this.state.role_knowledge,
            remark: this.state.remark,
            rating: this.state.rating,
            feedback_type: this.props.feedBackType,
            given_by: id,
        };

        console.log("BODY-----", body);
        createfeedback(this.props.consultantId,this.props.feedBackType,body)
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
                } else if(status === 200) {
                    this.props.setFeedbackData(res.result,this.props.feedBackType)
                    this.props.handleClose()
                }
            })
            .catch(error=>console.log(error))
        this.props.handleClose();


    }

    changeRating = (newRating, name)=> {
        this.setState({
            rating: newRating
        });
    }


    handleChange = role => {
        this.setState({role: role});

    };

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});

    }

    render() {

        const {selectedOption} = this.state;
        return (
            <div>


                <Modal
                    title="FEEDBACK"
                    className="feedbackpopup"
                    visible={this.props.visible}
                    onOk={this.handleOk}
                    onCancel={this.props.handleClose}
                >

                    {/*<Select*/}
                    {/*    style={{width: '220px'}}*/}
                    {/*    value={this.state.role}*/}
                    {/*    onChange={this.handleChange}*/}
                    {/*    placeholder=" Select Role"*/}
                    {/*>*/}
                    {/*    {roleArray.map((item, i) => (*/}

                    {/*        <Select.Option*/}
                    {/*            value={item.key}>{item.name}</Select.Option>*/}
                    {/*    ))}*/}
                    {/*</Select>*/}

                    <br/>

                    <div className="row">

                        <div className="col-md-6">

                            {/*<div className="feedback_sec">*/}
                                {/*<span>Feedback:</span>*/}
                                {/*<TextArea rows={4} onChange={this.onChange} name="feedback"*/}
                                          {/*value={this.state.feedback}/>*/}
                            {/*</div>*/}

                            <div className="feedback_sec">
                                <span>Experience:</span>
                                <TextArea rows={2} onChange={this.onChange} name="experience"
                                          value={this.state.experience}/>
                            </div>

                            <div className="feedback_sec">
                                <span>Communication:</span>
                                <TextArea rows={2} onChange={this.onChange} name="communication"
                                          value={this.state.communication}/>
                            </div>

                            <div className="feedback_sec">
                                <span>Problem Solving:</span>
                                <TextArea rows={2} onChange={this.onChange} name="problem_solving"
                                          value={this.state.problem_solving}/>
                            </div>

                            <div className="feedback_sec">
                                <span>Rating:</span>
                                <Rate allowHalf value={this.state.rating} onChange={this.changeRating}/>
                            </div>

                        </div>


                        <div className="col-md-6">

                            <div className="feedback_sec">
                                <span>Programming:</span>
                                <TextArea rows={2} onChange={this.onChange} value={this.state.programming}
                                          name="programming"/>
                            </div>

                            <div className="feedback_sec">
                                <span>Organizational:</span>
                                <TextArea rows={2} onChange={this.onChange} name="organizational"
                                          value={this.state.organizational}/>
                            </div>

                            <div className="feedback_sec">
                                <span>Remark:</span>
                                <TextArea rows={2} onChange={this.onChange} name="remark" value={this.state.remark}/>
                            </div>
                            <div className="feedback_sec">
                                <span>Role Knowledge:</span>
                                <TextArea rows={2} onChange={this.onChange} name="role_knowledge" value={this.state.role_knowledge}/>
                            </div>

                            <div className="feedback_type">
                                <span>Feedback Type:</span>
                                <Input value={this.state.feedbackType} disabled='true'/>
                            </div>

                        </div>

                    </div>

                </Modal>


            </div>
        );
    }
}

