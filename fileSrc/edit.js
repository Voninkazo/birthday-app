import { displayPeople } from './displayList'
import { destroyPopup } from './utils'
import { updateLocalStorage } from './localStorage'
import { iconClose } from './svgs'
import { showScroll } from './utils'

import wait from 'waait'

// edit person data
export async function editPeople(id, myPeople) {
  const person = myPeople.find((person) => person.id === id)
  const result = await editPeoplePopup(person)
  if (result) {
    displayPeople(myPeople)
    updateLocalStorage(myPeople)
  }
}

// show popup and edit data
export async function editPeoplePopup(person) {
  return new Promise(async (resolve) => {
    const popup = document.createElement('div')
    popup.classList.add('popup')

    // popup edit= form
    const html = `
                <div class="content">
                <div class="close_icon__container">
                    <button type="button" class="cancel"> 
                        ${iconClose}
                    </button>
                </div>
                <form>
                    <h3 class="reminder-par">${
                      person.birthday
                        ? `Edit ${person.firstName + ' ' + person.lastName}`
                        : 'Add somebody new'
                    }</h3>
                    <fieldset>
                        <label for="lastName">Lastname</label>
                        <input type="text" name="lastName" id="lastname" value="${
                          person.lastName ? `${person.lastName}` : ''
                        }" required>
                        <label for="firstName">Firstname</label>
                        <input type="text" name="firstName" id="firstname" value="${
                          person.firstName ? person.firstName : ''
                        }" required>
                        <label for="birthday">Birthday</label>
                        <input type="date" name="birthday" id="birthday" value="${
                          person.birthday
                            ? new Date(person.birthday)
                                .toISOString()
                                .substring(0, 10)
                            : ''
                        }" max=${new Date()
      .toISOString()
      .substring(0, 10)} required>
                        
                        <label for="image">Image</label>
                        <input type="url" name="image" id="img" value="${
                          person.picture ? `${person.picture}` : ''
                        }" alt="photo" required>
                        
                    </fieldset> 
                    <div class="btn_container">
                            <button type="submit" class="submit">Submit</button>
                            <button type="button" class="cancel">Cancel</button>
                    </div>
                </form>
                </div>
        `

    popup.insertAdjacentHTML('afterbegin', html)
    const cancelButton = Array.from(popup.querySelectorAll('.cancel'))

    cancelButton.forEach((button) =>
      button.addEventListener(
        'click',
        () => {
          resolve(null)
          destroyPopup(popup)
          showScroll()
        },
        { once: true }
      )
    )
    const form = popup.querySelector('form')
    form.addEventListener(
      'submit',
      (e) => {
        e.preventDefault()

        // popup.input.value;
        person.firstName = e.target.firstName.value
        person.lastName = e.target.lastName.value
        // use this date conversion to get a timestamp back (just like the birthday inside people.json)
        person.birthday = new Date(e.target.birthday.value).getTime()
        resolve(person)
        destroyPopup(popup)
        showScroll()
      },
      { once: true }
    )
    document.body.appendChild(popup)
    await wait(10)
    popup.classList.add('open')
  })
}
