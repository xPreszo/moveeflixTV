document.querySelectorAll('.row-posters').forEach(row => {
  row.addEventListener('wheel', (e) => {
    e.preventDefault();
    row.scrollLeft += e.deltaY;
  });
});
