'use strict';

// Pages

const mainPage = document.querySelector('.main-page');
const firstPage = document.querySelector('.first-page');
const secondPage = document.querySelector('.second-page');
const thirdPage = document.querySelector('.third-page');
const fourthPage = document.querySelector('.fourth-page');

// Logo

const logoContainer = document.querySelector('.logo-container-main');

// Buttons

const buttons = document.querySelectorAll('button');

const startSurveyBtn = document.querySelector('.start-btn');

const firstPageBtn = document.querySelector('.first-page-btn');

const secondPageBtn = document.querySelector('.second-page-btn');
const previousSecondBtn = document.querySelector('.previous-second-btn');

const submitSurveyBtn = document.querySelector('.submit-survey-btn');
const previousThirdBtn = document.querySelector('.previous-third-btn');

const homeBtn = document.querySelector('.home-btn');

// ButtonsTextContent

const nextStepTextContent = 'next step';
const savingTextContent = 'saving...';

const submitDataTextContent = 'submit data';
const generatingTextContent = 'generating pdf...';

const homeTextContent = 'home';
const savePdfTextContent = 'home';

// Delays

const delaySaving = 1000;
const delayGenerating = 3000;

// Tooltips

const tooltipsOfFirstPage = firstPage.querySelectorAll('.tooltip');
const tooltipsOfSecondPage = secondPage.querySelectorAll('.tooltip');
const tooltipsOfThirdPage = thirdPage.querySelectorAll('.tooltip');

// Inputs

const inputsOfFirstPage = firstPage.querySelectorAll('.input-input');
const inputsOfSecondPage = secondPage.querySelectorAll('.input-input');
const inputsOfThirdPage = thirdPage.querySelectorAll('.input-input');

// dataOfAnswers

const mapFirstStepData = new Map();
const mapSecondStepData = new Map();
const mapThirdStepData = new Map();

const steps = document.querySelectorAll('.step');
const stepDots = document.querySelectorAll('.dot');

// Application

function startSurvey() {
  validationInputText(inputsOfFirstPage, tooltipsOfFirstPage);
  validationInputText(inputsOfSecondPage, tooltipsOfSecondPage);
  validationInputText(inputsOfThirdPage, tooltipsOfThirdPage);

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.classList.contains('start-btn')) {
        mainPage.classList.add('none');

        logoContainer.classList.remove('none');
        firstPage.classList.remove('none');
      }

      if (button.classList.contains('first-page-btn')) {
        validationInputs(
          inputsOfFirstPage,
          firstPageBtn,
          firstPage,
          secondPage,
          tooltipsOfFirstPage,
          mapFirstStepData
        );
      }

      if (button.classList.contains('previous-second-btn')) {
        firstPage.classList.remove('none');

        const stepDot = document.querySelector('.dot-container');

        stepDot.classList.remove('center');

        secondPage.classList.add('none');
      }

      if (button.classList.contains('second-page-btn')) {
        validationInputs(
          inputsOfSecondPage,
          secondPageBtn,
          secondPage,
          thirdPage,
          tooltipsOfSecondPage,
          mapSecondStepData,
          previousSecondBtn
        );
      }

      if (button.classList.contains('previous-third-btn')) {
        thirdPage.classList.add('none');

        const stepDot = document.querySelector('.dot-container');

        stepDot.classList.remove('finish');

        secondPage.classList.remove('none');
      }

      if (button.classList.contains('submit-survey-btn')) {
        validationInputs(
          inputsOfThirdPage,
          submitSurveyBtn,
          thirdPage,
          fourthPage,
          tooltipsOfThirdPage,
          mapThirdStepData,
          previousThirdBtn
        );
      }

      if (button.classList.contains('home-btn')) {
        const stepDot = document.querySelector('.dot-container');
        stepDot.classList.remove('center', 'finish');

        let arrD = [
          ...mapFirstStepData,
          ...mapSecondStepData,
          ...mapThirdStepData,
        ];

        for (let i = 0; i < arrD.length; i++) {
          const space = /\s/;
          let indexOfSpace;

          for (let k = 0; k < arrD[i].length; k++) {
            if (k === 0) {
              indexOfSpace = arrD[i][k].search(space);

              arrD[i][k].slice(indexOfSpace);
              arrD[i][k] = arrD[i][k].slice(0, indexOfSpace);
            }
          }
        }

        const data = Object.fromEntries(arrD);

        console.log(data);

        clearInputsData();

        fourthPage.classList.add('none');
        logoContainer.classList.add('none');
        mainPage.classList.remove('none');
      }
    });
  });
}

