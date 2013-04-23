(function(c, r, f) {
  if (!XMLHttpRequest) return;
  var a = document.getElementsByClassName(c);
  for (var i = a.length - 1; i >= 0; i--) {
    if (!a[i].id) {
      continue;
    }
    var j = new XMLHttpRequest();
    j.format = f;
    j.box = a[i];
    j.onload = r;
    j.open('get', 'https://szen.in/twtl/' + a[i].id + '.json', true);
    j.send();
  }
})('plugin-twitter-timeline', function() {
  eval('var j=' + this.responseText);
  if ('e89a5e7afae392e0a76a5f98ffdfa9e7f72aa6e6' != j.token ||
    !j.records.length
  ) {
    return;
  }
  document.getElementsByClassName('page-sidebar')[0].style.display = 'block';
  this.box.style.display = 'block';
  var l = 10;
  if (this.box.hasAttribute('szen:size')) {
    l = Math.floor(this.box.getAttribute('szen:size'));
    if (isNaN(l)) {
      l = 10;
    }
  }
  var b = false;
  if (this.box.hasAttribute('szen:avatar')) {
    b = 'true' == this.box.getAttribute('szen:avatar') ||
      'enabled' == this.box.getAttribute('szen:avatar');
  }
  var h = '<legend><a href="' + j.root + '">Twitter Timeline</a></legend>' +
    '<ul>';
  for (var i = 0; i < l; i++) {
    h += '<li' + (j.records[i].retweeted ? ' class="retweet"' : '') + '>' +
      '<a class="speaker" href="' + j.records[i].ref + '">' +
      (b ? ('<img src="' + j.records[i].avatar + '" width="16" />') : '') +
      '<span>' + j.records[i].speaker + '</span></a>' +
      '<span class="words">' + j.records[i].words + '</span>' +
      '<a class="time" href="' + j.records[i].ref + '">' +
      this.format(j.records[i].time) + '</a>' +
      '</li>';
  }
  h += '</ul>';
  this.box.innerHTML = h;
}, function(t) {
  var d = new Date(t);
  var h = '<time datetime="' + d.getUTCFullYear() + '-' +
    ((8 < d.getUTCMonth()) ?
      (1 + d.getUTCMonth()) :
      ('0' + (1 + d.getUTCMonth()))
    ) + '-' +
    ((9 < d.getUTCDate()) ? d.getUTCDate() : ('0' + d.getUTCDate())) + 'T' +
    ((9 < d.getUTCHours()) ? d.getUTCHours() : ('0' + d.getUTCHours())) + ':' +
    ((9 < d.getUTCMinutes()) ?
      d.getUTCMinutes() :
      ('0' + d.getUTCMinutes())
    ) + ':' +
    ((9 < d.getUTCSeconds()) ?
      d.getUTCSeconds() :
      ('0' + d.getUTCSeconds())
    ) + 'Z">';
  d = Math.round(Date.now() / 1000) - t;
  console.log(Date.now() + ',' + t);
  if (60 > d) {
    h += 'now';
  } else {
    d = Math.round(d / 60);
    if (60 > d) {
      h += d + ' minutes ago';
    } else {
      d = Math.round(d / 60);
      if (24 > d) {
        h += d + ' hours ago';
      } else {
        d = Math.round(d / 24);
        if (7 > d) {
          h += d + ' days ago';
        } else {
          h += Math.round(d / 7) + ' weeks ago';
        }
      }
    }
  }
  h += '</time>';
  return h;
});
