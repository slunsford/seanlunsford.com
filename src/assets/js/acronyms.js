function acronyms() {
  var posts = document.getElementsByClassName("post");
  
  for (post of posts) {
    var walker = document.createTreeWalker(
      post,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    var textNodes = [];
    var node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }
    
    textNodes.forEach(function(textNode) {
      if (textNode.textContent.match(/\b[A-Z]{2,}s?\b/)) {
        var span = document.createElement('span');
        span.innerHTML = textNode.textContent.replace(
          /\b([A-Z]{2,}s?)\b/g,
          '<span class="small-caps">$1</span>'
        );
        textNode.parentNode.replaceChild(span, textNode);
      }
    });
  }
}
