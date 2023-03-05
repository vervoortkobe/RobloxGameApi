const search = window.location.search;
const success = document.getElementById("success");
const successdiv = document.getElementById("successdiv");
const successtitle = document.getElementById("successtitle");
const successdesc = document.getElementById("successdesc");
const key1 = document.getElementById("key1");
const key2 = document.getElementById("key2");

if(search.includes("?key=")) {
  document.title = `Dashboard | ${search.split("&success=")[0].replace("?key=", "")}`;
  key1.setAttribute("value", search.split("&success=")[0].replace("?key=", ""));
  key2.setAttribute("value", search.split("&success=")[0].replace("?key=", ""));
}
if(search.includes("&success=")) {
  switch(true) {
    case search.includes("&success=add"): 
      {
        success.classList.add("slideIn");
        successtitle.innerHTML = `✅ Add`;
        successdesc.innerHTML = `Your record was successfully added to the DB!`;
        slOut();
        break;
      }
    case search.includes("&success=update"):
      {
        success.classList.add("slideIn");
        successtitle.innerHTML = `✅ Add`;
        successdesc.innerHTML = `Your record was successfully updated in the DB!`;
        slOut();
        break;
      }
    case search.includes("&success=remove"):
      {
        success.classList.add("slideIn");
        successtitle.innerHTML = `✅ Remove`;
        successdesc.innerHTML = `Your record was successfully removed from the DB!`;
        slOut();
        break;
      }
    case search.includes("&success=fail"):
      {
        success.classList.add("slideIn");
        successdiv.setAttribute("class", "alert alert-dismissible alert-danger");
        successtitle.innerHTML = `❌ Remove`;
        successdesc.innerHTML = `Your record wasn't removed, because it doesn't exist!`;
        slOut();
        break;
      }
    default:
      //none
      break;
  }
} else {
  success.setAttribute("style", "display: none;");
  successdiv.setAttribute("style", "display: none;");
}
function slOut() {
    setTimeout(() => {
    const success = document.getElementById("success");
    success.classList.remove("slideIn");
    success.classList.add("slideOut");
  }, 3000);
}
setTimeout(() => {
  document.getElementById("preload").style.display = "none";
  document.getElementById("pagecontent").style.display = "block";
}, 200);