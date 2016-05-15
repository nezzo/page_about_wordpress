<?php
add_action('wp_enqueue_scripts', 'theme_enqueue_styles');
add_action( 'wp_enqueue_scripts', 'sliding_css' );
add_action( 'wp_enqueue_scripts', 'sliding_js');
add_action( 'wp_enqueue_scripts', 'sliding_main_js');
add_action( 'wp_enqueue_scripts', 'page_about_css');

function theme_enqueue_styles()
{
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_script('myjs', get_stylesheet_directory_uri() . '/js/ajax.js', array('jquery'), true, null, true);
    wp_localize_script('myjs', 'myData', array('ajaxurl' => admin_url('admin-ajax.php')));
    wp_enqueue_script('isotope', get_template_directory_uri() . '/js/isotope.pkgd.min.js');
}

// Register Projects post type
function projects()
{

    $labels = array(
        'name' => _x('Projects', 'Post Type General Name', 'diamond'),
        'singular_name' => _x('Project', 'Post Type Singular Name', 'diamond'),
        'menu_name' => __('Projects', 'diamond'),
        'name_admin_bar' => __('Projects', 'diamond'),
        'archives' => __('Item Archives', 'diamond'),
        'parent_item_colon' => __('Parent Item:', 'diamond'),
        'all_items' => __('All Items', 'diamond'),
        'add_new_item' => __('Add New Item', 'diamond'),
        'add_new' => __('Add New', 'diamond'),
        'new_item' => __('New Item', 'diamond'),
        'edit_item' => __('Edit Item', 'diamond'),
        'update_item' => __('Update Item', 'diamond'),
        'view_item' => __('View Item', 'diamond'),
        'search_items' => __('Search Item', 'diamond'),
        'not_found' => __('Not found', 'diamond'),
        'not_found_in_trash' => __('Not found in Trash', 'diamond'),
        'featured_image' => __('Featured Image', 'diamond'),
        'set_featured_image' => __('Set featured image', 'diamond'),
        'remove_featured_image' => __('Remove featured image', 'diamond'),
        'use_featured_image' => __('Use as featured image', 'diamond'),
        'insert_into_item' => __('Insert into item', 'diamond'),
        'uploaded_to_this_item' => __('Uploaded to this item', 'diamond'),
        'items_list' => __('Items list', 'diamond'),
        'items_list_navigation' => __('Items list navigation', 'diamond'),
        'filter_items_list' => __('Filter items list', 'diamond'),
    );
    $rewrite = array(
        'slug' => 'project',
        'with_front' => true,
        'pages' => true,
        'feeds' => true,
    );
    $args = array(
        'label' => __('Project', 'diamond'),
        'description' => __('Diamond Projects', 'diamond'),
        'labels' => $labels,
        'supports' => array('title', 'revisions',),
        'hierarchical' => false,
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 25,
        'menu_icon' => 'dashicons-palmtree',
        'show_in_admin_bar' => true,
        'show_in_nav_menus' => true,
        'can_export' => true,
        'has_archive' => true,
        'exclude_from_search' => false,
        'publicly_queryable' => true,
        'rewrite' => $rewrite,
        'capability_type' => 'page',
    );
    register_post_type('projects', $args);

}

add_action('init', 'projects', 0);

