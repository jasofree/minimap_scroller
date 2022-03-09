import './style.css'

let contentWrapperNode = document.querySelector('#content_wrapper');
let minimapWrapperNode = document.querySelector('#minimap_wrapper');
let minimapContentWrapperNode = document.querySelector('#minimap_content_wrapper');
let minimapViewportNode = document.querySelector('#minimap_viewport');
let minimapWrapperBoundingClientRect, ratioHorizontalContent, ratioVerticalContent, ratioHorizontalMinimapContent, ratioVerticalMinimapContent;

window.addEventListener('load', () => {
  fetch("./assets/image/world.svg")
    .then(response => response.text())
    .then((svg) => {
      contentWrapperNode.insertAdjacentHTML("afterbegin", svg);
      minimapContentWrapperNode.insertAdjacentHTML("afterbegin", svg);
      minimapWrapperBoundingClientRect = minimapWrapperNode.getBoundingClientRect();
      let contentWrapperBoundingClientRect = contentWrapperNode.getBoundingClientRect();
      let minimapContentWrapperBoundingClientRect = minimapContentWrapperNode.getBoundingClientRect();
      let windowViewportWidth = window.innerWidth;
      let windowViewportHeight = window.innerHeight;
      ratioHorizontalContent = windowViewportWidth / contentWrapperBoundingClientRect.width;
      ratioVerticalContent = windowViewportHeight / contentWrapperBoundingClientRect.height;
      ratioHorizontalMinimapContent = minimapContentWrapperBoundingClientRect.width / contentWrapperBoundingClientRect.width;
      ratioVerticalMinimapContent = minimapContentWrapperBoundingClientRect.height / contentWrapperBoundingClientRect.height;
      minimapViewportNode.style.width = `${100 * ratioHorizontalContent}%`;
      minimapViewportNode.style.height = `${100 * ratioVerticalContent}%`;
      minimapViewportNode.style.display = 'block';
      update_minimap_viewport_position();
      contentWrapperNode.querySelectorAll('#content_wrapper svg path[id], #content_wrapper svg path[class], #content_wrapper svg path[name]').forEach((element) => {
        element.addEventListener('mouseenter', (event) => {
          element.classList.add('highlighted');
        });
        element.addEventListener('mouseleave', (event) => {
          element.classList.remove('highlighted');
        });
      });
    });
});

let handling_content_scroll = false;
let update_minimap_viewport_position = function() {
  let contentWrapperNodeBoundingClient = contentWrapperNode.getBoundingClientRect();
  let contentWrapperNodeTop = contentWrapperNodeBoundingClient.top;
  let contentWrapperNodeLeft = contentWrapperNodeBoundingClient.left;
  let newMinimapViewportNodeTop = Math.round(contentWrapperNodeTop * ratioVerticalMinimapContent);
  let newMinimapViewportNodeLeft = Math.round(contentWrapperNodeLeft * ratioHorizontalMinimapContent);
  minimapViewportNode.style.top = `${-1 * newMinimapViewportNodeTop}px`;
  minimapViewportNode.style.left = `${-1 * newMinimapViewportNodeLeft}px`;
};

window.addEventListener('scroll', () => {
  if (!handling_content_scroll) {
      window.requestAnimationFrame(() => {
        update_minimap_viewport_position();
        handling_content_scroll = false;
      });
  }
  handling_content_scroll = true;
});

let handling_minimap_wheel = false;
minimapContentWrapperNode.addEventListener('wheel', (event) => {
  event.stopPropagation();
  event.preventDefault();
  if (!handling_minimap_wheel) {
      window.requestAnimationFrame(() => {
        update_minimap_viewport_position();
        handling_minimap_wheel = false;
      });
  }
  handling_minimap_wheel = true;
});

let handling_minimap_viewport_drag = false;
let draggingMinimapViewportInfo = undefined;
minimapViewportNode.addEventListener('mousedown', (event) => {
  event.stopPropagation();
  event.preventDefault();
  let minimapViewportBoundingClientRect = minimapViewportNode.getBoundingClientRect();
  draggingMinimapViewportInfo = {
    minimap: {
      x: minimapWrapperBoundingClientRect.x,
      y: minimapWrapperBoundingClientRect.y,
      height: minimapWrapperBoundingClientRect.height,
      width: minimapWrapperBoundingClientRect.width
    },
    minimapViewport: {
      height: minimapViewportBoundingClientRect.height,
      width: minimapViewportBoundingClientRect.width,
      origin: {
        x: minimapViewportBoundingClientRect.x,
        y: minimapViewportBoundingClientRect.y
      },
      draggingOrigin: {
        x: event.x,
        y: event.y
      }
    }
  }
});

minimapWrapperNode.addEventListener('mousemove', (event) => {
  if (!handling_minimap_viewport_drag) {
    window.requestAnimationFrame(() => {
      if (draggingMinimapViewportInfo) {
        let newMinimapViewportNodeTop = draggingMinimapViewportInfo.minimapViewport.origin.y - draggingMinimapViewportInfo.minimap.y + event.y - draggingMinimapViewportInfo.minimapViewport.draggingOrigin.y;
        let newMinimapViewportNodeLeft = draggingMinimapViewportInfo.minimapViewport.origin.x - draggingMinimapViewportInfo.minimap.x + event.x - draggingMinimapViewportInfo.minimapViewport.draggingOrigin.x;
        if (newMinimapViewportNodeTop < 0) {
          newMinimapViewportNodeTop = 0;
        }
        if (newMinimapViewportNodeTop > draggingMinimapViewportInfo.minimap.height - draggingMinimapViewportInfo.minimapViewport.height) {
          newMinimapViewportNodeTop = draggingMinimapViewportInfo.minimap.height - draggingMinimapViewportInfo.minimapViewport.height;
        }
        if (newMinimapViewportNodeLeft < 0) {
          newMinimapViewportNodeLeft = 0;
        }
        if (newMinimapViewportNodeLeft > draggingMinimapViewportInfo.minimap.width - draggingMinimapViewportInfo.minimapViewport.width) {
          newMinimapViewportNodeLeft = draggingMinimapViewportInfo.minimap.width - draggingMinimapViewportInfo.minimapViewport.width;
        }
        let newContentWrapperNodeTop = Math.round(newMinimapViewportNodeTop / ratioVerticalMinimapContent);
        let newContentWrapperNodeLeft = Math.round(newMinimapViewportNodeLeft / ratioHorizontalMinimapContent);
        minimapViewportNode.style.top = `${newMinimapViewportNodeTop}px`;
        minimapViewportNode.style.left = `${newMinimapViewportNodeLeft}px`;
        document.querySelector('html').scrollTop = newContentWrapperNodeTop;
        document.querySelector('html').scrollLeft = newContentWrapperNodeLeft;
      }
      handling_minimap_viewport_drag = false;
    });
  }
  handling_minimap_viewport_drag = true;
});

minimapWrapperNode.addEventListener('mouseup', (event) => {
  event.stopPropagation();
  event.preventDefault();
  draggingMinimapViewportInfo = undefined;
});

