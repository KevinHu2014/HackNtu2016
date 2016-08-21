// JavaScript Document

var medicals, tags, idNumber;;

$(document).ready(function(e) {
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
	
	document.getElementById("uploadBtn").onchange = function() {
		document.getElementById("uploadFile").value = this.value
	};

	function handleFileSelect() {
		if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
			alert('該瀏覽器版本過舊，不支援HTML5，請使用IE10、Chrome38、FireFox28以上的版本');
			return
		}
		input = document.getElementById('uploadBtn');
		if (!input) {
			alert("Um, couldn't find the fileinput element.")
		} else if (!input.files) {
			alert("該瀏覽器版本過舊，不支援HTML5，請使用IE10、Chrome38、FireFox28以上的版本")
		} else if (!input.files[0]) {
			alert("尚未選擇檔案!")
		} else {
			file = input.files[0];
			fr = new FileReader();
			fr.onload = parseXML;
			fr.readAsText(file);
			window.location.href = "cloud.html";
		}
	}
	
	function parseXML() {
		medicals = [];
		var ids = [];
		var doctors = [];
		var xml = $.parseXML(fr.result);
		
		$(xml).find('r1').each(function(index, ele) {            
			var id = ($(ele).children('r1\\.5')).text().substr(0,4)+$(ele).children('r1\\.7').text();
			var hospital = $(ele).children('r1\\.4').text();
			var dates = $(ele).children('r1\\.5').text();
			var number = $(ele).children('r1\\.7').text();
			var diseaseID = $(ele).children('r1\\.8').text();
			var diseaseName = $(ele).children('r1\\.9').text();
			
			if(ids.indexOf(id)==-1){
				ids.push(id);
				
				$(ele).find('r1_1').each(function(index, ele) {
                	var id = $(this).children('r1_1\\.1').text();
					var name = $(this).children('r1_1\\.2').text();
					var number = $(this).children('r1_1\\.3').text();
					var doctorObj = new doctor(id,name,number);
					doctors.push(doctorObj);
            	});
				
				var medicalObj = new medical(id , hospital, dates, number, diseaseID, diseaseName,doctors);
				medicals.push(medicalObj);
				doctors = [];
			}						
        });
		
		idNumber = $(xml).find('b1\\.1').text();
		$('.id-number').text(idNumber);
		
		medicals.sort(function(a,b){return a.id - b.id});
		console.log(medicals);
		//save
		window.localStorage.setItem("medicals",JSON.stringify(medicals));
	}
	
	$("#next-import").bind("click", function() {
		handleFileSelect();
	});
	
	$("#import-other").bind("click", function() {
		window.location.replace('index.html')
	});
	
	function addslashes( str ) {
    	return str.replace(/"/g, '\'');;
	}
	
});