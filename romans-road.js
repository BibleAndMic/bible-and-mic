(() => {
  const road = document.getElementById('romansRoad');
  if (!road) return;

  const steps = [...road.querySelectorAll('.romans-step')];
  steps.forEach(step => {
    step.addEventListener('toggle', () => {
      if (!step.open) return;
      steps.forEach(other => {
        if (other !== step) other.open = false;
      });
    });
  });

  const callButton = road.querySelector('[data-romans-call]');
  callButton?.addEventListener('click', () => {
    const connect = document.getElementById('connect');
    if (connect) connect.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
