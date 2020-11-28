/* $Id$ */
// JavaScript Document
function $(idd)
{ return document.getElementById(idd);}

// Script for copy right year
var copyrightdatevar = new Date();
var copyrightyear = "&copy; "+copyrightdatevar.getFullYear()+","//No I18N

function getLanguage()
{
	if ( navigator ) {
		if ( navigator.language ) {
			return navigator.language;
		}
		else if ( navigator.browserLanguage ) {
			return navigator.browserLanguage;
		}
		else if ( navigator.systemLanguage ) {
			return navigator.systemLanguage;
		}
		else if ( navigator.userLanguage ) {
			return navigator.userLanguage;
		}
	}
}

function getLanguageFolder(lang)
{
	folder = "";
	if(lang == "fr" || lang == "de" || lang == "da" || lang == "es" || lang == "it" || lang == "ja" || lang == "pl" || lang == "sv" )
	{
		folder = "/"+lang; //No I18N
	}
	else if(lang == "du")
	{
		folder = "/nl"; //No I18N
	}
	else if(lang.indexOf("zh")!=-1)
	{
		folder = "/zhcn"; //No I18N
	}

	return folder;
}
