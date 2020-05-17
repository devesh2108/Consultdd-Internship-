import React, {Component} from 'react';
import {addNewVendor,getVendorCompanySuggestions,getCities} from "../../../services/service";
import {
    Button,Input,Select,message
} from "antd";

class CreateVendorContact extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            vendorName:'',
            vendorEmail:'',
            vendorContact:'',
            vendorLocation:'',
            vendorCompanyId:null,
            vendorCompanyName:'',
            companyList:[],
            loading:false,
            status:null,
            companySelected: false,
            cityList: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.addNewVendor = this.addNewVendor.bind(this);
        this.onSelectCompany = this.onSelectCompany.bind(this);
        this.getCompanySuggestions = this.getCompanySuggestions.bind(this);
    }
    handleChange(event) {

        this.setState({[event.target.name]: event.target.value});
    };

    onSelectCompany(data) {

        if(data !== undefined){
            this.setState({
                vendorCompanyName: data.split(",")[1],
                vendorCompanyId: data.split(",")[0],
                companySelected:true
            })
        }
        else{
            this.setState({
                vendorCompanyName: '',
                vendorCompanyId: null,
                companySelected:false
            })

        }

    };
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
                    loading: false,
                });
            })
            .catch(error => {
                this.setState({error, loading: false});
            });
    };

    addNewVendor() {
        const body = {
            'company': this.state.vendorCompanyId,
            'name': this.state.vendorName,
            'email': this.state.vendorEmail,
            'number': this.state.vendorContact,
            'location': this.state.vendorLocation,
        };
        if(this.state.vendorCompanyId && this.state.vendorName && this.state.vendorEmail && this.state.vendorContact && this.state.vendorLocation) {
            addNewVendor(body)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, response]) => {

                    if(status !== 201){
                        message.success("Vendor Contact Added.")
                        this.props.closeCreateContactModal()
                    }
                    else{
                        message.error("Something went wrong.")
                    }

                })
                .catch((error) => {
                    console.error(error);
                });
        }

    };

    render() {
        return (
            <div>


                <label> Vendor Company: </label>
                <Select
                    allowClear
                    showSearch
                    value={this.state.vendorCompanyName}
                    style={{width: '100%'}}
                    placeholder="Vendor company"
                    optionFilterProp="children"
                    onChange={(e) => this.onSelectCompany(e)}
                    onSelect={(e) => this.onSelectCompany(e)}
                    onSearch={(e) => this.getCompanySuggestions(e)}
                >
                    {this.state.companyList.map((item, i) => (
                        <Select.Option
                            value={item.id + "," + item.name}>{item.name}</Select.Option>
                    ))}
                </Select>
                <br/>
                <br/>
                <label>  Contact Name: </label>
                <Input
                    disabled={!this.state.companySelected}
                    placeholder="Name"
                    id="outlined-required"
                    name="vendorName"
                    className="form-control"
                    value={this.state.newVendorName}
                    onChange={this.handleChange}/>
                <br/>
                <br/>
                <label> Email: </label>
                <Input
                    disabled={!this.state.companySelected}
                    placeholder="Email"
                    id="outlined-required"
                    name="vendorEmail"
                    className="form-control"
                    value={this.state.newVendorEmail}
                    onChange={this.handleChange}/>
                <br/>
                <br/>
                <label> Phone: </label>
                <Input
                    disabled={!this.state.companySelected}
                    placeholder="Phone"
                    id="outlined-required"
                    name="vendorContact"
                    className="form-control"
                    value={this.state.newVendorContact}
                    onChange={this.handleChange}/>
                <br/>
                <br/>
                <label> Location: </label>
                <Input
                    disabled={!this.state.companySelected}
                    placeholder="Location"
                    id="outlined-required"
                    name="vendorLocation"
                    className="form-control"
                    value={this.state.newVendorContact}
                    onChange={this.handleChange}/>

                <div className="newvendor">
                    <Button  onClick={this.props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button disabled={!this.state.companySelected} onClick={this.addNewVendor} color="primary">
                        Add Vendor
                    </Button>
                </div>

            </div>


        );
    }
}

export default CreateVendorContact;