// Register Archive post type
function archive()
{

    $labels = array(
        'name' => _x('Archive', 'Post Type General Name', 'diamond'),
        'singular_name' => _x('Archive', 'Post Type Singular Name', 'diamond'),
        'menu_name' => __('Archive', 'diamond'),
        'name_admin_bar' => __('Archive', 'diamond'),
        'archives' => __('Item Archives', 'diamond'),
        'parent_item_colon' => __('Parent Item:', 'diamond'),
        'all_items' => __('All Items', 'diamond'),
        'add_new_item' => __('Add New Item', 'diamond'),
        'add_new' => __('Add New', 'diamond'),
        'new_item' => __('New Item', 'diamond'),
        'edit_item' => __('Edit Item', 'diamond'),
        'update_item' => __('Update Item', 'diamond'),
        'view_item' => __('View Item', 'diamond'),
        'search_items' => __('Search Item', 'diamond'),
        'not_found' => __('Not found', 'diamond'),
        'not_found_in_trash' => __('Not found in Trash', 'diamond'),
        'featured_image' => __('Featured Image', 'diamond'),
        'set_featured_image' => __('Set featured image', 'diamond'),
        'remove_featured_image' => __('Remove featured image', 'diamond'),
        'use_featured_image' => __('Use as featured image', 'diamond'),
        'insert_into_item' => __('Insert into item', 'diamond'),
        'uploaded_to_this_item' => __('Uploaded to this item', 'diamond'),
        'items_list' => __('Items list', 'diamond'),
        'items_list_navigation' => __('Items list navigation', 'diamond'),
        'filter_items_list' => __('Filter items list', 'diamond'),
    );
    $args = array(
        'label' => __('Archive', 'diamond'),
        'description' => __('Diamond Archive', 'diamond'),
        'labels' => $labels,
        'supports' => array('title', 'revisions',),
        'hierarchical' => false,
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 25,
        'menu_icon' => 'dashicons-portfolio',
        'show_in_admin_bar' => true,
        'show_in_nav_menus' => true,
        'can_export' => true,
        'has_archive' => true,
        'exclude_from_search' => false,
        'publicly_queryable' => true,
        'capability_type' => 'page',
    );
    register_post_type('archive', $args);

}

add_action('init', 'archive', 0);

add_filter('body_class', 'set_body_class');
function set_body_class($classes)
{
    if (is_archive())
        $classes[] = 'layout-wide';

    return $classes;
}


add_action('wp_ajax_load-single-post', 'load_archive_post_template');
add_action('wp_ajax_nopriv_load-single-post', 'load_archive_post_template');

function load_archive_post_template()
{
    $pid = (int)filter_input(INPUT_GET, 'pID', FILTER_SANITIZE_NUMBER_INT);
    if ($pid > 0) {
        global $post;
        $post = get_post($pid);
        $post_content = get_post_custom_values('description', get_the_ID());
        $image = get_post_custom_values('detail_image', get_the_ID());
        $image_url = wp_get_attachment_image_src($image[0], full);
        $project_link = get_post_custom_values('external_link', get_the_ID());
        $project_link_button_text = get_post_custom_values('visit_button', get_the_ID());
        $button_background_color = get_post_custom_values('secondary_color', get_the_ID());
        $link_button_background_color = $button_background_color[0];
        setup_postdata($post);
        echo '<img class="content__item-img rounded-right" src="';
        echo $image_url[0];
        echo '"/>';
        echo '<div class="content__item-inner">';
        echo '<h2>';
        the_title();
        echo '</h2>';
        echo '<h3>';
        echo $post_content[0];
        echo '</h3>';
        echo '<a target="_blank" href="';
        echo $project_link[0];
        echo '"><div class="single-post-link" style="background-color: ';
        echo $link_button_background_color;
        echo '">';
        echo $project_link_button_text[0];
        echo '</div></a>';
    }
    exit();
}

function sliding_css(){
     	wp_enqueue_style( 'wp_head_style_sliding_one', '/wp-content/themes/diamond-2.0'  . '/css/reset.css', array(), null );
     	wp_enqueue_style( 'wp_head_style_sliding_two', '/wp-content/themes/diamond-2.0' . '/css/slide_style.css', array(), null );
}

function sliding_js() {
	 wp_enqueue_script( 'wp_footer_sliding_js', '/wp-content/themes/diamond-2.0' . '/js/modernizr.js', array(), null, true );
}	 
function sliding_main_js() {
	 wp_enqueue_script( 'wp_footer_sliding_main_js', '/wp-content/themes/diamond-2.0' . '/js/main.js', array(), null, true );
}

function page_about_css(){
    wp_enqueue_style( 'wp_page_about', '/wp-content/themes/diamond-2.0'  . '/css/page_about.css', array(), null );
}

