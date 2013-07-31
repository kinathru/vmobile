

$(function(){

 $(document).on('swipeleft', '[data-role="page"]', function(event){    
    if(event.handled !== true) // This will prevent event triggering more then once
    {    
        var nextpage = $(this).next('[data-role="page"]');
        // swipe using id of next page if exists
        if (nextpage.length > 0) {
            if(nextpage.attr("id")!="add_item_pg")
            {
              $.mobile.changePage(nextpage, {transition: "slide", reverse: false}, true, true);
            }
        }
        event.handled = true;
    }
    return false;         
});

$(document).on('swiperight', '[data-role="page"]', function(event){   
    if(event.handled !== true) // This will prevent event triggering more then once
    {      
        var prevpage = $(this).prev('[data-role="page"]');
        if (prevpage.length > 0) {
            $.mobile.changePage(prevpage, {transition: "slide", reverse: true}, true, true);
        }
        event.handled = true;
    }
    return false;            
});


/*
Following function is for expanding and collapsing list views. But it does that for nav bar. So edit it
*/

var divider =  $("li:not(:jqmData(role=list-divider)):has(#cars)");
divider.hide();


$("li:jqmData(role=list-divider)").bind ("vclick", function (event)
{
  $(this).nextUntil ("li:jqmData(role=list-divider)").toggle ();
});


$( "#login_btn" ).bind( "click", function(event, ui) {
  login();
});


});//End Document Ready

$(document).bind('pagechange',function(e,data){
   var curr_page =  $.mobile.activePage.attr("id");
   if(curr_page == "my_sales_pg"){
    //$.jqplot('chartdiv',  [[[1, 2],[3,5.12],[5,13.1],[7,33.6],[9,85.9],[11,219.9]]]);
    draw_area_chart();
    draw_pie_chart();
   }
   else if(curr_page == "my_items_pg")
   {
      get_items_Call();
   }
   else if(curr_page == "current_stks_pg")
   {
      get_stocks_Call();
   }

});


function draw_area_chart()
{
	var l6 = [11, 9, 5, 12, 14, 8, 7, 9, 6, 11, 9, 3, 4];
    var l7 = [4, 8, 5, 3, 6, 5, 3, 2, 6, 7, 4, 3, 2];
    var l8 = [12, 6, 13, 11, 2, 3, 4, 2, 1, 5, 7, 4, 8];
 
    var ticks = [[1,'Dec 10'], [2,'Jan 11'], [3,'Feb 11'], [4,'Mar 11'], [5,'Apr 11'], [6,'May 11'], [7,'Jun 11'], [8,'Jul 11'], [9,'Aug 11'], [10,'Sep 11'], [11,'Oct 11'], [12,'Nov 11'], [13,'Dec 11']];  
 
     
    plot2 = $.jqplot('sales_chart',[l6, l7, l8],{
       stackSeries: true,
       showMarker: false,
       highlighter: {
        show: true,
        showTooltip: false
       },
       seriesDefaults: {
           fill: true,
       },
       series: [
        {label: 'Beans'},
        {label: 'Oranges'},
        {label: 'Crackers'}
       ],
       legend: {
        show: true,
        placement: 'insideGrid'
       },
       grid: {
        drawBorder: false,
        shadow: false
       },
       axes: {
           xaxis: {
              ticks: ticks,
              tickRenderer: $.jqplot.CanvasAxisTickRenderer,
              tickOptions: {
                angle: -90 
              },
              drawMajorGridlines: false
          }           
        }
    });
     
    // capture the highlighters highlight event and show a custom tooltip.
    $('#sales_chart').bind('jqplotHighlighterHighlight', 
        function (ev, seriesIndex, pointIndex, data, plot) {
            // create some content for the tooltip.  Here we want the label of the tick,
            // which is not supplied to the highlighters standard tooltip.
            var content = plot.series[seriesIndex].label + ', ' + plot.series[seriesIndex]._xaxis.ticks[pointIndex][1] + ', ' + data[1];
            // get a handle on our custom tooltip element, which was previously created
            // and styled.  Be sure it is initiallly hidden!
            var elem = $('#customTooltipDiv');
            elem.html(content);
            // Figure out where to position the tooltip.
            var h = elem.outerHeight();
            var w = elem.outerWidth();
            var left = ev.pageX - w - 10;
            var top = ev.pageY - h - 10;
            // now stop any currently running animation, position the tooltip, and fade in.
            elem.stop(true, true).css({left:left, top:top}).fadeIn(200);
        }
    );
     
    // Hide the tooltip when unhighliting.
    $('#sales_chart').bind('jqplotHighlighterUnhighlight', 
        function (ev) {
            $('#customTooltipDiv').fadeOut(300);
        }
    );
}

