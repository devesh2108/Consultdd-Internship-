import httpService from './httpService';
export function login(body) {                               //Employee Login
   // return httpService.post('employee/login/',body);     //prod
    return httpService.post('auth/login/',body); //temp-dev
}
export function changePassword(body) {                      //Change employee Password
    return httpService.post('employee/change_password/',body); //same
}
export function addUser(body) {                             //Add Employee - only for superadmin
    //return httpService.post('employee/register/',body);     //prod
    return httpService.post('auth/register/',body);     //temp_dev
}


export function getEmployeeSuggestion(query,type) {
    return httpService.get('employee/?query='+query+'&type='+type);
}

export function addNewProfile(body) {
    return httpService.post('consultant_profile/',body);
}
export function editProfile(id,body) {
    return httpService.put('consultant_profile/'+id+'/',body);
}
export function addAttachment(body) {
    return httpService.attachment('attachment/',body);
}
export function addEducation(consultant_id,body) {
    return httpService.post('consultant/'+consultant_id+'/education/',body);
}
export function editEducation(edu_id,body) {
    return httpService.put('consultant/'+edu_id+'/education/',body);
}
export function addExperience(consultant_id,body) {
    return httpService.post('consultant/'+consultant_id+'/experience/',body);
}
export function editExperience(exp_id,body) {
    return httpService.put('consultant/'+exp_id+'/experience/',body);
}
export function editResume(body) {
    return httpService.attachment_update('attachment/',body);
}


export function updateProfile(body) {
    return httpService.put('consultant/consultant_profile/',body);
}
export function updatePO(body,id) {
    return httpService.put('project/'+id+'/',body);
}
export function getCities(query) {
    return httpService.get('city/?query='+query);
}
export function getPOById(id) {
    return httpService.get('project/'+id+'/');
}
export function getAllPO(page,filter,size,val) {
    return httpService.get('project/?page='+page+'&filter='+filter+'&page_size='+size+'&query='+val);
}
export function getAllConsultants() {
    return httpService.get('consultant/',);
}
export function getAllBenchConsultants(team,page,size,status) {
    return httpService.get('consultant_bench/?team='+team+'&page='+page+'&size='+size+'&status='+status);
}

export function getBenchByCity(status) {
    return httpService.get('consultant_bench/?map=map&status='+status);
}

export function getConsultantDataByCity(params) {
    return httpService.get('consultant_bench/?location='+params);
}

export function createProject(body) {
    return httpService.post('project/',body);
}
export function fileUpload(body) {
    return httpService.attachment('attachment/',body);
}
export function getConsultantDetails(id, param) {
    return httpService.get('consultant/'+id+'/?submission='+param);
}
export function editConsultant(id,body) {
    return httpService.put('consultant_marketing/'+id+'/',body);
}
export function editMarketing(id,body) {
    return httpService.put('consultant_marketing/'+id+'/',body);
}
export function getAllConsultantMarketing(id,stage) {
    return httpService.get('consultant/'+id+'/marketing/?stage='+stage);
}

export function fetchGuestList(query) {
    return httpService.get('employee/?type=interviewee&query='+query);
}
export function getMarketerList() {
    return httpService.get('employee/?query=');
}
export function addConsultantMarketer(consultant,body) {
    return httpService.put('consultant_marketing/'+consultant+'/marketer_assignment/',body);
}
export function deleteConsultantMarketer(consultantId,body) {
    return httpService.put('consultant_marketing/'+consultantId+"/remove_marketer/",body);
}
export function assignTeam(consultantId,body) {
    return httpService.put('consultant_marketing/'+consultantId+'/team_assignment/', body);
}
export function deleteTeam(consultantId,body) {
    return httpService.put('consultant_marketing/'+consultantId+"/remove_team/",body);
}

export function logout() {
    return httpService.get('employee/logout/'); //same but method-> DELETE
}

