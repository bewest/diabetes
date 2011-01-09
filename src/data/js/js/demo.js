/* Common JavaScript for jQuery demonstration pages. */
$(function () {
	$('head').prepend('<link href="kw-name.rss.xml" type="application/rss+xml" rel="alternate" title="RSS Feed"/>');
	// Add header links
	var current = location.href.replace(/^.*[\\\/]([^\.]+)\.[^\.]+$/, '$1').toLowerCase();
	$('<div id="header-links">' +
		(current == 'index' ? '' : '<a id="home" href="index.html">' +
		'<img src="img/homePage.png" alt="Home page" title="Home page"/></a>&nbsp;') +
		'<a href="#" id="crosslink"><img src="img/plugins.png" alt="Other plugins" title="Other plugins"/></a>&nbsp;' +
		'<ul id="crosslinks">' +
		(current == 'bookmark'      ? '' : '<li><a href="bookmark.html">jQuery Bookmark</a></li>') +
		(current == 'calculator'    ? '' : '<li><a href="calculator.html">jQuery Calculator</a></li>') +
		(current == 'countdown'     ? '' : '<li><a href="countdown.html">jQuery Countdown</a></li>') +
		(current == 'dateentry'     ? '' : '<li><a href="dateEntry.html">jQuery Date Entry</a></li>') +
		(current == 'datepick'      ? '' : '<li><a href="datepick.html">jQuery Datepicker</a></li>') +
		(current == 'gchart'        ? '' : '<li><a href="gChart.html">jQuery Google Chart</a></li>') +
		(current == 'gsblogbar'     ? '' : '<li><a href="gsblogbar.html">jQuery Google Search Blogbar</a></li>') +
		(current == 'gsbookbar'     ? '' : '<li><a href="gsbookbar.html">jQuery Google Search Bookbar</a></li>') +
		(current == 'gsnewsbar'     ? '' : '<li><a href="gsnewsbar.html">jQuery Google Search Newsbar</a></li>') +
		(current == 'gsvideobar'    ? '' : '<li><a href="gsvideobar.html">jQuery Google Search Videobar</a></li>') +
		(current == 'icalendar'     ? '' : '<li><a href="icalendar.html">jQuery iCalendar</a></li>') +
		(current == 'imagecube'     ? '' : '<li><a href="imageCube.html">jQuery Image Cube</a></li>') +
		(current == 'keypad'        ? '' : '<li><a href="keypad.html">jQuery Keypad</a></li>') +
		(current == 'labeleffect'   ? '' : '<li><a href="labelEffect.html">jQuery Label Effect</a></li>') +
		(current == 'localisation'  ? '' : '<li><a href="localisation.html">jQuery Localisation</a></li>') +
		(current == 'realperson'    ? '' : '<li><a href="realPerson.html">jQuery Real Person</a></li>') +
		(current == 'relationships' ? '' : '<li><a href="relationships.html">jQuery Relationships</a></li>') +
		(current == 'svg'           ? '' : '<li><a href="svg.html">jQuery SVG Integration</a></li>') +
		(current == 'themes'        ? '' : '<li><a href="themes.html">jQuery Themes</a></li>') +
		(current == 'timeentry'     ? '' : '<li><a href="timeEntry.html">jQuery Time Entry</a></li>') +
		'</ul>' +
		'<a href="kw-name.rss.xml"><img src="img/rss.png" alt="RSS Feed" title="RSS Feed"/></a>' +
		'</div>').insertBefore('h1');
	var crosslink = $('#crosslink');
	var offset = crosslink.offset();
	var crosslinks = $('#crosslinks');
	crosslink.toggle(function() {
		crosslinks.css({left: ($.browser.msie || $.browser.opera ?
			offset.left : crosslink[0].offsetLeft) +
			crosslink.width() - crosslinks.width(),
			top: ($.browser.msie || $.browser.opera ? offset.top :
			crosslink[0].offsetTop) + crosslink.height()});
		crosslinks.slideDown();
	}, function() {
		crosslinks.slideUp();
	});
	$('#download').append(' <img src="img/download.png" alt="" style="">');
	if ($.fn.bookmark) {
		$('#bookmark').bookmark({compact: true, popup: true, icons: 'img/bookmarks.png',
			popupText: '<button>Bookmark this <img src="img/bookmarker.png" alt=""/></button>'});
	}
	// Ratings
	showRating(current, '#rating');
	// Stripe tables
	$('table').each(function() {
		$('tr:odd', this).addClass('alternate');
	});
	// Initialise tabs
	if ($.fn.tabs) {
		$('#tabs').tabs($.fn.tabs.tabProps);
	}
	// Execute example script tags
	$('code.jsdemo').each(function () {
		$(this).removeClass('jsdemo').addClass('js').hide().
			wrap('<div class="showCode"></div>').
			before('<a href="#" class="showCode">Show code</a><br/>');
		eval($(this).text().replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
	});
	$('code.css').each(function () {
		$(this).hide().wrap('<div class="showCode"></div>').
			before('<a href="#" class="showCode">Show CSS</a><br/>');
	});
	$('a.showCode').toggle(function() {
		$(this).text($(this).text().replace(/Show/, 'Hide')).
			parent().css('width', 'auto').find('code').show();
		return false;
	}, function() {
		$(this).text($(this).text().replace(/Hide/, 'Show')).
			parent().css('width', '80px').find('code').hide();
		return false;
	});
	// Code highlighting
	if ($.fn.chili) {
		$('code').chili({recipeFolder: 'js/'});
	}
});

function showRating(name, id) {
	var rating = {bookmark: [4.0, 5], calculator: [4.0, 4],
		countdown: [4.5, 22], dateentry: [4.5, 6],
		datepick: [5.0, 29], gchart: [4.0, 17],
		gsblogbar: [0.0, 0], gsbookbar: [0.0, 0],
		gsnewsbar: [0.0, 0], gsvideobar: [4.0, 1],
		icalendar: [4.0, 1], imagecube: [4.0, 8],
		keypad: [4.0, 5], labeleffect: [0.0, 0],
		localisation: [4.0, 2], realperson: [0.0, 0],
		relationships: [4.0, 1], svg: [4.0, 28],
		themes: [3.0, 1], timeentry: [4.0, 28]}[name];
	var html = '';
	if (rating) {
		html = ': <span>';
		for (var i = 0; i < 5; i++) {
			html += '<img src="img/star' + (i + 0.5 == rating[0] ? '.5' :
				(i < rating[0] ? '1' : '0')) + '.gif"/>';
		}
		html += '</span> (' + rating[1] + ' vote' + (rating[1] != 1 ? 's' : '') + ')';
	}
	$(id).addClass('rating').html(html);
}

function jumpTo(tab, id) {
	$('#tabs').triggerTab(tab);
	setTimeout('scrollTo(0, $("a[name=' + id + ']").offset().top);', 100);
	return false;
}
