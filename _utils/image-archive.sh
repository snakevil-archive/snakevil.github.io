#!/bin/sh

[ -d 's' -a -d '_posts' ] || {
  echo 'Sub modules are out of control.'
  exit 1
}

[ -f 's/i/watermark.png' ] || {
  echo 'Watermark is missing.'
  exit 2
}

'rm' -f s/tmp.png > /dev/null 2>&1

'ls' s/*.png s/*.jpg s/*.svg 2> /dev/null | \
  while read file; do
    name=`'basename' "$file"`
    echo "processing \`$name':"
    printf '%-31s' "  checking references..."
    phrase="](/s/$name"
    refcnt=`'grep' -F "$phrase" _posts/20??-??-??-*.md | 'wc' -l`
    echo $refcnt
    [ 0 -ne $refcnt ] || {
      echo ' IGNORED for non-reference.'
      continue
    }
    printf '%-31s' "  watermarking..."
    ext=`echo "$name" | 'awk' -F'.' '{print $NF}'`
    realname="$name"
    [ 'png' = $ext ] || {
      realname="$('basename' "$name" ".$ext").png"
      ext='png'
    }
    tempfile="s/tmp.$ext"
    'composite' -dissolve 40% -gravity center -quality 100 \
      s/i/watermark.png "$file" $tempfile > /dev/null 2>&1
    [ 0 -eq $? ] && echo 'succeed' || {
      echo 'failed'
      echo ' SKIPPED for failure of watermarking.'
      continue
    }
    printf '%-31s' "  optimizing..."
    ratio=`'pngcrush' -oldtimestamp -ow $tempfile 2>&1 >/dev/null | \
      'grep' 'critical chunk reduction' | \
      'awk' '{print substr($1, 2)}'`
    [ 0 -eq $? ] && echo $ratio || {
      echo 'failed'
      echo ' SKIPPED for failure of optimization.'
      continue
    }
    printf '%-31s' "  hashing storage folder..."
    dir="$('sha1sum' "$tempfile" | 'cut' -c1)"
    echo $dir
    [ -d "s/a/$dir" ] || {
      'mkdir' "s/a/$dir" > /dev/null 2>&1
      [ 0 -eq $? ] || {
        echo ' SKIPPED for failure of folder creation.'
        continue
      }
    }
    printf '%-31s' "  updating references..."
    'grep' -FRl "$phrase" _posts/20??-??-??-*.md | \
      while read file; do
        [ -f "$file.bak" ] || 'cp' -a "$file" "$file.bak"
        'sed' -i -e \
          "s/](\/s\/$name/](\/s\/a\/$dir\/$realname/g" \
          "$file" > /dev/null 2>&1
        [ 0 -eq $? ] || exit 86
      done
    [ 0 -eq $? ] && echo 'succeed' || {
      echo 'failed'
      echo ' SKIPPED for failure of auto posts modification.'
      continue
    }
    printf '%-31s' "  archiving..."
    'mv' "$tempfile" "s/a/$dir/$realname" && \
      'mv' "$file" "$file.bak"
    [ 0 -eq $? ] && echo 'succeed' || {
      echo 'failed'
      echo ' SKIPPED for failure of archiving.'
      continue
    }
    echo ' DONE'
  done
