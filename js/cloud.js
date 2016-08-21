// JavaScript Document

var medicals, tags, idNumber;;

$(document).ready(function(e) {
	
	function medical(mID, mHospital, mDates, mNumber, mDiseaseID, mDiseaseName,mDoctors){
		this.id = mID;
		this.hospital = mHospital;
		this.dates = mDates;
		this.number = mNumber;
		this.diseaseID = mDiseaseID;
		this.diseaseName = mDiseaseName;
		this.doctors = mDoctors;	
	}
	
	function doctor(mID, mName, mNumber){
		this.id = mID;
		this.name = mName;
		this.number = mNumber;
	}
	
	function tag(mText, mWeight,mHtml){
		this.text = mText;
		this.weight = mWeight;
		this.html = mHtml;
	}

	medicals = JSON.parse(window.localStorage.getItem("medicals"));

	createHealthCloudTag();
	
	function createHealthCloudTag(){
		tags = [];
		var texts = [];
		for(var i=0;i<medicals.length;i++){
			var text = subChiStr(medicals[i].diseaseName,14,true);
			var diseaseID = medicals[i].diseaseID;
			var index = texts.indexOf(text);
			if(index == -1){
				var tagObj = new tag(text,1,{"func":"filter","disease_id":diseaseID});
				texts.push(text);
				tags.push(tagObj);
			}else{
				tags[index].weight = tags[index].weight+1;
			}
		}
		
		$('#health-cloud-tag').jQCloud(tags, {
			width: 700,
			height: 500,
			fontSize: {
			  from: 0.12,
			  to: 0.025
			},
			afterCloudRender:function(){afterCloudRender()}
		});
		
		$('.import-data').css('display','none');
		$('#health-cloud-tag').css('display','inline-block');
		$('#widgets').css('display','none');
		$('.data-list').css('display','inline-block');
	}

	function afterCloudRender(){

		$("[func=filter]").bind("click", function() {
			var diseaseID = $(this).attr("disease_id");
			
			// Saving
			window.localStorage.setItem("diseaseID",diseaseID);

			window.location.href="detail.html"
		});
	}
	
	function addslashes( str ) {
    	return str.replace(/"/g, '\'');;
	}

	function subChiStr(str, len, hasDot)   
	{   
		var newLength = 0;   
		var newStr = "";   
		var chineseRegex = /[^\x00-\xff]/g;   
		var singleChar = "";   
		var strLength = str.replace(chineseRegex,"**").length;   
		for(var i = 0;i < strLength;i++)   
		{   
			singleChar = str.charAt(i).toString();   
			if(singleChar.match(chineseRegex) != null)   
			{   
				newLength += 2;   
			}       
			else   
			{   
				newLength++;   
			}   
			if(newLength > len)   
			{   
				break;   
			}   
			newStr += singleChar;   
		}   
       
		if(hasDot && strLength > len)   
		{   
			newStr += "…";   
		}   
		return newStr;   
	}

	$("#import-other").bind("click", function() {
    window.location.replace('import.html')
  });
	
});