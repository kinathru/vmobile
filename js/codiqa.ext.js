

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

});//End Document Ready

