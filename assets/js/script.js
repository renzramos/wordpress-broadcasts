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

            $(document).on('click', '.wp-broadcast-view', function () {

                wpBroadcast.events.viewBroadcast($(this));
                
            });
            
            
            $(document).on('click', '#btn-save-editor', function () {

                var id = $('#editor').attr('data-id');
                var html = wpBroadcast.elem.broadcastEditor.codemirror.getValue();
                
                wpBroadcast.events.updateBroadcast(id, html);
            });

            $(document).on('click', '#btn-close-editor', function () {

                $('.wp-broadcast-editor-container').remove();
                wpBroadcast.elem.addBroadcast.show();
                wpBroadcast.elem.broadcastsContainer.show();

            });

            
        },
        elem : {
            broadcastEditor : null,
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
            viewBroadcast : function(button){
                
                var id = button.attr('data-id');
                var data = {
                    action: 'wp_broadcast_view_broadcast',
                    id : id
                }
                $.post(adminAjaxURL, data, function (broadcastDataHTML){
                    
                    $('#editor').remove();
                    wpBroadcast.elem.broadcastStatusContainer.before(broadcastDataHTML);
                    wpBroadcast.elem.addBroadcast.hide();
                    wpBroadcast.elem.broadcastsContainer.hide();

                    wpBroadcast.elem.broadcastEditor = wp.codeEditor.initialize( $('#editor') , cm_settings);
             
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

            updateBroadcast : function (id, html){

                var data = {
                    action: 'wp_broadcast_update_broadcast',
                    id: id,
                    html: html
                };
                
                $.post(adminAjaxURL, data, function (response) {
                    console.log(response);
                    document.getElementById('wp-broadcast-preview').contentWindow.location.reload();
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