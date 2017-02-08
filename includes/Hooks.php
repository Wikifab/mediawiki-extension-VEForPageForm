<?php
namespace VeForPageForm;

class Hooks {

	public static function start() {
		global $wgOut;

		$wgOut->addModules( [
				'ext.visualEditorForPageForm.init'
		] );
	}
}