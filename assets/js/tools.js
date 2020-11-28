//$Id

//$Id:$
var hp_var=String.fromCharCode(104,116,116,112,58,47,47);  // No I18N
var hs_var=String.fromCharCode(104,116,116,112,115,58,47,47); // No I18N
var wss_var=String.fromCharCode(119,115,115,58,47,47 ); //NO I18N
var ws_var=String.fromCharCode(119,115,58,47,47 ); //NO I18N
var count_url_report = 0;
var count_port=0;
var row_values=[];
var count_ping = 0;
var count_linkcheck = 0;
var requestCount=1;
var LOCATION_LIST = null;

var chartData=new Array(); // This variable will be initialized during each time a page is loaded.
var chartResponseData=new Array();
var timeoutHandleaArray=new Array();
var topdivdata=new Boolean(true);
var reqTs=null;
var fusionChartsURL="/FusionCharts/StackedColumn3D.swf";
var chartArray=new Array();
var availRespCount=new Array();
var shortMonthNames = [ 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec' ];
var globalURL="";
var globalToolType="";
var globalPermaLink="";
var Tooltype="";
var dcFinishedLocCount="";
var locCount="";



function sendToolsEmailLink()
{
	//console.log("GlobalToolType :"+globalToolType); // No I18N
	if(globalToolType==undefined || globalToolType=='undefined' || globalToolType.trim().length==0)
	{
		globalToolType="TOOLS";
	}
	//console.log("URL : "+globalURL+"globalPermalink : "+globalPermaLink+" Type : "+globalToolType); // No I18N
	$.toolsEmailSend(globalURL,globalPermaLink,globalToolType); // No I18N
}

function setLocationList(locationList){
	if(locationList){
		LOCATION_LIST = jQuery.parseJSON(locationList);
	}
	//console.log('locationList : '+typeof(LOCATION_LIST)+LOCATION_LIST[45]);
}

function findAvailability(frm,ranword)
{
	reqTs=new Date();
	doToolsTest(frm,ranword,'URL');
}

function getDatediff(fDate,sDate)
{
	// Only upto minute (0-59 mins) level
	var dMs=sDate.getTime()-fDate.getTime();
	var minS=0,secs=0,msec=0;
	if(dMs>60000) {
		minS=Math.floor(dMs/1000*60);
		dMs=dMs-(minS*1000*60);
		return ((minS>0)?(minS+" min(s)"):"");
	}else if(dMs>1000)
	{
		secs=Math.floor(dMs/1000);
		dMs=dMs-secs*1000;
		return ((secs>0)?(secs+" sec(s)"):"");
	}
	msec=dMs;
	return ((msec>0)?(msec+" ms"):"");
}

function getFormattedNumber(number,pattern)
{
	// ##
	// If number is a single digit, return it as double digit.
	if(number<=9) {
		return '0'+number;
	}
	return number;
}

function getDateString(monthAsString)
{
	var monthAsString;
	var hourStr;
	if(arguments.length==0)
	{
		monthAsString=false;
	}
	var dt=new Date();
	monthStr=dt.getMonth();
	var ampmStr=(dt.getHours()<12)?'AM':'PM';
	if(monthAsString==true)
	{
		monthStr=shortMonthNames[dt.getMonth()];
	}
	else {
		monthStr = dt.getMonth() + 1;
	}
	//console.log("Hours : "+dt.getHours());
	if(dt.getHours()==12)
	{
		hourStr=12;
	}
	else
	{
		hourStr=dt.getHours()%12;
	}
	var dateStr=dt.getDate()+" "+monthStr+" "+dt.getFullYear()+" "+(getFormattedNumber(hourStr))+":"+getFormattedNumber(dt.getMinutes())+":"+getFormattedNumber(dt.getSeconds())+ ' '+ ampmStr;
	return dateStr;
}

function showCommonResultPage(url)
{
	document.getElementById('id_request_div').style.display='none';
	document.getElementById('accesskeyworddiv').style.display='none';
	document.getElementById('middle').style.display='none';
	if(document.getElementById("thdiv")!==null)
	{
		document.getElementById('thdiv').style.display='none';
	}
	$('.reqspacer').hide();
	if(globalToolType != 'WEBSITE-COMPARE')
	{
		var quickTestDiv = document.getElementById('id_quicktest_div');
		if (quickTestDiv) {
			document.getElementById('id_quicktest_div').style.display = 'block';
		}
	}
	if($('#id_response_div').is(':hidden')) {
		var headerText = "Test results : - "+$ESAPI.encoder().encodeForHTML(url); // No I18N
		if(globalToolType == 'WEBSITE-COMPARE')
		{
			headerText = "Website Performance Comparison Results "; // No I18N
		}
		$('#commonoutputhdrtext').html(headerText);
		var urltrim=$.trim(url);
		var urllen=urltrim.length;
		if(urllen >33)
		{
			var sliceurl=urltrim.slice(0,33);
			$('#id_url').html('Result URL: '+$ESAPI.encoder().encodeForHTML(sliceurl)+'.....'); // No I18N
			$('#id_url').attr('title',url);
		}
		else
		{
			$('#id_url').html('Result URL: '+$ESAPI.encoder().encodeForHTML(url)); // No I18N
		}
		if(globalToolType=='BLACKLISTCHECK'){
			var title=document.getElementById("id_url").innerHTML;
			document.getElementById("id_url").innerHTML=title.replace("Result URL","Blacklist Domain/IP");
		}
		$('#id_reqtime').html('Tested on: '+getDateString(true));
		$('#id_response_div').show();
	}
}

function showWebsiteAvailabilityResultPage(url,reqId)
{
	showCommonResultPage(url);
	$('#id_result_graph_space').show();
	$('.grptext').show();
	cloneAddAvailabilityResultsDiv(url,reqId);
}

function cloneAddAvailabilityResultsDiv(url,requestId)
{
	var chkwebtemplDiv;
	if(Tooltype=='WEBSOCKET')
	{
		chkwebtemplDiv=document.getElementById("checkwebsocketresultstemplate");
	}
	else
	{
		chkwebtemplDiv=document.getElementById("checkwebsiteresultstemplate");
	}
	var cwahdr=document.getElementById("cwahdr").cloneNode(true);
	cwahdr.removeAttribute('id');
	if(Tooltype=='WEBSOCKET')
	{
		cwahdr.children[0].innerHTML='Websocket Availability Results: '+getDateString(true);
	}
	else
	{
		cwahdr.children[0].innerHTML='Website Availability Results: '+getDateString(true);
	}


	var chkwebresultStr=chkwebtemplDiv.innerHTML;
	var chkwebresult=document.createElement("DIV");

	chkwebresultStr = chkwebresultStr.replace('id_result_graph_div','id_result_graph_div'+requestId);
	chkwebresultStr = chkwebresultStr.replace('id_graphContainer_div','id_graphContainer_div'+requestId);
	chkwebresultStr = chkwebresultStr.replace('resultappend','resultappend'+requestId);
	if(Tooltype=='WEBSOCKET')
	{
		chkwebresultStr = chkwebresultStr.replace('id_ws_response_result_header','id_ws_response_result_header'+requestId);
	}
	else
	{
		chkwebresultStr = chkwebresultStr.replace('id_response_result_header','id_response_result_header'+requestId);
	}

	chkwebresult.setAttribute("id","checkwebresults"+requestId);
	chkwebresult.setAttribute("style","width:998px; margin-top: 15px; height: auto; display: none;");
	chkwebresult.setAttribute("class","border clear");
	chkwebresult.innerHTML=chkwebresultStr;
	var graphSpaceDiv=document.getElementById("id_result_graph_space");
	insertAfter(graphSpaceDiv,chkwebresult);
	insertAfter(graphSpaceDiv,cwahdr);
	// COMMENT: We are skipping resultappend'+requestId div here because it
	// should remain hidden. It is just a place holder to add subsequent result
	// rows.
	cwahdr.style.display='block';
	if(Tooltype=='WEBSOCKET')
	{
		document.getElementById('id_ws_response_result_header'+requestId).style.display='block';
	}
	else
	{
		document.getElementById('id_response_result_header'+requestId).style.display='block';
	}

	chkwebresult.style.display='block';
	document.getElementById('id_result_graph_div'+requestId).style.display='block';
	document.getElementById('id_graphContainer_div'+requestId).style.display='block';
	// chkwebresult.scrollIntoView(true);
}

function postavailabilitydetails(result,url,selectedLocations,reqId)
{
	showWebsiteAvailabilityResultPage(url,reqId);
	chartData[reqId]={};
	var cwadata=chartData[reqId];
	cwadata['locGA']=new Array();
	cwadata['dnsGA']=new Array();
	cwadata['conGA']=new Array();
	cwadata['fbGA']=new Array();
	cwadata['lbGA']=new Array();
	cwadata['rspGA']=new Array();
	cwadata['locNm']=new Array();
	cwadata['avail']=new Array();
	cwadata['resIp']=new Array();
	cwadata['reason']=new Array();
	cwadata['conLen']=new Array();
	cwadata['downTm']=new Array();
	cwadata['reqId']=reqId;
	cwadata['durl']=url;
	cwadata['tooltype']="URL";
	cwadata['timestamp']=timestamp;

	var stackChart=null;
	// alert("Request Id : "+reqId+" Chart Array : "+chartArray.length);
	if(reqId >= chartArray.length)
	{
		// alert("Settting up graphs . . . ");
		FusionCharts.setCurrentRenderer('javascript');
		FusionCharts.debugMode.enabled(true);
		stackChart = new FusionCharts(fusionChartsURL,"stackChartId"+reqId,"630","296","1","1");
		// FB.XFBML.parse();
		stackChart.configure('LoadingText','Loading data please wait . . . ');
		stackChart.configure('XMLLoadingText','Loading data please wait . . . ');
		stackChart.configure('ParsingDataText','Loading data please wait . . . ');
		stackChart.configure('ChartNoDataText','Loading data please wait . . . ');
		stackChart.configure('RenderingChartText','Rendering chart please wait . . .');
		stackChart.configure('InvalidXMLText','Invalid Data . . .');
		stackChart.configure('LoadDataErrorText','Loading Data please wait . . .');
		var jsonDataSkeleton='{"chart":{"caption":"Website Availability Metrics","xaxisname":"Locations","yaxisname":"Time (ms)","showvalues":"1","formatNumber":"1","formatNumberScale":"0","defaultAnimation":"1""bgColor":"F7F8F6","bgAlpha":"100","canvasBgColor":"F7F8F6", "canvasBgAlpha":"0"},"categories":[{"category":[{}],"dataset":[{"seriesname":"DNS","data":[{}]},{"seriesname":"Connect","data":[{}]},{"seriesname":"First Byte","data":[{}]},{"seriesname":"Last Byte","data":[{}]}],"trendlines":{"line":[{"startvalue":"0","color":"91C728","displayvalue":""}]}}';
		stackChart.render("id_graphContainer_div"+reqId);
		chartArray[reqId] = stackChart;
	}
	for (var i=0; i<selectedLocations.length; i++)
	{
		addLocationLoadingRow(selectedLocations[i].value,reqId);
		var form=document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("name","WebSiteLocationTest");
		form.setAttribute("action", "/tools/general/simpleTest.do");
		form.appendChild(getnewFormElement("hidden","method","doWebsiteTest"));
		form.appendChild(getnewFormElement("hidden","locationid",selectedLocations[i].value));
		form.appendChild(getnewFormElement("hidden","url",url));
		form.appendChild(getnewFormElement("hidden","timestamp",timestamp));
		form.appendChild(getnewFormElement("hidden","requestId",reqId));
		document.body.appendChild(form);
		getHtmlForForm(form,"postResponse",selectedLocations[i].value,selectedLocations.length,reqId);
	}

}


function addLocationLoadingRow(locationId,reqId)
{
	var locationName=$("input[value='"+locationId+"']").parent().text();
	if(locationName.indexOf(",")>0)
	{
		locationName=locationName.substr(0,locationName.indexOf(","));
	}
	// Code by G. Edwin.
	var resultRowTemplate=document.getElementById('id_resp_row_templ');
	var resultappendRow=document.getElementById('resultappend'+reqId);
	// resultappendRow.style.display='none';
	var locLoadingDiv=document.createElement("div");
	locLoadingDiv.setAttribute("class",resultRowTemplate.getAttribute("class"));
	locLoadingDiv.setAttribute("style","width: 998px; height: 30px; display: none;");
	var rowHtml=resultRowTemplate.innerHTML;
	rowHtml=rowHtml.replace("LOCATION_NAME",LOCATION_LIST[locationId]+' '+('<img style="" src="" + animImage + ""/>'));
	rowHtml=rowHtml.replace("id_locn","id_locn"+reqId+""+locationId);
	rowHtml=rowHtml.replace("id_sc","id_sc"+reqId+""+locationId);
	rowHtml=rowHtml.replace("id_ip","id_ip"+reqId+""+locationId);
	rowHtml=rowHtml.replace("id_dns","id_dns"+reqId+""+locationId);
	rowHtml=rowHtml.replace("id_con","id_con"+reqId+""+locationId);
	rowHtml=rowHtml.replace("id_fb","id_fb"+reqId+""+locationId);
	rowHtml=rowHtml.replace("id_lb","id_lb"+reqId+""+locationId);
	rowHtml=rowHtml.replace("id_size","id_size"+reqId+""+locationId);
	rowHtml=rowHtml.replace("id_respt","id_respt"+reqId+""+locationId);
	locLoadingDiv.innerHTML=rowHtml;
	resultappendRow.appendChild(locLoadingDiv);
	resultappendRow.style.display='block';
	locLoadingDiv.style.display='block';
}
function addLocationLoadingRowForWebSocket(locationId,reqId)
{
	var locationName=$("input[value='"+locationId+"']").parent().text();
	if(locationName.indexOf(",")>0)
	{
		locationName=locationName.substr(0,locationName.indexOf(","));
	}
	var resultRowTemplate=document.getElementById('id_ws_resp_row_templ');
	var resultappendRow=document.getElementById('resultappend'+reqId);
	// resultappendRow.style.display='none';
	var locLoadingDiv=document.createElement("div");
	locLoadingDiv.setAttribute("class",resultRowTemplate.getAttribute("class"));
	locLoadingDiv.setAttribute("style","width: 998px; height: 30px; display: none;");
	var rowHtml=resultRowTemplate.innerHTML;
	rowHtml=rowHtml.replace("LOCATION_NAME",LOCATION_LIST[locationId]+' '+('<img style="" src="" + animImage + ""/>'));
	rowHtml=rowHtml.replace("id_locn","id_locn"+reqId+""+locationId);
	rowHtml=rowHtml.replace("id_sc","id_sc"+reqId+""+locationId);
	rowHtml=rowHtml.replace("id_ip","id_ip"+reqId+""+locationId);
	rowHtml=rowHtml.replace("id_dnsT","id_dnsT"+reqId+""+locationId);
	rowHtml=rowHtml.replace("id_conT","id_conT"+reqId+""+locationId);
	rowHtml=rowHtml.replace("id_handshakeT","id_handshakeT"+reqId+""+locationId);
	rowHtml=rowHtml.replace("id_pingpongT","id_pingpongT"+reqId+""+locationId);
	rowHtml=rowHtml.replace("id_respT","id_respT"+reqId+""+locationId);
	locLoadingDiv.innerHTML=rowHtml;
	resultappendRow.appendChild(locLoadingDiv);
	resultappendRow.style.display='block';
	locLoadingDiv.style.display='block';
}

function drawGraph(selectedLocationCount,reqId)
{
	var stackChart=chartArray[reqId];
	var jsonDataSkeleton="";
	if(stackChart==null)
	{
		FusionCharts.setCurrentRenderer('javascript');
		FusionCharts.debugMode.enabled(true);
		stackChart = new FusionCharts(fusionChartsURL,"stackChartId"+reqId,"630","296","1","1");
		stackChart.configure('LoadingText','Loading data please wait . . . ');
		stackChart.configure('XMLLoadingText','Loading data please wait . . . ');
		stackChart.configure('ParsingDataText','Loading data please wait . . . ');
		stackChart.configure('ChartNoDataText','Loading data please wait . . . ');
		stackChart.configure('RenderingChartText','Rendering chart please wait . . .');
		stackChart.configure('InvalidXMLText','Invalid Data . . .');
		stackChart.configure('LoadDataErrorText','Loading Data please wait . . .');
		jsonDataSkeleton='{"chart":{"caption":"Website Availability Metrics","xaxisname":"Locations","yaxisname":"Time (ms)","showvalues":"0","formatNumber":"1","formatNumberScale":"0,"defaultAnimation":"1","bgColor":"F7F8F6","bgAlpha":"0","canvasBgColor":"F7F8F6", "canvasBgAlpha":"0","seriesNameInToolTip":"0","toolTipSepChar":" "},"categories":[{"category":[{}],"dataset":[{"seriesname":"DNS","data":[{}]},{"seriesname":"Connect","data":[{}]},{"seriesname":"First Byte","data":[{}]},{"seriesname":"Last Byte","data":[{}]},{"seriesname":"Response","data":[{}]}],"trendlines":{"line":[{"startvalue":"0","color":"91C728","toolText":"0","displayvalue":""}]}}';
		stackChart.render("id_graphContainer_div"+reqId);
		chartArray[reqId] = stackChart;
		FB.XFBML.parse();
	}
	jsonDataSkeleton='{"chart":{"caption":"Website Availability Metrics","xaxisname":"Locations","yaxisname":"Time (ms)","showvalues":"0","formatNumber":"1","formatNumberScale":"0","defaultAnimation":"0","bgColor":"F7F8F6","bgAlpha":"100","canvasBgColor":"F7F8F6", "canvasBgAlpha":"0","seriesNameInToolTip":"0","toolTipSepChar":" "},"categories":[{"category":LOCATIONSLIST}],"dataset":[{"seriesname":"DNS","color":"A4BBCE","data":DNSDATA},{"seriesname":"Connect","color":"C5A440","data":CONNECTDATA},{"seriesname":"First Byte","color":"8FA93C","data":FIRSTBYTEDATA},{"seriesname":"Last Byte","color":"CB895D","data":LASTBYTEDATA}],"trendlines":{"line":[{"startvalue":"0","color":"91C728","toolText":"0","displayvalue":""}]} }';
	var locStr="",dnsStr="",connectStr="",firstByteStr="",lastByteStr="",responseStr="";
	var arrSize=selectedLocationCount;

	var cwadata=chartData[reqId];
	var locGraphArray=cwadata["locGA"];
	var dnsGraphArray=cwadata["dnsGA"];
	var connectGraphArray=cwadata["conGA"];
	var firstByteGraphArray=cwadata["fbGA"];
	var lastByteGraphArray=cwadata["lbGA"];
	var responseGraphArray=cwadata["rspGA"];

	locStr=JSON.stringify(locGraphArray);
	dnsStr=JSON.stringify(dnsGraphArray);
	connectStr=JSON.stringify(connectGraphArray);
	firstByteStr=JSON.stringify(firstByteGraphArray);
	lastByteStr=JSON.stringify(lastByteGraphArray);
	responseStr=JSON.stringify(responseGraphArray);

	jsonDataSkeleton = jsonDataSkeleton.replace("LOCATIONSLIST",locStr);
	jsonDataSkeleton = jsonDataSkeleton.replace("DNSDATA",dnsStr);
	jsonDataSkeleton = jsonDataSkeleton.replace("CONNECTDATA",connectStr);
	jsonDataSkeleton = jsonDataSkeleton.replace("FIRSTBYTEDATA",firstByteStr);
	jsonDataSkeleton = jsonDataSkeleton.replace("LASTBYTEDATA",lastByteStr);

	//console.log("jsonData : "+jsonDataSkeleton);
	stackChart.setTransparent(true);
	stackChart.setJSONData(jsonDataSkeleton);
	stackChart.setTransparent(true);
	stackChart.render("id_graphContainer_div"+reqId);
}

function drawGraphForWebSocket(selectedLocationCount,reqId)
{
	var stackChart=chartArray[reqId];
	var jsonDataSkeleton="";
	if(stackChart==null)
	{
		FusionCharts.setCurrentRenderer('javascript');  //No I18N
		FusionCharts.debugMode.enabled(true);
		stackChart = new FusionCharts(fusionChartsURL,"stackChartId"+reqId,"630","296","1","1");  //NO I18N
		stackChart.configure('LoadingText','Loading data please wait . . . '); //NO I18N
		stackChart.configure('XMLLoadingText','Loading data please wait . . . '); //NO I18N
		stackChart.configure('ParsingDataText','Loading data please wait . . . '); //NO I18N
		stackChart.configure('ChartNoDataText','Loading data please wait . . . '); //NO I18N
		stackChart.configure('RenderingChartText','Rendering chart please wait . . .'); //NO I18N
		stackChart.configure('InvalidXMLText','Invalid Data . . .'); //NO I18N
		stackChart.configure('LoadDataErrorText','Loading Data please wait . . .');//NO I18N
		jsonDataSkeleton='{"chart":{"caption":"WebSocket Availability Metrics","xaxisname":"Locations","yaxisname":"Time (ms)","showvalues":"0","formatNumber":"1","formatNumberScale":"0,"defaultAnimation":"1","bgColor":"F7F8F6","bgAlpha":"0","canvasBgColor":"F7F8F6", "canvasBgAlpha":"0","seriesNameInToolTip":"0","toolTipSepChar":" "},"categories":[{"category":[{}],"dataset":[{"seriesname":"DNS","data":[{}]},{"seriesname":"Connect","data":[{}]},{"seriesname":"Handshake","data":[{}]},{"seriesname":"PingPong","data":[{}]},{"seriesname":"Response","data":[{}]}],"trendlines":{"line":[{"startvalue":"0","color":"91C728","toolText":"0","displayvalue":""}]}}';//NO I18N
		stackChart.render("id_graphContainer_div"+reqId);
		chartArray[reqId] = stackChart;
		FB.XFBML.parse();
	}
	jsonDataSkeleton='{"chart":{"caption":"WebSocket Availability Metrics","xaxisname":"Locations","yaxisname":"Time (ms)","showvalues":"0","formatNumber":"1","formatNumberScale":"0","defaultAnimation":"0","bgColor":"F7F8F6","bgAlpha":"100","canvasBgColor":"F7F8F6", "canvasBgAlpha":"0","seriesNameInToolTip":"0","toolTipSepChar":" "},"categories":[{"category":LOCATIONSLIST}],"dataset":[{"seriesname":"DNS","color":"A4BBCE","data":DNSDATA},{"seriesname":"Connect","color":"C5A440","data":CONNECTDATA},{"seriesname":"handshake","color":"8FA93C","data":HANDSHAKEDATA},{"seriesname":"pingpong","color":"CB895D","data":PINGPONGDATA}],"trendlines":{"line":[{"startvalue":"0","color":"91C728","toolText":"0","displayvalue":""}]} }';//NO I18N
	var locStr="",dnsStr="",connectStr="",handshakeStr="",pingpongStr="",responseStr="";
	var arrSize=selectedLocationCount;

	var cwadata=chartData[reqId];
	var locGraphArray=cwadata.loc;
	var dnsGraphArray=cwadata.dnsT;
	var connectGraphArray=cwadata.conT;
	var handshakeGraphArray=cwadata.handshakeT;
	var pingpongGraphArray=cwadata.pingpongT;
	var responseGraphArray=cwadata.rspT;

	locStr=JSON.stringify(locGraphArray);
	dnsStr=JSON.stringify(dnsGraphArray);
	connectStr=JSON.stringify(connectGraphArray);
	handshakeStr=JSON.stringify(handshakeGraphArray);
	pingpongStr=JSON.stringify(pingpongGraphArray);
	responseStr=JSON.stringify(responseGraphArray);

	jsonDataSkeleton = jsonDataSkeleton.replace("LOCATIONSLIST",locStr);
	jsonDataSkeleton = jsonDataSkeleton.replace("DNSDATA",dnsStr);
	jsonDataSkeleton = jsonDataSkeleton.replace("CONNECTDATA",connectStr);
	jsonDataSkeleton = jsonDataSkeleton.replace("HANDSHAKEDATA",handshakeStr);
	jsonDataSkeleton = jsonDataSkeleton.replace("PINGPONGDATA",pingpongStr);

	//console.log("jsonData : "+jsonDataSkeleton);
	stackChart.setTransparent(true);
	stackChart.setJSONData(jsonDataSkeleton);
	stackChart.setTransparent(true);
	stackChart.render("id_graphContainer_div"+reqId);
}

function getLocaleFormattedNumber(n)
{
	var numStr=new String(n);
	return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function postResponse(result,locid,selectedLocationslength,reqId)
{
	availRespCount[reqId] = availRespCount[reqId] + 1;
	// alert("Result of output :: "+result.length+" Location Id : "+locid+"
	// Selected Locations Length : "+selectedLocationslength+" Request Id :
	// "+reqId);

	if(result.length==0)
	{
		// Update as timed out.
		// alert("Inside result.length == 0");
		var locName=$('li input[value="'+locid+'"]').parent().text();
		// console.log("empty postResponse message received for location :
		// "+locid+" Location Name : "+locName);
		result="#ax_dnsResolvedtime=0&ax_responsetime=0&ax_locname="+locName+"&ax_downloadtime=0&ax_resolvedIp=&ax_firstdownload=0&ax_sizeinstring=0 KB&ax_firstBytetime=0&ax_availability=0&ax_responsecode=TIMED-OUT&ax_url=YourDomain.com&ax_reason=TIMED-OUT&ax_connectiontime=0&"; // No I18N
		// return 0;
	}
	if(result.match("locid")!=-1)
	{
		// alert("Result : "+result);
		var timeoutHandle=timeoutHandleaArray[locid];
		clearTimeout(timeoutHandle);
		// console.log("Clearing timeout since response has already been received
		// Location : "+locid);
		var responsetime = getValue(result,'ax_responsetime');
		var responsecode = getValue(result,'ax_responsecode');
		var reason=getValue(result,'ax_reason');
		var availability=getValue(result,'ax_availability');
		var resolvedIP=getValue(result,'ax_resolvedIp');
		var dnsResolvedtime=getValue(result,'ax_dnsResolvedtime');
		var firstBytetime=getValue(result,'ax_firstBytetime');
		var downloadtime=getValue(result,'ax_downloadtime');
		var connectiontime=getValue(result,'ax_connectiontime');
		var contentLength=getValue(result,'ax_sizeinstring');
		var availabilityimage=imagesUrl + "down_icon.gif"; //NO I18N
		var firstdownload=getValue(result,'ax_firstdownload');
		var url=getValue(result,'ax_url');
		var locname = getValue(result,'ax_locname');


		// var locations=document.getElementById("locationid").value;
		var locations=locid;
		if(locations_url_response=="")
		{
			for(var i=0;i<selectedLocationslength;i++)
			{
				locations=locations.replace(",","locid=");
			}
			locations_url_response="locid="+locations;
		}
		// var conTimeValue = parseInt(dnsResolvedtime) + parseInt(connectiontime);
		var ttfbValue =firstBytetime;
		var ttlbValue = Math.abs(parseInt(responsetime)-(parseInt(connectiontime)+parseInt(firstBytetime)+parseInt(dnsResolvedtime)));
		// var locations=document.getElementById("locationid").value;
		var conTimeValue=connectiontime;

		if(reason=="OK")
		{
			responsecode=reason;
			if(topdivdata)
			{
				topdivdata=false;
				var urltrim=$.trim(url);
				var urllen=urltrim.length;
				if(urllen >33)
				{
					var sliceurl=urltrim.slice(0,33);
					$('#id_url').html('Result URL: '+sliceurl+'.....'); // No I18N
					$('#id_url').attr('title',url); // No I18N
				}
				else
				{
					$('#id_url').html('Result URL: '+url);
				}
				$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
				var dateStr=getDateString(true);
				$('#id_reqtime').html('Tested on: '+dateStr);
			}
			$('#id_locn'+reqId+""+locid).text(locname);
			$('#id_sc'+reqId+""+locid).html('<b>'+responsecode+'</b>');
			$('#id_ip'+reqId+""+locid).text(resolvedIP);
			$("#id_ip"+reqId+""+locid).css("text-align","left");// No I18N
			$('#id_dns'+reqId+""+locid).text(getLocaleFormattedNumber(dnsResolvedtime));
			$('#id_dns'+reqId+""+locid).css("text-align","right");// No I18N
			$('#id_con'+reqId+""+locid).text(getLocaleFormattedNumber(connectiontime));
			$('#id_con'+reqId+""+locid).css("text-align","right");// No I18N
			$('#id_fb'+reqId+""+locid).text(getLocaleFormattedNumber(firstBytetime));
			$('#id_fb'+reqId+""+locid).css("text-align","right");// No I18N
			$('#id_lb'+reqId+""+locid).text(getLocaleFormattedNumber(ttlbValue));
			$('#id_lb'+reqId+""+locid).css("text-align","right");// No I18N
			$('#id_size'+reqId+""+locid).text(contentLength);
			$('#id_size'+reqId+""+locid).css("text-align","right");// No I18N
			$('#id_respt'+reqId+""+locid).text(getLocaleFormattedNumber(responsetime));
			$('#id_respt'+reqId+""+locid).css("text-align","right");// No I18N
		}
		else
		{
			// console.log("Inside else : reason :: "+result);
			if(responsetime==="0")
			{
				$('#id_locn'+reqId+""+locid).text(locname);
				$('#id_sc'+reqId+""+locid).html('<b>-</b>');
				//$('#id_sc'+reqId+""+locid).html('<b>'+reason+'</b>');
				$('#id_ip'+reqId+""+locid).html('<b>'+reason+'</b>');
				$("#id_ip"+reqId+""+locid).css("width","605px");
				$("#id_ip"+reqId+""+locid).attr('class',"floatleft dlfont9l pad5");
				$('#id_dns'+reqId+""+locid).remove();
				$('#id_con'+reqId+""+locid).remove();
				$('#id_fb'+reqId+""+locid).remove();
				$('#id_lb'+reqId+""+locid).remove();
				$('#id_size'+reqId+""+locid).remove();
				//$('#id_respt'+reqId+""+locid).text("-"); // No I18N
			}
			else {
				$('#id_locn'+reqId+""+locid).text(locname);
				$('#id_sc'+reqId+""+locid).html('<b>'+responsecode+'</b>');
				$('#id_ip'+reqId+""+locid).text(resolvedIP);
				$('#id_dns'+reqId+""+locid).text(getLocaleFormattedNumber(dnsResolvedtime));
				$('#id_con'+reqId+""+locid).text(getLocaleFormattedNumber(connectiontime));
				$('#id_fb'+reqId+""+locid).text(getLocaleFormattedNumber(firstBytetime));
				$('#id_lb'+reqId+""+locid).text(getLocaleFormattedNumber(ttlbValue));
				$('#id_size'+reqId+""+locid).text(contentLength);
				$('#id_respt'+reqId+""+locid).text(getLocaleFormattedNumber(responsetime));
			}
		}



		var cwadata=chartData[reqId];
		var locGraphArray=cwadata["locGA"];
		var dnsGraphArray=cwadata["dnsGA"];
		var connectGraphArray=cwadata["conGA"];
		var firstByteGraphArray=cwadata["fbGA"];
		var lastByteGraphArray=cwadata["lbGA"];
		var responseGraphArray=cwadata["rspGA"];
		var locNm=cwadata["locNm"];
		var avail=cwadata["avail"];
		var resIp=cwadata["resIp"];
		var reasonArr=cwadata["reason"];
		var conLen=cwadata["conLen"];
		var downTm=cwadata["downTm"];

		// Populate Graph Array Elements for later graph drawing.
		var locGraphEntry={},dnsGraphEntry={},connectGraphEntry={},firstByteEntry={},lastByteEntry={},sizeEntry={},responseGraphEntry={};
		locGraphEntry.label=locname.substr(0,3);
		locGraphEntry.toolText=" ";
		dnsGraphEntry.value=dnsResolvedtime;
		connectGraphEntry.value=connectiontime;
		firstByteEntry.value=firstBytetime;
		lastByteEntry.value=ttlbValue;
		sizeEntry.value=contentLength;
		responseGraphEntry.value=responsetime;
		// COMPUTING Custom Tooltip Text
		var toolTipString="Location: "+locname+"{br}DNS: "+getLocaleFormattedNumber(dnsResolvedtime)+"{br}"+"Connection: "+getLocaleFormattedNumber(connectiontime)+"{br}"+"First Byte: "+getLocaleFormattedNumber(firstBytetime)+"{br}"+"Last Byte: "+getLocaleFormattedNumber(ttlbValue)+"{br}"+"Response: "+getLocaleFormattedNumber(responsetime); //No I18N

		dnsGraphEntry.toolText=toolTipString;
		connectGraphEntry.toolText=toolTipString;
		firstByteEntry.toolText=toolTipString;
		lastByteEntry.toolText=toolTipString;
		responseGraphEntry.toolText=toolTipString;



		locGraphArray.push(locGraphEntry);
		dnsGraphArray.push(dnsGraphEntry);
		connectGraphArray.push(connectGraphEntry);
		firstByteGraphArray.push(firstByteEntry);
		lastByteGraphArray.push(lastByteEntry);
		responseGraphArray.push(responseGraphEntry);

		locNm.push(locname);
		avail.push(availability);
		resIp.push(resolvedIP);
		reasonArr.push(reason);
		conLen.push(contentLength);
		downTm.push(downloadtime);

		if(resolvedIP.length==0)
		{
			// When a website is not reachable we need a non-empty field as IP
			// Address.
			resolvedIP="0.0.0.0";
		}

		var loc_response=locname+"#:#"+availability+"#:#"+resolvedIP+"#:#"+reason+"#:#"+contentLength+"#:#"+dnsResolvedtime+"#:#"+conTimeValue+"#:#"+ttfbValue+"#:#"+responsetime+"#:#"+connectiontime+"#:#"+firstBytetime+"#:#"+downloadtime+"";// No	I18N
		// console.log("loc_response : "+loc_response);
		locations_url_response=locations_url_response.replace("locid="+locid,loc_response);
		// console.log("locations_url_response : "+locations_url_response);
		// console.log("Available Resp Count : "+availRespCount[reqId]+"
		// selectedLocationsLength "+ selectedLocationslength);
		if(availRespCount[reqId]==selectedLocationslength)
		{
			drawGraph(selectedLocationslength,reqId);
			response_data=locations_url_response;
			response_data=JSON.stringify(cwadata);
			globalURL=url;
			//console.log("ResponseData : "+response_data);
			var form = document.createElement("form");
			form.setAttribute("method", "post");
			form.setAttribute("action", "/tools/general/simpleTest.do");
			form.appendChild(getnewFormElement("hidden","method","saveContent"));
			form.appendChild(getnewFormElement("hidden","response_data",response_data));
			form.appendChild(getnewFormElement("hidden","selectedLocationslength",selectedLocationslength));
			form.appendChild(getnewFormElement("hidden","url",url));
			form.appendChild(getnewFormElement("hidden","timestamp",timestamp));
			form.appendChild(getnewFormElement("hidden","requestId",reqId));
			document.body.appendChild(form);
			getHtmlForForm(form,"savetest",form,url);

			showPreviousHistory("URL",url); //No I18N

		}
	}
}

function postwebsocketavailabilitydetails(result,url,selectedLocations,reqId)
{
	showWebsiteAvailabilityResultPage(url,reqId);
	chartData[reqId]={};
	var cwadata=chartData[reqId];
	cwadata.loc=new Array();
	cwadata.dnsT=new Array();
	cwadata.conT=new Array();
	cwadata.handshakeT=new Array();
	cwadata.rspT=new Array();
	cwadata.locName=new Array();
	cwadata.avail=new Array();
	cwadata.resIp=new Array();
	cwadata.reason=new Array();
	cwadata.pingpongT=new Array();
	cwadata.reqId=reqId;
	cwadata.durl=url;
	cwadata.tooltype="WEBSOCKET";//NO I18N
	cwadata.timestamp=timestamp;

	var stackChart=null;
	// alert("Request Id : "+reqId+" Chart Array : "+chartArray.length);
	if(reqId >= chartArray.length)
	{
		// alert("Settting up graphs . . . ");
		FusionCharts.setCurrentRenderer('javascript');//NO I18N
		FusionCharts.debugMode.enabled(true);
		stackChart = new FusionCharts(fusionChartsURL,"stackChartId"+reqId,"630","296","1","1");//NO I18N
		// FB.XFBML.parse();
		stackChart.configure('LoadingText','Loading data please wait . . . ');//NO I18N
		stackChart.configure('XMLLoadingText','Loading data please wait . . . ');//NO I18N
		stackChart.configure('ParsingDataText','Loading data please wait . . . ');//NO I18N
		stackChart.configure('ChartNoDataText','Loading data please wait . . . ');//NO I18N
		stackChart.configure('RenderingChartText','Rendering chart please wait . . .');//NO I18N
		stackChart.configure('InvalidXMLText','Invalid Data . . .');//NO I18N
		stackChart.configure('LoadDataErrorText','Loading Data please wait . . .');//NO I18N
		var jsonDataSkeleton='{"chart":{"caption":"Websocket Availability Metrics","xaxisname":"Locations","yaxisname":"Time (ms)","showvalues":"1","formatNumber":"1","formatNumberScale":"0","defaultAnimation":"1""bgColor":"F7F8F6","bgAlpha":"100","canvasBgColor":"F7F8F6", "canvasBgAlpha":"0"},"categories":[{"category":[{}],"dataset":[{"seriesname":"DNS","data":[{}]},{"seriesname":"Connect","data":[{}]},{"seriesname":"Handshake","data":[{}]},{"seriesname":"PingPong","data":[{}]}],"trendlines":{"line":[{"startvalue":"0","color":"91C728","displayvalue":""}]}}';//NO I18N
		stackChart.render("id_graphContainer_div"+reqId);
		chartArray[reqId] = stackChart;
	}
	for (var i=0; i<selectedLocations.length; i++)
	{
		addLocationLoadingRowForWebSocket(selectedLocations[i].value,reqId);
		var form=document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("name","WebSiteLocationTest");
		form.setAttribute("action", "/tools/action.do");
		form.appendChild(getnewFormElement("hidden","execute","checkWebsocketAvailability"));//NO I18N
		form.appendChild(getnewFormElement("hidden","locationid",selectedLocations[i].value));//NO I18N
		form.appendChild(getnewFormElement("hidden","url",url));//NO I18N
		form.appendChild(getnewFormElement("hidden","timestamp",timestamp));//NO I18N
		form.appendChild(getnewFormElement("hidden","requestId",reqId));//NO I18N
		document.body.appendChild(form);
		getHtmlForForm(form,"postwebsocketResponse",selectedLocations[i].value,selectedLocations.length,reqId);
	}

}

function postwebsocketResponse(result,locid,selectedLocationslength,reqId)
{
	availRespCount[reqId] = availRespCount[reqId] + 1;
	// alert("Result of output :: "+result.length+" Location Id : "+locid+"
	// Selected Locations Length : "+selectedLocationslength+" Request Id :
	// "+reqId);

	if(result.length==0)
	{
		// Update as timed out.
		// alert("Inside result.length == 0");
		var locName=$('li input[value="'+locid+'"]').parent().text();
		// console.log("empty postResponse message received for location :
		// "+locid+" Location Name : "+locName);
		result="#ax_dnsResolvedtime=0&ax_responsetime=0&ax_locname="+locName+"&ax_downloadtime=0&ax_resolvedIp=&ax_handshaketime=0&ax_pingpongtime=0&ax_availability=0&ax_responsecode=TIMED-OUT&ax_url=YourDomain.com&ax_reason=TIMED-OUT&ax_connectiontime=0&"; // No I18N
		// return 0;
	}
	if(result.match("locid")!=-1)
	{
		// alert("Result : "+result);
		var timeoutHandle=timeoutHandleaArray[locid];
		clearTimeout(timeoutHandle);
		// console.log("Clearing timeout since response has already been received
		// Location : "+locid);
		var responsetime = getValue(result,'ax_responsetime');//NO I18N
		var responsecode = getValue(result,'ax_responsecode');//NO I18N
		var availability=getValue(result,'ax_availability');//NO I18N
		var resolvedIP=getValue(result,'ax_resolvedIp');//NO I18N
		var dnsResolvedtime=getValue(result,'ax_dnsResolvedtime')//NO I18N
		var connectiontime=getValue(result,'ax_connectiontime');//NO I18N
		var availabilityimage=imagesUrl + "down_icon.gif";//NO I18N
		var handshaketime=getValue(result,'ax_handshaketime');//NO I18N
		var pingpongtime=getValue(result,'ax_pingpongtime');//NO I18N
		var reason=getValue(result,'ax_reason');//NO I18N
		var url=getValue(result,'ax_url');//NO I18N
		var locname = getValue(result,'ax_locname')//NO I18N


		// var locations=document.getElementById("locationid").value;
		var locations=locid;
		if(locations_url_response=="")
		{
			for(var i=0;i<selectedLocationslength;i++)
			{
				locations=locations.replace(",","locid=");
			}
			locations_url_response="locid="+locations;//NO I18N
		}
		var conTimeValue=connectiontime;

		if(reason=="OK")
		{
			responsecode=reason;
			if(topdivdata)
			{
				topdivdata=false;
				var urltrim=$.trim(url);
				var urllen=urltrim.length;
				if(urllen >33)
				{
					var sliceurl=urltrim.slice(0,33);
					$('#id_url').html('Result URL: '+sliceurl+'.....'); // No I18N
					$('#id_url').attr('title',url); // No I18N
				}
				else
				{
					$('#id_url').html('Result URL: '+url);
				}
				$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
				var dateStr=getDateString(true);
				$('#id_reqtime').html('Tested on: '+dateStr);
			}
			$('#id_locn'+reqId+""+locid).text(locname);
			$('#id_sc'+reqId+""+locid).html('<b>'+responsecode+'</b>');
			$('#id_ip'+reqId+""+locid).text(resolvedIP);
			$("#id_ip"+reqId+""+locid).css("text-align","left");// No I18N
			$('#id_dnsT'+reqId+""+locid).text(getLocaleFormattedNumber(dnsResolvedtime));
			$('#id_dnsT'+reqId+""+locid).css("text-align","right");// No I18N
			$('#id_conT'+reqId+""+locid).text(getLocaleFormattedNumber(connectiontime));
			$('#id_conT'+reqId+""+locid).css("text-align","right");// No I18N
			$('#id_handshakeT'+reqId+""+locid).text(getLocaleFormattedNumber(handshaketime));
			$('#id_handshakeT'+reqId+""+locid).css("text-align","right");// No I18N
			$('#id_pingpongT'+reqId+""+locid).text(getLocaleFormattedNumber(pingpongtime));
			$('#id_pingpongT'+reqId+""+locid).css("text-align","right");// No I18N
			$('#id_respT'+reqId+""+locid).text(getLocaleFormattedNumber(responsetime));
			$('#id_respT'+reqId+""+locid).css("text-align","right");// No I18N
		}
		else
		{
			// console.log("Inside else : reason :: "+result);
			if(responsetime==="0")
			{
				$('#id_locn'+reqId+""+locid).text(locname);
				$('#id_sc'+reqId+""+locid).html('<b>-</b>');
				//$('#id_sc'+reqId+""+locid).html('<b>'+reason+'</b>');
				$('#id_ip'+reqId+""+locid).html('<b>'+reason+'</b>');
				$("#id_ip"+reqId+""+locid).css("width","605px");
				$("#id_ip"+reqId+""+locid).attr('class',"floatleft dlfont9l pad5");
				$('#id_dnsT'+reqId+""+locid).remove();
				$('#id_conT'+reqId+""+locid).remove();
				$('#id_handshakeT'+reqId+""+locid).remove();
				$('#id_pingpongT'+reqId+""+locid).remove();
				//$('#id_respt'+reqId+""+locid).text("-"); // No I18N
			}
			else {
				$('#id_locn'+reqId+""+locid).text(locname);
				$('#id_sc'+reqId+""+locid).html('<b>'+responsecode+'</b>');
				$('#id_ip'+reqId+""+locid).text(resolvedIP);
				$('#id_dnsT'+reqId+""+locid).text(getLocaleFormattedNumber(dnsResolvedtime));
				$('#id_conT'+reqId+""+locid).text(getLocaleFormattedNumber(connectiontime));
				$('#id_handshakeT'+reqId+""+locid).text(getLocaleFormattedNumber(handshaketime));
				$('#id_pingpongT'+reqId+""+locid).text(getLocaleFormattedNumber(pingpongtime));
				$('#id_respT'+reqId+""+locid).text(getLocaleFormattedNumber(responsetime));
			}
		}



		var cwadata=chartData[reqId];
		var locGraphArray=cwadata.loc;
		var dnsGraphArray=cwadata.dnsT;
		var connectGraphArray=cwadata.conT;
		var handshakeGraphArray=cwadata.handshakeT;
		var pingpongGraphArray=cwadata.pingpongT;
		var responseGraphArray=cwadata.rspT;
		var locNm=cwadata.locName;
		var avail=cwadata.avail;
		var resIp=cwadata.resIp;
		var reasonArr=cwadata.reason;

		// Populate Graph Array Elements for later graph drawing.
		var locGraphEntry={},dnsGraphEntry={},connectGraphEntry={},handshakeEntry={},pingpongEntry={},responseGraphEntry={};
		locGraphEntry.label=locname.substr(0,3);
		locGraphEntry.toolText=" ";
		dnsGraphEntry.value=dnsResolvedtime;
		connectGraphEntry.value=connectiontime;
		handshakeEntry.value=handshaketime;
		pingpongEntry.value=pingpongtime;
		responseGraphEntry.value=responsetime;
		// COMPUTING Custom Tooltip Text
		var toolTipString="Location: "+locname+"{br}DNS: "+getLocaleFormattedNumber(dnsResolvedtime)+"{br}"+"Connection: "+getLocaleFormattedNumber(connectiontime)+"{br}"+"handshake: "+getLocaleFormattedNumber(handshaketime)+"{br}"+"pingpong: "+getLocaleFormattedNumber(pingpongtime)+"{br}"+"Response: "+getLocaleFormattedNumber(responsetime); //No I18N

		dnsGraphEntry.toolText=toolTipString;
		connectGraphEntry.toolText=toolTipString;
		handshakeEntry.toolText=toolTipString;
		pingpongEntry.toolText=toolTipString;
		responseGraphEntry.toolText=toolTipString;



		locGraphArray.push(locGraphEntry);
		dnsGraphArray.push(dnsGraphEntry);
		connectGraphArray.push(connectGraphEntry);
		handshakeGraphArray.push(handshakeEntry);
		pingpongGraphArray.push(pingpongEntry);
		responseGraphArray.push(responseGraphEntry);

		locNm.push(locname);
		avail.push(availability);
		resIp.push(resolvedIP);
		reasonArr.push(reason);

		if(resolvedIP.length==0)
		{
			// When a website is not reachable we need a non-empty field as IP
			// Address.
			resolvedIP="0.0.0.0";
		}

		var loc_response=locname+"#:#"+availability+"#:#"+resolvedIP+"#:#"+reason+"#:#"+dnsResolvedtime+"#:#"+handshaketime+"#:#"+responsetime+"#:#"+connectiontime+"#:#"+pingpongtime+"";// No	I18N
		// console.log("loc_response : "+loc_response);
		locations_url_response=locations_url_response.replace("locid="+locid,loc_response);
		// console.log("locations_url_response : "+locations_url_response);
		// console.log("Available Resp Count : "+availRespCount[reqId]+"
		// selectedLocationsLength "+ selectedLocationslength);
		if(availRespCount[reqId]==selectedLocationslength)
		{
			drawGraphForWebSocket(selectedLocationslength,reqId);
			response_data=locations_url_response;
			response_data=JSON.stringify(cwadata);
			globalURL=url;
			//console.log("ResponseData : "+response_data);
			var form = document.createElement("form");
			form.setAttribute("method", "post");
			form.setAttribute("action", "/tools/action.do");
			form.appendChild(getnewFormElement("hidden","execute","saveContent"));//NO I18N
			form.appendChild(getnewFormElement("hidden","response_data",response_data));//NO I18N
			form.appendChild(getnewFormElement("hidden","selectedLocationslength",selectedLocationslength));//NO I18N
			form.appendChild(getnewFormElement("hidden","url",url));//NO I18N
			form.appendChild(getnewFormElement("hidden","timestamp",timestamp));//NO I18N
			form.appendChild(getnewFormElement("hidden","requestId",reqId));//NO I18N
			document.body.appendChild(form);
			getHtmlForForm(form,"savetest",form,url);//NO I18N

			showPreviousHistory("WEBSOCKET",url); //No I18N

		}
	}
}
function showPreviousHistory(tooltype,webhosturl)
{
	var response = $.getAjaxResponse("GET","/tools/view-history.html?toolName="+tooltype+"&webhosturl="+webhosturl);//No I18N
	$("#previousResultDiv").html(response);
	$("#previousResultDiv").show();
}

function savetest(result,frm)
{
	var linkurltest = getValue(result,'ax_linkurltest');
	if(typeof(linkurltest) == "undefined")
	{
		$('#shareresult').hide();
	}
	else {
		document.getElementById('permalink').value=linkurltest;
		$('#shareresult').show();
	}
	globalPermaLink=linkurltest;
	var fbLikeDiv=document.getElementById("fbLikeTd");
	var tweetLikeDiv=document.getElementById("tweetdiv");
	var gplusLikeDiv=document.getElementById("gplusdiv");
	addFacebookLikeButton(linkurltest,fbLikeDiv);
	addTweetLikeButton(linkurltest,tweetLikeDiv);
	addgplusLikeButton(linkurltest,tweetLikeDiv);
}

function addFacebookLikeButton(linkToBeShared,parentElt)
{
}

function addTweetLikeButton(linkToBeShared,parentElt)
{
}

function addgplusLikeButton(linkToBeShared,parentElt)
{
}

function doDnsLookup()
{
	var form = document.createElement("form");
	requestCount = requestCount + 1;
	var requestId= requestCount;
	form.setAttribute("name","dnslookup");
	form.setAttribute("method", "post");
	form.setAttribute("action", "/tools/action.do");
	form.appendChild(getnewFormElement("hidden","execute","checkAccessKeyword"));// No I18N
	form.appendChild(getnewFormElement("hidden","Lookup","Analyze"));// No I18N
	var hostNameElt=document.getElementsByName("hostName");
	var urlElt=document.getElementsByName("url");
	if(typeof(hostNameElt)=='undefined' || hostNameElt.length==0 || hostNameElt==null)
	{
		// This form does not have hostNameElt. // Try url
		url=$('input[name="url"]').val();
		if(url.indexOf(hp_var)>=0)
		{
			url=url.substring(7);
		}
		else if(url.indexOf(hs_var)>=0)
		{
			url=url.substring(8);
		}
		hostNameElt=getnewFormElement("hidden","hostName",url);
		hostNameElt.setAttribute("id","hostName");
		form.appendChild(hostNameElt);
	}
	else {
		var newFormElt=hostNameElt[0].cloneNode(true);
		form.appendChild(newFormElt);
	}
	doLookup(form);
}

function doLookup(frm)
{
	// If form does not have execute, send it.
	reqTs=new Date();
	url=frm.hostName.value;
	if(url=='')
	{
		alert(beanmsg["empty_domain"]);
		formInputElt.select();
		return;
	}
	if(isDomainValid(url)===false)
	{
		alert("Please enter a valid domain name.");
		document.getElementById("url").focus();
		return;
	}
	requestCount  = requestCount + 1;
	getHtmlForForm(frm, "checkAccessforDNS",frm,requestCount);
}

function checkAccessforDNS(result,frm,requestId){
	if(document.getElementById('requestId')==null) {
		frm.appendChild(getnewFormElement("hidden","requestId",requestId));// No I18N
	}
	if(document.getElementById('timestamp')==null) {
		frm.appendChild(getnewFormElement("hidden","timestamp",timestamp));// No I18N
	}
	var hostName=frm.hostName.value;
	showCommonResultPage(hostName);
	var dnsResultContainer=document.getElementById("dnsResultContainer");
	var dnsResultNode=dnsResultContainer.cloneNode(true);
	dnsResultNode.setAttribute("id","dnsResultContainer"+requestId);
	pElt = dnsResultNode.children[0].children[0].children[0];
	pElt.innerHTML="DNS Analysis Results: "+getDateString(true);
	var hdrElt=dnsResultNode.children[0].children[1].children[0];
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date())); // No I18N
	hdrElt.innerHTML='DNS Results: <img style="margin-left: 10px;" src="" + animImage + ""/>';
	var dataElt=dnsResultNode.children[0].children[2];
	dataElt.setAttribute("id","locResult"+requestId);
	var graphSpaceDiv=document.getElementById("id_result_graph_space");
	insertAfter(graphSpaceDiv,dnsResultNode);
	dnsResultNode.style.display='block';
	frm.execute.value="getDnsRecordType";
	getHtmlForForm(frm, "postLookup",hostName,frm,requestId);// No I18N
	$('.grptext').show();
	// postLookup(xxx,hostName,frm,requestId);
}

