import './css/styles.css';
import Notiflix from 'notiflix';

import API from './js/fetchPhotos';
import render from './js/photoMarkup';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

form.addEventListener('submit', onFormSubmit);
async function onFormSubmit(event) {
  event.preventDefault();

  currentPage = 1;
  searchQuery = event.currentTarget.elements.searchQuery.value;

  if (!searchQuery.trim()) {
    return;
  }

  const response = await API.fetchPhotos(searchQuery, currentPage);
  currentHits = response.hits.length;

  if (response.totalHits >= currentHits) {
    loadMore.classList.remove('hidden');
  } else {
    loadMore.classList.add('hidden');
  }

  try {
    if (response.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      render.photoMarkup(response.hits);
      lightbox.refresh();
    }

    if (response.totalHits === 0) {
      gallery.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMore.classList.add('hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

loadMore.addEventListener('click', onLoadMore);

async function onLoadMore() {
  currentPage += 1;
  const response = await API.fetchPhotos(searchQuery, currentPage);
  let totalPages = Math.ceil(response.totalHits / 40);
  render.photoMarkup(response.hits);
  lightbox.refresh();
  currentHits += response.hits.length;
  if (currentPage < totalPages) {
    loadMore.classList.add('hidden');
  } else {
    loadMore.classList.add('hidden');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
