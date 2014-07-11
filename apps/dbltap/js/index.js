var a = document.querySelector('#a');
var b = document.querySelector('#b');

a.addEventListener('click', function() {
  alert('a');
});

b.addEventListener('dbltap', function() {
  b.style.display = 'none';
});

var gd = new GestureDetector(b);
gd.startDetecting();