function postLookup(result,hostName,frm,requestId)
{
	var dnsResultNode=document.getElementById("dnsResultContainer"+requestId);
	var hdrElt=dnsResultNode.children[0].children[1].children[0];
	if(result==null || result=='undefined' || $.trim(result).length==0)
	{
		hdrElt.innerHTML='DNS Results : Fetching results failed for host : '+ hostName;
		return;
	}
	hdrElt.innerHTML='DNS Results : '+ hostName;
	var dataElt=dnsResultNode.children[0].children[2];
	var styleStr=dataElt.style;
	styleStr = styleStr + '; overflow-y: scroll;';
	result=result.replace("DNS Report for "+hostName,"");
	dataElt.innerHTML=result+"</td><td class='datatdborder' align='left' style='border-right:1px dotted #CCCCCC;'></td><td class='datatdborder' align='left'></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div>"; // No I18N
	dataElt.style.display='block';
	globalToolType="DNS"; // No I18N
	var form = document.createElement("form");
	form.setAttribute("method", "post");
	form.setAttribute("action", "/tools/action.do?");
	form.appendChild(getnewFormElement("hidden","execute","saveInnerHtmlforTools"));// No I18N
	form.appendChild(getnewFormElement("hidden","tools_response",result));// No I18N
	form.appendChild(getnewFormElement("hidden","url",hostName));// No I18N
	form.appendChild(getnewFormElement("hidden","monitortype","DNS"));// No I18N
	form.appendChild(getnewFormElement("hidden","requestId",requestId));// No I18N
	form.appendChild(getnewFormElement("hidden","timestamp",timestamp));// No I18N
	document.body.appendChild(form);
	getHtmlForForm(form,"dnsLookupdet",hostName);  // No I18N
}

function dnsLookupdet(result,hostName)
{
	showPreviousHistory("DNS",hostName);  //No I18N
	document.getElementById('permalink').value = getUrlValue(result,'axUrl_permalink');// No I18N
	globalPermaLink=getUrlValue(result,'axUrl_permalink');// No I18N
	$('#shareresult').show();
	var permaLinkTextbox=document.getElementById('permalink').value;
	addFacebookLikeButton(permaLinkTextbox,document.getElementById('fbLikeTd'));
	addTweetLikeButton(permaLinkTextbox,document.getElementById('tweetdiv'));
	addgplusLikeButton(permaLinkTextbox,document.getElementById("gplusdiv"));

}

function findIp(frm)
{
	if(frm.iphostname.value=='')
	{
		alert(beanmsg["empty_domain"]);
		frm.iphostname.select();
		return;
	}
	getHtmlForForm(frm,"checkAccessKeyforIP",frm);
}

function getFireBug(frm)
{
	reqTs=new Date();
	if(frm.urlLink.value=='')
	{
		alert(beanmsg["input_url"]);
		frm.urlLink.select();
		return;
	}
	if(isDomainValid(frm.urlLink.value)===false)
	{
		alert("Please enter a valid domain name."); // No I18N
		document.getElementById("urlLink").select();
		return;
	}
	setCookie("tools.site24x7.domain",frm.urlLink.value);
	postaccesskeyword(frm);
}

function showFireBugResultPage()
{
	// alert('showFireBugResultPage . . .');
	$('#id_other_commands_top').hide();
	$('#id_other_commands_below').hide();

	// $('#id_quicktest_space').hide();
	$('.grptext').hide();
	var awbRC=document.getElementById('awbResultContainer');
	var awbRC_hdr=awbRC.children[0].children[0];
	// var awbRC_result=awbRC.children[0].children[2];
	awbRC.style.display='block';
	awbRC.children[0].style.display='block';
	awbRC_hdr.style.display='block';
	// awbRC_result.style.display='block';
	var graphSpaceDiv=document.getElementById("id_result_graph_space");
	insertAfter(graphSpaceDiv,awbResultContainer);
}

