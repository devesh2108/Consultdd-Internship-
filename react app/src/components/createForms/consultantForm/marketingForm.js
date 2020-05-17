import React, {Component} from 'react';
import {
    addConsultantToMarketing, getTeam,getMarketerList,getCities
} from "../../../services/service";

import Button from "@material-ui/core/Button";
import {DatePicker, Select, Form, message, Checkbox, Tooltip, Tag, Spin,Popconfirm} from "antd";
import 'antd/dist/antd.css';
import {CheckBoxSelection, Inject, MultiSelectComponent} from '@syncfusion/ej2-react-dropdowns';
import moment from 'moment-timezone'

const skillList = [
    {id: 1, value: 'Java'},
    {id: 2, value: 'Python'},
    {id: 3, value: 'AWS'},
    {id: 4, value: 'DevOps'}, //Other Developer
    {id: 6, value: 'Salesforce'},
    {id: 7, value: 'Peoplesoft'},
    {id: 8, value: 'Workday'},
    {id: 9, value: 'Kronos'},
    {id: 10, value: 'Lawson'},
    {id: 11, value: 'BA'}, //Analyst
    {id: 12, value: 'Full Stack'},
    {id: 13, value: 'Others'},
]
const workType = [
    {
        id: 'c2c',
        name: 'C2C'
    },
    {
        id: 'full_time',
        name: 'Full Time'
    }
]
const visa_type = [
    "",
    "CPT",
    "H1B",
    "H4-EAD",
    "GC-EAD",
    "Green Card",
    "OPT",
    "OPT-EXT",
    "USC",
    "OPT EAD",
    "Asylam Visa",
    "Not Auth",
    "Other"
];

