import React, {Component} from 'react';
import 'antd/dist/antd.css';
import moment from 'moment';
import Button from "@material-ui/core/Button";
import {DatePicker} from "antd";
import {createProject, getAllConsultants} from "../../services/service";
import {Select, message} from "antd";


class AddProject extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            payment_term: null,
            invoice_period: 7,
            project_start: null,
            project_end: null,
            duration: null,
            end_reason: "",
            consultant_joined: null,
            joining_status: null,
            consultant_status: null,
            consultantList: [],
            durationValid:false
        };
        this.handleChange = this.handleChange.bind(this);
        this.addProject = this.addProject.bind(this);
        this.onStartChange = this.onStartChange.bind(this);
        this.onEndChange = this.onEndChange.bind(this);
    }

    componentWillMount() {
        this.getAllConsultant()
    }

    handleChange(event) {

        this.setState({[event.target.name]: event.target.value},()=>{


        if(this.state.project_start !== null && this.state.duration !== ''){
        let durationValid;
                 if (this.state.duration !== '') {
                            durationValid=/^\d+$/.test(this.state.duration)
                        }
                 this.setState({
                 durationValid:durationValid
                 })
                 if(durationValid){
                 let start_date = moment(this.state.project_start).format("YYYY-MM-DD")
                                     let end_date = moment(start_date).add(this.state.duration, 'months')
                 this.setState({
                        project_end: moment(end_date)})
        }
        }
        })
    };

    getAllConsultant() {
        getAllConsultants()
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res.results);
                this.setState({
                    consultantList: res.results,
                    flag: status
                });

            })
            .catch(error => {
                console.log(error)
            });
    }

    addProject() {
        const project_start = this.state.project_start != null ? moment(this.state.project_start).format("YYYY-MM-DD") : null;
       // const project_end = this.state.project_end != null ? moment(this.state.project_end).format("YYYY-MM-DD") : null;
        const body = {
            "submission": this.props.submissionId,
            "start_date": project_start,
            "duration": this.state.duration,
        };
        if(this.props.submissionId && project_start && this.state.duration && this.state.durationValid) {
            createProject(body)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                if(status === 201){
                    this.props.handleClose();
                }
                else{
                    message.error("Something went wrong")
                }

                })
        }
        else{
            message.error("Please fill all the details")
        }
    }

    onStartChange = (value) => {
        this.setState({project_start: value})
    };
    onEndChange = (value) => {
        this.setState({project_end: value})
    };

    onConsultantChange(value) {
        this.setState({consultant_joined: value})
        console.log(`selected ${value}`);
    }

    render() {
        return (
            this.state.flag === 200 ?


                <div>

                    <div style={{marginTop: '20px'}}>

                        <div className="poform">

                            <div className="">
                                {/* <div className="col-md-6 col-sm-6 col-xs-12"> */}
                                    {/*<label>*/}
                                        {/*Payment term(in days):*/}
                                        {/*<select*/}
                                            {/*required*/}
                                            {/*className="form-control"*/}
                                            {/*value={this.state.payment_term}*/}
                                            {/*onChange={this.handleChange}*/}
                                            {/*>*/}
                                            {/*<option value="net_10">NET-10</option>*/}
                                            {/*<option value="net_15">NET-15</option>*/}
                                            {/*<option value="net_20">NET-20</option>*/}
                                            {/*<option value="net_30">NET-30</option>*/}
                                            {/*<option value="net_45">NET-45</option>*/}
                                        {/*</select>*/}
                                    {/*</label>*/}
                                    {/*<br/>*/}
                                {/* </div> */}

                                <div className="col-md-12 col-sm-12 col-xs-12">
                                    {/*<label>*/}
                                        {/*Invoice Period:*/}
                                        {/*<br/>*/}
                                        {/*<select*/}
                                            {/*required*/}
                                            {/*className="form-control"*/}
                                            {/*onChange={(e) => this.setState({invoice_period: e.target.value})}>*/}
                                            {/*<option value="7">Weekly</option>*/}
                                            {/*<option value="15">Bi-Weekly</option>*/}
                                            {/*<option value="30">Monthly</option>*/}
                                        {/*</select>*/}
                                    {/*</label>*/}
                                    {/*<br/>*/}

                                    <label>
                                        Start Date:
                                        <br/>
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            value={this.state.project_start}
                                            placeholder="Project Start"
                                            onChange={this.onStartChange}
                                        />
                                    </label>
                                    <br/>

                                    {/*<label>*/}
                                        {/*End Date:*/}
                                        {/*<br/>*/}
                                        {/*<DatePicker*/}
                                            {/*format="YYYY-MM-DD"*/}
                                            {/*value={this.state.project_end}*/}
                                            {/*placeholder="Project End"*/}
                                            {/*onChange={this.onEndChange}*/}
                                        {/*/>*/}
                                    {/*</label>*/}
                                    {/*<br/>*/}


                                    <label>
                                        Duration(in months):
                                        <input
                                            required
                                            id="outlined-required"
                                            className="form-control"
                                            name="duration"
                                            value={this.state.duration}
                                            onChange={this.handleChange}/>
                                    </label>
                                    <br/>
                                    {!this.state.durationValid && <span style={{fontSize:9,color:'red'}}>Accepts only number</span>}
                                    {
                                        this.state.durationValid &&
                                    <div>
                                    <label>Approx. End Date:
                                    </label>
                                    <br/>
                                    <span>{moment(this.state.project_end).format("YYYY-MM-DD")}</span>
                                    <br/>
                                    </div>
                                        }
                                    {/*<br/>*/}
                                    {/*<label>*/}
                                        {/*Status:*/}
                                        {/*<select*/}
                                            {/*className="form-control"*/}
                                            {/*value={this.state.consultant_status}*/}
                                            {/*onChange={this.handleChange}*/}
                                        {/*>*/}
                                            {/*<option value="offer">Offer</option>*/}
                                            {/*<option value="joined">Joined</option>*/}
                                            {/*<option value="not-joined">Not Joined</option>*/}
                                            {/*<option value="extended">Extended</option>*/}
                                        {/*</select>*/}
                                    {/*</label>*/}
                                    <br/>
                                    
                                    <Button onClick={this.props.handleClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={this.addProject} color="primary">
                                        Add PO
                                    </Button>

                                </div>
                            </div>


                           
                        </div>

                    </div>
                </div>
                : null
        );
    }
}

export default AddProject;
