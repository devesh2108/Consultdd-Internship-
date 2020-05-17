import React, {Component} from 'react';
import { getConsultantDetails, addNewProfile, updateProfile} from "../services/service";
import {DatePicker, Select,Form,message} from "antd";
import moment from 'moment-timezone';
import 'antd/dist/antd.css';

const id = localStorage.getItem('ID');

const visa_type=[
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
]

class ViewConsultant extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            error: null,
            key: 0,
            consultant: '',
            consultant_id: this.props.consultant_id,
            status: 0,
            consultantList: [],
            profile: false,
            profile_status: false,
            consultant_profiles: [],
            original_profile: {},
            current_profile: {},
            profile_id: 0,
            flag:false,
            editProfile:false,
            marketing_email:'',
            title:"",
            disabled: true,
            hideButton:true,
            rate:0,
            email:'',
            skill:'',
            team:'',
            rtg:null,
            gender:null,
            ssn:0,
            phone_no:'',
            owner_id:'',
            skype_id:'',
            consultant_name:'',

        };

        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.getConsultantDetails = this.getConsultantDetails.bind(this);
        this.onStartChange = this.onStartChange.bind(this);
        this.onVisaStartChange = this.onVisaStartChange.bind(this);
        this.onVisaEndChange = this.onVisaEndChange.bind(this);
        this.addProfile = this.addProfile.bind(this);
        this.editProfile = this.editProfile.bind(this);
        this.onEditCancel = this.onEditCancel.bind(this);
        this.onAddCancel = this.onAddCancel.bind(this);
    }

    shouldComponentUpdate(nextProps) {

        console.log("next , props","modalisopen", nextProps.consultant_id,this.props.consultant_id,nextProps.modalIsOpen)
        let status = (this.props.consultant_id != nextProps.consultant_id)
        console.log(status, "status")
        if(nextProps.modalIsOpen){
            return !status;
        }
        else {
            return status;
        }

    }
    componentWillMount() {
        this.getConsultantDetails(this.props.consultant_id)
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    closeModal() {
        this.setState({profile: false});
    }

    openModal() {
        this.setState({profile: true});
    }

    getConsultantDetails(id) {

        getConsultantDetails(id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                this.setState({
                    email: res.results.email,
                    skill: res.results.skills,
                    rtg: res.results.rtg,
                    rate:res.results.rate,
                    team:res.results.teams,
                    ssn:res.results.ssn,
                    phone_no:res.results.phone_no,
                    skype_id:res.results.skype,
                    consultant_name:res.results.name,

                });
                console.log(res.results.gender)
                if(res.results.gender ==='female'){
                    this.setState({
                        gender:"Female"
                    })
                }
                else{
                    this.setState({
                        gender:"Male"
                    })

                }
                this.setState({consultant_profiles: res.results.profiles});

                this.state.consultant_profiles.map((item, i) =>

                    item.is_original === true ? (

                        this.setState({
                            current_profile: item,
                            original_profile: item,
                            profile_id: item.id,
                            title: item.title,
                            education: item.education,
                            location: item.location,
                            visa_type: item.visa_type,
                            links: item.links,
                            owner_id:item.owner_id,

                            dob: moment(item.dob),
                            visa_start: item.visa_start === null? null:moment(item.visa_start),
                            visa_end:item.visa_end === null? null: moment(item.visa_end),
                            profile_status: true
                        })
                    ) : null
                )
                this.setState({status: status})


            })
            .catch(error => {
                console.log(error)
            });

    }

    onConsultantChange(value) {
        this.setState({consultant_id:value})
    }

    onConsultantSearch(val) {
    }

    getCurrentProfile(id) {

        if (this.state.consultant_profiles.length != 0) {
            this.state.consultant_profiles.map((item, i) => (

                    item.id == id ? (
                            this.setState({
                                current_profile: item,
                                profile_id: item.id,
                                title: item.title,
                                education: item.education,
                                location: item.location,
                                visa_type: item.visa_type,
                                links: item.links,
                                owner_id:item.owner_id,
                                dob: moment(item.dob),
                                visa_start: moment(item.visa_start),
                                visa_end: moment(item.visa_end),
                                disabled:true
                            }))
                        : null
                )
            )
        } else {
            this.setState({
                current_profile: {},
                profile_id: 0,
                title: '',
                education: '',
                location: '',
                visa_type: null,
                links: '',
                owner_id:this.state.owner_id,
                dob: null,
                visa_start: null,
                visa_end: null,
                disabled:true
            })

        }
    }

    onStartChange = (value) => {
        this.setState({dob: value})
    };

    onVisaStartChange = (value) => {
        this.setState({visa_start: value})
    };
    onVisaEndChange = (value) => {
        this.setState({visa_end: value})
    };

    addProfile() {
        const body={
            "title":this.state.title,
            "location":this.state.location,
            "consultant": this.state.consultant_id,
            "education": this.state.education,
            "visa_type": this.state.visa_type,
            "links": this.state.links,
            "dob": moment(this.state.dob).format("YYYY-MM-DD"),
            "visa_start": moment(this.state.visa_start).format("YYYY-MM-DD"),
            "visa_end": moment(this.state.visa_end).format("YYYY-MM-DD")
        }
        addNewProfile(body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                this.state.consultant_profiles.push(res.result)
                this.setState({
                    current_profile: res.result,
                    consultant_id:res.result.consultant,
                    profile_id: res.result.id,
                    title: res.result.title,
                    education: res.result.education,
                    location: res.result.location,
                    visa_type: res.result.visa_type,
                    links: res.result.links,
                    dob: moment(res.result.dob),
                    visa_start: moment(res.result.visa_start),
                    visa_end: moment(res.result.visa_end)
                })
                message.success("Profile Created.")


            })
            .catch(error => {
                console.log(error)
            });


    }

    editProfile(){
        let self=this;
        const body={
            "id":self.state.profile_id,
            "title":this.state.title,
            "location":this.state.location,
            "consultant": this.state.consultant_id,
            "education": this.state.education,
            "visa_type": this.state.visa_type,
            "links": this.state.links,
            "dob": moment(this.state.dob).format("YYYY-MM-DD"),
            "visa_start": moment(this.state.visa_start).format("YYYY-MM-DD"),
            "visa_end": moment(this.state.visa_end).format("YYYY-MM-DD")
        }
        updateProfile(body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                message.success("Profile Updated.")

            })
            .catch(error => {
                console.log(error)
            });

    }

    onAddCancel() {
        this.setState({
            current_profile: this.state.original_profile,
            profile_id: this.state.original_profile.id,
            title: this.state.original_profile.title,
            education: this.state.original_profile.education,
            location: this.state.original_profile.location,
            visa_type: this.state.original_profile.visa_type,
            links: this.state.original_profile.links,

            dob: moment(this.state.original_profile.dob),
            visa_start: moment(this.state.original_profile.visa_start),
            visa_end: moment(this.state.original_profile.visa_end),
            disabled: true,
            flag: true,
            hideButton: true
        })

    }

    onEditCancel() {
        this.setState({
            current_profile: this.state.current_profile,
            profile_id: this.state.current_profile.id,
            title: this.state.current_profile.title,
            education: this.state.current_profile.education,
            location: this.state.current_profile.location,
            visa_type: this.state.current_profile.visa_type,
            links: this.state.current_profile.links,

            dob: moment(this.state.current_profile.dob),
            visa_start: moment(this.state.current_profile.visa_start),
            visa_end: moment(this.state.current_profile.visa_end),
            disabled: true,
            hideButton: true,
            flag: true
        })

    }
    render() {
        console.log(this.state.owner_id,parseInt(id))

        return (

            this.state.status === 200 ?


                <div>
                <div className="benchsec1">
                <div className="submissionform submissionform2">
                    <div><h3>{this.state.consultant_name}</h3></div>
                    <div className="col-md-6 col-sm-6 col-xs-12">
                    <div className="submissionleft_sec">
                    {this.state.consultant_profiles.length != 0 ?
                        <div>
                           <label> Profile: </label>
                            <Select
                                showSearch
                                value={this.state.title}
                                style={{width: '90%'}}
                                placeholder="Select a profile"
                                optionFilterProp="children"
                                onChange={(e) => {
                                    this.setState({profile_id:e,
                                        addProfile:false,
                                        disabled: true,
                                        flag:true,
                                        hideButton:true})
                                    this.getCurrentProfile(e)

                                }}
                                onSearch={this.onConsultantSearch}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {this.state.consultant_profiles.map((item, i) => (

                                    <Select.Option value={item.id}>{item.title}</Select.Option>
                                ))}
                            </Select>
                            {/*<Icon variant="light" style={{}} onClick={() =>*/}
                                {/*this.setState({*/}
                                    {/*current_profile: {},*/}
                                    {/*profile_id: this.state.original_profile.id,*/}
                                    {/*title: '',*/}
                                    {/*education: this.state.original_profile.education,*/}
                                    {/*location: this.state.original_profile.location,*/}
                                    {/*visa_type: this.state.original_profile.visa_type,*/}
                                    {/*links: this.state.original_profile.links,*/}
                                    {/*dob: moment(this.state.original_profile.dob),*/}
                                    {/*visa_start: moment(this.state.original_profile.visa_start),*/}
                                    {/*visa_end: moment(this.state.original_profile.visa_end),*/}
                                    {/*flag: false,*/}
                                    {/*disabled: false,*/}
                                    {/*hideButton: false*/}
                                {/*})*/}
                            {/*}> add</Icon>*/}

                        </div>
                        :

null}

                </div>

                        <div className="row">

                            <div className="Manageleftsection"></div>

                            <div className="col-md-6">

                                <Form.Item label="Email">
                                {this.state.email}  
                                </Form.Item>       

                                <Form.Item label="Skill">
                                {this.state.skill}
                                </Form.Item>    

                                <Form.Item label="SSN">
                                    {this.state.ssn}
                                </Form.Item>
                                
                                <Form.Item label="Gender">
                                    {this.state.gender}
                                </Form.Item>

                            </div>


                            <div className="col-md-6">

                                <Form.Item label="Rate">
                                    {this.state.rate}
                                </Form.Item>            
                                
                                <Form.Item label="Teams">
                                    {this.state.team.map((team,i)=> <div>{team.name}</div>)}

                                </Form.Item>
                                <Form.Item label="Phone Number">   
                                    {this.state.phone_no}

                                </Form.Item>
                                <Form.Item label="Skype ID">
                                    {this.state.skype_id}

                                </Form.Item>
                                
                                <Form.Item label="RTG">
                                <input type="checkbox" checked={this.state.rtg} disabled={true}/>
                                </Form.Item>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-6 col-sm-6 col-xs-12">

                        <div className="mainform rightmainform">
                            <div className="headform">
                                {this.state.original_profile === this.state.current_profile?'Profile Details':!this.state.flag  && !this.state.disabled ? ' Add Profile' : 'Edit Profile'}
                            </div>

                            <div className="mainform2">
                                <div className="row">

                                    <div className="col-md-6">
                                        <label>
                                            Title Suffix:
                                            <input
                                                disabled={this.state.disabled}
                                                id="outlined-required"
                                                className="form-control"
                                                name="title"
                                                value={this.state.title}
                                                onChange={this.handleChange}/>
                                        </label>
                                        <br/>
                                        <label>
                                            Date of Birth:
                                            <br/>
                                            <DatePicker
                                                disabled={this.state.disabled}
                                                format="YYYY-MM-DD"
                                                value={this.state.dob}
                                                placeholder="Date of birth"
                                                onChange={this.onStartChange}
                                            />
                                        </label>
                                        <br/>
                                        <label>
                                            Education:
                                            <input
                                                required
                                                disabled={this.state.disabled}
                                                id="outlined-required"
                                                className="form-control"
                                                name="education"
                                                value={this.state.education}
                                                onChange={this.handleChange}/>
                                        </label>
                                        <br/>
                                        <label>
                                            Current Location:
                                            <input
                                                required
                                                disabled={this.state.disabled}
                                                id="outlined-required"
                                                className="form-control"
                                                name="location"
                                                value={this.state.location}
                                                onChange={this.handleChange}/>
                                        </label>
                                        <br/>

                                    </div>

                                    <div className="col-md-6">


                                        <label>
                                            Visa Type:
                                            <br/>
                                            <select
                                                value={this.state.visa_type}
                                                className="form-control" disabled={this.state.disabled}
                                                    onChange={(e) => this.setState({visa_type: e.target.value})}>
                                                {visa_type.map((item)=><option value={item}>{item}</option>)}
                                            </select>
                                        </label>
                                        <br/>
                                        <label>
                                            Visa Start Date:
                                            <br/>
                                            <DatePicker
                                                disabled={this.state.disabled}
                                                format="YYYY-MM-DD"
                                                value={this.state.visa_start}
                                                placeholder="Visa Start"
                                                onChange={this.onVisaStartChange}
                                            />
                                        </label>
                                        <br/>
                                        <label>
                                            Visa End Date:
                                            <br/>
                                            <DatePicker
                                                disabled={this.state.disabled}
                                                format="YYYY-MM-DD"
                                                value={this.state.visa_end}
                                                placeholder="Visa End"
                                                onChange={this.onVisaEndChange}
                                            />
                                        </label>
                                        <br/>
                                        <label>
                                            LinkedIN:
                                            <input type="text"
                                                   disabled={this.state.disabled}
                                                   name="links"
                                                   onChange={this.handleChange}
                                                   required
                                                   id="outlined-required"
                                                   className="form-control"
                                                   value={this.state.links}/>
                                        </label>
                                        <br/>
                                        <br/>
                                        <br/>



                                    </div>

                                    {/*{ this.state.original_profile === this.state.current_profile ? null :*/}
                                        {/*<div className="addprofilebuttons">*/}
                                            {/*{this.state.hideButton ?*/}
                                                {/*this.state.flag && !this.state.disabled ?*/}
                                                    {/*<Button onClick={() => this.setState({*/}
                                                        {/*disabled: false,*/}
                                                        {/*hideButton: false,*/}
                                                        {/*flag: false,*/}
                                                        {/*title: ''*/}
                                                    {/*})}*/}
                                                            {/*color="primary">*/}
                                                        {/*Add Profile*/}
                                                    {/*</Button> :*/}
                                                    {/*<Button onClick={() => this.setState({*/}
                                                        {/*disabled: false,*/}
                                                        {/*hideButton: false,*/}
                                                        {/*flag: true*/}
                                                    {/*})}*/}
                                                            {/*color="primary">*/}
                                                        {/*Edit Profile*/}
                                                    {/*</Button>*/}
                                                {/*:*/}
                                                {/*!this.state.flag && !this.state.disabled ?*/}
                                                    {/*<div>*/}
                                                        {/*<Button onClick={this.addProfile} color="primary">*/}
                                                            {/*Submit*/}
                                                        {/*</Button>*/}
                                                        {/*<Button onClick={this.onAddCancel} color="primary">*/}
                                                            {/*Cancel*/}
                                                        {/*</Button>*/}
                                                    {/*</div> :*/}
                                                    {/*<div>*/}
                                                        {/*<Button onClick={this.editProfile} color="primary">*/}
                                                            {/*Submit*/}
                                                        {/*</Button>*/}
                                                        {/*<Button onClick={this.onEditCancel} color="primary">*/}
                                                            {/*Cancel*/}
                                                        {/*</Button>*/}
                                                    {/*</div>*/}
                                            {/*}*/}
                                        {/*</div>*/}
                                    {/*}*/}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                </div>
                 </div>
                : <div>
                    Loading.....
                </div>
        );
    }
}

export default ViewConsultant;

