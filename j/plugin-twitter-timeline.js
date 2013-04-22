(function(d,c,f) {
  if (!XMLHttpRequest) return;
  var a = d.getElementsByClassName(c);
  for (var i = a.length - 1; i >= 0; i--) {
    if (!a[i].id) continue;
    var j = new XMLHttpRequest();
    j.box = a[i];
    j.onload = f;
    j.open('get', 'https://szen.in/twtl?' + a[i].id, true);
    j.send();
  }
})(document, 'plugin-twitter-timeline', function() {
  eval('var j=' + this.responseText);
  if ('e89a5e7afae392e0a76a5f98ffdfa9e7f72aa6e6' != j.token) return;
  var l = 10;
  if (this.box.hasAttribute('size')) {
    l = Math.floor(this.box.getAttribute('size'));
    if (isNaN(l)) l = 10;
  }
  var h = '<ul>';
  for (var i = 0; i < l; i++) {
    h += '<li style="background-image:url(\"' + j.records[i].avatar + '\")">' +
      '<a class="speaker' + (j.records[i].retweeted ? ' retweet' : '') +
      '" href="' + j.records[i].ref + '">' + j.records[i].speaker + '</a>' +
      '<span class="words">' + j.records[i].words + '</span>' +
      '<a class="time" href="' + j.records[i].ref + '">' +
      j.records[i].time + '</a>' +
      '</li>';
    console.log(j.records[i]);
  }
  h += '</ul>';
  this.box.innerHTML = h;
});
