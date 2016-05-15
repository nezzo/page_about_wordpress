<!DOCTYPE html>
<html <?php language_attributes( 'html' ); ?>>
<head>
    <?php if ( ! function_exists( 'has_site_icon' ) || ! has_site_icon() ) : ?>
        <link rel="Shortcut Icon" type="image/ico" href="<?php echo esc_url(get_template_directory_uri()); ?>/imgs/favicon.ico" />
    <?php endif; ?>
    <?php if ( ! ( function_exists( 'wp_site_icon' ) ) ) : ?>
        <link rel="Shortcut Icon" type="image/ico" href="<?php echo get_theme_mod( 'viewpoint_favicon' ); ?>" />
    <?php endif; ?>

    <!-- wp_head __-->
    <?php wp_head(); ?>
</head>

<body <?php hybrid_attr( 'body' ); ?>

<!-- Border -->


<!-- Loader -->
<div class="loadreveal"></div>
<div class="loadreveal bottom"></div>
<div id="loadscreen"><div id="loader"><span></span></div></div>

<!-- HEADER -->
<header id="header">
    <div class="wrapper">

        <!-- Logo __-->
        <h1 id="logo">
            <a href="<?php echo esc_url( home_url('/') ); ?>" rel="home">
                <?php if ( get_theme_mod( 'viewpoint_logo_img' ) ) : ?>
                    <img src="<?php echo get_theme_mod( 'viewpoint_logo_img' ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>" />
                <?php else: ?>
                    <?php echo esc_attr( get_bloginfo( 'name' ) ); ?>
                <?php endif; ?>
            </a>
        </h1>

        <!-- Main menu __-->
        <nav id="mainmenu">
	<div id="menu-burger" class="cd-nav-trigger cd-text-replace ">
	 <span></span><span></span><span></span>
	 </div>
	 <div id="menu">
	 <?php get_template_part( 'menu', 'primary' ); // Loads the menu-primary.php template. ?>
	 </div>
	 </nav>
        
    </div> <!-- END .wrapper -->

</header>
<!-- END #header -->


<!-- MAIN CONTENT SECTION  _____________________________________________-->
<section id="content" role="main">
    <div class="wrapper">

        <?php if ( is_home() ): ?>
            <div class="scrolldown"><?php esc_html_e('Scroll','viewpoint'); ?></div>
        <?php endif; ?>

        <?php if ( has_post_thumbnail() || get_theme_mod( 'viewpoint_gmap_page' ) == get_the_ID() ): ?>
            <div class="featured-image-header">
                <?php if ( get_theme_mod( 'viewpoint_gmap_page' ) == get_the_ID() ): ?>
                    <script>
                        jQuery(document).ready(function() {
                            jQuery("#gmap").gMap({
                                scrollwheel: false,
                                zoom: <?php echo get_theme_mod( 'viewpoint_gmap_zoom' ); ?>,
                                markers:[
                                    {
                                        address: "<?php echo get_theme_mod( 'viewpoint_gmap_address' ); ?>",
                                        icon: {
                                            image: "<?php echo get_template_directory_uri(); ?>/imgs/mapmarker.png", iconsize: [48,48], iconanchor: [48,48]
                                        }
                                    }],
                                controls: {
                                    panControl: true,  zoomControl: true,   mapTypeControl: false,   scaleControl: true,   streetViewControl: false,   overviewMapControl: false
                                }
                            });
                        });
                    </script>
                    <div id="gmap"></div>
                <?php endif; ?>

                <figure class="gallery-item reveal activeSlide" data-index="1">
                    <header class='gallery-icon'>
                        <?php if ( is_home() ) : ?>
                            <?php get_the_image( array( 'post_id' => get_option( 'page_for_posts' ), 'size' => 'viewpoint_fullscreen', 'link_to_post' => false ));?>
                        <?php else: ?>
                            <?php get_the_image( array( 'size' => 'viewpoint_fullscreen', 'link_to_post' => false ));?>
                        <?php endif; ?>
                    </header>
                    <?php if ( hybrid_get_post_layout(get_the_ID()) == 'fullscreen-gallery' ) : ?>
                        <figcaption class='gallery-caption'>
                            <div class="entry-summary">
                                <p class="description animWords"><?php
                                    $gallery_photo_count = viewpoint_count_photos_in_gallery( get_the_ID() );
                                    $featimage_id = get_post_thumbnail_id(get_the_ID());
                                    $attachment = get_post($featimage_id);
                                    $description = $attachment->post_content;
                                    echo balanceTags($description);
                                    ?></p>
                                <p class="gallery-count"><?php echo intval($gallery_photo_count); ?> <?php esc_html_e('photos','viewpoint'); ?></p>
                            </div>
                        </figcaption>
                    <?php endif; ?>
                </figure>
            </div>
        <?php endif; ?>

        <div class="entry-content <?php if (is_home()) echo 'blog-timeline';?>">