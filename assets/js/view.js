//$Id$
var emailexp=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
var http_var="htt"+"p";
var https_var="http"+"s";
var ipexp=/^[0-9]+(\.|-)[0-9]+(\.|-)[0-9]+(\.|-)[0-9]+$/
var ipAddressRegex=/^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/
//var ipexp=( /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?));
var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;
var response_data = "";
var count_url_report = 0;
var count_port=0;
var row_values=[];
var locations_url_response="";
var ch_colr=0;
var flg = 0;
var count_ping = 0;
var count_linkcheck = 0;
var ping_response = [];
var img_values = [];
var link_values = [];
var customviewmonitor = ['SERVER','MSEXCHANGE']; //No I18N
var timeOut;
function ControlVersion()
{
	var version;
	var axo;
	var e;
	try 
	{
		axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		version = axo.GetVariable("$version");
	} 
	catch (e) {}
	if (!version)
	{
		try 
		{
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
			version = "WIN 6,0,21,0";
			axo.AllowScriptAccess = "always";
			version = axo.GetVariable("$version");
		} 
		catch (e) {}
	}
	if (!version)
	{
		try 
		{
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = axo.GetVariable("$version");
		} 
		catch (e) {}
	}
	if (!version)
	{
		try 
		{
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = "WIN 3,0,18,0";
		} 
		catch (e) {}
	}
	if (!version)
	{
		try 
		{
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			version = "WIN 2,0,0,11";
		} 
		catch (e) 
		{
			version = -1;
		}
	}
	return version;
}
function deselectText( containerid ) {
	//console.log(containerid);
    var node = document.getElementById( containerid );
    if ( document.selection ) {
        var range = document.body.createTextRange();
        document.selection.empty();
    } else if ( window.getSelection ) {
        var range = document.createRange();
        range.selectNodeContents( node );
        window.getSelection().removeAllRanges();
    }
}

function serverSelectText( containerid ) {
	//console.log(containerid);
	var divIds = ["64bitinstall", "32bitinstall"]; //No I18N
    var node = document.getElementById( containerid );
    for(i=0;i<divIds.length;i++)
	{
    	if(containerid != divIds[i])
		{
    		deselectText(divIds[i]);
		}
	}
    if ( document.selection ) {
        var range = document.body.createTextRange();
        //console.log("Range : "+range);
        range.moveToElementText( node  );
        range.select();
    } else if ( window.getSelection ) {
        var range = document.createRange();
        //console.log("Range : "+range);
        range.selectNodeContents( node );
        window.getSelection().removeAllRanges();
        window.getSelection().addRange( range );
    }
}

function serverProxy(divId) {
	//alert(document.getElementById("64cmdnoproxy").style.display);
	if(document.getElementById("64cmdnoproxy").style.display == "block")
	{
		document.getElementById("64cmdnoproxy").style.display="none";
		document.getElementById("32cmdnoproxy").style.display="none";
		document.getElementById("64cmdproxy").style.display="block";
		document.getElementById("32cmdproxy").style.display="block";
	}
	else
	{
		document.getElementById("64cmdnoproxy").style.display="block";
		document.getElementById("32cmdnoproxy").style.display="block";
		document.getElementById("64cmdproxy").style.display="none";
		document.getElementById("32cmdproxy").style.display="none";
	}
	
}

function openInNewTab(url) {
	  var win = window.open(url, '_blank');
	  win.focus();
	}

function selectMonitor(divId) {
	//console.log('Div id : '+divId);
	var divIds = ["windowsmonitor", "linuxmonitor", "othermonitor"]; //No I18N
	var panelIds = ["windowsPanel", "linuxPanel", "queriesPanel"]; //No I18N
	for (var i = 0; i < divIds.length; i++) {
		//console.log('Div id : '+divIds[i]+ document.getElementById(divIds[i]));
		//console.log('Panel id : '+panelIds[i]);
		if(divIds[i] == divId)
		{
			//console.log('Div id : '+divIds[i]);
			//console.log('Panel id : '+panelIds[i]);
			document.getElementById(divIds[i]).style.display="block";
			document.getElementById(panelIds[i]).className = 'activeInstallPanel';
		}
		else
		{
			document.getElementById(divIds[i]).style.display="none";
			document.getElementById(panelIds[i]).className = 'installPanel';
		}
	}
	
}
function GetSwfVer()
{
	var flashVer = -1;
	if (navigator.plugins != null && navigator.plugins.length > 0) 
	{
		if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) 
		{
			var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
			var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
			var descArray = flashDescription.split(" ");
			var tempArrayMajor = descArray[2].split(".");			
			var versionMajor = tempArrayMajor[0];
			var versionMinor = tempArrayMajor[1];
			var versionRevision = descArray[3];
			if (versionRevision == "") 
			{
				versionRevision = descArray[4];
			}
			if (versionRevision[0] == "d") 
			{
				versionRevision = versionRevision.substring(1);
			} 
			else if (versionRevision[0] == "r") 
			{
				versionRevision = versionRevision.substring(1);
				if (versionRevision.indexOf("d") > 0) 
				{
					versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
				}
			}
			var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
		}
	}
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
	else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
	else if ( isIE && isWin && !isOpera ) 
	{
		flashVer = ControlVersion();
	}	
	return flashVer;
}
function fnEditAction(frm)
{
  	 closeDialog();
  	 getHtmlForForm(frm,"postEditAction",frm)  //No I18N
  	 showDiv('loading'); //No I18N
}
function postEditAction(response,frm)
{
  	 var actionid=(getValue(response,"ax_actionid")); //No I18N
  	 var positionId=frm.positionId.value;
  	 var actionDesc=(getValue(response,"ax_actionDesc")); //No I18N
  	 document.getElementById(positionId).innerHTML=actionDesc;
  	 document.getElementsByName("alertType_"+actionid)[0].value=frm.alertTypeForAction.value;
}
function addNewRow(thisRow)
{
        document.getElementById('selectAction').style.display="block";
        (document.getElementsByName('globalAction')[0]).value='0';
}
function fnRemoveAction(actionid,positionId)
{
	getHtml('/home/CreateTest.do?execute=removeAction&actionid='+actionid,"postRemoveAction",actionid,positionId);//No I18N
}
function postRemoveAction(response,actionid,positionId)
{
	var Node = document.getElementById('actionRow_'+positionId);
	Node.parentNode.removeChild(Node);
	var len=document.getElementById('newAction_501').childNodes.length-1;
	if(len==0)
	{
		document.getElementById('selectAction').style.display="block";

	}
	else if(len==1)
	{
		var positionId= document.getElementById('newAction_501').childNodes.item(1).getAttribute("id").split("_")[1];
		if(document.getElementById('addAction_'+positionId).style.display=='none')
		{
			document.getElementById('addAction_'+positionId).style.display='block'
		}
	}
	else
	{
		var doc=document.getElementById('newAction_501').childNodes;
		var len=doc.length-1;
		var positionId=501;
		for(var i=0;i<len+1;i++)
		{
			if(doc.item(i).innerHTML==undefined)
			{
				continue;
			}
			posId=doc.item(i).id.split("_")[1];
			if(posId>positionId)
			{
				positionId=posId;
			}
		}
		document.getElementById('addAction_'+positionId).style.display='block'
	}
}       
function fnAddAction(frm)
{
	closeDialog();
	getHtmlForForm(frm,"postAddAction",frm) //No I18N
	showDiv('loading'); //No I18N
}
function postAddAction(response,frm)
{
	var actionid=(getValue(response,"ax_actionid")); //No I18N
	var actionDesc=(getValue(response,"ax_actionDesc")); //No I18N
	var id=frm.identifier.value;
	var doc=document.getElementById('newAction_501').childNodes; //No I18N
	var len=doc.length-1;
	var positionId=501;
	var lastChildPosition=501;
	for(var i=0;i<len+1;i++)
	{
		if(doc.item(i).innerHTML==undefined)
		{
			continue;
		}
		posId=doc.item(i).id.split("_")[1];
		if(posId>positionId)
		{
			positionId=posId;
		}
		lastChildPosition=posId;
	}
	if(len>0)
	{
		positionId++;
	}
	document.getElementById('selectAction').style.display="none";
	var divcontent = "<div id='actionRow_"+positionId+"' style='display:block'><input type='hidden' name='Action_"+actionid+"' value='"+actionid+"'/><input type='hidden' name='alertType_"+actionid+"' value='"+frm.alertTypeForAction.value+"'/><div id="+positionId+" style='padding-left:30px;float:left;width:60%'>"+actionDesc+"</div> <div style='float:left;width:10%'><a href=\"javascript:void(0)\" onClick=\"$.showEditAction("+actionid+","+positionId+")\"/>Edit </a></div><div style='display:block;float:left;width:10%' id='addAction_"+positionId+"'><img src=\"/images/addNew.gif\" onClick=\"javascript:addNewRow(this)\"/></div><div id='removeAction_"+positionId+"'><img src=\"/images/wrong.gif\" onClick=\"javascript:fnRemoveAction('"+actionid+"','"+positionId+"')\"/></div></div>";
	window.parent.document.getElementById("newAction_"+id).innerHTML=window.parent.document.getElementById("newAction_"+id).innerHTML+divcontent;
	window.parent.document.getElementById("newAction_"+id).style.display="block";
	var deletedivcontent = "<img src=\"/images/wrong.gif\" onClick=\"javascript:deleteHeaderEntry('"+id+"')\"/>"
	var actionsdiv = getnewDivElement("additonalHeaderActions"+id,divcontent); //No I18N
	hideDiv('loading');  //No I18N
	if(positionId==501)
	{
		return;
	}
	window.parent.document.getElementById("addAction_"+lastChildPosition).style.display="none";
}
function  showLinks(id)
{
/*
showDiv('report'+id);
showDiv('edit'+id)
showDiv('delete'+id);
hideDiv('reporticon'+id);
	hideDiv('editicon'+id);
	hideDiv('delicon'+id);
	*/
	//alert(document.getElementById('delicon'+id).width)
}

function  hideLinks(id)
{
/*
hideDiv('report'+id)
hideDiv('edit'+id)

hideDiv('delete'+id)

showDiv('reporticon'+id);
	showDiv('editicon'+id);
	showDiv('delicon'+id);
*/
}

function dailyreports(frm)
{
if(frm.dailyReportEnabled.checked)
{
	showDiv('dailyreport');
}
else
{
	hideDiv('dailyreport');
}
}
function weeklyreports(frm)
{
if(frm.weeklyReportEnabled.checked)
{
	showDiv('weeklyreport');
}
else
{
	hideDiv('weeklyreport');
}
}
function showallwebsitesstatus(frm)
{
location.href="../home/CreateTest.do?execute=getAllWebsitesStatus&Period="+frm.predefinedperiod.value;
}

function view_daily()
{
showDiv("view_daily");
hideDiv("view_weekly");
hideDiv("view_once");
}
function view_weekly()
{
showDiv("view_weekly");
hideDiv("view_daily");
hideDiv("view_once");
}
function view_once()
{
showDiv("view_once");
hideDiv("view_weekly");
hideDiv("view_daily");
}
Msgbean=function(){
    var msg=arguments[0];   
    if(msg!=undefined){
        for(var i=1;i< arguments.length;i++){
            msg=msg.replace('{' + (i-1) + '}',arguments[i]);
        }
    }
    return msg;
}
function cancelmaintenance()
{
	showDiv('Scheduled_reports');//No I18N
	hideDiv('Schedule_maintenance');//No I18N
	hideDiv('add_maintenance');//No I18N
}
function updateschedule(aurl,frm,dt,group)
{
	if(!validatescheduleName(frm.scheduleName.value))
	{
	frm.scheduleName.select();
	return false;
	}
	if(frm.scheduleMethod[0].checked)
	{
		if(!validatetime(frm.daily_Start_Time.value))
		{
		alert(beanmsg["nostarttime"]);
		return false;
		}
		if(!validatetime(frm.daily_End_Time.value))
		{
		alert(beanmsg["noendtime"]);
		return false;
		}
		/*if(!validatetimecheck(frm.daily_Start_Time.value,frm.daily_End_Time.value))
		{
		alert(beanmsg["invalidtime"]);
		return false;
		}*/
	}
	if(frm.scheduleMethod[1].checked)
	{
		if(!validatetime(frm.weekly_start_Time.value))
		{
		alert(beanmsg["nostarttime"]);
		return false;
		}
		if(!validatetime(frm.weekly_end_Time.value))
		{
		alert(beanmsg["noendtime"]);
		return false;
		}
		if((frm.weeklyStartDate.value==frm.weeklyEndDate.value) && !validatetimecheck(frm.weekly_start_Time.value,frm.weekly_end_Time.value))
		{
		alert(beanmsg["invalidtime"]);
		return false;
		}
	}
	if(frm.scheduleMethod[2].checked)
	{
		frm.onceStartDate.value = frm.actualStartTrigger.value+" "+frm.onceStartTime.value;
		frm.onceEndDate.value = frm.actualEndTrigger.value+" "+frm.onceEndTime.value;
		if(frm.startTrigger.disabled)
		{
		if(frm.onceStartDate.value>frm.onceEndDate.value || frm.onceStartDate.value == frm.onceEndDate.value)
		{
		alert(beanmsg["invalidtime"]);
		return false;
		}
		}
		else if(!validateoncetime(frm.onceStartDate.value,frm.onceEndDate.value,dt))
		{
		return false;
		}
	}
	var radio=frm.buttontype;
	var gavailability=document.getElementById("groupavail");
	if(radio!=null)
	{
		if(radio[0]!=null && radio[0].checked && gavailability.value == "nogroup")
		{
			alert(beanmsg["groupna"]);
			return false;
		}
		var mavailability=document.getElementById("monitoravail");
		if(radio[1]!=null && radio[1].checked && mavailability.value == "nomon")
		{
			alert(beanmsg["urlna"]);
			return false;
		}
		var reqd=null;
		if(radio[0]!=null && radio[0].checked && group.length === 0)
		{
			alert(beanmsg["selectgroup"]);
			return false;
		}
		else if(radio[0]!=null && radio[0].checked)
		{
			for(i=0;i<group.length;i++)
			{
				group[i].selected=true;
			}
		}
		if(radio[1]!=null && radio[1].checked && aurl.length === 0)
		{
			alert(beanmsg["selecturl"]);
			return false;
		}
		else if(radio[1]!=null && radio[1].checked)
		{
			selectall(aurl);
		}
	}
	else 
	{
		if(aurl.length === 0)
		{
			alert(beanmsg["selecturl"]);
			return false;
		}
		selectall(aurl);
	}
	/*if(aurl.length === 0)
	{
	alert(beanmsg["selecturl"]);
	return false;
	}
	selectall(aurl);*/
	// document.getElementById('monlist'+rowid).options[document.getElementById('monlist'+rowid).selectedIndex].value;
	//alert(frm.scheduleMethod.value+"---"+frm.grpbtn);
	
	var scheduleElements = document.getElementsByName("scheduleMethod");


	for(i=0; i<scheduleElements.length; i++)
	{
		scheduleElements[i].disabled=false;
	}
	if(frm.assbtn!=undefined)
	{
		frm.assbtn.disabled=false;
	}
	if(frm.grpbtn!=undefined)
	{
		frm.grpbtn.disabled=false;
	}
	if(frm.indisusplist!=undefined)
	{
		frm.indisusplist.disabled=false;
	}
	if(frm.grpsusplist!=undefined)
	{
		frm.grpsusplist.disabled=false;
	}
	frm.execute.value="updateSchedule";
	var response = $.getPostAjaxResponse("/home/scheduleMaintenance.do",frm.id);//No I18N
	$("#userarea").html(response);//No I18N
}

function addschedule(aurl,frm,dt,group)
{
	if(!validatescheduleName(frm.scheduleName.value))
	{
	frm.scheduleName.select();
	return false;
	}
	if(frm.scheduleMethod[0].checked)
	{
		if(!validatetime(frm.daily_Start_Time.value))
		{
		alert(beanmsg["nostarttime"]);
		return false;
		}
		if(!validatetime(frm.daily_End_Time.value))
		{
		alert(beanmsg["noendtime"]);
		return false;
		}
		/*if(!validatetimecheck(frm.daily_Start_Time.value,frm.daily_End_Time.value))
		{
		alert(beanmsg["invalidtime"]);
		return false;
		}*/
	}
	if(frm.scheduleMethod[1].checked)
	{
		if(!validatetime(frm.weekly_start_Time.value))
		{
		alert(beanmsg["nostarttime"]);
		return false;
		}
		if(!validatetime(frm.weekly_end_Time.value))
		{
		alert(beanmsg["noendtime"]);
		return false;
		}
		if((frm.weeklyStartDate.value===frm.weeklyEndDate.value) && !validatetimecheck(frm.weekly_start_Time.value,frm.weekly_end_Time.value))
		{
		alert(beanmsg["invalidtime"]);
		return false;
		}
	}
	if(frm.scheduleMethod[2].checked)
	{
		frm.onceStartDate.value = frm.actualStartTrigger.value+" "+frm.onceStartTime.value;
		frm.onceEndDate.value = frm.actualEndTrigger.value+" "+frm.onceEndTime.value;
		
		if(!validateoncetime(frm.onceStartDate.value,frm.onceEndDate.value,dt))
		{
		return false;
		}
	}
	var radio=frm.buttontype;
	var gavailability=document.getElementById("groupavail");
	if(radio!=null)
	{
		if(radio[0]!=null && radio[0].checked && gavailability.value == "nogroup")
		{
			alert(beanmsg["groupna"]);
			return false;
		}
		var mavailability=document.getElementById("monitoravail");
		if(radio[1]!=null && radio[1].checked && mavailability.value == "nomon")
		{
			alert(beanmsg["urlna"]);
			return false;
		}
		var reqd=null;
		if(radio[0]!=null && radio[0].checked && group.length === 0)
		{
			alert(beanmsg["selectgroup"]);
			return false;
		}
		else if(radio[0]!=null && radio[0].checked)
		{
			for(i=0;i<group.length;i++)
			{
				group[i].selected=true;
			}
		}
		if(radio[1]!=null && radio[1].checked && aurl.length === 0)
		{
			alert(beanmsg["selecturl"]);
			return false;
		}
		else if(radio[1]!=null && radio[1].checked)
		{
			selectall(aurl);
		}
	}
	else 
	{
		if(aurl.length === 0)
		{
			alert(beanmsg["selecturl"]);
			return false;
		}
		else
		{
			selectall(aurl);
		}
	}
	var response = $.getPostAjaxResponse("/home/scheduleMaintenance.do",frm.id);//No I18N
	$("#userarea").html(response);//No I18N
}
function validateoncetime(oncestart,onceend,dt)
{
	var dattime = oncestart.split(' ');
	var dattime1 = onceend.split(' ');
	var date=dattime[0].split('-');
	var enddate=dattime1[0].split('-');
	var month=new Number(date[1]-1);
	var endmonth=new Number(enddate[1]-1);
	var time=dattime[1].split(':');
	var endtime=dattime1[1].split(':');
	var newdt=date[0]+'-';
	var currdt = dt.split(' ');
	var curr=currdt[0].split('-');
	var currtime=currdt[1].split(':');
	if(!validatetime(dattime[1]))
	{
	alert(beanmsg["nostarttime"]);
	return false;
	}
	if(!validatetime(dattime1[1]))
	{
	alert(beanmsg["noendtime"]);
	return false;
	}
	var mydate=new Date(date[0],month,date[2],time[0],time[1]);
	var currmonth=new Number(curr[1]-1);
	var currdate=new Date(curr[0],currmonth,curr[2],currtime[0],currtime[1]);
	
	if(currdate>=mydate){
		alert(beanmsg["invalidstarttime"]);
		return false;
	}
	//var selectedEnddate=new Date(enddate[0],month,enddate[2],endtime[0],endtime[1]);
	var selectedEnddate=new Date(enddate[0],endmonth,enddate[2],endtime[0],endtime[1]);
	if(mydate>selectedEnddate || mydate == selectedEnddate)
	{
		alert(beanmsg["invalidtime"]);
		return false;
	}
	return true;

}
function trim(str)
{
	if(!str || typeof str != 'string')
	{
		return null;
	}
	return str.replace(/^[\s]+/,'').replace(/[\s]+$/,'').replace(/[\s]{2,}/,' ');
}
function validatetime(timeval)
{
var timevalue=timeval.split(':');
var time = parseInt(timevalue[0])*60 + parseInt(timevalue[1]);
if(timeval.indexOf(':') === -1 || timeval.indexOf(':')===0)
{ 
return false;
}
if(time>1440 || time<0 )
{
return false;
}
return true;
}
function validatetimecheck(startvalue,endvalue)
{
var timevalue=endvalue.split(':');
var endtime=parseInt(timevalue[0])*60 + parseInt(timevalue[1]);
var timevalue1=startvalue.split(':');
 var starttime=parseInt(timevalue1[0])*60 + parseInt(timevalue1[1]);
 if(starttime > endtime || starttime === endtime)
 {
    return false
  }
    return true;
}
function validatescheduleName(scheduleName)
{
    scheduleName = trimString(scheduleName);
    if(scheduleName == '') {
           alert(beanmsg["noschedulename"]);
          return false;
    }
    if(scheduleName.length >250){
          alert(beanmsg["invalidschedulename"]);
          return false;
    }
    return true;
}
function selectall(aurl)
{
	for(i=0;i<aurl.length;i++)
	{
		aurl[i].selected = true;
	}
}
function moveone(aurl,surl)
{
	for(i=0;i<surl.length;i++)
	{
		surl.options[i].selected=false;
	}
	for(i=0;i<aurl.length;i++)
	{
	
		if (aurl[i].selected == true)
		{
			surl.options[surl.length] = new Option(aurl.options[i].text,aurl.options[i].value);	
			aurl.options[i] = null;
			i--;
		}
	}
	
	for(i=0;i<surl.length;i++)
	{
		surl.options[i].selected=true;
	}
}
function moveall(aurl,surl)
{
	j=aurl.options.length;
	for(i=0;i<j;i++)
	{
		aurl.options[i].selected =true;
	}
	moveone(aurl,surl);
}
function addMaintenance()
{
	//getHtml('/home/scheduleMaintenance.do?execute=adddetailsMaintenence',"postAddMaintenance");//No I18N
	window.location.href=newclient_path+'#/admin/operations/scheduled-maintenance';// NO I18N
}
function postAddMaintenance(result)
{
	showDiv("RS_MReport");hideDiv("RS_Reports");hideDiv("RS_CReport");hideDiv("RS_RSetting");//NO I18N
	var msg = document.getElementById('add_maintenance');//NO I18N
	if(msg!=null){
		msg.innerHTML = result;
	}
	else
	{
	  msg = document.getElementById('userarea');//NO I18N
	  msg.innerHTML = result;
	}
	hideDiv('Scheduled_reports');//No I18N
	hideDiv('Schedule_maintenance');//No I18N
	showDiv('add_maintenance');//No I18N
	/*var reportavail=document.getElementById('Report_Settings');
	if(reportavail!=null)
	{
		$.hideDiv('Report_Settings');//NO I18N
	}
	if(document.getElementById('Schedule_maintenance')!=null)
	{
	var msg = document.getElementById('Schedule_maintenance');
	if(msg!=null)
	{
	msg.innerHTML =result;
	}
	showDiv('Schedule_maintenance')
	hideDiv('Scheduled_reports')//No internationalization
	}
	else
	{
		var msg = document.getElementById('scheduled_Reports');
	if(msg!=null)
	{
	msg.innerHTML =result;
	}
	showDiv('scheduled_Reports')//No I18N
	hideDiv('scheduled_Reports_List')//No internationalization
	}*/
}
function editMaintenance(id,state)
{
getHtml('/home/scheduleMaintenance.do?execute=editMaintenence&maintenanceid='+id+'&status='+state,"postEditMaintenance");//No I18N
}
function postEditMaintenance(result)
{
	var msg = document.getElementById('Schedule_maintenance');
	msg.innerHTML =result;
	if(document.getElementById("move").scheduleMethod[2].checked)
	{
		view_once();
		setScheduleMaintenanceDate(document.getElementById('onceStartDateTime').value,  document.getElementById('onceEndDateTime').value);	
	}
	showDiv('Schedule_maintenance')
	hideDiv('Scheduled_reports') //No internationalization
}
function deleteMaintenance(id,state)
{
if(confirm(beanmsg["maintenance_delete"]))
{
 	var form = document.createElement("form");//No I18N
	form.setAttribute("method", "post");//No I18N
	form.setAttribute("action", "/home/scheduleMaintenance.do");//No I18N
	form.appendChild(getnewFormElement("hidden","execute","deleteMaintenence"));//No I18N
	form.appendChild(getnewFormElement("hidden","maintenanceid",id));//No I18N
	var response = $.getAjaxResponseWithCSRF("POST",form.action,$(form).serialize());//No I18N
	$("#userarea").html(response);//No I18N
}
}
function stopReports(value)
{
hideDiv('confirmmsg');
Showloading();
getHtml('/login/status.do?execute=removeReportEmails&eid='+value,"postStopReports");
}
function postStopReports(result)
{

hideDiv('confirmmsg');
showDiv('stopreports');
Hideloading();
}
function showSeqUrlHelp()
{
        window.open(helpmsg["urlseq_helpurl"],"seqParametersHelp",'scrollbars=yes,resizable=yes,width=900,height=380');
}
function TryNow(edition)
{
	showURLInDialog( '../jsp/includes/demo_account.jsp?edition='+edition,"title="+beanmsg["demo_acc"]+",modal=no,top=120,left=490,width=450,height=145, position=absolute,closeButton=yes" )
}
function Proceed(edition)
{
if(edition=='premium')
{
	location.href='../login/demo_premium.jsp'
}
if(edition=='enterprise')
{
	location.href='../login/demo_enterprise.jsp'
}
}
function AutoRecharge(frm)
{
var message = "";
if(frm.autoRecharge.checked)
{
message = "When your SMS credits come low we recharge your SMS credits to for 50 and charing $10 from your account.";
}
if(!frm.autoRecharge.checked)
{
message = "You lose the SMS alerts when your sms credits are low.";
}
if(confirm(message))
{
location.href='../home/Notifications.do?execute=setAutoRecharge&AutoRecharge='+frm.autoRecharge.checked
}
}
function RechargeNow(frm)
{
var val ="";
for(i=0;i<3;i++)
{
if(frm[i].checked)
{
val = frm[i].value;
}
}
if(confirm("On Recharge Now we will add "+val+" SMS credits to your account and charging respectively from your account"))
{
location.href='../home/Notifications.do?execute=RechargeNow&value='+val
}
}
function showAddTabEMail()
{

hideAll();
showDefaultImages();
if(document.getElementById("addemail") != null)
{
document.getElementById("addemail").src = '/images/icon_arrow.gif';
}
showDiv("addEmailDiv")

//setFocusProperTextFieldFrm(document.emailform);

}

function showAddTabSMS()
{

hideAll();
showDefaultImages();
if(document.getElementById("addsms") != null)
{document.getElementById("addsms").src = '/images/icon_arrow.gif';}
showDiv("addSMSDiv")

//setFocusProperTextFieldFrm(document.emailform);

}

function showAddSMS(a)
{
hideDiv('AlertsTab_editsmsform');
showDiv('AlertsTab_addsmsform');
}

function showAddEMail(a)
{
hideDiv('AlertsTab_editemailform');
showDiv(a);
}
function showAddAction(a)
{
	hideDiv('AlertsTab_editactionform'); //No I18N
	showDiv(a);
}

function hideEditEMail()
{


hideDiv("addEmailDiv")
showDiv("userarea");
hideDiv("UrlForm");
try
{
hideDiv("AlertsTab_editemailform");

}
catch(e)
{
}
        hideDiv("help");
}

function hideAddEMail()
{
hideDiv("addEmailDiv")
showDiv("userarea");
hideDiv("UrlForm");
try
{
hideDiv("AlertsTab_addemailform");

}
catch(e)
{
}
	hideDiv("help");
	

}
function hideAddAction()
{
	hideDiv("AlertsTab_addactionform"); //No I18N
	hideDiv("help");//No I18N
}
function fnUpdateSMS(frm)
{
if(frm.mobileNumber.value=='')
{
       alert(beanmsg["emptysmsno"]);
       frm.mobileNumber.select()
       return;
}


if(isNaN(frm.mobileNumber.value)) {
        alert(beanmsg["invalidsmsno"]);
        frm.mobileNumber.select()
        return false
    }

var str=frm.mobileNumber.value;
if(str.length>19)
{
alert(beanmsg["moredigits"]);

return;
}
        frm.submit();
}



function fnAddSMS(frm)
{

if(frm.countryCode.value=='')
{
       alert(beanmsg["ccemtpy"]);
       frm.countryCode.select();
           return;
}

if(isNaN(frm.countryCode.value)) {
        alert(beanmsg["invalidcc"]);
        frm.countryCode.select();
        return false
    }

if(frm.number.value=='')
{
       alert(beanmsg["emptysmsno"]);
       frm.number.select()
       return;
}


if(isNaN(frm.number.value)) {
	alert(beanmsg["invalidsmsno"]);
        frm.number.select()
        return false
    }

var str=frm.countryCode.value+frm.number.value;
if(str.length>19)
{
	alert(beanmsg["moreccdigits"]);

return;
}
	frm.submit();
}

function fnAddEMail(frm)
{
if(!validateEmail(frm.toemail.value))
{
frm.toemail.select();
return false;
}
frm.submit();
}
function fnAddAction(frm)
{
	frm.submit();
}
function reloadResponseReport(frm)
{
        var period = frm.locationId.value;
        $("#responseForm input[name=locid]").val(period);
	
}
function showresponsereport(mtype)
{
	

hideDiv('usagereports');
showDiv('responsereports');
var period=document.getElementById("responseForm").period.value;
var key=document.getElementById("responseForm").urlid.value;
var starttime=document.getElementById("responseForm").startdate.value;
var endtime=document.getElementById("responseForm").enddate.value;
var busy = document.getElementById("responseTimeDiv");
var locid=document.getElementById("responseForm").locid.value;
var reportAtt = $("#responseForm select[name=reportAttribute]").val();
alert( $("#responseForm select[name=reportAttribute]").val());
busy.innerHTML ='<img src="../images/icon_cogwheel.gif" alt="Icon" >';
var currentTime = Number(new Date());
if(locid=='null'){
	http.open("GET","../home/reportsinfo.do?execute=showResponseReport&urlid="+key+"&period="+period+"&startdate="+starttime+"&enddate="+endtime+"&isUrl=false&mtype="+mtype+"&ct="+currentTime,true);
}
else{
	http.open("GET","../home/reportsinfo.do?execute=showResponseReport&urlid="+key+"&period="+period+"&startdate="+starttime+"&enddate="+endtime+"&isUrl=false&locid="+locid+"&mtype="+mtype+"&ct="+currentTime,true);
}

        http.onreadystatechange = handleResponseReport;
        
       http.send(null); 
showDiv('responseTimeDiv');
}

function getusagereports(urlid,isUrl,mtype)
{
hideDiv('responseTimeDiv');
var period=document.getElementById("responseForm").period.value;
var startdate=document.getElementById("responseForm").startdate.value;
var enddate=document.getElementById("responseForm").enddate.value;
var locid=document.getElementById("responseForm").locid.value;
showDiv('loadingg');
if(locid=='null'){
getHtml("../home/reportsinfo.do?execute=getUsageReports&urlid="+urlid+"&isUrl="+isUrl+"&period="+period+"&starttime="+startdate+"&endtime="+enddate+"&mtype="+mtype,"postUsageReports");
}
else{
	getHtml("../home/reportsinfo.do?execute=getUsageReports&urlid="+urlid+"&isUrl="+isUrl+"&period="+period+"&starttime="+startdate+"&endtime="+enddate+"&locid="+locid+"&mtype="+mtype,"postUsageReports");
}
}
function postUsageReports(result)
{

var msg = document.getElementById('usagereports');
hideDiv('responsereports');
msg.innerHTML =result;
hideDiv('loadingg');
showDiv('usagereports');
}

function fnOnloadSelection(period,sUrlId,isURL,locid,mtype){
	document.getElementById("responseForm").period.value=period;

	if(period=="50"){
		custShow();
		var parentform=window.opener.document.getElementById('reportform');
		document.getElementById("responseForm").startdate.value=parentform.startdate.value;
		document.getElementById("responseForm").enddate.value=parentform.enddate.value;
		
	}
	var startdate=document.getElementById("responseForm").startdate.value;
	var enddate=document.getElementById("responseForm").enddate.value;
	
	fnShowResponseReport(period,sUrlId,"-1",isURL,startdate,enddate,locid,mtype);
}

function fnPostEmailAddDiv(a)
{
location.href='../home/Notifications.do?execute=listNotifications';
/*showDiv("userarea")
hideDiv("addEmailDiv");
msg = document.getElementById('msgs');
msg.innerHTML ="<span class='errormessage'>EMail added</span>";*/
}
function fnCreateEmail(frm)
{

 if(validateEmail(email.value))
 {
	
	importxmlForForm(frm,"fnPostEmailAdd")
 }
//frm.submit();
}

function fnAddSMStolist(countrycode,mobilenumber)
{
	var countrycode = document.getElementById(countrycode);
	var mobilenumber = document.getElementById(mobilenumber);
	if(countrycode.value=='')
	{
       		alert(beanmsg["ccemtpy"]);
       		countrycode.select();
           	return;
	}
	if(isNaN(countrycode.value)) 
	{
        	alert(beanmsg["invalidcc"]);
        	countrycode.select();
        	return;
    	}
	if(mobilenumber.value=='')
	{
       		alert(beanmsg["emptysmsno"]);
       		mobilenumber.select()
       		return;
	}
	if(isNaN(mobilenumber.value)) 
	{
		alert(beanmsg["invalidsmsno"]);
        	mobilenumber.select()
        	return;
    	}
	var str=countrycode.value+mobilenumber.value;
	if(str.length>19)
	{
		alert(beanmsg["moreccdigits"]);
		return;
	}
	importxml("../home/Notifications.do?popup=true&execute=addSMS&countrycode="+countrycode.value+"&number="+mobilenumber.value,"fnPostSMSAdd")
	countrycode.value = "";
	mobilenumber.value = "";
	countrycode.focus();
}
function fnPostSMSAdd(a)
{
	var list = a.firstChild.childNodes
	var emailid ='1';
	var tbl = document.getElementById('monitorcontactstbl');
       	if(tbl==null)
        {
               	closeDialog();
		location.href='../home/Notifications.do?execute=listNotifications';
		return;
       	}
	var lastRow = tbl.rows.length;
	if(list.length==0)
	{
		
	}
	for(i=0;i<list.length;i++)
	{
		var row = tbl.insertRow(lastRow);
		var cellRight = row.insertCell(0);
		var el = document.createElement('input');
		el.setAttribute('type', 'checkbox');
		el.setAttribute('name', 'actions' );
		emailid=list.item(i).getAttribute('ax_usersmsid')
		if(emailid==null)
		{
			alert(beanmsg["addsmsfailed"]);
			break;
		}
		el.checked='true';		
		el.setAttribute("value",emailid);		
		cellRight.appendChild(el);
		
		var cellLeft = row.insertCell(1);
		cellLeft.setAttribute("class","bodytext")
		var textNode = document.createTextNode(list.item(i).getAttribute('ax_tosms'));
		cellLeft.appendChild(textNode);
		var message = beanmsg["addsmssuccess"];
		msg = document.getElementById('msgs');
		msg.innerHTML ="<span class='errormessage'>"+ message+"</span>";
	}
	hideDiv('loading');
	//hideDiv("addContact");
	closeDialog();
}
function fnCreateEMailToList(emailid,con,con1)
{
	var val = 0;
	if(document.getElementById(con).checked)
	{
       		val = 1;
	}
	if(document.getElementById(con1).checked)
	{
       		val = 0;
	}
	var email = document.getElementById(emailid);
	if(validateEmail(email.value))
	{
 		importxml("../home/Notifications.do?popup=true&execute=addEMail&format="+val+"&toemail="+encodeURIComponent(email.value),"fnPostEmailAdd")
 		email.value=""; 
	   	email.focus(); 
	}
}
function validateEmail(email)
{
    email = trimString(email);
    if(email == '') {
           alert(beanmsg["emptyemail"]);
          return false;
    }
    var ef = /^.+@.+\..{2,7}$/;
    if (!(ef.test(email))) {
           
alert(beanmsg["invalidemail"]);
return false;
    }
    var ic = /[\(\)\<\>\,\;\:\\\/\"\[\]]/
    if (email.match(ic)) {
       alert(beanmsg["invalidemail"]);
   return false;
    }
    return true;
}

function trimString(str) {
    str = str.replace( /^\s+/g, "" );// strip leading
    return str.replace( /\s+$/g, "" );// strip trailing
}

function fnupdateEmail(frm)
{
var email=frm.toemail.value.split('@');
var invalidemail=email[0];
 if(invalidemail.indexOf('*')!=-1)
 {
   alert(beanmsg["invalidemail"]);
     return;
 }

 if(validateEmail(frm.toemail.value))
 {
  importxmlForForm(frm,"fnPostEmailupdate")
 }
}
function fnPostEmailupdate()
{
	location.href='../home/Notifications.do?execute=listNotifications'
}

function hideUncheckedFields(frm)
{
	var fields = frm.elements;
	for(i = 0;i<fields.length;i++)
	{
		if(fields[i].name=='userActions')
		{
			if(!fields[i].checked)
			{
				hidefields(frm,fields[i].value);
			}
			if(fields[i].checked)
			{
				showfields(frm,fields[i].value);
			}
		}
	}
}
function hidefields(frm,val)
{
	var fld = getField(frm,'actionThresholds('+val+'-alerttype)'); //No I18N
	fld.style.display="none";
}
function showfields(frm,val)
{
	var fld = getField(frm,'actionThresholds('+val+'-alerttype)'); //No I18N
	fld.style.display="block";
}
function fnPostEmailAdd(a)
{
	var list = a.firstChild.childNodes
	var emailid ='1';
	var tbl = document.getElementById('monitorcontactstbl');
        if(tbl==null)
        {
        	closeDialog();
		location.href='../home/Notifications.do?execute=listNotifications';
		return;
       	}
	var lastRow = tbl.rows.length;
	
	if(list.length==0)
	{
		
	}
	for(i=0;i<list.length;i++)
	{
		var row = tbl.insertRow(lastRow);
		var cellRight = row.insertCell(0);
		var el = document.createElement('input');
		el.setAttribute('type', 'checkbox');
		el.setAttribute('name', 'actions' );
		emailid=list.item(i).getAttribute('ax_useremailid')
		if(emailid==null)
		{
			alert(beanmsg["addemailfailed"]);
			break;
		}
		el.checked='true';		
		el.setAttribute("value",emailid);		
		cellRight.appendChild(el);
		//alert('valuevalue'+list.item(i).getAttribute('ax_toemail') );
		
		var cellLeft = row.insertCell(1);
		cellLeft.setAttribute("class","bodytext")
		var textNode = document.createTextNode(list.item(i).getAttribute('ax_toemail'));
		cellLeft.appendChild(textNode);
		var message = beanmsg["addemailsuccess"];
		msg = document.getElementById('msgs');
		msg.innerHTML ="<span class='errormessage'>"+ message+"</span>";
	}
	hideDiv('loading');
	//hideDiv("addContact");
	closeDialog();
}

function showDnsReport(id)
{
	location.href =  '../home/CreateTest.do?execute=showPerf&urlid='+id;
}

function fnSelectAll(e,name)
{

ToggleAll(e,document.form1,name);

}
 
function ToggleAll(e,frm,chckname)
            {
              
	      if (e.checked) 
		{
           
	     CheckAll(frm,chckname);
                
		}
                else 
		{
                    ClearAll(frm,chckname);
                }
            }
         function CheckAll(ml,chckname)
            {




                var len = ml.elements.length;

               
for (i = 0; i < len; i++) 
		{
                   
			var e = ml.elements[i];
                    if (ml.elements[i].name == chckname) 
		    {
                       
			    ml.elements[i].checked=true;
			    
                    }
                }

        }
         function ClearAll(ml,chckname)
            {

                var len = ml.elements.length;
                for (var i = 0; i < len; i++) 
		{
                    var e = ml.elements[i];
                    if (ml.elements[i].name == chckname) 
		    {
                        ml.elements[i].checked=false;
                    }
                }
             }


	



 function checkforOneSelected(ml,chckname){
     var len = ml.elements.length;
     var count=0;
     for (var i = 0; i < len; i++) {
    	 if ( (ml.elements[i].name == chckname) &&  ml.elements[i].checked ) {
         	count++;
         	if(count>=2){
         		return true;
         	}
         }
     }
     return false;
}

function callComparision(starttime,endtime)
{
showDiv('loading');
var period="";
callComp(starttime,endtime,period);
}
function callComp(starttime,endtime,period)
{

        var resid="";
        var attid="";

      

        if(!checkforOneSelected(document.form1,"compare"))
        {
        hideDiv('loading');  
        alert(reportmsg["selectmonitors"]);
          
            return;
        }
        else
        {
        var i=0;

        for(i;i<document.form1.compare.length;i++)
                {
                if(document.form1.compare[i].checked==true)
{
                                var temp=document.form1.compare[i].value;
                                var test=temp.split(",");
                                var res=test[0];
                                //var att=test[1];
                                if(resid!="")
                                {
                                resid=resid+","+res;
                                //attid=attid+","+att;
                                }
                                else
                                {
                                resid=res;
                                //attid=att;
                                }
}

        }

//fnOpenNewScrollWindow("../home/reportsinfo.do?execute=showResponseReportComparisions&childid="+resid+"&attributeid="+attid+"&starttime="+starttime+"&endtime="+endtime+"&period="+period,"900","500");
fnOpenNewScrollWindow("../home/reportsinfo.do?execute=showResponseReportComparisions&childid="+resid+"&starttime="+starttime+"&endtime="+endtime+"&period="+period,"900","500");//NO i18N
hideDiv('loading');        
}
}
function fnOpenNewScrollWindow(link,windowname)
{
        if(typeof windowname == "undefined")
        {
                window.open(link, "new",'scrollbars=yes,resizable=yes,width=1000,height=380');
        }
        else
        {
                window.open(link,windowname,'scrollbars=yes,resizable=yes,width=1000,height=380');
        }
        return false;
}

function fnOpenNewScrollWindowForDimensions(link,windowname,w,h)
{
	var width=900;
	var height=380;
	if(w != undefined && w!=null)
	{
		width = w;
	}
	if(h != undefined && h!=null)
	{
		height = h;
	}
	if(typeof windowname == "undefined")
	{
		window.open(link, "new","scrollbars=yes,resizable=yes,width="+width+",height="+height+"'");
	}
	else
	{
		window.open(link,windowname,"scrollbars=yes,resizable=yes,width="+width+",height="+height+"'");
	}
	return false;

}
function fnOpenWidgetThreshold(datavalues)
{
	var loadingtxt=beanmsg.loading;
	$("#thresholdwidget").html("<div id='status_loading' style='margin: 100px auto;font: normal 18px sans-serif;color:  #000'>"+loadingtxt+"</div>");//No I18N
	url = "../home/CreateTest.do"; //No I18N
	var windowWidth=$(window).width();
	$("#thresholdwidget").lightbox_me({closeSelector: "#closethreshold", closeClick: true,centered: false,modalCSS: {top: '90px',width: '500px'}, onLoad: function() {
		var response = $.getAjaxResponse("POST",url,datavalues);//NO I18N
		$("#thresholdwidget").html(response);//No I18N
	}});
	$('table tr:nth-child(even)').addClass('stripe');//No I18N
}
function fnsendStartStopAction(datavalues)
{
	url = "../home/CreateTest.do"; //No I18N
	var response = $.getAjaxResponse("POST",url,datavalues);//NO I18N
	var statusmsg = getValue(response,'ax_status');//NO I18N
	// alert(statusmsg);
	
	var status="success"; //NO I18N
	$.hidePopUpDiv();
	
	var contentWidth = statusmsg.length*7;
	
	var xCenter = (($(window).innerWidth()/2)-(contentWidth/2))+"px";//NO I18N
	var yCenter = (($(window).innerHeight()/2) + $(document).scrollTop() - 50)+"px";//NO I18N
	
	$.showPopUpDiv($.getStatusMsg(status, statusmsg), yCenter, xCenter, '1', contentWidth);
	$.fadeOutDiv('popUpFloatingDiv',10000);//No I18N
}
function fnDeleteItem(urlid,link){
if(confirm(beanmsg["server.process.delete"]))
{
	var response = $.getAjaxResponseWithCSRF("POST","/home/CreateTest.do",link);//No I18N
	var statusmsg = getValue(response,'ax_status');//NO I18N
	var status="success"; //NO I18N
	$.hidePopUpDiv();
	var contentWidth = statusmsg.length*15;
	var xCenter = (($(window).innerWidth()/2) - (contentWidth/2))+"px";//NO I18N
	var yCenter = ($(window).innerHeight()/2)+"px";//NO I18N
	$.showPopUpDiv($.getStatusMsg(status, statusmsg), yCenter, xCenter, '1', contentWidth);
	$.fadeOutDiv('popUpFloatingDiv',6000);//No I18N
	setTimeout(function(){window.location.href="../home/CreateTest.do?execute=showPerf&urlid="+urlid+"&tabname=Port";},2000);
}
}
function fnAddEditWidgetResource(datavalues)
{
	var loadingtxt=beanmsg.loading;
	$("#thresholdwidget").html("<div id='status_loading' style='margin: 100px auto;font: normal 18px sans-serif;color:  #000'>"+loadingtxt+"</div>");//No I18N
	url = "../home/CreateTest.do"; //No I18N
	var windowWidth=$(window).width();
	$("#thresholdwidget").lightbox_me({closeSelector: "#closethreshold", closeClick: true,centered: false,modalCSS: {top: '90px',width: '500px'}, onLoad: function() {
		var response = $.getAjaxResponse("POST",url,datavalues);//NO I18N
		$("#thresholdwidget").html(response);//No I18N
	}});
	$('table tr:nth-child(even)').addClass('stripe');//No I18N
}
function fnShowResponseReport(timeperiod,key,stepid,isURL,starttime,endtime,locid,mtype,reportAtt,rsptime,reportAtts,reportName)
{
	var period=timeperiod;
	if(document.getElementById("responseTimeDiv").style.display=='block'){
	var busy = document.getElementById("responseTimeDiv");
	busy.innerHTML ='<img src="../images/icon_cogwheel.gif" alt="Icon" >';
	var width = $(window).width();
	var queryString = "urlid="+key+"&period="+period+"&startdate="+starttime+"&enddate="+endtime+"&isUrl=false&mtype="+mtype+"&w="+width;//No I18N
	try
        {
                if(stepid!="-1" && stepid!="null" && stepid!=null)
                {
                        queryString = queryString+"&stepid="+stepid;//No I18N
                }
        }
        catch(e){}
    if(reportName != null && reportName != ""){
		queryString = queryString+"&reportName="+reportName;//NO I18N
	}    
	if(rsptime != null && rsptime != ""){
		queryString = queryString+"&rsptime="+rsptime;//NO I18N
	}
	if(locid=='null')
	{
		
	}
	else
	{
		queryString = queryString+"&locid="+locid;//No I18N
	}
	//indexOf not supported by ie9 so changed it to inArray
	if($.inArray(mtype,customviewmonitor) != -1) //No I18N
	{
		if(reportAtts!=undefined && reportAtts!='')
		{
			queryString = queryString+reportAtts;//No I18N
		}
		else
		{
			if(reportAtt!=undefined)
			{
				queryString = queryString+"&reportAtt="+reportAtt;//No I18N
			}
		}
	}
	else
	{
		if(reportAtt!=undefined)
		{
			//queryString = queryString+"&reportAtt=OverallCPUChart"+"&reportAtt=InterruptAndContextSwitches"+"&reportAtt=OverallDiskUtilization";//No I18N
			queryString = queryString+"&reportAtt="+reportAtt;//No I18N
		}
	}
	var currentTime = Number(new Date());
	queryString = queryString+"&ct="+currentTime;//No I18N
	//indexOf not supported by ie9 so changed it to inArray
	if($.inArray(mtype,customviewmonitor)!=-1)
	{
	 	http.open("GET","../home/reportsinfo.do?execute=showResponseReportForServerMonitor&"+queryString,true);
	}
	else
	{
		http.open("GET","../home/reportsinfo.do?execute=showResponseReport&"+queryString,true);
	}
	 http.onreadystatechange = handleResponseReport;
	 http.send(null); 
	}
	else{
		getusagereports(key,isURL,mtype);
	}
}
function getResponseDowntime(frm){
	 
	var period=document.getElementById("responseForm").period.value;
	var url=document.getElementById("responseForm").urlid.value;
	var isURL=document.getElementById("responseForm").isURL.value;
	var id=document.getElementById("responseForm");
	var locid=id.locid.value;
	var mtype=id.mtype.value;
	if(period=="50")
	{
		if(id.startdate.value.length<1 || id.enddate.value.length<1)
	        {
					custShow();
	                hideDiv('loadingg');
	                return;
	        }
	}
	else {
		custHide();
		var starttime=document.getElementById("responseForm").start.value;
		var endtime=document.getElementById("responseForm").end.value;
		fnShowResponseReport(period,url,"-1",isURL,starttime,endtime,locid,mtype);
	}
 }

function custShow()
{
 document.getElementById("span_EndTime").className = "globalText";
 document.getElementById("span_StartTime").className = "globalText";
 document.getElementById("responseForm").startdate.disabled=false;
 document.getElementById("responseForm").enddate.disabled=false;
 document.getElementById("startTrigger").style.display = '';
 document.getElementById("endTrigger").style.display = '';
 document.getElementById("responseForm").show.style.display = '';
}

function custHide()
{
 document.getElementById("span_EndTime").className = "reportBoxGreyTxt";
 document.getElementById("span_StartTime").className = "reportBoxGreyTxt";
 document.getElementById("responseForm").startdate.disabled=true;
 document.getElementById("responseForm").enddate.disabled=true;
 document.getElementById("startTrigger").style.display = "none";
 document.getElementById("endTrigger").style.display = "none";
 document.getElementById("responseForm").show.style.display = "none";
 document.getElementById("responseForm").startdate.value="";
 document.getElementById("responseForm").enddate.value="";
}

function handleResponseReport()
{
	if(http.readyState == 4)
    {
            if (http.status == 200)
            {
            	$("#responseTimeDiv").html(http.responseText);//No I18N
            	hideDiv('loadingg');
	    	showcustomizedtooltips();//For reports
            }
    } 
}

function getCustomPeriodDowntime(rsptime,attVal,reportName,divarr){
	var startdate = '';
	var enddate = '';
	var frm=document.getElementById('responseForm');
	var period=$("#newperiodval").val();
	var url=frm.urlid.value;
	var isURL=frm.isURL.value;
	var locid=1
	if(frm.locationId==undefined)
	{
		locid=1;
	}
	else
	{
		locid=frm.locationId.value;
	}
	var mtype=frm.mtype.value;
	var newrsptime = frm.timeReport.value;
	if(newrsptime!=null && newrsptime!=""){
		rsptime=newrsptime;
	}
	var reportAtt = $("#responseForm select[name=reportAttribute]").val();
	if(reportAtt==undefined)
	{
		reportAtt = attVal;
	}
	var tracebutdiv = document.getElementById("traceroutebutdiv");
	if(tracebutdiv!=undefined)
	{
		if(locid>1000)
		{
			tracebutdiv.style.display="none";
		}
		else
		{
			tracebutdiv.style.display="block";
		}
	}
	var reportAtts='';
	//indexOf not supported by ie9 so changed it to inArray
	if($.inArray(mtype,customviewmonitor)!=-1)
	{
		if(divarr != undefined)
		{
			var divs = divarr.replace('[','');
			divs = divs.replace(']','');
			divs = divs.split(',');
			jQuery.each(divs, function() {
				var arr = $("input[name="+this+"]");
				$.each(arr,function(index, item)
					{
						if(item.checked)
				{
					reportAtts = reportAtts+"&reportAtt="+item.value; //No I18N
				}

					});
			});
		}
	}
	if($("#newperiodval").val()==50)
	{
		startdate = $("#responseForm input[name=startdate]").val();
		enddate = $("#responseForm input[name=enddate]").val();
		 if(frm.startdate.value>frm.enddate.value)
	        {
	                alert(beanmsg["invalidtime"]);
	                return;
	        }
		 if(frm.startdate.value=='')
	        {
	                alert(beanmsg["nostarttime"]);
	                return;
	        }
	        if(frm.enddate.value=='')
	        {
	                alert(beanmsg["noendtime"]);
	                return;
	        }
	}
	var stepid = "-1";
	if(frm.stepid!=undefined)
	{
		stepid=frm.stepid.value;
	}
        fnShowResponseReport(period,url,stepid,isURL,startdate,enddate,locid,mtype,reportAtt,rsptime,reportAtts,reportName);
}
function getDownTimeDetails(frm)
{
	//getHtmlForForm(frm,"postGetDownTimeDetails")
	//alert('frm submitted')
	frm.submit();
}
function postGetDownTimeDetails(a)
{
	
	var divele = document.getElementById("urlreport");
	divele.innerHTML=a;
}

function fnupdateNotifications(frm)
{
	if(frm.displayname.value=="")
	{
		alert(beanmsg["dispnameempty"]);
		frm.displayname.select();
		return;
	}
	var sel = false
	var actionelementid = 0;
	ele = frm.elements;
	total_sms=0;
	for(i=0;i<ele.length;i++)
	{
		if(ele[i].name=="actions" )
		{
			if(ele[i].checked)
			{
				sel=true;
				if(ele[i].id.indexOf("sms")==0)
				{
					total_sms=total_sms+1
				}
			}
			else if(actionelementid<=0)
			{
				actionelementid = i;
			}
		}
	}
	if(!sel)
	{
		ele[actionelementid].checked = true;
	}
	try
	{
		urlid = frm.urlseqid.value;
	}
	catch(err)
	{
		urlid = "0";
	}
	
	if(!validateRespThreshold(frm, urlid))
	{
		return;
	}
	
	try
	{
		disableEmptyFields(frm);
	}
	catch(e){}
	frm.submit();
}

function updateNotifications(frm)
{
frm.submit();	
//getHtmlForForm(frm,"postUpdateNotifications")
}
function postUpdateNotifications(a)
{
	
	var message = beanmsg["notificationsupdated"];
	msg = document.getElementById('msgs');
	msg.innerHTML ="<span class='errormessage'>"+ message+"</span>";
	closeDialog();
	hideAll();
	showDiv("userarea");
}
function showEmailLinks(id)
{
showDiv('editemail'+id);
showDiv('deleteemail'+id);

}
function hideEmailLinks(id)
{
hideDiv('editemail'+id);
hideDiv('deleteemail'+id);

}
function deleteEMail(id,mapp)
{
if(mapp =="")
{
	location.href='../home/Notifications.do?execute=delete&emailids='+id
}
if(mapp=="Urls" && confirm(beanmsg["deletealerts1"]+" "+beanmsg["deletecontact"]))
{
location.href='../home/Notifications.do?execute=delete&emailids='+id
}
if(mapp=="Reports" && confirm(beanmsg["deletealerts2"]+" "+beanmsg["deletecontact"]))
{
location.href='../home/Notifications.do?execute=delete&emailids='+id
}
if(mapp=="Master")
{
alert(beanmsg["deleteprimarycontact"]);
return;
}
}

function deleteSMS(id)
{
if(confirm(beanmsg["deletecontact"]))
{
location.href='../home/Notifications.do?execute=deleteSMS&smsid='+id
}
}
function showssms(frm)
{
getHtmlForForm(frm,"fnPostSMS")
}
function colorchange(id)
{
var ele=document.getElementById(id);
ele.setAttribute("class","hoverrowclass");
}
function colorback(id)
{
var ele=document.getElementById(id);
ele.setAttribute("class","rowbgcolor");
}
function showsmslist()
{
 getHtml('../home/Notifications.do?execute=showSMSList',"fnPostSMS")
 }

function fnPostSMS(result)
{
var divele = document.getElementById("AlertsTab_showsmslist");

divele.innerHTML=result;
hideAll();
        hideDiv("UrlForm")
        hideDiv("userarea");
        hideDiv("addEmailDiv");
        hideDiv("help");
        showDiv("AlertsTab_showsmslist");
}

function editEMail(id)
{
	getHtml('../home/Notifications.do?execute=showAddEMailForm&emailId='+id,"fnPostEditEMail")
}
function editSMS(id,code)
{
	getHtml('../home/Notifications.do?execute=showAddSMSForm&smsid='+id+'&countrycode='+code,"fnPostEditSMS")
}

function fnPostEditSMS(result)
{
	
        var divele = document.getElementById("AlertsTab_editsmsform");
	divele.innerHTML=result;
        hideDiv('AlertsTab_addsmsform');
        showDiv('AlertsTab_editsmsform');
}

function fnPostEditEMail(result)
{
	
	var divele = document.getElementById("AlertsTab_editemailform");	
	divele.innerHTML=result;
hideDiv('AlertsTab_addemailform');        
showDiv('AlertsTab_editemailform');
 
}

function showTD(value){
	document.getElementById(value).style.visibility='visible';
}
function hideTD(value){
	document.getElementById(value).style.visibility='hidden';
}


function feedback(loginname, questionType)
{
    if(questionType==null || questionType==undefined)
    {
        window.open( '../jsp/feedback.jsp?loginname='+loginname, this.target,'scrollbars=no,resizable=no,width=550,height=500');
    }
    else
    {
        window.open( '../jsp/feedback.jsp?loginname='+loginname+'&qT='+questionType, this.target,'scrollbars=no,resizable=no,width=550,height=500');
    }
	
}

function needFeature(loginname)
{
	location.href="/m/jsp/mobile/mobileFeature.jsp?loginname="+loginname;
}

function gotoHomepage(){
	 location.href="/m/home/client/Welcome.do";//NO I18N
}

function deleteUrl(id)
{
if(confirm(beanmsg["deletemonitor"]))
{
location.href = "../home/CreateTest.do?execute=delete&urlid="+id
}
}

function deleteDns(id)
{
if(confirm(beanmsg["deletemonitor"]))
{
location.href = "../home/CreateTest.do?execute=delete&urlid="+id
}
}

function deleteSMTP(id)
{
if(confirm(beanmsg["deletemonitor"]))
{
location.href = "../home/CreateTest.do?execute=delete&urlid="+id
}
}
function deletePort(id)
{
	if(confirm(beanmsg["delete_portmonitor"]))
	{
		location.href = "../home/CreateTest.do?execute=delete&urlid="+id
	}
}
function deletePop(id)
{
	if(confirm(beanmsg["delete_popmonitor"]))
        {
                location.href = "../home/CreateTest.do?execute=delete&urlid="+id
        }
}
function deletePortSMTP(id)
{
	if(confirm(beanmsg["delete_portsmtpmonitor"]))
        {
                location.href = "../home/CreateTest.do?execute=delete&urlid="+id
        }
}
function deletePing(id)
{
        if(confirm(pingmsg["delete_pingmonitor"]))
        {
                location.href = "../home/CreateTest.do?execute=delete&urlid="+id
        }
}
function deleteHomePage(id)
{
	if(confirm(beanmsg["deletewpa"]))
	{
		location.href = "../home/CreateTest.do?execute=delete&urlid="+id
	}
}



function suspendUrlSeq(id)
{
//location.href = "../home/ShowUrlSeqDetails.do?execute=suspendSequence&urlseqid="+id
	var form = document.createElement("form");//No I18N
	form.setAttribute("method", "post");//No I18N
	form.setAttribute("action", "/home/ShowUrlSeqDetails.do");//No I18N
	form.appendChild(getnewFormElement("hidden","execute","suspendSequence"));//No I18N
	form.appendChild(getnewFormElement("hidden","urlseqid",id));//No I18N
	var response = $.getAjaxResponseWithCSRF("POST",form.action,$(form).serialize());//No I18N
}

function deleteUrlSeq(id)
{
if(confirm(beanmsg["deletesequence"]))
{
location.href = "../home/ShowUrlSeqDetails.do?execute=delete&urlseqid="+id
}
}
function image(element)
{
	if(document.getElementById(element)!=null){
		document.getElementById(element).src = '../images/icon_greenarrow.gif';
	}
}
function showDefaultImages()
{
image('addurl');
image('adddns');
image('addsmtp');
image('addhomepage');
image('addport');
image('addpop');
image('addportsmtp');
image('addping');//No I18N
image('addapplication');
image('addemail');
image('addsms');
image('analysewebpage');
image('dnslookup');
image('findip');
image('findlocation');
image('checkavailability');
}
function hideAddUrl()
{
        showDiv('showurladdform');
     	showDiv("userarea");
	hideDiv("MonitorDiv");
	hideDiv("addEmailDiv");
	hideDiv("AlertsTab_showsmslist");
        hideDiv("help");
        hideDiv("urlshowproceedbuttuon");
}
function hideAddPop()
{
	showDiv('showpopaddform');
        showDiv("userarea");
        hideDiv("MonitorDiv");//No I18N
        hideDiv("addEmailDiv");
        hideDiv("AlertsTab_showsmslist");
        hideDiv("help");
        hideDiv("popshowproceedbuttuon");
}
function hideAddPort()
{
	showDiv('showportaddform');
	showDiv("userarea");
	hideDiv("MonitorDiv");//No I18N
        hideDiv("addEmailDiv");
        hideDiv("AlertsTab_showsmslist");
        hideDiv("help");
        hideDiv("portshowproceedbuttuon");
}
function hideAddPortSMTP()
{
	showDiv('showportsmtpaddform');
	showDiv("userarea");
	hideDiv("MonitorDiv");//No I18N
        hideDiv("addEmailDiv");
        hideDiv("AlertsTab_showsmslist");
        hideDiv("help");
        hideDiv("portsmtpshowproceedbuttuon");
}
function hideAddPing()
{
        showDiv("userarea");//No I18N
        hideDiv("MonitorDiv");//No I18N
        hideDiv("addEmailDiv");//No I18N
        hideDiv("AlertsTab_showsmslist");//No I18N
        hideDiv("help");//No I18N
}
function hideAddDns()
{
        showDiv('showdnsaddform');
        showDiv("userarea");
        hideDiv("MonitorDiv");//No I18N
        hideDiv("addEmailDiv");
        hideDiv("AlertsTab_showsmslist");
        hideDiv("help");
        hideDiv("dnsshowproceedbuttuon");
}

function hideAddSMTP()
{
        showDiv('showsmtpaddform');
        showDiv("userarea");
        hideDiv("MonitorDiv");//No I18N
        hideDiv("addEmailDiv");
        hideDiv("AlertsTab_showsmslist");
        hideDiv("help");
        hideDiv("smtpshowproceedbuttuon");


}
function hideAddHomePage()
{
        showDiv('showhomepageaddform');
        showDiv("userarea");
        hideDiv("MonitorDiv");//No I18N
        hideDiv("addEmailDiv");
        hideDiv("AlertsTab_showsmslist");
        hideDiv("help");
        hideDiv("homepageshowproceedbuttuon");
}
function goHome()
{
    history.back();
}
function hideAll()
{
	hideDiv("UrlForm")
	hideDiv("userarea");
	hideDiv("addEmailDiv");
       	hideDiv("addSMSDiv");
	hideDiv('MonitorDiv');//No I18N
        hideDiv("help");
	hideDiv('tempUserArea');
	hideDiv('confirmunsubscribe');
	hideDiv("showUrlSeqNotificationsDiv");
	hideDiv("downloadrecorderdiv");
	hideDiv("UpdateEMail");
	hideDiv("msgs");
	hideDiv("AlertsTab_showsmslist");
        //hideDiv("availability_history");
	hideDiv("MGForm");
	toggleNotes('hide');
        //hideDiv("findIPDiv");
        //hideDiv("dnsLookupDiv");
      //  hideDiv("checkAvailabilityDiv");
       // hideDiv("findLocationDiv");
      	$.hidePopUpDiv(); 

}

function showUserArea()
{
hideAll();
showDiv("userarea");
}
var emailpattern=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
function showtxt(email,emailid)
{
var hiddenemail = email.value.trim();
var areaemail = emailid.value.trim();
if(areaemail=='' || hiddenemail=='')
{
	emailid.value = "";
}
else
{
	hiddenemail = hiddenemail.replace(/ /g,",");
	emailid.value = hiddenemail;
}
hideDiv('normal');
showDiv('fld');
hideDiv('editemail');
showDiv('cancelemail');
}
function hidetxt()
{
hideDiv('fld');
showDiv('normal');
showDiv('editemail');
hideDiv('cancelemail');
}
function showChangePassword()
{
	hideDiv('reports');
	hideDiv('general');
	showDiv('changepassworddiv');
	hideDiv('msgs');
	hideDiv("confirmunsubscribe");	
			var reportstd = document.getElementById('reportstd');
			reportstd.className="ee";
			var reportstd = document.getElementById('generaltd');
			reportstd.className="ee";
			var reportstd = document.getElementById('changepasswordtd2');			
			reportstd.className="selectedbg";
			//alert(reportstd.className)
}
function fnAdminFormSubmit(frm)
{
var emails = frm.emailid.value.trim();
var len = emails.length;
var len1 = emails.lastIndexOf(',')+1;
if(len>0)
{
        if(len==len1)
        {
                emails = emails.substring(0,len-1);
        }
}
if(emails=='')
{
	showDiv('editemail');
	hideDiv('cancelemail');
        getHtmlForForm(frm,"postChangePassword1",frm);
	return;
}
var array=emails.split(",");
for(i=0;i<array.length;i++)
{
	if(!validateEmail(array[i]))
	{
		frm.emailid.select();
		return; 
	}
}
showDiv('editemail');
hideDiv('cancelemail');
getHtmlForForm(frm,"postChangePassword1",frm);
}
function snapshotstatus(urlid,frm)
{
period = 2;
if(frm!=undefined)
{
if(frm.predefinedperiod!=undefined)
{
	period = frm.predefinedperiod.value;
}
else if(frm.period!=undefined)
{
	period = frm.period.value;
}
}
showURLInDialog( '../home/CreateTest.do?execute=importSnapShot&period='+period+'&url='+urlid, "title=<font color='white'>"+publicmsg["public_url"]+"</font>&nbsp;,modal=no, position=absolute, top=95, left=400, width=520,closeOnEscKey=yes" )
}
function fnShowRemoveConfirmation(a)
{
	a.checked=false;	
	hideDiv("userarea");
	hideDiv("msgs");	
	showDiv("confirmunsubscribe");
}
function fnHideRemoveConfirmation()
{
	showDiv("userarea");		
	hideDiv("confirmunsubscribe");
}
function disablesecondary(frm)
{
	disableProbe(frm);
	disableMobileProbe(frm);
	var primary = frm.primaryLocation.value;
	if(frm.secondaryLocations!=undefined)
	{
var secondary = frm.secondaryLocations;
for(i=0;i<secondary.length;i++)
{
        if( secondary[i].value == primary)
        {
		if(secondary[i].checked)
		{
			secondary[i].checked = false;
		}
                secondary[i].disabled = true;
        }
        else
        {
                secondary[i].disabled = false;
        }
}
}
}
function disableProbe(frm)
{
	var primary = frm.primaryLocation.value;
	if(frm.probes!=undefined)
	{
		var secondary = frm.probes;
		if(secondary.length!=undefined)
		{
		for(i=0;i<secondary.length;i++)
		{
			if( secondary[i].value == primary)
			{
				if(secondary[i].checked)
				{
					secondary[i].checked = false;
				}
				secondary[i].disabled = true;
			}
			else
			{
				secondary[i].disabled = false;
			}
		}
		}
		else
		{
			if(secondary.value==primary)
			{
					if(secondary.checked)
				{
					secondary.checked = false;
				}
				secondary.disabled = true;
			}
			else
			{
				secondary.disabled = false;
			}
		}
	}
}

function disableMobileProbe(frm)
{
	var primary = frm.primaryLocation.value;
	if(frm.mprobes!=undefined)
	{
		var secondarymprobes = frm.mprobes;
		if(secondarymprobes.length!=undefined)
		{
			for(i=0;i<secondarymprobes.length;i++)
			{
				if( secondarymprobes[i].value == primary)
				{
					if(secondarymprobes[i].checked)
					{
						secondarymprobes[i].checked = false;
					}
					secondarymprobes[i].disabled = true;
				}
				else
				{
					if(secondarymprobes[i].checked)
					{
						secondarymprobes[i].checked = false;
					}
					secondarymprobes[i].disabled = false;
				}
			}
		}
		else
		{
			if(secondarymprobes.value==primary)
			{
					if(secondarymprobes.checked)
				{
					secondarymprobes.checked = false;
				}
				secondarymprobes.disabled = true;
			}
			else
			{
				secondarymprobes.disabled = false;
			}
		}
	}
}

function changePackValue(frm,packageuser)
{
	var status1=frm.downChoice.value;
	if(status1 === "1")
	{
		frm.agree.value = downgrademsg["downgrade_free"]; // jshint ignore:line
		info.innerHTML = downgrademsg["downgrade_free_msg"];// jshint ignore:line
	}
	if(status1 === "2")
	{
		frm.agree.value = downgrademsg["downgrade_bronze"];// jshint ignore:line
		info.innerHTML = downgrademsg["downgrade_bronze_msg"];// jshint ignore:line
	}
	if(status1 === "3")
	{
		frm.agree.value = downgrademsg["downgrade_silver"];// jshint ignore:line
		info.innerHTML = downgrademsg["downgrade_silver_msg"];// jshint ignore:line
	} 
	if(status1 === "4")
	{
		frm.agree.value = downgrademsg["downgrade_gold"];// jshint ignore:line
		info.innerHTML = downgrademsg["downgrade_gold_msg"];// jshint ignore:line
	}
	if(status1 === "5")
	{
		frm.agree.value = downgrademsg["downgrade_diamond"];// jshint ignore:line
		info.innerHTML = downgrademsg["downgrade_diamond_msg"];// jshint ignore:line
	}
	if(status1 === "0")
	{
		frm.agree.value = downgrademsg["terminate_account"];// jshint ignore:line
		info.innerHTML = downgrademsg["terminate_account_msg"];// jshint ignore:line
	}
}
function changeValues(frm)
{
var status1 = frm.downChoice.value;
if(status1 == 0)
{
frm.agree.value = downgrademsg["terminate_account"];
info.innerHTML = downgrademsg["terminate_account_msg"];
}
else if(status1 == 1)
{
frm.agree.value =downgrademsg["downgrade_free"];
info.innerHTML = downgrademsg["downgrade_free_msg"];
}
else if(status1 == 2) 
{
frm.agree.value =  downgrademsg["downgrade_std"];
info.innerHTML = downgrademsg["downgrade_std_msg"];
}
else if(status1 == 3)
{
frm.agree.value = downgrademsg["downgrade_premium"];
info.innerHTML = downgrademsg["downgrade_premium_msg"];
}
}
function fnRemoveAccount(frm)
{
	if(document.getElementById('unsubscribeReason').value==0)//No I18N
	{
		alert(downgrademsg["downgrade.alert.message"]);
		return false;
	}
	
	isFbUser = document.getElementById('isFbUser').value;
	downChoice = document.getElementById("downChoice").value;
	if(isFbUser=="true" && downChoice==0)
	{
		if(!confirm(downgrademsg["fbuser_confirm"]))
		{
			return false;
		}
	}
	
	var feedback=document.getElementById('feedbackArea').value;
	if(document.getElementById('unsubscribeReason').value=='others' && (feedback ==''|| feedback==null ||isblank(feedback)))//No I18N
	{
		alert("Please enter your feedback and help us improve");
		document.getElementById('feedbackArea').focus();
		return false;
	}
 	frm.appendChild(getnewFormElement("hidden",CSRFParamName ,CSRFParamValue));//No I18N
 	var param=verifyNewClient();
 	if(param!=null)
 	{
 		frm.appendChild(getnewFormElement("hidden","nc","billing"));//No I18N
 	}
	frm.submit();
}
function isblank(feedbackVal) {
    for(var i = 0; i < feedbackVal.length; i++) {
        var c = feedbackVal.charAt(i);
        if ((c != ' ') && (c != '\n') && (c != '\t')) return false;
    }
    return true;
}

function fnShowTextArea(){
	
		document.getElementById('feedbackTR').style.display='';
		document.getElementById('feedbackArea').focus();
	
}
function fnSendPriceQuote(emailid,message)
{
if(!validateEmail(emailid))
{
emailreport.email.select();
return;
}
closeDialog();
//alert(emailid);
$("#testEmail input[name=execute]").val("sendPriceQuote");
var result = $.getPostAjaxResponse("/login/status.do","testEmail");//No I18N
url = "/login/status.do?execute=sendPriceQuote&emailid="+emailid+"&message="+message;
postSuccess(result,emailid);  // Removing decodeURIComponent because value is submitted just after receiving from GUI. - Jesy Report Security Operation
showDiv('Message Sent');
}

function postSuccess(respons,emailid)
{

	var beanmssg=reportmsg['email_sent']+" "+emailid;
	var msg = '<div class="SuccessMsgDiv">'+beanmssg+'</div>';
	msg = msg + '<div class="WardShawdowLeft"></div>';	
	document.getElementById('msgs').innerHTML=msg;//No I18N
    startHideFade("msgs",0.005);//No I18N
	try{
		hideDiv('acct_cnfrm_warning_div');//No I18N
	}catch(e){}
}



function fnSendReport(url,emailid)
{
if(!validateEmail(emailid))
{
emailreport.email.select();
return;
}
closeDialog();
emailid=encodeURIComponent(emailid);
// Removing decodeURIComponent because value is submitted just after receiving from GUI. - Jesy Report Security Operation
getHtml(url+emailid,"postSendReport",emailid); //No I18N  

	showDiv('loading');

}

function fnSendFusionReport(url,emailid,isFusion,filePath,mapid)
{
if(!validateEmail(emailid))
{
emailreport.email.select();
return;
}
closeDialog();
if(isFusion!=null && isFusion)
{
	ExportCharts(url,emailid,"JPG","email");//No I18N
	return;
}
emailid=encodeURIComponent(emailid);
var path=url+emailid;
if(filePath!=null && filePath.length>1)
{
	path=path+"&genmapid="+filePath;//No I18N
}
if(mapid!=null)
{
	path=path+"&selected="+mapid;//No I18N
}
getHtml(path,"postSendReport",decodeURIComponent(emailid));//No I18N

showDiv('loading');//No I18N

}

function postSendReport(respons,emailid)
{
/*****/
hideDiv('loading');//No I18N

		var beanmssg=Msgbean(reportmsg['reports_sent'],emailid);
		var msg = '<div class="SuccessMsgDiv">'+beanmssg+'</div>';
		msg = msg + '<div class="WardShawdowLeft"></div>';	
	document.getElementById('msgs').innerHTML=msg;//No I18N
        startHideFade("msgs",0.005);//No I18N
	try{
		hideDiv('acct_cnfrm_warning_div');//No I18N
	}catch(e){}

        
}

function postRCASendReport(respons,emailid)
{
	hideDiv('loading');//No I18N
	var beanmssg=Msgbean(reportmsg['rca.reports.sent'],emailid);
	var msg = '<div class="SuccessMsgDiv">'+beanmssg+'</div>';
	msg = msg + '<div class="WardShawdowLeft"></div>';	
	document.getElementById('msgs').innerHTML=msg;//No I18N
	startHideFade("msgs",0.005);//No I18N
	    
}
function showPremiumUpgradePage(server)
{
	var param=verifyNewClient();
	if(param!=null)
	{
        location.href= "/home/accountinfo.do?method=showupgradescreen&price=PREMIUM_PRICE&nc=billing"
	}
	else
	{
        location.href= "/home/accountinfo.do?method=showupgradescreen&price=PREMIUM_PRICE"
    }
}
function showEnterpriseUpgradePage(server)
{
	var param=verifyNewClient();
	if(param!=null)
	{
	location.href= "/home/accountinfo.do?method=showupgradescreen&price=EE_PRICE&nc=billing"
	}
	else
	{
			location.href= "/home/accountinfo.do?method=showupgradescreen&price=EE_PRICE"
	}
}
function showAPMInsightUpgradePage(server)
{
	var param=verifyNewClient();
	if(param!=null)
	{
	location.href= "/home/accountinfo.do?method=showupgradescreen&price=INSIGHT_PRICE&nc=billing"
	}
	else
	{
			location.href= "/home/accountinfo.do?method=showupgradescreen&price=INSIGHT_PRICE"
	}
}
function showupgradescreen()
{
	location.href= '/home/accountinfo.do?method=showEditions&nc=billing';
}
function showupgradescreenHome()
{
	showupgradescreen();
	
}
function homepage_local()
{
	location.href="/home/client/Welcome.do";//NO I18N
}
function cancel_cart()
  	 {
  	         location.href='/home/accountinfo.do?method=showEditions&cancelcart=true';
  	 }
function postshowupgradescreen(result,cal)
{	
        
	document.getElementById('cartpanel').innerHTML=result
        $.showbtns();		
	showDiv('cartpanel');
        if(cal==1 && cal!=null)
{
  quotethis();
}
else if(cal==2 && cal!=null)
{
  emailquote();
}
}

function calculateamount(fm)
{
	var hidvar = document.getElementById("methodname");		
	hidvar.value="calculate";
	fm.action="/home/accountinfo.do?method=calculate"
	fm.method.value="calculate";
	getHtmlForForm(fm,"postshowupgradescreen");	
	
}
/*function buy(frm)
{
	
	frm.method.value="commit";
	var hidvar = document.getElementById("methodname");		
	hidvar.value="commit";
	
	//window.open( 'blan', this.target,'scrollbars=no,resizable=no,width=575,height=410,left=150,top=100'); 
	var win1 = window.open( 'about:blank', '','scrollbars=yes,resizable=no,width=575,height=410,left=150,top=100'); 
	win1.name='buywindow'
	frm.action="/home/accountinfo.do?method=commit"
	frm.target=win1.name;
	frm.submit();
}*/
function upgradeEdition(frm,topupscreen)
{
	frm.method.value="commit";
    frm.action='/login/accountinfo.do';
    var param=verifyNewClient();
    if(param!=null && !document.getElementsByName("nc"))
    {
    	frm.appendChild(getnewFormElement("hidden","nc","billing"));//No I18N
    }
    if(topupscreen=='true')
    {
    frm.action='/home/accountinfo.do?topupscreen='+topupscreen;
	}
    frm.submit();
}

/*For Pricing calc*/
function changePlan(frm,price,planid)
{
    if(frm=='')
    {
      frm = document.getElementById('acctfrm');
    }
    frm.price.value = price;
    //frm.PLANID.value= planid;
    update(frm);
}
/*For Pricing calc*/

function update(frm,topupscreen,rowid,calculate)
{
frm.method.value="subscribe";
frm.action="/login/accountinfo.do";
if(topupscreen=='true')
{
frm.action="/home/accountinfo.do?topupscreen="+topupscreen;
}
if(frm.multiuserpack != undefined){  // jshint ignore:line
        if(frm.multiuserpack.value=='' || frm.multiuserpack.value==""){ // jshint ignore:line
                frm.multiuserpack.value='0';//NO i18N
        }
}
frm.appendChild(getnewFormElement("hidden",CSRFParamName,CSRFParamValue));//No I18N
getHtmlForForm(frm,"postshowupgradescreen",calculate);
}
function updatePollId(frm,topupscreen)
{
frm.method.value="changePollId";
if(topupscreen=='true')
{
frm.action="/home/accountinfo.do?topupscreen=true";
}
else
{
frm.action="/login/accountinfo.do";
}
getHtmlForForm(frm,"postshowupgradescreen");
}
function removeItem(item,topupscreen)
{
        frm = document.getElementById('updatebtn').form;
        frm.method.value="deleteItem";
        var actionUrlValue = "/login/accountinfo.do?key="+item;//No I18N
        if(topupscreen=='true')
        {
                actionUrlValue = actionUrlValue+"&topupscreen=true";//No I18N
        }
        frm.action = actionUrlValue;
        try
        {
                parent.resizeCaller('del');//No I18N
        }
        catch(e)
        {
        }
        getHtmlForForm(frm,"postshowupgradescreen");
}
function addItem(item,topupscreen,rowid)
{
if(item=='')
{
item = document.getElementById('monlist'+rowid).options[document.getElementById('monlist'+rowid).selectedIndex].value;
}
frm = document.getElementById('updatebtn').form;
frm.method.value="showcart";
if(topupscreen=='true')
{
frm.action="/home/accountinfo.do?additem="+item+"&topupscreen="+topupscreen+"&rowid="+rowid;
}
else
{
frm.action="/login/accountinfo.do?additem="+item+"&rowid="+rowid;
}

if((item != 'smspack') && (item != 'removesmspack') && (rowid==''))
{
  try
  {
    parent.resizeCaller('add');//No I18N
  }
  catch(e)
  {
  }
}
frm.appendChild(getnewFormElement("hidden",CSRFParamName,CSRFParamValue));//No I18N
getHtmlForForm(frm,"postshowupgradescreen");
}
function emailquote()
{
     document.getElementById('cont').style.display="none";
     $.sendAttMail();
}
function quotethis()
{
   document.getElementById('cont').style.display="none";
   location.href= "/login/status.do?execute=sendPriceQuote";
}
function showDownloadbtn(flag)
{
var showbtn = document.getElementById('showbtns');
 if(flag=='1')
{ 
 if(document.getElementById('cont').style.display=="none")
 {
   document.getElementById('cont').style.display="block";
 }
 else
 {
   document.getElementById('cont').style.display="none";
 }
if(showbtn!=null)
  	{
   		showbtn.value='2';
  	}	
}
else 
{
       
 	if(showbtn!=null && showbtn.value=='0')
 	{
     		document.getElementById('cont').style.display="none";
 	}
   if(showbtn!=null)
    {
     	showbtn.value='0';
    }
}
}
function hidebtns()
{
 var doc_count = document.getElementById('cont');
 if(doc_count!=null)
 {
 doc_count.style.display="none";
 }
}
function updateCcDetails(frm)
 {
	frm.paymentoption.value = "1";
  checkCardDetails(frm,"0","updatecard");//No I18N

 }
 function showmodifyscreen(server,port)
 {
 	window.open('/home/accountinfo.do?method=showModifyCardForm', '','scrollbars=no,resizable=no,width=575,height=450,left=150,top=100');
 }
function showUsage()
{
	showDiv('usagepanel');
	hideDiv('cartpanel');
}
function showTransaction()
{
	var frm = document.getElementById("showtrans");
	$.removeCSRFParam();
	getHtmlForForm(frm,"postshowTransaction",frm)
}
function showTransactionForForm(frm)
{
	var frm = document.getElementById("showmonthlyTrans");
	getHtmlForForm(frm,"postshowTransaction",frm)
}
function postshowTransaction(result,frm)
{
	showDiv('Account_Info_div');
	var trans_div = document.getElementById("transaction_div");
	if(trans_div!=null)
	{	
		trans_div.innerHTML = result;
		showDiv('transaction_div');
	}
}
function showBillDetails()
{
	showDiv('Account_Info_div');
	showDiv('transaction_div');	
}

function showSMTPAuth(frm)
{
	if(frm.smtpAuthEnabled.checked)
	{
		showDiv('smtpAuth');//No I18N
	}
	else
	{
		hideDiv('smtpAuth');//No I18N
	}
}

function changeSMTPPort(frm)
{
	if(frm.smtpSSLEnabled.checked)
	{
		frm.smtpPort.value=465;
	}
	else
	{
		frm.smtpPort.value=25;
	}
}

function changeFetchPorts(frm)
{
	if(frm.fetchSSLEnabled.checked)
	{
		frm.popPort.value=995;
		frm.imapPort.value=993;
	}
	else
	{
		frm.popPort.value=110;
		frm.imapPort.value=143;
	}
}
function showFetch(frm)
{
	if(frm.fetchEnabled.checked)
	{
		frm.popEnabled.checked=true;
		showDiv('fetchinfo');//No I18N
		showDiv('popinfo');//No I18N
	}
	else
	{
		hideDiv('fetchinfo');//No I18N
		frm.popEnabled.checked=false;
		frm.imapEnabled.checked=false;
	}
}

function showFetchTypePop(frm)
{
	frm.imapEnabled.checked=false;
	frm.popEnabled.checked=true;
	showDiv('popinfo');//No I18N
	hideDiv('imapinfo');//No I18N
}

function showFetchTypeImap(frm)
{
	frm.imapEnabled.checked=true;
	frm.popEnabled.checked=false;
	showDiv('imapinfo');//No I18N
	hideDiv('popinfo');//No I18N
}

function fnsubmitSMTP(frm) 
{
	if(trimString(frm.displayname.value).length < 1)
	{
			alert(beanmsg["dispnameempty"]);
			frm.displayname.select();
			return;
	} 
    if(!trimString(frm.smtpHost.value).length > 0)
	{
		alert(beanmsg["smtpempty"]);
		frm.smtpHost.select();
		return;
	}
 	if(!trimString(frm.smtpPort.value).length > 0)
	{
		alert(beanmsg["smtp_portempty"]);
		frm.smtpPort.select();
		return;
	}
	if(!validateEmail(frm.fromEmail.value))
	{
		frm.fromEmail.select();
		return;
	}
	if(!validateEmail(frm.toEmail.value))
	{
		frm.toEmail.select();
		return;
	}
	
	if(frm.smtpAuthEnabled.checked)
	{
		if(frm.smtpUserName.value=='')
		{
				alert(beanmsg["smtpuser_empty"]);
				frm.smtpUserName.select();
				return;
		}
		if(frm.smtpPassword.value=='')
		{
				alert(beanmsg["smtppass_empty"]);
				frm.smtpPassword.select();
				return;
		}
	}
	
	if(frm.fetchEnabled.checked)
	{
 		if(frm.popEnabled.checked)
		{
			if(frm.popHost.value=='')
			{
					alert(beanmsg["popempty"]);
					frm.popHost.select();
					return;
			}
			if(frm.popPort.value=='')
			{
					alert(beanmsg["pop_portempty"]);
					frm.popPort.select();
					return;
			}
			if(frm.popUserName.value=='')
			{
				alert(beanmsg["usernameempty"]);
					frm.mailUserName.select();
					return;
			}
			if(frm.popPassword.value=='')
			{
				alert(beanmsg["pwdempty"]);
					frm.mailPassword.select();
					return;
			}
		}
		else if(frm.imapEnabled.checked)
		{
			if(frm.imapHost.value=='')
			{
					alert(beanmsg["imapempty"]);
					frm.popHost.select();
					return;
			}
			if(frm.imapPort.value=='')
			{
					alert(beanmsg["imapport_empty"]);
					frm.popPort.select();
					return;
			}
			if(frm.imapFolder.value=='')
			{
					alert(beanmsg["imapfolder_empty"]);
					frm.popPort.select();
					return;
			}
			if(frm.imapUserName.value=='')
			{
				alert(beanmsg["usernameempty"]);
					frm.mailUserName.select();
					return;
			}
			if(frm.imapPassword.value=='')
			{
				alert(beanmsg["pwdempty"]);
					frm.mailPassword.select();
					return;
			}
		}
			
		if(frm.mailSubject.value=='')
		{
				alert(beanmsg["subjectempty"]);
				frm.mailMessage.select();
				return;
		}
	}
	
	if(frm.timeout.value=='')
	{
			alert(beanmsg["timeoutempty"]);
			frm.timeout.select();
			return;
	}
	if(isNaN(frm.timeout.value)) 
	{
			alert(beanmsg["invalid_timeout"]);
			frm.timeout.select();
			return false
	}
	
	if(frm.monitorPollId.value==12)
	{
		if(frm.timeout.value>30)
		{
			alert(beanmsg["timeout_limit_exceeded"]);
			frm.timeout.select();
			return false
		}
	}
	if(frm.timeout.value<=0)
	{
		alert(beanmsg["zerotimeout"]);
		frm.timeout.select();
		return false
	}
	if(frm.timeout.value>90)
	{
		alert(beanmsg["timeout_gt_90"]);
		frm.timeout.select();
		return false
	}
	
   	var sel = false;
	var actionelementid = 0;
	ele = frm.elements;
	total_sms=0;
	for(i=0;i<ele.length;i++)
	{
		if(ele[i].name=="actions" )
		{
			if(ele[i].checked)
			{
				sel=true;
				if(ele[i].id.indexOf("sms")==0)
				{
					total_sms=total_sms+1
				}
			}
			else if(actionelementid<=0)
			{
				actionelementid = i;
			}
		}
	}
	if(!sel)
	{
		ele[actionelementid].checked = true;
	}		       
	var urlid = "0";
	try
	{
		urlid = frm.urlid.value;
	}
	catch(err)
	{
		urlid = "0";
	}
	
	if(!validateRespThreshold(frm, urlid))
	{
		return;
	}

	frm.smtpHost.value=trimString(frm.smtpHost.value);
	frm.smtpPort.value=trimString(frm.smtpPort.value);   
	frm.submit();
} 

function fnsubmitHomePage(frm,a) 
   {
	if(trimString(frm.displayname.value).length < 1)
        {
                alert(beanmsg["dispnameempty"]);
                frm.displayname.select();
                return;
	} 
	if(trimString(frm.url.value).length < 8)
	{
	alert(beanmsg["urlempty"]);
	frm.url.select();
	return;
	}
	if(!checkUrl(frm.url.value))
	{
		frm.url.select();
		return;
	} 
	var sel = false;
        var actionelementid = 0;
        ele = frm.elements;
	total_sms=0;
	for(i=0;i<ele.length;i++)
	{
		if(ele[i].name=="actions" )
		{
			if(ele[i].checked)
			{
				sel=true;
				if(ele[i].id.indexOf("sms")==0)
				{
					total_sms=total_sms+1
				}
			}
			else if(actionelementid<=0)
			{
				actionelementid = i;
			}
		}
	}
	if(!sel)
	{
		ele[actionelementid].checked = true;
	}	
	try
	{
		urlid = frm.urlid.value;
	}
	catch(err)
	{
		urlid = "0";
	}
	
	contentchange  = getField(frm,'thresholds('+urlid+'-2)'); //No I18N
	if(frm.attributes[2].checked==true) 
	{ 
	    if(!trimString(contentchange.value).length > 0)//No I18N  
	    { 
		    alert(beanmsg["url_content_change_empty"]);
		    contentchange.focus();
		    return false;
	    } 
	    if((trimString(contentchange.value).length > 0) && isNaN(trimString(contentchange.value)))//No I18N  
	    { 
		alert(beanmsg["invalid_content_change_val"]);
		contentchange.focus();
		return false;
	    }
	} 
	
	if(!validateRespThreshold(frm, urlid))
	{
		return;
	}
	
	frm.url.value=trimString(frm.url.value);
	frm.submit();
}
function fnsubmitpop(frm)
{
	if(!trimString(frm.displayname.value).length > 0)
        {
                alert(beanmsg["pop_displayname_empty"]);
                frm.displayname.select();
                return;
        }
        if(!trimString(frm.popHost.value).length > 0)
        {
                alert(beanmsg["pop_hostname_empty"]);
                frm.popHost.select();
                return;
        }
	if(!trimString(frm.popPort.value).length > 0)
        {
                alert(beanmsg["pop_portnumber_check"]);
                frm.popPort.select();
                return;
        }
	if(isNaN(frm.popPort.value))
        {
                alert(beanmsg["pop_portvalue_check"]);
                frm.popPort.select();
                return;
        }
	if(!trimString(frm.timeout.value).length > 0)
        {
                alert(beanmsg["pop_timeout_check"]);
                frm.timeout.select();
                return;
        }
        if(isNaN(frm.timeout.value))
        {
                alert(beanmsg["invalid_timeout"]);
                frm.timeout.select();
                return;
        }
        var timeout = frm.timeout.value;
        if(timeout<0 || timeout>30)
        {
                alert(beanmsg["pop_timeout_value_check"]);
                frm.timeout.select();
                return;
        }
        var islocallowed=checkPkgUserSeclocations(frm);
    	if(!islocallowed)
    	{
    		return false;
    	}
	var sel = false;
	var actionelementid = 0;
	ele = frm.elements;
	total_sms=0;
	for(i=0;i<ele.length;i++)
	{
		if(ele[i].name=="actions" )
		{
			if(ele[i].checked)
			{
				sel=true;
				if(ele[i].id.indexOf("sms")==0)
				{
					total_sms=total_sms+1
				}
			}
			else if(actionelementid<=0)
			{
				actionelementid = i;
			}
		}
	}
	if(!sel)
	{
		ele[actionelementid].checked = true;
	}
	var urlid = "0";
	try
	{
		urlid = frm.urlid.value;
	}
	catch(err)
	{
		urlid = "0";
	}
	
	if(!validateRespThreshold(frm, urlid))
	{
		return;
	}	
		
	frm.displayname.value=trimString(frm.displayname.value);
	frm.popHost.value=trimString(frm.popHost.value);
	frm.popPort.value=trimString(frm.popPort.value);
	frm.timeout.value = trimString(frm.timeout.value);
	frm.submit();
}
function fnsubmitportsmtp(frm)
{
	if(!trimString(frm.displayname.value).length > 0)
        {
                alert(beanmsg["portsmtp_displayname_empty"]);
                frm.displayname.select();
                return;
        }
	if(!trimString(frm.smtpHost.value).length > 0)
        {
                alert(beanmsg["portsmtp_hostname_empty"]);
                frm.smtpHost.select();
                return;
        }
	if(!trimString(frm.smtpPort.value).length > 0)
        {
                alert(beanmsg["portsmtp_portnumber_check"]);
                frm.smtpPort.select();
                return;
        }
	if(isNaN(frm.smtpPort.value))
        {
                alert(beanmsg["portsmtp_portvalue_check"]);
                frm.smtpPort.select();
                return;
        }
        if(!trimString(frm.timeout.value).length > 0)
        {
                alert(beanmsg["portsmtp_timeout_check"]);
                frm.timeout.select();
                return;
        }
        if(isNaN(frm.timeout.value))
        {
                alert(beanmsg["portsmtp_invalid_timeout"]);
                frm.timeout.select();
                return;
        }
	var timeout = frm.timeout.value;
        if(timeout<0 || timeout>30)
        {
                alert(beanmsg["port_timeout_value_check"]);
                frm.timeout.select();
                return;
        }
        var islocallowed=checkPkgUserSeclocations(frm);
    	if(!islocallowed)
    	{
    		return false;
    	}
	var sel = false;
	var actionelementid = 0;
	ele = frm.elements;
	total_sms=0;
	for(i=0;i<ele.length;i++)
	{
		if(ele[i].name=="actions" )
		{
			if(ele[i].checked)
			{
				sel=true;
				if(ele[i].id.indexOf("sms")==0)
				{
					total_sms=total_sms+1
				}
			}
			else if(actionelementid<=0)
			{
				actionelementid = i;
			}
		}
	}
	if(!sel)
	{
		ele[actionelementid].checked = true;
	}
	var urlid = "0";
	try
	{
		urlid = frm.urlid.value;
	}
	catch(err)
	{
		urlid = "0";
	}
	
	if(!validateRespThreshold(frm, urlid))
	{
		return;
	} 
	
	frm.displayname.value=trimString(frm.displayname.value);
	frm.smtpHost.value=trimString(frm.smtpHost.value);
	frm.smtpPort.value=trimString(frm.smtpPort.value);
	frm.timeout.value = trimString(frm.timeout.value);
	frm.submit();
}
function fnsubmitping(frm)
{
	if(!trimString(frm.displayname.value).length > 0)
        {
                alert(pingmsg["ping_displayname_empty"]);
                frm.displayname.select();
                return;
        }
        if(!trimString(frm.hostName.value).length > 0)
        {
                alert(pingmsg["ping_hostname_empty"]);
                frm.hostName.select();
                return;
        }
	if(!trimString(frm.timeout.value).length > 0)
        {
                alert(pingmsg["ping_timeout_check"]);
                frm.timeout.select();
                return;
        }
	if(isNaN(frm.timeout.value))
        {
                alert(beanmsg["invalid_timeout"]);
                frm.timeout.select();
                return;
	}
	var islocallowed=checkPkgUserSeclocations(frm);
	if(!islocallowed)
	{
		return false;
	}
	var sel = false;
	var actionelementid = 0;
	ele = frm.elements;
	total_sms=0;
	for(i=0;i<ele.length;i++)
	{
		if(ele[i].name=="actions" )
		{
			if(ele[i].checked)
			{
				sel=true;
				if(ele[i].id.indexOf("sms")==0)
				{
					total_sms=total_sms+1
				}
			}
			else if(actionelementid<=0)
			{
				actionelementid = i;
			}
		}
	}
	if(!sel)
	{
		ele[actionelementid].checked = true;
	}
	try
	{
		urlid = frm.urlid.value;
	}
	catch(err)
	{
		urlid = "0";
	}
	pktloss  = getField(frm,'thresholds('+urlid+'-18)'); //No I18N
	rttThreshld  = getField(frm,'thresholds('+urlid+'-19)'); //No I18N
	if(frm.attributes[1].checked==true) 
	{ 
	    if(!trimString(pktloss.value).length > 0)//No I18N  
	    { 
		    alert(pingmsg["ping_pktloss_empty"]);
		    pktloss.focus();
		    return false;
	    } 
	    if((trimString(pktloss.value).length > 0) && isNaN(trimString(pktloss.value)))//No I18N  
	    { 
		alert(pingmsg["ping_pktloss_check"]);
		pktloss.focus();
		return false;
	    }
	}
	if(frm.attributes[2].checked==true) 
	{ 
	    if(!trimString(rttThreshld.value).length > 0)//No I18N  
	    { 
		    alert(pingmsg["ping_rtt_empty"]);
		    rttThreshld.focus();
		    return false;
	    } 
	    if((trimString(rttThreshld.value).length > 0) && isNaN(trimString(rttThreshld.value)))//No I18N  
	    { 
		alert(pingmsg["ping_rtt_check"]);
		rttThreshld.focus();
		return false;
	    }
	} 
	
	if(!validateRespThreshold(frm, urlid))
	{
		return;
	}
	
	frm.displayname.value=trimString(frm.displayname.value);
	frm.hostName.value=trimString(frm.hostName.value);
	frm.timeout.value = trimString(frm.timeout.value);
	frm.submit();
}
function fnsubmitport(frm)
{
	if(!trimString(frm.displayname.value).length > 0)
	{
        	alert(beanmsg["port_displayname_empty"]);
		frm.displayname.select();
		return;
	}
	if(!trimString(frm.hostName.value).length > 0)
	{	
        	alert(beanmsg["port_hostname_empty"]);
		frm.url.select();	
		return;
	}
	if(!trimString(frm.port.value).length > 0)
	{
        	alert(beanmsg["port_portnumber_check"]);
		frm.port.select();
		return;
	}
	if(isNaN(frm.port.value))
        {
                alert(beanmsg["portvalue_check"]);
                frm.port.select();
                return;
        }
	if(!trimString(frm.timeout.value).length > 0)
	{
        	alert(beanmsg["port_timeout_check"]);
                frm.timeout.select();
                return;
	}
	if(isNaN(frm.timeout.value))
	{
        	alert(beanmsg["invalid_timeout"]);
        	frm.timeout.select();
        	return;
    	}
	var timeout = frm.timeout.value;
	if(timeout<0 || timeout>30)
        {
        	alert(beanmsg["port_timeout_value_check"]);
                frm.timeout.select();
                return;
	}
	var islocallowed=checkPkgUserSeclocations(frm);
	if(!islocallowed)
	{
		return false;
	}
	var sel = false;
	var actionelementid = 0;
	ele = frm.elements;
	total_sms=0;
	for(i=0;i<ele.length;i++)
	{
		if(ele[i].name=="actions" )
		{
			if(ele[i].checked)
			{
				sel=true;
				if(ele[i].id.indexOf("sms")==0)
				{
					total_sms=total_sms+1
				}
			}
			else if(actionelementid<=0)
			{
				actionelementid = i;
			}
		}
	}
	if(!sel)
	{
		ele[actionelementid].checked = true;
	}
	var urlid = "0";
	try
	{
		urlid = frm.urlid.value;
	}
	catch(err)
	{
		urlid = "0";
	}
	unavail  = getField(frm,'thresholds('+urlid+'-4)'); //No I18N
	avail  = getField(frm,'thresholds('+urlid+'-5)'); //No I18N
	if(frm.attributes[1].checked==true && trim(unavail.value)=='')//No I18N
	{
	    alert(beanmsg["url_unavail_key_empty"]);//No I18N
	    unavail.focus();
	    return false;
	}
	if(frm.attributes[2].checked==true && trim(avail.value)=='')//No I18N
	{
	    alert(beanmsg["url_avail_key_empty"]);//No I18N
	    avail.focus();
	    return false;
	}
	
	if(!validateRespThreshold(frm, urlid))
	{
		return;
	}
	
	frm.displayname.value=trimString(frm.displayname.value);
	frm.hostName.value=trimString(frm.hostName.value);
	frm.port.value=trimString(frm.port.value);
	frm.command.value=trimString(frm.command.value);	
	frm.timeout.value = trimString(frm.timeout.value);
	frm.submit();
}
function fnsubmitdns(frm) 
{
	if(trimString(frm.displayname.value).length < 1)
        {
                alert(beanmsg["dispnameempty"]);
                frm.displayname.select();
                return;
        } 
       	if(!trimString(frm.dnsServer.value).length > 0)
	{
		alert(beanmsg["dnsempty"]);
		frm.dnsServer.select();
		return;
	}
 	if(!trimString(frm.dnsPort.value).length > 0)
	{
		alert(beanmsg["dns_portempty"]);
		frm.dnsPort.select();
		return;
	}
 	if(trimString(frm.hostIp.value).length > 0 && !ipAddressRegex.test(frm.hostIp.value))
	{
		alert(beanmsg["invalid_ip_address"]);
		frm.hostIp.select();
		return;
	}
 	if(!trimString(frm.hostName.value).length > 0)
	{
		alert(beanmsg["domainempty"]);
		frm.hostName.select();
		return;
	}
	if(frm.timeout.value=='')
        {
                alert(beanmsg["timeoutempty"]);
                frm.timeout.select();
                return;
        }
        if(isNaN(frm.timeout.value))
        {
                alert(beanmsg["invalid_timeout"]);
                frm.timeout.select();
                return false
        }
	if(frm.timeout.value<=0)
        {
                alert(beanmsg["zerotimeout"]);
                frm.timeout.select();
                return false
        }
        if(frm.timeout.value>30)
        {
                alert(beanmsg["timeout_limit_exceeded"]);
                frm.timeout.select();
                return false
        }
	var urlid = "0";//No I18N 
	try
	{
		urlid = frm.urlid.value;
	}
	catch(err)
	{
		urlid = "0";//No I18N 
	}
	
	if(!validateRespThreshold(frm, urlid))
	{
		return;
	}
	var islocallowed=checkPkgUserSeclocations(frm);
	if(!islocallowed)
	{
		return false;
	}
	
   	var sel = false;
	var actionelementid = 0;
	ele = frm.elements;
	total_sms=0;
	for(i=0;i<ele.length;i++)
	{
		if(ele[i].name=="actions" )
		{
			if(ele[i].checked)
			{
				sel=true;
				if(ele[i].id.indexOf("sms")==0)
				{
					total_sms=total_sms+1
				}
			}
			else if(actionelementid<=0)
			{
				actionelementid = i;
			}
		}
	}
	if(!sel)
	{
		ele[actionelementid].checked = true;
	}		       
	frm.dnsServer.value=trimString(frm.dnsServer.value);   
	frm.dnsPort.value=trimString(frm.dnsPort.value);
	frm.hostName.value=trimString(frm.hostName.value);
	frm.submit();
} 
    
   /** 
   * below methods are used in UrlForm.jsp 
   */ 
   function selectAll(combobox) 
   { 
    
   for(i=0;i<combobox.length;i++) 
   { 
           combobox.options[i].selected=true; 
           } 
    
   } 
function fnsubmitupdate(frm)
   {
	   fnsubmit(frm,'edit');
   }
   function fnsubmitPORTupdate(frm)
   {
	if(!trimString(frm.displayname.value).length > 0)
	{
		frm.displayname.value = frm.url.value;
	}
	fnsubmitport(frm,'edit');
   }
   function fnsubmitPORTSMTPupdate(frm)
   {
        if(!trimString(frm.displayname.value).length > 0)
        {
                frm.displayname.value = frm.url.value;
        }
        fnsubmitportsmtp(frm,'edit');
   }
   function fnsubmitPOPupdate(frm)
   {
        if(!trimString(frm.displayname.value).length > 0)
        {
                frm.displayname.value = frm.popHost.value;
        }
        fnsubmitpop(frm,'edit');
   }
   function fnsubmitdnsupdate(frm)
   {
           if(!trimString(frm.displayname.value).length > 0)
	   {
		frm.displayname.value = frm.dnsServer.value;
	   }
	   fnsubmitdns(frm,'edit');
   }
   function fnsubmitSMTPupdate(frm)
   {
           if(!trimString(frm.displayname.value).length > 0)
	   {
		frm.displayname.value = frm.smtpHost.value;  
	   }
	   fnsubmitSMTP(frm,'edit');
   }
   function fnsubmitHomePageupdate(frm)
   {
	   if(!trimString(frm.displayname.value).length > 0)
	   {
		frm.displayname.value = frm.url.value.substring(7,frm.url.value.length);  
	   }
	   fnsubmitHomePage(frm,'edit');
   }

function dobilling(frm,bulkedit)
{
if(bulkedit=='true')
{
frm.execute.value="bulkAction";
}
frm.submit();
}

function validateRespThreshold(frm, urlid)
{
	for(attribLength=0;attribLength<frm.attributes.length;attribLength++)
	{
		attribValue = frm.attributes[attribLength].value;
		if(attribValue.indexOf(urlid+"-3-")!=-1)
		{
			respThresholdLocId = getStringAfterHyphen(getStringAfterHyphen(attribValue));
			
			fld = getField(frm,'thresholds('+urlid+'-3-'+respThresholdLocId+')'); //No I18N
			if(frm.attributes[attribLength].checked==true)
			{
				if(respThresholdLocId==0)
				{
					respThresholdLocId=frm.primaryLocation.value;
				}
			
				if(trimString(fld.value)=='') 
				{ 
					alert(beanmsg["js.resptimechange.empty.for"].replace("{0}", locationNames[respThresholdLocId]));//No I18N
					fld.focus();
					return false;
				} 
				if(isNaN(fld.value) || fld.value<0) 
				{ 
					alert(beanmsg["js.invalid.resptimechange.for"].replace("{0}", locationNames[respThresholdLocId]));//No I18N
					fld.focus();
					return false;
				}
			}
		}
	}
	return true;
}

//For WebSite Adding, Editing
function fnsubmit(frm) 
{
	if(trimString(frm.displayname.value).length < 1)
        {
                alert(beanmsg["dispnameempty"]);
                return;
        }
   	if(trimString(frm.url.value).length < 8)
   	{
     		alert(beanmsg["urlempty"]);
     		frm.url.select();
     		return;
   	}
      	if(!checkUrl(frm.url.value))
       	{
          	frm.url.select();
          	return;
       	}
	if(frm.timeout.value=='')
	{
       		alert(beanmsg["timeoutempty"]);
       		frm.timeout.select();
       		return;
	}
	if(isNaN(frm.timeout.value)) 
	{
        	alert(beanmsg["invalid_timeout"]);
        	frm.timeout.select();
        	return false
    	}
	if(frm.monitorPollId.value==12)
	{
		if(frm.timeout.value>30)
		{
			alert(beanmsg["timeout_limit_exceeded"]);
			frm.timeout.select();
		 	return false
		}
	}
	if(frm.timeout.value<=0)
	{
		alert(beanmsg["zerotimeout"]);
		frm.timeout.select();
	 	return false
	}
	if(frm.timeout.value>90)
	{
		alert(beanmsg["timeout_gt_90"]);
		frm.timeout.select();
		return false
	}
	var islocallowed=checkPkgUserSeclocations(frm);
	if(!islocallowed)
	{
		return false;
	}
   	disableAuthFields(frm);
   	var sel = false; 
	var actionelementid = 0;
   	ele = frm.elements; 
   	total_sms=0; 
   	for(i=0;i<ele.length;i++) 
   	{
           	if(ele[i].name=="actions" ) 
           	{ 
           		if(ele[i].checked) 
           		{ 
                   		sel=true; 
                   		if(ele[i].id.indexOf("sms")==0) 
                   		{ 
                           		total_sms=total_sms+1 
                   		} 
           		}
			else if(actionelementid<=0)
			{
				actionelementid = i;
			}	
           	} 
   	} 
   	if(!sel) 
   	{ 
		ele[actionelementid].checked = true;
   	}
   	if(frm.primaryLocation!=undefined)
   	{
   		var primary=frm.primaryLocation.value;
   	}
	/*if(frm.secondaryLocations!=undefined)
	{
   	var secondary=frm.secondaryLocations;
   	for(i=0;i<secondary.length;i++)
   	{
        	if( i == (primary-1))
        	{
                	if(secondary[i].checked)
                	{
                        	secondary[i].checked = false;
                	}
                	secondary[i].disabled = true;
        	}
        	else
        	{
                	secondary[i].disabled = false;
        	}
   	}	 
	}*/	 
   	/* Disable all the custom Header Fields as it is not selected */
   	if(!frm.customHeadersSupported.checked)
   	{
		frm.userAgent.value = "";
   	}
	if(frm.customHeadersSupported.checked)
        {
                var table = document.getElementById('additionalHeadersTable');
                var row = table.rows;
                for(var i=0;i<row.length;i++)
                {
                        var rowid = row[i].id;
                        if(rowid.indexOf("additionalHeadersTr")>=0)
                        {
                                var t = rowid.split('additionalHeadersTr');
                                var idval = t[1];
                                var headername = document.getElementById("additionalHeaderNames("+idval+")").value;
                                var headervalue = document.getElementById("additionalHeaderValues("+idval+")").value;
                                headername = trimString(headername);
                                headervalue = trimString(headervalue);
                                if(headername=='' && headervalue!='')
                                {
                                        alert(beanmsg["url_headername_empty"]);
                                        document.getElementById("additionalHeaderNames("+idval+")").select();
                                }
                                if(headername!='' && headervalue=='')
                                {
                                        alert(beanmsg["url_headervalue_empty"]);
                                        document.getElementById("additionalHeaderValues("+idval+")").select();
                                }
                        }
                }
        }
	var urlid = "0";
	try
	{
		urlid = frm.urlid.value;
	}
	catch(err)
	{
		urlid = "0";
	}
	try
	{ 
   		available = getField(frm,'thresholds('+urlid+'-4)'); //No I18N
   		unavailable = getField(frm,'thresholds('+urlid+'-5)'); //No I18N
   		regex  = getField(frm,'thresholds('+urlid+'-21)'); //No I18N
		
		var availabilityCheck = null;
		var unAvailabilityCheck = null;
		var regexCheck = null;
		
		for(attribLength=0;attribLength<frm.attributes.length;attribLength++)
		{
			attribValue = frm.attributes[attribLength].value;
			
			if(attribValue==urlid+'-4')
			{
				availabilityCheck = frm.attributes[attribLength];
			}
			else if(attribValue==urlid+'-5')
			{
				unAvailabilityCheck = frm.attributes[attribLength];
			}
			else if(attribValue==urlid+'-21')
			{
				regexCheck = frm.attributes[attribLength];
			}
		}
		
   		if(frm.method[2].checked) //==>method="G"
   		{ 
		      if(availabilityCheck.checked==true || unAvailabilityCheck.checked==true || regexCheck.checked==true) 
		      { 
			      if(available.value!='' || unavailable.value!='' || regex.value!='')//No I18N  
			      { 
				      frm.method[2].checked = 'false';//No I18N
				      frm.method[1].checked = 'true';//No I18N
			      } 
		      } 
   		}
		if(!frm.method[2].checked) 
   		{ 
			fld1 = getField(frm,'thresholds('+urlid+'-4)');//No I18N
  	 		if(unAvailabilityCheck.checked==true && trim(unavailable.value)=='')//No I18N
			{
			    alert(beanmsg["url_unavail_key_empty"]);//No I18N
			    fld1.focus();
			    return false;
			}
			fld1 = getField(frm,'thresholds('+urlid+'-5)');//No I18N
			if(availabilityCheck.checked==true && trim(available.value)=='')//No I18N
			{
			    alert(beanmsg["url_avail_key_empty"]);//No I18N
			    fld1.focus();
			    return false;
			}
			fld1 = getField(frm,'thresholds('+urlid+'-21)');//No I18N
			if(regexCheck.checked==true && trim(regex.value)=='')//No I18N
			{
			    alert(beanmsg["url_regex_empty"]);//No I18N
			    fld1.focus();
			    return false;
			}
		}	
		
		if(!frm.method[2].checked) 
		{
			  fld = getField(frm,'thresholds('+urlid+'-2)');//No I18N
			  if(frm.attributes[2].checked==true)
			  { 
			      if(fld.value=='') //No I18N
			      {
				alert(beanmsg["url_content_change_empty"]);//No I18N
				fld.focus();
				return false;
			      }
			      if(isNaN(fld.value)) 
			      { 
				  alert(beanmsg["invalid_content_change_val"]);//No I18N
				  fld.focus();
				  return false;
			      }
			  }
		
			if(!validateRespThreshold(frm, urlid))
			{
				return;
			}
		}
	}
	catch(er1)
	{
		//Do Nothing
	}
   	try
	{ 
   		disableEmptyFields(frm); 
   	}
	catch(e){} 
	frm.url.value=trimString(frm.url.value);
	frm.submit();
} 
   function disableEmptyFields(frm) 
   { 
    
           var fields = frm.elements; 
           for(i = 0;i<fields.length;i++) 
           { 
                   if(fields[i].name=='attributes') 
                   { 
    
                   var status = fields[i].checked 
                   if(!status) 
                   { 
                           continue; 
                   } 
                   val = getStringAfterHyphen(fields[i].value); 
                   urlid = getStringBeforeHyphen(fields[i].value); 
                                   if(val=='2') 
                                   { 
                                           fld = getField(frm,'thresholds('+urlid+'-2)'); 
    
                                           if(fld.value=='') 
                                           { 
                                                   fields[i].checked=false; 
    
                                           } 
                                   } 
                                   if(val=='3') 
                                   { 
                                           fld = getField(frm,'thresholds('+urlid+'-3)'); 
    
                                          if(fld.value=='') 
                                           { 
                                                   fields[i].checked=false; 
    
                                           } 
                                   } 
                                   if(val=='4') 
                                   { 
                                           fld = getField(frm,'thresholds('+urlid+'-4)'); 
                                           if(fld.value=='') 
                                           { 
                                                   fields[i].checked=false; 
    
                                           } 
                                   } 
                                   if(val=='5') 
                                   { 
                                           fld = getField(frm,'thresholds('+urlid+'-5)'); 
                                           if(fld.value=='') 
                                           { 
                                                   fields[i].checked=false; 
    
                                           } 
                                   } 
								   if(val=='21') 
                                   { 
                                           fld = getField(frm,'thresholds('+urlid+'-21)'); //No I18N
                                           if(fld.value=='') 
                                           { 
                                                   fields[i].checked=false; 
    
                                           } 
                                   } 
                   } 
           } 
    
    
   } 
   


function showAdv(a) 
{ 
	if(a.value=='false') 
	{
		a.value='true'; 
		document.getElementById("advancedicon").src = '../images/icon_show.gif';
	} 
	else 
	{ 
		a.value='false'; 
		document.getElementById("advancedicon").src = '../images/icon_hide.gif'; 
	} 
	var advdiv = document.getElementById("advdiv"); 
	var newDisplay = "none"; 
	if(a.value=='true') 
	{
		newDisplay = "block"; 
		advdiv.style.display = "block"; 
		return; 
	} 
	advdiv.style.display = newDisplay; 
}


function showDnsAdv(a) 
   { 
   

//a.value='true'; 
   if(a.value=='false') 
   {

   a.value='true'; 
   document.getElementById("advancedDnsicon").src = '../images/icon_show.gif'; 
   } 
   else 
   { 
           a.value='false'; 
           document.getElementById("advancedDnsicon").src = '../images/icon_hide.gif'; 
   } 
    var advdiv = document.getElementById("advDnsdiv"); 
   // alert('called twice'+advdiv) 
     var newDisplay = "none"; 
     if(a.value=='true') 
     {

                   newDisplay = "block"; 

     advdiv.style.display = "block"; 
                   return; 
     } 
    
     advdiv.style.display = newDisplay; 
     // disableAuthFields(!(a.checked)) 
    
    
    
    
   } 
   
function showSMTPAdv(a)
{
if(a.value=='false')
   {

   a.value='true';
   document.getElementById("advancedSMTPicon").src = '../images/icon_show.gif';
   }
   else
   {
           a.value='false';
           document.getElementById("advancedSMTPicon").src = '../images/icon_hide.gif';
   }
    var advdiv = document.getElementById("advSMTPdiv");
   // alert('called twice'+advdiv)
     var newDisplay = "none";
     if(a.value=='true')
     {

                   newDisplay = "block";

     advdiv.style.display = "block";
                   return;
     }

     advdiv.style.display = newDisplay;
}
function showPortSMTPAdvanced(a)
{
	if(a.value=='false')
        {
                a.value='true';
                document.getElementById("advancedPortSMTPicon").src = '../images/icon_show.gif';
        }
        else
        {
                a.value='false';
                document.getElementById("advancedPortSMTPicon").src = '../images/icon_hide.gif';
        }
        var advdiv = document.getElementById("advPortSMTPdiv");
        var newDisplay = "none";
        if(a.value=='true')
        {
                newDisplay = "block";
                advdiv.style.display = "block";
                return;
        }
        advdiv.style.display = newDisplay;
}
function showPopAdvanced(a)
{
	if(a.value=='false')
        {
                a.value='true';
                document.getElementById("advancedPopicon").src = '../images/icon_show.gif';
        }
        else
        {
                a.value='false';
                document.getElementById("advancedPopicon").src = '../images/icon_hide.gif';
        }
        var advdiv = document.getElementById("advPopdiv");
        var newDisplay = "none";
        if(a.value=='true')
        {
                newDisplay = "block";
                advdiv.style.display = "block";
                return;
        }
        advdiv.style.display = newDisplay;
}
function showPortAdvanced(a)
{
	if(a.value=='false')
	{
		a.value='true';
		document.getElementById("advancedPorticon").src = '../images/icon_show.gif';
	}
	else
	{
		a.value='false';
		document.getElementById("advancedPorticon").src = '../images/icon_hide.gif';
	}
	var advdiv = document.getElementById("advPortdiv");
	var newDisplay = "none";
     	if(a.value=='true')
     	{
        	newDisplay = "block";
     		advdiv.style.display = "block";
                return;
     	}
     	advdiv.style.display = newDisplay;
}
function showPingAdvanced(a)
{
        if(a.value=='false')
        {
                a.value='true';
                document.getElementById("advancedPingicon").src = '../images/icon_show.gif';
        }
        else
        {
                a.value='false';
                document.getElementById("advancedPingicon").src = '../images/icon_hide.gif';
        }
        var advdiv = document.getElementById("advPingdiv");
        var newDisplay = "none";//No I18N
        if(a.value=='true')
        {
                newDisplay = "block";//No I18N
                advdiv.style.display = "block";
                return;
        }
        advdiv.style.display = newDisplay;
}
function showHomePageAdv(a)
{
if(a.value=='false')
   {

   a.value='true';
   document.getElementById("advancedHomePageicon").src = '../images/icon_show.gif';
   }
   else
   {
           a.value='false';
           document.getElementById("advancedHomePageicon").src = '../images/icon_hide.gif';
   }
    var advdiv = document.getElementById("advHomePagediv");
   // alert('called twice'+advdiv)
     var newDisplay = "none";
     if(a.value=='true')
     {

                   newDisplay = "block";

     advdiv.style.display = "block";
                   return;
     }

     advdiv.style.display = newDisplay;
}






function smsDiv(a) 
   { 
   if(a.value=='false') 
   { 
   a.value='true'; 
   document.getElementById("smslist"); 
   } 
   else 
   { 
           a.value='false'; 
           document.getElementById("smslist"); 
   } 
    var showSMSDiv= document.getElementById("showSMSDiv"); 
    var newDisplay = "none"; 
     if(a.value=='true') 
     { 
                   newDisplay = "block"; 
                   showSMSDiv.style.display = "block"; 
                   return; 
     } 
    
     showSMSDiv.style.display = newDisplay; 
    
   } 
    
    
   function showAuth(a) 
   { 
     var newDisplay = "none"; 
     if(a.checked) 
     { 
                   var newDisplay = "block"; 
                   //if (document.all) newDisplay = "block"; //IE4+ specific code 
                     //  else newDisplay = "table-row"; //Netscape and Mozilla 
                     // new Effect.SlideDown("authfields"); 
    
     } 
      var authdiv = document.getElementById("authfields"); 
      authdiv.style.display = newDisplay; 
    // disableAuthFields(!(a.checked)) 
    
    
    
    
    
    
   } 
   function disableAuthFields(frm) 
   { 
   if(!frm.basicauthenabled.checked || (frm.advanced.value=='false')) 
   { 
    frm.userName.value=""; 
       frm.password.value=""; 
       } 
   } 
   function showPost(a) 
   {
       $.hideDiv("getdiv");//No I18N
       $.hideDiv("headdiv");//No I18N
       $.hideDiv("postdiv");//No I18N
       if(a==='P' || a==='U' || a==='A'){$.showDiv("postdiv");}
       else if(a==='G'){$.showDiv("getdiv");}    
       else if(a==='H'){$.showDiv("headdiv");}
   } 
    
   function checkUrlPattern(url) 
   { 
           var myRegExp=/^https{0,1}:\/\/\w/gi; 
           return myRegExp.test(url); 
   } 
   var addemailopen=0; 
   function showAddEMailDiv() 
   { 
           var newDisplay = "none"; 
             if(addemailopen==0) 
             { 
             addemailopen=1; 
                           var newDisplay = "block"; 
                           if (document.all) newDisplay = "block"; //IE4+ specific code 
                               else newDisplay = "table-row"; //Netscape and Mozilla 
             } 
             else 
             { 
             addemailopen=0; 
             } 
           var allspans = document.getElementById("addemailrow"); 
           allspans.style.display = newDisplay; 
    
           var oDiv  =document.getElementById("leftarrow"); 
           var rightdiv  =document.getElementById("rightarrow"); 
           if(addemailopen==1) 
           { 
    
           oDiv.style.display="block" 
           rightdiv.style.display="none" 
           } 
           else 
           { 
           oDiv.style.display="none" 
           rightdiv.style.display="block" 
           } 
   } 
   function addEMail(emailid) 
   { 
   var url = '../home/Notifications.do?popup=true&execute=addEMail&toemail='+document.DataForm.newemail.value; 
           http.open("GET",url,true); 
           http.onreadystatechange = postaddEMail; 
           http.send(null); 
   } 
   function postaddEMail() 
   { 
    if(http.readyState == 4) 
           { 
                   result = http.responseText; 
                   emailtxt = getValue(result,'ax_toemail') 
                   emailid= getValue(result,'ax_useremailid') 
                   var opt = new Option(emailtxt,emailid) 
                   document.DataForm.actions.options[document.DataForm.actions.length] = opt 
                   document.DataForm.newemail.value ='' 
    
           } 
   } 
    
function disablefields(frm,urlid,val,status)
  {
		var fld = getField(frm,'thresholds('+urlid+'-'+val+')');
		if(fld!=undefined)
		{
			fld.disabled=status;
		}
		
		//For Trouble Condition as Down Option
		if(val=="4" || val=="5" || val=="21" || val=="23")
		{
			fld = getField(frm,'thresholds('+urlid+'-'+val+'-alerttype)');
			if(fld!=undefined)
			{
					fld.disabled=status;
			}
		}
		if(val=="4" || val=="5")
		{
			tempFld = getField(frm,'caseSensitivity');//No I18N
			if(tempFld!=undefined)
			{
				try
				{
					var fld1=document.getElementById('notfound'); 
					var fld2=document.getElementById('found');
					if((fld1.checked) || (fld2.checked))
					{
						tempFld.disabled=false;
					}
					else
					{
						tempFld.disabled=true;
						tempFld.checked=false;
					}
				}
				catch(e)
				{}
				
			}
		}
		
}
 
    
   function disableuncheckedfields(frm) 
   { 
           var fields = frm.elements; 
           for(i = 0;i<fields.length;i++) 
           { 
                   if(fields[i].name=='attributes') 
                   { 
                   var status = !fields[i].checked 
                   //alert(fields[i].name+' - value= '+fields[i].value +'  '+status); 
                   val = getStringAfterHyphen(fields[i].value); 
                   //alert(val) 
                   urlid = getStringBeforeHyphen(fields[i].value); 
                   //alert(urlid) 
                   disablefields(frm,urlid,val,status);
                   if(val==9 || val==10|| val==11)
                   {
                   	// spl handling for homepage monitor
                   	kk = parseInt(val)+3;
                   	
                   	disablefields(frm,urlid,kk,status);
                   	
			kk = parseInt(val)+6;
			                   	
                   	disablefields(frm,urlid,kk,status);
                   }
                                       
    
                   } 
           } 
    
    
   } 
   function getField(frm,fieldname) 
   { 
    
   var fields = frm.elements; 
    
   for(k = 0;k<fields.length;k++) 
           { 
    
                   if(fields[k].name==fieldname) 
                   { 
    
                    return fields[k] 
                   } 
           } 
   } 
   function getStringAfterHyphen(a) 
   { 
           indx = a.indexOf('-'); 
           substr =  a.substring(indx+1); 
           return substr; 
   } 
   function getStringBeforeHyphen(a) 
   { 
           indx = a.indexOf('-'); 
           substr =  a.substring(0,indx); 
           return substr; 
   } 
   function fnOpenNewWindow(link) 
   { 
           window.open(link, "new",'scrollbars=no,resizable=yes,width=480,height=220'); 
           return false; 
   } 
    
   /* wil set the focus on the first textfield in the first form*/ 
   function submittestimonial() 
   { 
            window.open( '/login/submittestimonial.jsp',this.target,'scrollbars=no,resizable=no,width=480,height=280'); 
   } 
    
  
    
   function setFocusProperTextField() { 
    
       if(document.forms) { 
    
               var len = document.forms.length; 
               if(len > 0) { 
                   setFocusProperTextFieldFrm(document.forms[0]); 
               } 
       } 
    
   } 
    
    
   function setFocusProperTextFieldFrm(frm) { 
    
    
               for(i=0;i<frm.elements.length;i++) { 
    
                   if(frm.elements[i].type =='text') { 
                           try 
                           { 
                                   frm.elements[i].focus(); 
                                   break; 
                           } 
                           catch (e) {} 
    
                   } 
               } 
    
   } 
    
   function getAnchorTag(aname) { 
    
     if(!document.anchors) { 
           return; 
     } 
     var arr = document.anchors; 
     var len = arr.length; 
    
    
     for(i=0;i<len;i++) { 
           if(arr[i].name = aname) return arr[i]; 
     } 
    
    
   } 
    
   function showAddURLAdvDiv() 
           { 
   var divname = "advdiv"; 
           ig=getObj(divname); 
    
           if(ScrollEffect.lengthcount > ScrollEffect.closelimit ) 
           { 
                   closet(); 
                   return; 
           } 
           ig.style.display="block"; 
           ig.style.height=ScrollEffect.lengthcount+'px'; 
           ScrollEffect.lengthcount=ScrollEffect.lengthcount+10; 
           if(ScrollEffect.lengthcount < ScrollEffect.limit) 
           { 
                   setTimeout(showAddURLAdvDiv(), 100); 
           } 
           else 
           { 
   /* 
                   document.getElementById('reg').style.display="block"; 
                   document.getElementById('agreement').checked=false; 
                   document.getElementById('hide').style.display="none"; 
   */ 
    
                   //getObj('reg').style.display="block"; 
                   //getObj('agreement').checked=false; 
                   //getObj('hide').style.display="none"; 
                   return; 
           } 
   } 
    
    
   /* 
    
   old ajax.js 
   */ 
    
    
   // $Id AJAX related stuff below 
    
   var http = getHTTPObject(); // We create the HTTP Object 
   function getHTTPObject() { 
     var xmlhttp; 
     if (window.ActiveXObject){ 
       try { 
         xmlhttp = new ActiveXObject("Msxml2.XMLHTTP"); 
       } catch (e) { 
         try { 
           xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
         } catch (E) { 
           xmlhttp = false; 
         } 
       } 
   } 
     else if (typeof XMLHttpRequest != 'undefined') { 
       try { 
         xmlhttp = new XMLHttpRequest(); 
       } catch (e) { 
         xmlhttp = false; 
       } 
     } 
     return xmlhttp; 
   } 
    
   function showThresholdDetail(id) 
   { 
           if(id=='Reset') 
           { 
                   document.getElementById("thresholddetail").style.display='none'; 
                   return; 
           } 
           var url = '/jsp/ThresholdProfile.jsp?thresholdid='+id; 
           http.open("GET",url,true); 
           http.onreadystatechange = handleThresholdDetail; 
           http.send(null); 
   } 
    
   function handleThresholdDetail() 
   { 
           if(http.readyState == 4) 
           { 
                   result = http.responseText; 
                   document.getElementById("thresholddetail").innerHTML = result; 
                   document.getElementById("thresholddetail").style.display='block'; 
           } 
   } 
  

 function getValue(content,key) 
 {
	 indx = content.indexOf("#") 
     if(indx!=-1) 
     { 
	     line = content.substring(indx+1); 
	     lst = line.split('&'); 
	     for(i=0;i<lst.length;i++) 
	     { 
			   var equalindex = lst[i].indexOf('=');
	       keyvalue = lst[i].split('=');
	       var firstVal=keyvalue[0];
	       if(firstVal.indexOf("ax_")!=-1)
	       {
	      	 if(firstVal.search('amp;')!=-1)
	           {
	      		 firstVal=firstVal.slice(4,firstVal.length);
	           }
	           if(firstVal==key)
	           { 
	                     return lst[i].substring(equalindex+1); 
	           } 
	       } 
	     }
     } 
 } 
   function showRowDiv(id)
   {
	
	  $.showDiv(id);
      //  var disp = "table-row";
       /* if(document.all)
        {
                disp = "block";
        }
        document.getElementById(id).style.display="block";*/
   }

   function showDivInline(id)
   {
        document.getElementById(id).style.display='inline';
   }
 
   function showDiv(id) 
   {
	   // $.showDiv(id); 
	   if(document.getElementById(id) != null)
	   {
		   document.getElementById(id).style.display='block';
	   }
   } 
    
   function hideDiv(id) 
   {
	   //$.hideDiv(id);
	   if(document.getElementById(id) != null)
	   {
		   document.getElementById(id).style.display='none';
	   }
   } 
    
   function hideImage(imagename) 
   { 
    
           document.getElementById(imagename).height=1; 
           document.getElementById(imagename).width=1; 
   } 
    
   function showImage(imagename) 
   { 
    
           document.getElementById(imagename).height=5; 
           document.getElementById(imagename).width=5; 
   } 
 
 
 function tellfriend() 
   { 
          window.open( '../website/tellFriend.jsp',this.target,'scrollbars=no,resizable=no,width=700,height=550'); 
   } 
    

function deleteSeqDowntime(downtime,urlseqid)
   {
   if(confirm(beanmsg["del_downtime"]))
   {

location.href = "../home/ShowUrlSeqDetails.do?execute=deleteSeqDowntime&urlseqid="+urlseqid+"&downtime="+downtime
   }
   }
  function fnsetsmssupportconditions(frm)
{

getHtml('../home/Notifications.do?execute=setSmsSupportConditions&upSmsSupported='+frm.upSmsSupported.checked+'&troubleSmsSupported='+frm.troubleSmsSupported.checked,"fnPostsetUp")

}
var hidefadecounter=1;
var fadecounter=0; 
function fnPostsetUp(result)
{
var ele = document.getElementById("result1") ;
ele.style.display="block";
startHideFade("smsstatus",0.005);
}
var hidefadecounter=1;
var hidefadeele;
function startHideFade(ele,fadespeed)
{
   hidefadecounter = 1;
   hidefadeele = document.getElementById(ele);
   hidefadeele.style.display="block";
       hidefadeele.style.opacity=1;
       hidefadeele.style.filter="alpha(opacity="+parseInt(100)+")";

 startHideFadeTimer(fadespeed);
} 
function startHideFadeTimer(fadespeed) {
       hidefadecounter=hidefadecounter-fadespeed;
       if(hidefadecounter<0){
               hidefadecounter = 0;
       }
       hidefadeele.style.opacity=hidefadecounter;
       hidefadeele.style.filter="alpha(opacity="+parseInt(100*hidefadecounter)+")";
       if (hidefadecounter>0){
               setTimeout("startHideFadeTimer("+fadespeed+")",20);
       }
   else
   {
       hidefadeele.style.display = "none";
   }
} 




 
   
/*function buySMSPack() 
   { 
           var win1 = window.open( '/home/accountinfo.do?method=showBuySMSForm', '','scrollbars=yes,resizable=no,width=575,height=420,left=150,top=100'); 
   }*/
function verifyNewClient()
{
	var url=window.location.href;
   	var param=null;
	var loc=url.indexOf("nc=");
	if(loc!=-1)
		{
		param=url.substring(loc,url.length);
		}
	return param;
}
function checkCardDetails(frm,alreadycarduser,action) 
{
	var paymentoption = $('[name=paymentoption]:checked').val();
    if(paymentoption===undefined)
    {
            /*
             * For ModifyCardDetails Page, the value is set as a hidden variable.
             * In other places, it is got by radio button.
             */
            paymentoption = frm.paymentoption.value;
    }
	if(alreadycarduser==undefined)
	{
		alreadycarduser = "0";
	}
	if(frm.cnumber.value!==undefined && isNaN(frm.cnumber.value)) 
    { 
       	 frm.cnumber.value='';
    }
	if(frm.cvvnumber.value!==undefined && (isNaN(frm.cvvnumber.value) || frm.cvvnumber.value.length>4)) 
    { 
       	frm.cvvnumber.value=''; 
    } 
	if(paymentoption=="1" && alreadycarduser=="0")
	{
		/*
		 * While update Card only the action will come as "updatecard", 
		 * in the remaining case it will come as undefined
		 */
		if(action==undefined)
		{
			if(frm.companyname.value=="")
                	{
                        	alert(ccmsg["companyname_empty"]);
                        	frm.companyname.select();
                        	return;
			}
			if(frm.phone.value=="")
			{
				alert(ccmsg["phoneno_empty"]);
				frm.phone.select();
				return;
			}
			if(checkInternationalPhone(frm.phone.value)==false)
			{
				alert(ccmsg["phoneno_invalid"]);
				frm.phone.select();
				return;
			}
		}
		if(frm.streetaddress.value=="")
		{
			alert(ccmsg["st_addr"]);
			frm.streetaddress.select();
			return;
		}
		if(frm.zipcode.value=="")
		{
			alert(ccmsg["zipcode_empty"]);
			frm.zipcode.select();
			return;
		}
		if(frm.country.value=="select")
		{
			alert(ccmsg["country_empty"]);
			frm.country.focus();
			return;
		}
                if(frm.cnumber.value=="") 
                { 
                	alert(ccmsg["ccn_empty"]);
                        frm.cnumber.select(); 
                        return; 
                } 
                if(isNaN(frm.cnumber.value)) 
          	{ 
         		alert(ccmsg["invalid_ccn"]);
             		return; 
          	} 
        	if(frm.cvvnumber.value=="") 
                { 
                	alert(ccmsg["cvv_empty"]);
                        frm.cvvnumber.select(); 
                        return; 
                } 
         	if(isNaN(frm.cvvnumber.value) ) 
         	{ 
         		alert(ccmsg["invalid_cvv"]);
         		frm.cvvnumber.select(); 
         		return; 
         	}
	}
	else if(paymentoption=="3")
	{
		if(frm.streetaddress.value=="")
		{
			alert(ccmsg["st_addr"]);
			frm.streetaddress.select();
			return;
		}
		if(frm.zipcode.value=="")
		{
			alert(ccmsg["zipcode_empty"]);
			frm.zipcode.select();
			return;
		}
		if(frm.country.value=="select")
		{
			alert(ccmsg["country_empty"]);
			frm.country.focus();
			return;
		}
		if(frm.phone.value=="")
                {
			alert(ccmsg["phoneno_empty"]);
                        frm.phone.select();
                        return;
                }
                if(isNaN(frm.phone.value))
                {
			alert(ccmsg["phoneno_invalid"]);
                        frm.phone.select();
                        return;
                }
		if(frm.companyname.value=="")
                {
			alert(ccmsg["companyname_empty"]);
                        frm.companyname.select();
                        return;
                }
	}
	if(alreadycarduser=="0")
	{ 
        	if(!frm.Iagree.checked) 
        	{ 
        		alert(ccmsg["agree_terms"]);
         		return; 
		}
	}
	if(frm.fromscreen!=undefined)//Only For AddCredits
	{
		showDiv('loading');
		getHtmlForForm(frm,"postShowAddCreditsForm");		
	}
	else
	{
		if(paymentoption=="2")
    	{
			frm.method.value="PaypalUpgrade";
    	}
    	else if(paymentoption=="3")
    	{
    		frm.method.value="PurcahseOrderUpgrade";
    	}
		var param=verifyNewClient();
		if(param!=null&&frm.nc==undefined)
		{
			frm.appendChild(getnewFormElement("hidden","nc","billing"));//No I18N
		}
		if(frm.fromAjax==undefined)
		{
			frm.appendChild(getnewFormElement("hidden","fromAjax","true"));//No I18N
		}
		$('body, html, #loading').scrollTop(0);
		$.showDiv('loading');//No I18N
		$.hideDiv('messagediv');//No I18N
		var response=$.getPostAjaxResponse(frm.action,'paymentform');//No I18N
		var statusmsg = getValue(response,'ax_errormsg');//No I18N
		var redirectUrl = getValue(response,'ax_redirectUrl');//No I18N
		if(frm.method.value=='PaypalUpgrade'&&redirectUrl==undefined&&statusmsg==undefined)
		{
			$.hideDiv('loading');//No I18N
			$("#userarea").html(response);//No I18N
		}
		if(redirectUrl!=undefined)
		{
			location.href=redirectUrl;
		}
		if(statusmsg!=undefined&&statusmsg!='')
		{
			$("#errordiv").html(statusmsg);
			$.hideDiv('loading');//No I18N
			$.showDiv('messagediv');//No I18N
		}
	}
}	 
    function cancelcard(id,price_type)
    {
    	if(id==0)
    	{
    		window.close();
    	}
    	else
    	{
    		location.href= '/home/accountinfo.do?method=showupgradescreen&id='+id+'&price='+price_type;
    	}
    }

   function cleartext(form)
{
form.value='';



}



function showLoading(element)
{
var msg = document.getElementById(element);
msg.innerHTML ='<img src="../images/zoho-busy.gif" alt="Icon" >';
showDiv(element);

}

function postLoading(element,divelement,result)
{
if(result=='')
{
hideDiv(element);
var msg = document.getElementById(divelement);

msg.innerHTML='<span style="font-weight: bold; color: red; font-size: 11px; display: block;">'+firebugmsg["valid_domain"]+'</span>';
startHideFade(divelement,0.005);
}
else
{
var msg = document.getElementById(element);
msg.innerHTML =result;
showDiv(element);

}

}

function fntest(type){
	location.href=type;
}

function emailsendfrompublicpage(urlfrompublicpage,mon_type)
{
  var link=location.href;
  var checkurl=urlfrompublicpage;
	$.toolsEmailSend(checkurl,link,mon_type);
}

function tweetThisfrompublicpage(url,mon_type)
{
 var link=location.href;
 var form = document.createElement("form");
 form.setAttribute("method", "post");
 form.setAttribute("action", "/tools/action.do?");
 form.appendChild(getnewFormElement("hidden","execute","getTweetTitleforPublicpage"));//No I18N
 form.appendChild(getnewFormElement("hidden","monitortype",mon_type));//No I18N
 form.appendChild(getnewFormElement("hidden","domainname",url));//No I18N
 document.body.appendChild(form);
 getHtmlForForm(form,"tweetPublicpage",link);  //No I18N
}

function shareThisfrompublicpage()
{
	var link=location.href;
	var open_link = window.open('','_blank');
	open_link.location=http_var+"://facebook.com/sharer.php?u="+encodeURIComponent(link);
}

function emailsend(frm,mon_type)
{
   if(document.getElementById('permalink').value!='')
   {
    var url = document.getElementById('url').value;
    var link = document.getElementById('permalink').value;
    $.toolsEmailSend(url,link,mon_type);
   }
              
}


/*function gettinyurl(bigurl)
{
	$("#tinyurl").html(bigurl);
    	$.getJSON(http_var+"://json-tinyurl.appspot.com/?url="+bigurl+"&callback=?",
      		function(data)
		{
			$("#tinyurl").html(data.tinyurl);
		});    
}*/


function savetest(result,frm)
{

   var linkurltest = getValue(result,'ax_linkurltest');
   document.getElementById('permalink').value=linkurltest;
   //document.getElementById('tinyurl').value=linkurltest;
   //gettinyurl(linkurltest);   
     
             
 }

function tweetThis(frm,mon_type)
{
   if(document.getElementById('permalink').value!='')
   {
      var link = document.getElementById('permalink').value;
      var url = document.getElementById('url').value;
   }
   var form = document.createElement("form");
   form.setAttribute("method", "post");
   form.setAttribute("action", "/tools/action.do?");
   form.appendChild(getnewFormElement("hidden","execute","getTweetTitleforPublicpage"));//No I18N
   form.appendChild(getnewFormElement("hidden","monitortype",mon_type));//No I18N
   form.appendChild(getnewFormElement("hidden","domainname",url));//No I18N
   document.body.appendChild(form);
   getHtmlForForm(form,"tweetPublicpage",link);  //No I18N
}
function tweetPublicpage(result,link)
{
	var tweet_title = getUrlValue(result,'axUrl_tweettitle');//No I18N
	var open_link = window.open('','_blank');
        open_link.location=http_var+"://twitter.com/intent/tweet?original_referer=www.site24x7.com&text="+tweet_title+" with site24x7&url="+encodeURIComponent(link);
}

function shareThis()
{ 
  if(document.getElementById('permalink').value!='')
   {
     var url = document.getElementById('permalink').value;
     var open_link = window.open('','_blank');
     open_link.location=http_var+"://facebook.com/sharer.php?u="+encodeURIComponent(url);
     
   }
}
function Selectalltext(id)
{
    document.getElementById(id).focus();
    document.getElementById(id).select();
}

function getEllipsisurl(url)
{
 return url.substr(0,70)+'...';
}

function selectAllchkBox(obj,locations){
	var key=obj.value;
        var a=document.getElementsByName(locations);
	for (var i =0; i < a.length; i++) 
	{
	var sid=new String(a[i].id);
	var skey=new String(key);
	 if(sid.match(skey)){
		 if(document.getElementById(key).checked){
			 if(!a[i].disabled){
				 a[i].checked=true; 
			 }
			 
		 }
		 if(!document.getElementById(key).checked){
			 a[i].checked=false;
		 }
	}
	if(locations == 'probes'){
		$.enableprobedownstatus(null);
	}
	}

}
/* This method will be called only from jsp/locations.jsp */
function selectAllwithBalanceCheck(obj,locations)
{
	var monitorType = $("#monitorTypeInLocationsJsp").html();
	selectAllchkBox(obj,locations);
	getValuesForBalanceCheck(obj.form,monitorType);
}
/* This method will be called only from jsp/locations.jsp */
function checkBalanceForLocations(frm)
{
	var monitorType = $("#monitorTypeInLocationsJsp").html();
	getValuesForBalanceCheck(frm,monitorType);
}
function changePrimaryLocInRespTheshold(locId, urlId) 
{
	try
	{	
		var table = document.getElementById('responseThreshold');

		var row = row = table.rows[0];
		
		primaryVal = findRowInRespTheshold(locId);
		
		var cell2 = row.cells[1];
		
		if(primaryVal!=null && primaryVal!="")
		{
			cell2.innerHTML=primaryVal;
			deleteRowInRespTheshold(locId);
		}
		else
		{
			var locname = locationNames[locId];
			if(locname===undefined)
			{
				var el = 'probes'+locId;//No I18N
				locname=document.getElementById(el).nextSibling.innerHTML;//No I18N
			}
			var mesg = beanmsg['url.newmonitor.advanced.responsetime.from'].replace("{0}", locname);
			cell2.innerHTML =  "<input name='attributes' value='"+urlId+"-3-0' onclick='javascript:disableuncheckedfields(this.form)' type='checkbox'> "+mesg+" <input name='thresholds("+urlId+"-3-0)' size='3' value='' class='formtext' type='text'> (ms)";  //NO I18N
		}
		checkSelectedLocInRespThreshold();
	}
	catch(e)
	{
		//alert(e);
	}
}

function checkSecondaryLocInRespTheshold(locId, urlId, frm) 
{
	try
	{
		if((locId==null || locId=="") && frm!=null && frm!="")
		{
			if(frm.secondaryLocations!=undefined)
			{
				var list = frm.secondaryLocations.length;
				for(var i=0;i<list;i++)
				{
					locId=frm.secondaryLocations[i].value;
					locVal = findRowInRespTheshold(locId);
					if(frm.secondaryLocations[i].checked  && (locVal==null || locVal==""))
					{
						addRowInRespTheshold(urlId, locId);
					}
					else if(!frm.secondaryLocations[i].checked && locVal!=null && locVal!="")
					{
						deleteRowInRespTheshold(locId);
					}
				}
			}
			checkSelectedLocInRespThreshold();
			checkProbeLocInRespTheshold(locId, urlId, frm);
			return;
		}
		
			checkProbeLocInRespTheshold(locId, urlId, frm);

		var checkBoxId = document.getElementById("checkboxId"+locId).value;
		var elee = '#'+checkBoxId;
		if(elee.indexOf("probes")===-1)
		{
			locVal = findRowInRespTheshold(locId);
			if(document.getElementById(checkBoxId).checked && (locVal==null || locVal==""))
			{
				addRowInRespTheshold(urlId, locId, $(elee).next().attr('innerHTML'));
			}
			else if(locVal!=null && locVal!="")
			{
				deleteRowInRespTheshold(locId);
			}
			checkSelectedLocInRespThreshold();
		}
	}
	catch(e)
	{
		//alert(e);
	}
}

function checkProbeLocInRespTheshold(locId, urlId, frm) 
{
	try
	{
		
		if( frm!=null && frm!="")
		{
			if(frm.probes!=undefined)
			{
				var list = frm.probes.length;
				for(var i=0;i<list;i++)
				{
					locId=frm.probes[i].value;
					if(locId!="probes")
					{
						var checkBoxId = document.getElementById("checkboxId"+locId).value;
						var elee = '#'+checkBoxId;
						var el = 'probes'+locId;//No I18N
						locname=document.getElementById(el).nextSibling.innerHTML;//No I18N
						locVal = findRowInRespTheshold(locId);
						if(frm.probes[i].checked  && (locVal==null || locVal==""))
						{
							addRowInRespTheshold(urlId, locId,locname);
						}
						else if(!frm.probes[i].checked && locVal!=null && locVal!="")
						{
							deleteRowInRespTheshold(locId);
						}
					}
				}
			}
			checkSelectedLocInRespThreshold();
			return;
		}
	}
	catch(e)
	{
		alert(e);
	}
}

function findRowInRespTheshold(locId) 
{
	try 
	{
		var table = document.getElementById('responseThreshold');
		var rowCount = table.rows.length;

		for(var i=0; i<rowCount; i++) 
		{
			var row = table.rows[i];
			var tblLocId = row.cells[0].innerHTML.trim();
			if(null != tblLocId && tblLocId == locId) 
			{
				return row.cells[1].innerHTML
			}
		}
		
		return null;
	}
	catch(e) 
	{
		//alert(e);
	}
}

function addRowInRespTheshold(urlId, locId, probename) 
{
	try
	{	
		var table = document.getElementById('responseThreshold');

		var rowCount = table.rows.length;
		var row = table.insertRow(rowCount);

		var cell1 = row.insertCell(0);
		cell1.style.display="none";
		cell1.innerHTML = locId;

		var cell2 = row.insertCell(1);
		cell2.setAttribute("class","bodytext")
		var locname = locationNames[locId];
		if(locname == undefined){
			locname = probename;
		}
		var mesg = beanmsg['url.newmonitor.advanced.responsetime.from'].replace("{0}", locname);
		cell2.innerHTML =  "<span class='bodytext'><input name='attributes' value='"+urlId+"-3-"+locId+"' onclick='javascript:disableuncheckedfields(this.form)' type='checkbox'> "+mesg+" <input name='thresholds("+urlId+"-3-"+locId+")' size='3' value='' class='formtext' type='text'> (ms)</span>";  //NO I18N
		checkSelectedLocInRespThreshold();
	}
	catch(e)
	{
		//alert(e);
	}
}

function deleteRowInRespTheshold(locId) 
{
	try 
	{
		var table = document.getElementById('responseThreshold');
		var rowCount = table.rows.length;

		for(var i=0; i<rowCount; i++) 
		{
			var row = table.rows[i];
			var tblLocId = row.cells[0].innerHTML.trim();
			if(null != tblLocId && tblLocId == locId) 
			{
				table.deleteRow(i);
				rowCount--;
				i--;
				checkSelectedLocInRespThreshold();
				return;
			}
		}
		checkSelectedLocInRespThreshold();
	}
	catch(e) 
	{
		//alert(e);
	}
}

function checkSelectedLocInRespThreshold()
{
	if($('#responseThreshold').length>0)
	{
		var table = document.getElementById('responseThreshold');
		var rowCount = table.rows.length;
		if(rowCount==0)
		{
			document.getElementById('noLocMesg').style.display='block';
		}
		else
		{
			document.getElementById('noLocMesg').style.display='none';
		}
	}
}

function is_valid_url(url)
{
     return url.match(/^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/);
}

function addDelimite(val)
{	
	var time=trim(val);
	var length=time.length;
	//alert(time);
	while(length>2)
	{
		if(length==3)
		{
			break;
		}
		else
		{
			length=length-3;
			time=time.substring(0,length)+","+time.substring(length);
		}
		
	}
	return time;
	
}

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function showtooltips(element,result,ev)
{
		var temp=null;
		var isPointerReq=true;
		var black="black";
		
		ddrivetip(element,ev,result,isPointerReq,true,black);
}


function postaccesskeyword(result,frm){
	var keywordstatus=getValue(result,'ax_incorrectKey');
	if(keywordstatus!=null){
		alert(beanmsg["invalid_accessKey"]);
		document.getElementById('secureWord').select();
	}
	else{
		document.getElementById('urlVal').style.display="none";
		var hostname = document.getElementById('urlLink').value;
		var index = hostname.indexOf("http");
		if(index!=0)
		{
			hostname = http_var+"://"+hostname;
			document.getElementById('urlLink').value=hostname;
		}
		document.getElementById('url1').innerHTML=":  "+hostname;
		document.getElementById('url1').style.display='';
		document.getElementById('url').value=hostname;
		document.getElementById('newtest').style.display='';
		document.getElementById('webpageinfo').style.display='none';
		document.getElementById('footertr').style.display='none';
		document.getElementById('location').style.display='none';
		//var msg = document.getElementById('links1');
		//msg.innerHTML='<img src="/images/zoho-busy.gif">'
		//showDiv('links1');
		hideDiv('webpagesummary');
		//frm.execute.value='scheduleFireBug';
		$('#loadingdiv').show();//No I18N
		frm.execute.value='doWebPageAnalyze';
		var ajaxResp = $.getAjaxResponse("POST",frm.action,$(frm).serialize());//No I18N
		$('#firebugResult').html(ajaxResp);//No I18N
		$('#loadingdiv').hide();//No I18N
		//alert(ajaxResp);
		//importxmlForForm(frm,"postFireBugDetails",frm);
		document.getElementById('savefirebug').style.display = 'block';
	}
}

function firebugdet(result)
{
	document.getElementById('permalink').value = getUrlValue(result,'axUrl_permalink');//No I18N
}

function postFireBugDetails(result,firebugid)
{
if(firebugid==null || isNaN(firebugid))
{
var list = result.firstChild.childNodes;
userstatus=list.item(0).getAttribute('userstatus');
if(userstatus=='blocked')
{
ele=document.getElementById('links1');
ele.innerHTML=beanmsg["url_blocked"];
ele.style.color = "red"; 
showDiv('links1');
return;
}
 firebugid=list.item(0).getAttribute('firebugid');
}
setTimeout('delayedResponse(\''+firebugid+'\')',1500);
}


function delayedResponse(firebugid)
{
importxml('/tools/action.do?execute=getFireBugLinks&firebugid='+firebugid,"postFireBugLinkDetails"); //No i18N
}



function postFireBugLinkDetails(result)
{

var list = result.firstChild.childNodes

var requeststatus=list.item(0).getAttribute('status');
var url=list.item(0).getAttribute('url');
var firebugid=list.item(0).getAttribute('firebugid');
if(requeststatus=='unavailable')
{
var ele=document.getElementById('links1');
ele.innerHTML='';
newel2=document.createElement("DIV");
newtext1=document.createTextNode(beanmsg["valid_website"]);
  newel2.appendChild(newtext1);
newel2.setAttribute("class","errormessage");
ele.appendChild(newel2);

return;
}
if(requeststatus=='notagsfound')
{
var ele=document.getElementById('links1');
ele.innerHTML='';
newel2=document.createElement("DIV");
newtext1=document.createTextNode("No tags found for "+url);
  newel2.appendChild(newtext1);
newel2.setAttribute("class","errormessage");
ele.appendChild(newel2);


return;
}

if(requeststatus=='yetToStart')
{

postFireBugDetails(msg,firebugid);
        
}
if(requeststatus!='yetToStart')
{
var msg = document.getElementById('links1');
msg.innerHTML='';


var msg = document.getElementById('links1');
var br=document.createElement("br");
br.setAttribute('clear','All');
msg.appendChild(br);

table=document.createElement("table");
table.setAttribute("width","100%");
table.setAttribute("class","logintableborder");
table.setAttribute("border","0");
table.setAttribute("cellspacing","0");
table.setAttribute("cellpadding","0");
msg.appendChild(table);

tr=document.createElement("tr");
table.appendChild(tr);

td=document.createElement("td");
td.setAttribute("width","50%");
tr.appendChild(td);

var body1=document.createElement("body");
body1.setAttribute("ms_positioning","GridLayout");
td.appendChild(body1);
 
 
newela=document.createElement("DIV");
newela.setAttribute("language","javascript");
newela.setAttribute("class","topline");
 body1.appendChild(newela);
 
 
 
var enddetails1=document.createElement("DIV");
textnode=document.createTextNode(firebugmsg["wpa_file"]);
enddetails1.appendChild(textnode);
enddetails1.setAttribute("class","top url");
 
 
newela.appendChild(enddetails1);
 
 
 
newelb=document.createElement("DIV");
 
textnode=document.createTextNode(firebugmsg["domain"]);
 
 newelb.appendChild(textnode);
newelb.setAttribute("class","top domainname");
 newela.appendChild(newelb);
 
 
 
newelc=document.createElement("DIV");
newtextc=document.createTextNode(firebugmsg["wpa_size"]);
 newelc.appendChild(newtextc);
newelc.setAttribute("class","top size");
 
 newela.appendChild(newelc);
newelc=document.createElement("DIV");
newtextc=document.createTextNode('');
 newelc.appendChild(newtextc);
newelc.setAttribute("class","top size");
newelc.setAttribute("style","width:40px");
 
 
 newela.appendChild(newelc);
 
 
neweld=document.createElement("DIV");
neweld.setAttribute("class","time");
 
 newela.appendChild(neweld);
 
newele=document.createElement("DIV");
var textnodee=document.createTextNode(firebugmsg["download_time"]);
newele.appendChild(textnodee);
newele.setAttribute("style","width:150px");
newele.setAttribute("align","center");
 
 
 
 neweld.appendChild(newele);


for(i=0;i<list.length;i++)
        {

if(i==0)
{
continue;
}


appendChild(td,list.item(i).getAttribute('link'),list.item(i).getAttribute('linkstatus'),list.item(i).getAttribute('availability'),list.item(i).getAttribute('title'),list.item(i).getAttribute('domain'),list.item(i).getAttribute('size'),list.item(i).getAttribute('starttime'),list.item(i).getAttribute('loadtime'),list.item(i).getAttribute('loadtimevalue'));


var imgcount=document.getElementById("totalsize");
imgcount.innerHTML=list.item(0).getAttribute('totalsize');
var imgcount=document.getElementById("totaltime");
imgcount.innerHTML=list.item(0).getAttribute('totaltime')+" "+firebugmsg["secs"];
var imgcount=document.getElementById("totalobjects");
imgcount.innerHTML=list.item(0).getAttribute('totalrequests');

var imgcount=document.getElementById("imagecount");
imgcount.innerHTML=list.item(0).getAttribute('imagescount')+" ("+list.item(0).getAttribute('imagesSize')+" "+firebugmsg["kb"]+")";
var scriptcount=document.getElementById("scriptcount");
scriptcount.innerHTML=list.item(0).getAttribute('scriptscount')+" ("+list.item(0).getAttribute('scriptsSize')+" "+firebugmsg["kb"]+")";
var csscount=document.getElementById("csscount");
csscount.innerHTML=list.item(0).getAttribute('csscount')+" ("+list.item(0).getAttribute('cssSize')+" "+firebugmsg["kb"]+")";


showDiv('links1');
showDiv('webpagesummary');


if((i+1)==list.length)
{
if(requeststatus=='inProgress')
{
postFireBugDetails(msg,firebugid);

var br=document.createElement("br");
br.setAttribute('clear','All');
td.appendChild(br);
newimg=document.createElement("img");
newimg.setAttribute("src","../images/zoho-busy.gif");
td.appendChild(newimg);
}

}
}

var body1=document.createElement("body");
body1.setAttribute("ms_positioning","GridLayout");
td.appendChild(body1);


newela=document.createElement("DIV");
newela.setAttribute("language","javascript");
newela.setAttribute("class","bottomline");
  body1.appendChild(newela);



var enddetails1=document.createElement("DIV");
var requestmsg=" "+firebugmsg["requests"];
textnode=document.createTextNode(list.item(0).getAttribute('totalrequests')+requestmsg);
enddetails1.appendChild(textnode);
enddetails1.setAttribute("class","bottom url");


newela.appendChild(enddetails1);



newelb=document.createElement("DIV");
var resultb=document.createElement("span");
resultb.innerHTML = '&nbsp;';

  newelb.appendChild(resultb);
newelb.setAttribute("class","bottom domainname");
  newela.appendChild(newelb);



newelc=document.createElement("DIV");
newtextc=document.createTextNode(list.item(0).getAttribute('totalsize'));
  newelc.appendChild(newtextc);
newelc.setAttribute("class","bottom size");

  newela.appendChild(newelc);


neweld=document.createElement("DIV");
neweld.setAttribute("class","time");

  newela.appendChild(neweld);

newele=document.createElement("DIV");
var unitsecs=" "+firebugmsg["secs"];
var textnodee=document.createTextNode(list.item(0).getAttribute('totaltime')+unitsecs);
newele.appendChild(textnodee);
newele.setAttribute("class","bottom size ");
newele.setAttribute("style","width:100px");

  neweld.appendChild(newele);




showDiv('links1');

var msg1=document.getElementById('links1');
msg1.innerHTML=msg.innerHTML;
msg1.style.display="block";



}
              }



function appendChild(msg,link,linkstatus,availability,title,domain,size,starttime,loadtime,loadtimevalue)
{

if(linkstatus!='null');
{
}
var body=document.createElement("body");
body.setAttribute("ms_positioning","GridLayout");
msg.appendChild(body);
newel=document.createElement("DIV");
newel.setAttribute("language","javascript");
newel.setAttribute("class","row");
  body.appendChild(newel);




newel2=document.createElement("DIV");

newelhref=document.createElement("a");
newelhref.setAttribute("href",title);
newelhref.setAttribute("class",'showlink');
newelhref.setAttribute("target",'_blank');

newtext1=document.createTextNode(link);

newelhref.appendChild(newtext1);
newel2.setAttribute("language","javascript");

newel2.setAttribute("class","url");
if(availability!='true')
{
newelhref.setAttribute("class",'unavailable showlink');
newel2.setAttribute("class","unavailable url");
}

newel2.setAttribute("title",title);
newel2.appendChild(newelhref); 
 newel.appendChild(newel2);


newel3=document.createElement("DIV");
newtext2=document.createTextNode(domain);
  newel3.appendChild(newtext2);

newel3.setAttribute("class","domainname");
newel3.setAttribute("title",domain);
if(availability!='true')
{
newel3.setAttribute("class","unavailable domainname");
}
  newel.appendChild(newel3);


newel4=document.createElement("DIV");
newtext3=document.createTextNode(size);
  newel4.appendChild(newtext3);

newel4.setAttribute("class","size");
if(availability!='true')
{

newel4.setAttribute("class","unavailable size");
}
newel.appendChild(newel4);


newel4=document.createElement("DIV");
newtext3=document.createTextNode("");
  newel4.appendChild(newtext3);

newel4.setAttribute("class","size");
newel4.setAttribute("style","width:40px");

newel.appendChild(newel4);






newel5=document.createElement("DIV");
newel5.setAttribute("class","time");
  newel.appendChild(newel5);

newel6=document.createElement("DIV");

var result=document.createElement("span");
result.innerHTML="&nbsp;";
newel6.appendChild(result);
newel6.setAttribute("class","starttime");

newel6.style.width=starttime+"px";

  newel5.appendChild(newel6);



newel7=document.createElement("DIV");
var result2=document.createElement("span");
result2.innerHTML="&nbsp;";
newel7.appendChild(result2);
newel7.setAttribute("class","loadtime");
var index=loadtime.indexOf("-")

if(index==0)
{
loadtime="0";
}
newel7.style.width=loadtime+"px";

  newel5.appendChild(newel7);

newel8=document.createElement("DIV");

newel8.setAttribute("align","center");
newel8.setAttribute("class","endtime");


newsub=document.createElement("DIV");
newtext5=document.createTextNode(loadtimevalue+"ms");
newsub.appendChild(newtext5);
newsub.setAttribute("style","width:10px");
newsub.setAttribute("align","left");
newel8.appendChild(newsub);

  newel5.appendChild(newel8);
newsub1=document.createElement("DIV");

var result2=document.createElement("span");
result2.innerHTML = "&nbsp;";
newsub1.appendChild(result2);


newel8.appendChild(newsub1);

  newel5.appendChild(newel8);


}

function findsmtphost()
{
window.open( '/jsp/findsmtphost.jsp',this.target,'scrollbars=yes,resizable=no,width=520,height=450');
hideDiv('loading');
}
function finddnshost()
{
window.open( '/jsp/finddnshost.jsp',this.target,'scrollbars=yes,resizable=no,width=520,height=450');
hideDiv('loading');
}

function showAvailabilityReport(period,starttime,endtime)
{
var id=document.getElementById('reportform');
var groupid = 0;
if(id!=undefined)
{
var monitorgrp = document.getElementById('monitorgroups');
if(monitorgrp!=null)
{
groupid = id.reportGroupId.value;
}
}
var d  = new Date();
var msg = document.getElementById('availability_history');
msg.innerHTML ='<img src="../images/zoho-busy.gif" alt="Icon" >';
	getHtml('/home/reportsinfo.do?execute=availabilityReport&predefinedperiod='+period+'&d='+d+"&startdate="+starttime+"&enddate="+endtime+"&monitorgroupid="+groupid,"postShowAvailabilityReport");
	showDiv('availability_history');
}
function postShowAvailabilityReport(result)
{
	document.getElementById('availability_history').innerHTML=result		
}
function fnUpload(frm)
{
var filename = frm.theFile.value;
if(filename=='')
{
alert(beanmsg["input_filename"]);
frm.theFile.select();
return;
}
if(frm.addMode.checked)
	{
			if(document.getElementById('secureWord').value.trim()=='')
			{
				alert(beanmsg["empty_accessKey"]);
				document.getElementById('secureWord').focus();
				return;
			}
			else if(isNaN(document.getElementById('secureWord').value.trim()))
{
				alert(beanmsg["invalid_accessKey"]);
				document.getElementById('secureWord').focus();
return;
}
			document.getElementById('secureWord').value=document.getElementById('secureWord').value.trim();
	}
if(frm.addMode.checked)
{
document.getElementById('actionMode').value="Add";//No I18N
}
else if(frm.editMode.checked)
{
document.getElementById('actionMode').value="Edit";//No I18N
}
var valid_extensions = /(.txt)$/
var filename = frm.theFile.value;
var file_result = filename.toLocaleLowerCase();
if(!(valid_extensions.test(file_result)))
{
	alert(beanmsg["input_filenamemsg"]);
	frm.theFile.select();
	return;
}
document.getElementById('errorStatusDiv').style.display="none";
var iframe = document.createElement("iframe");
    iframe.setAttribute("id", "upload_iframe");
    iframe.setAttribute("name", "upload_iframe");
    iframe.setAttribute("width", "0");
    iframe.setAttribute("height", "0");
    iframe.setAttribute("border", "0");
    iframe.setAttribute("style", "width: 0; height: 0; border: none;");
 
    // Add to document...
    frm.parentNode.appendChild(iframe);
    window.frames['upload_iframe'].name = "upload_iframe";
 
    iframeId = document.getElementById("upload_iframe");
 
    // Add event...
    var eventHandler = function () {
 
            if (iframeId.detachEvent) iframeId.detachEvent("onload", eventHandler);
            else iframeId.removeEventListener("load", eventHandler, false);
 
            // Message from server...
            if (iframeId.contentDocument) {
                content = iframeId.contentDocument.body.innerHTML;
            } else if (iframeId.contentWindow) {
                content = iframeId.contentWindow.document.body.innerHTML;
            } else if (iframeId.document) {
                content = iframeId.document.body.innerHTML;
            }
		var keywordstatus=getValue(content,'ax_incorrectKey');  //No I18N
		if(keywordstatus!=null)
		{
			alert(beanmsg["invalid_accessKey"]);
			document.getElementById('secureWord').select();
			return;
		}
		var status = getUrlValue(content,'axUrl_status');//No I18N
		if(status=='success')
		{
		 location.href="/home/client/Welcome.do";//NO I18N
		}
		else if(status=='failed')
		{
		  var message="";
		  if(getUrlValue(content,'axUrl_message')!='undefined')
		  {
			message=getUrlValue(content,'axUrl_message');//No I18N
		  }
		document.getElementById('message').innerHTML=message;
		document.getElementById('errorStatusDiv').style.display="block";
		document.getElementById('secureWord').value="";
		}
            // Del the iframe...
            setTimeout(function(){'iframeId.parentNode.removeChild(iframeId)'}, 250);
        }
 
    if (iframeId.addEventListener) iframeId.addEventListener("load", eventHandler, true);
    if (iframeId.attachEvent) iframeId.attachEvent("onload", eventHandler);

    // Set properties of form...
    frm.setAttribute("target", "upload_iframe");
    frm.setAttribute("enctype", "multipart/form-data");
    frm.setAttribute("encoding", "multipart/form-data");
    // Submit the form...	
frm.action="/home/CreateTest.do?execute=uploadFile";
frm.submit();
}
function showSequenceComparisionReport(seqid,period)
{
var msg = document.getElementById('sequence_comparision');
msg.innerHTML ='<img src="../images/zoho-busy.gif" alt="Icon" >';
        getHtml('/home/reportsinfo.do?execute=showSequenceComparisionReport&period='+period+'&seqid='+seqid,"postshowSequenceCompariosionReport");
        showDiv('sequence_comparision');
}
function postshowSequenceCompariosionReport(result)
{
        document.getElementById('sequence_comparision').innerHTML=result
}
function showUnmanagedReason()
{
 showURLInDialog( '../jsp/includes/unmanagedReason.jsp', "title="+beanmsg1["unmanaged_title"]+",modal=no, position=absolute, top=100, left=380, width=450,transitionType=boxIn,transitionInterval=80,closeOnEscKey=yes" )
}
function checkUrl(url)
{
 var index=url.indexOf(http_var+"://");
 if(index ==-1 || index>0)
   {
      var index=url.indexOf(https_var+"://");
      if(index==-1 || index>0)
         {
            alert(beanmsg["website_startswith"]);
            return false;
         }
      else
         {
            if(url.substring(8)=='')
               {
                  alert(beanmsg["valid_website"]);
                  return false;
               }
         }
   }
 else
   {
      if(url.substring(7)=='')
         {
            alert(beanmsg["valid_website"]);
            return false;
         }

   }
 return true;

}
function SetTabStyle(column, leftcontent) {
    var masterTable = document.getElementById(leftcontent);
    tableList = masterTable.getElementsByTagName('TABLE');
    var lengthh = tableList.length;
    for(i=0; i<lengthh; i++) {

        oTable = tableList.item(i);
        // Retrieve the rows collection for the table.
        var aRows=oTable.rows;

        // Retrieve the cells collection for the first row.
        var aCells=aRows[0].cells;

        var columnTab = column+"Tab";
        var anchorTag = document.getElementById("A_"+oTable.id);
        if(oTable.id ==columnTab) {
            aCells[0].className = "tbSelected_Left";
            aCells[1].className = "tbSelected_Middle";
            aCells[2].className = "tbSelected_Right";
            anchorTag.className = "tabLinkActive";
        }
        else {
            aCells[0].className = "tbUnselected_Left";
            aCells[1].className = "tbUnselected_Middle";
            aCells[2].className = "tbUnselected_Right";
            anchorTag.className = "tabLink";
       }
    }
    
    if(document.getElementById("loadingg"))
    {
            document.getElementById("loadingg").style.display = "block";
    }
}
function onloadAccount(methodname)
{
	if(methodname=='AccountGeneral')
	{
		AccountGeneral();
	}
	else if(methodname=='AccountBilling')
	{
		AccountBilling();
	}
	else if(methodname==='AccountProfile')
	{
		AccountProfile();
	}
	else if(methodname==='AccountPwd')
	{
		AccountPwd();
	}
}
function onLoadUrlDetails(methodname,urlid,divid)
{
	if(methodname=='urldetailsSLAReport')
	{
		urldetailsSLAReport(urlid,divid);
	}	
}
function onloadreport(type,key,methodname)
{
if(methodname=='overallreport')
{
	overallreport(type,key);
}
if(methodname=='downtimereport')
{
	downtimereport(type,key);
}
if(methodname=='outagereport')
{
	outagereport(type,key);
}
if(methodname=='responsetimereport')
{
	responsetimereport(type,key);
}
if(methodname=='trendreport')
{
	trendReport(type,key);
}
if(methodname=='businessreport')
{
	businessreport(type,key);
}
if(methodname=='logreport')
{
	logReport(type,key);
}
}
function gotoReport(reportname)
{
	location.href= '../home/reportsinfo.do?execute=userReports&methodname='+reportname;	
}
function customperiod()
{
	var id=document.getElementById('reportform');
	var reporttype = $("#currentreportType").html();//No I18N
	var time=null;
	if(reporttype=="outageReport"){
		 time = id.outageperiod.value;
	}
	else{	
		time = id.predefinedperiod.value;
	}
	var starttime=id.startdate.value;
    	var endtime=id.enddate.value;
	starttime = trimString(starttime);
	endtime = trimString(endtime);
	if(time==50)
	{
		showRowDiv('showCalendar');
		if(starttime.length<1 || endtime.length<1)
		{
			return false;
		}
		else 
		{
			return true;
		}
	}
	else
	{
		hideDiv('showCalendar');
		return true;
	}
}
function SendTestSMS(frm)
{
var message = frm.message.value;
message = trimString(message);
if(message.length <1)
{
     message = "Test Message";
}
frm.submit();

}
function SendTestEmail(frm)
{
var message = frm.message.value;
var emailtype = "0";
if(frm.emailtype[1].checked)
{
emailtype = "1";
}
message = trimString(message);
if(message.length <1)
{
     message = beanmsg["testmsg"];
}
frm.submit();
}

function NextAppPage(frm)
  	 {
  	 if(frm.Dont_show.checked)
  	 {
  	      getHtml('../home/CreateTest.do?execute=updateSequenceMessage',"postApplicationpage");
  	 }
  	 else
  	 {
  	      hideDiv("details-page");
  	      showDiv("application-page");
  	 }
  	 }
  	 
function PrevAppPage()
  	 {
  	         hideDiv("application-page");
  	         showDiv("details-page");
  	 }
  	 function postApplicationpage(result)
  	 {
  	 hideDiv("details-page");
  	 showDiv("application-page");
  	 hideDiv("prev_button");
  	 }
  	 
function viewdemo()
  	 {
  	 window.open( http_var+'://js.zohostatic.com/forums/v1/adventnetsitestatic/web-application-monitor/web-application-monitor.html', '','scrollbars=no,resizable=no,width=650,height=550,left=175,top=75');
  	 }

function openup(a)
 {
 var display=document.getElementById(a).style.display;
 if(display=='block')
 {
 hideDiv(a);
 }
 else
 {

 showDiv(a);
 }
 }


function showHomeTab()
{
	location.href='/home/client/Welcome.do';//NO I18N
}

function checkEnterKeyPress(e,f)
{ 
var key;
//if firefox
if(e && e.which)
{ 
e = e
key = e.which 
}
else if(window.event){
e = window.event;
key = e.keyCode 
}
if(key == 13){ //if generated character code is equal to enter key
	return true;
}
else
{
	return false;
}

}

function fnSetFocus(elemid)
{
	var elem=document.getElementById(elemid);
	if(elem)
	{
		elem.focus();
	}
}
function fnUpdatePoll(frm,monitortype)
{
	if((monitortype == null) || (monitortype == undefined))
	{
		monitortype = 'URL';//No I18N
	}
	var pollinterval = frm.monitorPollId.value;
	if(pollinterval==12)
	{
		frm.timeout.value="15";
	}
	else
	{
		frm.timeout.value="30";
	}
	getValuesForBalanceCheck(frm,monitortype);
}
function getValuesForBalanceCheck(frm,monitortype)
{
	var urlid = "0";
	if(frm.urlid!=undefined)
	{
		urlid = frm.urlid.value;
	}
	if(urlid=='0' && frm.urlseqid!=undefined)
	{
		urlid = frm.urlseqid.value;
	}
	var pollid = frm.monitorPollId.value;
	var locations = 0;
	if(frm.secondaryLocations!=undefined)
	{
		var list = frm.secondaryLocations.length;
		for(var i=0;i<list;i++)
        	{
			if(frm.secondaryLocations[i].checked)
			{
				locations = locations+1;
			}	
		}
	}
	var probes = 0;
	if(frm.probes!=undefined)
	{
		var list = frm.probes.length;
		for(var i=0;i<list;i++)
        	{
			if(frm.probes[i].checked)
			{
				probes = probes+1;
			}	
		}
	}
	//alert("urlid="+urlid+", pollid="+pollid+", Locations="+locations+", MonitorType="+monitortype);
	checkBalance(urlid,pollid,locations,probes,monitortype);
}
function checkBalance(urlid,pollid,locations,probes,monitortype)
{
	var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", "/home/CreateTest.do");
        form.appendChild(getnewFormElement("hidden","execute","checkBalance"));
        form.appendChild(getnewFormElement("hidden","urlid",urlid));
        form.appendChild(getnewFormElement("hidden","pollid",pollid));
        form.appendChild(getnewFormElement("hidden","locations",locations));
        form.appendChild(getnewFormElement("hidden","probes",probes));//No I18N
        form.appendChild(getnewFormElement("hidden","monitortype",monitortype));
        form.style.margin='0px';//No I18N                                                                                                             
        form.style.border='0px';//No I18N 	
        document.body.appendChild(form);
        getHtmlForForm(form,"postCheckBalance",monitortype);
}
function postCheckBalance(result,monitortype)
{
	var output = getValue(result,'ax_checkbalance_status');
        if(output=='success')
        {
		hideDiv(monitortype+"Billingerrormsg");
        }
	else
	{
		var msg = document.getElementById(monitortype+"errormsgdetails");
                msg.innerHTML =output;
		showDiv(monitortype+"Billingerrormsg");
	}
}
function cancelSla()
{
	location.href="../home/SlaReport.do?execute=showSLAReport";
}
function changeUrlsduringedit(frm)
{
        location.href="../home/SlaReport.do?execute=editSLACriteria&monitortype="+frm.slaMonitorType.value+"&slaid="+frm.slaid.value;
}
function changeUrls(monitortype)
{
	location.href="../home/SlaReport.do?execute=showAddSlaCriteria&monitortype="+monitortype.value;
}
function deleteSla(slaid)
{
	if(confirm(beanmsg["del_sla"]))
	{
		var datavalues = "execute=deleteSLACriteria&slaid="+slaid; //No I18N
		var response = $.getAjaxResponseWithCSRF("POST","/home/SlaReport.do",datavalues); //No I18N
		$.hideDiv(slaid);//No I18N
	}
}
function editSla(slaid)
{
	location.href = "../home/SlaReport.do?execute=editSLACriteria&slaid="+slaid;
}
function showaddSla()
{
	location.href = "../home/SlaReport.do?execute=showAddSlaCriteria&slatype=1";
}
function RoundOff(value)
{
	var val = value * 100;
	val = Math.round(val);
	val = val/100;
	return val;	
}
function addSla(urls,frm)
{
var criterianame = frm.slaName.value;
var slatype = frm.slatype.value;
var weight = 0;
criterianame = trimString(criterianame);
if(criterianame == '')
{
        alert(beanmsg["slaname"]);
	frm.slaName.focus();
        return;
}
if(criterianame.length>80)
{
        alert(beanmsg["sla_invalid"]);
        frm.slaName.select();
        return;
}
if(slatype=='Composite')
{
	if(!frm.slaavailability.checked && !frm.slaprimary.checked) 
	{
	alert(beanmsg["selectslo"]);
	return;
	}
	var slaAvailableValue = frm.slaAvailableValue.value;
	slaAvailableValue = trimString(slaAvailableValue); 
	if(isNaN(frm.slaAvailableValue.value) || frm.slaAvailableValue.value <= 0 || frm.slaAvailableValue.value>100 || slaAvailableValue == '')
	{
		alert(beanmsg["check_avail"]);
        	frm.slaAvailableValue.select();
        	return;
	}
	slaAvailableValue = RoundOff(slaAvailableValue);
	frm.slaAvailableValue.value = slaAvailableValue;
	slaPrimaryTimes  = frm.slaPrimaryTimes.value;
	slaPrimaryTimes = trimString(slaPrimaryTimes);
	if(isNaN(frm.slaPrimaryTimes.value) || frm.slaPrimaryTimes.value <= 0 || frm.slaPrimaryTimes.value>100 || slaPrimaryTimes == '')
	{
        	alert(beanmsg["checkresptime"]);
        	frm.slaPrimaryTimes.select();
        	return;
	}
	slaPrimaryTimes = RoundOff(slaPrimaryTimes)
	frm.slaPrimaryTimes.value = slaPrimaryTimes;
	if(frm.slaavailability.checked)
	{
		var availweight = frm.slaAvailabilityWeight.value;
		availweight = RoundOff(availweight);
		frm.slaAvailabilityWeight.value = availweight;
		weight = weight+parseFloat(frm.slaAvailabilityWeight.value);
	}
	if(frm.slaprimary.checked)
	{
		var primaryweight = frm.slaPrimaryWeight.value;
		primaryweight = RoundOff(primaryweight);
		frm.slaPrimaryWeight.value = primaryweight;
		weight = weight+parseFloat(frm.slaPrimaryWeight.value);
	}
	if(weight != 100)
	{
		alert(beanmsg["weightage"]);
		frm.slaAvailabilityWeight.select();
		return;
	}
}
if(urls.length === 0)
{
alert(beanmsg["sla_assoc_monitor"]);
return false;
}
selectall(urls);
frm.submit();
}
function disableFields(var0,var1,var2,var3,var4)
{
var disable = true;
if(var0.checked)
{
	disable = false;
}
var1.disabled=disable;
var2.disabled=disable;
var3.disabled=disable;
if(var4!=null)
{
	var4.disabled=disable;
}
}
function togglediv(divname)
{
        var ele = document.getElementById(divname);
        if(ele.style.display == "none" )
        {
                showDiv(divname);
        }
        else
        {
                hideDiv(divname);
        }
}
function toggleRowdiv(divname)
{
        var ele = document.getElementById(divname);
        if(ele.style.display == "none" )
        {
                showRowDiv(divname);
        }
        else
        {
                hideDiv(divname);
        }
}
function hideAllRowDiv(idname,tablename)
{
        var table = document.getElementById(tablename);
        var row = table.rows;
        for(var i=0;i<row.length;i++)
        {
                var rowid = row[i].id;
                if(rowid.indexOf(idname)>=0)
                {
                        hideDiv(rowid);
                }
        }
}
function showAllRowDiv(idname,tablename)
{
        var table = document.getElementById(tablename);
        var row = table.rows;
        for(var i=0;i<row.length;i++)
        {
                var rowid = row[i].id;
                if(rowid.indexOf(idname)>=0)
                {
                        showRowDiv(rowid);
                }
        }
}
function addmonitorgroup(availurl,assurls,frm) 
{
	var grpName = trimString(frm.groupname.value);
	 if(grpName == '') {
		alert(beanmsg["grpempty"]);
	      return false;
	 }
	 if(grpName.length >100){
		   alert(beanmsg["grp_len_invalid"]);
		  return false;
	 }         
	 frm.groupname.value=grpName;
	 var desc = trimString(frm.groupdescription.value);
	 if(desc.length >255){
		   alert(beanmsg["grp_desc_len_invalid"]);
		  return false;
	 }
	selectall(availurl);
	selectall(assurls);
	frm.submit();
}
function fnAssociate(frm)
{
	frm.submit();
}

function fnRemove(frm)
{
	document.getElementById("execute").value="RemoveMonitors";
	frm.submit();
}

function showMonitor(monType,groupid,urlid)
{
	if(monType=="GROUP")
	{
		location.href="/home/CreateTest.do?execute=showMonitors&type=all&groupid="+groupid;
	}
	else if(monType=="URL" || monType=="DNS" || monType=="SMTP" || monType=="HOMEPAGE" || monType=="PORT" || monType=="PORT-POP" || monType=="PORT-SMTP" || monType=="PING" || monType=="URL-SEQ" || monType=="SSL_CERT")
	{
		gotoPage("detailspage",urlid);//No I18N
	}
}
function editMonitor(monType,id,seclocations)
{
	if(monType=='PROBE')
	{
		location.href=newclient_path+'#/admin/onpremise-poller/onpremise-poller-form/'+id;//No I18N
	}
	else if(monType=='MPROBE')
	{
		location.href=newclient_path+'#/admin/mobile-network-poller/mobile-network-poller-form/'+id;//No I18N
	}
	else
	{
		location.href=newclient_path+"#/admin/inventory/monitors-form/"+monType+"/"+id;//No I18N
	}
	return;
	/*var locurl=""
	if(monType=="GROUP")
	{
		locurl="/home/CreateTest.do?execute=showMGConf&userarea=true&homepage=true&groupid="+id;//No I18N
	}
	else if(monType=="URL-SEQ")
	{
		locurl="/home/ShowUrlSeqDetails.do?execute=configureNotificationsPane&homepage=true&urlseqid="+id;//No I18N
    }
	else
	{
		locurl="/home/CreateTest.do?execute=showConf&userarea=true&homepage=true&urlid="+id;//No I18N
	}
	if(seclocations!=undefined && seclocations=="true" && monType!="GROUP")
	{
		locurl = locurl+"&showLoc=true";//No I18N
	}
	location.href=locurl;
	*/
}
function suspendMonitor(monType,urlid)
{
	if(confirm(beanmsg["suspend_monitor"]))
	{
	if(monType=="URL-SEQ")
	{
		suspendUrlSeq(urlid);
		//return;
	}
	else
	{
		var form = document.createElement("form");//No I18N
		form.setAttribute("method", "post");//No I18N
		form.setAttribute("action", "/home/CreateTest.do");//No I18N
		form.appendChild(getnewFormElement("hidden","execute","suspend"));//No I18N
		form.appendChild(getnewFormElement("hidden","urlid",urlid));//No I18N
		var response = $.getAjaxResponseWithCSRF("POST",form.action,$(form).serialize());//No I18N
	}
	location.href="/home/client/Welcome.do";//NO I18N
	}	
}
function deleteMonitor(monType,groupid,urlid)
{
	if(monType=="GROUP")
	{
		if(confirm(beanmsg["grpdelete"]))
		{
		location.href = "/home/CreateTest.do?execute=deleteMonGroup&groupid="+groupid;
		}
	}	
	else if(monType=="URL")
	{
		deleteUrl(urlid);
	}
	else if(monType=="URL-SEQ")
	{
		deleteUrlSeq(urlid);
	}
	else if(monType=="DNS")
	{
		deleteDns(urlid);
	}
	else if(monType=="SMTP")
	{
		deleteSMTP(urlid);
	}
	else if(monType=="HOMEPAGE")
	{
		deleteHomePage(urlid);
	}
	else if(monType=="PORT")
	{
		deletePort(urlid);
	}
	else if(monType=="PORT-POP")
	{
		deletePop(urlid);
	}
	else if(monType=="PORT-SMTP")
	{
		deletePortSMTP(urlid);
	}
	else if(monType=="PING")
	{
		deletePing(urlid);
	}
	else if(monType=="SSL_CERT")
	{
		deleteSslcert(urlid);
	}
}
function activateMonitor(monType,groupid,urlid)
{	
	var loc="";
	if(monType=="GROUP")
        {

        }
	else
	{
		loc="../home/CreateTest.do?execute=activate&urlid="+urlid;
	}
	location.href=loc;
}
function removeAssociatedMonitor(urlid)
{
	location.href="/home/CreateTest.do?execute=removeAssociatedMonitor&urlid="+urlid;
}
function changeRowsPerPage(pagelimit,details,urlid)
{
        var id = document.getElementById('reportform');
        var id1 = document.getElementById('logreport');
        var condition=(pagelimit+$("#reportform input[name=detailspage]").val()!=null && $("#reportform input[name=detailspage]").val()=="yes");//NO I18N
        if(condition)
        {
        	$.hideDiv("reportsContent");//NO I18N
        	$.showDiv("loading");//NO I18N
        }
		var newtimeperiod = document.getElementById('newperiodval').value;//NO I18N
		if(newtimeperiod.indexOf("BH")!=-1)
		{
			newtimeperiod=newtimeperiod.slice(2, newtimeperiod.length);
		}
		var period=newtimeperiod;
		var starttime="";
		var endtime="";
		if(period==50)
		{
			starttime = $("#reportform input[name=startdate]").val();//NO I18N
			endtime = $("#reportform input[name=enddate]").val();//NO I18N
		}
		if(condition)
		{
			var monitor= $("#reportform input[name=urlid]").val();//NO I18N
			response=$.getAjaxResponse("POST","/home/reportsinfo.do?execute=LogReport&urlid="+monitor+"&startdate="+starttime+"&enddate="+endtime+"&period="+period+"&pagelimit="+pagelimit+"&reportstab=true");//NO I18N
			var id=document.getElementById("reportsContent");//NO I18N
			id.innerHTML=response;
			$.hideDiv("loading");//NO I18N
			$.showDiv("reportsContent");//NO I18N
		}
		else
		{
			var monitor=id.monitor1.value;
	        http.open("GET","../home/reportsinfo.do?execute=LogReport&period="+period+"&startdate="+starttime+"&enddate="+endtime+"&urlid="+monitor+"&pagelimit="+pagelimit+"&reportstab=true",true);
	        http.onreadystatechange = handleLogReport1;
	        http.send(null);
		}
		
			
		
}
function handleLogReport1()
{
        if(http.readyState == 4)
        {
                if (http.status == 200)
                {
                        var ele = document.getElementById("pages");
                        ele.innerHTML = http.responseText;
                        hideDiv('loadingg');
                }
        }
}

function bulkedit(frm)
{
	//Actionid is 1 for 'select option' text.
     	if(frm.actionid.value==1)
        {
          	return;
        }
	var resid="";
        var attid="";
        if(!checkforOneSelected(frm,"monitors"))
        {
        	hideDiv('loading');  
        	alert(beanmsg["bulk_opn"]);
              	frm.actionid.value=1;
            	return;
        }
        else if(frm.actionid.value==4)
        {
           	if(!confirm(beanmsg["susp_mons"]))
            	{
              		return;
            	}
        }
     	else if(frm.actionid.value==5)
        {
           	if(!confirm(beanmsg["del_mons"]))
            	{
              		return;
            	}
        }
       	var i=0;
        for(i;i<frm.monitors.length;i++)
        {
                if(frm.monitors[i].checked==true)
		{
                	var temp=frm.monitors[i].value;
                        var test=temp.split(",");
                        var res=test[0];
                        var att=test[1];
                        if(resid!="")
                        {
                                resid=resid+","+res;
                                attid=attid+","+att;
                        }
                        else
                        {
                                resid=res;
                                attid=att;
                        }
		}
        }
	frm.urllist.value=resid;
	if(frm.actionid.value==2)
	{
		window.open( '/home/CreateTest.do?execute=bulkEdit&urllist='+resid, '','scrollbars=no,resizable=no,width=750,height=610,left=150,top=100');
		return;
	}
	frm.submit();
}
function showLogReports(event,pages)
{
var status = checkEnter(event);
if(!status)
{
        return;
}
frm = document.getElementById("logreport");
var page = parseInt(pages);
var max = parseInt(frm.maximumpage.value);
if(page > max)
{
	msg=Msgbean(reportmsg['report_pages'],max,max);	
        alert(msg);
        return;
}
showLogReport(frm.startingdate.value,frm.endingdate.value,frm.periodvalue.value,page,frm.pagelimitvalue.value,frm.urlidvalue.value);
}
function showLogReport(startdate,enddate,period,pagecount,pagelimit,urlid)
{
	response = $.getAjaxResponse("GET","../home/reportsinfo.do","execute=LogReport&period="+period+"&startdate="+startdate+"&enddate="+enddate+"&urlid="+urlid+"&pagelimit="+pagelimit+"&pagecount="+pagecount+"&reportstab=true");//No I18N
        $("#reportsContent").html(response);//No I18N
        hideDiv('loadingg');
}
function checkEnter(e)
{
        if(e)
        {
                e = e
        }
        else
        {
                e = window.event
        }
        if(e.which)
        {
                var keycode = e.which
        }
        else
        {
                var keycode = e.keyCode
        }
        if(keycode == 13)
        {
                return true;
        }
        else
        {
                return false;
        }
}
function trendChart(urlid,monitortype)
{
	var id=document.getElementById('reportform');
        frm = document.getElementById("trendreport");
        var page = parseInt(frm.currentpage.value);
        var period=$("#newperiodval").val();
		if(period.indexOf("BH")!=-1)
		{
			period=period.slice(2, period.length);
		}
        var trendperiod=id.trendReportperiod.value;
        var starttime='';
        var endtime='';
		if(period==50)
		{
			starttime=id.startdate.value;
			endtime=id.enddate.value;
		}
	var idvalue = new String(page+''+urlid);
	fnOpenNewScrollWindow("../home/reportsinfo.do?execute=showtrendChart&urlid="+urlid+"&trendperiod="+trendperiod+"&period="+period+"&startdate="+starttime+"&enddate="+endtime+"&page="+page+"&monitortype="+monitortype,idvalue,"900","500");
}
function trendComparision()
{
        if(!checkforOneSelected(document.trendform,"trendcompare"))
        {
                alert(reportmsg["selectmonitors"]);
                return;
        }
        var len = document.trendform.trendcompare.length
        var resid = "";
        for(var i=0;i<len;i++)
        {
                var ele = document.trendform.trendcompare[i];
                if(ele.checked==true)
                {
                        var temp=ele.value;
                        var test=temp.split(",");
                        var res=test[0];
                        if(resid!="")
                        {
                                resid=resid+","+res;
                        }
                        else
                        {
                                resid=res;
                        }
                }
        }
	var id=document.getElementById('reportform');
	frm = document.getElementById("trendreport");
        var page = parseInt(frm.currentpage.value);
        var period=$("#newperiodval").val();
		if(period.indexOf("BH")!=-1)
		{
			period=period.slice(2, period.length);
		}
        var trendperiod=id.trendReportperiod.value;
        var starttime='';
        var endtime='';
		if(period==50)
		{
			starttime=id.startdate.value;
			endtime=id.enddate.value;
		}

var monitorgrp = document.getElementById('monitorgroups');
var groupid =0;
if(monitorgrp!=null)
{
groupid = id.reportGroupId.value;
}
        fnOpenNewScrollWindow("../home/reportsinfo.do?execute=showtrendReportComparision&childid="+resid+"&trendperiod="+trendperiod+"&period="+period+"&startdate="+starttime+"&enddate="+endtime+"&monitorgroupid="+groupid+"&page="+page,"900","500");
}
function SelectAllCheckBox(selectall,frm,name)
{
        var stat = selectall.checked;
        var len = frm.elements.length;
        for (var i=0; i<len; i++)
        {
             var e = frm.elements[i];
             if (e.name == name)
             {
                 frm.elements[i].checked=stat;
             }
        }
}
function showTrendPage(page)
{
	var id=document.getElementById('reportform');
	
	var newtimeperiod = document.getElementById('newperiodval').value;
	if(newtimeperiod.indexOf("BH")!=-1)
	{
		newtimeperiod=newtimeperiod.slice(2, newtimeperiod.length);
	}
	var period=newtimeperiod;
	var starttime="";
	var endtime="";
	if(period==50)
	{
		starttime = $("#reportform input[name=startdate]").val();
		endtime = $("#reportform input[name=enddate]").val();
	}
	var trendperiod=id.trendReportperiod.value;
	var monitor=id.monitor.value;
	
	var monitorgrp = document.getElementById('monitorgroups');
	var groupid =0;
	if(monitorgrp!=null)
	{
		groupid = id.reportGroupId.value;
	}
	var d = new Date();
	var response = $.getAjaxResponse("GET","../home/reportsinfo.do","execute=trendReport&trendperiod="+trendperiod+"&period="+period+"&startdate="+starttime+"&enddate="+endtime+"&monitorgroupid="+groupid+"&page="+page+"&reportstab=true");//No I18N
        $("#reportsContent").html(response);//No I18N
        hideDiv('loadingg');
}
function showTrendReports(event,pages)
{
var status = checkEnter(event);
if(!status)
{
        return;
}
var page = parseInt(pages);
var max = parseInt(document.getElementById("trendreport").maximumpage.value);
if(page > max)
{
	msg=Msgbean(reportmsg['report_pages'],max,max);
	alert(msg);
        return;
}
showTrendPage(page);
}

function showMonitors(groupid,hiddengroup,action)
{
	var elem=document.getElementById(hiddengroup).value;
	elem=elem.substring(0,elem.length-1)
	var test=elem.split(",");
	for(i=0;i<test.length;i++)
	{
		var temp=groupid+test[i];	
		toggle_row(temp,action);
		detailsid="details"+test[i];
		if(document.getElementById(detailsid))
		{
			if(document.getElementById(detailsid).style.display=='')
			{
				document.getElementById(detailsid).style.display='none';
			}	
		
		}
	}       
}

function disableDetailsLink(urlId)
{
	operationStat = document.getElementById(urlId+'-editStat').value;
	if(operationStat=='false')
	{
		document.getElementById(urlId+'-editStat').value='true';
	}
	else
	{
		document.getElementById(urlId+'-editStat').value='false';
	}
}

function showMonitorDetails(id,type,showRCA,downtime)
{
	
	if(document.getElementById(id+'-editStat')!=undefined && document.getElementById(id+'-editStat').value=='true')
	{	
		//editMonitor(type,id);
		if(type=='PROBE')
		{
			location.href=newclient_path+'#/admin/onpremise-poller/onpremise-poller-form/'+id;//No I18N
		}
		else if(type=='MPROBE')
		{
			location.href=newclient_path+'#/admin/mobile-network-poller/mobile-network-poller-form/'+id;//No I18N
		}
		else
		{
		location.href=newclient_path+"#/admin/inventory/monitors-form/"+type+"/"+id;//No I18N
		}
		return;
	}
	else
	{
		if(type == "INFRA")
		{
			location.href="../home/AgentAction.do?execute=showInfraView&urlid="+id;
		}
		else
		{

			gotoPage("detailspage",id,showRCA,downtime);//No I18N
		}
	}
}
function toggle_row(tempid,action)
{
	if(document.getElementById(tempid))
	{
		if(action=='show')
		{
			document.getElementById(tempid).style.display='';	
		}
		else if(action=='collapse')
		{
			document.getElementById(tempid).style.display='none';
        	}
		else
		{
			if(document.getElementById(tempid).style.display=='')	
				document.getElementById(tempid).style.display='none';	
			else
				document.getElementById(tempid).style.display='';		
		}
	}
}

function toggle_group(e,grpid,hiddengroup,checkname)
{
	var frm=e.form;
	
	var elem=document.getElementById(hiddengroup).value;
	var check;
	if(e.checked)
	{
		selectGroup(frm,checkname,elem);
	}
	else
	{
		var headercheckbox1=document.getElementById("headercheckbox1");//No I18N
                headercheckbox1.checked = false;

		clearGroup(frm,checkname,elem);
	}	
	
}

function clearGroup(frm,checkname,selurls)
{

	var len = frm.elements.length;
	for (i = 0; i < len; i++) 
	{
	    var e = frm.elements[i];
	    if (frm.elements[i].name == checkname) 
	    {
			val=frm.elements[i].value;
			var test=val.split(",");
			val = test[0];
			if(selurls.match(val))
			{
				frm.elements[i].checked=false;			
			}

	    }
	}

}
function selectGroup(frm,checkname,selurls)
{
	selurls=","+selurls;
	var len = frm.elements.length;
	for (i = 0; i < len; i++) 
	{
	    var e = frm.elements[i];

	    if (frm.elements[i].name == checkname) 
	    {	
			val=frm.elements[i].value;
			var test=val.split(",");
			val = test[0];
			if(selurls.match(","+val+","))
			{
				frm.elements[i].checked=true;			
			}

	    }
	}

}
function downloadReportsAsCSV(a)
{
	   var id=document.getElementById('reportform');
		var statuskey = id.statuskeys.value;
	        var period=$("#newperiodval").val();
	        if(period.indexOf("BH")!=-1)
	    	{
	        	period=period.slice(2, period.length);
	    	}
	        //alert(period)
	        var starttime='';
	        var endtime='';
	        if(period!=50)
	        {
	        	 id.startdate.value='';
	             id.enddate.value='';
	        }
	        //alert(period);
var urlid = id.monitor.value;

if(a=='pdf')
{
id.reporttype.value="pdf";
closeDialog();
}
else if(a=='csv')
{
	id.reporttype.value="csv";
	closeDialog();
}
else
{
	alert("Please select a type of report")
	return;
}


var groupid =0;
var monitorgrp = null;

var reporttype = $("#currentreportType").html();//No I18N
//alert(reporttype);
if(reporttype=="summaryReport")
{
		monitorgrp = document.getElementById('both_monitor_n_groups_summary');
		if(monitorgrp!=null)
		{
			groupid = id.report_Mon_GroupId_Summary.value;
		}
		//alert("yyyyy "+$("#reportData").val());
		id.execute.value="showSummaryReport";
		if(groupid.match("INFRA_")){
			id.execute.value="showSummaryReportForMSExchange";//No I18N
			var reportdata = $("#reportData").val();
			var monitorid=groupid.split("_");
			id.action = "/home/reportsinfo.do?reportstab=true&groupid="+monitorid[1]+"&param="+statuskey+"&reportdata="+reportdata;
		}
		else if(groupid.match("MO_")){
			var monitorid=groupid.split("_");
			var reportdata = $("#reportData").val();
			//alert(reportdata);
			id.action = "/home/reportsinfo.do?reportstab=true&urlid="+monitorid[1]+"&param="+statuskey+"&reportdata="+reportdata;
		}else{
			var reportdata = $("#reportData").val();
			//alert(reportdata);
			id.action = "/home/reportsinfo.do?reportstab=true&monitorgroupid="+groupid+"&param="+statuskey+"&reportdata="+reportdata;
		}
}
else if(reporttype=="LocationDownReport")
{
		id.execute.value="outageReport";
	var reportdata = $("#downtimeData").val();
	id.action = "/home/reportsinfo.do?reportstab=true&param="+statuskey+"&urlid="+urlid+"&reportdata="+reportdata;
}
else if(reporttype=="outageReport")
{
		monitorgrp = document.getElementById('both_monitor_n_groups');
		if(monitorgrp!=null)
		{
			groupid = id.report_Mon_GroupId.value;
		}
		id.execute.value="OutageReportForAllMonitors";
		if(groupid.match("MO_")){
			monitorid=groupid.split("_");
			 
			
   	id.action = "/home/reportsinfo.do?reportstab=true&param="+statuskey+"&urlid="+monitorid[1];
		}
		else{
		
			id.action = "/home/reportsinfo.do?reportstab=true&param="+statuskey+"&monitorgroupid="+groupid;
		}
}
else if(reporttype=="ResponseReport")
{
	monitorgrp = document.getElementById('both_monitor_n_groups');
	if(monitorgrp!=null)
	{
		groupid = id.report_Mon_GroupId.value;
	}
	var monitorid="";
	if(groupid.match("MO_")){
		monitorid=groupid.split("_");
		id.execute.value="showResponseReport";
		if(monitorid[2] == "SERVER" || monitorid[2] == "MSEXCHANGE") //No I18N
		{
			id.execute.value="showResponseReportForServerMonitor"; //No I18N
		}
		
		id.action="/home/reportsinfo.do?urlid="+monitorid[1]+"&isUrl=false";//No I18N
	}
	else{
	id.execute.value="ResponsetimeReport";
	
	id.action = "/home/reportsinfo.do?param="+statuskey+"&monitorgroupid="+groupid;
}
}
else if(reporttype=="trendReport")
{
	id.execute.value="trendReport";
      frm = document.getElementById("trendreport");
      var page = parseInt(frm.currentpage.value);
      var max = parseInt(frm.maximumpage.value);
      if(page > max)
      {
           msg=Msgbean(reportmsg['report_pages'],max,max);		     
           alert(msg);
           
           return;
	}
			if(document.getElementById('monitorgroups')!=null)
			{
				groupid = id.reportGroupId.value;
			}
			 //alert(id.reporttype.value);
      id.action ="/home/reportsinfo.do?reportstab=true&param="+statuskey+"&trendperiod="+id.trendReportperiod.value+"&period="+period+"&startdate="+id.startdate.value+"&enddate="+id.enddate.value+"&monitorgroupid="+groupid+"&page="+page;
}
else if(reporttype=="BusyHourReport")
{
	urlid = id.busy_monitor.value;
	id.execute.value="businessReport";
	var reportdata_busy = $("#busyHrData").val();
	//alert(reportdata_busy);	
	//period=id.predefinedBusinessperiod.value;
id.action ="/home/reportsinfo.do?reportstab=true&param="+statuskey+"&urlid="+urlid+"&preperiod="+period+"&businessperiod="+id.businessReportSegments.value+"&startdate=&enddate="+"&reportdata="+reportdata_busy;
}
else if(reporttype=="logreport")
{
	id.execute.value="LogReport";
	frm = document.getElementById("logreport");
	var nodatamsg = Msgbean(reportmsg['no_data_for_csv_report']);
	if(frm==null || frm==undefined)
	{alert(nodatamsg);return true;}
      var page = parseInt(frm.gotopage.value);
	var max = parseInt(frm.maximumpage.value);
	var pagelimit = parseInt(frm.pagelimitvalue.value);
	if(isNaN(page) || isNaN(max))
	{alert(nodatamsg);return true;}
      if(page > max)
      {
         msg=Msgbean(reportmsg['report_pages'],max,max);		   
	   alert(msg);
         return;
      }
			urlid = id.monitor1.value;
			 
      id.action ="/home/reportsinfo.do?reportstab=true&param="+statuskey+"&urlid="+urlid+"&period="+period+"&pagelimit="+pagelimit+"&pagecount="+page+"&startdate="+id.startdate.value+"&enddate="+id.enddate.value;
}

id.period.value=period;
id.submit();
}
function toggleDivInline(divname)
{
	var na = divname.split("$");
	for(i=0;i<na.length;i++)
	{
		if(document.getElementById(na[i]).style.display== 'none')
			document.getElementById(na[i]).style.display='inline';
		else
			document.getElementById(na[i]).style.display='none';
	}
}

function toggleMonitor(action)
{
	if(document.getElementById("groupids"))
	{
	frm=document.getElementById("groupids").form;
	inputs =frm.getElementsByTagName("input");
	buffer = "";	
	for (k = 0; k< inputs.length; k++)
	{
		var type=inputs[k].type;
		if(type=='hidden')
		{
			var hiddenid=inputs[k].id;
			if(hiddenid.indexOf("hidden")>=0)
			{
				groupid=hiddenid.substring(6);
				showMonitors(groupid,hiddenid,action);
				if(action=='show')
				{
					document.getElementById('arrowShow'+groupid).style.display='none';
					document.getElementById('arrowHide'+groupid).style.display='inline';
				}
				else
				{
					document.getElementById('arrowShow'+groupid).style.display='inline';
					document.getElementById('arrowHide'+groupid).style.display='none';
				}
				//toggleDivInline('arrowShow'+groupid+'$arrowHide'+groupid,action);		
			}
		}	
	}
	}
}

function hideMG()
{
	hideAll();
	showDiv("userarea");
}
function toggleGroups(evnt)
{
	if(evnt=='expand')
	{
		hideDiv('expandgroup');
		showDivInline('collapsegroup');	
		toggleMonitor('show');	
	}
	else
	{		
		showDivInline('expandgroup');	
		hideDiv('collapsegroup');
		toggleMonitor('collapse');
	}


}
function toggleNotes(action)
{
     if(document.getElementById("shownotes"))
     {
	
	if(action=='show')
	{
		if(shownotes)
		{
			hideDiv('shownotes');
			showDivInline('hidenotes');
			if(document.getElementById("groupids"))
			{	
				toggleMonitor('show');	
			}
		}
	}
	else
	{		
		showDivInline('shownotes');	
		hideDiv('hidenotes');			
	}
		
	frm=document.getElementById("urllist").form;
	if(frm)
	{
		rows =frm.getElementsByTagName("tr");
		for (k = 0; k< rows.length; k++)
		{		
			var rowid=rows[k].id;
			
			if(rowid.indexOf("details")==0)
			{
					if(action == 'show')
					{
						document.getElementById(rowid).style.display='';
					}
					else
					{
						document.getElementById(rowid).style.display='none';
					}
			}

		}
	}
     }

}
/********** function for public page *********/


function showperfmetrics(id,username,period,starttime,endtime,hostname,protocol,rsptime)
 {
		var disp = "table-row";
		if(document.all)
		 {
			 disp = "block";
		 }
		 if(document.getElementById("showperfmetrics"+id).style.display=="none" )
		 {
			var url;
			if(protocol=="" || protocol==null)
			{
				protocol=https_var;//No I18N
			}
			if((hostname=="" || hostname==null))
			{
				url = "../login/status.do?execute=websitePerfMetrics&urlid="+id+"&uname="+encodeURIComponent(username)+"&docache=false&Period="+period+"&starttime="+starttime+"&endtime="+endtime+"&rsptime="+rsptime; //No I18N
			}
			else
			{
				url = protocol+"://"+hostname+"/login/status.do?execute=websitePerfMetrics&urlid="+id+"&uname="+encodeURIComponent(username)+"&docache=false&Period="+period+"&starttime="+starttime+"&endtime="+endtime+"&rsptime="+rsptime; //No I18N
			}
			getHtml(url,"postGraphsForStatusPage",id); //No I18N
			document.getElementById("showgraphs-"+id).innerHTML="";
			document.getElementById("showperfmetrics"+id).style.display=disp;
			document.getElementById("show-"+id).innerHTML=publicmsg["less"]+"..";
			document.getElementById("show-"+id).innerHTML=publicmsg["less"]+"..";  //No I18N
			try
			{
		 			document.getElementById("showperfmetrics"+id+"timeScale").style.display=disp;
			}  
			catch(e){}
		}	
		else
		 {
			document.getElementById("showperfmetrics"+id).style.display="none";
			document.getElementById("show-"+id).innerHTML=publicmsg["more"]+"..";
			try
			{
					document.getElementById("showperfmetrics"+id+"timeScale").style.display="none";
			}  
			catch(e){}
			return;
		 } 
	 
 }
 
 function showperfmetricsDefault(id,username,period,starttime,endtime,hostname,protocol,rsptime)
 {
		var disp = "table-row";  //No I18N
		 if(document.all)
		 {
			 disp = "block"; //No I18N
		 }
		 if(document.getElementById("showperfmetrics"+id).style.display=="none" )
		 {
			var url;
			if(protocol=="" || protocol==null)
			{
				protocol=https_var;//No I18N
			}
			if(hostname=="" || hostname==null)
			{
				url = "../login/status.do?execute=websitePerfMetrics&urlid="+id+"&uname="+username+"&docache=false&Period="+period+"&starttime="+starttime+"&endtime="+endtime+"&rsptime="+rsptime; //No I18N
			}
			else
			{
				url = protocol+"://"+hostname+"/login/status.do?execute=websitePerfMetrics&urlid="+id+"&uname="+username+"&docache=false&Period="+period+"&starttime="+starttime+"&endtime="+endtime+"&rsptime="+rsptime; //No I18N
			}
			
			getHtml(url,"postGraphsForStatusPage",id); //No I18N
			document.getElementById("showgraphs-"+id).innerHTML="";
			document.getElementById("showperfmetrics"+id).style.display=disp;
			document.getElementById("show-"+id).innerHTML=publicmsg["less"]+".."; //No I18N
			try
			{
		 			document.getElementById("showperfmetrics"+id+"timeScale").style.display=disp;
			}  
			catch(e){}
		}
		 else
		 {
			document.getElementById("showperfmetrics"+id).style.display="none";
			document.getElementById("show-"+id).innerHTML=publicmsg["more"]+".."; //No I18N
			try
			{
		 			document.getElementById("showperfmetrics"+id+"timeScale").style.display="none";
			}  
			catch(e){}
			return;
		 }

 }
 
   
function postGraphsForStatusPage(result,id)
{
	document.getElementById("showgraphs-"+id).innerHTML=result;
}

	 
function generatePublicUrl(frm,username)
{
	 customurls=document.getElementById("customizedurls").value;
	 viewtype=0;
	 if(frm.view[0].checked)
	 {
		viewtype="0";
	 }
	 else if(frm.view[1].checked){
		viewtype="1";
	 }	 		 
	 var url="../home/CreateTest.do?execute=addPublicStatusView&customurls="+customurls+"&period=2&moreOption=false&dispname=&viewid=0&rsptime=false&viewtype="+viewtype+"&"+CSRFParamName+"="+$.getCookie(CSRFCookieName);//NO I18N
	 http.open("POST",url,true); 
	 http.onreadystatechange = postPublicView;
	 http.send(null);
}
  	 
  
   

function postPublicView() 
{ 
	if(http.readyState == 4) 
	{ 
		   result = http.responseText;                            
		   viewid = getValue(result,'ax_viewid');
		   
		   var color = encodeURIComponent(document.getElementById("ColorHex").value);
		   
		   if(color=="")
			{
				var url = protocol+"//"+servername+"/sv.do?id="+viewid;
				var iframe = "<iframe src='"+protocol+"//"+servername+"/sv.do?id="+viewid+"' scrolling=\'yes\' align=\'center\' height=\'400\' width=\'1000\' border=\'0\' frameborder=\'0\'></iframe>";
			}
			else
			{
				var url = protocol+"//"+servername+"/sv.do?id="+viewid+"&color="+color;
				var iframe = "<iframe src='"+protocol+"//"+servername+"/sv.do?id="+viewid+"&color="+color+"' scrolling=\'yes\' align=\'center\' height=\'400\' width=\'1000\' border=\'0\' frameborder=\'0\'></iframe>";
			}
			
		   
		   
		    document.getElementById("publicurl").value=url;
			document.getElementById("publicurl").focus();
		   	document.getElementById("feedback").value=iframe;
		   }
} 
   
   
   
function showAdvancedPublicConfig()
{

	var sty=document.getElementById('advtable').style.display;
	if(sty=='none')
	{
		showDiv('advtable');
	}
	else{
		hideDiv('advtable');
	}   	
}



/********** function for public page *********/
// Removes leading whitespaces
function LTrim( value ) {

        var re = /\s*((\S+\s*)*)/;
        return value.replace(re, "$1");

}

// Removes ending whitespaces
function RTrim( value ) {

        var re = /((\s*\S+)*)\s*/;
        return value.replace(re, "$1");

}

// Removes leading and ending whitespaces
function trim( value ) {

        return LTrim(RTrim(value));

}
function submitForm(frm)
{
	frm.submit();
}
function showcreditinfo(starttime)
{
	var param=verifyNewClient();
	if(param!=null)
	{
		location.href="/home/accountinfo.do?method=generateInvoice&st="+starttime+"&nc=billing";
	}
	else
	{
	location.href="/home/accountinfo.do?method=generateInvoice&st="+starttime;
	}
}
function showtransactiondetails(starttime)
{
var trans_div = document.getElementById("showtransactionhistory"+starttime);
if(trans_div.style.display=='block')
{
showDiv('arrowShow'+starttime);
hideDiv('arrowHide'+starttime);
hideDiv('showtransactionhistory'+starttime);
return;
}
getHtml('/home/accountinfo.do?method=showBillingDetails&st='+starttime,"posttransactiondetails",starttime)
}
function posttransactiondetails(result,starttime)
{
        showDiv('showtransactionhistory'+starttime);
        var trans_div = document.getElementById("showtransactionhistory"+starttime);
        trans_div.innerHTML = result;
        showDiv('arrowHide'+starttime);
        hideDiv('arrowShow'+starttime);
        //hideDiv('Account_Info_div');
}

function showsubresellertransactiondetails(starttime,a,resellerName)
{
        var trans_div = document.getElementById("showtransactionhistory"+starttime+a);
        if(trans_div.style.display=='block')
        {
                showDiv('arrowShow'+starttime+a); //No I18N
                hideDiv('arrowHide'+starttime+a); //No I18N
                hideDiv('showtransactionhistory'+starttime+a); //No I18N
                return;
        }
        getHtml('/home/Reseller.do?execute=showTransactionDetails&st='+starttime+'&resellerName='+encodeURIComponent(resellerName),"postsubresellertransactiondetails",starttime+a) //No I18N
}
function postsubresellertransactiondetails(result,starttime)
{
        showDiv('showtransactionhistory'+starttime); //No I18N
        var trans_div = document.getElementById("showtransactionhistory"+starttime);
        trans_div.innerHTML = result;
        showDiv('arrowHide'+starttime); //No I18N
        hideDiv('arrowShow'+starttime); //No I18N
}

function resellertransactiondetails(starttime,resellerName)
{
        var trans_div = document.getElementById("showtransactionhistory"+starttime);
        if(trans_div.style.display=='block')
        {
                showDiv('arrowShow'+starttime); //No I18N
                hideDiv('arrowHide'+starttime); //No I18N
                hideDiv('showtransactionhistory'+starttime); //No I18N
                return;

        }
        getHtml('/home/Reseller.do?execute=showTransactionDetails&st='+starttime+"&resellerName="+encodeURIComponent(resellerName),"posttransactiondetails",starttime); //No I18N
}
function resellerEarningsTransactionDetails(starttime,resellerName)
{
        var trans_div = document.getElementById("showtransactionhistory"+starttime);
        if(trans_div.style.display=='block')
        {
                showDiv('arrowShow'+starttime); //No I18N
                hideDiv('arrowHide'+starttime); //No I18N
                hideDiv('showtransactionhistory'+starttime); //No I18N
                return;
        }
        getHtml('/home/Reseller.do?execute=showEarningsTransactionDetails&st='+starttime+"&resellerName="+encodeURIComponent(resellerName),"posttransactiondetails",starttime); //No I18N
}

function getSubResellersReport(frm)
{
	frm.execute.value="getSubResellerCommissionReport"; //No I18N
	getHtmlForForm(frm,"postShowSubResellerReport",frm); //No I18N

}
function postShowSubResellerReport(result)
{
                var notifdiv = document.getElementById("subresellerreport");
       		notifdiv.innerHTML = result;
       		showDiv("subresellerreport"); //No I18N
}

function changecolor(id,color)
{
        document.getElementById(id).style.backgroundColor=color;
}
function changeclass(id,classname)
{
	document.getElementById(id).className=classname;
}
function Evaluate(rolevalue,fromrole,torole)
{
	var frmid = document.getElementById('Evaluateform');
	frmid.role.value = torole;
	frmid.submit();
}
function Slahelpdoc(url)
{
	window.open(url, '_blank');
}
function goHomeTab(frm)
{
	location.href = "/home/client/Welcome.do";//NO I18N
}
function editSeqUrl(id)
{
	toggleRowdiv(id);
	if(document.getElementById(id).style.display=='none')
	{
		hideDiv('cancel'+id);
		showDiv('edit'+id);
	}
	else
	{
		var response=$.getAjaxResponse("GET","/home/ShowUrlSeqDetails.do","execute=getSeqUrlConfiguration&urlid="+id);//No I18N
        $("#urlConfig-"+id).html(response);//No I18N
		showDiv('cancel'+id);
        hideDiv('edit'+id);
        onChangeSeqStepCritical(id);
	}
}
function showSequrls(id)
{
	getHtml('../home/ShowUrlSeqDetails.do?execute=showSeqUrls&seqid='+id,"postShowSeqUrls");
}
function closeEditSeqUrl(id)
{
	hideDiv(id);
	hideDiv('cancel'+id);
        showDiv('edit'+id);
}
function getnewDivElement(divid,content)
{
	var newdiv = document.createElement('div');
        newdiv.setAttribute("id",divid);
	newdiv.innerHTML = content;
	return newdiv;
}
function getnewFormElement(type,name,value,size,classval)
{
	var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", type);
        hiddenField.setAttribute("name", name);
        hiddenField.setAttribute("value", value);
        hiddenField.setAttribute("id", name);
	if(classval!=undefined)
	{
        	hiddenField.setAttribute("class", classval);
	}
	if(size!=undefined)
	{
		hiddenField.size = size;
	}
	return hiddenField;
}
function closeEditStepDetails(stepid)
{
        $.showDiv('showStepLabel-'+stepid);//No I18N
        $.hideDiv('editStepLabel-'+stepid);//No I18N
}
function updateStepDetails(seqid, stepid)
{
        var steplabel = $('#SeqStepLabel-'+stepid).val();
        if(steplabel.length<=0)
        {
                alert(beanmsg["invalid_label"]);
                $('#SeqStepLabel-'+stepid).focus();
                return;
        }
        var form = document.createElement("form");
        var formid = "seqstep"+stepid;//No I18N
        form.setAttribute("method", "post");
        form.setAttribute("id", formid);
        form.setAttribute("action", "/home/ShowUrlSeqDetails.do");
        form.appendChild(getnewFormElement("hidden","execute","updateStepDetails"));//No I18N
        form.appendChild(getnewFormElement("hidden","seqid",seqid));//No I18N
        form.appendChild(getnewFormElement("hidden","stepid",stepid));//No I18N
        form.appendChild(getnewFormElement("hidden","displayname",steplabel));//No I18N
        document.body.appendChild(form);
        var resp = $.getPostAjaxResponse("/home/ShowUrlSeqDetails.do",formid);//No I18N
        $('#SeqStepLabel-'+stepid).val(steplabel);
        $('#StepLabel-'+stepid).html(steplabel);//No I18N
        $.showDiv('showStepLabel-'+stepid);//No I18N
        $.hideDiv('editStepLabel-'+stepid);//No I18N
}
function updateSeqUrl(id,frm)
{
	var seqlabelid = document.getElementById(id+"-SeqLabel");
	var label = seqlabelid.value.trim();
	seqlabelid.value = label;
	if(label.length<=0)
	{
		alert(beanmsg["invalid_label"]);
		seqlabelid.focus();		
		return;
	}
	var sequrl = document.getElementById(id+"-SeqUrl");
	var url = sequrl.value.trim();
	sequrl.value = url;
        var check = false;
	check = checkUrl(url);
	if(!check)
	{
		alert(beanmsg["invalid_url"]);
		sequrl.focus();
		return;
	}
	var querystr = document.getElementById(id+"-SeqParameters");
	var querystring = querystr.value;
	querystring = querystring.replace(/\n/g,"~s247~");
	var methodvalue = "G";
	var frmmethod = document.getElementsByName("formmethod-"+id);
	for(var i=0;i<frmmethod.length;i++)
	{
		if(frmmethod[i].checked)
		{
			methodvalue = frmmethod[i].value;
		}
	}
	var available = document.getElementById(id+"-SeqAvailable").value.trim();
	var unavailable = document.getElementById(id+"-seqUnAvailable").value.trim();
	var caseSensitivityCheck = document.getElementById(id+"-caseSensitivity");
	var caseSensitivity;
	if(caseSensitivityCheck.checked)
	{
		caseSensitivity='1';
	}
	else
	{
		caseSensitivity='0';
	}
	var availableAlertType = document.getElementById(id+"-SeqAvailable-alertType").value;
	var unavailableAlertType = document.getElementById(id+"-SeqUnAvailable-alertType").value;
	var requestBodyContent = document.getElementById(id+"-req-Body-Content").value;
	var regEx = document.getElementById(id+"-regEx").value.trim();
	var regExAlertType = document.getElementById(id+"-regEx-alertType").value;
	var seqid = document.getElementById("Seqid").value;
	var timeout = document.getElementById(id+"-SeqUrlTimeOut").value;
	var severity = document.getElementById(id+"-severity").value;

	var form = document.createElement("form");
	var formid = "sequrl"+id+""+Number(new Date());//No I18N
	form.setAttribute("method", "post");
	form.setAttribute("id", formid);
        form.setAttribute("action", "/home/ShowUrlSeqDetails.do");
        form.appendChild(getnewFormElement("hidden","execute","updateSeqUrls"));
        form.appendChild(getnewFormElement("hidden","Seqid",seqid));
        form.appendChild(getnewFormElement("hidden","SeqUrlid",id));
        form.appendChild(getnewFormElement("hidden","SeqLabel",label));
        form.appendChild(getnewFormElement("hidden","SeqUrl",url));
        form.appendChild(getnewFormElement("hidden","SeqAvailable",available));
        form.appendChild(getnewFormElement("hidden","SeqAvailableAlertType",availableAlertType));
        form.appendChild(getnewFormElement("hidden","SeqTimeout",timeout));
	form.appendChild(getnewFormElement("hidden","seqUnAvailable",unavailable));
	form.appendChild(getnewFormElement("hidden","seqUnAvailableAlertType",unavailableAlertType));
	form.appendChild(getnewFormElement("hidden","caseSensitivity",caseSensitivity));//No I18N
	form.appendChild(getnewFormElement("hidden","severity",severity));//No I18N
	form.appendChild(getnewFormElement("hidden","regEx",regEx));//No I18N
	form.appendChild(getnewFormElement("hidden","regExAlertType",regExAlertType));//No I18N
	form.appendChild(getnewFormElement("hidden","formmethod",methodvalue));
	form.appendChild(getnewFormElement("hidden","requestBodyContent",requestBodyContent));//No I18N
	form.appendChild(getnewFormElement("hidden","SeqParameters",querystring));
	var currentTime = Number(new Date());
    form.appendChild(getnewFormElement("hidden","ct",currentTime));//No I18N
        document.body.appendChild(form);
	
	/*alert("Form Execute = "+form.execute.value);
	alert("Seqid = "+form.Seqid.value);
	alert("SeqUrlid = "+form.SeqUrlid.value);
	alert("SeqLabel = "+form.SeqLabel.value);
	alert("SeqUrl = "+form.SeqUrl.value);
	alert("SeqAvailable = "+form.SeqAvailable.value);
	alert("seqUnAvailable = "+form.seqUnAvailable.value);
	alert("formmethod = "+form.formmethod.value);
	alert("SeqParameters = "+form.SeqParameters.value);*/
	var resp = $.getPostAjaxResponse("/home/ShowUrlSeqDetails.do",formid);//No I18N
        var updateStatus = getValue(resp,'ax_sequrlupdatestatus');//No I18N
        $('#seqUrlLabel-'+id).html(label);//No I18N
        closeEditSeqUrl(id);
        startHideFade("updatestatus",0.02);//No I18N
}
function onChangeSeqStepCritical(id)
{
        var severity = document.getElementById(id+"-severity").value;
        if(severity==1)
        {
                $("#"+id+"-caseSensitivity").attr("disabled", "disabled");
                $("#"+id+"-SeqAvailable").attr("disabled", "disabled");
                $("#"+id+"-SeqAvailable-alertType").attr("disabled", "disabled");
                $("#"+id+"-seqUnAvailable").attr("disabled", "disabled");
                $("#"+id+"-SeqUnAvailable-alertType").attr("disabled", "disabled");
                $("#"+id+"-regEx").attr("disabled", "disabled");
                $("#"+id+"-regEx-alertType").attr("disabled", "disabled");
        }
        else
        {
                $("#"+id+"-caseSensitivity").removeAttr("disabled");
                $("#"+id+"-SeqAvailable").removeAttr("disabled");
                $("#"+id+"-SeqAvailable-alertType").removeAttr("disabled");
                $("#"+id+"-seqUnAvailable").removeAttr("disabled");
                $("#"+id+"-SeqUnAvailable-alertType").removeAttr("disabled");
                $("#"+id+"-regEx").removeAttr("disabled"); 
                $("#"+id+"-regEx-alertType").removeAttr("disabled");
        }
}
function postShowSeqUrls(result)
{
	var msg = document.getElementById("sequrls");
	msg.innerHTML =result;
}
function deleteSeqUrl(id,count,frm)
{
	var seqid = document.getElementById("Seqid").value;
	if(count==1)
	{
		if(confirm(beanmsg["delete_sequence"]))
		{
			location.href = "../home/ShowUrlSeqDetails.do?execute=delete&urlseqid="+seqid
		}
	}	
	else 
	{
		if(confirm(beanmsg["delete_sequence_url"]))
		{
			var datavalues = "execute=deleteSeqUrls&Seqid="+seqid+"&seqUrlid="+id;//No I18N
			var resp = $.getAjaxResponseWithCSRF("POST","/home/ShowUrlSeqDetails.do",datavalues);//No I18N
			var deleteurlStatus = getValue(resp,'ax_sequrldeletestatus');//No I18N
			var deletestepId = getValue(resp,'ax_deletedStepId');//No I18N
			if(deleteurlStatus=='success')
			{
				$.hideDiv('c'+id);//No I18N
				startHideFade("deletestatus",0.02);//No I18N
			}
			if(deletestepId!='undefined')
			{
				$.hideDiv('step-'+deletestepId);//No I18N
			}
		}
	}
}
function postDeleteSeqUrls(result,frm)
{
	postShowSeqUrls(result);
        startHideFade("deletestatus",0.02);
}
function showdowntimedetails(frm,comments)
{
	var url = "";
	if(frm.locationId==undefined)
	{
		if(comments=='hide')
		{
			url="../login/status.do?execute=showDowntimeDetails&ispublicpage=true&isUrl=false&period="+frm.period.value+"&urlid="+frm.urlid.value+"&comments=";//No I18N
		}
		else
		{
			url="../login/status.do?execute=showDowntimeDetails&ispublicpage=true&isUrl=false&period="+frm.period.value+"&urlid="+frm.urlid.value;//No I18N
		}
	}
	else
	{
		url="../login/status.do?execute=showDowntimeDetails&ispublicpage=true&isUrl=false&period="+frm.period.value+"&locid="+frm.locationId.value+"&urlid="+frm.urlid.value;//No I18N
	}
	if(frm.period.value==50)
	{
		var startdate = $("#actualStartTrigger").val();
	        var enddate = $("#actualEndTrigger").val();
		url = url+"&startDate="+startdate+"&endDate="+enddate;//No I18N
	}
	openNewWindow(url,'report',1000,600);//No I18N
}

function fnOpenNewWindow1(link) 
{ 
	openNewWindow(link,'report',1000,600);//No I18N
}
function showAddGroupForm(url)
{
	hideAll();
	hideDiv("rightPortelIntegration");//NO I18N
	showDiv("rightBasicLayout");//NO I18N
        showDefaultImages();
        //showDiv('loading');
	getHtml(url,"postShowAddForm","GROUP");
}
function showAddMonitor(type,area)
{
	if(type.match("URL-SEQ") || type.match("REALBROWSER") || type.match("PROBE") || type.match("MPROBE") || type.match("MSEXCHANGE") || type.match("BIZTALKSERVER") || type.match("SHAREPOINT") || type.match("SQLSERVER") || type.match("IISSERVER") || type.match("PLUGIN") || type.match("WINDOWSCLUSTER"))
	{
		location.href=newclient_path+"#/admin/inventory/monitors-configure/"+type+"/";
		return;
	}
	else if(type.match("SERVER"))
	{
		location.href=newclient_path+"#/admin/inventory/monitors-configure/"+type+"/windows";
		return;
	}
	else if(type.match("DOCKER"))
	{
		type="DOCKER";//NO I18N
		location.href=newclient_path+"#/admin/inventory/monitors-configure/"+type+"/";
		return;
	}
	else if(type.match("NETWORKDEVICE"))
	{
		location.href=newclient_path+"#/admin/inventory/network-discovery/DEVICE";
		return;
	}
	else
	{
			location.href=newclient_path+"#/admin/inventory/monitors-form/"+type+"/0";
			return;
	}
	
}
function fngooglescript()
{
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-154938-3']);//No I18N
      _gaq.push(['_setDomainName', 'site24x7.com']);//No I18N
      var pluginUrl = '//www.google-analytics.com/plugins/ga/inpage_linkid.js';
      _gaq.push(['_require', 'inpage_linkid', pluginUrl]);//No I18N
      _gaq.push(['_trackPageview']);
      _gaq.push(['_trackPageLoadTime']);

      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = (https_var+':' == document.location.protocol ? https_var+'://ssl' : http_var+'://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
}
function postShowAddForm(result,type)
{
	var divid = "MonitorDiv";
	if(type=="URL-SEQ"){divid="downloadrecorderdiv";}
	else if(type=="GROUP"){divid="MGForm";}
	var msg = document.getElementById(divid);
	msg.innerHTML =result;
	fngooglescript();
    var pollid = getValue(result,'ax_pollid');
	if(type!="URL-SEQ" && type!="GROUP")
	{
		if(pollid!=undefined)
		{
		checkBalance('0',pollid,'0','0',type);
	}
	}
	hideDiv('loadingg');//No I18N
	
	if(document.getElementById("addmonitorform")!=null && document.getElementById('confMonitorTypes')!=null && type.match(document.getElementById('confMonitorTypes').value))
	{
		disableUncheckConfFields();
	}
	else if(document.getElementById("addmonitorform")!=null && type!="SSL_CERT" && type!="URL-SEQ" && type!="GROUP")
	{
		var frm = document.getElementById("addmonitorform");
		disableuncheckedfields(frm);
	}
	showDiv(divid);
}
function showMaintenance()
{
	location.href="/home/scheduleMaintenance.do?execute=showMaintenence";
}
function showReportSettings()
{
	location.href="/home/reportsettings.do?execute=configureMaintenance";
}
function setUpMaintenance()
{
	var radio=document.getElementsByName("buttontype");
	var reqd=null;
	if(radio[0].checked)
	{
			reqd="yes"
	}
	else if(radio[1].checked)
	{
			reqd="no"
	}
	location.href="/home/reportsettings.do?execute=setUpMaintenance&reqd="+reqd;
	//alert('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii'+document.getElementsByName("buttontype"))
	//location.href="/home/reportsettings.do?execute=configureMaintenance";
}
function checkRadio()
{
	var radio=document.getElementsByName("buttontype");
	var reqd=null;
	if(radio[0].checked)
	{
		document.getElementById("mon").style.display = "none"; //No I18N
		document.getElementById("groupMon").style.display = "block"; //No I18N
	}
	else if(radio[1].checked)
	{
		document.getElementById("groupMon").style.display = "none"; //No I18N
		document.getElementById("mon").style.display = "block"; //No I18N
	}
	//location.href="/home/reportsettings.do?execute=setUpMaitenance";
	//alert('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii'+document.getElementsByName("buttontype"))
	//location.href="/home/reportsettings.do?execute=configureMaintenance";
}
function showTools(type)
{
	location.href="/home/tools.do?execute=showTools&type="+type;

}
function showServerToolsMenu(type)
{
	if(type == ''){
		$('#servertoolsmenu').show();
	}else{
		location.href="/home/tools.do?execute=showTools&type="+type;
		$('#servertoolsmenu').hide();
	}
}
function showSla(type)
{
	location.href="/home/SlaReport.do?execute="+type;
}
function generateAPIKey(email)
{
        location.href="/home/accountinfo.do?method=generateAPIKey";
}
function showBusinessHours()
{
	location.href="/home/SlaReport.do?execute=showBusinessHours";
}
function deleteBusinessHours(id)
{
	if(confirm(beanmsg["delete_business_hours"]))
	{
		var datavalues1 = "execute=deleteBusinessHours&businessid="+id; //No I18N
		var response = $.getAjaxResponseWithCSRF("POST","/home/SlaReport.do",datavalues1); //No I18N
		$.hideDiv(id);//No I18N
	}
}
function editBusinessHours(id)
{
	getHtml('../home/SlaReport.do?execute=editBusinessHours&businessid='+id,"postAddBusinessHour");
}
function showNewBusinessHours()
{
	getHtml('../home/SlaReport.do?execute=showNewBusinessHours',"postAddBusinessHour");
}
function postAddBusinessHour(result)
{
	var msg = document.getElementById('showBusinessHours');
	msg.innerHTML =result;
	hideDiv('allbusinesshours');
	showDiv('showBusinessHours');
	if($("#move select[name=sundayEndHour]").val()=='24')
	{
		$("#move select[name=sundayEndMinute]").attr("disabled",true);
	}
	if($("#move select[name=mondayEndHour]").val()=='24')
	{
		$("#move select[name=mondayEndMinute]").attr("disabled",true);
	}
	if($("#move select[name=tuesdayEndHour]").val()=='24')
	{
		$("#move select[name=tuesdayEndMinute]").attr("disabled",true);		
	}
	if($("#move select[name=wednesdayEndHour]").val()=='24')
	{
		$("#move select[name=wednesdayEndMinute]").attr("disabled",true);
	}
	if($("#move select[name=thursdayEndHour]").val()=='24')
	{
		$("#move select[name=thursdayEndMinute]").attr("disabled",true);
	}
	if($("#move select[name=fridayEndHour]").val()=='24')
	{
		$("#move select[name=fridayEndMinute]").attr("disabled",true);
	}
	if($("#move select[name=saturdayEndHour]").val()=='24')
	{
		$("#move select[name=saturdayEndMinute]").attr("disabled",true);
	}
}
function cancelBusinessHours()
{
        location.href="/home/SlaReport.do?execute=showBusinessHours";
}
function updateBusinessHour(frm)
{
	frm.execute.value="updateBusinessHour";
	addBusinessHour(frm);
}
function addBusinessHour(frm)
{
	var name = trimString(frm.businessHourName.value);
	if(name.length<=0)
	{
		alert(beanmsg["businesshour_displayname_empty"]);
		frm.businessHourName.select();
		return false;
	}
	if(!frm.sundayEnabled.checked && !frm.mondayEnabled.checked && !frm.tuesdayEnabled.checked && !frm.wednesdayEnabled.checked && !frm.thursdayEnabled.checked && !frm.fridayEnabled.checked && !frm.saturdayEnabled.checked)
	{
		alert(beanmsg["businesshour_select_day"]);
		return false;
	}
	frm.submit();
}
function deleteNewSlaTarget(key)
{
	var frm = document.getElementById('sla');
	var actionval = frm.execute.value;
        if(actionval=='updateSLACriteria')
        {
                frm.actionperformed.value="edit";
        }
        frm.execute.value="deleteNewSlaTarget";
	frm.keyvalue.value=key;
	var urls =document.getElementById('sla').selectedurls;
	var availableurls =document.getElementById('sla').availableurls;
	selectall(urls);
	selectall(availableurls);
	var CSRFParamNames = document.getElementsByName(CSRFParamName);
	if(CSRFParamNames.length==1)
	{
		frm.removeChild(CSRFParamNames[0]);
	}
	getHtmlForForm(frm,"postAddNewSlaTarget");
}
function deleteHeaderEntry(id)
{
	var table = document.getElementById('additionalHeadersTable');
	var row = table.rows;
	var trid = "additionalHeadersTr"+id;
	var lastElement = table.rows.length;
	for(var i=0;i<row.length;i++)
        {
                var rowid = row[i].id;
		if((lastElement==2 && rowid!=trid) || (i==0 && lastElement==2 && rowid==trid) || (i==(lastElement-1) && lastElement>2))
		{
			var deletedivcontent = "";
			if((i==0 && lastElement==2 && rowid==trid))
			{
				table.deleteRow(i);
				rowid = row[i].id;
			}
			else if((i==(lastElement-1) && lastElement>2))
			{
				i--;
				rowid = row[i].id;
				var temp = rowid.split('additionalHeadersTr');
				deletedivcontent = "<img src=\"/images/wrong.gif\" onClick=\"javascript:deleteHeaderEntry('"+temp[1]+"')\"/>";
				table.deleteRow(i+1);
			}
			var t = rowid.split('additionalHeadersTr');
			var divcontent = "<img src=\"/images/addNew.gif\" onClick=\"javascript:addNewHeaderEntry('"+t[1]+"')\"/>&nbsp;";
			var oldDivId = document.getElementById("additonalHeaderActions"+t[1]);
			oldDivId.innerHTML=divcontent+deletedivcontent;
		}
		if(rowid==trid)
		{
			table.deleteRow(i);
		}
        }
}
function addNewHeaderEntry(id)
{
	var table = document.getElementById("additionalHeadersTable");
	var row = table.rows;
	var nextid = "501";
	var trid = "additionalHeadersTr"+id;
	var positionid = "1";
	var lastElement = table.rows.length;
	for(var i=0;i<row.length;i++)
	{
		var rowid = row[i].id;
		if(rowid==trid)
		{
			positionid = i;
			positionid++;
		}
		if(rowid.indexOf("additionalHeadersTr")>=0)
		{
			var t = rowid.split('additionalHeadersTr');
			if(t[1]>nextid)
			{
				nextid = t[1];
			}
			if(i==(lastElement-1))
                	{
				var oldDivId = document.getElementById("additonalHeaderActions"+t[1]);
				var deletedivcontent = "<img src=\"/images/wrong.gif\" onClick=\"javascript:deleteHeaderEntry('"+t[1]+"')\"/>";
				oldDivId.innerHTML = deletedivcontent;
                	}
		}
	}
	nextid++;
  	var row = table.insertRow(positionid);
	row.id = "additionalHeadersTr"+nextid;
	var cell1 = row.insertCell(0);
  	var element = getnewFormElement("text","additionalHeaderNames("+nextid+")","",20,"formtext");
  	cell1.appendChild(element);
	var cell2 = row.insertCell(1);
  	var element = getnewFormElement("text","additionalHeaderValues("+nextid+")","",20,"formtext");
  	cell2.appendChild(element);
	var cell3 = row.insertCell(2);
	var divcontent = "<img src=\"/images/addNew.gif\" onClick=\"javascript:addNewHeaderEntry('"+nextid+"')\"/>&nbsp;";
	//var divcontent = "<button class=\"css-butt\" onClick=\"javascript:addNewHeaderEntry('"+nextid+"')\">+</button>&nbsp;";
	var deletedivcontent = "<img src=\"/images/wrong.gif\" onClick=\"javascript:deleteHeaderEntry('"+nextid+"')\"/>";
	if(positionid==lastElement)
	{
		divcontent = divcontent+deletedivcontent;
	}
	else
	{
		divcontent = deletedivcontent;	
	}
	var actionsdiv = getnewDivElement("additonalHeaderActions"+nextid,divcontent);
  	cell3.appendChild(actionsdiv);
}
function deleteActionEntry(id)
{
	var table = document.getElementById('additionalActionsTable');
	var row = table.rows;
	var trid = "additionalActionsTr"+id; //No I18N
	var lastElement = table.rows.length;
	for(var i=0;i<row.length;i++)
	{
		var rowid = row[i].id;
		if((lastElement==2 && rowid!=trid) || (i==0 && lastElement==2 && rowid==trid) || (i==(lastElement-1) && lastElement>2))
		{
			var deletedivcontent = "";
			if((i==0 && lastElement==2 && rowid==trid))
			{
				table.deleteRow(i);
				rowid = row[i].id;
			}
			else if((i==(lastElement-1) && lastElement>2))
			{
				i--;
				rowid = row[i].id;
				var temp = rowid.split('additionalActionsTr'); //No I18N

				deletedivcontent = "<img src=\"/images/wrong.gif\" onClick=\"javascript:deleteActionEntry('"+temp[1]+"')\"/>";
				table.deleteRow(i+1);
			}
			var t = rowid.split('additionalActionsTr'); //No I18N
			var divcontent = "<img src=\"/images/addNew.gif\" onClick=\"javascript:addNewActionEntry('"+t[1]+"')\"/>&nbsp;"; //No I18N
			var oldDivId = document.getElementById("additonalGlobalActions"+t[1]);
			oldDivId.innerHTML=divcontent+deletedivcontent;
		}
		if(rowid==trid)
		{
			table.deleteRow(i);
		}
	}
}
function addNewActionEntry(id)
{
	var table = document.getElementById("additionalActionsTable");
	var row = table.rows;
	var nextid = "901";
	var trid = "additionalActionsTr"+id; //No I18N

	var positionid = "1";
	var lastElement = table.rows.length;
	for(var i=0;i<row.length;i++)
	{
		var rowid = row[i].id;
		if(rowid==trid)
		{
			positionid = i;
			positionid++;
		}
		if(rowid.indexOf("additionalActionsTr")>=0)
		{
			var t = rowid.split('additionalActionsTr');
			if(t[1]>nextid)
			{
				nextid = t[1];
			}
			if(i==(lastElement-1))
			{
				var oldDivId = document.getElementById("additonalGlobalActions"+t[1]); //No I18N

				var deletedivcontent = "<img src=\"/images/wrong.gif\" onClick=\"javascript:deleteActionEntry('"+t[1]+"')\"/>"; //No I18N

				oldDivId.innerHTML = deletedivcontent;
			}
		}
	}
	nextid++;
	var row = table.insertRow(positionid);
	row.id = "additionalActionsTr"+nextid;
	var cell1 = row.insertCell(0);
	var element = getnewFormElement("text","additionalActionNames("+nextid+")","",20,"formtext"); //No I18N

	cell1.appendChild(element);
	var cell2 = row.insertCell(1);
	var element = getnewFormElement("text","additionalActionValues("+nextid+")","",20,"formtext"); //No I18N

	cell2.appendChild(element);
	var cell3 = row.insertCell(2);
	var divcontent = "<img src=\"/images/addNew.gif\" onClick=\"javascript:addNewActionEntry('"+nextid+"')\"/>&nbsp;"; //No I18N

	//var divcontent = "<button class=\"css-butt\" onClick=\"javascript:addNewHeaderEntry('"+nextid+"')\">+</button>&nbsp;";
	var deletedivcontent = "<img src=\"/images/wrong.gif\" onClick=\"javascript:deleteActionEntry('"+nextid+"')\"/>"; //No I18N

	if(positionid==lastElement)
	{
		divcontent = divcontent+deletedivcontent;
	}
	else
	{
		divcontent = deletedivcontent;  
	}
	var actionsdiv = getnewDivElement("additonalGlobalActions"+nextid,divcontent); //No I18N

	cell3.appendChild(actionsdiv);
}
function addNewSlaTarget()
{
	var frm = document.getElementById('sla');
	var actionval = frm.execute.value;
	//alert("ACTION BEFORE===>"+actionval);
	if(actionval=='updateSLACriteria')
	{
                frm.actionperformed.value="edit";
	}
	frm.execute.value="addNewSlaTarget";
	
	var urls =document.getElementById('sla').selectedurls;
	var availableurls =document.getElementById('sla').availableurls;
	selectall(urls);
	selectall(availableurls);
	//alert("ACTION AFTER===>"+frm.execute.value);
	var CSRFParamNames = document.getElementsByName(CSRFParamName);
	if(CSRFParamNames.length==1)
	{
		frm.removeChild(CSRFParamNames[0]);
	}
	getHtmlForForm(frm,"postAddNewSlaTarget");
}
function postAddNewSlaTarget(result)
{
	var msg = document.getElementById('showSLAForm');
        msg.innerHTML =result;	
}
function showAddSlaCriteria(executetype,slatype)
{
	location.href="/home/SlaReport.do?execute="+executetype+"&slatype="+slatype;
}

function showLastSLAReportforPortalIntegration(frm)
{
	if(frm.urlid.value==null){ // jshint ignore:line
		frm.urlid.value=frm.sUrlid.value;
	}
	if(frm.slaid.value==null){
		frm.slaid.value=frm.sSlaid.value;
	}
	if(frm.businessid.value==null){
		frm.businessid.value=frm.sBusinessid.value;
	}
		frm.execute.value="showAvailabilitySLAReport"; //No I18N
		frm.action="/login/status.do";
        frm.submit();
}

function showLastSLAReport(frm,reporttype)
{
	if(reporttype=='availability')
        {
		frm.execute.value="showAvailabilitySLAReport";
        }
        if(reporttype=='composite')
        {
		frm.execute.value="showCompositeSLAReport";
        }
        if(reporttype=='responsetime')
        {
		frm.execute.value="showResponseTimeSLAReport";
        }
        frm.action="../home/SlaReport.do";
        frm.submit();
}
function showSLAReport(urlid,slaid,businessid,starttime,endtime,reporttype)
{
	var frm = document.getElementById('SLAAvailabilityURLReportform');
	if(frm == undefined && reporttype=='availability'){ // jshint ignore:line
			window.open("/login/status.do?execute=showAvailabilitySLAReport&urlid="+urlid+"&slaid="+slaid+"&businessid="+businessid+"&starttime="+starttime+"&endtime="+endtime,'','scrollbars=yes,resizable=yes,width=900,height=500');//NO i18N
	}else{
		if(reporttype=='availability')
        	{
			frm = document.getElementById('SLAAvailabilityURLReportform');//NO I18N
        	       	frm.execute.value="showAvailabilitySLAReport";//NO I18N
	        }
	        if(reporttype=='composite')
	        {
			frm = document.getElementById('SLACompositeURLReportform');
			frm.execute.value="showCompositeSLAReport";
	        }
	        if(reporttype=='responsetime')
	        {
			frm = document.getElementById('SLAResponseTimeURLReportform');
			frm.execute.value="showResponseTimeSLAReport";
		}
		var oldslaReportperiod = frm.slaReportperiod.value;
		var slaReportperiod = 1;
		if(oldslaReportperiod==4){slaReportperiod=3;}
		else if(oldslaReportperiod==3 || oldslaReportperiod==2){slaReportperiod=1;}
		else if(oldslaReportperiod==1){slaReportperiod=0;}
		if(frm.urlid.value == null || frm.urlid.value == '' || frm.urlid.value=='null'){ // jshint ignore:line
			frm.urlid.value = urlid;
		}
		frm.slaid.value = slaid;
		frm.businessid.value = businessid;
		frm.slaReportperiod.value = slaReportperiod;
		frm.starttime.value = starttime;
		frm.endtime.value = endtime;
		frm.submit();
	}
}

function show30daySLAReportforPortalIntegration(key)
{
	window.open('../sla.do?id='+key,'','scrollbars=yes,resizable=yes,width=900,height=650');
}

function show30daySLAReport(reporttype,urlid,slaid,businessid)
{
	var idvalue = new String(slaid+''+urlid);
	if(reporttype=='availability')
	{
		window.open('../home/SlaReport.do?execute=showAvailabilitySLAReport&urlid='+urlid+'&slaid='+slaid+'&businessid='+businessid,idvalue,'scrollbars=yes,resizable=yes,width=900,height=500');
	}
	if(reporttype=='composite')
	{
		window.open('../home/SlaReport.do?execute=showCompositeSLAReport&urlid='+urlid+'&slaid='+slaid+'&businessid='+businessid,idvalue,'scrollbars=yes,resizable=yes,width=900,height=600');
	}
	if(reporttype=='responsetime')
	{
		window.open('../home/SlaReport.do?execute=showResponseTimeSLAReport&urlid='+urlid+'&slaid='+slaid+'&businessid='+businessid,idvalue,'scrollbars=yes,resizable=yes,width=900,height=510');
	}
}

function show30daySLARptMobile(reporttype,urlid,slaid,businessid)
{
	var idvalue = new String(slaid+''+urlid);
	if(reporttype=='availability')
	{
		location.href='../home/SlaReport.do?execute=showAvailabilitySLAReport&urlid='+urlid+'&slaid='+slaid+'&businessid='+businessid;
	}
	if(reporttype=='composite')
	{
		location.href='../home/SlaReport.do?execute=showCompositeSLAReport&urlid='+urlid+'&slaid='+slaid+'&businessid='+businessid,idvalue;
	}
	if(reporttype=='responsetime')
	{
		location.href='../home/SlaReport.do?execute=showResponseTimeSLAReport&urlid='+urlid+'&slaid='+slaid+'&businessid='+businessid,idvalue;
	}
}

function urldetailsSLAReport(urlid,divid)
{
	var msg = document.getElementById('URLSLAReport');
	var length = msg.innerHTML.length;
	if(length==0)
	{
		var url = '../home/SlaReport.do?execute=showURLSLAReport&urlid='+urlid;
		getHtml(url,"postURLSLAResp",divid)
	}
	else
	{
		showDiv('URLSLAReport');
		hideDiv(divid);
		hideDiv('loadingg');
	}
}
function postURLSLAResp(result,divid)
{
	var msg = document.getElementById('URLSLAReport');
        msg.innerHTML =result;
	hideDiv(divid);
	showDiv('URLSLAReport');
	hideDiv('loadingg');
}
function oldurldetails(urlid,divid)
{
	hideDiv('URLSLAReport');
	showDiv(divid);
	hideDiv('loadingg');
}
/******Functions for MSP REseller*****/


function updateprice(frm,type)
{
var d=new Date();
frm.ct.value=d.getTime();
updateResellerDetails();
//frm.submit();

}

function hideAllPricingDiv(){
hideDiv('PRICE');
hideDiv('PREMIUM_PRICE');
hideDiv('EE_PRICE');
hideDiv('CURRENCY');
}
function addNewTax(frm,type)
{
	var frm = document.getElementById('resellertax');
	frm.execute.value="addNewDiscountTax";
	frm.type.value=type;
	//frm.submit();
	getHtmlForForm(frm,"postPricing",'TAX_DISCOUNT');
}
function showPricing(type)
{
	var form = document.createElement("form");//No I18N
	form.setAttribute("method", "post");//No I18N
	form.setAttribute("action", "/home/Reseller.do");//No I18N
	var actionmethod = "showResellerPrcing";//No I18N
	if(type=='PRICE' || type=='PREMIUM_PRICE' || type=='EE_PRICE')
	{
		form.appendChild(getnewFormElement("hidden","price",type));//No I18N
	}
	else if(type=='CURRENCY' || type=='LOCATION' || type=='PKG_PRICE')
	{
		form.appendChild(getnewFormElement("hidden","type",type));//No I18N
		actionmethod="showResellerPrcingDetails";//No I18N
	}
	else if(type=='TAX_DISCOUNT')
	{
		actionmethod="showDiscountTaxDetails";//No I18N
	}	
	form.appendChild(getnewFormElement("hidden","execute",actionmethod));//No I18N
	var response = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
	$.hideDiv('laodingDiv');//No I18N
	$("#userarea").html(response);//No I18N
}

function showIframe()
{
	var url="/home/Reseller.do?execute=showResellerIframeWidgets";//No I18N
	location.href=url;	
}

function postPricing(result,type)
{
	var msg = document.getElementById(type);
	msg.innerHTML =result;
	showDiv(type);
	
}

function postUpdate()
{
	alert("updated Successfully");
	msg = document.getElementById('msg');
	if(msg!=null)
	{
		msg.innerHTML="Updated successfully";	
		startHideFade("msgs",0.02);
	}
}

function updateResellerDetails()
{
	var response = $.getPostAjaxResponse("/home/Reseller.do","resellerform");//No I18N
	if(response!=null)
	{
		var message=getValue(response,'ax_msg');//No I18N
		var width = message.length * 11;
		if(message.length<15){width=width+70;}
		status1=getValue(response,'ax_Status');//No I18N
		var width = message.length * 11;
		if(message.length<15){width=width+70;}
		var position1 = $("#resellerform input[name=update]").position();
		var left_pad = position1.left +$("#resellerform input[name=update]").width() + 25;
		var top_pad = position1.top - 6;
		$.showPopUpDiv($.getStatusMsg(status1,message),top_pad,left_pad,'1',width);
		$.fadeOutDiv('popUpFloatingDiv',4000);//No I18N
	}
}
function showMsgDiv(status1,message,fname,elem)
{
	var width = message.length * 11;
	if(message.length<15){width=width+70;}
	var position1 = $("#"+fname+" input[name="+elem+"]").position();
	var left_pad = position1.left + $("#"+fname+" input[name="+elem+"]").width() + 25;
	var top_pad = position1.top - 6;
	$.showPopUpDiv($.getStatusMsg(status1,message),top_pad,left_pad,'1',width);
	$.fadeOutDiv('popUpFloatingDiv',4000);//No I18N
}
function updateResellerPricingDetails(frm,val)
{
	frm.type.value=val;
	updateResellerDetails();
	//getHtmlForForm(frm,"postUpdate",frm);
	
}

function postResellerPricingDetails(result,type)
{
		showPricing(type);
}


function showResellerDetails(exec_method)
{
		var form = document.createElement("form");//No I18N
		form.setAttribute("method", "post");//No I18N
		form.setAttribute("action", "/home/Reseller.do");//No I18N
		form.appendChild(getnewFormElement("hidden","execute",exec_method));//No I18N
		if(exec_method=='showResellerAccounts')
		{
			form.appendChild(getnewFormElement("hidden","userrole",'EVAL_USER'));//No I18N
			form.appendChild(getnewFormElement("hidden","resellerDetail",' '));//No I18N
		}
		if(exec_method=='showResellerSettings' || exec_method=='showProfileDetails' || exec_method=='showResellerIframeWidgets')
		{
			form.appendChild(getnewFormElement("hidden","_",' '));//No I18N	
		}
		var response = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
		$("#userarea").html(response);//No I18N
}
function showResellers(exec_method)
{
 		var form = document.createElement("form");//No I18N
		form.setAttribute("method", "post");//No I18N
		form.setAttribute("action", "/home/Reseller.do");//No I18N
		form.appendChild(getnewFormElement("hidden","execute",exec_method));//No I18N
		form.appendChild(getnewFormElement("hidden","_",''));//No I18N	
		var response = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
		$("#userarea").html(response);//No I18N
}
function showResellerReports(frm)
{
                var frm = document.getElementById("showResellerReports");
		frm.execute.value="showReports"; //No I18N
                    frm.submit();
}
function showResellerEarningsReports(frm)
{
	        var frm = document.getElementById("showResellerEarningsReports");
		frm.submit();
}
function postShowResellerReports(result,frm)
{
                showDiv('Reseller_Report_Info_div'); //No I18N
                        var trans_div = document.getElementById("transaction_div");
                                trans_div.innerHTML = result;
                                        showDiv('transaction_div'); //No I18N

}

function showResellerEdition(val,userid)
{
	var datavalues = "execute=showResellerAccounts&userrole="+val;//No I18N
	if(userid!=null)
	{
		datavalues="execute=showResellerAccounts&userrole="+val+"&userid="+userid;//No I18N
	}
	var response = $.getAjaxResponse("GET","/home/Reseller.do",datavalues);//No I18N
	$("#resellerUserAccountsDiv").html(response);//No I18N
	$.showDiv('resellerUserAccountsDiv');//No I18N
}

function showUsersForReseller(val,userid)
{
	var datavalues = "execute=showResellerAccounts&usertype=ENT_RESELLER&userrole="+val;//No I18N
	if(userid!==null)
 	{
 		datavalues="execute=showResellerAccounts&usertype=ENT_RESELLER&userrole="+val+"&userid="+userid;//No I18N
 	}
 	var response = $.getAjaxResponse("GET","/home/Reseller.do",datavalues);//No I18N
 	$("#resellerUserAccountsDiv").html(response);//No I18N
 	$.showDiv('resellerUserAccountsDiv');//No I18N
}

function postShowResellerEdition(a,frm)
{
	msg = document.getElementById('msgs');
	msg.innerHTML='Updated Successfully';
	var divele=document.getElementById('normal');
	startHideFade("msgs",0.02);
}

function update1(frm)
{
	var companyname = frm.companyName.value;
	companyname = trimString(companyname);
	if(companyname=='')
	{
		alert(resellermsg["companyname_empty"]);	
		frm.companyName.select();
		return;
	}
	var companyNameShort = frm.companyNameShort.value;
	companyNameShort = trimString(companyNameShort);
	if(companyNameShort=='')
	{	
		alert(resellermsg["companyshort_empty"]);	
		frm.companyNameShort.select();
		return;
	}
	var domainName = frm.domainName.value;
	domainName = trimString(domainName);
	if(domainName=='' || domainName==resellermsg["url_eg"])
	{	
		alert(resellermsg["websiteurl_empty"]);	
		frm.domainName.value='';
		frm.domainName.select();
		return;
	}
	var subdomain = frm.resellerSubDomain.value;
        subdomain = trimString(subdomain);
        if(subdomain=='' || subdomain==resellermsg["domain_eg"])
        {
                alert(resellermsg["subdomain_empty"]);
				frm.resellerSubDomain.value='';
                frm.resellerSubDomain.select();
                return;
        }
	var alertEmail = frm.alertEmail.value;
	alertEmail = trimString(alertEmail);
	if(alertEmail=='')
	{	
		alert(resellermsg["alertemail_empty"]);	
		frm.alertEmail.select();
		return;
	}
	var supportEmail = frm.supportEmail.value;
	supportEmail = trimString(supportEmail);
	if(supportEmail=='')
	{	
		alert(resellermsg["supportmail_empty"]);	
		frm.supportEmail.select();
		return;
	}
	var logo = frm.logo.value;
	logo = trimString(logo);
	if(logo=='' || logo==resellermsg["logo_help"])
	{	frm.logo.value='';
		alert(resellermsg["logo_empty"]);	
		frm.logo.select();
		return;
	}
	var logoTitle = frm.logoTitle.value;
	logoTitle = trimString(logoTitle);
	if(logoTitle=='')
	{	
		alert(resellermsg["logotitle_empty"]);	
		frm.logoTitle.select();
		return;
	}
	var userAgent = frm.userAgent.value;
	userAgent = trimString(userAgent);
	if(userAgent=='')
	{	
		alert(resellermsg["useragent_empty"]);	
		frm.userAgent.select();
		return;
	}
	var customQuoteMsg = frm.customQuoteMsg.value;
	customQuoteMsg = trimString(customQuoteMsg);
	if(customQuoteMsg=='')
	{	
		alert(resellermsg["customquote_empty"]);	
		frm.customQuoteMsg.select();
		return;
	}
	var copyright = frm.copyright.value;
	copyright = trimString(copyright);
	if(copyright=='')
	{	
		alert(resellermsg["copyright_empty"]);	
		frm.copyright.select();
		return;
	}
	var favicon=trimString(frm.faviconUrl.value);
	if(favicon==resellermsg["fav_icon_eg"])
	{
		frm.faviconUrl.value='';
	}
	var logoutUrl = frm.logoutUrl.value;
	logoutUrl = trimString(logoutUrl);
	var mlogoutUrl = frm.mobileLogoutUrl.value;
	mlogoutUrl = trimString(mlogoutUrl);
	if(logoutUrl=='' || logoutUrl==resellermsg["logout_eg"])
	{	
		alert(resellermsg["logout_empty"]);	
		frm.logoutUrl.value='';
		frm.logoutUrl.select();		
		return;
	}
	if(!checkUrlPattern(logoutUrl))
	{
		alert(resellermsg["url.startswith"]);
		
		frm.logoutUrl.select();
		
		return;		
	}
	if(mlogoutUrl=='' || mlogoutUrl==resellermsg["mlogout_eg"])
	{
		alert(resellermsg["logout_empty"]);	
		frm.mobileLogoutUrl.value='';
		frm.mobileLogoutUrl.select();
		
		return;
	}
	
	
	if(!checkUrlPattern(mlogoutUrl))
	{
		alert(resellermsg["url.startswith"]);
		frm.mobileLogoutUrl.select();
		return;		
	}
	updateResellerDetails();
	//frm.submit();
}
function updateProfile(frm)
{
	getHtmlForForm(frm, "postUpdate",frm);
}


function onlyNos(evnt) {
            try {
		if(evnt.charCode > 47 && evnt.charCode < 58)
		{
			return true;
		}
		else
		{
			return false;
		}
            }
            catch (err) {
            
            }
        }
function showAmount()
{
	var packageName = document.getElementsByName("packageName")[0].value;
	var basicAddon = document.getElementsByName("basicAddOnCount")[0].value;
	var advancedAddon = document.getElementsByName("advanceAddOnCount")[0].value;
	var paymentMode = document.getElementsByName("paymentMode")[0].value;
	var reselleruserid=document.getElementsByName("reselleruserid")[0].value;
	var response = $.getAjaxResponseWithCSRF("POST","/home/Reseller.do?execute=calculateResellerUserPack&reselleruserid="+reselleruserid+"&packageName="+packageName+"&basicAddOnCount="+basicAddon+"&advanceAddOnCount="+advancedAddon+"&paymentMode="+paymentMode+"&ajax="+true);//No I18N
		var statusmsg = getValue(response,'ax_chargeamount');//NO I18N
		var isBasicAddOnSupported = getValue(response,'ax_isBasicAddOnSupported');//NO I18N
		var isAdvanceAddOnSupported = getValue(response,'ax_isAdvanceAddOnSupported');//NO I18N
		var isBasicAddOnCount = getValue(response,'ax_isBasicAddOnCount');//NO I18N
		var isAdvanceAddOnCount = getValue(response,'ax_isAdvanceAddOnCount');//NO I18N
		
		if(isBasicAddOnSupported=="false")
		{
			$('#basicAddOn').addClass('input-disabled')
			$('#advanceAddOn').addClass('input-disabled')
			$('#basicAddOn').attr('readonly', true);
			$('#advanceAddOn').attr('readonly', true);
			$('#basicAddOn').val('')
			$('#advanceAddOn').val('')
		}
		
		if(isBasicAddOnSupported=="true" && isAdvanceAddOnSupported =="false")
		{
			$('#basicAddOn').removeAttr('readonly');
			$('#basicAddOn').removeClass('input-disabled');
			$('#advanceAddOn').addClass('input-disabled')
			$('#advanceAddOn').attr('readonly', true);
			$('#advanceAddOn').val('')
		}
		
		if(isBasicAddOnSupported == "true" && isAdvanceAddOnSupported =="true")
		{
			$('#basicAddOn').removeAttr('readonly');
			$('#basicAddOn').removeClass('input-disabled');
			$('#advanceAddOn').removeAttr('readonly');
			$('#advanceAddOn').removeClass('input-disabled');
		}
		
		if(basicAddon=="")
		{
			$("#basicaddonDiv").html(0);
		}
		else
		{s
			$("#basicaddonDiv").html(" "+basicAddon);
		}
		if(advancedAddon=="")
		{
			$("#advanceaddonDiv").html(0);
		}
		else
		{
			$("#advanceaddonDiv").html(" "+advancedAddon);
		}
		if(statusmsg!=null || statusmsg !=undefined)
		{
			$("#amountDiv").html(" "+statusmsg);//No I18N
			$.showDiv('totalamount');//No I18N
			$("#totalcostDiv").html(" "+statusmsg);
		}
}
function upgradeAction()
{
	var packageName =  $('select[name="packageName"] option:selected').text();
	$("#packName").html(" "+packageName);//No I18N
	var basicAddon = document.getElementsByName("basicAddOnCount")[0].value;
	var advancedAddon = document.getElementsByName("advanceAddOnCount")[0].value;
	var paymentMode =  $('select[name="paymentMode"] option:selected').text();
	$("#paymentDiv").html(" "+paymentMode);//No I18N
	$.hideDiv('calculationDiv');//No I18N
	$.showDiv('upgradedetailsDiv');//No I18N
}
function backtoForm()
{
	location.reload();
}
function upgradeCustomer(form)
{
	form.submit();
}
function addsmscredits(form)
{
	var creditsVal = $("[name='SMScredits']").val();
	if(creditsVal != "")
	{
		form.submit();
	}
	else
	{
		alert(beanmsg["reseller.credits.emptyform"])
	}
}

function invokeAction(frm,val,username,userid,resellerid,role,subreseller)
{
	//var resellerid=document.getElementById("resellerid").value;
	if(val==1)
	{
		location.href="/home/Reseller.do?execute=showresellerupgradescreen&price=PRICE&isreseller=true&userid="+userid;
		return;
	}
	if(val==2)
	{
		location.href="/home/Reseller.do?execute=showresellerupgradescreen&price=PREMIUM_PRICE&isreseller=true&userid="+userid;
		return;
	}
	if(val==3)
	{
		location.href = "/home/Reseller.do?execute=showresellerupgradescreen&price=EE_PRICE&isreseller=true&userid="+userid;
		return;
	}if(val==4)
	{
		if(confirm(resellermsg["terminate"]))
		{
			$.showDiv('laodingDiv');//No I18N
			var form = document.createElement("form");//No I18N
			form.setAttribute("method", "post");//No I18N
			form.setAttribute("action", "/home/Reseller.do");//No I18N
			form.appendChild(getnewFormElement("hidden","execute","deactivateAccount"));//No I18N
			form.appendChild(getnewFormElement("hidden","username",username));//No I18N
			form.appendChild(getnewFormElement("hidden","userid",userid));//No I18N
			form.appendChild(getnewFormElement("hidden","edition",role));//No I18N
			form.appendChild(getnewFormElement("hidden","_",''));//No I18N
			var response = $.getAjaxResponseWithCSRF("POST",form.action,$(form).serialize());//No I18N
			$.hideDiv('laodingDiv');//No I18N
			$.hideDiv('reselleruserDetailsDiv');//No I18N
			$.hideDiv('resellerActionDiv');//No I18N
			$.hideDiv('topborderDiv');//No I18N
			$.hideDiv('bottomborderDiv');//No I18N
			$("#actionDiv").html(response);//No I18N
			$.showDiv('actionDiv');//No I18N
		}
	}
	
	if(val==6)
	{
		var datavalues = "execute=ResellerActions&resellerid="+resellerid+"&username="+encodeURIComponent(username)+"&userid="+userid+"&action=smscredits";//No I18N
		var response = $.getAjaxResponse("POST","/home/Reseller.do",datavalues);//No I18N
		$.hideDiv('reselleruserDetailsDiv');//No I18N
		$.hideDiv('resellerActionDiv');//No I18N
		$.hideDiv('topborderDiv');//No I18N
		$.hideDiv('bottomborderDiv');//No I18N
		$.hideDiv('msgDiv');//No I18N
		$("#actionDiv").html(response);//No I18N
		$.showDiv('actionDiv');//No I18N
		return;
	}
	if(val==5)
	{
		var datavalues = "execute=ResellerActions&resellerid="+resellerid+"&username="+encodeURIComponent(username)+"&userid="+userid+"&transType=add&action=credits";//No I18N
		
		var response = $.getAjaxResponse("GET","/home/Reseller.do",datavalues);//No I18N
		$.hideDiv('reselleruserDetailsDiv');//No I18N
		$.hideDiv('resellerActionDiv');//No I18N
		$.hideDiv('topborderDiv');//No I18N
		$.hideDiv('bottomborderDiv');//No I18N
		$.hideDiv('msgDiv');//No I18N
		$("#actionDiv").html(response);//No I18N
		$.showDiv('actionDiv');//No I18N
		return;
	}	
	if(val==7)
	{
		var datavalues = "execute=ResellerActions&resellerid="+resellerid+"&username="+encodeURIComponent(username)+"&userid="+userid+"&action=changecommission";//No I18N
		
		var response = $.getAjaxResponse("GET","/home/Reseller.do",datavalues);//No I18N
		$.hideDiv('reselleruserDetailsDiv');//No I18N
		$.hideDiv('resellerActionDiv');//No I18N
		$.hideDiv('topborderDiv');//No I18N
		$.hideDiv('bottomborderDiv');//No I18N
		$.hideDiv('msgDiv');//No I18N
		$("#actionDiv").html(response);//No I18N
		$.showDiv('actionDiv');//No I18N
		return;
	}
	if(val==8)
	{
		location.href="/home/Reseller.do?execute=showUserSignupForm&reselleruserid="+userid;
	}
	if(val==9)
	{
	        location.href="/home/Reseller.do?execute=showUserMappingForm&reselleruserid="+userid;
	}
	if(val==10)
	{
			$.showDiv('laodingDiv');//No I18N
			var form = document.createElement("form");//No I18N
			form.setAttribute("method", "post");//No I18N
			form.setAttribute("action", "/home/Reseller.do");//No I18N
			form.appendChild(getnewFormElement("hidden","execute","showResellerProfileDetails"));//No I18N
			form.appendChild(getnewFormElement("hidden","userid",userid));//No I18N
			form.appendChild(getnewFormElement("hidden","_",''));//No I18N
			var response = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
			$.hideDiv('laodingDiv');//No I18N
			$.hideDiv('reselleruserDetailsDiv');//No I18N
			$.hideDiv('resellerActionDiv');//No I18N
			$.hideDiv('topborderDiv');//No I18N
			$.hideDiv('bottomborderDiv');//No I18N
			$("#actionDiv").html(response);//No I18N
			$.showDiv('actionDiv');//No I18N
			$.showDiv('msgDiv');//No I18N
	}
	if(val==11)
	{
		if(confirm(resellermsg["enableautorecharge"]))
		{
			//location.href="/home/Reseller.do?execute=autoRecharge&username="+username+"&type=enable"; //No I18N
			$.showDiv('laodingDiv');//No I18N
			var form = document.createElement("form");//No I18N
			form.setAttribute("method", "post");//No I18N
			form.setAttribute("action", "/home/Reseller.do");//No I18N
			form.appendChild(getnewFormElement("hidden","execute","autoRecharge"));//No I18N
			form.appendChild(getnewFormElement("hidden","username",username));//No I18N
			form.appendChild(getnewFormElement("hidden","type","enable"));//No I18N
			form.appendChild(getnewFormElement("hidden","_",''));//No I18N
			var response = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
			$.hideDiv('laodingDiv');//No I18N
			$.hideDiv('reselleruserDetailsDiv');//No I18N
			$.hideDiv('resellerActionDiv');//No I18N
			$.hideDiv('topborderDiv');//No I18N
			$.hideDiv('bottomborderDiv');//No I18N
			$("#actionDiv").html(response);//No I18N
			$.showDiv('actionDiv');//No I18N
			$.showDiv('msgDiv');//No I18N
		}
	}
	if(val==12)
	{
		if(confirm(resellermsg["disableautorecharge"]))
		{
			//location.href="/home/Reseller.do?execute=autoRecharge&username="+username+"&type=disable"; //No I18N
			$.showDiv('laodingDiv');//No I18N
			var form = document.createElement("form");//No I18N
			form.setAttribute("method", "post");//No I18N
			form.setAttribute("action", "/home/Reseller.do");//No I18N
			form.appendChild(getnewFormElement("hidden","execute","autoRecharge"));//No I18N
			form.appendChild(getnewFormElement("hidden","username",username));//No I18N
			form.appendChild(getnewFormElement("hidden","type","disable"));//No I18N
			form.appendChild(getnewFormElement("hidden","_",''));//No I18N
			var response = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
			$.hideDiv('laodingDiv');//No I18N
			$.hideDiv('reselleruserDetailsDiv');//No I18N
			$.hideDiv('resellerActionDiv');//No I18N
			$.hideDiv('topborderDiv');//No I18N
			$.hideDiv('bottomborderDiv');//No I18N
			$("#actionDiv").html(response);//No I18N
			$.showDiv('actionDiv');//No I18N
			$.showDiv('msgDiv');//No I18N
		}
	}
	if(val==13)
        {
                if(confirm(resellermsg["enableresellerlogin"]))
                {
			$.showDiv('laodingDiv');//No I18N
			var form = document.createElement("form");//No I18N
			form.setAttribute("method", "post");//No I18N
			form.setAttribute("action", "/home/Reseller.do");//No I18N
			form.appendChild(getnewFormElement("hidden","execute","allowLogin"));//No I18N
			form.appendChild(getnewFormElement("hidden","username",username));//No I18N
			form.appendChild(getnewFormElement("hidden","type","enable"));//No I18N
			form.appendChild(getnewFormElement("hidden","userid",userid));//No I18N
			form.appendChild(getnewFormElement("hidden","_",''));//No I18N
			var response = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
			//location.reload(true);
			$.hideDiv('laodingDiv');//No I18N
			$.hideDiv('reselleruserDetailsDiv');//No I18N
			$.hideDiv('resellerActionDiv');//No I18N
			$.hideDiv('topborderDiv');//No I18N
			$.hideDiv('bottomborderDiv');//No I18N
			$("#actionDiv").html(response);//No I18N
			$.showDiv('actionDiv');//No I18N
			$.showDiv('msgDiv');//No I18N
                }
        }
    if(val==14)
    {
            if(confirm(resellermsg["disableresellerlogin"]))
            {
                    //location.href="/home/Reseller.do?execute=allowLogin&username="+username+"&type=disable"; //No I18N
		     	$.showDiv('laodingDiv');//No I18N
			var form = document.createElement("form");//No I18N
			form.setAttribute("method", "post");//No I18N
			form.setAttribute("action", "/home/Reseller.do");//No I18N
			form.appendChild(getnewFormElement("hidden","execute","allowLogin"));//No I18N
			form.appendChild(getnewFormElement("hidden","username",username));//No I18N
			form.appendChild(getnewFormElement("hidden","type","disable"));//No I18N
			form.appendChild(getnewFormElement("hidden","userid",userid));//No I18N
			form.appendChild(getnewFormElement("hidden","_",''));//No I18N
			var response = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
			$.hideDiv('laodingDiv');//No I18N
			$.hideDiv('reselleruserDetailsDiv');//No I18N
			$.hideDiv('resellerActionDiv');//No I18N
			$.hideDiv('topborderDiv');//No I18N
			$.hideDiv('bottomborderDiv');//No I18N
			$("#actionDiv").html(response);//No I18N
			$.showDiv('actionDiv');//No I18N
			$.showDiv('msgDiv');//No I18N
            }
    }
    if(val==15)
    {
		var datavalues = "execute=ResellerActions&resellerid="+resellerid+"&username="+username+"&userid="+userid+"&transType=add&action=usercredits";//No I18N
		
		var response = $.getAjaxResponse("GET","/home/Reseller.do",datavalues);//No I18N
		$.hideDiv('reselleruserDetailsDiv');//No I18N
		$.hideDiv('resellerActionDiv');//No I18N
		$.hideDiv('topborderDiv');//No I18N
		$.hideDiv('bottomborderDiv');//No I18N
		$("#actionDiv").html(response);//No I18N
		$.showDiv('actionDiv');//No I18N
		return;
    }
    if(val==16)
    {
	if(confirm(resellermsg["deactivate"]))
		{
		$.showDiv('laodingDiv');//No I18N
		var form = document.createElement("form");//No I18N
		form.setAttribute("method", "post");//No I18N
		form.setAttribute("action", "/home/Reseller.do");//No I18N
		form.appendChild(getnewFormElement("hidden","execute","deActivateResellerUser"));//No I18N
		form.appendChild(getnewFormElement("hidden","userId",userid));//No I18N
		form.appendChild(getnewFormElement("hidden","edition",role));//No I18N
		form.appendChild(getnewFormElement("hidden","_",''));//No I18N
		var response = $.getAjaxResponseWithCSRF("POST",form.action,$(form).serialize());//No I18N
		$.hideDiv('laodingDiv');//No I18N
		$.hideDiv('reselleruserDetailsDiv');//No I18N
		$.hideDiv('resellerActionDiv');//No I18N
		$.hideDiv('topborderDiv');//No I18N
		$.hideDiv('bottomborderDiv');//No I18N
		$("#actionDiv").html(response);//No I18N
		$.showDiv('actionDiv');//No I18N
		}
    }
    if(val==17)
    {
       if(confirm(resellermsg["downgrade"]))
		{
		$.showDiv('laodingDiv');//No I18N
		var form = document.createElement("form");//No I18N
		form.setAttribute("method", "post");//No I18N
		form.setAttribute("action", "/home/Reseller.do");//No I18N
		form.appendChild(getnewFormElement("hidden","execute","downgradeAccount"));//No I18N
		form.appendChild(getnewFormElement("hidden","userid",userid));//No I18N
		form.appendChild(getnewFormElement("hidden","price","PREMIUM_PRICE"));//No I18N
		form.appendChild(getnewFormElement("hidden","_",''));//No I18N
		var response = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
		$.hideDiv('laodingDiv');//No I18N
		$.hideDiv('reselleruserDetailsDiv');//No I18N
		$.hideDiv('resellerActionDiv');//No I18N
		$.hideDiv('topborderDiv');//No I18N
		$.hideDiv('bottomborderDiv');//No I18N
		$("#actionDiv").html(response);//No I18N
		$.showDiv('actionDiv');//No I18N
		$.showDiv('msgDiv');//No I18N
		}
    }	
        
}

function addfunds(frm,actionmethod)
{
		if(frm.credits.value=='')
		{

			alert("Enter amount to be added to users account");//No I18N
			return;
		}
		if(isNaN(frm.credits.value))
		{
			alert("Enter digit format of amount to be credited to users account");//No I18N
			return;
		}
		$.showDiv('laodingDiv');//No I18N
		var form = document.createElement("form");//No I18N
		form.setAttribute("method", "post");//No I18N
		form.setAttribute("action", "/home/Reseller.do");//No I18N
		form.appendChild(getnewFormElement("hidden","execute",actionmethod));//No I18N
		form.appendChild(getnewFormElement("hidden","username",frm.username.value));//No I18N
		form.appendChild(getnewFormElement("hidden","userid",frm.userid.value));//No I18N
		form.appendChild(getnewFormElement("hidden","credits",frm.credits.value));//No I18N
		form.appendChild(getnewFormElement("hidden","reseller_loginid",frm.reseller_loginid.value));//No I18N
		form.appendChild(getnewFormElement("hidden","_",''));//No I18N
		var response = $.getAjaxResponseWithCSRF("POST",form.action,$(form).serialize());//No I18N
		if (window.opener)
		{
			$.hideDiv('laodingDiv');//No I18N
			alert("Credits transferred successfully");//No I18N
			window.opener.location.href="/home/Reseller.do?execute=showResellers";
			window.close();
			return;
		}
		else
		{
		$.hideDiv('laodingDiv');//No I18N
		$("#actionDiv").html(response);//No I18N
		$.showDiv('actionDiv');//No I18N
		$.showDiv('msgDiv');//No I18N
		$.hideDiv('detailsloadingDiv');//No I18N
		$.hideDiv('reselleruserDetailsDiv');//No I18N
		$.hideDiv('resellerActionDiv');//No I18N
		$.hideDiv('topborderDiv');//No I18N
		$.hideDiv('bottomborderDiv');//No I18N
		}
}

function activate(userid,edition)
{
		var form = document.createElement("form");//No I18N
		form.setAttribute("method", "post");//No I18N
		form.setAttribute("action", "/home/Reseller.do");//No I18N
		form.appendChild(getnewFormElement("hidden","execute","activateResellerUser"));//No I18N
		form.appendChild(getnewFormElement("hidden","userId",userid));//No I18N
		form.appendChild(getnewFormElement("hidden","edition",edition));//No I18N
		form.appendChild(getnewFormElement("hidden","_",''));//No I18N
		var response = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
		$("#resellerUserAccountsDiv").html(response);//No I18N
		$.showDiv('resellerUserAccountsDiv');//No I18N
}
function changeRowColor(type,this1,this2)
{
  var id1 = document.getElementById(this1);
  var id2 = document.getElementById(this2);
  if(type == 'mouseover')
  {
    id1.className='hoverrow';  
    if(document.getElementById(this2).style.display!='none')
    {
      id2.className='hoverrow';  
    }
  }
  if(type == 'mouseout')
  {
    id1.className='odd';  
    if(document.getElementById(this2).style.display!='none')
    {
      id2.className='';  
    }
  }
 }
function changeCommission(frm)
{
if(frm.commission.value=='')
{
alert(beanmsg["wrongcommission"])
return;
}
if(isNaN(frm.commission.value))
{
alert(beanmsg["digitformofcommission"]);
return;
}
		$.showDiv('laodingDiv');//No I18N
		var form = document.createElement("form");//No I18N
		form.setAttribute("method", "post");//No I18N
		form.setAttribute("action", "/home/Reseller.do");//No I18N
		form.appendChild(getnewFormElement("hidden","execute","changeCommission"));//No I18N
		form.appendChild(getnewFormElement("hidden","reseller_loginid",frm.reseller_loginid.value));//No I18N
		form.appendChild(getnewFormElement("hidden","userid",frm.userid.value));//No I18N
		form.appendChild(getnewFormElement("hidden","commission",frm.commission.value));//No I18N
		form.appendChild(getnewFormElement("hidden","username",frm.username.value));//No I18N
		form.appendChild(getnewFormElement("hidden","_",''));//No I18N
		var response = $.getAjaxResponseWithCSRF("POST",form.action,$(form).serialize());//No I18N
		$.hideDiv('laodingDiv');//No I18N
		$.hideDiv('reselleruserDetailsDiv');//No I18N
		$.hideDiv('resellerActionDiv');//No I18N
		$.hideDiv('topborderDiv');//No I18N
		$.hideDiv('bottomborderDiv');//No I18N
		$("#actionDiv").html(response);//No I18N
		$.showDiv('actionDiv');//No I18N
		$.showDiv('msgDiv');//No I18N
}
function getResellerUserAccounts(userid,count)
{
		var form = document.createElement("form");//No I18N
		form.setAttribute("method", "post");//No I18N
		form.setAttribute("action", "/home/Reseller.do");//No I18N
		form.appendChild(getnewFormElement("hidden","execute","showResellerAccounts"));//No I18N
		form.appendChild(getnewFormElement("hidden","userid",userid));//No I18N
		form.appendChild(getnewFormElement("hidden","userrole",'EVAL_USER'));//No I18N
		form.appendChild(getnewFormElement("hidden","resellerDetail",' '));//No I18N
		//form.appendChild(getnewFormElement("hidden","_",''));//No I18N
		var response = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
		$("#userarea").html(response);//No I18N
		$.hideDiv('laodingDiv');//No I18N
		$.hideDiv('msgDiv');//No I18N
		return;

/*        var trans_div = document.getElementById("showresellercustomers"+count);
	if(trans_div.style.display=='block')
		{
			hideDiv('showresellercustomers'+count);
				return;
		}

       	getHtml('/home/Reseller.do?execute=showResellerAccounts&userrole=EVAL_USER&userid='+userid, "postResellerUserAccounts",count);*/
}
function showSubresellerDetails(userid)
{
		$.showDiv('laodingDiv');//No I18N
		var form = document.createElement("form");//No I18N
		form.setAttribute("method", "post");//No I18N
		form.setAttribute("action", "/home/Reseller.do");//No I18N
		form.appendChild(getnewFormElement("hidden","execute","showSubResellerDetails"));//No I18N
		form.appendChild(getnewFormElement("hidden","userid",userid));//No I18N
		form.appendChild(getnewFormElement("hidden","_",''));//No I18N
		var response = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
		$("#userarea").html(response);//No I18N
		$.hideDiv('laodingDiv');//No I18N
		$.hideDiv('msgDiv');//No I18N
		return;
}
function postResellerUserAccounts(result,count)
{
 	showDiv('showresellercustomers'+count); //No I18N
       var trans_div = document.getElementById("showresellercustomers"+count);
       trans_div.innerHTML = result;
}

function upgraderesellerclient(frm)
{
	document.getElementById("methodname").value="upgradeClient";
	frm.submit();
}
function upgradeentreselleruserclient(frm)
{
	document.getElementById("methodname").value="upgradeEdition"; //No I18N
        frm.submit();
}


function getQuote(frm,profileupdated) 
   { 
   		if(profileupdated=='true')
   		{
   			frm.method.value="commit";
       		var hidvar = document.getElementById("methodname");
       		hidvar.value="commit";
       		var param=verifyNewClient();
			if(param!=null && !document.getElementsByName("nc"))    
       		{
       			frm.appendChild(getnewFormElement("hidden","nc","billing"));//No I18N
       		}
            frm.action='/home/accountinfo.do';
            frm.submit(); 	         
		
   		}else
   		{
   			alert(resellermsg["quote_notsent"]);
   		}
   } 
   
   function showTransactions(username,userid)
   {
	   window.open( '/home/accountinfo.do?method=showTransactions&username='+encodeURIComponent(username)+'&userid='+userid, '','scrollbars=yes,resizable=yes,width=700,height=400,left=150,top=100');
   }
     
   function postResellerTerminate(a,role)
   {
   	showResellerEdition(role,null);
   }
function addSMSPack(item,topupscreen)
{
	frm = document.getElementById('updatebtn').form;
	frm.method.value="addsmspack";
	if(topupscreen=='true')
	{
		frm.action="/home/accountinfo.do?additem="+item+"&topupscreen="+topupscreen;
	}
	else
	{
		frm.method.value="addsmspack";
		frm.action="/home/accountinfo.do?additem="+item;
		document.getElementById("methodname").value="addsmspack";
	}
	frm.price.value;
	getHtmlForForm(frm,"postshowupgradescreen");
}

/***END**/
function showReferralProgram(){	
	location.href="/home/accountinfo.do?method=joinReferralProgram";	
}
function joinReferralProgram(frm){
	frm.submit();
}
function showReferrals(){
	location.href='/home/accountinfo.do?method=showReferrals';
}
function showreferrals(index){
	getHtml('/home/accountinfo.do?method=showReferrals&ajax=true&index='+index, "postshowReferrals",index, false);
}
function showReferFriends(){
	var url=window.location.href;
	var position=url.indexOf("nc=");
	if(position!=-1)
	{
		var param=url.substring(position,url.length);
		if(param.indexOf("referral")!=-1)
			{
			location.href="/home/accountinfo.do?method=referYourFriend&"+param;
			}
		else
			{
			location.href="/home/accountinfo.do?method=referYourFriend";
			}
	}
	else
		{
		location.href="/home/accountinfo.do?method=referYourFriend";
		}
}
function postshowReferrals(result,index){
	hideDiv("tr_"+index);
	document.getElementById("div_"+index).innerHTML=result;
}
function showreferralLink(){
	var param=verifyNewClient();
	if(param!=null)
	{
	location.href= '/home/accountinfo.do?method=showReferralLink&nc=referral';
	}
	else
	{
	location.href= '/home/accountinfo.do?method=showReferralLink';
	}
}
function showReferralCredits()
{
	location.href= '/home/accountinfo.do?method=showReferralCredits';
}
 
function showAccountHome(){
 	location.href = "/home/accountinfo.do?method=showaccountdetails";
}
function updateDowntimeReason(frm)
{
	var reason = trimString(frm.shortreason.value);
	var downtime = frm.downtime.value;
	getHtmlForForm(frm,"updateComments",downtime);
}	
function updateComments(result,downtime)
{
	var reason = getValue(result,'ax_downtimereason');
	var id = 'downdescATag'+downtime;
	if(reason=='')
	{
		reason="&nbsp;";
	}
	document.getElementById(id).innerHTML = reason;
	closeDialog();
}
function postUptimeBtn(ajaxRsp) 
{
	if(ajaxRsp != null && ajaxRsp != "" && ajaxRsp != undefined){
		statuskey = getValue(ajaxRsp,'ax_statuskey');//NO i18N
		var protocol = getValue(ajaxRsp,'ax_protocol');//NO i18N
		var hostname = getValue(ajaxRsp,'ax_hostname');//NO i18N
		var buttonhostname = getValue(ajaxRsp,'ax_buttonhostname');//NO i18N
		v=getValue(ajaxRsp,'ax_uptime');//NO i18N
		var f=document.getElementById("uptimefrm");//NO i18N

		buttontype="";//NO i18N
		radios = document.getElementsByName("buttontype");//NO i18N
		for (i = 0; i < radios.length; i++) 
		{
			if(radios[i].checked) 
			{
				buttontype=radios[i].value;
			}
		}
		var bcode=getButtonCode(buttontype,protocol,hostname,buttonhostname,statuskey,v);
		document.getElementById("buttoncode").value=bcode;//NO i18N
		add=getValue(ajaxRsp,'ax_add');//NO i18N
		hideDiv("uptimebuttonerrormsg"); //NO i18N
		if(add=='true')
		{
			showRowDiv("btncodetr");//NO i18N
			showRowDiv("btncodeinserttr");//NO i18N
			elem=getObj("generate");//NO i18N
			if(elem)
			{
				elem.value=uptimebtnmsg.uptimebtn_regenerate;//NO i18N
				document.getElementById("edit").value='true';//NO i18N		
			}
		}
	}
} 
  
function genUptimeBtn()
{
	enablesignup=document.getElementById("signupEnabled").checked;	
	if(enablesignup)
	{
		var url="/home/UptimeButton.do?execute=isViralReseller";
	 	http.open("GET",url,true); 
	 	http.onreadystatechange = UptimeBtnCheck;
	 	http.send(null);
	 	return;		
	}
	else
	{
		generateUptimeBtn();
	}	
}
 
function generateUptimeBtn()
{
	minUptime=document.getElementById("minUptime").value; 
	if(isNaN(minUptime) || minUptime<1 || minUptime>100)
	{
		alert(beanmsg["uptime_btn_minUptime"]);
		document.getElementById("minUptime").value=99;
		document.getElementById("minUptime").focus();
		return false;
	}
 	selurl=document.getElementById("selectedurlid").value;
	buttontype="";
	radios = document.getElementsByName("buttontype");
        for (i = 0; i < radios.length; i++) 
	{
        	if(radios[i].checked)
		{
			buttontype=radios[i].value;
		}
        }
	edit=document.getElementById("edit").value;
	var url="/home/UptimeButton.do";//NO I18N
	var params = "execute=generateUptimeButtonCode&selectedurlid="+selurl+"&minUptime="+minUptime+"&buttontype="+buttontype+"&signupEnabled="+enablesignup;//NO I18N
	if(edit=='true')
	{
		url="/home/UptimeButton.do";//NO I18N
		params = "execute=regenerateUptimeButtonCode&selectedurlid="+selurl+"&minUptime="+minUptime+"&buttontype="+buttontype+"&signupEnabled="+enablesignup;//NO i18N
	}
	var ajaxRsp = $.getAjaxResponseWithCSRF("GET",url,params);//NO I18N
	postUptimeBtn(ajaxRsp);
} 	 
function UptimeBtnCheck()
{
	if(http.readyState == 4) 
	{ 
		result = http.responseText;                    
		reseller = getValue(result,'ax_reseller');
		if(reseller!=undefined)
		{
			if(reseller=='true')
			{
				generateUptimeBtn();
				return;
			}
			else
			{
				showRowDiv("uptimebuttonerrormsg");
			}
		}
		statuskey = getValue(result,'ax_statuskey');
		if(statuskey!=undefined)
		{
			v=getValue(result,'ax_uptime');
			var f=document.getElementById("uptimefrm");
			hideDiv("uptimebuttonerrormsg"); 
			showRowDiv("btncodetr"); 
			showRowDiv("btncodeinserttr"); 
			buttontype="";
			radios = document.getElementsByName("buttontype");
			for (i = 0; i < radios.length; i++) 
			{
				if(radios[i].checked) 
				{
					buttontype=radios[i].value;
				}
			}
			var protocol = "http";	
			var bcode=getButtonCode(buttontype,protocol,f.hostname.value,f.buttonhost.value,statuskey,v);
			document.getElementById("buttoncode").value=bcode;
			add=getValue(result,'ax_add');
			if(add=='true')
			{
				elem=getObj("generate"); 
				if(elem)
				{
					elem.value=uptimebtnmsg["uptimebtn_regenerate"];
					document.getElementById("edit").value='true';			
				}
			}
		}
	}
}  
function getButtonCode(buttontype,protocol,hostname,buttonhost,statuskey,v)
{
	var publicurl=protocol+"://"+hostname+"/login/status.do?execute=StatusReport&u=true&p="+statuskey;
        var burl=protocol+"://"+buttonhost+"/app/website-uptime.html?v="+v;
	if(buttontype=='1'){
			bcode="<a href=\""+publicurl+"\" style=\"color:#FFFFFF;text-decoration:none;cursor:pointer;\"><span style=\"text-align:center;display:inline-block;text-transform:0px;text-indent:2px;background-color:#FF6600;font-weight:bold;line-height:12px;margin:0px;padding:0px;border:1px solid #E84B00;  font-family:sans-serif; font-size:9px;\"><b>"+uptimebtnmsg.uptimebtn+"</b><b style=\"background-color:#FFFFFF; color:#000000;padding:0px 2px 0px 3px;\"><script type=\"text/javascript\" src=\""+burl+"\"></script></b></span></a>";
		  }
		else if(buttontype=='2'){		
			bcode="<a href=\""+publicurl+"\" style=\"text-decoration:none;cursor:pointer;color:#000000;\"><span style=\"border:1px solid #FF9933; background-color:#FF6600;text-transform:0px;text-align:center;display:inline-block;line-height:11px;text-indent:1px;font-family:sans-serif;font-size:9px;\"><b style=\"display:inline-block;color:#FFFFFF;\">"+uptimebtnmsg.website+ "<br/>"+uptimebtnmsg.uptime+"</b><b style=\"background-color:#FFFFFF;display:inline-block;\">Site24X7 <br/><script type=\"text/javascript\" src=\""+burl+"\"></script></b></span></a>";
		}
		else if(buttontype=='3'){	
			bcode="<a href=\""+publicurl+"\" style=\"color:#FFFFFF;text-decoration:none;cursor:pointer;\"><span style=\"text-align:center;color:#000000;text-transform:0px;font-weight:normal;line-height:12px;text-indent:0px;display:inline-block;margin:0px;padding:0px;border:1px solid #FF9933;font-family:sans-serif;font-size:9px;\"><b style=\"background-color:#FF6600;color:#FFFFFF;padding:0px 2px 0px 2px;\"> "+uptimebtnmsg.uptimebtn1+ " </b><br/><b style=\"background-color:#ffffff;padding:0px 2px 0px 2px;\">Uptime <script type=\"text/javascript\" src=\""+burl+"\"></script></b></span></a>";
		}
		return bcode;

}


function addUptimeBtn(id,add)
{
	var url='/home/UptimeButton.do?execute=addUptimeButton';
	if(add){
		url='/home/UptimeButton.do?execute=addUptimeButton';
		
	}else{
		url='/home/UptimeButton.do?execute=editUptimeButton';
	}	
	if(id!=''){
		url=url+'&urlid='+id;
	}
	if(document.getElementById("perf")){
		url=url+'&perf=true';
	}
	location.href=url;
}
function deleteUptimeBtn(id)
{
	if(confirm(uptimemsg["delete_uptimebutton"]))
	{
		location.href="/home/UptimeButton.do?execute=deleteUptimeButton&urlid="+id;
	}
}
function showReferralProgramPopup(){
	fnOpenNewScrollWindow("/jsp/reseller/referralprogram.jsp?popup=true","900","500");
}
function fnCancelUptimeBtn(urlid,perfpage){
if(perfpage=='true'){
	history.back();	
}else{
	location.href="/home/UptimeButton.do?execute=showUptimeButtons";
}
}
function gotoPage(page,param1,param2,param3,param4,param5,param6)
{
	if(page=='addcreditsform'){location.href = "../home/accountinfo.do?method=showAddCreditsForm&rt="+param1;}
	else if(page=='addcreditsformAmount'){location.href = "../home/accountinfo.do?method=showAddCreditsForm&a="+param1;}
	else if(page=='accountstab'){location.href = "../home/accountinfo.do?method=showaccountdetails";}
	else if(page=='adduserform'){location.href ="../home/accountinfo.do?method=showAddCreditsForm&show=adduserpack";}
	else if(page=='showBuySMSForm')
	{
		if(param1==undefined)
		{
			location.href = "../home/accountinfo.do?method=showAddCreditsForm&show=smsform";
		}
		else
		{
			location.href = "../home/accountinfo.do?method=showAddCreditsForm&show=smsform&rt="+param1;
		}
	}
	else if(page=='topupscreen')
	{
		location.href="../home/accountinfo.do?method=showtopupscreen&topupscreen=true&price="+param1;
	}
	else if(page=='showmodifycardscreen'){openNewWindow('/home/accountinfo.do?method=showModifyCardForm', 'modifycard',575,450);}
	else if(page=='showmonitorsdesc'){location.href="../home/CreateTest.do?execute=showMonitorsAvailability&order=desc";}
	else if(page=='showmonitorsasc'){location.href="../home/CreateTest.do?execute=showMonitorsAvailability";}
	else if(page=='showallmaintenance'){location.href="/home/Notifications.do?execute=addMaintenence";}
	else if(page=='detailspage')
	{
		if(param2!=undefined)
		{
			if(param2=='true')
			{
				param1=param1+"&p1=SR";//No I18N
			}
			else if(param2=='fromRCA')
			{
				param1=param1+"&p1=FR";//No I18N
			}
		}
		if(param3!=undefined)
		{
			param1=param1+"&dt="+param3;//No I18N
		}
		
		var uri = document.location.href;
		
		if(uri.indexOf("/m/") > 0)
		{
			location.href="/m/home/CreateTest.do?execute=showPerf&urlid="+param1;
		}
		else
		{
		location.href="../home/CreateTest.do?execute=showPerf&urlid="+param1;
		}
	}//It is used in Mobile LayOut also.So the path is given relative.
	else if(page=='portalIntegration'){
		var publicUrl = "";//NO I18N
		if(param1=="1"){//NOI18N
			publicUrl="&tabname=tab5";//NO I18N
		}
		location.href=newclient_path+"#/admin/share/status-pages"; //NO I18N
	}
	else if(page=='showlocAvailabilityReport'){
		if(param3!=undefined && param4!=undefined)
		{
			param2 = param2+'&startDate='+param3+'&endDate='+param4;//NO I18N
		}
	openNewWindow('../home/reportsinfo.do?execute=showLocationAvailablityReport&period='+param1+'&monitorid='+param2, 'report',1000,500);//NO I18N
	}
	else if(page=='showURLSLAReport'){openNewWindow('/login/status.do?execute=showURLSLAReport&id='+param1,'report',900,500);}
	else if(page=='showResposeTimeReport'){openNewWindow('/home/reportsinfo.do?execute=attributeReport&urlid='+param1+'&period='+param2+'&isUrl=false&locid='+param3+'&mtype='+param4+'&startDate='+param5+'&endDate='+param6,'report',950,500);}
	else if(page=='showNewBusinessHour'){location.href="/home/SlaReport.do?execute=showNewBusinessHours&ajax=false";}
	else if(page=='statusview'){location.href="/home/CreateTest.do?execute=getStatusView";}
	else{location.href="../home/client/Welcome.do";}//NO I18N
}
function openNewWindow(url,windowname,width,height)
{
	var top_pad = ( $(window).height() - height ) / 2+$(window).scrollTop() + "px";//No I18N
        var left_pad = ( $(window).width() - width ) / 2+$(window).scrollLeft() + "px"; //No I18N
	window.open(url,windowname,'scrollbars=yes,resizable=yes,width='+width+',height='+height+',left='+left_pad+',top='+top_pad);	
}
function openPage(page,param1,param2,param3,param4,param5)
{
        if(page=='privacypolicy'){window.open("/privacypolicy.html", "new",'scrollbars=yes,resizable=yes,width=800,height=600');}
        else if(page=='pricing'){window.open("/site24x7-pricing.html", "new",'scrollbars=yes,resizable=yes,width=700,height=600');}
        else if(page=='terms'){window.open("/terms.html", "new",'scrollbars=yes,resizable=yes,width=800,height=600');}
        else{location.href="/index.html";}
}
function postShowAddCreditsForm(result)
{
	hideDiv('loading');//No I18N
	var reason = getValue(result,'ax_buycredits_status');
	var tabname=getValue(result,'ax_resellertab');
	var errormsg = getValue(result,'ax_errormsg');//No I18N
	var param=verifyNewClient();
	if(errormsg!=undefined)
	{
		var resellerParam=getValue(result,'ax_reseller');//No I18N
		$("#errordiv").html(errormsg);
		$.showDiv("messagediv");//No I18N
		if(resellerParam!=undefined)
		{
			$('input[name="tabname"]').val(resellerParam);
		}
	}
	else if(reason=='credits_added'&&tabname==undefined)
	{
		if(param!=null)
		{
			location.href = "../home/accountinfo.do?method=showaccountdetails&success=credits_added&nc=billing";
		}
		else
		{
			location.href = "../home/accountinfo.do?method=showaccountdetails&success=credits_added";
		}
	}
	else if(reason=='sms_credits_added'&&tabname==undefined)
	{
		var smscount = getValue(result,'ax_smscount');
		if(param!=null)
		{
			location.href = "../home/accountinfo.do?method=showaccountdetails&upgrade=sms&count="+smscount+"&nc=billing";
		}
		else
		{
			location.href = "../home/accountinfo.do?method=showaccountdetails&upgrade=sms&count="+smscount;
		}
	}
	else if(reason=='user_credits_added'&&tabname==undefined)
	{
		var usercount = getValue(result,'ax_usercount');//NO I18N
		if(param!=null)
		{
			location.href = "../home/accountinfo.do?method=showaccountdetails&success=users_added&count="+usercount+"&nc=billing";
		}
		else
		{
			location.href = "../home/accountinfo.do?method=showaccountdetails&success=users_added&count="+usercount;
		}

	}
	else if(reason=='upgrade_purchaseorder'&&tabname==undefined)
	{
		if(param!=null)
		{
			location.href = "../home/accountinfo.do?method=showaccountdetails&success=upgrade_purchaseorder&nc=billing";
		}
		else
		{
			location.href = "../home/accountinfo.do?method=showaccountdetails&success=upgrade_purchaseorder";
		}
	}
	else
	{
        	var msg = document.getElementById('userarea');
        	msg.innerHTML =result;
		var paymenttype = getValue(result,'ax_paymenttype');
		var alreadycreditcarduser = getValue(result,'ax_creditcarduser');
		if(paymenttype==null||paymenttype==undefined)
		{
			paymenttype = "1";//Default Credit Card
		}
		changeContent(paymenttype,alreadycreditcarduser);
        $('#paymentoption'+paymenttype).prop('checked', true);
        	hideDiv('loading');
        	showDiv('userarea');
	}
}

function purchaseCredits(frm,alreadycarduser)
{
	$.hideDiv("messagediv");//No I18N
	var smspack = frm.smspack;
	var userpack=frm.userpack;
	if(smspack!=undefined)
	{
		smspack = frm.smspack.value;
	}
	else
	{
		smspack = -1;
	}	
	if(userpack!=undefined)
	{
		userpack = frm.userpack.value;
		if(userpack==""){
			alert(ccmsg["userpack_empty"]);
			frm.userpack.select();
			return;
		}	
		else if(userpack<=0){
			alert(ccmsg["minimum_userpack"]);
			frm.userpack.select();
			return;
		}
	}
	else{
		userpack=-1;
	}
         var ptype = $('[name=paymentoption]:checked').val();
var amount = frm.amount.value;
	if(ptype==1)
	{
		if(frm.discountedamt==undefined){
			if(amount<10 && smspack<0 && userpack<0)
                {
                        alert(ccmsg["minimum_amount_cc"]);
                        frm.amount.select();
                        return;
                }
		}
		else{
			if(frm.discountedamt.value<10&&smspack<0&& userpack<0){
				alert(ccmsg["minimum_amount_cc"]);
                        	frm.amount.select();
				return;
			}
		}
	}
        else if(ptype==2)
        {
        	if(frm.discountedamt==undefined){
        			if(amount<25 && smspack<0&& userpack<0)
        			{
        				alert(ccmsg["minimum_amount_paypal"]);
        				frm.amount.select();
        				return;
        			}
        	}
        	else{
        		if(frm.discountedamt.value<25&&smspack<0&& userpack<0){
				alert(ccmsg["minimum_amount_paypal"]);
				frm.amount.select();
    				return;
    			}
    		}
        }
        else if(ptype==3)
        {
        	if(frm.discountedamt==undefined){
        		if(amount<100 && smspack<0&& userpack<0)
                {
                        alert(ccmsg["minimum_amount_po"]);
                        frm.amount.select();
                        return;
                }
        	}
        	else{
        		if(frm.discountedamt.value<100&&smspack<0&& userpack<0){
				alert(ccmsg["minimum_amount_po"]);
				frm.amount.select();
    				return;
    			}
    		}
        }
if(ptype==1 || ptype==2 || ptype==3)
	{
		checkCardDetails(frm,alreadycarduser);
	}
}
function changeContent(ptype,alreadycarduser,isSMS,isReseller,discount)
{
        if(ptype==1)
        {
        	if(isSMS)
    		{
    			showRowDiv('verisign_img');//No I18N
    		}
    		else
    		{
    			showDiv('verisign_img');//No I18N
    		}
		if(alreadycarduser==1)
		{
			hideDiv('beforebillingdetailsdiv');//No I18N
			hideDiv('beforcarddetailsdiv');//No I18N
			hideDiv('nameaddresstrdiv');//No I18N
			hideDiv('billinginfotrdiv');//No I18N
			hideDiv('companynametrdiv');
			hideDiv('streetaddresstrdiv');
			hideDiv('zipcodetrdiv');
			hideDiv('phonetrdiv');
			hideDiv('countrytrdiv');
			hideDiv('cardtypetrdiv');
			hideDiv('cardnotrdiv');
			hideDiv('cardnametrdiv');//No I18N
			hideDiv('ccvtrdiv');
			hideDiv('expirytrdiv');
			showRowDiv('iagreetrdiv');//No I18N
		}
		else
		{
			showRowDiv('beforebillingdetailsdiv');//No I18N
			showRowDiv('beforcarddetailsdiv');//No I18N
			showRowDiv('nameaddresstrdiv');//No I18N
			showRowDiv('billinginfotrdiv');//No I18N
			showRowDiv('companynametrdiv');//No I18N
			showRowDiv('streetaddresstrdiv');
			showRowDiv('zipcodetrdiv');
			showRowDiv('phonetrdiv');
			showRowDiv('countrytrdiv');
			showRowDiv('cardtypetrdiv');
			showRowDiv('cardnotrdiv');
			showRowDiv('cardnametrdiv');//No I18N
			showRowDiv('ccvtrdiv');
			showRowDiv('expirytrdiv');
			showRowDiv('iagreetrdiv');
			
		}
		if(isSMS==''&&isReseller!=''&&isReseller=='true'&&discount>0)
		{
			showMinAmount(ptype);
        	}
        }
        else if(ptype==2)
        {
        	hideDiv('beforebillingdetailsdiv');//No I18N
			hideDiv('beforcarddetailsdiv');//No I18N
        hideDiv('verisign_img');//No I18N
		hideDiv('nameaddresstrdiv');//No I18N
		hideDiv('billinginfotrdiv');//No I18N
		hideDiv('companynametrdiv');//No I18N
                hideDiv('streetaddresstrdiv');
                hideDiv('zipcodetrdiv');
                hideDiv('phonetrdiv');
		hideDiv('countrytrdiv');//No I18N
                hideDiv('cardtypetrdiv');
                hideDiv('cardnotrdiv');
                hideDiv('cardnametrdiv');//No I18N
                hideDiv('ccvtrdiv');
                hideDiv('expirytrdiv');
		showRowDiv('iagreetrdiv');
		if(isSMS==''&&isReseller!=''&&isReseller=='true'&&discount>0)
		{
			showMinAmount(ptype);
        	}
        }
        else if(ptype==3)
        {
        	showRowDiv('beforebillingdetailsdiv');//No I18N
			showRowDiv('beforcarddetailsdiv');//No I18N
        hideDiv('verisign_img');//No I18N
		showRowDiv('nameaddresstrdiv');//No I18N
		hideDiv('billinginfotrdiv');//No I18N
		showRowDiv('companynametrdiv');
                showRowDiv('streetaddresstrdiv');
                showRowDiv('zipcodetrdiv');
                showRowDiv('phonetrdiv');
		showRowDiv('countrytrdiv');
                hideDiv('cardtypetrdiv');
                hideDiv('cardnotrdiv');
                hideDiv('cardnametrdiv');//No I18N
                hideDiv('ccvtrdiv');
                hideDiv('expirytrdiv');
		showRowDiv('iagreetrdiv');
		if(isSMS==''&&isReseller!=''&&isReseller=='true'&&discount>0)
		{
			showMinAmount(ptype);
        	}
        }
}



function submitForm(frm)
{
	frm.submit();
}
function getScreenCenterY() { 
    var y = 0;
    y = getScrollOffset()+(getInnerHeight()/2);
    return(y); 
} 
 
function getScreenCenterX() { 
     return(document.body.clientWidth/2); 
} 
 
function getInnerHeight() { 
      var y; 
      if (self.innerHeight) // all except Explorer 
      { 
           y = self.innerHeight; 
      } 
      else if (document.documentElement && document.documentElement.clientHeight) 
      // Explorer 6 Strict Mode 
      { 
           y = document.documentElement.clientHeight; 
      } 
      else if (document.body) // other Explorers 
      { 
           y = document.body.clientHeight; 
      } 
      return(y); 
} 
 
function getScrollOffset() { 
      var y; 
      if (self.pageYOffset) // all except Explorer 
      { 
           y = self.pageYOffset; 
      } 
      else if (document.documentElement && document.documentElement.scrollTop) 
      // Explorer 6 Strict 
      { 
           y = document.documentElement.scrollTop; 
      } 
      else if (document.body) // all other Explorers 
      { 
           y = document.body.scrollTop; 
      } 
      return(y); 
}
function Hideloading() {
    var loadingDiv = document.getElementById('loadingDiv');
    loadingDiv.style.display = "none";
    document.forms[0].removeChild(loadingDiv);     
}

function Showloading() {
    var loadingDiv = document.createElement('div');
    loadingDiv.setAttribute('id','loadingDiv');
    loadingDiv.setAttribute('class','loadingbox');
    loadingDiv.innerHTML = 'Loading....';//No internationalization
    loadingDiv.style.left = getScreenCenterX() + "px";
    loadingDiv.style.top = getScreenCenterY() + "px";
    document.forms[0].appendChild(loadingDiv);
    loadingDiv.style.display = "block";
}

function showThroughput(period)
{
	var divid = "timechart1";//No I18N
        var divid2 = "timechart";//No I18N
        var checkboxid = "chkthroughput";//No I18N
        if(period!=undefined && period!="")
        {
                divid = "period"+period+"_timechart1";//No I18N
                divid2 = "period"+period+"_timechart";//No I18N
                checkboxid = "period"+period+"_chkthroughput";//No I18N
        }
        if(document.getElementById(checkboxid).checked)
        {
                $.hideDiv(divid);
                $.showDiv(divid2);
        }
        else
        {
                $.showDiv(divid);
                $.hideDiv(divid2);
        }
}

function viewByGroup(frm)
{
	var groupname=frm.groupname.value;
	
	if(groupname=="")
	{
		location.href='/m/home/client/Welcome.do';//NO I18N
	}
	else
	{
		location.href='/m/home/CreateTest.do?execute=showMonitorsAvailability&groupNameMobile='+groupname;
	}
}

function setGroupName(frm,groupNameMobile)
{
	if(groupNameMobile=="")
	{
		
	}
	else
	{
		frm.groupname.value=groupNameMobile;
	}
}

function showDivSeq(a)
{
	if(a.value=='false') 
	{
		a.value='true'; 
		document.getElementById("advancedicon").src = '../images/icon_show.gif';
	} 
	else 
	{ 
	   a.value='false'; 
	   document.getElementById("advancedicon").src = '../images/icon_hide.gif'; 
	} 

	var advdiv = document.getElementById("advdiv"); 
	
	if(a.value=='true') 
	{
		advdiv.style.display = "block"; 
		return; 
	} 
	else
	{
		advdiv.style.display = "none"; 
		return; 
	}
}

//Used to generate PublicStatusView
function generateStatus(frm)
{
	var monList = "";
	var monPeriod = frm.selectedStatusViewPeriod.value;
	var moreCheckBox = document.getElementById('moreOption');
	var moreOption='false';
	var rsptime = document.getElementById("rsptime");
	var rsptime_check='false';

	var dispName = frm.dispname.value;
	var desc = frm.desc.value;
	desc=trim(desc);
	var footer = frm.footer.value;
	footer=trim(footer);
	var viewkey = frm.viewID.value;
	if(moreCheckBox.checked){
		moreOption='true';
	}
	if(rsptime.checked){
		rsptime_check='true';//No I18N
	}
	var typeVal = 0;	
	for (i=0;i<frm.typeRadio.length;i++){
		if (frm.typeRadio[i].checked){
			typeVal = frm.typeRadio[i].value;
			break;
		}
	}
	var val="";//NO I18N
	for (i=0;i<frm.monRadio.length;i++){
		if (frm.monRadio[i].checked){
			val = frm.monRadio[i].value;
		}
	}
	
	var param="";
	
	if(desc.length>0)
	{
		param=param+"&desc="+desc;//No I18N
	}
	if(footer.length>0)
    {
                param=param+"&footer="+footer;//No I18N
    }
	if($("#chk_NOC").is(':checked'))
	{
		param=param+"&chk_NOC=true";//No I18N
	}
	if($("#chk_maintenance").is(':checked'))
	{
		param=param+"&chk_maintenance=true";//No I18N
	}
	if($("#chk_history").is(':checked'))
	{
		param=param+"&chk_history=true";//No I18N
	}
	if($("#chk_performance").is(':checked'))
	{
		param=param+"&chk_performance=true";//No I18N
	}
	
	var rptSettings="";//NO I18N
	if(frm.rptSettings!=undefined&&frm.rptSettings!=null)
	{
		for (i=0;i<frm.rptSettings.length;i++){
			if (frm.rptSettings[i].checked){
				rptSettings = frm.rptSettings[i].value;
			}
		}
	}
	
	
	//if(rptSettings=='custom')
	{
		var logourl = $("#uploadedfilepath").val();//NO I18N
		var bgcolor = $("#bgclr").val();//NO I18N
		var fontcolor = $("#fontclr").val();//NO I18N
		
		if(logourl!=null&&logourl!=undefined&&logourl.length>0)
		{
			param=param+"&logourl="+logourl;//No I18N
		}
		if(bgcolor!=null&&bgcolor!=undefined&&bgcolor.length>0)
		{
			param=param+"&bgcolor="+bgcolor;//No I18N
		}
		if(fontcolor!=null&&fontcolor!=undefined&&fontcolor.length>0)
		{
			param=param+"&fontcolor="+fontcolor;//No I18N
		}
	}
	

	if(val=='grp'){
		monList = document.getElementById("groupMonList").value;//NO I18N
	}
	else
	{
		if($('input[name="chklist"]:checked').length==0)
		{
			alert(beanmsg["selecturl"]);//No I18N
			return false;
		}
		else
		{
			var l=0;
			$('input[name="chklist"]:checked').each(function() {
				if(l==0)
			{
					monList=this.value;
				}
				else
				{
					monList = monList+","+this.value;//NO I18N
				}
				l++;
				});
			}
	}
	if(monList == "" || monList == null || monList == undefined)
	{
		alert(beanmsg["nothingSelected"]);//No I18N
		return false;
	}
	if(val=="grp"){//NO I18N{
		monList = "grp"+monList;//No I18N
	}
	var domainName=$("#domainName").val();
	var path=$("#urlpath").val().trim();
	var checkParam="";
	if(path!=null&&path!=undefined&&path.length>0)
	{
		if(domainName == "" || domainName == null || domainName == undefined){
			alert(beanmsg["adddomainname"]);//No I18N
			return false;
		}
		param=param+"&path="+path;//No I18N
		checkParam="&path="+path;//No I18N
	}
	if(domainName != null && domainName != undefined && domainName!="")
	{
		param=param+"&dname="+domainName;//No I18N
		var checkParam=checkParam+"&dname="+domainName;//No I18N
		if(viewkey>0)
		{
			checkParam=checkParam+"&viewid="+viewkey;//No I18N
		}
		var response = $.getAjaxResponseWithCSRF("POST","/home/CreateTest.do","execute=checkCName"+checkParam);//No I18N
		var statusmsg = getValue(response,'ax_cnameexists');//No I18N
		if(statusmsg!==undefined && statusmsg==='true')
		{
			alert("Domain name already exists.");//No I18N
			return;
		}
		if(getValue(response,'ax_domainnotallowed')!==undefined && getValue(response,'ax_domainnotallowed')==='true')
		{
			alert(beanmsg["domainname_not_allowed"]);// jshint ignore:line
			return;
		}
	}
	var response = $.getAjaxResponseWithCSRF("POST","../home/CreateTest.do","execute=addPublicStatusView&customurls="+monList+"&period="+monPeriod+"&moreOption="+moreOption+"&dispname="+dispName+"&viewid="+viewkey+"&rsptime="+rsptime_check+"&viewtype="+typeVal+param);//No I18N
	postPublicStatus(response);
}
	
function postPublicStatus(result) 
	{ 
		if(getValue(result,'ax_domainnotallowed')!==undefined && getValue(result,'ax_domainnotallowed')==='true')
		{
			alert(beanmsg["domainname_not_allowed"]);// jshint ignore:line
			return;
		}
		viewid = getValue(result,'ax_viewid'); //No I18N
		servername = getValue(result,'ax_servername'); //No I18N
		var permaview = https_var+"://"+servername+"/sv.do?id="+viewid;//NO I18N
		var str = "<iframe src='"+permaview+"' scrolling=\'yes\' align=\'center\' height=\'400\' width=\'1000\' border=\'0\' frameborder=\'0\'></iframe>";
		var areavalue = document.getElementById("statusview").value;
		document.getElementById("viewID").value=getValue(result,'ax_tableId');//NO I18N
		if(areavalue != null && areavalue != "")
		{
			var message = getValue(result,'ax_statusmsg');//No I18N
			var status = getValue(result,'ax_status');//No I18N
			var width = message.length * 11;
			if(message.length<15){width=width+70;}
			var position1 = $("#cancel").position();
			var left_pad = position1.left + $("#cancel").width() + 25;
			var top_pad = position1.top - 6;
			$.showPopUpDiv($.getStatusMsg(status,message),top_pad,left_pad,'1',width);
			$.fadeOutDiv('popUpFloatingDiv',5000);//No I18N
			return;
		}
		document.getElementById("srccode").style.display="block";//NO I18N
		document.getElementById("srccodepermalink").style.display="block";//NO I18N
		document.getElementById("permalinkrow").style.display="block";
		if($("#sourcecopy").val()!=undefined||$("#sourcecopy").val()!=null)
		{
		document.getElementById("sourcecopy").style.display="block";//NO I18N   
		}
		if($("#sourcecopypermalink").val()!=undefined||$("#sourcecopypermalink").val()!=null)
		{
		document.getElementById("sourcecopypermalink").style.display="block";//NO I18N   
		}
		document.getElementById("permaview").value=permaview;
		document.getElementById("statusview").value=str;
		document.getElementById("statusview").focus(); //No I18N
	} 

//used to generate PublicSLAView
function generateSla(frm)
{
	var dispName = frm.dispname.value;
	var viewkey = frm.viewID.value;
	if(frm.slaList.value=='')
	{
		alert(beanmsg["no.sla.select"]); //No I18N
		return false;
	}
	var ajaxRsp = $.getAjaxResponseWithCSRF("POST","../home/CreateTest.do","execute=addPublicSlaView&"+frm.slaList.value+"&predefinedperiod="+frm.slaPeriod.value+"&periodval="+frm.slaFrequency.value+"&dispname="+dispName+"&viewid="+viewkey);//NO I18N
	postPublicSla(ajaxRsp);
}
	
function postPublicSla(ajaxRsp) 
{ 
	viewid = getValue(ajaxRsp,'ax_viewid'); //No I18N
	servername = getValue(ajaxRsp,'ax_servername'); //No I18N
	var str= "<iframe src='"+https_var+"://"+servername+"/sla.do?id="+viewid+"' scrolling=\'yes\' align=\'center\' height=\'400\' width=\'1000\' border=\'0\' frameborder=\'0\'></iframe>"; //No I18N
	document.getElementById("viewID").value=getValue(ajaxRsp,'ax_tableId');//NO I18N
	document.getElementById("sourcearea").style.display="block";
	document.getElementById("sourcename").style.display="block";
	document.getElementById("slaRepUrl").value=str;
	document.getElementById("permalink").style.display="block";
	document.getElementById("permalinkValue").style.display="block";
	document.getElementById("slaPermaUrl").value=https_var+"://"+servername+"/sla.do?id="+viewid;//NO I18N
	document.getElementById("slaRepUrl").focus(); //No I18N
} 
	
	function statusCheck(frm)
	{
		for (i=0;i<frm.monRadio.length;i++)
		{
			if (frm.monRadio[i].checked) 
			{
				var val = frm.monRadio[i].value; //No I18N
			}
		}

		if(val=="all")
		{
			document.getElementById("mon").style.display = "none"; //No I18N
		}
		else if(val=="sel")
		{
			document.getElementById("mon").style.display = "block"; //No I18N
		}
	}
	
	function statusCheckAll(frm)
	{
		document.getElementById("monRadioAll").checked=true;
		document.getElementById("mon").style.display = "none"; //No I18N
	}
	
	function statusCheckSel(frm)
	{
		document.getElementById("monRadioSel").checked=true;
		document.getElementById("mon").style.display = "block"; //No I18N
	}
	
	function slaCheck(frm)
	{
		for (i=0;i<frm.slaRadio.length;i++)
		{
			if (frm.slaRadio[i].checked) 
			{
				var val = frm.slaRadio[i].value; //No I18N
			}
		}

		if(val=="summary")
		{
			document.getElementById("selReport").style.display = "none"; //No I18N
			document.getElementById("selSummary").style.display = "block"; //No I18N
		}
		else if(val=="report")
		{
			document.getElementById("selSummary").style.display = "none"; //No I18N
			document.getElementById("selReport").style.display = "block"; //No I18N
		}
	}
	
	function slaCheckSummary(frm)
	{
		document.getElementById("slaSummary").checked=true;
		document.getElementById("selReport").style.display = "none"; //No I18N
		document.getElementById("selSummary").style.display = "block"; //No I18N
	}
	
	function slaCheckReport(frm)
	{
		document.getElementById("slaReport").checked=true;
		document.getElementById("selReport").style.display = "block"; //No I18N
		document.getElementById("selSummary").style.display = "none"; //No I18N
	}
	
	function changeFrequency(period,frequency,frqValue)
	{
		if(period.value==3 || period.value==4)
		{
			frequency[0] = new Option(hourly,0); //No I18N
			frequency[1] = null;
		}
		else if(period.value==11 || period.value==12 || period.value==2)
		{
			frequency[0] = new Option(daily,1); //No I18N
			frequency[1] = null;
		}
		else //No I18N
		{
			frequency[0] = new Option(daily,1); //No I18N
			frequency[1] = new Option(weekly,2); //No I18N
			if(frqValue == 2)
			{
				document.getElementById("slaFrequency").selectedIndex = 1;
			}	
		}
	}
	
	function sendConfirmationMail(bval){ 
                   getHtml("/login/UserAction.do?execute=sendConfirmationMail","postConfirmMail",bval);//No I18N 
                    
           } 
    
  function postConfirmMail(result,bval)
  { 
      var message = getValue(result,'ax_mailsent');//No I18N 
	  var errorCode = getValue(result,'ax_ec');//No I18N 
      var msg = document.getElementById('msgs'); 
      hideDiv('loadingg');
      if(bval=='true')
      { 
	var innermsg = '<div class="SuccessMsgDiv">'+message+'</div>';
	innermsg = innermsg + '<div class="WardShawdowLeft"></div>';
	msg.innerHTML=innermsg;                      
      }
      else
      { 
	  msg.innerHTML=message; 
	  document.getElementById('mailresult').style.display=''; 
      }              
	  
	  try
	  {
		  if(errorCode!=null && errorCode!='undefined' && errorCode=='1001')
		  {
			  document.getElementById('accountConfirmationSendMailIns').style.display='none'; 
  } 
	  }
	  catch(e)
	  {
		  
	  }
  } 
   function checkConfirmedAccount(client)
   { 
		hideDiv('msgs');
		var url = "/signin.do";//No I18N 
		if(client!=null && client!=undefined && client!="" && client==true)
		{
			url = "/m/signin.do?mobileclient=true";//No I18N
		}
		location.href=url;
   } 

	function getServerHeader(frm,ranword)
	{
		
		if(frm.hostName.value=='')
		{
			alert(beanmsg["input_url"]);
			frm.hostName.select();
			return;
		}
		if(document.getElementById('secureWord')!=null)
		{
			if(document.getElementById('secureWord').value=='')
			{
				alert(beanmsg["empty_accessKey"]);
				document.getElementById('secureWord').focus();
				return false;
			}
			var secureWord=document.getElementById('secureWord').value;
			getHtmlForForm(frm,"postServerHeaderAccessKeyword",frm);  //No I18N
		}
	}
	
	function postServerHeaderAccessKeyword(result,frm)
	{
		var keywordstatus=getValue(result,'ax_incorrectKey');  //No I18N
		if(keywordstatus!=null)
		{
			alert(beanmsg["invalid_accessKey"]);
			document.getElementById('secureWord').select();
			return false;
		}
		frm.execute.value="getServerHeader";  //No I18N
		var url = document.getElementById('hostName').value;
		document.getElementById('url').value = url;
		document.getElementById('inputDiv').style.display = 'none';
		document.getElementById('testUrl').innerHTML = url;
		document.getElementById('newTestDiv').style.display = 'block';
		document.getElementById('laodingDiv').style.display = 'block';
		getHtmlForForm(frm,"postServerHeader");//No I18N
	}
	function postServerHeader(result)
	{
                   invalid = getValue(result,'ax_invalid'); //No I18N
		   if(invalid == 'true')
		   {
				document.getElementById('laodingDiv').style.display = 'none';
				document.getElementById('outPutDiv').innerHTML='<br><table width="50%" align="center" border="0" cellspacing="2" cellpadding="2"><tr><td class="message" style="color:red">'+errMsg+'</td></tr></table><br>'
				document.getElementById('outPutDiv').style.display = 'block';
				return false;
		   }
                   var url = getValue(result,'ax_Url'); //No I18N
		   var header = getValue(result,'ax_Header'); //No I18N
		   var etag = getValue(result,'ax_Etag'); //No I18N
		   var date = getValue(result,'ax_Date'); //No I18N
		   var contentlength = getValue(result,'ax_Contentlength'); //No I18N
                   var lastmodified = getValue(result,'ax_Lastmodified'); //No I18N
                   var contenttype = getValue(result,'ax_Contenttype'); //No I18N
                   var connection = getValue(result,'ax_Connection'); //No I18N
                   var acceptranges = getValue(result,'ax_Ranges'); //No I18N
                   var server = getValue(result,'ax_server'); //No I18N
		   //document.getElementById('url').innerHTML = url;
		   /*document.getElementById('header').innerHTML = header;  //No I18N
		   document.getElementById('etag').innerHTML = etag;  //No I18N
		   document.getElementById('date').innerHTML = date;  //No I18N
		   document.getElementById('contentlength').innerHTML = contentlength;
                   document.getElementById('lastmodified').innerHTML = lastmodified;
                   document.getElementById('contenttype').innerHTML = contenttype;
                   document.getElementById('connection').innerHTML = connection;
                   document.getElementById('acceptranges').innerHTML = acceptranges;
                   document.getElementById('server').innerHTML = server;
		   document.getElementById('outPutDiv').style.display = 'block';
		   document.getElementById('saveport').style.display='block';                

		   document.getElementById('laodingDiv').style.display = 'none';
		   //document.getElementById('outPutDiv').innerHTML= result;*/
		   document.getElementById('outPutDiv').style.display = 'block';
                   
                   row_values = row_values.concat([header,"","ETag",etag,"Date",date,"Content-Length",contentlength,"Last-Modified",lastmodified,"Content-Type",lastmodified,"Connection",connection,"Accept-Ranges",acceptranges,"Server",server]);//No I18N
                 
        	 	
        	 	//var response_data= [{"column1":"location","column2":"status","column3":"responsetime"},{"table_type":"generictable"},{"url":url},{"selectedLocationslength":locationLength}];
                        //alert(response_data);
                        //var response_data = port_response;
                        var column_values = ["Server Header Report for "+url,""];//No I18N
			var table_details = ["generictable","1",url];//No I18N
                        var port_response = {"rowvalues":row_values,"columnvalues":column_values,"tabledetails":table_details};//No I18N
                        var json = JSON.stringify(port_response);
                        //alert(json);
                        /*var form = document.createElement("form");
			form.setAttribute("method", "post");
	        	form.setAttribute("action", "/publicpage");
	        	//form.appendChild(getnewFormElement("hidden","method","saveTest"));
	        	form.appendChild(getnewFormElement("hidden","port_response",json));
	        	form.appendChild(getnewFormElement("hidden","exec","save"));
	        	document.body.appendChild(form);
	        	getHtmlForForm(form,"savetest",form);
                       // form.action = "/publicpage?exec=save&port_response="+json;
                       // frm.action="/home/accountinfo.do?additem="+item+"&topupscreen="+topupscreen;*/
 		        /*var xhr;
    		        xhr = new XMLHttpRequest();
                        
   			var data = 'exec=save&port_response='+json; 
			xhr.onreadystatechange = function() { showResponseAlert(request); }

    			xhr.open('GET', '/publicpage?exec=save&port_response='+json, true);
    			xhr.send(data);
			
			alert("inside");
			//var res = xhr.responseText();
			//$('#response').html(res);

			// or $('#response').append(res); 
			function showResponseAlert(request) {
			if ((request.readyState == 4) && (request.status == 200)) {
			alert(request.responseText);
			}
			

			}*/
			var response = $.getAjaxResponse("GET","/tools/publicpage?exec=true&port_response="+json);//No I18N
			var splited_response = response.split("#:#");
			alert(splited_response[1]);
			document.getElementById('laodingDiv').style.display = 'none';
			document.getElementById('outPutDiv').style.display = 'block';
			document.getElementById('saveport').style.display = 'block';
			//document.getElementById('outPutDiv').innerHTML = response;
			$("#outPutDiv").html(splited_response[0]);//No I18N
			document.getElementById('saveport').value = splited_response[1];
	}
	
	function checkThisLink(url,frm)
	{
		document.getElementById('hostName').value = url;
		document.getElementById('outPutDiv').style.display = 'none';
		document.getElementById('testUrl').innerHTML = url;
		document.getElementById('laodingDiv').style.display = 'block';
		checkLinks(document.getElementById('linkCheckerForm'));
	}
	function checkLinks(frm,ranword)
	{
		if(frm.hostName.value=='')
		{
			alert(beanmsg["input_url"]);
			frm.hostName.select();
			return;
		}
		if(document.getElementById('secureWord')!=null)
		{
			if(document.getElementById('secureWord').value=='')
			{
				alert(beanmsg["empty_accessKey"]);
				document.getElementById('secureWord').focus();
				return false;
			}
			var secureWord=document.getElementById('secureWord').value;
			getHtmlForForm(frm,"postcheckLinksAccessKeyword",frm);  //No I18N
		}
	}
	
	function postcheckLinksAccessKeyword(result,frm)
	{
		var keywordstatus=getValue(result,'ax_incorrectKey');  //No I18N
		if(keywordstatus!=null)
		{
			alert(beanmsg["invalid_accessKey"]);
			document.getElementById('secureWord').select();
			return false;
		}
		frm.execute.value="linkChecker";  //No I18N
		var url = document.getElementById('hostName').value;
		document.getElementById('url').value = url;
		document.getElementById('inputDiv').style.display = 'none';
		document.getElementById('testUrl').innerHTML = url;
		document.getElementById('newTestDiv').style.display = 'block';
		document.getElementById('laodingDiv').style.display = 'block';
		getHtmlForForm(frm,"postCheckLink");//No I18N
	}
	function postCheckLink(result)
	{
		document.getElementById('laodingDiv').style.display = 'none';
		document.getElementById('toolsOutPutDiv').innerHTML= result;
		document.getElementById('toolsOutPutDiv').style.display = 'block';
		document.getElementById('saveport').style.display = 'block';
		if(result.match("Error: Unable to access the specified URL"))
		{
			return false;
		}
		var url = document.getElementById('hostName').value;
		var getUrl = "/tools/action.do?execute=displayLinkList&url="+url; //No I18N
		http.open("GET",getUrl,true); 
		http.onreadystatechange = postdisplayLinkList;
		http.send(null);
	}
	function postdisplayLinkList()
	{
		//var checklink_response = "";
		if(http.readyState == 4) 
		{ 
		   result = http.responseText; 
		   urlLinks = getUrlValue(result,'axUrl_urlLinks').split("||"); //No I18N
		   imgLinks = getUrlValue(result,'axUrl_imgLinks').split("||"); //No I18N
		   total_response_count = urlLinks.length+imgLinks.length;
		  //alert("cccount  "+total_response_count);
		   for (var i=0; i<urlLinks.length; i++)
			{
				if(urlLinks[i].length>0)
				{
					var form = document.createElement("form");
					form.setAttribute("method", "post");
					form.setAttribute("action", "/tools/action.do?");
					form.appendChild(getnewFormElement("hidden","execute","getLinkStatus"));//No I18N
					form.appendChild(getnewFormElement("hidden","linkUrl",urlLinks[i]));//No I18N
					form.appendChild(getnewFormElement("hidden","id",i));//No I18N
					document.body.appendChild(form);
					getHtmlForForm(form,"postLinkStatus");  //No I18N
				}
			}
			
			for (var i=0; i<imgLinks.length; i++)
			{
				if(imgLinks[i].length>0)
				{
					var form = document.createElement("form");
					form.setAttribute("method", "get");
					form.setAttribute("action", "/tools/action.do?");
					form.appendChild(getnewFormElement("hidden","execute","getImageStatus"));//No I18N
					form.appendChild(getnewFormElement("hidden","imageUrl",imgLinks[i]));//No I18N
					form.appendChild(getnewFormElement("hidden","id",i));//No I18N
					document.body.appendChild(form);
					getHtmlForForm(form,"postImageStatus");  //No I18N
				}
			}
		 } 
	}
	function postLinkStatus(result)
	{
		var statusCode = getUrlValue(result,'axUrl_statusCode');//No I18N
		var id = getUrlValue(result,'axUrl_id');  //No I18N
		var url = getUrlValue(result,'axUrl_link');//No I18N
		if(statusCode==2)
		{
			statusCode = "<img src='" + imagesUrl + "ok-2.gif' border='0'>";
		}
		else if(statusCode==3)
		{
			statusCode = "<img src='" + imagesUrl + "redirected.gif' border='0'>";
		}
		else
		{
			statusCode = "<img src='" + imagesUrl + "notok.gif' border='0'>";
		}
		
		try
		{
			document.getElementById(id).innerHTML = statusCode;
		}
		catch(e)
		{}
		link_values = link_values.concat([statusCode,url]);
		count_linkcheck++;
		
		if(count_linkcheck==total_response_count)
		{
		var hostname = document.getElementById('hostName').value;
		var response = {"linkvalues":link_values,"imgvalues":img_values};//No I18N
		var json = JSON.stringify(response);
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "/tools/action.do?");
		form.appendChild(getnewFormElement("hidden","execute","generatetableforlinkcheck"));//No I18N
		form.appendChild(getnewFormElement("hidden","response_data",json));//No I18N
		form.appendChild(getnewFormElement("hidden","url",hostname));//No I18N
		document.body.appendChild(form);
		getHtmlForForm(form,"publiclinkforlinkchecker");  //No I18N
		}

	}
	function postImageStatus(result)
	{
		var id = getUrlValue(result,'axUrl_id');  //No I18N
		var statusCode = getUrlValue(result,'axUrl_statusCode');//No I18N
		var size = getUrlValue(result,'axUrl_size');//No I18N
		var type = getUrlValue(result,'axUrl_type');//No I18N
		var url = getUrlValue(result,'axUrl_imglink');//No I18N
		if(statusCode==2 || statusCode==3)
		{
			statusCode = "<img src='" + imagesUrl + "ok-2.gif' border='0'>";
		}
		else
		{
			statusCode = "<img src='" + imagesUrl + "notok.gif' border='0'>";
		}
		try
		{
			document.getElementById(id+"size").innerHTML = size+" Bytes";  //No I18N
			document.getElementById(id+"type").innerHTML = type;
			document.getElementById(id+"status").innerHTML = statusCode;
		}
		catch(e)
		{}
		img_values = img_values.concat([url,size+" Bytes",type,statusCode]);
		count_linkcheck++;
		if(count_linkcheck==total_response_count)
		{
		//alert("from img ----"+count_linkcheck);
		var hostname = document.getElementById('hostName').value;
		var response = {"linkvalues":link_values,"imgvalues":img_values};//No I18N
		var json = JSON.stringify(response);
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "/tools/action.do?");
		form.appendChild(getnewFormElement("hidden","execute","generatetableforlinkcheck"));//No I18N
		form.appendChild(getnewFormElement("hidden","response_data",json));//No I18N
		form.appendChild(getnewFormElement("hidden","url",hostname));//No I18N
		document.body.appendChild(form);
		getHtmlForForm(form,"publiclinkforlinkchecker");  //No I18N	
		}
		
	}
		
	function publiclinkforlinkchecker(result)
	{
		//alert(getUrlValue(result,"axUrl_linktoolstest"));
		document.getElementById('permalink').value = getUrlValue(result,"axUrl_linktoolstest");//No I18N
	}
	function cleanCode(frm,ranword)
	{
		if(frm.hostName.value=='')
		{
			alert(beanmsg["input_url"]);
			frm.hostName.select();
			return;
		}
		if(document.getElementById('secureWord')!=null)
		{
			if(document.getElementById('secureWord').value=='')
			{
				alert(beanmsg["empty_accessKey"]);
				document.getElementById('secureWord').focus();
				return false;
			}
			var secureWord=document.getElementById('secureWord').value;
			getHtmlForForm(frm,"postcleanCodeAccessKeyword",frm);  //No I18N
		}
	}
	
	function postcleanCodeAccessKeyword(result,frm)
	{
		var keywordstatus=getValue(result,'ax_incorrectKey');  //No I18N
		if(keywordstatus!=null)
		{
			alert(beanmsg["invalid_accessKey"]);
			document.getElementById('secureWord').select();
			return false;
		}
		frm.execute.value="codeCleaner";  //No I18N
		var url = document.getElementById('hostName').value;
		document.getElementById('url').value = url;
		document.getElementById('inputDiv').style.display = 'none';
		document.getElementById('testUrl').innerHTML = url;
		document.getElementById('newTestDiv').style.display = 'block';
		document.getElementById('laodingDiv').style.display = 'block';
		getHtmlForForm(frm,"postCodeClean");//No I18N
	}
	function postCodeClean(result)
	{
		document.getElementById('laodingDiv').style.display = 'none';
		document.getElementById('outPutDiv').innerHTML= result;
		document.getElementById('outPutDiv').style.display = 'block';
	}
	
	
	function validateHTML(frm,ranword)
	{
		if(frm.hostName.value=='')
		{
			alert(beanmsg["input_url"]);
			frm.hostName.select();
			return;
		}
		if(document.getElementById('secureWord')!=null)
		{
			if(document.getElementById('secureWord').value=='')
			{
				alert(beanmsg["empty_accessKey"]);
				document.getElementById('secureWord').focus();
				return false;
			}
			var secureWord=document.getElementById('secureWord').value;
			getHtmlForForm(frm,"postvalidateHTMLAccessKeyword",frm);  //No I18N
		}
	}
	
	function postvalidateHTMLAccessKeyword(result,frm)
	{
		var keywordstatus=getValue(result,'ax_incorrectKey');  //No I18N
		if(keywordstatus!=null)
		{
			alert(beanmsg["invalid_accessKey"]);
			document.getElementById('secureWord').select();
			return false;
		}
		frm.execute.value="htmlValidator";  //No I18N
		var url = document.getElementById('hostName').value;
		document.getElementById('url').value = url;
		document.getElementById('inputDiv').style.display = 'none';
		document.getElementById('testUrl').innerHTML = url;
		document.getElementById('newTestDiv').style.display = 'block';
		document.getElementById('laodingDiv').style.display = 'block';
		getHtmlForForm(frm,"postValidateHTML");//No I18N
	}
	function postValidateHTML(result)
	{
		document.getElementById('laodingDiv').style.display = 'none';
		document.getElementById('toolsOutPutDiv').innerHTML= result;
		document.getElementById('toolsOutPutDiv').style.display = 'block';
	}
	
	function explorePrimaryLink(url,id)
	{
		document.getElementById(id+"image").innerHTML = "<a href='javaScript:void(0)' onClick=\"closePrimaryLink('"+url+"','"+id+"')\"><img src = '" + imagesUrl + "minus-tools.gif' border='0'></a>"
		document.getElementById(id).style.display='block';
		getHtml("/tools/action.do?execute=linkExplorer&url="+encodeURIComponent(url)+"&nextLevel=true","postexplorePrimaryLink",id)  //No I18N
	}
	function postexplorePrimaryLink(result,id)
	{
		document.getElementById(id).innerHTML=result;
	}
	
	function closePrimaryLink(url,id)
	{
		document.getElementById(id).style.display='none';
		document.getElementById(id+"image").innerHTML = "<a href='javaScript:void(0)' onClick=\"explorePrimaryLink('"+url+"','"+id+"')\"><img src = '" + imagesUrl + "plus-tools.gif' border='0'></a>"
	}
	
	function exploreLinks(frm,ranword)
	{
		if(frm.hostName.value=='')
		{
			alert(beanmsg["input_url"]);
			frm.hostName.select();
			return;
		}
		if(document.getElementById('secureWord')!=null)
		{
			if(document.getElementById('secureWord').value=='')
			{
				alert(beanmsg["empty_accessKey"]);
				document.getElementById('secureWord').focus();
				return false;
			}
			var secureWord=document.getElementById('secureWord').value;
			getHtmlForForm(frm,"postexploreLinksAccessKeyword",frm);  //No I18N
		}
	}
	
	function postexploreLinksAccessKeyword(result,frm)
	{
		var keywordstatus=getValue(result,'ax_incorrectKey');  //No I18N
		if(keywordstatus!=null)
		{
			alert(beanmsg["invalid_accessKey"]);
			document.getElementById('secureWord').select();
			return false;
		}
		frm.execute.value="linkExplorer";  //No I18N
		var url = document.getElementById('hostName').value;
		document.getElementById('url').value = url;
		document.getElementById('inputDiv').style.display = 'none';
		document.getElementById('testUrl').innerHTML = url;
		document.getElementById('newTestDiv').style.display = 'block';
		document.getElementById('laodingDiv').style.display = 'block';
		getHtmlForForm(frm,"postExploreLinks");//No I18N
	}
	function postExploreLinks(result)
	{
		document.getElementById('laodingDiv').style.display = 'none';
		document.getElementById('toolsOutPutDiv').innerHTML= result;
		document.getElementById('toolsOutPutDiv').style.display = 'block';
	}
	
	function getLynxView(frm,ranword)
	{
		if(frm.hostName.value=='')
		{
			alert(beanmsg["input_url"]);
			frm.hostName.select();
			return;
		}
		if(document.getElementById('secureWord')!=null)
		{
			if(document.getElementById('secureWord').value=='')
			{
				alert(beanmsg["empty_accessKey"]);
				document.getElementById('secureWord').focus();
				return false;
			}
			var secureWord=document.getElementById('secureWord').value;
			getHtmlForForm(frm,"postgetLynxViewAccessKeyword",frm);  //No I18N
		}
	}
	
	function postgetLynxViewAccessKeyword(result,frm)
	{
		var keywordstatus=getValue(result,'ax_incorrectKey');  //No I18N
		if(keywordstatus!=null)
		{
			alert(beanmsg["invalid_accessKey"]);
			document.getElementById('secureWord').select();
			return false;
		}
		frm.execute.value="lynxView";  //No I18N
		var url = document.getElementById('hostName').value;
		var getUrl = "/tools/action.do?execute=lynxView&url="+url; //No I18N
		http.open("GET",getUrl,true); 
		var url = document.getElementById('hostName').value;
		document.getElementById('inputDiv').style.display = 'none';
		document.getElementById('testUrl').innerHTML = url;
		document.getElementById('newTestDiv').style.display = 'block';
		document.getElementById('laodingDiv').style.display = 'block';
		http.onreadystatechange = postLynxView;
		http.send(null);
	}
	function postLynxView() 
	{ 
		if(http.readyState == 4) 
		{ 
		   result = http.responseText;                  
		   invalid = getUrlValue(result,'axUrl_invalid'); //No I18N
		   if(invalid == 'true')
		   {
				document.getElementById('laodingDiv').style.display = 'none';
				document.getElementById('outPutDiv').innerHTML='<br><table width="50%" align="center" border="0" cellspacing="2" cellpadding="2"><tr><td class="message" style="color:red">'+errMsg+'</td></tr></table><br>'
				document.getElementById('outPutDiv').style.display = 'block';
				return false;
			}
		   
		   fileName = getUrlValue(result,'axUrl_fileName'); //No I18N
		   url = getUrlValue(result,'axUrl_url'); //No I18N
		   document.getElementById('laodingDiv').style.display = 'none';
		   document.getElementById('outPutDiv').style.display = 'block';
		   document.getElementById('resultUrl').innerHTML= url;
		   document.getElementById('outPutDivValue').innerHTML= "<iframe src='/html/"+fileName+"' width='785px' border='0' frameborder='0' height='400px' scrolling='yes' ></iframe>";
		 } 
	} 
	
	function checkRatio(frm,ranword)
	{
		if(frm.hostName.value=='')
		{
			alert(beanmsg["input_url"]);
			frm.hostName.select();
			return;
		}
		if(document.getElementById('secureWord')!=null)
		{
			if(document.getElementById('secureWord').value=='')
			{
				alert(beanmsg["empty_accessKey"]);
				document.getElementById('secureWord').focus();
				return false;
			}
			var secureWord=document.getElementById('secureWord').value;
			getHtmlForForm(frm,"postcheckRatioAccessKeyword",frm);  //No I18N
		}
	}
	
	function postcheckRatioAccessKeyword(result,frm)
	{
		var keywordstatus=getValue(result,'ax_incorrectKey');  //No I18N
		if(keywordstatus!=null)
		{
			alert(beanmsg["invalid_accessKey"]);
			document.getElementById('secureWord').select();
			return false;
		}
		frm.execute.value="textRatio";  //No I18N
		var url = document.getElementById('hostName').value;
		var getUrl = "/tools/action.do?execute=textRatio&url="+url; //No I18N
		http.open("GET",getUrl,true); 
		var url = document.getElementById('hostName').value;
		document.getElementById('inputDiv').style.display = 'none';
		document.getElementById('testUrl').innerHTML = url;
		document.getElementById('newTestDiv').style.display = 'block';
		document.getElementById('laodingDiv').style.display = 'block';
		http.onreadystatechange = postCheckRatio;
		http.send(null);
	}
	function postCheckRatio() 
	{ 
		if(http.readyState == 4) 
		{ 
		   document.getElementById('laodingDiv').style.display = 'none';
		   result = http.responseText;      
		   
		   invalid = getUrlValue(result,'axUrl_invalid'); //No I18N
		   if(invalid == 'true')
		   {
				document.getElementById('laodingDiv').style.display = 'none';
				document.getElementById('outPutDiv').innerHTML='<br><table width="50%" align="center" border="0" cellspacing="2" cellpadding="2"><tr><td class="message" style="color:red">'+errMsg+'</td></tr></table><br>'
				document.getElementById('outPutDiv').style.display = 'block';
				return false;
			}
		   
		   url = getUrlValue(result,'axUrl_url'); //No I18N
		   pagesize = getUrlValue(result,'axUrl_pageSize'); //No I18N
		   codesize = getUrlValue(result,'axUrl_codeSize'); //No I18N
		   textsize = getUrlValue(result,'axUrl_textSize'); //No I18N
		   textratio = getUrlValue(result,'axUrl_ratio'); //No I18N
		   document.getElementById('results').innerHTML = url;
		   document.getElementById('pageSize').innerHTML = pagesize+" Bytes";  //No I18N
		   document.getElementById('codeSize').innerHTML = codesize+" Bytes";  //No I18N
		   document.getElementById('textSize').innerHTML = textsize+" Bytes";  //No I18N
		   document.getElementById('ratio').innerHTML = textratio;
		   document.getElementById('outPutDiv').style.display = 'block';
		   document.getElementById('saveport').style.display='block';
                   
                   row_values = row_values.concat(["Web Page Size",pagesize+" Bytes","Code Size",codesize+" Bytes","Text Size",textsize+" Bytes","Code to Text Ratio",textratio]);//No I18N
                 
         
        	 	
        	 	//var response_data= [{"column1":"location","column2":"status","column3":"responsetime"},{"table_type":"generictable"},{"url":url},{"selectedLocationslength":locationLength}];
                        //alert(response_data);
                        //var response_data = port_response;
                        var column_values = ["Text Ratio Report for "+url,""];//No I18N
			var table_details = ["generictable","1",url];//No I18N
                        var port_response = {"rowvalues":row_values,"columnvalues":column_values,"tabledetails":table_details};//No I18N
                        //alert(port_response);
                        var json = JSON.stringify(port_response);
                        //alert(json);
                        var form = document.createElement("form");
			form.setAttribute("method", "post");
	        	form.setAttribute("action", "/tools/general/simpleTest.do");
	        	form.appendChild(getnewFormElement("hidden","method","saveTest"));//No I18N
	        	form.appendChild(getnewFormElement("hidden","port_response",json));//No I18N
	        	document.body.appendChild(form);
	        	getHtmlForForm(form,"savetest",form);//No I18N
 		
		   
		} 
	} 
	
	function getWebSpeed(frm,ranword)
	{
		if(frm.hostName.value=='')
		{
			alert(beanmsg["input_url"]);
			frm.hostName.select();
			return;
		}
		if(document.getElementById('secureWord')!=null)
		{
			if(document.getElementById('secureWord').value=='')
			{
				alert(beanmsg["empty_accessKey"]);
				document.getElementById('secureWord').focus();
				return false;
			}
			var secureWord=document.getElementById('secureWord').value;
			getHtmlForForm(frm,"postgetWebSpeedAccessKeyword",frm);  //No I18N
		}
	}
	
	function postgetWebSpeedAccessKeyword(result,frm)
	{
		var keywordstatus=getValue(result,'ax_incorrectKey');  //No I18N
		if(keywordstatus!=null)
		{
			alert(beanmsg["invalid_accessKey"]);
			document.getElementById('secureWord').select();
			return false;
		}
		frm.execute.value="webSpeedReport";  //No I18N
		var url = document.getElementById('hostName').value;
		var getUrl = "/tools/action.do?execute=webSpeedReport&url="+url; //No I18N
		http.open("GET",getUrl,true); 
		var url = document.getElementById('hostName').value;
		document.getElementById('inputDiv').style.display = 'none';
		document.getElementById('testUrl').innerHTML = url;
		document.getElementById('newTestDiv').style.display = 'block';
		document.getElementById('laodingDiv').style.display = 'block';
		http.onreadystatechange = postSpeedReport;
		http.send(null);
	}
	function postSpeedReport() 
	{ 
		if(http.readyState == 4) 
		{ 
		   document.getElementById('laodingDiv').style.display = 'none';
		   result = http.responseText;  
			
		   invalid = getUrlValue(result,'axUrl_invalid'); //No I18N
		   if(invalid == 'true')
		   {
				document.getElementById('laodingDiv').style.display = 'none';
				document.getElementById('outPutDiv').innerHTML='<br><table width="50%" align="center" border="0" cellspacing="2" cellpadding="2"><tr><td class="message" style="color:red">'+errMsg+'</td></tr></table><br>'
				document.getElementById('outPutDiv').style.display = 'block';
				return false;
			}
			
		   url = getUrlValue(result,'axUrl_url');  //No I18N
		   contentlength = getUrlValue(result,'axUrl_contentLength'); //No I18N
		   rsptime = getUrlValue(result,'axUrl_rspTime'); //No I18N
		   kbpstwentyeight = getUrlValue(result,'axUrl_kbps28'); //No I18N
		   kbpsfiftysix = getUrlValue(result,'axUrl_kbps56'); //No I18N
		   kbpssixtyfour = getUrlValue(result,'axUrl_kbps64'); //No I18N
		   kbpsonetwoeight= getUrlValue(result,'axUrl_kbps128'); //No I18N
		   kbpstwofivesix = getUrlValue(result,'axUrl_kbps256'); //No I18N
		   document.getElementById('resultUrl').innerHTML = url;
		   document.getElementById('contentLength').innerHTML = contentlength+" Bytes";  //No I18N
		   document.getElementById('rspTime').innerHTML = rsptime+" Seconds";  //No I18N
		   document.getElementById('kbps28').innerHTML = kbpstwentyeight+" Seconds";  //No I18N
		   document.getElementById('kbps56').innerHTML = kbpsfiftysix+" Seconds";  //No I18N
		   document.getElementById('kbps64').innerHTML = kbpssixtyfour+" Seconds";  //No I18N
		   document.getElementById('kbps128').innerHTML = kbpsonetwoeight+" Seconds";  //No I18N
		   document.getElementById('kbps256').innerHTML = kbpstwofivesix+" Seconds";  //No I18N
		   document.getElementById('outPutDiv').style.display = 'block';  //No I18N
                   document.getElementById('saveport').style.display='block';

	           row_values = row_values.concat(["Page Size",contentlength+" Bytes","ResponseTime",rsptime+" Seconds","28 Kbps",kbpstwentyeight+" Seconds","56 Kbps",kbpsfiftysix+" Seconds","64 Kbps",kbpssixtyfour+" Seconds","128 Kbps",kbpsonetwoeight+" Seconds","256 Kbps",kbpstwofivesix+" Seconds"]);//No I18N
                 
         
        	 	
        	 	//var response_data= [{"column1":"location","column2":"status","column3":"responsetime"},{"table_type":"generictable"},{"url":url},{"selectedLocationslength":locationLength}];
                        //alert(response_data);
                        //var response_data = port_response;
			var column_values = ["Web Speed Report for "+url,""];//No I18N
			var table_details = ["generictable","1",url];//No I18N
			var port_response = {"columnvalues":column_values,"rowvalues":row_values,"tabledetails":table_details};//No I18N
                        //port_response = port_response.concat({"table_type":"generictable","url":url,"table_count":"1","column_count":"2"});
                        
                        var json = JSON.stringify(port_response);
                        //alert(json);
                        var form = document.createElement("form");
			form.setAttribute("method", "post");
	        	form.setAttribute("action", "/tools/general/simpleTest.do");
	        	form.appendChild(getnewFormElement("hidden","method","saveTest"));//No I18N
	        	form.appendChild(getnewFormElement("hidden","port_response",json));//No I18N
	        	document.body.appendChild(form);
	        	getHtmlForForm(form,"savetest",form);//No I18N
 				   
		} 
	} 
	
	function generateTraceRoute(frm,ranword)
	{
		
		if(frm.hostName.value=='')
		{
			alert(beanmsg["input_url"]);
			frm.hostName.select();
			return false;
		}
		
		if(document.getElementById('secureWord')!=null)
		{
			if(document.getElementById('secureWord').value=='')
			{
				alert(beanmsg["empty_accessKey"]);
				document.getElementById('secureWord').focus();
				return false;
			}
			var secureWord=document.getElementById('secureWord').value;
			getHtmlForForm(frm,"postgenerateTraceRouteAccessKeyword",frm);  //No I18N
		}
	}
	
	function postgenerateTraceRouteAccessKeyword(result,frm)
	{
		var keywordstatus=getValue(result,'ax_incorrectKey');  //No I18N
		if(keywordstatus!=null)
		{
			alert(beanmsg["invalid_accessKey"]);
			document.getElementById('secureWord').select();
			return false;
		}
		
		var url = document.getElementById('hostName').value;
		document.getElementById('url').value = url;
		document.getElementById('inputDiv').style.display = 'none';
		document.getElementById('testUrl').innerHTML = url;
		document.getElementById('newTestDiv').style.display = 'block';
		document.getElementById('laodingDiv').style.display = 'block';
		
		var select = document.getElementById("location"); 
		var locationId = select.options[select.selectedIndex].value; 
		var locationName = select.options[select.selectedIndex].text; 
		
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "/tools/action.do");
		form.appendChild(getnewFormElement("hidden","execute","generateTraceRoute"));//No I18N
        form.appendChild(getnewFormElement("hidden",CSRFParamName,$.getCookie(CSRFCookieName)));//No I18N	
		form.appendChild(getnewFormElement("hidden","locid",locationId));//No I18N
		form.appendChild(getnewFormElement("hidden","url",url));//No I18N
		document.body.appendChild(form);
		getHtmlForForm(form,"postGenerateTraceRouteResults",locationName);//No I18N
	}
	
	function postGenerateTraceRouteResults(result,locationName)
	{
		document.getElementById('laodingDiv').style.display = 'none';
		if(result.match("invalid url"))
		{
			document.getElementById('errorDiv').style.display = 'block';
		}
		else
		{
			document.getElementById('outPutDiv').style.display = 'block';
			var traceRouteOutput = getUrlValue(result,'axUrl_traceRouteOutput');  //No I18N
			document.getElementById('heading').innerHTML=tracerouteto+' '+document.getElementById('url').value+' '+traceroutefrom+' '+locationName;
			document.getElementById('traceroute').innerHTML=traceRouteOutput;
		}
	}
	
	function getUrlValue(content,key) 
	{
		   content = decodeHtml(content);
		   indx = content.indexOf('*#*');
		   indx = indx+2;
		   if(indx!=-1) 
		   { 
			   line = content.substring(indx+1); 
			   lst = line.split('^*^'); 


			   for(i=0;i<lst.length;i++) 
			   { 
					var equalindex = lst[i].indexOf('$*$');
					equalindex = equalindex+2;
					keyvalue = lst[i].split('$*$') 
					if(keyvalue[0]==key) 
					{ 
					     return lst[i].substring(equalindex+1); 
					} 
			   } 
		   } 
	} 
//==========================================================================================
function downloadResponseReportAsCSV(rsptime,attVal,reportName,divarr)
{
	
    var respform = document.getElementById("responseForm"); 
    var period=$("#newperiodval").val();
    var key=respform.urlid.value;
    var starttime='';
    var endtime='';
    if(period==50){
  	  starttime=respform.startdate.value;
        endtime=respform.enddate.value;
    }
    var busy = document.getElementById("responseTimeDiv");
    var locid=respform.locid.value;
    var mtype= respform.mtype.value;
    var newrsptime = respform.timeReport.value;
    if(newrsptime!=null && newrsptime!=""){
    	rsptime=newrsptime;
    }
    closeDialog();

    var reportAtts='';

	//indexOf not supported by ie9 so changed it to inArray
    if($.inArray(mtype,customviewmonitor)!=-1)
    {
	    if(divarr != undefined)
	    {
		    var divs = divarr.replace('[','');
		    divs = divs.replace(']','');
		    divs = divs.split(',');
		    jQuery.each(divs, function() {
			    var arr = $("input[name="+this+"]"); //No I18N
			    $.each(arr,function(index, item)
				    {
					    if(item.checked)
			    {
				    reportAtts = reportAtts+"&reportAtt="+item.value; //No I18N
			    }

				    });
		    });
	    }
    }

	//indexOf not supported by ie9 so changed it to inArray
    if($.inArray(mtype,customviewmonitor)!=-1)
    {
	    link="../home/reportsinfo.do?execute=showResponseReportForServerMonitor&urlid="+key+"&period="+period+"&startdate="+starttime+"&enddate="+endtime+"&isUrl=false&mtype="+mtype + "&locid="+locid+"&reporttype=csv" ;//No I18N
    }
    else
    {
	if(reportName == null || reportName == undefined){
		reportName="";//NO i18N
	}
	    link="../home/reportsinfo.do?execute=showResponseReport&urlid="+key+"&period="+period+"&startdate="+starttime+"&enddate="+endtime+"&isUrl=false&mtype="+mtype + "&locid="+locid+"&reporttype=csv&reportName="+reportName ;//No I18N
    }
    if(rsptime != null && rsptime != "")
    {
	    link=link+"&rsptime="+rsptime;//NO I18N
    }
    if(mtype=="URL-SEQ")
    {
            var stepid = $("#responseForm input[name=stepid]").val();
            if(stepid>0)
            {
                    link = link+"&stepid="+stepid;//No I18N
            }
    }
    var reportAtt = $("#responseForm select[name=reportAttribute]").val(); //No I18N
	//indexOf not supported by ie9 so changed it to inArray
    if($.inArray(mtype,customviewmonitor)!=-1)	
    {
	    if(reportAtts!=undefined && reportAtts!='')
	    {
		    link = link+reportAtts;//No I18N
	    }
	    else
	    {
		    if(reportAtt!=undefined)
		    {
			    link = link+"&reportAtt="+reportAtt;//No I18N
		    }
		    else
		    {
			    link = link+"&reportAtt="+attVal;//No I18N
		    }
	    }
    }
    else
    {
	    if(reportAtt!=undefined)
	    {
		    link = link+"&reportAtt="+reportAtt;//No I18N
	    }
	    else
	    {
		    link = link+"&reportAtt="+attVal;//No I18N
	    }
    }
    window.open(link,"new",'scrollbars=yes,resizable=yes,width=900,height=380'); //No I18N
    
}
function downloadResponseReportAsPdf(rsptime,attVal,reportName,divarr)
{
    var respform = document.getElementById("responseForm"); 
    var period=$("#newperiodval").val();
    var key=respform.urlid.value;
    var starttime='';
    var endtime='';
    if(period==50){
  	  starttime=respform.startdate.value;
        endtime=respform.enddate.value;
    }
    var busy = document.getElementById("responseTimeDiv");
    var locid=respform.locid.value;
    var mtype= respform.mtype.value;
    var newrsptime = respform.timeReport.value;
    if(newrsptime!=null && newrsptime!=""){
    	rsptime=newrsptime;
    }
    closeDialog();
    var reportAtts='';

	//indexOf not supported by ie9 so changed it to inArray
    if($.inArray(mtype,customviewmonitor)!=-1)
    {
	    if(divarr != undefined)
	    {
		    var divs = divarr.replace('[','');
		    divs = divs.replace(']','');
		    divs = divs.split(',');
		    jQuery.each(divs, function() {
			    var arr = $("input[name="+this+"]");//No I18N
			    $.each(arr,function(index, item)
				    {
					    if(item.checked)
			    {
				    reportAtts = reportAtts+"&reportAtt="+item.value; //No I18N
			    }

				    });
		    });
	    }
    }
    
	//indexOf not supported by ie9 so changed it to inArray
    if($.inArray(mtype,customviewmonitor)!=-1)
    {
	    link="../home/reportsinfo.do?execute=showResponseReportForServerMonitor&urlid="+key+"&period="+period+"&startdate="+starttime+"&enddate="+endtime+"&isUrl=false&mtype="+mtype + "&locid="+locid+"&reporttype=pdf" ;//No I18N
    }
    else
    {
	if(reportName == null || reportName == undefined){
                reportName="";//NO i18N
        }
	    link="../home/reportsinfo.do?execute=showResponseReport&urlid="+key+"&period="+period+"&startdate="+starttime+"&enddate="+endtime+"&isUrl=false&mtype="+mtype + "&locid="+locid+"&reporttype=pdf&reportName="+reportName;//No I18N
    }
    if(rsptime != null && rsptime != "")
    {
	    link=link+"&rsptime="+rsptime;//NO I18N
    }
    if(mtype=="URL-SEQ")
    {
            var stepid = $("#responseForm input[name=stepid]").val();
            if(stepid>0)
            {
                    link = link+"&stepid="+stepid;//No I18N
            }
    }
    var reportAtt = $("#responseForm select[name=reportAttribute]").val(); //No I18N
	//indexOf not supported by ie9 so changed it to inArray
    if($.inArray(mtype,customviewmonitor)!=-1)
    {
	    if(reportAtts!=undefined && reportAtts!='')
	    {
		    link = link+reportAtts;//No I18N
	    }
	    else
	    {
		    if(reportAtt!=undefined)
		    {
			    link = link+"&reportAtt="+reportAtt;//No I18N
		    }
		    else
		    {
			    link = link+"&reportAtt="+attVal;//No I18N
		    }
	    }
    }
    else
    {
	    if(reportAtt!=undefined)
	    {
		    link = link+"&reportAtt="+reportAtt;//No I18N
	    }
	    else
	    {
		    link = link+"&reportAtt="+attVal;//No I18N
	    }
    }
    window.open(link,"new",'scrollbars=yes,resizable=yes,width=900,height=380'); //No I18N
	
}
function postSendReportMail(result,emaild)
{ 
      hideDiv('loading');//No I18N
      var message = getValue(result,'ax_mailsent');//No I18N 
      var msg = document.getElementById('msgs');     
      var innermsg = '<div class="SuccessMsgDiv">'+message+'</div>';
      innermsg = innermsg + '<div class="WardShawdowLeft"></div>';	
      msg.innerHTML=innermsg;	
      startHideFade("msgs",0.01);//No I18N	
} 
//==========================================================================================
function showInvoice(id){
		location.href='/home/accountinfo.do?method=getPDF&inv='+id;
}

function isInteger(s)
{   var i;
    for (i = 0; i < s.length; i++)
    {   
        // Check that current character is number.
        var c = s.charAt(i);
        if (((c < "0") || (c > "9"))) return false;
    }
    // All characters are numbers.
    return true;
}
function trimphoneno(s)
{   var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not a whitespace, append to returnString.
    for (i = 0; i < s.length; i++)
    {   
        // Check that current character isn't whitespace.
        var c = s.charAt(i);
        if (c != " ") returnString += c;
    }
    return returnString;
}
function stripCharsInBag(s, bag)
{   var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.
    for (i = 0; i < s.length; i++)
    {   
        // Check that current character isn't whitespace.
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }
    return returnString;
}

function checkInternationalPhone(strPhone){
var bracket=3
var phoneNumberDelimiters = "()- ";
var validWorldPhoneChars = phoneNumberDelimiters+"+";
var minDigitsInIPhoneNumber = 6;
strPhone=trimphoneno(strPhone)
if(strPhone.indexOf("+")>1) return false
if(strPhone.indexOf("-")!=-1)bracket=bracket+1
if(strPhone.indexOf("(")!=-1 && strPhone.indexOf("(")>bracket)return false
var brchr=strPhone.indexOf("(")
if(strPhone.indexOf("(")!=-1 && strPhone.charAt(brchr+2)!=")")return false
if(strPhone.indexOf("(")==-1 && strPhone.indexOf(")")!=-1)return false
s=stripCharsInBag(strPhone,validWorldPhoneChars);
return (isInteger(s) && s.length >= minDigitsInIPhoneNumber);
}
function validateUserName(frm, returnType)
{
	
if(getObj('loginName').value == "yourname@youraddress.com" || getObj('loginName').value == "")
{
alert(beanmsg["invalidemail"]); //No I18N
return;
}
var str=getObj('loginName').value;
if(frm.userType!=null && frm.userType.value=="subuser"){
	var strarr=str.split(",");
	for(var i=0;i<strarr.length;i++){
		var bval=validateEmail(strarr[i]);
		if(!bval){
			return;
		}
	}
	//var url=document.URL;
	//if(url.indexOf("alarmcentral")===-1)
	
		var value = $("input[@name=mongroups]:checked").val();
	if(value=='grp'&&($('#selMonList option').length==0))
	{
		alert(beanmsg["selectgroup"]);
		return;
	}
	else if(value=='urls'&&($('#selUrlList option').length==0))
	{
		alert(beanmsg["selecturl"]);
		return;
	}
	
	showDiv('loadingg');//NO I18N
	var emailid=encodeURIComponent(frm.loginName.value);
	var result = $.getAjaxResponse("GET","../login/UserAction.do?execute=checkUser&name="+emailid+"&type=subuser");//No I18N
	var validUsers=getValue(result,'ax_validUsers');//No I18N
	var validUsersList=validUsers.slice((validUsers.indexOf("["))+1,(validUsers.indexOf("]")))
	var invalidUsers=getValue(result,'ax_invalidUsers');//No I18N
	var invalidUsersList=invalidUsers.slice((invalidUsers.indexOf("["))+1,(invalidUsers.indexOf("]")))
	if(document.getElementById('invalidUsers')==null){
		var el1 = document.createElement('input');
		el1.setAttribute('type', 'hidden');
		el1.setAttribute('id', 'invalidUsers' );
		el1.setAttribute('name', 'invalidUsers' );
		el1.setAttribute('value', invalidUsersList);
		frm.appendChild(el1);
	}
	else{
		document.getElementById('invalidUsers').value=invalidUsersList;
	}
	if(validUsersList!=null&&validUsersList!=""){
		validUsersList = validUsersList.replace(/\s+/g, '');
		var el = document.createElement('input');
		el.setAttribute('type', 'hidden');
		el.setAttribute('id', 'validUsers');
		el.setAttribute('name', 'validUsers' );
		el.setAttribute('value',validUsersList);
		frm.appendChild(el);
		if(returnType!='' && returnType!=undefined && returnType!=null)
		{
			return true;
		}
		frm.submit();
	}
	else{
		hideDiv('loadingg');//NO I18N
		var msgdiv = document.getElementById("usermsg");
		msgdiv.innerHTML="<span class='errormessage'>EMail ids already registered</span>";
		return;
	}
	
	
}
else{
	var result = $.getAjaxResponse("GET","../login/UserAction.do?execute=checkUser&name="+frm.loginName.value);//No I18N
	fnuserstatus(result,frm);
}
	
	
}
function fnuserstatus(result,frm)
{
	userexists="";
	if(result.indexOf("</success>")!=-1)
	{
		userexists="true";
	}
	else if(result.indexOf("valid=\"deactivated\"")!=-1)
	{

		userexists="deactivated"; //No I18N
	}
	//userexists = list.getAttribute('valid')

	if(userexists=='true')
	{

		var msgdiv = document.getElementById("usermsg");
		msgdiv.innerHTML="<span class='errormessage'>EMail is already registered</span>";
		var msgdiv33 = document.getElementById("usermsg");
	}
	else if(userexists=='deactivated')
	{

		var msgdiv = document.getElementById("usermsg");
		msgdiv.innerHTML="<span class='errormessage'>EMail is already registered & deactivated</span>";
	}
	else
	{
	frm.submit();
	}
}
function validateMappinggUserName(frm)
{
if(getObj('loginName').value == "yourname@youraddress.com" || getObj('loginName').value == "")
{
alert(beanmsg["invalidemail"]); //No I18N
return;
}
getHtml('../login/UserAction.do?execute=checkUserMappingStatus&name='+frm.loginName.value+'&reselleruserid='+frm.reselleruserid.value,"fnusermappingstatus",frm); //No I18N
}
function fnusermappingstatus(result,frm)
{
	userexists="";
	if(result.indexOf("</success>")!=-1)
	{
		userexists="true";
	}
	else if(result.indexOf("valid=\"deactivated\"")!=-1)
	{

		userexists="deactivated"; //No I18N
	}
	else if(result.indexOf("valid=\"false\"")!=-1)
	{
		userexists="false"; //No I18N
	}
	else if(result.indexOf("valid=\"conflictmapping\"")!=-1)
	{

		userexists="conflictmapping"; //No I18N
	}
	else if(result.indexOf("valid=\"isalreadyreseller\"")!=-1)
        {
                userexists="isalreadyreseller"; //No I18N
        }

	if(userexists=='false')
	{

		var msgdiv = document.getElementById("usermsg");
		msgdiv.innerHTML="<span class='errormessage'>No such account exisits.</span>";
		var msgdiv33 = document.getElementById("usermsg");
	}
	else if(userexists=='deactivated')
	{

		var msgdiv = document.getElementById("usermsg");
		msgdiv.innerHTML="<span class='errormessage'>You cannot map an account which is already deactivated.</span>";
	}
        else if(userexists=='conflictmapping')
	{

		var msgdiv = document.getElementById("usermsg");
		msgdiv.innerHTML="<span class='errormessage'>This EMail is already mapped to another reseller.</span>";
	}
	else if(userexists=='isalreadyreseller')
        {
                var msgdiv = document.getElementById("usermsg");
                msgdiv.innerHTML="<span class='errormessage'>You cannot map an exisiting reseller to your account.</span>";
        }


	else
	{
	frm.submit();
	}
}
//======================== HOMEPAGE REVAMP Fns====================================

function pageLength(frm)
{
    frm.execute.value = "showMonitorsAvailability";//No I18N
    frm.pageno.value = 1;
    frm.keyword.value ='';//No I18N
    frm.appendChild(getnewFormElement("hidden","fp","homepage"));//No I18N
    $('#loadingdiv').show();//No I18N
    var ajaxResp = $.getAjaxResponse("POST",frm.action,$(frm).serialize());//No I18N
    $('#ajaxdiv').html(ajaxResp);//No I18N
    $('#loadingdiv').hide();//No I18N
}

function post(URL, PARAMS) {
	var temp=document.createElement("form");//No I18N
	temp.action=URL;
	temp.method="POST";//No I18N
	temp.style.display="none";//No I18N
	for(var x in PARAMS) {
		var opt=document.createElement("textarea");//No I18N
		opt.name=x;
		opt.value=PARAMS[x];
		temp.appendChild(opt);
	}
	document.body.appendChild(temp);
	temp.submit();
	return temp;
}

function checkEnterPress(this1,e,frm,isSLA)
{ 
    var characterCode = null;
    if(e && e.which){ //if which property of event object is supported (NN4)
    e = e
    characterCode = e.which //character code is contained in NN4's which property
    }
    else{
    e = event
    characterCode = e.keyCode //character code is contained in IE's keyCode property
    }
    if(characterCode == 13){ //if generated character code is equal to ascii 13 (if enter key)
    searchfn(this1,frm,isSLA);
    return false
    }
    else{
    return true
    }
}

function sfblur(this1,val)
{
  if((this1.className == "sblur") && ((this1.value != beanmsg["msg_search_monitors"]) || (trim(this1.value) != "")))
    {
	this1.className="sblur";
	this1.value= beanmsg["msg_search_monitors"];
    }
}

function sffocus(this1)
{
    if(this1.className == "sblur")
    {
      this1.value='';
      //this1.className="sfocus";
    }
    this1.className="sfocus";
    this1.focus();
}

function searchfn(this1,frm,isSLA)
{
	$.removeCSRFParam();
	var key = trim(this1.value);
    if((key == undefined) || (key == ""))//No I18N
    {
	alert(beanmsg["key_not_empty"]);
	this1.value="";//No I18N
	this1.focus();
	return true;
    }

    if((key == beanmsg["msg_search_monitors"]) && (this1.className='sblur'))
    {
	alert(beanmsg["key_not_empty"]);
	this1.value="";//No I18N
	this1.focus();
	return true;
    }
    if(isSLA=='true')
	{
	  $("#slareportform input[name=keyword]").val(key);
	  $.showSlaTabView();
	  return;
	}

   if((frm == null || frm == undefined))
    {
	   if(isSLA=='false')
	   {
		   post("../home/CreateTest.do", {execute:"showMonitorsAvailability",keyword:this1.value});	//No I18N
	   }
	   else
	   {
		   post("../home/SlaReport.do", {execute:"showSLAReport",keyword:this1.value});	//No I18N
	   }
       
       this1.className = "sfocus";//No I18N
       this1.focus();
    }
   else
    {
	hideAll();
	showDiv('userarea');//No I18N
	frm.keyword.value = this1.value;
	frm.execute.value = "showMonitorsAvailability";//No I18N
	frm.appendChild(getnewFormElement("hidden","fp","homepage"));//No I18N
	$('#loadingdiv').show();//No I18N
	var ajaxResp = $.getAjaxResponse("POST",frm.action,$(frm).serialize());//No I18N
	$('#ajaxdiv').html(ajaxResp);//No I18N
	$('#loadingdiv').hide();//No I18N
    }
}

function changepage(param,currentpage,noofpages,frm)
{
    if(param == 'prev')
    {
	if(currentpage == 1)
	{
	  return false;
	}
	else
	{	
	  frm.pageno.value = currentpage-1;
	  frm.execute.value = "showMonitorsAvailability";//No I18N
	  frm.appendChild(getnewFormElement("hidden","fp","homepage"));	//No I18N 
	  frm.keyword.value ='';//No I18N
	  $('#loadingdiv').show();//No I18N
	  var ajaxResp = $.getAjaxResponse("POST",frm.action,$(frm).serialize());//No I18N
	  $('#ajaxdiv').html(ajaxResp);//No I18N
	  $('#loadingdiv').hide();//No I18N
	}
    }

    if(param == 'next')
    {
	if(currentpage == noofpages)
	{
	  return false;
	}
	else
	{
	  frm.pageno.value = currentpage + 1;
	  frm.execute.value = "showMonitorsAvailability";//No I18N
	  frm.appendChild(getnewFormElement("hidden","fp","homepage"));	 //No I18N
	  frm.keyword.value ='';//No I18N
	  $('#loadingdiv').show();//No I18N
	  var ajaxResp = $.getAjaxResponse("POST",frm.action,$(frm).serialize());//No I18N
	  $('#ajaxdiv').html(ajaxResp);//No I18N
	  $('#loadingdiv').hide();//No I18N
	}
    }

}

function sortMonitors(frm,order)
{
    frm.execute.value = "showMonitorsAvailability";//No I18N
    if(order == 'desc')//No I18N
    {
      frm.appendChild(getnewFormElement("hidden","order","desc"));//No I18N
    }
    frm.appendChild(getnewFormElement("hidden","fp","homepage"));//No I18N
    $('#loadingdiv').show();//No I18N
    var ajaxResp = $.getAjaxResponse("POST",frm.action,$(frm).serialize());//No I18N
    $('#ajaxdiv').html(ajaxResp);//No I18N
    $('#loadingdiv').hide();//No I18N
}

 function checkforAtleastOneSelected(ml){

    var len = ml.length;
    var count=0;
    var mlval = null;
    var mlval2=null;
      for (var i = 0; i < len; i++)
      {
	  mlval = ml[i].value;
	  if ((ml[i].checked)) //if ((ml[i].checked) && (mlval.indexOf("G-") < 0)) -->excluding GROUP checkboxes 
	    {		  
		mlval2 = ml[i].value;
		count++;
		if(count >= 2)
		{
		    break;
		}		  
	    }
      }
      if(count == 0)
      {
	  return 0;
      }
      else if(count == 1)
      {
	return 1;
      }
      else
      {
	return 2;
      }
}

function checkforAtleastOneGroupSelected(ml)
{
    var len = ml.length;
    var mlval = null;
    var groupAvail = false; 
      for (var i = 0; i < len; i++)
      {
	  mlval = ml[i].value;
	  if ((ml[i].checked) && (mlval.indexOf("G-") == 0))//only groups
	    {
		groupAvail = true;
		break;		
	    }
      }
      return groupAvail;    
}

function bulkeditupdate(frm)
{	
	if(validateConfForm()===false)
	{
		return;
	}
      if(frm.timeout.value=='')
	    {
	  alert(beanmsg["timeoutempty"]);
	  frm.timeout.select();
	  return;
	    }


    if(isNaN(frm.timeout.value)) {
	    alert(beanmsg["invalid_timeout"]);
	    frm.timeout.select();
	    return false
	}
    if(frm.monitorPollId.value==12)
    {
	    if(frm.timeout.value>30)
	    {
		    alert(beanmsg["timeout_limit_exceeded"]);
		    frm.timeout.select();
		    return false
	    }
    }
    if(frm.timeout.value<=0)
    {
	    alert(beanmsg["zerotimeout"]);
	    frm.timeout.select();
	    return false
    }
    if(frm.timeout.value>120)
    {
	    alert(beanmsg["timeout_gt_90"]);
	    frm.timeout.select();
	    return false
    }
    if(frm.locationsenabled!=null&&frm.locationsenabled.checked)
	{
    	var islocallowed=checkPkgUserSeclocations(frm);
    	if(!islocallowed)
    	{
    		return false;
    	}
	}
    var sel = false;
    var actionelementid = 0;
    ele = frm.elements;
    total_sms=0;
    for(i=0;i<ele.length;i++)
    {
	    if(ele[i].name=="actions" )
	    {
		    if(ele[i].checked)
		    {
			    sel=true;
			    if(ele[i].id.indexOf("sms")==0)
			    {
				    total_sms=total_sms+1
			    }
		    }
		    else if(actionelementid<=0)
		    {
			    actionelementid = i;
		    }
	    }
    }
    if(!sel)
    {
	    ele[actionelementid].checked = true;
    }
    if(frm.rtcheckenabled.checked)
      {
      fld = getField(frm,'thresholds(responsetime-3)');//No I18N
      if(fld.value=='')
	{
	  frm.rtcheckenabled.checked=false;
	  document.getElementById("rtcheck").style.display="none"
	}
      }
	if(frm.contentmatchenabled.checked)
	{
	try
	{ 
   		available = getField(frm,'thresholds(0-5)'); //No I18N
   		unavailable = getField(frm,'thresholds(0-4)'); //No I18N
   		regex  = getField(frm,'thresholds(0-21)'); //No I18N
			fld1 = getField(frm,'thresholds(0-4)');//No I18N
  	 		if(document.getElementById('notfound').checked===true && trim(unavailable.value)==='')//No I18N
			{
			    alert(beanmsg["url_unavail_key_empty"]);//No I18N
			    fld1.focus();
			    return false;
			}
			fld1 = getField(frm,'thresholds(0-5)');//No I18N
			if(document.getElementById('found').checked===true && trim(available.value)==='')//No I18N
			{
			    alert(beanmsg["url_avail_key_empty"]);//No I18N
			    fld1.focus();
			    return false;
			}
			fld1 = getField(frm,'thresholds(0-21)');//No I18N
			if(document.getElementById('regex').checked===true && trim(regex.value)==='')//No I18N
			{
			    alert(beanmsg["url_regex_empty"]);//No I18N
			    fld1.focus();
			    return false;
			}
		if(!document.getElementById('notfound').checked && !document.getElementById('found').checked && !document.getElementById('regex').checked)
		{
			if(!confirm(beanmsg["bulk_update_confirm"]))
			{
				return false;
			}
		}
	}
	catch(er1)
	{
		//Do Nothing
	} 
	disableEmptyFields(frm);
	}
   	
    frm.appendChild(getnewFormElement("hidden","fp","homepage"));//No I18N
    var ajaxResp = $.getAjaxResponseWithCSRF("POST",frm.action,$(frm).serialize());//No I18N
    $('#ajaxdiv').html(ajaxResp);//No I18N
}


function checkForServerSelected(actionid,ml)
{
	var len = ml.length;
	var mlval2=null;
	var isfreeuser=document.getElementById('freeuser').value;
	for (var i = 0; i < len; i++)
	{
		if ((ml[i].checked))  
		{		  
			mlval2 = ml[i].value;
			var mySplitResult = mlval2.split(",");
			var mtype = mySplitResult[1];
			var val = mySplitResult[2];
			if(actionid=="3" && mtype=="SERVER" && isfreeuser=='false' && val=="true")
			{
				alert(beanmsg["server_act_mons"]); //No I18N
				return 1;
			}
			else if(actionid=="4" && mtype=="SERVER" && val=="true")
			{
				return 2;
			}
			else if(actionid=="5" && mtype=="SERVER")
			{
				return 6;
			}
		}
	}
	return 0;
}

function bulkaction(frm)
{	
	var monitors = document.getElementsByName('monitors');
	//Actionid is 1 for 'select option' text.
     	if(frm.actionid.value==1)
        {
          	return;
        }
	var resid="";
        var attid="";

	var stat = checkforAtleastOneSelected(monitors);
	var serverstat = checkForServerSelected(frm.actionid.value,monitors);
        //if(!checkforOneSelected(frm,"monitors"))
	if(stat == 0)
        {
        	hideDiv('loading');  //No I18N
        	alert(beanmsg["bulk_opn_one"]);
              	frm.actionid.value=1;
            	return;
        }
        else if(frm.actionid.value==4)
        {
           	if(serverstat == "2")
		{
			if(!confirm(beanmsg["server_susp_mons"]))
			{
				return;
			}
		}
		else
		{
			if(!confirm(beanmsg["susp_mons"]))
			{
				return;
			}
		}
        }
     	else if(frm.actionid.value==5)
        {
     		var msg = beanmsg["del_mons_only"];
		if(serverstat == "6")
		{
			msg = beanmsg["del_server_mons"];
		}
		if(checkforAtleastOneGroupSelected(monitors))
		{
		    var msg = beanmsg["del_mons"];
		    msg = msg + "\r\n\r\n" + beanmsg["global_note"] + ": " + beanmsg["del_grp_mons_note"];//No I18N
		}
           	if(!confirm(msg))
            	{
              	    return;
            	}
        }
       	var i=0;
	var oneediturlid = null;
	var oneeditmontype = null;
        for(i;i<monitors.length;i++)
        {
                if(monitors[i].checked==true)
		{
                	var temp=monitors[i].value;
			    var test=temp.split(",");
			    var res=test[0];
			    var att=test[1];
			//====single edit=======
			if(res.indexOf("G-") ==-1)
			{	
			   oneediturlid = res;
			   oneeditmontype = att;
			}
			//====single edit=======
                        if(resid!="")
                        {
                                resid=resid+","+res;
                                attid=attid+","+att;
                        }
                        else
                        {
                                resid=res;
                                attid=att;
                        }
		}
        }
	frm.urllist.value=resid;
	if(frm.actionid.value == 2)
	{
		if((stat == 1) && ((oneediturlid != null) || (oneediturlid != undefined)))
		{
		   /* if((oneeditmontype == null) || (oneeditmontype == undefined))
		    {
		      alert(beanmsg["susp_mont_msg"]);
		      return;
		    }*/
		    editMonitor(oneeditmontype,oneediturlid);		 
		}
		else{
			var isfreeuser=document.getElementById('freeuser').value;
			if(isfreeuser=='true')
			{
				alert(beanmsg["bulk_not_supported"]);
				return;
			}
		     var pageno =1;
		     var pageLen= 1;
		     if(frm.pageno != null || frm.pageno != undefined)
			{
				pageno = frm.pageno.value;
			}
		    if(frm.pageLen != null || frm.pageLen != undefined)
		        {
		          pageLen = frm.pageLen.value;
		        }
			  var form = document.createElement("form");
			  form.setAttribute("method", "post");
			  form.setAttribute("action", "/home/CreateTest.do");
			  if(document.getElementById('fromprobe')!=undefined){
				form.appendChild(getnewFormElement("hidden","fromprobe",document.getElementById('fromprobe').value));//No I18N
			  }
			  form.appendChild(getnewFormElement("hidden","execute","bulkEdit"));//No I18N
			  form.appendChild(getnewFormElement("hidden","urllist",resid));//No I18N
			  form.appendChild(getnewFormElement("hidden","pageno",pageno));//No I18N
			  form.appendChild(getnewFormElement("hidden","pagelen",pageLen));//No I18N
			  form.appendChild(getnewFormElement("hidden","keyword",frm.keyword.value));//No I18N
			  //frm.appendChild(getnewFormElement("hidden","fp","homepage"));//No I18N  
			  $('#loadingdiv').show();//No I18N
			  //var ajaxResp = $.getAjaxResponseWithCSRF("POST",form.action,$(form).serialize());//No I18N
			  var ajaxResp = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
			  var top_pad = ( $(window).height()) / 2+$(window).scrollTop() + "px";//No I18N
			  var left_pad = ( $(window).width() - 800 ) / 2+$(window).scrollLeft() + "px"; //No I18N
			  $.showPopUpResponse(ajaxResp,'125',left_pad,'1','815');					      
			  $('#loadingdiv').hide();//No I18N		      
		  }
		return;
	}
	
	if(frm.actionid.value !=2)//5-del 4-susp 3-active 2-edit  6-probe reset
	{
		frm.appendChild(getnewFormElement("hidden",CSRFParamName,$.getCookie(CSRFCookieName)));//No I18N 
		if(frm.actionid.value == 6){
			alert(beanmsg["probe_reconcile"]);
		}
		frm.submit();
	     /* frm.appendChild(getnewFormElement("hidden","fp","homepage"));//No I18N  
	      $('#loadingdiv').show();//No I18N
	      var ajaxResp = $.getAjaxResponse("POST",frm.action,$(frm).serialize());//No I18N
	      $('#ajaxdiv').html(ajaxResp);//No I18N
	      $('#loadingdiv').hide();//No I18N */
	}
	else{frm.submit();}
}

function activateSingleMonitor(frm,monid)
{
    if((monid != null) || (monid!= '')){
    frm.appendChild(getnewFormElement("hidden","fp","homepage"));//No I18N
    frm.urllist.value = monid;
    frm.actionid.value = 3;
    $('#loadingdiv').show();//No I18N
    var ajaxResp = $.getAjaxResponseWithCSRF("POST",frm.action,$(frm).serialize());//No I18N
    $('#ajaxdiv').html(ajaxResp);//No I18N
    $('#loadingdiv').hide();//No I18N
}
}

function unCheckGroup(this1,grpid)
 {
       var elem=document.getElementById(grpid);
       var headercheckbox1=document.getElementById("headercheckbox1");
       if(!this1.checked)
       {
               if(elem != null)
               {
                 elem.checked = false;
               }
               headercheckbox1.checked = false;
       }
 }

//======================== HOMEPAGE REVAMP Fns==================================================

function doPortTestForMsp(host,port,id1,id2)
{
	var form = document.createElement("form");
	form.setAttribute("method", "post");
	form.setAttribute("action", "/tools/general/simpleTest.do");
	form.appendChild(getnewFormElement("hidden","method","doPortTestForMsp"));//No I18N
	form.appendChild(getnewFormElement("hidden","url",host));//No I18N
	form.appendChild(getnewFormElement("hidden","port",port));//No I18N
	document.body.appendChild(form);
	getHtmlForForm(form,"postPortResponseForMsp",id1,id2);//No I18N
}

function postPortResponseForMsp(result,id1,id2)
{
	if(result.match('Threshold Limit Exceeded'))
	{
		document.getElementById('output').innerHTML='Request blocked. Please try after sometime';//No I18N
	}
	else
	{
		var availability=getValue(result,'ax_availability');//No I18N
		var availabilityimage="&nbsp;&nbsp;<img src='/images/sla-up.png'  height='15px' width='15px' style='margin-top:5px;'/>";//No I18N
		var availabilitymsg = "Failed"//No I18N
		if(availability==1)
		{
			availabilityimage="&nbsp;&nbsp;<img src='/images/sla-up.png' height='15px' width='15px' style='margin-top:5px;'/>";
			availabilitymsg = "Passed";//No I18N
		}
		else if(availability==0)
		{
			availabilityimage="&nbsp;&nbsp;<img src='/images/sla-down.png' height='15px' width='15px' style='margin-top:5px;'/>";
			availabilitymsg = "Failed";//No I18N
		}
		else
		{
			availabilityimage="&nbsp;&nbsp;-";//No I18N
			availabilitymsg = "";
		}
		document.getElementById(id1).innerHTML=availabilityimage;
		document.getElementById(id2).innerHTML=availabilitymsg;
	}
}
/*====================INVOKE URL ACTION functions================*/
  function showActionPost(a) 
   {   
	var newDisplay = "block";//No I18N 
	if (document.all)
	{
	  //IE4+ specific code
	  newDisplay = "block"; //No I18N
	}
	else 
	{
	  //Netscape and Mozilla
	  newDisplay = "table-row"; //No I18N
	}    
	if(a=='P' || a=='J')
        {
          hideDiv('actionGetDiv'); //No I18N
          document.getElementById("actionPostDiv").style.display = newDisplay; //No I18N
          if(a=='P')
          {
                document.getElementById("actionPostText").style.display = newDisplay; //No I18N
                document.getElementById("actionPostJsonText").style.display = "none"; //No I18N
          }
          else
          {
                document.getElementById("actionPostText").style.display = "none"; //No I18N
                document.getElementById("actionPostJsonText").style.display = newDisplay; //No I18N
          }
        }
	else if(a=='G') 
	{ 
	  hideDiv('actionPostDiv'); //No I18N
	  document.getElementById("actionGetDiv").style.display = newDisplay; //No I18N
	}  
   }
    
   function showAddUrlActionForm(popup)
   {    
      if(popup)
      {
	  //getHtml('/home/Notifications.do?execute=showAddActionForm',"postAddActionForm");//No I18N    
	  getHtml('/home/Notifications.do?execute=showAddActionForm',"postAddActionForm");//No I18N    
      }
      else
      {
	  hideDiv('AlertsTab_editactionform'); //No I18N
	  showDiv('AlertsTab_addactionform');//No I18N
      }
   }
   
    function postAddActionForm(result)
    {
	var top_pad = ( $(window).height()) / 2+$(window).scrollTop() + "px";//No I18N
	var left_pad = ( $(window).width() - 500 ) / 2+$(window).scrollLeft() + "px"; //No I18N
	$.showPopUpDiv(result,'1300',left_pad,'1','600');//No I18N
    }
  
  
    function changeActionDiv(val)
    {      
      if(val == 0)
      {
	  hideDiv('invokeurlaction');//No I18N
      }     
      else if(val == 1)
      {
	  document.getElementById("invokeurlaction").style.display="block";//No I18N
      }
    }
    
    function fnCreateActionToList(frm)
    {
	if(trimString(frm.actionName.value).length < 1)
        {
                alert(beanmsg["actionnameempty"]);
		frm.actionName.select();
                return;
        }
   	if(trimString(frm.url.value).length < 8)
   	{
     		alert(beanmsg["urlempty"]);
     		frm.url.select();
     		return;
   	}
      	if(!checkUrl(frm.url.value))
       	{
          	frm.url.select();
          	return;
       	}
	if(frm.timeout.value=='')
	{
       		alert(beanmsg["timeoutempty"]);
       		frm.timeout.select();
       		return;
	}
	if(isNaN(frm.timeout.value)) 
	{
        	alert(beanmsg["invalid_timeout"]);
        	frm.timeout.select();
        	return;
    	}
	if(isNaN(frm.timeout.value)) 
	{
        	alert(beanmsg["invalid_timeout"]);
        	frm.timeout.select();
        	return;
    	}
	importxmlForForm(frm,"fnPostActionAdd");//No I18N
    }

    function fnPostActionAdd(a)
    {
	var list = a.firstChild.childNodes;	
	var id ='1';
	var tbl = document.getElementById('monitoractionstbl');//No I18N
	if(tbl==null)
	{
	    closeDialog();
	    location.href='../home/Notifications.do?execute=listNotifications';//No I18N
	    return;
	}
	/*var lastRow = tbl.rows.length;
	for(i=0;i<list.length;i++)
	{
	    id=list.item(i).getAttribute('ax_id');
	    if(id==null)
	    {
		    alert(beanmsg["addactionfailed"]);//No I18N
		    break;
	    }
	    var name = list.item(i).getAttribute('ax_actionDesc');
	    id =  trim(id);
	    if((name == undefined) || (name == null))
	    {
	      name = '';
	    }
	    name = trim(name);
	    var lastRow = tbl.rows.length;
	    var row = tbl.insertRow(lastRow-1);

	    var cell1 = row.insertCell(0);
	    cell1.setAttribute('title', name);
	    cell1.setAttribute("class", "labeltd");
	    //cell1.setAttribute('style','color:#333333;font-family:sans-serif,Helvetica,sans-serif;font-size:11px;height:25px;padding-left:10px;');
	    cell1.setAttribute('nowrap', 'nowrap');
	    cell1.innerHTML = "<input type='checkbox' value=' " + id + "' name='userActions'>  " + name;

	    var cell2 = row.insertCell(1);
	    cell2.setAttribute('align', 'left');
	    var down = statusmsg["down_status_msg"];
	    var up = statusmsg["up_status_msg"];
	    var trouble = statusmsg["trouble_status_msg"];
	    cell2.innerHTML = "<select class='formtext' name='actionThresholds("+ id + "-alerttype)'><option value=0>"+down+"</option><option value=2>"+trouble+"</option><option value=1>"+up+"</option></select>";//No I18N
	    */
	id=list.item(0).getAttribute('ax_id');
	if(id==null)
	{
		alert(beanmsg["addactionfailed"]);//No I18N
		return;
	}
	var name = list.item(0).getAttribute('ax_actionDesc');
	id =  trim(id);
	if((name == undefined) || (name == null))
	{
		name = '';
	}
	name = trim(name);
	var down = statusmsg["down_status_msg"];
	var up = statusmsg["up_status_msg"];
	var trouble = statusmsg["trouble_status_msg"];
	var anyStatus = statusmsg["any_status_msg"];
	var cell2content = "<select class='formtext' name='actionThresholds("+ id + "-alerttype)'><option value=0>"+down+"</option><option value=2>"+trouble+"</option><option value=1>"+up+"</option><option value=-1>"+anyStatus+"</option></select>";//No I18N 	  
	var cellcontent = '<input type="checkbox" value="'+id+'" name="userActions">'+name;
	var lastcell = $('#monitoractionstbl tr:last td:last').html();
	if(lastcell.length>10 || id.length>5 )
	{
		$('#monitoractionstbl tr:last').before('<tr><td nowrap="nowrap" title="'+name+'" class="labeltd">'+cellcontent+'</td><td align="left" id="selDiv" >'+cell2content+'</td></tr>');
	}
	var message = beanmsg["addactionsuccess"];//No I18N
	msg = document.getElementById('addActionMsgs');//No I18N
	msg.innerHTML ="<span class='errormessage'>"+ message+"</span>";//No I18N
	closeDialog();
	document.getElementById("intimate").style.display= 'none';
    }

    function editAction(id)
    {
	    getHtml('../home/Notifications.do?execute=showAddActionForm&id='+id,"fnPostEditAction")  //No I18N
    }
    function fnPostEditAction(result)
    {
	    var top_pad = ( $(window).height()) / 2+$(window).scrollTop() + "px";//No I18N
	    var left_pad = ( $(window).width() - 500 ) / 2+$(window).scrollLeft() + "px"; //No I18N
	    $.showPopUpDiv(result,'200',left_pad,'1','600');//No I18N	
    }

    function fnupdateAction(frm)
    {
	if(trimString(frm.actionName.value).length < 1)
        {
                alert(beanmsg["actionnameempty"]);
		frm.actionName.select();
                return;
        }
   	if(trimString(frm.url.value).length < 8)
   	{
     		alert(beanmsg["urlempty"]);
     		frm.url.select();
     		return;
   	}
      	if(!checkUrl(frm.url.value))
       	{
          	frm.url.select();
          	return;
       	}
	if(frm.timeout.value=='')
	{
       		alert(beanmsg["timeoutempty"]);
       		frm.timeout.select();
       		return;
	}
	if(isNaN(frm.timeout.value)) 
	{
        	alert(beanmsg["invalid_timeout"]);
        	frm.timeout.select();
        	return;
    	}
	if(isNaN(frm.timeout.value)) 
	{
        	alert(beanmsg["invalid_timeout"]);
        	frm.timeout.select();
        	return;
    	}
	frm.execute.value="updateAction";//No I18N
	importxmlForForm(frm,"fnPostActionupdate"); //No I18N
    }
    function fnPostActionupdate()
    {
	    location.href='../home/Notifications.do?execute=listNotifications';//No I18N
    }
    function deleteAction(id)
    {
	    location.href='../home/Notifications.do?execute=deleteAction&id='+id;//No I18N
    }
/*====================INVOKE ACTION URL functions ENDSSSS================*/
    function buySMSPack(isreseller,tab)
    {
    	if(isreseller=='true')
    	{
    		var win1 = window.open( '../jsp/reseller/smspack.jsp?sms=true', '','scrollbars=no,resizable=no,width=550,height=150,left=150,top=100');
    	}
    	else
    	{
    		gotoPage('showBuySMSForm',tab); //No I18N
    	}
    }
    
    function buyUserPack(isreseller)
    {
    	if(isreseller=='true')
    	{
    		   var win1 = window.open( '../jsp/reseller/smspack.jsp?user=true', '','scrollbars=no,resizable=no,width=550,height=150,left=150,top=100');
    	}
    	else
    	{
    		gotoPage('adduserform');//No I18N
    	}
    }

/*==================== SSL_CERTIFICATE_VALIDATORfunctions ENDSSSS================*/
function fnsubmitsslcert(frm)
{
	if(!trimString(frm.displayname.value).length > 0)
        {
                alert(pingmsg["ping_displayname_empty"]);
                frm.displayname.select();
                return;
        }
	if(!trimString(frm.hostName.value).length > 0)
        {
                alert(pingmsg["ping_hostname_empty"]);
                frm.hostName.select();
                return;
        }
	if(!trimString(frm.timeout.value).length > 0)
        {
                alert(pingmsg["ping_timeout_check"]);
                frm.timeout.select();
                return;
        }
	if(isNaN(frm.timeout.value))
        {
                alert(beanmsg["invalid_timeout"]);
                frm.timeout.select();
                return;
        }
	if(!trimString(frm.port.value).length > 0)
	{
        	alert(beanmsg["port_portnumber_check"]);
		frm.port.select();
		return;
	}
	if(isNaN(frm.port.value))
        {
                alert(beanmsg["portvalue_check"]);
                frm.port.select();
                return;
        }

	var sel = false;
	var actionelementid = 0;
	ele = frm.elements;
	total_sms=0;
	for(i=0;i<ele.length;i++)
	{
		if(ele[i].name=="actions" )
		{
			if(ele[i].checked)
			{
				sel=true;
				if(ele[i].id.indexOf("sms")==0)
				{
					total_sms=total_sms+1
				}
			}
			else if(actionelementid<=0)
			{
				actionelementid = i;
			}
		}
	}
	if(!sel)
	{
		ele[actionelementid].checked = true;
	}
	try
	{
		urlid = frm.urlid.value;
	}
	catch(err)
	{
		urlid = "0";
	}
	whenToAlert = getField(frm,'thresholds('+urlid+'-22)'); //No I18N
	if(!trimString(whenToAlert.value).length > 0)
	{
        	alert(ssl_cert["whenToAlert_check"]);
		whenToAlert.focus();
		return;
	}
	if(isNaN(whenToAlert.value))
        {
                alert(ssl_cert["whenToAlert_check_number"]);
                whenToAlert.focus();
                return;
        }
        frm.displayname.value=trimString(frm.displayname.value);
        frm.hostName.value=trimString(frm.hostName.value);
        frm.port.value = trimString(frm.port.value);
        frm.submit();
	return;
}

function hideAddSSLCert()
{
        showDiv("userarea");//No I18N
        hideDiv("MonitorDiv");//No I18N
        hideDiv("addEmailDiv");//No I18N
        hideDiv("AlertsTab_showsmslist");//No I18N
        hideDiv("help");//No I18N
}
function changeSSLPortNumber(val)
{
	var sslPort = document.getElementById('sslPortNo');
	val = trim(val);
	if(val == '0')//NO I18N
	{
		sslPort.value = "443";//NO I18N
	}
	else if(val == '1')//NO I18N
	{
		sslPort.value = "465"; //NO I18N
	}
	else if(val == '2')//NO I18N
	{
		sslPort.value = "995"; //NO I18N
	}
	else if(val == '3')//NO I18N
	{
		sslPort.value = "993"; //NO I18N
	}
	else if(val == '4')//NO I18N
	{
		sslPort.value = "990"; //NO I18N
	}
	else
	{
		sslPort.value = "443"; //NO I18N
	}
}

/*==================== SSL_CERTIFICATE_VALIDATORfunctions ENDSSSS================*/
/*================================Multiple user login starts=========================*/
function showAddUser(){
	url="/home/AddUser.do?execute=showAddUser";//No I18N
	url1="/home/AddUser.do?execute=showAddUserConfig";//No I18N
	showDiv('loadingg');//No I18N
	getHtml(url,"postCheckBalanceforAdduser");//No I18N
	getHtml(url1,"postShowAddSubUserForm");//No I18N
	
}
function postShowAddSubUserForm(result)
{
	$("#Account-users").html(result);//No I18N
	if(document.getElementById('reload')!=undefined)
	{
		var reload=document.getElementById('reload').value;
		if(reload=='true')
		{
			location.href="/home/accountinfo.do?method=showaccountdetails&tab=AccountUsers";
		}
	}
}



function postCheckBalanceforAdduser(result,action,userid)
{
	var output = getValue(result,'ax_checkbalance_status');//No I18N
    if(output=='success')
    {
    	hideDiv("Billingerrormsg");//No I18N
    }
	else
	{
        $("#errormsgdetails").html(output);//No I18N
		showDiv("Billingerrormsg");//No I18N
	}
    if(action=='activateuser'&& output=='success'){
    	url="/home/AddUser.do?execute=suspendUser&uid="+userid+"&type=activate";//No I18N
		showDiv('loadingg');//No I18N
		getHtml(url,"postShowAddSubUserForm");//No I18N
    }
}
function showSubUsers()
{
	url="/home/showSubUsers.do?method=showSubUsers";//No I18N
	getHtml(url,"postShowAddSubUserForm",false);//No I18N
}

function editUser(userid){
	url="/home/AddUser.do?execute=showUserInfo&uid="+userid;//No I18N
	showDiv('loadingg');//No I18N
	getHtml(url,"postShowAddSubUserForm");//No I18N
}
function deleteUser(userid){
	if(confirm("Do you wish to delete this User?")){
		showDiv('loadingg');//No I18N
		response = $.getAjaxResponseWithCSRF("POST", "/home/AddUser.do", "execute=deleteUser&uid="+userid);//No I18N
		postShowAddSubUserForm(response);
		if(document.getElementById("msgInfo").style.display!=undefined && document.getElementById("msgInfo").style.display=="block"){ // jshint ignore:line
            startHideFade("msgInfo",0.005);//No I18N
		}
	}
}	

function suspendUser(userid){
	url="/home/AddUser.do?execute=suspendUser&uid="+userid+"&type=suspend";//No I18N
	if(confirm("Do you wish to suspend this User?")){
		showDiv('loadingg');//No I18N
		getHtml(url,"postShowAddSubUserForm");//No I18N
	}
}

function editSubUser(frm)
{
	var value = $("input[@name=mongroups]:checked").val();
	if(value=='grp'&&($('#selMonList option').length==0))
	{
		alert(beanmsg["selectgroup"]);
		return;
	}
	else if(value=='urls'&&($('#selUrlList option').length==0))
	{
		alert(beanmsg["selecturl"]);
		return;
	}
	if(value!=null&&value=='grp')
	{
		$('#selMonList option').attr('selected', 'selected');
	}
	else if(value!=null&&value=='urls')
	{
		$('#selUrlList option').attr('selected', 'selected');
	}
	showDiv('loadingg');//No I18N
	getHtmlForForm(frm,"postShowAddSubUserForm");//No I18N
}

function activateUser(userid){
	url="/home/AddUser.do?execute=showAddUser";//No I18N
	getHtml(url,"postCheckBalanceforAdduser","activateuser",userid);//No I18N
}

	function validateSubUserName(frm)
	{
		
		getObj('loginName').value=document.getElementById('subLoginName').value;
		if(validateUserName(frm, true))
		{
			getHtmlForForm(frm,"postShowAddSubUserForm");//No I18N
		}
	}
	function userCharge(months)
	 {
		 showDiv('loadingg');//No I18N
		 var userpack=document.getElementById('userpack').value;
		 var url="/home/accountinfo.do?method=getDiscountedAmt&userpack="+userpack;//No I18N
		 getHtml(url,"postShowUserCharge");//No I18N
	 }
	 
	function postShowUserCharge(result){
		 var totalPrice = getValue(result,'ax_totalPrice');//No I18N
		 hideDiv('loadingg');//No I18N
		 document.getElementById('userAmountRow').style.display='';
		 document.getElementById('amount').value=totalPrice;
	 }

 /*================================Multiple userlogin ends=========================*/
function showScreenshot(urlid,dfsFilePath,dfsBlockId,monitortype) 
{
	var form = document.createElement("form");//No I18N
	form.setAttribute("method", "post");//No I18N
	form.setAttribute("action", "/home/CreateTest.do");//No I18N
	form.appendChild(getnewFormElement("hidden","execute","showScreenshotImage"));//No I18N
	form.appendChild(getnewFormElement("hidden","urlid",urlid));//No I18N
	form.appendChild(getnewFormElement("hidden","dfsFilePath",dfsFilePath));//No I18N
	form.appendChild(getnewFormElement("hidden","dfsBlockId",dfsBlockId));//No I18N
	form.appendChild(getnewFormElement("hidden","colCount","100"));//No I18N
	
	if(monitortype!=null && monitortype!=undefined)
    {
            form.appendChild(getnewFormElement("hidden","mt",monitortype));//No I18N
    }

	var ajaxResp = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
	$('#basicModalContent').html(ajaxResp);//No I18N
        $('#basicModalContent').modal();//No I18N
        //$.modal("<div id='basicModalContent' style='height:510px;overflow: hidden;'>"+ajaxResp+ "</div>");
}
function showFile(urlid,monitortype,fileName)
{
        var form = document.createElement("form");//No I18N
        form.setAttribute("method", "post");//No I18N
        form.setAttribute("action", "/home/CreateTest.do");//No I18N
        form.appendChild(getnewFormElement("hidden","execute","showScreenshotImage"));//No I18N
        form.appendChild(getnewFormElement("hidden","urlid",urlid));//No I18N
        form.appendChild(getnewFormElement("hidden","fileName",fileName));//No I18N
        form.appendChild(getnewFormElement("hidden","colCount","100"));//No I18N
        form.appendChild(getnewFormElement("hidden","mt",monitortype));//No I18N
        var ajaxResp = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
        $('#basicModalContent').html(ajaxResp);//No I18N
        $('#basicModalContent').modal();//No I18N
        //$.modal("<div id='basicModalContent' style='height:510px;overflow: hidden;'>"+ajaxResp+ "</div>");
}
function showScreenshotTransition(urlid,monitortype,screenshotsPropsListAsString,len,index,whr)
{
	if((whr!= undefined) && (whr != null))
	{
		if(whr== "N")//No I18N
		{
			index = index+1;
		}
		else if(whr=="P")//No I18N
		{
			index = index-1;
		}
	}
	else if(index < 0)
	{
		index = 0;
	}

	var form = document.createElement("form");//No I18N
	form.setAttribute("method", "post");//No I18N
	form.setAttribute("action", "/home/CreateTest.do");//No I18N
	form.appendChild(getnewFormElement("hidden","execute","showScreenshotImageTransition"));//No I18N
	form.appendChild(getnewFormElement("hidden","urlid",urlid));//No I18N
	form.appendChild(getnewFormElement("hidden","mt",monitortype));//No I18N
        form.appendChild(getnewFormElement("hidden","screenshotsPropsIndex",index));//No I18N
	form.appendChild(getnewFormElement("hidden","colCount","100"));//No I18N
        form.appendChild(getnewFormElement("hidden","screenshotsPropsListLength",len));//No I18N
	form.appendChild(getnewFormElement("hidden","screenshotsPropsListAsString",screenshotsPropsListAsString));//No I18N
	var ajaxResp = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
	$('#basicModalContent').html(ajaxResp);//No I18N
	if((whr==null) || (whr==undefined))
	{	
        	$('#basicModalContent').modal();//No I18N
	}
        //$.modal("<div id='basicModalContent' style='height:510px;overflow: hidden;'>"+ajaxResp+ "</div>");
}

function showcountrylinks(ele){
	var links=document.getElementsByName(ele);
	for(var i=0;i<links.length;i++){
		links[i].className="links";
	}
}
function hidecountrylinks(ele){
	var links=document.getElementsByName(ele);
	for(var i=0;i<links.length;i++){
		links[i].className="links hideline";
	}
}

function sortResponse(){
	var ele=document.getElementById('resptime').value;
	var maxresptime=document.getElementById('maxresptime').value;
	var newarr=new Array();
	var nodataarr=new Array();
	var ifirst=true;
	var jfirst=true;
	var k=0;
	var j=0;
	for(var i=0;i<ele;i++){
		var percent=document.getElementById('time'+(i+1)).innerHTML;
		percent=percent.toLowerCase();
		percent=percent.slice(0,percent.indexOf("<img"));
		percent=percent.replace(",","");
		var newval=trimString(percent);
		if(isNaN(parseFloat(newval))){

			if(jfirst){
				j=0;
				jfirst=false;
			}
			else{
				j++;
			}
			nodataarr[j]=new Array(2);
			nodataarr[j][0]="";
			nodataarr[j][1]=document.getElementById('hour'+(i+1)).innerHTML;
		}
		else{
			/*if(newval.length<maxresptime.length){
				var diff=maxresptime.length-newval.length;
				for(j=0;j<diff;j++){
					newval="0"+newval;
				}
			}*/
			if(ifirst){
				k=0;
				ifirst=false;
			}
			else{
				k++;
			}
			newarr[k]=new Array(2);
			newarr[k][0]=newval;
			newarr[k][1]=document.getElementById('hour'+(i+1)).innerHTML;
		}
	}
	if(document.getElementById('order').value=='true'){
		document.getElementById('arrowid').src="/images/icon_black_arrow.gif";
		document.getElementById('order').value='false';
		newarr.sort(value);
	}
	else{
		document.getElementById('order').value='true';
		document.getElementById('arrowid').src="/images/icon_black_uparrow.gif";
		newarr.sort(value1);
	}
	function value(a,b) {
		a = a[0];
		b = b[0];
		return a == b ? 0 : (a < b ? -1 : 1);
	}
	function value1(a,b) {
		a = a[0];
		b = b[0];
		return a == b ? 0 : (a > b ? -1 : 1);
	}
	for(var i=0;i<newarr.length;i++){
		var percent1=new Number(newarr[i][0]);
		var newval=parseFloat(percent1.valueOf());
		var newpercent=parseFloat((percent1/maxresptime)*90);
		if(isNaN(parseFloat(newpercent))){
			newpercent = 0;
		}
		var finalval=addCommas(newval);
		finalval=finalval+"<img src='../images/spacer.gif' alt=''  width='3'>";
		$('#bar'+(i+1)).css({'width':''+newpercent+'%'});//No I18N
		$('#bar'+(i+1)).addClass('ResponseTimeBar');
		$('#bar'+(i+1)).html("");
		$('#time'+(i+1)).html(finalval);
		$('#hour'+(i+1)).html(newarr[i][1]);
	}
	var l=newarr.length;
	for(var i=0;i<nodataarr.length;i++){
		$('#bar'+(l+1)).removeClass('ResponseTimeBar');
		$('#bar'+(l+1)).css({'width':'100%'});//No I18N
		$('#bar'+(l+1)).html(reportmsg["nodata_msg"]);
		$('#time'+(l+1)).html("");
		$('#hour'+(l+1)).html(nodataarr[i][1]);
		l++;
	}
}
function sortApdex()
{
	var ele=document.getElementById('places').value;
	var maxresptime=document.getElementById('maxapdex').value;
	var newarr=new Array();
	var ifirst=true;
	var jfirst=true;
	var k=0;
	var j=0;
	for(var i=0;i<ele;i++){
		var percent=document.getElementById('value'+(i+1)).innerHTML;
		percent=percent.toLowerCase();
		percent=percent.slice(0,percent.indexOf("<img"));
		percent=percent.replace(",","");
		var newval=trimString(percent);
		
			if(ifirst){
				k=0;
				ifirst=false;
			}
			else{
				k++;
			}
			newarr[k]=new Array(2);
			newarr[k][0]=newval;
			newarr[k][1]=document.getElementById('disp'+(i+1)).innerHTML;
		
	}
	if(document.getElementById('order').value=='true'){
		document.getElementById('arrowid').src="/images/icon_black_arrow.gif";
		document.getElementById('order').value='false';
		newarr.sort(value);
	}
	else{
		document.getElementById('order').value='true';
		document.getElementById('arrowid').src="/images/icon_black_uparrow.gif";
		newarr.sort(value1);
	}
	function value(a,b) {
		a = a[0]+a[1];
		b = b[0]+b[1];
		return a == b ? 0 : (a < b ? -1 : 1)
	}
	function value1(a,b) {
		a = a[0]+a[1];
		b = b[0]+b[1];
		return a == b ? 0 : (a > b ? -1 : 1)
	}
	for(var i=0;i<newarr.length;i++){
		var percent1=new Number(newarr[i][0]);
		var newval=parseFloat(percent1.valueOf());
		var newpercent=parseFloat((percent1/maxresptime)*90);
		var finalval=percent1.toFixed(2) ;
		finalval=finalval+"<img src='../images/spacer.gif' alt=''  width='3'>";
		$('#value'+(i+1)).html(finalval);
		$('#disp'+(i+1)).html(newarr[i][1]);
	}
}
function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
/* ----------------------------- Tool for SSL Certificate check -- start  ------------------*/
function testSSLCertificate(frm,ranword)
	{
		
		if(frm.urlLink.value=='')
		{
			alert(beanmsg["input_url"]);
			frm.hostName.select();
			return false;
		}
		
		if(document.getElementById('secureWord')!=null)
		{
			if(document.getElementById('secureWord').value=='')
			{
				alert(beanmsg["empty_accessKey"]);
				document.getElementById('secureWord').focus();
				return false;
			}
			getHtmlForForm(frm,"postSSLCertificateAccessKeyword",frm);  //No I18N
		}
	}
	function postSSLCertificateAccessKeyword(result,frm)
	{
		var keywordstatus=getValue(result,'ax_incorrectKey');  //No I18N
		if(keywordstatus!=null)
		{
			alert(beanmsg["invalid_accessKey"]);
			document.getElementById('secureWord').select();
			return false;
		}
		
		var url = frm.urlLink.value;
		frm.execute.value = "checkSSLCertificate";
		document.getElementById('inputDiv').style.display = 'none';
		document.getElementById('testUrl').innerHTML = url;
		document.getElementById('newTestDiv').style.display = 'block';
		document.getElementById('laodingDiv').style.display = 'block';

		getHtmlForForm(frm,"postcheckSSLCertificate");//No I18N
	}
	function postcheckSSLCertificate(result)
	{
		var errVale = getUrlValue(result,'axUrl_invalidUrl');
		var txtVale = getUrlValue(result,'axUrl_imgMsg');
		if(errVale != null || txtVale == null)
		{
			document.getElementById('laodingDiv').style.display = 'none';
			document.getElementById('errorDiv').style.display = 'block';
		}else{
			document.getElementById('laodingDiv').style.display = 'none';
			document.getElementById('outPutDiv').style.display = 'block';
			document.getElementById('imgMsg').innerHTML=txtVale;
			document.getElementById('txtMsg').innerHTML=getUrlValue(result,'axUrl_txtMsg');
			document.getElementById('isDate').innerHTML=':&nbsp;'+getUrlValue(result,'axUrl_issuedDate');
			document.getElementById('exDate').innerHTML=':&nbsp;'+getUrlValue(result,'axUrl_exDate');
			document.getElementById('dayExp').innerHTML=':&nbsp;'+getUrlValue(result,'axUrl_daysTOex');
			document.getElementById('istocn').innerHTML=':&nbsp;'+getUrlValue(result,'axUrl_issuedToCn');
			document.getElementById('istoo').innerHTML=':&nbsp;'+getUrlValue(result,'axUrl_issuedToO');
			document.getElementById('istoou').innerHTML=':&nbsp;'+getUrlValue(result,'axUrl_issuedToOu');
			document.getElementById('isbycn').innerHTML=':&nbsp;'+getUrlValue(result,'axUrl_issuedByCn');
			document.getElementById('isbyo').innerHTML=':&nbsp;'+getUrlValue(result,'axUrl_issuedByO');
			document.getElementById('isbyou').innerHTML=':&nbsp;'+getUrlValue(result,'axUrl_issuedByOu');
		}

	}

/* ----------------------------- Tool for SSL Certificate check -- end  ------------------*/


function showStartDate(id)
{
	$('#'+id ).datepicker(
	{
		changeMonth: true,
		changeYear: true,
		dateFormat: 'mm/dd/yy', //No I18N
		altField: '#actualStartTrigger',
		altFormat: 'yy-mm-dd'
	});
}

function showEndDate(id)
{
	$('#'+id ).datepicker(
	{
			changeMonth: true,
			changeYear: true,
			dateFormat: 'mm/dd/yy', //No I18N
			altField: '#actualEndTrigger',
			altFormat: 'yy-mm-dd'
	});
}

function setScheduleMaintenanceDate(start, end)
{
	var temp = start;
	if(temp!="" && temp!=null)
	{
		document.getElementById('startTrigger').value = temp.substring(5,7)+"/"+temp.substring(8,10)+"/"+temp.substring(0,4);
		document.getElementById('onceStartTime').value = temp.substring(11,16);
	}
	
	
	temp = end;
	if(temp!="" && temp!=null)
	{
		document.getElementById('endTrigger').value = temp.substring(5,7)+"/"+temp.substring(8,10)+"/"+temp.substring(0,4);
		document.getElementById('onceEndTime').value = temp.substring(11,16);
	}
	
}

function globalShowMenuInDialog(holder, source)
{
	var idposition = $("#"+holder).offset();
	var idwidth = $("#"+holder).width();
	var idheight = $("#"+holder).height();
	var posX = idposition.left-1;
	 var finalY = idposition.top+21- document.body.scrollTop;
	showDialog(document.getElementById(source).innerHTML, 'position=absolute,closeButton=no,closeOnBodyClick=yes,left=' + posX + ',top=' + finalY);//No I18N
}	

function validateConfForm()
{
	var pollerid=$("#addmonitorform select[name=primaryLocation]").val();
	var mtype=$("#addmonitorform input[id=monitortype]").val();
	var urlRegEx=/^https{0,1}:\/\/\w/gi;
	var ipRegex=/^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/
	var emailRegEx=/^.+@.+\..{2,4}$/;
	var nonEmptyString=/\S/;
	var elem = document.getElementsByTagName("validation-params");
	for(var i = 0; i < elem.length; i++)
	{
		mandatory = elem[i].getAttribute('mandatory');
		regex = elem[i].getAttribute('regex');
		dataType = elem[i].getAttribute('dataType');
		idName = elem[i].getAttribute('paramId');
		elementId = document.getElementById(idName);
		elementValue = $("#addmonitorform input[id="+idName+"]").val()
		if(elementValue==undefined && idName != 'primaryLocation')
		{
			elementValue=trimString($("#"+idName).val());				
		}
		if(elementValue==undefined && idName == 'primaryLocation')
		{
			elementValue="";				
		}
		elementLabel = elem[i].getAttribute('label');
		errorLevel = '';
		
		validation = elem[i].getAttribute('validation');
		checkids = elem[i].getAttribute('checkid');
		condition = elem[i].getAttribute('condition');
		if(validation!=null && checkids!=null)
		{
			validationRequired = false;
			checkid = checkids.split(",");
			for(var j=0; j<checkid.length; j++)
			{
				var type = document.getElementById(checkid[j]).type;
				if(type=='checkbox')
				{
					if(condition!=null && ((condition=='checked' && document.getElementById(checkid[j]).checked) || (condition=='unchecked' && !document.getElementById(checkid[j]).checked)))
					{
						validationRequired = true;
						break;
					}
				}
			}
			if(!validationRequired)
			{
				continue;
			}
		}
		
		parentAttributeId = elem[i].getAttribute('parentAttributeId');
		
		if(parentAttributeId!=null)
		{
			if(!document.getElementById('attrib'+parentAttributeId).checked)
			{
				continue;
			}
			else
			{
				if(document.getElementById("advDivStatus") != undefined)
				{
					document.getElementById("advDivStatus").value='false'; 
					document.getElementById("advancedicon").src = '../images/icon_hide.gif'; 
					document.getElementById("advdiv").style.display = "block";
				}
			}
		}
		
		var customRegex = new RegExp(regex);
		
		if(mandatory!=null && mandatory=='1' && elementValue!=null && trimString(elementValue).length==0)
		{
			errorLevel = 'mandatory';
		}
		else if(dataType!=null && dataType!='' && dataType=='number' && isNaN(elementValue))
		{
			errorLevel = 'nan';
		}
		else if(regex!=null && regex!='' && (regex=='url' || regex=='ip' || regex=='email' ||regex=='nonempty'))
		{
			if((regex=='url' && !(urlRegEx.test(elementValue))) || (regex=='ip' && !(ipRegex.test(elementValue))) || (regex=='email' && !(emailRegEx.test(elementValue))) || (regex=='nonempty' && !(nonEmptyString.test(elementValue))))
			{
				errorLevel = 'regex';
			}
		}
		else if(regex!=null && regex!='' && !customRegex.test(elementValue))
		{
				errorLevel = 'regex';
		}
		
		if(errorLevel!=null && errorLevel!='')
		{
			if(errorLevel=='mandatory')
			{
				alert(beanmsg["conf_validation_mandatory"].replace("element",elementLabel));
				
			}
			else if(errorLevel=='nan')
			{
				alert(beanmsg["conf_validation_nan"].replace("element",elementLabel))
			}
			else if(errorLevel=='regex')
			{
				alert(elem[i].getAttribute('validationMessage'));
			}
			
			elementId.focus();
			elementId.select();
			$('#'+idName).addClass("redborder");
			return false;
		}
	} 
	if(mtype!=undefined && mtype.search('VMWAREESX|VMWAREVM|VCENTER|REDIS|CASSANDRA|MEMCACHE') != -1 && (pollerid==null||pollerid===undefined)){// jshint ignore:line
		alert(beanmsg["global.install.poller"]);
		location.href="/home/CreateTest.do?execute=showProbe";
		return false;

	}
	
	try
	{
		var version = $("#addmonitorform input[id=versionsupport]");
		var flag=false;
		if(mtype=='VCENTER' && version!=null && version!=undefined)// jshint ignore:line
		{
			var versionval = version.val();
			versionval=versionval.split(",");
			for(var k=0;k<versionval.length;k++)
			{
				if(versionval[k].trim()==pollerid)// jshint ignore:line
				{
					flag=true;
					break;
				}
			}
			if(flag)
			{
				alert(beanmsg["global.vcenter.unsupported.version"]);
				location.href="/home/CreateTest.do?execute=showProbe";
				return false;
			}
		}
	}
	
	catch(e)
	{
		//alert(e);
	}
	
	if(mtype=='VMWAREVM'||mtype=='VMWAREESX'||mtype=='VCENTER')// jshint ignore:line
	{
		try
		{
			var exec=$("#addmonitorform input[name=execute]").val();
			if(exec=="addConfMonitor")// jshint ignore:line
			{
				var hid="HOSTNAME";//NO I18N
				var pid="PORT";//NO I18N
				if(mtype=="VMWAREESX")// jshint ignore:line
				{
					hid="ESX_HOSTNAME";//NO I18N
					pid="ESX_PORT";//NO I18N
				}

				var host = document.getElementById(hid).value;
				var port = document.getElementById(pid).value;
				var res = checkHostExists(host,port,mtype);
				if(res=="true")// jshint ignore:line
				{
					return false;
				}
			}
		}
		catch(e)
		{
			//alert(e);
			//return false;
		}
	}

	var islocallowed=checkPkgUserSeclocations(document.forms[0]);
	if(!islocallowed)
	{
		return false;
	}
	return true;
}

function checkHostExists(h,p,mtype)
{
	var datavalues = "host="+h+"&port="+p+"&mtype="+mtype;//No I18N
	var response = $.getAjaxResponseWithCSRF("POST","/home/CreateTest.do?execute=hostCheck",datavalues);//No I18N
	var alreadyadded = getValue(response,'ax_alreadyadded');//No I18N
	if(alreadyadded=="true")// jshint ignore:line
	{
		var message = getValue(response,'ax_msg');//No I18N
		var msg = document.getElementById('msgs');     
		var innermsg = '<div class="SuccessMsgDiv">'+decodeURIComponent(message)+'</div>';
		innermsg = innermsg + '<div class="WardShawdowLeft"></div>';	
		msg.innerHTML=innermsg;	
		showDiv("msgs",0.01);//No I18N	
	}
	return alreadyadded;
}

function disableUncheckConfFields()
{
	var elem = document.getElementsByTagName("validation-params");
	var caseSensitivityCheck=true;
	for(var i = 0; i < elem.length; i++)
	{
		parentAttributeId = elem[i].getAttribute('parentAttributeId');
		if(parentAttributeId!=null)
		{
			idName = elem[i].getAttribute('paramId');
			elementId = document.getElementById(idName);
			if(elementId !=null)
			{
				elementId.disabled=!document.getElementById('attrib'+parentAttributeId).checked;
			}
			if(document.getElementById("alertType-"+parentAttributeId)!=null)
			{
				document.getElementById("alertType-"+parentAttributeId).disabled=!document.getElementById('attrib'+parentAttributeId).checked;
			}
			if(document.getElementById("attrib4") != null && (document.getElementById("attrib4").checked) || document.getElementById("attrib5") != null && (document.getElementById("attrib5").checked)){
			//if((document.getElementById("attrib4").checked) || (document.getElementById("attrib5").checked)){
				caseSensitivityCheck=false;
			}
		}
	}
	if(document.getElementById("caseSensitivity") != null && document.getElementById("caseSensitivity") != undefined){
		document.getElementById("caseSensitivity").disabled=caseSensitivityCheck;
		if(caseSensitivityCheck){
			document.getElementById("caseSensitivity").checked=false;
		}
	}
}

function slaCheckAll(frm)
{
	document.getElementById("monRadioAll").checked=true;
	document.getElementById("mon").style.display = "none"; //No I18N
}

function slaCheckSel(frm)
{
	document.getElementById("monRadioSel").checked=true;
	document.getElementById("mon").style.display = "block"; //No I18N
}

function copyClipboard(val)
{
	window.clipboardData.setData('Text',val);
	window.clipboardData.cleanData;
}

function showRCA(downtime,urlid,monitortype)
{
	fnOpenNewScrollWindow("/home/CreateTest.do?execute=showRCA&mid="+urlid+"&dt="+downtime+"&mt="+monitortype,"1000","500");//No I18N
}
function changeColor(val)
{
	if(val=='body')
  	{
  	   flg=1;
  	}
	flg++;
	if(val=="click")
	{
		ch_colr=2;
		flg=1;
	}
	else if(val=="body" && flg!=2)
	{
		ch_colr=ch_colr+1;
	}
	var cls = document.getElementById("uname").className;
	if(ch_colr%2==0 && flg!=2){
		flg=1;
		document.getElementById("uname").className="click-link-logo";
	}else if(ch_colr%2==1 && flg!=2){
		var popupLayer = document.getElementById("_DIALOG_LAYER");
		if(popupLayer != null){
			popupLayer.style.display="none";
		}
		document.getElementById("uname").className="nor-link-logo-a";
	}
  	else if(flg==2 && cls=='click-link-logo' && document.getElementById("_DIALOG_LAYER").style.display!='')
  	{
  	    document.getElementById("uname").className="nor-link-logo-a";
  	}
  	else
  	{
		flg=0;
		ch_colr=0;
	}
}

function include_dom(script_filename)
{
	//alert(script_filename);
    var html_doc = document.getElementsByTagName('head').item(0);
    var js = document.createElement('script');
    js.setAttribute('language', 'javascript');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', script_filename);
    html_doc.appendChild(js);
    return false;
}
function generatePublicReportView(frm,viewID)
{
	var period = frm.selectedStatusViewPeriod.value;
	var report = frm.selectedStatusViewReport.value;
	var dispName = frm.dispname.value;
	var desc = frm.desc.value;
	for (i=0;i<frm.monRadio.length;i++)
	{
		if (frm.monRadio[i].checked) 
		{
			var val = frm.monRadio[i].value;
		}
	}
	var monitorList = "";//NO I18N
	if(report=="5" || report=="3"){//NO I18N
		if(report=="5"){
			period = frm.selectedStatusViewPeriodBusy.value;
		}
		monitorList = document.getElementById("busyMonList").value;//NO I18N
		val="";//NO I18N
	}else{
		if(val=="grp"){//NO I18N
			//monitorList=val;
			monitorList = document.getElementById("groupMonList").value;//NO I18N
		}else{
			if(frm.selMonList.options.length==0)
			{
				alert(beanmsg["selecturl"]);//No I18N
				return false;
			}
			else
			{
				for(j=0;j<frm.selMonList.options.length;j++)
				{
					if(j==0)
					{
						monitorList = frm.selMonList.options[j].value;//NO I18N
					}
					else
					{
						monitorList = monitorList+","+frm.selMonList.options[j].value;//NO I18N
					}
				}
			}
		}
	}
	if(monitorList == "" || monitorList == null || monitorList == undefined){
		alert(beanmsg["nothingSelected"]);//No I18N
		return false;
	}
	if(val=="grp"){//NO I18N{
		monitorList = "grp"+monitorList;//No I18N
	}
	var segment = "-1";//NO I18N
	if(report=="5"){//NO I18N
		segment = document.getElementById("busysegmentPeriod").value;
	}else if(report=="6"){//NO I18N
		segment  = document.getElementById("trendsegmentPeriod").value;
	}
	//var url = "../home/CreateTest.do?execute=addPublicView&dispName="+dispName+"&selectReport="+report+"&selectPeriod="+period+"&monitorsID="+monitorList+"&desc="+desc+"&segment="+segment+"&viewID="+viewID; //No I18N
	//http.open("POST",url,true); //NO I18N
	//http.onreadystatechange = postPublicReportStatus;
	//http.send(null);
	var datavalues = "execute=addPublicView&dispName="+dispName+"&selectReport="+report+"&selectPeriod="+period+"&monitorsID="+monitorList+"&desc="+desc+"&segment="+segment+"&viewID="+viewID; //No I18N
	var actionurl="../home/CreateTest.do?"; //No I18N
	var response = $.getAjaxResponseWithCSRF("POST",actionurl,datavalues);//No I18N
	postPublicReportStatus(response);
}
function postPublicReportStatus(response)
{
	//if(http.readyState == 4) 
	//{ 
		//result = http.responseText;
		//viewid = getValue(result,'ax_viewid'); //No I18N
		viewid = getValue(response,'ax_viewid'); //No I18N
		//servername = getValue(result,'ax_servername'); //No I18N
		servername = getValue(response,'ax_servername'); //No I18N
		var permaStr = https_var+"://"+servername+"/pv.do?id="+viewid;//NO I18N
		var str = "<iframe src='"+permaStr+"' scrolling=\'yes\' align=\'center\' height=\'400\' width=\'1000\' border=\'0\' frameborder=\'0\'></iframe>";//NO I18N
		var areavalue = document.getElementById("reportview").value;//NO I18N
		document.getElementById("viewID").value=getValue(response,'ax_tableId');//NO I18N
		if(areavalue != null && areavalue != "")//NO I18N
		{
			document.getElementById("permaview").value=permaStr;
			document.getElementById("reportview").value=str;
			document.getElementById("reportview").focus(); //No I18N
		}else{
			document.getElementById("srccode").style.display="block";//NO I18N
			document.getElementById("sourcecopy").style.display="block";//NO I18N   
			document.getElementById("permacode").style.display="block";//NO I18N
			document.getElementById("permacopy").style.display="block";//NO I18N   
			document.getElementById("permaview").value=permaStr;//NO I18N
			document.getElementById("reportview").value=str;//NO I18N
			document.getElementById("reportview").focus(); //No I18N
		}
	//}
}
function checkReportType(edit)
{
	var reportValue = document.getElementById("selectedStatusViewReport").value;//NO I18N
	var servermonitor = document.getElementById("servermonitor").value;//NO I18N
	var servicemonitor = document.getElementById("servicemonitor").value;//NO I18N
	var serverselect = document.getElementById("serverselect").value;//NO I18N
	var serviceselect = document.getElementById("serviceselect").value;//NO I18N
	var allselect =null;
	if(document.getElementById("allselect")!=null)
	{
		allselect = document.getElementById("allselect").value;//NO I18N
	}
	document.getElementById("nonbusyperiod").style.display="block";
	document.getElementById("busyperiod").style.display="none";
	if(reportValue=="1"){
		if(servicemonitor && serviceselect=="0"){
			$('#groupMonList').append('<option value="4">'+beanmsg1["internet.services"]+'</option>');
			document.getElementById("serviceselect").value="1";
		}
		if(servermonitor && serverselect=="0"){
			$('#groupMonList').append('<option value="5">'+beanmsg1["server.monitor"]+'</option>');
			document.getElementById("serverselect").value="1";
		}
		removeOptions("1",servermonitor,servicemonitor);
	}else if(reportValue == "2" || reportValue == "4" || reportValue == "6"){
		if(allselect=="0"){	
			$('#groupMonList').append('<option value="0">'+beanmsg1["allMonitors"]+'</option>');
			document.getElementById("allselect").value="1";
		}
		if(servicemonitor && servicemonitor=="0"){
			$('#groupMonList').append('<option value="4">'+beanmsg1["internet.services"]+'</option>');
			document.getElementById("serviceselect").value="1";
		}
		if(servermonitor && serverselect=="0"){
			$('#groupMonList').append('<option value="5">'+beanmsg1["server.monitor"]+'</option>');
			document.getElementById("serverselect").value="1";
		}
		removeOptions("2",servermonitor,servicemonitor);
	}
	
	if(reportValue=="5" || reportValue=="3")//NO I18N
	{
		document.getElementById("nonbusyReport").style.display="none";//NO I18N
		document.getElementById("busyReport").style.display="block";//NO I18N
		document.getElementById("mon").style.display="none";//NO I18N
		document.getElementById("groupMon").style.display="none";//NO I18N
		if(reportValue=="5")
		{
			document.getElementById("busysegment").style.display="block";//NO I18N
			document.getElementById("trendsegment").style.display="none";//NO I18N
			document.getElementById("nonbusyperiod").style.display="none";
			document.getElementById("busyperiod").style.display="block";

		}else{
			document.getElementById("busysegment").style.display="none";//NO I18N
			document.getElementById("trendsegment").style.display="none";//NO I18N
		}
		//statusCheckGroup(document.getElementById("StatusviewForm"),'grp');//NO I18N
		return;
	}
	
	if(reportValue=="6")
	{
		document.getElementById("trendsegment").style.display="block";//NO I18N
		document.getElementById("busysegment").style.display="none";//NO I18N
	}else{
		document.getElementById("trendsegment").style.display="none";//NO I18N
		document.getElementById("busysegment").style.display="none";//NO I18N
	}
	document.getElementById("nonbusyReport").style.display="block";//NO I18N
	document.getElementById("busyReport").style.display="none";//NO I18N
	document.getElementById("monRadioGroup").checked=true;
	document.getElementById("mon").style.display = "none"; //No I18N
	document.getElementById("groupMon").style.display = "block"; //No I18N
	if(edit){
		statusCheckGroup(document.getElementById("StatusviewForm") ,'sel');//NO I18N
	}
}

function removeOptions(val,servermonitor,servicemonitor,frmObj)
{
	var frm = document.getElementById("StatusviewForm");
	if(frm == null || frm == undefined){
		frm=frmObj;
	}
	var count=0;
	for(j=0;j<frm.groupMonList.options.length;j++)
	{
		var alloption = frm.groupMonList.options[j].value;//NO I18N
		if(val=="1")
		{
			if(alloption=="0"){
				frm.groupMonList.options[j] = null;
				document.getElementById("allselect").value="0";	
			}
		}else if(val=="2")
		{
			if(alloption=="4" || alloption=="5" && count=="0")
			{
				count++;
				if(servicemonitor){
					frm.groupMonList.options[j] = null;
					document.getElementById("serviceselect").value="0";	
				}
				if(servermonitor){
					frm.groupMonList.options[j] = null;
					document.getElementById("serverselect").value="0";
				}
			}
		}

	}
}

function isSpclCharCheck(data)
{
	var spChars ="~`!@#$%^&*()+=-[]\\\';,./{}|\":<>?";//NO I18N
	for (var i = 0; i < data.length; i++) {
		if (spChars.indexOf(data.charAt(i)) != -1)
		{
			return true;
        	}
	}
}
function statusCheckGroup(frm,check)
{
	if(check=="grp")//NO I18N
	{
		document.getElementById("monRadioGroup").checked=true;
		document.getElementById("mon").style.display = "none"; //No I18N
		document.getElementById("groupMon").style.display = "block"; //No I18N
	}else if(check=="sel")//NO I18N
	{
		document.getElementById("monRadioSel").checked=true;
		document.getElementById("groupMon").style.display = "none"; //No I18N
		document.getElementById("mon").style.display = "block"; //No I18N
	}else if(check=="all"){//NO I18N
		document.getElementById("monRadioAll").checked=true;
		document.getElementById("groupMon").style.display = "none"; //No I18N
		document.getElementById("mon").style.display = "none"; //No I18N
	}
	else
	{	
		for (i=0;i<frm.monRadio.length;i++)
		{
			if (frm.monRadio[i].checked) 
			{
				var val = frm.monRadio[i].value; //No I18N
			}
		}
		if(val=="grp")//NO I18N
		{
			document.getElementById("mon").style.display = "none"; //No I18N
			document.getElementById("groupMon").style.display = "block"; //No I18N
		}
		else if(val=="sel")//NO I18N
		{
			document.getElementById("mon").style.display = "block"; //No I18N
			document.getElementById("groupMon").style.display = "none"; //No I18N
		}
		else if(val=="all")//NO I18N
		{
			document.getElementById("mon").style.display = "none"; //No I18N
			document.getElementById("groupMon").style.display = "none"; //No I18N
		}
	}
}
function showHistoryData(Id,attName,type,period,startdate,enddate,monid)
{
	var url ='';
	if(period == undefined)
	{
		period = 3;
	}
	if(startdate != undefined)
	{
		url = '/home/reportsinfo.do?execute=attributeReport&urlid='+Id+'&period='+period+'&isUrl=false&reportAtt='+attName+'&mtype='+type+"&startDate="+startdate+"&endDate="+enddate;//NO I18N
	}
	else
	{
		url = '/home/reportsinfo.do?execute=attributeReport&urlid='+Id+'&period='+period+'&isUrl=false&reportAtt='+attName+'&mtype='+type;//NO I18N
	}
	
	if(monid != undefined){
		url+='&monid='+monid;	//NO I18N
	}
	
	fnOpenNewScrollWindowForDimensions(url,'',1100,500) 
}
function showCPUHistoryData(processId)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+processId+'&period=3&isUrl=false&reportAtt=PROCESSCPU&mtype=SERVER','',1100,500) //NO I18N
}
//IIS Threshold Functions - Begins//
function showAppPoolIOPS(iisid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+iisid+'&period=3&isUrl=false&reportAtt=IOPS&mtype=IISSERVER','',1100,500) //NO I18N
}
function showAppPoolHC(iisid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+iisid+'&period=3&isUrl=false&reportAtt=APPPOOLHANDLECOUNT&mtype=IISSERVER','',1100,500) //NO I18N
}
function showAppPoolTC(iisid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+iisid+'&period=3&isUrl=false&reportAtt=APPPOOLTHREADCOUNT&mtype=IISSERVER','',1100,500) //NO I18N
}
function showAppPoolET(iisid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+iisid+'&period=3&isUrl=false&reportAtt=APPPOOLELAPSEDTIME&mtype=IISSERVER','',1100,500) //NO I18N
}
function showAppPoolWP(iisid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+iisid+'&period=3&isUrl=false&reportAtt=APPPOOLWRKSETPRIVATE&mtype=IISSERVER','',1100,500) //NO I18N
}
function showAppPoolPB(iisid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+iisid+'&period=3&isUrl=false&reportAtt=APPPOOLPRIVATEBYTES&mtype=IISSERVER','',1100,500) //NO I18N
}
function showAppPoolPT(iisid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+iisid+'&period=3&isUrl=false&reportAtt=APPPOOLPROCESSORTIME&mtype=IISSERVER','',1100,500) //NO I18N
}
function showAppPoolW(iisid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+iisid+'&period=3&isUrl=false&reportAtt=APPPOOLWRKSET&mtype=IISSERVER','',1100,500) //NO I18N
}

function showAppPoolCLRThread(iisid){
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+iisid+'&period=3&isUrl=false&reportAtt=APPPOOLCLRTHREAD&mtype=IISSERVER','',1100,500) //NO I18N
}
function showAppPoolClrData(iisid){
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+iisid+'&period=3&isUrl=false&reportAtt=APPPOOLCLRDATA&mtype=IISSERVER','',1100,500) //NO I18N
}
function showAppPoolCLRMemData(iisid){
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+iisid+'&period=3&isUrl=false&reportAtt=APPPOOLCLRMEM&mtype=IISSERVER','',1100,500) //NO I18N
}


function showAppPoolIOPS(iisid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+iisid+'&period=3&isUrl=false&reportAtt=IOPS&mtype=IISSERVER','',1100,500) //NO I18N
}
function showAppPoolHC(iisid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+iisid+'&period=3&isUrl=false&reportAtt=APPPOOLHANDLECOUNT&mtype=IISSERVER','',1100,500) //NO I18N
}
function showReqBytesRecData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=REQBYTESRECEIVED&mtype=IISSERVER','',1100,500) //NO I18N
}
function showResBytesSentData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=RESBYTESSENT&mtype=IISSERVER','',1100,500) //NO I18N
}
function showReqQueueData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=REQQUEUE&mtype=IISSERVER','',1100,500) //NO I18N
}
function showReqExecutingData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=REQEXECUTING&mtype=IISSERVER','',1100,500) //NO I18N
}
function showReqPerSecData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=REQPERSEC&mtype=IISSERVER','',1100,500) //NO I18N
}
function showReqTimeoutData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=REQTIMEOUT&mtype=IISSERVER','',1100,500) //NO I18N
}
function showReqNotFoundData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=REQNOTFOUND&mtype=IISSERVER','',1100,500) //NO I18N
}
function showReqNotAuthData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=REQNOTAUTH&mtype=IISSERVER','',1100,500) //NO I18N
}
function showReqRejectedData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=REQREJECTED&mtype=IISSERVER','',1100,500) //NO I18N
}
function showReqFailedData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=REQFAILED&mtype=IISSERVER','',1100,500) //NO I18N
}

function showReqFailedOverallData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=REQFAILEDOVERALL&mtype=IISSERVER','',1100,500) //NO I18N
}
function showReqSuccessData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=REQSUCCESS&mtype=IISSERVER','',1100,500) //NO I18N
}
function showReqTotalData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=REQTOTAL&mtype=IISSERVER','',1100,500) //NO I18N
}
function showReqAnonData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=REQANONYMOUS&mtype=IISSERVER','',1100,500) //NO I18N
}
function showPipelineData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=PIPELINE&mtype=IISSERVER','',1100,500) //NO I18N
}

function showAppCacheTotalData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=CACTOTAL&mtype=IISSERVER','',1100,500) //NO I18N
}
function showAppCacheAPIHitData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=CACAPIHITS&mtype=IISSERVER','',1100,500) //NO I18N
}
function showAppCacheOPhitData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=CACOUTPUTHITS&mtype=IISSERVER','',1100,500) //NO I18N
}
function showAppCacheHitRatioData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=CACOTHITRATIO&mtype=IISSERVER','',1100,500) //NO I18N
}
function showAppCacheMissRatioData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=CACHEHITMISSRATIO&mtype=IISSERVER','',1100,500) //NO I18N
}
function showAppCacheCACMMLData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=CACMML&mtype=IISSERVER','',1100,500) //NO I18N
}
function showAppCacheTrimsData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=CACTRIMS&mtype=IISSERVER','',1100,500) //NO I18N
}
function showSesActiveData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=SESACTIVE&mtype=IISSERVER','',1100,500) //NO I18N
}
function showSesSQLConnData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=SESSQLCONN&mtype=IISSERVER','',1100,500) //NO I18N
}
function showSesStateConnData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=SESSTATECONN&mtype=IISSERVER','',1100,500) //NO I18N
}
function showSesTimeoutData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=SESTIMEOUT&mtype=IISSERVER','',1100,500) //NO I18N
}
function showSesTotalData(appid)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+appid+'&period=3&isUrl=false&reportAtt=SESTOTAL&mtype=IISSERVER','',1100,500) //NO I18N
}

//IIS Threshold Functions - Ends//

function showMemUsageHistoryData(processId)
{
	fnOpenNewScrollWindowForDimensions('/home/reportsinfo.do?execute=attributeReport&urlid='+processId+'&period=3&isUrl=false&reportAtt=PROCESSMEMORY&mtype=SERVER','',1100,500) //NO I18N
}
function webAppRegisterForm_submit(frm)
{
    var isRealBrowserRequest = false;
    if(document.getElementById('isRealBrowserRequest')!=null && document.getElementById('isRealBrowserRequest').value=='true')
    {
        isRealBrowserRequest = true;
    }
    
	var mon_count = document.getElementById('count').value;
	var user_email = document.getElementById('email').value;
	var user_phonenumber =document.getElementById('phonenumber').value;
	var description = document.getElementById('desc').value;
	var response = $.getAjaxResponse("POST","/login/UserAction.do","execute=sendWebAppRegisterFormDetails&count="+mon_count+"&email="+user_email+"&phonenumber="+user_phonenumber+"&desc="+description+"&isRealBrowserRequest="+isRealBrowserRequest);//No I18N
}
function updatepkgprice(frm,obj)
{
	frm=document.getElementById('acctfrm');
	if(obj!='undefined'&&obj!='')
	{
		var x=obj.id;
		if(x=='upgradebtn')
		{
			frm.checkmon.value="checkMonitors";//No I18N
		}
	}
	frm.method.value="pkgUserSubscribe";//No I18N
	frm.action="/login/accountinfo.do";
	
	getHtmlForForm(frm,"postshowupgradescreen",'');//No I18N
}

function changePlanfrombasic(frm,price,planid)
{
    if(frm=='')
    {
      frm = document.getElementById('acctfrm');
    }
    frm.price.value = price;
    //frm.PLANID.value= planid;
    updatefrombasic(frm);
}
/*For Pricing calc*/

function updatefrombasic(frm,topupscreen,rowid,calculate)
{
	frm.method.value="subscribe";//No I18N
	//frm.method.value="showupgradescreen";
	frm.action="/login/accountinfo.do";
	
	if(topupscreen=='true')
	{
		frm.action="/home/accountinfo.do?topupscreen="+topupscreen;
	}
	getHtmlForForm(frm,"postshowupgradescreen",calculate);//No I18N
}

function updatepkg(frm,topupscreen,rowid,calculate)
{
	frm.method.value="pkgUserSubscribe";//No I18N
	frm.action="/login/accountinfo.do";
	
	if(topupscreen=='true')
	{
		frm.action="/home/accountinfo.do?topupscreen="+topupscreen;
	}
	getHtmlForForm(frm,"postshowupgradescreen",calculate);//No I18N
}
function basicupgradescreen()
{
	parent.location.href= "/home/accountinfo.do?method=showPkgUserCartScreen&price=PKG_PRICE&PLANID=1";
}

function windowsclicked(){
	var options = {};
	if($("#linux").hasClass('linuximgclicked')){
		$("#linuxdiv").hide(0),
		$("#linux").addClass('linuximg').removeClass('linuximgclicked');
		if($("#windows").hasClass('windowsimg')){
			$("#windows").addClass('windowsimgclicked').removeClass('windowsimg');
		}else{
			$("#windows").addClass('windowsimg').removeClass('windowsimgclicked');
		}
		
		$( "#windowsdiv" ).toggle( "blind", options, 2000 );
		
		
		$('#imgSmile').mouseover(function()
		{
			$(this).css("cursor","pointer");
			$(this).animate({width: "500px"}, 'slow');
		});
    
		$('#imgSmile').mouseout(function()
		{   
			$(this).animate({width: "200px"}, 'slow');
		});
	}
}
function linuxclicked(){
	var options = {};
	if($("#windows").hasClass('windowsimgclicked')){
		$("#windowsdiv").hide(0);
		$("#windows").addClass('windowsimg').removeClass('windowsimgclicked');
		if($("#linux").hasClass('linuximg')){
			$("#linux").addClass('linuximgclicked').removeClass('linuximg');
		}else{
			$("#linux").addClass('linuximg').removeClass('linuximgclicked');
		}
		$( "#linuxdiv" ).toggle( "blind", options, 2000 );
	}
}

function showcustomizedtooltipsforparent(opener){
	
	var $imgs = opener.$('div.tooltipsharedcharts img');
	var $imgs_1 = opener.$('div.tooltipclickcharts img');
	var tooltip;

	opener.$('area').each(function() {
		var $area = $(this);    
		$area.attr("id", $(this).attr('title'));//No I18N
		$area.removeAttr('title'); //No I18N
	});
	
	opener.$('area[shape="RECT"]').mouseover(function(event) {
		event.preventDefault();
		opener.$('.myspan').remove();
		opener.$('.showspan').remove();
		opener.$('.tooltipspan').remove();
		tooltip = $(this).attr('id');
		
		var temp = tooltip.indexOf(':') +3;
		var id = tooltip.substr(0, temp);		
		
		var title = '';
		var point = '';
		var $areas;
		
		if(id.length>0)
			$areas = opener.$("area[id^='"+id+"']");
		if($areas!=undefined){
			$areas.each(function(i){
				var tip = $(this).attr('id'); 
				if(tip.indexOf(')')==-1)
					tip = tip.slice(0, temp) + "<br>" + tip.slice(temp);
				
				if(tip.indexOf(id) == 0){
						var $img = $(this).parent().next();
						point = $(this).attr('coords');

						var coleft = parseInt(point.split(',')[0]);
						var cotop = parseInt(point.split(',')[1]);
						
						var imgleft = parseInt($($img).offset().left);
						var imgtop = parseInt($($img).offset().top);
						
						var imgwidth = parseInt($($img).width());
						var imgheight = parseInt($($img).height());
						
						var ptx = coleft + imgleft;// + 20
						var pty = cotop + imgtop;// + 360
							
						var xpt = ptx + 5;
						var ypt = pty + 20;
						
						if(ptx + 160 > imgleft + imgwidth){
							xpt = ptx - 160;
						}/*
						if(pty + 80 > imgtop + imgheight){
							ypt = ypt - 90;
						}*/
						
						var spanid = $img.attr('src')+'_tooltip';//No I18N
						var $spanexists = document.getElementById(spanid);
					
						if($spanexists==undefined || $spanexists==null){
							var tooltipSpan = $("<span id='"+spanid+"' class='tooltipspan'>"+tip+"</span>").css({padding: '5px',width: 'auto',//No I18N
								height: 'auto',background: '#EAEAEA',border: '2px solid #000',position: 'absolute',top: ypt,left: xpt,font: '11px  Helvetica, sans-serif',//No I18N
								opacity: '.9',filter: 'alpha(opacity = 90)',borderRadius: '5px',color: '#000'});//No I18N
							
							var drawingpix = $("<span class='myspan'></span>").css({display:'block',width:'6px',height:'6px',//No I18N
								position:'absolute',color: 'crimson',opacity: '.5',	filter: 'alpha(opacity = 50)',//No I18N
								top: pty,left:ptx,background :'url(../images/network/pointer.jpg) no-repeat'});//No I18N
							if(tip.indexOf(':)')==-1)
								opener.$('body').append(drawingpix);
							opener.$('body').append(tooltipSpan);
						}else{
							var spantip = document.getElementById(spanid).innerHTML;
							spantip += '<br/>'+tip.substr((tip.indexOf('>')+1), tip.length);//No I18N
							
							var node = document.getElementById(spanid);
							node.parentNode.removeChild(node);
							
							var tooltipSpan = $("<span id='"+spanid+"' class='tooltipspan'>"+spantip+"</span>").css({padding: '5px',width: 'auto',//No I18N
								height: 'auto',background: '#EAEAEA',border: '2px solid #000',position: 'absolute',top: ypt,left: xpt,font: '11px  Helvetica, sans-serif',//No I18N
								opacity: '.9',filter: 'alpha(opacity = 90)',borderRadius: '5px',color: '#000'});//No I18N
							
							var drawingpix = $("<span class='myspan'></span>").css({display:'block',width:'6px',height:'6px',//No I18N
								position:'absolute',color: 'crimson',opacity: '.5',	filter: 'alpha(opacity = 50)',//No I18N
								top: pty,left:ptx,background :'url(../images/network/pointer.jpg) no-repeat'});//No I18N
							if(tip.indexOf(')')==-1){
								opener.$('body').append(drawingpix);
							}
							opener.$('body').append(tooltipSpan);
						}
				}
			});
			//$(this).attr('id','');
		}
	}),
	opener.$('area[shape="RECT"]').mouseout(function(event) {
		event.preventDefault();
		//$(this).attr('id',tooltip);
	}),
	opener.$('area[shape="POLY"]').mouseover(function(event) {
		event.preventDefault();
		opener.$('.myspan').remove();
		opener.$('.showspan').remove();
		opener.$('.tooltipspan').remove();
		tooltip = $(this).attr('id');
		var point = $(this).attr('coords');
		var $img = $(this).parent().next();
		var coleft = (parseInt(point.split(',')[0]) + parseInt(point.split(',')[2]) )/2;
		var cotop = (parseInt(point.split(',')[1]) + parseInt(point.split(',')[3])) /2;
		
		var imgleft = parseInt($($img).offset().left);
		var imgtop = parseInt($($img).offset().top);
		
		var imgwidth = parseInt($($img).width());
		var imgheight = parseInt($($img).height());
		
		var ptx = coleft + imgleft;
		var pty = cotop + imgtop;
					
		var tooltipSpan = $("<span class='tooltipspan'>"+tooltip+"</span>").css({padding: '5px',width: 'auto',//No I18N
						height: 'auto',background: '#EAEAEA',border: '2px solid #000',position: 'absolute',top: pty,left: ptx,font: '11px  Helvetica, sans-serif',//No I18N
						opacity: '.7',filter: 'alpha(opacity = 70)',borderRadius: '5px',color: '#000'});//No I18N
				
		opener.$('body').append(tooltipSpan);
		//$(this).attr('id','');
	}),
	opener.$('area[shape="POLY"]').mouseout(function(event) {
		event.preventDefault();
		//$(this).attr('id',tooltip);
	}),
	$($imgs).mouseleave(function(event) {
		opener.$('.myspan').remove();
		opener.$('.tooltipspan').remove();
		opener.$('.showspan').remove();
	}),
	$($imgs_1).mouseleave(function(event) {
		opener.$('.showspan').remove();
	}),
	$($imgs_1).mouseover(function(event) {
	if($('span.tooltipspan').length <= 0)
	{
		opener.$('.showspan').remove();
		var imgleft = parseInt($(this).offset().left) + 30;
		var imgtop = parseInt($(this).offset().top);
		var data = $("<span class='showspan'>Click here to see more metrics </span>").css({padding: '5px',width: 'auto',height: 'auto',background: '#ffffcc',border: '2px solid #000',position: 'absolute',top: imgtop,left: imgleft,font: '11px  Helvetica, sans-serif',opacity: '.9',filter: 'alpha(opacity = 90)',borderRadius: '5px',color: '#000'});//No I18N
		opener.$('body').append(data);
	}
	
	})
	
}

function showcustomizedtooltips(){
	
	var $imgs = $('div.tooltipsharedcharts img');
	var $imgs_1 = $('div.tooltipclickcharts img');
	var tooltip;
	

	
	$('area').each(function() {
		var $area = $(this);    
		$area.attr("id", $(this).attr('title'));//No I18N
		$area.removeAttr('title'); //No I18N
	});
	

	
	$('area[shape="RECT"]').mouseover(function(event) {
		event.preventDefault();
		$('.myspan').remove();
		$('.showspan').remove();
		$('.tooltipspan').remove();
		tooltip = $(this).attr('id');
		
		var temp = tooltip.indexOf(':') +3;
		var id = tooltip.substr(0, temp);		
		
		var title = '';
		var point = '';
		var $areas;
		
		if(id.length>0)
			$areas = $("area[id^='"+id+"']");
		if($areas!=undefined){
			$areas.each(function(i){
				var tip = $(this).attr('id'); 
				if(tip.indexOf(')')==-1)
					tip = tip.slice(0, temp) + "<br>" + tip.slice(temp);
				
				if(tip.indexOf(id) == 0){
						var $img = $(this).parent().next();
						point = $(this).attr('coords');

						var coleft = parseInt(point.split(',')[0]);
						var cotop = parseInt(point.split(',')[1]);
						
						var imgleft = parseInt($($img).offset().left);
						var imgtop = parseInt($($img).offset().top);
						
						var imgwidth = parseInt($($img).width());
						var imgheight = parseInt($($img).height());
						
						var ptx = coleft + imgleft;// + 20
						var pty = cotop + imgtop;// + 360
							
						var xpt = ptx + 5;
						var ypt = pty + 20;
						
						if(ptx + 160 > imgleft + imgwidth){
							xpt = ptx - 160;
						}/*
						if(pty + 80 > imgtop + imgheight){
							ypt = ypt - 90;
						}*/
						
						var spanid = $img.attr('src')+'_tooltip';//No I18N
						var $spanexists = document.getElementById(spanid);
						
						if($spanexists==undefined || $spanexists==null){
							var tooltipSpan = $("<span id='"+spanid+"' class='tooltipspan'>"+tip+"</span>").css({padding: '5px',width: 'auto',//No I18N
								height: 'auto',background: '#EAEAEA',border: '2px solid #000',position: 'absolute',top: ypt,left: xpt,font: '11px  Helvetica, sans-serif',//No I18N
								opacity: '.9',filter: 'alpha(opacity = 90)',borderRadius: '5px',color: '#000'});//No I18N
							
							var drawingpix = $("<span class='myspan'></span>").css({display:'block',width:'6px',height:'6px',//No I18N
								position:'absolute',color: 'crimson',opacity: '.5',	filter: 'alpha(opacity = 50)',//No I18N
								top: pty,left:ptx,background :'url(../images/network/pointer.jpg) no-repeat'});//No I18N
							if(tip.indexOf(':)')==-1)
								$('body').append(drawingpix);
							$('body').append(tooltipSpan);
						}else{
							var spantip = document.getElementById(spanid).innerHTML;
							spantip += '<br/>'+tip.substr((tip.indexOf('>')+1), tip.length);//No I18N
							
							var node = document.getElementById(spanid);
							node.parentNode.removeChild(node);
							
							var tooltipSpan = $("<span id='"+spanid+"' class='tooltipspan'>"+spantip+"</span>").css({padding: '5px',width: 'auto',//No I18N
								height: 'auto',background: '#EAEAEA',border: '2px solid #000',position: 'absolute',top: ypt,left: xpt,font: '11px  Helvetica, sans-serif',//No I18N
								opacity: '.9',filter: 'alpha(opacity = 90)',borderRadius: '5px',color: '#000'});//No I18N
							
							var drawingpix = $("<span class='myspan'></span>").css({display:'block',width:'6px',height:'6px',//No I18N
								position:'absolute',color: 'crimson',opacity: '.5',	filter: 'alpha(opacity = 50)',//No I18N
								top: pty,left:ptx,background :'url(../images/network/pointer.jpg) no-repeat'});//No I18N
							if(tip.indexOf(')')==-1){
								$('body').append(drawingpix);
							}
							$('body').append(tooltipSpan);
						}
				}
			});
			//$(this).attr('id','');
		}
	}),
	$('area[shape="RECT"]').mouseout(function(event) {
		event.preventDefault();
		//$(this).attr('id',tooltip);
	}),
	$('area[shape="POLY"]').mouseover(function(event) {
		event.preventDefault();
		$('.myspan').remove();
		$('.showspan').remove();
		$('.tooltipspan').remove();
		tooltip = $(this).attr('id');
		var point = $(this).attr('coords');
		var $img = $(this).parent().next();
		var coleft = (parseInt(point.split(',')[0]) + parseInt(point.split(',')[2]) )/2;
		var cotop = (parseInt(point.split(',')[1]) + parseInt(point.split(',')[3])) /2;
		
		var imgleft = parseInt($($img).offset().left);
		var imgtop = parseInt($($img).offset().top);
		
		var imgwidth = parseInt($($img).width());
		var imgheight = parseInt($($img).height());
		
		var ptx = coleft + imgleft;
		var pty = cotop + imgtop;
					
		var tooltipSpan = $("<span class='tooltipspan'>"+tooltip+"</span>").css({padding: '5px',width: 'auto',//No I18N
						height: 'auto',background: '#EAEAEA',border: '2px solid #000',position: 'absolute',top: pty,left: ptx,font: '11px  Helvetica, sans-serif',//No I18N
						opacity: '.7',filter: 'alpha(opacity = 70)',borderRadius: '5px',color: '#000'});//No I18N
				
		$('body').append(tooltipSpan);
		//$(this).attr('id','');
	}),
	$('area[shape="POLY"]').mouseout(function(event) {
		event.preventDefault();
		//$(this).attr('id',tooltip);
	}),
	$($imgs).mouseleave(function(event) {
		$('.myspan').remove();
		$('.tooltipspan').remove();
		$('.showspan').remove();
	}),
	$($imgs_1).mouseleave(function(event) {
		$('.showspan').remove();
	}),
	$($imgs_1).mouseover(function(event) {
	if($('span.tooltipspan').length <= 0)
	{
		$('.showspan').remove();
		var imgleft = parseInt($(this).offset().left) + 30;
		var imgtop = parseInt($(this).offset().top);
		var data = $("<span class='showspan'>Click here to see more metrics </span>").css({padding: '5px',width: 'auto',height: 'auto',background: '#ffffcc',border: '2px solid #000',position: 'absolute',top: imgtop,left: imgleft,font: '11px  Helvetica, sans-serif',opacity: '.9',filter: 'alpha(opacity = 90)',borderRadius: '5px',color: '#000'});//No I18N
		$('body').append(data);
	}
	
	})
}
var eventrow;
var processrow;
var servicerow;

function showMoreTroubleReasons()
{
	document.getElementById('moreLink').style.display='none';
	document.getElementById('moreTroubleReasons').style.display='block';
}

function showLessTroubleReasons()
{
	document.getElementById('moreLink').style.display='block';
	document.getElementById('moreTroubleReasons').style.display='none';
}

function showCustomizeReportPage(){
	
	location.href="../home/reportsinfo.do?execute=showCustomizeReport";//No I18N
}

function showPreviewReport(fromStatus){
	var logo = document.getElementById("uploadedfilename").value;//NO I18N
	var clr = document.getElementById("bgclr").value;//NO I18N
	var param="";
	if(logo!=null&&logo!='')
	{
		param=param+'&logo='+logo;//NO I18N
	}
	if(clr=='null')
	{
		clr='68AB42';//NO I18N
	}
	var fclr = document.getElementById("fontclr").value;//NO I18N
	if(fclr=='null')
	{
		fclr='FFFFFF';//NO I18N
	}
	param=param+"&bgclr="+clr+"&fontclr="+fclr;//NO I18N
	if(fromStatus=='true')
	{
		param=param+"&status=true";//NO I18N
	}
	var url='/home/reportsinfo.do?execute=showSampleReports'+param;//NO I18N
	openNewWindow(url,'report',950,500);//NO I18N
}

function customizeReportLogo()
{
	var logourl = $("#uploadedfilename").val();//NO I18N
	var fromemail="";
	var emailid=$("#email").val();
	if(emailid!=null && emailid.length>0)
	{
		if(validateEmail(emailid))
		{
			fromemail=emailid;
		}
		else
		{
			document.getElementById("email").value="";
			document.getElementById("email").focus();
			return;
		}
	}
	var bgcolor =  $("#bgclr").val();//NO I18N
	var fontcolor =  $("#fontclr").val();//NO I18N
	var maintenance =  $("#maintenance").is(':checked');//NO I18N
	var companyName= $("#companyName").val();//NO I18N
	var urlthreshold ="  ";//NO I18N
	var param="";
	if(logourl!=undefined&&logourl!=null)
	{
		param="&logourl="+logourl;//NO I18N
	}
	if(bgcolor!=undefined&&bgcolor!=null)
	{
		param=param+"&bgcolor="+bgcolor;//NO I18N
	}
	if(fontcolor!=undefined&&fontcolor!=null)
	{
		param=param+"&fontcolor="+fontcolor;//NO I18N
	}
	if(companyName!=undefined&&companyName!=null)
	{
		param=param+"&companyName="+companyName;//NO I18N
	}
	if(document.getElementById("urlthreshold")!=null)
	{
		urlthreshold=document.getElementById("urlthreshold").value;//NO I18N
	}
	var wpathreshold = "  ";//NO I18N
	if(document.getElementById("wpathreshold"))
	{
		wpathreshold=document.getElementById("wpathreshold").value;//NO I18N
	}
	var smtpthreshold = "  ";//NO I18N
	if(document.getElementById("smtpthreshold"))
	{
		smtpthreshold=document.getElementById("smtpthreshold").value;//NO I18N
	}
	if(urlthreshold.length==0|| isNaN(urlthreshold))
	{
		alert(beanmsg["invalid_resptime_change_val"]);//NO I18N
		return;
	}
	else if(urlthreshold<0)
	{
		alert(beanmsg["negative_resptime_change_val"]);//NO I18N
		return;
	}
	if(wpathreshold.length==0 || isNaN(wpathreshold))
	{
		alert(beanmsg["invalid_resptime_change_val"]);//NO I18N
		return;
	}
	else if(wpathreshold<0)
	{
		alert(beanmsg["negative_resptime_change_val"]);//NO I18N
		return;
	}
	if(smtpthreshold.length==0|| isNaN(smtpthreshold))
	{
		alert(beanmsg["invalid_resptime_change_val"]);//NO I18N
		return;
	}
	else if(smtpthreshold<0)
	{
		alert(beanmsg["negative_resptime_change_val"]);//NO I18N
		return;
	}
	var ajaxResp = $.getAjaxResponseWithCSRF("POST","../home/reportsinfo.do","execute=addCustomizedReport"+param+"&maintenance="+maintenance+"&fromemail="+fromemail+"&urlthreshold="+urlthreshold+"&wpathreshold="+wpathreshold+"&smtpthreshold="+smtpthreshold);//No I18N
	$("#showapdex").html(ajaxResp);//NO I18N
	startHideFade("previewDiv",0.01);//NO I18N
}
function uploaImg(frm)
{
	var filename = frm.theFile.value;
	if(filename=='')
	{
		alert(beanmsg["input_filename"]);//NO I18N
		frm.theFile.select();
		return;
	}
	var valid_extensions = /(.jpg|.gif|.png|.jpeg)$/
	var file_result = filename.toLocaleLowerCase();
	if(!(valid_extensions.test(file_result)))
	{
		alert(beanmsg["input_filename_extension"]);//NO I18N
		frm.theFile.select();
		return;
	}
	frm.submit();
	closeDialog();
	document.getElementById("loaddingDiv").style.display="block";//NO I18N
}
function checkPkgUserSeclocations(frm)
{
	if(document.getElementById("pkgrole")!=undefined&&document.getElementById("pkgrole").value=='pkguser')
	{
		var secondary=frm.secondaryLocations;
		var selected = new Array();
		$("input:checkbox[name=secondaryLocations]:checked").each(function() {
		       selected.push($(this).val());
		  });
		if(selected.length==0)
		{
			alert(beanmsg["selectlocations"]);
			return false;
		}
	}
	return true;
}
function getWPALinkDetails(frm,locChange)
{
	try{
		$('#loadingdiv').show();//No I18N
		frm.locChange.value = locChange;
		var ajaxResp = $.getAjaxResponse("POST",frm.action,$(frm).serialize());//No I18N
		$('#firebugOutputDiv').html(ajaxResp);//No I18N
		$('#loadingdiv').hide();//No I18N
	}
	catch(e)
	{
	}
}
function downloadReports(reporttype,urlid,reportname,filesList,mapid)
{
    var reportform = document.getElementById("reportform"); 
    var period=$("#newperiodval").val();
    var starttime='';
    var endtime='';
    if(period==50){
  	  starttime=reportform.startdate.value;
        endtime=reportform.enddate.value;
    }
    closeDialog();
    if(reportname=="outageReport")
	{
        location.href="../home/reportsinfo.do?execute=OutageReportForAllMonitors&period="+period+"&startdate="+starttime+"&enddate="+endtime+"&reporttype="+reporttype+"&urlid="+urlid;// No
	}
	else if(reportname=="LocationDownReport")
	{
	    location.href="../home/reportsinfo.do?execute=outageReport&period="+period+"&startdate="+starttime+"&enddate="+endtime+"&reporttype="+reporttype+"&urlid="+urlid;// No
	}
	else if(reportname=="logreport")
	{
	    location.href="../home/reportsinfo.do?execute=LogReport&period="+period+"&startdate="+starttime+"&enddate="+endtime+"&reporttype="+reporttype+"&urlid="+urlid;// No
	}
	else if(reportname=="apdexreport")
	{
		var locid=reportform.locationId.value;
		location.href="../home/reportsinfo.do?execute=showApdexReport&urlid="+urlid+"&period="+period+"&startdate="+starttime+"&enddate="+endtime+"&reporttype="+reporttype+"&locid="+locid+"&genmapid="+filesList+"&selected="+mapid;//NO I18N
		$.hideDiv("loading");//No I18N
	}
}


function serviceRowInlineClicked(rowId,name,path,displayname,started,startmode,state,description,servicestate){
	var id = '#'+rowId;	
	if(servicerow == undefined || servicerow == null || servicerow != rowId){
		$('#ServiceDetails').remove();
		$('#ServiceDetailsRow').remove();
		servicerow = rowId;
		$('#WinServicestable tbody tr td').removeClass('datatdbordernoborder');
		$('#WinServicestable tbody tr td').addClass('datatdborder1');
		$('#WinServicestable tbody tr').removeClass('hoverrow');
		$(id).addClass('hoverrow');
		$(id+' td ').removeClass('datatdborder1');
		$(id+' td ').addClass('datatdbordernoborder');
		$('#ServiceDetails').remove();
		$('#ServiceDetailsRow').remove();
		$("#getGeneralForm input[name=servicename]").val(name);
		$("#getGeneralForm input[name=requesttype]").val(servicestate);
		$(id).after('<tr id="ServiceDetailsRow"><td colspan="100%" class="servertooldata" style="border-bottom:1px solid  #d7d7d7;"><table id="ServiceDetails" width="100%" class="bodytext servertooldetailsdata"><tr><td width="10%">'+tools_winservices['name']+'</td><td>'+name+'</td></tr><tr><td width="10%">'+tools_winservices['path']+'</td><td style="word-wrap:break-word;word-break:break-all;" >'+path+'</td></tr><tr><td width="10%">'+tools_winservices['desc']+'</td><td style="word-wrap:break-word;word-break:break-all;" >'+description+'</td></tr></table></td></tr>');
	}
}

function processTableClickedInline(rowId,processId,processpath,processargs){
	var id = '#'+rowId;	
	if(processrow == undefined || processrow == null || processrow != rowId){
		$('#ProcessDetails').remove();
		processrow = rowId;
		$('#processlogtable tbody tr td').removeClass('datatdbordernoborder');
		$('#processlogtable tbody tr td').addClass('datatdborder1');
		$('#processlogtable tbody tr').removeClass('hoverrow');
		$(id).addClass('hoverrow');
		$(id+' td ').removeClass('datatdborder1');
		$(id+' td ').addClass('datatdbordernoborder');
		$('#ProcessDetails').remove();
		$('#ProcessDetailsRow').remove();
		$(id).after('<tr id="ProcessDetailsRow"><td colspan="100%" class="servertooldata" style="border-bottom:1px solid  #d7d7d7;"><table id="ProcessDetails" width="100%" class="bodytext servertooldetailsdata"><tr><td width="20%">'+tools_process['pid']+'</td><td>'+processId+'</td></tr><tr><td width="20%">'+tools_process['path']+'</td><td style="word-wrap:break-word;word-break:break-all;" >'+processpath+'</td></tr><tr><td width="20%">'+tools_process['args']+'</td><td style="word-wrap:break-word;word-break:break-all;" >'+processargs+'</td></tr></table></td></tr>');
	}

}

function eventLogTableClickedInline(rowId,recordNo,eventCode,message){
	var id = '#'+rowId;	
	if(eventrow == undefined || eventrow == null || eventrow != rowId){
		eventrow = rowId;
		$('#eventlogtable tbody tr td').removeClass('datatdbordernoborder');
		$('#eventlogtable tbody tr td').addClass('datatdborder1');
		$('#eventlogtable tbody tr').removeClass('hoverrow');
		$(id).addClass('hoverrow');
		$(id+' td ').removeClass('datatdborder1');
		$(id+' td ').addClass('datatdbordernoborder');
		$('#EventLogDetails').remove();
		$('#EventLogDetailsRow').remove();
		$(id).after('<tr id="EventLogDetailsRow"><td colspan="100%" class="servertooldata" style="border-bottom:1px solid  #d7d7d7;"><table id="EventLogDetails" width="100%" class="bodytext servertooldetailsdata"><tr><td width="20%">'+tools_eventlog['record']+'</td><td>'+recordNo+'</td></tr><tr><td width="20%">'+tools_eventlog['eventcode']+'</td><td>'+eventCode+'</td></tr><tr><td width="20%">'+tools_eventlog['msg']+'</td><td style="word-wrap:break-word;word-break:break-all;" >'+message+'</td></tr></table></td></tr>');
	}
}
var starttimeperiod;
var endtimeperiod;
var eventloglabel;
var eventlogvalue;
function showServerTools(option){
	var toolsuri = $("#getGeneralForm input[name=toolsuri]").val();//No I18N
	var msg = $("#eventtypediv").html();//No I18N
	if(option=='SERVER_TOOL_EVENT'){
	
		$("#displaydata").html($("#eventlogdata").html());//No I18N
		$("#eventtypediv").html(msg);//No I18N
		$.showEventTypeChanges(eventlogvalue,eventloglabel); 
	}else{
		var eventtype = trim($("#getGeneralForm input[name=eventtype]").val());//NO I18N
		var actionurl = "/tools/general/simpleTest.do";//No I18N
		var data = 'sendWMIRequest';//No I18N
		var urlid = $("#getGeneralForm input[name=monid]").val();//No I18N
		if(option=='EVENTLOGS'){
			var flag = validatecustomtime();
			if(!flag || eventtype.length<=0){
				return false;
			}
		}
		var datavalues="method="+data+"&urlid="+urlid+"&eventtype="+eventtype+"&startdate="+starttimeperiod+"&enddate="+endtimeperiod+'&reqtype='+option;//No I18N
		var response = $.getAjaxResponseWithCSRF("POST",actionurl,datavalues);//No I18N
		if(response.indexOf("output")!=-1){
			$("#displaydata").html(response);//No I18N
			$('#displaydata').show();//NO I18N
		}
	}
}

function validatecustomtime(){
	var startdate = trim($("#getGeneralForm input[name=startdatetext]").val());//No I18N
	var enddate = trim($("#getGeneralForm input[name=enddatetext]").val());//No I18N	
	var starttime = trim($("#getGeneralForm input[name=starttime]").val());//No I18N
	var endtime = trim($("#getGeneralForm input[name=endtime]").val());//No I18N	
	if(!validatetime(starttime)){
		alert(beanmsg["nostarttime"]);
		return false;
	}
	if(!validatetime(endtime)){
		alert(beanmsg["noendtime"]);
		return false;
	}	
	if((startdate===enddate) && !validatetimecheck(starttime,endtime)){
		alert(beanmsg["invalidtime"]);
		return false;
	}
	starttimeperiod = startdate+' '+starttime;
	endtimeperiod = enddate+' '+endtime;
	return true;
}
function showRCAReport(urlid,downtime)
{
	openNewWindow('../home/CreateTest.do?execute=showPerf&urlid='+urlid+'&p1=SR&showrca=true&dt='+downtime, 'report',1000,500);//NO I18N
}
function rcaupgrade(urlid,frompage){
	if(confirm(beanmsg["rca.server.upgrade"])){
		upgradeserveragents(urlid,frompage)
	}
}
function upgradeserveragents(urlid,frompage){
	if(confirm(reportmsg["js.server.agent.upgrade"])){
		if(frompage=='editpage'){
			setTimeout(function(){location.href="../home/CreateTest.do?execute=upgrade&urlid="+urlid;},0);
		}else{
	var datavaluesforupgrade = "execute=upgrade&urlid="+urlid;//No I18N
	var response = $.getAjaxResponseWithCSRF("POST","/home/CreateTest.do",datavaluesforupgrade);//No I18N
			$('#upgrademsg').text(reportmsg["js.server.agent.upgrade.success"]);//No I18N
		}
    }
    
    
}
function changeScheduleReportType(val)
{
	var reportType = document.getElementById("rptType").value;//NO I18N
	if(reportType=="5"){
		hideDiv('groupMon');//No I18N
		hideDiv('mon');//No I18N
		hideDiv('nonbusyReport');//No I18N
		hideDiv('downtimeReport');//No I18N
		showDiv('busyReport'); //No I18N
	}
	else if(reportType=="3"){
		hideDiv('groupMon');//No I18N
		hideDiv('mon');//No I18N
		hideDiv('nonbusyReport');//No I18N
		hideDiv('busyReport'); //No I18N
		showDiv('downtimeReport'); //No I18N
	}
	else if(val != null && val=="user"){
		showDiv('nonbusyReport');//No I18N
		hideDiv('busyReport'); //No I18N
		hideDiv('downtimeReport'); //No I18N
		hideDiv('groupMon'); //No I18N
		document.getElementById("monRadioGroup").disabled=true;
		document.getElementById("monRadioGroup").style.display="none";//NO I18N
		statusCheckGroup(document.getElementById("StatusviewForm") ,'sel');//NO I18N
	}else{
		hideDiv('busyReport'); //No I18N
		hideDiv('downtimeReport'); //No I18N
		showDiv('nonbusyReport');//No I18N
		statusCheckGroup(document.getElementById("StatusviewForm") ,'grp');//NO I18N
	}
}
function showHistory()
{
	 if($("#historyView").val()=="yes")//NO I18N
	 {
		 $("#historyView").val("no");//NO I18N
		 $("#showapdex").css("display","block");//NO I18N
	 }
	 else
	 {
		 $("#historyView").val("yes");//NO I18N
		 $("#showapdex").css("display","none");//NO I18N
	}
}
function loadMapData(country,width)
{
	/* if(country=="NA")
	{
		var map = new FusionMaps("/FusionCharts/FCMap_NorthAmerica.swf", "Map1Id", width, "400", "0", "1");
		map.setDataXML($("#nadata").val());
		map.render("mapdiv");//No I18N
	}
	else */ 
	if(country==0)
	{
		$("#mapid").val("EUMAP");//No I18N
		var map = new FusionCharts("Europe", "EUMAP", width, "300", "0", "1");//No I18N
		map.setDataXML($("#eurodata").val());//No I18N
		 $("#maplink").css("display","block");//No I18N
		$("#dispmap").html(apdexchartmsg.europe_heading);//No I18N
		map.render("mapdiv");//No I18N
	}
	else if(country==1)
	{
		$("#mapid").val("ASIAMAP");//No I18N
		var map = new FusionCharts("Asia", "ASIAMAP", width, "300", "0", "1");//No I18N
		 $("#maplink").css("display","block");//No I18N
		map.setDataXML($("#asiadata").val());//No I18N
		$("#dispmap").html(apdexchartmsg.asia_heading);//No I18N
		map.render("mapdiv");//No I18N
	}
	else if(country==2)
	{
		$("#mapid").val("USMAP");//No I18N
		var map = new FusionCharts("USA", "USMAP", width, "300", "0", "1");//No I18N
		 $("#maplink").css("display","block");//No I18N
		map.setDataXML($("#usdata").val());//No I18N
		$("#dispmap").html(apdexchartmsg.us_heading);//No I18N
		map.render("mapdiv");//No I18N
	}
	else
	{
		  $("#mapid").val("Map1Id");//No I18N
		  var map = new FusionCharts("WorldwithCountries", "Map1Id",width, "300","0", "1");//No I18N
	      map.setDataXML($("#mapdatacontent").val());//No I18N
	      $("#maplink").css("display","none");//No I18N
	      $("#dispmap").html(apdexchartmsg.map_heading);//No I18N
	      map.render("mapdiv");//No I18N
	}
}
function showUserDetails(userid)
{
		$.showDiv('laodingDiv');//No I18N
		var form = document.createElement("form");//No I18N
		form.setAttribute("method", "post");//No I18N
		form.setAttribute("action", "/home/Reseller.do");//No I18N
		form.appendChild(getnewFormElement("hidden","execute","showResellerUserDetails"));//No I18N
		form.appendChild(getnewFormElement("hidden","userid",userid));//No I18N
		form.appendChild(getnewFormElement("hidden","_",''));//No I18N
		var response = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
		$("#userarea").html(response);//No I18N
		$.hideDiv('laodingDiv');//No I18N
		$.hideDiv('msgDiv');//No I18N
		return;
}
function userChargevalue(frm)
{
	$.showDiv('loadingg');//No I18N
	var userpack = frm.credits.value;
	var amount = userpack*2;
	frm.amount.value=amount;
	$.hideDiv('loadingg');//No I18N
	$.showDiv('userAmountRow');//No I18N
}
function showreselleruserdetails()
{
	$.hideDiv('actionDiv');//No I18N
	$.showDiv('reselleruserDetailsDiv');//No I18N
	$.showDiv('resellerActionDiv');//No I18N
	$.showDiv('topborderDiv');//No I18N
	$.showDiv('bottomborderDiv');//No I18N
}
function showEditContactGroup(frompage)
{
		var grp=document.getElementById('editGroupdisp');
		var groupid=grp.options[grp.selectedIndex].value;
		var form = document.createElement("form");//No I18N
		form.setAttribute("method", "post");//No I18N
		form.setAttribute("action", "/home/Notifications.do");//No I18N
		form.appendChild(getnewFormElement("hidden","execute","showContactGroupForm"));//No I18N
		form.appendChild(getnewFormElement("hidden","groupid",groupid));//No I18N
		form.appendChild(getnewFormElement("hidden","popup",'editgrouppopup'));//No I18N
		form.appendChild(getnewFormElement("hidden","_",''));//No I18N
		var response = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
		$("#contactGroupDiv").html(response);//No I18N
		$.showDiv('contactGroupDiv');//No I18N
}
function getTraceroute()
{
	var frm=document.getElementById('responseForm');
	var urlid=frm.urlid.value;
	var isURL=frm.isURL.value;
	var locid=document.getElementById('locationId').value;
	var mtype=frm.mtype.value;
	$.hideDiv('tracerouteoutputDiv');//No I18N
	$.hideDiv('tracerouteDiv');//No I18N
	$.hideDiv('tracerouteheadDiv');//No I18N
	$.hideDiv('closeDiv');//No I18N
	//$.showDiv('loadingDiv');//No I18N
	//$("#tracerouteDiv").css({margin:"0 auto",padding:"100px 0 0",width:"250px"});
	$("#tracerouteDiv").addClass('loadingDivclass');
	$("#tracerouteDiv").html(document.getElementById('loadingDiv').innerHTML);//No I18N
	$.showDiv('tracerouteoutputDiv');//No I18N
	$.showDiv('tracerouteDiv');//No I18N
	var form = document.createElement("form");
	form.setAttribute("method", "post");
	form.setAttribute("action", "/tools/action.do");
	form.appendChild(getnewFormElement("hidden","execute","generateTraceRoute"));//No I18N
	form.appendChild(getnewFormElement("hidden","locid",locid));//No I18N
	form.appendChild(getnewFormElement("hidden","urlid",urlid));//No I18N
	form.appendChild(getnewFormElement("hidden","monitortype",mtype));//No I18N
	document.body.appendChild(form);
	getHtmlForForm(form,"postGetTraceRouteResults");//No I18N

}
function postGetTraceRouteResults(result)
{
	var urlStatus=getUrlValue(result,"axUrl_Status"); //No I18N
	if(urlStatus==='FAILED')
	{
		var urlReason=getUrlValue(result,"axUrl_Reason");  //No I18N
		var tableHead = getUrlValue(result,'axUrl_Columnhead'); //No I18N
		$("#tracerouteheadDiv").html(tableHead);//No I18N
		$("#tracerouteDiv").removeClass('loadingDivclass');
		$("#tracerouteDiv").html(urlReason); //No I18N
		$("#tracerouteDiv").css("height","100px"); //No I18N
		$("#tracerouteDiv").css("margin","75px 0px 0px 100px"); //No I18N 
	}	
	var traceRouteOutput = getUrlValue(result,'axUrl_traceRouteOutput');  //No I18N
	var tableHead = getUrlValue(result,'axUrl_Columnhead'); //No I18N
	$.hideDiv('loadingDiv');//No I18N
	$.showDiv('closeDiv');//No I18N
	$("#tracerouteheadDiv").html(tableHead);//No I18N
	$("#tracerouteDiv").removeClass('loadingDivclass');
	$("#tracerouteDiv").html(traceRouteOutput);//No I18N
	$.showDiv('tracerouteoutputDiv');//No I18N
	$.showDiv('tracerouteheadDiv');//No I18N
	$.showDiv('tracerouteDiv');//No I18N
}
function changeactionMode(mode)
{
if(mode=='edit')
{
document.getElementById('addSecure').style.display='none';
document.getElementById('secureText').style.display='none';
document.getElementById('addformatText').style.display='none';
document.getElementById('editformatText').style.display='block';
document.getElementById('addmodeExample').style.display='none';
document.getElementById('editmodeExample').style.display='block';
}
else
{
document.getElementById('addSecure').style.display='';
document.getElementById('secureText').style.display='';
document.getElementById('addformatText').style.display='block';
document.getElementById('editformatText').style.display='none';
document.getElementById('addmodeExample').style.display='block';
document.getElementById('editmodeExample').style.display='none';
}
}
function showSeqScreenShots(monitorType,seqid,dfsid,period,startTime,endTime,history,popup)
{
        var datavalues = "execute=getSeqScreenShotDetails&monitorid="+seqid+"&dfsid="+dfsid+"&period="+period;//No I18N
        if(period=='50')
        {
                datavalues = datavalues+"&starttime="+startTime+"&endtime="+endTime;//No I18N
        }
        if(history!=undefined)
        {
                datavalues = datavalues+"&history="+history;//No I18N
        }
        if(popup!=undefined)
        {
                datavalues = datavalues+"&popup="+popup;//No I18N
        }
        var response=$.getAjaxResponse("GET","/home/CreateTest.do",datavalues);//No I18N
        if(history!=undefined && history=="true")
        {
                $("#ScreenShotHistoryDetails").html(response);//No I18N
        }
        else
        {
                $("#sequenceScreenShots").html(response);//No I18N
        }
}
function loadSeqUrlDetails(monitorType, showHistory)
{
        if(monitorType=='URL-SEQ' || monitorType=='REALBROWSER')
        {
                var id = $("#activeSeqStep").html();//No I18N
                $("#ssJSONContent").html($('#seqStepDetails-'+id).html());//No I18N
        }
        loadJSONContent(showHistory);
}
function viewScreenShotHistory(monitorid,dfsid,period,startTime,endTime)
{
        var datavalues = "execute=getSeqScreenShotDetails&history=true&monitorid="+monitorid+"&dfsid="+dfsid+"&period="+period;//No I18N
        if(period=='50')
        {
                datavalues = datavalues+"&starttime="+startTime+"&endtime="+endTime;//No I18N
        }
        window.open("/home/CreateTest.do?"+datavalues,"ScreenshotHistory","width=1024,height=640");//No I18N
}
function newWebPageTest(id)
{
        window.open('/tools/action.do?execute=showWebPageAnalyzeTest&id='+id,'ScreenShotHistory','width=1024,height=645,scrollbars=no,resizable=no');
}
function loadJSONContent(showHistory)
{
    var myJSONObject = jQuery.parseJSON($('#ssJSONContent').html());//No I18N
	var monitorType = myJSONObject.monitorType;
	var ssImageCount = myJSONObject.imagesCount;
	var fileName = myJSONObject.imagesList;
	var showWebPageAnalyzer = 'false';
	if(monitorType=='URL' || monitorType=='HOMEPAGE')
	{
		showWebPageAnalyzer = 'true';
	}
	var htmlFileName = myJSONObject.HTMLFile;
	var showHTMLSource = 'false';
	if(htmlFileName!=undefined && htmlFileName!="-")
	{
		showHTMLSource = 'true';
	}
	if(showHistory==undefined)
	{
		showHistory = "false";
	}	
	$.hideDiv('DegbugHelp');//No I18N
	$.hideDiv('htmlSource');//No I18N
	$.hideDiv('showHTMLSeparator');//No I18N
	$.hideDiv('runWPATest');//No I18N
	if(showHTMLSource=='true' || showWebPageAnalyzer=='true')
	{
		if(showHTMLSource=='true')
		{
			$.showDiv('htmlSource');//No I18N
			$.showDiv('DegbugHelp');//No I18N
		}
		if(showHistory=='false')
		{
			if(showWebPageAnalyzer=='true')
			{
				$.showDiv('runWPATest');//No I18N
				$.showDiv('DegbugHelp');//No I18N
			}
			if(showWebPageAnalyzer=='true' && showHTMLSource=='true')
			{
				$.showDiv('showHTMLSeparator');//No I18N
			}
		}
	}
	var failedUrl = myJSONObject.failedUrl;
	if(failedUrl==undefined)
    {
        failedUrl = "-";
    }
	var dnsTime = myJSONObject.dnsTime;
	if(dnsTime==undefined  || (dnsTime!=undefined && dnsTime<0))
	{
		dnsTime = "-";
	}
	else
	{
		dnsTime = dnsTime+" "+unitkeys["millisecond_short"];//No I18N
	}
	var connectionTime = myJSONObject.connectionTime;
	if(connectionTime==undefined  || (connectionTime!=undefined && connectionTime<0))
	{
		connectionTime = "-";
	}
	else
    {
            connectionTime = connectionTime+" "+unitkeys["millisecond_short"];//No I18N
    }
	var firstByteTime = myJSONObject.firstByteTime;
	if(firstByteTime==undefined  || (firstByteTime!=undefined && firstByteTime<0))
	{
		firstByteTime = "-";
	}
	else
    {
            firstByteTime = firstByteTime+" "+unitkeys["millisecond_short"];//No I18N
    }
	var lastByteTime = myJSONObject.lastByteTime;
	if(lastByteTime==undefined  || (lastByteTime!=undefined && lastByteTime<0))
	{
		lastByteTime = "-";
	}
	else
    {
            lastByteTime = lastByteTime+" "+unitkeys["millisecond_short"];//No I18N
    }
	var responseTime = myJSONObject.responseTime;
	if(responseTime==undefined  || (responseTime!=undefined && responseTime<0))
	{
		responseTime = "-";
	}
	else
    {
            responseTime = responseTime+" "+unitkeys["millisecond_short"];//No I18N
    }
	var imageheight = 350;
	var resolution_width = $(window).width();
	if(showHistory=='true')
	{
		resolution_width = 1024;
		imageheight = 500;
	}
	var imageWidth = (62/100)*resolution_width;
	var reason = myJSONObject.reason;
	$("#ssFailedReason").html(reason);//No I18N
	if(reason.length>0)
	{
		$.showDiv('failedReason');//No I18N
	}
	else
	{
		$.hideDiv('failedReason');//No I18N
	}
	if(ssImageCount<=1 && (monitorType=='URL' || monitorType=='HOMEPAGE'))
	{
		var content ="<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" align=\"left\">";
		content = content + "<tr>";
		if(showHistory!=undefined && showHistory=='true')
		{
               	 	content = content + "<td width=\"100%\" align=\"center\">";
			imageWidth = (64/100)*resolution_width;
		}
		else
		{
               	 	content = content + "<td width=\"100%\" align=\"left\">";
		}
               	content = content + "<div style=\"padding-bottom:5px;\"><a href='javascript:void(0);'><img id=\"screenshot\" src='/images/temp/"+fileName[0]+"' style=\"border:1px solid #DDD\" width=\""+imageWidth+"px\" height=\""+imageheight+"px\" class=\"showhandCursor\" onClick='javascript:viewSSImage();'/></a></div>";
                content = content + "</td>";
                content = content + "</tr>";
                content = content + "</table>";
                $("#sc").html(content);//No I18N
	}
	if(failedUrl=="-")
	{
		$.hideDiv('stepFailedDetails');	//No I18N
	}
	else
	{
		$.showDiv('stepFailedDetails');//No I18N
		$("#stepFailedURL").html($.truncate(failedUrl,45));//No I18N
	}
	$("#ssDnsTime").html(dnsTime);//No I18N
	$("#ssConnTime").html(connectionTime);//No I18N
	$("#ssFirstByteTime").html(firstByteTime);//No I18N
	$("#ssLastByteTime").html(lastByteTime);//No I18N
	$("#ssResponseTime").html(responseTime);//No I18N
	
	if(monitorType=='REALBROWSER')
	{
		$("#ssStepName").html(myJSONObject.displayName);//No I18N
		$("#ssURLCaptured").html(myJSONObject.capturedURL);//No I18N
	}
}
function changeScreenShotInHistory(monitorType,monitorid,period,startdate,enddate)
{
        var dfsid = $('#dfsids').val();
        showSeqScreenShots(monitorType,monitorid, dfsid, period, startdate, enddate, 'true', 'true');
        loadSeqUrlDetails(monitorType,true);
        $("div#mygaltop").slideView({toolTip: true, ttOpacity: 0.5});
        
        $.hideDiv("mygaltop-loading"); //No I18N
        
        $("#mygaltop").slideDown(1000);
               
        setTimeout(function(){
        
        var elements = document.getElementsByClassName("ldrgif");//No I18N
        for(var i=0; i<elements.length; i++) 
        {
            elements[i].style.display='none';
        }
        
        }, 100);
}
function changeSlide(id)
{
        $("#activeSeqStep").html(id);//No I18N
        $("#ssJSONContent").html($('#seqStepDetails-'+id).html());//No I18N
        loadJSONContent();
}
function nextSlide(){
}
function prevSlide()
{
}
function viewSSImage()
{
        var myJSONObject = jQuery.parseJSON($('#ssJSONContent').html());//No I18N
        var monitorid = myJSONObject.monitorid;
        var monitorType = myJSONObject.monitorType;
        var fileName = myJSONObject.imagesList;
        showFile(monitorid,monitorType,fileName[0]);
}
function viewHTMLSource()
{
        var id = $("#activeSeqStep").html();//No I18N
        var myJSONObject = jQuery.parseJSON($('#ssJSONContent').html());//No I18N
        var monitorid = myJSONObject.monitorid;
        var monitorType = myJSONObject.monitorType;
        var htmlFileName = myJSONObject.HTMLFile;
        showFile(monitorid,monitorType,htmlFileName);
}
function downloadProbeData(){
	var platform;
	var radios = document.getElementsByName("platform");
	for (var i = 0; i < radios.length; i++) {       
        if (radios[i].checked) {
			platform = radios[i].value;
            break;
        }
    }
	var bitsize = $('input[name=bitsize]').val();//No I18N
	window.location='/login/downloadRecorder.do?t=probe&platform='+platform+'&bitsize='+bitsize;//No I18N
	document.getElementById('licenseText1').style.display='none';
	document.getElementById('licenseText2').style.display='none';
	setTimeout($.getWMIRequest('/home/CreateTest.do','execute=addProbe'),180000);//No I18N
	$('#processingtr').show();//No I18N
}

function viewlogs(id)
{
	if(confirm(beanmsg["probe_download"]))
	{
		var datavalues = "pagename=showProbeLogs&width=430&arrowpos=340&urlid="+id;//No I18N
		var response = $.getAjaxResponse("POST","/jsp/includes/divPopUp.jsp",datavalues);//No I18N
		var position1 = $("#ShowProbeLogsLink").position();
		var top_pad = position1.top + 20;
		var left_pad = position1.left - 340;
		$.showPopUpDiv(response,top_pad,left_pad,'5000','445');
	}else
	{
		return;
		/*var actionurl = "/home/CreateTest.do";//No I18N
		var datavalues = "execute=downloadProbeLogs&urlid="+id;//No I18N
		var response = $.getAjaxResponseWithCSRF("POST",actionurl,datavalues);//No I18N
		alert(beanmsg["probe_alert"]);*/
	}
}

function enableprobedownstatus(id)
{
	var ids = document.getElementsByName('probes');
	var mprobeids = document.getElementsByName('mprobes');
	var flag1 = false;var flag2 = false;
	for(var i=0;i<ids.length;i++)
	{	
		if(ids[i].value > 1000 && ids[i].value == id|| ids[i].checked || ids[i].disabled){// jshint ignore:line
			flag1= true;
			break;
		}
	}
	for(var i=0;i<mprobeids.length;i++)
	{
		if(mprobeids[i].value > 1000 && mprobeids[i].value == id|| mprobeids[i].checked || mprobeids[i].disabled){// jshint ignore:line
			flag2 = true;
			break;
		}
	}
	if((flag1 || flag2))
	{
		$('#probeStatusIncluded').attr('checked',true);
		document.getElementById("locationFailure").disabled=true;
		$('#probeProxyCheckBox').show();
	}
	else
	{
		$('#probeStatusIncluded').attr('checked',false);
		document.getElementById("locationFailure").disabled=false;
		$('#probeProxyCheckBox').hide();
	}
}

function enablemobileprobedownstatus(id){
	var ids = document.getElementsByName('mprobes');
	var flag = false;
	for(var i=0;i<ids.length;i++){
		if(ids[i].value > 1000 && ids[i].value == id|| ids[i].checked){// jshint ignore:line
			flag = true;
			break;
		}
	}
	if(flag){
		$('#probeStatusIncluded').attr('checked',true);
		document.getElementById("locationFailure").disabled=true;
		$('#probeProxyCheckBox').show();
	}else{
		$('#probeStatusIncluded').attr('checked',false);
		document.getElementById("locationFailure").disabled=false;
		$('#probeProxyCheckBox').hide();
	}
}


function changetoOnlyprobe(elem)
{
	var isChecked = elem.checked;
	var primaryLocationId=document.getElementById('primaryLocationId').value;
	if(isChecked && primaryLocationId < 1000)
	{
		var ids = document.getElementsByName('probes');
		var flag = false;
		for(var i=0;i<ids.length;i++)
		{
			if(ids[i].value > 1000 &&  ids[i].checked)
			{
				flag = true;
				break;
			}
		}
		if(!flag)
		{
			/*alert(beanmsg["poller.status.include.validation"]);
			elem.checked=false;*/// fix for issue - 3337
			return false;
		}
	}
	if(elem.checked)
	{
		document.getElementById("locationFailure").disabled=true;
	}
	else
	{
		document.getElementById("locationFailure").disabled=false;
	}
}

function checkprobelocn(primaryId){
	var id = 'probe'+primaryId;//No I18N
	var idd = 'probes'+primaryId;//No I18N
	var locname = locationNames[primaryId];
	if(locname==undefined){
		$("input[id="+id+"]").attr("checked", false);
		$("input[id="+id+"]").attr("disabled", "disabled");
		$("input[id="+idd+"]").attr("checked", false);
		$("input[id="+idd+"]").attr("disabled", "disabled");
	}
}
function showEditUserName()
{
	showDiv('newusernamedet'); //No I18N
	hideDiv('oldusernamedet');//No I18N
}
function showDefaultUserName()
{
	var frm1 = document.getElementById('acctsettings');
	frm1.loginName.value="";
	hideDiv('newusernamedet'); //No I18N
	showDiv('oldusernamedet');//No I18N
}
function changeTextBoxDisplay(){
	if(document.getElementById('homePageUserName').value=="admin@site24x7.com")
	{
	 	$("#firstName").attr("disabled","disabled");//NO I18N
	}
	}
ParamStr = function(pname, pvalue){
    return 'Content-Disposition: form-data; name="'+pname+'"\r\n\r\n'+pvalue;//No I18N
}
MultiPartFile = function(pname, file){
	reader = new FileReader();
	/*reader.onload = function(evt) {
		binary = evt.target.result;
	};*/
    return 'Content-Disposition: form-data; name="'+pname+'"; filename="'+ encodeURIComponent(file.fileName) + '"' + '\r\n'+ 'Content-Type: application/octet-stream' + '\r\n'+ '\r\n'+ reader.readAsBinaryString(file);//No I18N
}


function fileUpload(form, action_url, div_id) {
	
	var div_html=$("#"+div_id).html();
    // Create the iframe...
	var filename = form.theFile.value;
	if(filename=='')
	{
		alert(beanmsg["input_filename"]);//NO I18N
		form.theFile.select();
		return;
	}
	var valid_extensions = /(.jpg|.gif|.png|.jpeg)$/
	var file_result = filename.toLocaleLowerCase();
	if(!(valid_extensions.test(file_result)))
	{
		alert(beanmsg["input_filename_extension"]);//NO I18N
		form.theFile.select();
		return;
	}
    var iframe = document.createElement("iframe");
    iframe.setAttribute("id", "upload_iframe");
    iframe.setAttribute("name", "upload_iframe");
    iframe.setAttribute("width", "0");
    iframe.setAttribute("height", "0");
    iframe.setAttribute("border", "0");
    iframe.setAttribute("style", "width: 0; height: 0; border: none;");
 
    // Add to document...
    form.parentNode.appendChild(iframe);
    window.frames['upload_iframe'].name = "upload_iframe";
 
    iframeId = document.getElementById("upload_iframe");
 
    // Add event...
    var eventHandler = function () {
 
            if (iframeId.detachEvent) iframeId.detachEvent("onload", eventHandler);
            else iframeId.removeEventListener("load", eventHandler, false);
 
            // Message from server...
            if (iframeId.contentDocument) {
                content = iframeId.contentDocument.body.innerHTML;
            } else if (iframeId.contentWindow) {
                content = iframeId.contentWindow.document.body.innerHTML;
            } else if (iframeId.document) {
                content = iframeId.document.body.innerHTML;
            }
            var value=getValue(content,"ax_imgfile");//NO I18N
			var filepath=getValue(content, "ax_imgpath");//NO I18N
			if(value!=undefined &&value.length>0)
			{
	            document.getElementById(div_id).innerHTML = "<img id='logo' width='48' height='48' src=/app/customize/"+value+" align='absmiddle'>";
				$("#rpt2").attr("checked", "checked");
				$("#uploadedfilepath").val(filepath);
				$("#uploadedfilename").val(value);
			}
			else
			{
				$("#"+div_id).html(div_html);
				alert(dashboardmsg["file_exceeds"]);
				
			}
            // Del the iframe...
            setTimeout(function(){'iframeId.parentNode.removeChild(iframeId)'}, 250);
        }
 
    if (iframeId.addEventListener) iframeId.addEventListener("load", eventHandler, true);
    if (iframeId.attachEvent) iframeId.attachEvent("onload", eventHandler);
 
    // Set properties of form...
    form.setAttribute("target", "upload_iframe");
    form.setAttribute("action", action_url);
    form.setAttribute("method", "post");
    form.setAttribute("enctype", "multipart/form-data");
    form.setAttribute("encoding", "multipart/form-data");
    // Submit the form...
    form.submit();
 
    document.getElementById(div_id).innerHTML = " <img alt='Uploading...' src='/images/zoho-busy.gif' border='0'/>";
}
function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,"<a href='$1'>$1</a>"); 
}
function updatedashboard() 
{ 
	  var url=$(location).attr('href');
	  var previd=$("#prevtooltip").val();
	  var prevvisitor=$("#prevvisitor").val();
	  
	  var response ="";
	  var items=[];
	  var sid=$("#serviceid").val();
	  var param="";
	  if(sid!=null&&sid!=undefined)
	  {
			param="&sid="+sid;//NO I18N
	  }
	  else
	  {
		  sid=1;
	  }
	  var colindex = $('#socialth').index()+1;
	//Iterate all td's in nineth column
	$('#internetServicetbl>tbody>tr>td:nth-child('+colindex+')').each( function(){
	   //add item to array
		if($(this).attr("id")!=undefined)
		{
			items.push( {"id":$(this).attr("id"),"html":$(this).html()});  //NO I18N
		}
	});
	  var hideSocial=$('#socialth').is(":hidden")||!$('#socialth').is(":visible");//No I18N
	  if(url.indexOf("?id=")!=-1)
	  {
		  newparam=url.substr(url.indexOf("?id=")+4);
		  if(!hideSocial)
		  {
			  newparam=newparam+"&social=true";//NO I18N
		  }
		  response = $.getAjaxResponse("POST","/login/status.do","execute=allLocationStatus&isrefresh=true&id="+newparam);//No I18N
	  }
	  else
	  {
		  if($('#social').val()=='true'||(!$.isExists('internetServicetbl','table')))
		  {
			  param=param+"&social=true";//NO I18N
		  }
		  response = $.getAjaxResponse("POST","/home/reportsinfo.do","execute=allLocationStatus&isrefresh=true"+param);//No I18N
	  }
	  $("[rel=tooltip]").tooltip('hide');
	  $("#"+previd).popover('hide');
	  $("#"+prevvisitor).popover('hide');
	  
	  var social='true';
	  var msg='hide_social';//NO I18N
	  if(hideSocial&&($.isExists('internetServicetbl','table')))
	  {
		  social='false';//NO I18N
		  msg='show_social';//NO I18N
	  }
	  
	  $("#dashboardDiv").html(response);//No I18N
	  $("#serviceid").val(sid);//No I18N
	  $('#social').val(social);//No I18N
	  $('#sociallink').html(dashboardmsg[msg]);//No I18N
	  
	  $('#internetServicetbl>tbody>tr>td:nth-child('+colindex+')').each(function(){
		   //add item to array
		  var ele_id=$(this).attr("id");
		   if(ele_id!=undefined)
		   {
		   	$.each(items, function(i, item){
			   	if(item.id==ele_id)
			   	{
			    	$("#"+item.id).html(item.html);
			    	return;
			    }
		   })
		} 
		});
	  setTimeout(updatedashboard, 60000);     
}

function selectText(containerid) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().addRange(range);
    }
}
function socialSearch(jsonData,isPublic,showSocialStatus)
{
	if(($('#social').val()=='true')||(isPublic=='true'&&showSocialStatus=='true'))
	{
	var handles=jsonData;
	setHandles(handles);
	
	var keywords = new Array();
	keywords.push('down');//No I18N
	keywords.push('unavailable');//No I18N
	keywords.push('interruption');//No I18N
	keywords.push('disruption');//No I18N
	keywords.push('issue');//No I18N
	keywords.push('can not access');//No I18N
	keywords.push('not able to access');//No I18N
	keywords.push("can't connect");//No I18N
	

	setKeywords(keywords);
	search(function()
			{
				response=this;
				if(response.channel == 'twitter')
				{
					var elid = "tw_"+response.mid;//No I18N
					//alert('Twitter Search Result:  ID = '+response.mid+ " / Tweets = "+response.tcount+" service = "+response.service);
					if(response.tcount>0)
					{
						$("#"+elid).html('<img rel="tooltip" src="/images/twitter-icon-operators.jpg"  height="16" width="16" title="'+response.service+' : '+response.tcount+'"/>');
					}
					else
					{
						$("#"+elid).html('<img rel="tooltip" src="/images/twitter-icon-operators-offline.jpg"  height="16" width="16" title="'+response.service+' : 0"/>');
					}
				}
				else if(response.channel == 'fb')
				{
					var elid = "fb_"+response.mid;//No I18N
					//alert('Facbook Search Result:  ID = '+response.mid+ " / fb updates = "+response.fbcount+" service = "+response.service);
					if(response.fbcount>0)
					{
						$("#"+elid).html('<img rel="tooltip" src="/images/fb-icon-operators.jpg"   height="16" width="16" title="'+response.service+' : '+response.fbcount+'">');
					}
					else
					{
						$("#"+elid).html('<img rel="tooltip" src="/images/fb-icon-operators-offline.jpg"  height="16" width="16" title="'+response.service+' : 0"/>');
					}
				}
			})
			setTimeout(function(){socialSearch(jsonData,isPublic,showSocialStatus)},60000*5);
	}
}
function viewprobemonitors(probeid){
	if($.isExists('popUpFloatingDiv','div'))
    {
		$("#popUpFloatingDiv").remove();
    }
	var datavalues = "pagename=showProbeMonitors&width=240&urlid="+probeid;//No I18N
	var response = $.getAjaxResponse("POST","/jsp/includes/divPopUp.jsp",datavalues);//No I18N
	var position1 = $("#ShowProbeMonsLink").position();
	var top_pad = position1.top + 30;
	var left_pad = position1.left - 150;
	$.showPopUpDiv(response,top_pad,left_pad,'1','250');
}
function pollNow(monitorKey,timezone,dispName)
{
	var form = document.createElement("form");//No I18N
	form.setAttribute("method", "post");//No I18N
	form.setAttribute("action", "/home/CreateTest.do");//No I18N
	form.appendChild(getnewFormElement("hidden","execute","pollNow"));//No I18N
	form.appendChild(getnewFormElement("hidden","mId",monitorKey));//No I18N
	form.appendChild(getnewFormElement("hidden","_",''));//No I18N
	form.appendChild(getnewFormElement("hidden","timezone",timezone));//No I18N
	var response = $.getAjaxResponseWithCSRF("POST",form.action,$(form).serialize());//No I18N
	document.getElementById('statusText').innerHTML=beanmsg["mon_poll_now_success"].replace("{0}",dispName);//No I18N
	document.getElementById('pollnowstatusDiv').style.display='block';
	document.getElementById('_DIALOG_CONTENT').style.display="none";
	pollNowstatuscheck(monitorKey,dispName);
}
function pollNowstatuscheck(urlid,dispName)
{
	var form = document.createElement("form");//No I18N
	form.setAttribute("method", "post");//No I18N
	form.setAttribute("action", "/home/CreateTest.do");//No I18N
	form.appendChild(getnewFormElement("hidden","execute","getPollNowStatus"));//No I18N
	form.appendChild(getnewFormElement("hidden","monitorId",urlid));//No I18N
	var response = $.getAjaxResponse("POST",form.action,$(form).serialize());//No I18N
	var status = getValue(response,'ax_status');//No I18N
	if(status=='polling started')
	{
	 document.getElementById('statusText').innerHTML=beanmsg["mon_poll_now_start"].replace("{0}",dispName)+" ...";//No I18N
	}
	if(status=='probe_down')
	{
	 	document.getElementById('statusText').innerHTML=beanmsg["mon_poll_now_failed"];//No I18N
		clearTimeout(timeOut);
		setTimeout(function(){$.showTabDetails(urlid,'3')},1000);
		return;
	}
	if(status=='completed')
	{
		document.getElementById('statusText').innerHTML=beanmsg["mon_poll_now_complete"];//No I18N
		clearTimeout(timeOut);
		setTimeout(function(){$.showTabDetails(urlid,'3')},1000);
		return;
	}
	if(status==='dcrunning')
	{
		document.getElementById('statusText').innerHTML=beanmsg["pollnow.failed.reason.dc.running"];//No I18N
		clearTimeout(timeOut);
		setTimeout(function(){$.showTabDetails(urlid,'3')},2000);
		return;
	}
	if(status==='dcstartsin1min')
	{
		document.getElementById('statusText').innerHTML=beanmsg["pollnow.failed.reason.dc.about.start"];//No I18N
		clearTimeout(timeOut);
		setTimeout(function(){$.showTabDetails(urlid,'3')},2000);
		return;
	}
	timeOut=setTimeout(function(){pollNowstatuscheck(urlid,dispName)},5000);
}
function breadcrumbs(link) 
{ 
	   window.location = link; 
	   //return false; 
} 
function showInfoTooltip(info)
{
	var index = '#'+info.id;//No I18N
	var point = $(index).position();
	var ptx = point.left + 125;// + 20
	var pty = point.top + 40;// + 360
	
	var name  = "<tr><td class='NormalGrayText'>Name</td><td>&nbsp;</td><td class='NormalGrayText'>"+info.name+"<td></tr>";
	var mtype = "<tr><td class='NormalGrayText'>Type</td><td>&nbsp;</td><td class='NormalGrayText'>"+info.mtype+"</td></tr>";
	
	var data = "<table>"+name + mtype +"</table>";
	
	
	var tooltipSpan = $("<span class='vcentertooltipspan'>"+data+"</span>").css({padding: '5px',width: 'auto',//No I18N
								height: 'auto',background: '#EAEAEA',border: '2px solid #000',position: 'absolute',top: pty,left: ptx,font: '11px  Helvetica, sans-serif',//No I18N
								opacity: '.9',filter: 'alpha(opacity = 90)',borderRadius: '5px',color: '#000'});//No I18N
							
	$('body').append(tooltipSpan);
	
}
function hideInfoTooltip()
{
	$('.vcentertooltipspan').remove();
}
function showPackageUpgradePage(packId)
{
	var url=window.location.href;
	var loc=url.indexOf("nc");
	var param=url.substring(loc,url.length);
	location.href= "/home/pkgbilling.do?method=showPackPurchase&packId="+packId+"&"+param;
}
function viewFullsite()
{
	document.cookie="FullSite=main_Site;path=/";
	location.href="/app/client";
}
function updateWPALinkDetails(collTime)
{
        try{
                var frm = document.getElementById("aaa");//NO I18N
                frm.wpaPollTime.value = collTime;
                getWPALinkDetails(frm,"false");//NO I18N
        }
        catch(e)
        {
        }
}

function imageUpload(form, action_url) {
	
	$('#loadingimg').show();
    // Create the iframe...
	var filename = form.theFile.value;
	//console.log('filename===>'+filename);
	if(filename==='')
	{
		alert(beanmsg.input_filename);//NO I18N
		form.theFile.select();
		return;
	}
	var valid_extensions = /(.jpg|.gif|.png|.jpeg)$/
	var file_result = filename.toLocaleLowerCase();
	if(!(valid_extensions.test(file_result)))
	{
		alert(beanmsg.input_filename_extension);//NO I18N
		form.theFile.select();
		return;
	}
    var iframe = document.createElement("iframe");
    iframe.setAttribute("id", "upload_iframe");
    iframe.setAttribute("name", "upload_iframe");
    iframe.setAttribute("width", "0");
    iframe.setAttribute("height", "0");
    iframe.setAttribute("border", "0");
    iframe.setAttribute("style", "width: 0; height: 0; border: none;");
 
    // Add to document...
    form.parentNode.appendChild(iframe);
    window.frames.upload_iframe.name = "upload_iframe";
 
    iframeId = document.getElementById("upload_iframe");
 
    // Add event...
    var eventHandler = function () {
 
            if (iframeId.detachEvent)
            {
            	iframeId.detachEvent("onload", eventHandler);
            }
            else
        	{
            	iframeId.removeEventListener("load", eventHandler, false);
        	}
 
            // Message from server...
            if (iframeId.contentDocument) {
                content = iframeId.contentDocument.body.innerHTML;
            } else if (iframeId.contentWindow) {
                content = iframeId.contentWindow.document.body.innerHTML;
            } else if (iframeId.document) {
                content = iframeId.document.body.innerHTML;
            }
            var value=getValue(content,"ax_imgfile");//NO I18N
			var filepath=getValue(content, "ax_imgpath");//NO I18N
			$('#loadingimg').hide();
			if(value!==undefined &&value.length>0)
			{
	           // document.getElementById('bigImg').innerHTML = "<img id='logo' width=120' height='48' src=/app/customize/"+value+" align='absmiddle'>";
	            $('.jcrop-keymgr').next().attr("src","/app/customize/"+value);
	            $('.jcrop-hline').prev().attr("src","/app/customize/"+value);
	            $('#target').attr("src","/app/customize/"+value);
	            $('#previewImg').attr("src","/app/customize/"+value);
	            $('#fpath').val(filepath);
			}
			else
			{
				//$("#"+div_id).html(div_html);
				alert(dashboardmsg.file_exceeds);
				
			}
            // Del the iframe...
            setTimeout(function(){'iframeId.parentNode.removeChild(iframeId)'}, 250);
        }
 
    if (iframeId.addEventListener) 
    {
    	iframeId.addEventListener("load", eventHandler, true);
    }
    if (iframeId.attachEvent)
	{
    	iframeId.attachEvent("onload", eventHandler);
	}
 
    // Set properties of form...
    form.setAttribute("target", "upload_iframe");
    form.setAttribute("action", action_url);
    form.setAttribute("method", "post");
    form.setAttribute("enctype", "multipart/form-data");
    form.setAttribute("encoding", "multipart/form-data");
    // Submit the form...
    form.submit();
 
    //document.getElementById(div_id).innerHTML = " <img alt='Uploading...' src='/images/zoho-busy.gif' border='0'/>";
}


var prevrca = "test";//No I18N
function showRCADesc(rcablockid){
	var parentkey = "#"+rcablockid;
	var data = rcablockid.split("-");
	var key = data[0]+"desc";
	var id = data[1];
	var keyy = '#'+key+'-'+id;
	
	var imgele = "#img-"+rcablockid;//No I18N
	var prevelem = $('#addednow').prev().attr('id');
	if(prevelem == undefined){
		prevelem = rcablockid;
	}
	var previmgele = "#img-"+prevelem;//No I18N
	var datta = $(keyy).html();

	if(rcablockid == prevrca){
		$(imgele).show();
		$('#addednow').toggle();
		prevrca = "test1";//No I18N
	}
	if(datta!='null' && datta!=null && (prevrca=="test" || rcablockid != prevrca) && prevrca != "test1"){
		$("#addednow").hide();
		$("#addednow").remove();
		$(previmgele).show();
		$(imgele).hide();
		var elem = "<tr id='addednow' style='background-color: #FFC;border-bottom:1px solid  #d7d7d7;'><td  class='datatdborder1' colspan='10'>"+datta+"</td></tr>";
		$(parentkey).after(elem);
		prevrca = rcablockid;
	}
	if(prevrca == "test1"){	//No I18N
		prevrca = "test";//No I18N
	}
}
function doLookup(frm)
{
	if(frm.hostName.value=='')
	{
		alert(beanmsg.empty_domain);
		frm.hostName.select();
		return;
	}
	getHtmlForForm(frm, "checkAccessforDNS",frm);//No I18N
}
function checkAccessforDNS(result,frm)
{
	document.getElementById('lookupdetails').style.display='block';
	frm.execute.value="getDnsRecordType";//No I18N
	getHtmlForForm(frm, "postLookup",frm);//No I18N
}
function postLookup(result)
{
	postLoading('lookupdetails','lookupdiv',result);//No I18N
}
function persistAgentConfigurations()
{
	var upgrade = document.getElementById('autoupgrade');
	var peer = document.getElementById('peer');
	var eventLog=document.getElementById('event');
	var actions="";
	/*if(!peer.checked && !upgrade.checked && !eventLog.checked)
	{
		alert('Kindly choose any of the options available');
		return;
	}*/
	if(peer.checked)
	{
		actions=actions.concat("peer").concat(",");	//No I18N
	}
	if(upgrade.checked)
	{
		actions=actions.concat("upgrade").concat(",");//No I18N
	}
	if(eventLog.checked)
	{
		actions=actions.concat("eventLog");//No I18N
	}
	var datavalues = "execute=persistAgentConfigurations&action="+actions+"";//No I18N
	var response = $.getAjaxResponseWithCSRF("POST","/home/CreateTest.do",datavalues);//No I18N
	/*var statusmsg = getValue(response,'ax_actions');
	$('#output').html(statusmsg);*/
	$('#output').fadeIn(5000,function(){});
	$('#output').fadeOut(5000,function(){});
}

function persistGlobalConfigurations(obj)
{
	var element = obj.id;
	var elementvalue=obj.checked;
	var datavalues = "execute=persistGlobalConfigurations&element="+element+"&value="+elementvalue+"";//No I18N
	var response = $.getAjaxResponseWithCSRF("POST","/home/CreateTest.do",datavalues);//No I18N
	var statusmsg = getValue(response,'ax_actions');//NO I18N
	if(statusmsg == undefined)
	{
		$('#output').fadeIn(5000,function(){});
		$('#output').fadeOut(5000,function(){});
	}
	else
	{
		$('#error_output').fadeIn(5000,function(){});
	}
}

function agentConfigs()
{
        location.href="/home/accountinfo.do?method=fetchAgentConfigurations";
}

function openwindow(location)
{
	try
	{
		if(location!=undefined)
		{
			window.open(location);
		}
	}
	catch(e)
	{
		alert(e);
	}
}
function selectAllWidgetResources(isChecked, wName){
	var name = "."+wName+":input:checkbox";//NO I18N
	if(isChecked){
		 $(name).attr('checked', true);
	}else{
		$(name).attr('checked', false);
	}
}
function checkselectAllWidgetResources(isChecked, wName){
	var name = "."+wName+":input:checkbox";//NO I18N
	var allcount = 0;
	var selcount = 0;
	$(name).each(function() {
		allcount++;
		var isSelected = $(this).attr('checked');
		if(isSelected == 'checked'){
			flag = true;
			selcount++;
		}
	});
	if(allcount==selcount){
		$('#bulk-'+wName).attr('checked', true);
	}else{
		$('#bulk-'+wName).attr('checked', false);
	}
}
function fnBulkActionWidgetResources(wName,action,urlid,mtype){
	try{
		var name = "."+wName+":input:checkbox";//NO I18N
		var id = "";
		$(name).each(function() {
			var isChecked = $( this ).attr('checked');
			if(isChecked=='checked'){
				id = id + this.value + ',';
			}
		});
		if(id==''){
			alert(beanmsg["bulk.select.options"]);
			return false;
		}
		if(action == 'bulkdelete'){		
			if(confirm(beanmsg["server.process.delete"]))
			{
				var dellink = "execute=persistWidgetResources&action="+action+"&urlid="+urlid+"&name="+wName+"&mtype="+mtype+"&delvalue="+id;//NO I18N	
				var response = $.getAjaxResponseWithCSRF("POST","/home/CreateTest.do",dellink);//No I18N
				var statusmsg = getValue(response,'ax_status');//NO I18N
				var status="success"; //NO I18N
				$.hidePopUpDiv();
				var contentWidth = statusmsg.length*15;
				var xCenter = (($(window).innerWidth()/2) - (contentWidth/2))+"px";//NO I18N
				var yCenter = ($(window).innerHeight()/2)+"px";//NO I18N
				$.showPopUpDiv($.getStatusMsg(status, statusmsg), yCenter, xCenter, '1', contentWidth);
				$.fadeOutDiv('popUpFloatingDiv',6000);//No I18N
				setTimeout(function(){window.location.href="../home/CreateTest.do?execute=showPerf&urlid="+urlid+"&tabname=Port";},2000);
			}	
		}
		if(action == 'bulkedit'){
			if(confirm('Edit all selected data?'))
			{
				var editlink = "execute=showWidgetResources&action="+action+"&urlid="+urlid+"&name="+wName+"&mtype="+mtype+"&editvalue="+id;//NO I18N	
				var loadingtxt=beanmsg.loading;
				$("#thresholdwidget").html("<div id='status_loading' style='margin: 100px auto;font: normal 18px sans-serif;color:  #000'>"+loadingtxt+"</div>");//No I18N
				url = "../home/CreateTest.do"; //No I18N
				var windowWidth=$(window).width();
				$("#thresholdwidget").lightbox_me({closeSelector: "#closethreshold", closeClick: true,centered: false,modalCSS: {top: '90px',width: '500px'}, onLoad: function() {
					var response = $.getAjaxResponse("POST","/home/CreateTest.do",editlink);//No I18N
					$("#thresholdwidget").html(response);//No I18N
				}});
				$('table tr:nth-child(even)').addClass('stripe');//No I18N
			}	
		}
	}catch(e){
		alert(e);
	}
}

function reDiscoverApps(monitorId)
{
	$.showDiv("loading");//No I18N
	closeDialog();
	getHtml("/home/CreateTest.do?execute=reDiscoverApps&monitorId="+monitorId, "postReDiscoverApps");//No I18N
}

function postReDiscoverApps(response)
{
	hideDiv('loading');//No I18N
	
	//Message will be moved to properties after review
	var beanmssg="Re-discovery initiated...";//No I18N
	var msg = '<div class="SuccessMsgDiv">'+beanmssg+'</div>';
	msg = msg + '<div class="WardShawdowLeft"></div>';	
	document.getElementById('msgs').innerHTML=msg;//No I18N
	startHideFade("msgs",0.005);//No I18N    
}

function shareLogs(monitorId, uniqueVal)
{
	$.showDiv("loading");//No I18N
	closeDialog();
	if(uniqueVal != undefined){
		getHtml("/home/CreateTest.do?execute=shareLogs&monitorId="+monitorId+"&uniqueId="+uniqueVal, "postShareLogs");//No I18N
	}
	else{
		getHtml("/home/CreateTest.do?execute=shareLogs&monitorId="+monitorId, "postShareLogs");//No I18N
	}	
}

function postShareLogs(response)
{
	var statusmsg = getValue(response,'ax_status');//NO I18N
	hideDiv('loading');//No I18N
	if(statusmsg=='success')
	{
		//Message will be moved to properties after review
		var beanmssg="Logs sharing initiated...";//No I18N
		var msg = '<div class="SuccessMsgDiv">'+beanmssg+'</div>';
		msg = msg + '<div class="WardShawdowLeft"></div>';	
		document.getElementById('msgs').innerHTML=msg;//No I18N
		startHideFade("msgs",0.005);//No I18N
	}
	else if(statusmsg=='failure')
	{
		var beanmssg="No. of requests exceed minimum threshold. Please try sharing logs after a minute.";//No I18N
		var msg = '<div class="SuccessMsgDiv">'+beanmssg+'</div>';
		msg = msg + '<div class="WardShawdowLeft"></div>';	
		document.getElementById('msgs').innerHTML=msg;//No I18N
		startHideFade("msgs",0.003);//No I18N		
	}
}

function sendEnableInsightRequest(appId)
{
	if(document.getElementById("cmn-toggle-"+appId).checked)
	{
		var enableInsightMonitoring = document.getElementsByName("enableInsightMonitoring");
		var currentCount = 0;
		for(i=0; i<enableInsightMonitoring.length; i++)
		{
			if(enableInsightMonitoring[i].checked)
			{
				currentCount++;
			}
		}
		
		if(currentCount>=10)
		{
			document.getElementById("iis-message-0").style.display="block";
			$.fadeOutDiv('iis-message-0',8000);//No I18N
			return;
		}
		
		var datavalues = "execute=sendEnableInsightRequest&appId="+appId;//No I18N
		var response = $.getAjaxResponseWithCSRF("POST","/home/AgentAction.do",datavalues);//No I18N
		
		if(getValue(response,'ax_status')=="Success")
		{
			if(getValue(response,'ax_pool_restart')=="true")
			{
				var siteName = getValue(response, 'ax_pool_name');  //No I18N
				document.getElementById("iis-message-2-pool").innerHTML=siteName;
				document.getElementById("iis-message-2").style.display="block";
				$.fadeOutDiv('iis-message-2',8000);//No I18N
			}
			else
			{
				var hostName = getValue(response, 'ax_host');  //No I18N
				document.getElementById('iis-message-1-host').innerHTML=hostName;
				document.getElementById("iis-message-1").style.display="block";
				$.fadeOutDiv('iis-message-1',8000);//No I18N
			}
			document.getElementById("switch-"+appId).style.display="none";
			document.getElementById("loading-"+appId).style.display="block";
		}
		else
		{
			document.getElementById("cmn-toggle-"+appId).checked="";
		}
	}
	else
	{
		var datavalues = "execute=sendDisableInsightRequest&appId="+appId;//No I18N
		var response = $.getAjaxResponseWithCSRF("POST","/home/AgentAction.do",datavalues);//No I18N
		
		if(getValue(response,'ax_status')!="Success")
		{
			document.getElementById("cmn-toggle-"+appId).checked="checked";//No I18N
		}
		else
		{
			document.getElementById("iis-message-3").style.display="block";
			$.fadeOutDiv('iis-message-3',8000);//No I18N
		}
	}
}
