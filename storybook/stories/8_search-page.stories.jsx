import { action } from "storybook/actions";
import { vviinnToken } from "../helpers";
import "../documentation/widgets/styles.css";
import "../styles/search-page.css";

export default {
  title: "Playground/Search Components",
  tags: ["!dev"],
  argTypes: {
    searchQuery: { control: "text" },
    searchId: { control: "text" },
  },
};

let textSearchHandler = null;
let imageUploadHandler = null;

export const InitialSearchPage = () => {
  const template = document.createElement("div");
  template.innerHTML = `
    <h2>Search Page</h2>
    <div>
      <vviinn-text-search 
        token="${vviinnToken}" 
        mode="extended" 
        locale="en-US">
      </vviinn-text-search>
    </div>
  `;

  if (textSearchHandler) {
    document.removeEventListener("vviinnTextSearchStarted", textSearchHandler);
    textSearchHandler = null;
  }

  if (imageUploadHandler) {
    document.removeEventListener(
      "vviinnImageUploadFinished",
      imageUploadHandler,
    );
    imageUploadHandler = null;
  }

  setTimeout(() => {
    textSearchHandler = function (event) {
      const customEvent = event;
      action("Text Search Started")(customEvent.detail);

      const storyId = "playground-search-components--text-search-results-page";
      const searchQuery = encodeURIComponent(customEvent.detail.query);
      const argsParam = `searchQuery:${searchQuery}`;
      const url = `/iframe.html?id=${storyId}&args=${argsParam}`;
      window.open(url, "_blank");
    };

    imageUploadHandler = function (event) {
      const customEvent = event;
      action("Image Upload Finished")(customEvent.detail);

      const storyId = "playground-search-components--image-search-results-page";
      const searchId = encodeURIComponent(customEvent.detail.searchId);
      const argsParam = `searchId:${searchId}`;
      const url = `/iframe.html?id=${storyId}&args=${argsParam}`;
      window.open(url, "_blank");
    };

    document.addEventListener("vviinnTextSearchStarted", textSearchHandler);
    document.addEventListener("vviinnImageUploadFinished", imageUploadHandler);
  }, 0);

  const originalAttachTo = template.attachTo;
  template.attachTo = function (element) {
    const result = originalAttachTo
      ? originalAttachTo.call(this, element)
      : undefined;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.removedNodes)) {
          if (node === template || node.contains(template)) {
            if (textSearchHandler) {
              document.removeEventListener(
                "vviinnTextSearchStarted",
                textSearchHandler,
              );
              textSearchHandler = null;
            }
            if (imageUploadHandler) {
              document.removeEventListener(
                "vviinnImageUploadFinished",
                imageUploadHandler,
              );
              imageUploadHandler = null;
            }
            observer.disconnect();
            break;
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return result;
  };

  return template;
};

export const TextSearchResultsPage = (args) => {
  const searchQuery = args.searchQuery || "";

  const template = document.createElement("div");
  template.className = "search-page-wrapper";
  template.innerHTML = `   
      <div class="search-page-wrapper-aside">
        <vviinn-cropper token="${args.token}"></vviinn-cropper>
        <vviinn-extended-filters locale="${args.locale}" mode="preview"></vviinn-extended-filters>
      </div>
      
      <div class="search-page-wrapper-result">
        <vviinn-text-search 
          token="${vviinnToken}"  
          mode="extended" 
          locale="en-US"
          search-query="${searchQuery}">
        </vviinn-text-search>

        <div class="search-page-wrapper-result-filters">
          <vviinn-extended-filters locale="en-US"></vviinn-extended-filters>
          <vviinn-selected-filters locale="en-US"></vviinn-selected-filters>
        </div>

        <vviinn-results 
          token="${vviinnToken}"  
          product-details-new-tab="true"
          locale="en-US">
        </vviinn-results>
      </div>
  `;

  return template;
};

TextSearchResultsPage.args = {
  searchQuery: "",
};

export const ImageSearchResultsPage = (args) => {
  const searchId = args.searchId || "";

  const template = document.createElement("div");
  template.className = "search-page-wrapper";
  template.innerHTML = `
      <div class="search-page-wrapper-aside">
        <vviinn-cropper token="${args.token}"></vviinn-cropper>
        <vviinn-extended-filters locale="${args.locale}" mode="preview"></vviinn-extended-filters>
      </div>

      <div class="search-page-wrapper-result">
        <vviinn-text-search 
          token="${vviinnToken}"  
          mode="extended" 
          locale="en-US">
        </vviinn-text-search>

        <div class="search-page-wrapper-result-filters">
          <vviinn-extended-filters locale="en-US"></vviinn-extended-filters>
          <vviinn-selected-filters locale="en-US"></vviinn-selected-filters>
        </div>

        <vviinn-results 
          token="${vviinnToken}"  
          search-id="${searchId}"
          product-details-new-tab="true"
          locale="en-US">
        </vviinn-results>
      </div>
  `;

  return template;
};

ImageSearchResultsPage.args = {
  searchId: "",
};
