import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Steps, Button, message} from 'antd';
import AddLeadStep from "./addLeadStep";
import {
    getVendorCompanySuggestions,
    addLead,
    getAllVendorByCompany,
    getCities,
    jdParser,
    getAllConsultants,
    getConsultantDetails,
    getSubSuggestions,
    addSubmission,
    didyoumean,
    getSubClientSuggestions,
    updateSubmission
} from "../../../services/service";
import AddSubmissionStep from "./consultantDataStep";
import moment from 'moment-timezone';
import MarketingDataStep from "./MarketingDataStep";

const {Step} = Steps;

const skillList = [
    {id: 1, value: 'Java'},
    {id: 2, value: 'Python'},
    {id: 3, value: 'AWS'},
    {id: 4, value: 'DevOps'},
    {id: 6, value: 'Salesforce'},
    {id: 7, value: 'Peoplesoft'},
    {id: 8, value: 'Workday'},
    {id: 9, value: 'Kronos'},
    {id: 10, value: 'Lawson'},
    {id: 11, value: 'BA'},
    {id: 12, value: 'Full Stack'},
    {id: 13, value: 'Others'},
]

class ThreeStepForm extends Component {

    constructor(props, context) {
        const company = localStorage.getItem('TEAM');
        super(props, context);
        this.state = {
            current: 0,
            leadData: {},
            loading: false,
            error: null,
            vendor: '',
            status: 0,
            companyId: 0,
            leadId: 0,
            vendorList: [],
            job_desc: '',
            location: '',
            company: '',
            addCompany: false,
            addVendor: false,
            companyList: [],
            vendorId: null,
            skill: '',
            secondary_skill: [],
            job_title: '',
            cityList: [],
            parseCityList: [],
            selected: [false],
            sec_selected: [false],
            companyValid: false,
            jdValid: false,
            locationValid: false,
            skillValid: false,
            jtValid: false,
            consultant: '',
            consultant_id: null,
            consultant_name: '',
            consultantList: [],
            resume: null,
            file_data: new FormData(),
            profile: false,
            profile_status: false,
            consultant_profiles: [],
            original_profile: {},
            current_profile: {},
            profile_id: '',
            flag: false,
            title: "",
            disabled: true,
            subConsultantSuggestionList: [],
            subClientSuggestionList: [],
            attachments: [],
            attachedFiles: [],
            attachment_type: 'Resume',
            resume_selected: false,
            consultant_details: {},
            addSub: false,
            submission_id: -1,
            education: '',
            consultant_location: '',
            visa_type: null,
            links: '',
            owner: '',
            dob: null,
            visa_start: null,
            visa_end: null,
            disabled_resume: false,
            disabled_other: false,
            visible: false,
            edit: false,
            key: 0,
            emp: company,
            rate: 0,
            client: '',
            clientList: [],
            marketing_email: '',
            marketing_phone: "",
            clientSelected: [false],
            marketing_id: 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.getCompanySuggestions = this.getCompanySuggestions.bind(this);
        this.getCitySuggestions = this.getCitySuggestions.bind(this);
        this.onSelectCompany = this.onSelectCompany.bind(this);
        this.selectCompany = this.selectCompany.bind(this);
        this.onSelectSkill = this.onSelectSkill.bind(this);
        this.onSelectCity = this.onSelectCity.bind(this);
        this.appendVendor = this.appendVendor.bind(this);
        this.parser = this.parser.bind(this);
        this.getAllConsultant = this.getAllConsultant.bind(this);
        this.getConsultantDetails = this.getConsultantDetails.bind(this);
        this.addSubmission = this.addSubmission.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.attachmentChange = this.attachmentChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.onConsultantChange = this.onConsultantChange.bind(this);
        this.getCurrentProfile = this.getCurrentProfile.bind(this);
        this.selectEmployer = this.selectEmployer.bind(this);
        this.didYouMean = this.didYouMean.bind(this);
        this.onSelectClient = this.onSelectClient.bind(this);
        this.getSubClientSuggestions = this.getSubClientSuggestions.bind(this);
        this.selectVendor = this.selectVendor.bind(this);
        this.vendorStatus = this.vendorStatus.bind(this);
        this.getAllVendorByCompany = this.getAllVendorByCompany.bind(this);
        this.onSelectSecondarySkill = this.onSelectSecondarySkill.bind(this);
    }

    componentWillMount() {
        if (!this.props.first) {
            if (this.props.edit) {
                this.setState({current: 0, edit: this.props.edit})
            } else {
                if (this.props.leadDetails.primary_skill !== null) {
                    skillList.map((skill, index) => {
                            if (skill.value.toLowerCase() === this.props.leadDetails.primary_skill.toLowerCase()) {

                                let selected = [];
                                selected[index] = true
                                this.setState({
                                    skill: this.props.leadDetails.primary_skill,
                                    selected: selected
                                })
                            }
                        }
                    )
                }
                this.setState({
                    current: 1,
                    edit: this.props.edit,
                    job_desc: this.props.leadDetails.job_desc,
                    location: this.props.leadDetails.location,
                    skill: this.props.leadDetails.skill,
                    job_title: this.props.leadDetails.job_title,
                    company: this.props.leadDetails.company_name,
                    companyId: this.props.leadDetails.company_id,
                    leadId: this.props.leadDetails.id
                })
                this.getAllVendorByCompany(this.props.leadDetails.company_id)
            }
        }
        this.getCompanySuggestions("")


    }

    vendorStatus = () => {
        console.log("true")
        this.setState({addVendor: true})
    }

    getCitySuggestions(query) {
        getCities(query)
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

    }


    getCompanySuggestions(query) {

        getVendorCompanySuggestions(query)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                this.setState({
                    companyList: res.results,
                    error: res.error || null,
                    loading: false,
                });
            })
            .catch(error => {
                this.setState({error, loading: false});
            });
    };

    onSelectCompany(data) {
        this.setState({
            company: data.split(",")[1],
            companyId: data.split(",")[0],
            companyValid: false
        })
        //this.setState({companyId:id})
    }

    onSelectCity(data) {
        console.log(data)
        this.setState({
            location: data,
            locationValid: false
        })

    }

    onSelectSkill(data, i) {
        console.log(data)
        let selected = [];
        selected[i] = true
        this.setState({
            skill: data,
            selected: selected,
            skillValid: false,
        })

    }

    handleChange(event) {
        console.log("handle change", event.target.value)

        this.setState({
                [event.target.name]: event.target.value,
                companyValid: false,
                jdValid: false,
                skillValid: false,
                locationValid: false,
                jtValid: false,
            }, () => {
                if (this.state.leadId !== '' && this.state.consultant !== "" && this.state.client.length > 2 && this.state.client !== "") {
                    this.getSubClientSuggestions(this.state.leadId, this.state.consultant, this.state.client)
                }

            }
        )
    };

    handleClose() {
        this.setState({open: false, addCompany: false, addVendor: false, profile: false, addSub: false});

    };

    leadCheck(company) {
        if (company && this.state.job_desc && this.state.location && this.state.skill && this.state.job_title) {
            const current = this.state.current + 1;
            this.setState({current});
        } else if (company === 0) {
            this.setState({companyValid: true})
        }
        if (this.state.job_desc === '') {
            this.setState({jdValid: true})
        }
        if (this.state.skill === '') {
            this.setState({skillValid: true})
        }
        if (this.state.location === '') {
            this.setState({locationValid: true})
        }
        if (this.state.job_title === '') {
            this.setState({jtValid: true})
        }
    }

    addLead(company, id, flag) {
        console.log(company)
        const body = {
            'job_desc': this.state.job_desc,
            'city': this.state.location,
            'primary_skill': this.state.skill,
            'job_title': this.state.job_title,
            'vendor_company': company,
            "status": 'new'
        };
        if (company && this.state.job_desc && this.state.location && this.state.skill && this.state.job_title) {
            addLead(body)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    if (status === 201) {

                        if (flag) {

                            this.props.changeStepCount(2, res.result.id, id);
                        } else {
                            message.success("Requirement Added.")
                            this.props.getLead(res.result)
                            this.props.handleClose()
                        }
                    } else {
                        message.error("Something went wrong.")
                    }

                })
                .catch(error => {
                    console.log(error)
                });
        } else {
            if (company === 0) {
                this.setState({companyValid: true})
            }
            if (this.state.job_desc === '') {
                this.setState({jdValid: true})
            }
            if (this.state.skill === '') {
                this.setState({skillValid: true})
            }
            if (this.state.location === '') {
                this.setState({locationValid: true})
            }
            if (this.state.job_title === '') {
                this.setState({jtValid: true})
            }
        }

    }

    selectCompany(obj) {
        console.log("obj", obj)
        this.state.companyList.push(obj)
        this.setState({
            company: obj.name,
            companyId: obj.id,
            companyValid: false

        })
    }

    appendVendor(obj) {
        console.log(obj)
        let vendor_list = this.state.vendorList;
        vendor_list.push(obj);
        console.log(vendor_list)
        this.setState({
            vendorList: vendor_list
        })
    }

    onSelectSecondarySkill(data,checked, i) {

        const {secondary_skill,sec_selected} = this.state;
        console.log(sec_selected)
        console.log(checked)
        const secondarySkillTags = checked ? [...secondary_skill, data] : secondary_skill.filter(t => t !== data);
        let secondarySkillTagsSelected = checked ? sec_selected[i]=true : sec_selected[i]=false;
        console.log("----sec_selected---",secondarySkillTagsSelected)
        this.setState({
            secondary_skill: secondarySkillTags,
            //sec_selected:secondarySkillTagsSelected
        });


    }

    getAllVendorByCompany(id) {
        console.log(id, "addsubmission")
        getAllVendorByCompany(id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res, "vendorist")
                this.setState({
                    vendorList: res.results,
                    error: res.error || null,
                    loading: false,
                });

                this.setState({status: status})
            })
            .catch(error => {
                console.log(error)
            });

    }

    parser(value) {
        console.log(value)
        const body = {
            "jd": value
        }
        console.log(body)
        jdParser(body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                this.setState({
                    job_title: res.results.ROLE,
                    parseCityList: res.results.LOCATION
                })
                if (res.results.LOCATION.length === 0) {
                    this.getCitySuggestions()
                }

            })
            .catch(error => {
                console.log(error)
            });

    }

    handleChangeFile(event) {
        console.log(event.target.files)


        let attachments = this.state.attachments
        let temp_list = {
            'type': this.state.attachment_type,
            'file': event.target.files[0]
        }
        let fd = this.state.file_data
        // var array = [...this.state.attachments];
        // array.length !== 0 && attachments.map((file,i)=>{
        //      // make a separate copy of the array
        //     if(file.type === 'Resume'){
        //         var index = array.indexOf(file)
        //         if (index !== -1) {
        //             array.splice(index, 1);
        //             console.log(array)
        //             this.setState({attachments: array});
        //
        //         }
        //     }
        //
        // })
        console.log(this.state.attachments)
        //attachments =  array.length !== 0 ?attachments:array;
        if (event.target.files[0].length !== 0) {

            if (this.state.attachment_type === 'Resume') {
                fd.append('file_resume', event.target.files[0])
                this.setState({disabled_resume: true})
            } else {
                fd.append('file_other', event.target.files[0])
                this.setState({disabled_other: true})
            }

            attachments.push(temp_list)

            this.setState({
                attachment_type: '',
                attachments: attachments,
                file_data: fd
            })
        }


    }


    deleteFile(file) {
        console.log(file)
        var array = [...this.state.attachments]; // make a separate copy of the array
        var index = array.indexOf(file)
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({attachments: array});
        }
        if (file.type === 'Resume') {
            this.state.file_data.delete('file_resume')
            this.setState({disabled_resume: false})
        } else {
            this.state.file_data.delete('file_other')
            this.setState({disabled_other: false})
        }
        console.log("this.state.file_data", this.state.file_data)

    }

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
                    consultantList: res.results
                });

                this.setState({status: status})

            })
            .catch(error => {
                console.log(error)
            });
    }

    getConsultantDetails(id) {
        getConsultantDetails(id, true)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log("consultant details", res.results)
                if (status === 200) {
                    this.setState({
                        consultant_details: res.result,
                        consultant: res.result.id,
                        consultant_profiles: res.result.profiles,
                        marketing_id: res.result.marketing_id,
                    }, () => this.getSuggestions(this.state.leadId, res.result.id,this.state.companyId || this.state.new_companyId));

                    //this.getSuggestions(this.props.leadId, res.results.id);
                } else {
                    if (status === 400) {
                        message.error("Something Went Wrong")
                    }
                }

            })
            .catch(error => {
                console.log(error)
            });

    }

    onConsultantChange(value) {
        this.setState({
            visible: false,
            consultant_id: value.split(",")[0],
            consultant_name: value.split(",")[1],
            profile_id: '',
            title: ''
        })
        console.log(`selected ${value}`);
    }

    getCurrentProfile(id) {
        console.log(id, "---------id")
        this.setState({
            profile_id: id,
            disabled: true,
            flag: true,
        });

        if (this.state.consultant_profiles.length != 0) {
            this.state.consultant_profiles.map((item, i) => (

                    item.id == id ? (
                            this.setState({
                                current_profile: item,
                                profile_id: item.id,
                                title: item.title,
                                education: item.education,
                                consultant_location: item.current_city,
                                visa_type: item.visa_type,
                                links: item.links,
                                owner: item.profile_owner.employee_name,
                                dob: moment(item.dob),
                                visa_start: moment(item.visa_start),
                                visa_end: moment(item.visa_end),
                                disabled: true,
                                visible: true,
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
                consultant_location: '',
                visa_type: null,
                links: '',
                owner: this.state.owner,
                dob: null,
                visa_start: null,
                visa_end: null,
                disabled: true,
                visible: false
            })

        }
    }


    attachmentChange(e) {
        console.log(e)
        this.setState({attachment_type: e})
    }

    getSuggestions(id, consultant_name,company_id) {
        getSubSuggestions(id, consultant_name,company_id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                if (status === 200) {
                    this.setState({
                        subConsultantSuggestionList: res.result
                    })
                } else {
                    this.setState({
                        subConsultantSuggestionList: []
                    })
                }


            })
            .catch(error => {
                console.log(error)
            });
    }

    didYouMean(client) {
        console.log(client)
        didyoumean(client)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                //console.log("didyoumean response", res)
                if (status === 200) {
                    this.setState({
                        clientList: res.result
                    })
                } else {
                    message.error("Something Went Wrong!")
                }

            })
            .catch(error => {
                console.log(error)
            });
    };

    getSubClientSuggestions(id, consultant_name, client_name) {
        getSubClientSuggestions(id, consultant_name, client_name)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                //console.log("suggestions response", res)
                if (status === 200) {
                    this.setState({
                        subClientSuggestionList: res.result
                    })
                } else {
                    this.setState({
                        subClientSuggestionList: []
                    })
                }

            })
            .catch(error => {
                console.log(error)
            });
    }

    onSelectClient(data, i) {
        //console.log(data)
        let selected = [];
        selected[i] = true
        this.setState({
            client: data,
            clientSelected: selected,
        })

    }

    selectEmployer(e) {
        this.setState({emp: e});
    }

    addSubmission() {
        this.state.file_data.append('rate', this.state.rate);
        this.state.file_data.append('client', this.state.client);
        this.state.file_data.append('email', this.state.marketing_email);
        this.state.file_data.append('phone', this.state.marketing_phone);
        this.state.file_data.append('vendor_contact', this.state.vendorId);
        this.state.file_data.append('profile_id', this.state.profile_id);
        this.state.file_data.append('marketing_id', this.state.marketing_id);
        this.state.file_data.append('employer', this.state.emp);

        if (this.state.leadId <= 0) {
            this.state.file_data.append('job_desc', this.state.job_desc);
            this.state.file_data.append('job_title', this.state.job_title);
            this.state.file_data.append('city', this.state.location);
            this.state.file_data.append('primary_skill', this.state.skill);
            this.state.file_data.append('vendor_company', this.state.companyId);
        } else {
            this.state.file_data.append('lead', this.state.leadId);
        }


        if (this.state.marketing_email && this.state.marketing_phone && this.state.vendorId) {
            addSubmission(this.state.file_data)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, res]) => {
                    console.log("response", res);
                    if (status === 201) {
                        console.log(status);
                        this.props.getLead(res.lead)
                        message.error("Submission Created")
                        this.props.handleClose()

                    } else {
                        message.error("Something went wrong")
                    }


                })
                .catch(error => {
                    console.log(error)
                });
        } else if (!this.state.vendorId) {
            message.error("Select Vendor")
        }
        if (!this.state.marketing_email) {
            message.error("Fill Marketing Email")
        }
        if (!this.state.marketing_phone) {
            message.error("Fill Marketing Number")
        }

    }

    selectVendor(e) {
        this.setState({vendorId: e})
    }

    consultantCheck() {
        if (this.state.consultant && this.state.profile_id && this.state.attachments.length !== 0) {
            const current = this.state.current + 1;
            this.setState({current});
        } else if (!this.state.consultant) {
            message.error("Select Consultant")

        }
        if (!this.state.profile_id) {
            message.error("Select Profile")

        }
        if (this.state.attachments.length === 0) {
            message.error("Atleast attach resume.")

        }
    }

    next() {
        const current = this.state.current + 1;
        this.setState({current});
    }

    prev() {
        console.log("prev-----------", this.state.leadData)
        const current = this.state.current - 1;
        this.setState({current});
    }

    render() {
        const steps = [
            {
                title: 'Create Lead',
                content: <AddLeadStep
                    disabled={!this.props.edit}
                    job_desc={this.state.job_desc}
                    jdValid={this.state.jdValid}
                    skillList={skillList}
                    skillValid={this.state.skillValid}
                    selected={this.state.selected}
                    sec_selected={this.state.sec_selected}
                    parseCityList={this.state.parseCityList}
                    cityList={this.state.cityList}
                    locationValid={this.state.locationValid}
                    location={this.state.location}
                    job_title={this.state.job_title}
                    jtValid={this.state.jtValid}
                    companyList={this.state.companyList}
                    companyValid={this.state.companyValid}
                    company={this.state.company}
                    secondary_skill={this.state.secondary_skill}
                    parser={this.parser}
                    handleChange={this.handleChange}
                    onSelectSkill={this.onSelectSkill}
                    onSelectCity={this.onSelectCity}
                    getCitySuggestions={this.getCitySuggestions}
                    onSelectCompany={this.onSelectCompany}
                    selectCompany={this.selectCompany}
                    getCompanySuggestions={this.getCompanySuggestions}
                    onSelectSecondarySkill={this.onSelectSecondarySkill}

                />,
            },
            {
                title: 'Consultant Details',
                content: <AddSubmissionStep
                    consultantList={this.state.consultantList}
                    consultant_profiles={this.state.consultant_profiles}
                    subConsultantSuggestionList={this.state.subConsultantSuggestionList}
                    attachment_type={this.state.attachment_type}
                    attachments={this.state.attachments}
                    visible={this.state.visible}
                    title={this.state.title}
                    consultant_location={this.state.consultant_location}
                    consultant_name={this.state.consultant_name}
                    education={this.state.education}
                    visa_type={this.state.visa_type}
                    owner={this.state.owner}
                    links={this.state.links}
                    dob={this.state.dob}
                    visa_start={this.state.visa_start}
                    visa_end={this.state.visa_end}
                    disabled_resume={this.state.disabled_resume}
                    disabled_other={this.state.disabled_other}
                    handleChangeFile={this.handleChangeFile}
                    deleteFile={this.deleteFile}
                    onConsultantChange={this.onConsultantChange}
                    getConsultantDetails={this.getConsultantDetails}
                    getCurrentProfile={this.getCurrentProfile}
                    attachmentChange={this.attachmentChange}
                    getAllConsultant={this.getAllConsultant}
                />,
            },
            {
                title: 'Marketing Details',
                content: <MarketingDataStep
                    addVendor={this.state.addVendor}
                    vendorList={this.state.vendorList}
                    emp={this.state.emp}
                    rate={this.state.rate}
                    client={this.state.client}
                    clientList={this.state.clientList}
                    selected={this.state.clientSelected}
                    subClientSuggestionList={this.state.subClientSuggestionList}
                    marketing_email={this.state.marketing_email}
                    marketing_phone={this.state.marketing_phone}
                    companyName={this.state.company}
                    companyId={this.state.companyId}
                    handleClose={this.handleClose}
                    selectVendor={this.selectVendor}
                    appendVendor={this.appendVendor}
                    handleChange={this.handleChange}
                    didYouMean={this.didYouMean}
                    vendorStatus={this.vendorStatus}
                    onSelectClient={this.onSelectClient}
                    selectEmployer={this.selectEmployer}
                    getSubClientSuggestions={this.getSubClientSuggestions}
                    getAllVendorByCompany={this.getAllVendorByCompany}

                />
            },
        ];

        const {current} = this.state;
        return (


            <div>

                <div className="three_steps">
                    <Steps style={{marginBottom: '20px'}} current={current}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title}/>
                        ))}
                    </Steps>
                </div>

                <div className="steps-content">{steps[current].content}</div>


                <br clear="all"/>


                <div className="steps-action">
                    {current === 0 && this.props.edit &&
                    <Button type="primary" onClick={() => this.leadCheck(this.state.companyId)}>
                        Save and add resume
                    </Button>
                    }
                    {current === 0 && !this.props.edit &&
                    <Button type="primary" onClick={() => this.next()}>
                        Next
                    </Button>
                    }
                    {current === 0 && this.props.edit && (
                        <Button type="primary"
                                onClick={() => this.addLead(this.state.companyId, this.state.vendorId, false)}>
                            Save and Exit
                        </Button>
                    )}
                    {current < steps.length - 1 && current !== 0 && (
                        <Button type="primary" onClick={() => this.consultantCheck()}>
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={() => this.addSubmission()}>
                            Done
                        </Button>
                    )}
                    {current > 0 && (
                        <Button style={{marginLeft: 8}} onClick={() => this.prev()}>
                            Previous
                        </Button>
                    )}
                </div>


            </div>


        );
    }
}

export default ThreeStepForm;
