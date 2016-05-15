<?php
/**
 * Created by PhpStorm.
 * User: nestor
 * Date: 14.05.16
 * Time: 16:53
 * Template Name: Page About
 *
 * @package diamond-2.0
 */
?>
<?php get_header(); // Loads the header.php template. ?>

<div class="container_about">
    <div class="page_about_img">
        <img src="/wp-content/themes/diamond-2.0/img/1.jpg"/>
    </div>
    <div class="page_about_sidebar">
        <img src="/wp-content/themes/diamond-2.0/img/page_about/sidebar.png" />
        <div class="page_about_text_sidebar">
            <div class="page_about_title">
                <?php //echo the_title();?>
            </div>
            <div class="page_about_text">
                <?php //echo $content;?>
            </div>
        </div>
    </div>


</div>
<?php get_footer(); // Loads the footer.php template. ?>