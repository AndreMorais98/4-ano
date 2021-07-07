function confFunction() {
    var txt;
    if (confirm("Tem a certeza?")) {
      txt = "You pressed OK!";
      
    } else {
      txt = "You pressed Cancel!";
    }
    document.getElementById("demo").innerHTML = txt;
  }