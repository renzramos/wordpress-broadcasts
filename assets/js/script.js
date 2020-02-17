jQuery(document).ready(function($){
    
    var adminAjaxURL = $('[data-ajax-url]').attr('data-ajax-url');

    console.log(document);

    
    $('.open-popup-link').magnificPopup({
        type:'inline',
        midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
    });

    var wpBroadcast = {
        init : function(){

            wpBroadcast.events.getBroadcasts();
            
            // wpBroadcast.elem.addBroadcast.click(function(){
            //     wpBroadcast.events.showAddBroadcast();
            // });


            // Add Save Broadcast Event
            $(document).on('click','#wp-broadcast-save', function(){
                wpBroadcast.events.saveBroadcast();
            });

            $(document).on('click','.wp-status-close', function(){
                wpBroadcast.elem.broadcastStatusContainer.html('');
            });

            $(document).on('click','.wp-broadcast-delete', function(){
                
                var r = confirm("Are you sure you want to delete this broadcast?\nAll broadcasts queue will be also deleted.");
                if (r == true) {
                    wpBroadcast.events.deleteBroadcast($(this));
                }
               
            });

            $(document).on('click','.wp-broadcast-queue', function(){
                
                var r = confirm("Are you sure you want this broadcast to queue?");
                if (r == true) {
                    wpBroadcast.events.queueBroadcast($(this));
                }
               
            });


            $(document).on('click', '.wp-broadcast-activate', function () {

                var r = confirm("Are you sure you want activate this broadcast?");
                if (r == true) {
                    wpBroadcast.events.activateBroadcast($(this));
                }

            });

            $(document).on('click', '.wp-broadcast-deactivate', function () {

                var r = confirm("Are you sure you want deactivate this broadcast?");
                if (r == true) {
                    wpBroadcast.events.deactivateBroadcast($(this));
                }

            });


            
        },
        elem : {
            broadcastsContainer : $('#wp-broadcasts-container'),
            broadcastStatusContainer : $('#wp-broadcast-status-container'),
            addBroadcast : $('#wp-broadcast-add'),
            saveBroadcast : $('#wp-broadcast-save')
        },
        events : {

            getBroadcasts : function(){

                var data = {
                    action : 'wp_broadcast_get_broadcasts'
                }
                $.get(adminAjaxURL, data, function(broadcastsHTML){
                    wpBroadcast.elem.broadcastsContainer.html(broadcastsHTML);
                });
                
            },
            deleteBroadcast : function(button){
                
                var id = button.attr('data-id');
                var data = {
                    action : 'wp_broadcast_delete_broadcast',
                    id : id
                }
                $.post(adminAjaxURL, data, function(broadcastsHTML){
                   wpBroadcast.events.getBroadcasts();
                });
                
            },
            queueBroadcast : function(button){
                
                var id = button.attr('data-id');
                var data = {
                    action : 'wp_broadcast_queue_broadcast',
                    id : id
                }
                $.post(adminAjaxURL, data, function(broadcastsHTML){
                   wpBroadcast.events.getBroadcasts();
                });
                
            },
            activateBroadcast : function(button){
                
                var id = button.attr('data-id');
                var data = {
                    action : 'wp_broadcast_activate_broadcast',
                    id : id
                }
                $.post(adminAjaxURL, data, function(broadcastsHTML){
                   wpBroadcast.events.getBroadcasts();
                });
                
            },
            deactivateBroadcast : function(button){
                
                var id = button.attr('data-id');
                var data = {
                    action : 'wp_broadcast_deactivate_broadcast',
                    id : id
                }
                $.post(adminAjaxURL, data, function(broadcastsHTML){
                   wpBroadcast.events.getBroadcasts();
                });
                
            },
            showAddBroadcast : function(){

                $.magnificPopup.open({
                    items: {
                        src: '<div class="white-popup">' + $('.form-broadcast-container').html() + '</div>', // can be a HTML string, jQuery object, or CSS selector
                        type: 'inline'
                    }
                });

                

            },

            saveBroadcast : function(){

                var broadcastForm  = $('.mfp-wrap #wp-broadcast-form');


                var formdata = broadcastForm.serializeArray();
                var data = {};
                $(formdata ).each(function(index, obj){
                    data[obj.name] = obj.value;
                });
                data['action'] = 'wp_broadcast_post_broadcasts';


                $.post(adminAjaxURL, data, function(response){
                    broadcastForm.find('input,textarea').val("");
                    $.magnificPopup.close();
                    wpBroadcast.events.getBroadcasts();

                    wpBroadcast.setNotification('success','Successfully added broadcast!');
                });

            }

        },
        setNotification : function (status, message){
            wpBroadcast.elem.broadcastStatusContainer.html('<div class="wp-status wp-' + status + '">' + message + '<span class="wp-status-close">×</span></div>');
        }
    }

    wpBroadcast.init();
    
});