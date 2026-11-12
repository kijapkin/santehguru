const messages = {
  "uk": [
    "Додайте короткий опис робіт.",
    "Добрий день! Цікавить послуга «",
    "Текст скопійовано.",
    "Скопіюйте готовий текст із поля нижче."
  ],
  "ru": [
    "Добавьте краткое описание работ.",
    "Добрый день! Интересует услуга «",
    "Текст скопирован.",
    "Скопируйте готовый текст из поля ниже."
  ],
  "en": [
    "Add a short description of the job.",
    "Hello! I’m interested in “",
    "Message copied.",
    "Copy the prepared message from the field below."
  ]
};
const [missingDetails, greeting, copied, manualCopy] = messages[document.documentElement.lang] ?? messages.uk;

const form = document.querySelector('#draft');
const status = document.querySelector('#status');
const manual = document.querySelector('#manual');

const service = form.querySelector('#service');
const serviceLabel = service.labels[0];
serviceLabel.id = 'service-label';

const dropdown = document.createElement('details');
dropdown.className = 'service-dropdown';
const trigger = document.createElement('summary');
trigger.id = 'service-trigger';
trigger.setAttribute('aria-labelledby', 'service-label service-trigger');
dropdown.append(trigger);

const options = document.createElement('ul');
dropdown.append(options);
const buttons = Array.from(service.options, (option, index) => {
  const item = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = option.text;
  button.addEventListener('click', () => {
    service.selectedIndex = index;
    updateService();
    dropdown.open = false;
    trigger.focus();
  });
  item.append(button);
  options.append(item);
  return button;
});

function updateService() {
  trigger.textContent = service.selectedOptions[0].text;
  buttons.forEach((button, index) => {
    button.setAttribute('aria-pressed', index === service.selectedIndex);
  });
}

updateService();
window.addEventListener('pageshow', updateService);
dropdown.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && dropdown.open) {
    event.preventDefault();
    dropdown.open = false;
    trigger.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!dropdown.contains(event.target) && event.target !== serviceLabel) {
    dropdown.open = false;
  }
});
serviceLabel.addEventListener('click', (event) => {
  event.preventDefault();
  trigger.click();
  trigger.focus();
});
service.hidden = true;
service.after(dropdown);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const details = form.querySelector('#details').value.trim();
  if (!details) {
    status.textContent = missingDetails;
    form.querySelector('#details').focus();
    return;
  }

  const message = `${greeting}${service.value}${document.documentElement.lang === "en" ? "”" : "»"}.\n${details}`;
  try {
    await navigator.clipboard.writeText(message);
    manual.hidden = true;
    status.textContent = copied;
  } catch {
    manual.value = message;
    manual.hidden = false;
    manual.focus();
    manual.select();
    status.textContent = manualCopy;
  }
});