function postaccesskeyword(frm){
	var hostname = document.getElementById('urlLink').value;
	//var index = hostname.indexOf(hp_var);
	if(hostname.indexOf(hs_var)<0 && hostname.indexOf(hp_var)<0)
	{
		hostname = hp_var+hostname;
		document.getElementById('urlLink').value=hostname;
	}
	$('#id_quicktest_div').show();
	$('#id_quicktest_div').hide();
	showCommonResultPage(hostname);
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date())); // No I18N
	showFireBugResultPage();
	hideDiv('webpagesummary');
	hideDiv('shareresult');
	setTimeout(function() {
		sendDelayedRequest(frm,hostname);
	}, 50);
}

function showAWP(data)
{
	var hdrNode=document.getElementById('awbResultHdr');
	hdrNode.style.display='none';
	var titleElt=$('#awburl');
	titleElt=titleElt.children[0];
	var title=toolsmsg.fullwebpageresults;
	// alert(title);
	var titleStr=title.replace("{0}",getDateString(true)); // No I18N
	// alert(titleStr);
	$('#awburl').html(titleStr);
	$('#awburl').show();
	$('#awbResult').show();
	$('#firebugResult').html(data);
}

function sendDelayedRequest(frm,hostname)
{
	frm.execute.value='doWebPageAnalyze';
	var ajaxResp = $.getAsyncPostAjaxResponse(showAWP,frm.action,$(frm).serialize());// No I18N
	$('#firebugResult').html(ajaxResp);// No I18N
	var hdrNode=document.getElementById('awbResultHdr');
	hdrNode.style.display='block';
	$('#loadingdiv').show();// No I18N
}

/* Port in Tools Begins */
function doPortTest(frm,ranword)
{
	count_port=0;
	var requestId=requestCount;
	requestCount = requestCount + 1;
	if(document.getElementById('requestId')==null) {
		frm.appendChild(getnewFormElement("hidden","requestId",requestId));
	}
	doToolsTest(frm,"",'PORT',requestId);// No I18N
}

function showPortLoadingPage(url,selectedLocations,requestId)
{
	var count = selectedLocations.length;
	var portResult=document.getElementById('portResultContainer').children[0];
	var pn=portResult.cloneNode(true);
	$(pn).attr('id','portResultContainer'+requestId);
	var pnHdg=pn.children[0];
	var pnHdr=pn.children[1];
	var pnRow=pn.children[2];
	pnHdg.children[0].innerHTML='Port availability results: '+getDateString(true);
	for(var i=0;i<count;i++)
	{
		var pnRowNode=pnRow.cloneNode(true);
		$(pnRowNode).attr('id','portRow_'+selectedLocations[i].value+"_"+requestId);
		pnRowNode.children[0].innerHTML='<img style="float:left; margin-left: 10px;" src="" + animImage + ""/>  Loading . . .';
		pnRowNode.children[1].innerHTML='';
		pnRowNode.children[2].innerHTML='';
		pn.appendChild(pnRowNode);
		$(pnRowNode).show();
	}
	var graphSpaceDiv=document.getElementById("id_result_graph_space");
	insertAfter(graphSpaceDiv,pn);
	$(pn).show();
}

function postPortOutputdetails(result,url,selectedLocations,requestId)
{
	var locations=document.getElementById("locationid").value;
	if(row_values=="")
	{
		for(var i=0;i<selectedLocations.length;i++)
		{
			locations=locations.replace(",","locid=");
		}
	}
	setCookie("tools.site24x7.domain",url);
	showCommonResultPage(url);
	$('#shareresult').hide();
	// $('.grptext').show();
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	showPortLoadingPage(url,selectedLocations,requestId);
	// showLoading('availabilitydetails');//No I18N
	var port = document.getElementById('port').value;
	if(port=='')
	{
		port = "80";
	}
	for (var i=0; i<selectedLocations.length; i++)
	{
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "/tools/general/simpleTest.do");
		form.appendChild(getnewFormElement("hidden","method","doPortTest"));// No I18N
		form.appendChild(getnewFormElement("hidden","locid",selectedLocations[i].value));// No I18N
		form.appendChild(getnewFormElement("hidden","url",url));// No I18N
		form.appendChild(getnewFormElement("hidden","port",port));// No I18N
		form.appendChild(getnewFormElement("hidden","timestamp",timestamp));// No I18N
		form.appendChild(getnewFormElement("hidden","requestId",requestId));// No I18N
		document.body.appendChild(form);
		getHtmlForForm(form,"postPortResponse",selectedLocations[i],selectedLocations.length,requestId);
	}
}

function postPortResponse(result,locid,locationLength,requestId)
{
	count_port++;
	if(result.match("locid")!=-1)
	{
		var responsetime = getValue(result,'ax_responsetime');// No I18N
		var availability=getValue(result,'ax_availability');// No I18N
		var availabilityimage=imagesUrl + "down_icon.gif";// No I18N
		var locname = getValue(result,'ax_locname');// No I18N
		var url = getValue(result,'ax_url');// No I18N
		var port = getValue(result,'ax_port');// No I18N
		globalURL=url;
		if(availability==1)
		{
			reason="Available";// No I18N
			availabilityimage='<img src="' + imagesUrl + 'up_icon.gif"/>';
		}
		else if(availability==0)
		{
			availabilityimage='<img src="' + imagesUrl + 'down_icon.gif"/>';
		}
		else
		{
			availabilityimage="&nbsp;-";// No I18N
		}
		var rowNode=document.getElementById("portRow_"+locid.value+"_"+requestId);
		rowNode.children[0].innerHTML=locname;
		rowNode.children[1].innerHTML=availabilityimage;
		rowNode.children[2].innerHTML=responsetime;
		//console.log(" Count _port == "+count_port+" Locations Length : "+locationLength);

		if(count_port==locationLength)
		{
			// Populate the permalink.
			$('#shareresult').show();
			var proto=location.protocol;
			var hostname=location.host;
			var portno=location.port;
			$('#permalink').val(proto+"//"+hostname+"/public/t/results-"+timestamp+".html");
			var permaLinkTextbox=proto+"//"+hostname+"/public/t/results-"+timestamp+".html";
			globalToolType="PORT";
			showPreviousHistory("PORT",url);  //No I18N
			globalPermaLink=permaLinkTextbox;
			addFacebookLikeButton(permaLinkTextbox,document.getElementById('fbLikeTd'));
			addTweetLikeButton(permaLinkTextbox,document.getElementById('tweetdiv'));
			addgplusLikeButton(permaLinkTextbox,document.getElementById("gplusdiv"));
		}
	}
}

function doToolsTest(frm,ranword,monitortype,requestId)
{
	var selectedLocations=new Array();
	var url=document.getElementById("url").value;
	var url2='-';  //No I18N
	var locations=document.getElementsByName("locations");
	var defloc=document.getElementsByName("defloc");
	var locationIdArray=new Array();
	reqTs=new Date();

	if(monitortype=='WEBSITE-COMPARE')
	{
		url2=document.getElementById("url2").value;
		if(url2=='')
		{
			alert(beanmsg.input_url);
			frm.url.select();
			return;
		}
	}


	if(url=='')
	{
		alert(beanmsg["input_url"]);
		frm.url.select();
		return;
	}

	if(monitortype=='PORT')
	{
		var port=document.getElementById("port").value;
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
		if(isDomainValid(url)===false)
		{
			alert("Please enter a valid domain name.");
			frm.port.select();
			return;
		}
	}

	var count=0;
	if(url!='')
	{
		for (var j=0; j < locations.length; j++)
		{
			if (locations[j].checked)
			{
				if(selectedLocations.indexOf(locations[j].value)==-1)
				{
					// alert("Adding SelectedLocations :: "+locations[j].value);
					selectedLocations[count]=locations[j];
					locationIdArray[count]=locations[j].value;
					count++;
				}
			}
		}
		if(count==0)
		{
			alert(beanmsg["input_location"]);
			return false;
		}
		document.getElementById('locationid').value=locationIdArray;
		if(monitortype=='PORT')
		{
			getHtmlForForm(frm,"postPortOutputdetails",url,selectedLocations,requestId);// No I18N
		}
		else if(monitortype=='PING')
		{
			getHtmlForForm(frm,"postPingOutputdetails",url,selectedLocations,requestId);// No I18N
		}
		else if(monitortype=='URL')
		{
			url=trimUrl(url);
			if(isDomainValid(url)===false)
			{
				alert("Please enter a valid domain name.");
				document.getElementById("url").focus();
				return;
			}
			var index = url.indexOf(hp_var);

			if(url.indexOf(hs_var)<0 && url.indexOf(hp_var)<0 )
			{
				url = hp_var+url;
			}
			requestCount = requestCount + 1;
			availRespCount[requestCount]=0;
			setCookie("tools.site24x7.domain",url);
			if(document.getElementById('requestId')==null) {
				frm.appendChild(getnewFormElement("hidden","requestId",requestCount));
			}
			getHtmlForForm(frm,"postavailabilitydetails",url,selectedLocations,requestCount);
		}
		else if(monitortype=='WEBSOCKET')
		{
			url = trimUrl(url);
			if(isDomainValidWebsocket(url)===false)
			{
				alert("Please enter a valid domain name.");//NO I18N
				document.getElementById("url").focus();
				return;
			}
			var index = url.indexOf(wss_var);

			if(url.indexOf(wss_var)<0 && url.indexOf(ws_var)<0 )
			{
				url = wss_var+url;
			}
			requestCount = requestCount + 1;
			availRespCount[requestCount]=0;
			setCookie("tools.site24x7.domain",url);//NO I18N
			if(document.getElementById('requestId')==null) {
				frm.appendChild(getnewFormElement("hidden","requestId",requestCount));//NO I18N
			}
			getHtmlForForm(frm,"postwebsocketavailabilitydetails",url,selectedLocations,requestCount);//NO I18N

		}
		else if(monitortype=='WEBSITE-COMPARE')
		{
			url=trimUrl(url);
			url2=trimUrl(url2);
			if(isDomainValid(url)===false)
			{
				alert("Please enter a valid domain name."); // No I18N
				document.getElementById("url").focus();
				return;
			}
			if(isDomainValid(url2)===false)
			{
				alert("Please enter a valid domain name."); // No I18N
				document.getElementById("url2").focus();
				return;
			}
			var index = url.indexOf(hp_var);

			if(url.indexOf(hs_var)<0 && url.indexOf(hp_var)<0 )
			{
				url = hp_var+url;
			}
			requestCount = requestCount + 1;
			availRespCount[requestCount]=0;
			setCookie("tools.site24x7.domain",url); // No I18N
			if(document.getElementById('requestId')==null) {
				frm.appendChild(getnewFormElement("hidden","requestId",requestCount)); // No I18N
			}
			getHtmlForForm(frm,"postwebsitecomparisondetails",url,selectedLocations,requestCount); // No I18N

			index = url2.indexOf(hp_var);

			if(url2.indexOf(hs_var)<0 && url2.indexOf(hp_var)<0 )
			{
				url2 = hp_var+url2;
			}
			requestCount = requestCount + 1;
			availRespCount[requestCount]=0;
			setCookie("tools.site24x7.domain",url2); // No I18N
			if(document.getElementById('requestId')==null) {
				frm.appendChild(getnewFormElement("hidden","requestId",requestCount)); // No I18N
			}
			getHtmlForForm(frm,"postwebsitecomparisondetails",url2,selectedLocations,requestCount); // No I18N
			$('#domain1').text(url);
			$('#domain2').text(url2);
		}
	}
}

function isIpAddress(domain)
{
	var numArr=domain.split(".");
	if(numArr.length==4 || numArr.length==6) {
		// check for Ip Address
		for(i=0;i<numArr.length;i++)
		{
			if(numArr[i].trim().length===0)
			{
				return false;
			}
			var num=parseInt(numArr[i]);
			if((i===0 && num===0) || num<0 || num>255 || isNaN(num)===true)
			{
				return false;
			}
		}
	}
	else {
		return false;
	}
	return true;
}

function validateDomainField(dName)
{
	dName = dName.substring(0, dName.indexOf('/'));
	if(dName.length>67)
	{
		return false;
	}
	var regex=/[^a-zA-Z0-9\-\.\/#]/
	var str=dName.match(regex);
	if(str===null)
	{
		return true;
	}
	return false;
}

function isDomainValid(url)
{
	var domainurl="";
	if(url==='undefined' || url==='null' || url===null || url===undefined)
	{
		return false;
	}
	else if($.trim(url).length===0)
	{
		return false;
	}
	else if(url.indexOf(hp_var)===0)
	{
		var a=document.createElement("a")
		a.href=url;
		domain=a.hostname;
		if( validateDomainField(domain) || isIpAddress(domain))
		{
			return true;
		}
		return false;
	}
	else if(url.indexOf(hs_var)===0)
	{
		var a=document.createElement("a")
		a.href=url;
		domain=a.hostname;
		if( validateDomainField(domain) || isIpAddress(domain))
		{
			return true;
		}
		return false;
	}
	else if(url.indexOf(wss_var)===0)
	{
		var a=document.createElement("a")
		a.href=url;
		domain=a.hostname;
		if( validateDomainField(domain) || isIpAddress(domain))
		{
			return true;
		}
		return false;
	}
	else if(url.indexOf(ws_var)===0)
	{
		var a=document.createElement("a")
		a.href= url;
		domain=a.hostname;
		if( validateDomainField(domain) || isIpAddress(domain))
		{
			return true;
		}
		return false;
	}
	else if(validateDomainField(url))
	{
		return true;
	}
	else if(isIpAddress(url))
	{
		return true;
	}
	return false;
}

function isDomainValidWebsocket(url)
{
	var domainurl="";
	if(url==='undefined' || url==='null' || url===null || url===undefined)
	{
		return false;
	}
	else if($.trim(url).length===0)
	{
		return false;
	}
	else if(url.indexOf(wss_var)===0)
	{
		var a=document.createElement("a")
		a.href=url;
		domain=a.hostname;
		if( validateDomainField(domain) || isIpAddress(domain))
		{
			return true;
		}
		return false;
	}
	else if(url.indexOf(ws_var)===0)
	{
		var a=document.createElement("a")
		a.href= url;
		domain=a.hostname;
		if( validateDomainField(domain) || isIpAddress(domain))
		{
			return true;
		}
		return false;
	}
	else if(validateDomainField(url))
	{
		return true;
	}
	else if(isIpAddress(url))
	{
		return true;
	}
	return false;
}


function trimUrl(url)
{
	if(url==='undefined' || url===null)
	{
		return "";
	}
	return $.trim(url);
}



function doWebsiteTest()
{
	reqTs=new Date();
	var selectedLocations=new Array();
	fusionChartsURL="../FusionCharts/StackedColumn3D.swf";
	var url=$('input[class="websitename"]').val();
	if(url===undefined || url==='undefined')
	{
		url=$('input[class="hostnameonly"]').val();

	}
	url=trimUrl(url);
	if(url.indexOf(hp_var)===-1)
	{
		url=hp_var+url;  // No I18N
	}
	var locations=document.getElementsByName("locations");
	//console.log("locations : "+locations.length);
	if(typeof(locations)=='undefined' || locations==null || locations.length==0)
	{
		//console.log("There are no locations ");
		// CREATE locations list
		var locList=new Array();
		locations=new Array();
		locList.push("1");
		locList.push("3");
		locList.push("11");
		locList.push("15");
		locList.push("40");
		for(i=0;i<locList.length;i++)
		{
			var chkBxElt=document.createElement("input");
			chkBxElt.setAttribute("type","checkbox");
			chkBxElt.setAttribute("name","locations");
			chkBxElt.setAttribute("value",locList[i]);
			chkBxElt.setAttribute("type","checkbox");
			chkBxElt.checked=true;
			locations.push(chkBxElt);
		}
	}
	var form = document.createElement("form");
	requestCount = requestCount + 1;
	var requestId= requestCount;
	//console.log("url : "+url);
	form.setAttribute("name","checkAvailability");
	form.setAttribute("method", "post");
	form.setAttribute("action", "/tools/general/simpleTest.do");
	form.appendChild(getnewFormElement("hidden","method","loadLocNames"));// No I18N
	form.appendChild(getnewFormElement("hidden","monitortype","URL"));// No I18N
	form.appendChild(getnewFormElement("hidden","requestId",requestId));
	form.appendChild(getnewFormElement("hidden","timestamp",timestamp));
	var urlElt=getnewFormElement("hidden","url",url);
	form.appendChild(urlElt);
	var locationsList="";
	var count=0;
	for (var j=0; j < locations.length; j++)
	{
		if (locations[j].checked)
		{
			var locationElt=document.createElement("input");
			locationElt.setAttribute("type","checkbox");
			locationElt.setAttribute("name","locations");
			locationElt.setAttribute("checked","checked");
			locationElt.setAttribute("value",locations[j].value);
			locationElt.checked=true;
			form.appendChild(locationElt);
			locationsList=locationsList.concat(((locationsList.length == 0)?(locations[j].value):(","+locations[j].value)));
			//console.log("Locations List : "+locationsList);
			selectedLocations[count]=locations[j];
			count++;
		}
	}
	var locIdInputElt=getnewFormElement("hidden","locationid",locationsList);
	locIdInputElt.setAttribute("id","locationid");
	form.appendChild(locIdInputElt);
	availRespCount[requestId]=0;
	getHtmlForForm(form,"postavailabilitydetails",url,selectedLocations,requestId);// No I18N
}

function doWebsocketTest()
{
	reqTs=new Date();
	Tooltype="WEBSOCKET"; //No I18N
	var selectedLocations=new Array();
	fusionChartsURL="../FusionCharts/StackedColumn3D.swf";	//No I18N
	var url=$('input[class="websitename"]').val();
	if(url===undefined || url==='undefined')
	{
		url=$('input[class="hostnameonly"]').val();

	}
	url=trimUrl(url);
	if(isDomainValidWebsocket(url))
	{

		if(url.indexOf(wss_var)===-1&&url.indexOf(ws_var)===-1)
		{
			url=wss_var+url;  // No I18N
		}
	}
	else
	{
		alert("Please enter a valid domain name."); //No I18N
		frm.url.select();
		return;
	}



	var locations=document.getElementsByName("locations");
	//console.log("locations : "+locations.length);
	if(typeof(locations)=='undefined' || locations==null || locations.length==0)
	{
		//console.log("There are no locations ");
		// CREATE locations list
		var locList=new Array();
		locations=new Array();
		locList.push("1");
		locList.push("3");
		locList.push("11");
		locList.push("15");
		locList.push("40");
		for(i=0;i<locList.length;i++)
		{
			var chkBxElt=document.createElement("input");
			chkBxElt.setAttribute("type","checkbox");
			chkBxElt.setAttribute("name","locations");
			chkBxElt.setAttribute("value",locList[i]);
			chkBxElt.setAttribute("type","checkbox");
			chkBxElt.checked=true;
			locations.push(chkBxElt);
		}
	}
	var form = document.createElement("form");
	requestCount = requestCount + 1;
	var requestId= requestCount;
	//console.log("url : "+url);
	form.setAttribute("name","checkWebsocketAvailability");
	form.setAttribute("method", "post");
	form.setAttribute("action", "/tools/action.do");
	form.appendChild(getnewFormElement("hidden","execute","checkWebsocketAvailability"));// No I18N
	form.appendChild(getnewFormElement("hidden","monitortype","WEBSOCKET"));// No I18N
	form.appendChild(getnewFormElement("hidden","requestId",requestId)); //No I18N
	form.appendChild(getnewFormElement("hidden","timestamp",timestamp)); //No I18N
	var urlElt=getnewFormElement("hidden","url",url); //No I18N
	form.appendChild(urlElt);
	var locationsList="";
	var count=0;
	for (var j=0; j < locations.length; j++)
	{
		if (locations[j].checked)
		{
			var locationElt=document.createElement("input");
			locationElt.setAttribute("type","checkbox");
			locationElt.setAttribute("name","locations");
			locationElt.setAttribute("checked","checked");
			locationElt.setAttribute("value",locations[j].value);
			locationElt.checked=true;
			form.appendChild(locationElt);
			locationsList=locationsList.concat(((locationsList.length == 0)?(locations[j].value):(","+locations[j].value)));
			//console.log("Locations List : "+locationsList);
			selectedLocations[count]=locations[j];
			count++;
		}
	}
	var locIdInputElt=getnewFormElement("hidden","locationid",locationsList); //No I18N
	locIdInputElt.setAttribute("id","locationid");
	form.appendChild(locIdInputElt);
	availRespCount[requestId]=0;
	getHtmlForForm(form,"postwebsocketavailabilitydetails",url,selectedLocations,requestId);// No I18N
}




function showCheckWebsiteLoadingResult(result,url,selectedLocations,requestId)
{

}

function insertAfter(refNode,newNode)
{
	refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
}

function showPingLoadingResult(result,url,selectedLocations,reqCount)
{
	var graphSpaceDiv=document.getElementById("id_result_graph_space");
	var responseDiv=document.getElementById("id_response_div");
	var pingResult=document.createElement("DIV");
	pingResult.innerHTML=result;
	insertAfter(graphSpaceDiv,pingResult);
	$(pingResult).slideDown(1000);
	count_ping=0;
	for (var i=0; i<selectedLocations.length; i++)
	{
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "/tools/general/simpleTest.do");
		form.appendChild(getnewFormElement("hidden","method","doPingTest"));// No I18N
		form.appendChild(getnewFormElement("hidden","locid",selectedLocations[i]));// No I18N
		form.appendChild(getnewFormElement("hidden","url",url));// No I18N
		form.appendChild(getnewFormElement("hidden","requestId",reqCount));
		form.appendChild(getnewFormElement("hidden","timestamp",timestamp));
		document.body.appendChild(form);
		getHtmlForForm(form,"updatePingRowResult",selectedLocations[i],selectedLocations.length,reqCount);
	}
}

function doPingWebsite()
{
	var selectedLocations=new Array();
	var oUrlElt=document.getElementsByName("url");
	if(typeof(oUrlElt)=='undefined' || oUrlElt==null || oUrlElt.length==0)
	{
		urlElt=getnewFormElement("hidden","url",url);
		urlElt=document.forms[0].appendChild(urlElt);
		urlElt.setAttribute("id","url");
		url=document.getElementById("hostName").value;
	}
	else {
		url=document.getElementById("url").value;
	}
	var locations=document.getElementsByName("locations");
	//console.log("locations : "+locations.length);
	if(typeof(locations)=='undefined' || locations==null || locations.length==0)
	{
		//console.log("There are no locations ");
		// CREATE locations list
		var locList=new Array();
		locations=new Array();
		locList.push("1");
		locList.push("3");
		locList.push("12");
		locList.push("15");
		locList.push("40");
		for(i=0;i<5;i++)
		{
			var chkBxElt=document.createElement("input");
			chkBxElt.setAttribute("type","checkbox");
			chkBxElt.setAttribute("name","locations");
			chkBxElt.setAttribute("value",locList[i]);
			chkBxElt.setAttribute("type","checkbox");
			chkBxElt.checked=true;
			locations.push(chkBxElt);
		}
	}
	var form = document.createElement("form");
	var requestId=requestCount;
	// alert("Request Id : "+requestId);
	form.setAttribute("name","checkPingAvailability");
	form.setAttribute("method", "post");
	form.setAttribute("action", "/tools/general/simpleTest.do");
	form.appendChild(getnewFormElement("hidden","method","loadLocNames"));// No  I18N
	form.appendChild(getnewFormElement("hidden","monitortype","PING"));// No I18N
	form.appendChild(getnewFormElement("hidden","requestId",requestId));
	form.appendChild(getnewFormElement("hidden","timestamp",timestamp));
	//form.appendChild(getnewFormElement("hidden","url",url));  //No I18N
	requestCount = requestCount + 1;
	// Get all selected Locations;
	var locationsList="";
	var count=0;
	//console.log("Final locations length : "+locations.length);
	for (var j=0; j < locations.length; j++)
	{
		if (locations[j].checked)
		{
			var locationElt=document.createElement("input");
			locationElt.setAttribute("type","checkbox");
			locationElt.setAttribute("name","locations");
			locationElt.setAttribute("checked","checked");
			locationElt.setAttribute("value",locations[j].value);
			locationElt.checked=true;
			form.appendChild(locationElt);
			locationsList=locationsList.concat(((locationsList.length == 0)?(locations[j].value):(","+locations[j].value)));
			//console.log("Locations List : "+locationsList);
			selectedLocations[count]=locations[j].value;
			count++;
		}
	}
	var locIdInputElt=getnewFormElement("hidden","locationid",locationsList);
	locIdInputElt.setAttribute("id","locationid");
	url=trimUrl(url);
	if(url.indexOf(hs_var)>=0) {
		url=url.substring(8);
	}
	else if(url.indexOf(hp_var)>=0)
	{
		url=url.substring(7);
	}
	if(url.length==0)
	{
		url="www.zoho.com";
	}
	var urlElt=getnewFormElement("hidden","url",url);
	form.appendChild(urlElt);
	form.appendChild(locIdInputElt);// No I18N
	getHtmlForForm(form,"showPingLoadingResult",url,selectedLocations,requestId);// No I18N
}

function updatePingRowResult(result,locid,locationLength,reqCount)
{
	var reqCountStr=new String(reqCount);
	count_ping++;
	var responsetime = getValue(result,'ax_responsetime');// No I18N
	var roundtriptime = getValue(result,'ax_rtt');// No I18N
	var min_roundtriptime = getValue(result,'ax_minrtt');// No I18N
	var max_roundtriptime = getValue(result,'ax_maxrtt');// No I18N
	var availability=getValue(result,'ax_availability');// No I18N
	var resolvedip=getValue(result,'ax_resolvedip');// No I18N
	var packetloss = getValue(result,'ax_packetloss');// No I18N
	var availabilityimage=imagesUrl + "down_icon.gif";// No I18N
	var locname = getValue(result,'ax_locname');// NO I18N
	var url = getValue(result,'ax_url'); // NO I18N
	locid=reqCountStr+""+locid+"";
	if(availability==1)
	{
		reason="Available";// No I18N
		availabilityimage='<img src="' + imagesUrl + 'up_icon.gif"/>';
	}
	else if(availability==0)
	{
		availabilityimage='<img src="' + imagesUrl + 'down_icon.gif"/>';
	}
	else
	{
		availabilityimage="&nbsp;-";// No I18N
	}
	if(responsetime==-1)
	{
		document.getElementById("resptime"+locid).innerHTML='-&nbsp;&nbsp;';// No I18N
	}
	else
	{
		var resptime=addCommas(responsetime);
		document.getElementById("resptime"+locid).innerHTML=resptime+"&nbsp;&nbsp;";// No I18N
	}
	var respElt=document.getElementById("resptime"+locid);
	respElt.removeAttribute("id");
	if(packetloss==-1)
	{
		document.getElementById("ploss"+locid).innerHTML='-&nbsp;&nbsp;';// No I18N
	}
	else
	{
		var resptime=addCommas(packetloss);
		document.getElementById("ploss"+locid).innerHTML=resptime+"&nbsp;&nbsp;";// No I18N
	}
	var plossElt=document.getElementById("ploss"+locid);
	plossElt.removeAttribute("id");
	if(roundtriptime==0)
	{
		document.getElementById("rtt"+locid).innerHTML='-&nbsp;&nbsp;';// No I18N
	}
	else
	{
		var resptime=addCommas(roundtriptime);
		document.getElementById("rtt"+locid).innerHTML=resptime;
	}
	var rttElt=document.getElementById("rtt"+locid);
	rttElt.removeAttribute("id");
	if(min_roundtriptime==0)
	{
		document.getElementById("minrtt"+locid).innerHTML='-&nbsp;&nbsp;';// No I18N
	}
	else
	{
		var resptime=addCommas(min_roundtriptime);
		document.getElementById("minrtt"+locid).innerHTML=resptime;
	}
	var minrttElt=document.getElementById("minrtt"+locid);
	minrttElt.removeAttribute("id");
	if(max_roundtriptime==0)
	{
		document.getElementById("maxrtt"+locid).innerHTML='-&nbsp;&nbsp;';// No I18N
	}
	else
	{
		var resptime=addCommas(max_roundtriptime);
		document.getElementById("maxrtt"+locid).innerHTML=resptime;
	}
	var maxrttElt=document.getElementById("maxrtt"+locid);
	maxrttElt.removeAttribute("id");

	var resipElt=document.getElementById("resolvedip"+locid)
	resipElt.innerHTML=resolvedip+"&nbsp;&nbsp";// No I18N
	resipElt.removeAttribute("id");
	var statusElt=document.getElementById("status"+locid)
	statusElt.innerHTML=availabilityimage;
	statusElt.removeAttribute("id");
	var locresElt=document.getElementById("locres"+locid)
	locresElt.innerHTML=locname;
	locresElt.removeAttribute("id");

	row_values = row_values.concat([locname,availabilityimage,resolvedip,packetloss,min_roundtriptime,max_roundtriptime,roundtriptime,responsetime]);
	if(count_ping==locationLength)
	{
		// Only update permalink.
		if(window.location.port.trim().length==0)
		{
			permalinkString=hs_var+window.location.hostname+"/public/t/results-"+timestamp+".html"; // No I18N
		}
		else {
			permalinkString=hs_var+window.location.hostname+":"+window.location.port+"/public/t/results-"+timestamp+".html"; // No I18N
		}
		globalPermaLink=permalinkString;
		globalToolType="PING";
		$('#permalink').val(permalinkString);
		if(!$('#shareresult').is(':visible'))
		{
			$('#shareresult').show();
		}
		showPingLoadingResult("PING",url);  //No I18N
		addFacebookLikeButton(permalinkString ,document.getElementById('fbLikeTd'));
		addTweetLikeButton(permalinkString,document.getElementById('tweetdiv'));
		addgplusLikeButton(permalinkString,document.getElementById("gplusdiv"));
	}
}


