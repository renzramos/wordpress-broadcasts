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