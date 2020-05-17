import React, {Component} from 'react';
import "../App.css";
import {Link} from 'react-router-dom';
import {withRouter} from "react-router";

class Info extends Component {
    constructor(props){
        super(props)
    }
    render() {
        return (
            <div className="info">
               <ul className="infosection">

              <li>
                  <Link to="/home">
                    <div className="indexMarketing">
                       <p>Marketing</p>
                    </div>
                  </Link> 
              </li>

               <li>
                   <Link to="/dashboard">
                        <div className="indexDashboard">
                           <p> Dashboard </p>
                        </div>
                    </Link>
               </li>

               </ul>

            </div>
        )
    }
}

export default withRouter(Info);