/* Ping in Tools Begins */
function doPingTest(frm,ranword)
{
	if(isDomainValid(frm.url.value)===false)
	{
		alert("Please enter a valid domain name.");
		frm.url.select();
		return;
	}
	requestId=requestCount;
	requestCount = requestCount + 1;
	if(document.getElementById('requestId')==null) {
		frm.appendChild(getnewFormElement("hidden","requestId",requestId));
		frm.appendChild(getnewFormElement("hidden","timestamp",timestamp));
	}
	doToolsTest(frm,ranword,'PING',requestId);// No I18N
}

function postPingOutputdetails(result,url,selectedLocations,requestId)
{
	url=trimUrl(url);
	setCookie("tools.site24x7.domain",url);
	showCommonResultPage(url);
	$('#id_result_graph_space').show();
	$('.grptext').show();
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	var pingResultParent=document.getElementById("id_ping_result");
	var graphSpaceDiv=document.getElementById("id_result_graph_space");
	var responseDiv=document.getElementById("id_response_div");
	var pingResult=document.createElement("DIV");
	pingResult.innerHTML=result;
	insertAfter(graphSpaceDiv,pingResult);
	$(pingResult).slideDown(800);
	for (var i=0; i<selectedLocations.length; i++)
	{
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "/tools/general/simpleTest.do");
		form.appendChild(getnewFormElement("hidden","method","doPingTest"));// No I18N
		form.appendChild(getnewFormElement("hidden","locid",selectedLocations[i].value));// No I18N
		form.appendChild(getnewFormElement("hidden","url",url));// No I18N
		form.appendChild(getnewFormElement("hidden","requestId",requestId));
		form.appendChild(getnewFormElement("hidden","timestamp",timestamp));
		document.body.appendChild(form);
		//console.log("postPingOutputDetails :: "+timestamp+" request Id "+requestId+" Location  "+selectedLocations[i].value);
		getHtmlForForm(form,"postPingResponse",selectedLocations[i].value,selectedLocations.length,requestId);
	}
}

function postPingResponse(result,locid,locationLength,requestId)
{
	count_ping++;
	if(result.match("locid")!=-1)
	{
		var responsetime = getValue(result,'ax_responsetime');// No I18N
		var roundtriptime = getValue(result,'ax_rtt');// No I18N
		var min_roundtriptime = getValue(result,'ax_minrtt');// No I18N
		var max_roundtriptime = getValue(result,'ax_maxrtt');// No I18N
		var availability=getValue(result,'ax_availability');// No I18N
		var resolvedip=getValue(result,'ax_resolvedip');// No I18N
		var packetloss = getValue(result,'ax_packetloss');// No I18N
		var availabilityimage=imagesUrl + "down_icon.gif";// No I18N
		var locname = getValue(result,'ax_locname');// NO I18N
		var url = getValue(result,'ax_url'); // NO I18N
		locid = requestId+""+locid;
		if(availability==1)
		{
			reason="Available";// No I18N
			availabilityimage='<img src="' + imagesUrl + 'up_icon.gif"/>';
		}
		else if(availability==0)
		{
			availabilityimage='<img src="' + imagesUrl + 'down_icon.gif"/>';
		}
		else
		{
			availabilityimage="&nbsp;-";// No I18N
		}
		if(responsetime==-1)
		{
			document.getElementById("resptime"+locid).innerHTML='-&nbsp;&nbsp;';// No I18N
		}
		else
		{
			var resptime=addCommas(responsetime);
			document.getElementById("resptime"+locid).innerHTML=resptime+"&nbsp;&nbsp;";// No I18N
		}
		if(packetloss==-1)
		{
			document.getElementById("ploss"+locid).innerHTML='-&nbsp;&nbsp;';// No I18N
		}
		else
		{
			var resptime=addCommas(packetloss);
			document.getElementById("ploss"+locid).innerHTML=resptime+"&nbsp;&nbsp;";// No I18N
		}
		if(roundtriptime==0)
		{
			document.getElementById("rtt"+locid).innerHTML='-&nbsp;&nbsp;';// No I18N
		}
		else
		{
			var resptime=addCommas(roundtriptime);
			document.getElementById("rtt"+locid).innerHTML=resptime;
		}
		if(min_roundtriptime==0)
		{
			document.getElementById("minrtt"+locid).innerHTML='-&nbsp;&nbsp;';// No I18N
		}
		else
		{
			var resptime=addCommas(min_roundtriptime);
			document.getElementById("minrtt"+locid).innerHTML=resptime;
		}
		if(max_roundtriptime==0)
		{
			document.getElementById("maxrtt"+locid).innerHTML='-&nbsp;&nbsp;';// No I18N
		}
		else
		{
			var resptime=addCommas(max_roundtriptime);
			document.getElementById("maxrtt"+locid).innerHTML=resptime;
		}
		document.getElementById("resolvedip"+locid).innerHTML=resolvedip+"&nbsp;&nbsp";// No I18N
		document.getElementById("status"+locid).innerHTML=availabilityimage;
		//console.log("Location Name : "+document.getElementById("locres"+locid).innerHTML);
		document.getElementById("locres"+locid).innerHTML=locname;
		row_values = row_values.concat([locname,availabilityimage,resolvedip,packetloss,min_roundtriptime,max_roundtriptime,roundtriptime,responsetime]);
		if(count_ping==locationLength)
		{
			// Only update permalink.
			if(window.location.port.trim().length==0)
			{
				permalinkString=hs_var+window.location.hostname+"/public/t/results-"+timestamp+".html"; // No I18N
			}
			else {
				permalinkString=hs_var+window.location.hostname+":"+window.location.port+"/public/t/results-"+timestamp+".html"; // No I18N
			}
			globalPermaLink=permalinkString;
			globalToolType="PING";
			$('#permalink').val(permalinkString);
			if(!$('#shareresult').is(':visible'))
			{
				$('#shareresult').show();
			}
			showPreviousHistory("PING",url);  //No I18N
			addFacebookLikeButton(permalinkString ,document.getElementById('fbLikeTd'));
			addTweetLikeButton(permalinkString,document.getElementById('tweetdiv'));
			addgplusLikeButton(permalinkString,document.getElementById("gplusdiv"));
		}
	}
}
/* Ping in Tools Ends */

function findIpAddress()
{
	var form=document.createElement("form");
	var url=$('input[class="websitename"]').val();
	if(url===undefined || url==='undefined')
	{
		url=$('input[class="hostnameonly"]').val();
	}
	url=trimUrl(url);
	form.setAttribute("name",'findip');
	form.setAttribute("action",'/tools/action.do');
	form.setAttribute("method",'post');
	form.appendChild(getnewFormElement("hidden","execute","checkAccessKeyword"));// No I18N
	form.appendChild(getnewFormElement("hidden","url",url));// No I18N
	form.appendChild(getnewFormElement("hidden","method","getDnsReports"));// No I18N
	form.appendChild(getnewFormElement("hidden","requestId",requestCount+1));// No I18N
	form.appendChild(getnewFormElement("hidden","timestamp",timestamp));// No I18N
	var hostNameElt=document.getElementById("hostName");
	var urlElt=document.getElementById("url");
	// alert("urlElt : "+urlElt.length+" type of "+typeof(urlElt));
	if(typeof(urlElt)=='undefined' || urlElt==null || urlElt.length==0)
	{

		urlElt=getnewFormElement("hidden","url",url);
		urlElt=document.forms[0].appendChild(urlElt);
		urlElt.setAttribute("id","url");
		// document.appendChild(urlElt);
		// alert("urlElt : "+urlElt);
	}
	if(hostNameElt==null) {
		hostNameElt=getnewFormElement("hidden","hostName",url);// No I18N
		var docFormElt=document.getElementsByTagName("form");
		form.appendChild(hostNameElt);
	}
	getToolsResponse(form,'FINDIP');
}

function getWebsiteLocation()
{
	// alert("getWebsiteLocation");
	var form=document.createElement("form");
	var url=$('input[class="websitename"]').val();
	if(url===undefined || url==='undefined')
	{
		url=$('input[class="hostnameonly"]').val();
	}
	form.setAttribute("name",'loc');
	form.setAttribute("action",'/tools/action.do');
	form.setAttribute("method","post");
	form.appendChild(getnewFormElement("hidden","execute","checkAccessKeyword"));// No I18N
	form.appendChild(getnewFormElement("hidden","url",url));// No I18N
	form.appendChild(getnewFormElement("hidden","isip","false"));// No I18N
	form.appendChild(getnewFormElement("hidden","method","getLocation"));// No I18N
	form.appendChild(getnewFormElement("hidden","requestId",requestCount+1));// No I18N
	form.appendChild(getnewFormElement("hidden","timestamp",timestamp));// No I18N
	var hostNameElt=document.getElementById("hostName");
	var urlElt=document.getElementById("url");
	// alert("urlElt : "+urlElt.length+" type of "+typeof(urlElt));
	if(typeof(urlElt)=='undefined' || urlElt==null || urlElt.length==0)
	{

		urlElt=getnewFormElement("hidden","url",url);
		urlElt=document.forms[0].appendChild(urlElt);
		urlElt.setAttribute("id","url");
		// document.appendChild(urlElt);
		// alert("urlElt : "+urlElt);
	}
	if(hostNameElt==null) {
		hostNameElt=getnewFormElement("hidden","hostName",url);// No I18N
		var docFormElt=document.getElementsByTagName("form");
		form.appendChild(hostNameElt);
	}
	getToolsResponse(form,"FINDLOCATION");
}

function checkHeartBleed()
{
	var form=document.createElement("form");
	var url=$('input[class="websitename"]').val();
	if(url===undefined || url==='undefined')
	{
		url=$('input[class="hostnameonly"]').val();
	}
	if (url.indexOf(http_var+"://")>=0)
	{
		url=url.replace("http","https"); // No I18N
	}
	else if(url.indexOf(https_var+"://")<0)
	{
		url = https_var+"://"+url; //No I18N
	}
	form.setAttribute("name",'loc');
	form.setAttribute("action",'/tools/action.do');
	form.setAttribute("method","post");
	form.appendChild(getnewFormElement("hidden","execute","checkAccessKeyword"));// No I18N
	form.appendChild(getnewFormElement("hidden","hostName",url));// No I18N
	form.appendChild(getnewFormElement("hidden","method","checkHeartbleed"));// No I18N
	form.appendChild(getnewFormElement("hidden","requestId",requestCount+1));// No I18N
	form.appendChild(getnewFormElement("hidden","timestamp",timestamp));// No I18N
	var hostNameElt=document.getElementById("hostName");
	var urlElt=document.getElementById("url");
	// alert("urlElt : "+urlElt.length+" type of "+typeof(urlElt));
	if(typeof(urlElt)=='undefined' || urlElt==null || urlElt.length==0)
	{

		urlElt=getnewFormElement("hidden","hostName",url); // No I18N
		urlElt=document.forms[0].appendChild(urlElt);
		urlElt.setAttribute("id","url"); // No I18N
		// document.appendChild(urlElt);
		// alert("urlElt : "+urlElt);
	}
	if(hostNameElt==null) {
		hostNameElt=getnewFormElement("hidden","hostName",url);// No I18N
		var docFormElt=document.getElementsByTagName("form");
		form.appendChild(hostNameElt);
	}
	getToolsResponse(form,"CHECKHB"); // No I18N
}

function getToolsResponse(frm,tooltype)
{
	var formInputElt,url;
	formInputElt=$('input[name="hostName"]');
	url=$('input[name="hostName"]').val();
	reqTs=new Date();
	if(typeof(url)=='undefined')
	{
		url=$('input[name="url"]').val();
		url=trimUrl(url);
		formInputElt=$('input[name="url"]');
	}
	if(url.indexOf(hp_var)>=0)
	{
		url=url.substring(7);
	}
	else if(url.indexOf(hs_var)>=0)
	{
		url=url.substring(8);
	}
	if(formInputElt.value=='')
	{
		alert("Please enter a valid domain name.");
		formInputElt.select();
		return;
	}
	if(isDomainValid(url)===false)
	{
		alert("Please enter a valid domain name.");
		formInputElt.select();
		return;
	}
	requestCount = requestCount + 1;
	getHtmlForForm(frm,"toolsAccessKeyWord",frm,tooltype,requestCount);  // No I18N
}

function addFindIpResultOutlinePage(url,requestId)
{
	var outlineElt=document.getElementById('findipResultContainer').children[0];
	outlineElt=outlineElt.cloneNode(true); // Make a deep clone copy.
	outlineElt.setAttribute('id','findipResults'+requestId);
	var titleElt=outlineElt.children[0].children[0];
	titleElt.innerHTML='Find IP Results: '+getDateString(true);
	var hdrElt=outlineElt.children[1];
	var resRowElt=outlineElt.children[2];
	hdrElt.setAttribute("id",'fpResultHdr'+requestId);
	resRowElt.setAttribute("id",'fpRowTemplate'+requestId);
	var graphSpaceDiv=document.getElementById("id_result_graph_space");
	insertAfter(graphSpaceDiv,outlineElt);
	outlineElt.style.display='block';
}

function addFindLocResultOutlinePage(url,requestId)
{
	var outlineElt=document.getElementById('findLocResultContainer').children[0];
	outlineElt=outlineElt.cloneNode(true); // Make a deep clone copy.
	outlineElt.setAttribute('id','findLocResults'+requestId);
	var titleElt=outlineElt.children[0].children[0];
	titleElt.innerHTML='Find Location Results: '+getDateString(true);
	var hdrElt=outlineElt.children[1];
	hdrElt.setAttribute("id",'fpResultHdr'+requestId);
	hdrElt.children[0].innerHTML="Location information : "+url;
	var ccElt=outlineElt.children[2];
	var cnElt=outlineElt.children[3];
	var rgElt=outlineElt.children[4];
	var cyElt=outlineElt.children[5];

	ccElt.setAttribute("id",'fpRowTempCC'+requestId);
	cnElt.setAttribute("id",'fpRowTempCN'+requestId);
	rgElt.setAttribute("id",'fpRowTempRG'+requestId);
	cyElt.setAttribute("id",'fpRowTempCY'+requestId);

	// setAttribute("id",'fpRowTemplate'+requestId);
	var graphSpaceDiv=document.getElementById("id_result_graph_space");
	insertAfter(graphSpaceDiv,outlineElt);
	outlineElt.style.display='block';
}

function addScanSSLResultOutlinePage(url,tooltype,requestId)
{
	var sslLoadingElt=document.getElementById("sslScanLoading");
	var sslLoadingClone=sslLoadingElt.cloneNode(true);
	sslLoadingClone.setAttribute("id","sslScanResults"+requestId);
	var pElt=sslLoadingClone.children[0].children[0];
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	pElt.innerHTML="Scanning SSL : "+url+" <img style='margin-left: 10px;' src='" + animImage + "'/>";
	sslLoadingClone.style.display='block';
	var graphSpaceDiv=document.getElementById("id_result_graph_space");
	insertAfter(graphSpaceDiv,sslLoadingClone);
}

function addCheckSSLResultOutlinePage(url,tooltype,requestId)
{
	var sslLoadingElt=document.getElementById("sslLoading");
	var sslLoadingClone=sslLoadingElt.cloneNode(true);
	sslLoadingClone.setAttribute("id","sslResults"+requestId);
	var pElt=sslLoadingClone.children[0].children[0];
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	pElt.innerHTML="Checking SSL Certificate : "+url+" <img style='margin-left: 10px;' src='" + animImage + "'/>";
	sslLoadingClone.style.display='block';
	var graphSpaceDiv=document.getElementById("id_result_graph_space");
	insertAfter(graphSpaceDiv,sslLoadingClone);
}

function addCheckHBResultOutlinePage(url,tooltype,requestId)
{
	var hbLoadingElt=document.getElementById("hbLoading");
	var hbLoadingClone=hbLoadingElt.cloneNode(true);
	hbLoadingClone.setAttribute("id","hbResults"+requestId); // No I18N
	var pElt=hbLoadingClone.children[0].children[0];
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date())); // No I18N
	pElt.innerHTML="<div>Checking for Heartbleed Vulnerability : "+url+" <img style='margin-left: 10px;' src='" + animImage + "'/></div>"; // No I18N
	hbLoadingClone.style.display='block'; // No I18N
	var graphSpaceDiv=document.getElementById("id_result_graph_space"); // No I18N
	insertAfter(graphSpaceDiv,hbLoadingClone);
}

function addCheckSSL3ResultOutlinePage(url,tooltype,requestId)
{
	var hbLoadingElt=document.getElementById("ssl3Loading");
	var hbLoadingClone=hbLoadingElt.cloneNode(true);
	hbLoadingClone.setAttribute("id","ssl3Results"+requestId); // No I18N
	var pElt=hbLoadingClone.children[0].children[0];
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date())); // No I18N
	pElt.innerHTML="Checking for SSLv3 Poodle Vulnerability : "+url+" <img style='margin-left: 10px;' src='" + animImage + "'/>"; // No I18N
	hbLoadingClone.style.display='block'; // No I18N
	var graphSpaceDiv=document.getElementById("id_result_graph_space"); // No I18N
	insertAfter(graphSpaceDiv,hbLoadingClone);
}

function addCheckGhostCatResultOutlinePage(url,tooltype,requestId)
{
	var hbLoadingElt=document.getElementById("ghostCatLoading");
	var hbLoadingClone=hbLoadingElt.cloneNode(true);
	hbLoadingClone.setAttribute("id","ghostCatResults"+requestId); // No I18N
	var pElt=hbLoadingClone.children[0].children[0];
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date())); // No I18N
	pElt.innerHTML="Checking for Ghostcat Vulnerability : "+url+" <img style='margin-left: 10px;' src='" + animImage + "'/>"; // No I18N
	hbLoadingClone.style.display='block'; // No I18N
	var graphSpaceDiv=document.getElementById("id_result_graph_space"); // No I18N
	insertAfter(graphSpaceDiv,hbLoadingClone);
}

function addTraceRouteResultPage(url,tooltype,requestId)
{
	if(document.getElementById("locationid")!=null)
	{
		var select = document.getElementById("locationid");
		var locationId = select.options[select.selectedIndex].value;
		document.getElementById('locationid').value = locationId;
	}
	hideGroupToolsOptions();
	var hostName=url;
	globalURL=url;
	var traceResultContainer=document.getElementById("traceResultContainer");
	var traceResultNode=traceResultContainer.cloneNode(true);
	traceResultNode.setAttribute("id","traceResultContainer"+requestId);
	pElt = traceResultNode.children[0].children[0].children[0];
	pElt.innerHTML="Generating traceroute results: "+getDateString(true);
	var hdrElt=traceResultNode.children[0].children[1].children[0];
	hdrElt.innerHTML='Generating traceroute results:  <img style="margin-left: 10px;" src="" + animImage + ""/>';
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	var dataElt=traceResultNode.children[0].children[2];
	dataElt.setAttribute("id","traceResult"+requestId);
	var graphSpaceDiv=document.getElementById("id_result_graph_space");
	insertAfter(graphSpaceDiv,traceResultNode);
	traceResultNode.style.display='block';
	// addFacebookLikeButton(,document.getElementById('fbLikeTd'));
	// addTweetLikeButton(,document.getElementById('tweetdiv'));
}

function addAllTraceRouteResultPage(url,tooltype,requestId,selectedLocations)
{
	if(document.getElementById("locationid")!=null)
	{
		var select = document.getElementById("locationid");
		var locationId = select.options[select.selectedIndex].value;
		document.getElementById('locationid').value = locationId;
	}
	hideGroupToolsOptions();
	var hostName=url;
	globalURL=url;
	var traceResultContainer=document.getElementById("traceResultContainer");
	var traceResultNode=traceResultContainer.cloneNode(true);
	traceResultNode.setAttribute("id","traceResultContainer"+requestId);
	pElt = traceResultNode.children[0].children[0].children[0];
	pElt.innerHTML="Generating traceroute results: "+getDateString(true);
	var hdrElt=traceResultNode.children[0].children[1].children[0];
	hdrElt.innerHTML='Generating traceroute results:  <img style="margin-left: 10px;" src="" + animImage + ""/>';
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	var dataElt=traceResultNode.children[0].children[2];
	dataElt.setAttribute("id","traceResult"+requestId);
	var graphSpaceDiv=document.getElementById("id_result_graph_space");
	insertAfter(graphSpaceDiv,traceResultNode);
	traceResultNode.style.display='block';
	// addFacebookLikeButton(,document.getElementById('fbLikeTd'));
	// addTweetLikeButton(,document.getElementById('tweetdiv'));
}

function hideGroupToolsOptions()
{
	$('#id_other_commands_top').hide();
	$('#id_other_commands_below').hide();
}

function addResultsToTopElement(newElement)
{
	var graphSpaceDiv=document.getElementById("id_result_graph_space");
	insertAfter(graphSpaceDiv,newElement);
}

function addServerHeaderResultPage(url,tooltype,requestId)
{
	hideGroupToolsOptions();
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date())); // No I18N
	var outlineElt=document.getElementById('findSHResultContainer').children[0];
	var spacerElt=document.createElement("div");
	spacerElt.setAttribute("class","spacer"); // No I18N
	outlineElt=outlineElt.cloneNode(true); // Make a deep clone copy.
	outlineElt.setAttribute('id','findLocResults'+requestId); // No I18N
	var titleElt=outlineElt.children[0];
	titleElt.innerHTML='<div style="margin-top:9px; margin-left: 15px;">Loading Server Header details for '+url+'  <img src="" + animImage + ""/></div>'; // No I18N
	var shDate=outlineElt.children[2];
	var shHdr=outlineElt.children[3];
	var shCL=outlineElt.children[4];
	var shLoc=outlineElt.children[5];
	var shKA=outlineElt.children[6];
	var shCT=outlineElt.children[7];
	var shCN=outlineElt.children[8];
	var shSvr=outlineElt.children[9];

	shDate.setAttribute("id",'shDate'+requestId); // No I18N
	shHdr.setAttribute("id",'shHdr'+requestId); // No I18N
	shCL.setAttribute("id",'shCL'+requestId); // No I18N
	shLoc.setAttribute("id",'shLoc'+requestId); // No I18N
	shKA.setAttribute("id",'shKA'+requestId); // No I18N
	shCT.setAttribute("id",'shCT'+requestId); // No I18N
	shCN.setAttribute("id",'shCN'+requestId); // No I18N
	shSvr.setAttribute("id",'shSvr'+requestId); // No I18N
	addResultsToTopElement(outlineElt);
	addResultsToTopElement(spacerElt);
	outlineElt.style.display='block'; // No I18N
}

function addRedirectionResultPage(url,tooltype,requestId)
{
	hideGroupToolsOptions();
	$('#id_loadtime').hide();
	$('#id_quicktest_div').height("90px");
	var outlineElt=document.getElementById('findRCResultContainer').children[0];
	var spacerElt=document.createElement("div");
	spacerElt.setAttribute("class","spacer"); // No I18N
	outlineElt=outlineElt.cloneNode(true); // Make a deep clone copy.
	outlineElt.setAttribute('id','findLocResults'+requestId); // No I18N
	var titleElt=outlineElt.children[0];
	titleElt.innerHTML='<div style="margin-top:9px; margin-left: 15px;">Checking redirection for '+url+'  <img src="" + animImage + ""/></div>'; // No I18N

	addResultsToTopElement(outlineElt);
	addResultsToTopElement(spacerElt);
	outlineElt.style.display='block'; // No I18N
	var wrap = document.createElement('div');
	wrap.appendChild(outlineElt.cloneNode(true));
	globalToolType=tooltype;
}

function addCleanCodeResultPage(url,tooltype,requestId)
{
	hideGroupToolsOptions();
	var ccRH=document.getElementById('cleanCodeResultContainer');
	ccRH=ccRH.children[0].cloneNode(true);
	ccRH.setAttribute("id","cleanCode"+requestId);
	addResultsToTopElement(ccRH);
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	$(ccRH).show();
}

function addLynxViewResultPage(url,tooltype,requestId)
{
	hideGroupToolsOptions();
	var lvRH=document.getElementById('lynxViewResultContainer');
	lvRH=lvRH.children[0].cloneNode(true);
	lvRH.setAttribute("id","lynxView"+requestId);
	addResultsToTopElement(lvRH);
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	$(lvRH).show();
}

function addWebSpeedResultPage(url,tooltype,requestId)
{
	hideGroupToolsOptions();
	var wsRH=document.getElementById('webSpeedResultContainer');
	wsRH=wsRH.children[0].cloneNode(true);
	wsRH.setAttribute("id","webSpeed"+requestId);
	addResultsToTopElement(wsRH);
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	$(wsRH).show();
}

function addBrandReputationResultPage(url,tooltype,requestId)
{
	hideGroupToolsOptions();
	var brandReputationH=document.getElementById('brandReputationResultContainer');
	brandReputationH=brandReputationH.children[0].cloneNode(true);
	brandReputationH.setAttribute("id","brandReputationResultContainer"+requestId);
	pElt = brandReputationH.children[0].children[0];
	pElt.innerHTML="Results as on: "+getDateString(true); //No I18N
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	addResultsToTopElement(brandReputationH);
	$(brandReputationH).show();
	showPreviousHistory('BRANDREPUTATION',url);  //No I18N
}

