// $Id$
var rq = new Array();
var paramsArr = new Array();

function importxml(url,f, paramsObj) {
    return handleRequest(url,f, paramsObj);
}
function importxmlForForm(formElem,f, paramsObj) {
	if(!paramsObj) {
		paramsObj = '';
	}
    	return handleRequest(formElem.action,f, paramsObj, formElem);
}
function handleRequest( u, f, paramsObj, formElem) {
        loadon();
	u += ( ( u.indexOf('?') + 1 ) ? '&' : '?' ) + "ct="+ ( new Date() ).getTime();
	if( window.XMLHttpRequest /*&&  !window.ActiveXObject*/) {
		var xmlObject = getXmlObj();
		rt = rq.length;
		rq[rt] = xmlObject;
		var paramsLen = paramsArr.length;
		paramsArr[paramsLen] = paramsObj;
		rq[rt].onreadystatechange = new Function( 'if( rq['+rt+'].readyState == 4 && rq['+rt+'].status < 300 ) { '+f+'(rq['+rt+'].responseXML, paramsArr['+ paramsLen +']); loadoff();}' ); // jshint ignore:line
		if(formElem) {
			handleForm(rq[rt], u, formElem);
		} else {
			rq[rt].open("GET", u, true);
			rq[rt].send(null);
		}
		return true;
        }
	if( !navigator.__ice_version && window.ActiveXObject ) {
		try {	
			var xmlObject = getXmlObj(formElem);
			rt = rq.length
			rq[rt] = xmlObject;
			var paramsLen = paramsArr.length;
			paramsArr[paramsLen] = paramsObj;
			rq[rt].onreadystatechange = new Function( 'if( rq['+rt+'].readyState == 4) {var toSend = rq['+rt+']; if(rq['+rt+'].responseXML) {toSend = rq['+rt+'].responseXML} '+f+'(toSend, paramsArr['+ paramsLen +']); loadoff();}' ); // jshint ignore:line
			if(formElem) {
				handleForm(rq[rt], u, formElem);
			} else {
			   rq[rt].load(u);
			}    
			return true;
		} catch(e) {alert(e)}
        }
	return false;
}

function handleForm(req, u, formElem) {
    var nvp = getFormQS(formElem);
    req.open('POST', u, true);
    req.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8");

    var locale = getLocaleFromUrl();
    if (locale) {
        req.setRequestHeader("Accept-Language", locale);
	}
    //req.setRequestHeader("Content-length", nvp.length);
    req.send(nvp);
}

