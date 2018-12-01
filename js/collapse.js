jQuery(document).ready(function($) {

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("open");
    var box = this.nextElementSibling;
    if (box.style.display === "block" ) {
      box.style.display = "none";
    } else {
      box.style.display = "block";
    }
  });
}
});