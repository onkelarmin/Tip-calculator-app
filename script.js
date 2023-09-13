const form = document.querySelector('.tip-form')

const tipFormGroup = form.querySelector('.form-group-tip')

const billInput = form.querySelector('#bill')
const peopleInput = form.querySelector('#people')

const customTipInput = form.querySelector('#tip')
const TipError = form.querySelector('.error--tip')

const allErrs = form.querySelectorAll('.error')
const allInputs = form.querySelectorAll('input')
const allTipButtons = tipFormGroup.querySelectorAll('button')
const allTipElements = [...allTipButtons, customTipInput]

const tipResult = document.querySelector('#tip-per-person')
const totalResult = document.querySelector('#total-per-person')

const resetButton = document.querySelector('#reset')

const bill = {
  isValid: false,
  value: '',
}

const people = {
  isValid: false,
  value: '',
}

const tip = {
  isValid: false,
  value: '',
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  initForm()

  validateBillInput()
  validatePeopleInput()
  validateTipInput()

  if (bill.isValid && people.isValid && tip.isValid) {
    const tipPerPerson = (bill.value * (tip.value / 100)) / people.value
    const totalPerPerson = bill.value / people.value + tipPerPerson

    tipResult.innerText = formatNum(tipPerPerson)
    totalResult.innerText = formatNum(totalPerPerson)

    resetButton.removeAttribute('disabled')
  }
})

tipFormGroup.addEventListener('click', (e) => {
  if (e.target.matches('button')) {
    const clickedButton = e.target

    allTipButtons.forEach((button) => {
      button.classList.remove('selected')
    })
    customTipInput.classList.remove('selected')

    clickedButton.classList.add('selected')
  } else if (e.target.matches('#tip')) {
    allTipButtons.forEach((button) => {
      button.classList.remove('selected')
    })
    customTipInput.classList.add('selected')
  }
})

resetButton.addEventListener('click', () => {
  tipResult.innerText = formatNum(0)
  totalResult.innerText = formatNum(0)

  resetButton.setAttribute('disabled', 'true')

  allInputs.forEach((input) => {
    input.value = ''
  })

  allTipElements.forEach((el) => {
    el.classList.remove('selected')
  })
})

function validateBillInput() {
  const input = billInput.value
  const pattern = /^\d+\.?\d{0,2}$/

  if (!pattern.test(input)) {
    invalidateInput('bill', 'Please enter a valid amount')
    bill.isValid = false
  } else if (parseFloat(input) === 0) {
    invalidateInput('bill', 'Can’t be zero')
    bill.isValid = false
  } else {
    bill.isValid = true
    bill.value = parseFloat(input)
  }
}

function validatePeopleInput() {
  const input = peopleInput.value
  const pattern = /^\d+$/

  if (!pattern.test(input)) {
    invalidateInput('people', 'Please enter a valid number')
    people.isValid = false
  } else if (parseFloat(input) === 0) {
    invalidateInput('people', 'Can’t be zero')
    people.isValid = false
  } else {
    people.isValid = true
    people.value = parseFloat(input)
  }
}

function validateTipInput() {
  const [selectedElement] = allTipElements.filter((el) =>
    el.classList.contains('selected')
  )

  if (!selectedElement) {
    TipError.innerText = 'Please select a tip'
    TipError.classList.remove('hidden')
    tip.isValid = false
  } else if (selectedElement === customTipInput) {
    validateCustomTip()
  } else {
    tip.isValid = true
    tip.value = parseFloat(selectedElement.dataset.value)
  }
}

function validateCustomTip() {
  const input = customTipInput.value
  pattern = /^\d+\.?\d*$/

  if (!pattern.test(input)) {
    invalidateInput('tip', 'Please enter a valid percentage')
    tip.isValid = false
  } else if (parseFloat(input) === 0) {
    invalidateInput('tip', 'Can’t be zero')
    tip.isValid = false
  } else {
    tip.isValid = true
    tip.value = parseFloat(input)
  }
}

// Helper functions

function initForm() {
  allErrs.forEach((err) => {
    err.innerText = ''
    err.classList.add('hidden')
  })
  allInputs.forEach((input) => {
    input.classList.remove('invalid')
  })
}

function invalidateInput(input, errMsg) {
  const inputEl = form.querySelector(`#${input}`)
  const errorEl = form.querySelector(`.error--${input}`)

  errorEl.innerText = errMsg
  errorEl.classList.remove('hidden')
  inputEl.classList.add('invalid')
}

function formatNum(num) {
  const options = {
    style: 'currency',
    currency: 'USD',
  }
  return new Intl.NumberFormat('en-US', options).format(num)
}