function addBrandReputationResults(result,tooltype,requestId)
{
	$('#brandReputationResultHdr').hide();
	if (result == '') {
		$('#brandReputationStatusIcon').attr('src', '/images/attention-icon.png');
		$('#brandReputationStatusIcon').attr('title', "Please try again later.");
		$('#brandReputationReason').html("Please try again later");
		$('#brandReputationReason').css('color', '#f5ae10');
		$('#brandReputationReason').css('vertical-align', 'middle');
		$('#brandReputationResultTable').hide();
		$('#brandReputationResult').show();
		$('#brandReputationResultStatus').show();
		return;
	}
	var data = result.split("#");
	var responseMap = {};
	if (data.length > 1) {
		data = data[1];
		var nvPairs = data.split('&');
		for (var i = 0; i < nvPairs.length; i++) {
			var nvPair = nvPairs[i].split('=');
			responseMap[nvPairs[i].substr(0,nvPairs[i].indexOf('='))] = nvPairs[i].substr(nvPairs[i].indexOf('=')+1);
		}
	}
	responseMap.ax_threatInfo = decodeURIComponent(responseMap.ax_threatInfo);
	responseMap.ax_Reason = decodeURIComponent(responseMap.ax_Reason);
	if (responseMap.ax_Status === 'FAILED') {
		$('#brandReputationStatusIcon').attr('src', '/images/attention-icon.png');
		$('#brandReputationStatusIcon').attr('title', responseMap.ax_Reason);
		$('#brandReputationReason').html(responseMap.ax_Reason);
		$('#brandReputationReason').css('font-weight', 'bold');
		$('#brandReputationReason').css('color', '#f5ae10');
		$('#brandReputationReason').css('vertical-align', 'middle');
		$('#brandReputationResultTable').hide();
		$('#brandReputationResult').show();
		$('#brandReputationResultStatus').show();
		return;
	}

	threatTypes = [
		{ name: "Malware", type: "MALWARE" }, //No I18N
		{ name: "Phishing and Deceptive", type: "SOCIAL_ENGINEERING" }, //No I18N
		{ name: "Unwanted Software", type: "UNWANTED_SOFTWARE" } //No I18N
	];

	platformTypes = [
		{ name: "Windows", type: "WINDOWS", icon: "icon-windows3"}, //No I18N
		{ name: "Linux", type: "LINUX", icon: "icon-linux"}, //No I18N
		{ name: "Android", type: "ANDROID", icon: "icon-android"}, //No I18N
		{ name: "macOS", type: "OSX", icon: "icon-apple"}, //No I18N
		{ name: "iOS", type: "IOS", icon: "icon-apple"}, //No I18N
		{ name: "Chrome", type: "CHROME", icon: "icon-chrome" } //No I18N
	];

	var row = '';

	//new code logic starts

	var resultTable = document.getElementById('brandReputationResultTable');
	var urls = responseMap.ax_threatInfo.split("_sep_");
	for (var i = 0; i<urls.length; i++) {
		var url = urls[i].split("_tmpsep_");
		var tr = resultTable.insertRow(resultTable.rows.length);
		tr.setAttribute('style', 'height: 38px;');
		var td = tr.insertCell(0);
		td.setAttribute('style', 'padding: 10px;');
		td.innerHTML = url[0];
		for (var threatIndex = 0; threatIndex<threatTypes.length; threatIndex++) {
//            for (var platformIndex = 0; platformIndex < platformTypes.length; platformIndex++) {
			var td = tr.insertCell(resultTable.rows[i+1].cells.length);
//                if (platformIndex ==0) {
//                    td.setAttribute('style', 'border-left: 1px solid #d4d4d4;');
//                }
			var span = document.createElement('span');
			span.setAttribute('name', (i+2)+'_'+threatTypes[threatIndex].type);
			span.style = 'opacity: 0.7; margin-left: 41.66666667%;';
			span.setAttribute('class', 'brand-icons-status  icon-stts-up');
			if (url[1] != undefined && url[1].includes(threatTypes[threatIndex].type)) {
				span.title = url[0]+" - Suspect to be "+threatTypes[threatIndex].name;
				span.setAttribute('class', 'brand-icons-status icon-stts-down');
				span.removeAttribute('style');
				span.style = 'margin-left: 41.66666667%;';
			}
			td.appendChild(span);
//            }
		}
	}

	var rows, switching, i, x, y, move;
	needToIterate = true;
	while (needToIterate) {
		needToIterate = false;
		rows = resultTable.rows;
		for (i = 2; i < rows.length; i++) {
			move = false;
			var threatCountOfI = 0;
			var threatCountOfJ = 0;
			var tempDOMObjects = rows[i].querySelectorAll( "span[name$='_MALWARE'][class$='icon-stts-down']" );
			if (tempDOMObjects != null) {
				threatCountOfI += tempDOMObjects.length;
			}
			tempDOMObjects = rows[i].querySelectorAll( "span[name$='_SOCIAL_ENGINEERING'][class$='icon-stts-down']" );
			if (tempDOMObjects != null) {
				threatCountOfI += tempDOMObjects.length;
			}
			tempDOMObjects = rows[i].querySelectorAll( "span[name$='_UNWANTED_SOFTWARE'][class$='icon-stts-down']" );
			if (tempDOMObjects != null) {
				threatCountOfI += tempDOMObjects.length;
			}

			if ((i+1) < rows.length) {
				tempDOMObjects = rows[i+1].querySelectorAll( "span[name$='_MALWARE'][class$='icon-stts-down']" );
				if (tempDOMObjects != null) {
					threatCountOfJ += tempDOMObjects.length;
				}
				tempDOMObjects = rows[i+1].querySelectorAll( "span[name$='_SOCIAL_ENGINEERING'][class$='icon-stts-down']" );
				if (tempDOMObjects != null) {
					threatCountOfJ += tempDOMObjects.length;
				}
				tempDOMObjects = rows[i+1].querySelectorAll( "span[name$='_UNWANTED_SOFTWARE'][class$='icon-stts-down']" );
				if (tempDOMObjects != null) {
					threatCountOfJ += tempDOMObjects.length;
				}
			}
			if (threatCountOfI < threatCountOfJ) {
				move = true;
				break;
			}
		}
		if (move) {
			rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
			needToIterate = true;
		}
	}

	var tr = resultTable.insertRow(resultTable.rows.length);
	tr.setAttribute('style', 'height: 38px;');
	var td = tr.insertCell(0);
	td.setAttribute('style', 'background: #FFFFFF;');
	td.setAttribute('colspan', '19');
	var span = document.createElement('span');
	span.innerHTML = googleAdvisory;
	span.setAttribute('style', 'float: right; margin: 10px;');
	td.appendChild(span);

	//new code logic end


	$('#brandReputationResult').append(row);

	$('#brandReputationResult').show();
	var permalink=responseMap.ax_permalink; //No I18N
	globalPermaLink=permalink;
	$('#permalink').val(permalink);
	$('#shareresult').show();
	addFacebookLikeButton(permalink ,document.getElementById('fbLikeTd'));
	addTweetLikeButton(permalink,document.getElementById('tweetdiv'));
	addgplusLikeButton(permalink,document.getElementById("gplusdiv"));
}

function addTextRatioResultPage(url,tooltype,requestId)
{
	hideGroupToolsOptions();
	var trRH=document.getElementById('textRatioResultContainer');
	trRH=trRH.children[0].cloneNode(true);
	trRH.setAttribute("id","textRatio"+requestId);
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	addResultsToTopElement(trRH);
	$(trRH).show();
}


function addBlacklistCheckResultOutlinePage(url,tooltype,requestId)
{
	var rblLoadingElt=document.getElementById("rblLoading");
	var rblLoadingClone=rblLoadingElt.cloneNode(true);
	rblLoadingClone.setAttribute("id","blacklistCheckResults"+requestId);
	var pElt=rblLoadingClone.children[0].children[0];
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	pElt.innerHTML="Checking blacklists : "+url+" <img style='margin-left: 10px;' src='" + animImage + "'/>";
	rblLoadingClone.style.display='block';
	var graphSpaceDiv=document.getElementById("id_result_graph_space");
	insertAfter(graphSpaceDiv,rblLoadingClone);
	showPreviousHistory('BLACKLISTCHECK',url);  //No I18N
}

function addBlacklistCheckResults(result,tooltype,requestId)
{
	var data=getUrlValue(result,"axUrl_Toolsresponse");//NO I18N
	var domainName=getUrlValue(result,"axUrl_Url");//NO I18N
	var domainDetails="";
	var rblResults="";
	var rblResultsElt=document.getElementById("blacklistCheckResults"+requestId);
	$(rblResultsElt.children[0]).hide();
	var outlineElt=document.getElementById('blacklistCheckResultContainer');
	outlineElt=outlineElt.children[0].cloneNode(true);
	outlineElt.setAttribute("id","blacklistCheckResults"+requestId);
	outlineElt.children[0].style.display='block';
	titleElt = outlineElt.children[0].children[0].children[0];
	titleElt.innerHTML="Results as on: "+getDateString(true); //No I18N
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	addResultsToTopElement(outlineElt);
	$(outlineElt).show();
	if(typeof(result)==='undefined' || result===null || result.length===0){
		$('#rblErrorStatus').show();
		$('#rblResultHdr').hide();
		$('#rblDomainResultHdr').hide();
		$('#rblDomainResults').hide();
		$('#rblIpResultHdr').hide();
		$('#rblIpResults').hide();
		return;
	}
	if (data.length > 0) {
		rblResults = data.split('#:#');
		for (var i = 0; i < rblResults.length; i++) {
			var isDomainExists = rblResults[i].split('||')[0]==('-');
			if(isDomainExists){
				domainDetails=rblResults[i];
				rblResults.splice(i, 1);
				break;
			}
		}
	}
	ip_blacklists = [ {domain:"sip.invaluement.zoho1.com",name:"InvaluementSIP"},//NO I18N
		{domain:"sip24.invaluement.zoho1.com",name:"InvaluementSIP/24"},//NO I18N
		{domain:"dnsbl.sorbs.net",name:"SORBS"},//NO I18N
		{domain:"http.dnsbl.sorbs.net",name:"SORBS HTTP"},//NO I18N
		{domain:"misc.dnsbl.sorbs.net",name:"SORBS MISC"},//NO I18N
		{domain:"smtp.dnsbl.sorbs.net",name:"SORBS SMTP"},//NO I18N
		{domain:"socks.dnsbl.sorbs.net",name:"SORBS SOCKS"},//NO I18N
		{domain:"virus.dnsbl.sorbs.net",name:"SORBS VIRUS"},//NO I18N
		{domain:"web.dnsbl.sorbs.net",name:"SORBS WEB"},//NO I18N
		{domain:"zombie.dnsbl.sorbs.net",name:"SORBS ZOMBIE"},//NO I18N
		{domain:"dnsbl-1.uceprotect.net",name:"UCEPROTECT Level 1"},//NO I18N
		{domain:"dnsbl-2.uceprotect.net",name:"UCEPROTECT Level 2"},//NO I18N
		{domain:"dnsbl-3.uceprotect.net",name:"UCEPROTECT Level 3"},//NO I18N
		{domain:"ips.backscatterer.org",name:"BACKSCATTERER"},//NO I18N
		{domain:"blocklistde.zoho3.com",name:"BLOCKLIST.DE"},//NO I18N
		{domain:"psbl.zoho3.com",name:"Passive Spam Block List"},//NO I18N
		{domain:"lashbackbl.zoho3.com",name:"Lashback Unsubscribe Blacklist (UBL)"},//NO I18N
		{domain:"nordspamipbl.zoho3.com",name:"Nordspam BL"},//NO I18N
		{domain:"talosintel.zoho3.com",name:"Talos Security Intelligence Blacklist"}//NO I18N
	];
	domain_blacklists =[
		{domain:"multi.surbl.org",name:"SURBL"},//NO I18N
		{domain:"uri.invaluement.zoho1.com",name:"InvaluementURI"},//NO I18N
		{domain:"nordspamdmnbl.zoho3.com",name:"Nordspam DBL"}//NO I18N
	];
	surbl_categories=["phish","malware","abuse","cracked"];//NO I18N
	domain_bl_with_category="multi.surbl.org";//NO I18N

	if(isDomainExists){
		var rblDomainResults = document.getElementById('rblDomainResults');
		for(var i=0;i<domain_blacklists.length;i++){
			var tr = rblDomainResults.insertRow(rblDomainResults.rows.length);
			var td = tr.insertCell(0);
			td.setAttribute('style','text-align:left;padding-left:5px;vertical-align:middle;height:25px');
			td.setAttribute('class','rblfont');
			td.innerHTML=domain_blacklists[i].name;
			var domainDetailsArr=domainDetails.split('||');
			var availablity=domainDetailsArr[1];
			var reason=domainDetailsArr[2];
			var blDetails=JSON.parse(domainDetailsArr[3]!="-"?domainDetailsArr[3]:"{}");
			var tdStatus = tr.insertCell(1);
			tdStatus.setAttribute('class','rblfont');
			var img = document.createElement("img");
			img.setAttribute('style','vertical-align:middle');
			img.setAttribute('height','20');
			if(blDetails[domain_blacklists[i].domain]!=undefined){
				img.setAttribute('src', imagesUrl + 'ssl-expired.svg');
			}else{
				img.setAttribute('src', imagesUrl + 'ssl-trusted.svg');
			}tdStatus.appendChild(img);
			for(var j=0;j<surbl_categories.length;j++){
				if(domain_bl_with_category.includes(domain_blacklists[i].domain)){
					var td = tr.insertCell(j+2);
					td.setAttribute('class','rblfont');
					var img = document.createElement("img");
					img.setAttribute('style','vertical-align:middle');
					img.setAttribute('height','20');
					if(blDetails[domain_blacklists[i].domain]!=undefined&&blDetails[domain_blacklists[i].domain].includes(surbl_categories[j])){
						img.setAttribute('src',imagesUrl + 'ssl-expired.svg');
					}else{
						img.setAttribute('src',imagesUrl + 'ssl-trusted.svg');
					}td.appendChild(img);
				}else{
					var td = tr.insertCell(j+2);
					td.setAttribute('class','rblfont');
					td.innerHTML="-";
				}
			}
		}
	}else{
		$('#rblDomainResults').hide();
		$('#rblDomainResultHdr').hide();
	}
	if(rblResults.length>0){
		var blStatusTable = document.getElementById('rblIpResultsTable');
		var ipaddressRowHdr=document.getElementById('ipaddressRowHdr');
		var ipaddressRowHdrText=ipaddressRowHdr.innerHTML;
		if(isDomainExists){
			ipaddressRowHdr.innerHTML=ipaddressRowHdrText+"es of "+domainName;//NO I18N
		}
		ipaddressRowHdr.setAttribute('colspan',rblResults.length);
		var tr = blStatusTable.insertRow(blStatusTable.rows.length);
		for(var i=0;i<rblResults.length;i++){
			var td = tr.insertCell(i);
			td.setAttribute('style','vertical-align:middle;height:25px;padding-right:10px;padding-left:10px');
			if(i<(rblResults.length-1)){//not last cell
				td.setAttribute('class','rblfont border-right-bottom');
			}else{
				td.setAttribute('class','rblfont downborder');
			}td.innerHTML=rblResults[i].split('||')[0];
		}
		for(var i=0;i<ip_blacklists.length;i++){
			var tr = blStatusTable.insertRow(blStatusTable.rows.length);
			var td = tr.insertCell(0);
			td.setAttribute('style', 'vertical-align:middle;text-align:left;white-space: nowrap;height:20px;padding-left:5px;position:sticky;left:0;border-right: solid 1px #d4d4d4;');
			td.setAttribute('class','rblfont');
			td.innerHTML=ip_blacklists[i].name;
			for(var j=0;j<rblResults.length;j++){
				var td = tr.insertCell(j+1);
				td.setAttribute('class','rblfont');
				var img = document.createElement("img");
				img.setAttribute('style','vertical-align:middle');
				img.setAttribute('height','20');
				if (rblResults[j].substring(rblResults[j].lastIndexOf("||")).includes(ip_blacklists[i].domain)) {
					img.setAttribute('src',imagesUrl + 'ssl-expired.svg');
				}else{
					img.setAttribute('src',imagesUrl + 'ssl-trusted.svg');
				}td.appendChild(img);
			}
		}
	}else{
		$('#rblIpResultHdr').hide();
		$('#rblIpResults').hide();
	}
	var permalink=getUrlValue(result,"axUrl_permalink");//NO I18N
	globalPermaLink=permalink;
	$('#permalink').val(permalink);
	$('#shareresult').show();
	addFacebookLikeButton(permalink ,document.getElementById('fbLikeTd'));
	addTweetLikeButton(permalink,document.getElementById('tweetdiv'));
	addgplusLikeButton(permalink,document.getElementById("gplusdiv"));
}

function addToolsOutlineResultPage(url,tooltype,requestId,selectedLocations)
{
	if(tooltype=="FINDIP")
	{
		addFindIpResultOutlinePage(url,requestId);
	}
	else if(tooltype=="FINDLOCATION")
	{
		addFindLocResultOutlinePage(url,requestId);
	}
	else if(tooltype=="SCAN_SSL")
	{
		addScanSSLResultOutlinePage(url,tooltype,requestId);
	}
	else if(tooltype=="CHECKSSL")
	{
		addCheckSSLResultOutlinePage(url,tooltype,requestId);
	}
	else if(tooltype==="CHECKHB")
	{
		addCheckHBResultOutlinePage(url,tooltype,requestId);
	}
	else if(tooltype==="CHECKSSL3")
	{
		addCheckSSL3ResultOutlinePage(url,tooltype,requestId);
	}
	else if(tooltype==="CHECK_GHOSTCAT_VULNERABILITY"){
		addCheckGhostCatResultOutlinePage(url,tooltype,requestId);
	}
	else if(tooltype=="TRACEROUTE")
	{
		addTraceRouteResultPage(url,tooltype,requestId);
	}
	else if(tooltype=="TRACEROUTEALL")
	{
		addAllTraceRouteResultPage(url,tooltype,requestId,selectedLocations);
	}
	else if(tooltype=='SERVERHEADER')
	{
		addServerHeaderResultPage(url,tooltype,requestId);
	}
	else if(tooltype=='REDIRECTIONCHECKER')
	{
		addRedirectionResultPage(url,tooltype,requestId);
	}
	else if(tooltype=='CLEANCODE')
	{
		addCleanCodeResultPage(url,tooltype,requestId);
	}
	else if(tooltype=='LYNXVIEW')
	{
		addLynxViewResultPage(url,tooltype,requestId);
	}
	else if(tooltype=='BRANDREPUTATION')
	{
		addBrandReputationResultPage(url,tooltype,requestId);
	}
	else if(tooltype=='WEBSPEED')
	{
		addWebSpeedResultPage(url,tooltype,requestId);
	}
	else if(tooltype=='TEXTRATIO')
	{
		addTextRatioResultPage(url,tooltype,requestId);
	}
	else if(tooltype=='BLACKLISTCHECK'){
		addBlacklistCheckResultOutlinePage(url,tooltype,requestId);
	}
}

function addAllTraceRouteResponse(result,locationId,requestId,tooltype)
{
	var urlStatus=getUrlValue(result,"axUrl_Status");  //No I18N
	var traceResultNode=document.getElementById("traceResultContainer2");//+requestId);
	var container = traceResultNode.children[0];
	//var containerclone = container.cloneNode(true);
	var traceResultHeader=container.children[1];
	/*if(requestId === 2)
    {
    	$(traceResultHeader).hide();
    }*/
	//if(requestId === 2)
	{
		if(urlStatus==='FAILED')
		{
			var urlDomain=getUrlValue(result,"axUrl_Domain");  //No I18N
			var errorString=getUrlValue(result,"axUrl_Reason"); //No I18N
			var hdrString='<table align="center" class="logintableborder" style="border-bottom:none;" width="100%" cellpadding="0" cellspacing="0"><tbody><tr style="height: 37px;"><td class="columnheading" style="font-size: 15px;">TRACEROUTE_HEADER</td></tr><tr></tr></tbody></table>';
			hdrString = hdrString.replace(/TRACEROUTE_HEADER/g,errorString);
			var headerClone = traceResultHeader.cloneNode(true);
			headerClone.innerHTML=hdrString;
			$(headerClone).attr('id', $(traceResultHeader).attr('id')+requestId);
			//headerClone.setAttribute("id", $(this).attr('id',traceResultHeader.id+requestId);
			container.appendChild(headerClone);
			//$(headerClone).show();
			//container.appendChild(traceResultHeader);
			//traceResultNode.innerHTML+=hdrString;
			//addTraceRouteFailedResult(result,tooltype,requestId);
		}
		else
		{
			var outputStr=getUrlValue(result,"axUrl_traceRouteOutput");
			var colHdr=getUrlValue(result,"axUrl_Columnvalues");
			var tableDetails=getUrlValue(result,"axUrl_Tabledetails");
			var permalink=getUrlValue(result,"axUrl_permalink");
			globalPermaLink=permalink;
			var splited_col = colHdr.split("#:#");
			var tableSplit=tableDetails.split("#:#");
			var websiteName=tableSplit[2].toString();
			//$(traceResultHeader).hide();
			var dataElt=container.children[2].cloneNode(true); // traceResult
			var styleStr=dataElt.style;
			styleStr = styleStr + '; overflow-y: scroll;';
			var hdrString='<table align="center" class="logintableborder" style="border-bottom:none;" width="100%" cellpadding="0" cellspacing="0"><tbody><tr><td class="columnheading">TRACEROUTE_HEADER</td></tr><tr></tr></tbody></table><table class="logintableborder" width="100%" align="center" cellpadding="0" cellspacing="0"><tbody>RESULT_CONTENT</tbody></table>';
			hdrString = hdrString.replace(/TRACEROUTE_HEADER/g,splited_col[0]);
			hdrString = hdrString.replace(/RESULT_CONTENT/g,outputStr);
			dataElt.innerHTML=hdrString;
			dataElt.style.display='block';
			container.appendChild(dataElt);
		}
	}
	dcFinishedLocCount++;
	//$(traceResultHeader).hide();
	//console.log("dcFinishedLocCount :: "+dcFinishedLocCount+" :: locCount :: "+locCount);
	if(dcFinishedLocCount == locCount)
	{
		//console.log("hiding the header");
		$(traceResultHeader).hide();
	}
	/*else
	{
		if(urlStatus==='FAILED')
		{
			var urlDomain=getUrlValue(result,"axUrl_Domain");  //No I18N
			var errorString=getUrlValue(result,"axUrl_Reason")+" "+urlDomain+" from location "+locationId; //No I18N
			var traceResultHeader=document.getElementById("traceResultHdr");
			var hdrString='<table align="center" class="logintableborder" style="border-bottom:none;" width="100%" cellpadding="0" cellspacing="0"><tbody><tr style="height: 37px;"><td class="columnheading" style="font-size: 15px;">TRACEROUTE_HEADER</td></tr><tr></tr></tbody></table>';
			hdrString = hdrString.replace(/TRACEROUTE_HEADER/g,errorString);
			traceResultHeader.innerHTML=hdrString;
		    //traceResultNode.innerHTML+=hdrString;
			//addTraceRouteFailedResult(result,tooltype,requestId);
		}
		else
		{
			var outputStr=getUrlValue(result,"axUrl_traceRouteOutput");
		    var colHdr=getUrlValue(result,"axUrl_Columnvalues");
		    var tableDetails=getUrlValue(result,"axUrl_Tabledetails");
		    var permalink=getUrlValue(result,"axUrl_permalink");
		    globalPermaLink=permalink;
		    var splited_col = colHdr.split("#:#");
		    var tableSplit=tableDetails.split("#:#");
		    var websiteName=tableSplit[2].toString();
		    $(traceResultHeader).hide();
		    var dataElt=container.children[2]; // traceResult
		    var styleStr=dataElt.style;
		    styleStr = styleStr + '; overflow-y: scroll;';
		    var hdrString='<table align="center" class="logintableborder" style="border-bottom:none;" width="100%" cellpadding="0" cellspacing="0"><tbody><tr><td class="columnheading">TRACEROUTE_HEADER</td></tr><tr></tr></tbody></table><table class="logintableborder" width="100%" align="center" cellpadding="0" cellspacing="0"><tbody>RESULT_CONTENT</tbody></table>';
		    hdrString = hdrString.replace(/TRACEROUTE_HEADER/g,splited_col[0]);
		    hdrString = hdrString.replace(/RESULT_CONTENT/g,outputStr);
		    dataElt.innerHTML=hdrString;
		    dataElt.style.display='block';
		}
	}*/


	//clone.setAttribute("id", container.id+requestId);

	//$('#permalink').val(permalink);
	//$('#shareresult').show();
	//showPreviousHistory("TRACEROUTE",websiteName);  //No I18N
	//addFacebookLikeButton(permalink ,document.getElementById('fbLikeTd'));
	//addTweetLikeButton(permalink,document.getElementById('tweetdiv'));
	//addgplusLikeButton(permalink,document.getElementById("gplusdiv"));
}

function addAllTraceRouteResults(url,selectedLocations,requestId,tooltype)
{
	var requestId = 2;
	locCount = selectedLocations.length;
	for (var i=0; i<selectedLocations.length; i++)
	{
		/*if(requestId == 2)
	    {
	    	addWebsiteComparisonLocationLoadingRow(selectedLocations[i].value,requestId);
	    }*/
		var locid = selectedLocations[i].value;
		var form=document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("name","traceroute");
		form.setAttribute("action", "/tools/action.do");
		form.appendChild(getnewFormElement("hidden","execute","generateTraceRouteAll")); // No I18N
		form.appendChild(getnewFormElement("hidden","locid",locid)); // No I18N
		form.appendChild(getnewFormElement("hidden","url",url)); // No I18N
		form.appendChild(getnewFormElement("hidden","timestamp",timestamp)); // No I18N
		form.appendChild(getnewFormElement("hidden","requestId",requestId)); // No I18N
		document.body.appendChild(form);
		getHtmlForForm(form,"addAllTraceRouteResponse",selectedLocations[i].value,requestId,tooltype);
		requestId++;
	}
	//alert("hide now");
	var traceResultNode=document.getElementById("traceResultContainer2");//+requestId);
	var container = traceResultNode.children[0];
	//var containerclone = container.cloneNode(true);
	var traceResultHeader=container.children[1];
	//$(traceResultHeader).hide();
}

function toolsAccessKeyWord(result,frm,tooltype,requestId)
{
	var url;
	frm.execute.value=frm.method.value;  // No I18N
	url=$('input[name="hostName"]').val();
	if(typeof(url)=='undefined')
	{
		url=$('input[name="url"]').val();
	}
	url=trimUrl(url);
	if(url.indexOf(hp_var)>=0)
	{
		url=url.substring(7);
	}
	else if(url.indexOf(hs_var)>=0)
	{
		url=url.substring(8);
	}
	if(document.getElementById("location")!=null && tooltype!='TRACEROUTE' && tooltype!='TRACEROUTEALL')
	{
		var select = document.getElementById("location");
		var locationId = select.options[select.selectedIndex].value;
		document.getElementById('locationid').value = locationId;
	}
	if(tooltype=='TRACEROUTE')
	{
		var locationid=document.getElementById('locationid').value;
		frm.appendChild(getnewFormElement("hidden","locid",locationid));// No I18N
	}
	if(document.getElementsByName("locations")!=null && tooltype=='TRACEROUTEALL')
	{
		var selectedLocations=new Array();
		var locations=document.getElementsByName("locations");
		var defloc=document.getElementsByName("defloc");
		var locationIdArray=new Array();
		var count=0;

		for (var j=0; j < locations.length; j++)
		{
			if (locations[j].checked)
			{
				if(selectedLocations.indexOf(locations[j].value)==-1)
				{
					// alert("Adding SelectedLocations :: "+locations[j].value);
					selectedLocations[count]=locations[j];
					locationIdArray[count]=locations[j].value;
					count++;
				}
			}
		}
		if(count==0)
		{
			alert(beanmsg.input_location);
			return false;
		}
		//document.getElementById('location').value=locationIdArray;
	}
	document.getElementById('url').value = url;
	showCommonResultPage(url);
	if(typeof toolsV2 === "undefined") {
		addToolsOutlineResultPage(url,tooltype,requestId,selectedLocations);
	} else if (toolsV2) {
		$('#pg-container').show();
	}
	requestIdFound=-1;
	for(var i=0;i<frm.elements.length;i++)
	{
		var elt=frm.elements[i];
		if(elt.name=="requestId")
		{
			elt.value=requestId;
			requestIdFound=1;
		}
	}
	if(requestIdFound=-1 && (tooltype=='FINDIP' || tooltype=='FINDLOCATION' || tooltype=='TRACEROUTE' || tooltype=='TRACEROUTEALL' || tooltype=='BRANDREPUTATION'))
	{
		if(document.getElementById('requestId')==null) {
			frm.appendChild(getnewFormElement("hidden","requestId",requestId));// No I18N
		}
	}
	if(tooltype==='SCAN_SSL' || tooltype==='CHECKSSL' || tooltype==='CHECK_GHOSTCAT_VULNERABILITY' || tooltype==='CHECKHB' || tooltype==='CHECKSSL3')
	{
		if(document.getElementById('requestId')==null) {
			frm.appendChild(getnewFormElement("hidden","requestId",requestId));// No I18N
		}
	}
	if(tooltype=='TRACEROUTEALL')
	{
		addAllTraceRouteResults(url,selectedLocations,requestId,tooltype); // No I18N
	}
	else
	{
		getHtmlForForm(frm,"toolsResponse",tooltype,requestId);// No I18N
	}

}