export function onPOSearch(query,page,size,status,filter) {
    return httpService.get('project/?query='+query+'&page='+page+'&page_size='+size+'&filter_for_status='+status+'&filter='+filter);
}
export function onBenchSearch(query,page,size,status) {
    return httpService.get('consultant_bench/?query='+query+'&page='+page+'&page_size='+size+'&status='+status);
}
export function getCounter(query) {
    return httpService.get('marketing/counter/?query='+query);
}
export function userDetails(id) {
    return httpService.get('employee/'+id+'/');
}
export function getTeam() {
    return httpService.get('employee/team/'); //same
}
export function getRole() {
    return httpService.get('employee/role/'); //same
}
export function deleteAttachment(id) {
    return httpService.delete('attachment/'+id+'/?attachment_id='+id);
}
export function jdParser(body) {
    return httpService.post('jd/parser/',body);
}
export function uploadBench(body) {
    return httpService.attachment('consultant/upload_bench/', body);
}
export function oldSubmission(page,size) {
    return httpService.get('ckiller/?page='+page+'&page_size='+size);
}
export function onOldSubmissionSearch(id,query,page,size) {
    return httpService.get('ckiller/?consultant='+id+'&query='+query+'&page='+page+'&page_size='+size);
}

export function onSpecificFilterPO(filter,status,page,size) {
    return httpService.get('project/?&filter='+filter+'&filter_for_status='+status+'&page='+page+'&page_size='+size);
}
export function onSpecificFilterBench(team,page,size,status,query) {
    return httpService.get('consultant_bench/?team='+team+'&page='+page+'&page_size='+size+'&status='+status+'&query='+query);
}
export function getStatus() {
    return httpService.get('utils/project/statuses/');
}
export function importData(body) {
    return httpService.post('ckiller/',body);
}
export function mailOnboarding(id) {
    return httpService.get('project/mail_to_onboard/?project_id='+id);
}

export function resetPswd(body) {
    return httpService.post('employee/reset_password/',body); // password/token_request
}
export function changePswd(body) {
    return httpService.post('employee/confirm_password/',body); // password/confirm_password
}
export function testAttachment(body) {
    return httpService.attachment('marketing/attachment/',body);
}
export function addConsultant(body) {
    return httpService.post('consultant/',body);
}
export function addAsset(body) {
    return httpService.post('assets/',body);
}
export function getAssetData() {
    return httpService.get('assets/');
}
export function deleteAssetData(id) {
    return httpService.delete('assets/'+id+'/');
}
export function editAssetData(id,body) {
    return httpService.put('assets/'+id+'/',body);
}
export function shareAssetData(body) {
    return httpService.put('assets/share/',body);
}
export function unshareAssetData(userId,id) {
    return httpService.put('assets/'+id+'/un_share/',userId);
}
export function getSpecificAssetData(id) {
    return httpService.get('assets/'+id+'/');
}
export function getMyAssetData(status) {
    return httpService.get('assets/?asset='+status);
}
export function bulkUpload(body) {
    return httpService.attachment('assets/bulk_upload/',body);
}
export function getAttachments(id) {
    return httpService.get('consultant/'+id+'/documents/');
}
export function getRateRevision(consultantId) {
    return httpService.get('consultant/'+consultantId+'/rate_revision/');
}
export function getComments(consultantId) {
    return httpService.get('consultant/'+consultantId+'/comments/');
}
export function addComment(consultantId,body) {
    return httpService.post('consultant/'+consultantId+'/comments/',body);
}
export function editPOC(id, body) {
    return httpService.put('consultant_poc/'+id+'/', body);
}
export function createPOC(body) {
    return httpService.post('consultant_poc/', body);
}
export function editPrimaryMarketer(id, body) {
    return httpService.put('consultant_marketing/'+id+'/',body);
}
export function createWorkAuth(body) {
    return httpService.post('consultant_work_auth/', body);
}

export function createfeedback(id,type,body) {
    return httpService.post('consultant/'+id+'/feedback/?type='+type, body);
}
export function getfeedback(id,type,body) {
    return httpService.get('consultant/'+id+'/feedback/?feedback_type='+type);
}
export function editWorkAuth(id, body) {
    return httpService.put('consultant_work_auth/'+id+'/', body);
}

