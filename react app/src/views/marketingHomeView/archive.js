import React, {Component} from 'react';
import {getAllArchivedLeads, logout} from "../../services/service";
import Icon from "@material-ui/core/Icon";
import {
    Table, Input, Button, Divider,message,Menu,Dropdown,Form
} from 'antd';
import Modal from "react-modal";
import {Navbar, Container,} from 'react-bootstrap';
import AddSubmission from "../../components/createForms/twoStepForm/addSubmission";
import ViewLead from "../../components/viewForms/viewLead";
import ManageProfiles from "../../components/manageProfiles";
import AddUser from "../../components/createForms/addUser";
import HTTP_400 from "../../components/Error/HTTP_400";
import HTTP_500 from "../../components/Error/HTTP_500";
import ThreeStepForm from "../../components/createForms/threeStepForm/threeStepForm";

class Archive extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            apply: false,
            view: false,
            leadData: [],
            status: null,
            modalIsOpen: false,
            viewModal: false,
            job_desc: '',
            location: '',
            city: [],
            mapData: {},
            cityName: '',
            lead_details: {},
            editModal: false,
            hideMap: true,
            checked: [false],
            archivedData: [],
            callout_status: [false],
            mapleadData: [],
            mapStatus: false,
            profile:false,
            addUser:false
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.getAllLeads = this.getAllLeads.bind(this);
    }


    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
        this.setState({viewModal: false});
        this.setState({apply: false});
        this.setState({view: false,profile: false, addUser: false});
    }

    componentDidMount() {
        this.getAllLeads()
    }

    getAllLeads() {
        getAllArchivedLeads()
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                if (status === 401) {
                    localStorage.removeItem('DATA');
                    this.props.history.push("/login")
                } else if(status === 200) {
                    res.results.map((item, i) => (
                        (item.status === "archived") ?
                            this.state.leadData.push(item) : null

                    ));
                    // this.setState({
                    //     leadData: item,
                    //     error: res.error || null,
                    //     loading: false,
                    //
                    // })

                }
                this.setState({status: status})


            })
    }


    render() {

        const columns = [
            {
                title: 'Job Titile',
                dataIndex: 'job_title',
                key: 'job_title',
                width: '20%',
                render: (text, record) => (
                    <span onClick={() => {

                        this.setState({lead_details: record})
                        this.setState({view: true})
                    }}>{text}</span>
                ),
            }, {
                title: 'Location',
                dataIndex: 'location',
                key: 'location',
                width: '20%',
                render: (text, record) => (
                    <span onClick={() => {

                        this.setState({lead_details: record})
                        this.setState({view: true})
                    }}>{text}</span>
                ),
            }, {
                title: 'Vendor Company Name',
                dataIndex: 'company_name',
                key: 'company_name',
                width: '15%',
                render: (text, record) => (
                    <span onClick={() => {

                        this.setState({lead_details: record})
                        this.setState({view: true})
                    }}>{text}</span>
                ),
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: '10%',
                render: (text, record) => (

                    <span>
                        {text}
                        {/*{*/}
                        {/*text === 'locked' ?*/}
                        {/*<Icon style={{fontSize: 18, color: 'white', backgroundColor: 'green'}}>check</Icon> :*/}
                        {/*<Icon style={{fontSize: 18, color: 'white', backgroundColor: 'red'}}>cancel</Icon>*/}
                        {/*}*/}
                    </span>
                )
            },
            {
                title: 'Submitted Count',
                dataIndex: 'submission_count',
                key: 'submission_count',
                width: '10%',
                render: (text, record) => (

                    <div style={{width: 20, borderRadius: 10, backgroundColor: '#fff', color: '#007ae2'}}>
                        <div style={{marginLeft: 5}}>{text}</div>
                    </div>
                )
            },
        //     {
        //         title: 'Actions',
        //         dataIndex: 'vendor__name',
        //         key: "action",
        //         width: '30%',
        //         render: (text, record) => (
        //             <span>
        //    <Icon style={{fontSize: 18, color: '#347463', float: 'left'}} onClick={() => {
        //        this.setState({lead_details: record})
        //        this.setState({view: true})
        //    }}>edit</Icon>
        //   <Divider type="vertical"/>
        //                 <Button onClick={() => {
        //                     this.setState({apply: true});
        //                     this.setState({lead_details: record})
        //                 }}
        //                         type="primary"
        //                         size="small"
        //                         style={{width: 130, marginRight: 8}}>
        //                     Apply Submission
        //                     </Button>
        // </span>
        //         )
        //     }
            ];

        return (

                this.state.status === 200 ?
                    <div>
                        <Table
                            rowKey={record => record.id.toString()}
                            style={{marginTop: 30, marginRight: 10, marginLeft: 10,marginBottom:70}}
                            columns={columns}
                            dataSource={this.state.leadData}
                            pagination={false}
                        />
                        <Modal
                            isOpen={this.state.apply}
                            //onRequestClose={this.closeModal}
                            ariaHideApp={false}
                            contentLabel="Add Submission"
                            className="topaddsubmition"
                        >
                            <Icon style={{position: 'absolute', top: 10, right: 12}}
                                  onClick={this.closeModal}>close</Icon>
                            <ThreeStepForm first={false} edit={false} leadDetails={this.state.lead_details} handleClose={this.closeModal}/>
                            <br/>
                        </Modal>
                        <Modal
                            isOpen={this.state.view}
                            //onRequestClose={this.closeModal}
                            ariaHideApp={false}
                            contentLabel="View/Edit Lead"
                        >
                            <Icon style={{position: 'absolute', top: 10, right: 12}}
                                  onClick={this.closeModal}>close</Icon>
                            <ViewLead leadId={this.state.lead_details.id} leadDetails={this.state.lead_details}
                                      handleClose={this.closeModal}/>
                            <br/>
                        </Modal>
                        <Modal
                            isOpen={this.state.profile}
                            //onRequestClose={this.closeModal}
                            ariaHideApp={false}
                            contentLabel="Setup Profile"
                        >
                            <Icon style={{position: 'absolute', top: 8, right: 12, zIndex: 10}}
                                  onClick={this.closeModal}>cancel</Icon>
                            <ManageProfiles/>
                            <br/>
                        </Modal>
                        <Modal
                            isOpen={this.state.addUser}
                            //onRequestClose={this.closeModal}
                            ariaHideApp={false}
                            contentLabel="Setup Profile"
                        >
                            <Icon style={{position: 'absolute', top: 8, right: 12, zIndex: 10}}
                                  onClick={this.closeModal}>cancel</Icon>
                            <AddUser/>
                            <br/>
                        </Modal>
                    </div>
                    :
                    this.state.status === 404?
                        <HTTP_400/>
                        :
                        this.state.status === 400?
                            <HTTP_400/>
                            :
                            this.state.status === 500?
                                <HTTP_500/>
                                :null




        );
    }
}

export default Archive;
