( function ( $ , mw) {
	
	
	var veInstances = [];
	
	function initVisualEditorOnTextarea(textarea) {
		
		var logo = $('<div class="ve-demo-logo"></div>');
		var toolbar = $('<div class="ve-demo-toolbar ve-demo-targetToolbar"></div>');
		var editor = $('<div class="ve-demo-editor"></div>');
		
		$(textarea).before(logo, toolbar, editor);
		$(textarea).css('border', '1px solid #F00');
		
		new ve.init.mw.Platform( ).initialize()
			.fail( function () {
				$( editor ).text( 'Sorry, this browser is not supported.' );
			} )
			.done( function () {
				// Create the target
				var target = new mw.ext.vefpg.editor.Target(textarea, $(textarea).val());

				veInstances.push( target);
			} );
		
	}
	/*
	ve.init.mw.ArticleTarget.prototype.save = function ( doc, options ) {
		var data;
		// Prevent duplicate requests
		if ( this.saving ) {
			return false;
		}

		data = ve.extendObject( {}, options, {
			action: 'visualeditoredit',
			paction: 'save',
			page: this.pageName,
			oldid: this.revid,
			basetimestamp: this.baseTimeStamp,
			starttimestamp: this.startTimeStamp,
			etag: this.etag,
			// Pass in token to prevent automatic badtoken retries
			token: this.editToken
		} );

		this.saving = this.tryWithPreparedCacheKey( doc, data, 'save' )
			.done( this.saveSuccess.bind( this, doc, data ) )
			.fail( this.saveFail.bind( this, doc, data ) );

		return true;
	};
	
	ve.init.mw.ArticleTarget.prototype.saveSuccess = function ( doc, saveData, response ) {
		var data = response.visualeditoredit;
		this.saving = false;
		if ( !data ) {
			this.saveFail( doc, saveData, null, 'Invalid response from server', response );
		} else if ( data.result !== 'success' ) {
			// Note, this could be any of db failure, hookabort, badtoken or even a captcha
			this.saveFail( doc, saveData, null, 'Save failure', response );
		} else if ( typeof data.content !== 'string' ) {
			this.saveFail( doc, saveData, null, 'Invalid HTML content in response from server', response );
		} else {
			this.saveComplete(
				data.content,
				data.categorieshtml,
				data.newrevid,
				data.isRedirect,
				data.displayTitleHtml,
				data.lastModified,
				data.contentSub,
				data.modules,
				data.jsconfigvars
			);
		}
	};*/
	
	function init() {
		$('.createboxInput.form-textarea').first().each(function() {
			initVisualEditorOnTextarea(this);
		});
	}
	
	mw.loader.using( 'ext.visualEditorForPageForm.init', $.proxy( init ) );
	
	
}( jQuery , mw) );