function getLocaleFromUrl() {
    var regex = /\/([a-z]{2})\/tools\/(.*)\.html/g;
	var uri = window.location.pathname;
    while ((m = regex.exec(uri)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        return m[1];
    }
}

function timeoutTask(xmlhttp,formElem) 
{
	if(formElem.name=="WebSiteLocationTest")
	{
		var locationId=formElem.elements['locid'].value; // jshint ignore:line
		//alert("timeoutTask :: called with argument : "+locationId);
		//console.log("Aborting ajax since timeout has been reached : "+locid);
		xmlhttp.abort();
	}
}

function getFormQS(frm) {
	var qs="";
	for(var c = 0 ; c < frm.elements.length ; c++) {
		var el = frm.elements.item(c);  // [];
		switch(el.type) {
			case "textarea":
			case "hidden":
			case "text":
				//alert(el.type);
				qs+=el.name+"="+encodeURIComponent(el.value)+"&";
				break;
			case "select-one":
				sv = el.options[el.selectedIndex].value;
				qs+=el.name+"="+encodeURIComponent(sv)+"&";
				break;
			case "select-multiple":
				ss = ""
				for(var so = 0 ; so < el.options.length ; so++) {
					if(el.options[so].selected == true) {
						ss+=(ss=="")?"":"&"
							sv = el.options[so].value;
						ss+=el.name+"="+encodeURIComponent(sv);
					}
				}
				ss+=(ss=="")?"":"&"
				qs+=ss;
				break;
			case "radio":
			case "checkbox":
				if(el.checked == true) {
					qs+=el.name+"="+encodeURIComponent(el.value)+"&";
				}
				break;
			default:
				qs+=el.name+"="+encodeURIComponent(el.value)+"&";
		}
	}
	qs = qs.substr(0,(qs.length - 1));
	return qs;
}

function loadoff() {
	var loading = document.getElementById('loading');
	if(loading) {
		loading.style.display = 'none';
	}
}
function loadon() {
	var loading = document.getElementById('loading');
	if(loading) {
		loading.style.display = 'block';
	}
}

function getXmlObj(formElem) {
	var xmlObject = null;
   	if(document.all) {
		var xmlObject = null;
		if(window.XMLHttpRequest){
           	xmlObject=new XMLHttpRequest();
       		}else{ 
		
		if(!formElem) {
			try { 
				xmlObject = new ActiveXObject('Microsoft.XMLDOM');
			} catch(e) {}
		}
		if(xmlObject == null) {
			try { 
				xmlObject = new ActiveXObject('Msxml2.XMLHTTP');
			} catch(e) {}
		}
		if(xmlObject == null) {
			try { 
				xmlObject = new ActiveXObject('Microsoft.XMLHTTP'); 
			} catch(e) {
				throw new Exception('Browser not supported');
			}
		}
		}
	} else {
		xmlObject = new XMLHttpRequest();
	}
	return xmlObject;
}

function getHtmlForFormWith2Args(formElem,f, paramsObj1, paramsObj2) {
	if(!paramsObj1) {
		paramsObj1 = '';
	}
        if(!paramsObj2) {
                paramsObj2 = '';
        }
    	return getHtmlWith2Args(formElem.action,f, paramsObj1,paramsObj2,formElem);
}

function getHtmlForForm(formElem,f, paramsObj1, paramsObj2,paramsObj3) {
	//alert("Inside getHtmlForForm with 3 args :: Arg Count = "+arguments.length);
	if(arguments.length==4)
	{
		return getHtmlForFormWith2Args(arguments[0],arguments[1],arguments[2],arguments[3]);
	}
	if(!paramsObj1) {
		paramsObj1 = '';
	}
    if(!paramsObj2) {
            paramsObj2 = '';
    }
	if(!paramsObj3) {
            paramsObj3 = '';
    }
    return getHtml(formElem.action,f, paramsObj1,paramsObj2,paramsObj3,formElem);
}

function getHtmlWith1Args(url, fn, paramsObj, formElem) {
	getHtmlWith2Args(url, fn, paramsObj, '',formElem)
}

function getHtmlWith2Args(url, fn, paramsObj1,paramsObj2, formElem) {
	//alert("Inside getHtml with 2 args :: Arg Count = "+arguments.length);
	return getHtml(url,fn,paramsObj1,paramsObj2,'',formElem);
}

function getHtml(url, fn,  paramsObj1,paramsObj2,paramsObj3,formElem) {
	//alert("Inside getHtml with 3 args :: Arg Count = "+arguments.length);
	if(arguments.length==5)
	{
		return getHtmlWith2Args(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);
	}
	else if(arguments.length==4)
	{
		return getHtmlWith1Args(arguments[0],arguments[1],arguments[2],arguments[3]);
	}
	url += ( ( url.indexOf('?') + 1 ) ? '&' : '?' ) +"ct="+ ( new Date() ).getTime();
	var xmlObject = null;
	if( window.XMLHttpRequest ) {
		xmlObject = getXmlObj(true);
	} else if( !navigator.__ice_version && window.ActiveXObject ) {
		//xmlObject = getXmlObj(formElem);
		xmlObject = getXmlObj(true);
		
	} else {
		return false;
	}

	rt = rq.length
	rq[rt] = xmlObject;
	var paramsLen = paramsArr.length;
	paramsArr[paramsLen] = paramsObj1;
    paramsArr[paramsLen+1] = paramsObj2;
	paramsArr[paramsLen+2] = paramsObj3;
  	if (xmlObject) {
	    rq[rt].onreadystatechange = new Function( ' if (rq[' + rt +'].readyState==4) { ' + fn + '(rq[' + rt +'].responseText, paramsArr[' + paramsLen + '], paramsArr[' + (paramsLen+1) + '], paramsArr['+(paramsLen+2)+']) }'); // jshint ignore:line
		if(formElem) {
			handleForm(rq[rt], url, formElem);
		} else {
		    rq[rt].open('GET', url, true);
		    rq[rt].setRequestHeader("Content-type","text/html");
		    //rq[rt].setRequestHeader("Content-length", 0);
		    rq[rt].send(null);
		}
    }
    return true;
}

/* $Id$ */

var runtime = false;
var appid = null;
var pageId = null;
var dobArr = new Array();
var pageNameArr = new Array();
var tabXml = null;
var pageLoading = false;
var selectedPid = null;
var plainTextContent = null;
var editData=false;

function initObj(aid, pid, rtime,editDat) {  
	initObjs();
	runtime = rtime;
	appid = aid;
	pageId = pid;
	editData=editDat;
	if(runtime == false) {
		addtopopup('formcomp');
	}
	buildTabs();
	initPage();
}

function initObjs() {
	dobArr = new Array();
	dobArr['D1'] = new DataObject();
	dobArr['DP'] = new DataObject();
	dobArr['D2'] = new DataObject();
	dobArr['D3'] = new DataObject();
}

function reloadFullPage() {
	showPage(pageId);
}

function resetStatus() {
	var ele=document.getElementById('status');
	ele.style.display="none";
}

function showTab(linkElem, str) {
	resetStatus();
	var id = linkElem.id;
	var pid = id.substring(0, id.indexOf(str));
	if(pid == '') {
		pid = selectedPid;
	}
	showPage(pid);
}

function showPage(pid) {
	initObjs();
	if(pageLoading == true) {
		return;
	}
	try {
		removeAllOpenedAreas();
	} catch(ee) {}
	loadTab(pid);
	fillTabs(pid);
	initPage();
}

function loadTab(pid) {
	//alert(pid);
	var maintableElem = document.getElementById('maintable');
	var relems = maintableElem.rows;
	var len = relems.length;
	for(var i=len-1; i>=0; i--) {
		var toRem = relems.item(i);
		if(toRem.id == 'main_startrow' || toRem.id == 'main_createrow' || toRem.id == 'main_endrow') {
			continue;	
		}
		maintableElem.removeChild(toRem);
	}
	setPageId(pid);
}


function buildTabs() {
	importxml('/tabDetails.do?aid=' + appid + '&pid=' + pageId, "loadTabs");
}

function initPage() {
	pageLoading = true;
	//alert(pageId);
	var url = '/pageDetails.do?pageid=' + pageId +'&appid=' + appid + '&deploy=' + isRuntime();
	//alert(url);
	importxml(url,"loadDataObjects");
}

function loadTabs(xml) {
	tabXml = xml;
	fillTabs();
}


function fillTabs(selpid) {
	//alert('here');
	pageNameArr = new Array();
	var selEditTdElem = document.getElementById('editseltab');
	if(!selEditTdElem) {
		selEditTdElem = document.getElementById(selectedPid + 'editseltab');
	}
	//var selDeletetabElem = document.getElementById('deletetab');
	//if(!selDeletetabElem) {
		//selDeletetabElem = document.getElementById(selectedPid + 'deletetab');
	//}
	var selLinkElem = document.getElementById('editselshowtablink');
	if(!selLinkElem) {
		selLinkElem = document.getElementById(selectedPid + 'editselshowtablink');
	}
	var pagenameinformElem = document.getElementById('pagenameinform');
	var delTabformElem = document.getElementById('delTabId');
	
	//alert(selEditTdElem);
	var toptabrowElem = document.getElementById('toptabrow');
	var cn = toptabrowElem.cells;
	var len = cn.length ;
	for(var i=len-1; i>0; i--) {
		toptabrowElem.removeChild(cn.item(i));
	}
	var tabsNode = tabXml.childNodes[0];
	var cnodes = tabsNode.childNodes;
	for(var x=0;x<cnodes.length;x++) {
		tabNode = cnodes[x];
		tncnodes = tabNode.childNodes;
		var pid = null;
		var pname = null;
		var desc = '';
		var selected = 'false';
		for(var y=0;y<tncnodes.length;y++) {
			nodeName = tncnodes[y].nodeName;
			//alert(nodeName);
			nv = '';
			try {
				nv = tncnodes[y].childNodes[0].nodeValue;
			} catch(ee) {}
			switch (nodeName) {
				case 'id':
					pid = nv;
					break;
				case 'name':
					pname = nv;
					break;
				case 'desc':
					desc = nv;
					break;
				case 'selected':
					selected = nv;
					break;
				default :
			}
		}
		if(selpid) {
			selected = 'false';
			if(selpid == pid) {
				selected = 'true';
			}
		}
		
		pageNameArr[pageNameArr.length] = pname;
		var tdElem = null;
		var linkElemId = null;
		var id = null;
		var editselId = null;
		if(selected == 'true') {
			if(isRuntime() == true) {
				id = 'livesampleseltab';
 				linkElemId = 'liveselshowtablink';
			} else {
				//selDeletetabElem.id = pid + 'deletetab';
				editselId = pid;
				pagenameinformElem.origpname.value = pname;
				pagenameinformElem.pageid.value = pid;
				pagenameinformElem.tabname.value = pname;
				pagenameinformElem.tabdesc.value = desc;
				delTabformElem.pageid.value = pid;

				selEditTdElem.id = pid + 'editseltab';
				
				linkElem = selLinkElem;
 				tdElem = selEditTdElem;
			}
		} else {
			id = 'sampletab';
			linkElemId = 'showtablink';
		}
		if(editselId == null) {
			linkElem = document.getElementById(linkElemId);
			linkElem.id = pid + linkElemId;
			tdElem = document.getElementById(id);
			tdElem.id = pid + id;
		}
		
		linkElem.title = desc;
		removeAllChildNodes(linkElem);
		linkElem.appendChild(document.createTextNode(pname));
		if(editselId == null) {
			toptabrowElem.appendChild(tdElem.cloneNode(true));
			tdElem.id = id;
			linkElem.id = linkElemId;
		} else {
			toptabrowElem.appendChild(tdElem);
			selectedPid = editselId;
		}
		
	}
}




function loadDataObjects(xml) {
	var dd = mergePageDob(xml);
	if(dd == null) {
		alert('An unexpected error occured. This page will not work further as expected. \nKindly delete this page.');
		pageLoading = false;
		return;
	}
	//alert(dd.constructXML());
	//alert(getPageDob().constructXML());
	loadPage();
}

function mergePageDob(xml) {
	if(xml == null || xml.childNodes == null) {
		return null;
	}
	var rootNode = xml.childNodes[0];
	var nodeList = rootNode.childNodes;
	var tempPageDob = null;
	for(var k=0;k<nodeList.length;k++) {
		var node = nodeList.item(k);
		if(node.nodeType==1) { //  meaning element node
			var children = node.childNodes;
			if(node.nodeName == "Data") {
				for(var x=0;x<children.length;x++) {
					var dobnode = children.item(x);
					if(dobnode.nodeType == 1) {
						var dobName = dobnode.nodeName;
						if(dobName == 'D1') {
							tempPageDob = transform(dobnode);
						} else {
							dobArr[dobName] = transform(dobnode);
						}
					}
				}
			} else if(node.nodeName == "DeleteData") {
				for(var x=0;x<children.length;x++) {
					var dobnode = children.item(x);
					if(dobnode.nodeType == 1) {
						var dobName = dobnode.nodeName;
						if(dobName == 'D1') {
							if(tempPageDob == null) {
								tempPageDob = new DataObject();
							}
							transformDeleteNode(tempPageDob, dobnode);
						}
					}
				}
			}
		}
	}
	if(tempPageDob != null) {
		getOrigPageDob().merge(tempPageDob);
		dobArr['D1'] = new DataObject();
		getPageDob().clone(getOrigPageDob());
	}
	return tempPageDob;
}



function loadPage() {
	var pageCompRows = getPageDob().getRows("Page_Component.TABLE","Page_Component.PAGE_ID",getPageId());
	for(var index in pageCompRows) {
		var tempArr = new Array();
		tempArr["Form.FORM_ID"] = pageCompRows[index]['Page_Component.PAGE_COMPONENT_ID'];
		var rows = getOrigPageDob().getRowsForCriteria("Form.TABLE", tempArr);
		if(rows.length>0) {	
			addNewForm(pageCompRows[index]['Page_Component.PAGE_COMPONENT_ID']);
		} else {
			var tempArr1 = new Array();
			tempArr1["AppCreator_Views.VIEW_ID"] = pageCompRows[index]['Page_Component.PAGE_COMPONENT_ID'];
			var viewRows = getOrigPageDob().getRowsForCriteria("AppCreator_Views.TABLE", tempArr1);
			if(viewRows.length>0) {
				addNewView(pageCompRows[index]['Page_Component.PAGE_COMPONENT_ID']);
			}
		}
     }
     pageLoading = false;
}

function setDataInPage(dobname,data)
{
	dobArr[dobname] = data;
}
// adding a new form
function addNewForm(formid) {
	var ih = getHTMLForForm(getPageDob(), formid, isRuntime(),'formadd');   // form.js
	var trelem = document.createElement('tr');
	var tdelem = document.createElement('td');
	tdelem.setAttribute('align', 'left');
	tdelem.setAttribute('valign', 'top');
	tdelem.innerHTML = ih;
	trelem.appendChild(tdelem);
	var maintable = document.getElementById('maintable');
	maintable.insertBefore(trelem, document.getElementById('main_createrow'));
	var newRowAfterForm = document.getElementById('newRowAfterForm');
	newRowAfterForm.id = formid + 'newRowAfterForm';
	maintable.insertBefore(newRowAfterForm.cloneNode(true), document.getElementById('main_createrow'));
	//setCalender();
	newRowAfterForm.id = 'newRowAfterForm';
	if(document.all) {
	    setNameProperty(formid,getPageDob());
	}
}

function addNewView(viewid) 
{
	var viewRow=getPageDob().getRow('AppCreator_Views.TABLE','AppCreator_Views.VIEW_ID',viewid);
	var pageSize=viewRow['AppCreator_Views.PAGE_SIZE'];	
	if(!pageSize)
	{
		pageSize=10;
	}
	var ih = getHTMLForView(getPageDob(), getViewMetaDob(), viewid, isRuntime(), isEditData(),pageSize,"1",pageSize); // view.js
	var trelem = document.createElement('tr');
	var tdelem = document.createElement('td');
	tdelem.setAttribute('align', 'left');
	tdelem.setAttribute('valign', 'top');
	tdelem.innerHTML = ih;
	tdelem.id=viewid+"viewEditTd";
	trelem.appendChild(tdelem);
	var maintable = document.getElementById('maintable');
	maintable.insertBefore(trelem, document.getElementById('main_createrow'));

	var newRowAfterForm = document.getElementById('newRowAfterForm');
	newRowAfterForm.id = viewid + 'newRowAfterForm';
	maintable.insertBefore(newRowAfterForm.cloneNode(true), document.getElementById('main_createrow'));
	newRowAfterForm.id = 'newRowAfterForm';
	if(runtime)
	{
		fillCalendar(viewid);
	}
	if(viewRow) {
		if(viewRow['AppCreator_Views.IS_CALENDAR'] == 'true') {
			//alert('sdd');
			return;
		}
	}
	if(isRuntime())
	{
		var fromIndex="1";
		var startIndexElem=document.getElementById(viewid+"start");
		startIndexElem.innerHTML=fromIndex;
		var endIndexElem=document.getElementById(viewid+"end");
		
		var pageSizeElem=document.getElementById(viewid+"pageSize");
		var dataDOB=getDataDob(viewid);
		if(dataDOB)
		{
			endIndexElem.innerHTML="0";
		}
		var theOptions=pageSizeElem.options;
		/*for(var index1 in theOptions)
		{
			var nextOption=theOptions.namedItem(index1);
			if(parseInt(nextOption.value,10)==parseInt(pageSize,10))
			{
				nextOption.selected=true;
			}
		}*/
		for (var i=0;i<theOptions.length;i++)
		{
			var nextOption=theOptions.item(i);
			if(parseInt(nextOption.value,10)==parseInt(pageSize,10))
			{
				nextOption.selected=true;
			}
		}
		var totalCountElem=document.getElementById(viewid+"total");
		var	totalCount=totalCountElem.innerHTML;
		if(totalCount=="")
		{
			totalCount=0;
		}
		if(parseInt(totalCount,10)< parseInt(pageSize,10))
		{
			endIndexElem.innerHTML=totalCount;
		}else
		{
			endIndexElem.innerHTML=pageSize;
		}
		if(parseInt(totalCount,10)==0)
		{
				startIndexElem.innerHTML=totalCount;
				endIndexElem.innerHTML=totalCount;
		}
		var nextElement=document.getElementById(viewid+"nextEnabled");
		var lastElement=document.getElementById(viewid+"lastEnabled");
/*		var nextDisElement=document.getElementById(viewid+"nextDisabled");
		var lastDisElement=document.getElementById(viewid+"lastDisabled");*/
		
		if(parseInt(pageSize,10)>=parseInt(totalCount,10))
		{
			/*nextElement.style.display="none";
			nextElement.disabled=true;
			nextDisElement.style.display="block";
			//nextDisElement.disabled=false;*/
			var nextImage=document.getElementById(viewid+'nextimg');
			nextImage.src="/appcreator/images/next_button_disabled.gif"
			nextImage.parentNode.onclick=new Function("evt","dummy();"); // jshint ignore:line
			nextImage.parentNode.disabled=true;
			
			/*lastElement.style.display="none";
			lastElement.disabled=true;
			lastDisElement.style.display="block";
			//lastDisElement.disabled=true;*/
			var lastImage=document.getElementById(viewid+'lastimg');
			lastImage.src="/appcreator/images/last_button_disabled.gif"
			lastImage.parentNode.onclick=new Function("evt","dummy();"); // jshint ignore:line
			lastImage.parentNode.disabled=true;
		}else
		{
			/*nextElement.style.display="block";
			nextElement.disabled=false;
			nextDisElement.style.display="none";
			//nextDisElement.disabled=true;*/
			var nextImage1=document.getElementById(viewid+'nextimg');
			nextImage1.src="/appcreator/images/next_button.gif"
			nextImage1.parentNode.onclick=new Function("evt","pageAction(this,'next');"); // jshint ignore:line
			nextImage1.parentNode.disabled=false;
			
/*			lastElement.style.display="block";
			lastElement.disabled=false;
			lastDisElement.style.display="none";
			//lastDisElement.disabled=true;*/
			var lastImage1=document.getElementById(viewid+'lastimg');
			lastImage1.src="/appcreator/images/last_button.gif"
			lastImage1.parentNode.onclick=new Function("evt","pageAction(this,'last');"); // jshint ignore:line
			lastImage1.parentNode.disabled=false;
		}
		
		var prevElement=document.getElementById(viewid+"prevEnabled");
		var firstElement=document.getElementById(viewid+"firstEnabled");
		/*var prevDisElement=document.getElementById(viewid+"prevDisabled");
		var firstDisElement=document.getElementById(viewid+"firstDisabled");*/
		if(parseInt(fromIndex,10)<=1)
		{
			/*prevElement.style.display="none";
			prevElement.disabled=true;			
			prevDisElement.style.display="block";*/
			var prevImage=document.getElementById(viewid+"previmg");
			prevImage.src="/appcreator/images/prev_button_disabled.gif"
			prevImage.parentNode.onclick=new Function("evt","dummy();"); // jshint ignore:line
			prevImage.parentNode.disabled=true;
			/*firstElement.style.display="none";
			firstElement.disabled=true;
			firstDisElement.style.display="block";*/
			//firstDisElement.disabled=false;
			var firstImage=document.getElementById(viewid+"firstimg");
			firstImage.src="/appcreator/images/first_button_disabled.gif"
			firstImage.parentNode.onclick=new Function("evt","dummy();"); // jshint ignore:line
			firstImage.parentNode.disabled=true;			
		}else
		{
			/*prevElement.style.display="block";
			prevElement.disabled=false;
			prevDisElement.style.display="none";
			prevDisElement.disabled=false;*/
			var prevImage1=document.getElementById(viewid+"previmg");
			prevImage1.src="/appcreator/images/prev_button.gif"
			prevImage1.parentNode.onclick=new Function("evt","pageAction(this,'previous');"); // jshint ignore:line
			prevImage1.parentNode.disabled=false;
			/*firstElement.style.display="block";
			firstElement.disabled=false;
			firstDisElement.style.display="none";
			firstDisElement.disabled=true;*/
			var firstImage1=document.getElementById(viewid+"firstimg");
			firstImage1.src="/appcreator/images/first_button.gif"
			firstImage1.parentNode.onclick=new Function("evt","pageAction(this,'first');"); // jshint ignore:line
			firstImage1.parentNode.disabled=false;
		}
		if(parseInt(totalCount,10)<=0)
		{
			var nextImage=document.getElementById(viewid+'nextimg');
			nextImage.src="/appcreator/images/next_button_disabled.gif"
			nextImage.parentNode.onclick=new Function("evt","dummy();"); // jshint ignore:line
			nextImage.parentNode.disabled=true;
			
			var lastImage=document.getElementById(viewid+'lastimg');
			lastImage.src="/appcreator/images/last_button_disabled.gif"
			lastImage.parentNode.onclick=new Function("evt","dummy();"); // jshint ignore:line
			lastImage.parentNode.disabled=true;
			
			var prevImage=document.getElementById(viewid+"previmg");
			prevImage.src="/appcreator/images/prev_button_disabled.gif"
			prevImage.parentNode.onclick=new Function("evt","dummy();"); // jshint ignore:line
			prevImage.parentNode.disabled=true;
			
			var firstImage=document.getElementById(viewid+"firstimg");
			firstImage.src="/appcreator/images/first_button_disabled.gif"
			firstImage.parentNode.onclick=new Function("evt","dummy();"); // jshint ignore:line
			firstImage.parentNode.disabled=true;	
			
				var totalElement=document.getElementById(viewid+'total');
				totalElement.innerHTML="0";
			
		}
	}
	
}

function dummy()
{
}


// getting the page dob
function getLocalPageDob() {
	return dobArr['D1'];
}	

// getting the original page dob
function getOrigPageDob() {
	return dobArr['DP'];
}

function  getFormMetaDob() {
	return dobArr['D2'];
}

function getRelatedFormFields() {
	return dobArr['D3']
}

function getLocalDataDob(viewID){
	var key="D4_"+viewID;
	return dobArr[key];
}

function getLocalViewMetaDob()
{
	return dobArr["D5"];
}


// getting the page id
function getPageId() {
	return pageId;
}

// getting the app id
function getAppId() {
	return appid;
}

// if it is in deployed mode or not
function isRuntime() {
	return runtime;
}

// getting the page id
function setPageId(pid) {
	pageId = pid;
}

// getting the app id
function setAppId(aid) {
	appid = aid;
}

// if it is in deployed mode or not
function setRuntime(rtime) {
	runtime = rtime;
}

function getSelectedPageId() {
	return selectedPid;
}

function isEditData() {
	return editData;
}


/* $Id$ */

function deleteRows(idsample, viewid, tableName) {
	var f = document.createElement('form');
	f.action = "/deleterecordaction.do";
	f.method="post";
	var inelem = document.createElement("input");
	inelem.setAttribute("name","viewid");
	inelem.setAttribute("value",viewid);
	f.appendChild(inelem);
	inelem = document.createElement("input");
	inelem.setAttribute("name","tableName");
	inelem.setAttribute("value",tableName);
	f.appendChild(inelem);

	var count = 1;
	var elem = document.getElementById(idsample + ':' + (count++));
	while(elem) {
		if(elem.checked == true) {
			inelem = document.createElement("input");
			inelem.setAttribute("name","deletegroup");
			inelem.setAttribute("value",elem.getAttribute("pk"));
			f.appendChild(inelem);
		}
		elem = document.getElementById(idsample + ':' + (count++));
	}
	document.body.appendChild(f);
	importxmlForForm(f, 'deleteMsg');
	document.body.removeChild(f);
}

function deleteMsg(result) {
	var errType = result.childNodes[0].nodeName;
	if(errType == 'successMsg') {
		reloadFullPage();
		displayFadeMsg(result.childNodes[0].childNodes[0].nodeValue);
	} else {
		displayFadeMsg(result.childNodes[0].childNodes[0].nodeValue, true);
	}
}
function mouseoverview(viewid, pkid) {
	document.getElementById(viewid + 'edit' + pkid).style.visibility='visible';
}


function mouseoutview(viewid, pkid) {
	document.getElementById(viewid + 'edit' + pkid).style.visibility='hidden';
}

function addViewForm(formid, formname) {
	var paramsObj = new Array();
	paramsObj['formid'] = formid; 
	paramsObj['formname'] = formname; 
	getHtml('/showForm.do?formid=' + formid + '&include=false&showFormName=false', 'showAddForm', paramsObj);
}

function showAddForm(html, paramsObj) {
	showDialog(html," title=" + paramsObj['formname'] +", modal=yes");
}

function closeLatestOpenedEditArea() {
	if(latestOpenedEditArea != null) {
		var elem = document.getElementById(latestOpenedEditArea);
		if(elem) {
			elem.innerHTML = '';
			elem.style.display = 'none';
		}
		latestOpenedEditArea = null;
	}
}

function editViewForm(formid, viewid, pkid, tableName) {
	if(latestOpenedEditArea == (formid + ':' +  viewid + ':' + pkid + ':' + tableName)) {
		closeLatestOpenedEditArea();
		return;
	}
	var paramsObj = new Array();
	paramsObj['formid'] = formid; 
	paramsObj['viewid'] = viewid; 
	paramsObj['pkid'] = pkid; 
	paramsObj['tableName'] = tableName; 
	getHtml('/showForm.do?formid=' + formid + '&formviewid=' + viewid + '&pkValue=' + pkid + '&tableName=' + tableName + '&include=false&showFormName=false', 'fillEditRow', paramsObj);
}

var latestOpenedEditArea = null;

function fillEditRow(html, paramsObj) {
	closeLatestOpenedEditArea();
	latestOpenedEditArea = paramsObj['formid'] + ':' + paramsObj['viewid'] + ':' + paramsObj['pkid'] + ':' + paramsObj['tableName'];
	var elem = document.getElementById(latestOpenedEditArea);
	elem.innerHTML = html;
	elem.style.display = getNewDisplay('table-cell');	
}

function getNewDisplay(std) {
	if (document.all) {
		return "block";
	} 
	return std;
}



function toggleAllDel(allElem) {
	var idsample = allElem.id;
	var state = allElem.checked;
	var count = 1;
	var elem = document.getElementById(idsample + ':' + (count++));
	while(elem) {
		elem.checked = state;
		elem = document.getElementById(idsample + ':' + (count++));
	}
}

function toggleDel(inpElem) {
	var id = inpElem.id;
	var li = id.lastIndexOf(':');
	var idsample = id.substring(0, li);
	var state = true;
	var count = 1;
	var elem = document.getElementById(idsample + ':' + (count++));
	while(elem) {
		if(elem.checked == false) {
			state = false;
			break;
		}
		elem = document.getElementById(idsample + ':' + (count++));
	}
	document.getElementById(idsample).checked = state;
}

function showView(viewid, pagesize, from, to, action, fcid) {
	var paramsObj = new Array();
	paramsObj['viewid'] = viewid; 
	var u = '/showView.do?viewid=' + viewid + '&pageSize=' + pagesize + '&fromIndex=' + from + '&toIndex=' + to + '&action=' + action + '&formcompid=' + fcid + '&include=false';
	getHtml(u, 'getView', paramsObj);
}

function getView(h, paramsObj) {
	document.getElementById('zohoview' + paramsObj['viewid']).innerHTML = h;
}

function movrviewsort(viewid, fcid) {
	var imgElem = document.getElementById(viewid + 'head' + fcid);
	imgElem.style.visibility='visible';
}

function moutviewsort(viewid, fcid) {
	var imgElem = document.getElementById(viewid + 'head' + fcid);
	imgElem.style.visibility='hidden';
}

/**
Tooltip.js

*/

//$Id

/***********************************************
* Cool DHTML tooltip script II- � Dynamic Drive DHTML code library (www.dynamicdrive.com)
* This notice MUST stay intact for legal use
* Visit Dynamic Drive at www.dynamicdrive.com/ for full source code
***********************************************/

var offsetfromcursorX=12; //Customize x offset of tooltip
var offsetfromcursorY=5; //Customize y offset of tooltip

var offsetdivfrompointerX=10; //Customize x offset of tooltip DIV relative to pointer image
var offsetdivfrompointerY=14; //Customize y offset of tooltip DIV relative to pointer image. Tip: Set it to (height_of_pointer_image-1).

var ie=document.all;
var ns6=document.getElementById && !document.all;
var tipobj;
var pointerobj;
var enabletip=false;

function ddrivetip(elm,e,thetext,isPointerRequired,autoclose,fontcolor,thewidth,thecolor){
	if (ns6||ie){
		tipobj = document.getElementById("dhtmltooltip");
		pointerobj=document.getElementById("dhtmlpointer");
		tipobj.style.visibility="hidden";
		pointerobj.style.visibility="hidden";
		/*if (typeof thewidth!="undefined") 
		{
		 tipobj.style.width=thewidth+"px";
		}*/
		if (typeof thecolor!="undefined" && thecolor!="") {
			tipobj.style.backgroundColor=thecolor;
		}
		var fcolor = "#000000";
                if (typeof fontcolor!="undefined") fcolor = fontcolor;
                var v = '<table id="tiptable" width='+thewidth+' border="0"><tr><td class="bodytext" width='+thewidth+' style="color:'+fcolor+';" nowrap>'+thetext+'</td></tr>';
                if(typeof autoclose=="undefined" || (typeof autoclose!="undefined" && !autoclose)){
                        v=v+'<tr><td align="right"><a class="staticlinks" href="javascript:hideddrivetip();"><span class="bodytext"><b>'+beanmsg["close"]+'</b></span></a></td></tr>';
                }
                v = v+'</table>';
                tipobj.innerHTML = v;
		tipobj.style.width=document.getElementById("tiptable").offsetWidth;
		enabletip=true;
		if(e!=null)
		{
			positiontip(e,isPointerRequired);
		}
		else
		{
		    if(isPointerRequired==true)
			{ 
			 var destx = elm.offsetLeft;
			 var desty = elm.offsetTop;
			}
			else
			{
			 var destx = elm.offsetLeft+140;
			 var desty = elm.offsetTop-50;
			} 
			var thisNode = elm;
			while (thisNode.offsetParent &&
					(thisNode.offsetParent != document.body)) {
				thisNode = thisNode.offsetParent;
				destx += thisNode.offsetLeft;
				desty += thisNode.offsetTop;
			}
			desty = desty+elm.offsetHeight;
			tipobj.style.left=destx+"px";
			pointerobj.style.left=(destx+5)+"px";
			pointerobj.style.top=(desty)+"px";
			tipobj.style.top=(desty+pointerobj.offsetHeight)+"px";
			if(thetext!="")
			{
			  tipobj.style.visibility="visible";
			}
			else
			{
			  tipobj.style.visibility="hidden";
			}
			if(isPointerRequired==true)
			{
			 pointerobj.style.visibility="visible";
			} 

		}
		return false;
	}
}


function positiontip(e,isPointerRequired){
	if (enabletip){
		var nondefaultpos=false;
		
		var curX=(ns6)?e.pageX : event.clientX+ietruebody().scrollLeft;
		var curY=(ns6)?e.pageY : event.clientY+ietruebody().scrollTop;
		//Find out how close the mouse is to the corner of the window
		var winwidth=ie&&!window.opera? ietruebody().clientWidth : window.innerWidth-20;
		var winheight=ie&&!window.opera? ietruebody().clientHeight : window.innerHeight-20;

		var rightedge=ie&&!window.opera? winwidth-event.clientX-offsetfromcursorX : winwidth-e.clientX-offsetfromcursorX;
		var bottomedge=ie&&!window.opera? winheight-event.clientY-offsetfromcursorY : winheight-e.clientY-offsetfromcursorY;

		var leftedge=(offsetfromcursorX<0)? offsetfromcursorX*(-1) : -1000;
		pointerobj.childNodes[0].src = "../images/arrow2.gif";
		//if the horizontal distance isn't enough to accomodate the width of the context menu
		if (rightedge<tipobj.offsetWidth){
			//move the horizontal position of the menu to the left by it's width
			tipobj.style.left=curX-tipobj.offsetWidth+"px";			
			pointerobj.style.left=curX-25+"px";
			pointerobj.childNodes[0].src = "../images/arrow2_mirror.gif";
			//nondefaultpos=true;
		}
		else if (curX<leftedge){
					

			tipobj.style.left="5px";
			pointerobj.style.left="10px";
		}
		else{
					

			//position the horizontal position of the menu where the mouse is positioned
			tipobj.style.left=curX+offsetfromcursorX-offsetdivfrompointerX+"px";
			pointerobj.style.left=curX+offsetfromcursorX+"px";
		}

		//same concept with the vertical position
		if (bottomedge<tipobj.offsetHeight){
			tipobj.style.top=curY-tipobj.offsetHeight-offsetfromcursorY-15+"px";
			pointerobj.style.top=curY-tipobj.offsetHeight-offsetfromcursorY-pointerobj.offsetHeight+"px";
			nondefaultpos=true;
		}
		else{
			tipobj.style.top=curY+offsetfromcursorY+offsetdivfrompointerY+"px";
			pointerobj.style.top=curY+offsetfromcursorY+"px";
		}
		tipobj.style.visibility="visible";
		if (!nondefaultpos && isPointerRequired){
		
			pointerobj.style.visibility="visible";
		}
		else{
			pointerobj.style.visibility="hidden";
			
		}
		
		startFade(0.04);
	}
}

function hideddrivetip(){
if (ns6||ie){
enabletip=false;
tipobj.style.visibility="hidden";
pointerobj.style.visibility="hidden";
tipobj.style.left="-1000px";
tipobj.style.backgroundColor='';
tipobj.style.width='';
}
}

var fadecounter=0;

function startFade(fadespeed) {
        fadecounter=0;
        startFadeTimer(fadespeed);
}

/**
* Keep changing the opacity till we reach the maximum(1)
*/
function startFadeTimer(fadespeed) {
        fadecounter=fadecounter+fadespeed;
        if(fadecounter>1){
		fadecounter = 1;
	}
        tipobj.style.opacity=fadecounter;
        pointerobj.style.filter="alpha(opacity="+parseInt(100*fadecounter)+")";
        tipobj.style.filter="alpha(opacity="+parseInt(100*fadecounter)+")";
        pointerobj.style.opacity=fadecounter;
        if (fadecounter<1){
                setTimeout("startFadeTimer("+fadespeed+")",20);
	}
}
function ietruebody(){
        return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body;
}

var divheight = 0;
var maxheight = 200;

function slideDown()
{
	document.getElementById("infomessage").style.height=divheight+'px';
	divheight = divheight+10;
	if(divheight > maxheight) 
	{
		divheight = 0;
		clearTimeout(slideTimer);
		return;
	}
	slideTimer = setTimeout(slideDown,10); // jshint ignore:line
}

function showInfoMessage()
{
	var ele = document.getElementById("infomessage");
	ele.style.height = divheight+'px';
	ele.style.visibility='visible';
	slideDown();
}

function hideMessageRequest(messageid)
{
	var paramsObj = new Array();
	paramsObj['messageid'] = messageid; 
	getHtml('/home/Notifications.do?execute=hideMessage&messageid='+messageid, 'hideMessage', paramsObj);
}

function hideMessage(html, paramsObj) {
	if(html == 'Success')
	{
		var messid = paramsObj['messageid'];
		hideElement(messid,1,0.04);
	}
}

function hideElement(messid,fadecounter,fadespeed)
{
        fadecounter = fadecounter - fadespeed;
        if(fadecounter<0){
		fadecounter = 0;
	}
	var obj = document.getElementById(messid);
        obj.style.opacity=fadecounter;
        obj.style.filter="alpha(opacity="+parseInt(100*fadecounter)+")";
        if (fadecounter>0){
                setTimeout("hideElement('"+messid+"',"+fadecounter+","+fadespeed+")",20);
	}
	else
	{
		obj.style.display="none";
		return;
	}
	
}
//Method for obtaining values from cross domain

function getCrossDomainHTML(URL,callback_Function,param1)
{
	try
	{
		$.ajax(
		{
			url: URL,
			dataType: "jsonp",//NO I18N
			cache: false,
			error: function(jqXHR,textStatus,exception) {
					if(textStatus=='abort')
					{
						alert('aborted');//NO I18N
					}
				},
			success : function(response) 
			{
				callback_Function("success", response, URL,param1);
			}
		});
	}
	catch(exception)
	{
		callback_Function("FAILURE", e, URL, param1);
	}
}