import { createElement, createSvgElement } from "./util.js";
export class SearchHandler {
  constructor(config) {
    this.getDataFunction = config.getDataFunction;
    this.listContentSelector = config.listContentSelector;
    this.createItemFunction = config.createItemFunction;
    this.filterFunction = config.filterFunction;
    this.clearButtonSelector = config.clearButtonSelector;
    this.placeholderConfig = config.placeholderConfig || {
      className: "css12",
      innerClassName: "css122",
      text: "Search",
    };
    this.restoreFunction = config.restoreFunction;
  }

  handleSearch(e) {
    const value = e.target.textContent.trim().toLowerCase();
    const listContent = document.querySelector(this.listContentSelector);

    if (value && value.length > 0) {
      const placeholder = e.target.parentElement.querySelector(
        `.${this.placeholderConfig.className}`
      );
      if (placeholder) {
        placeholder.remove();
      }

      const listData = this.getDataFunction();
      const filteredItems = listData.filter((item) => {
        return this.filterFunction(item, value);
      });
      if (filteredItems) {
        listContent.innerHTML = "";
        listContent.style.height = `${filteredItems.length * 72}px`;
        this.createItemFunction(filteredItems);
      }

      this.createClearButton(e);
    } else {
      if (
        !e.target.parentElement.querySelector(
          `.${this.placeholderConfig.className}`
        )
      ) {
        this.clearSearch(e, listContent);
      }
      return;
    }
  }

  createClearButton(e) {
    const clearSearchElement = document.querySelector(this.clearButtonSelector);
    if (clearSearchElement !== null) {
      const clearButton = createElement(
        "button",
        "clear-button",
        {},
        {
          "aria-label": "Clear search",
          style: "transform: scaleX(1) scaleY(1); opacity: 1",
        },
        null,
        () => {
          const p = e.target.querySelector("p");
          p.textContent = "";
          p.append(document.createElement("br"));
          this.handleSearch(e);
        }
      );

      const clearSpan = createElement(
        "span",
        "clear-span",
        {},
        { "aria-hidden": "true", "data-icon": "close-refreshed" }
      );

      const clearSvg = createSvgElement("svg", {
        class: "",
        viewBox: "0 0 24 24",
        height: "20",
        width: "20",
        preserveAspectRatio: "xMidYMid meet",
      });

      const clearTitle = createSvgElement("title", {});
      clearTitle.textContent = "close-refreshed";

      const clearPath = createSvgElement("path", {
        fill: "currentColor",
        d: "M11.9998 13.4L7.0998 18.3C6.91647 18.4833 6.68314 18.575 6.3998 18.575C6.11647 18.575 5.88314 18.4833 5.6998 18.3C5.51647 18.1167 5.4248 17.8833 5.4248 17.6C5.4248 17.3167 5.51647 17.0833 5.6998 16.9L10.5998 12L5.6998 7.09999C5.51647 6.91665 5.4248 6.68332 5.4248 6.39999C5.4248 6.11665 5.51647 5.88332 5.6998 5.69999C5.88314 5.51665 6.11647 5.42499 6.3998 5.42499C6.68314 5.42499 6.91647 5.51665 7.0998 5.69999L11.9998 10.6L16.8998 5.69999C17.0831 5.51665 17.3165 5.42499 17.5998 5.42499C17.8831 5.42499 18.1165 5.51665 18.2998 5.69999C18.4831 5.88332 18.5748 6.11665 18.5748 6.39999C18.5748 6.68332 18.4831 6.91665 18.2998 7.09999L13.3998 12L18.2998 16.9C18.4831 17.0833 18.5748 17.3167 18.5748 17.6C18.5748 17.8833 18.4831 18.1167 18.2998 18.3C18.1165 18.4833 17.8831 18.575 17.5998 18.575C17.3165 18.575 17.0831 18.4833 16.8998 18.3L11.9998 13.4Z",
      });

      clearSvg.append(clearTitle);
      clearSvg.append(clearPath);
      clearSpan.append(clearSvg);
      clearButton.append(clearSpan);
      clearSearchElement.append(clearButton);
    }
  }

  clearSearch(e, listContent) {
    listContent.innerHTML = "";
    const clearButton = document.querySelector(".clear-button");
    if (clearButton) {
      clearButton.remove();
    }

    const createPlaceholder = createElement(
      "div",
      this.placeholderConfig.className
    );
    const createPlaceholderInner = createElement(
      "div",
      this.placeholderConfig.innerClassName
    );
    createPlaceholderInner.textContent = this.placeholderConfig.text;
    createPlaceholder.append(createPlaceholderInner);
    e.target.parentElement.append(createPlaceholder);

    if (this.restoreFunction) {
      this.restoreFunction(this.getDataFunction());
    }
  }
}
