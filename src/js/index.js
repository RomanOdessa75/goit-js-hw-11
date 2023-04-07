import Fetch from './fetchImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.js-search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

formEl.addEventListener('submit', formSubmitHandler);
loadMoreBtnEl.addEventListener('click', loadMoreHandler);

let gallery = new SimpleLightbox('.gallery a');
const fetchImages = new Fetch();

fetchImages.query = formEl.elements.searchQuery.value.trim();
const { query } = fetchImages;

async function formSubmitHandler(event) {
  event.preventDefault();
  galleryEl.innerHTML = '';
  loadMoreBtnEl.classList.add('is-hidden');
  fetchImages.pageRestart();

  const query = findInputValue();

  if (query === '') {
    Notify.failure('Please, write your search query!');
    return;
  }

  const response = await fetchImages.fetchImages(query);
  const data = response.hits;

  if (data.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  makeImagesMarkup(data);
  Notify.info(`Hooray! We found ${response.totalHits} images!`);
  fetchImages.pageIncrement();
  gallery.refresh();

  if (response.totalHits > data.length) {
    loadMoreBtnEl.classList.remove('is-hidden');
  }
}

async function loadMoreHandler() {
  const response = await fetchImages.fetchImages(findInputValue());
  const data = response.hits;

  makeImagesMarkup(data);
  fetchImages.pageIncrement(); // page += 1;
  gallery.refresh();

  if (galleryEl.childElementCount >= response.totalHits) {
    loadMoreBtnEl.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

function findInputValue() {
  return formEl.elements.searchQuery.value.trim();
}

function makeImagesMarkup(data) {
  const innerMarkup = data
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
    <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags} loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
      ${likes}</p>
      <p class="info-item">
        <b>Views</b>
      ${views}</p>
      <p class="info-item">
        <b>Comments</b>
      ${comments}</p>
      <p class="info-item">
        <b>Downloads</b>
      ${downloads}</p>
    </div>
  </div>`
    )
    .join(' ');

  galleryEl.insertAdjacentHTML('beforeend', innerMarkup);
}
