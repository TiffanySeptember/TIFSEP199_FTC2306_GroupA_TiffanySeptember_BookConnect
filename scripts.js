// initialize variables with proper declaration
let matches = books;
let page = 1;
const BOOKS_PER_PAGE = 36; // i define the number of books per page

// checking for valid 'books' array
if (!books || !Array.isArray(books)) throw new Error("Source required");

// i just defined the day and night objects
const css = {
  day: {
    dark: "10, 10, 20",
    light: "255, 255, 255",
  },
  night: {
    dark: "255, 255, 255",
    light: "10, 10, 20",
  },
};

// initialize 'fragment' properly
const fragment = document.createDocumentFragment(); //empty document fragment
// extract the first batch of books to show
const extracted = books.slice(0, BOOKS_PER_PAGE);
//a loop through the extracted books and preview element for each
for (const { author, image, title, id } of extracted) {
  const preview = createPreview({
    author,
    id,
    image,
    title,
  });
  // set'data-list-preview' attribute
  preview.dataset.listPreview = id;
  fragment.appendChild(preview);
}

//got the data-list-item element
let dataListItems = document.querySelector("[data-list-items]");
// add the fragment
dataListItems.appendChild(fragment);

// initialize 'genres' properly
//document fragment for genres
const allGenres = document.createDocumentFragment();
const optionElement = document.createElement("option");
optionElement.value = "any";
optionElement.innerText = "All Genres";
//add 'all genres' to document
allGenres.appendChild(optionElement);

//loop through genres and create option elements
for (const [id, name] of Object.entries(genres)) {
  const element = document.createElement("option");
  element.value = id;
  element.innerText = name;
  allGenres.appendChild(element); //add option to document
}

//get the data-search-genres element
const dataSearchGenres = document.querySelector("[data-search-genres]");
dataSearchGenres.appendChild(allGenres);

// initialize 'authors' & create document fragment
const allAuthors = document.createDocumentFragment();
const authorElement = document.createElement("option");
authorElement.value = "any";
authorElement.innerText = "All Authors";
allAuthors.appendChild(authorElement);

// loop through authors
for (const [id, name] of Object.entries(authors)) {
  const element = document.createElement("option");
  element.value = id;
  element.innerText = name;
  allAuthors.appendChild(element);
}

// Assuming 'data-search-authors' is a DOM element
const dataSearchAuthors = document.querySelector("[data-search-authors]");
dataSearchAuthors.appendChild(allAuthors);

// initialize 'v' properly and set documentElement properties
const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
const v = isDarkTheme ? "night" : "day";
//set css variables for selected themes
document.documentElement.style.setProperty("--color-dark", css[v].dark);
document.documentElement.style.setProperty("--color-light", css[v].light);

// correct the assignment of 'data-list-button'
let dataListButton = document.querySelector("[data-list-button]");
dataListButton.textContent = `Show more (${
  matches.length - page * BOOKS_PER_PAGE > 0
    ? matches.length - page * BOOKS_PER_PAGE
    : 0
})`;

dataListButton.disabled = matches.length - page * BOOKS_PER_PAGE <= 0;

// Correct event listeners by adding 'function'
dataSearchCancel = document.querySelector("[data-search-cancel]");
dataSearchCancel.addEventListener("click", function () {
  const dataSearchOverlay = document.querySelector("[data-search-overlay]");
  dataSearchOverlay.open = false; //close search overlay when cancel is clicked
});
//get data-settings-cancel element
dataSettingsCancel = document.querySelector("[data-settings-cancel]");
dataSettingsCancel.addEventListener("click", function () {
  const settingsOverlay = document.querySelector("[data-settings-overlay]");
  if (settingsOverlay) {
    settingsOverlay.open = false;
  }
});
//get element
dataSettingsForm = document.querySelector("[data-settings-form]");
dataSettingsForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(dataSettingsForm);

  for (const [name, value] of formData.entries()) {
    console.log(`${name}: ${value}`); // Log form field names and values
  }

  const settingsOverlay = document.querySelector("[data-settings-overlay]");
  if (settingsOverlay) {
    settingsOverlay.open = false; //close settings overlay after submission
  }
});

// get the data-list-close element
dataListClose = document.querySelector("[data-list-close]");
dataListClose.addEventListener("click", function () {
  const listOverlay = document.querySelector("[data-list-active]");
  listOverlay.open = false;
});

// Get the data-list-button element
dataListButton = document.querySelector("[data-list-button]");
dataListButton.addEventListener("click", function () {
  const startIndex = page * BOOKS_PER_PAGE;
  const endIndex = startIndex + BOOKS_PER_PAGE;

  // get the books to display on the current page
  const nextPageItems = matches.slice(startIndex, endIndex);
  const fragment = document.createDocumentFragment();

  // create preview elements and add them to the fragment
  for (const { author, image, title, id } of nextPageItems) {
    const preview = createPreview({
      author,
      id,
      image,
      title,
    });

    // set the 'data-list-preview' attribute
    preview.dataset.listPreview = id;
    fragment.appendChild(preview);
  }

  const dataListItems = document.querySelector("[data-list-items]");
  dataListItems.appendChild(fragment);

  page++;

  // update the show more button based on remaining books
  dataListButton.textContent = `Show more (${
    matches.length - page * BOOKS_PER_PAGE > 0
      ? matches.length - page * BOOKS_PER_PAGE
      : 0
  })`;
  //disable if theres no more books to show
  dataListButton.disabled = matches.length - page * BOOKS_PER_PAGE <= 0;
});
//get data-header-search and data-search-overlay elements
dataHeaderSearch = document.querySelector("[data-header-search]");
dataHeaderSearch.addEventListener("click", function () {
  const dataSearchOverlay = document.querySelector("[data-search-overlay]");
  dataSearchOverlay.open = true;
  if (dataSearchOverlay.open === true) {
    const dataSearchTitle = document.querySelector("[data-search-title]");
    dataSearchTitle.focus();
  }
});

