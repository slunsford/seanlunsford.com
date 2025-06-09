function acronyms() {
  var posts = document.getElementsByClassName("post");

  for (post of posts) {
    var html = post.innerHTML;
    post.innerHTML = html.replace(
      /(\b[A-Z]{2,}s?)\b(?=[^\>]+\<)/g,
      '<span class="small-caps">$1</span>'
    );
  }
}
