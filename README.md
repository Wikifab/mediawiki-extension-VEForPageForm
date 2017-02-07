# VEForPageForm

VE for page for is a mediawiki extension to integrate VisualEditor into PageForm forms

# Installation

See documentation of Page Forms and Visual Editor to install them, with Parsoid.

Extract an put VEForPageForm  in the 'extensions' directory.

Include it in LocalSettings.php :
 wfLoadExtension( 'VisualEditor' );

# Configuration

To proper work, you need to load PageForm and VisualEditor extensions in your Localsetting.php. And you need to define your connection with parsoid. See VisualEditor documentation for more details. but you may not want VisualEditor to be activated on usual edit pages. To do so you can configure it in Localsettings.php following this example :

 wfLoadExtension( 'PageForm' );
 wfLoadExtension( 'VisualEditor' );
 wfLoadExtension( 'VEForPageForm' );
 
 // Disable VE by default for everybody
 $wgDefaultUserOptions['visualeditor-enable'] = 0;
 
 // Don't allow users to enable it
 $wgHiddenPrefs[] = 'visualeditor-enable';
 
 $wgVirtualRestConfig['modules']['parsoid'] = array(
 		// URL to the Parsoid instance
 		// Use port 8142 if you use the Debian package
 		'url' => 'http://localhost:8000',
 		// Parsoid "domain" (optional)
 		'domain' => 'localtest.me',
 );

To enable VE on a PageForm field, you need to add the class 'form-textarea' on the texteara input, in your page form template

for instance : 
  {{{field|Description|input type=textarea|class=form-textarea}}}

# Credits

This extension was written by Pierre Boutet.
