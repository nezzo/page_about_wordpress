<?php get_header(); // Loads the header.php template. ?>
<!-- Queried page __-->
<br/>
<div id="single-post-container"></div>
<div id='gallery-89-1' class='gallery masonry-gallery'>
    <?php
    $iterator = 1;

    $args = array(
        'numberposts' => -1,
        'orderby' => 'post_date',
        'order' => 'DESC',
        'post_type' => 'archive',
        'post_status' => 'any');
    $loop = new WP_Query($args);

    while ($loop->have_posts()) : $loop->the_post();
        $post_data_year = get_post_custom_values('year');
        $image = get_post_custom_values('overview_image', get_the_ID());
        $image_url = wp_get_attachment_image_src($image[0], full);
        $preview_div_bg = get_post_custom_values('primary_color', get_the_ID());
        $dump = get_post_meta(get_the_ID(), '', true)
        ?>
        <figure class='gallery-item col-3 reveal' data-content="content-<?php echo $iterator; ?>" data-index='<?php echo $iterator; ?>'>
            <div class='preview zoomer' style='z-index: 0; background:<?php echo $preview_div_bg[0]; ?>;'>
                <header class='gallery-icon file' data-postID='<?php the_ID(); ?>' data-bgcolor='<?php echo $preview_div_bg[0]; ?>'><img
                        src="<?php echo $image_url[0]; ?>"
                        class="attachment-viewpoint_fullscreen size-viewpoint_fullscreen"
                        alt="<?php the_title(); ?>"
                        sizes="(max-width: 1440px) 100vw, 1440px"/></header>
                <div class="zoomer-image"></div>
                <div class="zoomer__area zoomer__area--size-2"></div>
            </div>

            <figcaption class='gallery-caption'>
                <div class='entry-summary' ><h3 class="animIn"
                                               style="opacity: 1; display: block; transform: translateY(0px);"><?php the_title(); ?></h3>
                    <p class="description animIn"
                       style="opacity: 1; display: block; transform: translateY(0px);">
                        Year: <?php echo $post_data_year[0]; ?></p>
                </div>

            </figcaption>
        </figure>
        <?php
        $iterator++;
    endwhile;
    ?>
</div>
</div>
<div class="zoomer-content">
    <div class="content__item" id="content-1" style="width: 100%;">

    </div>
    <!-- ... -->
    <button class="closeBtn button--close">
    </button>
</div>
<script src="<?php echo get_stylesheet_directory_uri() ?>/js/modernizr.custom.js"></script>
<script src="<?php echo get_stylesheet_directory_uri() ?>/js/zoom-slider/classie.js"></script>
<script src="<?php echo get_stylesheet_directory_uri() ?>/js/zoom-slider/dynamics.min.js"></script>
<script src="<?php echo get_stylesheet_directory_uri() ?>/js/zoom-slider/main.js"></script>
<!-- Page comments __-->


<?php get_footer(); // Loads the footer.php template. ?>
