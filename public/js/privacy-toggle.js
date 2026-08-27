/*!
 * The analytics off switch on /privacy.
 *
 * POPIA section 11(3) gives a right to object and section 11(4) gives it teeth:
 * unlike GDPR there is no "compelling legitimate grounds" override, so once
 * somebody objects the processing stops, full stop. A control that only sets a
 * preference somewhere would not satisfy that. This one calls the server, which
 * writes an opt out cookie the collect route checks before it reads anything at
 * all, so the objection takes effect on the very next request.
 *
 * Withdrawal has to be as easy as collection was, so the same button turns it
 * back on.
 *
 * External file rather than inline on purpose. This repo serves its pages
 * straight from git with no build step, and an inline handler here would be the
 * first thing to break the day a Content-Security-Policy is added, which is
 * owed on this site anyway.
 */
(function () {
  "use strict";

  var btn = document.getElementById("toggle");
  var status = document.getElementById("status");
  if (!btn || !status) return;

  function isOptedOut() {
    return document.cookie.indexOf("bz_optout=1") !== -1;
  }

  function paint() {
    var off = isOptedOut();
    btn.disabled = false;
    btn.textContent = off ? "Turn counting back on" : "Turn counting off";
    status.textContent = off
      ? "Off. Nothing is being counted on this device, and the visit cookie has been deleted."
      : "On. Page views and time on page are counted. No identifier is stored.";
  }

  btn.addEventListener("click", function () {
    var off = isOptedOut();
    btn.disabled = true;
    status.textContent = "Saving…";

    fetch("/api/e", { method: off ? "PUT" : "DELETE", credentials: "same-origin" })
      .then(function (r) {
        if (!r.ok) throw new Error("http " + r.status);
        // Tell the beacon on this page immediately, so the choice applies
        // without waiting for a reload.
        if (window.breazyAnalytics) {
          if (off) window.breazyAnalytics.optIn();
          else window.breazyAnalytics.optOut();
        }
        paint();
      })
      .catch(function () {
        btn.disabled = false;
        // Never claim success that did not happen. A privacy control that lies
        // is worse than one that is honestly broken.
        status.textContent =
          "That did not save. Nothing has changed. Please try again, or email mapindabrendon@gmail.com and I will do it by hand.";
      });
  });

  paint();
})();