function draw_pie_chart()
{
	jQuery.jqplot.config.enablePlugins = true;
  	plot7 = jQuery.jqplot('products_chart', 
    [[['Verwerkende industrie', 9],['Retail', 8], ['Primaire producent', 7], 
    ['Out of home', 6],['Groothandel', 5], ['Grondstof', 4], ['Consument', 3], ['Bewerkende industrie', 2]]], 
    {
      title: ' ', 
      seriesDefaults: {shadow: true, renderer: jQuery.jqplot.PieRenderer, rendererOptions: { showDataLabels: true } }, 
      legend: { show:true }
    }
  );
}

function get_items_Call(url)
{
  var data = null;
  $.ajax({ 
    type: "post", 
    url: "http://localhost/Vmart/vm_mob_services/get_items", 
    cache: false, 
    success: function(json){  
      try{  
        var obj = jQuery.parseJSON(json); 
        create_listview(obj,"#my_items_li");
      }
      catch(e) {  
        //alert('Exception while request..');
        console.log('Exception while request..'); 
      }   
    }, 
    error: function(){   
      //alert('Error while request..'); 
      console.log('Exception while request..');
    } 
  });
}

function get_stocks_Call(url)
{
  var data = null;
  $.ajax({ 
    type: "post", 
    url: "http://localhost/Vmart/vm_mob_services/get_items", 
    cache: false, 
    success: function(json){  
      try{  
        var obj = jQuery.parseJSON(json); 
        create_listview(obj,"#my_stocks_li");
      }
      catch(e) {  
        //alert('Exception while request..');
        console.log('Exception while request..'); 
      }   
    }, 
    error: function(){   
      //alert('Error while request..');
      console.log('Exception while request..'); 
    } 
  });
}


function create_listview(data,list_id)
{
  var items = [];
  $.each(data,function(i,item){

    items.push('<li><a href=""><img src="http://localhost/Vmart/assets/images/userdata/'+item.MainImageUrl+'" /><h1>'+item.title+'</h1><p>'+item.Qty+' items remaining</p><span class="ui-li-count">'+item.Qty+'</span></a></li>');

  });

  $(list_id).append(items.join(' '));
  $(list_id).listview('refresh');
}

function login()
{
  var uname = $('#lgn_user').val();
  var pwd = $('#lgn_pass').val();;
  
  if(!uname || !pwd)
  {
    $('#lgn_user').parent().css({'border-color':'red','background-color':'#E5A8A8'});
    $('#lgn_pass').parent().css({'border-color':'red','background-color':'#E5A8A8'});
  }
  //else if(uname=="abc" && pwd == "abc")
  else
  {
    var urll = "http://localhost/Vmart/vm_mob_services/validate_user/"+uname+"/"+pwd;
    console.log(urll);
    $.ajax({ 
        type: "post", 
        url: "http://localhost/Vmart/vm_mob_services/validate_user/"+uname+"/"+pwd, 
        cache: false, 
        success: function(json){  
          try{
            var obj = jQuery.parseJSON(json); 
            console.log(obj);
            var user_id = validate_user(obj)
            if(user_id>0)
            {
              console.log("Logged in user : " + user_id);
              window.location.href = "#page1";
            }
            else
            {
              $("#login_error").css('display','block');
            }
            //alert( validate_user());
          }
          catch(e) {  
            //alert('Exception while request..');
            $("#login_error").css('display','block');
            console.log('Exception while request..');
          }   
        }, 
        error: function(){   
          console.log('Exception while request..'); 
        } 
      });
    
  }

  /*
  if(!uname || !pwd)
  {
    alert("You Should Sign in");
  }
  else
  {
      var urll = "http://localhost/Vmart/vm_mob_services/validate_user/"+uname+"/"+pwd;
      console.log(urll);
      $.ajax({ 
        type: "post", 
        url: "http://localhost/Vmart/vm_mob_services/validate_user/"+uname+"/"+pwd, 
        cache: false, 
        success: function(json){  
          try{
            var obj = jQuery.parseJSON(json); 
            alert( validate_user());
          }
          catch(e) {  
            alert('Exception while request..'); 
          }   
        }, 
        error: function(){   
          alert('Error while request..'); 
        } 
      });
  }
  */
}


function validate_user(data)
{
  console.log(data);
  var user_id = data.userid;
  console.log(user_id);

  return user_id;
}

