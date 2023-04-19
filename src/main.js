(() => {
  const tableList = document.querySelector('.table__body');
  const createBtn = document.querySelector('.clients__button');
  const query = document.querySelector('.header__input');

  queryClients();
  sortRequest();
  createBtn.addEventListener('click', () => addClient(createBtn));
  query.addEventListener('input', () => setTimeout(() => {
    const queryArray = Array.from(tableList.children).filter(item => item.children[1].textContent.toLowerCase().includes(query.value.toLowerCase()));
    for (const item of Array.from(tableList.children)) !queryArray.includes(item) ? item.style.display = 'none' : item.style.display = 'flex';
  }, 300));

  async function queryClients() {
    const request = await fetch('http://localhost:3000/api/clients');
    const response = await request.json();
    for (const client of response) createClient(client);
  }

  function sortRequest() {
    const sortBtn = document.querySelectorAll('.table__button');

    sortBtn.forEach(buttonAct => {
      buttonAct.addEventListener('click', () => {
        sortBtn.forEach(button => button.classList.remove('table__button--active'));
        buttonAct.classList.add('table__button--active');
        if (buttonAct.children[0].classList.contains('ascending')) {
          buttonAct.children[0].classList.remove('ascending');
          buttonAct.children[0].classList.add('descending');
          sortClients(buttonAct);
        } else if (buttonAct.children[0].classList.contains('descending')) {
          buttonAct.children[0].classList.remove('descending');
          buttonAct.children[0].classList.add('ascending');
          sortClients(buttonAct);
        }
      });
    });
  }

  function sortClients(button) {
    let container = [];

    if (button.id === 'sort-id') {
      for (const item of tableList.children) container.push(item.children[0].textContent);
      sortData(button, container);
    }
    if (button.id === 'sort-name') {
      for (const item of tableList.children) container.push(item.children[1].textContent);
      container = container.map(element => element.split(' ')[0]);
      sortData(button, container);
    }
    if (button.id === 'sort-date') {
      for (const item of tableList.children) container.push(item.children[2].textContent);
      container = container.map(element => element.split('.'));
      container = container.map(element => element = `${element[1]}.${element[0]}.${element[2]}`);
      container = container.map(element => new Date(element).getTime());
      sortData(button, container);
    }
    if (button.id === 'sort-changes') {
      for (const item of tableList.children) container.push(item.children[3].textContent);
      sortData(button, container);
    }
  }

  async function sortData(button, container) {
    const request = await fetch('http://localhost:3000/api/clients');
    const clientsData = await request.json();

    const sortId = document.querySelector('#sort-id');
    const sortName = document.querySelector('#sort-name');
    const sortDate = document.querySelector('#sort-date');
    const sortChanges = document.querySelector('#sort-changes');

    for (const client of Array.from(tableList.children)) client.remove();
    const sortArray = button.children[0].classList.contains('ascending') ? container.sort() : container.sort().reverse();
    const dataArray = [];
    const temp = JSON.parse(JSON.stringify(clientsData));
    let i = 0;

    if (button.id !== 'sort-id') sortId.children[0].classList.add('ascending');
    if (button.id !== 'sort-name') sortName.children[0].classList.add('descending');
    if (button.id !== 'sort-date') sortDate.children[0].classList.add('descending');
    if (button.id !== 'sort-changes') sortChanges.children[0].classList.add('descending');
    while (dataArray.length < temp.length) {
      if (button.id === 'sort-id') {
        if (sortArray[0] == clientsData[i].id) {
          dataArray.push(clientsData[i]);
          sortArray.splice(0, 1);
          clientsData.splice(i, 1);
          i = 0;
        } else if (i <= (clientsData.length - 1)) i++;
      }
      if (button.id === 'sort-name') {
        if (sortArray[0] === clientsData[i].surname) {
          dataArray.push(clientsData[i]);
          sortArray.splice(0, 1);
          clientsData.splice(i, 1);
          i = 0;
        } else if (i <= (clientsData.length - 1)) i++;
      }
      if (button.id === 'sort-date') {
        clientsData.sort(function(a, b) {
          let dateA = new Date(a.createdAt);
          let dateB = new Date(b.createdAt);
          if (button.children[0].classList.contains('ascending')) return dateB.getTime() - dateA.getTime();
          if (button.children[0].classList.contains('descending')) return dateA.getTime() - dateB.getTime();
        });
        dataArray.push(clientsData[[i]]);
        i++;
      }
      if (button.id === 'sort-changes') {
        clientsData.sort(function(a, b) {
          let dateA = new Date(a.updatedAt);
          let dateB = new Date(b.updatedAt);
          if (button.children[0].classList.contains('ascending')) return dateB.getTime() - dateA.getTime();
          if (button.children[0].classList.contains('descending')) return dateA.getTime() - dateB.getTime();
        });
        dataArray.push(clientsData[[i]]);
        i++;
      }
    }
    for (const client of dataArray) createClient(client);
  }

  function createModal(button) {
    startLoading(button);

    const modal = document.createElement('div');
    const modalWindow = document.createElement('div');
    const modalTitle = document.createElement('h3');
    const modalId = document.createElement('span');
    const modalContent1 = document.createElement('div');
    const modalWrapper = document.createElement('div');
    const modalContent2 = document.createElement('div');
    const modalContacts = document.createElement('div');
    const modalText = document.createElement('p');
    const label1 = document.createElement('label');
    const label2 = document.createElement('label');
    const label3 = document.createElement('label');
    const descr1 = document.createElement('span');
    const descr2 = document.createElement('span');
    const descr3 = document.createElement('span');
    const inputs = document.createElement('div');
    const inputSurname = document.createElement('input');
    const inputName = document.createElement('input');
    const inputLastname = document.createElement('input');
    const addBtn = document.createElement('button');
    const confirmBtn = document.createElement('button');
    const cancelBtn = document.createElement('button');
    const closeBtn = document.createElement('button');

    document.body.classList.add('stop-scroll');
    modal.classList.add('modal');
    modalWindow.classList.add('modal__window');
    modalTitle.classList.add('modal__title');
    modalId.classList.add('modal__id');
    modalContent1.classList.add('modal__content');
    modalWrapper.classList.add('modal__content');
    modalContent2.classList.add('modal__content');
    modalText.classList.add('modal__text')
    label1.classList.add('modal__label');
    label2.classList.add('modal__label');
    label3.classList.add('modal__label');
    descr1.classList.add('modal__descr');
    descr2.classList.add('modal__descr');
    descr3.classList.add('modal__descr');
    modalContacts.classList.add('modal__contacts');
    inputs.classList.add('modal__inputs');
    inputSurname.classList.add('modal__input');
    inputSurname.id = 'surname-input';
    inputName.classList.add('modal__input');
    inputName.id = 'name-input';
    inputLastname.classList.add('modal__input');
    inputLastname.id = 'lastname-input';
    addBtn.classList.add('modal__button', 'button-reset');
    confirmBtn.classList.add('modal__confirm', 'button-reset');
    cancelBtn.classList.add('modal__cancel', 'button-reset');
    closeBtn.classList.add('modal__close', 'button-reset');
    closeBtn.innerHTML = `
    <svg class="modal__close-icon" width="20" height="20" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2332 1.73333L15.2665 0.766664L8.49985 7.53336L1.73318 0.766696L0.766515 1.73336L7.53318 8.50003L0.766542 15.2667L1.73321 16.2333L8.49985 9.46669L15.2665 16.2334L16.2332 15.2667L9.46651 8.50003L16.2332 1.73333Z"/>
    </svg>`;

    descr1.textContent = 'Surname*';
    descr2.textContent = 'Name*';
    descr3.textContent = 'Last Name';
    addBtn.textContent = 'Add Contact';
    confirmBtn.textContent = 'Save';
    inputSurname.placeholder = 'Surname';
    inputName.placeholder = 'Name';
    inputLastname.placeholder = 'Last Name';

    setTimeout(() => modal.classList.add('modal--active'), 50);
    addBtn.addEventListener('click', () => createContact(addBtn));
    modal.addEventListener('click', (e) => {
      if (e.target == modal) deleteModal(modal, button);
    });

    if (button.classList.contains('table__delete')) return [modal, modalWindow, modalWrapper, modalTitle, modalText, confirmBtn, cancelBtn, closeBtn];

    label1.append(descr1, inputSurname);
    label2.append(descr2, inputName);
    label3.append(descr3, inputLastname);
    inputs.append(label1, label2, label3);
    modalContent1.append(modalTitle, inputs);
    if (button.classList.contains('table__change')) modalContent1.append(modalId);
    modalWrapper.append(addBtn);
    modalContent2.append(confirmBtn, cancelBtn);
    modalContacts.append(modalWrapper);
    modalWindow.append(modalContent1, modalContacts, modalContent2, closeBtn);
    modal.append(modalWindow);
    document.body.append(modal);

    const input = document.querySelectorAll('.modal__input');
    input.forEach(input => input.addEventListener('input', () => placeholderHandler(input)));

    return [modal, modalWindow, modalTitle, modalId, inputSurname, inputName, inputLastname, addBtn, confirmBtn, cancelBtn, closeBtn];
  }

  function deleteModal(modal, button) {
    modal.remove();
    stopLoading(button);
    document.body.classList.remove('stop-scroll');
  }

  function placeholderHandler(input) {
    input.parentNode.children[0].classList.add('modal__descr--active');
    input.classList.remove('modal__input--error');
    if (!input.value) input.parentNode.children[0].classList.remove('modal__descr--active');
  }

  function createContact(button, type = 'Phone', value = '') {
    const contact = document.createElement('div');
    const select = document.createElement('div');
    let selectInner = document.createElement('button');
    const selectList = document.createElement('div');
    const selectPhone = document.createElement('button');
    const selectEmail = document.createElement('button');
    const selectVk = document.createElement('button');
    const selectFacebook = document.createElement('button');
    const input = document.createElement('input');

    contact.classList.add('modal__contact');
    select.classList.add('modal__select');
    selectInner.classList.add('modal__select-inner', 'button-reset');
    selectInner.textContent = 'Phone';
    selectInner.value = `${type}`;
    selectList.classList.add('modal__select-list');
    selectPhone.classList.add('modal__select-item', 'button-reset');
    selectPhone.textContent = 'Social';
    selectPhone.value = 'extraPhone';
    selectEmail.classList.add('modal__select-item', 'button-reset');
    selectEmail.textContent = 'Email';
    selectEmail.value = 'Email';
    selectVk.classList.add('modal__select-item', 'button-reset');
    selectVk.textContent = 'VK';
    selectVk.value = 'VK';
    selectFacebook.classList.add('modal__select-item', 'button-reset');
    selectFacebook.textContent = 'Facebook';
    selectFacebook.value = 'Facebook';
    input.classList.add('modal__data');
    input.placeholder = 'Input contact\'s info';
    selectList.append(selectPhone);
    selectList.append(selectEmail);
    selectList.append(selectVk);
    selectList.append(selectFacebook);
    select.append(selectInner);
    select.append(selectList);
    contact.append(select);
    contact.append(input);
    button.before(contact);

    if (value == '' & button.parentNode.children.length > 2 || value && value != '') {
      const cancelBtn = document.createElement('button');
      cancelBtn.classList.add('modal__remove','button-reset');
      contact.append(cancelBtn);
      cancelBtn.addEventListener('click', () => contact.remove());
    }

    if (type == 'Phone') {
      selectInner.textContent = 'Phone';
      input.type = 'tel';
    }
    if (type == 'extraPhone') {
      selectInner.textContent = 'Social';
      input.type = 'text';
    }
    if (type == 'Email') {
      selectInner.textContent = 'Email';
      input.type = 'email';
    }
    if (type == 'VK') {
      selectInner.textContent = 'VK';
      input.type = 'text';
    }
    if (type == 'Facebook') {
      selectInner.textContent = 'Facebook';
      input.type = 'text';
    }
    input.value = `${value}`;
    for (const item of selectList.children) {
      if (selectInner.textContent == item.textContent && selectInner.value == item.value) {
        item.textContent = 'Phone';
        item.value = 'Phone'
      }
    }

    selectInner.addEventListener('click', () => {
      select.classList.toggle('modal__select--active');
      selectList.classList.toggle('modal__select-list--active');
    });

    for (let item of selectList.children) {
      item.addEventListener('click', () => {
        item.value = [selectInner.value, selectInner.value = item.value][0];
        item.textContent = [selectInner.textContent, selectInner.textContent = item.textContent][0];
        select.classList.remove('modal__select--active');
        selectList.classList.remove('modal__select-list--active');
        input.value = '';
        if (selectInner.value == 'Phone') {
          input.type = 'tel';
        }
        if (selectInner.value == 'Email') {
          input.type = 'email';
        }
        if (selectInner.value == 'VK') {
          input.type = 'text';
        }
        if (selectInner.value == 'Facebook') {
          input.type = 'text';
        }
        if (selectInner.value == 'extraPhone') {
          input.type = 'text';
        }
      });
    }
  }

  function parseContacts() {
    const contactsList = document.querySelectorAll('.modal__contact');
    const array = [];
    contactsList.forEach(contactItem => {
      if (contactItem.firstChild.firstChild.value && contactItem.children[1].value) {
        array.push(
          {
            type: contactItem.firstChild.firstChild.value,
            value: contactItem.children[1].value,
          }
        );
      }
    });
    return array;
  }

  function initContacts(container, response) {
    if (Array.from(container.children).length) for (const contact of Array.from(container.children)) contact.remove();

    for (const item of response.contacts) {
      const contact = document.createElement('a');
      contact.classList.add('table__info');
      if (item.type == 'Phone') contact.classList.add('table__info--phone');
      if (item.type == 'extraPhone') contact.classList.add('table__info--extraphone');
      if (item.type == 'Email') contact.classList.add('table__info--email');
      if (item.type == 'VK') contact.classList.add('table__info--vk');
      if (item.type == 'Facebook') contact.classList.add('table__info--facebook');
      contact.setAttribute('data-value', item.value);
      container.append(contact);
    }
    if (response.contacts.length > 5) {
      const contactArray = [];
      for (const contact of container.children) contactArray.push(contact);
      for (const contactHide of contactArray.slice(4)) contactHide.classList.add('table__info--hidden');

      const showMore = document.createElement('button');
      showMore.classList.add('table__show-more', 'button-reset');
      showMore.textContent = `+${response.contacts.slice(4).length}`;
      container.append(showMore);

      showMore.addEventListener('click', () => {
        showMore.style.display = 'none';
        for (const contactHide of contactArray.slice(4)) contactHide.classList.remove('table__info--hidden');
      });
    }
  }

  function startLoading(button) {
    if (button.classList.contains('table__change')) {
      button.children[0].remove()
      button.innerHTML = `
      <svg class="table__icon" width="12" height="12" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.00008 6.04008C1.00008 8.82356 3.2566 11.0801 6.04008 11.0801C8.82356 11.0801 11.0801 8.82356 11.0801 6.04008C11.0801 3.2566 8.82356 1.00008 6.04008 1.00008C5.38922 1.00008 4.7672 1.12342 4.196 1.34812" stroke="#9873FF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
      </svg>
      Change`;
      button.classList.add('table__change--active');
    }
    if (button.classList.contains('table__delete')) {
      button.children[0].remove()
      button.innerHTML = `
      <svg class="table__icon" width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.00008 8.04008C3.00008 10.8236 5.2566 13.0801 8.04008 13.0801C10.8236 13.0801 13.0801 10.8236 13.0801 8.04008C13.0801 5.2566 10.8236 3.00008 8.04008 3.00008C7.38922 3.00008 6.7672 3.12342 6.196 3.34812" stroke="#F06A4D" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
      </svg>
      Delete`;
      button.classList.add('table__delete--active');
    }
  }

  function stopLoading(button) {
    button.children[0].remove();
    if (button.classList.contains('table__change')) {
      button.innerHTML = `
      <svg class="table__icon" width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 11.5V14H4.5L11.8733 6.62662L9.37333 4.12662L2 11.5ZM13.8067 4.69329C14.0667 4.43329 14.0667 4.01329 13.8067 3.75329L12.2467 2.19329C11.9867 1.93329 11.5667 1.93329 11.3067 2.19329L10.0867 3.41329L12.5867 5.91329L13.8067 4.69329Z" fill="#9873ff"/>
      </svg>
      Change`;
      button.classList.remove('table__change--active');
    }
    if (button.classList.contains('table__delete')) {
      button.innerHTML = `
      <svg class="table__icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#F06A4D"/>
      </svg>
      Delete`;
      button.classList.remove('table__delete--active');
    }
  }

  async function validation(response, inputName, inputSurname, inputLastname) {
    if (!response) {
      const request = await fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        body: JSON.stringify({
          name: (inputName.value[0].toUpperCase() + inputName.value.slice(1)).trim(),
          surname: (inputSurname.value[0].toUpperCase() + inputSurname.value.slice(1)).trim(),
          lastName: inputLastname.value ? (inputLastname.value[0].toUpperCase() + inputLastname.value.slice(1)).trim() : '',
          contacts: parseContacts(),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await request.json();
    }
  }

  async function createClient(response = null) {
    const inputName = document.querySelector('#name-input');
    const inputSurname = document.querySelector('#surname-input');
    const inputLastname = document.querySelector('#lastname-input');

    if (!response) {
      if (!inputSurname.value) {
        inputSurname.classList.add('modal__input--error');
        return;
      }
      if (!inputName.value) {
        inputName.classList.add('modal__input--error');
        return;
      }
    }

    const tableItem = document.createElement('tr');
    const id = document.createElement('td');
    const fullName = document.createElement('td');
    const date = document.createElement('td');
    const dateDate = document.createElement('span');
    const dateTime = document.createElement('span');
    const changes = document.createElement('td');
    const changesDate = document.createElement('span');
    const changesTime = document.createElement('span');
    const contacts = document.createElement('td');
    const actions = document.createElement('td');
    const changeBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');
    changeBtn.innerHTML = `
    <svg class="table__icon" width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 11.5V14H4.5L11.8733 6.62662L9.37333 4.12662L2 11.5ZM13.8067 4.69329C14.0667 4.43329 14.0667 4.01329 13.8067 3.75329L12.2467 2.19329C11.9867 1.93329 11.5667 1.93329 11.3067 2.19329L10.0867 3.41329L12.5867 5.91329L13.8067 4.69329Z" fill="#9873ff"/>
    </svg>
    Change`;
    deleteBtn.innerHTML = `
    <svg class="table__icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#F06A4D"/>
    </svg>
    Delete`;

    tableItem.classList.add('table__item');
    id.classList.add('table__id');
    fullName.classList.add('table__fullname');
    date.classList.add('table__date');
    dateDate.classList.add('table__date-date');
    dateTime.classList.add('table__date-time');
    changesDate.classList.add('table__date-date');
    changesTime.classList.add('table__date-time');
    changes.classList.add('table__date');
    contacts.classList.add('table__contacts');
    actions.classList.add('table__actions');
    changeBtn.classList.add('table__change', 'button-reset');
    deleteBtn.classList.add('table__delete', 'button-reset');

    const client = response ? response : await validation(response, inputName, inputSurname, inputLastname);

    const crDate = new Date(client.createdAt);
    const updDate = new Date(client.updatedAt);

    if (crDate.getDate() < 10 && crDate.getMonth() < 9) {
      dateDate.textContent = `0${crDate.getDate()}.0${crDate.getMonth() + 1}.${crDate.getFullYear()} `;
    } else if (crDate.getDate() < 10) {
      dateDate.textContent = `0${crDate.getDate()}.${crDate.getMonth() + 1}.${crDate.getFullYear()} `;
    } else if (crDate.getMonth() < 9) {
      dateDate.textContent = `${crDate.getDate()}.0${crDate.getMonth() + 1}.${crDate.getFullYear()} `;
    } else dateDate.textContent = `${crDate.getDate()}.${crDate.getMonth() + 1}.${crDate.getFullYear()} `;

    if (updDate.getDate() < 10 && updDate.getMonth() < 9) {
      changesDate.textContent = `0${updDate.getDate()}.0${updDate.getMonth() + 1}.${updDate.getFullYear()} `;
    } else if (updDate.getDate() < 10) {
      changesDate.textContent = `0${updDate.getDate()}.${updDate.getMonth() + 1}.${updDate.getFullYear()} `;
    } else if (updDate.getMonth() < 9) {
      changesDate.textContent = `${updDate.getDate()}.0${updDate.getMonth() + 1}.${updDate.getFullYear()} `;
    } else changesDate.textContent = `${updDate.getDate()}.${updDate.getMonth() + 1}.${updDate.getFullYear()} `;

    if (crDate.getHours() < 10 && crDate.getMinutes() < 10) {
      dateTime.textContent = `0${crDate.getHours()}:0${crDate.getMinutes()}`;
    } else if (crDate.getHours() < 10) {
      dateTime.textContent = `0${crDate.getHours()}:${crDate.getMinutes()}`;
    } else if (crDate.getMinutes() < 10) {
      dateTime.textContent = `${crDate.getHours()}:0${crDate.getMinutes()}`;
    } else dateTime.textContent = `${crDate.getHours()}:${crDate.getMinutes()}`;

    if (updDate.getHours() < 9 && updDate.getMinutes() < 10) {
      changesTime.textContent = `0${updDate.getHours()}:0${updDate.getMinutes()}`;
    } else if (updDate.getHours() < 10) {
      changesTime.textContent = `0${updDate.getHours()}:${updDate.getMinutes()}`;
    } else if (updDate.getMinutes() < 10) {
      changesTime.textContent = `${updDate.getHours()}:0${updDate.getMinutes()}`;
    } else changesTime.textContent = `${updDate.getHours()}:${updDate.getMinutes()}`;

    id.textContent = client.id;
    fullName.textContent = `${client.surname} ${client.name} ${client.lastName}`;
    initContacts(contacts, client);

    const clientId = id.textContent;

    date.append(dateDate);
    date.append(dateTime);
    changes.append(changesDate);
    changes.append(changesTime);
    actions.append(changeBtn);
    actions.append(deleteBtn);
    tableItem.append(id);
    tableItem.append(fullName);
    tableItem.append(date);
    tableItem.append(changes);
    tableItem.append(contacts);
    tableItem.append(actions);
    tableList.append(tableItem);

    const modal = document.querySelector('.modal');
    if (modal) modal.remove();

    deleteBtn.addEventListener('click', () => deleteClient(deleteBtn, clientId));
    changeBtn.addEventListener('click', () => changeClient(changeBtn, clientId));
  }

  function addClient(button) {
    [modal, modalWindow, modalTitle, modalId, inputSurname, inputName, inputLastname, addBtn, confirmBtn, cancelBtn, closeBtn] = createModal(button);

    modalTitle.textContent = 'New Client';
    cancelBtn.textContent = 'Cancel';

    closeBtn.addEventListener('click', () => modal.remove());
    cancelBtn.addEventListener('click', () => modal.remove());
    confirmBtn.addEventListener('click', () => {
      createClient();
    });
  }

  async function changeClient(button, id) {
    const response = await (await fetch(`http://localhost:3000/api/clients/${id}`)).json();

    [modal, modalWindow, modalTitle, modalId, inputSurname, inputName, inputLastname, addBtn, confirmBtn, cancelBtn, closeBtn] = createModal(button);

    modalTitle.textContent = 'Change data';
    modalId.textContent = `ID: ${id}`;
    cancelBtn.textContent = 'Delete Client';

    inputSurname.value = response.surname;
    inputName.value = response.name;
    inputLastname.value = response.lastName;

    for (const contact of response.contacts) createContact(addBtn, contact.type, contact.value);

    closeBtn.addEventListener('click', () => deleteModal(modal, button));
    cancelBtn.addEventListener('click', () => deleteClient(modal, button));
    confirmBtn.addEventListener('click', async () => {
      if (!inputSurname.value) {
        inputSurname.classList.add('modal__input--error');
        return;
      }
      if (!inputName.value) {
        inputName.classList.add('modal__input--error');
        return;
      }

      const patchRequest = await (await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: inputName.value,
          surname: inputSurname.value,
          lastName: inputLastname.value,
          contacts: parseContacts(),
        }),
      })).json();

      const updDate = new Date(patchRequest.updatedAt);
      button.parentNode.parentNode.children[1].textContent = `${patchRequest.surname} ${patchRequest.name} ${patchRequest.lastName}`;
      button.parentNode.parentNode.children[3].firstChild.textContent = `${updDate.getDay()}.${updDate.getMonth()}.${updDate.getFullYear()}`;
      button.parentNode.parentNode.children[3].lastChild.textContent = `${updDate.getHours()}:${updDate.getMinutes()}`;
      initContacts(button.parentNode.parentNode.children[4], patchRequest);
      deleteModal(modal, button)
    });
  }

  function deleteClient(button, id) {
    [modal, modalWindow, modalWrapper, modalTitle, modalText, confirmBtn, cancelBtn, closeBtn] = createModal(button);

    modalTitle.textContent = 'Delete Client';
    modalText.textContent = 'Are you sure?'
    confirmBtn.textContent = 'Delete';
    cancelBtn.textContent = 'Cancel';
    modalTitle.classList.add('center');
    modalText.classList.add('center');

    modalWrapper.append(modalTitle);
    modalWrapper.append(modalText);
    modalWrapper.append(confirmBtn);
    modalWrapper.append(cancelBtn);
    modalWrapper.append(closeBtn);
    modalWindow.append(modalWrapper);
    modal.append(modalWindow);
    document.body.append(modal);

    closeBtn.addEventListener('click', () => deleteModal(modal, button));
    cancelBtn.addEventListener('click', () => deleteModal(modal, button));
    confirmBtn.addEventListener('click', async () => {
      const client = button.parentNode.parentNode;
      await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'DELETE',
      });
      client.remove();
      for (const modal of document.querySelectorAll('.modal')) deleteModal(modal, button);
    });
  }
})();
