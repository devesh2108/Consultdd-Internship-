import React, {Component} from 'react';
import Button from "@material-ui/core/Button";
import {Popover,message,Select,Tag,Tooltip,Drawer} from "antd";
import {PlusCircleOutlined} from "@ant-design/icons"
import 'antd/dist/antd.css';
import CreateVendorData from '../vendorForm/createVendorData'
import MarketingSuggestions from "../../suggestions/MarketingSuggestions";

class MarketingDataStep extends Component {
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
       this.props.getAllVendorByCompany(this.props.companyId);
    }



    render() {
        const data = JSON.parse(localStorage.getItem('DATA'));
        const company = data.team;
        return (
            <div>
                <div className="subnew2">
                    <div className="submissionform" style={{ marginTop:'0px' }}>
                        <div style={{ padding:'0' }} className="applysubmission">

                            <div className="col-md-12">
            
                                <div className="col-md-6 col-sm-6 col-xs-">
                                    {this.props.vendorList.length != 0 ?
                                        <div>
                                           
                                            <div>
                                                <label> Vendor Contact: </label>
                                                <Select
                                                    //showSearch
                                                    allowClear
                                                    style={{width: '100%'}}
                                                    placeholder="Select vendor"
                                                    optionFilterProp="children"
                                                    onChange={(e) => this.props.selectVendor(e)}
                                                    onSelect={(e) => this.props.selectVendor(e)}
                                                    // onSelect={(e) => this.setState({vendorId: e})}
                                                >
                                                    {this.props.vendorList.map((item, i) => (
                                                        <Select.Option value={item.id}>{item.name}</Select.Option>
                                                    ))}
                                                </Select>
                                            </div>


                                        </div>:null}
                                    <Tag
                                        style={{background: "#fff", borderStyle: "dashed", width: '40%'}}
                                        onClick={() => this.props.vendorStatus()}
                                    >

                                        <PlusCircleOutlined
                                            variant="outlined" color="secondary" style={{
                                            backgroundColor: "green",
                                            color: 'white',
                                            borderRadius: 40,
                                            fontSize: 20
                                        }} type="PlusCircleOutlined"/><span
                                        style={{marginTop: '5px'}}>New Vendor</span>
                                    </Tag>


                                    <div className="col-md-12">
                                        <div className="row">
                                            
                                            <label>
                                                Rate:(Only Number)
                                                <input
                                                    placeholder="$"
                                                    id="outlined-required"
                                                    className="form-control"
                                                    name="rate"
                                                    value={this.props.rate}
                                                    onChange={this.props.handleChange}/>
                                            </label>
                                        </div>
                                    </div>

                                    <br/>
                                    {
                                        this.state.marketingSuggestion &&
                                        <Drawer
                                            title="View Client Suggestions"
                                            width={320}
                                            onClose={this.handleClose}
                                            visible={this.state.marketingSuggestion}
                                        >
                                            <MarketingSuggestions
                                                suggestions={this.props.subClientSuggestionList}
                                                handleClose={this.handleClose}
                                            />


                                        </Drawer>
                                    }

                                    
                                    {
                                        this.props.subClientSuggestionList.length === 0 ? null :


                                                <Button  style={{color: 'blue', background: 'white' , marginTop:'20px'}} onClick={this.openSuggestionBox}>Suggestions</Button>


                                    }
                                    <label>
                                        Marketing Email:<span style={{color:'red'}}>*</span>
                                        <input
                                            required
                                            id="outlined-required"
                                            className="form-control"
                                            name="marketing_email"
                                            value={this.props.marketing_email}
                                            onChange={this.props.handleChange}/>
                                    </label>

                                    <br/>
                                    
                                </div>

                                   
                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                        <div>   
                                            <label>
                                                Employer <span style={{color:'red'}}>*</span>
                                                <Select style={{ marginTop:'6px' }} className="form-control" value={this.props.emp} onChange={(e) => {
                                                    //console.log(e)
                                                   this.props.selectEmployer(e)
                                                }}>

                                                    <Select.Option eventkey={company.toLowerCase()==='consultadd'?'0':'1'} value={company}>{company}</Select.Option>
                                                    {company.toLowerCase()==='consultadd'?null:<Select.Option  eventkey="0" value="consultadd">Consultadd</Select.Option>}
                                                </Select>
                                            </label>
                                            
                                        <br/>

                                    <label>
                                        Client:
                                        <div><input
                                            id="outlined-required"
                                            className="form-control"
                                            name="client"
                                            value={this.props.client}
                                            onChange={this.props.handleChange}
                                            onBlur={()=>this.props.didYouMean(this.props.client)}
                                        />
                                            {this.props.clientList.length !== 0 &&

                                            <div className="view_sub_btnnew">
                                                <span> Did you mean: </span>

                                                <div style={{borderWidth: 1, borderColor: 'black'}}>

                                                    {this.props.clientList.map((tag, index) => {
                                                        const isLongTag = tag > 20;
                                                        const tagElem = (
                                                            <div style={{ color: this.props.selected[index] ? 'white' : '#007ae2',
                                                                backgroundColor: this.props.selected[index] ? '#007ae2' : 'white'}} onClick={() => this.props.onSelectClient(tag, index)}>
                                                                <Tag
                                                                    style={{
                                                                        width: '20%',
                                                                        fontSize: 9,
                                                                        marginTop: '8px',
                                                                        color: this.props.selected[index] ? 'white' : '#007ae2',
                                                                        backgroundColor: this.props.selected[index] ? '#007ae2' : 'white'
                                                                    }}
                                                                    key={tag} closable={false}>
                                                                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                                                </Tag>
                                                            </div>
                                                        );

                                                        return isLongTag ? (
                                                            <Tooltip title={tag} key={tag}>
                                                                {tagElem}
                                                            </Tooltip>
                                                        ) : (
                                                            tagElem
                                                        );
                                                    })}

                                                </div>
                                            </div>}
                                        </div>
                                    </label>


                                    <label>
                                        Marketing Phone no:<span style={{color:'red'}}>*</span>
                                        <input
                                            required
                                            id="outlined-required"
                                            className="form-control"
                                            name="marketing_phone"
                                            value={this.props.marketing_phone}
                                            onChange={this.props.handleChange}/>
                                    </label>

                                    <br/>

                                  </div>
                                    
                                   </div>


                            </div>

                        </div>


                        <br/><br/>

                       


                    </div>
                        {this.props.addVendor &&
                        <Drawer
                            title="Add New Vendor"
                            width={320}
                            onClose={this.props.handleClose}
                            visible={this.props.addVendor}
                        >
                            <CreateVendorData
                                handleClose={this.props.handleClose}
                                companyName={this.props.companyName}
                                companyId={this.props.companyId}
                                vendorList={this.props.vendorList}
                                selectVendor={this.props.appendVendor}
                            />
                        </Drawer>}

                </div>
            </div>

        );
    }
}

export default MarketingDataStep;
