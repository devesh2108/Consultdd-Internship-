import React, {Component} from 'react';
import "../../../App.css";
import {Button, Input, Radio} from "antd";

const {TextArea} = Input;
class InterviewFeedback extends Component {
    constructor(props){
        super(props)
    }

    render() {
        return (

            <div>
                <div style={{position: 'relative', left: 30, top: 10}}>
                    <Radio.Group onChange={this.props.onChange} buttonStyle="solid"
                                 value={this.props.feedbackStatus}>
                        <Radio value="next_round">Next Round</Radio>
                        <Radio value="offer">Offer</Radio>
                        <Radio value="failed">Failed</Radio>
                        <Radio value="cancelled">Cancel</Radio>


                    </Radio.Group>
                </div>
                <div style={{position: 'relative', left: 30, top: 20}}>
                    <label>
                        Feedback Description :
                        <TextArea rows={4} style={{marginTop: 20}} name="feedback_description"
                                  value={this.props.feedback_description} onChange={this.props.handleChange}/>
                    </label>
                </div>
                <Button key="submit" type="primary"
                        onClick={() => this.props.confirm(this.props.feedbackStatus, this.props.interview_id)}>
                    Submit
                </Button>
                <Button key="submitnNext" type="primary"
                        onClick={() => this.props.confirmNext(this.props.feedbackStatus, this.props.interview_id)}>
                    Submit and Next
                </Button>
            </div>

        )
    }
}

export default InterviewFeedback;
