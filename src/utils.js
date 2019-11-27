export function onMouseMove(e, mouse) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  if (e.touches) {
    var clientX = e.touches[0].clientX;
    var clientY = e.touches[0].clientY;
  } else {
    var clientX = event.clientX;
    var clientY = event.clientY;
  }

  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;
  return mouse
}