let SessionLoad = 1
if &cp | set nocp | endif
let s:cpo_save=&cpo
set cpo&vim
nmap gx <Plug>NetrwBrowseX
nnoremap <silent> <Plug>NetrwBrowseX :call netrw#NetrwBrowseX(expand("<cWORD>"),0)
let &cpo=s:cpo_save
unlet s:cpo_save
set autoindent
set backspace=indent,eol,start
set expandtab
set fileencodings=ucs-bom,utf-8,default,latin1
set helplang=en
set history=50
set nomodeline
set printoptions=paper:letter
set ruler
set runtimepath=~/.vim,/var/lib/vim/addons,/usr/share/vim/vimfiles,/usr/share/vim/vim72,/usr/share/vim/vimfiles/after,/var/lib/vim/addons/after,~/.vim/after,/usr/share/lilypond/2.12.3/vim/
set shiftwidth=2
set suffixes=.bak,~,.swp,.o,.info,.aux,.log,.dvi,.bbl,.blg,.brf,.cb,.ind,.idx,.ilg,.inx,.out,.toc
set tabstop=2
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/Documents/git/diabetes/src/mock
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +0 polymaps/src/Arrow.js
badd +0 polymaps/src/Cache.js
badd +0 polymaps/src/Compass.js
badd +0 polymaps/src/Dblclick.js
badd +0 polymaps/src/Dispatch.js
badd +0 polymaps/src/Drag.js
badd +0 polymaps/src/end.js
badd +0 polymaps/src/GeoJson.js
badd +0 polymaps/src/Grid.js
badd +0 polymaps/src/Hash.js
badd +0 polymaps/src/Id.js
badd +0 polymaps/src/Image.js
badd +0 polymaps/src/Interact.js
badd +0 polymaps/src/Layer.js
badd +0 polymaps/src/Map.js
badd +0 polymaps/src/ns.js
badd +0 polymaps/src/Queue.js
badd +0 polymaps/src/start.js
badd +0 polymaps/src/Stylist.js
badd +0 polymaps/src/Svg.js
badd +0 polymaps/src/Touch.js
badd +0 polymaps/src/Transform.js
badd +0 polymaps/src/Url.js
badd +0 polymaps/src/Wheel.js
badd +0 templates/glucose.html
badd +0 templates/index.html
badd +0 templates/list.html
badd +0 templates/openlayers.html
badd +0 templates/panojs-hello.html
badd +0 templates/polymap.html
badd +0 templates/tilegrid.html
badd +0 date.py
badd +0 plot.py
badd +0 simple.py
badd +0 simple.conf
badd +0 HACKING
badd +0 static/CartesianLayer.js
badd +0 static/glucose.js
badd +0 static/OpenLayers.js
badd +0 static/polymaps-bounds.js
badd +0 static/Second.js
badd +0 static/TileGrid.js
badd +0 static/XYZ.js
badd +0 static/panojs.css
badd +0 static/style.css
args polymaps/src/Arrow.js polymaps/src/Cache.js polymaps/src/Compass.js polymaps/src/Dblclick.js polymaps/src/Dispatch.js polymaps/src/Drag.js polymaps/src/end.js polymaps/src/GeoJson.js polymaps/src/Grid.js polymaps/src/Hash.js polymaps/src/Id.js polymaps/src/Image.js polymaps/src/Interact.js polymaps/src/Layer.js polymaps/src/Map.js polymaps/src/ns.js polymaps/src/Queue.js polymaps/src/start.js polymaps/src/Stylist.js polymaps/src/Svg.js polymaps/src/Touch.js polymaps/src/Transform.js polymaps/src/Url.js polymaps/src/Wheel.js templates/glucose.html templates/index.html templates/list.html templates/openlayers.html templates/panojs-hello.html templates/polymap.html templates/tilegrid.html date.py plot.py simple.py simple.conf HACKING static/CartesianLayer.js static/glucose.js static/OpenLayers.js static/polymaps-bounds.js static/Second.js static/TileGrid.js static/XYZ.js static/panojs.css static/style.css
edit polymaps/src/Arrow.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal keymap=
setlocal noarabic
setlocal autoindent
setlocal nobinary
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
setlocal comments=s1:/*,mb:*,ex:*/,://,b:#,:%,:XCOMM,n:>,fb:-
setlocal commentstring=/*%s*/
setlocal complete=.,w,b,u,t,i
setlocal completefunc=
setlocal nocopyindent
setlocal nocursorcolumn
setlocal nocursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'javascript'
setlocal filetype=javascript
endif
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldmarker={{{,}}}
setlocal foldmethod=manual
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=tcq
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=0
setlocal include=
setlocal includeexpr=
setlocal indentexpr=
setlocal indentkeys=0{,0},:,0#,!^F,o,O,e
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
setlocal nolist
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal nomodeline
setlocal modifiable
setlocal nrformats=octal,hex
setlocal nonumber
setlocal numberwidth=4
setlocal omnifunc=
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=2
setlocal noshortname
setlocal nosmartindent
setlocal softtabstop=0
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=
setlocal suffixesadd=
setlocal swapfile
setlocal synmaxcol=3000
if &syntax != 'javascript'
setlocal syntax=javascript
endif
setlocal tabstop=2
setlocal tags=
setlocal textwidth=0
setlocal thesaurus=
setlocal nowinfixheight
setlocal nowinfixwidth
setlocal wrap
setlocal wrapmargin=0
silent! normal! zE
let s:l = 1 - ((0 * winheight(0) + 25) / 50)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1
normal! 0
tabnext 1
if exists('s:wipebuf')
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 shortmess=filnxtToO
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
