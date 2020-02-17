<div class="wrap" data-ajax-url="<?php echo admin_url('admin-ajax.php'); ?>">
<h1>WP Broadcasts</h1>
<p>Send emails to all your users instantly</p>


<div id="wp-broadcast-status-container"></div>
<button id="wp-broadcast-add" data-mfp-src="#form-broadcast-container" class="open-popup-link">ADD NEW BROADCAST</button>
<div id="wp-broadcasts-container"></div>


<div class="form-broadcast-container white-popup mfp-hide" id="form-broadcast-container">
    <form id="wp-broadcast-form" class="form-container form-broadcast">

        <header>New Broadcast</header>
        <label>Title</label>
        <input type="text" name="broadcast[title]" class="form-control"/>

        <label>Subject</label>
        <input type="text" name="broadcast[subject]" class="form-control"/>

        <label>Description</label>
        <textarea name="broadcast[description]" class="form-control"></textarea>

        <label>HTML</label>
        <textarea name="broadcast[html]" class="form-control" rows="10"></textarea>

        <div class="form-action">
            <button id="wp-broadcast-save" type="button">Submit</button>
        </div>
    </form>
</div>

<!-- <p class="submit"><input type="submit" name="submit" id="submit" class="button button-primary" value="Save Changes"></p></form> -->

</div>