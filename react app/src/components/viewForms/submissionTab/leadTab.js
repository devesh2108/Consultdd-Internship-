import React, {Component} from 'react';
import "../../../App.css";
import {Button, Form, Input, message, Select, Tag, Tooltip} from "antd";
import Icon from "@ant-design/icons"
import {getCities,updateLead} from "../../../services/service";

const {TextArea} = Input;

class LeadTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            job_desc: '',
            job_title: '',
            location: '',
            company: '',
            primary_skill: '',
            status: false,
            jd_Valid: false,

        }
    }


    componentDidMount() {
        this.setState({
            job_title: this.props.leadData.job_title,
            job_desc: this.props.leadData.job_desc,
            primary_skill: this.props.leadData.primary_skill,
            location: this.props.leadData.city,
            company: this.props.leadData.vendor_company_name,
            jd_Valid: this.props.leadData.job_desc === null,
            locationValid: this.props.leadData.city === null,
        })
    }

    handleChange = (event) => {
        console.log(event.target.value)
        if(event.target.value !== undefined && event.target.value !== "") {
            this.setState({
                job_desc: event.target.value,
                jdValid: false
            })
        }
        else{
            this.setState({
                job_desc:"",
                jdValid: true
            })
        }

    }
    editLead=()=> {
        const body = {
            'lead_id': this.props.leadData.id,
            'job_desc': this.state.job_desc,
        };
        if (!this.state.locationValid && !this.state.jdValid) {
            updateLead(body,this.props.leadData.id)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    if(status !== 202){
                        message.error("Something went wrong.")
                    }
                    else{
                        message.success("Requirement updated")
                        this.setState({
                            job_title: this.props.leadData.job_title,
                            job_desc: res.result.job_desc,
                            primary_skill: this.props.leadData.primary_skill,
                            location: res.result.city,
                            company: this.props.leadData.vendor_company_name,
                        },()=>this.props.unsetEdit())
                    }

                })
                .catch(error => {
                    console.log(error)
                });
        }
        else
            message.error("Please fill all the details")

    }
    handleCancel=()=>{
        this.setState({
            job_title: this.props.leadData.job_title,
            job_desc: this.props.leadData.job_desc,
            primary_skill: this.props.leadData.primary_skill,
            location: this.props.leadData.city,
            company: this.props.leadData.vendor_company_name,
        },()=>this.props.unsetEdit())
    }




    render() {
        const data= JSON.parse(localStorage.getItem("DATA"));
        const name= data.employee_name
        return (
            <div className="addleadform">

                <div className="col-md-12 col-sm-12 col-xs-12">

                    <Form layout='vertical'>
                        <Form.Item
                            label={<span>{ name === this.props.leadData.owner &&<span
                                style={{color: 'red', fontSize: 9}}>*</span>
                            } Job Description </span>}>

                            {!this.props.edit ?
                                <span>{this.state.job_desc}</span> :
                                <TextArea
                                    onChange={this.handleChange}
                                    name="job_desc"
                                    value={this.state.job_desc}
                                    placeholder="Job Description" className="nweleadjd"
                                    style={{width: '100%', overflowY: 'scroll'}}
                                    autosize={{minRows: 10, maxRows: 25}}/>}

                            {this.state.jd_Valid && <label>
                                            <span
                                                style={{color: 'red', fontSize: 11}}>JD Cannot be empty</span>
                            </label>}

                        </Form.Item>

                    </Form>

                </div>

                <div className="col-md-6 col-sm-6 col-xs-12">

                    <div className="row">
                        <div className="col-md-12">
                            <Form layout='vertical'>
                                <Form.Item label={<span style={{fontSize: 13}}>Job Location</span>}>
                                        <span>{this.state.location}</span>
                                </Form.Item>
                            </Form>
                        </div>

                    </div>
                    { name === this.props.leadData.owner &&
                        <Icon type="edit" onClick={this.props.setEdit}/>

                    }
                </div>
                <div className="row">

                    <div className="col-md-6 col-sm-6 col-xs-12">
                        <div className="col-md-12">
                            <Form layout='vertical'>
                                <Form.Item
                                    label={<span>Primary Skill</span>}>
                                    <span>{this.state.primary_skill}</span>
                                </Form.Item>

                            </Form>
                        </div>
                        <div className="col-md-12">
                            <Form layout='vertical'>
                                <Form.Item
                                    label={<span>Job Title</span>}>
                                    <span>{this.state.job_title}</span>
                                </Form.Item>
                            </Form>

                        </div>
                        <div className="col-md-12">
                            <Form layout='vertical'>
                                <Form.Item
                                    label={<span>Vendor Company</span>}>
                                    <span>{this.state.company}</span>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>


                </div>
                {this.props.edit ?
                    <div className="col-md-12">
                        <div className="formbutoon1">
                            <Button onClick={this.editLead}>Submit</Button>
                            <Button onClick={this.handleCancel}>Cancel</Button>
                        </div>
                    </div>:null
                }
            </div>


        )
    }
}

export default LeadTab;
