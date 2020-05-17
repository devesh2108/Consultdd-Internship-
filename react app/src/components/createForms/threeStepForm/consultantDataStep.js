import React, {Component} from 'react';
import Button from "@material-ui/core/Button";
import { Select,Drawer} from "antd";
import {UploadOutlined,DeleteOutlined} from "@ant-design/icons"
import 'antd/dist/antd.css';
import moment from 'moment-timezone';
import ConsultantSuggestions from "../../suggestions/ConsultantSuggestions";

class ConsultantDataStep extends Component {
    constructor(props) {
        super(props);
        this.state ={
            marketingSuggestion:false
        }
    }
    handleClose =()=>{
        this.setState({
            marketingSuggestion : false
        })
    }

    openSuggestionBox =()=>{
        this.setState({
            marketingSuggestion : true
        })
    }
    componentDidMount() {
        this.props.getAllConsultant()
    }

    render() {

        return (

                <div className="subnew1">
                    <div className="submissionform">
                        <div className="applysubmission">
                            <div className="col-md-12">
                                <div className="row">

                                    <div className="col-md-6">
                                        <div>
                                            <label><span style={{color:'red',fontSize:9}}>*</span> Consultant: </label>
                                            <Select
                                                showSearch
                                                value={this.props.consultant_name}
                                                style={{width: '100%'}}
                                                placeholder="Select a consultant"
                                                optionFilterProp="children"
                                                onChange={(e) => {
                                                    console.log(e)
                                                    this.props.onConsultantChange(e);
                                                    this.props.getConsultantDetails(e.split(',')[0])
                                                }}
                                                filterOption={(input, option) =>
                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {this.props.consultantList.map((item, i) => (
                                                    <Select.Option key={i} value={item.id+','+item.name}>{item.name}</Select.Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <div className="submissionleft_sec"> 
                                            {this.props.consultant_profiles.length != 0 ?
                                                <div>
                                                    <label> <span style={{color:'red',fontSize:9}}>*</span> Profile: </label>
                                                    <Select
                                                        showSearch
                                                        value={this.props.title}
                                                        style={{width: '100%'}}
                                                        placeholder="Select a profile"
                                                        optionFilterProp="children"
                                                        onChange={(e) => {
                                                            console.log(e);

                                                            this.props.getCurrentProfile(e)
                                                        }}
                                                        filterOption={(input, option) =>
                                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                    >
                                                        {this.props.consultant_profiles.map((item, i) => (


                                                            <Select.Option key={i} value={item.id}>{item.title}</Select.Option>
                                                        ))}
                                                    </Select>
                                                </div> :
                                                null}
                                        </div>
                                        <div className="attachicon">
                                               <label> Attachments: </label>
                                                <Select
                                                    style={{width: '82%', float:'left',marginRight: '10px',marginTop: '1px'}}
                                                    onChange={(e) => this.props.attachmentChange(e)}
                                                    value={this.props.attachment_type}>
                                                    {/*{this.state.disabled_resume && this.state.disabled_other ?<Select.Option key="1" value="" disabled={this.state.disabled_resume && this.state.disabled_other}>No options</Select.Option>:null}*/}
                                                    <Select.Option key="1" value="Resume" disabled={this.props.disabled_resume}>Resume</Select.Option>
                                                    <Select.Option key="2" value="Misc" disabled={this.props.disabled_other}>Others</Select.Option>
                                                </Select>
                                                 
                                                 <br/>

                                                <label className="uploadnew">
                                                    <UploadOutlined />
                                                    <input type="file" style={{visibility:'hidden'}} multiple
                                                           onClick={(event)=> {
                                                               event.target.value = null
                                                           }}
                                                           onChange={(e) =>
                                                    this.props.handleChangeFile(e)}/>
                                                </label>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="Attachmentssection">
                                        {this.props.visible && 
                                    
                                    <div className="rightprofilesec" style={{borderWidth: '1px'}}>
                                        <ul>
                                            <li><span><h2>Profile details:</h2></span></li><br/>
                                            <li><span>Title:</span>{this.props.title}</li>
                                            <li><span>Date of Birth:</span>{moment(this.props.dob).format("YYYY-MM-DD")}</li>
                                            <li><span>Visa Type:</span> {this.props.visa_type}</li>
                                            <li><span>Visa Start:</span>{moment(this.props.visa_start).format("YYYY-MM-DD")}</li>
                                            <li><span>Visa End:</span>{moment(this.props.visa_end).format("YYYY-MM-DD")}</li>
                                            <li><span>City: </span>{this.props.consultant_location}</li>
                                            <li><span>Education:</span> {this.props.education}</li>
                                            <li><span>Links:</span> this is link</li>
                                            <br/>
                                            <li><span>Owner:</span>{this.props.owner}</li>
                                        </ul> 
                                    </div>
                                    }
                                            </div>
                                    </div>


                                    <br/>
                                    {
                                        this.state.marketingSuggestion &&
                                        <Drawer
                                            title="View Consultant Suggestions"
                                            width={320}
                                            onClose={this.handleClose}
                                            visible={this.state.marketingSuggestion}
                                        >
                                            <ConsultantSuggestions
                                                suggestions={this.props.subConsultantSuggestionList}
                                                handleClose={this.handleClose}
                                            />


                                        </Drawer>
                                    }
                                    {
                                        this.props.subConsultantSuggestionList.length === 0 ? null :


                                            <Button  style={{color: 'blue', background: 'white' , marginTop:'20px'}} onClick={this.openSuggestionBox}>Suggestions</Button>

                                    }
                                    <br/>

                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                       
                                    </div>

                                  <div className="col-md-6">                 
                                    <div>
                                        {
                                            this.props.attachments.length !==0 && this.props.attachments.map((item,i) => {

                                                        return (
                                                            <div key ={i}>
                                                                <span> {item.file.name}</span>
                                                                <span style={{marginLeft: '10px'}}>{item.type}</span>
                                                                <DeleteOutlined className="deleteIcon" onClick={() => this.props.deleteFile(item)}/>
                                                                <br/>
                                                            </div>
                                                        )
                                                    })
                                                }

                                    </div>

                                    
                                   
                                
                                </div> 

                                </div>
                            </div>


                        </div>


                    </div>

                </div>


        );
    }
}

export default ConsultantDataStep;
