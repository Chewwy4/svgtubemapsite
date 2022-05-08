//noop
document.querySelector("svg").addEventListener("touchstart", () => { });

const svgimage = document.getElementById("tubeMapSite");

let svgHeadTxtResize = document.getElementsByClassName("svgHeaderTxt");

let svgTxtResize = document.getElementsByClassName("svgLabelsTxt");
let svgTxtAboutMeResize = document.getElementsByClassName("aboutMeTxt");
//modal
let modalparent = document.getElementsByClassName("modal_multi");

let modal_btn_multi = document.getElementsByClassName("nodeBtn_multi");
let modal_btn_outerbox = document.getElementsByClassName("nodeBtn_outerbox");

let span_close_multi = document.getElementsByClassName("close_multi");

function scrollToBottom() {
   "contact".scrollIntoView(false);
}

// When click button, open
function setDataIndex() {
   for (i = 0; i < modal_btn_multi.length; i++) {
      modal_btn_multi[i].setAttribute("data-index", i);
      modalparent[i].setAttribute("data-index", i);
      span_close_multi[i].setAttribute("data-index", i);
   }
}

for (i = 0; i < modal_btn_multi.length; i++) {
   modal_btn_multi[i].onclick = function () {
      let ElementIndex = this.getAttribute("data-index");
      modalparent[ElementIndex].style.opacity = 1;
      modalparent[event.target.getAttribute("data-index")].style.pointerEvents =
         "auto";

      //play preview videos by index of node opened
      console.log(ElementIndex, "was selected");
      if (ElementIndex == 0) {
         const vid1 = document.getElementById("vid1");
         vid1.play();
      }
      if (ElementIndex == 1) {
         const vid2 = document.getElementById("vid2");
         vid2.play();
      }
      if (ElementIndex == 2) {
         const vid3 = document.getElementById("vid3");
         vid3.play();
      }
      if (ElementIndex == 3) {
         const vid4 = document.getElementById("vid4");
         vid4.play();
      }
      if (ElementIndex == 6) {
         const vid6 = document.getElementById("vid6");
         // vid6.requestFullscreen();
         vid6.play();
      }
   };

   span_close_multi[i].onclick = function () {
      let ElementIndex = this.getAttribute("data-index");
      modalparent[ElementIndex].style.opacity = 0;
      modalparent[event.target.getAttribute("data-index")].style.pointerEvents =
         "none";

      //pause preview videos by index of node opened
      if (ElementIndex == 0) {
         const vid1 = document.getElementById("vid1");
         vid1.pause();
      }
      if (ElementIndex == 1) {
         const vid2 = document.getElementById("vid2");
         vid2.pause();
      }
      if (ElementIndex == 2) {
         const vid2 = document.getElementById("vid3");
         vid2.pause();
      }
      if (ElementIndex == 3) {
         const vid4 = document.getElementById("vid4");
         vid4.pause();
      }
      if (ElementIndex == 6) {
         const vid6 = document.getElementById("vid6");
         vid6.pause();
      }
   };
}

window.onload = function () {
   setDataIndex();

   //resize the svg header text on page load
   for (let i = 0; i < svgHeadTxtResize.length; i++) {
      if (window.innerWidth < 800) {
         svgHeadTxtResize[i].style.fontSize = "31em";
      } else {
         svgHeadTxtResize[i].style.fontSize = "26em";
      }
   }

   //resize the svg button text on page load
   for (let i = 0; i < svgTxtResize.length; i++) {
      if (window.innerWidth < 800) {
         svgTxtResize[i].style.fontSize = "28em";
         //  svgTxtResize[i].setAttribute("transform", "translate(100, 0)");
      } else {
         svgTxtResize[i].style.fontSize = "17em";
      }
   }
   for (let i = 0; i < svgTxtAboutMeResize.length; i++) {
      if (window.innerWidth < 800) {
         svgTxtAboutMeResize[i].style.fontSize = "615px";
      } else {
         svgTxtAboutMeResize[i].style.fontSize = "35px";
      }
   }
};

window.onresize = function () {
   for (let i = 0; i < svgHeadTxtResize.length; i++) {
      if (window.innerWidth < 800) {
         svgHeadTxtResize[i].style.fontSize = "30em";
      } else {
         svgHeadTxtResize[i].style.fontSize = "26em";
      }
   }
   for (let i = 0; i < svgTxtResize.length; i++) {
      if (window.innerWidth < 800) {
         svgTxtResize[i].style.fontSize = "29em";
      } else {
         svgTxtResize[i].style.fontSize = "20em";
      }
   }
};