// type = 'submission/interview/project'
// filter_by_time and filter_by_status

// Vendor Company
export function addNewCompany(body) {
    return httpService.post('vendor_company/',body)
}
export function getVendorCompanySuggestions(query) {
    return httpService.get('vendor_company/?query='+query);
}

export function onVendorCompanySearch(query) {
    return httpService.get('vendor_company/?query='+query);
}

// Vendor Contact
export function addNewVendor(body) {
    return httpService.post('vendor_contact/',body);
}

export function getAllVendorByCompany(id) {                 // Get all vendor by the name of the company
    return httpService.get('vendor_contact/'+id+'/')
}

// Lead
export function addLead(body) {
    return httpService.post('lead/',body);
}

export function updateLead(body,id) {
    return httpService.put('lead/'+id+'/',body);
}

export function getAllLeads(page,query,filter,size) {
    return httpService.get('lead/?page='+page+'&filter='+filter+'&page_size='+size+'&query='+query);
}

export function getAllArchivedLeads(page,size) {
    return httpService.get('lead/archived/');
}

export function getLeadByCity() {
    return httpService.get('lead/leads_by_city/',);
}

export function createArchive(body) {
    return httpService.put('lead/archive_leads/',body);
}

export function getLeadDataByCity(params) {
    return httpService.get('lead/leads_by_city/?query='+params);
}

export function onLeadSearch(query,page,size,status,filter) {
    return httpService.get('lead/?query='+query+'&page='+page+'&page_size='+size+'&filter_for_status='+status+'&filter='+filter);
}

export function onSpecificFilterLead(filter,query,page,size) {
    return httpService.get('lead/?&status='+filter+'&page='+page+'&page_size='+size+'&query='+query);
}

// Submission
export function addSubmission(body) {
    return httpService.attachment('submission/',body);
}

export function updateSubmission(body,id) {
    return httpService.put('submission/'+id+'/',body);
}

export function getAllSubmission(page,filter,size,val,con) {
    return httpService.get('submission/?page='+page+'&filter_by_time='+filter+'&page_size='+size+'&query='+val+'&consultant_id='+con);
}

export function getUniqueSubmission(id) {
    return httpService.get('submission/'+id+'/');
}

export function onSubmissionSearch(con,query,page,size,status,filter,filter_for) {
    return httpService.get('submission/?consultant_id='+con+'&query='+query+'&page='+page+'&page_size='+size+'&filter_by_status='+status+'&filter_by_time='+filter+'&filter_for='+filter_for);
}

export function getConsultantSubmissions(id,page,size) {
    return httpService.get('submission/by_consultant/?id='+id+'&page='+page+'&page_size='+size);
}

export function getSubSuggestions(id,consultant_id,company_id) {
    return httpService.get('submission/suggestions/?lead_id='+id+'&consultant='+consultant_id+'&company_id='+company_id);
}

export function getSubClientSuggestions(id,consultant_id,client_name) {
    return httpService.get('submission/suggestions/?lead_id='+id+'&consultant='+consultant_id+'&client_name='+client_name);
}

export function didyoumean(client) {
    return httpService.get('submission/did_you_mean/?client='+client);
}

export function mySubs(filter,type,status,page,size,val,con) {
    return httpService.get('submission/?filter_by_time='+filter+'&filter_for='+type+'&filter_by_status='+status+'&page='+page+'&page_size='+size+'&query='+val+'&consultant_id='+con);
}

export function onSpecificFilterSub(filter,type,status,page,size,val,con) {
    return httpService.get('submission/?filter_by_time='+filter+'&filter_for='+type+'&filter_by_status='+status+'&page='+page+'&page_size='+size+'&query='+val+'&consultant_id='+con);
}

// Vendor Layer

