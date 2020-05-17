import React from 'react'
import "react-tabs/style/react-tabs.css";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Lead from "../marketingHomeView/lead";
import Submission from "../marketingHomeView/submission";
import Bench from "../consultant";
import PO from "../marketingHomeView/po";
import {Link} from 'react-router-dom'
import Interview from '../marketingHomeView/interview'
import 'antd/dist/antd.css';
class Home extends React.Component  {
    constructor(props, context) {
        super(props, context);
        this.state = {
            key: 'leads',
            selectedIndex: 0,
            consultant_id: -1,
            tab_flag: true,
            flag: false,
            mapleadData: [],
            mapconsultantData: [],
            temp: false,
            role: '',

        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.mapLeadData = this.mapLeadData.bind(this);
        this.setMapStatus = this.setMapStatus.bind(this);
        this.setInterviewTab = this.setInterviewTab.bind(this);
        this.mapConsultantData = this.mapConsultantData.bind(this);
        this.setSubmission = this.setSubmission.bind(this);

    }

    setMapStatus(value) {
        this.setState({flag: value})
    }

    mapLeadData(value) {
        this.setState({mapleadData: value})

    }

    mapConsultantData(value) {
        console.log(value)
        this.setState({mapconsultantData: value})
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false, profile: false, addUser: false});
    }

    componentDidMount() {
        const data = JSON.parse(localStorage.getItem('DATA'));

        if (!data) {
            this.props.history.push("/login")
        }
        else{
            this.props.history.push("/home")
        }

    }

    handleSelect = index => {
        this.setState({selectedIndex: index, tab_flag: true});
    };

    callSubmission = (value) => {
        this.setState({
            selectedIndex: 1,
            consultant_id: value,
            tab_flag: false
        });

    };

    setInterviewTab() {
        this.setState({
            selectedIndex: 2,
        });

    }

    setSubmission() {
        this.setState({selectedIndex: 1})
    }

    callInterview = (value) => {
        this.setState({
            selectedIndex: 2,
            consultant_id: value,
            tab_flag: false
        });

    };

    // callPO = () => {
    //     this.setState({selectedIndex: 3});
    // };
    //
    // callBench = () => {
    //     this.setState({selectedIndex: 4});
    // };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    // getRandormColor(){
    //     var letters = '0123456789ABCDEF';
    //     var color = '#';
    //     for (var i = 0; i < 6; i++) {
    //         color += letters[Math.floor(Math.random() * 16)];
    //     }
    //     return color;
    // }

    render() {
        return (
            <Tabs
                selectedIndex={this.state.selectedIndex}
                onSelect={this.handleSelect}
            >
                <TabList style={{backgroundColor: 'transparent'}}>
                    <Tab eventkey="leads" title="Leads">
                        <Link to={"/home/lead"}>
                            Requirements
                        </Link>
                    </Tab>
                    <Tab eventkey="submission" title="Submission">
                        <Link to={"/home/submission"}>
                            Submission
                        </Link>
                    </Tab>
                    <Tab eventkey="interview" title="Interview">
                        <Link to={"/home/interview"}>
                            Interview
                        </Link>
                    </Tab>
                    <Tab eventkey="project" title="Project">
                        <Link to={"/home/po"}>
                            Purchase Order
                        </Link>
                    </Tab>
                </TabList>

                <TabPanel>

                    <Lead
                        setArchive={this.props.setArchive}
                        setSubmission={this.setSubmission}
                        history={this.props.history}
                        tab_flag={this.state.tab_flag}
                        mapLeadData={this.mapLeadData}
                        flag={this.state.flag}
                        mapleadData={this.state.mapleadData}
                        setMapStatus={this.setMapStatus}
                        hideMap={this.state.hideMap}
                    />
                </TabPanel>

                <TabPanel>
                    <Submission
                        setSubmission={this.setSubmission}
                        history={this.props.history}
                        setInterviewTab={this.setInterviewTab}
                        consultant_id={this.state.consultant_id}
                        tab_flag={this.state.tab_flag}
                    />
                </TabPanel>
                <TabPanel>
                    <Interview
                        history={this.props.history}
                        setInterviewTab={this.setInterviewTab}
                        consultant_id={this.state.consultant_id}
                        tab_flag={this.state.tab_flag}
                    />
                </TabPanel>
                <TabPanel>
                    <PO
                        tab_flag={this.state.tab_flag}
                        history={this.props.history}
                        consultant_name={this.state.consultant_name}
                    />
                </TabPanel>
            </Tabs>


        );


    }
}

export default Home;