function validationInputText(pageInputs, tooltips) {
  pageInputs.forEach((el, index) => {
    el.addEventListener('input', () => {
      const inputValue = el.value;

      if (inputValue !== '') {
        if (tooltips[index].classList.contains('required')) {
          tooltips[index].classList.remove('required');
        }

        tooltips[index].classList.add('opacity');
      } else {
        tooltips[index].classList.remove('opacity');
      }
    });
  });
}

function activeStep() {
  const stepDot = document.querySelector('.dot');
  const stepDotContainer = document.querySelector('.dot-container');

  const steps = document.querySelectorAll('.step');
  const styles = ['zero', 'center', 'full'];

  for (let i = 0; i < steps.length; i++) {
    if (!steps[i].classList.contains('none')) {
      stepDot.classList.add(styles[i]);
      stepDotContainer.classList.add(styles[i]);
    }
  }
}

function validationInputs(
  pageInputs,
  pageNextStepBtn,
  currentPage,
  nextPage,
  tooltips,
  dataOfAnswers,
  previousStepBtn
) {
  pageInputs.forEach((el, index) => {
    if (el.value === '') {
      tooltips[index].classList.add('opacity', 'required');

      return;
    } else if (el.value !== '') {
      dataOfAnswers.set(
        tooltips[index].textContent,
        el.value.trim().toUpperCase()
      );

      if (currentPage === firstPage) {
        dataOfAnswers.set(
          '7. Beschikt u over een rijbewijs? *',
          document.querySelector('[name="select"]:checked').value
        );
      }

      tooltips[index].classList.remove('opacity');

      if ((el.value !== '') & (dataOfAnswers.size === pageInputs.length)) {
        setTimeout(() => {
          if (previousStepBtn) {
            previousStepBtn.disabled = false;
          }

          const stepDot = document.querySelector('.dot-container');

          if (pageNextStepBtn === firstPageBtn) {
            stepDot.classList.add('center');
          } else if (pageNextStepBtn === secondPageBtn) {
            stepDot.classList.add('finish');
          }

          pageNextStepBtn.textContent = nextStepTextContent;
          pageNextStepBtn.disabled = false;

          currentPage.classList.add('none');

          nextPage.classList.remove('none');
        }, delaySaving);

        if (previousStepBtn) {
          previousStepBtn.disabled = true;
        }

        if (pageNextStepBtn === submitSurveyBtn) {
          pageNextStepBtn.textContent = generatingTextContent;
        } else {
          pageNextStepBtn.textContent = submitDataTextContent;
        }

        pageNextStepBtn.disabled = true;
      }
    }
  });
}

function deleteNonLatin(text) {
  return text.replace(/[^A-Za-z]/gi, '');
}

const inputs = document.querySelectorAll('.text');

inputs.forEach((input) => {
  input.addEventListener('input', (e) => {
    const cleanValue = deleteNonLatin(e.target.value);
    e.target.value = cleanValue;
  });
});

function startPositionOfStepDots() {
  const stepDot = document.querySelector('.dot');
  const stepDotContainer = document.querySelector('.dot-container');

  stepDot.classList.remove('full');
  stepDotContainer.classList.remove('full');

  stepDot.classList.remove('center');
  stepDotContainer.classList.remove('center');
}

function clearInputsData() {
  document.querySelectorAll('.input-input').forEach((input) => {
    input.value = '';
  });
}

function masksOfInputs() {
  const dateInputs = document.querySelectorAll('#date');
  const dateOfBirth = document.querySelector('#yearOfBirth');
  const phone = document.querySelector('#phone');

  dateInputs.forEach((input) => {
    input.addEventListener('keyup', () => {
      if (input.value.length === 2) {
        input.value += '.';
        input.textContent = input.value;
      }
    });
  });

  dateOfBirth.addEventListener('keyup', () => {
    if (dateOfBirth.value.length === 2) {
      dateOfBirth.value += '.';
      dateOfBirth.textContent = dateOfBirth.value;
    } else if (dateOfBirth.value.length === 5) {
      dateOfBirth.value += '.';
      dateOfBirth.textContent = dateOfBirth.value;
    }
  });

  phone.addEventListener('keyup', () => {
    if (phone.value.length === 1) {
      phone.value = '+ ';
      phone.textContent = phone.value;
    } else if (phone.value.length === 4) {
      phone.value += ' ';
      phone.textContent = phone.value;
    } else if (phone.value.length === 5) {
      phone.value += ' ';
      phone.textContent = phone.value;
    } else if (phone.value.length === 8) {
      phone.value += ' ';
      phone.textContent = phone.value;
    } else if (phone.value.length === 13) {
      phone.value += ' ';
      phone.textContent = phone.value;
    }
  });
}

window.addEventListener('load', () => {
  startSurvey();
  masksOfInputs();
});
