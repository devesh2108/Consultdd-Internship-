import React from 'react';

import 'antd/dist/antd.css';
import {Button, Input, message, Modal, Radio} from 'antd';
import {updateScreening} from "../../services/service";

const { TextArea } = Input;

export default class InterviewFeedbackModal extends React.Component {
    constructor() {
        super();
        this.state={
            feedbackStatus:'',
            description:''
        }
        // this.onButtonClick = this.onButtonClick(this);

    }

    onChange = e => {
        this.setState({
            feedbackStatus: e.target.value,
        });
    };

    render() {

        return(
            <div style={{marginTop:'30px',width:'90%'}}>
                <div style={{position: 'relative', left: 30, top: 10}}>
                    <Radio.Group onChange={this.onChange} buttonStyle="solid"
                                 value={this.state.feedbackStatus}>
                        <Radio value="next_round">Next Round</Radio>
                        <Radio value="offer">Offer</Radio>
                        <Radio value="failed">Failed</Radio>

                    </Radio.Group>
                </div>
                <div style={{position: 'relative', left: 30, top: 20}}>
                    <label>
                        Feedback Description :
                        <TextArea rows={4} style={{marginTop: 20}} name="description"
                                  value={this.state.description} onChange={this.handleChange}/>
                    </label>
                </div>
                <Button key="submit" type="primary"
                        onClick={() => this.confirm(this.state.feedbackStatus, this.props.interview_id)}>
                    Submit
                </Button>
                <Button key="submitnNext" type="primary"
                        onClick={() => this.confirmNext(this.state.feedbackStatus, this.props.interview_id, this.props.submission_id)}>
                    Submit and Next
                </Button>
            </div>
        );
    }
}

