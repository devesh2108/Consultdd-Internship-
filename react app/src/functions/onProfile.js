import {addNewProfile, editProfile} from "../services/service";
import moment from "moment";

export async function addProfile (props,consultantId) {

    const body = {
        "title": props.title,
        "links": props.links,
        "linkedin": props.linkedin,
        "dob": moment(props.dob).format("YYYY-MM-DD"),
        "current_city": props.current_city,
        "visa_end": moment(props.visaEnd).format("YYYY-MM-DD"),
        "visa_start": moment(props.visaStart).format("YYYY-MM-DD"),
        "visa_type": props.visaType,
        "education": props.education,
        "consultant": consultantId
    };
    const response = await addNewProfile(body);
    const json = await response.json();
    return json.result;
}

export async function editProf (props,obj,consultantId) {
    const body = {
        "title": props.title,
        "links": props.links,
        "linkedin": props.linkedin,
        "dob": moment(props.dob).format("YYYY-MM-DD"),
        "current_city": props.current_city,
        "visa_end": moment(props.visaEnd).format("YYYY-MM-DD"),
        "visa_start": moment(props.visaStart).format("YYYY-MM-DD"),
        "visa_type": props.visaType,
        "education": props.education,
        "consultant": consultantId
    }
    const response = await editProfile(obj, body);
    const json = await response.json();
    return  json.result
}