function addFindIpRowResult(requestId,count,url,ipAddress)
{
	// alert("Count : "+count+" URL : "+url+" IP Address : "+ipAddress);
	setCookie("tools.site24x7.domain",url);
	$('.grptext').show();
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	var rowTempl=document.getElementById("fpRowTemplate"+requestId);
	var ipAddressArray=ipAddress.split("#:#");
	//console.log("IpAddress Array : "+ipAddressArray+" "+ipAddressArray.length);
	if(ipAddress==null || ipAddress.trim().length==0 || ipAddressArray==null || ipAddressArray==undefined || ipAddressArray.length==0)
	{
		var actualRow=rowTempl.cloneNode(true);
		actualRow.removeAttribute("id");
		actualRow.children[0].innerHTML="1"; // No I18N
		actualRow.children[1].innerHTML=url;
		actualRow.children[2].style.width="500px";
		actualRow.children[2].innerHTML='Error determining IP Addresses for '+url; // No I18N
		var parentElt=document.getElementById('findipResults'+requestId);
		var height=parentElt.style.height;
		//console.log("Height : "+height);
		height = height + 24;
		parentElt.setAttribute('style','width:1000px;display:block; height: auto;');
		insertAfter(rowTempl,actualRow);
		actualRow.style.display='block';
	}
	else
	{
		for(i=0;i<ipAddressArray.length;i++)
		{
			var actualRow=rowTempl.cloneNode(true);
			actualRow.removeAttribute("id");
			actualRow.children[0].innerHTML=ipAddressArray.length-i;
			actualRow.children[1].innerHTML=url;
			actualRow.children[2].innerHTML=ipAddressArray[i];
			var parentElt=document.getElementById('findipResults'+requestId);
			var height=parentElt.style.height;
			height = height + 24;
			parentElt.setAttribute('style','width:1000px;display:block; height: auto;');
			insertAfter(rowTempl,actualRow);
			actualRow.style.display='block';
		}
	}
}

function addFindLocRowResult(requestId,count,url,splited_row)
{
	$('.grptext').show();
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	var rowTempl=document.getElementById("findLocResults"+requestId);
	var ccElt=rowTempl.children[2];
	var cnElt=rowTempl.children[3];
	var rgElt=rowTempl.children[4];
	var cyElt=rowTempl.children[5];
	if(splited_row=="")
	{
		$("#fpResultHdr"+requestId).html("Location Information : Error while trying to retrieve location details");  // No I18N
		ccElt.children[1].innerHTML="-"; // No I18N
		cnElt.children[1].innerHTML="-"; // No I18N
		rgElt.children[1].innerHTML="-"; // No I18N
		cyElt.children[1].innerHTML="-"; // No I18N
		return;
	}
	else
	{
		setCookie("tools.site24x7.domain",url);
		ccElt.children[1].innerHTML=splited_row[1];
		cnElt.children[1].innerHTML=splited_row[3];
		rgElt.children[1].innerHTML=splited_row[5];
		cyElt.children[1].innerHTML=splited_row[7];
	}
}

function addTraceRouteFailedResult(result,tooltype,requestId)
{
	var errorString=getUrlValue(result,"axUrl_Reason"); //No I18N
	var urlDomain=getUrlValue(result,"axUrl_Domain");  //No I18N
	var traceResultHeader=document.getElementById("traceResultHdr");
	var hdrString='<table align="center" class="logintableborder" style="border-bottom:none;" width="100%" cellpadding="0" cellspacing="0"><tbody><tr style="height: 37px;"><td class="columnheading" style="font-size: 15px;">TRACEROUTE_HEADER</td></tr><tr></tr></tbody></table>';
	hdrString = hdrString.replace(/TRACEROUTE_HEADER/g,errorString);
	traceResultHeader.innerHTML=hdrString;
	return;
}

function addTraceRouteResults(result,tooltype,requestId)
{
	var urlStatus=getUrlValue(result,"axUrl_Status");  //No I18N
	if(urlStatus==='FAILED')
	{
		addTraceRouteFailedResult(result,tooltype,requestId);
		return;
	}
	var outputStr=getUrlValue(result,"axUrl_traceRouteOutput");
	var colHdr=getUrlValue(result,"axUrl_Columnvalues");
	var tableDetails=getUrlValue(result,"axUrl_Tabledetails");
	var permalink=getUrlValue(result,"axUrl_permalink");
	globalPermaLink=permalink;
	var splited_col = colHdr.split("#:#");
	var tableSplit=tableDetails.split("#:#");
	var websiteName=tableSplit[2].toString();
	//alert(tableSplit[0]);
	//alert(tableSplit[1]);
	//alert(tableSplit[2]);
	var traceResultNode=document.getElementById("traceResultContainer"+requestId);
	var hdrElt=traceResultNode.children[0].children[1];
	$(hdrElt).hide();
	var dataElt=traceResultNode.children[0].children[2]; // traceResult
	var styleStr=dataElt.style;
	styleStr = styleStr + '; overflow-y: scroll;';
	var hdrString='<table align="center" class="logintableborder" style="border-bottom:none;" width="100%" cellpadding="0" cellspacing="0"><tbody><tr><td class="columnheading">TRACEROUTE_HEADER</td></tr><tr></tr></tbody></table><table class="logintableborder" width="100%" align="center" cellpadding="0" cellspacing="0"><tbody>RESULT_CONTENT</tbody></table>';
	hdrString = hdrString.replace(/TRACEROUTE_HEADER/g,splited_col[0]);
	hdrString = hdrString.replace(/RESULT_CONTENT/g,outputStr);
	dataElt.innerHTML=hdrString;
	dataElt.style.display='block';
	$('#permalink').val(permalink);
	$('#shareresult').show();
	showPreviousHistory("TRACEROUTE",websiteName);  //No I18N
	addFacebookLikeButton(permalink ,document.getElementById('fbLikeTd'));
	addTweetLikeButton(permalink,document.getElementById('tweetdiv'));
	addgplusLikeButton(permalink,document.getElementById("gplusdiv"));
}



function addSSL3VerificationResults(result,tooltype,requestId)
{
	if(typeof(result)==='undefined' || result===null || result.length===0)
	{
		// TODO : Update Results Panel with Error
		return; // No I18N
	}
	else {
		// TODO: If result does not contain success message
		var status=getUrlValue(result,'axUrl_Status'); // No I18N
		if(status==='FAILED' || status==='INVALIDHOST')
		{
			// console.log("Inside failed");
			var expImgTitle=toolsmsg.ssl3_invalid_title;
			expImgTitle = expImgTitle.replace("{0}",domainName); // No I18N
			document.getElementById("ssl3failedimage").title=expImgTitle; // No I18N
			var errMsg=getUrlValue(result,'axUrl_Reason'); // No I18N
			var failedElt=document.getElementById('ssl3Failed'); // No I18N
			if(status==='INVALIDHOST')
			{
				$("#ssl3ErrorText").html(errMsg);
			}
			var errorHTML=failedElt.innerHTML;
			var domainName=getUrlValue(result,'axUrl_domainName'); // No I18N
			var ssl3ResultsElt=document.getElementById("ssl3Results"+requestId);
			$('#ssl3Results'+requestId+' div p').html('Results as on: '+getDateString(true)); // No I18N
			errorHTML=errorHTML.replace(/DOMAIN_NAME/g,domainName);
			var divElt=document.createElement("DIV");
			divElt.setAttribute("class","clear"); // No I18N
			divElt.innerHTML=errorHTML;
			ssl3ResultsElt.appendChild(divElt);
			return;
		}
		else
		{
			// COMMENT: Status is success
			var axResult=getUrlValue(result,"axUrl_Result"); // No I18N
			var domainName=getUrlValue(result,'axUrl_domainName'); // No I18N
			var successElt=document.getElementById('ssl3Success');
			var imgElt=document.getElementById("ssl3resultimage");
			var expiredText=toolsmsg.ssl3_result_unsafe;
			if(axResult==="UNSAFE") {
				document.getElementById("ssl3SuccessBG").style.background="#fee4e4"; // No I18N
				document.getElementById("ssl3SuccessBG").style.border="1px solid #ffb2b2"; // No I18N
				expiredText=expiredText.replace("{0}",domainName)
				imgElt.src=ssl3ExpiredLink;
				$("#ssl3ResultText").html(expiredText); // No I18N
				document.getElementById("ssl3failedimage").title=expiredText;
			}
			else
			{
				var expImgTitle=toolsmsg.ssl3_result_safe;
				var ssl3_valid_msg=toolsmsg.ssl3_result_safe; // No I18N
				ssl3_valid_msg = ssl3_valid_msg.replace("{0}",domainName);  // No I18N
				$("#ssl3ResultText").html(ssl3_valid_msg); // No I18N
				expImgTitle = expImgTitle.replace("{0}",domainName);
				document.getElementById("ssl3resultimage").title=expImgTitle;
				// COMMENT: Permalink
				var permalink=getUrlValue(result,"axUrl_permalink"); // No I18N
				document.getElementById("permalink").value=permalink.toString();
				$('#shareresult').show();
				globalToolType="CHECKSSL3"; // No I18N
				showPreviousHistory("CHECKSSL3",domainName);  //No I18N
				globalPermaLink=document.getElementById('permalink').value.toString();
				try
				{
					addFacebookLikeButton(globalPermaLink,document.getElementById("fbLikeTd"));
					addTweetLikeButton(globalPermaLink,document.getElementById("tweetdiv"));
					addgplusLikeButton(globalPermaLink,document.getElementById("gplusdiv"));
				}
				catch(e)
				{

				}
			}
			var successHTML=successElt.innerHTML;
			successElt.innerHTML = successHTML;
			var ssl3ResultsElt=document.getElementById("ssl3Results"+requestId); // No I18N
			ssl3ResultsElt.children[0].children[0].innerHTML="Results as on: "+getDateString(true); // No I18N
			var divElt=document.createElement("DIV");
			divElt.innerHTML=successHTML;
			ssl3ResultsElt.appendChild(divElt);
		}
	}
}

function addGhostCatVerificationResults(result,tooltype,requestId)
{
	if(typeof(result)==='undefined' || result===null || result.length===0)
	{
		// TODO : Update Results Panel with Error
		return; // No I18N
	}
	else {
		// TODO: If result does not contain success message
		var status=getUrlValue(result,'axUrl_Status'); // No I18N
		var domainName=getUrlValue(result,'axUrl_domainName'); // No I18N
		if(status==='FAILED' || status==='INVALIDHOST')
		{
			// console.log("Inside failed");
			var expImgTitle=toolsmsg.ssl3_invalid_title;
			expImgTitle = expImgTitle.replace("{0}",domainName); // No I18N
			document.getElementById("ghostCatfailedimage").title=expImgTitle; // No I18N
			var errMsg=getUrlValue(result,'axUrl_Reason'); // No I18N
			var failedElt=document.getElementById('ghostCatFailed'); // No I18N
			if(status==='INVALIDHOST')
			{
				$("#ghostCatErrorText").html(errMsg);
			}
			var errorHTML=failedElt.innerHTML;
			var ghostCatResultsElt=document.getElementById("ghostCatResults"+requestId);
			$('#ghostCatResults'+requestId+' div p').html('Results as on: '+getDateString(true)); // No I18N
			errorHTML=errorHTML.replace(/DOMAIN_NAME/g,domainName);
			var divElt=document.createElement("DIV");
			divElt.setAttribute("class","clear"); // No I18N
			divElt.innerHTML=errorHTML;
			ghostCatResultsElt.appendChild(divElt);
			return;
		}
		else
		{
			// COMMENT: Status is success
			var axResult=getUrlValue(result,"axUrl_Result"); // No I18N
			if(axResult==="UNSAFE") {
				document.getElementById("ssl3SuccessBG").style.background="#fee4e4"; // No I18N
				document.getElementById("ssl3SuccessBG").style.border="1px solid #ffb2b2"; // No I18N
				var imgElt=document.getElementById("ghostCatresultimage");
				var expiredText=toolsmsg.ghostCat_result_unsafe.replace("{0}",domainName);
				imgElt.src=ssl3ExpiredLink;
				imgElt.title=expiredText;
				$("#ghostCatResultText").html(expiredText); // No I18N
			}
			else
			{
				var expImgTitle=toolsmsg.ssl3_result_safe;
				var ssl3_valid_msg=toolsmsg.ssl3_result_safe; // No I18N
				ssl3_valid_msg = ssl3_valid_msg.replace("{0}",domainName);  // No I18N
				$("#ghostCatResultText").html(ssl3_valid_msg); // No I18N
				expImgTitle = expImgTitle.replace("{0}",domainName);
				document.getElementById("ghostCatresultimage").title=expImgTitle;
				// COMMENT: Permalink
				var permalink=getUrlValue(result,"axUrl_permalink"); // No I18N
				document.getElementById("permalink").value=permalink.toString();
				// $('#shareresult').show();
				globalToolType="CHECK_GHOSTCAT_VULNERABILITY"; // No I18N
				//showPreviousHistory("CHECK_GHOSTCAT_VULNERABILITY",domainName);  //No I18N
				globalPermaLink=document.getElementById('permalink').value.toString();
				try
				{
					addFacebookLikeButton(globalPermaLink,document.getElementById("fbLikeTd"));
					addTweetLikeButton(globalPermaLink,document.getElementById("tweetdiv"));
					addgplusLikeButton(globalPermaLink,document.getElementById("gplusdiv"));
				}
				catch(e)
				{

				}
			}
			var successHTML=document.getElementById('ghostCatSuccess').innerHTML;
			var ssl3ResultsElt=document.getElementById("ghostCatResults"+requestId); // No I18N
			ssl3ResultsElt.children[0].children[0].innerHTML="Results as on: "+getDateString(true); // No I18N
			var divElt=document.createElement("DIV");
			divElt.innerHTML=successHTML;
			ssl3ResultsElt.appendChild(divElt);
		}
	}
}

function addHBVerificationResults(result,tooltype,requestId)
{
	if(typeof(result)==='undefined' || result===null || result.length===0)
	{
		// TODO : Update Results Panel with Error
		return; // No I18N
	}
	else {
		// TODO: If result does not contain success message
		var status=getUrlValue(result,'axUrl_Status'); // No I18N
		if(status==='FAILED' || status==='INVALIDHOST')
		{
			// console.log("Inside failed");
			var expImgTitle=toolsmsg.ssl_invalid_title;
			expImgTitle = expImgTitle.replace("{0}",domainName); // No I18N
			document.getElementById("hbfailedimage").title=expImgTitle; // No I18N
			var errMsg=getUrlValue(result,'axUrl_Reason'); // No I18N
			var failedElt=document.getElementById('hbFailed'); // No I18N
			if(status==='INVALIDHOST')
			{
				$("#hbErrorText").html(errMsg);
			}
			var errorHTML=failedElt.innerHTML;
			var domainName=getUrlValue(result,'axUrl_domainName'); // No I18N
			var hbResultsElt=document.getElementById("hbResults"+requestId);
			$('#hbResults'+requestId+' div p').html('Results as on: '+getDateString(true)); // No I18N
			errorHTML=errorHTML.replace(/DOMAIN_NAME/g,domainName);
			var divElt=document.createElement("DIV");
			divElt.setAttribute("class","clear"); // No I18N
			divElt.innerHTML=errorHTML;
			hbResultsElt.appendChild(divElt);
			return;
		}
		else
		{
			// COMMENT: Status is success
			var axResult=getUrlValue(result,"axUrl_Result"); // No I18N
			var domainName=getUrlValue(result,'axUrl_domainName'); // No I18N
			var successElt=document.getElementById('hbSuccess');
			var imgElt=document.getElementById("hbresultimage");
			var expiredText=toolsmsg.hb_result_unsafe;
			if(axResult==="UNSAFE") {
				document.getElementById("hbSuccessBG").style.background="#fee4e4"; // No I18N
				document.getElementById("hbSuccessBG").style.border="1px solid #ffb2b2"; // No I18N
				expiredText=expiredText.replace("{0}",domainName)
				imgElt.src=hbExpiredLink;
				$("#hbResultText").html(expiredText); // No I18N
				document.getElementById("hbfailedimage").title=expiredText;
			}
			else
			{
				var expImgTitle=toolsmsg.hb_result_safe;
				var hb_valid_msg=toolsmsg.hb_result_safe; // No I18N
				hb_valid_msg = hb_valid_msg.replace("{0}",domainName);  // No I18N
				$("#hbResultText").html(hb_valid_msg); // No I18N
				expImgTitle = expImgTitle.replace("{0}",domainName);
				document.getElementById("hbresultimage").title=expImgTitle;
				// COMMENT: Permalink
				var permalink=getUrlValue(result,"axUrl_permalink"); // No I18N
				document.getElementById("permalink").value=permalink.toString();
				$('#shareresult').show();
				globalToolType="CHECKHB"; // No I18N
				showPreviousHistory("CHECKHB",domainName);  //No I18N
				globalPermaLink=document.getElementById('permalink').value.toString();
				addFacebookLikeButton(globalPermaLink,document.getElementById("fbLikeTd"));
				addTweetLikeButton(globalPermaLink,document.getElementById("tweetdiv"));
				addgplusLikeButton(globalPermaLink,document.getElementById("gplusdiv"));
			}
			var successHTML=successElt.innerHTML;
			successElt.innerHTML = successHTML;
			var hbResultsElt=document.getElementById("hbResults"+requestId); // No I18N
			hbResultsElt.children[0].children[0].innerHTML="Results as on: "+getDateString(true); // No I18N
			var divElt=document.createElement("DIV");
			divElt.innerHTML=successHTML;
			hbResultsElt.appendChild(divElt);
		}
	}
}

function ElementInfo() {
	this.elementType = null;
	this.elementClass = null;
	this.elementInnerHTMLValue = null;
	this.elementTextContentValue = null;
	this.getElementInfo = function() {
		return 'Element : '+this.type + ', Class : ' + this.elementClass;// No I18N
	};
	this.getElementObject = function(elemType, elemClass, elemInnerHTMLValue, elemTextContentValue){
		var elementObjToReturn = null;
		this.elementType = elemType;
		this.elementClass = elemClass;
		this.elementInnerHTMLValue = elemInnerHTMLValue;
		this.elementTextContentValue = elemTextContentValue;
		elementObjToReturn = document.createElement(this.elementType);
		if(this.elementClass != null){
			elementObjToReturn.setAttribute('class', this.elementClass);
		}
		if(this.elementInnerHTMLValue != null){
			elementObjToReturn.innerHTML = this.elementInnerHTMLValue;
		}
		if(this.elementTextContentValue != null){
			elementObjToReturn.textContent = this.elementTextContentValue;
		}
		return elementObjToReturn;
	}
}

function setScanSSLResult(divElement, scanSSLResponse, isRecursive){
	//console.log('scanSSLResponse :::::::::::::::::::::: '+scanSSLResponse);
	var obj = $.parseJSON(scanSSLResponse);
	for (var key in obj) {
		var value = obj[key];
		//console.log(key+", type of key : "+typeof(key)+", Type of value : "+typeof(value)+" Is array : "+$.isArray(value)+" ================= "+value);
		var rowDiv = null, keyDiv = null, valueDiv = null;
		elementInfo = new ElementInfo();
		rowDiv = elementInfo.getElementObject('div', 'toolsScanSSLRow floatleft resultrowborder clear', null, null);// No I18N
		keyDiv = elementInfo.getElementObject('div', 'toolsScanSSLKey floatleft', null, null);// No I18N
		valueDiv = elementInfo.getElementObject('div', 'floatleft dlfontscanssl pad4');// No I18N
		if($.isArray(value)){
			//console.log('Val :----------------- '+value);
			for(var i=0; i<value.length; i++){
				//console.log('Val : '+value[i]);
				if(i == 0){
					var rowDiv = null, textDiv = null, bElem = null;
					rowDiv = elementInfo.getElementObject('div', 'toolsScanSSLRow floatleft resultrowborder clear', null, null);// No I18N
					textDiv = elementInfo.getElementObject('div',null , null, null);// No I18N
					bElem = elementInfo.getElementObject('span', 'toolsScanSSLTextBold floatleft', key, null);// No I18N
					textDiv.appendChild(bElem);
					rowDiv.appendChild(textDiv);
					divElement.appendChild(rowDiv);
				}
				var rowDiv = null, textDiv = null;
				rowDiv = elementInfo.getElementObject('div', 'toolsScanSSLRow floatleft resultrowborder clear', null, null);// No I18N
				textDiv = elementInfo.getElementObject('div', 'toolsScanSSLText floatleft', null, value[i]);// No I18N
				rowDiv.appendChild(textDiv);
				divElement.appendChild(rowDiv);
			}
		}else if(typeof(value) == 'object'){// No I18N
			rowDiv = elementInfo.getElementObject('div', 'toolsScanSSLRow floatleft resultrowborder clear', null, null);// No I18N
			keyDiv = elementInfo.getElementObject('div',null , null, null);// No I18N
			var bElem = elementInfo.getElementObject('span', 'toolsScanSSLTextBold floatleft', key, null);// No I18N
			keyDiv.appendChild(bElem);
			//valueDiv.textContent = JSON.stringify(value);
			rowDiv.appendChild(keyDiv);
			rowDiv.appendChild(valueDiv);
			divElement.appendChild(rowDiv);
			setScanSSLResult(divElement, JSON.stringify(value), true);
		}else{
			if(isRecursive){
				keyDiv.textContent = key;
				valueDiv.textContent = value;
				rowDiv.appendChild(keyDiv);
				rowDiv.appendChild(valueDiv);
				divElement.appendChild(rowDiv);
			}else{
				var rowDiv = null, textDiv = null, emptyDiv = null, bElem = null;
				rowDiv = elementInfo.getElementObject('div', 'toolsScanSSLRow floatleft resultrowborder clear', null, null);// No I18N
				textDiv = elementInfo.getElementObject('div',null , null, null);// No I18N
				bElem = elementInfo.getElementObject('span', 'toolsScanSSLTextBold floatleft', key, null);// No I18N
				textDiv.appendChild(bElem);
				rowDiv.appendChild(textDiv);
				divElement.appendChild(rowDiv);
				rowDiv = elementInfo.getElementObject('div', 'toolsScanSSLRow floatleft resultrowborder clear', null, null);// No I18N
				textDiv = elementInfo.getElementObject('div', 'toolsScanSSLText floatleft', null, value);// No I18N
				rowDiv.appendChild(textDiv);
				divElement.appendChild(rowDiv);
			}

		}

	}

	//console.log(typeof(scanSSLResponseMap)+"==================== "+scanSSLResponseMap);

}

function addScanSSLResults(result,tooltype,requestId)
{
	$('.grptext').show();
	if(typeof(result)=='undefined' || result==null || result.length==0)
	{
		// TODO : Update Results Panel with Error
		var tempVariable = result;
	}
	else {
		// TODO: If result does not contain success message
		var status=getUrlValue(result,'axUrl_Status');// No I18N
		// alert("Status : "+status);
		if(status=='FAILED')
		{
			// console.log("Inside failed");
			var expImgTitle=toolsmsg.ssl_invalid_title;
			expImgTitle = expImgTitle.replace("{0}",domainName);
			document.getElementById("sslscanfailedimage").title=expImgTitle;
			//console.log('requestId : '+requestId);
			var errMsg=getUrlValue(result,'axUrl_Reason');// No I18N
			var failedElt=document.getElementById('sslScanFailed');
			var errorHTML=failedElt.innerHTML;
			var domainName=getUrlValue(result,'axUrl_domainName'); // No I18N
			var sslResultsElt=document.getElementById("sslScanResults"+requestId);
			$(sslResultsElt.children[0]).hide();
			$('#sslScanResults'+requestId+' div p').html('Scan SSL : '+domainName);
			errorHTML=errorHTML.replace(/DOMAIN_NAME/g,domainName);
			var divElt=document.createElement("DIV");
			divElt.innerHTML=errorHTML;
			sslResultsElt.appendChild(divElt);
			return;
		}
		else
		{
			// COMMENT: Status is success
			var sslScanSuccessElt=document.getElementById('sslScanSuccess');
			var scanSSLResponse = getUrlValue(result,'axUrl_ssl_json_data'); // No I18N
			//console.log('scanSSLResponse : '+scanSSLResponse);
			//successElt.innerHTML = scanSSLResponse
			setScanSSLResult(sslScanSuccessElt, scanSSLResponse, false);
			$('#sslScanResults'+requestId).hide();
			$('#sslScanResultContainer').show();
			$('#sslScanSuccess').show();
			//$("#sslScanSuccess").css("display","block");
			/*
			    var successHTML=successElt.innerHTML;


			    successElt.innerHTML = successHTML;
			    var sslResultsElt=document.getElementById("sslScanResults"+requestId);
			    sslResultsElt.children[0].children[0].innerHTML="SSL Scan Results: "+getDateString(true);
			    var divElt=document.createElement("DIV");
			    divElt.innerHTML=successHTML;
			    setScanSSLResult(divElt, scanSSLResponse, false);
			    sslResultsElt.appendChild(divElt);
			    console.log("Permalink : "+permalink);
			    document.getElementById("permalink").value=permalink.toString();
			    $('#shareresult').show();
			    globalToolType="SSL";
			    showPreviousHistory("SSL",domainName);  //No I18N
			    globalPermaLink=document.getElementById('permalink').value.toString();
			    addFacebookLikeButton(globalPermaLink,document.getElementById("fbLikeTd"));
			    addTweetLikeButton(globalPermaLink,document.getElementById("tweetdiv"));
   			    addgplusLikeButton(globalPermaLink,document.getElementById("gplusdiv"));
   			    */
		}
	}
}

function addSSLVerificationResults(result,tooltype,requestId)
{
	$('.grptext').show();
	if(typeof(result)=='undefined' || result==null || result.length==0)
	{
		// TODO : Update Results Panel with Error
	}
	else {
		// TODO: If result does not contain success message
		var status=getUrlValue(result,'axUrl_Status');
		// alert("Status : "+status);
		if(status=='FAILED')
		{
			// console.log("Inside failed");
			var expImgTitle=toolsmsg.ssl_invalid_title;
			expImgTitle = expImgTitle.replace("{0}",domainName);
			document.getElementById("sslfailedimage").title=expImgTitle;
			//console.log('requestId : '+requestId);
			var errMsg=getUrlValue(result,'axUrl_Reason');
			var failedElt=document.getElementById('sslFailed');
			var errorHTML=failedElt.innerHTML;
			var domainName=getUrlValue(result,'axUrl_domainName'); // No I18N
			var sslResultsElt=document.getElementById("sslResults"+requestId);
			$(sslResultsElt.children[0]).hide();
			$('#sslResults'+requestId+' div p').html('Checking SSL Certificate : '+domainName);
			errorHTML=errorHTML.replace(/DOMAIN_NAME/g,domainName);
			var divElt=document.createElement("DIV");
			divElt.innerHTML=errorHTML;
			sslResultsElt.appendChild(divElt);
			return;
		}
		else
		{
			// COMMENT: Status is success
			var axDTEX=getUrlValue(result,"axUrl_daysTOex"); // No I18N
			var axSave=getUrlValue(result,"axUrl_Save");
			var permalink=getUrlValue(result,"axUrl_permalink");
			var domainName=getUrlValue(result,'axUrl_domainName'); // No I18N
			/*var chromeTrust=getUrlValue(result,'axUrl_chromeTrust'); // No I18N
                var chromeDistrustMsg=getUrlValue(result,'axUrl_chromeDistrustMsg'); // No I18N*/
			var certChain=getUrlValue(result,'axUrl_certChain'); // No I18N
			var tableRow=document.getElementById('serverCert');
			var successElt=document.getElementById('sslSuccess');
			var imgElt=document.getElementById("sslresultimage");
			var expiredText=toolsmsg.ssl_expired_days;

			if(axDTEX<=0) {
				var expImgTitle=toolsmsg.ssl_invalid_title;
				imgElt.src=sslExpiredLink;
				expiredText=expiredText.replace("{0}",domainName); // No I18N
				// COMMENT: -1 * axDTEX :- To make the negative days
				// positive
				expiredText=expiredText.replace("{1}", ""+(-1*axDTEX));  // No I18N
				$("#sslResultText").html(expiredText); // No I18N
				expImgTitle = expImgTitle.replace("{0}",domainName);
				document.getElementById("sslfailedimage").title=expImgTitle;
			}
			else
			{
				var expImgTitle=toolsmsg.ssl_valid_title;
				var ssl_valid_days=toolsmsg.ssl_valid_days; // No I18N
				ssl_valid_days = ssl_valid_days.replace("{0}",domainName);  // No I18N
				ssl_valid_days = ssl_valid_days.replace("{1}",(""+axDTEX)); // No I18N
				$("#sslResultText").html(ssl_valid_days); // No I18N
				expImgTitle = expImgTitle.replace("{0}",domainName);
				document.getElementById("sslresultimage").title=expImgTitle;
			}
			/*if(chromeTrust == "false"){
                    $('#chromeTrust').hide();
                }*/
			var successHTML=successElt.innerHTML;

			if(certChain && typeof certChain == "string"){
				certChain=JSON.parse(certChain);
				var sslResultTable = document.getElementById('sslResultTable');
				for(var i=0;i<Object.keys(certChain).length;i++){
					var tr = sslResultTable.insertRow(sslResultTable.rows.length);
					tr.innerHTML=tableRow.innerHTML;
					tr.setAttribute('id','chainCert'+i);
					chainRow=tr.innerHTML;
					if(i>0){
						chainRow = chainRow.replace(/Server Certificate/g,'Certificate Chain #'+i);
					}
					//chainRow = chainRow.replace(/DOMAIN_NAME/g,certChain[i].issuedToCn);
					chainRow = chainRow.replace(/ISSUED_DATE/g,certChain[i].createdDate);
					chainRow = chainRow.replace(/EXPIRY_DATE/g,certChain[i].expiryDate);
					chainRow = chainRow.replace(/EXPIRY_COUNT/g,certChain[i].certDaysLeft);
					chainRow = chainRow.replace(/COMMON_NAME/g,certChain[i].issuedToCn);
					chainRow = chainRow.replace(/COMMON_ISSUER_NAME/g,certChain[i].issuedByCn);
					chainRow = chainRow.replace(/ORGANIZATION/g,certChain[i].issuedToO);
					chainRow = chainRow.replace(/ORG_UNIT/g,certChain[i].issuedToOu);
					chainRow = chainRow.replace(/ORG_O/g,certChain[i].issuedByO);
					chainRow = chainRow.replace(/ORG_U/g,certChain[i].issuedByOu);
					tr.innerHTML=chainRow;
				}
			}
			tableRow.remove();
			var sslResultsElt=document.getElementById("sslResults"+requestId);
			sslResultsElt.children[0].children[0].innerHTML="SSL Test Results: "+getDateString(true);
			var divElt=document.createElement("DIV");
			divElt.innerHTML=successElt.innerHTML;
			sslResultsElt.appendChild(divElt);
			//console.log("Permalink : "+permalink);
			document.getElementById("permalink").value=permalink.toString();
			$('#shareresult').show();
			globalToolType="SSL";
			showPreviousHistory("SSL",domainName);  //No I18N
			globalPermaLink=document.getElementById('permalink').value.toString();
			addFacebookLikeButton(globalPermaLink,document.getElementById("fbLikeTd"));
			addTweetLikeButton(globalPermaLink,document.getElementById("tweetdiv"));
			addgplusLikeButton(globalPermaLink,document.getElementById("gplusdiv"));
		}
	}
}

