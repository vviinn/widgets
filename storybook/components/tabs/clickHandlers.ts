export const clickHandlers = (evt, cityName, mainId) => {
  console.log(evt, cityName, mainId);
  var i, tabcontent, tablink;
  tabcontent = document
    .getElementById(mainId)
    .getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablink = document.getElementById(mainId).getElementsByClassName("tablink");
  for (i = 0; i < tablink.length; i++) {
    tablink[i].className = tablink[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
};
