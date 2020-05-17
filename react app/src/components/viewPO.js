import React, {Component} from 'react';
import {getPOById,updatePO} from "../services/service";
import {Form} from "antd";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import PoTabSub from "./poTabSub";
import PoTabPo from "./poTabPo";
import PoTabInt from "./poTabInt";

class PO extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submission: '', //sub_id
            ctb: '', // user_id
            type: '', //"telephonic",
            timezone: '',
            start: '', //"2019-04-10T06:30:00.302650Z" // for now ==== >>> 2019-04-21 12:00:00
            end: '', //"2019-04-10T07:00:00.302650Z"
            round: 1,
            supervisor: '',
            ctbList: [],
            job_desc: '',
            location: '',
            skills: '',
            client: '',
            consultant__consultant__name: '',
            employer: '',
            rate: '',
            resume: null,
            vendor_company: '',
            vendor_name: '',
            vendor_contact: '',
            vendor_email: '',
            status: 0,
        };
    }


    render() {
        console.log(this.props.poId)
        return (

            <div>
                <div className="maininterview2">
                <Tabs
                    selectedIndex={this.state.selectedIndex}
                    onSelect={this.handleSelect}
                    className="potophead"
                >
                    <TabList>
                        <Tab eventkey="submission" title="Submission">
                            PO
                        </Tab>
                        <Tab eventkey="interview" title="Interview">
                            Interview
                        </Tab>
                        <Tab eventkey="project" title="Project">
                            Submission
                        </Tab>
                    </TabList>

                    <TabPanel>
                        <PoTabPo
                            checklistStatus={this.props.checklistStatus}
                            onUpdateChange={this.props.onUpdateChange}
                            poId={this.props.poId}
                            po_details={this.props.po_details.results}
                            handleClose={this.props.handleClose}/>
                    </TabPanel>

                    <TabPanel>
                       <PoTabInt interview_details={this.props.po_details.results.interview}/>
                    </TabPanel>

                    <TabPanel>
                        <PoTabSub submission_details={this.props.po_details.results.submission}
                                  handleClose={this.props.handleClose} />
                    </TabPanel>
                </Tabs>
                
                {/*<div dangerouslySetInnerHTML={{__html:this.props.interview.description}}/>*/}
                </div>

            </div>
            
        );
    }
}

const ViewPOForm = Form.create({name: 'view_po'})(PO);

export default class ViewPO extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            po_details: {},
            status: null
        }
        this.getPODetails = this.getPODetails.bind(this);

    }
    componentDidMount(){

            this.getPODetails(this.props.poId)

    }
    getPODetails(id){
        getPOById(id)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, res]) => {
                console.log(res)
                this.setState({po_details:res,status:status})

            })
            .catch(error => {
                console.log(error)
            });
    }


    render() {

        return (
            this.state.status === 200 ?
                <ViewPOForm
                    checklistStatus={this.props.checklistStatus}
                    onUpdateChange={this.props.onUpdateChange}
                    po_details={this.state.po_details}
                            poId={this.props.poId}
                                   handleClose={this.props.handleClose}/>
                : null
        )

    }
}
