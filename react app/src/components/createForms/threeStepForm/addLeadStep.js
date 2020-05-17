import React, {Component} from 'react';
import {
    Form, Input, Select, Tag, Tooltip, message, Button, Drawer
} from 'antd';
import {PlusCircleOutlined} from "@ant-design/icons"
import CreateVendorCompany from "../vendorForm/createVendorCompany";

const {TextArea} = Input;


export default class AddLeadStep extends Component {

    constructor(props) {
        super(props);
        this.state={
            addCompany:false
        }
    }
    handleClose = () => {
        this.setState({addCompany: false});

    };
    addVendorCompany = () => {
        this.setState({addCompany: true});

    };

    render() {
        const data = JSON.parse(localStorage.getItem('DATA'));
        const role = data.roles;
        return (

            <div className="addleadform">

                <div className="col-md-12 col-sm-12 col-xs-12">
                    <div className="testform">

                        <Form layout='vertical'>

                            {/*<Button*/}
                                {/*icon="interaction"*/}
                                {/*type="dashed"*/}
                                {/*className="parse_button"*/}
                                {/*style={{*/}
                                    {/*backgroundColor: this.props.job_desc !== undefined && this.props.job_desc !== '' ?*/}
                                        {/*'green' : 'gray',*/}
                                    {/*zIndex: 10*/}
                                {/*}}*/}
                                {/*disabled={this.props.disabled}*/}
                                {/*onClick={() => {*/}
                                    {/*console.log(this.props.job_desc)*/}

                                    {/*if (this.props.job_desc !== undefined && this.props.job_desc !== '') {*/}
                                        {/*this.props.parser(this.props.job_desc)*/}
                                    {/*}*/}
                                {/*}*/}
                                {/*}*/}
                            {/*>Parse</Button>*/}
                    <Form.Item
                        label={<span><span style={{color: 'red', fontSize: 9}}>*</span> Job Description </span>}>

                        <div>
                            <TextArea
                                disabled={this.props.disabled}
                                onChange={this.props.handleChange}
                                name="job_desc"
                                value={this.props.job_desc}
                                placeholder="Job Description" className="nweleadjd"
                                style={{width: '100%', overflowY: 'scroll'}}
                                autosize={{minRows: 10, maxRows: 25}}/>
                        </div>

                        {this.props.jdValid &&
                        <label><span style={{color: 'red', fontSize: 11}}>Job Description cannot be null</span></label>}
                        
                        </Form.Item>
  
                        </Form>

                    </div>





<div class="row">

                    </div>
                    {/*<div>*/}
                    {/*    <label><span style={{color: 'red', fontSize: 9}}>*</span>Secondary Skill:</label>*/}
                    {/*    <div style={{borderWidth: 1, borderColor: 'black'}}>*/}

                    {/*        {this.props.skillList.map((tag, index) => {*/}
                    {/*            const isLongTag = tag.value > 20;*/}
                    {/*            const tagElem = (*/}
                    {/*                    <CheckableTag*/}

                    {/*                        style={{*/}
                    {/*                            width: '20%',*/}
                    {/*                            fontSize: 11,*/}
                    {/*                            marginTop: '8px',*/}
                    {/*                            color: this.props.sec_selected[index] ? 'white' : '#007ae2',*/}
                    {/*                            backgroundColor: this.props.sec_selected[index] ? '#007ae2' : 'white'*/}
                    {/*                        }}*/}
                    {/*                        key={tag.value}*/}
                    {/*                        closable={false}*/}
                    {/*                        checked={this.props.secondary_skill.indexOf(tag) > -1}*/}
                    {/*                        onChange={(checked)=>{*/}
                    {/*                            if (!this.props.disabled) {*/}
                    {/*                                this.props.onSelectSecondarySkill(tag.value,checked, index)*/}
                    {/*                            }*/}
                    {/*                        }}*/}
                    {/*                    >*/}
                    {/*                        {isLongTag ? `${tag.value.slice(0, 20)}...` : tag.value}*/}
                    {/*                    </CheckableTag>*/}

                    {/*            );*/}

                    {/*            return isLongTag ? (*/}
                    {/*                <Tooltip title={tag.value} key={tag}>*/}
                    {/*                    {tagElem}*/}
                    {/*                </Tooltip>*/}
                    {/*            ) : (*/}
                    {/*                tagElem*/}
                    {/*            );*/}
                    {/*        })}*/}

                    {/*    </div>*/}
                    {/*</div>*/}

                  


                    <div class="col-md-6 col-sm-6 col-xs-12">
                    <div className="testform testformright">
                        
                        <div class="row">
                            <div class="col-md-12">
                                <Form.Item label={<span style={{fontSize: 13}}><span
                                    style={{color: 'red', fontSize: 9}}>*</span> Job Location</span>}>

                                    <div style={{borderWidth: 1, borderColor: 'black'}}>
                                        {this.props.parseCityList.map((tag, index) => {
                                            const isLongTag = tag.name.length > 20;
                                            const tagElem = (
                                                <div onClick={() => this.props.onSelectCity(tag.name)}>
                                                    <Tag className="view_sec_tab"
                                                         key={tag.name} closable={false}>
                                                        {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
                                                    </Tag>
                                                </div>
                                            );
                                            return isLongTag ? (
                                                <Tooltip title={tag.name} key={tag}>
                                                    {tagElem}
                                                </Tooltip>
                                            ) : (
                                                tagElem
                                            );
                                        })}
                                    </div>


                                    <Select
                                        disabled={this.props.disabled}
                                        showSearch
                                        value={this.props.location}
                                        style={{width: '100%'}}
                                        placeholder="Job Location"
                                        optionFilterProp="children"
                                        onChange={(e) => console.log(e)}
                                        onSelect={(e) => this.props.onSelectCity(e)}
                                        onSearch={(e) => this.props.getCitySuggestions(e)}
                                    >
                                        {
                                            this.props.cityList.map((item, i) => (
                                                <Select.Option
                                                    value={item.name + "," + item.state}>{item.name + " ," + item.state}</Select.Option>
                                            ))}
                                    </Select>
                                    {this.props.locationValid && <label>
                                        <span style={{color: 'red', fontSize: 11}}>Job Location Cannot be empty</span>
                                    </label>}
                                </Form.Item>

                                <br/>

                                <label style={{fontSize: 13}}>
                                    <span style={{color: 'red', fontSize: 9}}>*</span> Job Title:
                                    <input
                                        disabled={this.props.disabled}
                                        required
                                        id="outlined-required"
                                        className="form-control"
                                        placeholder="Job Title"
                                        name="job_title"
                                        value={this.props.job_title}
                                        onChange={this.props.handleChange}/>
                                    {this.props.jtValid && <label><span style={{color: 'red', fontSize: 11}}>Job Title Cannot be empty</span></label>}
                                </label>

                                <div className="row">

                                    <div class="col-md-12 col-sm-6 col-xs-12">

                                        <div className="VCompany">
                                            <label style={{fontSize: 13}}> <span
                                                style={{color: 'red', fontSize: 9}}>*</span> Vendor Company: </label>
                                            <Select
                                                disabled={this.props.disabled}
                                                //allowClear
                                                showSearch
                                                value={this.props.company}
                                                style={{width: '60%'}}
                                                placeholder="Vendor company"
                                                optionFilterProp="children"
                                                onChange={(e) => this.props.onSelectCompany(e)}
                                                onSelect={(e) => this.props.onSelectCompany(e)}
                                                onSearch={(e) => this.props.getCompanySuggestions(e)}
                                            >
                                                {this.props.companyList.map((item, i) => (
                                                    <Select.Option
                                                        value={item.id + "," + item.name}>{item.name}</Select.Option>
                                                ))}
                                            </Select>

                                            {
                                                (role.map((r)=>r === "superadmin") || role.map((r)=>r === "admin")) &&
                                                <Tag
                                                    style={{background: "#fff", borderStyle: "dashed", width: '40%'}}
                                                    onClick={() => this.addVendorCompany()}>

                                                    <PlusCircleOutlined
                                                        variant="outlined" color="secondary" style={{
                                                        backgroundColor: "green",
                                                        color: 'white',
                                                        borderRadius: 40,
                                                        fontSize: 20
                                                    }}/><span
                                                    style={{marginTop: '5px'}}>Add Company</span>
                                                </Tag>
                                            }
                                                </div>


                                        {this.props.companyValid && <label><span style={{color: 'red', fontSize: 11}}>Select Vendor Company</span></label>}

                                    </div>


                                </div>
                                <Drawer
                                    title="Add Company"
                                    width={320}
                                    onClose={this.handleClose}
                                    visible={this.state.addCompany}
                                >
                                    <CreateVendorCompany selectCompany={this.props.selectCompany} closeModal={this.handleClose}/>
                                </Drawer>

                            </div>


                        </div>
                    </div>

                </div>





                <div class="col-md-6 col-sm-6 col-xs-12">
                        <label><span style={{color: 'red', fontSize: 9}}>*</span>Primary Skill:</label>
                        <div style={{borderWidth: 1, borderColor: 'black'}}>

                            {this.props.skillList.map((tag, index) => {
                                const isLongTag = tag.value > 20;
                                const tagElem = (
                                    <div onClick={() => {
                                        if (!this.props.disabled) {
                                            this.props.onSelectSkill(tag.value, index)
                                        }
                                    }}>
                                        <Tag

                                            style={{
                                                width: '20%',
                                                fontSize: 11,
                                                marginTop: '8px',
                                                color: this.props.selected[index] ? 'white' : '#007ae2',
                                                backgroundColor: this.props.selected[index] ? '#007ae2' : 'white'
                                            }}
                                            key={tag.value} closable={false}>
                                            {isLongTag ? `${tag.value.slice(0, 20)}...` : tag.value}
                                        </Tag>
                                    </div>
                                );

                                return isLongTag ? (
                                    <Tooltip title={tag.value} key={tag}>
                                        {tagElem}
                                    </Tooltip>
                                ) : (
                                    tagElem
                                );
                            })}

                        </div>

                        {this.props.skillValid &&
                        <label style={{width: '100%'}}> <span style={{color: 'red', fontSize: 11}}>Select a skill</span>
                        </label>}
                        
                    </div>






 </div>  {/*  row  */}



                   </div>


        );
    }
}

