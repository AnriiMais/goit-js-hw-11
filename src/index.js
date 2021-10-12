import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import { SearchImageService } from './js/searchService';

import './sass/main.scss';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchImageService = new SearchImageService();

const inputNode = document.querySelector('.form input');
const formInputNode = document.querySelector('#search-form');
export const btnSearch = document.querySelector('.btn-submit');
const btnLoad = document.querySelector('button[data-action="load"]');
btnLoad.classList.add('hidden');
btnLoad.addEventListener('click', onLoadMore);

formInputNode.addEventListener('submit', onFormInput);

async function onFormInput(e) {
  e.preventDefault();
  btnLoad.classList.add('hidden');
  searchImageService.resetPage();
  searchImageService.galleryContainer.innerHTML = '';

  searchImageService.SearchValue = encodeURIComponent(inputNode.value);
  if (searchImageService.SearchValue === '') {
    Notify.info('Sorry, there are no images matching your search query. Please try again.');
    return false;
  } else {
    const resObj = await searchImageService.fetchImages();
    if (resObj.data.totalHits === 0) {
      throw new Error(
        Notify.failure('Sorry, there are no images matching your search query. Please try again.'),
      );
    }
    searchImageService.addGalleryMarkup(resObj.data.hits);
    btnLoad.classList.remove('hidden');
    searchImageService.checkEnd(resObj.data.totalHits);
    new SimpleLightbox('.card a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  }
}

async function onLoadMore(e) {
  const resObj = await searchImageService.fetchImages();

  searchImageService.addGalleryMarkup(resObj.data.hits);
  searchImageService.checkEnd(resObj.data.totalHits);
  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}