function addServerHeaderResults(result,tooltype,requestId)
{
	var idCols = [ 'shDate'+requestId,'shHdr'+requestId,'shCL'+requestId,'shLoc'+requestId,'shKA'+requestId,'shCT'+requestId,'shCN'+requestId,'shSvr'+requestId ];   // No I18N
	var idColName = [ 'Date','Header','Content-Length','Location','keep-alive','Content-Type','Connection','Server' ];  // No I18N
	var hdrMsg=getUrlValue(result,'axUrl_Columnvalues');  // No I18N
	var toolsResp=getUrlValue(result,'axUrl_Toolsresponse');  // No I18N
	var permalink=getUrlValue(result,'axUrl_permalink');  // No I18N
	var domainName=getUrlValue(result,"axUrl_DomainName"); // No I18N
	var emptyResponse=false;
	if(toolsResp==null || toolsResp==undefined || toolsResp=='undefined' || toolsResp.length==0)
	{
		emptyResponse=true;
		toolsResp = '<p>-</p>#:#<p>-</p>#:#<p>-</p> #:#<p>-</p> #:#<p>-</p>#:#<p>-</p> #:#<p>-</p> #:#<p>-</p> #:#<p>-</p> #:#<p>-</p>';  // No I18N
		$('#shResultHdr').html("Server Header Details: Please check your server name"); // No I18N
	}
	var varValArray=toolsResp.split('#:#');  // No I18N
	var numberOfColumns=varValArray.length / 2;
	var keyValHash={};
	for(var i=0;i<numberOfColumns;i++)
	{
		if(emptyResponse===true)
		{
			document.getElementById(idCols[i]).children[1].innerHTML=varValArray[i];
		}
		else {
			if(varValArray[i*2]==='undefined' || varValArray[i*2]===undefined)   // No I18N
			{
				continue;
			}
			keyValHash[varValArray[i*2].trim()]=( (varValArray[(i*2)+1])==='undefined' || (varValArray[(i*2)+1])===undefined)?"-":(varValArray[(i*2)+1]);  // No I18N
		}
	}
	var parentNode=document.getElementById("findLocResults2");  // No I18N

	var titleElt=parentNode.children[0];
	titleElt.innerHTML='<div style="margin-top:9px; margin-left: 15px;"><b>Server Header details for '+domainName+'</b></div>';  // No I18N
	for(i=0;i<numberOfColumns;i++)
	{
		var rowDiv=document.getElementById('shRowTempl').cloneNode(true);  // No I18N
		rowDiv.style.display='block';  // No I18N
		rowDiv.style.height="auto;"  // No I18N
		if(i===0)
		{
			rowDiv.setAttribute("style","margin-top: -1px;")  // No I18N
		}

		var col1Div=rowDiv.children[0].innerHTML=	varValArray[i*2];
		if(emptyResponse)
		{
			var col2Div=rowDiv.children[1].innerHTML=	varValArray[ (i*2) + 1];
		}
		else
		{
			var col2Div=rowDiv.children[1].innerText=	varValArray[ (i*2) + 1];
		}
		parentNode.appendChild(rowDiv)
	}
	var shResultHdr=document.getElementById('shResultHdr');  // No I18N
	shResultHdr.setAttribute("class"," dlfontl clear");  // No I18N
	document.getElementById("permalink").value=permalink.toString();
	$('#shareresult').show();  // No I18N
	globalToolType="SERVERHEADER"; // No I18N
	showPreviousHistory("SERVERHEADER",domainName);  //No I18N
	globalPermaLink=document.getElementById('permalink').value.toString();
	addFacebookLikeButton(globalPermaLink,document.getElementById("fbLikeTd"));  // No I18N
	addTweetLikeButton(globalPermaLink,document.getElementById("tweetdiv"));  // No I18N
	addgplusLikeButton(globalPermaLink,document.getElementById("gplusdiv"));  // No I18N
}

function addRedirectionResults(result,tooltype,requestId)
{
	var idCols = [ 'shDate'+requestId,'shHdr'+requestId,'shCL'+requestId,'shLoc'+requestId,'shKA'+requestId,'shCT'+requestId,'shCN'+requestId,'shSvr'+requestId ];   // No I18N
	var idColName = [ 'Date','Header','Content-Length','Location','keep-alive','Content-Type','Connection','Server' ];  // No I18N
	var hdrMsg=getUrlValue(result,'axUrl_Columnvalues');  // No I18N
	var toolsResp=getUrlValue(result,'axUrl_Toolsresponse');  // No I18N
	var permalink=getUrlValue(result,'axUrl_permalink');  // No I18N
	var domainName=getUrlValue(result,"axUrl_DomainName"); // No I18N
	var emptyResponse=false;
	if(toolsResp==null || toolsResp==undefined || toolsResp=='undefined' || toolsResp.length==0)
	{
		emptyResponse=true;
		toolsResp = '<p>-</p>#:#<p>-</p>#:#<p>-</p> #:#<p>-</p> #:#<p>-</p>#:#<p>-</p> #:#<p>-</p> #:#<p>-</p> #:#<p>-</p> #:#<p>-</p>';  // No I18N
		$('#shResultHdr').html("Redirection Details: Please check the url provided"); // No I18N
	}
	var varValArray=toolsResp.split('#:#');  // No I18N
	var numberOfColumns=varValArray.length / 2;
	var keyValHash={};
	for(var i=0;i<numberOfColumns;i++)
	{
		if(emptyResponse===true)
		{
			document.getElementById(idCols[i]).children[1].innerHTML=varValArray[i];
		}
		else {
			if(varValArray[i*2]==='undefined' || varValArray[i*2]===undefined)   // No I18N
			{
				continue;
			}
			keyValHash[varValArray[i*2].trim()]=( (varValArray[(i*2)+1])==='undefined' || (varValArray[(i*2)+1])===undefined)?"-":(varValArray[(i*2)+1]);  // No I18N
		}
	}
	var parentNode=document.getElementById("findLocResults2");  // No I18N

	var titleElt=parentNode.children[0];
	titleElt.innerHTML='<div style="margin-top:9px; margin-left: 15px;"><b>Server Header details for '+domainName+'</b></div>';  // No I18N
	for(i=0;i<numberOfColumns;i++)
	{
		var rowDiv=document.getElementById('shRowTempl').cloneNode(true);  // No I18N
		rowDiv.style.display='block';  // No I18N
		rowDiv.style.height="auto;"  // No I18N
		if(i===0)
		{
			rowDiv.setAttribute("style","margin-top: -1px;")  // No I18N
		}

		var col1Div=rowDiv.children[0].innerHTML=	varValArray[i*2];
		if(emptyResponse)
		{
			var col2Div=rowDiv.children[1].innerHTML=	varValArray[ (i*2) + 1];
		}
		else {
			var col2Div=rowDiv.children[1].innerText=	varValArray[ (i*2) + 1];
		}
		parentNode.appendChild(rowDiv)
	}
	var shResultHdr=document.getElementById('shResultHdr');  // No I18N
	shResultHdr.setAttribute("class"," dlfontl clear");  // No I18N
}

function addCleanCodeResponse(response,url,requestId)
{
	$('#cleanCodeResultHdr').remove();
	$('#cleanCodeResult').html(response);
	$('#cleanCodeResult').show();
}

function addLynxViewResponse(response,url,requestId)
{
	$('#lynxViewResultHdr').remove();
	$('#lynxViewResult').html(response);
	$('#lynxViewResult').show();
}

function addWebSpeedResponse(response,url,requestId)
{
	$('#webSpeedResultHdr').remove();
	$('#webSpeedResult').html(response);
	$('#webSpeedResult').show();
	showPreviousHistory("WEBSPEED",url); //No I18N
}

function addTextRatioResponse(response,url,requestId)
{
	$('#textRatioResultHdr').remove();
	$('#textRatioResult').html(response);
	$('#textRatioResult').show();
	showPreviousHistory("TEXTRATIO",url); //No I18N
}

function showErrorResults(result,tooltype,requestId) {
	if(tooltype=='SERVERHEADER')
	{
		var hdrNames= [ 'shDate', 'shHdr', 'shCL','shLoc','shKA','shCT','shCN','shSvr' ];
		for(i=0;i<hdrNames.length;i++) {
			var divElt=document.getElementById(hdrNames[i]+requestId);
			$(divElt).hide();
		}
		var errorCode=getUrlValue(result,'axUrl_errorCode');
		$('#shResultHdr').html("<div><h2 style='padding-top:10px;color:#000000;'>Error while fetching URL.</h2></div>");
	}
	else if(tooltype=='CLEANCODE')
	{
		var cleanCodeResultHdr=document.getElementById("cleanCodeResultHdr").children[0];
		$(cleanCodeResultHdr).html("<div><h2 style='padding-top:10px;color:#000000;'>Error while fetching URL.</h2></div>");
	}
}

function toolsResponse(result,tooltype,requestId)
{
	//console.log("toolsResponse : "+tooltype+" "+result);
	invalid = getUrlValue(result,'axUrl_invalid'); // No I18N
	if(invalid == 'true')
	{
		showErrorResults(result,tooltype,requestId);
		try
		{
			document.getElementById('laodingDiv').style.display = 'none';
		}
		catch(e)
		{
			console.log('Error : Invalid Result : toolsResponse')
		}

		document.getElementById('toolsOutPutDiv').innerHTML='<br><table width="50%" align="center" border="0" cellspacing="2" cellpadding="2"><tr><td class="message" style="color:red">'+errMsg+'</td></tr></table><br>'
		document.getElementById('toolsOutPutDiv').style.display = 'block';
		return false;
	}
	if(tooltype=='SCAN_SSL')
	{
		addScanSSLResults(result,tooltype,requestId);
		return;
	}
	if(tooltype=='CHECKSSL')
	{
		addSSLVerificationResults(result,tooltype,requestId);
		return;
	}
	if(tooltype==='CHECKHB')
	{
		addHBVerificationResults(result,tooltype,requestId);
		return;
	}
	if(tooltype==='CHECKSSL3')
	{
		addSSL3VerificationResults(result,tooltype,requestId);
		return;
	}else if(tooltype==='CHECK_GHOSTCAT_VULNERABILITY'){ //No I18N
		addGhostCatVerificationResults(result, tooltype, requestId);
	}
	else if(tooltype=='TRACEROUTE')
	{
		addTraceRouteResults(result,tooltype,requestId);
		return;
	}
	else if(tooltype=='SERVERHEADER')
	{
		addServerHeaderResults(result,tooltype,requestId);
		return;
	}
	else if(tooltype=='BRANDREPUTATION')
	{
		addBrandReputationResults(result,tooltype,requestId);
		return;
	}
	else if(tooltype=='BLACKLISTCHECK')
	{
		addBlacklistCheckResults(result,tooltype,requestId)
		return;
	}
	var url = getUrlValue(result,'axUrl_Url');// No I18N
	// var col = frm.columnvalues.value;
	// alert("ccoll"+col);
	var row = getUrlValue(result,'axUrl_Toolsresponse');// No I18N
	var save = getUrlValue(result,'axUrl_Save');// No I18N
	var status=getUrlValue(result,'axUrl_Status'); // No I18N
	if(row!=null && row!="")
	{
		var splited_row = row.split("#:#");
		for(var i=0;i<splited_row.length;i++)
		{
			row_values = row_values.concat([splited_row[i]]);
		}
		// alert(jsonresponse);
		var col = getUrlValue(result,'axUrl_Columnvalues');// No I18N
		// alert("col --"+col);
		var splited_col = col.split("#:#");
		var column_values = [];
		for(var i=0;i<splited_col.length;i++)
		{
			column_values = column_values.concat([splited_col[i]]);
		}
		// var table_details = ["generictable","1",url];
		var tab_details = getUrlValue(result,'axUrl_Tabledetails');// No I18N
		//console.log("tab_details : "+tab_details);
		var splited_table_details = tab_details.split("#:#");
		var table_details = [];
		for(var i=0;i<splited_table_details.length;i++)
		{
			//console.log("split_tab_details "+i+" value "+splited_table_details[i]);
			table_details = table_details.concat([splited_table_details[i]]);
		}
		var align = getUrlValue(result,'axUrl_Alignment');// No I18N
		var splited_tab_align = align.split("#:#");
		var tab_align = [];
		for(var i=0;i<splited_tab_align.length;i++)
		{
			tab_align = tab_align.concat([splited_tab_align[i]]);
		}
		if(tooltype=='FINDIP')
		{
			if(status=="FAILED")
			{
				addFindIpRowResult(requestId,"",url,""); // No I18N
			}
			else
			{
				addFindIpRowResult(requestId,splited_table_details[1],url,row)
			}
			return;
		}
		else if(tooltype=='FINDLOCATION')
		{
			addFindLocRowResult(requestId,splited_table_details[1],splited_table_details[2],splited_row);
			return;
		}
		var tools_response = {"rowvalues":row_values,"columnvalues":column_values,"tabledetails":table_details,"tabalign":tab_align};// No I18N
		var json = JSON.stringify(tools_response);
		var arg = "exec="+save+"&tools_response="+encodeURIComponent(json);// No I18N
		var response = $.getAjaxResponse("POST","/tools/publicpage",arg);// No I18N
		response = decodeHtml(response);
		var splited_response = response.split("#:#");
		if(tooltype=='CLEANCODE')
		{
			//console.log("Clean Code : /publicpage Response "+response);
			addCleanCodeResponse(response,url,requestId);
			return;
		}
		else if(tooltype=='LYNXVIEW')
		{
			// TODO : Adjust the size of the IFRAME WIDTH from 939px to 994px.
			addLynxViewResponse(response,url,requestId);
			return;
		}
		else if(tooltype=='WEBSPEED')
		{
			var permalink = getUrlValue(result,'axUrl_permalink');// No I18N
			addWebSpeedResponse(response,url,requestId);
			globalPermaLink=permalink;
			document.getElementById('permalink').value = permalink;
			$('#shareresult').show();
			addFacebookLikeButton(permalink,document.getElementById('fbLikeTd'));
			addTweetLikeButton(permalink,document.getElementById('tweetdiv'));
			addgplusLikeButton(permalink,document.getElementById("gplusdiv"));  // No I18N
			return;
		}
		else if(tooltype=='TEXTRATIO')
		{
			var permalink = getUrlValue(result,'axUrl_permalink');// No I18N
			addTextRatioResponse(response,url,requestId);
			globalPermaLink=permalink;
			document.getElementById('permalink').value = permalink;
			$('#shareresult').show();
			addFacebookLikeButton(permalink,document.getElementById('fbLikeTd'));
			addTweetLikeButton(permalink,document.getElementById('tweetdiv'));
			addgplusLikeButton(permalink,document.getElementById("gplusdiv"));  // No I18N
			return;
		}
	}
	else {
		if(tooltype=='FINDIP')
		{
			if(status=="FAILED")
			{
				addFindIpRowResult(requestId,"",url,""); // No I18N
			}
		}
		else if(tooltype=="FINDLOCATION")
		{
			addFindLocRowResult(requestId,"","",""); // No I18N
		}
	}
}

function checkThisLink(url,frm)
{
	document.getElementById('hostName').value = url;
	document.getElementById('outPutDiv').style.display = 'none';
	document.getElementById('testUrl').innerHTML = url;
	document.getElementById('laodingDiv').style.display = 'block';
	checkLinks(document.getElementById('linkCheckerForm'));
}

function invokeDirect(monitorType, url)
{
	document.getElementById("hostName").value=url;
	if(monitorType==='CODECLEAN')
	{
		getToolsResponse(document.codecleaner,'CLEANCODE');  //No I18N
	}
	else if(monitorType==='LINK_CHECK')
	{
		checkLinks(document.checklinks);
	}
	else if(monitorType==='HTML_VAL')
	{
		validateHTML(document.htmlvalidator);
	}
	else if(monitorType==='LINK_EXPLORER')
	{
		exploreLinks(document.linkexplorer);
	}
	else if(monitorType==='LYNXVIEW')
	{
		getToolsResponse(document.lynxview,'LYNXVIEW');  //No I18N
	}
}

function getElementFromForm(form,name)
{
	if(form==='undefined' || form === undefined)
	{
		return "";
	}
	else
	{
		var elementCount=form.elements.length;
		for(i=0;i<elementCount;i++)
		{
			var formElement=form.elements[i];
			if(formElement.getAttribute("id")==='hostName')
			{
				return formElement;
			}
		}
	}
	return "";
}

function doCheckLinks(valueUrl)
{
	var frm;
	var formFound=false;
	var frmArray=document.getElementsByName("form"); // No I18N
	if(frmArray.length === 0)
	{
		frm=document.createElement("form"); // No I18N
	}
	else
	{
		for(i=0;i<frmArray.length;i++)
		{
			var tempFrm=frmArray[i];
			if(tempFrm.getAttribute("name")==='checklinks') // No I18N
			{
				frm=tempFrm;
				formFound=true;
			}
		}
	}
	if(formFound===false)
	{
		frm=document.createElement("form"); // No I18N
		//document.appendChild(frm);

		frm.setAttribute("name","checklinks");  // No I18N
		frm.setAttribute("action","/tools/action.do"); // No I18N
		frm.setAttribute("method","POST"); // No I18N
		frm.setAttribute("styleId","linkCheckForm"); // No I18N

		var exElt=document.createElement("input"); // No I18N
		exElt.setAttribute("type","hidden"); // No I18N
		exElt.setAttribute("name","execute"); // No I18N
		exElt.setAttribute("value","checkAccessKeyword"); // No I18N

		var urlElt=document.createElement("input"); // No I18N
		urlElt.setAttribute("type","hidden"); // No I18N
		urlElt.setAttribute("name","url"); // No I18N
		urlElt.setAttribute("id","url"); // No I18N

		var hostElt=document.createElement("input"); // No I18N
		hostElt.setAttribute("tabindex","1"); // No I18N
		hostElt.setAttribute("type","text"); // No I18N
		hostElt.setAttribute("value",valueUrl); // No I18N
		hostElt.setAttribute("class","hostnameonly"); // No I18N
		hostElt.setAttribute("name","hostName"); // No I18N
		hostElt.setAttribute("id","hostName"); // No I18N

		frm.appendChild(exElt);
		frm.appendChild(urlElt);
		frm.appendChild(hostElt);
	}
	var hostNameElt=getElementFromForm(frm,'hostName');  //No I18N
	hostNameElt.value=valueUrl;
	checkLinks(frm,"");
}

function checkLinks(frm,ranword)
{
	reqTs=new Date();
	if(frm.hostName.value=='')
	{
		alert(beanmsg.input_url);
		frm.hostName.select();
		return;
	}
	var url=frm.hostName.value;
	if(isDomainValid(url)===false)
	{
		alert(beanmsg.input_url);
		document.getElementById("url").focus();
		return;
	}
	requestCount = requestCount + 1;
	getHtmlForForm(frm,"postcheckLinksAccessKeyword",frm,requestCount);  // No I18N
}

function postcheckLinksAccessKeyword(result,frm,requestId)
{
	frm.execute.value="linkChecker";  // No I18N
	var url = document.getElementById('hostName').value;
	url=trimUrl(url);
	document.getElementById('url').value = url;
	showCommonResultPage(url);
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	hideGroupToolsOptions();
	$('#shareresult').hide();
	// $('#id_quicktest_div').hide();
	// $('#id_quicktest_space').hide();
	var clRC=document.getElementById('checkLinkResultContainer');
	clRC=clRC.children[0].cloneNode(true);
	clRC.setAttribute("id","checkLink"+requestId);
	addResultsToTopElement(clRC);
	$(clRC).show();
	getHtmlForForm(frm,"postCheckLink",requestId);// No I18N
}
function postCheckLink(result,requestId)
{
	$('#checkLinkResultHdr').remove();
	$('#checkLinkResult').html(result);
	$('#checkLinkResult').show();
	if(result.match("Error: Unable to access the specified URL"))
	{
		return false;
	}
	var url = document.getElementById('hostName').value;
	var getUrl = "/tools/action.do?execute=displayLinkList&url="+url; // No I18N
	http.open("GET",getUrl,true);
	http.onreadystatechange = postdisplayLinkList;
	http.send(null);
}

function postdisplayLinkList()
{
	// var checklink_response = "";
	if(http.readyState == 4)
	{
		result = decodeHtml(http.responseText);
		//console.log("postdisplayLinkText . . "+result);
		urlLinks = getUrlValue(result,'axUrl_urlLinks').split("||"); // No I18N
		imgLinks = getUrlValue(result,'axUrl_imgLinks').split("||"); // No I18N
		total_response_count = urlLinks.length+imgLinks.length;
		// alert("cccount "+total_response_count);
		for (var i=0; i<urlLinks.length; i++)
		{
			if(urlLinks[i].length>0)
			{
				// console.log("URL Link request to be generated is :
				// "+urlLinks[i]);
				// console.log("URL Link ID generated is : "+urlLinks[i]);
				var form = document.createElement("form");
				form.setAttribute("method", "post");
				form.setAttribute("action", "/tools/action.do?");
				form.appendChild(getnewFormElement("hidden","execute","getLinkStatus"));// No I18N
				form.appendChild(getnewFormElement("hidden","linkUrl",urlLinks[i]));// No I18N
				form.appendChild(getnewFormElement("hidden","id",i));// No I18N
				document.body.appendChild(form);
				getHtmlForForm(form,"postLinkStatus");  // No I18N
			}
		}

		for (var i=0; i<imgLinks.length; i++)
		{
			if(imgLinks[i].length>0)
			{
				// console.log("URL Link request to be generated is :
				// "+imgLinks[i]);
				// console.log("URL Link ID generated is : "+imgLinks[i]);
				var form = document.createElement("form");
				form.setAttribute("method", "get");
				form.setAttribute("action", "/tools/action.do?");
				form.appendChild(getnewFormElement("hidden","execute","getImageStatus"));// No I18N
				form.appendChild(getnewFormElement("hidden","imageUrl",imgLinks[i]));// No I18N
				form.appendChild(getnewFormElement("hidden","id",i));// No I18N
				document.body.appendChild(form);
				getHtmlForForm(form,"postImageStatus");  // No I18N
			}
		}
	}
}
function postLinkStatus(result)
{
	var statusCode = getUrlValue(result,'axUrl_statusCode');// No I18N
	var id = getUrlValue(result,'axUrl_id');  // No I18N
	var url = getUrlValue(result,'axUrl_link');// No I18N
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
		var response = {"linkvalues":link_values,"imgvalues":img_values};// No I18N
		var json = JSON.stringify(response);
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "/tools/action.do?");
		form.appendChild(getnewFormElement("hidden","execute","generatetableforlinkcheck"));// No I18N
		form.appendChild(getnewFormElement("hidden","response_data",json));// No I18N
		form.appendChild(getnewFormElement("hidden","url",hostname));// No I18N
		document.body.appendChild(form);
		getHtmlForForm(form,"publiclinkforlinkchecker",hostname);  // No I18N

	}
}

function postImageStatus(result)
{
	var id = getUrlValue(result,'axUrl_id');  // No I18N
	var statusCode = getUrlValue(result,'axUrl_statusCode');// No I18N
	var size = getUrlValue(result,'axUrl_size');// No I18N
	var type = getUrlValue(result,'axUrl_type');// No I18N
	var url = getUrlValue(result,'axUrl_imglink');// No I18N
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
		document.getElementById(id+"size").innerHTML = size+" Bytes";  // No I18N
		document.getElementById(id+"type").innerHTML = type;
		document.getElementById(id+"status").innerHTML = statusCode;
	}
	catch(e)
	{}
	img_values = img_values.concat([url,size+" Bytes",type,statusCode]);
	count_linkcheck++;
	if(count_linkcheck==total_response_count)
	{
		var hostname = document.getElementById('hostName').value;
		var response = {"linkvalues":link_values,"imgvalues":img_values};// No I18N
		var json = JSON.stringify(response);
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", "/tools/action.do?");
		form.appendChild(getnewFormElement("hidden","execute","generatetableforlinkcheck"));// No I18N
		form.appendChild(getnewFormElement("hidden","response_data",json));// No I18N
		form.appendChild(getnewFormElement("hidden","url",hostname));// No I18N
		document.body.appendChild(form);
		getHtmlForForm(form,"publiclinkforlinkchecker",hostname);  // No I18N
		showPreviousHistory('LINK_CHECK',hostname);  //No I18N
	}
}

function publiclinkforlinkchecker(result,hostname)
{
	document.getElementById('permalink').value = getUrlValue(result,"axUrl_linktoolstest");// No I18N
	// $('.cpermalink').val($('.spermalink').val());
	$('.cpermalink').val(getUrlValue(result,"axUrl_linktoolstest"));
	$('#shareresult').show();

	var fbLikeDiv=document.getElementById("fbLikeTd");
	var tweetLikeDiv=document.getElementById("tweetdiv");
	var	gplusdiv=document.getElementById("gplusdiv");
	linkurltest=getUrlValue(result,"axUrl_linktoolstest"); // No I18N
	globalToolType="LINK_CHECK";  // No I18N
	globalPermaLink=linkurltest;
	addFacebookLikeButton(linkurltest,fbLikeDiv);
	addTweetLikeButton(linkurltest,tweetLikeDiv);
	addgplusLikeButton(linkurltest,gplusdiv);
}


function validateHTML(frm,ranword)
{
	reqTs=new Date();
	if(frm.hostName.value=='')
	{
		alert(beanmsg["input_url"]);
		frm.hostName.select();
		return;
	}
	var url=frm.hostName.value;
	if(isDomainValid(url)===false)
	{
		alert(beanmsg.input_url);
		document.getElementById("url").focus();
		return;
	}
	if(url.toLowerCase().indexOf("zoho") != -1 || url.toLowerCase().indexOf("site24x7") != -1)
	{
		alert('Zoho and Site24x7 domains are restricted. Please enter another domain.');// No I18N
		document.getElementById("url").focus();
		return;
	}
	requestCount = requestCount + 1;
	getHtmlForForm(frm,"postvalidateHTMLAccessKeyword",frm,requestCount);  // No I18N

}