class MarketingForm extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            error: null,
            status: false,
            skill: [],
            team: [],
            rtg: false,
            in_pool: false,
            fields: {text: 'label', value: 'value'},
            team_status: '',
            teamList: [],
            primary_marketer: '',
            preferred_location: '',
            marketing_startDate: null,
            data: [],
            value: [],
            guest: [],
            rate_start: null,
            disabled_pref: false,
            marketerList:[],
            assignedMarketerList: [],
            assignedTeamList:[],
            cityList:[]
        }

        this.handleChange = this.handleChange.bind(this);
        this.getMarketerList = this.getMarketerList.bind(this);
        this.addConsultantToMarketing = this.addConsultantToMarketing.bind(this);
        this.handleChangePrimarySelect = this.handleChangePrimarySelect.bind(this);
    }

    componentDidMount() {
        this.getTeamList()
        this.getMarketerList("")
    }


    getMarketerList(param) {

        getMarketerList(param)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                if (status === 401) {
                    localStorage.removeItem('DATA');
                    this.props.history.push('/login')
                } else {
                    let temp = {}
                    let temp_list = []
                    res.results.map((item, i) => {
                        temp =
                            {
                                label: item.name,
                                value: item.id
                            }
                        temp_list.push(temp)

                    })

                    this.setState({marketerList: temp_list, status: true})
                }

            })
            .catch(error => {
                console.log(error)
            });
    }
    getCitySuggestions(param){
        getCities(param)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                this.setState({
                    cityList: res.results,
                    error: res.error || null,
                });
            })
            .catch(error => {
                this.setState({error, loading: false});
            });

    };

    onSelectCity =(data)=>{
        this.setState({
            preferred_location:data
        })

    }

    selectMarketer(data) {
        let marketer_list = this.state.assignedMarketerList;
        if (marketer_list.indexOf(data) >= 0) {
            let index = marketer_list.indexOf(data);
            marketer_list.splice(index, 1);
        } else {
            marketer_list.push(data);
        }


        this.setState({assignedMarketerList: marketer_list})

    }

    handleChangePrimarySelect (value) {
        this.setState({
            primary_marketer: value
        });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value});
    }
    
    addConsultantToMarketing() {
        const id=localStorage.getItem("CON")
        const body = {
            "marketing_start": moment(this.state.marketing_startDate).format("YYYY-MM-DD"),
            "preferred_location": this.state.preferred_location,
            "rate": this.state.rate,
            "rate_start": this.state.rate_start,
            "primary_marketer": this.state.primary_marketer,
            "teams": this.state.team,
        }
        console.log("add profile", body)
        if (
            this.state.in_pool !== '' &&
            this.state.preferred_location !== '' &&
            this.state.primary_marketer !== '' &&
            this.state.rate_start !== null &&
            this.state.marketing_startDate !== null &&
            this.state.team.length !== 0
        ) {
            addConsultantToMarketing(id,body)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    console.log(res)
                    if (status === 201) {
                       message.success("Marketing details added.")
                        this.props.closeModal()
                    } else if (status === 400) {
                        message.error("Consultant already exists.")
                    }

                })
                .catch(error => {
                    console.log(error)
                });
        } else {
            message.error("Please fill all the details.")

        }


    }

    rtgChecked = (e) => {
        this.setState({
            rtg: e.target.checked,
        })
    }

    inPoolChecked = (e) => {
        this.setState({
            in_pool: e.target.checked,
        })
    }

    onRateStartChange = (value) => {
        this.setState({rate_start: value})
    }

    getTeamList() {
        getTeam()
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
                    localStorage.removeItem('ID');
                    localStorage.removeItem('NAME');
                    this.props.history.push('/login')
                } else {
                    console.log(res.results)
                    res.results.map((item, i) => (
                        this.state.teamList.push(item)
                    ))
                    let temp = {}
                    let temp_list = []
                    res.results.map((item, i) => {
                        temp =
                            {
                                label: item.name,
                                value: item.name
                            }
                        temp_list.push(temp)

                    })
                    console.log(temp_list)
                    this.setState({teamList: temp_list, team_status: status})
                }

            })
            .catch(error => {
                console.log(error)
            });
    }
    selectTeamList = (data) => {
        let team_list = this.state.assignedTeamList;
        let total_teams = this.state.teamList;
        let value={}
        if (team_list.indexOf(data) >= 0) {
            let index = team_list.indexOf(data);
            team_list.splice(index, 1);

        } else {
            team_list.push(data);

        }
            this.setState({
                assignedTeamList: team_list,
            })


    }


    render() {
        const {fetching, data, value} = this.state;
        return (

            this.state.team_status === 200 ?
                <div>


                    <div className="submissionform submissionform_new">
                        <div className="applysubmission">
                            <div className="col-md-12">

                                <div className="row">
                                    <div className="col-md-6">
                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>Marketing Start Date

                                            <br/>
                                            <DatePicker
                                                format="YYYY-MM-DD"
                                                value={this.state.marketing_startDate}
                                                placeholder="Marketing Start Date"
                                                onChange={this.onStartChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <ul className="preflocationlist">
                                            <li>
                                                <label><span style={{color: 'red', fontSize: 9}}>*</span>Preferred
                                                    Location:

                                                    <Select
                                                        showSearch
                                                        value={this.state.preferred_location}
                                                        style={{width: '100%'}}
                                                        placeholder="Job Location"
                                                        optionFilterProp="children"
                                                        onChange={(e) => console.log(e)}
                                                        onSelect={(e) => this.onSelectCity(e)}
                                                        onSearch={(e) => this.getCitySuggestions(e)}
                                                    >
                                                        {
                                                            this.state.cityList.map((item, i) => (
                                                                <Select.Option
                                                                    value={item.name + "," + item.state}>{item.name + " ," + item.state}</Select.Option>
                                                            ))}
                                                    </Select>


                                                </label>
                                            </li>
                                            <li><label><span style={{color: 'red', fontSize: 9}}>*</span>RTG
                                                <Checkbox
                                                    checked={this.state.rtg}
                                                    onChange={this.rtgChecked}/>

                                            </label>
                                            </li>
                                        </ul>
                                    </div>

                                </div>
                                <div className="row">

                                    <div className="col-md-6">


                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>Team:
                                            <Select
                                                showSearch
                                                style={{width: '100%'}}
                                                placeholder="Team List"
                                                optionFilterProp="children"
                                                onChange={(e) => this.selectTeam(e)}
                                                value={this.state.team}
                                                filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {this.state.teamList.map((item, i) => (
                                                    <Select.Option value={item.name} key={i}>{item.name}</Select.Option>
                                                ))}
                                            </Select>
                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <label><span style={{color: 'red', fontSize: 9}}>*</span>Primary
                                            Marketer</label>

                                        <Select
                                            showSearch
                                            allowClear
                                            placeholder="Select marketer"
                                            filterOption={false}
                                            onSearch={this.getMarketerList}
                                            onChange={this.handleChangePrimarySelect}
                                            style={{width: '100%', height: '30px'}}
                                        >
                                            {data.map(d => <Select.Option key={d.value}>{d.text}</Select.Option>)}
                                        </Select>

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">

                                        <ul className="consultantsec">

                                            <li><label><span style={{color: 'red', fontSize: 9}}>*</span>Rate
                                                <input
                                                    placeholder="$"
                                                    id="outlined-required"
                                                    className="form-control"
                                                    name="rate"
                                                    value={this.state.rate}
                                                    onChange={this.handleChange}/>
                                            </label></li>
                                            <li><label><span style={{color: 'red', fontSize: 9}}>*</span>Rate
                                                Start</label>
                                                <DatePicker
                                                    format="YYYY-MM-DD"
                                                    value={this.state.rate_start}
                                                    placeholder="Rate Start Date"
                                                    onChange={this.onRateStartChange}
                                                />
                                            </li>


                                            <li>
                                                <label><span style={{color: 'red', fontSize: 9}}>*</span>In pool
                                                    <Checkbox
                                                        onChange={this.inPoolChecked}/>

                                                </label></li>

                                        </ul>

                                    </div>

                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <label>Marketer:</label>
                                    <MultiSelectComponent id="checkbox"
                                                          dataSource={this.state.marketerList}
                                                          getDataByValue={(value) => this.selectMarketer(value)}
                                                          fields={this.state.fields}
                                                          placeholder="Select Marketer"
                                                          className="marketer_textbox"
                                                          mode="CheckBox"
                                                          selectAll={true}
                                                          selectAllText="Select All"
                                                          unSelectAllText="Unselect All"
                                                          showSelectAll={true}>
                                        <Inject services={[CheckBoxSelection]}/>
                                    </MultiSelectComponent>
                                </div>
                                    <div className="col-md-6">
                                        <label>Teams:</label>

                                        <MultiSelectComponent
                                            id="checkbox"
                                            dataSource={this.state.teamList}
                                            getDataByValue={(value) => this.selectTeamList(value)}
                                            fields={this.state.fields}
                                            placeholder="Select Team"
                                            mode="CheckBox"
                                            selectAll={true}
                                            selectAllText="Select All"
                                            unSelectAllText="unSelect All"
                                            showSelectAll={true}>
                                            <Inject services={[CheckBoxSelection]}/>
                                        </MultiSelectComponent>
                                    </div>
                                </div>

                            </div>

                        </div>
                        <br/><br/>


                    </div>

                    <div className="addprofilebuttons">
                        <div>
                            <Button color="primary" onClick={this.addConsultantToMarketing}>
                                Submit
                            </Button>
                            <Button onClick={this.props.handleClose} color="primary">
                                Cancel
                            </Button>
                        </div>

                    </div>
                </div>

                : <div>
                Loading...
            </div>
        );
    }
}

export default MarketingForm;
