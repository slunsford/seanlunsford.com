function acronyms() {
  var posts = document.getElementsByClassName("post");
  // var pages = document.getElementsByClassName("page");
  // var postsAndPages = posts.concat(pages);
  console.log(posts);

  for (post of posts) {
    var html = post.innerHTML;
    post.innerHTML = html.replace(
      /(\b[A-Z]{2,}s?)\b(?=[^\>]+\<)/g,
      '<span class="small-caps">$1</span>'
    );
  }
}
