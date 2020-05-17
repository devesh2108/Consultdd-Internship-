import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Button, Select, DatePicker, message, Input} from "antd";
import {createRateRevision} from '../../../services/service';
import moment from "moment";
const {TextArea} = Input;


class RateRevisionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rate: '',
            rate_start: null,
            feedback: ""
        }

    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onRateStartChange = (date) => {
        this.setState({
            rate_start: date
        })
    }
    onSubmit = () => {
        const body = {
            rate: this.state.rate,
            start: moment(this.state.rate_start).format("YYYY-MM-DD"),
            feedback: this.state.feedback,
            consultant: this.props.consultantId,
        }
        createRateRevision(this.props.consultantId,body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {

                if (status === 201) {
                    message.success("Rate Revised.")
                    this.props.setRateRevisedData(res.result)
                }
            })
            .catch(error => {
                console.log(error);
            });
    }


    render() {
        return (
            <div>
                <div>
                    <label>Rate:</label>
                <Input name="rate" value={this.state.rate} onChange={this.handleChange}/>
                </div>
                <div>
                    <label>Rate Start:</label>
                <DatePicker
                    format="YYYY-MM-DD"
                    value={this.state.rate_start}
                    placeholder="Rate Start Date"
                    onChange={this.onRateStartChange}
                />
                </div>
                <div>
                    <label>Feedback:</label>
                <TextArea name="feedback" value={this.state.feedback} onChange={this.handleChange}/>
                </div>
                <div>
                <Button onClick={this.onSubmit}>Submit</Button>
                <Button onClick={this.props.handleClose}>Cancel</Button>
                </div>


            </div>
        )

    }
}

export default RateRevisionForm;
