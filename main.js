import './style.css'

let loremIpsumContentNode = document.querySelector('#lorem_ipsum_content');
let contentWrapperNode = document.querySelector('#content_wrapper');
let minimapWrapperNode = document.querySelector('#minimap_wrapper');
let minimapContentWrapperNode = document.querySelector('#minimap_content_wrapper');
let minimapViewportNode = document.querySelector('#minimap_viewport');
let ratioHorizontalMinimapContent, ratioVerticalMinimapContent;

window.addEventListener('load', () => {
  contentWrapperNode.innerHTML = loremIpsumContentNode.innerHTML;
  minimapContentWrapperNode.innerHTML = loremIpsumContentNode.innerHTML;
  const contentWrapperComputedStyle = window.getComputedStyle(contentWrapperNode);
  const minimapContentWrapperComputedStyle = window.getComputedStyle(minimapContentWrapperNode);
  const contentWrapperNodeWidth = contentWrapperNode.clientWidth;
  const minimapContentWrapperNodeWidth = minimapContentWrapperNode.clientWidth;
  const contentWidth = contentWrapperNodeWidth - parseInt(contentWrapperComputedStyle['padding-left']) - parseInt(contentWrapperComputedStyle['padding-right']);
  const minimapContentWidth = minimapContentWrapperNodeWidth - parseInt(minimapContentWrapperComputedStyle['padding-left']) - parseInt(minimapContentWrapperComputedStyle['padding-right']);
  ratioHorizontalMinimapContent = minimapContentWidth / contentWidth;
  minimapContentWrapperNode.style.fontSize = `${150 * ratioHorizontalMinimapContent}%`;
  handle_content_scroll();
});

let handling_content_scroll = false;
let handle_content_scroll = function() {
  let windowViewportHeight = window.innerHeight;
  const contentWrapperNodeHeight = contentWrapperNode.clientHeight;
  const minimapContentWrapperNodeHeight = minimapContentWrapperNode.clientHeight;
  ratioVerticalMinimapContent = minimapContentWrapperNodeHeight / contentWrapperNodeHeight;
  minimapViewportNode.style.display = 'block';
  minimapViewportNode.style.height = `${windowViewportHeight * ratioVerticalMinimapContent}px`;
  let contentWrapperNodeBoundingClient = contentWrapperNode.getBoundingClientRect();
  let contentWrapperNodeTop = contentWrapperNodeBoundingClient.top;
  let newMinimapViewportNodeTop = Math.round(contentWrapperNodeTop * ratioVerticalMinimapContent);
  let minimapWrapperHeight = minimapWrapperNode.clientHeight;
  if (minimapWrapperHeight > windowViewportHeight) {
    let topScrolledPercentage = contentWrapperNodeTop / (contentWrapperNodeHeight - windowViewportHeight);
    minimapWrapperNode.style.top = `${Math.round(topScrolledPercentage * (minimapWrapperHeight - windowViewportHeight))}px`;
  }
  minimapViewportNode.style.top = `${-1 * newMinimapViewportNodeTop}px`;
};

window.addEventListener('scroll', () => {
  if (!handling_content_scroll) {
      window.requestAnimationFrame(() => {
        handle_content_scroll();
        handling_content_scroll = false;
      });
  }
  handling_content_scroll = true;
});

let handling_minimap_wheel = false;
let handle_minimap_wheel = function(deltaY) {
  document.querySelector('html').scrollTop = document.querySelector('html').scrollTop + Math.round(deltaY);
  handle_content_scroll();
};

minimapContentWrapperNode.addEventListener('wheel', (event) => {
  event.stopPropagation();
  event.preventDefault();
  if (!handling_minimap_wheel) {
      window.requestAnimationFrame(() => {
        handle_minimap_wheel(event.deltaY);
          handling_minimap_wheel = false;
      });
  }
  handling_minimap_wheel = true;
});