export function addLayer(body) {
    return httpService.post('vendor_layer/',body);
}
export function editLayer(submission_id,body) {
    return httpService.put('vendor_layer/'+submission_id+'/',body);
}
export function deleteLayer(submission_id) {
    return httpService.delete('vendor_layer/'+submission_id+'/');
}
export function getLayer(submission_id) {
    return httpService.get('vendor_layer/'+submission_id+'/');
}

// Interviews

export function addFeedback(id,body,flag) {
    return httpService.put('interview/'+id+'/?status_change='+flag,body);
}
export function updateScreening(id,body,flag,reschedule) {
    return httpService.put('interview/'+id+'/?status_change='+flag+'&reschedule='+reschedule,body);
}
export function deleteScreening(id) {
    return httpService.delete('interview/'+id+'/');
}
export function getAllInterview(page,filter,size,val) {
    return httpService.get('interview/?page='+page+'&filter='+filter+'&page_size='+size+'&query='+val);
}
export function getInterviewByScreeningId(id) {
    return httpService.get('interview/'+id+'/');
}
export function getInterviewByCalendarId(id) {
    return httpService.get('interview/by_calendar/?calendar_id='+id);
}
export function getInterviewee() {
    return httpService.get('employee/?type=interview');
}
export function createEvent(body) {
    return httpService.post('interview/',body);
}
export function getEvents(start,end,email) {
    return httpService.get('interview/calendar_interviews/?start='+start+ '&end=' + end + '&email='+email);
}
export function getConsultantInterviews(id,page,size) {
    return httpService.get('interview/by_consultant/?id='+id+'&page='+page+'&page_size='+size);
}
export function onInterviewSearch(query,page,size,status,filter,filter_for) {
    return httpService.get('interview/?query='+query+'&page='+page+'&page_size='+size+'&filter_for_status='+status+'&filter='+filter+'&filter_for='+filter_for);
}
export function getCtbSuggestions(id,ctb) {
    return httpService.get('marketing/interview_suggestions/?&sub_id='+id+'&ctb='+ctb);
}
export function getIntSuggestions(id,ctb_id) {
    return httpService.get('interview/suggestions/?sub_id='+id+'&supervisor='+ctb_id);
}

export function myInt(filter,type,status,page,size,val) {
    return httpService.get('interview/?filter='+filter+'&filter_for='+type+'&filter_for_status='+status+'&page='+page+'&page_size='+size+'&query='+val);
}

export function onSpecificFilterInt(filter,type,status,page,size,query) {
    return httpService.get('interview/?filter='+filter+'&filter_for='+type+'&filter_for_status='+status+'&page='+page+'&page_size='+size+'&query='+query);
}

//Notifications

export function notify() {
    return httpService.get('emp_notify/');
}
export function unReadNotify(id) {
    return httpService.get('emp_notify/'+id+'/mark_as_read/',{});
}
export function markAllRead() {
    return httpService.get('emp_notify/mark_all_read/',{});
}
// Finance

export function getFinance(page,size,consultant,query) {
    return httpService.get('finance/?page='+page+'&page_size='+size+'&consultant='+consultant+'&query='+query);
}
export function getConsultantTimesheetData(id) {
    return httpService.get('finance/'+id+'/');
}
export function changeStatus(id,body) {
    return httpService.put('finance/'+id+'/',body);
}
export function changeTimesheetStatus(id,start,end,query) {
    return httpService.get('finance/'+id+'/?start='+start+'&end='+end+'&query='+query);
}
export function searchConsultants(query) {
    return httpService.get('finance/?consultant_name='+query);
}

//Rate Revision
export function createRateRevision(id,body) {
    return httpService.post('consultant/'+id+'/rate_revision/',body);
}

//Remarketing
export function addConsultantToMarketing(id,body) {
    return httpService.post('consultant_marketing/'+id,body);
}
export function getMarketingCycle(id) {
    return httpService.get('consultant_marketing/remarketing/?consultant='+id);
}

//Vendor Company
export function getVendorCompany(query) {
    return httpService.get('vendor_company/?query='+query);
}

// export function addSubmission(body) {
//     return httpService.attachment('submission/submission/',body);
// }
