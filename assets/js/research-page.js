(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    const lastUpdated = document.getElementById('last-updated');
    if (!lastUpdated) return;

    const modified = new Date(document.lastModified);
    lastUpdated.textContent = Number.isNaN(modified.getTime())
      ? 'recently'
      : modified.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
  });
})();
