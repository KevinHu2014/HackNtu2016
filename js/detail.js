var m2014 = [0,0,0,0,0,0,0,0,0,0,0,0];
var m2015 = [0,0,0,0,0,0,0,0,0,0,0,0];
var m2016 = [0,0,0,0,0,0,0,0,0,0,0,0];
$(document).ready(function(e) {

  var diseaseID = window.localStorage.getItem("diseaseID");
  var medicals = JSON.parse(window.localStorage.getItem("medicals"));
  
 
  console.log(medicals);

  function medical(mID, mHospital, mDates, mNumber, mDiseaseID, mDiseaseName,mDoctors){
    this.id = mID;
    this.hospital = mHospital;
    this.dates = mDates;
    this.number = mNumber;
    this.diseaseID = mDiseaseID;
    this.diseaseName = mDiseaseName;
    this.doctors = mDoctors;  
  }

  loadMedicalData();
  showData();

  function loadMedicalData(){
    var request = $.ajax({
      url: "http://health.apmall.tw/sickness.php",
      method: "GET",
      data: { id : diseaseID },
      dataType: "json"
    });
   
    request.done(function( msg ) {
      console.log(msg.id);
      console.log(msg.symptom);
      console.log(msg.solution);

      $('#symptom').html(msg.symptom);
      $('#solution').html(msg.solution);
      $('#sickness-name').html(msg.name);
    });
     
    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });
  }

  function showData(){
    
    function filter(condition){

      var serial = 0;
      
      for(var i=0;i<medicals.length;i++){
        
        var date = medicals[i].dates;
        var diseaseID = medicals[i].diseaseID;
        var diseaseName = medicals[i].diseaseName;
        var hospital = medicals[i].hospital;
        
        if(condition==diseaseID){

          serial ++;
          //console.log(date);//印出所有日期
          var temp;
          if(parseInt(date)>20160000){
            temp = (parseInt(date) - 20160000)/100;
            temp = Math.floor(temp);
            //console.log(temp);
            m2016[temp-1]++;
          }
          else if(parseInt(date)>20150000){
            temp = (parseInt(date) - 20150000)/100;
            temp = Math.floor(temp);
            //console.log(temp);
            m2015[temp-1]++;
          }
          else if(parseInt(date)>20140000){
            temp = (parseInt(date) - 20140000)/100;
            temp = Math.floor(temp);
            //console.log(temp);
            m2014[temp-1]++;
          }

          var serialNum = '<td>'+ (serial) + '</td>';
          var dateHtml = '<td>'+date+' </td>';
          var diseaseNameHtml = '';
          var hospitalHtml = '';
          
          if(diseaseName.length>6){
            diseaseNameHtml = '<td title="'+ diseaseName +'"> '+subChiStr(diseaseName,12,true)+' </td>';
          }else{
            diseaseNameHtml = '<td> '+ diseaseName +' </td>';
          }
          
          if(hospital.length>5){
            hospitalHtml = '<td title="'+hospital+'"> '+subChiStr(hospital,10,true)+'</td>';
          }else{
            hospitalHtml = '<td class="cell"> '+hospital+'</td>';
          }
          
          $('.table').append('<tr class="more" id="'+medicals[i].id+'">'+serialNum+dateHtml+diseaseNameHtml+hospitalHtml+'</tr>');  
        }
      }
      //console.log(m2014);
      //console.log(m2015);
      //console.log(m2016);
      $('.more').unbind('click').bind('click',function(){
        showDialog($(this).attr('id'));
      });
    }
    
    filter(diseaseID);
    
    $("[func=filter]").bind("click", function() {
      filter($(this).attr("disease_id"));
      $('.filter').html('<span class="show-all">全部資料</span> > '+subChiStr($(this).text(),14,true));
      
      $('.show-all').unbind('click');
      $('.show-all').bind('click',function(){
        $('.filter').html('全部資料');
        filter('all');
      });     
    });
    
    function showDialog(id){
      var dialog = '<div class="dialog"><div class="dialog-overlay"></div><div class="dialog-container-fix"><div class="dialog-container-outer">';
      var row = '';
      for(var i=0; i<medicals.length; i++){
        if(medicals[i].id ==id){
          for(var j=0; j<medicals[i].doctors.length; j++){
            var id = medicals[i].doctors[j].id;
            var name = medicals[i].doctors[j].name;
            var number = medicals[i].doctors[j].number;
            
            switch(id.length){
              case 10:
                row = row + '<tr><td><a title="查詢藥品" target="_blank" href="http://www.nhi.gov.tw/query/query1_list.aspx?Type=%E8%BF%84%E4%BB%8A&Q1ID='+id+'">'+id+'</td>';
                break;
              case 12:
                row = row + '<tr><td><a title="查詢特材" target="_blank" href="http://www.nhi.gov.tw/query/query4_list.aspx?ShowType=2&Q4ID='+id+'">'+id+'</td>';
                break;
              default:
                row = row + '<tr><td><a title="查詢支付費用" target="_blank" href="http://www.nhi.gov.tw/query/query2_list.aspx?ShowType=2&Q2ID='+id+'">'+id+'</td>';
                break;
            }
            
            if(name.length>10){
              row = row + '<td title="'+addslashes(name)+'">'+subChiStr(name,20,true)+'</td><td>'+number+'</td></tr>';  
            }else{
              row = row + '<td>'+name+'</td><td>'+number+'</td></tr>';
            }
            
          }
          
          if(medicals[i].diseaseName.length>20){
            dialog = dialog + '<div class="info" title="' + addslashes(medicals[i].diseaseName) + '">' + subChiStr(medicals[i].diseaseName,32,true) + '</div><table class="rwd-table"><tr><th>醫囑代碼</th><th>醫囑名稱</th><th>醫囑總量</th></tr>';
          }else{
            dialog = dialog + '<div class="info">' + medicals[i].diseaseName + '</div><table class="rwd-table"><tr><th>醫囑代碼</th><th>醫囑名稱</th><th>醫囑總量</th></tr>';
          } 
          
          break;
        }
      }
      
      dialog = dialog + row + '</div></div></div></table>';
      $('html').append(dialog);
      
      $('.dialog-overlay').unbind('click').bind('click',function(){
        $('.dialog').remove();
      });
    }     
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

  function addslashes( str ) {
      return str.replace(/"/g, '\'');;
  }

  $("#import-other").bind("click", function() {
    window.location.replace('index.html')
  });
});
