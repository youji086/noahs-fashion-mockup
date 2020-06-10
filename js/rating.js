let ratingValue = document.getElementById('rating-value').textContent;
let ratingNumValue = Number.parseFloat(ratingValue);

$('.star-rating-valuation').starRating({
  readOnly: true,
  starSize: 16,
  totalStars: 5,
  emptyColor: 'lightgray',
  ratedColor: 'gold',
});
$('.star-rating-valuation').starRating('setRating', ratingNumValue);
