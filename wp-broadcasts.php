<?php
/**
 * Plugin Name: WP Broadcasts
 * Plugin URI: https://www.renzramos.com
 * Description: Simple plugin to broadcast emails
 * Version: 1.0
 * Author: Renz Ramos
 * Author URI: https://www.renzramos.com
 */

require('includes/api.php');

class WPBroadcasts {

    public function __construct(){
        add_action('admin_menu',array($this,'wp_broadcasts_admin_menu'));

        /*
        * AJAX
        * Add Broadcast
        * Update Broadcast
        * Description
        * Test Broadcast
        */
    }
    public function wp_broadcasts_admin_menu(){
        add_menu_page( 'WP Broadcasts', 'WP Broadcasts', 'manage_options', 'wp_broadcasts',array($this,'wp_broadcasts_admin_page'));
    }

    public function wp_broadcasts_admin_page(){
        require('includes/front-end.php');
    }

}

$wp_broadcasts = new WPBroadcasts();



function wp_broadcasts_enqueue_admin_script( $hook ) {

    if ( 'toplevel_page_wp_broadcasts' != $hook ) {
        return;
    }
    wp_enqueue_style('wp-broadcast', plugins_url('assets/css/style.css', __FILE__ ));
    wp_enqueue_style('magnific-popup', plugins_url('assets/css/third-party/magnific-popup.css', __FILE__ ));
    
    wp_enqueue_script('wp-broadcast', plugins_url('assets/js/script.js',__FILE__ ));
    wp_enqueue_script('magnific-popup', plugins_url('assets/js/third-party/jquery.magnific-popup.min.js',__FILE__ ));

    }
add_action( 'admin_enqueue_scripts', 'wp_broadcasts_enqueue_admin_script' );