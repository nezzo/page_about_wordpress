<?php
if ( has_nav_menu( 'primary' ) ) :

	wp_nav_menu( array(
		'container' => '',
		'theme_location' => 'primary',
		'container_class' => '',
		'menu_class' => '',
		'menu_id' => '',
		'items_wrap' => '<ul class="cd-projects-previews">%3$s</ul>',
		'fallback_cb' => '' ) );

else:

	echo '<ul class="cd-projects-previews">';
	wp_list_pages( 'sort_column=menu_order&depth=0&title_li=&exclude=' );
	echo '</ul>';

endif;