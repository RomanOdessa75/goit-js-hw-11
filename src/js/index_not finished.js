import { PixabayAPI } from './fetchImages';
// import createGalleyCards from '../templates/gallery-card.hbs';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('.js-search-form');
const galleryListEl = document.querySelector('.js-gallery');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.js-load-more');

const pixabayAPI = new PixabayAPI();

const handleSearchImages = event => {
  event.preventDefault();

  const searchQuery = event.target.elements['searchQuery'].value.trim();

  pixabayAPI.query = searchQuery;

  pixabayAPI.fetchImages().then(data => {
    console.log(data);
    galleryEl.innerHTML = renderGallery(data.hits);
    loadMoreBtnEl.classList.remove('is-hidden');
  });
};

const handleLoadMoreBtnClick = () => {
  pixabayAPI.page += 1;

  pixabayAPI.fetchImages().then(data => {
    console.log(data);
    galleryEl.insertAdjacentHTML('beforeend', renderGallery(data.hits));
  });
};

function renderGallery(elements) {
  const markup = elements
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <a href="${largeImageURL}">
      <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
    </div>`;
      }
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

searchFormEl.addEventListener('submit', handleSearchImages);

//
//
//
//
// const input = document.querySelector('.search-input');
// const btnSearch = document.querySelector('.search-form-button');
// const gallery = document.querySelector('.gallery');
// const btnLoadMore = document.querySelector('.load-more');
// let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

// // const { height: cardHeight } = document
// //   .querySelector('.gallery')
// //   .firstElementChild.getBoundingClientRect();

// // window.scrollBy({
// //   top: cardHeight * 2,

// //   behavior: 'smooth',
// // });

// btnLoadMore.style.display = 'none';

// let pageNumber = 1;

// btnSearch.addEventListener('click', e => {
//   e.preventDefault();
//   cleanGallery();
//   const trimmedValue = input.value.trim();
//   if (trimmedValue !== '') {
//     fetchImages(trimmedValue, pageNumber).then(foundData => {
//       if (foundData.hits.length === 0) {
//         Notiflix.Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       } else {
//         renderImageList(foundData.hits);
//         Notiflix.Notify.success(
//           `Hooray! We found ${foundData.totalHits} images.`
//         );
//         btnLoadMore.style.display = 'block';
//         gallerySimpleLightbox.refresh();
//       }
//     });
//   }
// });

// btnLoadMore.addEventListener('click', () => {
//   pageNumber++;
//   const trimmedValue = input.value.trim();
//   btnLoadMore.style.display = 'none';
//   fetchImages(trimmedValue, pageNumber).then(foundData => {
//     if (foundData.hits.length === 0) {
//       Notiflix.Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     } else {
//       renderImageList(foundData.hits);
//       Notiflix.Notify.success(
//         `Hooray! We found ${foundData.totalHits} images.`
//       );
//       btnLoadMore.style.display = 'block';
//     }
//   });
// });

// function renderImageList(images) {
//   console.log(images, 'images');
//   const markup = images
//     .map(image => {
//       console.log('img', image);
//       return `<div class="photo-card">

//        <a href="${image.largeImageURL}"><img class="photo" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/></a>

//         <div class="info">
//            <p class="info-item">
//     <b>Likes</b> <span class="info-item-api"> ${image.likes} </span>
// </p>
//             <p class="info-item">
//                 <b>Views</b> <span class="info-item-api">${image.views}</span>
//             </p>
//             <p class="info-item">
//                 <b>Comments</b> <span class="info-item-api">${image.comments}</span>
//             </p>
//             <p class="info-item">
//                 <b>Downloads</b> <span class="info-item-api">${image.downloads}</span>
//             </p>
//         </div>
//     </div>`;
//     })
//     .join('');
//   gallery.innerHTML += markup;
// }

// function cleanGallery() {
//   gallery.innerHTML = '';
//   pageNumber = 1;
//   btnLoadMore.style.display = 'none';
// }
