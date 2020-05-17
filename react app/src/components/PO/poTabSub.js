import React, {Component} from 'react';

export default class PoTabSub extends Component {
    constructor(props, context) {
        super(props, context);
    }
    componentDidMount() {

    }

    render() {

        return (
            <div>
               
              <div className="col-md-6">
              
   
              <br/>
                    <label> Job Description:</label>
                     <div className="jd_po_form">
                       {this.props.submission_details.lead.job_desc}
                     </div>
                      
                      <br/>

                    <div className="row">

                        <div className="col-md-6">

                        <label> Job Title:</label> 
                        <div> 
                           {this.props.submission_details.lead.job_title}
                        </div>
                       <br/>

                        <label> Marketer: </label> 
                        <div>
                            {this.props.submission_details.lead.marketer}
                        </div>
                        <br/>

                        <label> Employer: </label>
                        <div> 
                            {this.props.submission_details.employer}
                        </div>
                        <br/>

                        </div>

                        <div className="col-md-6">
                           
                            <label> Location:</label> 
                            <div>
                                {this.props.submission_details.lead.location}
                            </div>
                            <br/>
                        
                             <label> Client: </label> 
                              <div>
                                {this.props.submission_details.client}
                              </div>
                              <br/>

                            <label> Marketing Email: </label>
                                <div>
                                    {this.props.submission_details.marketing_email}
                                </div>
                            <br/>

                        </div>

                    </div>

                      
                    <div>
                    {this.props.submission_details.vendor_contact === null?
                        <div>
                          <label>Vendor Company:</label><br/>
                          {this.props.submission_details.lead.vendor_company_name}
                        </div>:
                        <div>
                            Vendor Details:
                            <div>
                            Vendor Company:{this.props.submission_details.vendor_contact.name}
                            Vendor Name:{this.props.submission_details.vendor_contact.name}
                            Vendor Contact:{this.props.submission_details.vendor_contact.name}
                            Vendor Email:{this.props.submission_details.vendor_contact.name}
                            </div>
                        </div>
                    }
                    </div>



                </div>



                <div className="col-md-6">

                    <br/><br/><br/>
                    <div className="mainform mainform_section">
                        <div className="headform">
                            Consultant Profile
                        </div>

                        <div className="mainform2 poform">
                            <div className="row">
                                <br/>

                                <div className="col-md-12">

                                    <div className="row">

                                        <div className="col-md-6">
                                        <label>
                                            Title:
                                            {this.props.submission_details.consultant.title}
                                        </label>
                                        <br/>

                                        <label>
                                            Education:
                                            {this.props.submission_details.consultant.education}
                                        </label>
                                        <br/>

                                        <label>
                                            Visa Type:
                                            {this.props.submission_details.consultant.visa_type}
                                        </label>
                                        <br/>

                                        <label>
                                            Visa End Date:
                                            {this.props.submission_details.consultant.visa_end}
                                        </label>
                                        <br/>

                                        </div>



                                        <div className="col-md-6">
                                        <label>
                                            Date of Birth:
                                            {this.props.submission_details.consultant.dob}
                                        </label>
                                        <br/>

                                        <label>
                                           Current Location:
                                           {this.props.submission_details.consultant.location}
                                        </label>
                                        <br/>
                                        
                                      <label>
                                        Visa Start Date:
                                        {this.props.submission_details.consultant.visa_start}
                                       </label>
                                      <br/>

                                      <label>
                                        LinkedIN:
                                        {this.props.submission_details.consultant.links}
                                      </label>

                                        </div>

                                    </div>

                                   
                                    
                                    
                                    

                                    
                                   
                                    
                                </div>


                            </div>
                        </div>
                    </div>
<br/>
<br/>
<br/>
<br/>
                </div>
            </div>
        )

    }
}
