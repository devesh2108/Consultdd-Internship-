import React, {Component} from 'react';
import {addNewVendor} from "../../../services/service";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

class CreateVendorData extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            newVendorName:'',
            newVendorEmail:'',
            newVendorContact:''
        };
        this.handleChange = this.handleChange.bind(this);
        this.addNewVendor = this.addNewVendor.bind(this);
    }
    handleChange(event) {

        this.setState({[event.target.name]: event.target.value});
    };
    addNewVendor() {
        console.log(this.props.companyId)
        const body = {
            'company': this.props.companyId,
            'name': this.state.newVendorName,
            'email': this.state.newVendorEmail,
            'number': this.state.newVendorContact
        };
        if(this.props.companyId && this.state.newVendorName && this.state.newVendorEmail && this.state.newVendorContact) {
            addNewVendor(body)
                .then((response) => {

                    const statusCode = response.status;
                    const res = response.json();
                    return Promise.all([statusCode, res]);
                })
                .then(([status, response]) => {

                    this.setState({vendorId: response.result.id});
                    this.setState({vendor: response.result.name});
                    this.props.vendorList.push(response.result);
                    this.props.selectVendor(response.result)
                    this.props.handleClose()

                })
                .catch((error) => {
                    console.error(error);
                });
        }

    }
    render() {
        return (
            <div>


                        <label> Vendor Company: </label>
                        <p aria-disabled={true}>{this.props.companyName}</p>
                        <br/>
                        <label>  Contact Name: </label>
                        <input
                            id="outlined-required"
                            name="newVendorName"
                            className="form-control"
                            value={this.state.newVendorName}
                            onChange={this.handleChange}/>
                        <br/>
                        <label> Email: </label>
                        <input
                            id="outlined-required"
                            name="newVendorEmail"
                            className="form-control"
                            value={this.state.newVendorEmail}
                            onChange={this.handleChange}/>
                        <br/>
                        <label> Phone: </label>
                        <input
                            id="outlined-required"
                            name="newVendorContact"
                            className="form-control"
                            value={this.state.newVendorContact}
                            onChange={this.handleChange}/>

                        <div className="newvendor">
                                <Button onClick={this.props.handleClose} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={this.addNewVendor} color="primary">
                                    Add Vendor
                                </Button>
                        </div>

            </div>


        );
    }
}

export default CreateVendorData;