function postvalidateHTMLAccessKeyword(result,frm,requestId)
{
	frm.execute.value="htmlValidator";  // No I18N
	var url = document.getElementById('hostName').value;
	url=trimUrl(url);
	document.getElementById('url').value = url;
	showCommonResultPage(url);
	hideGroupToolsOptions();
	$('#shareresult').hide();
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	// $('#id_quicktest_div').hide();
	// $('#id_quicktest_space').hide();
	var hvRC=document.getElementById('htmlValidateResultContainer');
	hvRC=hvRC.children[0].cloneNode(true);
	hvRC.setAttribute("id","htmlVal"+requestId);
	addResultsToTopElement(hvRC);
	$(hvRC).show();
	getHtmlForForm(frm,"postValidateHTML",requestId);// No I18N
}

function postValidateHTML(result,requestId)
{
	$('#htmlValResultHdr').remove();
	$('#htmlValResult').html(result);
	$('#htmlValResult').show();
	$('.cpermalink').val($('.spermalink').val());
	$('#shareresult').show();

	var fbLikeDiv=document.getElementById("fbLikeTd");
	var tweetLikeDiv=document.getElementById("tweetdiv");
	var gplusdiv=document.getElementById("gplusdiv");
	linkurltest=$('.spermalink').val().toString();
	globalToolType='html_val';
	globalPermaLink=linkurltest;
	addFacebookLikeButton(linkurltest,fbLikeDiv);
	addTweetLikeButton(linkurltest,tweetLikeDiv);
	addgplusLikeButton(linkurltest,gplusdiv);

}

function explorePrimaryLink(url,id)
{
	document.getElementById(id+"image").innerHTML = "<a href='javaScript:void(0)' onClick=\"closePrimaryLink('"+url+"','"+id+"')\"><img src = '" + imagesUrl + "minus-tools.gif' border='0'></a>"
	document.getElementById(id).style.display='block';
	getHtml("/tools/action.do?execute=linkExplorer&url="+encodeURIComponent(url)+"&nextLevel=true","postexplorePrimaryLink",id)  // No I18N
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
		alert('Please enter a valid host name');
		frm.hostName.select();
		return;
	}
	reqTs=new Date();
	requestCount = requestCount + 1;
	getHtmlForForm(frm,"postexploreLinksAccessKeyword",frm,requestCount);  // No I18N

}

function postexploreLinksAccessKeyword(result,frm,requestId)
{
	frm.execute.value="linkExplorer";  // No I18N
	var url = document.getElementById('hostName').value;
	document.getElementById('url').value = url;
	url=trimUrl(url);
	showCommonResultPage(url);
	$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
	hideGroupToolsOptions();
	var elRC=document.getElementById('exploreLinksResultContainer');
	elRC=elRC.children[0].cloneNode(true);
	elRC.setAttribute("id","expLinks"+requestId);
	addResultsToTopElement(elRC);
	$(elRC).show();
	getHtmlForForm(frm,"postExploreLinks",requestId);// No I18N
}

function postExploreLinks(result)
{
	$('#expLinksResultHdr').remove();
	$('#expLinksResult').html(result);
	$('#expLinksResult').show();
}


function getLynxView(frm,ranword)
{
	if(frm.hostName.value=='')
	{
		alert(beanmsg["input_url"]);
		frm.hostName.select();
		return;
	}
	getHtmlForForm(frm,"postgetLynxViewAccessKeyword",frm);  // No I18N
}

function isNumeric(input)
{
	var regexp = /^\d+$/;
	return regexp.test(input);
}

function postgetLynxViewAccessKeyword(result,frm)
{
	frm.execute.value="lynxView";  // No I18N
	var url = document.getElementById('hostName').value;
	url=trimUrl();
	var getUrl = "/tools/action.do?execute=lynxView&url="+url; // No I18N
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
		invalid = getUrlValue(result,'axUrl_invalid'); // No I18N
		if(invalid == 'true')
		{
			document.getElementById('laodingDiv').style.display = 'none';
			document.getElementById('outPutDiv').innerHTML='<br><table width="50%" align="center" border="0" cellspacing="2" cellpadding="2"><tr><td class="message" style="color:red">'+errMsg+'</td></tr></table><br>'
			document.getElementById('outPutDiv').style.display = 'block';
			return false;
		}
		fileName = getUrlValue(result,'axUrl_fileName'); // No I18N
		url = getUrlValue(result,'axUrl_url'); // No I18N
		document.getElementById('laodingDiv').style.display = 'none';
		document.getElementById('outPutDiv').style.display = 'block';
		document.getElementById('resultUrl').innerHTML= url;
	}
}

function setCookie(name,value)
{
	//console.log("setCookie : "+name+" value : "+value);
	value=trimUrl(value);
	setExpireCookie(name,value,1500);
}

function setExpireCookie(name,value,expDays)
{
	var date = new Date();
	date.setTime(date.getTime()+(expDays*24*60*60*1000));
	var expires = "expires="+date.toGMTString();
	value=trimUrl(value);
	document.cookie = name+"="+value+"; "+expires+"; path=/;";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++)
	{
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function setDefaultDomainWebsite(textName,cookieName)
{
	var inputElt=document.getElementById(textName)
	var cookieName=readCookie(cookieName);
	cookieName=trimUrl(cookieName);
	if(cookieName!=null)
	{
		// alert("setDefaultDomainWebsite : "+cookieName+" indexOf
		// "+cookieName.lastIndexOf('://'));
		/*
		 * if(cookieName.lastIndexOf(hp_var)>-1) {
		 * index=cookieName.lastIndexOf(hp_var); $('#popt').val(hp_var);
		 * selectElt.selectedIndex=1; cookieName=cookieName.substring(index+7); }
		 * else if(cookieName.indexOf(hs_var)>-1) {
		 * index=cookieName.lastIndexOf(hs_var); $('#popt').val(hs_var);
		 * selectElt.selectedIndex=1; cookieName=cookieName.substring(index+8); }
		 */
		/*index=cookieName.lastIndexOf('://');
		if(index!==-1)
		{
			cookieName=cookieName.substring(index+3);
		}
		// alert("Cookie Value : "+cookieName);
		*/
		inputElt.value=cookieName;
	}
}

function setDefaultDomain(textName,cookieName)
{
	// console.log("setDefaultDomain : TextField Name : "+textName+" cookie Name
	// : "+cookieName)
	var inputElt=document.getElementById(textName);
	var cookieName=readCookie(cookieName);
	// console.log("setDefaultDomain : Cookie Name : "+cookieName);
	if(cookieName==null || typeof(cookieName)=='undefined')
	{
		console.log("setDefaultDomain : return doing nothing")
		return;
	}
	var cookieStr=cookieName.toString();
	cookieStr=trimUrl(cookieStr);
	// console.log("setDefaultDomain : cookie String : "+cookieStr);
	var aElt=document.createElement("a");
	if(cookieStr.indexOf(hp_var)>-1)
	{
		index=cookieStr.lastIndexOf('://'); // No I18N
		cookieStr=cookieStr.substring(index+3)
	}
	if(cookieStr.indexOf(hs_var)>-1)
	{
		index=cookieStr.lastIndexOf('://'); // No I18N
		cookieStr=cookieStr.substring(index+3)
	}
	// aElt.href=cookieStr;
	inputElt.value=cookieStr;
	// console.log("setDefaultDomain : InputElt.value : "+input.value);
}

function setDefaultSecureWebsite(textName,cookieName)
{
	var inputElt=document.getElementById(textName)
	var cookieValue=readCookie(cookieName);
	cookieValue=trimUrl(cookieValue);
	if(cookieValue!=null)
	{
		if(cookieValue.indexOf(hp_var)>-1)
		{
			index=cookieValue.lastIndexOf("://"); // No I18N
			cookieValue=cookieValue.substring(index+3);
		}
		if(cookieValue.indexOf(hs_var)>-1)
		{
			index=cookieValue.lastIndexOf("://"); // No I18N
			cookieValue=cookieValue.substring(index+3);
		}
		inputElt.value=trimUrl(cookieValue);
	}
}

function selectTextInDiv(divId) {
	//console.log(divId);
	var node = document.getElementById( divId );
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

function formatJson(inputDiv, resultDiv)
{
	var formattedJson = ''
	var jsonString = document.getElementById(inputDiv).value;
	var json = JSON.stringify(JSON.parse(jsonString),null,2);
	json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	formattedJson = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match)
	{
		var cls = 'jsoninteger'; //No I18N
		if (/^"/.test(match)) {
			if (/:$/.test(match)) {
				cls = 'jsonkey'; //No I18N
			} else {
				cls = 'jsonstring'; //No I18N
			}
		} else if (/true|false/.test(match)) {
			cls = 'jsonboolean'; //No I18N
		} else if (/null/.test(match)) {
			cls = 'jsonnull'; //No I18N
		}

		return '<span class="' + cls + '">' + match + '</span>';
	});
	//console.log("Formatted json : "+formattedJson);
	document.getElementById(resultDiv).innerHTML = "<pre style='height:97.5%; outline:none;'>"+formattedJson+"</pre>";
}

function html_formatter(inputValue)
{
	var formattedHtml = ''
	var htmlString = inputValue;
	if(htmlString==""){
		alert("Please give a HTML code.")   //No I18N
	}
	var html = style_html(htmlString);
	//json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	formattedHtml = html.replace(/(<\/?(.|\n|)*?\w*)|(\s*>)|([a-zA-Z0-9_]+\s*=)|((?:'|").*(?:'|"))|([A-Za-z]+\s*)/g, function (match)
	{
		var cls;
		var matchnew;
		matchnew = match.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		if((/&lt;/.test(matchnew))||(/\s*&gt;/.test(matchnew))){
			cls="green";     //No I18N
		}
		else if(/[a-zA-Z0-9_]\s*=+/.test(matchnew)){
			cls="blue";     //No I18N
		}
		else if(/((?:'|").*(?:'|"))/.test(matchnew)){
			cls="red";    //No I18N
		}
		else if(/[A-Za-z]+\s*/.test(matchnew)){
			cls="orange";    //No I18N
		}
		//console.log('<span class="' + cls + '">' + match + '</span>');
		return '<span class="' + cls + '">' + matchnew + '</span>';
	});
	//console.log("Formatted json : "+formattedHtml);
	return formattedHtml;
}
function getIndent(level) {
	var result = '',
		i = level * 4;
	if (level < 0) {
		throw "Level is below 0";     //No I18N
	}
	while (i--) {
		result += ' ';
	}
	return result;
}

function style_html(html) {
	html = html.trim();
	//var sample = html.replace(/&lt;/g,"<");
	//console.log(sample);
	//var samp1 = sample.replace(/&gt;/g,">");
	//console.log(samp1);
	var result = '',
		indentLevel = 0,
		tokens = html.split(/</);
	for (var i = 0, l = tokens.length; i < l; i++) {
		var parts = tokens[i].split(/>/);
		if (parts.length === 2) {
			if (tokens[i][0] === '/') {
				indentLevel--;
			}
			result += getIndent(indentLevel);
			if (tokens[i][0] !== '/') {
				indentLevel++;
			}

			if (i > 0) {
				result += '<';
			}

			result += parts[0].trim() + ">\n";
			if (parts[1].trim() !== '') {
				result += getIndent(indentLevel) + parts[1].trim().replace(/\s+/g, ' ') + "\n";    //No I18N
			}

			if (parts[0].match(/^(img|hr|br)/)) {
				indentLevel--;
			}
		} else {
			result += getIndent(indentLevel) + parts[0] + "\n";
		}
	}
	return result;
}

function html_markupvalidator(inputText){
	var html = inputText;
	if(html==""){
		alert("Please Enter a HTML code.")    //No I18N
	}
	else{
		$.htmlValidator.doctypes;
		$.htmlValidator.doctype("HTML 4.01 Strict");    //No I18N
		$.htmlValidator.parseSettings();
		$.htmlValidator.parseSettings({});
		$.htmlValidator.parseSettings({url: ""});
		$.htmlValidator.parseSettings({html: html});
		$.htmlValidator.parseSettings({fragment: $("div")});
		$.htmlValidator.parse({doctype: "HTML 4.01 Frameset", html: html});     //No I18N
		//document.getElementById("outputHTML").value = ($.htmlValidator.validate({doctype: "HTML 4.01 Transitional", html: html}));
		var result = $.htmlValidator.validate({doctype: "HTML 4.01 Transitional", html: html});   //No I18N
		if(result==""){
			return "Your code is correct"     //No I18N
		}
		else{
			return result;
		}
	}
}

function setFocusOnDiv(divId){
	var div = document.getElementById(divId);
	div.onfocus = function() {
		window.setTimeout(function() {
			var sel, range;
			if (window.getSelection && document.createRange) {
				range = document.createRange();
				range.selectNodeContents(div);
				range.collapse(true);
				sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			} else if (document.body.createTextRange) {
				range = document.body.createTextRange();
				range.moveToElementText(div);
				range.collapse(true);
				range.select();
			}
		}, 1);
	};
	div.focus();
}

function formatXml(xmlContent, resultDiv) {
	var errorDiv1 = (document.getElementById("result")) ? 'result' : 'errorContainer';  // No I18N
	try
	{	

		if(xmlContent == "")
		{
			document.getElementById(errorDiv1).innerHTML = "Please enter a XML content"; //No I18N
			errorSelection(errorDiv1);
			return;
		}
		document.getElementById(errorDiv1).innerHTML = "";
	}
	catch(e)
	{
		//console.log("Exception message : "+e.message);
		document.getElementById(errorDiv1).innerHTML = e.message;
		errorSelection(errorDiv1);
	}
	var formattedXml = document.getElementById(resultDiv),
		cp = '';

	cp = cp.replace(/\'/g, '').replace(/\"/g, '');

	if (!isNaN(parseInt(cp))) { // argument is integer
		cp = parseInt(cp);
	} else {
		cp = cp ? cp : 4;
	}
	validateXML(xmlContent, errorDiv1); //No I18N
	formattedXml.innerHTML =  "<pre style='word-wrap: normal;white-space: pre;'>"+vkbeautify.xml(xmlContent,cp)+"</pre>";
	setFocusOnDiv(resultDiv);
}

function errorSelection(errorDiv1){
	if (errorDiv1 == 'result') {
		document.getElementById(errorDiv1).className = "toolsResultTextRed"; //No I18N
	}else{
		document.getElementById(errorDiv1).style.display = "block"; //No I18N
	}
}

function validateXML(xmlContent, errorDiv1) {
	var errorDiv = document.getElementById(errorDiv1);
	//console.log("XML content : "+xmlContent);
	if (xmlContent.indexOf("<") == -1){
		errorDiv.innerHTML = "Please enter a valid XML"; //No I18N
		errorSelection(errorDiv1);
		return 0;
	}
	// code for IE
	if (window.ActiveXObject) {
		var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = false;
		xmlDoc.loadXML(xmlContent);
		if (xmlDoc.parseError.errorCode != 0) {
			txt = "Error Code: " + xmlDoc.parseError.errorCode + "\n"; //No I18N
			txt = txt + "Error Reason: " + xmlDoc.parseError.reason; //No I18N
			txt = txt + "Error Line: " + xmlDoc.parseError.line; //No I18N
			errorDiv.innerHTML = "The XML content contains mismatched tags."; //No I18N
			errorSelection(errorDiv1);
		}
	}
	// code for Mozilla, Firefox, Opera, etc.
	else if (document.implementation.createDocument) {
		try {
			var text = xmlContent;
			var parser = new DOMParser();
			var xmlDoc = parser.parseFromString(text, "application/xml"); //No I18N
		} catch (err) {
			errorDiv.innerHTML = "The XML content contains mismatched tags."; //No I18N
			errorSelection(errorDiv1);
		}
		if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
			parseErrorElement = xmlDoc.getElementsByTagName("parsererror")[0];
			errorDiv.innerHTML = "The XML content contains mismatched tags."; //No I18N
			errorSelection(errorDiv1);
		}
	} else {
		errorDiv.innerHTML = 'Your browser cannot handle XML validation'; //No I18N
	}
}

function RequestURL(url, callback, ExtraData) {
	var httpRequest;
	if (window.XMLHttpRequest) { // Mozilla, Safari, ...
		httpRequest = new XMLHttpRequest();
		if (httpRequest.overrideMimeType) {
			httpRequest.overrideMimeType('text/xml'); //No I18N
		}
	} else if (window.ActiveXObject) { // IE
		try {
			httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}
	if (!httpRequest) {
		return false;
	}
	httpRequest.onreadystatechange = function() {
		callback(httpRequest, ExtraData);
	};
	httpRequest.open('GET', url, true);
	httpRequest.send('');
	return true;
}

function LoadXML(ParentElementID, URL) {
	var xmlHolderElement = GetParentElement(ParentElementID);
	if (xmlHolderElement == null) {
		return false;
	}
	return RequestURL(URL, URLReceiveCallback, ParentElementID);
}

function formatSql(sqlStatement, resultDiv) {
	var errorDiv1 = document.getElementById("result") ? 'result' : 'errorContainer'; //No I18N
	try
	{
		if(sqlStatement == "")
		{
			document.getElementById(errorDiv1).innerHTML = "Please enter a SQL statement"; //No I18N
			errorSelection(errorDiv1);
			return;
		}
		document.getElementById(errorDiv1).innerHTML = "";
	}
	catch(e)
	{
		//console.log("Exception message : "+e.message);
		document.getElementById(errorDiv1).innerHTML = e.message;
		errorSelection(errorDiv1);
	}
	var formattedSql = document.getElementById(resultDiv),
		cp = '';

	cp = cp.replace(/\'/g, '').replace(/\"/g, '');

	if (!isNaN(parseInt(cp))) { // argument is integer
		cp = parseInt(cp);
	} else {
		cp = cp ? cp : 4;
	}
	formattedSql.innerHTML =  "<pre style='word-wrap: normal;white-space: pre;font-weight: bold;font-size:13px;color:#1b9c1b;'>"+vkbeautify.sql(sqlStatement,cp)+"</pre>";
	setFocusOnDiv(resultDiv);
}

////////////////////////// Website Comparison changes ////////////////////////

function getWebsiteMetrics(frm,ranword)
{
	reqTs=new Date();
	globalToolType = 'WEBSITE-COMPARE'; // No I18N
	doToolsTest(frm,ranword,globalToolType);
}

function showWebsiteComparisonResultPage(url,reqId)
{
	showCommonResultPage(url);
	$('#id_result_graph_space').show();
	$('.grptext').show();
	$('#website_comp_header_templ').show();
}

function postwebsitecomparisondetails(result,url,selectedLocations,reqId)
{
	// This method will be called twice for reqId 2 and 3. It will generate two tables.
	// Below check is to prevent that
	if(reqId == 2)
	{
		showWebsiteComparisonResultPage(url,reqId);
	}
	for (var i=0; i<selectedLocations.length; i++)
	{
		if(reqId == 2)
		{
			addWebsiteComparisonLocationLoadingRow(selectedLocations[i].value,reqId);
		}
		var form=document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("name","WebSiteLocationTest");
		form.setAttribute("action", "/tools/general/simpleTest.do");
		form.appendChild(getnewFormElement("hidden","method","doWebsiteTest")); // No I18N
		form.appendChild(getnewFormElement("hidden","locationid",selectedLocations[i].value)); // No I18N
		form.appendChild(getnewFormElement("hidden","url",url)); // No I18N
		form.appendChild(getnewFormElement("hidden","toolname","website-compare")); // No I18N
		form.appendChild(getnewFormElement("hidden","timestamp",timestamp)); // No I18N
		form.appendChild(getnewFormElement("hidden","requestId",reqId)); // No I18N
		document.body.appendChild(form);
		getHtmlForForm(form,"postWebsiteComparisonResponse",selectedLocations[i].value,selectedLocations.length,reqId);
	}

}

function postWebsiteComparisonResponse(result,locid,selectedLocationslength,reqId)
{
	availRespCount[reqId] = availRespCount[reqId] + 1;

	if(result.length==0)
	{
		// Update as timed out.
		var locName=$('li input[value="'+locid+'"]').parent().text();
		// console.log("empty postResponse message received for location :
		// "+locid+" Location Name : "+locName);
		result="#ax_dnsResolvedtime=0&ax_responsetime=0&ax_locname="+locName+"&ax_downloadtime=0&ax_resolvedIp=&ax_firstdownload=0&ax_sizeinstring=0 KB&ax_firstBytetime=0&ax_availability=0&ax_responsecode=TIMED-OUT&ax_url=YourDomain.com&ax_reason=TIMED-OUT&ax_connectiontime=0&"; // No I18N
		// return 0;
	}
	if(result.match("locid")!=-1)
	{
		var timeoutHandle=timeoutHandleaArray[locid];
		clearTimeout(timeoutHandle);
		// console.log("Clearing timeout since response has already been received
		// Location : "+locid);
		var responsetime = getValue(result,'ax_responsetime_'+reqId); // No I18N
		var responsecode = getValue(result,'ax_responsecode_'+reqId); // No I18N
		var reason=getValue(result,'ax_reason_'+reqId); // No I18N
		var availability=getValue(result,'ax_availability_'+reqId); // No I18N
		var resolvedIP=getValue(result,'ax_resolvedIp_'+reqId); // No I18N
		var dnsResolvedtime=getValue(result,'ax_dnsResolvedtime_'+reqId); // No I18N
		var firstBytetime=getValue(result,'ax_firstBytetime_'+reqId); // No I18N
		var downloadtime=getValue(result,'ax_downloadtime_'+reqId); // No I18N
		var connectiontime=getValue(result,'ax_connectiontime_'+reqId); // No I18N
		var contentLength=getValue(result,'ax_sizeinstring_'+reqId); // No I18N
		var availabilityimage=imagesUrl + "down_icon.gif"; // No I18N
		var firstdownload=getValue(result,'ax_firstdownload_'+reqId); // No I18N
		var url=getValue(result,'ax_url_'+reqId); // No I18N
		var locname = getValue(result,'ax_locname_'+reqId); // No I18N


		// var locations=document.getElementById("locationid").value;
		var locations=locid;
		if(locations_url_response=="")
		{
			for(var i=0;i<selectedLocationslength;i++)
			{
				locations=locations.replace(",","locid=");
			}
			locations_url_response="locid="+locations; // No I18N
		}
		// var conTimeValue = parseInt(dnsResolvedtime) + parseInt(connectiontime);
		var ttfbValue =firstBytetime;
		var ttlbValue = Math.abs(parseInt(responsetime)-(parseInt(connectiontime)+parseInt(firstBytetime)+parseInt(dnsResolvedtime)));
		// var locations=document.getElementById("locationid").value;
		var conTimeValue=connectiontime;
		if(reason=="OK")
		{
			responsecode=reason;
			if(topdivdata)
			{
				topdivdata=false;
				var urltrim=$.trim(url);
				var urllen=urltrim.length;
				if(urllen >33)
				{
					var sliceurl=urltrim.slice(0,33);
					$('#id_url').html('Result URL: '+sliceurl+'.....'); // No I18N
					$('#id_url').attr('title',url); // No I18N
				}
				else
				{
					$('#id_url').html('Result URL: '+url);
				}
				$('#id_loadtime').html('Load Time: '+getDatediff(reqTs,new Date()));
				var dateStr=getDateString(true);
				$('#id_reqtime').html('Tested on: '+dateStr);
			}
			$('#id_locn'+reqId+""+locid).text(locname);
			$('#id_fb'+reqId+""+locid).text(getLocaleFormattedNumber(firstBytetime));
			$('#id_fb'+reqId+""+locid).css("text-align","center");// No I18N
			$('#id_lb'+reqId+""+locid).text(getLocaleFormattedNumber(ttlbValue));
			$('#id_lb'+reqId+""+locid).css("text-align","center");// No I18N
			$('#id_respt'+reqId+""+locid).text(getLocaleFormattedNumber(responsetime));
			$('#id_respt'+reqId+""+locid).css("text-align","center");// No I18N
		}
		else
		{
			// console.log("Inside else : reason :: "+result);
			if(responsetime==="0")
			{
				$('#id_locn'+reqId+""+locid).text(locname);
				$('#id_fb'+reqId+""+locid).remove();
				$('#id_lb'+reqId+""+locid).remove();
				$('#id_size'+reqId+""+locid).remove();
				$('#id_respt'+reqId+""+locid).width($('#domain1').width());// No I18N
				$('#id_respt'+reqId+""+locid).text(reason); // No I18N
			}
			else {
				$('#id_fb'+reqId+""+locid).text(getLocaleFormattedNumber(firstBytetime));
				$('#id_lb'+reqId+""+locid).text(getLocaleFormattedNumber(ttlbValue));
				$('#id_respt'+reqId+""+locid).text(getLocaleFormattedNumber(responsetime));
			}
		}
	}
}

function addWebsiteComparisonLocationLoadingRow(locationId,reqId)
{
	var locationName=$("input[value='"+locationId+"']").parent().text();
	if(locationName.indexOf(",")>0)
	{
		locationName=locationName.substr(0,locationName.indexOf(","));
	}
	var resultRowTemplate=document.getElementById('website_comp_row_templ');
	var resultappendRow=document.getElementById('websitecomparison');//resultappend');
	var locLoadingDiv=document.createElement("div");
	locLoadingDiv.setAttribute("class",resultRowTemplate.getAttribute("class"));
	locLoadingDiv.setAttribute("style","width: 998px; height: 30px; display: none;");
	var rowHtml=resultRowTemplate.innerHTML;
	rowHtml=rowHtml.replace("LOCATION_NAME",LOCATION_LIST[locationId]+' '+('<img style="" src="" + animImage + ""/>'));
	rowHtml=rowHtml.replace("id_locn","id_locn"+reqId+""+locationId);
	rowHtml=rowHtml.replace("id_fb2","id_fb2"+locationId);
	rowHtml=rowHtml.replace("id_lb2","id_lb2"+locationId);
	rowHtml=rowHtml.replace("id_respt2","id_respt2"+locationId);
	rowHtml=rowHtml.replace("id_fb3","id_fb3"+locationId);
	rowHtml=rowHtml.replace("id_lb3","id_lb3"+locationId);
	rowHtml=rowHtml.replace("id_respt3","id_respt3"+locationId);
	locLoadingDiv.innerHTML=rowHtml;
	resultappendRow.appendChild(locLoadingDiv);
	resultappendRow.style.display='block';
	locLoadingDiv.style.display='block';
}

function addTraceRouteLoadingRow(locationId,reqId)
{
	var locationName=$("input[value='"+locationId+"']").parent().text();
	if(locationName.indexOf(",")>0)
	{
		locationName=locationName.substr(0,locationName.indexOf(","));
	}
	var resultRowTemplate=document.getElementById('website_comp_row_templ');
	var resultappendRow=document.getElementById('websitecomparison');//resultappend');
	var locLoadingDiv=document.createElement("div");
	locLoadingDiv.setAttribute("class",resultRowTemplate.getAttribute("class"));
	locLoadingDiv.setAttribute("style","width: 998px; height: 30px; display: none;");
	var rowHtml=resultRowTemplate.innerHTML;
	rowHtml=rowHtml.replace("LOCATION_NAME",LOCATION_LIST[locationId]+' '+('<img style="" src="" + animImage + ""/>'));
	rowHtml=rowHtml.replace("id_locn","id_locn"+reqId+""+locationId);
	rowHtml=rowHtml.replace("id_fb2","id_fb2"+locationId);
	rowHtml=rowHtml.replace("id_lb2","id_lb2"+locationId);
	rowHtml=rowHtml.replace("id_respt2","id_respt2"+locationId);
	rowHtml=rowHtml.replace("id_fb3","id_fb3"+locationId);
	rowHtml=rowHtml.replace("id_lb3","id_lb3"+locationId);
	rowHtml=rowHtml.replace("id_respt3","id_respt3"+locationId);
	locLoadingDiv.innerHTML=rowHtml;
	resultappendRow.appendChild(locLoadingDiv);
	resultappendRow.style.display='block';
	locLoadingDiv.style.display='block';
}

function decodeHtml(encodedStr) {
	var parser = new DOMParser(); //No i18N
	var dom = parser.parseFromString(
		'<!doctype html><body>' + encodedStr, //No i18N
		'text/html'); //No i18N

	return dom.body.textContent;
}

///////////////////////// Website Comparison Changes /////////////////////////
