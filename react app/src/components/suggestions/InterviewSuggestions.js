import React, {Component} from 'react';
import 'antd/dist/antd.css';
import moment from "moment";

const INTERVIEW_MODES = [
    {
        key: 'dial-in', value: "Dial In"
    },
    {
        key: 'hangout', value: "Hangout"
    },
    {
        key: 'skype', value: "Skype"
    },
    {
        key: 'telephonic', value: "Telephonic"
    },
    {
        key: 'video_call', value: "Video"
    },
    {
        key: 'voice_call', value: "Voice Call"
    },
    {
        key: 'webex', value: "Webex"
    },
]
class InterviewSuggestions extends Component {

    render() {

        return (
            <div>
                This consultant is already submitted on this vendor:
                <br/>
                {this.props.suggestions.map((item) =>

                    <div>
                        <div>
                            <h6>Consultant: {item.consultant_name}</h6>
                            <h6>Marketer: {item.marketer_name}</h6>
                            <h6>Vendor: {item.company_name}</h6>
                            <h6>Client: {item.client}</h6>
                            <h6>Supervisor: {item.supervisor_name}</h6>
                            <h6>Screening Type: {item.screening_type}</h6>
                            <h6>Interview Mode: {INTERVIEW_MODES.map((mode,index)=>mode.key ===item.interview_mode ? mode.value :null)}</h6>
                            <h6>Start Time: {moment(item.start_time).format("DD-MM-YYYY T HH:mm")}</h6>
                            <h6>End Time: {moment(item.end_time).format("DD-MM-YYYY T HH:mm")}</h6>

                        </div>
                        <br/>

                    </div>
                )}
            </div>

        );
    }
}

export default InterviewSuggestions;
