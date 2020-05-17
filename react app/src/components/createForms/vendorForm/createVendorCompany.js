import React, {Component} from 'react';
import Button from "@material-ui/core/Button";
import {
    addNewCompany, getVendorCompany
} from "../../../services/service";
import {message, Select, Tag, Input} from "antd";
const {Search} = Input;
class CreateVendorCompany extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            company: '',
            companyList: [],
            status: null
        };
        this.addNewCompany = this.addNewCompany.bind(this);
        this.onCompanySearch = this.onCompanySearch.bind(this);
    }


    onSelectCompany = (e) => {
        this.setState({company: e}, () => {
            this.onCompanySearch(this.state.company)
        })
    }

    onCompanySearch(query) {
        getVendorCompany(query).then((response) => {

            const statusCode = response.status;
            const res = response.json();
            return Promise.all([statusCode, res]);
        })
            .then(([status, response]) => {

                console.log(response)
                this.setState({companyList: response.results, status: status})

            })
            .catch((error) => {
                console.error(error);
            });

    }

    addNewCompany() {
        let body;
        body = {
            'name': this.state.company,
        };
        console.log(body)
        addNewCompany(body)
            .then((response) => {

                const statusCode = response.status;
                const res = response.json();
                return Promise.all([statusCode, res]);
            })
            .then(([status, response]) => {
                if (response.result === "Company already exist") {
                    message.error("Company already exist")
                }
                else {
                    this.props.selectCompany(response.result)
                    this.props.closeModal();
                }
                //this.setState({company: response.result.name})


            })
            .catch((error) => {
                console.error(error);
            });

    };

    render() {
        return (
            //     role.includes("superadmin") ||   role.includes("admin")?
            //         <div>
            //             <div class="viewhead"><h3> Add New Company</h3></div>
            //             <div style={{
            //                 marginLeft: '20px',
            //                 marginRight: '20px',
            //                 marginTop: '10px'
            //             }}>
            //
            //                 <br/>
            //                 <label> Company Name:</label>
            //                 <input className="form-control" type="text" name="newCompanyName" value={this.state.newCompanyName} onChange={this.handleChange}/>
            //
            //                 <div className="newbutton">
            //
            //                     <Button disabled={this.state.newCompanyName.length ===0} onClick={() => this.addNewCompany()} color="primary">
            //                         Submit
            //                     </Button>
            //                 </div>
            //
            //             </div>
            //         </div>
            // :
            <div>
                <div style={{
                    marginLeft: '20px',
                    marginRight: '20px',
                    marginTop: '10px'
                }}>

                    <br/>
                    <label> Company Name:</label>
                    <Input
                        placeholder="Search Company"
                        value={this.state.company}
                        onChange={e => this.onSelectCompany(e.target.value)}
                        style={{width: 200}}
                    />
                    {
                        this.state.companyList.length !== 0 && this.state.companyList.map((item, i) => (
                            <div onClick={() => this.onSelectCompany(item.name)}>
                                <Tag
                                    value={item.name}>{item.name}</Tag>
                            </div>
                        ))}


                    {/*<div>*/}
                    {/*<Select*/}
                    {/*showSearch*/}
                    {/*allowClear*/}
                    {/*style={{width: '97%',marginTop:'10px'}}*/}
                    {/*placeholder="Company"*/}
                    {/*optionFilterProp="children"*/}
                    {/*onChange={(e) => console.log(e)}*/}
                    {/*onSelect={(e) => this.onSelectCompany(e)}*/}
                    {/*onSearch={this.onCompanySearch}*/}
                    {/*>*/}
                    {/*{this.state.companyList.map((item, i) => (*/}
                    {/*<Select.Option value={item.name}>{item.name}</Select.Option>*/}
                    {/*))}*/}
                    {/*</Select>*/}
                    {/*</div>*/}
                    <div className="newbutton">
                        {/*<Button onClick={this.onCompanySearch} color="primary">*/}
                        {/*Search*/}
                        {/*</Button>*/}

                        <Button onClick={() => this.addNewCompany()} color="primary">
                            Submit
                        </Button>
                    </div>

                </div>
            </div>
        );
    }
}

export default CreateVendorCompany;
