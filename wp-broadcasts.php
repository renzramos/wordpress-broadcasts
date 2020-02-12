<?php
/**
* Plugin Name: WP Broadcasts
* Plugin URI: https://www.renzramos.com
* Description: Simple plugin to broadcast emails
* Version: 1.0
* Author: Renz Ramos
* Author URI: https://www.renzramos.com
*/

class WPBroadcasts {

    public function __construct(){

        $this->wp_brodcasts_ajax();
        $this->wp_brodcasts_setup();
        
    }

    public function wp_brodcasts_setup(){

        add_action('admin_menu',array($this,'wp_broadcasts_admin_menu'));
        add_action( 'admin_enqueue_scripts', array($this,'wp_broadcasts_enqueue_admin_script') );

    }

    public function wp_brodcasts_ajax(){
        add_action( 'wp_ajax_wp_broadcast_get_broadcasts', array($this,'wp_broadcast_get_broadcasts') );
        add_action( 'wp_ajax_wp_broadcast_post_broadcasts', array($this,'wp_broadcast_post_broadcasts') );
        add_action( 'wp_ajax_wp_broadcast_queue_broadcast', array($this,'wp_broadcast_queue_broadcast') );
        add_action( 'wp_ajax_wp_broadcast_delete_broadcast', array($this,'wp_broadcast_delete_broadcast') );
    }

    public function wp_broadcasts_admin_menu(){
        add_menu_page( 'WP Broadcasts', 'WP Broadcasts', 'manage_options', 'wp_broadcasts',array($this,'wp_broadcasts_admin_page'));
    }

    public function wp_broadcasts_admin_page(){
        require('includes/front-end.php');
    }

    public function wp_broadcasts_enqueue_admin_script( $hook ) {

        if ( 'toplevel_page_wp_broadcasts' != $hook ) {
            return;
        }
        wp_enqueue_style('wp-broadcast', plugins_url('assets/css/style.css', __FILE__ ));
        wp_enqueue_style('magnific-popup', plugins_url('assets/css/third-party/magnific-popup.css', __FILE__ ));

        wp_enqueue_script('wp-broadcast', plugins_url('assets/js/script.js',__FILE__ ));
        wp_enqueue_script('magnific-popup', plugins_url('assets/js/third-party/jquery.magnific-popup.min.js',__FILE__ ));

    }

    function wp_broadcast_get_broadcasts() {
        global $wpdb;
        $broadcasts_table = $wpdb->prefix . 'wp_broadcasts';
        $broadcasts = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$broadcasts_table} ORDER BY id DESC"));
        $broadcast_queues_table = $wpdb->prefix . 'wp_broadcast_queues';
        ?>
        <?php if (!empty($broadcasts)): ?>

            <table class="wp-list-table widefat plugins">
            <thead>
                <th>ID</th>
                <th>Title</th>
                <th>Subject</th>
                <th>Description</th>
                <th>Queues</th>
                <th>Action</th>
            </thead>
            <tbody>
            <?php 
                foreach ($broadcasts as $broadcast): 
                $queues_count = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$broadcast_queues_table} WHERE broadcast_id = {$broadcast->id}") );
                ?>
                
                    <tr>
                        <td><code><?php echo sprintf('%04d', $broadcast->id); ?></code></td>
                        <td><?php echo $broadcast->title; ?></td>
                        <td><?php echo $broadcast->subject; ?></td>
                        <td><?php echo $broadcast->description; ?></td>
                        <td><?php echo $queues_count; ?></td>
                        <td class="broadcast-action-column">
                            <div class="broadcast-action-container">
                                <button class="wp-broadcast-view" data-id="<?php echo $broadcast->id; ?>" data-action="view" type="button">VIEW</button>
                                <button class="wp-broadcast-queue" data-id="<?php echo $broadcast->id; ?>" data-action="queue" type="button">QUEUE</button>
                                <button class="wp-broadcast-delete" data-id="<?php echo $broadcast->id; ?>" data-action="delete" type="button">DELETE</button>
                            </div>
                        </td>
                    </tr>
            <?php endforeach; ?>
            </tbody>
            </table>

        <?php else: ?>

        <div class="alert alert-warning">No broadcasts!</div>

        <?php endif; ?>
        <?php
        wp_die();
    }

    
    function wp_broadcast_post_broadcasts() {
        $response = array();

        global $wpdb;
        $broadcasts_table = $wpdb->prefix . 'wp_broadcasts';
        
        $broadcast = $_REQUEST['broadcast'];
        $broadcast_data = $wpdb->insert($broadcasts_table, $broadcast);
        $response['broadcast'] = $broadcast_data;

        echo json_encode($response);
        wp_die();
    }

    
    function wp_broadcast_queue_broadcast() {
        $response = array();

        global $wpdb;
        $broadcasts_table = $wpdb->prefix . 'wp_broadcasts';
        $broadcast_queues_table = $wpdb->prefix . 'wp_broadcast_queues';
        $broadcast_id = $_REQUEST['id'];
        $response['broadcast_id'] = $broadcast_id;
        
        $users = get_users(array( 'fields' => array( 'ID' ), 'number' => 5 ));
        
        $broadcast = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$broadcasts_table} WHERE id = '{$broadcast_id}'"));
        if (!empty($broadcast)){
            
            $response['broadcast_status'] = 'exist';
            foreach ($users as $user){
            
                $exclude = 0;
                $user_id = $user->ID;
                
                $newsletter_012020_subscribe_status = get_user_meta($user_id,'newsletter_012020_subscribe_status', true);
                if ($newsletter_012020_subscribe_status && $newsletter_012020_subscribe_status == 'unsubscribed'){
                    $exclude++;
                }
                
                $subscribe_status = get_user_meta($user_id,'subscribe_status', true);
                if ($subscribe_status){
                    $exclude++; 
                }
                
                
                if ($exclude == 0){
                    
                    $broadcast_queue_count = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$broadcast_queues_table} WHERE user_id = '{$user_id}' AND broadcast_id = '{$broadcast_id}';"));
                    
                    if ($broadcast_queue_count == 0){
                        
                        $broadcast_queue = array(
                            'user_id' => $user_id,    
                            'broadcast_id' => $broadcast_id,  
                            'created_at' => date('Y-m-d H:m:s')
                        );
                        
                        $wpdb->insert($broadcast_queues_table, $broadcast_queue);
                        $response['passed'][] = $broadcast_queue;
                        
                    }
                    
                    
                }
                
            }
            
        }else{
            
            $response['broadcast_status'] = 'not-exist';
            
        }

        echo json_encode($response);
        wp_die();
    }


    function wp_broadcast_delete_broadcast() {
        $response = array();

        global $wpdb;
        $broadcasts_table = $wpdb->prefix . 'wp_broadcasts';
        $broadcast_queues_table = $wpdb->prefix . 'wp_broadcast_queues';
        
        $id = $_REQUEST['id'];
        $wpdb->delete($broadcasts_table, ['id' => $id]);
        $wpdb->delete($broadcast_queues_table, ['broadcast_id' => $id]);
        echo json_encode($response);
        wp_die();
    }


}

$wp_broadcasts = new WPBroadcasts();




