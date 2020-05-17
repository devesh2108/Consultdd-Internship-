import React, {Component} from 'react';
import "../../App.css";
import 'antd/dist/antd.css';
import {Button, Menu, Dropdown, Select, Rate} from "antd";
import Feedback from '../Consultant/feedbackForm/feedBack'
import {getfeedback} from '../../services/service'
import HTTP_400 from "../Error/HTTP_400";

const FEEDBACK_TYPE = [
    {key: "pre_joining", value: "Pre Joining"},
    {key: "screening", value: "Screening"},
    {key: "training", value: "Training"},
    {key: "engineering", value: "Engineering"},
];

class FeedbackTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            feedbackType: "pre_joining",
            visible: false,
            type: 'Pre Joining',
            minHeight: 300,
            feedbackList: [],
            show: 'Show More',
            showFlag: [false],
            minHeight: ['300px'],
        }
    }

    componentDidMount() {
        this.getfeedback(this.props.consultantId, 'pre_joining')
    }


    handleClick = (e) => {
        this.setState({
            feedbackType: e.key,
            visible: true,
        });

    }
    handleChange = (e) => {
        this.setState({
            type: e
        }, () => {
            this.getfeedback(this.props.consultantId, this.state.type)
        })
    }

    handleCancel = e => {
        this.setState({
            visible: false,
        }, () => this.getfeedback(this.props.consultantId, this.state.feedbackType));
    };
    setShow = (flag, i) => {
        let array = this.state.showFlag.slice();
        let minHeight = this.state.minHeight.slice();
        console.log(flag)
        array[i] = flag;
        minHeight[i] = flag ? 'auto' : '300px'
        console.log("array-----", array)
        console.log("minHeight-----", minHeight)
        if (!flag) {
            this.setState({
                showFlag: array,
                minHeight: minHeight

            })
        }
        else {
            this.setState({
                showFlag: array,
                minHeight: minHeight
            })
        }
    }

    getfeedback(id, type) {
        getfeedback(id, type)
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
                } else if (status === 200) {
                    console.log(res.results);
                    let minHeight = this.state.minHeight;
                    res.results.map((feedback, i) =>
                        minHeight[i] = '300px'
                    )

                    this.setState({
                        feedbackList: res.results,
                        minHeight: minHeight,
                    })
                }
                this.setState({
                    status: status
                })
            })
            .catch(error => console.log(error))
    }

    setFeedbackData = (data, type) => {
        let array = this.state.feedbackList;
        array.push(data);
        this.setState({
            feedbackList: array
        })
    }

    showMore = () => {
        this.setState({cardWidth: 700})
    }

    render() {
        const menu = (
            <Menu>
                {FEEDBACK_TYPE.map((feedback, index) =>
                    <Menu.Item key={feedback.key} onClick={(e) => this.handleClick(e)}>
                        {feedback.value}
                    </Menu.Item>
                )}

            </Menu>
        );

        return (<div>
            <br/>
            <div className="main_feedbackhead_dropdown">
                <Select
                    style={{width: '220px'}}
                    value={this.state.type}
                    onChange={this.handleChange}
                    placeholder=" Select Feedback"
                >
                    {FEEDBACK_TYPE.map((feedback, index) =>

                        <Select.Option
                            value={feedback.key}>{feedback.value}</Select.Option>
                    )}
                </Select>

                <Dropdown overlay={menu}>
                    <Button>Add Feedback</Button>
                </Dropdown>
            </div>
            <div style={{minHeight: '300px'}}>
                {this.state.feedbackList.length > 0 ?
                    this.state.feedbackList.map((feedback, i) =>
                        <div className="main_feedbackhead"
                             style={{height: this.state.minHeight[i], minHeight: '300px', overflow: 'hidden'}}>
                            <div className="feedbackhead">
                                <ul>
                                    <li> {feedback.given_by.employee_name.split(" ")[0].charAt(0).toUpperCase() + feedback.given_by.employee_name.split(" ")[1].charAt(0).toUpperCase()} </li>
                                    <li><span style={{
                                        color: '#000',
                                        fontWeight: 600
                                    }}>{feedback.given_by.employee_name}</span><span>left {FEEDBACK_TYPE.map((f) => {
                                        if (feedback.feedback_type === f.key) return f.value
                                    })} feedback</span></li>
                                    <li> {new Date(feedback.created).toDateString()} </li>
                                </ul>
                            </div>

                            <div className="overallhead">
                                <label>Overall Rating</label>
                                <Rate allowHalf value={feedback.rating}/>
                                {feedback.rating < 2 ? 'Poor' : feedback.rating < 3 && feedback.rating > 2 ? 'Below Average' : feedback.rating < 4 && feedback.rating > 3 ? 'Average' : 'Good' }
                            </div>

                            <div className="mainfeedback">
                                <label>Communication</label>
                                <p>{feedback.feedback.communication}</p>
                            </div>

                            <div className="mainfeedback">
                                <label>Experience</label>
                                <p>{feedback.feedback.experience}</p>
                            </div>

                            <div className="mainfeedback">
                                <label>Organizational abilities</label>
                                <p>{feedback.feedback.organizational}</p>
                            </div>

                            <div className="mainfeedback">
                                <label>Problem solving</label>
                                <p>{feedback.feedback.problem_solving}</p>
                            </div>

                            <div className="mainfeedback">
                                <label>Role-related knowledge</label>
                                <p>{feedback.feedback.role_knowledge}</p>
                            </div>

                            <div className="mainfeedback">
                                <label>Programming skills</label>
                                <p>{feedback.feedback.programming}</p>
                            </div>

                            <div className="mainfeedback">
                                <label>Any remark</label>
                                <p>{feedback.remark}</p>
                            </div>
                            {
                                !this.state.showFlag[i] ?
                                    <span style={{
                                        position: 'absolute',
                                        right: 10,
                                        bottom: 10,
                                        color: '#2fa6ff',
                                        borderBottom: 'solid',
                                        borderBottomHeight: '0.5px',
                                        fontWeight: 400,
                                        cursor: 'pointer'
                                    }}
                                          onClick={() => this.setShow(true, i)}>Show More</span>
                                    :
                                    <span style={{
                                        position: 'absolute',
                                        right: 10,
                                        bottom: 10,
                                        color: '#2fa6ff',
                                        borderBottom: 'solid',
                                        borderBottomHeight: '0.5px',
                                        fontWeight: 400,
                                        cursor: 'pointer'
                                    }}
                                          onClick={() => this.setShow(false, i)}>Show Less</span>
                            }

                        </div>
                    ):
                    <HTTP_400/>
                }

            </div>

            {this.state.visible ?
                <Feedback
                    visible={this.state.visible}
                    feedBackType={this.state.feedbackType}
                    consultantId={this.props.consultantId}
                    handleClose={this.handleCancel}
                    setFeedbackData={this.setFeedbackData}
                /> : null}
        </div>)

    }
}

export default FeedbackTab;
