document.documentElement.classList.add('js');

const menu = document.querySelector('#menu');
const nav = document.querySelector('#navlinks');
menu.hidden = false;

const header = document.querySelector('.site-header');
function updateHeaderAppearance() {
  header.classList.toggle('is-scrolled', window.scrollY > 0);
}

window.addEventListener('scroll', updateHeaderAppearance, { passive: true });
updateHeaderAppearance();

function updateHeaderHeight() {
  document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
}

updateHeaderHeight();
if ('ResizeObserver' in window) {
  new ResizeObserver(updateHeaderHeight).observe(header);
} else {
  window.addEventListener('resize', updateHeaderHeight);
}

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
}

menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') === 'false'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setMenu(false);
    menu.focus();
  }
});

const form = document.querySelector('#enquiry');
const heading = form.querySelector('h3');
const subjectInput = form.elements.subject;
const message = form.elements.message;
const defaults = {
  subject: '',
  placeholder: 'Share your site location, scope and target start date.'
};
let suggestedSubject = defaults.subject;
message.placeholder = defaults.placeholder;

document.querySelectorAll('a[href="#contact"]').forEach(link => {
  link.addEventListener('click', () => {
    const isAppointment = link.classList.contains('appointment');
    const nextSubject = isAppointment ? 'Appointment request' : link.dataset.subject || defaults.subject;
    if (nextSubject || subjectInput.value === suggestedSubject) {
      subjectInput.value = nextSubject;
      suggestedSubject = nextSubject;
    }
    heading.textContent = isAppointment ? 'Request a consultation' : 'Project enquiry';
    message.placeholder = isAppointment
      ? 'Tell us about your project and share a preferred date and time.'
      : defaults.placeholder;
  });
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const fields = new FormData(form);
  const subject = fields.get('subject').trim() || 'Project enquiry';
  const body = [
    'Hello CDB Contracting LLC,', '',
    'Full name: ' + fields.get('name'),
    'Email: ' + fields.get('email'),
    'Phone number: ' + fields.get('phone'), '',
    fields.get('message')
  ].join('\n');
  const recipient = document.querySelector('.email').href;
  window.location.href = recipient + '?subject=' +
    encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
});

if ('IntersectionObserver' in window && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.project-heading, .about-layout, .service-list article, .blog-heading')
    .forEach(element => revealObserver.observe(element));
}
