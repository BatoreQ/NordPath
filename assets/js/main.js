/* FadaRepair — skrypty strony (bez zewnętrznych bibliotek) */
(function () {
  "use strict";

  /* --- Menu mobilne --- */
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* --- Podświetlenie aktualnego dnia w tabeli godzin otwarcia --- */
  var todayRow = document.querySelector('.hours-table tr[data-day="' + new Date().getDay() + '"]');
  if (todayRow) {
    todayRow.classList.add("is-today");
  }

  /* --- Rok w stopce --- */
  var yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* --- Walidacja i obsługa formularza kontaktowego ---
     Uwaga dla wdrażającego: formularz nie ma obecnie backendu.
     Po podłączeniu prawdziwego adresu wysyłki (np. Formspree, EmailJS
     albo własny endpoint), zastąp blok "TODO: wysyłka" realnym
     zapytaniem fetch() do tego adresu. */
  var form = document.getElementById("contact-form");

  if (form) {
    var statusBox = document.getElementById("form-status");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var isValid = true;

      form.querySelectorAll("[required]").forEach(function (field) {
        var errorEl = document.getElementById(field.id + "-error");
        var fieldValid = field.checkValidity();

        if (field.type === "tel" && field.value.trim()) {
          fieldValid = /^[0-9+()\s-]{7,}$/.test(field.value.trim());
        }

        if (!fieldValid) {
          isValid = false;
          field.setAttribute("aria-invalid", "true");
          if (errorEl) {
            errorEl.textContent = field.type === "tel"
              ? "Podaj poprawny numer telefonu."
              : "To pole jest wymagane.";
          }
        } else {
          field.removeAttribute("aria-invalid");
          if (errorEl) {
            errorEl.textContent = "";
          }
        }
      });

      if (!isValid) {
        statusBox.textContent = "Sprawdź zaznaczone pola formularza i spróbuj ponownie.";
        statusBox.className = "form-status is-visible form-status--err";
        return;
      }

      /* TODO: wysyłka — patrz komentarz nad tym blokiem */

      statusBox.textContent =
        "Dziękujemy! Zgłoszenie zostało przyjęte — oddzwonimy, aby potwierdzić termin.";
      statusBox.className = "form-status is-visible form-status--ok";
      form.reset();
    });
  }
})();
