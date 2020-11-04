import React, { useEffect } from "react";
import $ from "jquery";
import StateHeader from "./StateHeader";
import TOC from "./TOC";

const Sidebar = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = $(window).scrollTop();
      const elementOffsetTop = $(".sidebar").offset().top;
      const distanceBetweenTopAndSidebar = elementOffsetTop - scrollTop;
      // Calculates when to stop the sidebar to avoid the footer
      const untilTheBottom =
        parseInt($(document).height().toString().replace("px", ""), 10) -
        parseInt(scrollTop.toString().replace("px", ""), 10);
      const calculatedTop = // eslint-disable-next-line
        // eslint-disable-next-line
        (parseInt($(".sidebar").css("width").replace("px", ""), 10) - 25) // eslint-disable-next-line
          .toString() + "px";

      if (
        distanceBetweenTopAndSidebar <= 20 &&
        scrollTop > 75 &&
        untilTheBottom > 775
      ) {
        $(".sidebarInner").css("width", calculatedTop);
        $(".sidebarInner").css("position", "absolute");
        $(".sidebarInner").css("top", scrollTop);
      } else if (distanceBetweenTopAndSidebar > 20 && scrollTop > 75) {
        $(".sidebarInner").css("width", calculatedTop);
        $(".sidebarInner").css("position", "absolute");
        $(".sidebarInner").css("top", scrollTop);
      }
      // eslint-disable-next-line
      else if (untilTheBottom < 775) {
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <div className="sidebar ds-l-col--3">
      <div className="sidebarInner">
        <StateHeader />
        <TOC />
      </div>
    </div>
  );
};

export default Sidebar;
