import {addEducation, editEducation} from "../services/service";
import moment from "moment";

export async function addEdu (props,consultantId) {

    const body = {
        'title': props.title,
        'remark': props.remark,
        'city': props.city,
        'major': props.major,
        'org_name': props.org_name,
        'edu_type': props.type,
        'start_date': moment(props.start_date).format("YYYY-MM-DD"),
        'end_date': moment(props.end_date).format("YYYY-MM-DD"),
    } || null;
    await addEducation(consultantId, body)
        .then((response) => {
            const statusCode = response.status;
            const res = response.json();
            return Promise.all([statusCode, res]);
        })
        .then(([status, res]) => {
           if( status === 201 ){
               return body;
           }
           else{
               return null
           }
        })
        .catch(error => {
            return error
        });
}

export async function editEdu (props,obj) {
    const body = {
        'id':obj.id,
        'title': props.title,
        'remark': props.remark,
        'city': props.city,
        'major': props.major,
        'org_name': props.org_name,
        'edu_type': props.type,
        'start_date': moment(props.start_date).format("YYYY-MM-DD"),
        'end_date': moment(props.end_date).format("YYYY-MM-DD"),
    }
    await editEducation(obj.id, body)
        .then((response) => {
            const statusCode = response.status;
            const res = response.json();
            return Promise.all([statusCode, res]);
        })
        .then(([status, res]) => {
            return body
        })
        .catch(error => {
            console.log(error)
        });
}