dataHeaderSettings = document.querySelector("[data-header-settings]");
dataHeaderSettings.addEventListener("click", function () {
  const dataSettingsOverlay = document.querySelector("[data-settings-overlay]");
  dataSettingsOverlay.open = true; // open the settings overlay
});

dataSearchForm = document.querySelector("[data-search-form]");
dataSearchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = [];

  for (const book of books) {
    const titleMatch =
      filters.title.trim() === "" ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch =
      filters.author === "any" || book.author === filters.author;
    let genreMatch = false;

    if (filters.genre === "any") {
      genreMatch = true;
    } else {
      for (const genre of book.genres) {
        if (genre === filters.genre) {
          genreMatch = true;
          break;
        }
      }
    }

    if (titleMatch && authorMatch && genreMatch) {
      result.push(book);
    }

    const dataSearchOverlay = document.querySelector("[data-search-overlay]");
    dataSearchOverlay.open = false; //close search overlay
  }

  const dataListMessage = document.querySelector("[data-list-message]");
  const dataListItems = document.querySelector("[data-list-items]");

  if (result.length < 1) {
    dataListMessage.classList.add("list__message_show"); //show message
    dataListItems.innerHTML = ""; // clear book list
  } else {
    dataListMessage.classList.remove("list__message_show"); //remove message

    dataListItems.innerHTML = ""; //clear list
    matches = result; // update the 'matches' array with filtered books
    const extracted = matches.slice(0, BOOKS_PER_PAGE);

    //create preview element
    for (const book of extracted) {
      const listItem = createPreview(book);
      listItem.dataset.listPreview = book.id;
      dataListItems.appendChild(listItem);
    }

    dataListButton.textContent = `Show more (${
      matches.length - page * BOOKS_PER_PAGE > 0
        ? matches.length - page * BOOKS_PER_PAGE
        : 0
    })`;
    // disable the button if there are no more books to show
    dataListButton.disabled = matches.length - page * BOOKS_PER_PAGE <= 0;
  }
});

dataSettingsOverlay = document.querySelector("[data-settings-overlay]");
dataSettingsOverlay.addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const result = Object.fromEntries(formData);

  // update color scheme based on the selected theme
  document.documentElement.style.setProperty(
    "--color-dark",
    css[result.theme].dark
  );
  document.documentElement.style.setProperty(
    "--color-light",
    css[result.theme].light
  );
  dataSettingsOverlay.open = false;
});

// get all elements with 'data-list-items'
dataListItems = document.querySelectorAll("[data-list-items]");
dataListItems.forEach(function (element) {
  element.addEventListener("click", function (event) {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;

    for (const node of pathArray) {
      if (active) {
        break;
      }
      const previewId = node?.dataset?.listPreview;

      for (const singleBook of books) {
        if (singleBook.id === previewId) {
          active = singleBook;
          break;
        }
      }
    }

    if (!active) {
      return;
    }

    const overlayDialog = document.querySelector("[data-list-active]");
    const overlayTitle = overlayDialog.querySelector("[data-list-title]");
    const overlaySubtitle = overlayDialog.querySelector("[data-list-subtitle]");
    const overlayDescription = overlayDialog.querySelector(
      "[data-list-description]"
    );
    const overlayImage = overlayDialog.querySelector("[data-list-image]");
    const overlayBlur = overlayDialog.querySelector("[data-list-blur]");

    // Populate the book details in the overlay
    overlayTitle.textContent = active.title;
    overlaySubtitle.textContent = `Author: ${authors[active.author]}`;
    overlayDescription.textContent = active.description;
    overlayImage.src = active.image;
    overlayImage.alt = active.title;
    overlayBlur.src = active.image;
    // Open the overlay
    overlayDialog.open = true;
  });
});

//function to create a preview element for a book
function createPreview(bookData) {
  const previewElement = document.createElement("div");
  previewElement.classList.add("preview");

  const imageElement = document.createElement("img");
  imageElement.src = bookData.image;
  imageElement.alt = bookData.title;
  imageElement.classList.add("preview__image");
  previewElement.appendChild(imageElement);

  const infoElement = document.createElement("div");
  infoElement.classList.add("preview__info");

  const titleElement = document.createElement("h3");
  titleElement.textContent = bookData.title;
  titleElement.classList.add("preview__title");
  infoElement.appendChild(titleElement);

  const authorName = authors[bookData.author];
  if (authorName) {
    const authorElement = document.createElement("p");
    authorElement.textContent = `Author: ${authorName}`;
    authorElement.classList.add("preview__author");
    infoElement.appendChild(authorElement);
  }

  previewElement.appendChild(infoElement);

  return previewElement;
}
